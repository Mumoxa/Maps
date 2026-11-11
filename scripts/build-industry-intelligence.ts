import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { organizationTaxonomy } from '../src/data/organizations/taxonomyPlacement'
import { directorySeedGroups, type DirectorySeedGroup } from '../markets/industry-intelligence/source/directory-seeds'
import { financialSeedGroups } from '../markets/industry-intelligence/source/financial-seeds'
import { agribusinessSeedGroups } from '../markets/industry-intelligence/source/agribusiness-seeds'
import { propertySeedGroups } from '../markets/industry-intelligence/source/property-seeds'
import { regulatorSeedGroups } from '../markets/industry-intelligence/source/regulator-seeds'
import type {
  AssociationMember,
  CompanyBodyRelationship,
  CompanyInventoryRecord,
  CoverageReport,
  EvidenceStatus,
  IndustryBody,
  IndustryIntelligenceDataset,
  IndustryLeader,
  ParticipantType,
  ProposedCompany,
  RecruitmentClassification,
  RecruitmentNetwork,
} from '../src/data/industryIntelligence/types'
import type { Company } from '../src/data/types'

const CHECKED_ON = '2026-11-11'
const root = process.cwd()
const outDir = path.join(root, 'markets/industry-intelligence')
const generatedDir = path.join(outDir, 'generated')
const exportDir = path.join(outDir, 'exports')
fs.mkdirSync(generatedDir, { recursive: true })
fs.mkdirSync(exportDir, { recursive: true })
const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const readJsonl = (file: string) => fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
const bodies = readJson('markets/industry-intelligence/source/industry-bodies.json') as IndustryBody[]
const bodyById = new Map(bodies.map((body) => [body.id, body]))
const reviewedIdentityNotes: Record<string, string> = {
  AgriMark: ' KAL Group’s official history identifies Agrimark as its customer-facing brand and records the 2024 operating-company rename; the canonical Maps record already includes the Agrimark alias. The directory name remains preserved rather than replacing it with a group-parent name.',
  'Kaap Agri Bedryf Ltd': ' This is an existing canonical alias. KAL Group’s official history records that the operating company became Agrimark Operations Limited on 1 March 2024; the association’s published name remains preserved.',
}
const companies = readJson('companies.json') as Company[]
const intelligence = buildCompanyIntelligence({
  creditRiskCompanies: companies.map((company) => ({ name: company.name, segment: company.segment, profileCount: company.profile_count ?? 0 })),
})

export function normalizeIdentity(value: string): string {
  return value
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/&/g, ' and ')
    .replace(/\b(proprietary|limited|ltd|pty|incorporated|inc|soc|npc|cc|plc|rf)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ')
}
const slug = (value: string) => normalizeIdentity(value).replace(/\s+/g, '-').slice(0, 90) || 'unnamed'
const hash = (value: string) => crypto.createHash('sha1').update(value).digest('hex').slice(0, 10)
const unique = <T,>(values: T[]) => [...new Set(values)]

interface IdentityEntry {
  id: string
  name: string
  legalName?: string
  aliases?: string[]
  kind: CompanyInventoryRecord['identityKind']
}
const identities: IdentityEntry[] = intelligence.all.map((org) => ({
  id: org.id,
  name: org.name,
  legalName: org.legalName,
  aliases: org.aliases,
  kind: org.datasets.includes('organizations') || org.id.startsWith('org-') && intelligence.index.organizations.some((item) => item.id === org.id) ? 'curated' : 'dataset-only',
}))
const curatedIds = new Set(intelligence.index.organizations.map((org) => org.id))
for (const identity of identities) identity.kind = curatedIds.has(identity.id) ? 'curated' : 'dataset-only'

const inventory = new Map<string, CompanyInventoryRecord>()
for (const org of intelligence.all) {
  const taxonomy = organizationTaxonomy(org)
  inventory.set(org.id, {
    companyId: org.id,
    companyName: org.name,
    identityKind: curatedIds.has(org.id) ? 'curated' : 'dataset-only',
    canonicalName: org.legalName || org.name,
    sourceNames: unique([org.name, ...org.aliases]),
    sourceRecordIds: [org.id],
    sourceFiles: [curatedIds.has(org.id) ? 'markets/organizations/organizations.json' : 'composed application datasets'],
    datasets: [...org.datasets],
    taxonomyNode: taxonomy.entries[0]?.node.id ?? '',
    identityStatus: 'application-resolved',
    researchStatus: 'pending',
    confirmedBodyRelationships: 0,
    historicalBodyRelationships: 0,
    unverifiedBodyRelationships: 0,
    unknownBodyRelationships: 0,
  })
}

const sourceInputs: { file: string; dataset: string; records: { id: string; name: string; canonicalId?: string }[] }[] = []
function addPeopleSource(file: string, dataset: string, employerField = 'employer') {
  const rows = readJson(file) as Record<string, unknown>[]
  sourceInputs.push({ file, dataset, records: rows.filter((row) => typeof row[employerField] === 'string' && String(row[employerField]).trim()).map((row, index) => ({ id: String(row.id ?? `${dataset}-${index + 1}`), name: String(row[employerField]).trim() })) })
}
addPeopleSource('markets/salesforce/people.json', 'salesforce')
addPeopleSource('markets/data-science-ml/people.json', 'data-science-ml')
addPeopleSource('markets/hackathons/people.json', 'hackathons')
addPeopleSource('markets/ca-sa-western-cape/people.json', 'ca-sa-western-cape')
const propertyLeads = readJson('markets/organizations/research/property-workspace-leads-2026-10-09.json')
sourceInputs.push({
  file: 'markets/organizations/research/property-workspace-leads-2026-10-09.json', dataset: 'property-workspace-leads',
  records: propertyLeads.companyLeads.map((lead: { workspaceRow: number; workspaceName: string; canonicalOrganizationId?: string }) => ({ id: `workspace-${lead.workspaceRow}`, name: lead.workspaceName, canonicalId: lead.canonicalOrganizationId || undefined })),
})
const accountantCompanies = readJsonl('markets/accountants/companies.jsonl') as Record<string, unknown>[]
sourceInputs.push({
  file: 'markets/accountants/companies.jsonl', dataset: 'accountants-companies',
  records: accountantCompanies.map((row, index) => ({ id: String(row.id ?? `accountant-company-${index + 1}`), name: String(row.company_name ?? row.companyName ?? row.name ?? '').trim() })).filter((row) => row.name),
})

