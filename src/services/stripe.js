import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null
export function getStripe() {
  if (!stripePromise) stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  return stripePromise
}

export async function createCheckoutSession(uid, plan) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, plan })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (data.url) {
    window.location.href = data.url
  } else if (data.sessionId) {
    const stripe = await getStripe()
    await stripe.redirectToCheckout({ sessionId: data.sessionId })
  }
}
