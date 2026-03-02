<template>
  <div class="blogpost-page">
    <div class="container">
      <div v-if="post" class="post-wrap">
        <!-- HEADER -->
        <div class="post-header">
          <router-link to="/blog" class="back-link">← All Articles</router-link>
          <span class="post-cat">{{ post.category }}</span>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">{{ formatDate(post.date) }} · {{ post.readTime }} read</div>
        </div>

        <!-- HERO IMAGE PLACEHOLDER -->
        <div class="post-hero" :style="{background: post.heroImage ? `url(${post.heroImage}) center/cover` : gradientForCategory(post.category)}">
          <div class="hero-placeholder" v-if="!post.heroImage">📷 {{ post.heroPlaceholder }}</div>
        </div>

        <!-- CONTENT -->
        <article class="post-content" v-html="post.content"></article>

        <!-- RELATED -->
        <div class="related-section" v-if="related.length">
          <h2 class="related-title">Keep Reading</h2>
          <div class="related-grid">
            <div class="related-card" v-for="r in related" :key="r.slug" @click="$router.push('/blog/' + r.slug)">
              <div class="rel-image" :style="{background: gradientForCategory(r.category)}"></div>
              <div class="rel-body">
                <span class="rel-cat">{{ r.category }}</span>
                <h3 class="rel-title">{{ r.title }}</h3>
                <div class="rel-meta">{{ r.readTime }} read</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 404 -->
      <div v-else class="post-404">
        <h1>Article not found</h1>
        <p>This article doesn't exist or has been moved.</p>
        <router-link to="/blog" class="btn-primary">Browse All Articles →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useSEO } from '@/composables/useSEO'
import { useRoute } from 'vue-router'
import { getBlogPost, getRelatedPosts } from '@/data/blogData'

const route = useRoute()
const post = computed(() => getBlogPost(route.params.slug))
const related = computed(() => post.value ? getRelatedPosts(route.params.slug, 3) : [])

// Dynamic SEO from article data
watch(() => post.value, (p) => {
  if (p) {
    useSEO({
      title: p.title,
      description: p.excerpt || p.title + ' — Wedding photography tips and style guides from WedChem.',
      path: '/blog/' + route.params.slug
    })
  }
}, { immediate: true })

watch(() => route.params.slug, () => { window.scrollTo(0, 0) })

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function gradientForCategory(cat) {
  const gradients = {
    'Style Guide': 'linear-gradient(135deg, #e8d5cc, #c5d4be)',
    'Planning': 'linear-gradient(135deg, #c5d4be, #e8e3dc)',
    'Advice': 'linear-gradient(135deg, #e8e3dc, #d4dfe8)'
  }
  return gradients[cat] || 'linear-gradient(135deg, #e8d5cc, #faf7f2)'
}
</script>

<style scoped>
.blogpost-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.post-wrap { max-width:760px; margin:0 auto; }

.back-link { display:inline-block; font-size:0.85rem; color:var(--warm-gray); margin-bottom:24px; transition:var(--transition); }
.back-link:hover { color:var(--charcoal); }

.post-header { margin-bottom:32px; }
.post-cat { display:inline-block; padding:4px 14px; background:var(--sage-light); color:var(--sage-dark); border-radius:100px; font-size:0.72rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:16px; }
.post-title { font-family:var(--font-display); font-size:clamp(2rem,4vw,2.8rem); font-weight:300; line-height:1.2; margin-bottom:16px; }
.post-meta { font-size:0.88rem; color:var(--warm-gray); }

.post-hero { height:400px; border-radius:var(--radius-lg); margin-bottom:48px; display:flex; align-items:center; justify-content:center; }
.hero-placeholder { padding:16px 24px; background:rgba(255,255,255,0.7); backdrop-filter:blur(8px); border-radius:var(--radius); font-size:0.88rem; color:var(--warm-gray); }

/* ARTICLE CONTENT */
.post-content { font-size:1.05rem; line-height:1.8; color:var(--charcoal); }
.post-content :deep(h2) { font-family:var(--font-display); font-size:1.6rem; font-weight:400; margin:48px 0 16px; }
.post-content :deep(p) { margin-bottom:20px; }
.post-content :deep(a) { color:var(--terracotta); text-decoration:underline; text-underline-offset:3px; }
.post-content :deep(strong) { font-weight:600; }

.post-content :deep(.blog-photo-placeholder) {
  margin:32px 0; padding:40px; background:var(--light-gray);
  border-radius:var(--radius-lg); text-align:center; border:2px dashed rgba(0,0,0,0.1);
}
.post-content :deep(.placeholder-label) { font-size:0.88rem; color:var(--warm-gray); }

.post-content :deep(.blog-gallery) {
  display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:32px 0 8px; border-radius:var(--radius-lg); overflow:hidden;
}
.post-content :deep(.blog-gallery-3) { grid-template-columns:1fr 1fr 1fr; }
.post-content :deep(.blog-gallery-4) { grid-template-columns:1fr 1fr; }
.post-content :deep(.blog-gallery img) {
  width:100%; height:280px; object-fit:cover; border-radius:var(--radius);
  transition:transform 0.3s ease;
}
.post-content :deep(.blog-gallery img:hover) { transform:scale(1.02); }
.post-content :deep(.blog-photo-credit) {
  font-size:0.75rem; color:var(--warm-gray); text-align:right; margin-bottom:32px; font-style:italic;
}

.post-content :deep(.blog-cta) {
  margin:48px 0; padding:40px; background:var(--warm-white);
  border:1px solid var(--light-gray); border-radius:var(--radius-lg); text-align:center;
}
.post-content :deep(.blog-cta h3) {
  font-family:var(--font-display); font-size:1.4rem; font-weight:400; margin-bottom:16px;
}
.post-content :deep(.blog-cta .btn-primary) {
  display:inline-flex; padding:14px 32px; background:var(--charcoal); color:var(--cream);
  border-radius:100px; font-size:0.88rem; font-weight:500; text-decoration:none; transition:var(--transition);
}
.post-content :deep(.blog-cta .btn-primary:hover) { background:var(--terracotta); }

/* RELATED */
.related-section { margin-top:80px; padding-top:48px; border-top:1px solid var(--light-gray); }
.related-title { font-family:var(--font-display); font-size:1.6rem; font-weight:300; margin-bottom:24px; }
.related-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; }
.related-card { border-radius:var(--radius); overflow:hidden; background:var(--warm-white); border:1px solid var(--light-gray); cursor:pointer; transition:var(--transition); }
.related-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
.rel-image { height:120px; }
.rel-body { padding:16px; }
.rel-cat { font-size:0.68rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--warm-gray); }
.rel-title { font-family:var(--font-display); font-size:1rem; font-weight:400; margin:6px 0; line-height:1.3; }
.rel-meta { font-size:0.72rem; color:var(--warm-gray); }

.post-404 { text-align:center; padding:80px 0; }
.post-404 h1 { font-family:var(--font-display); font-size:2rem; margin-bottom:12px; }
.post-404 p { color:var(--warm-gray); margin-bottom:24px; }

@media(max-width:768px) {
  .post-content :deep(.blog-gallery) { grid-template-columns:1fr !important; }
  .post-content :deep(.blog-gallery img) { height:220px; }
  .post-hero { height:240px; }
  .related-grid { grid-template-columns:1fr; }
}
</style>
