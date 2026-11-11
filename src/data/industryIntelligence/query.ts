import { bodyById, industryIntelligence, recruitmentClassifications } from './load'
import type { AssociationMember, CompanyBodyRelationship, EvidenceStatus, IndustryBody, ParticipantType } from './types'

export interface IntelligenceFilters {
  query: string
  bodyId: string
  category: string
  status: '' | EvidenceStatus
  participantType: '' | ParticipantType
  region: string
  networkId: string
  tier: '' | '1' | '2' | '3'
}

export const emptyIntelligenceFilters: IntelligenceFilters = {
  query: '', bodyId: '', category: '', status: '', participantType: '', region: '', networkId: '', tier: '',
}

const normalized = (value: string) => value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

function matchesText(member: AssociationMember, query: string): boolean {
  const body = bodyById.get(member.bodyId)
  const haystack = [
    member.companyName, member.originalDirectoryName, member.membershipCategory, member.industryNiche,
    member.location, member.participantType, body?.officialName ?? '', body?.acronym ?? '',
    ...(body?.industries ?? []), ...(body?.subIndustries ?? []),
  ].join(' ')
  return normalized(haystack).includes(normalized(query.trim()))
}

function classificationMap(networkId: string): Map<string, 1 | 2 | 3> {
  return new Map(recruitmentClassifications.filter((item) => item.networkId === networkId).map((item) => [item.memberId, item.tier]))
}

export function filterAssociationMembers(filters: IntelligenceFilters): AssociationMember[] {
  const tiers = filters.networkId ? classificationMap(filters.networkId) : null
  return industryIntelligence.members.filter((member) => {
    const body = bodyById.get(member.bodyId)
    if (filters.query && !matchesText(member, filters.query)) return false
    if (filters.bodyId && member.bodyId !== filters.bodyId) return false
    if (filters.category && body?.category !== filters.category) return false
    if (filters.status && member.verificationStatus !== filters.status) return false
    if (filters.participantType && member.participantType !== filters.participantType) return false
    if (filters.region && !normalized(member.location).includes(normalized(filters.region))) return false
    if (tiers) {
      const tier = tiers.get(member.id)
      if (!tier) return false
      if (filters.tier && tier !== Number(filters.tier)) return false
    } else if (filters.tier) return false
    return true
  })
}

export function filterIndustryBodies(filters: IntelligenceFilters): IndustryBody[] {
  const matchingMemberBodies = new Set(filterAssociationMembers({ ...filters, bodyId: '', category: '' }).map((member) => member.bodyId))
  return industryIntelligence.bodies.filter((body) => {
    if (filters.bodyId && body.id !== filters.bodyId) return false
    if (filters.category && body.category !== filters.category) return false
    const text = normalized([body.officialName, body.acronym, ...body.industries, ...body.subIndustries, ...body.geographicCoverage].join(' '))
    const memberMatch = filters.query && industryIntelligence.members.some((member) => member.bodyId === body.id && matchesText(member, filters.query))
    if (filters.query && !text.includes(normalized(filters.query.trim())) && !memberMatch) return false
    if ((filters.status || filters.participantType || filters.region || filters.networkId || filters.tier) && !matchingMemberBodies.has(body.id)) return false
    if (filters.region && !body.geographicCoverage.some((region) => normalized(region).includes(normalized(filters.region))) && !matchingMemberBodies.has(body.id)) return false
    return true
  })
}

export function filterCompanyRelationships(filters: IntelligenceFilters): CompanyBodyRelationship[] {
  const memberIds = new Set(filterAssociationMembers({ ...filters, status: '' }).map((member) => member.id))
  return industryIntelligence.relationships.filter((relationship) => {
    const body = bodyById.get(relationship.bodyId)
    if (filters.status && relationship.status !== filters.status) return false
    if (filters.bodyId && relationship.bodyId !== filters.bodyId) return false
    if (filters.category && body?.category !== filters.category) return false
    if (filters.participantType) {
      const member = industryIntelligence.members.find((item) => item.companyId === relationship.companyId && item.bodyId === relationship.bodyId)
      if (member?.participantType !== filters.participantType) return false
    }
    const representedByMember = industryIntelligence.members.some((member) => member.companyId === relationship.companyId && member.bodyId === relationship.bodyId && memberIds.has(member.id))
    const text = normalized([relationship.companyName, body?.officialName ?? '', body?.acronym ?? '', relationship.industry, relationship.subIndustry, relationship.jurisdiction, relationship.membershipCategory].join(' '))
    if (filters.query && !text.includes(normalized(filters.query.trim())) && !representedByMember) return false
    if (filters.region && !normalized(relationship.jurisdiction).includes(normalized(filters.region)) && !representedByMember) return false
    // Brief classifications belong only to directory participants. Committee
    // representation and Unknown research rows are not recruitment targets.
    if ((filters.networkId || filters.tier) && !representedByMember) return false
    return true
  })
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join('; ') : value === null || value === undefined ? '' : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function associationMembersCsv(rows: AssociationMember[], networkId = ''): string {
  const tiers = networkId ? classificationMap(networkId) : new Map<string, 1 | 2 | 3>()
  const header = ['member_id', 'body_id', 'body_name', 'company_id', 'company_name', 'original_directory_name', 'membership_category', 'participant_type', 'industry_niche', 'location', 'website', 'existing_maps_company', 'new_company_candidate', 'identity_status', 'verification_status', 'source_publication_date', 'last_checked', 'evidence_url', 'operation_names', 'brief_id', 'brief_tier', 'research_notes']
  const lines = rows.map((member) => [
    member.id, member.bodyId, bodyById.get(member.bodyId)?.officialName ?? '', member.companyId, member.companyName,
    member.originalDirectoryName, member.membershipCategory, member.participantType, member.industryNiche, member.location,
    member.website, member.existingMapsCompany, member.newCompanyCandidate, member.identityStatus, member.verificationStatus,
    member.sourcePublicationDate, member.lastChecked, member.evidenceUrl, member.operationNames, networkId, tiers.get(member.id) ?? '', member.researchNotes,
  ].map(csvCell).join(','))
  return [header.join(','), ...lines].join('\n')
}
