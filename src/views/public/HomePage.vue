<template>
  <div>
    <!-- HERO -->
    <section class="hero">
      <div class="container-wide">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">Now matching couples nationwide</div>
            <h1>The <em>chemistry</em> between you and your photographer matters</h1>
            <p class="hero-sub">Pick photos you love. Our algorithm matches you with wedding photographers whose style aligns with what you're naturally drawn to. Free for couples. Always.</p>
            <div class="hero-actions">
              <router-link v-if="authStore.isPhotographer" to="/dashboard" class="btn-primary">Go to Dashboard →</router-link>
              <router-link v-else to="/quiz" class="btn-primary">Find Your Match →</router-link>
              <router-link to="/directory" class="btn-secondary">Browse Photographers</router-link>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hcard hcard-1"><div class="hcard-inner"><div class="hc-i">📷</div><div class="hc-l">Moody & Cinematic</div><div class="hc-d">Rich tones, dramatic shadows</div></div></div>
            <div class="hcard hcard-2"><div class="hcard-inner"><div class="hc-i">✨</div><div class="hc-l">Light & Airy</div><div class="hc-d">Bright, natural, soft</div></div></div>
            <div class="hcard hcard-3"><div class="hcard-inner"><div class="hc-i">🎞️</div><div class="hc-l">Film & Analog</div><div class="hc-d">Grain, warmth, timeless</div></div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-section" id="how-it-works">
      <div class="container">
        <div class="section-eyebrow">How It Works</div>
        <h2 class="section-title">Three steps to your perfect match</h2>
        <p class="section-subtitle">No endless scrolling. No guesswork. Just photographers whose work you already love.</p>
        <div class="how-grid">
          <div class="how-card" v-for="(step, i) in howSteps" :key="i">
            <div class="how-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- QUIZ PREVIEW -->
    <section class="quiz-preview">
      <div class="container">
        <div class="quiz-layout">
          <div class="quiz-text">
            <div class="section-eyebrow">The Chemistry Test</div>
            <h2 class="section-title">You pick what you love. We do the rest.</h2>
            <p style="color:var(--warm-gray);margin-bottom:24px;line-height:1.7;">Our matching algorithm analyzes your visual preferences across editing style, photo approach, color tones, lighting, composition, and personality — then scores photographers on how well they align with what you're drawn to.</p>
            <p style="font-size:0.92rem;color:var(--warm-gray);margin-bottom:32px;line-height:1.7;">Takes about 3 minutes. No account needed. Just pick what you love.</p>
            <router-link to="/quiz" class="btn-primary">Start the Quiz →</router-link>
          </div>
          <div class="quiz-demo">
            <div class="qd-label">Which edit do you prefer?</div>
            <div class="qd-sub">Same moment, different styles</div>
            <div class="qd-pair">
              <div class="qd-opt" :class="{sel: demoChoice==='a'}" @click="demoChoice='a'" style="background:linear-gradient(135deg,#2c2c2c,#4a3f35,#8B6914)">
                <div class="qd-opt-label">Warm & Moody</div>
              </div>
              <div class="qd-opt" :class="{sel: demoChoice==='b'}" @click="demoChoice='b'" style="background:linear-gradient(135deg,#e8e3dc,#faf7f2,#c5d4be)">
                <div class="qd-opt-label" style="color:#2c2c2c">Clean & Bright</div>
              </div>
            </div>
            <div class="qd-progress">
              <div class="qd-bar"><div class="qd-fill" style="width:21%"></div></div>
              <span class="qd-text">4 of 19</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOR PHOTOGRAPHERS -->
    <template v-if="!authStore.isLoggedIn || authStore.isPhotographer">
    <section class="fp-section">
      <div class="container">
        <div class="fp-layout">
          <div class="fp-text">
            <div class="section-eyebrow" style="color:var(--gold)">For Photographers</div>
            <h2 class="section-title" style="color:var(--cream)">Get found by couples who already love your style</h2>
            <p style="color:rgba(250,247,242,0.6);margin-bottom:32px;line-height:1.7;">Stop competing on price. Start getting matched with people who are drawn to exactly what you do best.</p>
            <ul class="fp-benefits">
              <li v-for="b in benefits" :key="b">{{ b }}</li>
            </ul>
            <router-link to="/signup/photographer" class="btn-primary" style="background:var(--terracotta);margin-top:36px;">Create Your Profile →</router-link>
          </div>
          <div class="fp-preview">
            <div class="fpp-title">How photographer onboarding works</div>
            <div class="fpp-sub">Set up your profile in about 10 minutes</div>
            <div class="fpp-steps">
              <div class="fpp-step" v-for="(s, i) in onboardingSteps" :key="i">
                <div class="fpp-num">{{ i + 1 }}</div>
                <div><div class="fpp-t">{{ s.title }}</div><div class="fpp-d">{{ s.desc }}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </template>

    <!-- PRICING -->
    <template v-if="!authStore.isLoggedIn || authStore.isPhotographer">
    <section class="pricing-section" id="pricing">
      <div class="container">
        <div style="text-align:center">
          <div class="section-eyebrow">Pricing</div>
          <h2 class="section-title">Simple, transparent pricing</h2>
          <p class="section-subtitle" style="margin:0 auto 48px;text-align:center;">Free for everyone. Pay only if you want premium visibility.</p>
        </div>
        <div class="pricing-cards">
          <div class="p-card">
            <div class="pc-title">Couples</div>
            <div class="pc-desc">Everything you need to find your match</div>
            <div class="pc-price"><span class="pc-val" style="color:var(--sage)">Free</span><span class="pc-period">forever</span></div>
            <ul class="pc-features">
              <li>19-question style matching quiz</li>
              <li>Personalized photographer matches</li>
              <li>Full directory access</li>
              <li>Direct messaging</li>
              <li>Save & compare favorites</li>
            </ul>
            <router-link to="/quiz" class="btn-primary" style="width:100%;justify-content:center;">Take the Quiz</router-link>
          </div>
          <div class="p-card">
            <div class="pc-title">Photographers</div>
            <div class="pc-desc">List your profile and get matched</div>
            <div class="pc-price"><span class="pc-val" style="color:var(--sage)">Free</span><span class="pc-period">to list</span></div>
            <ul class="pc-features">
              <li>Full profile with portfolio</li>
              <li>Appear in couple matches</li>
              <li>Receive direct inquiries</li>
              <li>No commission on bookings</li>
              <li>Basic analytics</li>
            </ul>
            <router-link to="/signup/photographer" class="btn-primary" style="width:100%;justify-content:center;">Create Profile</router-link>
          </div>
          <div class="p-card p-card-featured">
            <div class="pc-title">Featured</div>
            <div class="pc-desc">Boost your visibility and get more leads</div>
            <div class="pc-price"><span class="pc-cur">$</span><span class="pc-val">25</span><span class="pc-period">/ month</span></div>
            <ul class="pc-features">
              <li>Everything in Free</li>
              <li>Boosted in match results</li>
              <li>"Featured" badge on profile</li>
              <li>Priority placement in directory</li>
              <li>Advanced analytics dashboard</li>
              <li>Homepage spotlight rotation</li>
            </ul>
            <router-link to="/signup/photographer" class="btn-primary" style="width:100%;justify-content:center;background:var(--terracotta);">Get Featured</router-link>
          </div>
        </div>
      </div>
    </section>
    </template>

    <!-- TESTIMONIALS -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-eyebrow">Testimonials</div>
        <h2 class="section-title" style="margin-bottom:48px;">Loved by couples and photographers</h2>
        <div class="test-grid">
          <div class="test-card" v-for="t in testimonials" :key="t.name">
            <div class="test-stars">★★★★★</div>
            <div class="test-text">"{{ t.quote }}"</div>
            <div class="test-author">
              <div class="test-avatar">{{ t.initials }}</div>
              <div><div class="test-name">{{ t.name }}</div><div class="test-role">{{ t.role }}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container" style="text-align:center">
        <!-- Photographer CTA -->
        <template v-if="authStore.isPhotographer">
          <div class="section-eyebrow">Welcome back</div>
          <h2 class="section-title" style="max-width:600px;margin:0 auto 16px;">Manage your profile and connect with couples</h2>
          <p class="section-subtitle" style="margin:0 auto 40px;text-align:center;">Check your inquiries, update your portfolio, and see how couples are finding you.</p>
          <router-link to="/dashboard" class="btn-primary">Go to Dashboard →</router-link>
        </template>
        <!-- Couple CTA -->
        <template v-else-if="authStore.isLoggedIn">
          <div class="section-eyebrow">Ready?</div>
          <h2 class="section-title" style="max-width:600px;margin:0 auto 16px;">Your love story deserves a photographer who gets it</h2>
          <p class="section-subtitle" style="margin:0 auto 40px;text-align:center;">Take our 3-minute quiz and get matched with photographers whose style you already love.</p>
          <router-link to="/quiz" class="btn-primary">Find My Photographer →</router-link>
        </template>
        <!-- Logged out CTA -->
        <template v-else>
          <div class="section-eyebrow">Ready?</div>
          <h2 class="section-title" style="max-width:600px;margin:0 auto 16px;">Your love story deserves a photographer who gets it</h2>
          <p class="section-subtitle" style="margin:0 auto 40px;text-align:center;">Take our 3-minute quiz and get matched with photographers whose style you already love.</p>
          <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;">
            <router-link to="/quiz" class="btn-primary">Find My Photographer →</router-link>
            <router-link to="/signup/photographer" class="btn-secondary">I'm a Photographer</router-link>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { ref } from 'vue'

