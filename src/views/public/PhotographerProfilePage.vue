<template>
  <div class="profile-page">
    <div class="container">

      <!-- HERO / COVER -->
      <div class="profile-hero">
        <div class="profile-cover" :style="{background: photographer.coverPhoto ? `url(${photographer.coverPhoto}) center/cover` : photographer.gradient}"></div>
        <div class="profile-header">
          <div class="profile-avatar" :style="{background: photographer.avatar ? `url(${photographer.avatar}) center/cover` : 'linear-gradient(135deg, var(--sage-light), var(--blush))'}">
            <span v-if="!photographer.avatar">{{ photographer.initials }}</span>
          </div>
          <div class="profile-header-info">
            <div class="profile-badges">
              <span class="badge-featured" v-if="photographer.tier === 'featured'">⭐ Featured</span>
              <span class="badge-verified">✓ Verified</span>
            </div>
            <h1 class="profile-name">{{ photographer.businessName }}</h1>
            <div class="profile-location">{{ photographer.city }}<span v-if="photographer.state">, {{ photographer.state }}</span><span v-if="photographer.country"> · {{ photographer.country }}</span></div>
            <div class="profile-tagline" v-if="photographer.tagline">{{ photographer.tagline }}</div>
          </div>
          <div class="profile-header-actions">
            <button class="btn-primary" @click="showInquiry = true">Get in Touch →</button>
            <button class="btn-secondary btn-sm" @click="saved = !saved">{{ saved ? '♥ Saved' : '♡ Save' }}</button>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="profile-layout">
        <!-- LEFT COLUMN -->
        <div class="profile-main">

          <!-- PORTFOLIO -->
          <section class="profile-section">
            <h2 class="ps-title">Portfolio</h2>
            <div class="portfolio-grid">
              <div class="portfolio-item" v-for="(photo, i) in photographer.portfolio" :key="i" @click="openLightbox(i)">
                <div class="portfolio-img" :style="{background: photo.url ? `url(${photo.url}) center/cover` : photo.gradient}"></div>
              </div>
            </div>
          </section>

          <!-- ABOUT -->
          <section class="profile-section">
            <h2 class="ps-title">About</h2>
            <div class="about-text">{{ photographer.about }}</div>
          </section>

          <!-- STYLE TAGS -->
          <section class="profile-section" v-if="photographer.styles && photographer.styles.length">
            <h2 class="ps-title">Style</h2>
            <div class="profile-tags">
              <span class="profile-tag" v-for="s in photographer.styles" :key="s">{{ s }}</span>
            </div>
          </section>

          <!-- SPECIALTIES -->
          <section class="profile-section" v-if="photographer.specialties && photographer.specialties.length">
            <h2 class="ps-title">Specialties</h2>
            <div class="profile-tags">
              <span class="profile-tag tag-alt" v-for="s in photographer.specialties" :key="s">{{ s }}</span>
            </div>
          </section>

        </div>

        <!-- RIGHT SIDEBAR -->
        <div class="profile-sidebar">

          <!-- QUICK INFO CARD -->
          <div class="sidebar-card">
            <h3 class="sc-title">Quick Info</h3>
            <div class="sc-row">
              <div class="sc-label">Starting at</div>
              <div class="sc-value">{{ photographer.priceRange }}</div>
            </div>
            <div class="sc-row">
              <div class="sc-label">Experience</div>
              <div class="sc-value">{{ photographer.yearsExperience }}</div>
            </div>
            <div class="sc-row">
              <div class="sc-label">Turnaround</div>
              <div class="sc-value">{{ photographer.turnaround }}</div>
            </div>
            <div class="sc-row">
              <div class="sc-label">Travel</div>
              <div class="sc-value">{{ photographer.travelRadius }}</div>
            </div>
            <button class="btn-primary" style="width:100%;justify-content:center;margin-top:20px;" @click="showInquiry = true">Get in Touch →</button>
          </div>

          <!-- PACKAGE -->
          <div class="sidebar-card">
            <h3 class="sc-title">Base Package Includes</h3>
            <ul class="package-list">
              <li v-for="item in photographer.packageIncludes" :key="item">{{ item }}</li>
            </ul>
          </div>

          <!-- ADD-ONS -->
          <div class="sidebar-card" v-if="photographer.addOns && photographer.addOns.length">
            <h3 class="sc-title">Add-Ons Available</h3>
            <div class="profile-tags">
              <span class="profile-tag tag-sm" v-for="a in photographer.addOns" :key="a">{{ a }}</span>
            </div>
          </div>

          <!-- SOCIAL / LINKS -->
          <div class="sidebar-card">
            <h3 class="sc-title">Connect</h3>
            <div class="social-links">
              <a v-if="photographer.website" :href="photographer.website" target="_blank" class="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Website
              </a>
              <a v-if="photographer.instagram" :href="'https://instagram.com/' + photographer.instagram.replace('@','')" target="_blank" class="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                {{ photographer.instagram }}
              </a>
              <a v-if="photographer.tiktok" :href="'https://tiktok.com/@' + photographer.tiktok.replace('@','')" target="_blank" class="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                {{ photographer.tiktok }}
              </a>
              <a v-if="photographer.facebook" :href="photographer.facebook" target="_blank" class="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
              <a v-if="photographer.pinterest" :href="photographer.pinterest" target="_blank" class="social-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12c0 4 2.5 7.5 6 9l1.5-5.5A4.5 4.5 0 0 1 8 12a4 4 0 1 1 8 0c0 2.5-1 5-3 5-1 0-1.5-.5-1.3-1.5l1-4"/></svg>
                Pinterest
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- INQUIRY MODAL -->
      <div class="modal-overlay" v-if="showInquiry" @click.self="showInquiry = false">
        <div class="modal-card">
          <button class="modal-close" @click="showInquiry = false">✕</button>
          <h3 class="modal-title">Get in touch with {{ photographer.businessName }}</h3>
          <p class="modal-sub">They'll typically respond within 24–48 hours</p>
          <div class="form-row"><label class="form-label">Your Name</label><input type="text" class="form-input" placeholder="Jane & John" v-model="inquiry.name"></div>
          <div class="form-row"><label class="form-label">Email</label><input type="email" class="form-input" placeholder="you@email.com" v-model="inquiry.email"></div>
          <div class="form-row"><label class="form-label">Wedding Date</label><input type="date" class="form-input" v-model="inquiry.date"></div>
          <div class="form-row"><label class="form-label">Message</label><textarea class="form-input" style="min-height:120px;resize:vertical;" placeholder="Tell them about your wedding — venue, vibe, what you're looking for..." v-model="inquiry.message"></textarea></div>
          <button class="btn-primary" style="width:100%;justify-content:center;" @click="submitInquiry">Send Inquiry →</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const saved = ref(false)
