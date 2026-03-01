<template>
  <div class="pricing-page">
    <div class="container">

      <!-- HEADER -->
      <div class="pricing-header">
        <div class="section-eyebrow">Pricing</div>
        <h1 class="pricing-title">Free to use. Free to list. <em>Seriously.</em></h1>
        <p class="pricing-sub">WedChem is free for couples and photographers. Only pay if you want extra visibility.</p>
      </div>

      <!-- CARDS -->
      <div class="pricing-cards">

        <!-- COUPLES -->
        <div class="p-card">
          <div class="pc-icon">💍</div>
          <div class="pc-title">For Couples</div>
          <div class="pc-desc">Everything you need to find your perfect photographer</div>
          <div class="pc-price">
            <span class="pc-val" style="color:var(--sage)">Free</span>
            <span class="pc-period">forever</span>
          </div>
          <ul class="pc-features">
            <li>Take the 25-photo style quiz</li>
            <li>Get personalized photographer matches</li>
            <li>Browse the full directory</li>
            <li>Send unlimited inquiries</li>
            <li>Save & compare your favorites</li>
            <li>Retake the quiz anytime</li>
            <li>No account required to start</li>
          </ul>
          <router-link to="/quiz" class="btn-primary pc-btn">Take the Quiz →</router-link>
          <div class="pc-note">No credit card. No catch. Just matches.</div>
        </div>

        <!-- PHOTOGRAPHERS FREE -->
        <div class="p-card">
          <div class="pc-icon">📷</div>
          <div class="pc-title">For Photographers</div>
          <div class="pc-desc">List your profile and start getting matched with couples</div>
          <div class="pc-price">
            <span class="pc-val" style="color:var(--sage)">Free</span>
            <span class="pc-period">to list</span>
          </div>
          <ul class="pc-features">
            <li>Full profile with portfolio</li>
            <li>Appear in couple match results</li>
            <li>Receive direct inquiries</li>
            <li>Zero commission on bookings</li>
            <li>Basic analytics</li>
            <li>Social media links on profile</li>
            <li>Listed in the directory</li>
          </ul>
          <router-link to="/signup/photographer" class="btn-primary pc-btn">Create Your Profile →</router-link>
          <div class="pc-note">No trial. No expiration. Free means free.</div>
        </div>

        <!-- FEATURED -->
        <div class="p-card p-card-featured">
          <div class="pc-popular">MOST POPULAR</div>
          <div class="pc-icon">⭐</div>
          <div class="pc-title">Featured</div>
          <div class="pc-desc">Boost your visibility and get more inquiries</div>
          <div class="pc-price">
            <span class="pc-cur">$</span>
            <span class="pc-val">25</span>
            <span class="pc-period">/ month</span>
          </div>
          <div class="pc-annual">or $250/year <span class="pc-save">Save 17%</span></div>
          <ul class="pc-features">
            <li class="feat-highlight">Everything in Free, plus:</li>
            <li>Boosted to the top of match results</li>
            <li>"Featured" badge on your profile</li>
            <li>Priority placement in directory</li>
            <li>Homepage spotlight rotation</li>
            <li>Advanced analytics dashboard</li>
            <li>Match rate insights</li>
            <li>Priority support</li>
          </ul>
          <router-link to="/signup/photographer" class="btn-primary pc-btn" style="background:var(--terracotta);">Get Featured →</router-link>
          <div class="pc-note">Cancel anytime. No long-term contracts.</div>
        </div>

      </div>

      <!-- COMPARISON TABLE -->
      <div class="compare-section">
        <h2 class="compare-title">Feature Comparison</h2>
        <div class="compare-table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Photographers (Free)</th>
                <th>Featured</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in comparisonRows" :key="row.feature">
                <td>{{ row.feature }}</td>
                <td><span :class="row.free === true ? 'check' : row.free === false ? 'dash' : 'text'">{{ row.free === true ? '✓' : row.free === false ? '—' : row.free }}</span></td>
                <td><span :class="row.featured === true ? 'check-gold' : row.featured === false ? 'dash' : 'text'">{{ row.featured === true ? '✓' : row.featured === false ? '—' : row.featured }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ -->
      <div class="faq-section">
        <h2 class="faq-title">Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-item" v-for="(faq, i) in faqs" :key="i">
            <button class="faq-q" @click="faq.open = !faq.open" :class="{open: faq.open}">
              {{ faq.question }}
              <span class="faq-toggle">{{ faq.open ? '−' : '+' }}</span>
            </button>
            <div class="faq-a" v-show="faq.open">{{ faq.answer }}</div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="pricing-cta">
        <h2 class="pricing-cta-title">Ready to find your match?</h2>
        <p class="pricing-cta-sub">Whether you're a couple looking for the perfect photographer or a photographer looking for ideal clients — it starts here.</p>
        <div class="pricing-cta-actions">
          <router-link to="/quiz" class="btn-primary">I'm a Couple →</router-link>
          <router-link to="/signup/photographer" class="btn-secondary">I'm a Photographer →</router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const comparisonRows = [
  { feature: 'Style matching quiz', free: true, featured: true },
  { feature: 'Profile with portfolio', free: true, featured: true },
  { feature: 'Appear in match results', free: true, featured: true },
  { feature: 'Receive inquiries', free: true, featured: true },
  { feature: 'Send inquiries', free: false, featured: false },
  { feature: 'Browse directory', free: true, featured: true },
  { feature: 'Social media links', free: true, featured: true },
  { feature: 'Commission on bookings', free: '0%', featured: '0%' },
  { feature: 'Boosted in match results', free: false, featured: true },
  { feature: '"Featured" profile badge', free: false, featured: true },
  { feature: 'Priority directory placement', free: false, featured: true },
  { feature: 'Homepage spotlight', free: false, featured: true },
  { feature: 'Advanced analytics', free: false, featured: true },
  { feature: 'Match rate insights', free: false, featured: true },
  { feature: 'Priority support', free: false, featured: true },
]

