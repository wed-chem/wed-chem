// Geocoding using OpenStreetMap Nominatim (free, no API key needed)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

export async function geocodeLocation(city, state, country) {
  const parts = [city, state, country].filter(Boolean).join(', ')
  if (!parts) return null

  try {
    const response = await fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(parts)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'WedChem/1.0' } }
    )
    const data = await response.json()
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      }
    }
    return null
  } catch (e) {
    console.error('Geocoding error:', e)
    return null
  }
}

export function calculateDistance(lat1, lng1, lat2, lng2) {
  // Haversine formula - returns distance in miles
  const R = 3959 // Earth radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg) { return deg * (Math.PI / 180) }

export async function validateAndGeocode(city, state, country) {
  const result = await geocodeLocation(city, state, country)
  if (!result) {
    return { valid: false, error: 'Could not verify this location. Please check the spelling.' }
  }
  return { valid: true, ...result }
}
