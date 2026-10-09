// Canonical company-intelligence contracts.
//
// These types are the shared vocabulary for the Company Association Explorer,
// the global company directory, Search Bank target selection and the research
// export contract. Four different ideas are deliberately kept separate here,
// because collapsing them is what produces bad recruitment recommendations:
//
//   1. Factual company attributes  -> Organization + OrganizationCapability
//   2. Factual company relationships -> OrganizationRelationship (corporate only)
//   3. Sourcing suggestions        -> CompanyAssociation (derived or curated)
//   4. Role-specific targeting     -> RoleContext + AssociationMatch
//
// Nothing in this model asserts that a company-level capability proves an
// individual employee has performed that work.

/** Evidence confidence. `unknown` is distinct from "verified absent". */
export type Confidence = 'confirmed' | 'probable' | 'hypothesis' | 'unknown'

/** Whether a capability was seen, checked and not seen, or never checked. */
export type CapabilityStatus = 'observed' | 'not-observed' | 'unknown'

/** What kind of source an evidence record came from. */
export type SourceType =
  | 'company-website'
  | 'corporate-disclosure'
  | 'business-directory'
  | 'industry-directory'
  | 'industry-report'
  | 'news'
  | 'recruiter-supplied'
  | 'system-inferred'
  | 'internal-dataset'

export interface EvidenceRecord {
  url: string
  type: SourceType
  /** What this source actually supports, in one line. Never a general claim. */
  evidence: string
  /** ISO date the source was read (YYYY-MM-DD). */
  checkedOn: string
  /** Who reviewed it. Empty string means not yet human-reviewed. */
  reviewer?: string
  confidence?: Confidence
}

/** Controlled industry taxonomy node. `parentId` null means a top-level industry. */
export interface Industry {
  id: string
  name: string
  parentId: string | null
  /** Sourcing pocket id this industry belongs to (pockets are the grouping layer). */
  pocket: string
  description: string
  synonyms: string[]
}

/** A sourcing pocket groups industries that a recruiter would search as one ecosystem. */
export interface IndustryPocket {
  id: string
  name: string
  /** Value-chain position, used for adjacency (not equivalence). */
  valueChainStage: string
  description: string
}

/** Reusable operating-process taxonomy node. */
export interface Capability {
  id: string
  name: string
  group: 'operating' | 'commercial' | 'financial' | 'technology'
  parentId: string | null
  synonyms: string[]
  description: string
}

export interface OrganizationIndustryLink {
  industryId: string
  primary: boolean
  confidence: Confidence
  /** What the evidence supports, e.g. "operates refrigerated warehousing at four sites". */
  evidence: string
  sourceUrl: string
  checkedOn: string
}

export interface OrganizationCapabilityLink {
  capabilityId: string
  status: CapabilityStatus
  confidence: Confidence
  evidence: string
  sourceUrl: string
  checkedOn: string
  /** Business unit the capability applies to, when the source names one. */
  businessUnit?: string
}

export interface OrganizationLocation {
  city: string
  province: string
  /** Only set when a source actually states this location. */
  sourceUrl: string
  checkedOn: string
}

/**
 * Scale is always sourced, typed and dated. Headcount and revenue are never mixed.
 *
 * The metric is deliberately sector-specific: cold storage is measured in pallet
 * positions, property funds in sites, renewable developers in generating
 * capacity. A single generic metric would force an MW figure into a headcount
 * field and misstate what the source actually said.
 */
export interface OrganizationScale {
  metric: 'employees' | 'revenue' | 'sites' | 'pallet-positions' | 'capacity'
  /** Raw value exactly as the source stated it, including ranges. */
  value: string
  basis: 'source-reported' | 'third-party-estimate'
  asOf: string
  sourceUrl: string
  checkedOn: string
  /**
   * Which entity the figure describes. Optional because most existing records do
   * not say; absent means "not stated by the source", which is rendered as
   * unknown rather than defaulted to the standalone entity.
   */
  entityScope?: ScaleEntityScope
}

export type OrganizationStatus = 'verified' | 'needs-verification'

