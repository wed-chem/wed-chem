import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { editingStyles, photoStyles, saturationQuestion, abPairs, featureQuestions, logisticalQuestions } from '@/data/quizData'

export const useQuizStore = defineStore('quiz', () => {
  // State
  const currentIndex = ref(0)
  const mode = ref('couple')
  const completed = ref(false)
  const matches = ref([])
  const showThinking = ref(false)
  const thinkingText = ref([])
  const beakerFill = ref(0)

  // Q1: Editing style rankings (ordered array of style ids)
  const editingRanking = ref([])
  // Q2: Photo style rankings (ordered array of style ids)
  const photoStyleRanking = ref([])
  // Q3: Saturation pick
  const saturationPick = ref(null)
  // Q4-10: A/B pair answers { 4: 'a', 5: 'b', ... }
  const abAnswers = ref({})
  // Q11-15: Feature answers { aerial: 'Yes, definitely', film: 'No, digital is fine', ... }
  const featureAnswers = ref({})
  // Logistical answers { location: {...}, budget: 5000, ... }
  const manualAnswers = ref({})

  // Question phases
  // 0: editing style ranking
  // 1: photo style ranking
  // 2: saturation
  // 3-9: A/B pairs (abPairs[0-6])
  // 10-14: feature questions
  // 15-18: logistical questions
  const phases = computed(() => {
    const items = []
    items.push({ type: 'editingRank', data: editingStyles })      // 0
    items.push({ type: 'photoStyleRank', data: photoStyles })     // 1
    items.push({ type: 'abPair', data: saturationQuestion })      // 2
    abPairs.forEach(p => items.push({ type: 'abPair', data: p })) // 3-9
    featureQuestions.forEach(q => items.push({ type: 'feature', data: q })) // 10-14
    if (mode.value === 'couple') {
      logisticalQuestions.forEach(q => items.push({ type: 'logistical', data: q })) // 15-18
    }
    return items
  })

  const totalQuestions = computed(() => phases.value.length)
  const progress = computed(() => ((currentIndex.value) / totalQuestions.value) * 100)
  const currentQuestion = computed(() => phases.value[currentIndex.value] || phases.value[0])
  const isLastQuestion = computed(() => currentIndex.value >= totalQuestions.value - 1)

  // Phase checks
  const isEditingRank = computed(() => currentQuestion.value?.type === 'editingRank')
  const isPhotoStyleRank = computed(() => currentQuestion.value?.type === 'photoStyleRank')
  const isABPair = computed(() => currentQuestion.value?.type === 'abPair')
  const isFeature = computed(() => currentQuestion.value?.type === 'feature')
  const isLogistical = computed(() => currentQuestion.value?.type === 'logistical')

  // Thinking break indices (after Q3 = index 2, after Q10 = index 9)
  const thinkingBreaks = { 2: 1, 6: 2, 9: 3 } // index -> break number (1/3, 2/3, 3/3)

  function reset(m = 'couple') {
    editingRanking.value = []
    photoStyleRanking.value = []
    saturationPick.value = null
    abAnswers.value = {}
    featureAnswers.value = {}
    manualAnswers.value = {}
    currentIndex.value = 0
    mode.value = m
    completed.value = false
    matches.value = []
    showThinking.value = false
  }

  function toggleEditingStyle(id) {
    const idx = editingRanking.value.indexOf(id)
    if (idx >= 0) editingRanking.value.splice(idx, 1)
    else editingRanking.value.push(id)
  }

  function togglePhotoStyle(id) {
    const idx = photoStyleRanking.value.indexOf(id)
    if (idx >= 0) photoStyleRanking.value.splice(idx, 1)
    else photoStyleRanking.value.push(id)
  }

  function selectAB(answer) {
    const q = currentQuestion.value.data
    if (q.id === 'saturation') saturationPick.value = answer
    else abAnswers.value[q.id] = answer
  }

  function setFeatureAnswer(id, val) { featureAnswers.value[id] = val }
  function setManualAnswer(id, val) { manualAnswers.value[id] = val }

  async function next() {
    if (currentIndex.value < totalQuestions.value - 1) {
      // Check if we should show a thinking break
      const breakNum = thinkingBreaks[currentIndex.value]
      if (breakNum) {
        showThinking.value = true
        beakerFill.value = breakNum
        if (breakNum === 1) {
          thinkingText.value = getEditingSummaryMessages()
          await new Promise(r => setTimeout(r, 5500))
        } else if (breakNum === 2) {
          thinkingText.value = ['Your style profile is taking shape...', 'Cross-referencing with photographer portfolios...']
          await new Promise(r => setTimeout(r, 5000))
        } else {
          thinkingText.value = ['Almost there...', 'Fine-tuning your compatibility scores...', 'Preparing your personalized matches...']
          await new Promise(r => setTimeout(r, 6000))
        }
        showThinking.value = false
      }
      currentIndex.value++
    }
  }

  function prev() { if (currentIndex.value > 0) currentIndex.value-- }
  function complete() { completed.value = true }
  function setMatches(m) { matches.value = m }

  function getEditingSummaryMessages() {
    const top = editingRanking.value[0]
    const labels = { warm: 'warm, golden', cool: 'cool, dramatic', true: 'natural, true-to-life', vibrant: 'vibrant, bold', airy: 'light, airy' }
    const desc = labels[top] || 'unique'
    return [`Analyzing your editing preferences...`, `You're drawn to ${desc} tones`]
  }

  // Get all answers in a format the matching algorithm can use
  function getAllAnswers() {
    return {
      editingRanking: editingRanking.value,
      photoStyleRanking: photoStyleRanking.value,
      saturation: saturationPick.value,
      abAnswers: abAnswers.value,
      features: featureAnswers.value,
      manual: manualAnswers.value
    }
  }

  return {
    currentIndex, mode, completed, matches, showThinking, thinkingText, beakerFill,
    editingRanking, photoStyleRanking, saturationPick, abAnswers, featureAnswers, manualAnswers,
    phases, totalQuestions, progress, currentQuestion, isLastQuestion,
    isEditingRank, isPhotoStyleRank, isABPair, isFeature, isLogistical,
    reset, toggleEditingStyle, togglePhotoStyle, selectAB,
    setFeatureAnswer, setManualAnswer, next, prev, complete, setMatches, getAllAnswers
  }
})
