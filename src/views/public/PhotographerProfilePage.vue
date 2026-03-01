<template>
  <div class="profile-page">
    <div class="container" v-if="loading" style="text-align:center;padding:200px 0;">
      <div style="font-size:1.2rem;color:var(--warm-gray);">Loading profile...</div>
    </div>

    <div class="container" v-else-if="!photographer">
      <div style="text-align:center;padding:200px 0;">
        <h2 style="font-family:var(--font-display);margin-bottom:12px;">Photographer not found</h2>
        <p style="color:var(--warm-gray);margin-bottom:24px;">This profile doesn't exist or hasn't been published yet.</p>
        <router-link to="/directory" class="btn-primary">Browse Photographers →</router-link>
      </div>
    </div>

    <div class="container" v-else>

      <!-- HERO -->
      <div class="profile-hero">
        <div class="profile-cover">
          <img v-if="photographer.coverPhoto" :src="photographer.coverPhoto" :alt="photographer.businessName" class="cover-img">
          <div v-else class="cover-gradient"></div>
          <div class="cover-fade"></div>
        </div>
        <div class="hero-content">
          <div class="profile-avatar" :style="{backgroundImage: photographer.avatar ? `url(${photographer.avatar})` : ''}">
            <span v-if="!photographer.avatar">{{ initials }}</span>
          </div>
          <div class="hero-info">
            <div class="profile-badges">
              <span class="badge-featured" v-if="photographer.tier === 'featured'">⭐ Featured</span>
              <span class="badge-verified" v-if="photographer.status === 'approved'">✓ Verified</span>
            </div>
            <h1 class="profile-name">{{ photographer.businessName }}</h1>
            <div class="profile-location">{{ photographer.city }}<span v-if="photographer.state">, {{ photographer.state }}</span><span v-if="photographer.country"> · {{ photographer.country }}</span></div>
            <div class="profile-tagline" v-if="photographer.tagline">{{ photographer.tagline }}</div>
          </div>
          <div class="hero-actions">
            <button class="btn-primary" @click="handleInquiryClick">Get in Touch →</button>
            <button class="btn-secondary btn-sm" @click="saved = !saved">{{ saved ? '♥ Saved' : '♡ Save' }}</button>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="profile-layout">
        <!-- LEFT COLUMN -->
        <div class="profile-main">

          <!-- PORTFOLIO -->
          <section class="profile-section" v-if="portfolio.length">
            <h2 class="ps-title">Portfolio</h2>
            <div class="portfolio-grid">
              <div class="portfolio-item" v-for="(photo, i) in portfolio" :key="i" @click="openLightbox(i)">
                <img :src="photo" :alt="'Portfolio ' + (i+1)" class="portfolio-img">
              </div>
            </div>
          </section>

          <!-- ABOUT -->
          <section class="profile-section" v-if="photographer.about">
            <h2 class="ps-title">About</h2>
            <div class="about-text">{{ photographer.about }}</div>
          </section>

          <!-- STYLE TAGS -->
          <section class="profile-section" v-if="photographer.styles && photographer.styles.length">
            <h2 class="ps-title">Style</h2>
            <div class="profile-tags">
              <span class="profile-tag" v-for="s in photographer.styles" :key="s">{{ s }}</span>
            </div>
          </section>

          <!-- SPECIALTIES -->
          <section class="profile-section" v-if="photographer.specialties && photographer.specialties.length">
            <h2 class="ps-title">Specialties</h2>
            <div class="profile-tags">
              <span class="profile-tag tag-alt" v-for="s in photographer.specialties" :key="s">{{ s }}</span>
            </div>
          </section>

        </div>

        <!-- RIGHT SIDEBAR -->
        <div class="profile-sidebar">

          <div class="sidebar-card">
            <h3 class="sc-title">Quick Info</h3>
            <div class="sc-row" v-if="priceDisplay">
              <div class="sc-label">Starting at</div>
              <div class="sc-value">{{ priceDisplay }}</div>
            </div>
            <div class="sc-row" v-if="photographer.yearsExperience">
              <div class="sc-label">Experience</div>
              <div class="sc-value">{{ photographer.yearsExperience }}</div>
            </div>
            <div class="sc-row" v-if="photographer.turnaround">
              <div class="sc-label">Turnaround</div>
              <div class="sc-value">{{ photographer.turnaround }}</div>
            </div>
            <div class="sc-row" v-if="photographer.travelRadius">
              <div class="sc-label">Travel</div>
              <div class="sc-value">{{ travelDisplay }}</div>
            </div>
            <div class="sc-row" v-if="photographer.coverageHours && photographer.coverageHours.length">
              <div class="sc-label">Coverage</div>
              <div class="sc-value">{{ photographer.coverageHours.join(', ') }}</div>
            </div>
            <button class="btn-primary" style="width:100%;justify-content:center;margin-top:20px;" @click="handleInquiryClick">Get in Touch →</button>
          </div>

          <div class="sidebar-card" v-if="photographer.basePackage">
            <h3 class="sc-title">Base Package Includes</h3>
            <div class="package-text">{{ photographer.basePackage }}</div>
          </div>

          <div class="sidebar-card" v-if="photographer.addOns && photographer.addOns.length">
            <h3 class="sc-title">Add-Ons Available</h3>
            <div class="profile-tags">
              <span class="profile-tag tag-sm" v-for="a in photographer.addOns" :key="a">{{ a }}</span>
            </div>
          </div>

          <div class="sidebar-card" v-if="photographer.website || photographer.instagram || photographer.tiktok">
            <h3 class="sc-title">Connect</h3>
            <div class="social-links">
              <a v-if="photographer.website" :href="photographer.website" target="_blank" class="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Website
              </a>
              <a v-if="photographer.instagram" :href="'https://instagram.com/' + photographer.instagram.replace('@','')" target="_blank" class="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                {{ photographer.instagram }}
              </a>
              <a v-if="photographer.tiktok" :href="'https://tiktok.com/@' + photographer.tiktok.replace('@','')" target="_blank" class="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                {{ photographer.tiktok }}
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- INQUIRY MODAL -->
      <div class="modal-overlay" v-if="showInquiry" @click.self="showInquiry = false">
        <div class="modal-card">
          <button class="modal-close" @click="showInquiry = false">✕</button>
          <h3 class="modal-title">Get in touch with {{ photographer.businessName }}</h3>
          <p class="modal-sub">They'll typically respond within 24–48 hours</p>
          <div class="form-row"><label class="form-label">Your Name</label><input type="text" class="form-input" placeholder="Jane & John" v-model="inquiry.name"></div>
          <div class="form-row"><label class="form-label">Email</label><input type="email" class="form-input" placeholder="you@email.com" v-model="inquiry.email"></div>
          <div class="form-row"><label class="form-label">Wedding Date</label><input type="date" class="form-input" v-model="inquiry.date"></div>
          <div class="form-row"><label class="form-label">Message</label><textarea class="form-input" style="min-height:120px;resize:vertical;" placeholder="Tell them about your wedding — venue, vibe, what you're looking for..." v-model="inquiry.message"></textarea></div>
          <button class="btn-primary" style="width:100%;justify-content:center;" @click="submitInquiry">Send Inquiry →</button>
        </div>
      </div>

      <!-- AUTH GATE MODAL -->
      <div class="modal-overlay" v-if="showAuthGate" @click.self="showAuthGate = false">
        <div class="modal-card" style="max-width:420px;">
          <button class="modal-close" @click="showAuthGate = false">✕</button>
          <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:2rem;margin-bottom:8px;">🧪</div>
            <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:4px;">{{ authMode === 'signup' ? 'Create a free account' : 'Welcome back' }}</h3>
            <p style="font-size:0.88rem;color:var(--warm-gray);">Sign in to send your inquiry</p>
          </div>
          <button class="google-btn" @click="authWithGoogle" :disabled="authLoading">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2a10 10 0 0 0-.164-1.84H9v3.48h4.844A4.14 4.14 0 0 1 12.05 13l2.634 2.04c1.53-1.41 2.426-3.49 2.426-5.96z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.32 13.78A5.39 5.39 0 0 1 9 14.78c-2.087 0-3.86-1.41-4.492-3.31L1.79 13.58A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M4.508 11.47A5.36 5.36 0 0 1 4.23 10c0-.51.1-1.01.27-1.47V6.42H1.79A9 9 0 0 0 .82 10c0 1.45.348 2.83.97 4.06l2.72-2.06z"/><path fill="#EA4335" d="M9 3.58c1.62 0 3.06.56 4.21 1.64l3.15-3.15C13.46.891 11.426 0 9 0A9 9 0 0 0 1.79 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <div class="auth-divider"><span>or</span></div>
          <div v-if="authMode === 'signup'">
            <div class="form-row"><input type="text" class="form-input" placeholder="Your name" v-model="authForm.name"></div>
          </div>
          <div class="form-row"><input type="email" class="form-input" placeholder="Email" v-model="authForm.email"></div>
          <div class="form-row"><input type="password" class="form-input" placeholder="Password" v-model="authForm.password" @keyup.enter="handleAuthSubmit"></div>
          <div v-if="authError" style="color:var(--terracotta);font-size:0.85rem;margin-bottom:12px;">{{ authError }}</div>
          <button class="btn-primary" style="width:100%;justify-content:center;" @click="handleAuthSubmit" :disabled="authLoading">
            {{ authLoading ? 'Loading...' : authMode === 'signup' ? 'Create Account & Continue' : 'Log In & Continue' }}
          </button>
          <div style="text-align:center;margin-top:16px;font-size:0.85rem;color:var(--warm-gray);">
            <span v-if="authMode === 'signup'">Already have an account? <a href="#" @click.prevent="authMode = 'login'" style="color:var(--terracotta);">Log in</a></span>
            <span v-else>No account? <a href="#" @click.prevent="authMode = 'signup'" style="color:var(--terracotta);">Sign up free</a></span>
          </div>
        </div>
      </div>
    </div>

    <PhotoLightbox v-if="photographer" :show="lbShow" :photos="lbPhotos" :startIndex="lbIndex" @close="lbShow=false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { db } from '@/services/firebase'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import PhotoLightbox from '@/components/ui/PhotoLightbox.vue'

