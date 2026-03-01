// ═══════════ QUIZ DATA v2 ═══════════

// Q1: Editing Style (multi-select, rank 1-5)
export const editingStyles = [
  { id: 'warm', label: 'Warm', description: 'Sepia tones, golden warmth', gradient: 'linear-gradient(135deg, #c9a96e, #d4a574, #e8d5cc)' },
  { id: 'cool', label: 'Cool', description: 'Cold, dark, blue-toned', gradient: 'linear-gradient(135deg, #1a1a2e, #2c3e50, #b0c4d4)' },
  { id: 'true', label: 'True to Life', description: 'Accurate, natural colors', gradient: 'linear-gradient(135deg, #8B9E82, #c5d4be, #e8e3dc)' },
  { id: 'vibrant', label: 'Vibrant', description: 'Rich, punchy, saturated', gradient: 'linear-gradient(135deg, #C4826A, #c9a96e, #6B7E62)' },
  { id: 'airy', label: 'Light & Airy', description: 'Bright, soft, pastel', gradient: 'linear-gradient(135deg, #e8e3dc, #faf7f2, #c5d4be)' }
]

// Q2: Photo Style (multi-select, rank 1-4)
export const photoStyles = [
  { id: 'traditional', label: 'Traditional', description: 'Classic, organized, timeless poses' },
  { id: 'editorial', label: 'Editorial', description: 'Fashion-forward, magazine-cover quality' },
  { id: 'documentary', label: 'Candid / Documentary', description: 'Fly-on-the-wall, unposed, authentic' },
  { id: 'fineart', label: 'Fine Art', description: 'Painterly, artistic, carefully composed' }
]

// Q3: Saturation preference (pick one)
export const saturationQuestion = {
  id: 'saturation',
  question: 'Which feels more like you?',
  a: { label: 'Saturated', description: 'Bold, rich, full color', gradient: 'linear-gradient(135deg, #6B7E62 0%, #C4826A 50%, #c9a96e 100%)' },
  b: { label: 'Desaturated', description: 'Muted, faded, film-like', gradient: 'linear-gradient(135deg, #b8a99a 0%, #c5bdb4 50%, #d4ccc3 100%)' }
}