const faqs = reactive([
  { question: 'Is WedChem really free for couples?', answer: 'Yes, 100%. Couples can take the quiz, browse photographers, send inquiries, and save favorites — all completely free, forever. No hidden fees, no premium tier, no catch.', open: false },
  { question: 'Is it really free for photographers to list?', answer: "Yes. You can create a full profile with portfolio, appear in match results, and receive direct inquiries at no cost. The Featured tier is optional — it just gives you extra visibility.", open: false },
  { question: 'What does the Featured tier actually do?', answer: "Featured photographers get boosted to the top of match results, a gold badge on their profile, priority placement in the directory, homepage spotlight rotation, and advanced analytics showing your match rates and inquiry trends. It's designed for photographers who want to maximize their visibility.", open: false },
  { question: 'Do you take a commission on bookings?', answer: 'Never. Zero commission, zero referral fees. When a couple books you, that\'s between you and them. We make money from the optional Featured tier, not from your bookings.', open: false },
  { question: 'How does the matching algorithm work?', answer: "Our proprietary algorithm analyzes visual preferences across 25 dimensions including editing style, lighting, composition, and mood. When a couple's preferences align with a photographer's style, that's a high match. We also factor in location, budget, and other practical details.", open: false },
  { question: 'Can I cancel Featured anytime?', answer: 'Yes. No contracts, no cancellation fees. You can upgrade or downgrade anytime. If you cancel, your profile stays listed — you just lose the Featured benefits.', open: false },
  { question: 'How many photos can I upload to my portfolio?', answer: 'We recommend 8–20 photos that represent the range of your work. Include a mix of couples, details, ceremony, reception, indoor, and outdoor shots.', open: false },
  { question: "I'm a couple — do I need an account?", answer: "No. You can take the quiz and see your matches without creating an account. If you want to save your favorites or send inquiries, we'll ask you to sign up (it's free and takes 30 seconds).", open: false },
])
</script>

<style scoped>
.pricing-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }

/* HEADER */
.pricing-header { text-align:center; margin-bottom:64px; }
.pricing-title { font-family:var(--font-display); font-size:clamp(2.5rem,4vw,3.5rem); font-weight:300; line-height:1.1; margin-bottom:16px; }
.pricing-title em { font-style:italic; color:var(--terracotta); }
.pricing-sub { font-size:1.1rem; color:var(--warm-gray); max-width:520px; margin:0 auto; line-height:1.7; }

