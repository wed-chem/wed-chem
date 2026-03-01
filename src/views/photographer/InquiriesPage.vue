<template>
  <div class="inq-page">
    <div class="container">
      <div class="edit-header"><h1 class="section-title">Inquiries</h1><router-link to="/dashboard" class="btn-secondary btn-sm">← Dashboard</router-link></div>
      <div class="inq-tabs">
        <button class="inq-tab" :class="{active:tab==='all'}" @click="tab='all'">All ({{ inquiries.length }})</button>
        <button class="inq-tab" :class="{active:tab==='new'}" @click="tab='new'">New ({{ inquiries.filter(i=>i.status==='new').length }})</button>
        <button class="inq-tab" :class="{active:tab==='read'}" @click="tab='read'">Read</button>
      </div>
      <div class="inq-list">
        <div class="inq-card" v-for="inq in filteredInquiries" :key="inq.id" @click="selected=inq">
          <div class="inq-dot" v-if="inq.status==='new'"></div>
          <div class="inq-av">{{ inq.initials }}</div>
          <div class="inq-body">
            <div class="inq-top"><span class="inq-name">{{ inq.name }}</span><span class="inq-time">{{ inq.time }}</span></div>
            <div class="inq-date">{{ inq.weddingDate }} · {{ inq.location }}</div>
            <div class="inq-msg">{{ inq.message }}</div>
          </div>
        </div>
        <div v-if="!filteredInquiries.length" style="text-align:center;padding:60px 0;color:var(--warm-gray);">No inquiries yet. They'll show up here when couples reach out.</div>
      </div>
      <!-- Detail modal -->
      <div class="modal-overlay" v-if="selected" @click.self="selected=null">
        <div class="modal-card">
          <button class="modal-close" @click="selected=null">✕</button>
          <h3 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:4px;">{{ selected.name }}</h3>
          <div style="font-size:0.85rem;color:var(--warm-gray);margin-bottom:4px;">{{ selected.email }}</div>
          <div style="font-size:0.85rem;color:var(--warm-gray);margin-bottom:20px;">Wedding: {{ selected.weddingDate }} · {{ selected.location }}</div>
          <div style="font-size:0.95rem;line-height:1.7;color:var(--charcoal);margin-bottom:24px;white-space:pre-line;">{{ selected.message }}</div>
          <a :href="'mailto:'+selected.email" class="btn-primary" style="display:inline-flex;">Reply via Email →</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const tab = ref('all'); const selected = ref(null)
const inquiries = ref([
  { id:1, name:'Sarah & James', initials:'S&J', email:'sarah.james@email.com', weddingDate:'Oct 15, 2026', location:'Portland, OR', message:'We loved your portfolio! We\'re having an outdoor ceremony at a vineyard and your natural light style is exactly what we\'re looking for. Are you available for our date?\n\nOur guest count is around 120 and we\'d love a second shooter if possible.', status:'new', time:'2h ago' },
  { id:2, name:'Emily & Tom', initials:'E&T', email:'emily.t@email.com', weddingDate:'Aug 22, 2026', location:'Bend, OR', message:'Hi! We\'re planning an intimate elopement in the mountains and your style is exactly what we envisioned. Would love to discuss packages!', status:'new', time:'5h ago' },
  { id:3, name:'Maya & Jordan', initials:'M&J', email:'maya.jordan@email.com', weddingDate:'Jun 8, 2026', location:'Seattle, WA', message:'Your documentary approach really resonated with us. Would love to chat about availability and your process.', status:'read', time:'1d ago' },
  { id:4, name:'Alex & Chris', initials:'A&C', email:'alex.c@email.com', weddingDate:'Sep 5, 2026', location:'Lake Tahoe, CA', message:'We found you through WedChem and our match score was 94%! We\'d love to learn more about destination wedding packages.', status:'read', time:'3d ago' },
])
const filteredInquiries = computed(() => tab.value==='all' ? inquiries.value : inquiries.value.filter(i=>i.status===tab.value))
</script>
<style scoped>
.inq-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.edit-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
.inq-tabs { display:flex; gap:8px; margin-bottom:24px; }
.inq-tab { padding:8px 20px; border-radius:100px; font-size:0.85rem; border:1.5px solid var(--light-gray); color:var(--warm-gray); transition:var(--transition); }
.inq-tab.active { background:var(--charcoal); color:var(--cream); border-color:var(--charcoal); }
.inq-list { display:flex; flex-direction:column; gap:12px; }
.inq-card { display:flex; gap:16px; padding:20px; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius); cursor:pointer; transition:var(--transition); position:relative; }
.inq-card:hover { border-color:var(--sage); }
.inq-dot { position:absolute; top:24px; left:8px; width:8px; height:8px; border-radius:50%; background:var(--terracotta); }
.inq-av { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,var(--sage-light),var(--blush)); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:0.85rem; flex-shrink:0; }
.inq-body { flex:1; min-width:0; }
.inq-top { display:flex; justify-content:space-between; margin-bottom:2px; }
.inq-name { font-weight:500; font-size:0.95rem; }
.inq-time { font-size:0.78rem; color:var(--warm-gray); }
.inq-date { font-size:0.8rem; color:var(--warm-gray); margin-bottom:6px; }
.inq-msg { font-size:0.85rem; color:var(--warm-gray); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.modal-overlay { position:fixed; inset:0; z-index:2000; background:rgba(44,44,44,0.5); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:24px; }
.modal-card { background:var(--warm-white); border-radius:var(--radius-lg); padding:40px; max-width:560px; width:100%; max-height:80vh; overflow-y:auto; position:relative; box-shadow:var(--shadow-lg); }
.modal-close { position:absolute; top:16px; right:16px; font-size:1.2rem; color:var(--warm-gray); padding:8px; }
</style>
