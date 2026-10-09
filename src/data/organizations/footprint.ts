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
  const numbers = parseNumbers(value)
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

function bandFromRevenue(turnover: number): { band: FootprintBand; basis: string } {
  const formatted = `R${turnover.toLocaleString()}`
  if (turnover >= 1_000_000_000) return { band: 'major-national', basis: `Sourced turnover of ${formatted}.` }
  if (turnover >= 100_000_000) return { band: 'large-multi-site', basis: `Sourced turnover of ${formatted}.` }
  if (turnover >= 10_000_000) return { band: 'regional-specialist', basis: `Sourced turnover of ${formatted}.` }
  return { band: 'smaller-emerging', basis: `Sourced turnover of ${formatted}.` }
}

/** Sector-specific measures that cannot be compared across industries. */
const SECTOR_SPECIFIC_METRICS = new Set(['pallet-positions', 'capacity'])

function deriveBand(organization: Organization): BandResult {
  const scale = organization.scale
  if (scale.length === 0) {
    return {
      ...NOT_ESTABLISHED,
      basis: 'No sourced scale measure is recorded for this company.',
      note: 'Record a sourced headcount, turnover, site count or comparable measure to classify this company.',
    }
  }

  let employees: number | null = null
  let sites: number | null = null
  let revenue: number | null = null
  const metricIds: string[] = []
  const sourceUrls: string[] = []
  const sectorSpecific: string[] = []
  let scope: ScaleEntityScope = 'not-stated'
  let scopeFrom: 'employees' | 'sites' | 'revenue' | null = null

  scale.forEach((entry, index) => {
    // Sector-specific capacity is recorded for its own sake and never banded:
    // 114,000 pallet positions and 980 MW say nothing comparable about reach
    // next to a headcount or a store count.
    if (SECTOR_SPECIFIC_METRICS.has(entry.metric)) {
      sectorSpecific.push(`${entry.metric}: ${entry.value}`)
      return
    }
    const value = comparableNumber(entry.metric, entry.value)
    if (value === null) {
      sectorSpecific.push(`${entry.metric}: ${entry.value}`)
      return
    }
    const entryScope = entityScopeOf(entry.value, entry.entityScope)
    if (entry.metric === 'employees' && value !== null && (employees === null || value > employees)) {
      employees = value
      scope = entryScope
      scopeFrom = 'employees'
      metricIds.push(scaleMetricId(organization.id, index))
      if (entry.sourceUrl) sourceUrls.push(entry.sourceUrl)
    }
    if (entry.metric === 'sites' && value !== null && (sites === null || value > sites)) {
      sites = value
      if (scopeFrom === null || scopeFrom === 'sites') {
        scope = entryScope
        scopeFrom = 'sites'
      }
      metricIds.push(scaleMetricId(organization.id, index))
      if (entry.sourceUrl) sourceUrls.push(entry.sourceUrl)
    }
    if (entry.metric === 'revenue' && value !== null && (revenue === null || value > revenue)) {
      revenue = value
      if (scopeFrom === null) {
        scope = entryScope
        scopeFrom = 'revenue'
      }
      metricIds.push(scaleMetricId(organization.id, index))
      if (entry.sourceUrl) sourceUrls.push(entry.sourceUrl)
    }
  })

  if (employees !== null) {
    const combination = sites !== null
    const derived = bandFromEmployees(employees, sites, scope)
    return {
      band: derived.band,
      kind: combination ? 'derived-metric-combination' : 'sourced-metric',
      basis: derived.basis,
      metricIds,
      sourceUrls,
      confidence: combination ? 'probable' : 'confirmed',
      entityScope: scope,
      note: scope === 'not-stated'
        ? 'The source does not state whether this figure covers the entity, a division or the group.'
        : '',
    }
  }

  if (sites !== null) {
    const derived = bandFromSites(sites, scope)
    return {
      band: derived.band,
      kind: 'sourced-metric',
      basis: derived.basis,
      metricIds,
      sourceUrls,
      confidence: 'probable',
      entityScope: scope,
      note: 'Site counts indicate reach, not headcount or revenue. Reviewed before being relied on.',
    }
  }

  if (revenue !== null) {
    const derived = bandFromRevenue(revenue)
    return {
      band: derived.band,
      kind: 'sourced-metric',
      basis: derived.basis,
      metricIds,
      sourceUrls,
      confidence: 'probable',
      entityScope: scope,
      note: 'Turnover is one proxy for reach and is shown separately from headcount.',
    }
  }

  return {
    ...NOT_ESTABLISHED,
    metricIds,
    sourceUrls,
    basis: sectorSpecific.length > 0
      ? `Only sector-specific measures are sourced (${sectorSpecific.join('; ')}).`
      : 'The recorded scale measures carry no comparable figure.',
    note: sectorSpecific.length > 0
      ? 'Sector-specific capacity cannot be compared across industries, so it does not assign a footprint band.'
      : 'Record a sourced headcount, turnover or site count to classify this company.',
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
