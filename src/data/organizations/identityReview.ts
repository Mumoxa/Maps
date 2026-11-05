// Identity review queue: what to do about employer names that look like a
// company the register already holds.
//
// The atlas contains two kinds of employer name: curated records, and names that
// only a Maps dataset mentions. When a dataset name closely resembles a curated
// company, three different things could be true, and only a reviewer can decide
// which:
//
//   same-identity      the name is the same company written differently
//                      ("Deloitte (South Africa)" vs "Deloitte")
//   parent-subsidiary  a real, separate entity inside a group, which deserves its
//                      own record plus a corporate relationship, not a merge
//                      ("Sasol Mining", "MTN Eswatini", "Old Mutual iWYZE")
//   needs-decision     the resemblance is real but the relationship is unclear
//                      ("SA Corporate Real Estate (previous); Concor (previous)")
//
// This module classifies the resemblance and explains its reasoning. It never
// merges anything: merging on a name similarity is how a recruiter ends up told
// that a candidate works at "Sasol" when the source said "Sasol Mining". The
// output is a queue for `scripts/atlas-identity-review.ts`, per step 11 of
// docs/national-employer-intelligence.md.

/** What a reviewer is being asked to decide. */
export type IdentityDisposition =
  | 'same-identity'
  | 'parent-subsidiary'
  | 'needs-decision'

export interface IdentityCandidate {
  /** The dataset-only employer name exactly as the source spells it. */
  datasetName: string
  /** People mapped to that spelling. */
  professionals: number
  /** The curated canonical name it resembles. */
  curatedName: string
  curatedId: string
  disposition: IdentityDisposition
  /** Why this disposition, in plain language. */
  reason: string
  /** The words left over once the curated name is removed, for the reviewer. */
  qualifier: string
}

/**
 * Qualifiers that indicate a separate legal or operating entity rather than a
 * different spelling. Kept as data so a reviewer adds a case here instead of the
 * classifier growing a hidden rule.
 */
export const SUBSIDIARY_QUALIFIERS: string[] = [
  // Countries and regions: a local operation is its own employing entity.
  'namibia', 'botswana', 'eswatini', 'swaziland', 'lesotho', 'zimbabwe', 'zambia',
  'mozambique', 'kenya', 'ghana', 'uganda', 'tanzania', 'rwanda', 'nigeria',
  'malawi', 'mauritius', 'angola', 'south africa', 'africa', 'middle east',
  'sub saharan africa', 'emea', 'apac',
  // Corporate divisions and brands.
  'cib', 'corporate investment banking', 'investment banking', 'corporate centre',
  'consulting', 'digital', 'technology', 'mining', 'property', 'properties',
  'alternative investments', 'investment group', 'wealth', 'insure', 'insurance',
  'bank', 'banking', 'fintech', 'payments', 'lending', 'lifestyle', 'nextech',
  'retail', 'logistics', 'energy', 'renewables', 'service centres', 'steel',
  'holdings', 'group', 'solutions', 'services', 'systems', 'manufacturing',
  'engineering', 'construction', 'projects', 'operations', 'distribution',
  // Divisional and geographic structure inside one group.
  'division', 'branch', 'regional', 'provincial',
  // Brand-specific sub-brands observed in the data.
  'iwyze', 'strategic solutions', 'frozen fish', 'foods', 'beverages',
]

/** Spelling and formatting noise that never indicates a separate entity. */
const SAME_IDENTITY_NOISE = [
  'limited', 'ltd', 'pty', 'inc', 'plc', 'proprietary', 'holdings limited',
  'sa', 'south africa', 'group limited', 'the', 'and', 'of', 'co', 'cc',
]

/** Employer strings that list a former employer must be reviewed, never merged. */
const HISTORY_MARKERS = /(?:previous|former|formerly|prior|background|history)\b/i

/**
 * Source strings that pack several employers, a role or the researcher's own
 * uncertainty into one value. These are never a single company name, so they can
 * neither be merged nor given a subsidiary record: a reviewer has to read the
 * underlying source and split it.
 */
const COMPOUND_SOURCE_MARKERS = /(?:\/|;|\bundetermined\b|\bunclear\b|\bto verify\b|\bverify\b|\bunconfirmed\b)/i

function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** True when `needle` appears in `haystack` on word boundaries. */
function containsPhrase(haystack: string, needle: string): boolean {
  if (!needle) return false
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`).test(haystack)
}

/** Remove a phrase once, leaving the surrounding words for the reviewer. */
function removePhrase(value: string, phrase: string): string {
  if (!phrase) return value
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return value.replace(new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`, 'i'), ' ').replace(/\s+/g, ' ').trim()
}

function stripNoise(value: string): string {
  let result = value
  for (const noise of SAME_IDENTITY_NOISE) {
    if (containsPhrase(result, noise)) result = removePhrase(result, noise)
  }
  return result.trim()
}

/**
 * Classify one resemblance.
 *
 * Returns null when the two names are not a plausible match at all, so the queue
 * only ever contains genuine candidates.
 */