export interface Organization {
  id: string
  name: string
  /** Legal entity name, only where a source establishes it. */
  legalName: string
  aliases: string[]
  website: string
  status: OrganizationStatus
  industries: OrganizationIndustryLink[]
  capabilities: OrganizationCapabilityLink[]
  locations: OrganizationLocation[]
  scale: OrganizationScale[]
  /** Parent organization id (canonical model), not a free-text label. */
  parentId: string | null
  sources: EvidenceRecord[]
  /** Which Maps datasets already reference this organization. */
  datasets: string[]
  lastVerified: string
  notes: string
}

export type CorporateRelationshipType =
  | 'parent-of'
  | 'subsidiary-of'
  | 'acquired'
  | 'joint-venture'
  | 'verified-partnership'

/** A factual corporate relationship. Never a sourcing suggestion. */
export interface OrganizationRelationship {
  id: string
  type: CorporateRelationshipType
  fromId: string
  toId: string
  evidence: string
  sourceUrl: string
  confidence: Confidence
  checkedOn: string
  note: string
}

export type SourcingRelationshipType =
  | 'same-industry'
  | 'same-value-chain'
  | 'shared-operating-process'
  | 'shared-financial-complexity'
  | 'shared-technology'
  | 'talent-transferability'
  | 'geographic-proximity'
  | 'corporate-affiliation'
  | 'previous-recruitment-success'

/**
 * A curated or materialized association. Most associations are generated on
 * demand by the discovery engine; only materialized, reviewed or reused ones
 * are stored, so the dataset never precomputes every company pair.
 */
export interface CompanyAssociation {
  id: string
  focalId: string
  associatedId: string
  relationshipType: SourcingRelationshipType
  sharedProcesses: string[]
  sharedIndustries: string[]
  valueChainOverlap: string
  narrative: string
  evidence: string
  sourceUrl: string
  confidence: Confidence
  status: 'curated' | 'reviewed' | 'system-inferred'
  reviewer: string
  checkedOn: string
}

// ---------------------------------------------------------------------------
// Indicative Market Footprint
// ---------------------------------------------------------------------------
//
// Footprint is an approximate classification of operating reach, not a statutory
// size band and not a ranking. It exists so the Industry Atlas can group
// companies into readable bands without ever asserting a headcount, a revenue
// figure or a market position the sources do not support.
//
// It is deliberately kept separate from:
//   - `OrganizationScale`        (the sourced raw measurement)
//   - `ScaleBand`                (the statutory / banking band in the taxonomy)
// Nothing here is ever rendered as verified revenue, headcount or statutory size.

/** Display bands, widest reach first. `not-established` is a real answer. */
export type FootprintBand =
  | 'major-national'
  | 'large-multi-site'
  | 'regional-specialist'
  | 'smaller-emerging'
  | 'not-established'

/** How the band was arrived at. Never silently mixed. */
export type FootprintClassificationKind =
  /** Derived from one or more sourced numeric metrics. */
  | 'sourced-metric'
  /** Derived from a combination of sourced metrics plus evidenced site spread. */
  | 'derived-metric-combination'
  /** A human reviewer classified it against an evidence note. */
  | 'human-reviewed-indicative'
  /** No defensible signal exists; the company stays unclassified. */
  | 'unclassified'

/**
 * Which entity the supporting figures describe. A group-level headcount must
 * never be silently attributed to a subsidiary, so this is carried on every
 * classification rather than assumed.
 */
export type ScaleEntityScope =
  | 'consolidated-group'
  | 'south-african-operation'
  | 'operating-division'
  | 'standalone-entity'
  /** The source did not say. Rendered as unknown, never defaulted. */
  | 'not-stated'

export type FootprintReviewStatus = 'unreviewed' | 'pending-review' | 'reviewed' | 'contested'

/** The auditable footprint contract. Correctable without editing source facts. */
export interface FootprintClassification {
  organizationId: string
  band: FootprintBand
  classificationKind: FootprintClassificationKind
  /** Plain-language account of what actually drove the band. */
  basis: string
  /** Stable ids into the organization's sourced scale records, e.g. `org-x:scale:0`. */
  supportingMetricIds: string[]
  /** Source URLs behind the supporting metrics. */
  evidenceReferences: string[]
  confidence: Confidence
  reviewStatus: FootprintReviewStatus
  /** Empty until a human has actually reviewed the classification. */
  reviewedBy: string
  /** ISO date, empty when never reviewed. */
  reviewedOn: string
  entityScope: ScaleEntityScope
  /** Why a company was left unclassified, or what would sharpen the band. */
  note: string
}