const showInquiry = ref(false)
const inquiry = ref({ name: '', email: '', date: '', message: '' })

// Mock photographer data — will be replaced with Firestore fetch
const photographer = ref({
  id: route.params.id,
  businessName: 'Ava Chen Photography',
  initials: 'AC',
  avatar: null,
  city: 'Portland',
  state: 'OR',
  country: 'United States',
  tagline: 'Telling love stories through light, laughter, and stolen glances',
  tier: 'featured',
  gradient: 'linear-gradient(135deg, #e8d5cc 0%, #faf7f2 50%, #c5d4be 100%)',
  coverPhoto: null,
  about: "Hi! I'm Ava — a Portland-based wedding photographer who believes the best moments are the ones you don't plan. I gravitate toward natural light, candid emotion, and the in-between moments that make your story yours.\n\nI've been shooting weddings for 7 years and my approach is simple: I want you to forget I'm there. When you're laughing so hard you're crying, when you're sneaking a quiet moment together, when your dad sees you in your dress for the first time — those are the photos that matter.\n\nMy editing style leans warm and organic with soft tones. I deliver a mix of color and black & white, and I always prioritize genuine expression over perfect posing.",
  styles: ['Light & Airy', 'Documentary', 'Romantic', 'Film / Analog'],
  specialties: ['Elopements', 'Outdoor Weddings', 'Engagement Sessions', 'Destination Weddings'],
  priceRange: '$3,200 – $5,500',
  yearsExperience: '7 years',
  turnaround: '4–6 weeks',
  travelRadius: 'Up to 250 miles · Destinations',
  packageIncludes: [
    '8 hours of coverage',
    'Second shooter included',
    'Online gallery with download',
    '500+ edited images',
    'Engagement session',
    'Timeline planning assistance'
  ],
  addOns: ['Photo Album', 'Prints & Wall Art', 'Day-After Session', 'Rehearsal Coverage'],
  website: 'https://avachenphotography.com',
  instagram: '@avachenphoto',
  tiktok: '@avachenphoto',
  facebook: null,
  pinterest: 'https://pinterest.com/avachenphoto',
  portfolio: [
    { url: null, gradient: 'linear-gradient(135deg, #e8d5cc, #c5d4be)' },
    { url: null, gradient: 'linear-gradient(135deg, #c9a96e, #e8d9b4)' },
    { url: null, gradient: 'linear-gradient(135deg, #c5d4be, #faf7f2)' },
    { url: null, gradient: 'linear-gradient(135deg, #d4a574, #e8d5cc)' },
    { url: null, gradient: 'linear-gradient(135deg, #8B9E82, #c5d4be)' },
    { url: null, gradient: 'linear-gradient(135deg, #e8d5cc, #faf7f2)' },
    { url: null, gradient: 'linear-gradient(135deg, #2c2c2c, #4a3f35)' },
    { url: null, gradient: 'linear-gradient(135deg, #c9a96e, #d4a574)' },
    { url: null, gradient: 'linear-gradient(135deg, #c5d4be, #e8e3dc)' },
    { url: null, gradient: 'linear-gradient(135deg, #e8d5cc, #c9a96e)' },
    { url: null, gradient: 'linear-gradient(135deg, #faf7f2, #e8e3dc)' },
    { url: null, gradient: 'linear-gradient(135deg, #d4a574, #8B9E82)' },
  ]
})

