// Indicative Market Footprint.
//
// The Industry Atlas needs to group companies so an industry's composition is
// readable at a glance. It must not do that by inventing a size ranking, so this
// module defines one explicitly approximate classification and keeps it
// structurally separate from fact:
//
//   - `OrganizationScale`            the sourced measurement, verbatim
//   - `ScaleBand` (taxonomy)         the statutory / banking band
//   - `FootprintClassification`      this: an indicative band with its basis
//
// Rules that keep it honest:
//   1. A band is only assigned from a sourced numeric metric. No name, brand or
//      familiarity signal is ever consulted.
//   2. Sector-specific metrics (pallet positions, MW, tonnage) are NOT comparable
//      across industries, so they never assign a band on their own.
//   3. Where the source does not state which entity a figure covers, the scope is
//      `not-stated`, never defaulted to the standalone company.
//   4. A figure scoped to one operating division cannot promote a company to the
//      widest band, because a division is not the group.
//   5. No signal means `not-established`. Unknown is never rendered as small.
//   6. Every derived band is `pending-review` until a human has reviewed it.

import reviewsRaw from '../../../markets/organizations/footprint-reviews.json'
import type { OrganizationIndex } from './load'
import type {
  Confidence,
  FootprintBand,
  FootprintClassification,
  FootprintClassificationKind,
  FootprintReview,
  Organization,
  OrganizationScale,
  ScaleEntityScope,
} from './types'

/** Widest reach first. Rendering order is this order, always. */
export const FOOTPRINT_BANDS: FootprintBand[] = [
  'major-national',
  'large-multi-site',
  'regional-specialist',
  'smaller-emerging',
  'not-established',
]

export const FOOTPRINT_LABELS: Record<FootprintBand, string> = {
  'major-national': 'Major national / multinational enterprise',
  'large-multi-site': 'Large or multi-site operator',
  'regional-specialist': 'Regional or established specialist operator',
  'smaller-emerging': 'Smaller or emerging operator',
  'not-established': 'Footprint not established',
}

export const FOOTPRINT_SHORT_LABELS: Record<FootprintBand, string> = {
  'major-national': 'Major national',
  'large-multi-site': 'Large / multi-site',
  'regional-specialist': 'Regional specialist',
  'smaller-emerging': 'Smaller / emerging',
  'not-established': 'Not established',
}

/** Human labels keep operating measures distinct in every dossier surface. */
export const SCALE_METRIC_LABELS: Record<OrganizationScale['metric'], string> = {
  employees: 'Employees',
  'total-workforce': 'Total workforce (including indirect employees)',
  revenue: 'Revenue / contract revenue',
  'order-book': 'Current order book',
  'work-in-hand': 'Work in hand',
  'completed-projects': 'Completed projects',
  'completed-contract-value': 'Completed contract value (cumulative)',
  'homes-delivered': 'Homes delivered (cumulative)',
  sites: 'Operating sites / offices',
  'pallet-positions': 'Pallet positions',
  capacity: 'Capacity',
}

/**
 * What each band means in words. Shown wherever a band is rendered, because a
 * band that cannot explain itself is a ranking pretending to be a fact.
 */
export const FOOTPRINT_DEFINITIONS: Record<FootprintBand, string> = {
  'major-national': 'Evidence of national or multinational operating reach: a large sourced headcount, or a very large multi-site footprint.',
  'large-multi-site': 'Evidence of substantial scale or several operating sites, without national-coverage evidence.',
  'regional-specialist': 'Evidence of an established operation with a regional or specialist footprint.',
  'smaller-emerging': 'Sourced evidence indicates a small operation.',
  'not-established': 'No comparable sourced measure is available. This is missing research, not a small company.',
}

/**
 * Human reviewer corrections. Empty by default: nothing is asserted without a
 * reviewer, and an empty list is the honest state rather than a gap to fill.
 */