const appIdentityByName = new Map<string, IdentityEntry[]>()
function indexIdentity(identity: IdentityEntry) {
  for (const sourceName of [identity.name, identity.legalName ?? '', ...(identity.aliases ?? [])]) {
    const key = normalizeIdentity(sourceName)
    if (!key) continue
    const matches = appIdentityByName.get(key) ?? []
    if (!matches.some((match) => match.id === identity.id)) matches.push(identity)
    appIdentityByName.set(key, matches)
  }
}
identities.forEach(indexIdentity)
const additionalByNormalizedName = new Map<string, string>()
const unresolvedSourceNames = new Set<string>()
for (const source of sourceInputs) {
  for (const record of source.records) {
    const key = normalizeIdentity(record.name)
    if (!key) continue
    let companyId = record.canonicalId && inventory.has(record.canonicalId) ? record.canonicalId : undefined
    if (!companyId) {
      const matches = appIdentityByName.get(key) ?? []
      if (matches.length === 1) companyId = matches[0].id
      else if (matches.length > 1) unresolvedSourceNames.add(`${record.name}: ${matches.map((match) => match.id).join(', ')}`)
    }
    if (!companyId) companyId = additionalByNormalizedName.get(key)
    if (!companyId) {
      companyId = `source-${slug(record.name)}-${hash(key)}`
      additionalByNormalizedName.set(key, companyId)
      identities.push({ id: companyId, name: record.name, kind: 'additional-source-only' })
      inventory.set(companyId, {
        companyId, companyName: record.name, identityKind: 'additional-source-only', canonicalName: record.name,
        sourceNames: [record.name], sourceRecordIds: [], sourceFiles: [], datasets: [], taxonomyNode: '',
        identityStatus: 'exact-source-name-only; not merged into the application universe', researchStatus: 'pending',
        confirmedBodyRelationships: 0, historicalBodyRelationships: 0, unverifiedBodyRelationships: 0, unknownBodyRelationships: 0,
      })
    }
    const item = inventory.get(companyId)!
    item.sourceNames = unique([...item.sourceNames, record.name])
    item.sourceRecordIds = unique([...item.sourceRecordIds, `${source.dataset}:${record.id}`])
    item.sourceFiles = unique([...item.sourceFiles, source.file])
    item.datasets = unique([...item.datasets, source.dataset])
  }
}
// Additional exact source names are eligible for reviewed, exact-only directory matching.
identities.filter((identity) => identity.kind === 'additional-source-only').forEach(indexIdentity)

const groups: DirectorySeedGroup[] = [...directorySeedGroups, ...financialSeedGroups, ...agribusinessSeedGroups, ...propertySeedGroups, ...regulatorSeedGroups]
const members: AssociationMember[] = []
const relationships: CompanyBodyRelationship[] = []
const proposedByName = new Map<string, ProposedCompany>()
const reviewedCanonicalIds = new Set(identities.map((identity) => identity.id))
const financialBrandBlocklist = new Set(['absa', 'absa bank', 'nedbank', 'standard bank', 'standard bank of s a', 'firstrand', 'firstrand bank', 'firsthand bank', 'investec', 'investec bank', 'discovery', 'momentum', 'hollard', 'old mutual', 'sanlam', 'liberty'])
const nonCompanyTypes = new Set<ParticipantType>(['association', 'educational-institution', 'public-institution', 'individual'])

function proposedFor(name: string, website: string, niche: string, location: string, bodyId: string, evidenceUrl: string): ProposedCompany {
  const key = normalizeIdentity(name)
  const existing = proposedByName.get(key)
  if (existing) {
    existing.sourceNames = unique([...existing.sourceNames, name])
    existing.websites = unique([...existing.websites, ...(website ? [website] : [])])
    existing.industryNiches = unique([...existing.industryNiches, niche])
    existing.locations = unique([...existing.locations, ...location.split(';').map((item) => item.trim()).filter(Boolean)])
    existing.discoveredThroughBodyIds = unique([...existing.discoveredThroughBodyIds, bodyId])
    existing.evidenceUrls = unique([...existing.evidenceUrls, evidenceUrl])
    return existing
  }
  const proposed: ProposedCompany = {
    id: `proposed-${slug(name)}`, name, sourceNames: [name], websites: website ? [website] : [], industryNiches: [niche],
    locations: location.split(';').map((item) => item.trim()).filter(Boolean), discoveredThroughBodyIds: [bodyId], evidenceUrls: [evidenceUrl],
    status: 'proposed-unverified', notes: 'Discovered in a cited external directory. This is not an approved Maps organization record; legal identity and canonical placement require review.',
  }
  proposedByName.set(key, proposed)
  return proposed
}

function resolveDirectoryIdentity(name: string, bodyId: string, participantType: ParticipantType, reviewedId: string, website: string, niche: string, location: string, evidenceUrl: string) {
  if (reviewedId) {
    if (!reviewedCanonicalIds.has(reviewedId)) throw new Error(`Unknown reviewed canonical id ${reviewedId} for ${name}`)
    const canonical = identities.find((identity) => identity.id === reviewedId)!
    return { companyId: reviewedId, companyName: canonical.name, identityStatus: 'resolved' as const, proposed: null }
  }
  if (participantType === 'association') {
    const relatedBody = bodies.find((body) => normalizeIdentity(body.officialName) === normalizeIdentity(name) || normalizeIdentity(body.acronym) === normalizeIdentity(name))
    return { companyId: relatedBody?.id ?? `external-body-${slug(name)}`, companyName: name, identityStatus: 'body-reference' as const, proposed: null, relatedBodyId: relatedBody?.id ?? null }
  }
  const ambiguousName = name.includes(' / ') || ['JMG', 'SA Roads', 'Senzani', 'Thalami', 'Alchemy', 'Carpe Diem', 'Golden Rewards', 'Much', 'ALS', 'Nonduna', 'ZM', 'Moedi', 'Manka', 'Actop', 'V M', 'FIRSTHAND BANK LIMITED'].includes(name)
  if (ambiguousName) return { companyId: `unresolved-${slug(name)}-${hash(name)}`, companyName: name, identityStatus: 'unresolved' as const, proposed: null }
  const key = normalizeIdentity(name)
  const matches = appIdentityByName.get(key) ?? []
  const blockParentBrand = ['body-basa', 'body-codi', 'body-asisa', 'body-saia', 'body-prudential-authority'].includes(bodyId) && financialBrandBlocklist.has(key)
  if (matches.length === 1 && !blockParentBrand) {
    return { companyId: matches[0].id, companyName: matches[0].name, identityStatus: 'resolved' as const, proposed: null }
  }
  if (matches.length > 1 || nonCompanyTypes.has(participantType)) {
    return { companyId: `unresolved-${slug(name)}-${hash(name)}`, companyName: name, identityStatus: 'unresolved' as const, proposed: null }
  }
  const proposed = proposedFor(name, website, niche, location, bodyId, evidenceUrl)
  return { companyId: proposed.id, companyName: proposed.name, identityStatus: 'proposed' as const, proposed }
}