onMounted(async () => {
  // Try to fetch real data from Firestore
  try {
    const { getPhotographer } = await import('@/services/photographer')
    const data = await getPhotographer(route.params.id)
    if (data) photographer.value = { ...photographer.value, ...data }
  } catch (e) {
    // Use mock data
  }
})

function openLightbox(index) {
  // TODO: implement lightbox
}

async function submitInquiry() {
  try {
    const { sendInquiry } = await import('@/services/matching')
    await sendInquiry({
      photographerId: photographer.value.id,
      name: inquiry.value.name,
      email: inquiry.value.email,
      weddingDate: inquiry.value.date,
      message: inquiry.value.message
    })
    alert('Inquiry sent! ' + photographer.value.businessName + ' will get back to you soon.')
    showInquiry.value = false
  } catch (e) {
    alert('Inquiry sent! (Demo mode)')
    showInquiry.value = false
  }
}
</script>

<style scoped>
.profile-page { padding:100px 0 80px; background:var(--cream); min-height:100vh; }

/* HERO */
.profile-hero { margin-bottom:48px; }
.profile-cover { height:320px; border-radius:var(--radius-lg); overflow:hidden; margin-bottom:-60px; position:relative; }
.profile-header {
  display:flex; align-items:flex-end; gap:24px; padding:0 32px;
  position:relative; z-index:2; flex-wrap:wrap;
}
.profile-avatar {
  width:120px; height:120px; border-radius:50%; border:4px solid var(--warm-white);
  box-shadow:var(--shadow-md); display:flex; align-items:center; justify-content:center;
  font-family:var(--font-display); font-size:2.5rem; font-weight:500; color:var(--charcoal);
  flex-shrink:0; overflow:hidden; background-size:cover;
}
.profile-header-info { flex:1; min-width:200px; padding-bottom:8px; }
.profile-badges { display:flex; gap:8px; margin-bottom:8px; }
.badge-featured { padding:4px 12px; background:var(--gold); color:white; border-radius:100px; font-size:0.72rem; font-weight:600; }
.badge-verified { padding:4px 12px; background:var(--sage-light); color:var(--sage-dark); border-radius:100px; font-size:0.72rem; font-weight:600; }
.profile-name { font-family:var(--font-display); font-size:2rem; font-weight:500; margin-bottom:4px; }
.profile-location { font-size:0.92rem; color:var(--warm-gray); margin-bottom:4px; }
.profile-tagline { font-size:0.95rem; color:var(--warm-gray); font-style:italic; }
.profile-header-actions { display:flex; gap:12px; padding-bottom:8px; flex-shrink:0; }

