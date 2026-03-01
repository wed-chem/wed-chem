<template>
  <div class="quiz-page">
    <div class="container">
      <div v-if="!quizStore.completed" style="text-align:center;margin-bottom:48px;">
        <div class="section-eyebrow">The Chemistry Test</div>
        <h2 class="section-title">Pick the photo you prefer</h2>
        <p style="color:var(--warm-gray);font-size:0.95rem;">25 photo comparisons + a few quick questions</p>
      </div>

      <div class="quiz-card" :class="{'quiz-card-results': quizStore.completed}">
        <!-- PROGRESS -->
        <div v-if="!quizStore.completed" class="qz-progress">
          <div class="qz-bar"><div class="qz-fill" :style="{width: quizStore.progress + '%'}"></div></div>
          <div class="qz-ptext">{{ quizStore.currentIndex + 1 }} of {{ quizStore.totalQuestions }}</div>
        </div>

        <!-- PHOTO QUESTIONS -->
        <template v-if="!quizStore.completed && quizStore.isPhotoPhase">
          <div style="text-align:center"><span class="phase-label phase-photo">{{ quizStore.currentQuestion.data.category }}</span></div>
          <div class="qz-title">{{ quizStore.currentQuestion.data.question }}</div>
          <div class="qz-sub">Pick the one you prefer</div>
          <div class="photo-pair">
            <div class="photo-opt" :class="{selected: quizStore.photoAnswers[quizStore.currentIndex]==='a'}" @click="quizStore.selectPhotoAnswer('a')">
              <div class="photo-img" :style="{background: quizStore.currentQuestion.data.a.image ? `url(${quizStore.currentQuestion.data.a.image}) center/cover` : quizStore.currentQuestion.data.a.gradient}"></div>
              <div class="photo-check" v-if="quizStore.photoAnswers[quizStore.currentIndex]==='a'">✓</div>
              <div class="photo-footer">
                <div class="photo-label">{{ quizStore.currentQuestion.data.a.label }}</div>
                <div class="photo-desc">{{ quizStore.currentQuestion.data.a.description }}</div>
              </div>
            </div>
            <div class="photo-opt" :class="{selected: quizStore.photoAnswers[quizStore.currentIndex]==='b'}" @click="quizStore.selectPhotoAnswer('b')">
              <div class="photo-img" :style="{background: quizStore.currentQuestion.data.b.image ? `url(${quizStore.currentQuestion.data.b.image}) center/cover` : quizStore.currentQuestion.data.b.gradient}"></div>
              <div class="photo-check" v-if="quizStore.photoAnswers[quizStore.currentIndex]==='b'">✓</div>
              <div class="photo-footer">
                <div class="photo-label">{{ quizStore.currentQuestion.data.b.label }}</div>
                <div class="photo-desc">{{ quizStore.currentQuestion.data.b.description }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- MANUAL QUESTIONS -->
        <template v-if="!quizStore.completed && !quizStore.isPhotoPhase">
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
                <button v-for="opt in quizStore.currentQuestion.data.options" :key="opt" class="toggle-opt" :class="{selected: quizStore.manualAnswers[quizStore.currentQuestion.data.id] === opt}" @click="quizStore.setManualAnswer(quizStore.currentQuestion.data.id, opt)">{{ opt }}</button>
              </div>
            </template>
          </div>
        </template>

        <!-- NAVIGATION -->
        <div v-if="!quizStore.completed" class="qz-nav">
          <button class="qz-back" @click="goPrev" :style="{visibility: quizStore.currentIndex === 0 ? 'hidden' : 'visible'}">← Back</button>
          <button class="qz-next" @click="goNext">{{ quizStore.isLastQuestion ? 'See My Matches →' : 'Next →' }}</button>
        </div>

        <!-- ═══════════ RESULTS WITH ANIMATION ═══════════ -->
        <div v-if="quizStore.completed" class="results">
          <!-- Beaker animation -->
          <div class="beaker-wrap" :class="{'beaker-done': revealDone}">
            <div class="beaker">
              <div class="beaker-body">
                <div class="beaker-liquid" :class="{'filling': beakerFilling}">
                  <div class="bubble b1"></div>
                  <div class="bubble b2"></div>
                  <div class="bubble b3"></div>
                  <div class="bubble b4"></div>
                  <div class="bubble b5"></div>
                </div>
              </div>
              <div class="beaker-neck"></div>
              <div class="beaker-rim"></div>
            </div>
            <div class="beaker-text" :class="{'show': beakerStage === 1}">Analyzing your visual preferences...</div>
            <div class="beaker-text beaker-text-2" :class="{'show': beakerStage === 2}">Comparing across 25 style dimensions...</div>
            <div class="beaker-text beaker-text-3" :class="{'show': beakerStage === 3}">Scanning thousands of portfolios...</div>
            <div class="beaker-text beaker-text-4" :class="{'show': beakerStage === 4}">Measuring style compatibility...</div>
            <div class="beaker-text beaker-text-5" :class="{'show': beakerStage >= 5}">Chemistry calculated! 🧪</div>
          </div>

          <!-- Results content (shown after animation) -->
          <div class="results-content" :class="{'show': revealDone}">
            <div class="results-header">
              <div class="results-icon">🧪✨</div>
              <div class="results-title">Your chemistry results</div>
              <div class="results-sub">We analyzed your visual preferences across 25 dimensions and found {{ quizStore.matches.length }} photographers with strong chemistry</div>
            </div>

            <div class="results-grid">
              <div class="result-card" v-for="(m, i) in quizStore.matches.slice(0, 6)" :key="m.photographer.id"
                :class="{'result-featured': m.isFeatured}" :style="{'animation-delay': (i * 0.1) + 's'}"
                @click="$router.push('/photographer/' + m.photographer.id)">

                <div class="rc-badge" v-if="m.isFeatured">⭐ Featured</div>
                <div class="rc-rank">#{{ i + 1 }}</div>

                <div class="rc-cover" :style="{background: m.photographer.coverPhoto ? `url(${m.photographer.coverPhoto}) center/cover` : m.photographer.gradient || 'linear-gradient(135deg, var(--sage-light), var(--blush))'}"></div>

                <div class="rc-info">
                  <div class="rc-name">{{ m.photographer.businessName }}</div>
                  <div class="rc-loc">{{ m.photographer.city }}, {{ m.photographer.state }}</div>

                  <div class="rc-match-bar-wrap">
                    <div class="rc-match-bar"><div class="rc-match-fill" :style="{width: m.totalScore + '%'}"></div></div>
                    <div class="rc-match-score">{{ m.totalScore }}% match</div>
                  </div>

                  <div class="rc-tags" v-if="m.photographer.styles">
                    <span class="rc-tag" v-for="s in m.photographer.styles.slice(0, 2)" :key="s">{{ s }}</span>
                  </div>

                  <div class="rc-price" v-if="m.photographer.priceRange">{{ m.photographer.priceRange }}</div>
                </div>

                <div class="rc-action">View Profile →</div>
              </div>
            </div>

            <div style="text-align:center;margin-top:48px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
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
import { ref, watch, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { useAuthStore } from '@/stores/auth'

const quizStore = useQuizStore()
const authStore = useAuthStore()

const locCity = ref('')
const locState = ref('')
const locCountry = ref('')
const weddingDate = ref('')
const budgetVal = ref(4000)

// Animation states
const beakerFilling = ref(false)
const beakerStage = ref(0)
const revealDone = ref(false)

onMounted(() => { quizStore.reset('couple') })

async function saveCurrentManual() {
  const q = quizStore.currentQuestion
  if (q.type !== 'manual') return
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

function loadCurrentManual() {
  const q = quizStore.currentQuestion
  if (q.type !== 'manual') return
  const id = q.data.id
  const val = quizStore.manualAnswers[id]
  if (q.data.type === 'location' && val) { locCity.value = val.city || ''; locState.value = val.state || ''; locCountry.value = val.country || '' }
  if (q.data.type === 'date' && val) weddingDate.value = val
  if (q.data.type === 'budget') budgetVal.value = val || q.data.default
}

watch(() => quizStore.currentIndex, () => { loadCurrentManual() })

// Mock photographers for demo
const mockPhotographers = [
  { id:'demo1', businessName:'Ava Chen Photography', city:'Portland', state:'OR', styles:['Light & Airy','Romantic'], priceRange:'$3,200 – $5,500', gradient:'linear-gradient(135deg, #e8d5cc 0%, #faf7f2 50%, #c5d4be 100%)' },
  { id:'demo2', businessName:'Marcus Webb Studio', city:'Seattle', state:'WA', styles:['Moody & Dark','Cinematic'], priceRange:'$4,000 – $7,500', gradient:'linear-gradient(135deg, #1a1a2e 0%, #2c2c3e 50%, #4a3f55 100%)' },
  { id:'demo3', businessName:'Riley & Fox Co.', city:'Austin', state:'TX', styles:['Documentary','Candid'], priceRange:'$2,800 – $4,500', gradient:'linear-gradient(135deg, #c5d4be 0%, #e8e3dc 50%, #faf7f2 100%)' },
  { id:'demo4', businessName:'Sage & Cellulose', city:'Denver', state:'CO', styles:['Film / Analog','Fine Art'], priceRange:'$4,500 – $8,000', gradient:'linear-gradient(135deg, #d4a574 0%, #b8866a 50%, #c9a96e 100%)' },
  { id:'demo5', businessName:'Hannah Leigh Photo', city:'Nashville', state:'TN', styles:['Classic / Timeless','Romantic'], priceRange:'$2,500 – $4,000', gradient:'linear-gradient(135deg, #e8d5cc 0%, #f5ebe3 50%, #c5d4be 100%)' },
  { id:'demo6', businessName:'Noir Collective', city:'Los Angeles', state:'CA', styles:['Editorial','Fashion-Forward'], priceRange:'$5,000 – $10,000', gradient:'linear-gradient(135deg, #2c2c2c 0%, #4a3f35 50%, #c9a96e 100%)' },
]

function runRevealAnimation() {
  beakerFilling.value = false
  beakerStage.value = 0
  revealDone.value = false

  setTimeout(() => { beakerFilling.value = true; beakerStage.value = 1 }, 400)
  setTimeout(() => { beakerStage.value = 2 }, 2200)
  setTimeout(() => { beakerStage.value = 3 }, 4200)
  setTimeout(() => { beakerStage.value = 4 }, 6500)
  setTimeout(() => { beakerStage.value = 5 }, 8500)
  setTimeout(() => { revealDone.value = true }, 10500)
}

async function goNext() {
  if (!quizStore.isPhotoPhase) saveCurrentManual()
  if (quizStore.isLastQuestion) {
    // Try real matching, fall back to mock
    try {
      const { getMatches, saveQuizResults } = await import('@/services/matching')
      const matches = await getMatches(quizStore.photoAnswers, quizStore.manualAnswers)
      if (matches.length > 0) {
        quizStore.setMatches(matches)
      } else {
        setMockMatches()
      }
      await saveQuizResults(authStore.uid, quizStore.photoAnswers, quizStore.manualAnswers)
    } catch (e) {
      setMockMatches()
    }
    quizStore.complete()
    runRevealAnimation()
  } else {
    quizStore.next()
  }
}

function setMockMatches() {
  quizStore.setMatches(mockPhotographers.map((p, i) => ({
    photographer: p,
    styleScore: 96 - (i * 4),
    totalScore: 96 - (i * 4),
    isFeatured: i === 1 || i === 5
  })))
}

function goPrev() {
  if (!quizStore.isPhotoPhase) saveCurrentManual()
  quizStore.prev()
}

function retakeQuiz() {
  revealDone.value = false
  beakerFilling.value = false
  beakerStage.value = 0
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
.phase-photo { background:var(--blush);color:var(--terracotta-dark); }
.phase-details { background:var(--sage-light);color:var(--sage-dark); }

.qz-title { font-family:var(--font-display);font-size:1.8rem;font-weight:400;text-align:center;margin-bottom:8px; }
.qz-sub { text-align:center;font-size:0.92rem;color:var(--warm-gray);margin-bottom:36px; }

.photo-pair { display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:40px; }
.photo-opt { border:3px solid var(--light-gray);border-radius:var(--radius-lg);overflow:hidden;cursor:pointer;transition:var(--transition);position:relative; }
.photo-opt:hover { border-color:var(--sage);transform:translateY(-3px);box-shadow:var(--shadow-md); }
.photo-opt.selected { border-color:var(--terracotta);box-shadow:0 0 0 3px rgba(196,130,106,0.2); }
.photo-img { aspect-ratio:4/3; }
.photo-check { position:absolute;top:12px;right:12px;width:28px;height:28px;border-radius:50%;background:var(--terracotta);color:white;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600; }
.photo-footer { padding:14px 18px;background:var(--warm-white); }
.photo-label { font-weight:500;font-size:0.92rem;margin-bottom:2px; }
.photo-desc { font-size:0.8rem;color:var(--warm-gray); }

.manual-form { max-width:480px;margin:0 auto 40px; }
.toggle-options { display:flex;gap:12px;flex-wrap:wrap; }
.toggle-opt { flex:1;min-width:120px;padding:14px;border:1.5px solid var(--light-gray);border-radius:var(--radius);background:transparent;font-size:0.92rem;color:var(--warm-gray);text-align:center;transition:var(--transition); }
.toggle-opt:hover { border-color:var(--sage);color:var(--charcoal); }
.toggle-opt.selected { border-color:var(--terracotta);background:rgba(196,130,106,0.06);color:var(--charcoal);font-weight:500; }

.budget-wrap { margin-bottom:20px;padding:0 20px; }
.budget-display { text-align:center;font-family:var(--font-display);font-size:2rem;font-weight:400;margin-bottom:16px; }
.budget-slider { width:100%;-webkit-appearance:none;height:4px;background:var(--light-gray);border-radius:100px;outline:none; }
.budget-slider::-webkit-slider-thumb { -webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--terracotta);cursor:pointer;box-shadow:0 2px 8px rgba(196,130,106,0.3); }
.budget-labels { display:flex;justify-content:space-between;margin-top:8px;font-size:0.78rem;color:var(--warm-gray); }

.qz-nav { display:flex;justify-content:space-between;align-items:center; }
.qz-back { padding:12px 24px;color:var(--warm-gray);font-size:0.88rem;transition:var(--transition); }
.qz-back:hover { color:var(--charcoal); }
.qz-next { padding:14px 32px;background:var(--charcoal);color:var(--cream);border-radius:100px;font-size:0.88rem;font-weight:500;transition:var(--transition); }
.qz-next:hover { background:var(--terracotta); }

/* ═══════════ BEAKER ANIMATION ═══════════ */
.beaker-wrap { text-align:center; padding:60px 0 80px; transition:all 0.6s ease; position:relative; }
.beaker-wrap.beaker-done { height:0; overflow:hidden; padding:0; opacity:0; margin:0; }

.beaker { display:inline-block; position:relative; width:80px; height:120px; margin-bottom:24px; }
.beaker-body {
  position:absolute; bottom:0; width:80px; height:90px;
  border:3px solid var(--sage); border-top:none;
  border-radius:0 0 12px 12px; overflow:hidden; background:rgba(139,158,130,0.05);
}
.beaker-liquid {
  position:absolute; bottom:0; left:0; right:0; height:0;
  background:linear-gradient(to top, var(--terracotta), var(--gold));
  border-radius:0 0 9px 9px; transition:height 8s cubic-bezier(0.25,0.46,0.45,0.94);
  overflow:hidden;
}
.beaker-liquid.filling { height:85%; }

.bubble {
  position:absolute; border-radius:50%; background:rgba(255,255,255,0.4);
  animation:rise 1.5s ease-in infinite;
}
.b1 { width:6px;height:6px;left:20%;bottom:-10px;animation-delay:0s; }
.b2 { width:4px;height:4px;left:50%;bottom:-10px;animation-delay:0.3s; }
.b3 { width:8px;height:8px;left:70%;bottom:-10px;animation-delay:0.6s; }
.b4 { width:5px;height:5px;left:35%;bottom:-10px;animation-delay:0.9s; }
.b5 { width:3px;height:3px;left:60%;bottom:-10px;animation-delay:1.2s; }

@keyframes rise {
  0% { transform:translateY(0) scale(1); opacity:0.8; }
  100% { transform:translateY(-80px) scale(0.3); opacity:0; }
}

.beaker-neck {
  position:absolute; top:10px; left:50%; transform:translateX(-50%);
  width:50px; height:20px; border:3px solid var(--sage); border-bottom:none;
  border-radius:4px 4px 0 0; background:var(--warm-white);
}
.beaker-rim {
  position:absolute; top:5px; left:50%; transform:translateX(-50%);
  width:60px; height:8px; border:3px solid var(--sage);
  border-radius:4px 4px 0 0;
}

.beaker-text {
  font-size:0.92rem; color:var(--warm-gray); opacity:0;
  transition:opacity 0.5s ease; position:absolute; left:0; right:0; bottom:-40px;
}
.beaker-text.show { opacity:1; }
.beaker-text-2 { color:var(--sage-dark); }
.beaker-text-3 { color:var(--sage-dark); }
.beaker-text-4 { color:var(--terracotta); }
.beaker-text-5 { color:var(--terracotta); font-weight:500; font-size:1.05rem; }

/* ═══════════ RESULTS CONTENT ═══════════ */
.results-content { opacity:0; transform:translateY(30px); transition:all 0.8s cubic-bezier(0.25,0.46,0.45,0.94); pointer-events:none; }
.results-content.show { opacity:1; transform:translateY(0); pointer-events:auto; }

.results-header { text-align:center; margin-bottom:48px; }
.results-icon { font-size:3rem; margin-bottom:16px; }
.results-title { font-family:var(--font-display); font-size:2.5rem; font-weight:300; margin-bottom:12px; }
.results-sub { font-size:1rem; color:var(--warm-gray); max-width:500px; margin:0 auto; line-height:1.6; }

.results-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:20px; }

.result-card {
  position:relative; border:1px solid var(--light-gray); border-radius:var(--radius-lg);
  overflow:hidden; cursor:pointer; transition:var(--transition); background:var(--cream);
  animation:cardReveal 0.6s ease-out both;
}
.result-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); border-color:var(--sage); }
.result-featured { border-color:var(--gold-light); box-shadow:0 0 0 1px var(--gold-light); }

