import test from 'node:test'
import assert from 'node:assert/strict'
import { industryIntelligence } from '../src/data/industryIntelligence/load'
import { associationMembersCsv, emptyIntelligenceFilters, filterAssociationMembers, filterCompanyRelationships } from '../src/data/industryIntelligence/query'
import type { CompanyInventoryRecord } from '../src/data/industryIntelligence/types'
import inventoryRaw from '../markets/industry-intelligence/generated/company-inventory.json'

const inventory = inventoryRaw as CompanyInventoryRecord[]
const filters = (patch: Partial<typeof emptyIntelligenceFilters>) => ({ ...emptyIntelligenceFilters, ...patch })

test('coverage is verified partial and recalculates from saved inventory', () => {
  const { coverage } = industryIntelligence
  assert.equal(coverage.applicationCompanyUniverse, 2475)
  assert.equal(coverage.sourceCompanyUniverse, inventory.length)
  assert.equal(coverage.companiesResearched, inventory.filter((record) => record.researchStatus === 'researched').length)
  assert.equal(coverage.companiesPending, inventory.filter((record) => record.researchStatus === 'pending').length)
  assert.equal(coverage.companiesResearched + coverage.companiesPending, inventory.length)
  assert.ok(coverage.companiesPending > coverage.companiesResearched)
})

test('SATURC remains Unknown and historical Afrimat evidence is not transferred', () => {
  const saturc = industryIntelligence.relationships.filter((relationship) => relationship.companyName === 'SATURC')
  assert.equal(saturc.length, 1)
  assert.equal(saturc[0].status, 'Unknown')
  assert.equal(saturc[0].bodyId, 'body-aspasa')
  assert.ok(saturc[0].researchNotes.includes('have not been transferred'))
  const afrimatAspasa = industryIntelligence.relationships.find((relationship) => relationship.companyId === 'org-afrimat' && relationship.bodyId === 'body-aspasa' && relationship.relationshipType === 'membership')
  assert.equal(afrimatAspasa?.status, 'Historical')
  assert.equal(industryIntelligence.members.some((member) => member.companyName === 'SATURC'), false)
})

test('company and body search finds historical ASPASA and current Minerals Council evidence separately', () => {
  const rows = filterAssociationMembers(filters({ query: 'Afrimat' }))
  assert.ok(rows.some((member) => member.bodyId === 'body-aspasa' && member.verificationStatus === 'Historical'))
  assert.ok(rows.some((member) => member.bodyId === 'body-minerals-council' && member.verificationStatus === 'Confirmed'))
  assert.ok(rows.some((member) => member.bodyId === 'body-safcec' && member.verificationStatus === 'Unverified'))
})

test('producer, supplier, association and individual-style participants remain distinct', () => {
  const suppliers = filterAssociationMembers(filters({ bodyId: 'body-aspasa', participantType: 'associate-supplier' }))
  assert.ok(suppliers.length >= 10)
  assert.ok(suppliers.every((member) => member.membershipCategory === 'Associate'))
  const tier1Ids = new Set(industryIntelligence.classifications.filter((item) => item.networkId === 'network-aggregates-saturc' && item.tier === 1).map((item) => item.memberId))
  assert.ok(suppliers.every((member) => !tier1Ids.has(member.id)))
  assert.equal(industryIntelligence.relationships.some((relationship) => relationship.bodyId === 'body-iqsa' && relationship.represents === 'company'), false)
})

test('brief tiers are network-specific and affiliate service providers are not asset-management Tier 1', () => {
  const tier1 = filterAssociationMembers(filters({ networkId: 'network-asset-management', tier: '1' }))
  assert.ok(tier1.some((member) => member.originalDirectoryName === 'Coronation Fund Managers Ltd'))
  assert.ok(tier1.every((member) => !member.membershipCategory.includes('Affiliate') && !member.membershipCategory.includes('Associate')))
  const affiliates = filterAssociationMembers(filters({ networkId: 'network-asset-management', participantType: 'professional-services', tier: '3' }))
  assert.ok(affiliates.some((member) => member.originalDirectoryName === 'Deloitte & Touche'))
})

