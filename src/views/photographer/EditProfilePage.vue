<template>
  <div class="edit-page">
    <div class="container">
      <div class="edit-header">
        <h1 class="section-title">Edit Profile</h1>
        <div style="display:flex;gap:12px;">
          <router-link :to="'/photographer/'+authStore.uid" class="btn-secondary btn-sm">View Public Profile</router-link>
          <router-link to="/dashboard" class="btn-secondary btn-sm">← Dashboard</router-link>
        </div>
      </div>

      <!-- PHOTOS SECTION -->
      <div class="edit-section">
        <h2 class="es-title">Photos</h2>

        <!-- Headshot -->
        <div class="photo-row">
          <div class="photo-label">Profile Photo</div>
          <div class="headshot-wrap" @click="$refs.headshotInput.click()">
            <input type="file" ref="headshotInput" accept="image/*" @change="uploadHeadshotFile" hidden>
            <img v-if="profile?.avatar" :src="profile.avatar" class="headshot-current">
            <div v-else class="headshot-empty">{{ initials }}</div>
            <div class="photo-overlay"><span>Change</span></div>
          </div>
        </div>

        <!-- Cover Photo -->
        <div class="photo-row">
          <div class="photo-label">Cover Photo</div>
          <div class="cover-wrap" @click="$refs.coverInput.click()">
            <input type="file" ref="coverInput" accept="image/*" @change="uploadCoverFile" hidden>
            <img v-if="profile?.coverPhoto" :src="profile.coverPhoto" class="cover-current">
            <div v-else class="cover-empty">Click to upload cover photo<br><span style="font-size:0.78rem;">Landscape photo recommended (e.g. 1600×600)</span></div>
            <div class="photo-overlay"><span>Change</span></div>
          </div>
        </div>

        <!-- Portfolio -->
        <div class="photo-row">
          <div class="photo-label">Portfolio ({{ currentPortfolio.length }}/20)</div>
          <div class="portfolio-edit-grid">
            <div class="portfolio-edit-thumb" v-for="(url, i) in currentPortfolio" :key="i">
              <img :src="url" class="pet-img">
              <button class="pet-remove" @click="removePortfolioPhoto(i)">✕</button>
            </div>
            <div class="portfolio-edit-add" @click="$refs.addPortfolioInput.click()" v-if="currentPortfolio.length < 20">
              <input type="file" ref="addPortfolioInput" accept="image/*" multiple @change="addPortfolioFiles" hidden>
              <span>+ Add</span>
            </div>
          </div>
        </div>
      </div>

      <!-- INFO SECTION -->
      <div class="edit-section">
        <h2 class="es-title">Basic Info</h2>
        <div class="edit-card">
          <div class="form-row"><label class="form-label">Business Name</label><input class="form-input" v-model="form.businessName"></div>
          <div class="form-row"><label class="form-label">Tagline</label><input class="form-input" v-model="form.tagline" placeholder="One sentence about your style"></div>
          <div class="form-row-2">
            <div class="form-row"><label class="form-label">City</label><input class="form-input" v-model="form.city"></div>
            <div class="form-row"><label class="form-label">State / Region</label><input class="form-input" v-model="form.state"></div>
          </div>
          <div class="form-row-2">
            <div class="form-row"><label class="form-label">Country</label><input class="form-input" v-model="form.country"></div>
            <div class="form-row"><label class="form-label">Travel Radius</label><select class="form-input" v-model="form.travelRadius"><option v-for="t in travelRadiusOptions" :key="t.value" :value="t.value">{{ t.label }}</option></select></div>
          </div>
          <div class="form-row"><label class="form-label">About</label><textarea class="form-input" style="min-height:160px;" v-model="form.about" placeholder="Tell couples about yourself, your approach, your story..."></textarea></div>
        </div>
      </div>

      <!-- SERVICES SECTION -->
      <div class="edit-section">
        <h2 class="es-title">Services & Pricing</h2>
        <div class="edit-card">
          <div class="form-row-2">
            <div class="form-row"><label class="form-label">Starting Price ($)</label><input type="number" class="form-input" v-model="form.priceMin"></div>
            <div class="form-row"><label class="form-label">Max Price ($)</label><input type="number" class="form-input" v-model="form.priceMax"></div>
          </div>
          <div class="form-row"><label class="form-label">Base Package Description</label><textarea class="form-input" style="min-height:120px;" v-model="form.basePackage" placeholder="8 hours of coverage&#10;Second shooter&#10;Online gallery&#10;500+ edited images"></textarea></div>
          <div class="form-row"><label class="form-label">Turnaround</label><select class="form-input" v-model="form.turnaround"><option>2–4 weeks</option><option>4–6 weeks</option><option>6–8 weeks</option><option>8–12 weeks</option></select></div>
          <div class="form-row"><label class="form-label">Years of Experience</label><select class="form-input" v-model="form.yearsExperience"><option>Under 1 year</option><option>1–3 years</option><option>3–5 years</option><option>5–10 years</option><option>10+ years</option></select></div>
          <div class="form-row"><label class="form-label">Add-Ons</label>
            <div class="tag-group">
              <label class="tag-chip" v-for="a in addOnServices" :key="a" :class="{active: form.addOns.includes(a)}">
                <input type="checkbox" :value="a" v-model="form.addOns" hidden>{{ a }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- SOCIAL SECTION -->
      <div class="edit-section">
        <h2 class="es-title">Social & Contact</h2>
        <div class="edit-card">
          <div class="form-row"><label class="form-label">Website</label><input class="form-input" v-model="form.website" placeholder="https://yoursite.com"></div>
          <div class="form-row-2">
            <div class="form-row"><label class="form-label">Instagram</label><input class="form-input" v-model="form.instagram" placeholder="@yourstudio"></div>
            <div class="form-row"><label class="form-label">TikTok</label><input class="form-input" v-model="form.tiktok" placeholder="@yourstudio"></div>
          </div>
          <div class="form-row"><label class="form-label">Phone</label><input class="form-input" v-model="form.phone" placeholder="Optional — not shown publicly"></div>
        </div>
      </div>

      <!-- SAVE -->
      <div class="save-bar">
        <div class="save-status" :style="{color: saveMsg.includes('Error') || saveMsg.includes('Could not') ? '#c44' : 'var(--sage-dark)'}">{{ saveMsg }}</div>
        <button class="btn-primary" @click="save" :disabled="saving">{{ saving ? 'Saving...' : 'Save All Changes →' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { travelRadiusOptions, addOnServices } from '@/data/quizData'

const authStore = useAuthStore()
const profile = computed(() => authStore.photographerProfile)
const saving = ref(false)
const saveMsg = ref('')
const currentPortfolio = ref([])

const initials = computed(() => {
  const name = profile.value?.businessName || ''
  return name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
})

const form = reactive({
  businessName: '', tagline: '', city: '', state: '', country: '',
  travelRadius: '150', about: '', website: '', instagram: '', tiktok: '',
  phone: '', priceMin: null, priceMax: null, basePackage: '',
  turnaround: '', yearsExperience: '', addOns: [], lat: null, lng: null
})

onMounted(() => {
  const p = profile.value
  if (p) {
    Object.keys(form).forEach(k => { if (p[k] != null) form[k] = p[k] })
    if (!Array.isArray(form.addOns)) form.addOns = []
    // Load portfolio URLs
    if (p.portfolio) {
      currentPortfolio.value = p.portfolio.map(ph => typeof ph === 'string' ? ph : ph?.url).filter(Boolean)
    }
  }
})

async function uploadHeadshotFile(e) {
  const f = e.target.files[0]; if (!f) return
  saveMsg.value = 'Uploading headshot...'
  try {
    const { uploadHeadshot } = await import('@/services/photographer')
    await uploadHeadshot(authStore.uid, f)
    await authStore.refreshPhotographerProfile()
    saveMsg.value = 'Headshot updated!'
  } catch (e) { saveMsg.value = 'Upload failed: ' + e.message }
  setTimeout(() => saveMsg.value = '', 3000)
}

async function uploadCoverFile(e) {
  const f = e.target.files[0]; if (!f) return
  saveMsg.value = 'Uploading cover photo...'
  try {
    const { uploadCoverPhoto } = await import('@/services/photographer')
    await uploadCoverPhoto(authStore.uid, f)
    await authStore.refreshPhotographerProfile()
    saveMsg.value = 'Cover photo updated!'
  } catch (e) { saveMsg.value = 'Upload failed: ' + e.message }
  setTimeout(() => saveMsg.value = '', 3000)
}

async function addPortfolioFiles(e) {
  const files = Array.from(e.target.files)
  if (!files.length) return
  saveMsg.value = `Uploading ${files.length} photo${files.length > 1 ? 's' : ''}...`
  try {
    const { uploadPortfolioPhoto, savePortfolio } = await import('@/services/photographer')
    for (const f of files) {
      if (currentPortfolio.value.length >= 20) break
      const url = await uploadPortfolioPhoto(authStore.uid, f, currentPortfolio.value.length)
      currentPortfolio.value.push(url)
    }
    await savePortfolio(authStore.uid, currentPortfolio.value.map(url => ({ url })))
    await authStore.refreshPhotographerProfile()
    saveMsg.value = 'Portfolio updated!'
  } catch (e) { saveMsg.value = 'Upload failed: ' + e.message }
  setTimeout(() => saveMsg.value = '', 3000)
}

async function removePortfolioPhoto(index) {
  currentPortfolio.value.splice(index, 1)
  try {
    const { savePortfolio } = await import('@/services/photographer')
    await savePortfolio(authStore.uid, currentPortfolio.value.map(url => ({ url })))
    await authStore.refreshPhotographerProfile()
  } catch (e) { console.error(e) }
}

async function save() {
  saving.value = true; saveMsg.value = ''
  try {
    if (form.city) {
      form.city = form.city.trim().toLowerCase()
      form.state = form.state.trim().toLowerCase()
      form.country = form.country.trim().toLowerCase()
      const { validateAndGeocode } = await import('@/services/geocoding')
      const geo = await validateAndGeocode(form.city, form.state, form.country)
      if (!geo.valid) {
        saveMsg.value = 'Could not verify location. Please check city, state, and country.'
        saving.value = false
        return
      }
      form.lat = geo.lat; form.lng = geo.lng
    }
    const { updatePhotographer } = await import('@/services/photographer')
    await updatePhotographer(authStore.uid, { ...form })
    await authStore.refreshPhotographerProfile()
    saveMsg.value = 'All changes saved!'
  } catch (e) { saveMsg.value = 'Error saving: ' + e.message }
  saving.value = false
  setTimeout(() => saveMsg.value = '', 4000)
}
</script>

<style scoped>
.edit-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.edit-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; flex-wrap:wrap; gap:12px; }

.edit-section { margin-bottom:40px; }
.es-title { font-family:var(--font-display); font-size:1.3rem; font-weight:500; margin-bottom:20px; padding-bottom:10px; border-bottom:1px solid var(--light-gray); }
.edit-card { background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:32px; }

/* Photos */
.photo-row { margin-bottom:28px; }
.photo-label { font-size:0.88rem; font-weight:500; margin-bottom:10px; }

.headshot-wrap { position:relative; width:120px; height:120px; border-radius:50%; overflow:hidden; cursor:pointer; border:3px solid var(--light-gray); }
.headshot-current { width:100%; height:100%; object-fit:cover; }
.headshot-empty { width:100%; height:100%; background:linear-gradient(135deg, var(--sage-light), var(--blush)); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:2rem; color:var(--charcoal); }

.cover-wrap { position:relative; width:100%; height:200px; border-radius:var(--radius-lg); overflow:hidden; cursor:pointer; border:2px solid var(--light-gray); }
.cover-current { width:100%; height:100%; object-fit:cover; }
.cover-empty { width:100%; height:100%; background:var(--light-gray); display:flex; align-items:center; justify-content:center; color:var(--warm-gray); font-size:0.9rem; }

.photo-overlay { position:absolute; inset:0; background:rgba(44,44,44,0.5); display:flex; align-items:center; justify-content:center; opacity:0; transition:var(--transition); }
.photo-overlay span { color:white; font-size:0.85rem; font-weight:600; padding:6px 16px; border:1.5px solid white; border-radius:100px; }
.headshot-wrap:hover .photo-overlay, .cover-wrap:hover .photo-overlay { opacity:1; }

.portfolio-edit-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:12px; }
.portfolio-edit-thumb { position:relative; border-radius:var(--radius); overflow:hidden; aspect-ratio:1; }
.pet-img { width:100%; height:100%; object-fit:cover; display:block; }
.pet-remove { position:absolute; top:6px; right:6px; width:24px; height:24px; border-radius:50%; background:rgba(44,44,44,0.7); color:white; font-size:0.75rem; display:flex; align-items:center; justify-content:center; opacity:0; transition:var(--transition); cursor:pointer; border:none; }
.portfolio-edit-thumb:hover .pet-remove { opacity:1; }
.portfolio-edit-add { aspect-ratio:1; border:2px dashed var(--light-gray); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--warm-gray); font-size:0.88rem; transition:var(--transition); }
.portfolio-edit-add:hover { border-color:var(--sage); color:var(--sage-dark); background:rgba(139,158,130,0.04); }

/* Tags */
.tag-group { display:flex; flex-wrap:wrap; gap:8px; }
.tag-chip { display:inline-block; padding:8px 16px; border:1.5px solid var(--light-gray); border-radius:100px; font-size:0.82rem; cursor:pointer; transition:var(--transition); user-select:none; }
.tag-chip.active { background:rgba(139,158,130,0.15); border-color:var(--sage); color:var(--sage-dark); font-weight:500; }

/* Save bar */
.save-bar { display:flex; align-items:center; justify-content:flex-end; gap:16px; padding:24px 0; border-top:1px solid var(--light-gray); position:sticky; bottom:0; background:var(--cream); z-index:10; }
.save-status { font-size:0.88rem; font-weight:500; }

@media(max-width:768px) {
  .portfolio-edit-grid { grid-template-columns:repeat(3, 1fr); }
  .cover-wrap { height:150px; }
}
</style>