for (const group of groups) {
  const body = bodyById.get(group.bodyId)
  if (!body) throw new Error(`Unknown body ${group.bodyId}`)
  const rows = group.rows.split(/\r?\n/).map((row) => row.trim()).filter(Boolean)
  for (const row of rows) {
    const fields = row.split('|').map((field) => field.trim())
    if (fields.length !== 8) throw new Error(`Expected 8 fields for ${group.bodyId}: ${row}`)
    const [originalName, category, participantType, niche, website, operations, location, reviewedId] = fields as [string, string, ParticipantType, string, string, string, string, string]
    if (group.bodyId === 'body-minerals-council' && originalName === 'Aggregate & Sand Producers') continue // canonical body-to-body row is added once below
    const identity = resolveDirectoryIdentity(originalName, group.bodyId, participantType, reviewedId, website, niche, location, group.evidenceUrl)
    const memberId = `member-${group.bodyId.replace('body-', '')}-${hash(`${originalName}|${category}`)}`
    const operationNames = operations.split(';').map((item) => item.trim()).filter(Boolean)
    const unresolved = identity.identityStatus === 'unresolved'
    const status: EvidenceStatus = unresolved ? 'Unverified' : group.status
    const isProposed = identity.identityStatus === 'proposed'
    const member: AssociationMember = {
      id: memberId, bodyId: group.bodyId, companyId: identity.companyId, companyName: identity.companyName,
      originalDirectoryName: originalName, relatedBodyId: 'relatedBodyId' in identity ? identity.relatedBodyId ?? null : null,
      membershipCategory: category, participantType, industryNiche: niche, location, website,
      existingMapsCompany: identity.identityStatus === 'resolved' ? 'Yes' : 'No', newCompanyCandidate: isProposed ? 'Yes' : 'No',
      identityStatus: identity.identityStatus, evidenceUrl: group.evidenceUrl, sourcePublicationDate: group.sourcePublicationDate,
      lastChecked: CHECKED_ON, verificationStatus: status, operationNames,
      researchNotes: `${group.notes}${reviewedId ? ' The canonical link was explicitly reviewed against the existing name, legal name or alias; the source-reported directory name remains preserved.' : ''}${reviewedIdentityNotes[originalName] ?? ''}${unresolved ? ' Identity is quarantined: no automatic parent, brand or fuzzy-name merge was made.' : ''}`,
    }
    members.push(member)
    const relationshipType = group.bodyId === 'body-codi' ? 'membership' : body.category === 'regulator' ? 'regulation' : body.category === 'accreditation-body' ? 'accreditation' : body.category === 'certification-body' ? 'certification' : 'membership'
    relationships.push({
      id: `relationship-${hash(memberId)}`, companyId: identity.companyId, companyName: identity.companyName, bodyId: group.bodyId,
      relationshipType, membershipCategory: category, status, participationBasis: body.participationBasis,
      represents: participantType === 'association' ? 'association' : 'company', industry: body.industries[0], subIndustry: niche,
      jurisdiction: location || body.geographicCoverage.join('; '), effectiveDate: group.bodyId === 'body-mbawc' ? '' : group.sourcePublicationDate,
      expiryDate: '', evidenceUrl: group.evidenceUrl, sourcePublicationDate: group.sourcePublicationDate, lastChecked: CHECKED_ON,
      confidence: status === 'Confirmed' ? (identity.identityStatus === 'resolved' || identity.identityStatus === 'proposed' ? 'High' : 'Low') : status === 'Historical' ? 'Medium' : 'Low',
      researchNotes: member.researchNotes,
    })
  }
}

// Body-to-body relationships are not flattened into company memberships.
const bodyNetworkMemberships: AssociationMember[] = [
  {
    id: 'member-minerals-council-aspasa', bodyId: 'body-minerals-council', companyId: 'body-aspasa', companyName: 'ASPASA', originalDirectoryName: 'Aggregate & Sand Producers', relatedBodyId: 'body-aspasa', membershipCategory: 'Association', participantType: 'association', industryNiche: 'Aggregates and sand', location: 'Southern Africa', website: 'https://aspasa.co.za/', existingMapsCompany: 'No', newCompanyCandidate: 'No', identityStatus: 'body-reference', evidenceUrl: 'https://www.mineralscouncil.org.za/about/members', sourcePublicationDate: '', lastChecked: CHECKED_ON, verificationStatus: 'Confirmed', operationNames: [], researchNotes: 'Direct association-member relationship published by the Minerals Council.',
  },
  {
    id: 'member-gain-aspasa', bodyId: 'body-gain', companyId: 'body-aspasa', companyName: 'ASPASA', originalDirectoryName: 'ASPASA', relatedBodyId: 'body-aspasa', membershipCategory: 'Full Member', participantType: 'association', industryNiche: 'Aggregates and sand', location: 'South Africa', website: 'https://aspasa.co.za/', existingMapsCompany: 'No', newCompanyCandidate: 'No', identityStatus: 'body-reference', evidenceUrl: 'https://www.gain.ie/gain-members', sourcePublicationDate: '', lastChecked: CHECKED_ON, verificationStatus: 'Confirmed', operationNames: [], researchNotes: 'GAIN full association member. Full Members are national associations with voting rights; this is not a company-member row.',
  },
]
for (const bodyMember of bodyNetworkMemberships) {
  members.push(bodyMember)
  relationships.push({
    id: `relationship-${hash(bodyMember.id)}`, companyId: bodyMember.companyId!, companyName: bodyMember.companyName, bodyId: bodyMember.bodyId,
    relationshipType: 'membership', membershipCategory: bodyMember.membershipCategory, status: 'Confirmed', participationBasis: 'Voluntary', represents: 'association', industry: bodyById.get(bodyMember.bodyId)!.industries[0], subIndustry: bodyMember.industryNiche, jurisdiction: bodyMember.location, effectiveDate: '', expiryDate: '', evidenceUrl: bodyMember.evidenceUrl, sourcePublicationDate: '', lastChecked: CHECKED_ON, confidence: 'High', researchNotes: bodyMember.researchNotes,
  })
}