/* LAYOUT */
.profile-layout { display:grid; grid-template-columns:1fr 360px; gap:48px; }

/* SECTIONS */
.profile-section { margin-bottom:48px; }
.ps-title { font-family:var(--font-display); font-size:1.5rem; font-weight:500; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid var(--light-gray); }

/* PORTFOLIO */
.portfolio-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; }
.portfolio-item { border-radius:var(--radius); overflow:hidden; cursor:pointer; transition:var(--transition); }
.portfolio-item:hover { transform:scale(1.03); box-shadow:var(--shadow-md); }
.portfolio-item:nth-child(1) { grid-column:span 2; grid-row:span 2; }
.portfolio-img { aspect-ratio:4/3; background-size:cover; background-position:center; }
.portfolio-item:nth-child(1) .portfolio-img { aspect-ratio:auto; height:100%; }

/* ABOUT */
.about-text { font-size:0.95rem; color:var(--warm-gray); line-height:1.8; white-space:pre-line; }

/* TAGS */
.profile-tags { display:flex; flex-wrap:wrap; gap:8px; }
.profile-tag { padding:6px 16px; background:rgba(139,158,130,0.1); border:1px solid rgba(139,158,130,0.2); border-radius:100px; font-size:0.82rem; color:var(--sage-dark); font-weight:500; }
.tag-alt { background:rgba(196,130,106,0.08); border-color:rgba(196,130,106,0.15); color:var(--terracotta-dark); }
.tag-sm { padding:4px 12px; font-size:0.78rem; }

/* SIDEBAR */
.profile-sidebar { display:flex; flex-direction:column; gap:20px; }
.sidebar-card { background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:28px; }
.sc-title { font-family:var(--font-display); font-size:1.2rem; font-weight:500; margin-bottom:16px; }
.sc-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--light-gray); }
.sc-row:last-of-type { border-bottom:none; }
.sc-label { font-size:0.85rem; color:var(--warm-gray); }
.sc-value { font-size:0.85rem; font-weight:500; }

.package-list { list-style:none; }
.package-list li { padding:8px 0; font-size:0.88rem; color:var(--warm-gray); display:flex; align-items:center; gap:10px; }
.package-list li::before { content:'✓'; color:var(--sage); font-weight:600; font-size:0.8rem; }

/* SOCIAL LINKS */
.social-links { display:flex; flex-direction:column; gap:8px; }
.social-link {
  display:flex; align-items:center; gap:12px; padding:10px 14px;
  border:1px solid var(--light-gray); border-radius:var(--radius);
  font-size:0.88rem; color:var(--charcoal); transition:var(--transition);
}
.social-link:hover { border-color:var(--sage); background:rgba(139,158,130,0.04); }
.social-link svg { color:var(--warm-gray); flex-shrink:0; }

/* MODAL */
.modal-overlay {
  position:fixed; top:0; left:0; right:0; bottom:0; z-index:2000;
  background:rgba(44,44,44,0.5); backdrop-filter:blur(4px);
  display:flex; align-items:center; justify-content:center; padding:24px;
}
.modal-card {
  background:var(--warm-white); border-radius:var(--radius-lg); padding:40px;
  max-width:520px; width:100%; max-height:90vh; overflow-y:auto;
  box-shadow:var(--shadow-lg); position:relative;
}
.modal-close { position:absolute; top:16px; right:16px; font-size:1.2rem; color:var(--warm-gray); padding:8px; }
.modal-title { font-family:var(--font-display); font-size:1.5rem; font-weight:500; margin-bottom:4px; }
.modal-sub { font-size:0.88rem; color:var(--warm-gray); margin-bottom:24px; }

/* RESPONSIVE */
@media (max-width:1024px) {
  .profile-layout { grid-template-columns:1fr; }
  .profile-sidebar { order:-1; }
}
@media (max-width:768px) {
  .profile-header { flex-direction:column; align-items:center; text-align:center; padding:0 16px; }
  .profile-header-actions { justify-content:center; }
  .portfolio-grid { grid-template-columns:repeat(2, 1fr); }
  .portfolio-item:nth-child(1) { grid-column:span 2; grid-row:span 1; }
  .profile-cover { height:200px; }
  .profile-avatar { width:100px; height:100px; }
}
</style>
