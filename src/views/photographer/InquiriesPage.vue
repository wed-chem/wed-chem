<template>
  <div class="inq-page">
    <div class="container">
      <div class="edit-header">
        <h1 class="section-title">Inquiries</h1>
        <router-link to="/dashboard" class="btn-secondary btn-sm">← Dashboard</router-link>
      </div>

      <!-- Stats bar -->
      <div class="stats-bar" v-if="inquiries.length">
        <div class="stat"><span class="stat-num">{{ inquiries.length }}</span><span class="stat-label">Total</span></div>
        <div class="stat"><span class="stat-num">{{ inquiries.filter(i=>i.status==='new').length }}</span><span class="stat-label">New</span></div>
        <div class="stat"><span class="stat-num">{{ respondedCount }}</span><span class="stat-label">Responded</span></div>
        <div class="stat"><span class="stat-num">{{ bookedCount }}</span><span class="stat-label">Booked</span></div>
        <div class="stat" v-if="avgResponseTime"><span class="stat-num">{{ avgResponseTime }}</span><span class="stat-label">Avg Response</span></div>
      </div>

      <!-- Tabs -->
      <div class="inq-tabs">
        <button class="inq-tab" :class="{active:tab==='all'}" @click="tab='all'">All ({{ inquiries.length }})</button>
        <button class="inq-tab" :class="{active:tab==='new'}" @click="tab='new'">New ({{ inquiries.filter(i=>i.status==='new').length }})</button>
        <button class="inq-tab" :class="{active:tab==='responded'}" @click="tab='responded'">Responded</button>
        <button class="inq-tab" :class="{active:tab==='booked'}" @click="tab='booked'">Booked</button>
      </div>

      <!-- Loading -->
      <div v-if="loading" style="text-align:center;padding:60px 0;color:var(--warm-gray);">Loading inquiries...</div>

      <!-- List -->
      <div class="inq-list" v-if="!loading">
        <div class="inq-card" v-for="inq in filteredInquiries" :key="inq.id" @click="openInquiry(inq)">
          <div class="inq-dot" v-if="inq.status==='new'"></div>
          <div class="inq-status-icon" v-if="inq.status==='booked'">🎉</div>
          <div class="inq-status-icon responded-icon" v-else-if="inq.status==='responded'">✓</div>
          <div class="inq-av">{{ getInitials(inq.coupleName) }}</div>
          <div class="inq-body">
            <div class="inq-top">
              <span class="inq-name">{{ inq.coupleName }}</span>
              <span class="inq-time">{{ formatTime(inq.createdAt) }}</span>
            </div>
            <div class="inq-date">
              <span v-if="inq.weddingDate">{{ inq.weddingDate }} · </span>
              <span v-if="inq.matchScore" class="inq-match">{{ inq.matchScore }}% match</span>
            </div>
            <div class="inq-msg">{{ inq.message }}</div>
          </div>
        </div>
        <div v-if="!filteredInquiries.length && !loading" style="text-align:center;padding:60px 0;color:var(--warm-gray);">
          {{ tab === 'all' ? "No inquiries yet. They'll show up here when couples reach out." : 'No ' + tab + ' inquiries.' }}
        </div>
      </div>

      <!-- Detail modal -->
      <div class="modal-overlay" v-if="selected" @click.self="selected=null">
        <div class="modal-card">
          <button class="modal-close" @click="selected=null">✕</button>

          <div class="modal-status-badge" :class="'badge-' + selected.status">{{ statusLabel(selected.status) }}</div>

          <h3 class="modal-name">{{ selected.coupleName }}</h3>
          <div class="modal-email">{{ selected.coupleEmail }}</div>
          <div class="modal-date">
            <span v-if="selected.weddingDate">Wedding: {{ selected.weddingDate }}</span>
            <span v-if="selected.matchScore"> · {{ selected.matchScore }}% match</span>
          </div>

          <div class="modal-message">{{ selected.message }}</div>

          <!-- Action buttons -->
          <div class="modal-actions">
            <a :href="'mailto:' + selected.coupleEmail + '?subject=Re: Your WedChem inquiry'" class="btn-primary" @click="markResponded(selected)">Reply via Email →</a>

            <div class="modal-secondary-actions">
              <button v-if="selected.status === 'new' || selected.status === 'read'" class="action-btn responded-btn" @click="markResponded(selected)">
                Mark as Responded
              </button>
              <button v-if="selected.status !== 'booked'" class="action-btn booked-btn" @click="markBooked(selected)">
                🎉 Mark as Booked
              </button>
              <button v-if="selected.status === 'booked'" class="action-btn unbook-btn" @click="updateStatus(selected, 'responded')">
                Undo Booked
              </button>
            </div>
          </div>

          <div class="modal-timestamps">
            <div v-if="selected.createdAt">Received: {{ formatTimeFull(selected.createdAt) }}</div>
            <div v-if="selected.readAt">Opened: {{ formatTimeFull(selected.readAt) }}</div>
            <div v-if="selected.respondedAt">Responded: {{ formatTimeFull(selected.respondedAt) }}</div>
            <div v-if="selected.bookedAt">Booked: {{ formatTimeFull(selected.bookedAt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSEO } from '@/composables/useSEO'
import { ref, computed, onMounted } from 'vue'
import { db } from '@/services/firebase'
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

useSEO({ title: 'Inquiries', description: 'View and manage couple inquiries on WedChem.', path: '/dashboard/inquiries' })


const authStore = useAuthStore()
const tab = ref('all')
const selected = ref(null)
const inquiries = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadInquiries()
})

