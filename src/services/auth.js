import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, signInAnonymously,
  GoogleAuthProvider, signInWithPopup, updateProfile, sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

const googleProvider = new GoogleAuthProvider()

export async function registerPhotographer(email, password, profileData) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const user = cred.user
  await updateProfile(user, { displayName: profileData.businessName || `${profileData.firstName} ${profileData.lastName}` })
  await setDoc(doc(db, 'photographers', user.uid), {
    uid: user.uid, email, ...profileData,
    role: 'photographer', tier: 'free', quizCompleted: false, quizAnswers: {},
    profileComplete: false, published: false,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  })
  await setDoc(doc(db, 'users', user.uid), { uid: user.uid, email, role: 'photographer', createdAt: serverTimestamp() })
  return user
}

export async function registerCouple(email, password, name) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (name) await updateProfile(cred.user, { displayName: name })
  await setDoc(doc(db, 'users', cred.user.uid), { uid: cred.user.uid, email, displayName: name || '', role: 'couple', createdAt: serverTimestamp() })
  return cred.user
}

export async function signInAsGuest() { return (await signInAnonymously(auth)).user }
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  const userDoc = await getDoc(doc(db, 'users', result.user.uid))
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', result.user.uid), { uid: result.user.uid, email: result.user.email, displayName: result.user.displayName || '', role: 'couple', createdAt: serverTimestamp() })
  }
  return result.user
}

export async function login(email, password) { return (await signInWithEmailAndPassword(auth, email, password)).user }
export async function logout() { await signOut(auth) }
export async function resetPassword(email) { await sendPasswordResetEmail(auth, email) }
export async function getUserRole(uid) { const d = await getDoc(doc(db, 'users', uid)); return d.exists() ? d.data().role : null }
export function onAuth(callback) { return onAuthStateChanged(auth, callback) }
