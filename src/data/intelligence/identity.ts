// Organization identity keys. Deliberately stricter than the talent-search
// alias table in companyNormalization.ts: that table folds subsidiaries into a
// parent for search convenience ("Discovery Bank" -> "Discovery"), which is
// right for browsing people but wrong for canonical company identity.

const LEGAL_TOKENS = new Set(['pty', 'ltd', 'limited', 'inc', 'incorporated', 'proprietary', 'bpk', 'plc', 'co'])
const GEO_SUFFIXES = [' south africa', ' sa', ' southern africa', ' za']

/** Comparable identity key: lowercase, '&' -> 'and', no punctuation, no legal or trailing geography suffix. */
export function organizationKey(name: string | null | undefined): string {
  if (!name) return ''
  let value = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\(south africa\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  value = value
    .split(' ')
    .filter((token) => token && !LEGAL_TOKENS.has(token))
    .join(' ')
  for (const suffix of GEO_SUFFIXES) {
    if (value.endsWith(suffix) && value.length > suffix.length + 2) value = value.slice(0, -suffix.length).trim()
  }
  return value
}

export function normaliseWebsite(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function domainOf(url: string | null | undefined): string | null {
  const website = normaliseWebsite(url)
  if (!website) return null
  try {
    return new URL(website).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return null
  }
}