const authStore = useAuthStore()
const route = useRoute()
const loading = ref(true)
const saved = ref(false)
const showInquiry = ref(false)
const showAuthGate = ref(false)
const authMode = ref('signup')
const authForm = ref({ name: '', email: '', password: '' })
const authError = ref('')
const authLoading = ref(false)
const inquiry = ref({ name: '', email: '', date: '', message: '' })
const lbShow = ref(false)
const lbIndex = ref(0)
const photographer = ref(null)

const initials = computed(() => {
  if (!photographer.value?.businessName) return '?'
  return photographer.value.businessName.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
})

const portfolio = computed(() => {
  if (!photographer.value?.portfolio) return []
  return photographer.value.portfolio.map(p => typeof p === 'string' ? p : p?.url).filter(Boolean)
})

const lbPhotos = computed(() => portfolio.value)

const priceDisplay = computed(() => {
  const p = photographer.value
  if (!p) return ''
  if (p.priceMin && p.priceMax) return `$${Number(p.priceMin).toLocaleString()} – $${Number(p.priceMax).toLocaleString()}`
  if (p.priceMin) return `From $${Number(p.priceMin).toLocaleString()}`
  return ''
})

const travelDisplay = computed(() => {
  const r = photographer.value?.travelRadius
  if (!r) return ''
  if (r === 'anywhere') return 'Worldwide'
  if (r === 'nationwide') return 'Nationwide'
  return `${r} miles`
})