export const footprintReviews: FootprintReview[] = Array.isArray(reviewsRaw)
  ? reviewsRaw
  : (reviewsRaw.reviews ?? [])

export const FOOTPRINT_METRIC_PREFIX = 'scale'

/** Stable id for one sourced scale record, so a classification cites its inputs. */
export function scaleMetricId(organizationId: string, index: number): string {
  return `${organizationId}:${FOOTPRINT_METRIC_PREFIX}:${index}`
}

// --- Parsing ----------------------------------------------------------------

/** Site-ish nouns. A bare number next to one of these counts as a site. */
const SITE_NOUNS = /\b(branch|branches|store|stores|site|sites|property|properties|plant|plants|mill|mills|facility|facilities|development|developments|centre|centers|depot|depots|warehouse|warehouses|outlet|outlets|farm|farms|hub|hubs|premises|operations|clinic|clinics|hotel|hotels)\b/
/** Units that make a number a capacity measure rather than a countable site. */
const CAPACITY_UNITS = /\b(ton|tons|tonne|tonnes|mw|mwh|gw|kg|litre|litres|liter|liters|metre|metres|meter|meters|cubic|hectare|hectares|vehicle|vehicles|truck|trucks)\b/

function parseNumbers(value: string): number[] {
  const matches = value.replace(/,/g, '').match(/\d+(?:\.\d+)?/g)
  return matches ? matches.map(Number).filter((entry) => Number.isFinite(entry)) : []
}

/**
 * Parse Rand-denominated measures with their actual order of magnitude.
 * Revenue is deliberately restricted to R/ZAR: an A$ or US$ figure must not be
 * silently treated as Rand and compared against the thresholds below.
 */
function parseRandNumbers(value: string): number[] {
  const expression = /(?:\bZAR\s*|\bR\s*)(\d[\d,]*(?:\.\d+)?)\s*(billion|bn|million|m|thousand|k)?/gi
  const multipliers: Record<string, number> = {
    billion: 1_000_000_000,
    bn: 1_000_000_000,
    million: 1_000_000,
    m: 1_000_000,
    thousand: 1_000,
    k: 1_000,
  }
  const numbers: number[] = []
  for (const match of value.matchAll(expression)) {
    const amount = Number(match[1].replace(/,/g, ''))
    const multiplier = multipliers[(match[2] ?? '').toLowerCase()] ?? 1
    if (Number.isFinite(amount)) numbers.push(amount * multiplier)
  }
  return numbers
}

/**
 * The comparable figure behind one scale record, or null.
 *
 * Ranges resolve to the LOWER bound: a source that says "51-200 employees" is
 * evidence of at least 51, and banding on the upper bound would overstate what
 * was read.
 */
function comparableNumber(metric: OrganizationScale['metric'], value: string): number | null {
  const haystack = value.toLowerCase()
  if (CAPACITY_UNITS.test(haystack)) {
    // "Storage and grading capacity of 35,000 metric tons" is filed under `sites`
    // in one existing record; the unit makes it a capacity measure, and capacity
    // is not comparable across sectors, so it cannot assign a band.
    if (metric === 'sites') return null
  }
  const numbers = metric === 'revenue' ? parseRandNumbers(value) : parseNumbers(value)
  if (numbers.length === 0) return null
  if (metric === 'sites' && !SITE_NOUNS.test(haystack)) return null
  if (metric === 'sites') return Math.max(...numbers)
  // Two or more distinct numbers in a non-site record is a range or a list; the
  // conservative reading is the smallest figure the source actually states.
  return Math.min(...numbers)
}

/**
 * Which entity the figure covers, taken only from what the source says.
 * Absent language means `not-stated`, which the UI renders as unknown.
 */
