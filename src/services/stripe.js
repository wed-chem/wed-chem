import { loadStripe } from '@stripe/stripe-js'
let stripePromise = null
export function getStripe() { if (!stripePromise) stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); return stripePromise }
export async function createCheckoutSession(photographerId, plan) {
  const res = await fetch('/api/create-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ photographerId, plan }) })
  const { sessionId } = await res.json()
  const stripe = await getStripe()
  await stripe.redirectToCheckout({ sessionId })
}
