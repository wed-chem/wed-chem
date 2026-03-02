<template>
  <a href="#main-content" class="skip-nav">Skip to content</a>
  <nav role="navigation" aria-label="Main navigation" :class="{ scrolled }">
    <div class="container">
      <router-link to="/" class="nav-logo"><img src="/logo-transparent.png" alt="WedChem" class="nav-logo-img"></router-link>
      <ul class="nav-links" :class="{ open: menuOpen }">
        <li><router-link to="/#how-it-works" @click="menuOpen = false">How It Works</router-link></li>
        <li><router-link to="/directory" @click="menuOpen = false">Photographers</router-link></li>
        <li><router-link to="/pricing" @click="menuOpen = false">Pricing</router-link></li>
        <li><router-link to="/blog" @click="menuOpen = false">Blog</router-link></li>
        <li v-if="authStore.isAdmin">
          <router-link to="/admin" @click="menuOpen = false">Admin</router-link>
        </li>
        <li v-if="authStore.isPhotographer">
          <router-link to="/dashboard" class="nav-btn" @click="menuOpen = false">Dashboard</router-link>
        </li>
        <li v-if="authStore.isLoggedIn && !authStore.isPhotographer">
          <router-link to="/account" @click="menuOpen = false">My Matches</router-link>
        </li>
        <li v-if="authStore.isLoggedIn && !authStore.isPhotographer">
          <router-link to="/quiz" class="nav-btn" @click="menuOpen = false">Get Matched</router-link>
        </li>
        <li v-if="authStore.isLoggedIn">
          <button class="nav-link-btn" @click="authStore.logout(); menuOpen = false">Logout</button>
        </li>
        <li v-if="!authStore.isLoggedIn">
          <router-link to="/login" @click="menuOpen = false">Log In</router-link>
        </li>
        <li v-if="!authStore.isLoggedIn">
          <router-link to="/quiz" class="nav-btn" @click="menuOpen = false">Get Matched</router-link>
        </li>
      </ul>
      <button class="mobile-toggle" @click="menuOpen = !menuOpen">
        <span /><span /><span />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() { scrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
nav { position:fixed; top:0; left:0; right:0; z-index:1000; padding:20px 0; transition:var(--transition); background:transparent; }
nav.scrolled { background:rgba(250,247,242,0.95); backdrop-filter:blur(20px); padding:14px 0; box-shadow:0 1px 10px rgba(44,44,44,0.06); }
nav .container { display:flex; justify-content:space-between; align-items:center; }
.nav-logo { display:flex; align-items:center; }
.nav-logo-img { height:180px; width:auto; }
.nav-links { display:flex; align-items:center; gap:32px; list-style:none; }
.nav-links a, .nav-links button { color:var(--warm-gray); font-size:0.86rem; font-weight:400; letter-spacing:0.04em; text-transform:uppercase; transition:var(--transition); }
.nav-links a:hover, .nav-links button:hover { color:var(--charcoal); }
.nav-btn { display:inline-flex; align-items:center; padding:10px 24px; background:var(--charcoal); color:var(--cream) !important; border-radius:100px; font-size:0.83rem !important; font-weight:500; transition:var(--transition); }
.nav-btn:hover { background:var(--terracotta); transform:translateY(-1px); }
.nav-link-btn { background:none; border:none; cursor:pointer; font-family:inherit; }
.mobile-toggle { display:none; padding:8px; }
.mobile-toggle span { display:block; width:24px; height:2px; background:var(--charcoal); margin:5px 0; border-radius:2px; }
@media(max-width:768px) {
  .nav-links { display:none; }
  .nav-links.open { display:flex; flex-direction:column; position:absolute; top:100%; left:0; right:0; background:var(--cream); padding:24px; gap:20px; box-shadow:var(--shadow-md); }
  .mobile-toggle { display:block; }
}
.nav-photog-link { color:var(--terracotta) !important; font-weight:500 !important; }
.skip-nav { position:absolute; top:-100px; left:50%; transform:translateX(-50%); padding:12px 24px; background:var(--charcoal); color:var(--cream); border-radius:0 0 8px 8px; z-index:9999; font-size:0.85rem; transition:top 0.2s; }
.skip-nav:focus { top:0; }
</style>
