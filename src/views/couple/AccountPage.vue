<template>
  <div class="account-page">
    <div class="container">
      <h1 class="section-title">Your Matches</h1>
      <p class="account-sub">Your style quiz results and saved photographers.</p>

      <!-- MATCH RESULTS -->
      <section class="acct-section" v-if="matches.length">
        <h2 class="as-title">Quiz Results</h2>
        <p class="as-sub">Based on your most recent style quiz · <router-link to="/quiz" style="color:var(--terracotta);">Retake Quiz</router-link></p>
        <div class="matches-grid">
          <div class="match-card" v-for="(m, i) in matches" :key="m.photographerId"
            @click="$router.push('/photographer/' + m.photographerId)">
            <button class="mc-remove" @click.stop="removeMatch(i)" title="Remove match">✕</button>
            <div class="mc-rank">#{{ i + 1 }}</div>
            <div class="mc-cover" :style="{background: m.coverPhoto ? `url(${m.coverPhoto}) center/cover` : 'linear-gradient(135deg, var(--sage-light), var(--blush))'}"></div>
            <div class="mc-info">
              <div class="mc-name">{{ m.businessName || 'Photographer' }}</div>
              <div class="mc-loc" v-if="m.city">{{ m.city }}<span v-if="m.state">, {{ m.state }}</span></div>
              <div class="mc-score-wrap">
                <div class="mc-score-bar"><div class="mc-score-fill" :style="{width: m.score + '%'}"></div></div>
                <span class="mc-score-num">{{ m.score }}% match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- NO MATCHES -->
      <section class="acct-section" v-else>
        <div class="empty-state">
          <div style="font-size:2.5rem;margin-bottom:12px;">🧪</div>
          <h2 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:8px;">No matches yet</h2>
          <p style="color:var(--warm-gray);margin-bottom:20px;">Take our 3-minute style quiz to find photographers who match your aesthetic.</p>
          <router-link to="/quiz" class="btn-primary">Take the Style Quiz →</router-link>
        </div>
      </section>

      <!-- SAVED PHOTOGRAPHERS -->
      <section class="acct-section" v-if="saved.length">
        <h2 class="as-title">Saved Photographers</h2>
        <div class="matches-grid">
          <div class="match-card" v-for="s in saved" :key="s.id" @click="$router.push('/photographer/' + s.id)">
            <div class="mc-cover" :style="{background: s.coverPhoto ? `url(${s.coverPhoto}) center/cover` : 'linear-gradient(135deg, var(--sage-light), var(--blush))'}"></div>
            <div class="mc-info">
              <div class="mc-name">{{ s.businessName }}</div>
              <div class="mc-loc" v-if="s.city">{{ s.city }}<span v-if="s.state">, {{ s.state }}</span></div>
            </div>
          </div>
        </div>
      </section>

      <!-- INQUIRIES SENT -->
      <section class="acct-section" v-if="inquiries.length">
        <h2 class="as-title">Your Inquiries</h2>
        <div class="inquiry-list">
          <div class="inq-card" v-for="inq in inquiries" :key="inq.id">
            <div class="inq-info">
              <div class="inq-name">{{ inq.photographerName || 'Photographer' }}</div>
              <div class="inq-date">Sent {{ formatDate(inq.createdAt) }}</div>
            </div>
            <span class="inq-status" :class="inq.status">{{ inq.status }}</span>
          </div>
        </div>
      </section>

      <!-- ACCOUNT -->
      <section class="acct-section">
        <h2 class="as-title">Account</h2>
        <div class="acct-card">
          <div class="acct-row">
            <span class="acct-label">Name</span>
            <span>{{ authStore.user?.displayName || '—' }}</span>
          </div>
          <div class="acct-row">
            <span class="acct-label">Email</span>
            <span>{{ authStore.user?.email || '—' }}</span>
          </div>
          <div class="acct-row">
            <span class="acct-label">Email verified</span>
            <span>{{ authStore.user?.emailVerified ? '✓ Yes' : 'Not yet' }}
              <button v-if="!authStore.user?.emailVerified" class="btn-text" @click="resend">Resend verification</button>
            </span>
          </div>
          <div class="acct-actions">
            <button class="btn-secondary btn-sm" @click="handleLogout">Log Out</button>
            <button class="btn-danger btn-sm" @click="handleDelete">Delete Account</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSEO } from '@/composables/useSEO'
import { db } from '@/services/firebase'
import { collection, query, where, getDocs, doc, getDoc, orderBy, updateDoc } from 'firebase/firestore'

useSEO({ title: 'My Matches', description: 'View your quiz results, saved photographers, and manage your WedChem account.', path: '/account' })

const router = useRouter()
const authStore = useAuthStore()
const matches = ref([])
const saved = ref([])
const inquiries = ref([])