function entityScopeOf(value: string, declared: ScaleEntityScope | undefined): ScaleEntityScope {
  if (declared) return declared
  const haystack = value.toLowerCase()
  if (/in south africa|south african operation|sa operation/.test(haystack)) return 'south-african-operation'
  if (/\bgroup\b/.test(haystack)) return 'consolidated-group'
  if (/facility|division|business unit|\bplant\b/.test(haystack)) return 'operating-division'
  return 'not-stated'
}

export const ENTITY_SCOPE_LABELS: Record<ScaleEntityScope, string> = {
  'consolidated-group': 'Consolidated group',
  'south-african-operation': 'South African operation',
  'operating-division': 'Operating division or facility',
  'standalone-entity': 'Standalone entity',
  'not-stated': 'Not stated by the source',
}

// --- Banding ----------------------------------------------------------------

interface BandResult {
  band: FootprintBand
  kind: FootprintClassificationKind
  basis: string
  metricIds: string[]
  sourceUrls: string[]
  confidence: Confidence
  entityScope: ScaleEntityScope
  note: string
}

const NOT_ESTABLISHED: Omit<BandResult, 'basis' | 'note'> = {
  band: 'not-established',
  kind: 'unclassified',
  metricIds: [],
  sourceUrls: [],
  confidence: 'unknown',
  entityScope: 'not-stated',
}

function bandFromEmployees(
  employees: number,
  sites: number | null,
  scope: ScaleEntityScope,
): { band: FootprintBand; basis: string } {
  // A division-level headcount is a floor on the group, not the group's size, so
  // it can never by itself establish national reach.
  const divisionCapped = scope === 'operating-division'
  if (employees >= 5000) {
    return divisionCapped
      ? { band: 'large-multi-site', basis: `Sourced headcount of ${employees.toLocaleString()}, but the figure is scoped to one operating division, so national reach is not established from it.` }
      : { band: 'major-national', basis: `Sourced headcount of ${employees.toLocaleString()} indicates national or multinational operating reach.` }
  }
  if (employees >= 1000) {
    return { band: 'large-multi-site', basis: `Sourced headcount of ${employees.toLocaleString()}.` }
  }
  if (employees >= 200) {
    return sites !== null && sites >= 4
      ? { band: 'large-multi-site', basis: `Sourced headcount of ${employees.toLocaleString()} across ${sites} evidenced sites.` }
      : { band: 'regional-specialist', basis: `Sourced headcount of ${employees.toLocaleString()}.` }
  }
  if (employees >= 50) {
    return { band: 'regional-specialist', basis: `Sourced headcount of ${employees.toLocaleString()}.` }
  }
  return { band: 'smaller-emerging', basis: `Sourced headcount of ${employees.toLocaleString()}.` }
}

function bandFromSites(sites: number, scope: ScaleEntityScope): { band: FootprintBand; basis: string } {
  const suffix = scope === 'operating-division' ? ' (figures scoped to one operating division)' : ''
  if (sites >= 50) return { band: 'major-national', basis: `${sites} evidenced operating sites${suffix}.` }
  if (sites >= 10) return { band: 'large-multi-site', basis: `${sites} evidenced operating sites${suffix}.` }
  if (sites >= 3) return { band: 'regional-specialist', basis: `${sites} evidenced operating sites${suffix}.` }
  return { band: 'smaller-emerging', basis: `${sites} evidenced operating site${sites === 1 ? '' : 's'}${suffix}.` }
}

function bandFromRevenue(turnover: number, upperBoundOnly = false): { band: FootprintBand; basis: string } {
  const formatted = `R${turnover.toLocaleString()}`
  // An upper-only bound is not a lower-bound turnover. It is useful only when
  // every value below it remains in the smallest band; broader upper bounds are
  // rejected before reaching this function.
  if (upperBoundOnly) {
    return { band: 'smaller-emerging', basis: `Sourced turnover below ${formatted} (upper-bound estimate).` }
  }
  if (turnover >= 1_000_000_000) return { band: 'major-national', basis: `Sourced turnover of ${formatted}.` }
  if (turnover >= 100_000_000) return { band: 'large-multi-site', basis: `Sourced turnover of ${formatted}.` }
  if (turnover >= 10_000_000) return { band: 'regional-specialist', basis: `Sourced turnover of ${formatted}.` }
  return { band: 'smaller-emerging', basis: `Sourced turnover of ${formatted}.` }
}

