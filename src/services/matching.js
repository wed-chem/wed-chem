import { db } from './firebase'
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { calculateDistance } from './geocoding'

// ═══════════ SCORING ENGINE v2 ═══════════

/**
 * Score a couple against a photographer
 * Max score ~77 points before hard filters
 */
function scoreMatch(coupleAnswers, photographer) {
  let score = 0
  const p = photographer

  // ── Q1: Editing Style Ranking (0-15 pts) ──
  const coupleEditing = coupleAnswers.editingRanking || []
  const photogEditing = p.editingStyles || []
  if (coupleEditing.length && photogEditing.length) {
    // First choice matches photographer's primary = 15
    // First choice matches any of theirs = 10
    // Second choice matches primary = 8
    // Any overlap = 3-5
    const c1 = coupleEditing[0]
    const c2 = coupleEditing[1]
    const p1 = photogEditing[0]

    if (c1 === p1) score += 15
    else if (photogEditing.includes(c1)) score += 10
    else if (c2 === p1) score += 8
    else if (c2 && photogEditing.includes(c2)) score += 5
    // Any other overlap
    else if (coupleEditing.some(c => photogEditing.includes(c))) score += 3
  }

  // ── Q2: Photo Style Ranking (0-12 pts) ──
  const couplePhoto = coupleAnswers.photoStyleRanking || []
  const photogPhoto = p.photoStyles || []
  if (couplePhoto.length && photogPhoto.length) {
    const c1 = couplePhoto[0]
    const p1 = photogPhoto[0]

    if (c1 === p1) score += 12
    else if (photogPhoto.includes(c1)) score += 8
    else if (couplePhoto[1] === p1) score += 6
    else if (couplePhoto.some(c => photogPhoto.includes(c))) score += 3
  }

  // ── Q3: Saturation (0-3 pts) ──
  if (coupleAnswers.saturation && p.saturation) {
    if (coupleAnswers.saturation === p.saturation) score += 3
  }

  // ── Q4-10: A/B Pairs (0-2 pts each, 0-14 total) ──
  const coupleAB = coupleAnswers.abAnswers || {}
  const photogAB = p.abAnswers || {}
  for (const qid of [4, 5, 6, 7, 8, 9, 10]) {
    if (coupleAB[qid] && photogAB[qid] && coupleAB[qid] === photogAB[qid]) {
      score += 2
    }
  }

  // ── Q11: Aerial (0-5 pts) ──
  const wantsAerial = coupleAnswers.features?.aerial
  const hasAerial = p.hasAerial || p.specialties?.includes('Drone / Aerial')
  if (wantsAerial === 'Yes, definitely' && hasAerial) score += 5
  else if (wantsAerial === "No, don't need it") score += 2 // no penalty, small bonus for not caring

  // ── Q12: Film (0-8 pts) ──
  const wantsFilm = coupleAnswers.features?.film
  const hasFilm = p.hasFilm
  if (wantsFilm === 'Yes, I love film' && hasFilm) score += 8
  else if (wantsFilm === 'No, digital is fine' && !hasFilm) score += 4
  else if (wantsFilm === 'Yes, I love film' && !hasFilm) score += 0 // mismatch

  // ── Q13: Second Shooter (0-5 pts) ──
  const wantsSecond = coupleAnswers.features?.secondShooter
  const hasSecond = p.hasSecondShooter
  if (wantsSecond === 'Yes' && hasSecond) score += 5
  else if (wantsSecond === 'No') score += 2
  else if (wantsSecond === "Don't know yet") score += 2

  // ── Q14: Personality (0-10 pts) ──
  const wantedPersonality = coupleAnswers.features?.personality
  const photogPersonality = p.personality || []
  if (wantedPersonality) {
    if (Array.isArray(photogPersonality) && photogPersonality.includes(wantedPersonality)) score += 10
    else if (photogPersonality === wantedPersonality) score += 10
  }

  // ── Q15: Hours (0-5 pts) ──
  const wantedHours = coupleAnswers.features?.hours
  const offeredHours = p.coverageHours || []
  if (wantedHours && offeredHours.length) {
    if (offeredHours.includes(wantedHours)) score += 5
  }

  // ── Featured tier bonus ──
  if (p.tier === 'featured') score += 2

  return score
}

