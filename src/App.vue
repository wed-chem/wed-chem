<template>
  <NavBar />
  <main id="main-content">
    <router-view :key="$route.fullPath" />
  </main>
  <FooterSection />
</template>

<script setup>
import NavBar from '@/components/layout/NavBar.vue'
import FooterSection from '@/components/layout/FooterSection.vue'
</script>