onMounted(async () => {
  try {
    const snap = await getDoc(doc(db, 'photographers', route.params.id))
    if (snap.exists()) {
      photographer.value = { id: snap.id, ...snap.data() }
      try { await updateDoc(doc(db, 'photographers', route.params.id), { profileViews: increment(1) }) } catch(e) {}
    }
  } catch (e) { console.error('Error loading photographer:', e) }
  loading.value = false
})

function openLightbox(index) { lbIndex.value = index; lbShow.value = true }

function handleInquiryClick() {
  if (authStore.isLoggedIn) {
    if (authStore.user?.displayName && !inquiry.value.name) inquiry.value.name = authStore.user.displayName
    if (authStore.user?.email && !inquiry.value.email) inquiry.value.email = authStore.user.email
    showInquiry.value = true
  } else { showAuthGate.value = true }
}

async function handleAuthSubmit() {
  authError.value = ''; authLoading.value = true
  try {
    if (authMode.value === 'signup') {
      const { registerCouple } = await import('@/services/auth')
      await registerCouple(authForm.value.email, authForm.value.password, authForm.value.name)
      inquiry.value.name = authForm.value.name; inquiry.value.email = authForm.value.email
    } else {
      const { login } = await import('@/services/auth')
      await login(authForm.value.email, authForm.value.password)
    }
    showAuthGate.value = false; showInquiry.value = true
  } catch (e) {
    authError.value = e.code === 'auth/email-already-in-use' ? 'Email already registered. Try logging in.'
      : e.code === 'auth/wrong-password' ? 'Wrong password.'
      : e.code === 'auth/user-not-found' ? 'No account with that email.'
      : 'Something went wrong.'
  }
  authLoading.value = false
}

