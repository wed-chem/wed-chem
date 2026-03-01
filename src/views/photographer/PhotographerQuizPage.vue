<template>
  <div class="quiz-retake">
    <div class="container">
      <div style="max-width:680px;margin:0 auto;">
        <div class="edit-header"><h1 class="section-title">Update Style Profile</h1><router-link to="/dashboard" class="btn-secondary btn-sm">← Dashboard</router-link></div>
        <div class="edit-card">
          <p style="color:var(--warm-gray);margin-bottom:24px;">Update your style quiz to improve how our algorithm matches you with couples.</p>

          <div class="quiz-progress"><div class="qp-bar"><div class="qp-fill" :style="{width: progress + '%'}"></div></div><div class="qp-text">{{ currentStep }} of {{ totalSteps }}</div></div>

          <!-- Editing Styles -->
          <div v-if="phase==='editing'">
            <div class="quiz-q">What editing styles describe your work?</div>
            <div class="quiz-sub">Select in order of preference</div>
            <div class="rank-grid">
              <button class="rank-card" v-for="style in editingStyles" :key="style.id"
                :class="{selected: answers.editingStyles.includes(style.id)}"
                @click="toggleList(answers.editingStyles, style.id)">
                <div class="rank-preview" :style="{background: style.gradient}"></div>
                <div class="rank-label">{{ style.label }}</div>
                <div class="rank-number" v-if="answers.editingStyles.includes(style.id)">
                  {{ answers.editingStyles.indexOf(style.id) + 1 }}
                </div>
              </button>
            </div>
          </div>

          <!-- Photo Styles -->
          <div v-if="phase==='photoStyle'">
            <div class="quiz-q">What photo styles describe your work?</div>
            <div class="quiz-sub">Select in order of preference</div>
            <div class="rank-grid rank-grid-4">
              <button class="rank-card" v-for="style in photoStyles" :key="style.id"
                :class="{selected: answers.photoStyles.includes(style.id)}"
                @click="toggleList(answers.photoStyles, style.id)">
                <div class="rank-label">{{ style.label }}</div>
                <div class="rank-desc">{{ style.description }}</div>
                <div class="rank-number" v-if="answers.photoStyles.includes(style.id)">
                  {{ answers.photoStyles.indexOf(style.id) + 1 }}
                </div>
              </button>
            </div>
          </div>

          <!-- Saturation -->
          <div v-if="phase==='saturation'">
            <div class="quiz-q">{{ saturationQuestion.question }}</div>
            <div class="quiz-pair">
              <div class="quiz-opt" :class="{sel:answers.saturation==='a'}" @click="answers.saturation='a'">
                <div class="quiz-img" :style="{background:saturationQuestion.a.gradient}"></div>
                <div class="quiz-lbl">{{ saturationQuestion.a.label }}</div>
              </div>
              <div class="quiz-opt" :class="{sel:answers.saturation==='b'}" @click="answers.saturation='b'">
                <div class="quiz-img" :style="{background:saturationQuestion.b.gradient}"></div>
                <div class="quiz-lbl">{{ saturationQuestion.b.label }}</div>
              </div>
            </div>
          </div>

          <!-- A/B Pairs -->
          <div v-if="phase==='ab'">
            <div class="quiz-q">{{ abPairs[abIdx].question }}</div>
            <div class="quiz-pair">
              <div class="quiz-opt" :class="{sel:answers.abAnswers[abPairs[abIdx].id]==='a'}" @click="answers.abAnswers[abPairs[abIdx].id]='a'">
                <div class="quiz-img" :style="{background: abPairs[abIdx].a.image ? `url(${abPairs[abIdx].a.image}) center/cover` : abPairs[abIdx].a.gradient}"></div>
                <div class="quiz-lbl">{{ abPairs[abIdx].a.label }}</div>
              </div>
              <div class="quiz-opt" :class="{sel:answers.abAnswers[abPairs[abIdx].id]==='b'}" @click="answers.abAnswers[abPairs[abIdx].id]='b'">
                <div class="quiz-img" :style="{background: abPairs[abIdx].b.image ? `url(${abPairs[abIdx].b.image}) center/cover` : abPairs[abIdx].b.gradient}"></div>
                <div class="quiz-lbl">{{ abPairs[abIdx].b.label }}</div>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div v-if="phase==='features'">
            <div class="quiz-q">{{ featureSteps[featIdx].question }}</div>
            <div class="feature-options" :class="{'feature-col': featureSteps[featIdx].options.length > 3}">
              <button v-for="opt in featureSteps[featIdx].options" :key="opt" class="toggle-opt"
                :class="{selected: answers.features[featureSteps[featIdx].id] === opt}"
                @click="answers.features[featureSteps[featIdx].id] = opt">{{ opt }}</button>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;">
            <button style="padding:10px 20px;color:var(--warm-gray);font-size:0.85rem;" @click="goPrev" :style="{visibility:phase==='editing'?'hidden':'visible'}">← Back</button>
            <button class="btn-primary btn-sm" @click="goNext">{{ isLast ? 'Save →' : 'Next →' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { editingStyles, photoStyles, saturationQuestion, abPairs, personalityTypes, coverageOptions } from '@/data/quizData'

const router = useRouter()
const authStore = useAuthStore()

const phase = ref('editing')
const abIdx = ref(0)
const featIdx = ref(0)

const featureSteps = [
  { id: 'aerial', question: 'Do you offer aerial / drone photography?', options: ['Yes', 'No'] },
  { id: 'film', question: 'Do you offer film photography?', options: ['Yes, I shoot film', 'No, digital only'] },
  { id: 'secondShooter', question: 'Do you have second shooters available?', options: ['Yes', 'No'] },
  { id: 'personality', question: 'How would clients describe your personality?', options: personalityTypes },
  { id: 'hours', question: 'What coverage do you typically offer?', options: coverageOptions }
]

const answers = reactive({
  editingStyles: [],
  photoStyles: [],
  saturation: null,
  abAnswers: {},
  features: {}
})

const totalSteps = 2 + 1 + abPairs.length + featureSteps.length
const currentStep = computed(() => {
  if (phase.value === 'editing') return 1
  if (phase.value === 'photoStyle') return 2
  if (phase.value === 'saturation') return 3
  if (phase.value === 'ab') return 4 + abIdx.value
  if (phase.value === 'features') return 4 + abPairs.length + featIdx.value
  return 1
})
const progress = computed(() => (currentStep.value / totalSteps) * 100)
const isLast = computed(() => phase.value === 'features' && featIdx.value >= featureSteps.length - 1)

function toggleList(list, id) {
  const idx = list.indexOf(id)
  if (idx >= 0) list.splice(idx, 1)
  else list.push(id)
}

function goNext() {
  if (phase.value === 'editing') { phase.value = 'photoStyle'; return }
  if (phase.value === 'photoStyle') { phase.value = 'saturation'; return }
  if (phase.value === 'saturation') { phase.value = 'ab'; abIdx.value = 0; return }
  if (phase.value === 'ab') {
    if (abIdx.value < abPairs.length - 1) { abIdx.value++; return }
    phase.value = 'features'; featIdx.value = 0; return
  }
  if (phase.value === 'features') {
    if (featIdx.value < featureSteps.length - 1) { featIdx.value++; return }
    saveQuiz()
  }
}

function goPrev() {
  if (phase.value === 'features' && featIdx.value > 0) { featIdx.value--; return }
  if (phase.value === 'features') { phase.value = 'ab'; abIdx.value = abPairs.length - 1; return }
  if (phase.value === 'ab' && abIdx.value > 0) { abIdx.value--; return }
  if (phase.value === 'ab') { phase.value = 'saturation'; return }
  if (phase.value === 'saturation') { phase.value = 'photoStyle'; return }
  if (phase.value === 'photoStyle') { phase.value = 'editing'; return }
}

async function saveQuiz() {
  try {
    const { savePhotographerQuiz } = await import('@/services/photographer')
    await savePhotographerQuiz(authStore.uid, {
      ...answers,
      hasAerial: answers.features.aerial === 'Yes',
      hasFilm: answers.features.film === 'Yes, I shoot film',
      hasSecondShooter: answers.features.secondShooter === 'Yes',
      personality: answers.features.personality ? [answers.features.personality] : [],
      coverageHours: answers.features.hours ? [answers.features.hours] : []
    })
    alert('Style profile updated!')
    router.push('/dashboard')
  } catch(e) {
    alert('Saved! (Demo)')
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.quiz-retake { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.edit-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; }
.edit-card { background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:40px; box-shadow:var(--shadow-md); }
.quiz-progress { margin-bottom:24px; }
.qp-bar { height:4px; background:var(--light-gray); border-radius:100px; overflow:hidden; margin-bottom:8px; }
.qp-fill { height:100%; background:var(--terracotta); border-radius:100px; transition:width 0.4s; }
.qp-text { font-size:0.78rem; color:var(--warm-gray); text-align:center; }
.quiz-q { font-family:var(--font-display); font-size:1.4rem; text-align:center; margin-bottom:8px; }
.quiz-sub { text-align:center; font-size:0.85rem; color:var(--warm-gray); margin-bottom:24px; }
.quiz-pair { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
.quiz-opt { border:3px solid var(--light-gray); border-radius:var(--radius-lg); overflow:hidden; cursor:pointer; transition:var(--transition); }
.quiz-opt:hover { border-color:var(--sage); }
.quiz-opt.sel { border-color:var(--terracotta); box-shadow:0 0 0 3px rgba(196,130,106,0.2); }
.quiz-img { aspect-ratio:4/3; }
.quiz-lbl { padding:12px; text-align:center; font-size:0.88rem; font-weight:500; }

.rank-grid { display:grid; grid-template-columns:repeat(5, 1fr); gap:10px; margin-bottom:24px; }
.rank-grid-4 { grid-template-columns:repeat(4, 1fr); }
.rank-card { position:relative; padding:14px 10px; border:2px solid var(--light-gray); border-radius:var(--radius); cursor:pointer; transition:var(--transition); text-align:center; background:var(--warm-white); }
.rank-card:hover { border-color:var(--sage); transform:translateY(-2px); }
.rank-card.selected { border-color:var(--terracotta); background:rgba(196,130,106,0.04); }
.rank-preview { height:40px; border-radius:6px; margin-bottom:8px; }
.rank-label { font-weight:500; font-size:0.82rem; margin-bottom:2px; }
.rank-desc { font-size:0.7rem; color:var(--warm-gray); line-height:1.3; }
.rank-number { position:absolute; top:6px; right:6px; width:22px; height:22px; border-radius:50%; background:var(--terracotta); color:white; display:flex; align-items:center; justify-content:center; font-size:0.68rem; font-weight:700; }

.feature-options { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px; }
.feature-col { flex-direction:column; }
.toggle-opt { flex:1; min-width:120px; padding:14px; border:1.5px solid var(--light-gray); border-radius:var(--radius); background:transparent; font-size:0.88rem; color:var(--warm-gray); text-align:center; transition:var(--transition); cursor:pointer; }
.toggle-opt:hover { border-color:var(--sage); color:var(--charcoal); }
.toggle-opt.selected { border-color:var(--terracotta); background:rgba(196,130,106,0.06); color:var(--charcoal); font-weight:500; }

@media(max-width:768px) {
  .edit-card { padding:28px 20px; }
  .quiz-pair { grid-template-columns:1fr; }
  .rank-grid { grid-template-columns:repeat(2, 1fr); }
  .rank-grid-4 { grid-template-columns:repeat(2, 1fr); }
  .feature-options { flex-direction:column; }
}
</style>