test('voluntary BASA, statutory CODI and PA regulation are not conflated', () => {
  const capitec = industryIntelligence.relationships.filter((relationship) => relationship.companyId === 'org-capitec')
  assert.equal(capitec.find((relationship) => relationship.bodyId === 'body-basa')?.participationBasis, 'Voluntary')
  assert.equal(capitec.find((relationship) => relationship.bodyId === 'body-codi')?.participationBasis, 'Mandatory')
  assert.equal(capitec.find((relationship) => relationship.bodyId === 'body-prudential-authority')?.relationshipType, 'regulation')
  const investecBank = industryIntelligence.members.find((member) => member.bodyId === 'body-prudential-authority' && member.originalDirectoryName === 'INVESTEC BANK LTD')
  assert.equal(investecBank?.identityStatus, 'proposed')
  assert.notEqual(investecBank?.companyId, 'org-investec')
})

test('region, participant and body filters compose and proposed identities stay outside canonical Maps', () => {
  const rows = filterAssociationMembers(filters({ bodyId: 'body-aspasa', region: 'Western Cape', participantType: 'producer-operator' }))
  assert.ok(rows.some((member) => member.originalDirectoryName === 'Ciolli Bros (Pty) Ltd'))
  assert.ok(rows.every((member) => member.location.includes('Western Cape')))
  const ciolli = rows.find((member) => member.originalDirectoryName === 'Ciolli Bros (Pty) Ltd')
  assert.equal(ciolli?.companyId?.startsWith('source-'), true)
  const proposed = filterAssociationMembers(filters({ query: 'Portland Quarry' }))
  assert.ok(proposed.every((member) => member.identityStatus === 'proposed'))
  assert.ok(proposed.every((member) => member.companyId?.startsWith('proposed-')))
})

test('company-map filters preserve Unknown research rows when no brief is applied', () => {
  const rows = filterCompanyRelationships(filters({ query: 'SATURC', status: 'Unknown' }))
  assert.equal(rows.length, 1)
  assert.equal(rows[0].status, 'Unknown')
  assert.equal(filterCompanyRelationships(filters({ query: 'SATURC', networkId: 'network-aggregates-saturc' })).length, 0)
  assert.equal(filterCompanyRelationships(filters({ query: 'Mine Health', networkId: 'network-construction-civil' })).length, 0)
  assert.equal(industryIntelligence.classifications.some((item) => {
    if (item.tier !== 1) return false
    const member = industryIntelligence.members.find((candidate) => candidate.id === item.memberId)
    return member?.identityStatus !== 'resolved'
  }), false)
})

test('source count discrepancies are explicit rather than filled with invented rows', () => {
  assert.equal(industryIntelligence.members.filter((member) => member.bodyId === 'body-saia').length, 53)
  assert.equal(industryIntelligence.members.filter((member) => member.bodyId === 'body-codi').length, 33)
  const saia = industryIntelligence.bodies.find((body) => body.id === 'body-saia')
  const codiNote = industryIntelligence.members.find((member) => member.bodyId === 'body-codi')?.researchNotes ?? ''
  assert.ok(saia?.notes.includes('55') && saia.notes.includes('53'))
  assert.ok(codiNote.includes('34') && codiNote.includes('33'))
})

test('CSV export contains stable IDs, evidence and brief tiers with escaped fields', () => {
  const rows = filterAssociationMembers(filters({ networkId: 'network-aggregates-saturc', query: 'Afrimat' }))
  const csv = associationMembersCsv(rows, 'network-aggregates-saturc')
  assert.ok(csv.includes('member_id,body_id,body_name,company_id'))
  assert.ok(csv.includes('https://aspasa.co.za/'))
  assert.ok(csv.includes(',1,'))
  assert.ok(csv.split('\n').length > 1)
  const special = associationMembersCsv([{ ...rows[0], researchNotes: 'Quoted "source", with comma' }])
  assert.ok(special.includes('"Quoted ""source"", with comma"'))
})