/** Sector-specific measures that cannot be compared across industries. */
const SECTOR_SPECIFIC_METRICS = new Set(['pallet-positions', 'capacity'])
/** Useful operating intelligence, but not a proxy for headcount or annual revenue. */
const CONTEXT_ONLY_METRICS = new Set([
  'total-workforce',
  'order-book',
  'work-in-hand',
  'completed-projects',
  'completed-contract-value',
  'homes-delivered',
])

interface ComparableCandidate {
  entry: OrganizationScale
  index: number
  value: number
  scope: ScaleEntityScope
  upperBoundOnly: boolean
}

function isRevenueUpperBoundOnly(metric: OrganizationScale['metric'], value: string): boolean {
  if (metric !== 'revenue') return false
  // Deliberately recognise only a strict upper bound at the start of the
  // measure. Lower-bounded ranges such as "R1m but less than R10m" keep their
  // stated R1m floor and are handled by the ordinary range parser.
  return /^(?:less\s+than|below|under|<)\s*(?:zar|r)\s*\d/i.test(value.trim())
}

function metricDateKey(asOf: string): string {
  // ISO dates sort lexicographically. Undated measures sort before dated ones,
  // even when the text also records when the undated source was checked.
  if (/not stated|undated/i.test(asOf)) return ''
  return asOf.match(/\d{4}(?:-\d{2}(?:-\d{2})?)?/)?.[0] ?? ''
}

/**
 * Prefer a primary measure over an estimate, then the latest metric date, then
 * the higher lower-bound value. This prevents an old directory estimate from
 * overriding a newer audited headcount merely because its number is larger.
 */
function preferCandidate(current: ComparableCandidate | null, incoming: ComparableCandidate): ComparableCandidate {
  if (!current) return incoming
  const currentPrimary = current.entry.basis === 'source-reported' ? 1 : 0
  const incomingPrimary = incoming.entry.basis === 'source-reported' ? 1 : 0
  if (incomingPrimary !== currentPrimary) return incomingPrimary > currentPrimary ? incoming : current
  const dateOrder = metricDateKey(incoming.entry.asOf).localeCompare(metricDateKey(current.entry.asOf))
  if (dateOrder !== 0) return dateOrder > 0 ? incoming : current
  return incoming.value > current.value ? incoming : current
}

function evidenceFor(organization: Organization, candidates: ComparableCandidate[]) {
  return {
    metricIds: candidates.map((candidate) => scaleMetricId(organization.id, candidate.index)),
    sourceUrls: [...new Set(candidates.map((candidate) => candidate.entry.sourceUrl).filter(Boolean))],
  }
}

