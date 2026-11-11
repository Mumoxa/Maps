/**
 * External industry-body intelligence.
 *
 * This model is deliberately separate from OrganizationRelationship (corporate
 * ownership/partnership) and CompanyAssociation (recruitment similarity). A
 * company can be a member, regulated, accredited or represented on a committee;
 * those are different claims with different evidence requirements.
 */

export type EvidenceStatus = 'Confirmed' | 'Historical' | 'Unverified' | 'Unknown' | 'Not applicable'
export type ResearchConfidence = 'High' | 'Medium' | 'Low' | 'Unknown'
export type ParticipationBasis = 'Voluntary' | 'Mandatory' | 'Unknown' | 'Not applicable'
export type MembershipAvailability = 'public-searchable' | 'public-list' | 'restricted' | 'not-found' | 'not-applicable'

export type IndustryBodyCategory =
  | 'trade-association'
  | 'professional-body'
  | 'regulator'
  | 'statutory-body'
  | 'employer-federation'
  | 'chamber'
  | 'industry-forum'
  | 'accreditation-body'
  | 'certification-body'
  | 'international-network'

export type ExternalRelationshipType =
  | 'membership'
  | 'regulation'
  | 'accreditation'
  | 'certification'
  | 'committee-representation'
  | 'industry-similarity'

export type ParticipantType =
  | 'producer-operator'
  | 'corporate-member'
  | 'associate-supplier'
  | 'contractor'
  | 'professional-services'
  | 'financial-product-provider'
  | 'investment-holding'
  | 'association'
  | 'educational-institution'
  | 'individual'
  | 'public-institution'
  | 'unknown'

export interface IndustryBody {
  id: string
  officialName: string
  acronym: string
  website: string
  category: IndustryBodyCategory
  industries: string[]
  subIndustries: string[]
  geographicCoverage: string[]
  participationBasis: ParticipationBasis
  represents: 'companies' | 'individuals' | 'associations' | 'mixed' | 'not-applicable'
  membershipDirectoryUrl: string
  membershipListAvailability: MembershipAvailability
  parentBodyId: string | null
  umbrellaBodyIds: string[]
  lastVerified: string
  sourceUrl: string
  notes: string
}

export interface CompanyBodyRelationship {
  id: string
  companyId: string
  companyName: string
  bodyId: string
  relationshipType: Exclude<ExternalRelationshipType, 'industry-similarity'>
  membershipCategory: string
  status: EvidenceStatus
  participationBasis: ParticipationBasis
  represents: 'company' | 'individual' | 'association' | 'not-applicable'
  industry: string
  subIndustry: string
  jurisdiction: string
  effectiveDate: string
  expiryDate: string
  evidenceUrl: string
  sourcePublicationDate: string
  lastChecked: string
  confidence: ResearchConfidence
  researchNotes: string
}

export interface AssociationMember {
  id: string
  bodyId: string
  companyId: string | null
  companyName: string
  originalDirectoryName: string
  relatedBodyId: string | null
  membershipCategory: string
  participantType: ParticipantType
  industryNiche: string
  location: string
  website: string
  existingMapsCompany: 'Yes' | 'No'
  newCompanyCandidate: 'Yes' | 'No'
  identityStatus: 'resolved' | 'proposed' | 'unresolved' | 'body-reference' | 'excluded-individual'
  evidenceUrl: string
  sourcePublicationDate: string
  lastChecked: string
  verificationStatus: EvidenceStatus
  operationNames: string[]
  researchNotes: string
}

export interface IndustryLeader {
  id: string
  bodyId: string
  individualName: string
  associationRole: string
  currentEmployer: string
  corporateTitle: string
  professionalProfileUrl: string
  companyId: string | null
  evidenceUrl: string
  evidenceDate: string
  verifiedDate: string
  verificationStatus: EvidenceStatus
  notes: string
}

export interface RecruitmentClassification {
  id: string
  networkId: string
  memberId: string
  tier: 1 | 2 | 3
  rationale: string
  evidenceUrl: string
  confidence: ResearchConfidence
}

export interface RecruitmentNetwork {
  id: string
  industryName: string
  specialistNiche: string
  targetCompanyName: string
  brief: string
  relevantBodyIds: string[]
  geographicRelevance: string[]
  tierCriteria: {
    tier1: string
    tier2: string
    tier3: string
  }
  researchCoverage: string
  evidenceUrls: string[]
}

export interface ProposedCompany {
  id: string
  name: string
  sourceNames: string[]
  websites: string[]
  industryNiches: string[]
  locations: string[]
  discoveredThroughBodyIds: string[]
  evidenceUrls: string[]
  status: 'proposed-unverified' | 'identity-reviewed'
  notes: string
}

export interface CompanyInventoryRecord {
  companyId: string
  companyName: string
  identityKind: 'curated' | 'dataset-only' | 'additional-source-only'
  canonicalName: string
  sourceNames: string[]
  sourceRecordIds: string[]
  sourceFiles: string[]
  datasets: string[]
  taxonomyNode: string
  identityStatus: string
  researchStatus: 'researched' | 'pending'
  confirmedBodyRelationships: number
  historicalBodyRelationships: number
  unverifiedBodyRelationships: number
  unknownBodyRelationships: number
}

export interface CoverageReport {
  generatedOn: string
  sourceCompanyUniverse: number
  applicationCompanyUniverse: number
  additionalSourceOnlyOrganizations: number
  companiesResearched: number
  companiesWithConfirmedRelationship: number
  companiesResearchedWithoutConfirmedRelationship: number
  companiesPending: number
  distinctBodies: number
  bodiesWithAccessibleDirectories: number
  associationMemberRows: number
  distinctAssociationMemberCompanies: number
  additionalMemberCompaniesDiscovered: number
  proposedCompanyRecords: number
  relationshipsByStatus: Record<EvidenceStatus, number>
  identityWarnings: string[]
  scopeNotes: string[]
}

export interface IndustryIntelligenceDataset {
  bodies: IndustryBody[]
  relationships: CompanyBodyRelationship[]
  members: AssociationMember[]
  leadership: IndustryLeader[]
  networks: RecruitmentNetwork[]
  classifications: RecruitmentClassification[]
  proposedCompanies: ProposedCompany[]
  coverage: CoverageReport
}
