const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const postmark = require("postmark");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ─── POSTMARK CONFIG ───
const POSTMARK_TOKEN = process.env.POSTMARK_TOKEN;
const FROM_EMAIL = process.env.POSTMARK_FROM || "notifications@wedchem.com";

function getPostmarkClient() {
  if (!POSTMARK_TOKEN) throw new Error("Postmark token not configured");
  return new postmark.ServerClient(POSTMARK_TOKEN);
}

// ─── EMAIL: APPROVAL/REJECTION STATUS ───
app.post("/api/email/status", async (req, res) => {
  try {
    const { to, name, status, reason } = req.body;
    const client = getPostmarkClient();

    const subject = status === "approved"
      ? "🎉 Your WedChem profile is approved!"
      : "Update on your WedChem application";

    const htmlBody = status === "approved"
      ? `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
          <h1 style="font-size:24px;color:#2c2c2c;">Welcome to WedChem, ${name}!</h1>
          <p style="color:#6B6560;line-height:1.7;">Great news — your photographer profile has been approved and is now live on WedChem.</p>
          <p style="color:#6B6560;line-height:1.7;">Couples are already taking our style quiz and finding their matches. Your profile is now visible in search results and the directory.</p>
          <p style="color:#6B6560;line-height:1.7;"><strong>What's next:</strong></p>
          <ul style="color:#6B6560;line-height:1.9;">
            <li>Make sure your portfolio has 8–20 of your best shots</li>
            <li>Complete your pricing and services info</li>
            <li>Consider upgrading to Featured for 3x more visibility</li>
          </ul>
          <a href="https://wedchem.com/dashboard" style="display:inline-block;padding:14px 28px;background:#2c2c2c;color:#faf7f2;border-radius:100px;text-decoration:none;font-weight:500;margin-top:16px;">Go to Dashboard →</a>
          <p style="color:#b8a99a;font-size:0.85rem;margin-top:40px;">— The WedChem Team</p>
        </div>`
      : `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
          <h1 style="font-size:24px;color:#2c2c2c;">Hi ${name},</h1>
          <p style="color:#6B6560;line-height:1.7;">Thank you for applying to join WedChem. After reviewing your profile, we're unable to approve your listing at this time.</p>
          ${reason ? `<p style="color:#6B6560;line-height:1.7;"><strong>Reason:</strong> ${reason}</p>` : ""}
          <p style="color:#6B6560;line-height:1.7;">You're welcome to update your profile and reapply. Common reasons for rejection include incomplete portfolios, non-wedding photography, or profiles that don't meet our quality standards.</p>
          <p style="color:#6B6560;line-height:1.7;">If you have questions, reply to this email and we'll be happy to help.</p>
          <p style="color:#b8a99a;font-size:0.85rem;margin-top:40px;">— The WedChem Team</p>
        </div>`;

    await client.sendEmail({
      From: FROM_EMAIL,
      To: to,
      Subject: subject,
      HtmlBody: htmlBody,
      MessageStream: "outbound",
    });

    res.json({ success: true });
  } catch (e) {
    console.error("Email error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ─── EMAIL: INQUIRY NOTIFICATION ───
app.post("/api/email/inquiry", async (req, res) => {
  try {
    const { to, photographerName, coupleName, coupleEmail, weddingDate, message, matchScore } = req.body;
    const client = getPostmarkClient();

    await client.sendEmail({
      From: FROM_EMAIL,
      To: to,
      Subject: `💌 New inquiry from ${coupleName} on WedChem`,
      HtmlBody: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="font-size:24px;color:#2c2c2c;">New inquiry, ${photographerName}!</h1>
        <p style="color:#6B6560;line-height:1.7;">You have a new message from a couple on WedChem.</p>
        <div style="background:#faf7f2;border:1px solid #e8e3dc;border-radius:12px;padding:24px;margin:24px 0;">
          <p style="margin:0 0 8px;"><strong>From:</strong> ${coupleName}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${coupleEmail}">${coupleEmail}</a></p>
          ${weddingDate ? `<p style="margin:0 0 8px;"><strong>Wedding Date:</strong> ${weddingDate}</p>` : ""}
          ${matchScore ? `<p style="margin:0 0 8px;"><strong>Match Score:</strong> ${matchScore}%</p>` : ""}
          <hr style="border:none;border-top:1px solid #e8e3dc;margin:16px 0;">
          <p style="margin:0;color:#2c2c2c;line-height:1.7;white-space:pre-line;">${message}</p>
        </div>
        <p style="color:#6B6560;line-height:1.7;">Reply directly to <a href="mailto:${coupleEmail}">${coupleEmail}</a> or view in your dashboard:</p>
        <a href="https://wedchem.com/dashboard/inquiries" style="display:inline-block;padding:14px 28px;background:#2c2c2c;color:#faf7f2;border-radius:100px;text-decoration:none;font-weight:500;">View Inquiries →</a>
        <p style="color:#b8a99a;font-size:0.85rem;margin-top:40px;">— WedChem</p>
      </div>`,
      MessageStream: "outbound",
    });

    res.json({ success: true });
  } catch (e) {
    console.error("Email error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ─── EMAIL: WELCOME ───
app.post("/api/email/welcome", async (req, res) => {
  try {
    const { to, name } = req.body;
    const client = getPostmarkClient();

    await client.sendEmail({
      From: FROM_EMAIL,
      To: to,
      Subject: "Welcome to WedChem! 📷",
      HtmlBody: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="font-size:24px;color:#2c2c2c;">Welcome to WedChem, ${name}!</h1>
        <p style="color:#6B6560;line-height:1.7;">Thanks for creating your profile. Your application is now under review — we typically approve profiles within 24 hours.</p>
        <p style="color:#6B6560;line-height:1.7;">While you wait, make sure your profile is complete:</p>
        <ul style="color:#6B6560;line-height:1.9;">
          <li>Upload 8–20 portfolio photos</li>
          <li>Fill in your pricing and packages</li>
          <li>Add your social links</li>
          <li>Write a compelling bio</li>
        </ul>
        <p style="color:#6B6560;line-height:1.7;">We'll email you as soon as your profile is approved.</p>
        <a href="https://wedchem.com/dashboard" style="display:inline-block;padding:14px 28px;background:#2c2c2c;color:#faf7f2;border-radius:100px;text-decoration:none;font-weight:500;margin-top:16px;">Go to Dashboard →</a>
        <p style="color:#b8a99a;font-size:0.85rem;margin-top:40px;">— The WedChem Team</p>
      </div>`,
      MessageStream: "outbound",
    });

    res.json({ success: true });
  } catch (e) {
    console.error("Email error:", e);
    res.status(500).json({ error: e.message });
  }
});

// ─── STRIPE WEBHOOK ───
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const STRIPE_SECRET = process.env.STRIPE_SECRET;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET) return res.status(500).json({ error: "Stripe not configured" });

  const stripe = require("stripe")(STRIPE_SECRET);
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const uid = session.metadata?.uid;
    if (uid) {
      await db.collection("photographers").doc(uid).update({ tier: "featured", featuredSince: admin.firestore.FieldValue.serverTimestamp() });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const uid = sub.metadata?.uid;
    if (uid) {
      await db.collection("photographers").doc(uid).update({ tier: "free", featuredSince: null });
    }
  }

  res.json({ received: true });
});

// ─── STRIPE CHECKOUT SESSION ───
app.post("/api/stripe/checkout", async (req, res) => {
  const STRIPE_SECRET = process.env.STRIPE_SECRET;
  if (!STRIPE_SECRET) return res.status(500).json({ error: "Stripe not configured" });

  const stripe = require("stripe")(STRIPE_SECRET);
  const { uid, plan } = req.body;

  try {
    const priceId = (plan === "yearly" || plan === "featured_yearly")
      ? process.env.STRIPE_PRICE_YEARLY
      : process.env.STRIPE_PRICE_MONTHLY;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://wedchem.com/dashboard?upgraded=true",
      cancel_url: "https://wedchem.com/dashboard/upgrade",
      metadata: { uid },
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── FIRESTORE TRIGGER: NEW INQUIRY → EMAIL ───
exports.onNewInquiry = functions.firestore
  .document("inquiries/{inquiryId}")
  .onCreate(async (snap) => {
    const inquiry = snap.data();
    try {
      const photDoc = await db.collection("photographers").doc(inquiry.photographerId).get();
      if (!photDoc.exists) return;
      const photographer = photDoc.data();
      if (!photographer.email) return;

      const client = getPostmarkClient();
      await client.sendEmail({
        From: FROM_EMAIL,
        To: photographer.email,
        Subject: `💌 New inquiry from ${inquiry.coupleName} on WedChem`,
        HtmlBody: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
          <h1 style="font-size:24px;color:#2c2c2c;">New inquiry!</h1>
          <div style="background:#faf7f2;border:1px solid #e8e3dc;border-radius:12px;padding:24px;margin:24px 0;">
            <p><strong>From:</strong> ${inquiry.coupleName}</p>
            <p><strong>Email:</strong> <a href="mailto:${inquiry.coupleEmail}">${inquiry.coupleEmail}</a></p>
            ${inquiry.weddingDate ? `<p><strong>Wedding:</strong> ${inquiry.weddingDate}</p>` : ""}
            <hr style="border:none;border-top:1px solid #e8e3dc;margin:16px 0;">
            <p style="white-space:pre-line;">${inquiry.message}</p>
          </div>
          <a href="https://wedchem.com/dashboard/inquiries" style="display:inline-block;padding:14px 28px;background:#2c2c2c;color:#faf7f2;border-radius:100px;text-decoration:none;font-weight:500;">View Inquiries →</a>
        </div>`,
        MessageStream: "outbound",
      });
    } catch (e) {
      console.error("Inquiry email failed:", e);
    }
  });

// Export Express app as Cloud Function
exports.app = functions.https.onRequest(app);

// ─── SCHEDULED: 48-HOUR FOLLOW-UP EMAIL TO COUPLE ───
exports.inquiryFollowUp = functions.pubsub
  .schedule("every 6 hours")
  .onRun(async () => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48h ago
    const tooOld = new Date(now.getTime() - 96 * 60 * 60 * 1000); // don't re-nag after 96h

    try {
      const snap = await db.collection("inquiries")
        .where("status", "in", ["new", "read"])
        .where("followUpSent", "==", false)
        .get();

      const client = getPostmarkClient();

      for (const docSnap of snap.docs) {
        const inq = docSnap.data();
        const created = inq.createdAt?.toDate ? inq.createdAt.toDate() : new Date(inq.createdAt);
        
        // Only send if created 48h+ ago and less than 96h
        if (created > cutoff || created < tooOld) continue;
        if (!inq.coupleEmail) continue;

        // Get photographer name
        let photogName = "your photographer match";
        try {
          const pDoc = await db.collection("photographers").doc(inq.photographerId).get();
          if (pDoc.exists) photogName = pDoc.data().businessName || photogName;
        } catch (e) {}

        await client.sendEmail({
          From: FROM_EMAIL,
          To: inq.coupleEmail,
          Subject: `Did you hear back from ${photogName}?`,
          HtmlBody: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
            <h1 style="font-size:24px;color:#2c2c2c;">Quick check-in</h1>
            <p style="font-size:16px;line-height:1.6;color:#6b6b6b;">You reached out to <strong>${photogName}</strong> through WedChem a couple days ago. We wanted to check — have you heard back?</p>
            <p style="font-size:16px;line-height:1.6;color:#6b6b6b;">If not, don't worry — photographers can be busy during wedding season. You can always browse more matches or try reaching out to another photographer.</p>
            <div style="margin:32px 0;">
              <a href="https://wedchem.com/directory" style="display:inline-block;padding:14px 28px;background:#2c2c2c;color:#faf7f2;border-radius:100px;text-decoration:none;font-weight:500;">Browse More Photographers →</a>
            </div>
            <p style="font-size:14px;color:#999;">— The WedChem Team</p>
          </div>`,
          MessageStream: "outbound",
        });

        await docSnap.ref.update({ followUpSent: true, followUpSentAt: admin.firestore.FieldValue.serverTimestamp() });
      }
    } catch (e) {
      console.error("Follow-up email job failed:", e);
    }
  });
