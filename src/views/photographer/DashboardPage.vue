<template>
  <div class="dash-page">
    <div class="container">
      <div class="dash-header">
        <div>
          <h1 class="dash-title">Welcome back, {{ profile?.businessName || 'Photographer' }}</h1>
          <p class="dash-sub">Manage your profile, view inquiries, and track your performance.</p>
        </div>
        <div class="dash-actions">
          <router-link to="/dashboard/profile" class="btn-secondary btn-sm">Edit Profile</router-link>
          <router-link v-if="profile?.tier!=='featured'" to="/dashboard/upgrade" class="btn-primary btn-sm" style="background:var(--terracotta)">Get Featured ⭐</router-link>
        </div>
      </div>

      <!-- PENDING REVIEW BANNER -->
      <div class="pending-banner" v-if="profile?.status === 'pending'">
        <div class="pending-icon">⏳</div>
        <div class="pending-text">
          <div class="pending-title">Your profile is under review</div>
          <div class="pending-sub">We typically review new profiles within 24 hours. You'll get an email once approved.</div>
        </div>
      </div>

      <!-- REJECTED BANNER -->
      <div class="rejected-banner" v-if="profile?.status === 'rejected'">
        <div class="pending-icon">⚠️</div>
        <div class="pending-text">
          <div class="pending-title">Your profile was not approved</div>
          <div class="pending-sub">{{ profile?.rejectionReason || 'Please update your profile and portfolio, then contact us to reapply.' }}</div>
        </div>
      </div>

      <!-- STATS -->
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-num">{{ stats.views }}</div><div class="stat-label">Profile Views</div><div class="stat-trend">↑ 12% this week</div></div>
        <div class="stat-card"><div class="stat-num">{{ stats.matches }}</div><div class="stat-label">Quiz Matches</div><div class="stat-trend">↑ 8% this week</div></div>
        <div class="stat-card"><div class="stat-num">{{ stats.inquiries }}</div><div class="stat-label">Inquiries</div><div class="stat-trend">{{ stats.unread }} unread</div></div>
        <div class="stat-card"><div class="stat-num">{{ stats.matchRate }}%</div><div class="stat-label">Avg Match Rate</div><div class="stat-trend">Top 15% on WedChem</div></div>
      </div>

      <!-- QUICK LINKS -->
      <div class="quick-grid">
        <router-link to="/dashboard/profile" class="quick-card">
          <div class="qc-icon">✏️</div><div class="qc-title">Edit Profile</div><div class="qc-sub">Update photos, bio, pricing</div>
        </router-link>
        <router-link to="/dashboard/quiz" class="quick-card">
          <div class="qc-icon">🎨</div><div class="qc-title">Style Quiz</div><div class="qc-sub">Retake or update your style profile</div>
        </router-link>
        <router-link to="/dashboard/inquiries" class="quick-card">
          <div class="qc-icon">💌</div><div class="qc-title">Inquiries</div><div class="qc-sub">{{ stats.unread }} new messages</div>
        </router-link>
        <router-link :to="'/photographer/'+authStore.uid" class="quick-card">
          <div class="qc-icon">👁️</div><div class="qc-title">View Public Profile</div><div class="qc-sub">See what couples see</div>
        </router-link>
      </div>

      <!-- RECENT INQUIRIES -->
      <div class="dash-section">
        <div class="ds-header">
          <h2 class="ds-title">Recent Inquiries</h2>
          <router-link to="/dashboard/inquiries" class="ds-link">View All →</router-link>
        </div>
        <div class="inquiry-list">
          <div class="inquiry-card" v-for="inq in recentInquiries" :key="inq.id">
            <div class="inq-avatar">{{ inq.initials }}</div>
            <div class="inq-info">
              <div class="inq-name">{{ inq.name }}</div>
              <div class="inq-date">{{ inq.weddingDate }} · {{ inq.location }}</div>
              <div class="inq-msg">{{ inq.message }}</div>
            </div>
            <div class="inq-meta">
              <span class="inq-badge" :class="inq.status">{{ inq.status }}</span>
              <span class="inq-time">{{ inq.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TIER STATUS -->
      <div class="tier-banner" v-if="profile?.tier!=='featured'">
        <div class="tier-text">
          <div class="tier-title">Upgrade to Featured</div>
          <div class="tier-sub">Get 3x more visibility in match results, a Featured badge, and advanced analytics.</div>
        </div>
        <router-link to="/dashboard/upgrade" class="btn-primary" style="background:var(--terracotta);flex-shrink:0;">Upgrade for $25/mo →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const profile = computed(() => authStore.photographerProfile)

const stats = ref({ views:247, matches:89, inquiries:12, unread:3, matchRate:82 })

const recentInquiries = ref([
  { id:1, name:'Sarah & James', initials:'S&J', weddingDate:'Oct 15, 2026', location:'Portland, OR', message:'We loved your portfolio! We\'re having an outdoor ceremony at a vineyard...', status:'new', time:'2h ago' },
  { id:2, name:'Emily & Tom', initials:'E&T', weddingDate:'Aug 22, 2026', location:'Bend, OR', message:'Hi! We\'re planning an intimate elopement in the mountains and your style is exactly...', status:'new', time:'5h ago' },
  { id:3, name:'Maya & Jordan', initials:'M&J', weddingDate:'Jun 8, 2026', location:'Seattle, WA', message:'Your documentary approach really resonated with us. Would love to chat about availability...', status:'read', time:'1d ago' },
])
</script>

<style scoped>
.dash-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.dash-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; flex-wrap:wrap; gap:16px; }
.dash-title { font-family:var(--font-display); font-size:2rem; font-weight:400; margin-bottom:4px; }
.dash-sub { color:var(--warm-gray); font-size:0.92rem; }
.dash-actions { display:flex; gap:12px; }

.pending-banner { display:flex; gap:16px; padding:24px; background:rgba(201,169,110,0.1); border:1px solid rgba(201,169,110,0.3); border-radius:var(--radius-lg); margin-bottom:24px; align-items:center; }
.rejected-banner { display:flex; gap:16px; padding:24px; background:rgba(196,130,106,0.1); border:1px solid rgba(196,130,106,0.3); border-radius:var(--radius-lg); margin-bottom:24px; align-items:center; }
.pending-icon { font-size:2rem; flex-shrink:0; }
.pending-title { font-weight:500; margin-bottom:2px; }
.pending-sub { font-size:0.88rem; color:var(--warm-gray); }

.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
.stat-card { background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:24px; }
.stat-num { font-family:var(--font-display); font-size:2.2rem; font-weight:300; margin-bottom:4px; }
.stat-label { font-size:0.82rem; color:var(--warm-gray); margin-bottom:8px; }
.stat-trend { font-size:0.78rem; color:var(--sage-dark); font-weight:500; }

.quick-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:48px; }
.quick-card { display:block; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:24px; transition:var(--transition); }
.quick-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:var(--sage); }
.qc-icon { font-size:1.8rem; margin-bottom:12px; }
.qc-title { font-weight:500; font-size:0.95rem; margin-bottom:4px; }
.qc-sub { font-size:0.82rem; color:var(--warm-gray); }

