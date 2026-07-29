interface PersonIdentityFields {
  name: string
  company: string
  title: string
}

function normaliseText(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function canonicalizeIdentityUrl(value: string) {
  const url = new URL(value.trim())

  if (url.protocol !== 'https:') {
    throw new Error('Identity URLs must use HTTPS')
  }

  const host = url.hostname.toLowerCase()
  const isLinkedIn = host === 'linkedin.com' || host.endsWith('.linkedin.com')
  url.hostname = isLinkedIn ? 'www.linkedin.com' : host
  url.port = ''
  url.username = ''
  url.password = ''
  url.search = ''
  url.hash = ''

  const normalisedPath = url.pathname.replace(/\/+/g, '/').replace(/\/+$/, '')
  url.pathname = isLinkedIn ? normalisedPath.toLowerCase() : normalisedPath

  return url.toString().replace(/\/$/, '')
}

export async function generateMarketProfileId(trackSlug: string, identityUrl: string) {
  const canonicalUrl = canonicalizeIdentityUrl(identityUrl)
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(canonicalUrl),
  )
  const hash = [...new Uint8Array(digest)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 12)

  return `${normaliseText(trackSlug)}-${hash}`
}

export function canonicalPersonKey(record: PersonIdentityFields) {
  return [
    normaliseText(record.name),
    normaliseText(record.company),
    normaliseText(record.title),
  ].join('|')
}
