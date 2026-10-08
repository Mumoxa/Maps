// Canonical contracts for the national South African corporate taxonomy.
//
// The taxonomy answers four separate questions about one company, and they are
// kept apart here because collapsing them is what produces unusable datasets:
//
//   1. What does it do?            -> TaxonomyNode (L1 macro-sector ... L4 niche)
//   2. How big is it?              -> ScaleBand (National Small Enterprise Act + banking bands)
//   3. Is it compliant and real?   -> LegalIdentity + RegulatoryProfile + B-BBEE
//   4. Where is it economically?   -> GeographicAnchor (province, municipality, hub)
//
// `confidence` and `sourceType` are imported from the organization model rather
// than redefined, so the repository has one evidence vocabulary, not two.

import type { Confidence, SourceType } from '../organizations/types'

export type TaxonomyLevel = 1 | 2 | 3 | 4

/** A node in the Macro-Sector -> Industry -> Sub-Industry -> Niche tree. */
export interface TaxonomyNode {
  id: string
  name: string
  level: TaxonomyLevel
  /** `null` on L1 macro-sectors. */
  parentId: string | null
  /** Set on L1 only: the Schedule 1 sector class the macro-sector resolves to. */
  statutorySector?: string
  /** Set on L1 only: the SIC chapter range the macro-sector covers. */
  sics?: string
  /** Set on L1 only: which value-chain position this macro-sector occupies. */
  valueChainStage?: string
  /** South African operating reality this node exists to capture. */
  saContext?: string
  synonyms?: string[]
  /** True where unregistered or informal operators are normal in this node. */
  informalRelevant?: boolean
}

export type ScaleBandId = 'micro' | 'small' | 'medium' | 'large' | 'tier-1' | 'unclassified'

export interface ScaleBand {
  id: Exclude<ScaleBandId, 'unclassified'>
  code: string
  label: string
  /** 1 is the smallest band; used to resolve the higher-of-both-proxies rule. */
  rank: number
  employeesMin: number
  /** `null` means unbounded above. */
  employeesMax: number | null
  turnoverMin: number
  turnoverMax: number | null
  turnoverCapRule: 'sector-dependent' | 'fixed'
  /** The National Small Enterprise Act class, or null where there is none. */
  statutoryClass: 'micro' | 'small' | 'medium' | null
  informalInclusive: boolean
  corporateBankingEquivalent: string
  notes: string
}

export interface ScaleBandsFile {
  schemaVersion: string
  currency: string
  precedence: string
  precedenceRule: string
  statutoryCeiling: { band: string; note: string }
  bands: ScaleBand[]
}

export interface StatutoryThreshold {
  employeesMax: number
  turnoverMax: number
}

export interface StatutorySectorClass {
  id: string
  label: string
  micro: StatutoryThreshold
  small: StatutoryThreshold
  medium: StatutoryThreshold
}

export interface StatutorySchedule {
  id: string
  label: string
  effectiveFrom: string
  effectiveTo: string | null
  verificationStatus: 'source-verified' | 'existence-verified-values-unverified'
  sources: { url: string; evidence: string; checkedOn: string }[]
  sectorClasses: StatutorySectorClass[]
  sectorClassesNote?: string
}

export interface StatutoryScheduleFile {
  schemaVersion: string
  instrument: string
  proxies: string[]
  status: string
  statusNote: string
  schedules: StatutorySchedule[]
}

export interface VocabularyOption {
  id: string
  label: string
  note?: string
}

export interface BeeCategoryOption {
  id: string
  label: string
  turnoverBand?: string
  evidence: string
  defaultLevel: number | null
  levelUplift?: string
  note?: string
}

export interface BeeSectorCodeOption {
  id: string
  label: string
  /** `null` where the sector code does not use the general turnover bands. */
  emeThreshold: number | null
  qseThreshold: number | null
  note?: string
}

export interface GeographicOption {
  id: string
  label: string
  province: string
}

export interface RegionalHubOption {
  id: string
  label: string
  provinces: string[]
  note: string
}

export interface ControlledVocabulariesFile {
  schemaVersion: string
  note: string
  entityTypes: VocabularyOption[]
  cipcStatuses: VocabularyOption[]
  taxComplianceStatuses: VocabularyOption[]
  coidaStatuses: VocabularyOption[]
  bbbee: {
    categories: BeeCategoryOption[]
    levels: string[]
    scorecardTypes: string[]
    sectorCodes: BeeSectorCodeOption[]
    evidenceTypes: string[]
    sourceNote: string
  }
  provinces: { id: string; label: string }[]
  metropolitanMunicipalities: GeographicOption[]
  districtMunicipalities: GeographicOption[]
  localMunicipalityPolicy: { controlled: boolean; reason: string; field: string; requiredWith: string[] }
  regionalEconomicHubs: RegionalHubOption[]
  scaleBasis: string[]
  confidence: string[]
  sourceType: string[]
  jseListingStatuses: VocabularyOption[]
  registrationRegulators: { id: string; label: string; whatItRegisters: string }[]
}

export interface CrosswalkFile {
  schemaVersion: string
  purpose: string
  direction: string
  pocketMappings: { pocketId: string; taxonomyNodes: string[]; note: string }[]
  industryMappings: { industryId: string; taxonomyNode: string; note?: string }[]
}

// ---------------------------------------------------------------------------
// The company record itself
// ---------------------------------------------------------------------------