const demoChoice = ref('a')

const howSteps = [
  { title: 'Take the Style Quiz', desc: 'Rank your favorite editing styles, choose between photo aesthetics, and tell us what matters to you. Takes about 3 minutes — no account needed.' },
  { title: 'See Your Matches', desc: 'Our algorithm scores photographers across 15+ style dimensions — editing tone, shooting approach, personality, and more — to surface the ones whose work fits your vision.' },
  { title: 'Connect Directly', desc: 'Browse profiles, view portfolios, and send a message. No booking fees, no middlemen — just you and the photographer.' }
]

const benefits = [
  'Matched with couples through our proprietary style algorithm',
  'Full profile with portfolio, bio, and service details',
  'Direct inquiries — no commission, no middleman',
  'Analytics on views, clicks, and match rates',
  'Free to list — pay only for Featured placement'
]

const onboardingSteps = [
  { title: 'Define your style', desc: 'Complete a quick visual profile so our algorithm knows how to match you with the right couples.' },
  { title: 'Build your profile', desc: 'Add your bio, location, portfolio, services, and pricing.' },
  { title: 'Upload your portfolio', desc: 'Show off your best work — this is what couples browse.' },
  { title: 'Start getting matched', desc: 'Couples whose preferences align with your style will see you in their results.' }
]