.dash-section { margin-bottom:48px; }
.ds-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.ds-title { font-family:var(--font-display); font-size:1.5rem; font-weight:500; }
.ds-link { font-size:0.85rem; color:var(--terracotta); font-weight:500; }

.inquiry-list { display:flex; flex-direction:column; gap:12px; }
.inquiry-card { display:flex; gap:16px; padding:20px; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius); transition:var(--transition); }
.inquiry-card:hover { border-color:var(--sage); }
.inq-avatar { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,var(--sage-light),var(--blush)); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:0.9rem; flex-shrink:0; }
.inq-info { flex:1; min-width:0; }
.inq-name { font-weight:500; font-size:0.95rem; margin-bottom:2px; }
.inq-date { font-size:0.8rem; color:var(--warm-gray); margin-bottom:6px; }
.inq-msg { font-size:0.85rem; color:var(--warm-gray); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.inq-meta { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }
.inq-badge { padding:3px 10px; border-radius:100px; font-size:0.7rem; font-weight:600; text-transform:uppercase; }
.inq-badge.new { background:rgba(196,130,106,0.1); color:var(--terracotta); }
.inq-badge.read { background:var(--light-gray); color:var(--warm-gray); }
.inq-time { font-size:0.75rem; color:var(--warm-gray); }

.tier-banner { display:flex; align-items:center; gap:24px; padding:32px; background:linear-gradient(135deg,var(--charcoal),#3a3535); border-radius:var(--radius-lg); color:var(--cream); }
.tier-title { font-family:var(--font-display); font-size:1.3rem; font-weight:500; margin-bottom:4px; }
.tier-sub { font-size:0.88rem; color:rgba(250,247,242,0.6); }

@media(max-width:1024px) { .stats-grid,.quick-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:768px) { .stats-grid,.quick-grid { grid-template-columns:1fr; } .tier-banner { flex-direction:column; text-align:center; } }
</style>
