import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import type { CompanyInventoryRecord, EvidenceStatus, IndustryIntelligenceDataset } from '../src/data/industryIntelligence/types'

const root = process.cwd()
const generated = path.join(root, 'markets/industry-intelligence/generated')
const dataset = JSON.parse(fs.readFileSync(path.join(generated, 'industry-intelligence.json'), 'utf8')) as IndustryIntelligenceDataset
const appDataset = JSON.parse(fs.readFileSync(path.join(root, 'src/data/industryIntelligence/dataset.json'), 'utf8')) as IndustryIntelligenceDataset
const inventory = JSON.parse(fs.readFileSync(path.join(generated, 'company-inventory.json'), 'utf8')) as CompanyInventoryRecord[]
const organizations = JSON.parse(fs.readFileSync(path.join(root, 'markets/organizations/organizations.json'), 'utf8')) as { id: string }[]
const failures: string[] = []
function check(condition: unknown, message: string) { if (!condition) failures.push(message) }
function uniqueIds(label: string, ids: string[]) {
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) failures.push(`${label}: duplicate id ${id}`)
    seen.add(id)
  }
}

check(JSON.stringify(dataset) === JSON.stringify(appDataset), 'Application dataset and canonical generated JSON differ')
uniqueIds('bodies', dataset.bodies.map((item) => item.id))
uniqueIds('members', dataset.members.map((item) => item.id))
uniqueIds('relationships', dataset.relationships.map((item) => item.id))
uniqueIds('leadership', dataset.leadership.map((item) => item.id))
uniqueIds('networks', dataset.networks.map((item) => item.id))
uniqueIds('classifications', dataset.classifications.map((item) => item.id))
uniqueIds('proposed companies', dataset.proposedCompanies.map((item) => item.id))
uniqueIds('inventory', inventory.map((item) => item.companyId))

const bodyIds = new Set(dataset.bodies.map((body) => body.id))
const memberIds = new Set(dataset.members.map((member) => member.id))
const networkIds = new Set(dataset.networks.map((network) => network.id))
const inventoryIds = new Set(inventory.map((record) => record.companyId))
const canonicalIds = new Set(organizations.map((organization) => organization.id))
const proposedIds = new Set(dataset.proposedCompanies.map((company) => company.id))
const statuses: EvidenceStatus[] = ['Confirmed', 'Historical', 'Unverified', 'Unknown', 'Not applicable']

for (const body of dataset.bodies) {
  check(body.sourceUrl.startsWith('http'), `${body.id}: missing official source URL`)
  check(body.lastVerified === '2026-11-11', `${body.id}: stale batch verification date`)
  if (body.parentBodyId) check(bodyIds.has(body.parentBodyId), `${body.id}: missing parent body`)
  body.umbrellaBodyIds.forEach((id) => check(bodyIds.has(id), `${body.id}: missing umbrella body ${id}`))
}
for (const member of dataset.members) {
  check(bodyIds.has(member.bodyId), `${member.id}: missing body`)
  check(member.evidenceUrl.startsWith('http'), `${member.id}: missing evidence URL`)
  check(member.lastChecked === '2026-11-11', `${member.id}: stale checked date`)
  check(statuses.includes(member.verificationStatus), `${member.id}: invalid status`)
  check(member.companyId && member.companyName && member.originalDirectoryName, `${member.id}: incomplete identity`)
  check(member.identityStatus !== 'resolved' || member.existingMapsCompany === 'Yes', `${member.id}: resolved identity not labelled existing`)
  check(member.identityStatus !== 'proposed' || member.newCompanyCandidate === 'Yes', `${member.id}: proposed identity not labelled candidate`)
  check(member.identityStatus !== 'proposed' || proposedIds.has(member.companyId!), `${member.id}: proposed company record missing`)
  check(member.bodyId !== 'body-iqsa' || member.participantType === 'individual', `${member.id}: IQSA company membership is prohibited`)
}
for (const relationship of dataset.relationships) {
  check(bodyIds.has(relationship.bodyId), `${relationship.id}: missing body`)
  check(relationship.evidenceUrl.startsWith('http'), `${relationship.id}: missing evidence URL`)
  check(statuses.includes(relationship.status), `${relationship.id}: invalid status`)
  check(relationship.bodyId !== 'body-codi' || relationship.participationBasis === 'Mandatory', `${relationship.id}: CODI must be mandatory statutory participation`)
  check(relationship.bodyId !== 'body-prudential-authority' || relationship.relationshipType === 'regulation', `${relationship.id}: PA register must be regulation, not membership`)
  check(relationship.bodyId !== 'body-aspasa' || relationship.status !== 'Confirmed', `${relationship.id}: no current company ASPASA membership may be claimed from historical artwork`)
  check(relationship.relationshipType !== 'committee-representation' || relationship.represents === 'individual', `${relationship.id}: committee role must belong to an individual`)
}
const saturc = dataset.relationships.filter((relationship) => relationship.companyName === 'SATURC')
check(saturc.length === 1 && saturc[0].status === 'Unknown', 'SATURC ASPASA membership must be one explicit Unknown relationship')
check(!dataset.members.some((member) => member.companyName === 'SATURC'), 'SATURC must not be inserted as an ASPASA directory member')
check(dataset.leadership.every((leader) => leader.verificationStatus === 'Historical' && leader.evidenceDate === '2025'), 'ASPASA leadership must remain dated 2025 Historical evidence')
for (const proposed of dataset.proposedCompanies) {
  check(!canonicalIds.has(proposed.id), `${proposed.id}: proposed company collides with canonical organization`)
  check(proposed.evidenceUrls.length > 0, `${proposed.id}: proposed company lacks evidence`)
}
for (const classification of dataset.classifications) {
  check(memberIds.has(classification.memberId), `${classification.id}: missing member`)
  check(networkIds.has(classification.networkId), `${classification.id}: missing network`)
  const member = dataset.members.find((item) => item.id === classification.memberId)
  if (classification.tier === 1 && member) {
    check(!['associate-supplier', 'association', 'professional-services', 'educational-institution'].includes(member.participantType), `${classification.id}: supplier/body cannot be automatic Tier 1`)
  }
  check(classification.rationale.length > 30 && classification.evidenceUrl.startsWith('http'), `${classification.id}: tier rationale or evidence missing`)
}

