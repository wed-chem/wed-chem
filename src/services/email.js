// Email service - calls Cloud Functions which use Postmark
// Direct Postmark API calls should happen server-side only (Cloud Functions)
// This module calls our Cloud Functions endpoints

const FUNCTIONS_BASE = import.meta.env.VITE_FUNCTIONS_URL || ''

export async function sendApprovalEmail(photographer, status, reason) {
  // For now, call Postmark directly via Cloud Function
  // In production, this should go through a Firebase Cloud Function
  try {
    const response = await fetch(`${FUNCTIONS_BASE}/api/email/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: photographer.email,
        name: photographer.businessName || photographer.firstName,
        status,
        reason: reason || null
      })
    })
    return response.ok
  } catch (e) {
    console.warn('Email API not available - Cloud Functions not deployed yet')
    console.log(`[EMAIL PREVIEW] To: ${photographer.email}, Status: ${status}, Reason: ${reason || 'N/A'}`)
    return false
  }
}

export async function sendInquiryNotification(photographer, inquiry) {
  try {
    const response = await fetch(`${FUNCTIONS_BASE}/api/email/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: photographer.email,
        photographerName: photographer.businessName || photographer.firstName,
        coupleName: inquiry.coupleName,
        coupleEmail: inquiry.coupleEmail,
        weddingDate: inquiry.weddingDate,
        message: inquiry.message,
        matchScore: inquiry.matchScore
      })
    })
    return response.ok
  } catch (e) {
    console.warn('Email API not available')
    console.log(`[EMAIL PREVIEW] Inquiry notification to: ${photographer.email}`)
    return false
  }
}

export async function sendWelcomeEmail(photographer) {
  try {
    const response = await fetch(`${FUNCTIONS_BASE}/api/email/welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: photographer.email,
        name: photographer.businessName || photographer.firstName
      })
    })
    return response.ok
  } catch (e) {
    console.warn('Email API not available')
    return false
  }
}