async function authWithGoogle() {
  authError.value = ''; authLoading.value = true
  try {
    const { signInWithGoogle } = await import('@/services/auth')
    const user = await signInWithGoogle()
    inquiry.value.name = user.displayName || ''; inquiry.value.email = user.email || ''
    showAuthGate.value = false; showInquiry.value = true
  } catch (e) { authError.value = 'Google sign-in failed.' }
  authLoading.value = false
}

async function submitInquiry() {
  try {
    const { sendInquiry } = await import('@/services/matching')
    await sendInquiry({ photographerId: photographer.value.id, name: inquiry.value.name, email: inquiry.value.email, weddingDate: inquiry.value.date, message: inquiry.value.message, matchScore: null })
    alert('Inquiry sent! ' + photographer.value.businessName + ' will get back to you soon.')
    showInquiry.value = false
  } catch (e) { alert('Something went wrong. Please try again.') }
}
</script>

<style scoped>
.profile-page { padding:100px 0 80px; background:var(--cream); min-height:100vh; }

/* HERO - overlapping avatar on cover with gradient fade */
.profile-hero { margin-bottom:40px; border-radius:var(--radius-lg); overflow:hidden; background:var(--warm-white); border:1px solid var(--light-gray); }
.profile-cover { position:relative; height:260px; background:var(--charcoal); }
.cover-img { width:100%; height:100%; object-fit:cover; object-position:center; display:block; }
.cover-gradient { width:100%; height:100%; background:linear-gradient(135deg, var(--sage-light) 0%, var(--blush) 50%, var(--cream) 100%); }
.cover-fade { position:absolute; bottom:0; left:0; right:0; height:80px; background:linear-gradient(to top, var(--warm-white), transparent); }

.hero-content { display:flex; align-items:center; gap:20px; padding:0 32px 28px; margin-top:-40px; position:relative; z-index:2; flex-wrap:wrap; }
.profile-avatar { width:96px; height:96px; border-radius:50%; border:4px solid var(--warm-white); box-shadow:var(--shadow-md); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:2rem; font-weight:500; color:var(--charcoal); flex-shrink:0; overflow:hidden; background:linear-gradient(135deg, var(--sage-light), var(--blush)); background-size:cover; background-position:center; }
.hero-info { flex:1; min-width:200px; }
.profile-badges { display:flex; gap:8px; margin-bottom:6px; }
.badge-featured { padding:3px 10px; background:var(--gold); color:white; border-radius:100px; font-size:0.7rem; font-weight:600; }
.badge-verified { padding:3px 10px; background:var(--sage-light); color:var(--sage-dark); border-radius:100px; font-size:0.7rem; font-weight:600; }
.profile-name { font-family:var(--font-display); font-size:1.7rem; font-weight:500; margin-bottom:2px; color:var(--charcoal); }
.profile-location { font-size:0.88rem; color:var(--warm-gray); margin-bottom:2px; }
.profile-tagline { font-size:0.9rem; color:var(--warm-gray); font-style:italic; }
.hero-actions { display:flex; gap:10px; flex-shrink:0; }

/* LAYOUT */
.profile-layout { display:grid; grid-template-columns:1fr 340px; gap:40px; }

.profile-section { margin-bottom:40px; }
.ps-title { font-family:var(--font-display); font-size:1.4rem; font-weight:500; margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid var(--light-gray); }

