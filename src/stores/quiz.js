import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { photoQuestions, manualQuestions } from '@/data/quizData'

export const useQuizStore = defineStore('quiz', () => {
  const photoAnswers = ref({})
  const manualAnswers = ref({})
  const currentIndex = ref(0)
  const mode = ref('couple')
  const completed = ref(false)
  const matches = ref([])

  const totalPhotoQuestions = photoQuestions.length
  const totalQuestions = computed(() => mode.value === 'photographer' ? totalPhotoQuestions : totalPhotoQuestions + manualQuestions.length)
  const progress = computed(() => (currentIndex.value / totalQuestions.value) * 100)
  const isPhotoPhase = computed(() => currentIndex.value < totalPhotoQuestions)
  const currentQuestion = computed(() => {
    if (isPhotoPhase.value) return { type: 'photo', data: photoQuestions[currentIndex.value] }
    return { type: 'manual', data: manualQuestions[currentIndex.value - totalPhotoQuestions] }
  })
  const isLastQuestion = computed(() => currentIndex.value >= totalQuestions.value - 1)

  function reset(m = 'couple') { photoAnswers.value = {}; manualAnswers.value = {}; currentIndex.value = 0; mode.value = m; completed.value = false; matches.value = [] }
  function selectPhotoAnswer(a) { photoAnswers.value[currentIndex.value] = a }
  function setManualAnswer(id, v) { manualAnswers.value[id] = v }
  function next() { if (currentIndex.value < totalQuestions.value - 1) currentIndex.value++ }
  function prev() { if (currentIndex.value > 0) currentIndex.value-- }
  function complete() { completed.value = true }
  function setMatches(m) { matches.value = m }

  return { photoAnswers, manualAnswers, currentIndex, mode, completed, matches, totalPhotoQuestions, totalQuestions, progress, isPhotoPhase, currentQuestion, isLastQuestion, reset, selectPhotoAnswer, setManualAnswer, next, prev, complete, setMatches }
})
