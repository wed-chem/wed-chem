import { calculateDistance } from "./geocoding"
import { db } from './firebase'
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore'

export function calculateMatchScore(coupleAnswers, photographerAnswers) {
  let overlap = 0
  const total = 25
  for (let i = 0; i < total; i++) {
    if (coupleAnswers[i] && photographerAnswers[i] && coupleAnswers[i] === photographerAnswers[i]) {
      overlap++
    }
  }
  return Math.round((overlap / total) * 100)
}

export async function getMatches(photoAnswers, manualAnswers) {
  try {
    const q = query(
      collection(db, 'photographers'),
      where('published', '==', true),
      where('quizCompleted', '==', true)
    )
    const snap = await getDocs(q)
    const results = []

    snap.forEach(docSnap => {
      const p = { id: docSnap.id, ...docSnap.data() }
      const styleScore = calculateMatchScore(photoAnswers, p.quizAnswers || {})

      let bonus = 0

      // Location matching with real distance calculation
      if (manualAnswers.location) {
        const coupleLat = manualAnswers.location.lat
        const coupleLng = manualAnswers.location.lng
        const pLat = p.lat
        const pLng = p.lng
        const radius = p.travelRadius || '150'

        if (radius === 'anywhere') {
          bonus += 3 // worldwide photographers always relevant
        } else if (radius === 'nationwide') {
          const coupleCountry = (manualAnswers.location.country || '').toLowerCase().trim()
          const pCountry = (p.country || '').toLowerCase().trim()
          if (coupleCountry === pCountry) bonus += 4
        } else if (coupleLat && coupleLng && pLat && pLng) {
          // Calculate actual distance
          const dist = calculateDistance(coupleLat, coupleLng, pLat, pLng)
          const maxMiles = parseInt(radius) || 150

          if (dist <= maxMiles) {
            bonus += 5 // within travel radius
            if (dist <= 50) bonus += 2 // extra bonus for very close
          }
        } else {
          // Fallback to text matching if no coordinates
          const coupleCountry = (manualAnswers.location.country || '').toLowerCase().trim()
          const coupleState = (manualAnswers.location.state || '').toLowerCase().trim()
          const pCountry = (p.country || '').toLowerCase().trim()
          const pState = (p.state || '').toLowerCase().trim()
          if (coupleCountry === pCountry) { bonus += 2; if (coupleState === pState) bonus += 3 }
        }
      }

      // Budget match
      if (manualAnswers.budget && p.priceMin) {
        if (p.priceMin <= manualAnswers.budget) bonus += 3
      }

      // Film preference match
      if (manualAnswers.film && p.styles) {
        const hasFilm = p.styles.some(s => s.toLowerCase().includes('film'))
        if (manualAnswers.film === 'Yes' && hasFilm) bonus += 3
        if (manualAnswers.film === 'Digital only' && !hasFilm) bonus += 2
      }

      // Featured tier bonus
      if (p.tier === 'featured') bonus += 2

      const totalScore = Math.min(99, styleScore + bonus)

      results.push({
        photographer: p,
        styleScore,
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

export async function saveQuizResults(userId, photoAnswers, manualAnswers) {
  try {
    await addDoc(collection(db, 'quizSessions'), {
      userId: userId || null,
      photoAnswers,
      manualAnswers,
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
