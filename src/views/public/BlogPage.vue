<template>
  <div class="blog-page">
    <div class="container">
      <div class="blog-header">
        <div class="section-eyebrow">Blog</div>
        <h1 class="blog-title">The WedChem Journal</h1>
        <p class="blog-sub">Style guides, planning tips, and everything you need to find the right wedding photographer.</p>
      </div>

      <!-- FEATURED -->
      <div class="featured-grid" v-if="featuredPosts.length">
        <div class="featured-card" v-for="post in featuredPosts" :key="post.slug" @click="$router.push('/blog/' + post.slug)">
          <div class="fc-image" :style="{background: gradientForCategory(post.category)}">
            <span class="fc-cat">{{ post.category }}</span>
          </div>
          <div class="fc-body">
            <h2 class="fc-title">{{ post.title }}</h2>
            <p class="fc-excerpt">{{ post.excerpt }}</p>
            <div class="fc-meta">{{ formatDate(post.date) }} · {{ post.readTime }} read</div>
          </div>
        </div>
      </div>

      <!-- CATEGORIES -->
      <div class="cat-pills">
        <button class="pill" :class="{active: !activeCategory}" @click="activeCategory=''">All</button>
        <button class="pill" v-for="cat in categories" :key="cat" :class="{active: activeCategory===cat}" @click="activeCategory=cat">{{ cat }}</button>
      </div>

      <!-- ALL POSTS -->
      <div class="posts-grid">
        <div class="post-card" v-for="post in filteredPosts" :key="post.slug" @click="$router.push('/blog/' + post.slug)">
          <div class="pc-image" :style="{background: gradientForCategory(post.category)}">
            <span class="pc-cat">{{ post.category }}</span>
          </div>
          <div class="pc-body">
            <h3 class="pc-title">{{ post.title }}</h3>
            <p class="pc-excerpt">{{ post.excerpt }}</p>
            <div class="pc-meta">{{ formatDate(post.date) }} · {{ post.readTime }} read</div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="blog-cta-section">
        <template v-if="authStore.isPhotographer">
          <h2>Want more couples to find you?</h2>
          <p>Keep your profile updated and your portfolio fresh to attract the right clients.</p>
          <router-link to="/dashboard" class="btn-primary">Go to Dashboard →</router-link>
        </template>
        <template v-else>
          <h2>Ready to find your photographer?</h2>
          <p>Take our 3-minute style quiz and get matched with photographers who share your aesthetic.</p>
          <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <router-link to="/quiz" class="btn-primary">Take the Style Quiz →</router-link>
            <router-link v-if="!authStore.isLoggedIn" to="/signup/photographer" class="btn-secondary">I'm a Photographer →</router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSEO } from '@/composables/useSEO'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { blogPosts } from '@/data/blogData'

useSEO({ title: 'Wedding Photography Blog', description: 'Style guides, planning tips, and everything you need to find the right wedding photographer. Expert advice from real professionals.', path: '/blog' })


const activeCategory = ref('')

const featuredPosts = computed(() => blogPosts.filter(p => p.featured).slice(0, 2))
const categories = [...new Set(blogPosts.map(p => p.category))]
const filteredPosts = computed(() => {
  const posts = activeCategory.value ? blogPosts.filter(p => p.category === activeCategory.value) : blogPosts
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
})

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
.blog-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.blog-header { text-align:center; margin-bottom:56px; }
.blog-title { font-family:var(--font-display); font-size:clamp(2.4rem,4vw,3.2rem); font-weight:300; margin-bottom:12px; }
.blog-sub { font-size:1rem; color:var(--warm-gray); max-width:500px; margin:0 auto; }

.featured-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:48px; }
.featured-card { border-radius:var(--radius-lg); overflow:hidden; background:var(--warm-white); border:1px solid var(--light-gray); cursor:pointer; transition:var(--transition); }
.featured-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.fc-image { height:220px; position:relative; }
.fc-cat { position:absolute; top:16px; left:16px; padding:5px 14px; background:rgba(255,255,255,0.9); backdrop-filter:blur(8px); border-radius:100px; font-size:0.72rem; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; }
.fc-body { padding:28px; }
.fc-title { font-family:var(--font-display); font-size:1.4rem; font-weight:400; margin-bottom:10px; line-height:1.3; }
.fc-excerpt { font-size:0.9rem; color:var(--warm-gray); line-height:1.6; margin-bottom:14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.fc-meta { font-size:0.78rem; color:var(--warm-gray); }

.cat-pills { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:32px; }
.pill { padding:7px 18px; border-radius:100px; border:1px solid var(--light-gray); background:transparent; font-size:0.82rem; color:var(--warm-gray); transition:var(--transition); cursor:pointer; }
.pill:hover { border-color:var(--charcoal); color:var(--charcoal); }
.pill.active { background:var(--charcoal); color:var(--cream); border-color:var(--charcoal); }

.posts-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:24px; margin-bottom:64px; }
.post-card { border-radius:var(--radius-lg); overflow:hidden; background:var(--warm-white); border:1px solid var(--light-gray); cursor:pointer; transition:var(--transition); }
.post-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.pc-image { height:160px; position:relative; }
.pc-cat { position:absolute; top:12px; left:12px; padding:4px 12px; background:rgba(255,255,255,0.9); backdrop-filter:blur(8px); border-radius:100px; font-size:0.68rem; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; }
.pc-body { padding:20px; }
.pc-title { font-family:var(--font-display); font-size:1.15rem; font-weight:400; margin-bottom:8px; line-height:1.3; }
.pc-excerpt { font-size:0.85rem; color:var(--warm-gray); line-height:1.6; margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.pc-meta { font-size:0.75rem; color:var(--warm-gray); }

.blog-cta-section { text-align:center; padding:64px; background:var(--warm-white); border-radius:var(--radius-lg); border:1px solid var(--light-gray); }
.blog-cta-section h2 { font-family:var(--font-display); font-size:2rem; font-weight:300; margin-bottom:12px; }
.blog-cta-section p { color:var(--warm-gray); margin-bottom:24px; }

@media(max-width:1024px) { .posts-grid { grid-template-columns:repeat(2, 1fr); } }
@media(max-width:768px) { .featured-grid { grid-template-columns:1fr; } .posts-grid { grid-template-columns:1fr; } }
</style>