const testimonials = [
  { quote: 'We had no idea what style we wanted. The quiz figured it out — our photographer was exactly what we didn\'t know we were looking for.', name: 'Jordan & Maya', initials: 'J&M', role: 'Married October 2025' },
  { quote: 'I was spending $300/month on directory listings that sent me price-shoppers. WedChem sends me couples who already love my work.', name: 'Rachel Kim', initials: 'RK', role: 'Wedding Photographer, Portland' },
  { quote: 'Every inquiry I get is from someone who genuinely connects with my aesthetic. My booking rate tripled since joining.', name: 'David Warren', initials: 'DW', role: 'Wedding Photographer, Denver' }
]
</script>

<style scoped>
.hero {
  min-height:100vh; display:flex; align-items:center; position:relative; overflow:hidden;
  background:linear-gradient(165deg, var(--cream) 0%, var(--blush) 35%, var(--sage-light) 70%, var(--cream) 100%);
}
.hero-content { position:relative;z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; padding:120px 0 80px; }
.hero-text { max-width:580px; }
.hero-badge {
  display:inline-flex; align-items:center; gap:8px; padding:8px 16px;
  background:rgba(255,255,255,0.6); border-radius:100px; font-size:0.78rem;
  font-weight:500; color:var(--warm-gray); letter-spacing:0.06em; text-transform:uppercase;
  margin-bottom:28px; backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.4);
  animation:fadeInUp 0.8s ease-out;
}
h1 { font-family:var(--font-display); font-size:clamp(3rem,5vw,4.5rem); font-weight:300; line-height:1.08; letter-spacing:-0.03em; margin-bottom:24px; animation:fadeInUp 0.8s ease-out 0.1s both; }
h1 em { font-style:italic; font-weight:400; color:var(--terracotta); }
.hero-sub { font-size:1.1rem; line-height:1.7; color:var(--warm-gray); max-width:480px; margin-bottom:40px; animation:fadeInUp 0.8s ease-out 0.2s both; }
.hero-actions { display:flex; gap:16px; flex-wrap:wrap; animation:fadeInUp 0.8s ease-out 0.3s both; }
.hero-visual { position:relative; height:560px; animation:fadeInUp 1s ease-out 0.4s both; }
.hcard { position:absolute; border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg); transition:transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
.hcard:hover { transform:translateY(-8px) rotate(0deg) !important; }
.hcard-1 { width:280px;height:370px;top:20px;left:0;transform:rotate(-3deg);background:linear-gradient(135deg,var(--blush),var(--sage-light)); }
.hcard-2 { width:240px;height:320px;top:80px;right:0;transform:rotate(2deg);background:linear-gradient(135deg,var(--sage-light),var(--gold-light)); }
.hcard-3 { width:200px;height:260px;bottom:20px;left:60px;transform:rotate(1deg);background:linear-gradient(135deg,var(--gold-light),var(--blush)); }
.hcard-inner { width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;text-align:center; }
.hc-i { font-size:2.5rem;margin-bottom:16px; }
.hc-l { font-family:var(--font-display);font-size:1.2rem;font-weight:500;margin-bottom:8px; }
.hc-d { font-size:0.82rem;color:var(--warm-gray);line-height:1.5; }
.how-section { padding:120px 0; background:var(--warm-white); }
.how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:48px; }
.how-card { padding:40px 32px; background:var(--cream); border-radius:var(--radius-lg); border:1px solid var(--light-gray); transition:var(--transition); }
.how-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-md); }
.how-num { font-family:var(--font-display);font-size:3.5rem;font-weight:300;color:var(--sage-light);line-height:1;margin-bottom:20px; }
.how-card h3 { font-family:var(--font-display);font-size:1.5rem;font-weight:500;margin-bottom:12px; }
.how-card p { font-size:0.95rem;color:var(--warm-gray);line-height:1.7; }
.quiz-preview { padding:120px 0; background:var(--cream); position:relative; }
.quiz-layout { display:grid; grid-template-columns:1fr 1.2fr; gap:80px; align-items:center; }
.quiz-text { max-width:460px; }
.quiz-demo { background:var(--warm-white); border-radius:var(--radius-lg); border:1px solid var(--light-gray); padding:40px; box-shadow:var(--shadow-md); }
.qd-label { font-family:var(--font-display);font-size:1.4rem;font-weight:500;margin-bottom:8px; }
.qd-sub { font-size:0.88rem;color:var(--warm-gray);margin-bottom:24px; }
.qd-pair { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px; }
.qd-opt { position:relative;border-radius:var(--radius);overflow:hidden;cursor:pointer;border:2.5px solid var(--light-gray);transition:var(--transition);aspect-ratio:4/3; }
.qd-opt:hover { border-color:var(--sage);transform:scale(1.02); }
.qd-opt.sel { border-color:var(--terracotta);box-shadow:0 0 0 3px rgba(196,130,106,0.2); }
.qd-opt-label { position:absolute;bottom:0;left:0;right:0;padding:10px 14px;background:linear-gradient(to top,rgba(44,44,44,0.65),transparent);color:white;font-size:0.8rem;font-weight:500; }
.qd-progress { display:flex;align-items:center;gap:12px; }
.qd-bar { flex:1;height:4px;background:var(--light-gray);border-radius:100px;overflow:hidden; }
.qd-fill { height:100%;width:12%;background:var(--terracotta);border-radius:100px; }
.qd-text { font-size:0.78rem;color:var(--warm-gray);font-weight:500;white-space:nowrap; }
.fp-section { padding:120px 0; background:var(--charcoal); color:var(--cream); position:relative; overflow:hidden; }
.fp-layout { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
.fp-benefits { list-style:none;margin-top:16px; }
.fp-benefits li { display:flex;align-items:flex-start;gap:14px;padding:14px 0;font-size:0.95rem;color:rgba(250,247,242,0.8); }
.fp-benefits li::before { content:'✓';flex-shrink:0;display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:rgba(139,158,130,0.3);color:var(--sage-light);font-size:0.75rem;font-weight:600; }
.fp-preview { background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:var(--radius-lg);padding:48px;backdrop-filter:blur(20px); }
.fpp-title { font-family:var(--font-display);font-size:1.5rem;font-weight:500;margin-bottom:8px; }
.fpp-sub { font-size:0.88rem;color:rgba(250,247,242,0.5);margin-bottom:28px; }
.fpp-steps { display:flex;flex-direction:column;gap:20px; }
.fpp-step { display:flex;gap:16px;align-items:flex-start;padding:20px;border-radius:var(--radius);background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06); }
.fpp-num { width:36px;height:36px;border-radius:50%;background:var(--sage);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.85rem;font-weight:600; }
.fpp-t { font-weight:500;font-size:0.95rem;margin-bottom:4px; }
.fpp-d { font-size:0.82rem;color:rgba(250,247,242,0.5);line-height:1.5; }
.pricing-section { padding:120px 0; background:var(--cream); }
.pricing-cards { display:grid;grid-template-columns:repeat(3,1fr);gap:28px;max-width:1000px;margin:0 auto; }
.p-card { padding:40px 32px;border-radius:var(--radius-lg);border:1px solid var(--light-gray);background:var(--warm-white); }
.p-card-featured { border-color:var(--terracotta);position:relative;box-shadow:var(--shadow-md); }
.p-card-featured::before { content:'BOOST YOUR LEADS';position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 16px;background:var(--terracotta);color:white;border-radius:100px;font-size:0.7rem;font-weight:600;letter-spacing:0.06em;white-space:nowrap; }
.pc-title { font-family:var(--font-display);font-size:1.5rem;font-weight:500;margin-bottom:8px; }
.pc-desc { font-size:0.88rem;color:var(--warm-gray);margin-bottom:24px; }
.pc-price { display:flex;align-items:baseline;gap:4px;margin-bottom:32px; }
.pc-cur { font-size:1.2rem;font-weight:500;color:var(--warm-gray); }
.pc-val { font-family:var(--font-display);font-size:3rem;font-weight:300;line-height:1; }
.pc-period { font-size:0.88rem;color:var(--warm-gray);margin-left:4px; }
.pc-features { list-style:none;margin-bottom:32px; }
.pc-features li { padding:10px 0;font-size:0.92rem;color:var(--warm-gray);display:flex;align-items:center;gap:12px; }
.pc-features li::before { content:'✓';color:var(--sage);font-weight:600; }
.testimonials-section { padding:120px 0; background:var(--warm-white); }
.test-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:28px; }
.test-card { padding:36px;background:var(--cream);border-radius:var(--radius-lg);border:1px solid var(--light-gray); }
.test-stars { margin-bottom:16px;color:var(--gold);font-size:0.9rem;letter-spacing:2px; }
.test-text { font-family:var(--font-display);font-size:1.15rem;font-weight:400;font-style:italic;line-height:1.6;margin-bottom:24px; }
.test-author { display:flex;align-items:center;gap:14px; }
.test-avatar { width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--sage-light),var(--blush));display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1rem;font-weight:500; }
.test-name { font-weight:500;font-size:0.92rem; }
.test-role { font-size:0.82rem;color:var(--warm-gray); }
.cta-section { padding:120px 0; background:linear-gradient(135deg,var(--blush),var(--cream) 40%,var(--sage-light)); }
@media (max-width:1024px) {
  .hero-content,.quiz-layout,.fp-layout { grid-template-columns:1fr; gap:48px; }
  .hero-visual { height:400px; }
  .pricing-cards { grid-template-columns:1fr; max-width:400px; }
}
@media (max-width:768px) {
  .how-grid,.test-grid { grid-template-columns:1fr; }
  .hero-visual { height:300px; }
  .hcard-1 { width:200px;height:260px; }
  .hcard-2 { width:170px;height:230px; }
  .hcard-3 { width:150px;height:200px; }
}
</style>