const statusCounts = Object.fromEntries(statuses.map((status) => [status, dataset.relationships.filter((relationship) => relationship.status === status).length])) as Record<EvidenceStatus, number>
const expectedCoverage = {
  sourceCompanyUniverse: inventory.length,
  applicationCompanyUniverse: inventory.filter((record) => record.identityKind !== 'additional-source-only').length,
  additionalSourceOnlyOrganizations: inventory.filter((record) => record.identityKind === 'additional-source-only').length,
  companiesResearched: inventory.filter((record) => record.researchStatus === 'researched').length,
  companiesWithConfirmedRelationship: inventory.filter((record) => record.confirmedBodyRelationships > 0).length,
  companiesResearchedWithoutConfirmedRelationship: inventory.filter((record) => record.researchStatus === 'researched' && record.confirmedBodyRelationships === 0).length,
  companiesPending: inventory.filter((record) => record.researchStatus === 'pending').length,
  distinctBodies: dataset.bodies.length,
  bodiesWithAccessibleDirectories: dataset.bodies.filter((body) => ['public-list', 'public-searchable'].includes(body.membershipListAvailability)).length,
  associationMemberRows: dataset.members.length,
  distinctAssociationMemberCompanies: new Set(dataset.members.map((member) => member.companyId)).size,
  additionalMemberCompaniesDiscovered: new Set(dataset.members.filter((member) => member.newCompanyCandidate === 'Yes').map((member) => member.companyId)).size,
  proposedCompanyRecords: dataset.proposedCompanies.length,
  relationshipsByStatus: statusCounts,
}
for (const [key, expected] of Object.entries(expectedCoverage)) {
  const actual = dataset.coverage[key as keyof typeof expectedCoverage]
  check(JSON.stringify(actual) === JSON.stringify(expected), `coverage.${key}: saved ${JSON.stringify(actual)} != recalculated ${JSON.stringify(expected)}`)
}
for (const record of inventory) {
  const relationships = dataset.relationships.filter((relationship) => relationship.companyId === record.companyId)
  if (relationships.length === 0) {
    check(record.researchStatus === 'pending', `${record.companyId}: no relationships but marked researched`)
    continue
  }
  check(inventoryIds.has(record.companyId), `${record.companyId}: missing inventory identity`)
  check(record.researchStatus === 'researched', `${record.companyId}: relationships exist but research pending`)
  for (const status of ['Confirmed', 'Historical', 'Unverified', 'Unknown'] as const) {
    const field = { Confirmed: 'confirmedBodyRelationships', Historical: 'historicalBodyRelationships', Unverified: 'unverifiedBodyRelationships', Unknown: 'unknownBodyRelationships' }[status] as keyof CompanyInventoryRecord
    check(record[field] === relationships.filter((relationship) => relationship.status === status).length, `${record.companyId}: ${status} relationship count differs`)
  }
}

const exportExpectations: [string, number][] = [
  ['industry-body-master-directory.csv', dataset.bodies.length],
  ['company-membership-map.csv', dataset.relationships.length],
  ['association-member-directory.csv', dataset.members.length],
  ['industry-leadership.csv', dataset.leadership.length],
  ['recruitment-networks.csv', dataset.networks.length],
  ['recruitment-classifications.csv', dataset.classifications.length],
  ['proposed-companies.csv', dataset.proposedCompanies.length],
  ['company-inventory.csv', inventory.length],
]
for (const [file, expected] of exportExpectations) {
  const rows = parse(fs.readFileSync(path.join(root, 'markets/industry-intelligence/exports', file), 'utf8'), { columns: true, skip_empty_lines: true }) as Record<string, string>[]
  check(rows.length === expected, `${file}: ${rows.length} rows != ${expected}`)
}

if (failures.length) {
  console.error(JSON.stringify({ status: 'fail', failures }, null, 2))
  process.exit(1)
}
console.log(JSON.stringify({
  status: 'ok', bodies: dataset.bodies.length, memberRows: dataset.members.length, relationships: dataset.relationships.length,
  inventory: inventory.length, proposedCompanies: dataset.proposedCompanies.length, classifications: dataset.classifications.length,
  coverage: expectedCoverage, csvFilesChecked: exportExpectations.length,
}, null, 2))
