// Canonical company-intelligence contracts.
//
// One Organization per real business, many-to-many links to a controlled
// industry taxonomy and a reusable capability taxonomy, and every important
// statement carrying evidence. Company facts, company relationships,
// role-specific targeting and candidate suitability are deliberately separate
// types: nothing here describes a person's experience.

/** Evidence confidence classification used everywhere a fact is shown. */
export type Confidence = 'confirmed' | 'probable' | 'hypothesis' | 'unknown'

/** Who produced the statement. */
export type Origin = 'source-reported' | 'recruiter-supplied' | 'system-inferred' | 'recruiter-reviewed'

export type SourceType =
  | 'company-website'
  | 'company-social'
  | 'company-recruitment'
  | 'company-presentation'
  | 'trade-press'
  | 'news'
  | 'academic'
  | 'third-party-directory'
  | 'internal-dataset'
  | 'recruiter-note'

export interface EvidenceRecord {
  id: string
  url: string | null
  sourceName: string
  sourceType: SourceType
  /** Date the source itself was published or last updated, when known. */
  publishedOn: string | null
  /** What the source actually supports, in plain words. */
  supports: string
  /** Set by the graph builder from the batch that introduced the evidence. */
  observedOn?: string
  batchId?: string
  reviewer?: string
}

export type IdentityStatus = 'verified' | 'probable' | 'unresolved'

export interface LineageRef {
  /** `accountants:cmp-0181`, `credit-risk:COM-1`, `workspace:<import id>` */
  ref: string
  dataset: string
  recordId: string
  /** Name exactly as the source dataset spelled it. */
  sourceName: string
}

export interface Organization {
  id: string
  name: string
  aliases: string[]
  formerNames: string[]
  legalName: string | null
  website: string | null
  domain: string | null
  identityStatus: IdentityStatus
  /** False for foreign parents kept only to anchor corporate structure. */
  southAfrican: boolean
  lineage: LineageRef[]
  /** Most recent verification date across lineage and research, if any. */
  lastVerified: string | null
}

export interface Industry {
  id: string
  name: string
  parentId: string | null
  synonyms: string[]
  valueChain: string[]
  typicalCapabilities: string[]
}

export type CapabilityKind = 'operational' | 'commercial' | 'financial' | 'technology'

export interface Capability {
  id: string
  name: string
  parentId: string | null
  kind: CapabilityKind
  synonyms: string[]
}

export interface OrganizationIndustry {
  organizationId: string
  industryId: string
  role: 'primary' | 'secondary'
  evidenceIds: string[]
  confidence: Confidence
  origin: Origin
  batchId?: string
}

export type CapabilityStatus = 'observed' | 'not-observed' | 'unknown'

export interface OrganizationCapability {
  organizationId: string
  capabilityId: string
  status: CapabilityStatus
  evidenceIds: string[]
  confidence: Confidence
  origin: Origin
  summary: string
  businessUnit?: string
  batchId?: string
  /** True for rows generated from an industry prior ("activity assumed from industry"). */
  inferredFromIndustry?: string
}

export type CorporateRelationshipType = 'subsidiary-of' | 'division-of' | 'acquired-by' | 'joint-venture' | 'partnership'

/** Explicit factual corporate relationships. Never a sourcing suggestion. */
export interface OrganizationRelationship {
  fromId: string
  toId: string
  type: CorporateRelationshipType
  evidenceIds: string[]
  confidence: Confidence
  summary: string
  batchId?: string
}

export interface OrganizationLocation {
  organizationId: string
  province: string
  city: string
  evidenceIds: string[]
  confidence: Confidence
}

export type ScaleMetricKind = 'employees' | 'revenue' | 'sites' | 'storage-pallets' | 'storage-tonnes' | 'pallets-per-day'

/** A sourced scale indicator. Metrics are never compared across kinds. */
export interface ScaleMetric {
  organizationId: string
  metric: ScaleMetricKind
  /** Numeric value when the source gives a point figure; null for bands or currency text. */
  value: number | null
  valueText: string
  asOf: string | null
  evidenceIds: string[]
  confidence: Confidence
  note: string
}

export type OpenQuestionKind = 'identity' | 'relationship' | 'conflicting-evidence' | 'coverage' | 'classification'

export interface OpenQuestion {
  organizationId: string | null
  kind: OpenQuestionKind
  issue: string
  legacyRef?: string
}

/** Recruiting-research coverage carried over from legacy sweeps (e.g. finance-team target lists). */
export interface CoverageRecord {
  organizationId: string
  dataset: string
  status: 'researched-with-people' | 'researched-zero-results' | 'needs-research'
  verifiedPeopleCount: number | null
  lastChecked: string | null
  scope: string
}

export interface ResearchIdentity {
  id: string
  lineage: string[]
  name: string
  aliases: string[]
  formerNames?: string[]
  legalName: string | null
  website: string | null
  identityStatus: IdentityStatus
  southAfrican?: boolean
}

/** One reviewable unit of research. Public batches are committed; private batches live in the workspace. */
export interface ResearchBatch {
  schemaVersion: 1
  batchId: string
  researchedOn: string
  researcher: string
  scope: string
  method?: string
  identities: ResearchIdentity[]
  evidence: EvidenceRecord[]
  organizationIndustries: OrganizationIndustry[]
  organizationCapabilities: OrganizationCapability[]
  organizationRelationships: OrganizationRelationship[]
  locations: OrganizationLocation[]
  scaleMetrics: ScaleMetric[]
  openQuestions: OpenQuestion[]
  coverage?: CoverageRecord[]
}

export interface OrganizationRegistryFile {
  schemaVersion: 1
  generatedBy: string
  organizations: Organization[]
}

// ----- People (public professional profiles only) -----

export interface PersonRecord {
  /** `person:accountants:acc-0001` */
  id: string
  name: string
  dataset: 'accountants' | 'credit-risk'
  title: string
  qualifications: string[]
  province: string
  /** Internal route that opens the source profile view. */
  href: string
  profileUrl: string
  sourceUrls: string[]
  lastVerified: string | null
  recordStatus: string
}

export interface EmploymentRecord {
  personId: string
  organizationId: string | null
  employerName: string
  current: boolean
  title: string
  /** How the employer string was resolved to an organization. */
  match: 'exact' | 'alias-table' | 'unresolved'
  verifiedOn: string | null
}

// ----- Role context / search requirement -----

export interface RoleContextTemplate {
  id: string
  label: string
  roleFamily: string
  seniority: string
  summary: string
  mandatoryCapabilities: string[]
  preferredCapabilities: string[]
  preferredIndustries: string[]
  adjacentIndustries: string[]
  deprioritisedIndustries: string[]
  qualifications: string[]
  geography: string[]
  exclusions: string[]
}

/** Requirements that drive targeting. Saved per search in the private workspace. */
export interface SearchRequirement {
  roleContextId: string | null
  label: string
  roleFamily: string
  seniority: string
  mandatoryCapabilities: string[]
  preferredCapabilities: string[]
  preferredIndustries: string[]
  adjacentIndustries: string[]
  deprioritisedIndustries: string[]
  qualifications: string[]
  geography: string[]
  excludedOrganizationIds: string[]
  excludedIndustryIds: string[]
  notes: string
}
