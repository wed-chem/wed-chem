<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-card">
        <h1 class="legal-title">Privacy Policy</h1>
        <p class="legal-date">Last updated: February 28, 2026</p>

        <div class="legal-body">
          <p>WedChem ("we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website at wedchem.com (the "Service").</p>

          <h2>1. Information We Collect</h2>

          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Account information:</strong> Name, email address, password when you create an account</li>
            <li><strong>Couple profiles:</strong> Wedding date, location, guest count, budget range, style preferences (quiz responses)</li>
            <li><strong>Photographer profiles:</strong> Business name, location, phone number, website, social media handles, pricing, portfolio photos, style preferences, travel radius</li>
            <li><strong>Communications:</strong> Messages sent through our inquiry system</li>
            <li><strong>Payment information:</strong> Processed directly by Stripe; we do not store credit card numbers</li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage data:</strong> Pages visited, features used, time spent on the Service</li>
            <li><strong>Device information:</strong> Browser type, operating system, device type</li>
            <li><strong>Location data:</strong> General location derived from IP address; precise location only if you provide it (e.g., wedding city)</li>
            <li><strong>Cookies:</strong> We use essential cookies for authentication and session management. We use Google Analytics to understand usage patterns.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Operate and improve the Service</li>
            <li>Generate style matches between couples and photographers using our proprietary algorithm</li>
            <li>Facilitate communication between couples and photographers</li>
            <li>Process payments for photographer subscriptions</li>
            <li>Send transactional emails (account verification, inquiry notifications, approval status)</li>
            <li>Analyze usage to improve the matching algorithm and user experience</li>
            <li>Enforce our Terms of Service and protect against fraud</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal information. We may share information in the following circumstances:</p>
          <ul>
            <li><strong>Between users:</strong> When a couple sends an inquiry, their name, email, wedding date, and message are shared with the photographer. Photographer profiles are publicly visible.</li>
            <li><strong>Service providers:</strong> We use third-party services to operate the platform, including Firebase (hosting, database, authentication), Stripe (payments), Postmark (email), and Google Analytics (usage analysis).</li>
            <li><strong>Legal requirements:</strong> We may disclose information if required by law, regulation, legal process, or governmental request.</li>
            <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
          </ul>

          <h2>4. Data Retention</h2>
          <p>We retain your information for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data by contacting us. We will delete your data within 30 days of a verified request, except where retention is required by law.</p>
          <p>Photographer portfolio photos are deleted upon account deletion or profile removal.</p>

          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your information, including encryption in transit (HTTPS), secure authentication, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and personal information</li>
            <li>Object to or restrict certain processing</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:privacy@wedchem.com">privacy@wedchem.com</a>.</p>

          <h2>7. California Residents (CCPA)</h2>
          <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete your information, and the right to opt out of the sale of personal information. We do not sell personal information.</p>

          <h2>8. International Users</h2>
          <p>If you access the Service from outside the United States, your information may be transferred to, stored, and processed in the United States. By using the Service, you consent to the transfer of your information to the United States.</p>
          <p>For users in the European Economic Area (EEA) or United Kingdom, we process your data on the basis of contractual necessity, legitimate interests, and/or your consent. You have the right to lodge a complaint with your local data protection authority.</p>

          <h2>9. Children's Privacy</h2>
          <p>The Service is not directed to individuals under 18. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will delete it promptly.</p>

          <h2>10. Third-Party Links</h2>
          <p>The Service may contain links to third-party websites, including photographer websites and social media profiles. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</p>

          <h2>11. Cookies & Tracking</h2>
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential cookies:</strong> Required for authentication and basic functionality</li>
            <li><strong>Analytics cookies:</strong> Google Analytics to understand how users interact with the Service</li>
          </ul>
          <p>You can control cookies through your browser settings. Disabling essential cookies may prevent you from using certain features.</p>

          <h2>12. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. The "Last updated" date at the top reflects the most recent revision.</p>

          <h2>13. Contact Us</h2>
          <p>For privacy-related questions or requests:</p>
          <p>Email: <a href="mailto:privacy@wedchem.com">privacy@wedchem.com</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-page { padding:120px 0 80px; background:var(--cream); min-height:100vh; }
.legal-card { max-width:760px; margin:0 auto; background:var(--warm-white); border:1px solid var(--light-gray); border-radius:var(--radius-lg); padding:60px 48px; box-shadow:var(--shadow-md); }
.legal-title { font-family:var(--font-display); font-size:2.2rem; font-weight:400; margin-bottom:8px; }
.legal-date { font-size:0.85rem; color:var(--warm-gray); margin-bottom:40px; }
.legal-body h2 { font-family:var(--font-display); font-size:1.2rem; font-weight:500; margin:32px 0 12px; }
.legal-body h3 { font-size:0.95rem; font-weight:600; margin:20px 0 8px; }
.legal-body p { font-size:0.92rem; color:var(--charcoal); line-height:1.8; margin-bottom:16px; }
.legal-body ul { padding-left:24px; margin-bottom:16px; }
.legal-body li { font-size:0.92rem; color:var(--charcoal); line-height:1.8; margin-bottom:6px; }
.legal-body a { color:var(--terracotta); }
@media(max-width:768px) { .legal-card { padding:40px 24px; } }
</style>
