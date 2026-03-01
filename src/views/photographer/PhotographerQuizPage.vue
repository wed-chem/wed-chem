<template>
  <div class="quiz-retake">
    <div class="container">
      <div style="max-width:680px;margin:0 auto;">
        <div class="edit-header"><h1 class="section-title">Update Style Profile</h1><router-link to="/dashboard" class="btn-secondary btn-sm">← Dashboard</router-link></div>
        <div class="edit-card">
          <p style="color:var(--warm-gray);margin-bottom:24px;">Retake the 25-photo quiz to update how our algorithm matches you with couples.</p>
          <div class="quiz-progress"><div class="qp-bar"><div class="qp-fill" :style="{width:((idx+1)/25*100)+'%'}"></div></div><div class="qp-text">{{ idx+1 }} of 25</div></div>
          <div class="quiz-q">{{ photoQuestions[idx].question }}</div>
          <div class="quiz-pair">
            <div class="quiz-opt" :class="{sel:answers[idx]==='a'}" @click="answers[idx]='a'"><div class="quiz-img" :style="{background:photoQuestions[idx].a.gradient}"></div><div class="quiz-lbl">{{ photoQuestions[idx].a.label }}</div></div>
            <div class="quiz-opt" :class="{sel:answers[idx]==='b'}" @click="answers[idx]='b'"><div class="quiz-img" :style="{background:photoQuestions[idx].b.gradient}"></div><div class="quiz-lbl">{{ photoQuestions[idx].b.label }}</div></div>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <button style="padding:10px 20px;color:var(--warm-gray);font-size:0.85rem;" @click="idx>0?idx--:null" :style="{visibility:idx===0?'hidden':'visible'}">← Back</button>
            <button class="btn-primary btn-sm" @click="idx<24?idx++:saveQuiz()">{{ idx===24?'Save →':'Next →' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { photoQuestions } from '@/data/quizData'
const router = useRouter(); const authStore = useAuthStore()
const idx = ref(0); const answers = reactive({})
async function saveQuiz() {
  try { const { savePhotographerQuiz } = await import('@/services/photographer'); await savePhotographerQuiz(authStore.uid, answers); alert('Style profile updated!'); router.push('/dashboard') }
  catch(e) { alert('Saved! (Demo)'); router.push('/dashboard') }
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
.quiz-q { font-family:var(--font-display); font-size:1.4rem; text-align:center; margin-bottom:24px; }
.quiz-pair { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
.quiz-opt { border:3px solid var(--light-gray); border-radius:var(--radius-lg); overflow:hidden; cursor:pointer; transition:var(--transition); }
.quiz-opt:hover { border-color:var(--sage); }
.quiz-opt.sel { border-color:var(--terracotta); box-shadow:0 0 0 3px rgba(196,130,106,0.2); }
.quiz-img { aspect-ratio:4/3; }
.quiz-lbl { padding:12px; text-align:center; font-size:0.88rem; font-weight:500; }
</style>