const leadership: IndustryLeader[] = [
  ['Letisha van den Berg', 'ASPASA Director', 'ASPASA', 'Director', ''],
  ['Collin Ramukhubathi', 'ASPASA Chairperson & Director', 'Afrimat', 'Executive Director', 'org-afrimat'],
  ['Trevor McAdam', 'ASPASA Vice Chairperson & Director', 'CBM / DSS', 'Engineering Director', ''],
  ['Oscar Goudriaan', 'ASPASA Director', 'OMV', 'Managing Director', ''],
  ['Jeremy Hunter-Smith', 'MANCOM Member', 'Blurock Quarries', 'Chief Executive Officer', ''],
  ['Jacques Stokes', 'MANCOM Member', 'Afrimat', 'Managing Director (Construction Materials – North Cluster)', 'org-afrimat'],
  ['Glenn Johnson', 'MANCOM Member', 'AfriSam', 'CM Operations Executive', 'org-afrisam'],
  ['Victor Lupuwana', 'MANCOM Member', 'Aquarella', 'Managing Director', ''],
  ['Arthur Ndindani', 'MANCOM Member', 'PPC', 'General Manager Aggregates & Ash', ''],
  ['Herkie Sandenbergh', 'MANCOM Member', 'Raumix Aggregates', 'Managing Director', 'org-mbawc-related-f3c57e5312c5'],
].map(([individualName, associationRole, currentEmployer, corporateTitle, companyId]) => ({
  id: `leader-aspasa-${slug(individualName)}`, bodyId: 'body-aspasa', individualName, associationRole, currentEmployer, corporateTitle,
  professionalProfileUrl: '', companyId: companyId || null, evidenceUrl: 'https://aspasa.co.za/about/', evidenceDate: '2025', verifiedDate: CHECKED_ON,
  verificationStatus: 'Historical' as const, notes: 'Published under ASPASA MANCOM INFORMATION 2025. This is dated public leadership evidence, not a November 2026 current-role assertion, candidate-availability signal or personal contact record.',
}))
for (const leader of leadership.filter((leader) => leader.companyId)) {
  relationships.push({
    id: `relationship-${hash(leader.id)}`, companyId: leader.companyId!, companyName: leader.currentEmployer, bodyId: leader.bodyId,
    relationshipType: 'committee-representation', membershipCategory: leader.associationRole, status: 'Historical', participationBasis: 'Voluntary', represents: 'individual', industry: 'Mining, Quarrying & Extractive Industries', subIndustry: 'Aggregates and surface mining', jurisdiction: 'South Africa', effectiveDate: '2025', expiryDate: '', evidenceUrl: leader.evidenceUrl, sourcePublicationDate: '2025', lastChecked: CHECKED_ON, confidence: 'Medium', researchNotes: `${leader.individualName} was published in this 2025 role. Committee representation belongs to the individual and does not independently establish company membership or candidate availability.`,
  })
}

// The requested SATURC starting point is retained as an explicit negative research result, not a false non-member flag.
const saturc = proposedFor('SATURC', 'https://saturc.co.za/', 'Quarrying, aggregates and ready-mix concrete', 'Western Cape; Eastern Cape; Mpumalanga', 'body-aspasa', 'https://saturc.co.za/')
saturc.evidenceUrls = unique([...saturc.evidenceUrls, 'https://aspasa.co.za/member-list/', 'https://www.mineralscouncil.org.za/about/members'])
saturc.notes = 'Official company site supports the current SATURC identity and operations. June 2026 reporting supports acquisition of specified Afrimat quarry and ready-mix assets. Historical Afrimat association entries have not been transferred. The trading name Satork and ASPASA membership remain unconfirmed.'
relationships.push({
  id: 'relationship-saturc-aspasa-unknown', companyId: saturc.id, companyName: saturc.name, bodyId: 'body-aspasa', relationshipType: 'membership', membershipCategory: '', status: 'Unknown', participationBasis: 'Voluntary', represents: 'company', industry: 'Mining, Quarrying & Extractive Industries', subIndustry: 'Aggregates and ready-mix concrete', jurisdiction: 'South Africa', effectiveDate: '', expiryDate: '', evidenceUrl: 'https://aspasa.co.za/member-list/', sourcePublicationDate: '2025-03', lastChecked: CHECKED_ON, confidence: 'Unknown', researchNotes: saturc.notes,
})

const networks: RecruitmentNetwork[] = [
  {
    id: 'network-aggregates-saturc', industryName: 'Mining, Quarrying & Extractive Industries', specialistNiche: 'Aggregates, sand and quarry operations', targetCompanyName: 'SATURC',
    brief: 'Executive search for South African quarry and aggregates leadership adjacent to SATURC following its 2026 asset acquisition. Current employer, operation and legal-entity checks remain mandatory before outreach.',
    relevantBodyIds: ['body-aspasa', 'body-minerals-council', 'body-iqsa', 'body-gain', 'body-dmpr', 'body-mhsc', 'body-safcec'], geographicRelevance: ['Western Cape', 'Eastern Cape', 'Mpumalanga', 'South Africa'],
    tierCriteria: { tier1: 'Evidenced aggregate, sand or quarry producer/operator with directly relevant operations; historical rows are labelled and require currency review.', tier2: 'Adjacent industrial-mineral producer, cement/ready-mix operator or civil/crushing contractor with transferable operating leadership.', tier3: 'Equipment, consulting, association, safety or other ecosystem supplier; shared membership alone is not direct competition.' },
    researchCoverage: 'ASPASA 2025-artwork operators and associates; current Minerals Council list; SAFCEC homepage leads; DMPR/MHSC/IQSA/GAIN institutional roles. No current complete ASPASA company register and no transfer of historical Afrimat membership to SATURC.',
    evidenceUrls: ['https://aspasa.co.za/member-list/', 'https://www.mineralscouncil.org.za/about/members', 'https://saturc.co.za/', 'https://www.dmpr.gov.za/Branches/Mining-Minerals-Petroleum-Policy-Development/Operating-Mines'],
  },
  {
    id: 'network-grain-operations', industryName: 'Agriculture & Food Production', specialistNiche: 'Grain handling, storage and silo operations', targetCompanyName: 'AFGRI',
    brief: 'Executive search for grain handling, storage and agricultural operations leadership in South Africa.', relevantBodyIds: ['body-agbiz-grain', 'body-agbiz'], geographicRelevance: ['South Africa'],
    tierCriteria: { tier1: 'Current Agbiz Grain operator member with direct grain handling or storage participation.', tier2: 'Broader Agbiz producer or adjacent agribusiness operator without equivalent specialist-directory evidence.', tier3: 'Input, finance, insurance, professional-service or association participant; not a direct grain operator on this evidence.' },
    researchCoverage: 'All 13 current Agbiz Grain directory names and all categories on the Agbiz member page.', evidenceUrls: ['https://agbizgrain.co.za/content/about-us?page=ag-members', 'https://www.agbiz.co.za/about/members'],
  },
  {
    id: 'network-listed-property', industryName: 'Construction & Property', specialistNiche: 'JSE-listed REITs and commercial property', targetCompanyName: 'Growthpoint Properties',
    brief: 'Executive search for South African listed-property and REIT leadership.', relevantBodyIds: ['body-sa-reit', 'body-sapoa'], geographicRelevance: ['South Africa'],
    tierCriteria: { tier1: 'Current SA REIT member, explicitly a JSE-listed REIT registered in South Africa.', tier2: 'SAPOA property owner, developer or asset manager not in the current SA REIT register.', tier3: 'Property manager, broker, consultant, contractor, technology provider or other service participant.' },
    researchCoverage: 'All 21 current SA REIT members plus SAPOA directory pages 1–5 only; SAPOA pagination remains incomplete.', evidenceUrls: ['https://sareit.co.za/reit-members/', 'https://sapoa.org.za/membership-directory/'],
  },
  {
    id: 'network-asset-management', industryName: 'Financial Services', specialistNiche: 'Asset management and collective investment', targetCompanyName: 'Coronation Fund Managers',
    brief: 'Executive search for South African asset-management and collective-investment leadership.', relevantBodyIds: ['body-asisa'], geographicRelevance: ['South Africa'],
    tierCriteria: { tier1: 'Voting or ordinary member with explicit asset-management, collective-investment or investment-management niche.', tier2: 'Adjacent life, insurance, retirement, administration or wealth participant.', tier3: 'Affiliate supplier, professional-service firm, offshore associate or industry body.' },
    researchCoverage: 'All four official ASISA membership classes. Membership class and offshore status are retained.', evidenceUrls: ['https://www.asisa.org.za/about-us/membership/voting-members/', 'https://www.asisa.org.za/about-us/membership/non-voting-ordinary-members/', 'https://www.asisa.org.za/about-us/membership/non-voting-affiliate-members/', 'https://www.asisa.org.za/about-us/membership/non-voting-associate-members/'],
  },
  {
    id: 'network-non-life-insurance', industryName: 'Financial Services', specialistNiche: 'Non-life insurance and reinsurance', targetCompanyName: 'Santam',
    brief: 'Executive search for South African non-life insurance leadership.', relevantBodyIds: ['body-saia', 'body-asisa'], geographicRelevance: ['South Africa'],
    tierCriteria: { tier1: 'Current SAIA member operating as a non-life insurer or closely related specialist insurer.', tier2: 'Reinsurer or adjacent ASISA life/investment insurance participant.', tier3: 'Public institution, supplier or service participant with no direct insurer evidence in the saved row.' },
    researchCoverage: 'All rows exposed on the official SAIA page plus relevant ASISA classes. SAIA states 55 members but exposes 53 linked rows in the saved retrieval; only those 53 are imported and the discrepancy is reported.', evidenceUrls: [ 'https://saia.co.za/about-us/members/', 'https://www.asisa.org.za/about-us/membership/voting-members/' ],
  },
  {
    id: 'network-banking', industryName: 'Financial Services', specialistNiche: 'Commercial and mutual banking', targetCompanyName: 'Capitec Bank',
    brief: 'Executive search for South African commercial-banking leadership.', relevantBodyIds: ['body-basa', 'body-codi', 'body-prudential-authority', 'body-fsca'], geographicRelevance: ['South Africa'],
    tierCriteria: { tier1: 'Current BASA or CODI commercial-bank participant with a preserved legal or directory identity.', tier2: 'Foreign branch, mutual bank, co-operative bank or adjacent regulated entity.', tier3: 'Non-bank service provider; no Tier 3 bank rows are inferred solely from regulation.' },
    researchCoverage: 'All 29 BASA names and all CODI categories. PA locally controlled register was reviewed separately; CODI statutory participation and BASA voluntary membership are not merged.', evidenceUrls: ['https://banking.org.za/about-us/member-banks/', 'https://www.resbank.co.za/en/home/what-we-do/Deposit-insurance/member-banks0', 'https://www.resbank.co.za/content/dam/sarb/what-we-do/statistics/guides/institutional-sector-classification-guide-for-sa/2026/Deposit-taking%20corporations%20(Banks)%20-%20South%20African%20registered%20banks%20-%20Locally%20controlled.pdf'],
  },
]

