export function useSEO({ title, description, path, ogImage }) {
  const fullTitle = title ? `${title} | WedChem` : 'WedChem — Find Your Perfect Wedding Photographer'
  const desc = description || 'WedChem matches you with wedding photographers based on visual style chemistry. Take our free 3-minute quiz.'
  const url = `https://wedchem.com${path || ''}`
  const image = ogImage || 'https://wedchem.com/og-image.png'

  document.title = fullTitle

  setMeta('description', desc)
  setMeta('og:title', fullTitle, 'property')
  setMeta('og:description', desc, 'property')
  setMeta('og:url', url, 'property')
  setMeta('og:image', image, 'property')
  setMeta('twitter:title', fullTitle, 'name')
  setMeta('twitter:description', desc, 'name')
  setLink('canonical', url)
}

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}
