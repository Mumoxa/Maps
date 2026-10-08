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

/** Scale is always sourced, typed and dated. Headcount and revenue are never mixed. */
export interface OrganizationScale {
  metric: 'employees' | 'revenue' | 'sites' | 'pallet-positions'
  /** Raw value exactly as the source stated it, including ranges. */
  value: string
  basis: 'source-reported' | 'third-party-estimate'
  asOf: string
  sourceUrl: string
  checkedOn: string
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
  pockets: string[]
  capabilities: string[]
  provinces: string[]
  scale: string[]
  confidence: string[]
  tiers: string[]
  relationshipTypes: string[]
  status: string[]
  hasMappedProfessionals: 'any' | 'yes' | 'no'
  query: string
}

export const EMPTY_FILTERS: AssociationFilters = {
  industries: [],
  pockets: [],
  capabilities: [],
  provinces: [],
  scale: [],
  confidence: [],
  tiers: [],
  relationshipTypes: [],
  status: [],
  hasMappedProfessionals: 'any',
  query: '',
}

// ---------------------------------------------------------------------------
// Target pools and search targets
// ---------------------------------------------------------------------------

export interface TargetPoolEntry {
  organizationId: string
  reason: string
  tier: AssociationTier | null
  addedOn: string
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
  /** For dynamic pools: the focal + role + filter that define membership. */
  definition: {
    focalId: string
    roleContextId: string
    filters: AssociationFilters
  } | null
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