/* PORTFOLIO */
.portfolio-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; }
.portfolio-item { border-radius:var(--radius); overflow:hidden; cursor:pointer; transition:var(--transition); }
.portfolio-item:hover { transform:scale(1.02); box-shadow:var(--shadow-md); }
.portfolio-item:nth-child(1) { grid-column:span 2; grid-row:span 2; }
.portfolio-img { width:100%; aspect-ratio:4/3; object-fit:cover; display:block; }
.portfolio-item:nth-child(1) .portfolio-img { aspect-ratio:1/1; }

.about-text { font-size:0.95rem; color:var(--warm-gray); line-height:1.8; white-space:pre-line; }

.profile-tags { display:flex; flex-wrap:wrap; gap:8px; }
.profile-tag { padding:6px 16px; background:rgba(139,158,130,0.1); border:1px solid rgba(139,158,130,0.2); border-radius:100px; font-size:0.82rem; color:var(--sage-dark); font-weight:500; }
.tag-alt { background:rgba(196,130,106,0.08); border-color:rgba(196,130,106,0.15); color:var(--terracotta-dark); }
.tag-sm { padding:4px 12px; font-size:0.78rem; }

/* SIDEBAR */
.profile-sidebar { display:flex; flex-direction:column; gap:16px; }
.sidebar-card { background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:24px; }
.sc-title { font-family:var(--font-display); font-size:1.15rem; font-weight:500; margin-bottom:14px; }
.sc-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--light-gray); }
.sc-row:last-of-type { border-bottom:none; }
.sc-label { font-size:0.84rem; color:var(--warm-gray); }
.sc-value { font-size:0.84rem; font-weight:500; text-align:right; max-width:55%; }

.package-text { font-size:0.88rem; color:var(--warm-gray); line-height:1.8; white-space:pre-line; }

.social-links { display:flex; flex-direction:column; gap:8px; }
.social-link { display:flex; align-items:center; gap:10px; padding:8px 12px; border:1px solid var(--light-gray); border-radius:var(--radius); font-size:0.85rem; color:var(--charcoal); transition:var(--transition); }
.social-link:hover { border-color:var(--sage); background:rgba(139,158,130,0.04); }
.social-link svg { color:var(--warm-gray); flex-shrink:0; }

/* MODALS */
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; z-index:2000; background:rgba(44,44,44,0.5); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:24px; }
.modal-card { background:var(--warm-white); border-radius:var(--radius-lg); padding:36px; max-width:520px; width:100%; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow-lg); position:relative; }
.modal-close { position:absolute; top:14px; right:14px; font-size:1.2rem; color:var(--warm-gray); padding:8px; cursor:pointer; background:none; border:none; }
.modal-title { font-family:var(--font-display); font-size:1.4rem; font-weight:500; margin-bottom:4px; }
.modal-sub { font-size:0.85rem; color:var(--warm-gray); margin-bottom:20px; }
.google-btn { width:100%; padding:12px; border-radius:100px; border:1.5px solid var(--light-gray); display:flex; align-items:center; justify-content:center; gap:10px; font-size:0.9rem; font-weight:500; cursor:pointer; transition:var(--transition); background:var(--warm-white); }
.google-btn:hover { border-color:var(--charcoal); background:var(--cream); }
.auth-divider { display:flex; align-items:center; gap:12px; margin:20px 0; color:var(--warm-gray); font-size:0.8rem; }
.auth-divider::before, .auth-divider::after { content:''; flex:1; height:1px; background:var(--light-gray); }

/* RESPONSIVE */
@media (max-width:1024px) { .profile-layout { grid-template-columns:1fr; } .profile-sidebar { order:-1; } }
@media (max-width:768px) {
  .profile-cover { height:180px; }
  .hero-content { flex-direction:column; align-items:center; text-align:center; padding:0 20px 24px; margin-top:-32px; }
  .hero-actions { justify-content:center; }
  .profile-avatar { width:72px; height:72px; font-size:1.5rem; }
  .portfolio-grid { grid-template-columns:repeat(2, 1fr); }
  .portfolio-item:nth-child(1) { grid-column:span 2; grid-row:span 1; }
  .portfolio-item:nth-child(1) .portfolio-img { aspect-ratio:16/9; }
}
</style>