const classifications: RecruitmentClassification[] = []
function classify(member: AssociationMember, networkId: string, tier: 1 | 2 | 3, rationale: string) {
  const guardedTier = tier === 1 && member.identityStatus !== 'resolved' ? 2 : tier
  const guardedRationale = guardedTier === tier ? rationale : `${rationale} Demoted to Tier 2 because exact identity resolution is not complete.`
  classifications.push({ id: `classification-${hash(`${networkId}|${member.id}`)}`, networkId, memberId: member.id, tier: guardedTier, rationale: guardedRationale, evidenceUrl: member.evidenceUrl, confidence: member.verificationStatus === 'Confirmed' ? 'High' : member.verificationStatus === 'Historical' ? 'Medium' : 'Low' })
}
for (const member of members) {
  if (member.bodyId === 'body-aspasa' && member.participantType !== 'association' && member.participantType !== 'educational-institution') {
    const direct = member.participantType === 'producer-operator' && /aggregate|sand|quarry|crushing|limestone|dimension stone|cement/i.test(member.industryNiche)
    classify(member, 'network-aggregates-saturc', direct ? 1 : member.participantType === 'producer-operator' || member.participantType === 'contractor' ? 2 : 3, direct ? 'Historical ASPASA producer/operator evidence names directly relevant aggregate, sand or quarry operations; confirm current operations and employer before use.' : member.participantType === 'producer-operator' || member.participantType === 'contractor' ? 'Adjacent surface-mining, industrial-mineral or contracting experience may transfer, but this is not direct evidence of equivalent aggregates competition.' : 'Associate supplier or service participant, not a direct producer on the saved evidence.')
  }
  if (member.bodyId === 'body-minerals-council' && member.companyId === 'org-afrimat') classify(member, 'network-aggregates-saturc', 1, 'Current Minerals Council Other minerals membership plus separately saved historical ASPASA aggregate operations; historical membership is not transferred to any acquirer.')
  if (member.bodyId === 'body-minerals-council' && member.originalDirectoryName === 'Corobrick (Pty) Limited') classify(member, 'network-aggregates-saturc', 2, 'Adjacent industrial-mineral producer, not a direct aggregate operator solely by this membership.')
  if (member.bodyId === 'body-safcec' && member.participantType !== 'association') classify(member, 'network-aggregates-saturc', 2, 'Unverified current SAFCEC logo lead in civil engineering; potentially adjacent contracting experience, not confirmed membership or direct aggregates competition.')
  if (member.bodyId === 'body-agbiz-grain') classify(member, 'network-grain-operations', 1, 'Current specialist Agbiz Grain operator-directory row.')
  if (member.bodyId === 'body-agbiz') classify(member, 'network-grain-operations', member.participantType === 'producer-operator' ? 2 : 3, member.participantType === 'producer-operator' ? 'Broader Agbiz producer evidence; use the Agbiz Grain row to establish direct specialist operations.' : 'Agbiz participant but not a direct grain operator on this row alone.')
  if (member.bodyId === 'body-sa-reit') classify(member, 'network-listed-property', 1, 'Current SA REIT member; the official page restricts this category to South African registered JSE-listed REITs.')
  if (member.bodyId === 'body-sapoa') classify(member, 'network-listed-property', ['Property Owners', 'Developers', 'Asset Managers', 'Property Development and Investment'].includes(member.membershipCategory) ? 2 : 3, ['Property Owners', 'Developers', 'Asset Managers', 'Property Development and Investment'].includes(member.membershipCategory) ? 'SAPOA owner/developer/asset-manager category is adjacent to listed property but does not itself establish REIT status.' : 'SAPOA service, professional or supplier category; not a direct listed-property operator on this evidence.')
  if (member.bodyId === 'body-asisa') {
    const assetTier = /asset management|collective investment|investment management|multi-management/i.test(member.industryNiche) && !member.membershipCategory.includes('Affiliate') && !member.membershipCategory.includes('Associate')
    const tier = assetTier ? 1 : member.participantType === 'financial-product-provider' && !member.membershipCategory.includes('Associate') ? 2 : 3
    classify(member, 'network-asset-management', tier, assetTier ? 'ASISA voting/ordinary directory row with explicit asset or collective investment niche.' : tier === 2 ? 'Adjacent savings, investment, insurance or administration participant; not automatically equivalent to an asset manager.' : 'Affiliate, offshore associate or professional-service participant, not a direct domestic asset-management competitor on this evidence.')
    if (/life|insurance|assurance/i.test(member.industryNiche)) classify(member, 'network-non-life-insurance', 2, 'Adjacent ASISA insurance or assurance participant; this is not proof of non-life operations equivalent to SAIA members.')
  }
  if (member.bodyId === 'body-saia') classify(member, 'network-non-life-insurance', /reinsurance/i.test(member.industryNiche) || member.participantType === 'public-institution' ? 2 : 1, /reinsurance/i.test(member.industryNiche) ? 'Current SAIA reinsurance participant; adjacent rather than identical to a direct non-life insurer brief.' : member.participantType === 'public-institution' ? 'Directory identity requires legal-entity and operating-model review before treating it as a direct insurer competitor.' : 'Current official SAIA non-life member-directory row.')
  if (member.bodyId === 'body-basa' || member.bodyId === 'body-codi' || member.bodyId === 'body-prudential-authority') classify(member, 'network-banking', /commercial banking/i.test(member.industryNiche) ? 1 : 2, /commercial banking/i.test(member.industryNiche) ? `Current ${member.bodyId === 'body-basa' ? 'BASA voluntary member-bank' : member.bodyId === 'body-codi' ? 'CODI statutory participant' : 'Prudential Authority registered-bank'} commercial-bank row; legal identity remains as published.` : 'Foreign branch, mutual or co-operative bank; relevant adjacent banking market but not identical to the commercial-bank target brief.')
}

