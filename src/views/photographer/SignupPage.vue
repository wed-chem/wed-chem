<template>
  <div class="signup-page">
    <div class="container">
      <div class="signup-card">
        <!-- PROGRESS -->
        <div class="step-bar">
          <div class="step-item" v-for="(s,i) in stepLabels" :key="i" :class="{active:step===i+1, done:step>i+1}">
            <div class="step-num">{{ step>i+1 ? '✓' : i+1 }}</div>
            <div class="step-label">{{ s }}</div>
          </div>
        </div>

        <!-- STEP 1: BASICS -->
        <div v-if="step===1" class="step-content">
          <h2 class="step-title">Let's start with the basics</h2>
          <p class="step-sub">Tell us about you and your business</p>
          <div class="form-row-2"><div class="form-row"><label class="form-label">First Name</label><input class="form-input" v-model="form.firstName" placeholder="Ava"></div><div class="form-row"><label class="form-label">Last Name</label><input class="form-input" v-model="form.lastName" placeholder="Chen"></div></div>
          <div class="form-row"><label class="form-label">Business Name</label><input class="form-input" v-model="form.businessName" placeholder="Ava Chen Photography"></div>
          <div class="form-row"><label class="form-label">Email</label><input type="email" class="form-input" v-model="form.email" placeholder="ava@email.com"></div>
          <div class="form-row"><label class="form-label">Password</label><input type="password" class="form-input" v-model="form.password" placeholder="8+ characters"></div>
          <div class="form-row"><label class="form-label">Phone (optional)</label><input class="form-input" v-model="form.phone" placeholder="(503) 555-0123"></div>
          <div class="form-row-2"><div class="form-row"><label class="form-label">City</label><input class="form-input" v-model="form.city" placeholder="Portland"></div><div class="form-row"><label class="form-label">State / Region</label><input class="form-input" v-model="form.state" placeholder="Oregon"></div></div>
          <div class="form-row"><label class="form-label">Country</label><input class="form-input" v-model="form.country" placeholder="United States"></div>
          <div class="form-row"><label class="form-label">How far are you willing to travel?</label><select class="form-input" v-model="form.travelRadius"><option v-for="t in travelRadiusOptions" :key="t.value" :value="t.value">{{ t.label }}</option></select></div>
          <div class="form-row"><label class="form-label">Website (optional)</label><input class="form-input" v-model="form.website" placeholder="https://yoursite.com"></div>
        </div>

        <!-- STEP 2: STYLE QUIZ -->
        <div v-if="step===2" class="step-content">
          <h2 class="step-title">Define your style</h2>
          <p class="step-sub">Complete your visual profile so our algorithm can match you with the right couples.</p>

          <!-- Sub-step progress -->
          <div class="quiz-progress"><div class="qp-bar"><div class="qp-fill" :style="{width: quizProgress + '%'}"></div></div><div class="qp-text">{{ quizStepLabel }}</div></div>

          <!-- 2a: Editing Styles -->
          <div v-if="quizStep==='editing'">
            <div class="quiz-q">What editing styles describe your work?</div>
            <div class="quiz-sub">Select in order of preference (first = primary style)</div>
            <div class="rank-grid">
              <button class="rank-card" v-for="style in editingStyles" :key="style.id"
                :class="{selected: quiz.editingStyles.includes(style.id)}"
                @click="toggleList(quiz.editingStyles, style.id)">
                <div class="rank-preview" :style="{background: style.gradient}"></div>
                <div class="rank-label">{{ style.label }}</div>
                <div class="rank-desc">{{ style.description }}</div>
                <div class="rank-number" v-if="quiz.editingStyles.includes(style.id)">
                  {{ quiz.editingStyles.indexOf(style.id) + 1 }}
                </div>
              </button>
            </div>
          </div>

          <!-- 2b: Photo Styles -->
          <div v-if="quizStep==='photoStyle'">
            <div class="quiz-q">What photo styles describe your work?</div>
            <div class="quiz-sub">Select in order of preference (pick 1–3)</div>
            <div class="style-rank-grid">
              <button class="style-rank-card" v-for="style in photoStyles" :key="style.id"
                :class="{selected: quiz.photoStyles.includes(style.id)}"
                @click="toggleList(quiz.photoStyles, style.id)">
                <img class="style-rank-img" v-if="style.image" :src="style.image" :alt="style.label">
                <div class="style-rank-body">
                  <div class="rank-label">{{ style.label }}</div>
                  <div class="rank-desc">{{ style.description }}</div>
                </div>
                <div class="rank-number" v-if="quiz.photoStyles.includes(style.id)">
                  {{ quiz.photoStyles.indexOf(style.id) + 1 }}
                </div>
              </button>
            </div>
          </div>

          <!-- 2c: Saturation -->
          <div v-if="quizStep==='saturation'">
            <div class="quiz-q">{{ saturationQuestion.question }}</div>
            <div class="quiz-sub">Pick the one that best represents your editing</div>
            <div class="quiz-pair">
              <div class="quiz-opt" :class="{sel:quiz.saturation==='a'}" @click="quiz.saturation='a'">
                <div class="quiz-img" :style="{background:saturationQuestion.a.gradient}"></div>
                <div class="quiz-lbl">{{ saturationQuestion.a.label }}</div>
              </div>
              <div class="quiz-opt" :class="{sel:quiz.saturation==='b'}" @click="quiz.saturation='b'">
                <div class="quiz-img" :style="{background:saturationQuestion.b.gradient}"></div>
                <div class="quiz-lbl">{{ saturationQuestion.b.label }}</div>
              </div>
            </div>
          </div>

          <!-- 2d: A/B Pairs -->
          <div v-if="quizStep==='ab'">
            <div class="quiz-q">{{ abPairs[abIndex].question }}</div>
            <div class="quiz-sub">Pick the one that best represents your work</div>
            <div class="quiz-pair">
              <div class="quiz-opt" :class="{sel:quiz.abAnswers[abPairs[abIndex].id]==='a'}" @click="quiz.abAnswers[abPairs[abIndex].id]='a'">
                <div class="quiz-img" :style="{background: abPairs[abIndex].a.image ? `url(${abPairs[abIndex].a.image}) center/cover` : abPairs[abIndex].a.gradient}"></div>
                <div class="quiz-lbl">{{ abPairs[abIndex].a.label }}</div>
              </div>
              <div class="quiz-opt" :class="{sel:quiz.abAnswers[abPairs[abIndex].id]==='b'}" @click="quiz.abAnswers[abPairs[abIndex].id]='b'">
                <div class="quiz-img" :style="{background: abPairs[abIndex].b.image ? `url(${abPairs[abIndex].b.image}) center/cover` : abPairs[abIndex].b.gradient}"></div>
                <div class="quiz-lbl">{{ abPairs[abIndex].b.label }}</div>
              </div>
            </div>
          </div>

          <!-- 2e: Features -->
          <div v-if="quizStep==='features'">
            <div class="quiz-q">{{ featureSteps[featureIndex].question }}</div>
            <div class="quiz-sub-hint" v-if="featureSteps[featureIndex].id === 'hours'">Select all that apply</div>
            <div class="feature-options" :class="{'feature-col': featureSteps[featureIndex].options.length > 3}">
              <template v-if="featureSteps[featureIndex].multi">
                <button v-for="opt in featureSteps[featureIndex].options" :key="opt" class="toggle-opt"
                  :class="{selected: (quiz.features[featureSteps[featureIndex].id] || []).includes(opt)}"
                  @click="toggleMultiFeature(featureSteps[featureIndex].id, opt)">{{ opt }}</button>
              </template>
              <template v-else>
                <button v-for="opt in featureSteps[featureIndex].options" :key="opt" class="toggle-opt"
                  :class="{selected: quiz.features[featureSteps[featureIndex].id] === opt}"
                  @click="quiz.features[featureSteps[featureIndex].id] = opt">{{ opt }}</button>
              </template>
            </div>
          </div>

          <!-- Quiz sub-nav -->
          <div class="quiz-nav">
            <button class="qn-back" @click="quizPrev" :style="{visibility: quizStep==='editing' ? 'hidden' : 'visible'}">← Back</button>
            <button class="qn-next" @click="quizNext">{{ isLastQuizStep ? 'Next Step →' : 'Next →' }}</button>
          </div>
        </div>

        <!-- STEP 3: STYLE TAGS & BIO -->
        <div v-if="step===3" class="step-content">
          <h2 class="step-title">Describe your style</h2>
          <p class="step-sub">Select tags and write your bio</p>
          <label class="form-label">Specialties</label>
          <div class="tag-group" style="margin-bottom:28px;">
            <label class="tag-chip" v-for="s in specialtyTags" :key="s" :class="{active:form.specialties.includes(s)}">
              <input type="checkbox" :value="s" v-model="form.specialties">{{ s }}
            </label>
          </div>
          <div class="form-row"><label class="form-label">Your tagline (1 sentence)</label><input class="form-input" v-model="form.tagline" placeholder="Natural light, real moments, organic warmth"></div>
          <div class="form-row"><label class="form-label">About You</label><textarea class="form-input" style="min-height:140px;" v-model="form.about" placeholder="Tell couples about your approach, your style, and what makes your work unique..."></textarea></div>
        </div>

        <!-- STEP 4: PORTFOLIO -->
        <div v-if="step===4" class="step-content">
          <h2 class="step-title">Show your best work</h2>
          <p class="step-sub">Upload 8–20 photos. Mix of couples, details, ceremony, reception.</p>
          <div class="form-row"><label class="form-label">Profile Photo (headshot)</label>
            <div class="headshot-upload" @click="$refs.headshotInput.click()">
              <input type="file" ref="headshotInput" accept="image/*" @change="handleHeadshot" hidden>
              <div class="headshot-preview" v-if="headshotPreview">
                <img :src="headshotPreview" class="headshot-img">
              </div>
              <div class="headshot-empty" v-else>
                <span style="font-size:1.5rem;">📷</span>
                <span style="font-size:0.82rem;color:var(--warm-gray);">Upload headshot</span>
              </div>
            </div>
          </div>
          <div class="form-row"><label class="form-label">Cover Photo</label>
            <div class="upload-zone" @click="$refs.coverInput.click()">
              <input type="file" ref="coverInput" accept="image/*" @change="handleCover" hidden>
              <div v-if="!coverPreview" class="upload-placeholder">Click to upload cover image<br><span style="font-size:0.78rem;color:var(--warm-gray);">Landscape photo recommended (e.g. 1600×600)</span></div>
              <img v-else :src="coverPreview" class="upload-preview">
            </div>
          </div>
          <div class="form-row"><label class="form-label">Portfolio Photos ({{ portfolioPreviews.length }}/20)</label>
            <div class="portfolio-upload-grid">
              <div class="portfolio-thumb" v-for="(p,i) in portfolioPreviews" :key="i">
                <img :src="p" class="portfolio-thumb-img">
                <button class="portfolio-remove" @click="portfolioPreviews.splice(i,1);portfolioFiles.splice(i,1)">✕</button>
              </div>
              <div class="upload-zone upload-zone-sm" @click="$refs.portfolioInput.click()" v-if="portfolioPreviews.length < 20">
                <input type="file" ref="portfolioInput" accept="image/*" multiple @change="handlePortfolio" hidden>
                <div class="upload-placeholder">+ Add</div>
              </div>
            </div>
          </div>
          <div class="form-row"><label class="form-label">Instagram Handle (optional)</label><input class="form-input" v-model="form.instagram" placeholder="@yourstudio"></div>
          <div class="form-row"><label class="form-label">TikTok Handle (optional)</label><input class="form-input" v-model="form.tiktok" placeholder="@yourstudio"></div>
        </div>

        <!-- STEP 5: SERVICES -->
        <div v-if="step===5" class="step-content">
          <h2 class="step-title">Services & Pricing</h2>
          <p class="step-sub">Help couples understand what you offer</p>
          <div class="form-row-2">
            <div class="form-row"><label class="form-label">Starting Price ($)</label><input type="number" class="form-input" v-model="form.priceMin" placeholder="3000"></div>
            <div class="form-row"><label class="form-label">Max Price ($)</label><input type="number" class="form-input" v-model="form.priceMax" placeholder="6000"></div>
          </div>
          <div class="form-row"><label class="form-label">What's included in your base package?</label><textarea class="form-input" style="min-height:120px;" v-model="form.basePackage" placeholder="8 hours of coverage&#10;Second shooter&#10;Online gallery&#10;500+ edited images"></textarea></div>
          <label class="form-label">Add-ons you offer</label>
          <div class="tag-group" style="margin-bottom:28px;">
            <label class="tag-chip" v-for="a in addOnServices" :key="a" :class="{active:form.addOns.includes(a)}">
              <input type="checkbox" :value="a" v-model="form.addOns">{{ a }}
            </label>
          </div>
          <div class="form-row-2">
            <div class="form-row"><label class="form-label">Delivery Turnaround</label><select class="form-input" v-model="form.turnaround"><option>2–4 weeks</option><option>4–6 weeks</option><option>6–8 weeks</option><option>8–12 weeks</option></select></div>
            <div class="form-row"><label class="form-label">Years of Experience</label><select class="form-input" v-model="form.yearsExperience"><option>Under 1 year</option><option>1–3 years</option><option>3–5 years</option><option>5–10 years</option><option>10+ years</option></select></div>
          </div>
        </div>

        <!-- STEP 6: REVIEW -->
        <div v-if="step===6" class="step-content">
          <h2 class="step-title">Review & Publish</h2>
          <p class="step-sub">Almost there! Review your info and publish your profile.</p>
          <div class="review-section">
            <div class="review-label">Business</div>
            <div class="review-value">{{ form.businessName }} — {{ form.city }}<span v-if="form.state">, {{ form.state }}</span><span v-if="form.country"> · {{ form.country }}</span></div>
          </div>
          <div class="review-section">
            <div class="review-label">Editing Styles</div>
            <div class="review-tags"><span class="review-tag" v-for="s in quiz.editingStyles" :key="s">{{ editingStyleLabel(s) }}</span></div>
          </div>
          <div class="review-section">
            <div class="review-label">Photo Styles</div>
            <div class="review-tags"><span class="review-tag" v-for="s in quiz.photoStyles" :key="s">{{ photoStyleLabel(s) }}</span></div>
          </div>
          <div class="review-section">
            <div class="review-label">Pricing</div>
            <div class="review-value">${{ form.priceMin || '—' }} – ${{ form.priceMax || '—' }}</div>
          </div>
          <div class="review-section">
            <div class="review-label">Portfolio</div>
            <div class="review-value">{{ portfolioPreviews.length }} photos uploaded</div>
          </div>
          <div class="publish-note">Your profile will be reviewed before going live. You can edit everything later from your dashboard.</div>
        </div>

        <!-- NAV (hidden during quiz step - quiz has its own nav) -->
        <div class="step-nav" v-if="step !== 2">
          <button class="btn-secondary" @click="step > 1 ? step-- : null" :style="{visibility:step===1?'hidden':'visible'}">← Back</button>
          <div class="step-error" v-if="error">{{ error }}</div>
          <button class="btn-primary" @click="nextStep" :disabled="loading">{{ step===6 ? (loading ? 'Publishing...' : 'Publish Profile 🎉') : 'Continue →' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSEO } from '@/composables/useSEO'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { editingStyles, photoStyles, saturationQuestion, abPairs, specialtyTags, addOnServices, travelRadiusOptions, personalityTypes, coverageOptions } from '@/data/quizData'

useSEO({ title: 'Join as a Photographer', description: 'Create your free photographer profile on WedChem. Get matched with couples who love your style. Takes about 5 minutes.', path: '/signup/photographer' })


const router = useRouter()
const authStore = useAuthStore()
const step = ref(1)
const error = ref('')
const loading = ref(false)
const coverPreview = ref(null)
const headshotFile = ref(null)
const headshotPreview = ref(null)
const coverFile = ref(null)
const portfolioPreviews = ref([])
const portfolioFiles = ref([])

const stepLabels = ['Basics', 'Style Quiz', 'Profile', 'Portfolio', 'Services', 'Review']

const form = reactive({
  firstName:'', lastName:'', businessName:'', email:'', password:'',
  phone:'', city:'', state:'', country:'', travelRadius:'150', website:'', lat:null, lng:null, geoDisplayName:'',
  specialties:[], tagline:'', about:'',
  instagram:'', tiktok:'',
  priceMin:null, priceMax:null, basePackage:'', addOns:[], turnaround:'4–6 weeks', yearsExperience:'3–5 years'
})

// ═══════ QUIZ STATE ═══════
const quiz = reactive({
  editingStyles: [],    // ordered array of style ids
  photoStyles: [],      // ordered array of style ids
  saturation: null,     // 'a' or 'b'
  abAnswers: {},        // { 4: 'a', 5: 'b', ... }
  features: {}          // { aerial: 'Yes', film: 'Yes, I shoot film', ... }
})

// Photographer-specific feature questions
const featureSteps = [
  { id: 'aerial', question: 'Do you offer aerial / drone photography?', options: ['Yes', 'No'] },
  { id: 'film', question: 'Do you offer film photography?', options: ['Yes, I shoot film', 'No, digital only'] },
  { id: 'secondShooter', question: 'Do you have second shooters available?', options: ['Yes', 'No'] },
  { id: 'personality', question: 'How would clients describe your personality on the job?', options: personalityTypes },
  { id: 'hours', question: 'What coverages can you offer?', options: coverageOptions, multi: true }
]

// Quiz sub-navigation
const quizStep = ref('editing') // editing, photoStyle, saturation, ab, features
const abIndex = ref(0)
const featureIndex = ref(0)

const quizSteps = ['editing', 'photoStyle', 'saturation', 'ab', 'features']
const totalQuizSteps = computed(() => 2 + 1 + abPairs.length + featureSteps.length) // editing + photoStyle + saturation + 7 AB + 5 features = 15
const currentQuizStep = computed(() => {
  if (quizStep.value === 'editing') return 1
  if (quizStep.value === 'photoStyle') return 2
  if (quizStep.value === 'saturation') return 3
  if (quizStep.value === 'ab') return 4 + abIndex.value
  if (quizStep.value === 'features') return 4 + abPairs.length + featureIndex.value
  return 1
})
const quizProgress = computed(() => (currentQuizStep.value / totalQuizSteps.value) * 100)
const quizStepLabel = computed(() => `${currentQuizStep.value} of ${totalQuizSteps.value}`)
const isLastQuizStep = computed(() => quizStep.value === 'features' && featureIndex.value >= featureSteps.length - 1)

function toggleMultiFeature(featureId, opt) {
  if (!quiz.features[featureId]) quiz.features[featureId] = []
  const arr = quiz.features[featureId]
  const idx = arr.indexOf(opt)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(opt)
}

function toggleList(list, id) {
  const idx = list.indexOf(id)
  if (idx >= 0) list.splice(idx, 1)
  else list.push(id)
}

function quizNext() {
  if (quizStep.value === 'editing') { quizStep.value = 'photoStyle'; return }
  if (quizStep.value === 'photoStyle') { quizStep.value = 'saturation'; return }
  if (quizStep.value === 'saturation') { quizStep.value = 'ab'; abIndex.value = 0; return }
  if (quizStep.value === 'ab') {
    if (abIndex.value < abPairs.length - 1) { abIndex.value++; return }
    quizStep.value = 'features'; featureIndex.value = 0; return
  }
  if (quizStep.value === 'features') {
    if (featureIndex.value < featureSteps.length - 1) { featureIndex.value++; return }
    step.value++ // move to step 3
  }
}

function quizPrev() {
  if (quizStep.value === 'features' && featureIndex.value > 0) { featureIndex.value--; return }
  if (quizStep.value === 'features') { quizStep.value = 'ab'; abIndex.value = abPairs.length - 1; return }
  if (quizStep.value === 'ab' && abIndex.value > 0) { abIndex.value--; return }
  if (quizStep.value === 'ab') { quizStep.value = 'saturation'; return }
  if (quizStep.value === 'saturation') { quizStep.value = 'photoStyle'; return }
  if (quizStep.value === 'photoStyle') { quizStep.value = 'editing'; return }
}

function editingStyleLabel(id) { return editingStyles.find(s => s.id === id)?.label || id }
function photoStyleLabel(id) { return photoStyles.find(s => s.id === id)?.label || id }

function handleHeadshot(e) {
  const f = e.target.files[0]; if (!f) return
  headshotFile.value = f; headshotPreview.value = URL.createObjectURL(f)
}

function handleCover(e) {
  const f = e.target.files[0]; if (!f) return
  coverFile.value = f; coverPreview.value = URL.createObjectURL(f)
}

function handlePortfolio(e) {
  const files = Array.from(e.target.files)
  files.forEach(f => {
    if (portfolioPreviews.value.length < 20) {
      portfolioFiles.value.push(f); portfolioPreviews.value.push(URL.createObjectURL(f))
    }
  })
}

async function nextStep() {
  error.value = ''
  if (step.value === 1) {
    if (!form.firstName || !form.businessName || !form.email || !form.password) { error.value = 'Please fill in required fields.'; return }
    if (form.password.length < 8) { error.value = 'Password must be 8+ characters.'; return }
    if (form.city) {
      form.city = form.city.trim().toLowerCase()
      form.state = form.state.trim().toLowerCase()
      form.country = form.country.trim().toLowerCase()
      error.value = 'Verifying location...'
      try {
        const { validateAndGeocode } = await import('@/services/geocoding')
        const geo = await validateAndGeocode(form.city, form.state, form.country)
        if (!geo.valid) { error.value = geo.error; return }
        form.lat = geo.lat; form.lng = geo.lng; form.geoDisplayName = geo.displayName; error.value = ''
      } catch (e) { error.value = '' }
    }
  }
  if (step.value === 2) {
    // Step 2 nav is handled by quizNext, this button is just "Continue" for non-quiz steps
    return
  }
  if (step.value === 6) {
    loading.value = true
    try {
      const { registerPhotographer } = await import('@/services/auth')
      const { savePhotographerQuiz, updateStyleTags, publishProfile } = await import('@/services/photographer')

      // Map quiz styles to string tags for backward compat
      const styleTags = quiz.photoStyles.map(id => photoStyleLabel(id))

      const user = await registerPhotographer(form.email, form.password, {
        firstName:form.firstName, lastName:form.lastName, businessName:form.businessName,
        phone:form.phone, city:form.city, state:form.state, country:form.country, travelRadius:form.travelRadius,
        lat:form.lat, lng:form.lng,
        website:form.website, tagline:form.tagline, about:form.about,
        instagram:form.instagram, tiktok:form.tiktok,
        priceMin:form.priceMin, priceMax:form.priceMax, basePackage:form.basePackage,
        addOns:form.addOns, turnaround:form.turnaround, yearsExperience:form.yearsExperience,
        // New quiz v2 fields
        editingStyles: quiz.editingStyles,
        photoStyles: quiz.photoStyles,
        saturation: quiz.saturation,
        abAnswers: quiz.abAnswers,
        hasAerial: quiz.features.aerial === 'Yes',
        hasFilm: quiz.features.film === 'Yes, I shoot film',
        hasSecondShooter: quiz.features.secondShooter === 'Yes',
        personality: quiz.features.personality ? [quiz.features.personality] : [],
        coverageHours: Array.isArray(quiz.features.hours) ? quiz.features.hours : (quiz.features.hours ? [quiz.features.hours] : [])
      })
      // Upload headshot
      if (headshotFile.value) {
        try {
          const { uploadHeadshot } = await import('@/services/photographer')
          await uploadHeadshot(user.uid, headshotFile.value)
        } catch (e) { console.error('Headshot upload failed:', e) }
      }

      // Upload cover photo
      if (coverFile.value) {
        try {
          const { uploadCoverPhoto } = await import('@/services/photographer')
          await uploadCoverPhoto(user.uid, coverFile.value)
        } catch (e) { console.error('Cover upload failed:', e) }
      }

      // Upload portfolio photos
      if (portfolioFiles.value.length) {
        try {
          const { uploadPortfolioPhoto, savePortfolio } = await import('@/services/photographer')
          const portfolio = []
          for (let i = 0; i < portfolioFiles.value.length; i++) {
            const url = await uploadPortfolioPhoto(user.uid, portfolioFiles.value[i], i)
            portfolio.push({ url })
          }
          await savePortfolio(user.uid, portfolio)
        } catch (e) { console.error('Portfolio upload failed:', e) }
      }

      await savePhotographerQuiz(user.uid, quiz)
      await updateStyleTags(user.uid, styleTags, form.specialties)
      await publishProfile(user.uid)
      try { const { sendWelcomeEmail } = await import('@/services/email'); await sendWelcomeEmail({ email: form.email, businessName: form.businessName, firstName: form.firstName }) } catch(e) {}
      // Force auth store to recognize photographer role immediately
      authStore.role = 'photographer'
      await authStore.refreshPhotographerProfile()
      router.push('/dashboard')
    } catch(e) {
      error.value = e.code === 'auth/email-already-in-use' ? 'Email already registered. Try logging in.' : 'Something went wrong: ' + e.message
    }
    loading.value = false
    return
  }
  step.value++
}
</script>

<style scoped>
.signup-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.signup-card { max-width:680px; margin:0 auto; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:48px; box-shadow:var(--shadow-md); }

.step-bar { display:flex; gap:4px; margin-bottom:40px; }
.step-item { flex:1; text-align:center; }
.step-num { width:32px; height:32px; border-radius:50%; background:var(--light-gray); display:flex; align-items:center; justify-content:center; margin:0 auto 6px; font-size:0.78rem; font-weight:600; color:var(--warm-gray); transition:var(--transition); }
.step-item.active .step-num { background:var(--charcoal); color:var(--cream); }
.step-item.done .step-num { background:var(--sage); color:white; }
.step-label { font-size:0.72rem; color:var(--warm-gray); }
.step-item.active .step-label { color:var(--charcoal); font-weight:500; }

.step-content { margin-bottom:32px; }
.step-title { font-family:var(--font-display); font-size:1.8rem; font-weight:400; margin-bottom:8px; }
.step-sub { color:var(--warm-gray); font-size:0.92rem; margin-bottom:32px; line-height:1.6; }

/* Ranking cards */
.rank-grid { display:grid; grid-template-columns:repeat(5, 1fr); gap:10px; margin-bottom:24px; }
.rank-grid-4 { grid-template-columns:repeat(4, 1fr); }
.rank-card { position:relative; padding:14px 10px; border:2px solid var(--light-gray); border-radius:var(--radius); cursor:pointer; transition:var(--transition); text-align:center; background:var(--warm-white); }
.rank-card:hover { border-color:var(--sage); transform:translateY(-2px); }
.rank-card.selected { border-color:var(--terracotta); background:rgba(196,130,106,0.04); }
.rank-preview { height:40px; border-radius:6px; margin-bottom:8px; }
.rank-label { font-weight:500; font-size:0.82rem; margin-bottom:2px; }
.rank-desc { font-size:0.7rem; color:var(--warm-gray); line-height:1.3; }
.rank-number { position:absolute; top:6px; right:6px; width:22px; height:22px; border-radius:50%; background:var(--terracotta); color:white; display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:700; }

/* Photo style cards with images */
.style-rank-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:24px; }
.style-rank-card { position:relative; border:2.5px solid var(--light-gray); border-radius:var(--radius-lg); overflow:hidden; cursor:pointer; transition:var(--transition); text-align:left; background:var(--warm-white); }
.style-rank-card:hover { border-color:var(--sage); transform:translateY(-2px); }
.style-rank-card.selected { border-color:var(--terracotta); box-shadow:0 0 0 3px rgba(196,130,106,0.15); }
.style-rank-img { width:100%; height:auto; max-height:220px; object-fit:cover; display:block; }
.style-rank-body { padding:12px 14px; }

