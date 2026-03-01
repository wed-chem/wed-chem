<template>
  <div class="auth-page">
    <div class="auth-card">
      <router-link to="/" class="auth-logo">Wed<span>Chem</span></router-link>

      <div v-if="!sent">
        <h1 class="auth-title">Reset your password</h1>
        <p class="auth-sub">Enter your email and we'll send you a reset link</p>

        <div class="auth-error" v-if="error">{{ error }}</div>

        <div class="form-row">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" placeholder="you@email.com" v-model="email" @keyup.enter="handleReset">
        </div>

        <button class="btn-primary auth-btn" @click="handleReset" :disabled="loading">
          {{ loading ? 'Sending...' : 'Send Reset Link →' }}
        </button>
      </div>

      <div v-else class="sent-state">
        <div class="sent-icon">✉️</div>
        <h1 class="auth-title">Check your email</h1>
        <p class="auth-sub">We sent a password reset link to <strong>{{ email }}</strong>. It may take a minute to arrive — check your spam folder too.</p>
        <button class="btn-secondary" @click="sent=false" style="width:100%;justify-content:center;margin-top:16px;">Send again</button>
      </div>

      <div class="auth-footer">
        <router-link to="/login" class="auth-link">← Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const error = ref('')
const loading = ref(false)
const sent = ref(false)

async function handleReset() {
  error.value = ''; loading.value = true
  if (!email.value) { error.value = 'Please enter your email.'; loading.value = false; return }
  try {
    const { resetPassword } = await import('@/services/auth')
    await resetPassword(email.value)
    sent.value = true
  } catch (e) {
    if (e.code === 'auth/user-not-found') error.value = 'No account found with that email.'
    else error.value = 'Something went wrong. Please try again.'
  }
  loading.value = false
}
</script>

<style scoped>
.auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:120px 24px 80px; background:var(--cream); }
.auth-card { max-width:420px; width:100%; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:48px 40px; box-shadow:var(--shadow-md); }
.auth-logo { display:block; text-align:center; font-family:var(--font-display); font-size:1.5rem; font-weight:500; margin-bottom:32px; }
.auth-logo span { color:var(--terracotta); font-style:italic; }
.auth-title { font-family:var(--font-display); font-size:1.8rem; font-weight:400; text-align:center; margin-bottom:4px; }
.auth-sub { text-align:center; color:var(--warm-gray); font-size:0.92rem; margin-bottom:32px; line-height:1.6; }
.auth-error { background:rgba(196,130,106,0.1); border:1px solid rgba(196,130,106,0.3); border-radius:var(--radius); padding:12px 16px; font-size:0.85rem; color:var(--terracotta-dark); margin-bottom:20px; }
.auth-btn { width:100%; justify-content:center; margin-bottom:24px; }
.auth-btn:disabled { opacity:0.6; cursor:not-allowed; }
.auth-footer { text-align:center; font-size:0.85rem; color:var(--warm-gray); padding-top:16px; border-top:1px solid var(--light-gray); }
.auth-link { color:var(--terracotta); font-weight:500; }
.sent-state { text-align:center; }
.sent-icon { font-size:3rem; margin-bottom:16px; }
</style>