async function loadInquiries() {
  loading.value = true
  try {
    const q = query(
      collection(db, 'inquiries'),
      where('photographerId', '==', authStore.uid),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    inquiries.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error('Error loading inquiries:', e)
  }
  loading.value = false
}

const filteredInquiries = computed(() => {
  if (tab.value === 'all') return inquiries.value
  return inquiries.value.filter(i => i.status === tab.value)
})

const respondedCount = computed(() => inquiries.value.filter(i => i.status === 'responded' || i.status === 'booked').length)
const bookedCount = computed(() => inquiries.value.filter(i => i.status === 'booked').length)

const avgResponseTime = computed(() => {
  const responded = inquiries.value.filter(i => i.respondedAt && i.createdAt)
  if (!responded.length) return null
  const total = responded.reduce((sum, i) => {
    const created = i.createdAt?.toDate ? i.createdAt.toDate() : new Date(i.createdAt)
    const resp = i.respondedAt?.toDate ? i.respondedAt.toDate() : new Date(i.respondedAt)
    return sum + (resp - created)
  }, 0)
  const avgMs = total / responded.length
  const hours = Math.round(avgMs / (1000 * 60 * 60))
  if (hours < 1) return '<1h'
  if (hours < 24) return hours + 'h'
  return Math.round(hours / 24) + 'd'
})

async function openInquiry(inq) {
  selected.value = inq
  // Mark as read if new
  if (inq.status === 'new') {
    try {
      await updateDoc(doc(db, 'inquiries', inq.id), {
        status: 'read',
        readAt: serverTimestamp()
      })
      inq.status = 'read'
      inq.readAt = new Date()
    } catch (e) { console.error('Error marking read:', e) }
  }
}

async function markResponded(inq) {
  if (inq.status === 'responded' || inq.status === 'booked') return
  try {
    await updateDoc(doc(db, 'inquiries', inq.id), {
      status: 'responded',
      respondedAt: serverTimestamp()
    })
    inq.status = 'responded'
    inq.respondedAt = new Date()
  } catch (e) { console.error('Error marking responded:', e) }
}

async function markBooked(inq) {
  try {
    await updateDoc(doc(db, 'inquiries', inq.id), {
      status: 'booked',
      bookedAt: serverTimestamp()
    })
    inq.status = 'booked'
    inq.bookedAt = new Date()
    if (!inq.respondedAt) {
      await updateDoc(doc(db, 'inquiries', inq.id), { respondedAt: serverTimestamp() })
      inq.respondedAt = new Date()
    }
  } catch (e) { console.error('Error marking booked:', e) }
}

async function updateStatus(inq, status) {
  try {
    const update = { status }
    if (status !== 'booked') update.bookedAt = null
    await updateDoc(doc(db, 'inquiries', inq.id), update)
    inq.status = status
    if (status !== 'booked') inq.bookedAt = null
  } catch (e) { console.error('Error updating status:', e) }
}

function statusLabel(s) {
  return { new: 'New', read: 'Read', responded: 'Responded', booked: 'Booked' }[s] || s
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(/[\s&]+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function formatTime(ts) {
  if (!ts) return ''
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTimeFull(ts) {
  if (!ts) return ''
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}
</script>

<style scoped>
.inq-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.edit-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }

/* Stats */
.stats-bar { display:flex; gap:16px; margin-bottom:24px; padding:20px; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius); }
.stat { flex:1; text-align:center; }
.stat-num { display:block; font-family:var(--font-display); font-size:1.6rem; font-weight:400; }
.stat-label { font-size:0.72rem; color:var(--warm-gray); text-transform:uppercase; letter-spacing:0.04em; }

/* Tabs */
.inq-tabs { display:flex; gap:8px; margin-bottom:24px; }
.inq-tab { padding:8px 20px; border-radius:100px; font-size:0.85rem; border:1.5px solid var(--light-gray); color:var(--warm-gray); transition:var(--transition); cursor:pointer; }
.inq-tab:hover { border-color:var(--charcoal); }
.inq-tab.active { background:var(--charcoal); color:var(--cream); border-color:var(--charcoal); }

/* List */
.inq-list { display:flex; flex-direction:column; gap:12px; }
.inq-card { display:flex; gap:16px; padding:20px; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius); cursor:pointer; transition:var(--transition); position:relative; }
.inq-card:hover { border-color:var(--sage); box-shadow:var(--shadow-sm); }
.inq-dot { position:absolute; top:24px; left:8px; width:8px; height:8px; border-radius:50%; background:var(--terracotta); }
.inq-status-icon { position:absolute; top:20px; left:6px; font-size:0.7rem; }
.responded-icon { color:var(--sage); font-weight:700; }
.inq-av { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,var(--sage-light),var(--blush)); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:0.85rem; flex-shrink:0; }
.inq-body { flex:1; min-width:0; }
.inq-top { display:flex; justify-content:space-between; margin-bottom:2px; }
.inq-name { font-weight:500; font-size:0.95rem; }
.inq-time { font-size:0.78rem; color:var(--warm-gray); }
.inq-date { font-size:0.8rem; color:var(--warm-gray); margin-bottom:6px; }
.inq-match { color:var(--sage-dark); font-weight:500; }
.inq-msg { font-size:0.85rem; color:var(--warm-gray); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* Modal */
.modal-overlay { position:fixed; inset:0; z-index:2000; background:rgba(44,44,44,0.5); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:24px; }
.modal-card { background:var(--warm-white); border-radius:var(--radius-lg); padding:40px; max-width:560px; width:100%; max-height:85vh; overflow-y:auto; position:relative; box-shadow:var(--shadow-lg); }
.modal-close { position:absolute; top:16px; right:16px; font-size:1.2rem; color:var(--warm-gray); padding:8px; cursor:pointer; }

.modal-status-badge { display:inline-block; padding:4px 12px; border-radius:100px; font-size:0.72rem; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; margin-bottom:16px; }
.badge-new { background:var(--blush); color:var(--terracotta-dark); }
.badge-read { background:var(--light-gray); color:var(--warm-gray); }
.badge-responded { background:var(--sage-light); color:var(--sage-dark); }
.badge-booked { background:var(--gold-light); color:var(--charcoal); }

.modal-name { font-family:var(--font-display); font-size:1.4rem; margin-bottom:4px; }
.modal-email { font-size:0.85rem; color:var(--warm-gray); margin-bottom:4px; }
.modal-email a { color:var(--terracotta); }
.modal-date { font-size:0.85rem; color:var(--warm-gray); margin-bottom:20px; }
.modal-message { font-size:0.95rem; line-height:1.7; color:var(--charcoal); margin-bottom:28px; white-space:pre-line; padding:20px; background:var(--cream); border-radius:var(--radius); }

.modal-actions { margin-bottom:24px; }
.modal-actions .btn-primary { display:inline-flex; margin-bottom:16px; text-decoration:none; }
.modal-secondary-actions { display:flex; gap:10px; flex-wrap:wrap; }
.action-btn { padding:10px 20px; border-radius:100px; font-size:0.82rem; font-weight:500; cursor:pointer; transition:var(--transition); }
.responded-btn { border:1.5px solid var(--sage); color:var(--sage-dark); background:transparent; }
.responded-btn:hover { background:var(--sage-light); }
.booked-btn { border:1.5px solid var(--gold); color:var(--charcoal); background:transparent; }
.booked-btn:hover { background:var(--gold-light); }
.unbook-btn { border:1.5px solid var(--light-gray); color:var(--warm-gray); background:transparent; }

.modal-timestamps { padding-top:20px; border-top:1px solid var(--light-gray); }
.modal-timestamps div { font-size:0.78rem; color:var(--warm-gray); margin-bottom:4px; }

@media(max-width:768px) {
  .stats-bar { flex-wrap:wrap; gap:12px; }
  .stat { min-width:calc(50% - 8px); }
  .modal-card { padding:28px 20px; }
}
</style>
