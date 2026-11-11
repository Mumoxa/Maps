import raw from './dataset.json'
import type {
  AssociationMember,
  CompanyBodyRelationship,
  IndustryBody,
  IndustryIntelligenceDataset,
  RecruitmentClassification,
} from './types'

/** Generated from the saved evidence records by scripts/build-industry-intelligence.ts. */
export const industryIntelligence = raw as IndustryIntelligenceDataset
export const industryBodies = industryIntelligence.bodies
export const associationMembers = industryIntelligence.members
export const companyBodyRelationships = industryIntelligence.relationships
export const recruitmentNetworks = industryIntelligence.networks
export const recruitmentClassifications = industryIntelligence.classifications

export const bodyById: ReadonlyMap<string, IndustryBody> = new Map(industryBodies.map((body) => [body.id, body]))
export const memberById: ReadonlyMap<string, AssociationMember> = new Map(associationMembers.map((member) => [member.id, member]))

export function relationshipsForCompany(companyId: string): CompanyBodyRelationship[] {
  return companyBodyRelationships.filter((relationship) => relationship.companyId === companyId)
}

export function membersForBody(bodyId: string): AssociationMember[] {
  return associationMembers.filter((member) => member.bodyId === bodyId)
}

export function classificationsForNetwork(networkId: string): RecruitmentClassification[] {
  return recruitmentClassifications.filter((classification) => classification.networkId === networkId)
}
