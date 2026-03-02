<template>
  <div class="upgrade-page">
    <div class="container">
      <div style="max-width:600px;margin:0 auto;text-align:center;">
        <div class="section-eyebrow" style="margin-bottom:16px;">Upgrade</div>
        <h1 class="section-title">Get in front of more couples</h1>
        <p style="color:var(--warm-gray);margin-bottom:16px;line-height:1.7;">Featured photographers show up first in match results, sit at the top of the directory, and rotate on the homepage. One booking covers years of Featured.</p>
        <p style="color:var(--sage-dark);font-weight:500;margin-bottom:48px;font-size:0.9rem;">No commission. No contracts. Cancel anytime.</p>
        <div class="upgrade-cards">
          <div class="up-card" :class="{sel:plan==='monthly'}" @click="plan='monthly'">
            <div class="up-label">Monthly</div>
            <div class="up-price"><span class="up-cur">$</span>25<span class="up-per">/mo</span></div>
            <div class="up-note">Cancel anytime</div>
          </div>
          <div class="up-card" :class="{sel:plan==='yearly'}" @click="plan='yearly'">
            <div class="up-save">Save 17%</div>
            <div class="up-label">Yearly</div>
            <div class="up-price"><span class="up-cur">$</span>250<span class="up-per">/yr</span></div>
            <div class="up-note">$20.83/mo billed annually</div>
          </div>
        </div>
        <ul class="up-features">
          <li>Show up first when couples get their results — not buried on page two</li>
          <li>Gold "Featured" badge that signals quality before they even click</li>
          <li>Listed above every free profile in the directory</li>
          <li>Rotate on the homepage so couples find you before they search</li>
          <li>Analytics: see which styles and locations drive your views</li>
          <li>Match rate insights — know how you compare</li>
          <li>Priority support from the WedChem team</li>
        </ul>
        <div v-if="error" style="color:var(--terracotta);font-size:0.85rem;margin-bottom:12px;">{{ error }}</div>
        <button class="btn-primary" style="width:100%;max-width:400px;justify-content:center;background:var(--terracotta);" @click="handleUpgrade" :disabled="loading">{{ loading ? 'Processing...' : 'Upgrade Now →' }}</button>
        <div style="font-size:0.78rem;color:var(--warm-gray);margin-top:12px;">Secure payment via Stripe. Cancel anytime.</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSEO } from '@/composables/useSEO'

useSEO({ title: 'Upgrade to Featured', description: 'Get featured placement on WedChem for $25/mo.', path: '/dashboard/upgrade' })

const authStore = useAuthStore()
const plan = ref('monthly')
const loading = ref(false)
const error = ref('')

async function handleUpgrade() {
  loading.value = true; error.value = ''
  try {
    const { createCheckoutSession } = await import('@/services/stripe')
    await createCheckoutSession(authStore.uid, plan.value === 'monthly' ? 'featured_monthly' : 'featured_yearly')
  } catch(e) {
    error.value = 'Could not start checkout. Please try again or contact support.'
    console.error(e)
  }
  loading.value = false
}
</script>
<style scoped>
.upgrade-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.upgrade-cards { display:grid; grid-template-columns:1fr 1fr; gap:16px; max-width:400px; margin:0 auto 40px; }
.up-card { padding:28px; border:2px solid var(--light-gray); border-radius:var(--radius-lg); cursor:pointer; transition:var(--transition); position:relative; }
.up-card:hover { border-color:var(--sage); }
.up-card.sel { border-color:var(--terracotta); box-shadow:0 0 0 3px rgba(196,130,106,0.2); }
.up-save { position:absolute; top:-10px; right:12px; padding:2px 10px; background:var(--sage); color:white; border-radius:100px; font-size:0.7rem; font-weight:600; }
.up-label { font-size:0.82rem; color:var(--warm-gray); font-weight:500; margin-bottom:8px; }
.up-price { font-family:var(--font-display); font-size:2.5rem; font-weight:300; }
.up-cur { font-size:1rem; color:var(--warm-gray); }
.up-per { font-size:0.88rem; color:var(--warm-gray); }
.up-note { font-size:0.78rem; color:var(--warm-gray); margin-top:4px; }
.up-features { list-style:none; text-align:left; max-width:400px; margin:0 auto 32px; }
.up-features li { padding:10px 0; font-size:0.92rem; color:var(--warm-gray); display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--light-gray); }
.up-features li::before { content:'✓'; color:var(--terracotta); font-weight:600; }
</style>
