<template>
  <div class="quiz-page">
    <div class="container">
      <div v-if="!quizStore.completed" style="text-align:center;margin-bottom:48px;">
        <div class="section-eyebrow">Style Quiz</div>
        <h2 class="section-title">Find your photography style</h2>
        <p style="color:var(--warm-gray);font-size:0.95rem;">15 questions · About 3 minutes</p>
      </div>

      <div class="quiz-card" :class="{'quiz-card-results': quizStore.completed}">
        <!-- PROGRESS -->
        <div v-if="!quizStore.completed && !quizStore.showThinking" class="qz-progress">
          <div class="qz-bar"><div class="qz-fill" :style="{width: quizStore.progress + '%'}"></div></div>
          <div class="qz-ptext">{{ quizStore.currentIndex + 1 }} of {{ quizStore.totalQuestions }}</div>
        </div>

        <!-- ═══════════ THINKING BREAK ═══════════ -->
        <div v-if="quizStore.showThinking" class="thinking-break">
          <div class="think-beaker">
            <svg viewBox="0 0 80 110" width="80" height="110" class="beaker-svg">
              <!-- Beaker body -->
              <defs>
                <clipPath id="beakerClip">
                  <path d="M15,35 L15,90 Q15,100 25,100 L55,100 Q65,100 65,90 L65,35 Z"/>
                </clipPath>
                <linearGradient id="liquidGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stop-color="#C4826A" stop-opacity="0.85"/>
                  <stop offset="60%" stop-color="#c9a96e" stop-opacity="0.7"/>
                  <stop offset="100%" stop-color="#c9a96e" stop-opacity="0.4"/>
                </linearGradient>
              </defs>
              <!-- Liquid fill -->
              <rect :y="liquidY" width="80" height="80" clip-path="url(#beakerClip)" class="beaker-fill-rect"/>
              <!-- Bubbles inside liquid -->
              <circle cx="30" cy="85" r="2.5" class="bub bub1" clip-path="url(#beakerClip)"/>
              <circle cx="45" cy="88" r="2" class="bub bub2" clip-path="url(#beakerClip)"/>
              <circle cx="52" cy="82" r="3" class="bub bub3" clip-path="url(#beakerClip)"/>
              <!-- Beaker outline -->
              <path d="M15,35 L15,90 Q15,100 25,100 L55,100 Q65,100 65,90 L65,35" fill="none" stroke="var(--sage)" stroke-width="2.5" stroke-linecap="round"/>
              <!-- Neck -->
              <path d="M22,35 L22,18 L58,18 L58,35" fill="none" stroke="var(--sage)" stroke-width="2.5"/>
              <!-- Rim -->
              <rect x="16" y="12" width="48" height="6" rx="2" fill="none" stroke="var(--sage)" stroke-width="2.5"/>
              <!-- Measurement marks -->
              <line x1="17" y1="55" x2="22" y2="55" stroke="var(--sage)" stroke-width="1" opacity="0.4"/>
              <line x1="17" y1="70" x2="22" y2="70" stroke="var(--sage)" stroke-width="1" opacity="0.4"/>
              <line x1="17" y1="85" x2="22" y2="85" stroke="var(--sage)" stroke-width="1" opacity="0.4"/>
            </svg>
          </div>
          <div class="thinking-line" v-for="(line, i) in quizStore.thinkingText" :key="i"
            :style="{'animation-delay': (i * 1.2) + 's'}">{{ line }}</div>
        </div>

        <!-- ═══════════ Q1: EDITING STYLE RANK ═══════════ -->
        <template v-if="!quizStore.completed && !quizStore.showThinking && quizStore.isEditingRank">
          <div style="text-align:center"><span class="phase-label phase-style">Editing Style</span></div>
          <div class="qz-title">What editing styles do you prefer?</div>
          <div class="qz-sub">Select in order of preference (first = favorite)</div>
          <div class="rank-grid">
            <button class="rank-card" v-for="style in editingStyles" :key="style.id"
              :class="{selected: quizStore.editingRanking.includes(style.id)}"
              @click="quizStore.toggleEditingStyle(style.id)">
              <div class="rank-preview" :style="{background: style.gradient}"></div>
              <div class="rank-label">{{ style.label }}</div>
              <div class="rank-desc">{{ style.description }}</div>
              <div class="rank-number" v-if="quizStore.editingRanking.includes(style.id)">
                {{ quizStore.editingRanking.indexOf(style.id) + 1 }}
              </div>
            </button>
          </div>
        </template>

        <!-- ═══════════ Q2: PHOTO STYLE RANK ═══════════ -->
        <template v-if="!quizStore.completed && !quizStore.showThinking && quizStore.isPhotoStyleRank">
          <div style="text-align:center"><span class="phase-label phase-style">Photo Style</span></div>
          <div class="qz-title">What photo styles do you prefer?</div>
          <div class="qz-sub">Select in order of preference · <router-link to="/blog/traditional-vs-editorial-vs-documentary-wedding-photography" style="color:var(--terracotta)">See examples & learn more →</router-link></div>
          <div class="style-rank-grid">
            <button class="style-rank-card" v-for="style in photoStyles" :key="style.id"
              :class="{selected: quizStore.photoStyleRanking.includes(style.id)}"
              @click="quizStore.togglePhotoStyle(style.id)">
              <img class="style-rank-img" v-if="style.image" :src="style.image" :alt="style.label">
              <div class="style-rank-body">
                <div class="rank-label">{{ style.label }}</div>
                <div class="rank-desc">{{ style.description }}</div>
              </div>
              <div class="rank-number" v-if="quizStore.photoStyleRanking.includes(style.id)">
                {{ quizStore.photoStyleRanking.indexOf(style.id) + 1 }}
              </div>
            </button>
          </div>
        </template>

        <!-- ═══════════ Q3-10: A/B PAIRS ═══════════ -->
        <template v-if="!quizStore.completed && !quizStore.showThinking && quizStore.isABPair">
          <div style="text-align:center"><span class="phase-label phase-photo">{{ quizStore.currentQuestion.data.category || 'Visual' }}</span></div>
          <div class="qz-title">{{ quizStore.currentQuestion.data.question }}</div>
          <div class="qz-sub">Pick the one you prefer</div>
          <div class="photo-pair">
            <div class="photo-opt" :class="{selected: currentABAnswer === 'a'}" @click="quizStore.selectAB('a')">
              <div class="photo-img" :style="{background: quizStore.currentQuestion.data.a.image ? `url(${quizStore.currentQuestion.data.a.image}) center/cover` : quizStore.currentQuestion.data.a.gradient}"></div>
              <div class="photo-check" v-if="currentABAnswer === 'a'">✓</div>
              <div class="photo-footer">
                <div class="photo-label">{{ quizStore.currentQuestion.data.a.label }}</div>
                <div class="photo-desc" v-if="quizStore.currentQuestion.data.a.description">{{ quizStore.currentQuestion.data.a.description }}</div>
              </div>
            </div>
            <div class="photo-opt" :class="{selected: currentABAnswer === 'b'}" @click="quizStore.selectAB('b')">
              <div class="photo-img" :style="{background: quizStore.currentQuestion.data.b.image ? `url(${quizStore.currentQuestion.data.b.image}) center/cover` : quizStore.currentQuestion.data.b.gradient}"></div>
              <div class="photo-check" v-if="currentABAnswer === 'b'">✓</div>
              <div class="photo-footer">
                <div class="photo-label">{{ quizStore.currentQuestion.data.b.label }}</div>
                <div class="photo-desc" v-if="quizStore.currentQuestion.data.b.description">{{ quizStore.currentQuestion.data.b.description }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- ═══════════ Q11-15: FEATURE QUESTIONS ═══════════ -->
        <template v-if="!quizStore.completed && !quizStore.showThinking && quizStore.isFeature">
          <div style="text-align:center"><span class="phase-label phase-details">Preferences</span></div>
          <div class="qz-title">{{ quizStore.currentQuestion.data.question }}</div>
          <div class="qz-sub" v-if="quizStore.currentQuestion.data.subtitle">{{ quizStore.currentQuestion.data.subtitle }}</div>
          <div class="manual-form">
            <div class="toggle-options" :class="{'toggle-col': quizStore.currentQuestion.data.options.length > 3}">
              <button v-for="opt in quizStore.currentQuestion.data.options" :key="opt" class="toggle-opt"
                :class="{selected: quizStore.featureAnswers[quizStore.currentQuestion.data.id] === opt}"
                @click="quizStore.setFeatureAnswer(quizStore.currentQuestion.data.id, opt)">{{ opt }}</button>
            </div>
          </div>
        </template>

        <!-- ═══════════ LOGISTICAL QUESTIONS ═══════════ -->
        <template v-if="!quizStore.completed && !quizStore.showThinking && quizStore.isLogistical">
          <div style="text-align:center"><span class="phase-label phase-details">Details</span></div>
          <div class="qz-title">{{ quizStore.currentQuestion.data.title }}</div>
          <div class="qz-sub">{{ quizStore.currentQuestion.data.subtitle }}</div>
          <div class="manual-form">
            <template v-if="quizStore.currentQuestion.data.type === 'location'">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
                <div><label class="form-label">City</label><input type="text" class="form-input" placeholder="Portland" v-model="locCity"></div>
                <div><label class="form-label">State / Region</label><input type="text" class="form-input" placeholder="Oregon" v-model="locState"></div>
              </div>
              <div><label class="form-label">Country</label><input type="text" class="form-input" placeholder="United States" v-model="locCountry"></div>
            </template>
            <template v-if="quizStore.currentQuestion.data.type === 'date'">
              <label class="form-label">Wedding Date</label>
              <input type="date" class="form-input" v-model="weddingDate" style="cursor:pointer;">
            </template>
            <template v-if="quizStore.currentQuestion.data.type === 'budget'">
              <div class="budget-wrap">
                <div class="budget-display">${{ budgetVal.toLocaleString() }}</div>
                <input type="range" class="budget-slider" :min="quizStore.currentQuestion.data.min" :max="quizStore.currentQuestion.data.max" :step="quizStore.currentQuestion.data.step" v-model.number="budgetVal">
                <div class="budget-labels"><span>${{ quizStore.currentQuestion.data.min.toLocaleString() }}</span><span>${{ quizStore.currentQuestion.data.max.toLocaleString() }}+</span></div>
              </div>
            </template>
            <template v-if="quizStore.currentQuestion.data.type === 'select'">
              <div class="toggle-options">
                <button v-for="opt in quizStore.currentQuestion.data.options" :key="opt" class="toggle-opt"
                  :class="{selected: quizStore.manualAnswers[quizStore.currentQuestion.data.id] === opt}"
                  @click="quizStore.setManualAnswer(quizStore.currentQuestion.data.id, opt)">{{ opt }}</button>
              </div>
            </template>
          </div>
        </template>

        <!-- VALIDATION -->
        <div class="validation-msg" v-if="validationMsg && !quizStore.completed && !quizStore.showThinking">{{ validationMsg }}</div>

        <!-- NAVIGATION -->
        <div v-if="!quizStore.completed && !quizStore.showThinking" class="qz-nav">
          <button class="qz-back" @click="goPrev" :style="{visibility: quizStore.currentIndex === 0 ? 'hidden' : 'visible'}">← Back</button>
          <button class="qz-next" @click="validateAndNext">{{ quizStore.isLastQuestion ? 'See My Matches →' : 'Next →' }}</button>
        </div>

        <!-- ═══════════ RESULTS ═══════════ -->
        <div v-if="quizStore.completed" class="results">
          <div class="beaker-wrap" :class="{'beaker-done': revealDone}">
            <div class="beaker">
              <div class="beaker-body">
                <div class="beaker-liquid" :class="{'filling': beakerFilling}">
                  <div class="bubble b1"></div><div class="bubble b2"></div><div class="bubble b3"></div><div class="bubble b4"></div><div class="bubble b5"></div>
                </div>
              </div>
              <div class="beaker-neck"></div>
              <div class="beaker-rim"></div>
            </div>
            <div class="beaker-text" :class="{'show': beakerStage === 1}">Analyzing your visual preferences...</div>
            <div class="beaker-text beaker-text-2" :class="{'show': beakerStage === 2}">Comparing across style dimensions...</div>
            <div class="beaker-text beaker-text-3" :class="{'show': beakerStage === 3}">Scanning photographer portfolios...</div>
            <div class="beaker-text beaker-text-4" :class="{'show': beakerStage === 4}">Measuring style compatibility...</div>
            <div class="beaker-text beaker-text-5" :class="{'show': beakerStage >= 5}">Chemistry calculated! 🧪</div>
          </div>

          <div class="results-content" :class="{'show': revealDone}">
            <div class="results-header">
              <div class="results-icon">🧪✨</div>
              <div class="results-title">Your chemistry results</div>
              <div class="results-sub">We analyzed your style preferences and found {{ quizStore.matches.length }} photographers with strong chemistry</div>
            </div>

            <!-- No matches -->
            <div v-if="quizStore.matches.length === 0" class="no-matches">
              <div style="font-size:2rem;margin-bottom:12px;">🔬</div>
              <div style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:8px;">We're still growing!</div>
              <p style="color:var(--warm-gray);max-width:400px;margin:0 auto 20px;line-height:1.6;">We don't have enough photographers in our network yet to find your perfect match. Browse our directory or check back soon as more photographers join.</p>
              <router-link to="/directory" class="btn-primary">Browse All Photographers →</router-link>
            </div>

            <div class="results-grid" v-else>
              <div class="result-card" v-for="(m, i) in quizStore.matches.slice(0, 6)" :key="m.photographer.id"
                :class="{'result-featured': m.isFeatured}" :style="{'animation-delay': (i * 0.1) + 's'}"
                @click="$router.push('/photographer/' + m.photographer.id)">
                <div class="rc-badge" v-if="m.isFeatured">Featured</div>
                <div class="rc-rank">#{{ i + 1 }}</div>
                <div class="rc-cover" :style="{background: m.photographer.coverPhoto ? `url(${m.photographer.coverPhoto}) center/cover` : m.photographer.gradient || 'linear-gradient(135deg, var(--sage-light), var(--blush))'}"></div>
                <div class="rc-info">
                  <div class="rc-name">{{ m.photographer.businessName }}</div>
                  <div class="rc-loc">{{ m.photographer.city }}<span v-if="m.photographer.state">, {{ m.photographer.state }}</span></div>
                  <div class="rc-match-bar-wrap">
                    <div class="rc-match-bar"><div class="rc-match-fill" :style="{width: m.totalScore + '%'}"></div></div>
                    <div class="rc-match-score">{{ m.totalScore }}% match</div>
                  </div>
                  <div class="rc-tags" v-if="m.photographer.styles">
                    <span class="rc-tag" v-for="s in (m.photographer.styles || []).slice(0, 2)" :key="s">{{ s }}</span>
                  </div>
                </div>
                <div class="rc-action">View Profile →</div>
              </div>
            </div>

            <!-- Save results prompt for non-logged-in users -->
            <div v-if="!authStore.isLoggedIn" class="save-results-card">
              <div class="save-icon">💾</div>
              <div class="save-text">
                <div class="save-title">Save your results</div>
                <div class="save-sub">Create a free account to save your matches and send inquiries to photographers.</div>
              </div>
              <router-link to="/signup/couple" class="btn-primary btn-sm">Create Free Account →</router-link>
            </div>

            <div style="text-align:center;margin-top:32px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
              <router-link to="/directory" class="btn-primary">Browse All Photographers →</router-link>
              <button class="btn-secondary" @click="retakeQuiz">Retake Quiz</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSEO } from '@/composables/useSEO'