for (const relationship of relationships) {
  const record = inventory.get(relationship.companyId)
  if (!record) continue
  record.researchStatus = 'researched'
  if (relationship.status === 'Confirmed') record.confirmedBodyRelationships += 1
  else if (relationship.status === 'Historical') record.historicalBodyRelationships += 1
  else if (relationship.status === 'Unverified') record.unverifiedBodyRelationships += 1
  else if (relationship.status === 'Unknown') record.unknownBodyRelationships += 1
}
const proposedCompanies = [...proposedByName.values()]
const statusCounts: Record<EvidenceStatus, number> = { Confirmed: 0, Historical: 0, Unverified: 0, Unknown: 0, 'Not applicable': 0 }
relationships.forEach((relationship) => { statusCounts[relationship.status] += 1 })
const inventoryRecords = [...inventory.values()]
const coverage: CoverageReport = {
  generatedOn: CHECKED_ON,
  sourceCompanyUniverse: inventoryRecords.length,
  applicationCompanyUniverse: intelligence.all.length,
  additionalSourceOnlyOrganizations: inventoryRecords.filter((record) => record.identityKind === 'additional-source-only').length,
  companiesResearched: inventoryRecords.filter((record) => record.researchStatus === 'researched').length,
  companiesWithConfirmedRelationship: inventoryRecords.filter((record) => record.confirmedBodyRelationships > 0).length,
  companiesResearchedWithoutConfirmedRelationship: inventoryRecords.filter((record) => record.researchStatus === 'researched' && record.confirmedBodyRelationships === 0).length,
  companiesPending: inventoryRecords.filter((record) => record.researchStatus === 'pending').length,
  distinctBodies: bodies.length,
  bodiesWithAccessibleDirectories: bodies.filter((body) => ['public-list', 'public-searchable'].includes(body.membershipListAvailability)).length,
  associationMemberRows: members.length,
  distinctAssociationMemberCompanies: unique(members.map((member) => member.companyId)).length,
  additionalMemberCompaniesDiscovered: unique(members.filter((member) => member.newCompanyCandidate === 'Yes').map((member) => member.companyId)).length,
  proposedCompanyRecords: proposedCompanies.length,
  relationshipsByStatus: statusCounts,
  identityWarnings: [
    `${unresolvedSourceNames.size} ambiguous additional-source names were not auto-merged.`,
    'Proposed and unresolved directory identities are not canonical Maps organizations and are excluded from application-company coverage numerators.',
    'Exact normalized source-name matching is not proof of legal identity; parent brands, subsidiaries and trading names require manual review.',
    'SAIA logo destinations and Minerals Council commodity/business-unit rows can differ from legal names; original directory names are preserved.',
  ],
  scopeNotes: [
    `Application universe reproduced from visibleOrganizations composition: ${intelligence.index.organizations.length} curated plus ${intelligence.extraOrganizations.length} dataset-only organizations.`,
    'The expanded source universe additionally reconciles Salesforce, data-science, hackathon, CA Western Cape, accountant-company and property-workspace source names. It is not asserted to exhaust every future or external organization.',
    'ASPASA operations and associates are Historical because the official artwork is undated and published under a 2025-03 upload path; no current complete ASPASA register was established.',
    'MBAWC contains 25 new-portal rows only. The separate 346-row legacy search and 120-page 2025 PDF were not fully re-extracted.',
    'SAPOA contains directory pages 1–5 only. SAFCEC rows are Unverified homepage-logo leads. CESA, DMPR, MHSC, FSCA, CGCSA and SARMA have no imported company rows in this batch.',
    'Recruitment tiers are brief-specific navigation aids, not universal rankings, candidate-suitability findings or proof of current employment.',
  ],
}
const dataset: IndustryIntelligenceDataset = { bodies, relationships, members, leadership, networks, classifications, proposedCompanies, coverage }