/** A human reviewer's correction of, or addition to, a derived classification. */
export interface FootprintReview {
  organizationId: string
  band: FootprintBand
  classificationKind: FootprintClassificationKind
  /** The evidence note the reviewer relied on. Required: no band without a reason. */
  basis: string
  entityScope: ScaleEntityScope
  confidence: Confidence
  reviewedBy: string
  reviewedOn: string
}

export type RecruiterIntelligenceKind =
  | 'strong-source'
  | 'client-preferred'
  | 'client-excluded'
  | 'previously-placed'

/** Recruiter judgment. Kept separate from verified company facts on purpose. */
export interface RecruiterIntelligence {
  id: string
  organizationId: string
  kind: RecruiterIntelligenceKind
  /** Role context or capability this observation is about. */
  scope: string
  observation: string
  confidence: Confidence
  source: string
  reviewer: string
  recordedOn: string
}

// ---------------------------------------------------------------------------
// Role context: the layer that makes relevance conditional
// ---------------------------------------------------------------------------

export interface RoleContext {
  id: string
  /** Human label, e.g. "Financial Manager". */
  role: string
  /** Where the vocabulary came from. */
  origin: 'role-family' | 'search-bank' | 'custom'
  /** Client organization id, when the context is an actual assignment. */
  clientId: string | null
  clientName: string
  /** Search Bank assignment id, when the context came from the bank. */
  searchId: string | null
  mandatoryCapabilities: string[]
  preferredIndustries: string[]
  acceptableIndustries: string[]
  excludedIndustries: string[]
  /** Value-chain stages considered adjacent to the client's own stage. */
  adjacentValueChainStages: string[]
  requiredQualifications: string[]
  requiredSystems: string[]
  provinces: string[]
  seniority: string
  exclusions: string[]
  /** Recruiter-stated priorities, shown verbatim in the UI. */
  priorities: string[]
  brief: string
}

export type AssociationTier = 1 | 2 | 3 | 4 | 5

export interface AssociationRuleHit {
  /** Stable rule id, e.g. `R2-mandatory-capability`. */
  rule: string
  label: string
  detail: string
  evidence: string
}

export interface AssociationGap {
  requirement: string
  reason: string
}

/** Why one company appears for one role context. Fully explainable. */
export interface AssociationMatch {
  organizationId: string
  focalId: string
  roleContextId: string
  tier: AssociationTier
  tierLabel: string
  pocketId: string
  rules: AssociationRuleHit[]
  gaps: AssociationGap[]
  sharedCapabilities: string[]
  missingCapabilities: string[]
  relationshipTypes: SourcingRelationshipType[]
  confidence: Confidence
  /** Recruiter override, when one has been recorded. */
  override: { tier: AssociationTier; reason: string; reviewer: string } | null
  /** Mapped professionals already known to Maps at this employer. */
  mappedProfessionals: number
}

export interface AssociationPocket {
  pocket: IndustryPocket
  matches: AssociationMatch[]
  tiers: Record<AssociationTier, number>
  mappedProfessionals: number
  verifiedRelationships: number
}

export interface AssociationDiscovery {
  focalId: string
  roleContextId: string
  pockets: AssociationPocket[]
  matches: AssociationMatch[]
  /** Coverage of the discovery, so limits are visible instead of silent. */
  coverage: {
    organizationsScanned: number
    matched: number
    unmappedIndustries: string[]
  }
}

export interface AssociationFilters {
  industries: string[]
  /** National macro-sector ids, derived from the industry crosswalk. */
  macroSectors: string[]
  pockets: string[]
  capabilities: string[]
  provinces: string[]
  scale: string[]
  /** Indicative market footprint bands. Approximate reach, never a size fact. */
  footprint: string[]
  confidence: string[]
  /**
   * Role-specific relevance. Only ever offered while a recruitment brief is
   * active; the factual atlas and the company directory must not surface it.
   */
  tiers: string[]
  relationshipTypes: string[]
  status: string[]
  /** Corporate group (parent organization id) the company belongs to. */
  groups: string[]
  hasMappedProfessionals: 'any' | 'yes' | 'no'
  query: string
}