// Max possible = 15+12+3+14+5+8+5+10+5+2 = 79
const MAX_SCORE = 79

export function calculateMatchScore(coupleAnswers, photographer) {
  const raw = scoreMatch(coupleAnswers, photographer)
  return Math.min(99, Math.round((raw / MAX_SCORE) * 100))
}

export async function getMatches(quizAnswers) {
  try {
    const q = query(
      collection(db, 'photographers'),
      where('published', '==', true),
      where('status', '==', 'approved')
    )
    const snap = await getDocs(q)
    const results = []

    snap.forEach(docSnap => {
      const p = { id: docSnap.id, ...docSnap.data() }

      // ── HARD FILTERS (pass/fail) ──

      // Budget filter
      if (quizAnswers.manual?.budget && p.priceMin) {
        if (p.priceMin > quizAnswers.manual.budget * 1.3) return // allow 30% over as soft buffer
      }

      // Geography filter
      let geoPass = true
      let geoBonus = 0
      if (quizAnswers.manual?.location) {
        const loc = quizAnswers.manual.location
        const radius = p.travelRadius || '150'

        if (radius === 'anywhere') {
          geoBonus = 3
        } else if (radius === 'nationwide') {
          const coupleCountry = (loc.country || '').toLowerCase().trim()
          const pCountry = (p.country || '').toLowerCase().trim()
          if (coupleCountry === pCountry) geoBonus = 4
          else geoPass = false
        } else if (loc.lat && loc.lng && p.lat && p.lng) {
          const dist = calculateDistance(loc.lat, loc.lng, p.lat, p.lng)
          const maxMiles = parseInt(radius) || 150
          if (dist <= maxMiles) {
            geoBonus = 5
            if (dist <= 50) geoBonus = 7
          } else {
            geoPass = false
          }
        } else {
          // Fallback text matching
          const coupleCountry = (loc.country || '').toLowerCase()
          const pCountry = (p.country || '').toLowerCase()
          if (coupleCountry === pCountry) geoBonus = 2
        }
      }

      if (!geoPass) return // filtered out by geography

      // ── SCORING ──
      const styleScore = calculateMatchScore(quizAnswers, p)
      const totalScore = Math.min(99, styleScore + geoBonus)

      results.push({
        photographer: p,
        styleScore,
        geoBonus,
        totalScore,
        isFeatured: p.tier === 'featured'
      })
    })

    results.sort((a, b) => b.totalScore - a.totalScore)
    return results.slice(0, 20)
  } catch (e) {
    console.error('Error fetching matches:', e)
    return []
  }
}

export async function saveQuizResults(userId, quizAnswers) {
  try {
    await addDoc(collection(db, 'quizSessions'), {
      userId: userId || null,
      ...quizAnswers,
      completedAt: serverTimestamp()
    })
  } catch (e) {
    console.error('Error saving quiz results:', e)
  }
}

export async function sendInquiry({ photographerId, name, email, weddingDate, message, matchScore }) {
  try {
    await addDoc(collection(db, 'inquiries'), {
      photographerId,
      coupleName: name,
      coupleEmail: email,
      weddingDate: weddingDate || null,
      message,
      matchScore: matchScore || null,
      status: 'new',
      createdAt: serverTimestamp()
    })
  } catch (e) {
    console.error('Error sending inquiry:', e)
    throw e
  }
}

export async function getInquiries(photographerId) {
  try {
    const q = query(
      collection(db, 'inquiries'),
      where('photographerId', '==', photographerId)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error('Error fetching inquiries:', e)
    return []
  }
}