/* Quiz pair */
.quiz-progress { margin-bottom:24px; }
.qp-bar { height:4px; background:var(--light-gray); border-radius:100px; overflow:hidden; margin-bottom:8px; }
.qp-fill { height:100%; background:var(--terracotta); border-radius:100px; transition:width 0.4s ease; }
.qp-text { font-size:0.78rem; color:var(--warm-gray); text-align:center; }
.quiz-q { font-family:var(--font-display); font-size:1.4rem; text-align:center; margin-bottom:8px; }
.quiz-sub { text-align:center; font-size:0.88rem; color:var(--warm-gray); margin-bottom:24px; }
.quiz-pair { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
.quiz-opt { border:3px solid var(--light-gray); border-radius:var(--radius-lg); overflow:hidden; cursor:pointer; transition:var(--transition); }
.quiz-opt:hover { border-color:var(--sage); }
.quiz-opt.sel { border-color:var(--terracotta); box-shadow:0 0 0 3px rgba(196,130,106,0.2); }
.quiz-img { aspect-ratio:4/3; }
.quiz-lbl { padding:12px; text-align:center; font-size:0.88rem; font-weight:500; }
.quiz-nav { display:flex; justify-content:space-between; }
.qn-back { padding:10px 20px; color:var(--warm-gray); font-size:0.85rem; }
.qn-next { padding:12px 28px; background:var(--charcoal); color:var(--cream); border-radius:100px; font-size:0.85rem; font-weight:500; transition:var(--transition); }
.qn-next:hover { background:var(--terracotta); }

/* Feature options */
.feature-options { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px; }
.feature-col { flex-direction:column; }
.toggle-opt { flex:1; min-width:120px; padding:14px; border:1.5px solid var(--light-gray); border-radius:var(--radius); background:transparent; font-size:0.88rem; color:var(--warm-gray); text-align:center; transition:var(--transition); cursor:pointer; }
.toggle-opt:hover { border-color:var(--sage); color:var(--charcoal); }
.toggle-opt.selected { border-color:var(--terracotta); background:rgba(196,130,106,0.06); color:var(--charcoal); font-weight:500; }

.tag-group { display:flex; flex-wrap:wrap; gap:8px; }
.tag-chip { display:inline-flex; padding:8px 18px; border:1.5px solid var(--light-gray); border-radius:100px; font-size:0.82rem; color:var(--warm-gray); cursor:pointer; transition:var(--transition); }
.tag-chip:hover { border-color:var(--sage); }
.tag-chip.active { background:var(--sage); border-color:var(--sage); color:white; }
.tag-chip input { display:none; }

.upload-zone { border:2px dashed var(--light-gray); border-radius:var(--radius); padding:40px; text-align:center; cursor:pointer; transition:var(--transition); }
.upload-zone:hover { border-color:var(--sage); }
.upload-zone-sm { padding:20px; min-height:120px; display:flex; align-items:center; justify-content:center; }
.upload-placeholder { color:var(--warm-gray); font-size:0.88rem; }
.upload-preview { max-height:200px; margin:0 auto; border-radius:var(--radius); }

.portfolio-upload-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.portfolio-thumb { position:relative; border-radius:var(--radius); overflow:hidden; aspect-ratio:1; }
.portfolio-thumb-img { width:100%; height:100%; object-fit:cover; }
.portfolio-remove { position:absolute; top:4px; right:4px; width:24px; height:24px; border-radius:50%; background:rgba(44,44,44,0.7); color:white; font-size:0.7rem; display:flex; align-items:center; justify-content:center; }

.review-section { padding:16px 0; border-bottom:1px solid var(--light-gray); }
.review-label { font-size:0.78rem; font-weight:500; text-transform:uppercase; letter-spacing:0.04em; color:var(--warm-gray); margin-bottom:4px; }
.review-value { font-size:0.95rem; }
.review-tags { display:flex; flex-wrap:wrap; gap:6px; }
.review-tag { padding:4px 12px; background:rgba(139,158,130,0.1); border-radius:100px; font-size:0.78rem; color:var(--sage-dark); }
.publish-note { margin-top:24px; padding:16px; background:rgba(139,158,130,0.08); border-radius:var(--radius); font-size:0.88rem; color:var(--sage-dark); text-align:center; }

.step-nav { display:flex; justify-content:space-between; align-items:center; gap:16px; }
.step-error { font-size:0.85rem; color:var(--terracotta); }

@media(max-width:768px) {
  .signup-card { padding:32px 24px; }
  .portfolio-upload-grid { grid-template-columns:repeat(3,1fr); }
  .quiz-pair { grid-template-columns:1fr; }
  .rank-grid { grid-template-columns:repeat(2, 1fr); }
  .rank-grid-4 { grid-template-columns:repeat(2, 1fr); }
  .style-rank-grid { grid-template-columns:1fr; }
  .style-rank-img { max-height:180px; }
  .step-bar { gap:2px; }
  .step-label { display:none; }
  .feature-options { flex-direction:column; }
}
.headshot-upload { display:inline-flex; cursor:pointer; }
.headshot-preview { width:100px; height:100px; border-radius:50%; overflow:hidden; border:3px solid var(--light-gray); }
.headshot-img { width:100%; height:100%; object-fit:cover; }
.headshot-empty { width:100px; height:100px; border-radius:50%; border:2px dashed var(--light-gray); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; transition:var(--transition); }
.headshot-upload:hover .headshot-empty { border-color:var(--sage); background:rgba(139,158,130,0.04); }

.quiz-sub-hint { font-size:0.85rem; color:var(--warm-gray); margin-bottom:16px; text-align:center; }
</style>