import { ref, computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { editingStyles, photoStyles } from '@/data/quizData'

useSEO({ title: 'Style Matching Quiz', description: 'Take our 3-minute visual style quiz to find wedding photographers whose aesthetic matches yours. Free, fun, and shockingly accurate.', path: '/quiz' })


const quizStore = useQuizStore()
const router = useRouter()
const validationMsg = ref('')
const authStore = useAuthStore()

const locCity = ref('')
const locState = ref('')
const locCountry = ref('')
const weddingDate = ref('')
const budgetVal = ref(4000)

const beakerFilling = ref(false)
const liquidY = computed(() => {
  const fill = quizStore.beakerFill
  if (fill === 0) return 100
  if (fill === 1) return 75  // ~33% full
  if (fill === 2) return 52  // ~66% full
  return 32                   // ~90% full
})
const beakerStage = ref(0)
const revealDone = ref(false)

onMounted(() => {
  if (authStore.isPhotographer) {
    router.replace('/dashboard')
    return
  }
  quizStore.reset('couple')
})

const currentABAnswer = computed(() => {
  const q = quizStore.currentQuestion?.data
  if (!q) return null
  if (q.id === 'saturation') return quizStore.saturationPick
  return quizStore.abAnswers[q.id] || null
})

async function saveCurrentLogistical() {
  const q = quizStore.currentQuestion
  if (q.type !== 'logistical') return
  const id = q.data.id
  if (q.data.type === 'location') {
    const locData = { city: locCity.value, state: locState.value, country: locCountry.value }
    try {
      const { validateAndGeocode } = await import('@/services/geocoding')
      const geo = await validateAndGeocode(locCity.value, locState.value, locCountry.value)
      if (geo.valid) { locData.lat = geo.lat; locData.lng = geo.lng }
    } catch (e) {}
    quizStore.setManualAnswer(id, locData)
  }
  if (q.data.type === 'date') quizStore.setManualAnswer(id, weddingDate.value)
  if (q.data.type === 'budget') quizStore.setManualAnswer(id, budgetVal.value)
}


function runRevealAnimation() {
  beakerFilling.value = false; beakerStage.value = 0; revealDone.value = false
  setTimeout(() => { beakerFilling.value = true; beakerStage.value = 1 }, 400)
  setTimeout(() => { beakerStage.value = 2 }, 2200)
  setTimeout(() => { beakerStage.value = 3 }, 4200)
  setTimeout(() => { beakerStage.value = 4 }, 6500)
  setTimeout(() => { beakerStage.value = 5 }, 8500)
  setTimeout(() => { revealDone.value = true }, 10500)
}

function validateAndNext() {
  validationMsg.value = ''
  const q = quizStore
  
  if (q.isEditingRank && q.editingRanking.length === 0) {
    validationMsg.value = 'Please select at least one editing style — this helps us find your best matches.'
    return
  }
  if (q.isPhotoStyleRank && q.photoStyleRanking.length === 0) {
    validationMsg.value = 'Please select at least one photo style — the more we know, the better your matches.'
    return
  }
  if (q.isABPair) {
    const currentQ = q.phases[q.currentIndex]
    if (currentQ.data.id === 'saturation' && !q.saturationPick) {
      validationMsg.value = 'Pick one — this helps us understand your color preferences.'
      return
    }
    if (currentQ.data.id !== 'saturation' && !q.abAnswers[currentQ.data.id]) {
      validationMsg.value = 'Pick the one that speaks to you — there\'s no wrong answer!'
      return
    }
  }
  if (q.isFeature) {
    const currentQ = q.phases[q.currentIndex]
    if (!q.featureAnswers[currentQ.data.id]) {
      validationMsg.value = 'Please select an option to continue.'
      return
    }
  }
  if (q.isLogistical) {
    const currentQ = q.phases[q.currentIndex]
    if (currentQ.data.id === 'budget' && !q.manualAnswers.budget) {
      validationMsg.value = 'A budget range helps us filter to photographers in your price range.'
      return
    }
  }
  
  goNext()
}

async function goNext() {
  if (quizStore.isLogistical) await saveCurrentLogistical()
  if (quizStore.isLastQuestion) {
    try {
      const { getMatches, saveQuizResults } = await import('@/services/matching')
      const answers = quizStore.getAllAnswers()
      const matches = await getMatches(answers)
      quizStore.setMatches(matches)
      await saveQuizResults(authStore.uid, answers, matches)
    } catch (e) {
      console.error('Matching error:', e)
      quizStore.setMatches([])
    }
    quizStore.complete()
    runRevealAnimation()
  } else {
    await quizStore.next()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goPrev() {
  if (quizStore.isLogistical) saveCurrentLogistical()
  quizStore.prev()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function retakeQuiz() {
  revealDone.value = false; beakerFilling.value = false; beakerStage.value = 0
  quizStore.reset('couple')
}
</script>

<style scoped>
.quiz-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.quiz-card { max-width:760px; margin:0 auto; background:var(--warm-white); border-radius:var(--radius-lg); border:1px solid var(--light-gray); padding:56px; box-shadow:var(--shadow-md); transition:all 0.5s ease; }
.quiz-card-results { max-width:900px; padding:56px 48px; }

.qz-progress { margin-bottom:40px; }
.qz-bar { height:4px;background:var(--light-gray);border-radius:100px;overflow:hidden;margin-bottom:12px; }
.qz-fill { height:100%;background:var(--terracotta);border-radius:100px;transition:width 0.5s ease; }
.qz-ptext { font-size:0.78rem;color:var(--warm-gray);text-align:center; }

.phase-label { display:inline-block;padding:4px 14px;border-radius:100px;font-size:0.72rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:20px; }
.phase-style { background:var(--gold-light);color:var(--charcoal); }
.phase-photo { background:var(--blush);color:var(--terracotta-dark); }
.phase-details { background:var(--sage-light);color:var(--sage-dark); }

.qz-title { font-family:var(--font-display);font-size:1.8rem;font-weight:400;text-align:center;margin-bottom:8px; }
.qz-sub { text-align:center;font-size:0.92rem;color:var(--warm-gray);margin-bottom:36px; }

/* ═══════════ RANKING CARDS ═══════════ */
.rank-grid { display:grid; grid-template-columns:repeat(5, 1fr); gap:12px; margin-bottom:40px; }
.rank-grid-4 { grid-template-columns:repeat(4, 1fr); }
.rank-card { position:relative; padding:16px 12px; border:2px solid var(--light-gray); border-radius:var(--radius); cursor:pointer; transition:var(--transition); text-align:center; background:var(--warm-white); }
.rank-card:hover { border-color:var(--sage); transform:translateY(-2px); }
.rank-card.selected { border-color:var(--terracotta); background:rgba(196,130,106,0.04); }
.rank-preview { height:48px; border-radius:6px; margin-bottom:10px; }
.rank-label { font-weight:500; font-size:0.88rem; margin-bottom:4px; }
.rank-desc { font-size:0.75rem; color:var(--warm-gray); line-height:1.4; }
.rank-number { position:absolute; top:8px; right:8px; width:24px; height:24px; border-radius:50%; background:var(--terracotta); color:white; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:700; }

/* ═══════════ SAVE RESULTS ═══════════ */
.save-results-card {
  display:flex; align-items:center; gap:20px; padding:24px;
  background:var(--warm-white); border:1.5px solid var(--sage-light);
  border-radius:var(--radius-lg); margin-top:40px;
}
.save-icon { font-size:1.8rem; flex-shrink:0; }
.save-text { flex:1; }
.save-title { font-weight:500; margin-bottom:2px; }
.save-sub { font-size:0.85rem; color:var(--warm-gray); }
@media(max-width:768px) {
  .save-results-card { flex-direction:column; text-align:center; }
}

/* ═══════════ VALIDATION ═══════════ */
.validation-msg {
  text-align:center; padding:12px 20px; margin-bottom:16px;
  background:rgba(196,130,106,0.08); border:1px solid rgba(196,130,106,0.2);
  border-radius:var(--radius); font-size:0.88rem; color:var(--terracotta-dark);
  animation:fadeUp 0.3s ease;
}

/* ═══════════ PHOTO STYLE CARDS WITH IMAGES ═══════════ */
.style-rank-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:40px; }
.style-rank-card { position:relative; border:2.5px solid var(--light-gray); border-radius:var(--radius-lg); overflow:hidden; cursor:pointer; transition:var(--transition); text-align:left; background:var(--warm-white); }
.style-rank-card:hover { border-color:var(--sage); transform:translateY(-2px); box-shadow:var(--shadow-md); }
.style-rank-card.selected { border-color:var(--terracotta); box-shadow:0 0 0 3px rgba(196,130,106,0.15); }
.style-rank-img { width:100%; height:auto; max-height:220px; object-fit:cover; display:block; }
.style-rank-body { padding:14px 16px; }

/* ═══════════ A/B PAIRS ═══════════ */
.photo-pair { display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:40px; }
.photo-opt { border:3px solid var(--light-gray);border-radius:var(--radius-lg);overflow:hidden;cursor:pointer;transition:var(--transition);position:relative; }
.photo-opt:hover { border-color:var(--sage);transform:translateY(-3px);box-shadow:var(--shadow-md); }
.photo-opt.selected { border-color:var(--terracotta);box-shadow:0 0 0 3px rgba(196,130,106,0.2); }
.photo-img { aspect-ratio:4/3; }
.photo-check { position:absolute;top:12px;right:12px;width:28px;height:28px;border-radius:50%;background:var(--terracotta);color:white;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600; }
.photo-footer { padding:14px 18px;background:var(--warm-white); }
.photo-label { font-weight:500;font-size:0.92rem;margin-bottom:2px; }
.photo-desc { font-size:0.8rem;color:var(--warm-gray); }

/* ═══════════ FEATURE & LOGISTICAL ═══════════ */
.manual-form { max-width:480px;margin:0 auto 40px; }
.toggle-options { display:flex;gap:12px;flex-wrap:wrap; }
.toggle-col { flex-direction:column; }
.toggle-opt { flex:1;min-width:120px;padding:14px;border:1.5px solid var(--light-gray);border-radius:var(--radius);background:transparent;font-size:0.92rem;color:var(--warm-gray);text-align:center;transition:var(--transition); }
.toggle-opt:hover { border-color:var(--sage);color:var(--charcoal); }
.toggle-opt.selected { border-color:var(--terracotta);background:rgba(196,130,106,0.06);color:var(--charcoal);font-weight:500; }

.budget-wrap { margin-bottom:20px;padding:0 20px; }
.budget-display { text-align:center;font-family:var(--font-display);font-size:2rem;font-weight:400;margin-bottom:16px; }
.budget-slider { width:100%;-webkit-appearance:none;height:4px;background:var(--light-gray);border-radius:100px;outline:none; }
.budget-slider::-webkit-slider-thumb { -webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--terracotta);cursor:pointer;box-shadow:0 2px 8px rgba(196,130,106,0.3); }
.budget-labels { display:flex;justify-content:space-between;margin-top:8px;font-size:0.78rem;color:var(--warm-gray); }

/* ═══════════ THINKING BREAK ═══════════ */
.thinking-break { text-align:center; padding:60px 0 80px; }

.think-beaker { display:inline-block; margin-bottom:32px; }
.beaker-svg { overflow:visible; }
.beaker-fill-rect {
  fill:url(#liquidGrad);
  transition:y 2.5s cubic-bezier(0.25,0.46,0.45,0.94);
}
.bub { fill:rgba(255,255,255,0.5); animation:svgrise 1.6s ease-in infinite; }
.bub1 { animation-delay:0s; }
.bub2 { animation-delay:0.5s; }
.bub3 { animation-delay:1s; }
@keyframes svgrise { 0%{transform:translateY(0);opacity:.6} 100%{transform:translateY(-45px);opacity:0} }

.thinking-line { font-family:var(--font-display); font-size:1.15rem; color:var(--warm-gray); opacity:0; animation:fadeUp 0.8s ease forwards; margin-bottom:10px; line-height:1.6; }
.thinking-line:last-child { color:var(--sage-dark); }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

/* ═══════════ NAVIGATION ═══════════ */
.qz-nav { display:flex;justify-content:space-between;align-items:center; }
.qz-back { padding:12px 24px;color:var(--warm-gray);font-size:0.88rem;transition:var(--transition); }
.qz-back:hover { color:var(--charcoal); }
.qz-next { padding:14px 32px;background:var(--charcoal);color:var(--cream);border-radius:100px;font-size:0.88rem;font-weight:500;transition:var(--transition); }
.qz-next:hover { background:var(--terracotta); }

/* ═══════════ BEAKER ANIMATION ═══════════ */
.beaker-wrap { text-align:center; padding:60px 0 80px; transition:all 0.6s ease; position:relative; }
.beaker-wrap.beaker-done { height:0; overflow:hidden; padding:0; opacity:0; margin:0; }
.beaker { display:inline-block; position:relative; width:80px; height:120px; margin-bottom:24px; }
.beaker-body { position:absolute; bottom:0; width:80px; height:90px; border:3px solid var(--sage); border-top:none; border-radius:0 0 12px 12px; overflow:hidden; background:rgba(139,158,130,0.05); }
.beaker-liquid { position:absolute; bottom:0; left:0; right:0; height:0; background:linear-gradient(to top, var(--terracotta), var(--gold)); border-radius:0 0 9px 9px; transition:height 8s cubic-bezier(0.25,0.46,0.45,0.94); overflow:hidden; }
.beaker-liquid.filling { height:85%; }
.bubble { position:absolute; border-radius:50%; background:rgba(255,255,255,0.4); animation:rise 1.5s ease-in infinite; }
.b1{width:6px;height:6px;left:20%;bottom:-10px;animation-delay:0s} .b2{width:4px;height:4px;left:50%;bottom:-10px;animation-delay:.3s} .b3{width:8px;height:8px;left:70%;bottom:-10px;animation-delay:.6s} .b4{width:5px;height:5px;left:35%;bottom:-10px;animation-delay:.9s} .b5{width:3px;height:3px;left:60%;bottom:-10px;animation-delay:1.2s}
@keyframes rise { 0%{transform:translateY(0) scale(1);opacity:.8} 100%{transform:translateY(-80px) scale(.3);opacity:0} }
.beaker-neck { position:absolute; top:10px; left:50%; transform:translateX(-50%); width:50px; height:20px; border:3px solid var(--sage); border-bottom:none; border-radius:4px 4px 0 0; background:var(--warm-white); }
.beaker-rim { position:absolute; top:5px; left:50%; transform:translateX(-50%); width:60px; height:8px; border:3px solid var(--sage); border-radius:4px 4px 0 0; }
.beaker-text { font-size:0.92rem; color:var(--warm-gray); opacity:0; transition:opacity 0.5s ease; position:absolute; left:0; right:0; bottom:-40px; }
.beaker-text.show { opacity:1; }
.beaker-text-2 { color:var(--sage-dark); } .beaker-text-3 { color:var(--sage-dark); }
.beaker-text-4 { color:var(--terracotta); } .beaker-text-5 { color:var(--terracotta); font-weight:500; font-size:1.05rem; }

/* ═══════════ RESULTS ═══════════ */
.results-content { opacity:0; transform:translateY(30px); transition:all 0.8s cubic-bezier(0.25,0.46,0.45,0.94); pointer-events:none; }
.results-content.show { opacity:1; transform:translateY(0); pointer-events:auto; }
.results-header { text-align:center; margin-bottom:48px; }
.results-icon { font-size:3rem; margin-bottom:16px; }
.results-title { font-family:var(--font-display); font-size:2.5rem; font-weight:300; margin-bottom:12px; }
.results-sub { font-size:1rem; color:var(--warm-gray); max-width:500px; margin:0 auto; line-height:1.6; }
.results-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:20px; }
.result-card { position:relative; border:1px solid var(--light-gray); border-radius:var(--radius-lg); overflow:hidden; cursor:pointer; transition:var(--transition); background:var(--cream); animation:cardReveal 0.6s ease-out both; }
.result-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); border-color:var(--sage); }
.result-featured { border-color:var(--gold-light); box-shadow:0 0 0 1px var(--gold-light); }
@keyframes cardReveal { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.rc-badge { position:absolute; top:12px; left:12px; z-index:2; padding:4px 12px; background:var(--gold); color:white; border-radius:100px; font-size:0.7rem; font-weight:600; }
.rc-rank { position:absolute; top:12px; right:12px; z-index:2; width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.9); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:600; }
.rc-cover { height:160px; }
.rc-info { padding:20px; }
.rc-name { font-family:var(--font-display); font-size:1.25rem; font-weight:500; margin-bottom:4px; }
.rc-loc { font-size:0.82rem; color:var(--warm-gray); margin-bottom:14px; }
.rc-loc::before { content:'◦ '; color:var(--sage); }
.rc-match-bar-wrap { margin-bottom:14px; }
.rc-match-bar { height:6px; background:var(--light-gray); border-radius:100px; overflow:hidden; margin-bottom:6px; }
.rc-match-fill { height:100%; background:linear-gradient(90deg, var(--sage), var(--terracotta)); border-radius:100px; transition:width 1s ease 0.5s; }
.rc-match-score { font-size:0.82rem; font-weight:600; color:var(--sage-dark); }
.rc-tags { display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap; }
.rc-tag { padding:3px 10px; background:rgba(139,158,130,0.1); border-radius:100px; font-size:0.72rem; color:var(--sage-dark); font-weight:500; }
.rc-action { padding:14px 20px; border-top:1px solid var(--light-gray); font-size:0.85rem; font-weight:500; color:var(--terracotta); text-align:center; transition:var(--transition); }
.result-card:hover .rc-action { background:rgba(196,130,106,0.05); }

@media (max-width:768px) {
  .quiz-card { padding:36px 24px; } .quiz-card-results { padding:36px 20px; }
  .photo-pair { grid-template-columns:1fr; }
  .rank-grid { grid-template-columns:repeat(2, 1fr); }
  .rank-grid-4 { grid-template-columns:repeat(2, 1fr); }
  .style-rank-grid { grid-template-columns:1fr; }
  .style-rank-img { max-height:180px; }
  .results-grid { grid-template-columns:1fr; }
  .toggle-options { flex-direction:column; }
  .results-title { font-size:2rem; }
}
</style>
