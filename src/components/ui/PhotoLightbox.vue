<template>
  <Teleport to="body">
    <transition name="lightbox">
      <div class="lb-overlay" v-if="show" @click.self="$emit('close')">
        <button class="lb-close" @click="$emit('close')">✕</button>
        <button class="lb-nav lb-prev" @click="prev" v-if="photos.length > 1">‹</button>
        <button class="lb-nav lb-next" @click="next" v-if="photos.length > 1">›</button>

        <div class="lb-content">
          <div class="lb-img-wrap">
            <img :src="photos[current]" :alt="'Photo ' + (current+1)" class="lb-img" @click.stop>
          </div>
          <div class="lb-counter" v-if="photos.length > 1">{{ current + 1 }} / {{ photos.length }}</div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  photos: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['close'])
const current = ref(0)

watch(() => props.startIndex, (val) => { current.value = val })
watch(() => props.show, (val) => {
  if (val) { current.value = props.startIndex; document.body.style.overflow = 'hidden' }
  else { document.body.style.overflow = '' }
})

function next() { current.value = (current.value + 1) % props.photos.length }
function prev() { current.value = (current.value - 1 + props.photos.length) % props.photos.length }

function onKey(e) {
  if (!props.show) return
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })
</script>

<style scoped>
.lb-overlay {
  position:fixed; inset:0; z-index:9999;
  background:rgba(0,0,0,0.92); backdrop-filter:blur(8px);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
}
.lb-close {
  position:absolute; top:20px; right:24px; z-index:10;
  color:white; font-size:1.5rem; padding:12px;
  opacity:0.7; transition:opacity 0.2s;
}
.lb-close:hover { opacity:1; }
.lb-nav {
  position:absolute; top:50%; transform:translateY(-50%); z-index:10;
  color:white; font-size:2.5rem; padding:20px;
  opacity:0.5; transition:opacity 0.2s;
}
.lb-nav:hover { opacity:1; }
.lb-prev { left:12px; }
.lb-next { right:12px; }
.lb-content { display:flex; flex-direction:column; align-items:center; max-width:90vw; max-height:90vh; }
.lb-img-wrap { display:flex; align-items:center; justify-content:center; cursor:default; }
.lb-img { max-width:90vw; max-height:85vh; object-fit:contain; border-radius:4px; }
.lb-counter { color:rgba(255,255,255,0.5); font-size:0.85rem; margin-top:16px; }

.lightbox-enter-active, .lightbox-leave-active { transition:opacity 0.25s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity:0; }
</style>