export function classifyResemblance(
  datasetName: string,
  curatedName: string,
): { disposition: IdentityDisposition; reason: string; qualifier: string } | null {
  const dataset = normalise(datasetName)
  const curated = normalise(curatedName)
  if (!dataset || !curated || dataset === curated) return null
  if (!containsPhrase(dataset, curated)) return null

  const qualifier = removePhrase(dataset, curated)

  // A packed source string is not one company name in the first place.
  if (COMPOUND_SOURCE_MARKERS.test(datasetName)) {
    return {
      disposition: 'needs-decision',
      reason: 'the source string packs several employers, a role or an unresolved note into one value, so it must be split against the underlying source rather than matched',
      qualifier,
    }
  }

  // A former-employer note is a career statement, not an identity claim.
  if (HISTORY_MARKERS.test(datasetName)) {
    return {
      disposition: 'needs-decision',
      reason: 'the source string names a former employer or history, so it describes a career move rather than a current identity',
      qualifier,
    }
  }

  const cleaned = stripNoise(qualifier)
  if (cleaned === '') {
    return {
      disposition: 'same-identity',
      reason: 'the only difference is spelling or a legal suffix, so this is the same company written differently',
      qualifier,
    }
  }

  for (const marker of SUBSIDIARY_QUALIFIERS) {
    if (containsPhrase(cleaned, marker)) {
      return {
        disposition: 'parent-subsidiary',
        reason: `"${marker}" marks a separate operating entity or division, so it needs its own record and a corporate relationship rather than a merge`,
        qualifier: cleaned,
      }
    }
  }

  return {
    disposition: 'needs-decision',
    reason: `"${cleaned}" does not identify a different entity on its own, but nor is it only a spelling difference`,
    qualifier: cleaned,
  }
}

export interface ResemblanceInput {
  datasetName: string
  professionals: number
  curated: { id: string; name: string }[]
}

/**
 * One curated record that resembles another. This is a more serious finding than
 * a dataset name resembling a company: two curated records means the register
 * holds the same company twice, and a recruiter can see two dossiers for it.
 */
export interface CuratedPairCandidate {
  /** The shorter, presumed canonical name. */
  canonicalName: string
  canonicalId: string
  /** The longer name, presumed a duplicate or a division. */
  otherName: string
  otherId: string
  disposition: IdentityDisposition
  reason: string
  qualifier: string
  /** People mapped to each record, so the reviewer can see the impact. */
  canonicalProfessionals: number
  otherProfessionals: number
}

/**
 * Curated records whose names nest. Only same-identity pairs are safe to merge;
 * a pair where the longer name adds a division, brand or place is reported as a
 * separate entity, because "Old Mutual" and "Old Mutual Finance" are two
 * different employers and merging them would move real people to the wrong one.
 */
export function findCuratedPairs(
  organizations: { id: string; name: string; professionals: number }[],
): CuratedPairCandidate[] {
  const pairs: CuratedPairCandidate[] = []
  const seen = new Set<string>()
  for (const canonical of organizations) {
    for (const other of organizations) {
      if (canonical.id === other.id) continue
      // Only one direction: the shorter name is the presumed canonical one.
      if (canonical.name.length >= other.name.length) continue
      const key = `${canonical.id}|${other.id}`
      if (seen.has(key)) continue
      const match = classifyResemblance(other.name, canonical.name)
      if (!match || match.disposition === 'needs-decision') continue
      seen.add(key)
      pairs.push({
        canonicalName: canonical.name,
        canonicalId: canonical.id,
        otherName: other.name,
        otherId: other.id,
        ...match,
        canonicalProfessionals: canonical.professionals,
        otherProfessionals: other.professionals,
      })
    }
  }
  return pairs.sort((left, right) => (
    Number(right.disposition === 'same-identity') - Number(left.disposition === 'same-identity')
    || (right.canonicalProfessionals + right.otherProfessionals) - (left.canonicalProfessionals + left.otherProfessionals)
  ))
}

/**
 * Build the review queue: every dataset name that resembles a curated company,
 * each with its disposition. Longest curated match wins, so "Pepkor Payments and
 * Lending" is reviewed against "Pepkor" once rather than against every Pepkor
 * record.
 */
export function buildIdentityQueue(input: ResemblanceInput[]): IdentityCandidate[] {
  const curatedByLength = [...input[0]?.curated ?? []].sort((left, right) => right.name.length - left.name.length)
  const queue: IdentityCandidate[] = []

  for (const row of input) {
    for (const curated of curatedByLength) {
      const match = classifyResemblance(row.datasetName, curated.name)
      if (!match) continue
      queue.push({
        datasetName: row.datasetName,
        professionals: row.professionals,
        curatedName: curated.name,
        curatedId: curated.id,
        ...match,
      })
      break
    }
  }

  return queue.sort((left, right) => (
    right.professionals - left.professionals
    || left.disposition.localeCompare(right.disposition)
    || left.datasetName.localeCompare(right.datasetName)
  ))
}

/** Headline counts, so the backlog is a number rather than an impression. */
export function summariseIdentityQueue(queue: IdentityCandidate[]): {
  total: number
  professionals: number
  byDisposition: Record<IdentityDisposition, number>
} {
  const byDisposition: Record<IdentityDisposition, number> = {
    'same-identity': 0,
    'parent-subsidiary': 0,
    'needs-decision': 0,
  }
  for (const entry of queue) byDisposition[entry.disposition] += 1
  return {
    total: queue.length,
    professionals: queue.reduce((total, entry) => total + entry.professionals, 0),
    byDisposition,
  }
}
