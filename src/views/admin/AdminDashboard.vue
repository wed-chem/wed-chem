<template>
  <div class="admin-page">
    <div class="container">
      <div class="admin-header">
        <h1 class="admin-title">🔒 Admin Dashboard</h1>
        <p class="admin-sub">Review photographer applications and manage the platform.</p>
      </div>

      <!-- STATS -->
      <div class="admin-stats">
        <div class="astat"><div class="astat-num">{{ pending.length }}</div><div class="astat-label">Pending Review</div></div>
        <div class="astat"><div class="astat-num">{{ approved.length }}</div><div class="astat-label">Approved</div></div>
        <div class="astat"><div class="astat-num">{{ rejected.length }}</div><div class="astat-label">Rejected</div></div>
        <div class="astat"><div class="astat-num">{{ allPhotographers.length }}</div><div class="astat-label">Total</div></div>
      </div>

      <!-- TABS -->
      <div class="admin-tabs">
        <button class="atab" :class="{active:tab==='pending'}" @click="tab='pending'">Pending ({{ pending.length }})</button>
        <button class="atab" :class="{active:tab==='approved'}" @click="tab='approved'">Approved ({{ approved.length }})</button>
        <button class="atab" :class="{active:tab==='rejected'}" @click="tab='rejected'">Rejected ({{ rejected.length }})</button>
        <button class="atab" :class="{active:tab==='all'}" @click="tab='all'">All</button>
      </div>

      <!-- LIST -->
      <div class="admin-list">
        <div class="admin-card" v-for="p in filteredList" :key="p.id">
          <div class="ac-avatar" :style="{background: p.gradient || 'linear-gradient(135deg,var(--sage-light),var(--blush))'}">
            {{ p.initials || (p.firstName?.[0]||'')+(p.lastName?.[0]||'') }}
          </div>
          <div class="ac-info">
            <div class="ac-name">{{ p.businessName || p.firstName + ' ' + p.lastName }}</div>
            <div class="ac-loc">{{ p.city }}<span v-if="p.state">, {{ p.state }}</span><span v-if="p.country && p.country !== 'USA' && p.country !== 'United States'"> · {{ p.country }}</span></div>
            <div class="ac-meta">
              <span v-if="p.email">{{ p.email }}</span>
              <span v-if="p.styles">· {{ (p.styles||[]).join(', ') }}</span>
              <span v-if="p.priceMin">· ${{ p.priceMin }}–${{ p.priceMax }}</span>
            </div>
            <div class="ac-links">
              <a v-if="p.website" :href="p.website" target="_blank" class="ac-link">Website ↗</a>
              <a v-if="p.instagram" :href="'https://instagram.com/'+p.instagram.replace('@','')" target="_blank" class="ac-link">Instagram ↗</a>
              <router-link :to="'/photographer/'+p.id" class="ac-link">View Profile ↗</router-link>
            </div>
          </div>
          <div class="ac-actions">
            <span class="ac-status" :class="p.status || 'pending'">{{ p.status || 'pending' }}</span>
            <div class="ac-btns">
              <button class="abtn abtn-approve" v-if="p.status !== 'approved'" @click="approvePhotographer(p)" :disabled="actionLoading">✓ Approve</button>
              <button class="abtn abtn-reject" v-if="p.status !== 'rejected'" @click="rejectPhotographer(p)" :disabled="actionLoading">✕ Reject</button>
              <button class="abtn abtn-suspend" v-if="p.status === 'approved'" @click="suspendPhotographer(p)" :disabled="actionLoading">Suspend</button>
            </div>
            <div class="ac-date">Joined {{ formatDate(p.createdAt) }}</div>
          </div>
        </div>

        <div v-if="!filteredList.length" class="admin-empty">
          No {{ tab }} photographers found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/services/firebase'
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

const tab = ref('pending')
const allPhotographers = ref([])
const actionLoading = ref(false)

const pending = computed(() => allPhotographers.value.filter(p => !p.status || p.status === 'pending'))
const approved = computed(() => allPhotographers.value.filter(p => p.status === 'approved'))
const rejected = computed(() => allPhotographers.value.filter(p => p.status === 'rejected' || p.status === 'suspended'))

const filteredList = computed(() => {
  if (tab.value === 'pending') return pending.value
  if (tab.value === 'approved') return approved.value
  if (tab.value === 'rejected') return rejected.value
  return allPhotographers.value
})

onMounted(async () => {
  await loadPhotographers()
})

async function loadPhotographers() {
  try {
    const snap = await getDocs(collection(db, 'photographers'))
    allPhotographers.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const order = { pending: 0, undefined: 0, approved: 1, rejected: 2, suspended: 2 }
        return (order[a.status] || 0) - (order[b.status] || 0)
      })
  } catch (e) {
    console.error('Error loading photographers:', e)
  }
}

