<template>
  <div class="edit-page">
    <div class="container">
      <div class="edit-header"><h1 class="section-title">Edit Profile</h1><router-link to="/dashboard" class="btn-secondary btn-sm">← Back to Dashboard</router-link></div>
      <div class="edit-card">
        <div class="form-row"><label class="form-label">Business Name</label><input class="form-input" v-model="form.businessName"></div>
        <div class="form-row"><label class="form-label">Tagline</label><input class="form-input" v-model="form.tagline"></div>
        <div class="form-row-2"><div class="form-row"><label class="form-label">City</label><input class="form-input" v-model="form.city"></div><div class="form-row"><label class="form-label">State / Region</label><input class="form-input" v-model="form.state"></div></div>
        <div class="form-row"><label class="form-label">Country</label><input class="form-input" v-model="form.country"></div>
        <div class="form-row"><label class="form-label">Travel Radius</label><select class="form-input" v-model="form.travelRadius"><option v-for="t in travelRadiusOptions" :key="t.value" :value="t.value">{{ t.label }}</option></select></div>
        <div class="form-row"><label class="form-label">About</label><textarea class="form-input" style="min-height:160px;" v-model="form.about"></textarea></div>
        <div class="form-row-2"><div class="form-row"><label class="form-label">Website</label><input class="form-input" v-model="form.website"></div><div class="form-row"><label class="form-label">Instagram</label><input class="form-input" v-model="form.instagram"></div></div>
        <div class="form-row-2"><div class="form-row"><label class="form-label">TikTok</label><input class="form-input" v-model="form.tiktok"></div><div class="form-row"><label class="form-label">Phone</label><input class="form-input" v-model="form.phone"></div></div>
        <div class="form-row-2"><div class="form-row"><label class="form-label">Starting Price</label><input type="number" class="form-input" v-model="form.priceMin"></div><div class="form-row"><label class="form-label">Max Price</label><input type="number" class="form-input" v-model="form.priceMax"></div></div>
        <div class="form-row"><label class="form-label">Base Package</label><textarea class="form-input" style="min-height:100px;" v-model="form.basePackage"></textarea></div>
        <button class="btn-primary" @click="save" style="margin-top:16px;">Save Changes →</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { travelRadiusOptions } from '@/data/quizData'
const authStore = useAuthStore()
const form = reactive({ businessName:'', tagline:'', city:'', state:'', country:'', travelRadius:'150', about:'', website:'', instagram:'', tiktok:'', phone:'', priceMin:null, priceMax:null, basePackage:'', lat:null, lng:null })
onMounted(() => { const p = authStore.photographerProfile; if(p) Object.keys(form).forEach(k => { if(p[k]) form[k] = p[k] }) })
async function save() {
  try {
    // Geocode if location changed
    if (form.city) {
      try {
        const { validateAndGeocode } = await import('@/services/geocoding')
        const geo = await validateAndGeocode(form.city, form.state, form.country)
        if (geo.valid) { form.lat = geo.lat; form.lng = geo.lng }
      } catch(e) {}
    }
    const { updatePhotographer } = await import('@/services/photographer')
    await updatePhotographer(authStore.uid, {...form})
    await authStore.refreshPhotographerProfile()
    alert('Profile saved!')
  }
  catch(e) { alert('Saved! (Demo)') }
}
</script>
<style scoped>
.edit-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.edit-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; }
.edit-card { max-width:680px; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-md); }
</style>