function assertUnique(label: string, ids: string[]) {
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicates.length) throw new Error(`${label} duplicate ids: ${unique(duplicates).join(', ')}`)
}
assertUnique('body', bodies.map((item) => item.id))
assertUnique('member', members.map((item) => item.id))
assertUnique('relationship', relationships.map((item) => item.id))
assertUnique('leader', leadership.map((item) => item.id))
assertUnique('network', networks.map((item) => item.id))
assertUnique('classification', classifications.map((item) => item.id))
assertUnique('proposed', proposedCompanies.map((item) => item.id))
assertUnique('inventory', inventoryRecords.map((item) => item.companyId))
const expectedRows: Record<string, number> = { 'body-basa': 29, 'body-codi': 33, 'body-sa-reit': 21, 'body-prudential-authority': 12, 'body-agbiz-grain': 13, 'body-mbawc': 25, 'body-saia': 53 }
for (const [bodyId, expected] of Object.entries(expectedRows)) {
  const actual = members.filter((member) => member.bodyId === bodyId).length
  if (actual !== expected) throw new Error(`${bodyId}: expected ${expected} rows, generated ${actual}`)
}
if (intelligence.all.length !== 2475) throw new Error(`Application universe changed: expected 2475, got ${intelligence.all.length}`)
for (const relationship of relationships) {
  if (!bodyById.has(relationship.bodyId)) throw new Error(`Missing body for ${relationship.id}`)
  if (relationship.status === 'Confirmed' && !relationship.evidenceUrl.startsWith('http')) throw new Error(`Confirmed row lacks URL: ${relationship.id}`)
  if (relationship.bodyId === 'body-aspasa' && relationship.status === 'Confirmed' && relationship.companyId !== 'body-aspasa') throw new Error(`Current ASPASA company claim without current register: ${relationship.id}`)
  if (relationship.bodyId === 'body-iqsa' && relationship.represents === 'company') throw new Error('IQSA individual body cannot have company membership')
}
for (const classification of classifications) {
  const member = members.find((item) => item.id === classification.memberId)
  if (!member || !networks.some((network) => network.id === classification.networkId)) throw new Error(`Broken classification ${classification.id}`)
  if (classification.tier === 1 && (['associate-supplier', 'association', 'professional-services', 'educational-institution'].includes(member.participantType) || member.identityStatus !== 'resolved')) throw new Error(`Supplier, body or unresolved identity cannot be automatic Tier 1: ${classification.id}`)
}
for (const proposed of proposedCompanies) {
  if (curatedIds.has(proposed.id)) throw new Error(`Proposed company collides with canonical id ${proposed.id}`)
}
const serialized = `${JSON.stringify(dataset)}\n`
if (/mailto:|@gmail\.com|@outlook\.com/i.test(serialized)) throw new Error('Personal contact data detected in generated dataset')

