import test from 'node:test'
import assert from 'node:assert/strict'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import { organizations, industries } from '../src/data/organizations/load'
import { organizationTaxonomy } from '../src/data/organizations/taxonomyPlacement'
import { bizcommunitySourceRecords as sourceRecords } from '../src/data/organizations/bizcommunitySourceRecords'
import type { BizcommunitySourceRecord } from '../src/data/organizations/types'
const sourceOrganizations = organizations.filter((organization) => organization.bizcommunity)

function recordForCompany(name: string): BizcommunitySourceRecord | undefined {
  const key = canonicalCompanyName(name).toLowerCase()
  return sourceRecords.find((record) => canonicalCompanyName(record.companyName).toLowerCase() === key)
}

test('the supplied Bizcommunity batch is retained without dropping source rows', () => {
  assert.equal(sourceRecords.length, 868, 'four duplicate listings and one legal-suffix alias are aggregated into company records')
  assert.equal(
    sourceRecords.reduce((total, record) => total + (record.sourceRows?.length ?? 0), 0),
    873,
    'every supplied CSV row must remain attached to a source record',
  )
  assert.equal(sourceOrganizations.length, 868)

  const sourceNames = new Set(
    sourceRecords.flatMap((record) => (record.sourceRows ?? []).map((row) => row.companyName)),
  )
  assert.ok(sourceNames.has('KnM inc'), 'legal-suffix source names remain visible inside the retained rows')
  assert.ok(sourceNames.has('Business Partners Limited'))
  assert.ok(sourceNames.has('Instant Flooring'))
})

test('every imported company has a national taxonomy placement derived from its source category', () => {
  const industryIds = new Set(industries.map((industry) => industry.id))
  for (const organization of sourceOrganizations) {
    const record = recordForCompany(organization.name)
    assert.ok(record, `${organization.name} has no source record`)
    assert.ok(record.sourceRows && record.sourceRows.length > 0, `${organization.name} has no retained source rows`)
    for (const industryId of record.taxonomyIndustryIds) {
      assert.ok(industryIds.has(industryId), `${organization.name} has no source industry ${industryId}`)
    }
    const placement = organizationTaxonomy(organization)
    assert.ok(placement.entries.length > 0, `${organization.name} is not linked to a national taxonomy node`)
    assert.ok(placement.labels.every((label) => label.includes(' > ') || label.split(' > ').length === 1))
  }
})

test('source company names resolve to the same canonical record as the atlas', () => {
  for (const record of sourceRecords) {
    const organization = sourceOrganizations.find((candidate) => candidate.bizcommunity?.companyName === record.companyName)
    assert.ok(organization, `${record.companyName} is missing from the canonical organization universe`)
    for (const row of record.sourceRows ?? []) {
      assert.equal(recordForCompany(row.companyName)?.companyName, record.companyName)
    }
  }
})
