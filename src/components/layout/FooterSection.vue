<template>
  <footer role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <router-link to="/" class="logo">Wed<span>Chem</span></router-link>
          <p>The smarter way to find your wedding photographer. Style-matched through real photo chemistry.</p>
        </div>
        <div class="footer-col">
          <h4>For Couples</h4>
          <ul>
            <li><router-link to="/quiz">Get Matched</router-link></li>
            <li><router-link to="/directory">Photographers</router-link></li>
            <li><router-link to="/pricing">Pricing</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>For Photographers</h4>
          <ul>
            <li><router-link to="/signup/photographer">Create Profile</router-link></li>
            <li><router-link to="/pricing">Pricing</router-link></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="mailto:hello@wedchem.com">Contact</a></li>
            <li><router-link to="/terms">Terms of Service</router-link></li>
            <li><router-link to="/privacy">Privacy Policy</router-link></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; {{ new Date().getFullYear() }} WedChem. All rights reserved.</div>
        <div class="footer-links">
          <router-link to="/privacy">Privacy</router-link>
          <router-link to="/terms">Terms</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer { padding:80px 0 40px; background:var(--charcoal); color:rgba(250,247,242,0.6); }
.footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; margin-bottom:64px; }
.footer-brand .logo { font-family:var(--font-display); font-size:1.5rem; font-weight:500; color:var(--cream); display:inline-block; margin-bottom:16px; }
.footer-brand .logo span { color:var(--terracotta); font-style:italic; }
.footer-brand p { font-size:0.88rem; line-height:1.7; max-width:300px; }
.footer-col h4 { font-size:0.78rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:rgba(250,247,242,0.4); margin-bottom:20px; }
.footer-col ul { list-style:none; }
.footer-col li { margin-bottom:12px; }
.footer-col a { color:rgba(250,247,242,0.6); font-size:0.88rem; transition:var(--transition); }
.footer-col a:hover { color:var(--cream); }
.footer-bottom { padding-top:32px; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; }
.footer-links { display:flex; gap:24px; }
.footer-links a { color:rgba(250,247,242,0.4); transition:var(--transition); }
.footer-links a:hover { color:rgba(250,247,242,0.7); }
@media(max-width:768px) { .footer-grid { grid-template-columns:1fr; gap:32px; } .footer-bottom { flex-direction:column; gap:16px; text-align:center; } }
</style>
