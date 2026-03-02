<template>
  <NavBar />
  <main id="main-content">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </router-view>
  </main>
  <FooterSection />
</template>

<script setup>
import NavBar from '@/components/layout/NavBar.vue'
import FooterSection from '@/components/layout/FooterSection.vue'
</script>

<style>
.fade-enter-active { transition: opacity 0.25s ease; }
.fade-enter-from { opacity: 0; }
</style>
