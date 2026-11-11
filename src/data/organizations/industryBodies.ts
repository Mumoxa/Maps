// External industry-body intelligence is separate from company similarity and ownership.
// A directory listing is a research lead, NOT proven current membership or recruiting fit.
import bodiesRaw from '../../../markets/organizations/industry-body-intelligence/bodies.json'
import linksRaw from '../../../markets/organizations/industry-body-intelligence/company-links.json'
import leadsRaw from '../../../markets/organizations/industry-body-intelligence/directory-leads.json'
import coverageRaw from '../../../markets/organizations/industry-body-intelligence/coverage.json'

export type IndustryBodyCategory =
  | 'trade-association' | 'professional-body' | 'regulator' | 'chamber'
  | 'industry-forum' | 'sector-council' | 'standards-or-accreditation'
  | 'umbrella-body' | 'other'

export interface IndustryBody {
  id: string
  name: string
  acronym: string
  category: IndustryBodyCategory
  jurisdiction: string
  website: string
  membershipDirectoryUrl: string
  specialistNiches: string[]
  /** Existing Maps sourcing-industry ids; empty where the national taxonomy is more precise. */
  industryIds: string[]
  membershipBasis: 'voluntary' | 'statutory' | 'mixed' | 'not-applicable' | 'unknown'
  evidenceUrl: string
  checkedOn: string
  notes: string
}

export interface CompanyBodyLink {
  id: string
  organizationId: string
  bodyId: string
  relationship: 'member' | 'regulated-by' | 'accredited-by' | 'affiliated-with'
  memberCategory: string
  status: 'confirmed' | 'historical' | 'unverified'
  evidenceUrl: string
  evidence: string
  checkedOn: string
  /** Explicit entity covered; never automatically extend a holding company membership to subsidiaries. */
  entityScope: string
}

export interface BodyDirectoryLead {
  id: string
  bodyId: string
  publishedCompanyName: string
  /** Null until reconciled against a canonical Maps company ID. */
  organizationId: string | null
  category: 'producer-or-operator' | 'supplier-or-associate' | 'individual' | 'unknown'
  /** A directory entry does NOT prove current membership. */
  status: 'directory-listed' | 'historical' | 'unverified'
  sourceUrl: string
  checkedOn: string
  note: string
}

export interface IndustryBodyResearchCoverage {
  scopeType: 'market-track' | 'specialist-niche'
  scopeId: string
  status: 'not-started' | 'in-progress' | 'reviewed'
  checkedOn: string
  sourceUrls: string[]
  notes: string
}

export const industryBodies = bodiesRaw as IndustryBody[]
export const companyBodyLinks = linksRaw as CompanyBodyLink[]
export const bodyDirectoryLeads = leadsRaw as BodyDirectoryLead[]
export const bodyResearchCoverage = coverageRaw as IndustryBodyResearchCoverage[]

export const industryBodiesById = new Map(industryBodies.map((body) => [body.id, body]))
export const companyBodyLinksByOrganization = new Map<string, CompanyBodyLink[]>()
export const bodyDirectoryLeadsByBody = new Map<string, BodyDirectoryLead[]>()

for (const link of companyBodyLinks) {
  const rows = companyBodyLinksByOrganization.get(link.organizationId) ?? []
  rows.push(link)
  companyBodyLinksByOrganization.set(link.organizationId, rows)
}
for (const lead of bodyDirectoryLeads) {
  const rows = bodyDirectoryLeadsByBody.get(lead.bodyId) ?? []
  rows.push(lead)
  bodyDirectoryLeadsByBody.set(lead.bodyId, rows)
}