@keyframes cardReveal { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

.rc-badge {
  position:absolute; top:12px; left:12px; z-index:2;
  padding:4px 12px; background:var(--gold); color:white;
  border-radius:100px; font-size:0.7rem; font-weight:600; letter-spacing:0.04em;
}
.rc-rank {
  position:absolute; top:12px; right:12px; z-index:2;
  width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.9);
  backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center;
  font-size:0.78rem; font-weight:600; color:var(--charcoal);
}

.rc-cover { height:160px; }

.rc-info { padding:20px; }
.rc-name { font-family:var(--font-display); font-size:1.25rem; font-weight:500; margin-bottom:4px; }
.rc-loc { font-size:0.82rem; color:var(--warm-gray); margin-bottom:14px; display:flex; align-items:center; gap:6px; }
.rc-loc::before { content:'◦'; color:var(--sage); }

.rc-match-bar-wrap { margin-bottom:14px; }
.rc-match-bar { height:6px; background:var(--light-gray); border-radius:100px; overflow:hidden; margin-bottom:6px; }
.rc-match-fill { height:100%; background:linear-gradient(90deg, var(--sage), var(--terracotta)); border-radius:100px; transition:width 1s ease 0.5s; }
.rc-match-score { font-size:0.82rem; font-weight:600; color:var(--sage-dark); }

.rc-tags { display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap; }
.rc-tag {
  padding:3px 10px; background:rgba(139,158,130,0.1); border-radius:100px;
  font-size:0.72rem; color:var(--sage-dark); font-weight:500;
}

.rc-price { font-size:0.82rem; color:var(--warm-gray); }

.rc-action {
  padding:14px 20px; border-top:1px solid var(--light-gray);
  font-size:0.85rem; font-weight:500; color:var(--terracotta); text-align:center;
  transition:var(--transition);
}
.result-card:hover .rc-action { background:rgba(196,130,106,0.05); }

/* RESPONSIVE */
@media (max-width:768px) {
  .quiz-card { padding:36px 24px; }
  .quiz-card-results { padding:36px 20px; }
  .photo-pair { grid-template-columns:1fr; }
  .results-grid { grid-template-columns:1fr; }
  .toggle-options { flex-direction:column; }
  .results-title { font-size:2rem; }
}
</style>