function deriveBand(organization: Organization): BandResult {
  const scale = organization.scale
  if (scale.length === 0) {
    return {
      ...NOT_ESTABLISHED,
      basis: 'No sourced scale measure is recorded for this company.',
      note: 'Record a sourced headcount, turnover, site count or comparable measure to classify this company.',
    }
  }

  let employees: ComparableCandidate | null = null
  let sites: ComparableCandidate | null = null
  let revenue: ComparableCandidate | null = null
  const sectorSpecific: string[] = []
  const contextual: string[] = []

  for (const [index, entry] of scale.entries()) {
    // Capacity and delivered-output measures are recorded for their own sake.
    // They are never converted into an invented headcount or annual revenue.
    if (SECTOR_SPECIFIC_METRICS.has(entry.metric)) {
      sectorSpecific.push(`${entry.metric}: ${entry.value}`)
      continue
    }
    if (CONTEXT_ONLY_METRICS.has(entry.metric)) {
      contextual.push(`${entry.metric}: ${entry.value}`)
      continue
    }
    if (entry.metric === 'sites' && CAPACITY_UNITS.test(entry.value.toLowerCase())) {
      sectorSpecific.push(`${entry.metric}: ${entry.value}`)
      continue
    }
    const value = comparableNumber(entry.metric, entry.value)
    if (value === null) continue
    const upperBoundOnly = isRevenueUpperBoundOnly(entry.metric, entry.value)
    // "Below R10m" guarantees the smallest band; "below R25m" does not,
    // because the actual figure could fall on either side of the R10m threshold.
    if (upperBoundOnly && value > 10_000_000) continue
    const candidate: ComparableCandidate = {
      entry,
      index,
      value,
      scope: entityScopeOf(entry.value, entry.entityScope),
      upperBoundOnly,
    }
    if (entry.metric === 'employees') employees = preferCandidate(employees, candidate)
    if (entry.metric === 'sites') sites = preferCandidate(sites, candidate)
    if (entry.metric === 'revenue') revenue = preferCandidate(revenue, candidate)
  }

  if (employees) {
    // Only combine figures that describe the same entity perimeter. A divisional
    // site count must not inflate a consolidated-group headcount, or vice versa.
    const compatibleSites = sites && sites.scope === employees.scope ? sites : null
    const derived = bandFromEmployees(employees.value, compatibleSites?.value ?? null, employees.scope)
    const evidence = evidenceFor(organization, [employees, ...(compatibleSites ? [compatibleSites] : [])])
    const measureConfidence = employees.entry.confidence
      ?? (employees.entry.basis === 'third-party-estimate' || employees.scope === 'not-stated' ? 'probable' : 'confirmed')
    return {
      band: derived.band,
      kind: compatibleSites ? 'derived-metric-combination' : 'sourced-metric',
      basis: derived.basis,
      ...evidence,
      confidence: compatibleSites ? 'probable' : measureConfidence,
      entityScope: employees.scope,
      note: employees.scope === 'not-stated'
        ? 'The source does not state whether this figure covers the entity, a division or the group.'
        : '',
    }
  }

  if (sites) {
    const derived = bandFromSites(sites.value, sites.scope)
    return {
      band: derived.band,
      kind: 'sourced-metric',
      basis: derived.basis,
      ...evidenceFor(organization, [sites]),
      confidence: sites.entry.confidence ?? 'probable',
      entityScope: sites.scope,
      note: 'Site counts indicate reach, not headcount or revenue. Reviewed before being relied on.',
    }
  }

  if (revenue) {
    const derived = bandFromRevenue(revenue.value, revenue.upperBoundOnly)
    return {
      band: derived.band,
      kind: 'sourced-metric',
      basis: derived.basis,
      ...evidenceFor(organization, [revenue]),
      confidence: revenue.entry.confidence ?? 'probable',
      entityScope: revenue.scope,
      note: 'Turnover is one proxy for reach and is shown separately from headcount.',
    }
  }

  const basis = sectorSpecific.length > 0 && contextual.length === 0
    ? `Only sector-specific measures are sourced (${sectorSpecific.join('; ')}).`
    : contextual.length > 0 && sectorSpecific.length === 0
      ? `Only contextual operating measures are sourced (${contextual.join('; ')}).`
      : sectorSpecific.length > 0 || contextual.length > 0
        ? `Only non-comparable operating measures are sourced (${[...sectorSpecific, ...contextual].join('; ')}).`
        : 'The recorded scale measures carry no comparable figure.'
  return {
    ...NOT_ESTABLISHED,
    basis,
    note: sectorSpecific.length > 0 && contextual.length === 0
      ? 'Sector-specific capacity cannot be compared across industries, so it does not assign a footprint band.'
      : contextual.length > 0
        ? 'Order books, total workforce and delivered output remain visible as operating intelligence; they are not converted into headcount, annual revenue or a footprint band.'
        : 'Record a sourced headcount, Rand-denominated turnover or site count to classify this company.',
  }
}

