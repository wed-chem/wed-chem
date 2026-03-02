<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="auth-logo">Wed<span>Chem</span></router-link>
      <h1 class="auth-title">Create your account</h1>
      <p class="auth-sub">Save your matches and connect with photographers</p>

      <div class="auth-error" v-if="error">{{ error }}</div>

      <div class="form-row"><label class="form-label">Your Name(s)</label><input type="text" class="form-input" placeholder="Jane & John" v-model="name"></div>
      <div class="form-row"><label class="form-label">Email</label><input type="email" class="form-input" placeholder="you@email.com" v-model="email"></div>
      <div class="form-row"><label class="form-label">Password</label><input type="password" class="form-input" placeholder="8+ characters" v-model="password"></div>

      <button class="btn-primary auth-btn" @click="handleSignup" :disabled="loading">{{ loading ? 'Creating...' : 'Create Account →' }}</button>

      <button class="auth-google" @click="handleGoogle">
        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Sign up with Google
      </button>

      <div class="auth-footer">
        Already have an account? <router-link to="/login" class="auth-link">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const name = ref(''); const email = ref(''); const password = ref('')
const error = ref(''); const loading = ref(false)

async function handleSignup() {
  error.value=''; loading.value=true
  try {
    const { registerCouple } = await import('@/services/auth')
    const user = await registerCouple(email.value, password.value, name.value)
    
    // Save quiz results if coming from quiz
    const quizStore = useQuizStore()
    if (quizStore.completed && quizStore.matches.length > 0) {
      try {
        const { saveQuizResults } = await import('@/services/matching')
        await saveQuizResults(user.uid, quizStore.getAllAnswers(), quizStore.matches)
      } catch(e) { console.warn('Could not save quiz results:', e) }
    }
    
    const authStore = useAuthStore()
    authStore.role = 'couple'
    router.push(route.query.redirect || '/')
  } catch(e) { error.value = e.code==='auth/email-already-in-use' ? 'Email already registered.' : 'Something went wrong.' }
  loading.value=false
}

async function handleGoogle() {
  try {
    const { signInWithGoogle } = await import('@/services/auth')
    const user = await signInWithGoogle()
    
    const quizStore = useQuizStore()
    if (quizStore.completed && quizStore.matches.length > 0) {
      try {
        const { saveQuizResults } = await import('@/services/matching')
        await saveQuizResults(user.uid, quizStore.getAllAnswers(), quizStore.matches)
      } catch(e) { console.warn('Could not save quiz results:', e) }
    }
    
    router.push(route.query.redirect || '/')
  } catch(e) { error.value='Google sign-up failed.' }
}
</script>

<style scoped>
.auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:120px 24px 80px; background:var(--cream); }
.auth-card { max-width:420px; width:100%; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:48px 40px; box-shadow:var(--shadow-md); }
.auth-logo { display:block; text-align:center; font-family:var(--font-display); font-size:1.5rem; font-weight:500; margin-bottom:32px; }
.auth-logo span { color:var(--terracotta); font-style:italic; }
.auth-title { font-family:var(--font-display); font-size:1.8rem; font-weight:400; text-align:center; margin-bottom:4px; }
.auth-sub { text-align:center; color:var(--warm-gray); font-size:0.92rem; margin-bottom:32px; }
.auth-error { background:rgba(196,130,106,0.1); border:1px solid rgba(196,130,106,0.3); border-radius:var(--radius); padding:12px 16px; font-size:0.85rem; color:var(--terracotta-dark); margin-bottom:20px; }
.auth-btn { width:100%; justify-content:center; margin-bottom:12px; }
.auth-btn:disabled { opacity:0.6; cursor:not-allowed; }
.auth-google { width:100%; display:flex; align-items:center; justify-content:center; gap:12px; padding:14px; border:1.5px solid var(--light-gray); border-radius:100px; font-size:0.88rem; font-weight:500; color:var(--charcoal); transition:var(--transition); margin-bottom:24px; }
.auth-google:hover { border-color:var(--charcoal); }
.auth-footer { text-align:center; font-size:0.85rem; color:var(--warm-gray); }
.auth-link { color:var(--terracotta); font-weight:500; }
</style>