/* CARDS */
.pricing-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-bottom:100px; }
.p-card {
  padding:40px 32px; border-radius:var(--radius-lg); border:1px solid var(--light-gray);
  background:var(--warm-white); display:flex; flex-direction:column; align-items:center; text-align:center;
}
.p-card-featured { border-color:var(--terracotta); box-shadow:var(--shadow-lg); position:relative; transform:scale(1.03); }
.pc-popular {
  position:absolute; top:-14px; left:50%; transform:translateX(-50%);
  padding:6px 20px; background:var(--terracotta); color:white; border-radius:100px;
  font-size:0.72rem; font-weight:600; letter-spacing:0.08em; white-space:nowrap;
}
.pc-icon { font-size:2.5rem; margin-bottom:16px; }
.pc-title { font-family:var(--font-display); font-size:1.6rem; font-weight:500; margin-bottom:8px; }
.pc-desc { font-size:0.88rem; color:var(--warm-gray); margin-bottom:24px; max-width:280px; line-height:1.6; }
.pc-price { display:flex; align-items:baseline; gap:4px; margin-bottom:8px; }
.pc-cur { font-size:1.2rem; font-weight:500; color:var(--warm-gray); }
.pc-val { font-family:var(--font-display); font-size:3.5rem; font-weight:300; line-height:1; }
.pc-period { font-size:0.88rem; color:var(--warm-gray); margin-left:4px; }
.pc-annual { font-size:0.82rem; color:var(--warm-gray); margin-bottom:24px; }
.pc-save { display:inline-block; padding:2px 8px; background:var(--sage-light); color:var(--sage-dark); border-radius:100px; font-size:0.7rem; font-weight:600; margin-left:6px; }

.pc-features { list-style:none; margin-bottom:28px; width:100%; text-align:left; }
.pc-features li { padding:10px 0; font-size:0.9rem; color:var(--warm-gray); display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(232,227,220,0.5); }
.pc-features li:last-child { border-bottom:none; }
.pc-features li::before { content:'✓'; color:var(--sage); font-weight:600; flex-shrink:0; }
.feat-highlight { font-weight:500; color:var(--charcoal); }
.feat-highlight::before { content:''; }

.pc-btn { width:100%; justify-content:center; }
.pc-note { font-size:0.78rem; color:var(--warm-gray); margin-top:12px; }

/* COMPARISON TABLE */
.compare-section { margin-bottom:100px; }
.compare-title { font-family:var(--font-display); font-size:2rem; font-weight:400; text-align:center; margin-bottom:36px; }
.compare-table-wrap { overflow-x:auto; border-radius:var(--radius-lg); border:1px solid var(--light-gray); }
.compare-table { width:100%; border-collapse:collapse; background:var(--warm-white); min-width:600px; }
.compare-table thead { background:var(--charcoal); color:var(--cream); }
.compare-table th { padding:16px 20px; font-size:0.82rem; font-weight:500; text-align:center; letter-spacing:0.04em; text-transform:uppercase; }
.compare-table th:first-child { text-align:left; }
.compare-table td { padding:14px 20px; font-size:0.88rem; text-align:center; border-bottom:1px solid var(--light-gray); }
.compare-table td:first-child { text-align:left; color:var(--charcoal); font-weight:400; }
.compare-table tr:last-child td { border-bottom:none; }
.compare-table tr:hover { background:rgba(139,158,130,0.03); }

.check { color:var(--sage); font-weight:600; }
.check-gold { color:var(--terracotta); font-weight:600; }
.dash { color:var(--light-gray); }
.text { font-weight:500; color:var(--charcoal); }

/* FAQ */
.faq-section { margin-bottom:100px; }
.faq-title { font-family:var(--font-display); font-size:2rem; font-weight:400; text-align:center; margin-bottom:36px; }
.faq-grid { max-width:760px; margin:0 auto; }
.faq-item { border-bottom:1px solid var(--light-gray); }
.faq-q {
  width:100%; padding:20px 0; display:flex; justify-content:space-between; align-items:center;
  font-size:1rem; color:var(--charcoal); font-weight:500; text-align:left;
  transition:var(--transition); gap:16px;
}
.faq-q:hover { color:var(--terracotta); }
.faq-toggle { font-size:1.4rem; color:var(--warm-gray); flex-shrink:0; width:24px; text-align:center; }
.faq-a { padding:0 0 20px; font-size:0.92rem; color:var(--warm-gray); line-height:1.7; }

/* CTA */
.pricing-cta { text-align:center; padding:80px 48px; background:linear-gradient(135deg, var(--blush), var(--cream) 40%, var(--sage-light)); border-radius:var(--radius-lg); }
.pricing-cta-title { font-family:var(--font-display); font-size:2.2rem; font-weight:300; margin-bottom:12px; }
.pricing-cta-sub { font-size:1rem; color:var(--warm-gray); max-width:480px; margin:0 auto 32px; line-height:1.7; }
.pricing-cta-actions { display:flex; justify-content:center; gap:16px; flex-wrap:wrap; }

/* RESPONSIVE */
@media (max-width:1024px) {
  .pricing-cards { grid-template-columns:1fr; max-width:420px; margin-left:auto; margin-right:auto; }
  .p-card-featured { transform:scale(1); }
}
@media (max-width:768px) {
  .pricing-header { margin-bottom:48px; }
}
</style>