async function approvePhotographer(p) {
  actionLoading.value = true
  try {
    await updateDoc(doc(db, 'photographers', p.id), {
      status: 'approved',
      published: true,
      approvedAt: serverTimestamp(), publishedAt: serverTimestamp()
    })
    // Trigger email via Cloud Function or direct API
    await sendStatusEmail(p, 'approved')
    p.status = 'approved'
    p.published = true
  } catch (e) { console.error(e) }
  actionLoading.value = false
}

async function rejectPhotographer(p) {
  const reason = prompt('Rejection reason (optional):')
  actionLoading.value = true
  try {
    await updateDoc(doc(db, 'photographers', p.id), {
      status: 'rejected',
      published: false,
      rejectionReason: reason || null,
      rejectedAt: serverTimestamp()
    })
    await sendStatusEmail(p, 'rejected', reason)
    p.status = 'rejected'
    p.published = false
  } catch (e) { console.error(e) }
  actionLoading.value = false
}

async function suspendPhotographer(p) {
  actionLoading.value = true
  try {
    await updateDoc(doc(db, 'photographers', p.id), {
      status: 'suspended',
      published: false,
      suspendedAt: serverTimestamp()
    })
    p.status = 'suspended'
    p.published = false
  } catch (e) { console.error(e) }
  actionLoading.value = false
}

async function sendStatusEmail(photographer, status, reason) {
  try {
    const { sendApprovalEmail } = await import('@/services/email')
    await sendApprovalEmail(photographer, status, reason)
  } catch (e) { console.warn('Email send failed (Cloud Functions may not be deployed):', e) }
}

function formatDate(ts) {
  if (!ts) return 'recently'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.admin-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.admin-header { margin-bottom:32px; }
.admin-title { font-family:var(--font-display); font-size:2rem; font-weight:400; margin-bottom:4px; }
.admin-sub { color:var(--warm-gray); font-size:0.92rem; }

.admin-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
.astat { background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius); padding:20px; text-align:center; }
.astat-num { font-family:var(--font-display); font-size:2rem; font-weight:300; }
.astat-label { font-size:0.78rem; color:var(--warm-gray); margin-top:4px; }

.admin-tabs { display:flex; gap:8px; margin-bottom:24px; }
.atab { padding:8px 20px; border-radius:100px; border:1.5px solid var(--light-gray); font-size:0.85rem; color:var(--warm-gray); transition:var(--transition); }
.atab.active { background:var(--charcoal); color:var(--cream); border-color:var(--charcoal); }

.admin-list { display:flex; flex-direction:column; gap:16px; }
.admin-card { display:flex; gap:20px; padding:24px; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); transition:var(--transition); }
.admin-card:hover { border-color:var(--sage); }

.ac-avatar { width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:1.1rem; color:white; flex-shrink:0; }
.ac-info { flex:1; min-width:0; }
.ac-name { font-family:var(--font-display); font-size:1.2rem; font-weight:500; margin-bottom:2px; }
.ac-loc { font-size:0.84rem; color:var(--warm-gray); margin-bottom:4px; }
.ac-meta { font-size:0.82rem; color:var(--warm-gray); margin-bottom:8px; }
.ac-links { display:flex; gap:12px; }
.ac-link { font-size:0.82rem; color:var(--terracotta); font-weight:500; }

.ac-actions { display:flex; flex-direction:column; align-items:flex-end; gap:10px; flex-shrink:0; }
.ac-status { padding:4px 12px; border-radius:100px; font-size:0.72rem; font-weight:600; text-transform:uppercase; }
.ac-status.pending { background:rgba(201,169,110,0.15); color:var(--gold); }
.ac-status.approved { background:rgba(139,158,130,0.15); color:var(--sage-dark); }
.ac-status.rejected, .ac-status.suspended { background:rgba(196,130,106,0.15); color:var(--terracotta-dark); }
.ac-btns { display:flex; gap:8px; }
.abtn { padding:6px 14px; border-radius:100px; font-size:0.78rem; font-weight:500; transition:var(--transition); }
.abtn:disabled { opacity:0.5; cursor:not-allowed; }
.abtn-approve { background:var(--sage); color:white; }
.abtn-approve:hover:not(:disabled) { background:var(--sage-dark); }
.abtn-reject { background:none; border:1px solid var(--terracotta); color:var(--terracotta); }
.abtn-reject:hover:not(:disabled) { background:var(--terracotta); color:white; }
.abtn-suspend { background:none; border:1px solid var(--warm-gray); color:var(--warm-gray); }
.ac-date { font-size:0.75rem; color:var(--warm-gray); }

.admin-empty { text-align:center; padding:60px; color:var(--warm-gray); }

@media(max-width:768px) {
  .admin-stats { grid-template-columns:repeat(2,1fr); }
  .admin-card { flex-direction:column; }
  .ac-actions { align-items:flex-start; }
}
</style>
