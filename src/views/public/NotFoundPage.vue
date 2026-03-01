<template>
  <div style="padding:140px 0 80px;background:var(--cream);min-height:60vh;text-align:center;" class="container">
    <div style="font-size:4rem;margin-bottom:16px;">🔍</div>
    <h1 class="section-title">Page not found</h1>
    <p style="color:var(--warm-gray);margin-bottom:32px;">The page you're looking for doesn't exist or has been moved.</p>
    <div style="display:flex;gap:16px;justify-content:center;">
      <router-link to="/" class="btn-primary">Back to Home</router-link>
      <router-link to="/quiz" class="btn-secondary">Take the Quiz</router-link>
    </div>
  </div>
</template>
