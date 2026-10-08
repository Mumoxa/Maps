// Validator for the canonical organization model. Runs in the build gate.
//
//   npm run validate:organizations
//
// Fails the build on identity, classification and relationship errors; prints
// warnings (stale verification, unsourced locations) and coverage so gaps are
// visible instead of silent.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runQualityChecks } from '../src/data/organizations/quality'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import type {
  Capability,
  CompanyAssociation,
  Industry,
  Organization,
  OrganizationRelationship,
  RecruiterIntelligence,
} from '../src/data/organizations/types'

const DIR = resolve('markets/organizations')

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(resolve(DIR, name), 'utf8')) as T
}

function main() {
  const industries = readJson<Industry[]>('industries.json')
  const capabilities = readJson<Capability[]>('capabilities.json')
  const organizations = readJson<Organization[]>('organizations.json')
  const relationships = readJson<OrganizationRelationship[]>('corporate-relationships.json')
  const associations = readJson<CompanyAssociation[]>('associations.json')
  const intelligence = readJson<RecruiterIntelligence[]>('recruiter-intelligence.json')

  const issues = runQualityChecks({
    organizations,
    industries,
    capabilities,
    relationships,
    associations,
    intelligence,
  })

  const errors = issues.filter((issue) => issue.severity === 'error')
  const warnings = issues.filter((issue) => issue.severity === 'warning')

  const pockets = new Map<string, number>()
  const industryById = new Map(industries.map((industry) => [industry.id, industry]))
  for (const organization of organizations) {
    for (const link of organization.industries) {
      const pocket = industryById.get(link.industryId)?.pocket ?? 'unclassified'
      pockets.set(pocket, (pockets.get(pocket) ?? 0) + 1)
    }
  }

  const canonicalNames = new Set(organizations.map((organization) => canonicalCompanyName(organization.name).toLowerCase()))
  const withWebsite = organizations.filter((organization) => organization.website !== '').length
  const withScale = organizations.filter((organization) => organization.scale.length > 0).length
  const withCapabilities = organizations.filter((organization) => organization.capabilities.some((link) => link.status === 'observed')).length
  const withLocations = organizations.filter((organization) => organization.locations.length > 0).length

  process.stdout.write(`${JSON.stringify({
    organizations: organizations.length,
    canonicalNames: canonicalNames.size,
    industries: industries.length,
    capabilities: capabilities.length,
    relationships: relationships.length,
    curatedAssociations: associations.length,
    recruiterObservations: intelligence.length,
    perPocket: Object.fromEntries([...pockets.entries()].sort((left, right) => right[1] - left[1])),
    coverage: {
      withWebsite,
      withScale,
      withLocations,
      withEvidencedCapabilities: withCapabilities,
      pendingVerification: organizations.filter((organization) => organization.status !== 'verified').length,
    },
    errors: errors.length,
    warnings: warnings.length,
    errorDetail: errors.slice(0, 20),
    warningDetail: warnings.slice(0, 10),
  }, null, 2)}\n`)

  if (errors.length > 0) {
    process.stderr.write(`${errors.length} organization data-quality error(s); see errorDetail above.\n`)
    process.exitCode = 1
  }
}

main()
