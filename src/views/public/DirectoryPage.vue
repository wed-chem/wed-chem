<template>
  <div class="dir-page">
    <div class="container">
      <div class="dir-header">
        <div class="section-eyebrow">Directory</div>
        <h1 class="dir-title">Browse Wedding Photographers</h1>
        <p class="dir-sub">Explore our worldwide network or <router-link to="/quiz" style="color:var(--terracotta);font-weight:500;">take the quiz</router-link> for personalized matches.</p>
      </div>

      <!-- FILTERS -->
      <div class="filters">
        <div class="filter-row">
          <input type="text" class="f-input" placeholder="City or region" v-model="filters.city">
          <input type="text" class="f-input" placeholder="Country" v-model="filters.country">
          <select class="f-select" v-model="filters.style">
            <option value="">All Styles</option>
            <option v-for="s in styles" :key="s">{{ s }}</option>
          </select>
          <select class="f-select" v-model="filters.budget">
            <option value="">Any Budget</option>
            <option value="2000">Under $2k</option>
            <option value="3000">Under $3k</option>
            <option value="5000">Under $5k</option>
            <option value="7500">Under $7.5k</option>
            <option value="10000">Under $10k</option>
          </select>
          <select class="f-select" v-model="filters.travel">
            <option value="">Any Travel</option>
            <option value="local">Local only</option>
            <option value="nationwide">Nationwide</option>
            <option value="anywhere">Travels Worldwide</option>
          </select>
          <button class="f-clear" v-if="hasFilters" @click="clearFilters">Clear</button>
        </div>
        <div class="style-pills">
          <button class="pill" :class="{active:!filters.style}" @click="filters.style=''">All</button>
          <button class="pill" v-for="s in styles" :key="s" :class="{active:filters.style===s}" @click="filters.style=s">{{ s }}</button>
        </div>
      </div>

      <!-- RESULTS -->
      <div class="results-bar">
        <span>{{ filtered.length }} photographer{{ filtered.length!==1?'s':'' }}</span>
        <select class="f-select f-select-sm" v-model="sortBy">
          <option value="featured">Featured first</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>

      <div class="grid" v-if="filtered.length">
        <div class="card" v-for="p in filtered" :key="p.id" @click="$router.push('/photographer/'+p.id)">
          <div class="card-cover" :style="{background:p.gradient}">
            <span class="card-badge" v-if="p.tier==='featured'">⭐ Featured</span>
            <div class="card-tags">
              <span class="card-tag" v-for="s in (p.styles||[]).slice(0,2)" :key="s">{{ s }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-name">{{ p.businessName }}</div>
            <div class="card-loc">{{ p.city }}<span v-if="p.state">, {{ p.state }}</span><span v-if="p.country && p.country !== 'United States' && p.country !== 'USA'"> · {{ p.country }}</span></div>
            <div class="card-excerpt">{{ p.tagline }}</div>
            <div class="card-travel" v-if="p.travelRadius">✈ {{ p.travelRadiusLabel || p.travelRadius }}</div>
            <div class="card-meta">
              <span class="card-price">{{ p.priceRange }}</span>
              <span class="card-cta">View Profile →</span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty" v-else>
        <div class="empty-icon">📷</div>
        <div class="empty-title">No photographers found</div>
        <div class="empty-sub">Try adjusting your filters or <router-link to="/quiz" style="color:var(--terracotta)">take the quiz</router-link> for personalized matches.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { styleTags } from '@/data/quizData'

const styles = styleTags
const filters = ref({ city:'', country:'', style:'', budget:'', travel:'' })
const sortBy = ref('featured')

const mockPhotographers = [
  { id:'demo1', businessName:'Ava Chen Photography', city:'Portland', state:'OR', country:'USA', styles:['Light & Airy','Documentary'], tagline:'Natural light, real moments, organic warmth', priceRange:'$3,200–$5,500', priceMin:3200, tier:'featured', travelRadius:'250', travelRadiusLabel:'Up to 250 mi', gradient:'linear-gradient(135deg,#e8d5cc,#faf7f2,#c5d4be)' },
  { id:'demo2', businessName:'Marcus Webb Studio', city:'Seattle', state:'WA', country:'USA', styles:['Moody & Dark','Cinematic'], tagline:'Cinematic storytelling with bold, dramatic tones', priceRange:'$4,000–$7,500', priceMin:4000, tier:'featured', travelRadius:'anywhere', travelRadiusLabel:'Travels Worldwide', gradient:'linear-gradient(135deg,#1a1a2e,#2c2c3e,#4a3f55)' },
  { id:'demo3', businessName:'Riley & Fox Co.', city:'Austin', state:'TX', country:'USA', styles:['Documentary','Photojournalistic'], tagline:'Husband-wife team capturing real, unscripted love', priceRange:'$2,800–$4,500', priceMin:2800, tier:'free', travelRadius:'150', travelRadiusLabel:'Up to 150 mi', gradient:'linear-gradient(135deg,#c5d4be,#e8e3dc,#faf7f2)' },
  { id:'demo4', businessName:'Sage & Cellulose', city:'Denver', state:'CO', country:'USA', styles:['Film / Analog','Fine Art'], tagline:'Medium format film with analog soul', priceRange:'$4,500–$8,000', priceMin:4500, tier:'free', travelRadius:'nationwide', travelRadiusLabel:'Nationwide', gradient:'linear-gradient(135deg,#d4a574,#b8866a,#c9a96e)' },
  { id:'demo5', businessName:'Hannah Leigh Photo', city:'Nashville', state:'TN', country:'USA', styles:['Classic / Timeless','Light & Airy'], tagline:'Timeless images, genuine emotion, clean editing', priceRange:'$2,500–$4,000', priceMin:2500, tier:'free', travelRadius:'100', travelRadiusLabel:'Up to 100 mi', gradient:'linear-gradient(135deg,#e8d5cc,#f5ebe3,#c5d4be)' },
  { id:'demo6', businessName:'Noir Collective', city:'Los Angeles', state:'CA', country:'USA', styles:['Editorial','Fashion-Forward'], tagline:'Magazine-worthy wedding photography', priceRange:'$5,000–$10,000', priceMin:5000, tier:'featured', travelRadius:'anywhere', travelRadiusLabel:'Travels Worldwide', gradient:'linear-gradient(135deg,#2c2c2c,#4a3f35,#c9a96e)' },
  { id:'demo7', businessName:'Luna y Sol Fotografía', city:'Mexico City', state:'CDMX', country:'Mexico', styles:['Documentary','Bold & Vibrant'], tagline:'Bodas con alma, luz natural, momentos reales', priceRange:'$1,800–$3,500', priceMin:1800, tier:'free', travelRadius:'anywhere', travelRadiusLabel:'Travels Worldwide', gradient:'linear-gradient(135deg,#C4826A,#c9a96e,#e8d9b4)' },
  { id:'demo8', businessName:'Atelier Lumière', city:'Paris', state:'Île-de-France', country:'France', styles:['Fine Art','Editorial'], tagline:'Fine art wedding photography across Europe', priceRange:'€4,000–€8,000', priceMin:4000, tier:'featured', travelRadius:'anywhere', travelRadiusLabel:'Travels Worldwide', gradient:'linear-gradient(135deg,#e8e3dc,#d4ccc3,#c5bdb4)' },
  { id:'demo9', businessName:'Olive & Oak', city:'Tuscany', state:'', country:'Italy', styles:['Cinematic','Light & Airy'], tagline:'Destination weddings in the Italian countryside', priceRange:'€3,500–€6,000', priceMin:3500, tier:'free', travelRadius:'anywhere', travelRadiusLabel:'Travels Worldwide', gradient:'linear-gradient(135deg,#4a5d3f,#8B9E82,#c5d4be)' },
]

const hasFilters = computed(() => filters.value.city || filters.value.country || filters.value.style || filters.value.budget || filters.value.travel)

const filtered = computed(() => {
  let list = [...mockPhotographers]
  const f = filters.value
  if (f.city) list = list.filter(p => p.city.toLowerCase().includes(f.city.toLowerCase()) || (p.state && p.state.toLowerCase().includes(f.city.toLowerCase())))
  if (f.country) list = list.filter(p => p.country && p.country.toLowerCase().includes(f.country.toLowerCase()))
  if (f.style) list = list.filter(p => p.styles && p.styles.includes(f.style))
  if (f.budget) list = list.filter(p => p.priceMin <= parseInt(f.budget))
  if (f.travel === 'local') list = list.filter(p => ['25','50','100'].includes(p.travelRadius))
  if (f.travel === 'nationwide') list = list.filter(p => ['nationwide','anywhere'].includes(p.travelRadius))
  if (f.travel === 'anywhere') list = list.filter(p => p.travelRadius === 'anywhere')

  if (sortBy.value === 'featured') list.sort((a,b) => (b.tier==='featured'?1:0)-(a.tier==='featured'?1:0))
  if (sortBy.value === 'price-low') list.sort((a,b) => a.priceMin - b.priceMin)
  if (sortBy.value === 'price-high') list.sort((a,b) => b.priceMin - a.priceMin)
  return list
})

function clearFilters() { filters.value = { city:'', country:'', style:'', budget:'', travel:'' } }
</script>

<style scoped>
.dir-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.dir-header { text-align:center; margin-bottom:48px; }
.dir-title { font-family:var(--font-display); font-size:clamp(2.2rem,4vw,3rem); font-weight:300; margin-bottom:12px; }
.dir-sub { font-size:1rem; color:var(--warm-gray); }

.filters { margin-bottom:32px; }
.filter-row { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
.f-input,.f-select { padding:12px 16px; border:1.5px solid var(--light-gray); border-radius:var(--radius); background:var(--warm-white); font-family:var(--font-body); font-size:0.88rem; color:var(--charcoal); outline:none; transition:var(--transition); }
.f-input { flex:1; min-width:120px; }
.f-input:focus,.f-select:focus { border-color:var(--sage); }
.f-select { appearance:none; cursor:pointer; min-width:130px; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6560' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
.f-select-sm { padding:8px 12px; font-size:0.82rem; padding-right:32px; }
.f-clear { padding:12px 20px; background:none; border:1.5px solid var(--light-gray); border-radius:var(--radius); font-size:0.85rem; color:var(--warm-gray); transition:var(--transition); }
.f-clear:hover { border-color:var(--charcoal); color:var(--charcoal); }

.style-pills { display:flex; gap:8px; flex-wrap:wrap; }
.pill { padding:7px 18px; border-radius:100px; border:1px solid var(--light-gray); background:transparent; font-size:0.82rem; color:var(--warm-gray); transition:var(--transition); }
.pill:hover { border-color:var(--charcoal); color:var(--charcoal); }
.pill.active { background:var(--charcoal); color:var(--cream); border-color:var(--charcoal); }

.results-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; font-size:0.88rem; color:var(--warm-gray); }

.grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.card { border-radius:var(--radius-lg); overflow:hidden; background:var(--warm-white); border:1px solid var(--light-gray); cursor:pointer; transition:var(--transition); }
.card:hover { transform:translateY(-6px); box-shadow:var(--shadow-lg); }
.card-cover { height:220px; position:relative; }
.card-badge { position:absolute; top:12px; left:12px; padding:4px 12px; background:var(--gold); color:white; border-radius:100px; font-size:0.7rem; font-weight:600; }
.card-tags { position:absolute; bottom:12px; left:12px; display:flex; gap:6px; }
.card-tag { padding:4px 12px; background:rgba(255,255,255,0.9); backdrop-filter:blur(8px); border-radius:100px; font-size:0.72rem; font-weight:500; }
.card-body { padding:20px; }
.card-name { font-family:var(--font-display); font-size:1.3rem; font-weight:500; margin-bottom:4px; }
.card-loc { font-size:0.84rem; color:var(--warm-gray); margin-bottom:8px; }
.card-loc::before { content:'◦ '; color:var(--sage); }
.card-excerpt { font-size:0.88rem; color:var(--warm-gray); line-height:1.6; margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.card-travel { font-size:0.78rem; color:var(--sage-dark); margin-bottom:12px; }
.card-meta { display:flex; justify-content:space-between; align-items:center; padding-top:14px; border-top:1px solid var(--light-gray); }
.card-price { font-size:0.82rem; color:var(--warm-gray); }
.card-cta { font-size:0.82rem; font-weight:500; color:var(--terracotta); }

.empty { text-align:center; padding:80px 0; }
.empty-icon { font-size:3rem; margin-bottom:16px; }
.empty-title { font-family:var(--font-display); font-size:1.5rem; margin-bottom:8px; }
.empty-sub { color:var(--warm-gray); }

@media(max-width:1024px) { .grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:768px) { .grid { grid-template-columns:1fr; } .filter-row { flex-direction:column; } }
</style>