export interface Provenance {
  /** Empty string means no source exists yet, which is different from "no source needed". */
  sourceUrl: string
  checkedOn: string
  confidence: Confidence
  sourceType: SourceType
}

export interface LegalIdentity {
  legalName: string
  tradingName: string
  entityType: string
  /** Empty string for entity types that never receive a CIPC number. */
  cipcRegistrationNumber: string
  cipcStatus: string
  cipcStatusAsOf: string
  vatNumber: string
  incomeTaxNumber: string
  jseShareCode: string
  jseListingStatus: string
  /** Listing status is dated: delistings and demergers change it. */
  jseListingAsOf: string
  isin: string
  leiNumber: string
}

export interface ScaleProfile {
  /** Full-time-equivalent paid employees, the statutory proxy. `null` = not known. */
  employeesFte: number | null
  employeesAsOf: string
  /** False where the entity reported no FTE data at all (common for informal operators). */
  fteReported: boolean
  annualTurnoverZar: number | null
  /** Financial year end the turnover figure belongs to, YYYY-MM-DD. */
  turnoverFyEnd: string
  turnoverBasis: string
  /** The retired third statutory proxy, kept because older records carry it. */
  assetValueZar: number | null
  informal: boolean
  /** A group-consolidated figure must never be read as a single legal entity's size. */
  reportingBasis: 'standalone-entity' | 'group-consolidated'
  provenance: Provenance
}

/** Derived, never hand-entered: recomputed from `scale` on every validation run. */
export interface ScaleBandAssignment {
  band: ScaleBandId
  bandLabel: string
  bandByEmployees: ScaleBandId
  bandByTurnover: ScaleBandId
  /** True when the two proxies disagree, so the disagreement stays visible. */
  bandConflict: boolean
  statutoryClass: 'micro' | 'small' | 'medium' | null
  scheduleId: string
  derivedOn: string
}

export interface BeeProfile {
  category: string
  level: string
  scorecardType: string
  sectorCode: string
  blackOwnershipPct: number | null
  blackFemaleOwnershipPct: number | null
  verificationAgency: string
  sanasAccredited: boolean
  certificateNumber: string
  validFrom: string
  validTo: string
  evidenceType: string
  provenance: Provenance
}

export interface SectorLicence {
  regulator: string
  licenceType: string
  licenceNumber: string
  status: string
  validTo: string
  sourceUrl: string
  checkedOn: string
}

export interface RegulatoryProfile {
  sarsTaxComplianceStatus: string
  sarsTcsPin: string
  sarsPinExpiry: string
  coidaStatus: string
  coidaLgsNumber: string
  coidaLgsExpiry: string
  csdRegistered: boolean
  /** True where PFMA (national) or MFMA (municipal) governance applies. */
  pfmaOrMfmaApplicable: boolean
  sectorLicences: SectorLicence[]
  provenance: Provenance
}

export interface GeographicAnchor {
  province: string
  /** Exactly one of the two municipality levels is populated. */
  metropolitanMunicipality: string
  districtMunicipality: string
  /** Free text with provenance: see localMunicipalityPolicy in the vocabularies. */
  localMunicipality: string
  city: string
  suburb: string
  streetAddress: string
  latitude: number | null
  longitude: number | null
  regionalEconomicHubs: string[]
  operatingProvinces: string[]
  crossBorderCountries: string[]
  sourceUrl: string
  checkedOn: string
}

export interface TaxonomyPlacement {
  /** Deepest node the company can be confidently placed in (L4 where known). */
  primaryNode: string
  /** Multi-homing: Shoprite is retail and logistics, a mine is extractive and services. */
  secondaryNodes: string[]
  valueChainStage: string
  /** Existing Maps sourcing pocket id, preserved through the crosswalk. */
  sourcingPocket: string
}

export interface CompanyProfile {
  id: string
  legal: LegalIdentity
  scale: ScaleProfile
  scaleBand: ScaleBandAssignment
  bbbee: BeeProfile
  regulatory: RegulatoryProfile
  geography: GeographicAnchor
  taxonomy: TaxonomyPlacement
  status: 'verified' | 'needs-verification'
  lastVerified: string
  /** True for records that exist to demonstrate the schema, not to assert a real company. */
  illustrativeRecord: boolean
  notes: string
}

// ---------------------------------------------------------------------------
// Validation output
// ---------------------------------------------------------------------------

export type TaxonomyIssueCode =
  | 'unknown-node'
  | 'duplicate-node-id'
  | 'bad-level'
  | 'orphan-node'
  | 'level-skip'
  | 'id-prefix-mismatch'
  | 'unknown-statutory-sector'
  | 'crosswalk-target-missing'
  | 'crosswalk-source-missing'
  | 'unmapped-industry'
  | 'unmapped-pocket'
  | 'unknown-vocabulary-value'
  | 'cipc-number-mismatch'
  | 'cipc-number-not-applicable'
  | 'scale-band-stale'
  | 'bbbee-category-mismatch'
  | 'bbbee-level-invalid-for-evidence'
  | 'geography-inconsistent'
  | 'licence-without-regulator'
  | 'illustrative-not-flagged'

export interface TaxonomyIssue {
  code: TaxonomyIssueCode
  severity: 'error' | 'warning'
  /** Company id, taxonomy node id, or crosswalk id the issue belongs to. */
  subject: string
  detail: string
}