// Q4-10: A/B photo pairs (will use real photos later, gradients for now)
export const abPairs = [
  { id: 4, category: 'Tone', question: 'Which portrait edit do you prefer?',
    a: { label: 'Dark & Moody', image: null, gradient: 'linear-gradient(135deg, #2c2c2c 0%, #4a3f35 40%, #8B6914 100%)' },
    b: { label: 'Light & Bright', image: null, gradient: 'linear-gradient(135deg, #e8e3dc 0%, #faf7f2 50%, #c5d4be 100%)' }
  },
  { id: 5, category: 'Temperature', question: 'Which color tone draws you in?',
    a: { label: 'Cool Blue Tones', image: null, gradient: 'linear-gradient(135deg, #b0c4d4 0%, #d4dfe8 50%, #e8edf2 100%)' },
    b: { label: 'Warm Amber Tones', image: null, gradient: 'linear-gradient(135deg, #c9a96e 0%, #d4a574 50%, #e8d5cc 100%)' }
  },
  { id: 6, category: 'Contrast', question: 'Which contrast level?',
    a: { label: 'Bold & Dramatic', image: null, gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 40%, #faf7f2 100%)' },
    b: { label: 'Soft & Dreamy', image: null, gradient: 'linear-gradient(135deg, #d4ccc3 0%, #e8e3dc 40%, #ede8e0 100%)' }
  },
  { id: 7, category: 'Film vs Digital', question: 'Which look do you prefer?',
    a: { label: 'Film Grain', image: null, gradient: 'linear-gradient(135deg, #b8a99a 0%, #c5bdb4 40%, #d4a574 100%)' },
    b: { label: 'Clean Digital', image: null, gradient: 'linear-gradient(135deg, #e8e3dc 0%, #faf7f2 50%, #c5d4be 100%)' }
  },
  { id: 8, category: 'Shadows', question: 'How should shadows look?',
    a: { label: 'Deep & Crushed', image: null, gradient: 'linear-gradient(135deg, #0a0a0a 0%, #2c2c2c 50%, #4a4a4a 100%)' },
    b: { label: 'Lifted & Open', image: null, gradient: 'linear-gradient(135deg, #d4ccc3 0%, #e8e3dc 50%, #faf7f2 100%)' }
  },
  { id: 9, category: 'Black & White', question: 'Black & white or color?',
    a: { label: 'Love B&W', image: null, gradient: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 40%, #d4d4d4 100%)' },
    b: { label: 'Keep It Color', image: null, gradient: 'linear-gradient(135deg, #6B7E62 0%, #c9a96e 40%, #C4826A 100%)' }
  },
  { id: 10, category: 'Palette', question: 'Which overall palette?',
    a: { label: 'Earth Tones', image: null, gradient: 'linear-gradient(135deg, #8B6914 0%, #C4826A 40%, #4a5d3f 100%)' },
    b: { label: 'Soft Pastels', image: null, gradient: 'linear-gradient(135deg, #e8d5cc 0%, #d4dfe8 40%, #e8e3dc 100%)' }
  }
]

// Q11-15: Feature questions
export const featureQuestions = [
  { id: 'aerial', question: 'Do you want aerial / drone photography?', type: 'yesno',
    options: ['Yes, definitely', "No, don't need it"] },
  { id: 'film', question: 'Do you want a film photography option?', type: 'yesno',
    options: ['Yes, I love film', 'No, digital is fine'] },
  { id: 'secondShooter', question: 'Do you want a second shooter?', type: 'select',
    options: ['Yes', 'No', "Don't know yet"] },
  { id: 'personality', question: 'What kind of photographer personality do you want?', type: 'select',
    options: ['Very hands-on and directive', 'Calm and unobtrusive', 'Hype / high-energy', 'Organized and structured', 'Fly-on-the-wall documentary'] },
  { id: 'hours', question: 'How many hours of coverage do you need?', type: 'select',
    options: ['4–6 hours', '6–8 hours', '8+ hours', 'Multiple days'] }
]

// Logistical questions (hard filters)
export const logisticalQuestions = [
  { id: 'location', type: 'location', title: 'Where is your wedding?', subtitle: "We'll match you with photographers who cover your area" },
  { id: 'date', type: 'date', title: 'When is your wedding?', subtitle: 'Approximate date is fine' },
  { id: 'budget', type: 'budget', title: "What's your photography budget?", subtitle: 'Approximate is fine — we filter by range', min: 1000, max: 15000, step: 500 },
  { id: 'guests', type: 'select', title: 'How many guests?', subtitle: 'This helps photographers prepare', options: ['Under 50', '50–100', '100–200', '200+'] }
]

// Style tags for photographer profiles (aligned with couple quiz)
export const styleTags = ['Traditional', 'Editorial', 'Candid / Documentary', 'Fine Art', 'Dark & Moody']

export const editingStyleTags = ['Warm', 'Cool', 'True to Life', 'Vibrant', 'Light & Airy']

export const specialtyTags = ['Elopements', 'Destination Weddings', 'Cultural Ceremonies', 'LGBTQ+ Weddings', 'Micro Weddings', 'Large Events (200+)', 'Engagement Sessions', 'Drone / Aerial']

export const addOnServices = ['Second Shooter', 'Engagement Session', 'Photo Album', 'Prints & Wall Art', 'Video / Hybrid', 'Photo Booth', 'Day-After Session', 'Rehearsal Coverage']

export const personalityTypes = ['Very hands-on and directive', 'Calm and unobtrusive', 'Hype / high-energy', 'Organized and structured', 'Fly-on-the-wall documentary']

export const coverageOptions = ['4–6 hours', '6–8 hours', '8+ hours', 'Multiple days']

export const travelRadiusOptions = [
  { value: '25', label: 'Local (25 mi / 40 km)' },
  { value: '50', label: '50 miles / 80 km' },
  { value: '100', label: '100 miles / 160 km' },
  { value: '150', label: '150 miles / 240 km' },
  { value: '250', label: '250 miles / 400 km' },
  { value: '500', label: '500 miles / 800 km' },
  { value: 'nationwide', label: 'Nationwide' },
  { value: 'anywhere', label: 'Anywhere / Worldwide' }
]

// Thinking break messages shown between sections
export const thinkingMessages = [
  { after: 3, lines: ['Analyzing your editing preferences...', 'You lean toward {editingSummary} tones'] },
  { after: 10, lines: ['Your style profile is taking shape...', 'Scanning photographer portfolios...', 'Refining your matches...'] }
]
