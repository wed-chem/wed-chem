import { doc, setDoc, getDoc, getDocs, updateDoc, query, collection, where, orderBy, limit, startAfter, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'

export async function getPhotographer(uid) { const s = await getDoc(doc(db, 'photographers', uid)); return s.exists() ? { id: s.id, ...s.data() } : null }
export async function updatePhotographer(uid, data) { await updateDoc(doc(db, 'photographers', uid), { ...data, updatedAt: serverTimestamp() }) }
export async function savePhotographerQuiz(uid, answers) { await updateDoc(doc(db, 'photographers', uid), { quizAnswers: answers, quizCompleted: true, updatedAt: serverTimestamp() }) }
export async function updateStyleTags(uid, styles, specialties) { await updateDoc(doc(db, 'photographers', uid), { styles, specialties, updatedAt: serverTimestamp() }) }
export async function publishProfile(uid) { await updateDoc(doc(db, 'photographers', uid), { status: 'pending', published: false, profileComplete: true, submittedAt: serverTimestamp(), updatedAt: serverTimestamp() }) }

export async function uploadCoverPhoto(uid, file) {
  const r = ref(storage, `photographers/${uid}/cover/${file.name}`)
  const s = await uploadBytes(r, file)
  const url = await getDownloadURL(s.ref)
  await updateDoc(doc(db, 'photographers', uid), { coverPhoto: url, updatedAt: serverTimestamp() })
  return url
}

export async function uploadPortfolioPhoto(uid, file, index) {
  const r = ref(storage, `photographers/${uid}/portfolio/${index}_${file.name}`)
  const s = await uploadBytes(r, file)
  return await getDownloadURL(s.ref)
}

export async function savePortfolio(uid, urls) { await updateDoc(doc(db, 'photographers', uid), { portfolio: urls, updatedAt: serverTimestamp() }) }

export async function browsePhotographers({ lastDoc, pageSize = 12 } = {}) {
  let q = query(collection(db, 'photographers'), where('published', '==', true), orderBy('tier', 'desc'), orderBy('publishedAt', 'desc'), limit(pageSize))
  if (lastDoc) q = query(q, startAfter(lastDoc))
  const snap = await getDocs(q)
  const list = []; snap.forEach(d => list.push({ id: d.id, ...d.data() }))
  return { photographers: list, lastDoc: snap.docs[snap.docs.length - 1] || null }
}

export async function getFeaturedPhotographers(count = 6) {
  const q = query(collection(db, 'photographers'), where('published', '==', true), orderBy('tier', 'desc'), limit(count))
  const snap = await getDocs(q); const list = []; snap.forEach(d => list.push({ id: d.id, ...d.data() })); return list
}

export async function upgradeTier(uid, tier) { await updateDoc(doc(db, 'photographers', uid), { tier, tierUpdatedAt: serverTimestamp(), updatedAt: serverTimestamp() }) }