export const EMPTY_FILTERS: AssociationFilters = {
  industries: [],
  macroSectors: [],
  pockets: [],
  capabilities: [],
  provinces: [],
  scale: [],
  footprint: [],
  confidence: [],
  tiers: [],
  relationshipTypes: [],
  status: [],
  groups: [],
  hasMappedProfessionals: 'any',
  query: '',
}

/**
 * Every multi-select filter key, plus the two single-value keys handled
 * separately. `macroSectors` is in this list: it was previously supported by the
 * filter panel and the discovery engine but omitted from URL read/write, so a
 * selected macro-sector silently vanished on the next navigation.
 */
export const FILTER_KEYS = [
  'pockets',
  'industries',
  'macroSectors',
  'capabilities',
  'provinces',
  'scale',
  'footprint',
  'confidence',
  'tiers',
  'relationshipTypes',
  'status',
  'groups',
] as const satisfies readonly (keyof AssociationFilters)[]

/** The subset of filters that is legitimate without a recruitment brief. */
export const FACTUAL_FILTER_KEYS = FILTER_KEYS.filter(
  (key) => key !== 'tiers' && key !== 'relationshipTypes',
)

// ---------------------------------------------------------------------------
// Target pools and search targets
// ---------------------------------------------------------------------------

export interface TargetPoolEntry {
  organizationId: string
  reason: string
  tier: AssociationTier | null
  addedOn: string
}

/**
 * What a dynamic pool re-derives its membership from.
 *
 * `focalId` and `roleContextId` are nullable on purpose. A pool defined by an
 * industry branch is a first-class saved search and must not have to invent a
 * focal company; pools saved before the Industry Atlas keep their focal
 * definition and are migrated unchanged.
 */
export type TargetPoolScope =
  /** Membership derives from associations around one named company. */
  | { kind: 'focal'; focalId: string; roleContextId: string }
  /** Membership derives from a branch of the national industry taxonomy. */
  | { kind: 'industry'; nodeId: string | null; roleContextId: string | null }
  /** Membership derives from the whole mapped universe under filters alone. */
  | { kind: 'universe'; roleContextId: string | null }

export interface TargetPoolDefinition {
  scope: TargetPoolScope
  filters: AssociationFilters
}

export interface TargetPool {
  id: string
  name: string
  description: string
  classification: string
  owner: string
  /** `snapshot` freezes the membership; `dynamic` re-derives from the filter. */
  kind: 'snapshot' | 'dynamic'
  entries: TargetPoolEntry[]
  /** For dynamic pools: what the membership re-derives from. */
  definition: TargetPoolDefinition | null
  searchId: string | null
  createdOn: string
  lastVerified: string
  reuseCount: number
}

/** A search-to-company relationship. Reuse never duplicates the company. */
export interface SearchTargetCompany {
  organizationId: string
  /** Company name as stored at the time the target was added (audit trail). */
  nameAtCapture: string
  tier: AssociationTier | null
  reasons: string[]
  /** Where the target came from: explorer, pool, import, manual. */
  discoverySource: string
  recruiterStatus: 'proposed' | 'researching' | 'active' | 'exhausted' | 'excluded'
  addedOn: string
  notes: string
}

export interface CoverageReport {
  industryId: string
  industryName: string
  pocket: string
  organizations: number
  verified: number
  pendingVerification: number
  withMappedProfessionals: number
  requiringEmployeeMapping: number
  lastResearchDate: string | null
  gaps: string[]
}

export type QualityIssueCode =
  | 'duplicate-organization'
  | 'ambiguous-alias'
  | 'conflicting-parent'
  | 'unsupported-industry'
  | 'activity-assumed-from-industry'
  | 'conflicting-capability'
  | 'unsupported-association'
  | 'mistaken-corporate-affiliation'
  | 'relevance-without-evidence'
  | 'similarity-as-person-suitability'
  | 'stale-verification'
  | 'scale-without-source'
  | 'unsourced-location'
  | 'unknown-rendered-as-absent'

export interface QualityIssue {
  code: QualityIssueCode
  severity: 'error' | 'warning'
  organizationId: string | null
  detail: string
}
