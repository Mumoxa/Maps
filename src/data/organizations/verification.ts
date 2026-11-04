// The company-dossier standard, in one place.
//
// Two different things are measured here, and conflating them is what makes a
// company directory untrustworthy:
//
//   1. **Coverage standard** — the 13 fields every dossier should eventually
//      carry. A gap is missing research, never a negative finding about the
//      company.
//   2. **Verification gate** — the narrower, non-negotiable subset that must be
//      true before `status: verified` may be written at all. Promotion is a
//      decision with a gate, not a label a batch can set for itself.
//
// Both the importer and the coverage ledger call this module, so the standard
// the build enforces and the standard the ledger reports can never drift apart.

import type { Organization } from './types'

/** The 13 dossier fields, in reading order, with why each one exists. */
export interface StandardField {
  key: StandardCheckKey
  label: string
  rationale: string
}

export type StandardCheckKey =
  | 'identityNamed'
  | 'website'
  | 'legalName'
  | 'aliases'
  | 'classified'
  | 'taxonomyPlacement'
  | 'sourced'
  | 'fresh'
  | 'located'
  | 'scale'
  | 'footprint'
  | 'capabilities'
  | 'relationships'

export const STANDARD_FIELDS: StandardField[] = [
  { key: 'identityNamed', label: 'Named identity', rationale: 'A canonical name is the minimum a dossier can carry.' },
  { key: 'website', label: 'Official website', rationale: 'The primary source for verifying what the company actually does.' },
  { key: 'legalName', label: 'Legal entity name', rationale: 'Separates the trading brand from the registered entity.' },
  { key: 'aliases', label: 'Recorded aliases', rationale: 'Lets dataset spellings resolve to one company instead of several.' },
  { key: 'classified', label: 'Industry classification', rationale: 'A company with no industry cannot be found by sector.' },
  { key: 'taxonomyPlacement', label: 'National taxonomy placement', rationale: 'Places the company in the 731-node sector tree.' },
  { key: 'sourced', label: 'At least one evidence source', rationale: 'No claim about the company without a source and a checked date.' },
  { key: 'fresh', label: 'Verification within 180 days', rationale: 'A stale dossier is presented as current when it is not.' },
  { key: 'located', label: 'Sourced operating location', rationale: 'Province is the recruiter\u2019s first geographic filter.' },
  { key: 'scale', label: 'Sourced scale measure', rationale: 'Headcount, revenue or sites, verbatim and dated.' },
  { key: 'footprint', label: 'Established footprint band', rationale: 'Lets an industry be read by company size without inventing one.' },
  { key: 'capabilities', label: 'Evidenced capability', rationale: 'What the company actually operates, not just its sector.' },
  { key: 'relationships', label: 'Corporate relationship', rationale: 'Group and subsidiary structure, so headcount is never double-counted.' },
]

/** Verification older than this is reported as stale rather than current. */
export const STALE_AFTER_DAYS = 180

export type StandardChecks = Record<StandardCheckKey, boolean>

export interface StandardInput {
  organization: Organization
  /** True when the company has any recorded taxonomy node (direct or via industry). */
  hasPlacement: boolean
  /** True when an evidenced footprint band exists. */
  footprintEstablished: boolean
  /** True when the company appears in a recorded corporate relationship. */
  hasRelationship: boolean
  /** Reference date, so tests stay deterministic. */
  today: string
}

function daysSince(from: string, today: string): number {
  const start = new Date(from).getTime()
  const end = new Date(today).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return Number.POSITIVE_INFINITY
  return Math.round((end - start) / 86_400_000)
}

/** Measure one company against the 13 standard fields. Pure. */
export function standardChecks(input: StandardInput): StandardChecks {
  const { organization } = input
  return {
    identityNamed: organization.name.trim() !== '',
    website: organization.website.trim() !== '',
    legalName: organization.legalName.trim() !== '',
    aliases: organization.aliases.length > 0,
    classified: organization.industries.length > 0 || input.hasPlacement,
    taxonomyPlacement: input.hasPlacement,
    sourced: organization.sources.some((source) => source.url.trim() !== '' && source.checkedOn.trim() !== ''),
    fresh: organization.lastVerified !== '' && daysSince(organization.lastVerified, input.today) <= STALE_AFTER_DAYS,
    located: organization.locations.some((location) => location.province.trim() !== ''),
    scale: organization.scale.length > 0,
    footprint: input.footprintEstablished,
    capabilities: organization.capabilities.some((link) => link.status === 'observed'),
    relationships: input.hasRelationship,
  }
}

/** What is still missing, in reading order. Empty means the dossier is complete. */
export function missingStandardFields(checks: StandardChecks): StandardField[] {
  return STANDARD_FIELDS.filter((field) => !checks[field.key])
}

// ---------------------------------------------------------------------------
// Verification gate
// ---------------------------------------------------------------------------

/**
 * What must be true before `status: verified` may be written.
 *
 * Deliberately narrower than the 13-field standard: a company can be genuinely
 * verified while its headcount is still unresearched. But it cannot be verified
 * without a citable identity, a defensible classification, a located operation
 * and a dated source for each. Every one of these is checkable from the record.
 */
export interface VerificationGateResult {
  eligible: boolean
  /** Field keys that block promotion, in the order the importer reports them. */
  missing: string[]
  /** One line per blocker, suitable for an import issue. */
  reasons: string[]
}

export interface VerificationGateInput {
  organization: Organization
  /** True when the company has direct taxonomy placement or an industry link. */
  hasPlacement: boolean
}

/**
 * Evaluate the gate against a record as it would be written.
 *
 * This is the single definition of "verified" in the codebase. A batch cannot
 * claim it, and the status cannot be set by hand without passing here.
 */
export function verificationGate(input: VerificationGateInput): VerificationGateResult {
  const { organization } = input
  const reasons: string[] = []
  const missing: string[] = []

  const block = (key: string, reason: string) => {
    missing.push(key)
    reasons.push(reason)
  }

  if (organization.website.trim() === '') {
    block('website', 'no official website recorded; identity cannot be confirmed from a primary source')
  }
  if (!organization.sources.some((source) => source.url.trim() !== '' && source.checkedOn.trim() !== '' && source.evidence.trim() !== '')) {
    block('sourced', 'no evidence source with a URL, a checked date and a statement of what it supports')
  }
  if (!input.hasPlacement) {
    block('classified', 'no industry or national-taxonomy placement, so the company cannot be mapped')
  }
  if (!organization.locations.some((location) => location.province.trim() !== '')) {
    block('located', 'no sourced operating location')
  }

  return { eligible: missing.length === 0, missing, reasons }
}