onMounted(async () => {
  if (!authStore.uid) return

  // Load quiz results
  try {
    const resultsDoc = await getDoc(doc(db, 'quizResults', authStore.uid))
    if (resultsDoc.exists()) {
      const data = resultsDoc.data()
      if (data.matches && data.matches.length) {
        // Hydrate with current photographer data
        for (const m of data.matches.slice(0, 10)) {
          try {
            const pDoc = await getDoc(doc(db, 'photographers', m.photographerId))
            if (pDoc.exists()) {
              const p = pDoc.data()
              matches.value.push({
                photographerId: m.photographerId,
                score: m.score || m.totalScore,
                businessName: p.businessName,
                city: p.city, state: p.state,
                coverPhoto: p.coverPhoto
              })
            }
          } catch(e) {}
        }
      }
    }
  } catch(e) { console.warn('Could not load matches:', e) }

  // Load saved photographers
  try {
    const savedQuery = query(collection(db, 'savedPhotographers'), where('coupleUid', '==', authStore.uid))
    const savedSnap = await getDocs(savedQuery)
    for (const d of savedSnap.docs) {
      const s = d.data()
      try {
        const pDoc = await getDoc(doc(db, 'photographers', s.photographerId))
        if (pDoc.exists()) {
          const p = pDoc.data()
          saved.value.push({ id: s.photographerId, businessName: p.businessName, city: p.city, state: p.state, coverPhoto: p.coverPhoto })
        }
      } catch(e) {}
    }
  } catch(e) { console.warn('Could not load saved:', e) }

  // Load inquiries sent by this couple
  try {
    const q = query(collection(db, 'inquiries'), where('coupleUid', '==', authStore.uid), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    for (const d of snap.docs) {
      const inq = d.data()
      let photographerName = 'Photographer'
      try {
        const pDoc = await getDoc(doc(db, 'photographers', inq.photographerId))
        if (pDoc.exists()) photographerName = pDoc.data().businessName
      } catch(e) {}
      inquiries.value.push({ id: d.id, ...inq, photographerName })
    }
  } catch(e) { console.warn('Could not load inquiries:', e) }
})

async function removeMatch(index) {
  if (!confirm('Remove this match from your results?')) return
  matches.value.splice(index, 1)
  // Update Firestore
  try {
    const { setDoc } = await import('firebase/firestore')
    await setDoc(doc(db, 'quizResults', authStore.uid), {
      matches: matches.value.map(m => ({ photographerId: m.photographerId, score: m.score }))
    }, { merge: true })
  } catch(e) { console.warn('Could not update matches:', e) }
}

function formatDate(ts) {
  if (!ts) return 'recently'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function resend() {
  try {
    const { resendVerification } = await import('@/services/auth')
    await resendVerification()
    alert('Verification email sent!')
  } catch(e) { alert('Could not send. Try again later.') }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}

async function handleDelete() {
  const confirm = window.confirm('Are you sure you want to delete your account? This cannot be undone.')
  if (!confirm) return
  try {
    const { deleteUser } = await import('firebase/auth')
    await deleteUser(authStore.user)
    router.push('/')
  } catch(e) {
    if (e.code === 'auth/requires-recent-login') {
      alert('For security, please log out, log back in, and try again.')
    } else {
      alert('Could not delete account. Please try again.')
    }
  }
}
</script>

<style scoped>
.account-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.account-sub { color:var(--warm-gray); font-size:0.92rem; margin-bottom:40px; }

.acct-section { margin-bottom:48px; }
.as-title { font-family:var(--font-display); font-size:1.3rem; font-weight:500; margin-bottom:8px; padding-bottom:10px; border-bottom:1px solid var(--light-gray); }
.as-sub { font-size:0.85rem; color:var(--warm-gray); margin-bottom:20px; }

.matches-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px; }
.match-card { border:1px solid var(--light-gray); border-radius:var(--radius-lg); overflow:hidden; cursor:pointer; transition:var(--transition); background:var(--warm-white); position:relative; }
.match-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:var(--sage); }
.mc-remove { position:absolute; top:8px; left:8px; width:24px; height:24px; border-radius:50%; background:rgba(0,0,0,0.5); color:white; border:none; font-size:0.7rem; cursor:pointer; z-index:2; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s; }
.match-card:hover .mc-remove { opacity:1; }
.mc-rank { position:absolute; top:10px; right:10px; width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,0.9); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:600; z-index:1; }
.mc-cover { height:140px; }
.mc-info { padding:16px; }
.mc-name { font-family:var(--font-display); font-size:1.1rem; font-weight:500; margin-bottom:2px; }
.mc-loc { font-size:0.82rem; color:var(--warm-gray); margin-bottom:10px; }
.mc-score-wrap { display:flex; align-items:center; gap:10px; }
.mc-score-bar { flex:1; height:6px; background:var(--light-gray); border-radius:100px; overflow:hidden; }
.mc-score-fill { height:100%; background:linear-gradient(90deg, var(--sage), var(--terracotta)); border-radius:100px; }
.mc-score-num { font-size:0.78rem; font-weight:600; color:var(--sage-dark); white-space:nowrap; }

.inquiry-list { display:flex; flex-direction:column; gap:10px; }
.inq-card { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius); }
.inq-name { font-weight:500; margin-bottom:2px; }
.inq-date { font-size:0.82rem; color:var(--warm-gray); }
.inq-status { padding:4px 12px; border-radius:100px; font-size:0.72rem; font-weight:600; text-transform:uppercase; }
.inq-status.new { background:rgba(201,169,110,0.15); color:var(--gold); }
.inq-status.read { background:rgba(139,158,130,0.15); color:var(--sage-dark); }
.inq-status.replied { background:rgba(139,158,130,0.2); color:var(--sage-dark); }

.acct-card { background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:24px; }
.acct-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--light-gray); font-size:0.9rem; }
.acct-row:last-of-type { border-bottom:none; }
.acct-label { color:var(--warm-gray); font-size:0.85rem; }
.acct-actions { display:flex; gap:12px; margin-top:20px; padding-top:16px; border-top:1px solid var(--light-gray); }
.btn-text { background:none; border:none; color:var(--terracotta); font-size:0.82rem; font-weight:500; cursor:pointer; margin-left:8px; }
.btn-danger { background:none; border:1.5px solid #c44; color:#c44; padding:8px 20px; border-radius:100px; font-size:0.82rem; font-weight:500; cursor:pointer; transition:var(--transition); }
.btn-danger:hover { background:#c44; color:white; }

.empty-state { text-align:center; padding:60px 20px; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); }

@media(max-width:768px) {
  .matches-grid { grid-template-columns:1fr; }
}
</style>
