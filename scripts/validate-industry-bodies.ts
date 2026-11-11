// Market-intelligence quality gate: installed in npm run build and CI.
import { organizations, industries } from '../src/data/organizations/load'
import { talentTracks } from '../src/data/tracks'
import { getTaxonomyNodeIds } from '../src/data/taxonomy/load'
import { industryBodies, companyBodyLinks, bodyDirectoryLeads, bodyResearchCoverage } from '../src/data/organizations/industryBodies'
import { validateIndustryBodyIntelligence } from '../src/data/organizations/industryBodiesQuality'

const errors = validateIndustryBodyIntelligence({
  bodies: industryBodies,
  links: companyBodyLinks,
  leads: bodyDirectoryLeads,
  coverage: bodyResearchCoverage,
  organizationIds: new Set(organizations.map((organization) => organization.id)),
  industryIds: new Set(industries.map((industry) => industry.id)),
  taxonomyNodeIds: new Set(getTaxonomyNodeIds()),
  trackSlugs: new Set(talentTracks.map((track) => track.slug)),
})

const pending = bodyResearchCoverage.filter((record) => record.status !== 'reviewed')
process.stdout.write(JSON.stringify({
  bodies: industryBodies.length,
  canonicalCompanyLinks: companyBodyLinks.length,
  directoryLeads: bodyDirectoryLeads.length,
  researchScopes: bodyResearchCoverage.length,
  pendingResearchScopes: pending.length,
  errors: errors.length,
  detail: errors.slice(0, 30),
}, null, 2) + '\n')
if (errors.length) process.exitCode = 1