// --- Public API -------------------------------------------------------------

const reviewsByOrganization = new Map<string, FootprintReview>()
for (const review of footprintReviews) {
  if (review && typeof review.organizationId === 'string') {
    reviewsByOrganization.set(review.organizationId, review)
  }
}

/** The reviewer's correction, when one has been recorded for this company. */
export function footprintReviewFor(organizationId: string): FootprintReview | undefined {
  return reviewsByOrganization.get(organizationId)
}

/**
 * A reviewer correction replaces the derived band but never edits the source
 * facts: the sourced metrics stay exactly as read, and the correction carries
 * its own reviewer, date and evidence note.
 */
function applyReview(organization: Organization, derived: BandResult): FootprintClassification {
  const review = reviewsByOrganization.get(organization.id)
  if (review) {
    return {
      organizationId: organization.id,
      band: review.band,
      classificationKind: review.classificationKind,
      basis: review.basis,
      supportingMetricIds: derived.metricIds,
      evidenceReferences: derived.sourceUrls,
      confidence: review.confidence,
      reviewStatus: 'reviewed',
      reviewedBy: review.reviewedBy,
      reviewedOn: review.reviewedOn,
      entityScope: review.entityScope,
      note: `Human-reviewed indicative classification. Derived reading, kept for audit: ${derived.band} — ${derived.basis}`,
    }
  }
  return {
    organizationId: organization.id,
    band: derived.band,
    classificationKind: derived.kind,
    basis: derived.basis,
    supportingMetricIds: derived.metricIds,
    evidenceReferences: derived.sourceUrls,
    confidence: derived.confidence,
    reviewStatus: derived.band === 'not-established' ? 'unreviewed' : 'pending-review',
    reviewedBy: '',
    reviewedOn: '',
    entityScope: derived.entityScope,
    note: derived.note,
  }
}

const classificationCache = new Map<string, FootprintClassification>()

/**
 * The indicative footprint classification for one company. Cached, because the
 * atlas renders the whole universe and every render would otherwise re-parse
 * every scale string.
 */
export function classifyFootprint(organization: Organization): FootprintClassification {
  const cached = classificationCache.get(organization.id)
  if (cached) return cached
  const classification = applyReview(organization, deriveBand(organization))
  classificationCache.set(organization.id, classification)
  return classification
}

export function footprintFor(index: OrganizationIndex, organizationId: string): FootprintClassification {
  const organization = index.byId.get(organizationId)
  if (organization) return classifyFootprint(organization)
  return {
    organizationId,
    band: 'not-established',
    classificationKind: 'unclassified',
    basis: 'Maps holds no curated company record for this employer, so no scale measure has been read.',
    supportingMetricIds: [],
    evidenceReferences: [],
    confidence: 'unknown',
    reviewStatus: 'unreviewed',
    reviewedBy: '',
    reviewedOn: '',
    entityScope: 'not-stated',
    note: 'This employer is known only from a Maps dataset; classify it once a curated record exists.',
  }
}

export function footprintBandOf(index: OrganizationIndex, organizationId: string): FootprintBand {
  return footprintFor(index, organizationId).band
}

/** Company counts per band, in `FOOTPRINT_BANDS` order. */
export function footprintCounts(organizations: Organization[]): { band: FootprintBand; count: number }[] {
  const counts = new Map<FootprintBand, number>()
  for (const organization of organizations) {
    const band = classifyFootprint(organization).band
    counts.set(band, (counts.get(band) ?? 0) + 1)
  }
  return FOOTPRINT_BANDS.map((band) => ({ band, count: counts.get(band) ?? 0 }))
}

/** True when a band carries an actual evidenced classification. */
export function isEstablishedBand(band: FootprintBand): boolean {
  return band !== 'not-established'
}