function writeJson(file: string, value: unknown) { fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`) }
function csvValue(value: unknown): string {
  const text = Array.isArray(value) ? value.join('; ') : value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
function writeCsv(file: string, rows: Record<string, unknown>[]) {
  const columns = unique(rows.flatMap((row) => Object.keys(row)))
  const content = [columns.map(csvValue).join(','), ...rows.map((row) => columns.map((column) => csvValue(row[column])).join(','))].join('\n')
  fs.writeFileSync(file, `${content}\n`)
}
writeJson(path.join(generatedDir, 'industry-intelligence.json'), dataset)
writeJson(path.join(root, 'src/data/industryIntelligence/dataset.json'), dataset)
writeJson(path.join(generatedDir, 'company-inventory.json'), inventoryRecords)
writeJson(path.join(generatedDir, 'coverage.json'), coverage)
writeCsv(path.join(exportDir, 'industry-body-master-directory.csv'), bodies as unknown as Record<string, unknown>[])
writeCsv(path.join(exportDir, 'company-membership-map.csv'), relationships as unknown as Record<string, unknown>[])
writeCsv(path.join(exportDir, 'association-member-directory.csv'), members as unknown as Record<string, unknown>[])
writeCsv(path.join(exportDir, 'industry-leadership.csv'), leadership as unknown as Record<string, unknown>[])
writeCsv(path.join(exportDir, 'recruitment-networks.csv'), networks as unknown as Record<string, unknown>[])
writeCsv(path.join(exportDir, 'recruitment-classifications.csv'), classifications.map((classification) => {
  const member = members.find((item) => item.id === classification.memberId)!
  const network = networks.find((item) => item.id === classification.networkId)!
  return { ...classification, brief: network.brief, companyName: member.companyName, originalDirectoryName: member.originalDirectoryName, bodyId: member.bodyId, participantType: member.participantType, membershipStatus: member.verificationStatus, identityStatus: member.identityStatus }
}))
writeCsv(path.join(exportDir, 'proposed-companies.csv'), proposedCompanies as unknown as Record<string, unknown>[])
writeCsv(path.join(exportDir, 'company-inventory.csv'), inventoryRecords as unknown as Record<string, unknown>[])

const progress = {
  generatedOn: CHECKED_ON,
  status: 'verified-partial-coverage',
  batches: [
    { id: 'repository-inventory', status: 'completed-with-documented-source-limits', records: inventoryRecords.length, next: 'Review additional-source aliases and any market files not composed by visibleOrganizations before calling the source universe exhaustive.' },
    { id: 'aspasa-proof-of-concept', status: 'historical-evidence-complete-current-register-pending', records: members.filter((member) => member.bodyId === 'body-aspasa').length, next: 'Obtain and inspect the linked 2026 map or a dated current company register; reconfirm producer, associate and leadership currency.' },
    { id: 'minerals-council', status: 'current-page-imported', records: members.filter((member) => member.bodyId === 'body-minerals-council').length, next: 'Review legal entities for duplicate business units and associations; do not merge commodity units automatically.' },
    { id: 'financial-directories', status: 'current-pages-imported', records: members.filter((member) => ['body-basa', 'body-codi', 'body-prudential-authority', 'body-asisa', 'body-saia'].includes(member.bodyId)).length, next: 'Resolve bank/insurer legal entities and add specific PA/FSCA registers separately from membership.' },
    { id: 'property-directories', status: 'sa-reit-complete-sapoa-partial', records: members.filter((member) => ['body-sa-reit', 'body-sapoa'].includes(member.bodyId)).length, next: 'Continue SAPOA at page 6; import SA REIT advisory members as a separate category if required.' },
    { id: 'agribusiness-directories', status: 'current-pages-imported', records: members.filter((member) => ['body-agbiz', 'body-agbiz-grain'].includes(member.bodyId)).length, next: 'Import Agbiz Grain associates separately and reconcile GWK/VKB and other related legal entities.' },
    { id: 'construction-directories', status: 'partial-and-mixed-evidence', records: members.filter((member) => ['body-mbawc', 'body-safcec'].includes(member.bodyId)).length, next: 'Resolve MBAWC pagination/API or extract the 2025 directory; obtain a row-level SAFCEC register; query current CESA members firm by firm.' },
    { id: 'regulators-and-professional-bodies', status: 'institutional-scope-established-company-links-pending', records: 0, next: 'Add only company-specific current DMPR, FSCA, PA and certification records. Keep MHSC tripartite representation and IQSA individual membership separate.' },
    { id: 'cgcsa-and-sarma', status: 'no-row-level-current-register-established', records: 0, next: 'Obtain a current member register or company-specific disclosures. Do not turn CGCSA board employers or old SARMA claims into current membership.' },
  ],
}
writeJson(path.join(outDir, 'progress-manifest.json'), progress)

const coverageMarkdown = `# Research Coverage Report\n\nGenerated from saved output on ${CHECKED_ON}. **Status: verified partial coverage.** These figures are recalculated by \`npm run intelligence:validate\`; they are not manual estimates.\n\n| Measure | Saved count |\n| --- | ---: |\n| Application organizations (curated + dataset-only) | ${coverage.applicationCompanyUniverse.toLocaleString()} |\n| Additional exact source-name-only identities | ${coverage.additionalSourceOnlyOrganizations.toLocaleString()} |\n| Expanded reconciled source universe | ${coverage.sourceCompanyUniverse.toLocaleString()} |\n| Existing identities with saved external-body research | ${coverage.companiesResearched.toLocaleString()} |\n| Existing identities with a confirmed external relationship | ${coverage.companiesWithConfirmedRelationship.toLocaleString()} |\n| Researched existing identities without a confirmed relationship | ${coverage.companiesResearchedWithoutConfirmedRelationship.toLocaleString()} |\n| Pending existing identities | ${coverage.companiesPending.toLocaleString()} |\n| Industry-body records | ${coverage.distinctBodies} |\n| Bodies with accessible lists or search directories | ${coverage.bodiesWithAccessibleDirectories} |\n| Association-member rows | ${coverage.associationMemberRows} |\n| Distinct directory identities | ${coverage.distinctAssociationMemberCompanies} |\n| Additional member-company candidates discovered | ${coverage.additionalMemberCompaniesDiscovered} |\n| Proposed-company records (including independent SATURC research) | ${coverage.proposedCompanyRecords} |\n\n## Relationships by evidence status\n\n${statusesForMarkdown(statusCounts)}\n\n## Populated body directories\n\n| Body | Saved rows | Evidence scope |\n| --- | ---: | --- |\n${bodies.filter((body) => members.some((member) => member.bodyId === body.id)).map((body) => `| ${body.acronym} | ${members.filter((member) => member.bodyId === body.id).length} | ${body.membershipListAvailability} |`).join('\n')}\n\n## Scope notes\n\n${coverage.scopeNotes.map((note) => `- ${note}`).join('\n')}\n\n## Identity warnings\n\n${coverage.identityWarnings.map((note) => `- ${note}`).join('\n')}\n\n## Remaining-work manifest\n\n| Batch | Status | Saved rows | Next action |\n| --- | --- | ---: | --- |\n${progress.batches.map((batch) => `| ${batch.id} | ${batch.status} | ${batch.records} | ${batch.next} |`).join('\n')}\n\nThe absence of a row is never treated as evidence of non-membership. Proposed and unresolved identities remain outside \`markets/organizations/organizations.json\`.\n`
function statusesForMarkdown(counts: Record<EvidenceStatus, number>): string {
  return (Object.entries(counts) as [EvidenceStatus, number][]).map(([status, count]) => `- **${status}:** ${count}`).join('\n')
}
fs.writeFileSync(path.join(generatedDir, 'coverage-report.md'), coverageMarkdown)
const integrationMarkdown = `# Industry Intelligence Integration Report\n\nGenerated on ${CHECKED_ON}.\n\n## Implemented\n\n- Separate external-body model in \`src/data/industryIntelligence/types.ts\`; existing company-to-company sourcing associations and canonical organization records are not rewritten.\n- Reproducible expanded inventory with ${coverage.applicationCompanyUniverse.toLocaleString()} application organizations and ${coverage.additionalSourceOnlyOrganizations} additional exact source-name-only identities.\n- ${coverage.distinctBodies} body records, ${coverage.associationMemberRows} directory rows, ${relationships.length} external relationships, ${leadership.length} dated public leadership rows, ${networks.length} recruitment briefs and ${classifications.length} brief-specific classifications.\n- ${coverage.proposedCompanyRecords} proposed-company records remain quarantined from the canonical organization register.\n- Lazy-loaded \`/industry-bodies\` Explorer with body directory, company map, member directory, recruitment networks, leadership, coverage, search/filter, official evidence links and filtered CSV export.\n- Shared generated JSON feeds the application and machine-readable deliverables; eight CSV exports are independently row-count checked.\n\n## Data-quality controls\n\n- Exact or explicitly reviewed identity matches only; ambiguous names are quarantined.\n- Parent membership is not inherited by subsidiaries. Legal entities and source-reported business units retain their directory names.\n- Producer/operators, suppliers, contractors, associations, institutions and professional-services participants are separate.\n- BASA voluntary membership, CODI compulsory participation and Prudential Authority regulation are separate relationships.\n- ASPASA 2025 artwork and MANCOM roles are Historical. SATURC ASPASA membership is Unknown. No historical Afrimat membership is transferred to SATURC.\n- IQSA represents individuals. MHSC is statutory and tripartite. FSCA/DMPR regulation is not association membership.\n- Tier 1 is never assigned automatically to a supplier, association, professional-services firm, educational institution or unresolved/proposed identity.\n\n## Refresh and verification\n\n1. Review the official source and record its publication/effective date and retrieval date.\n2. Update the appropriate file under \`markets/industry-intelligence/source/\`. Do not import personal contact fields.\n3. Run \`npm run intelligence:build\`.\n4. Run \`npm run intelligence:validate\`, \`npm test\`, \`npm run build\`, \`npm run smoke:routes\` and \`npm run audit:ui\`.\n5. Review \`progress-manifest.json\` and \`generated/coverage-report.md\`; incomplete batches must remain explicitly incomplete.\n6. Use the active-branch reviewed pull-request workflow. Generation and validation do not deploy.\n\n## Known source discrepancies\n\n- SAIA narrative: 55 members; retrieved linked rows: 53. Only 53 rows are saved.\n- CODI narrative: 34 institutions and 5 co-operative banks; retrieved table: 33 rows and 4 co-operative-bank rows. No fifth institution is invented.\n- PA locally controlled register prints FIRSTHAND BANK LIMITED. The source spelling is preserved and identity is unresolved.\n- MBAWC exposes a 25-company new portal, a separate 346-result legacy search and a 120-page 2025 PDF. Only the 25 new-portal rows are marked Confirmed in this batch.\n`
fs.writeFileSync(path.join(generatedDir, 'integration-report.md'), integrationMarkdown)

console.log(JSON.stringify({
  applicationCompanies: coverage.applicationCompanyUniverse,
  additionalSourceOnly: coverage.additionalSourceOnlyOrganizations,
  researchedCanonicalAndSourceCompanies: coverage.companiesResearched,
  bodies: bodies.length,
  memberRows: members.length,
  relationships: relationships.length,
  proposedCompanies: proposedCompanies.length,
  networks: networks.length,
  classifications: classifications.length,
  statuses: statusCounts,
  sourceRowCounts: Object.fromEntries(bodies.map((body) => [body.id, members.filter((member) => member.bodyId === body.id).length]).filter(([, count]) => Number(count) > 0)),
}, null, 2))
