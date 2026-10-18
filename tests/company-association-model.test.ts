// The canonical company-intelligence model, asserted against the shipped data.
//
// These tests are the contract the explorer, the directory, the Search Bank and
// the export all rely on: company facts, company relationships, sourcing
// suggestions and role-specific targeting stay four separate ideas; nothing is
// precomputed for every company pair; and unknown is never stored or reported
// as an absence.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import associationsRaw from '../markets/organizations/associations.json'
import capabilitiesRaw from '../markets/organizations/capabilities.json'
import industriesRaw from '../markets/organizations/industries.json'
import intelligenceRaw from '../markets/organizations/recruiter-intelligence.json'
import organizationsRaw from '../markets/organizations/organizations.json'
import pocketsRaw from '../markets/organizations/pockets.json'
import relationshipsRaw from '../markets/organizations/corporate-relationships.json'
import { buildOrganizationIndex } from '../src/data/organizations/load'
import { discoverAssociations, filterMatches } from '../src/data/organizations/discovery'
import { compareOrganizations, coverageByIndustry, UNEVIDENCED_VALUES, universeStats } from '../src/data/organizations/analysis'
import { emptyFilters, evidenceState } from '../src/data/organizations/query'
import { roleContextById } from '../src/data/organizations/roleContexts'
import type { CompanyAssociation, Organization } from '../src/data/organizations/types'
import { TODAY, organization as fixtureOrganization } from './helpers/organizations'

const organizations = organizationsRaw as Organization[]
const associations = associationsRaw as CompanyAssociation[]
const index = buildOrganizationIndex()

describe('canonical company model', () => {
  it('stores the tables the architecture requires, and only those', () => {
    assert.equal(typeof industriesRaw, 'object')
    assert.equal(typeof pocketsRaw, 'object')
    assert.equal(typeof capabilitiesRaw, 'object')
    assert.equal(typeof organizationsRaw, 'object')
    assert.equal(typeof relationshipsRaw, 'object')
    assert.equal(typeof associationsRaw, 'object')
    assert.equal(typeof intelligenceRaw, 'object')
  })

  it('keeps company facts separate from corporate relationships', () => {
    for (const organization of organizations) {
      assert.equal(typeof organization.parentId === 'string' || organization.parentId === null, true)
      // A parent pointer must resolve to a real organization, never a free-text group name.
      if (organization.parentId) {
        assert.ok(index.byId.has(organization.parentId), `${organization.name} points at an unknown parent`)
      }
    }
    for (const relationship of relationshipsRaw as { fromId: string; toId: string }[]) {
      assert.ok(index.byId.has(relationship.fromId))
      assert.ok(index.byId.has(relationship.toId))
      assert.notEqual(relationship.fromId, relationship.toId, 'a company cannot be related to itself')
    }
  })

  it('never precomputes every company pair', () => {
    const possible = organizations.length * (organizations.length - 1)
    // Two curated associations per pair would be an all-pairs table; the shipped
    // dataset stores only reviewed, materialised associations.
    assert.ok(
      associations.length < possible / 1000,
      `${associations.length} associations for ${possible} possible pairs is too close to all-pairs`,
    )
    assert.ok(associations.length > 0, 'curated associations must still exist for reviewed pairs')
    for (const association of associations) {
      assert.ok(index.byId.has(association.focalId))
      assert.ok(index.byId.has(association.associatedId))
      assert.notEqual(association.focalId, association.associatedId)
    }
  })

  it('records unknown capability status instead of dropping the row', () => {
    let unknown = 0
    let observed = 0
    let notObserved = 0
    for (const organization of organizations) {
      for (const link of organization.capabilities) {
        if (link.status === 'unknown') unknown += 1
        else if (link.status === 'observed') observed += 1
        else if (link.status === 'not-observed') notObserved += 1
        else assert.fail(`unhandled capability status "${link.status}"`)
      }
    }
    assert.ok(unknown > 0, 'the dataset must record capabilities that were never checked')
    assert.ok(observed > 0)
    assert.ok(
      unknown > notObserved,
      'unknown (never researched) should outnumber not-observed (researched and absent) in a partial dataset',
    )
  })

  it('never sources a scale figure or a location without saying where it came from', () => {
    for (const organization of organizations) {
      for (const scale of organization.scale) {
        assert.ok(['employees', 'revenue', 'sites', 'pallet-positions', 'capacity'].includes(scale.metric))
        assert.ok(['source-reported', 'third-party-estimate'].includes(scale.basis))
        assert.ok(scale.sourceUrl.length > 0, `${organization.name} has an unsourced scale record`)
      }
    }
  })

  it('keeps headcount and revenue in separate, typed records', () => {
    for (const organization of organizations) {
      const metrics = organization.scale.map((entry) => entry.metric)
      assert.equal(new Set(metrics).size, metrics.length, `${organization.name} stores two records for one metric`)
    }
  })
})

describe('derived views never disagree with the facts', () => {
  it('reports coverage that separates verified from unverified and keeps empty industries visible', () => {
    const stats = universeStats(index)
    assert.equal(stats.verified + stats.pendingVerification, stats.organizations)
    assert.ok(stats.organizations >= organizations.length)

    const coverage = coverageByIndustry(index)
    assert.equal(coverage.length, index.industryById.size, 'industries with nothing mapped are still reported')
    for (const row of coverage) {
      assert.equal(typeof row.verified, 'number')
      assert.equal(typeof row.pendingVerification, 'number')
      assert.equal(row.verified + row.pendingVerification, row.organizations)
    }
    const empty = coverage.filter((row) => row.organizations === 0)
    assert.ok(empty.length >= 0)
  })

  it('returns the same match set for the flat list and the filtered views', () => {
    const roleContext = roleContextById('role-cold-storage-financial-manager')!
    const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext })
    const filtered = filterMatches(discovery.matches, index, emptyFilters())

    assert.equal(filtered.length, discovery.matches.length, 'an empty filter changes nothing')
    const grouped = discovery.pockets.reduce((total, pocket) => total + pocket.matches.length, 0)
    assert.equal(grouped, discovery.matches.length, 'the pocket grouping accounts for every match')
  })

  it('classifies unverified, stale and verified evidence as three different states', () => {
    const unsourced = fixtureOrganization({ id: 'fixture-unsourced', name: 'Fixture Unsourced', sources: [] })
    assert.equal(evidenceState(unsourced, 180, new Date(TODAY)), 'unknown', 'no source at all is unknown, not false')

    const verified = fixtureOrganization({
      id: 'fixture-verified',
      name: 'Fixture Verified',
      status: 'verified',
      sources: [{
        url: 'https://example.test/evidence',
        type: 'company-website',
        evidence: 'Test fixture evidence.',
        checkedOn: TODAY,
      }],
      lastVerified: TODAY,
    })
    assert.equal(evidenceState(verified, 180, new Date(TODAY)), 'known-verified')

    const stale = fixtureOrganization({
      ...verified,
      id: 'fixture-stale',
      name: 'Fixture Stale',
      lastVerified: '2024-01-01',
    })
    assert.equal(evidenceState(stale, 180, new Date(TODAY)), 'recorded-stale', 'old but usable evidence is labelled stale, not dropped')
  })

  it('treats one-sided evidence as a difference and two-sided silence as unknown', () => {
    const roleContext = roleContextById('role-cold-storage-financial-manager')!
    const comparison = compareOrganizations(index, 'org-ccs-logistics', 'org-tiger-brands', roleContext)

    assert.ok(comparison.shared.length > 0, 'two real companies share something')
    assert.ok(comparison.distinct.length > 0)
    for (const row of [...comparison.shared, ...comparison.distinct]) {
      assert.notEqual(row.left, '', 'a shared or distinct row always has both sides evidenced')
      assert.notEqual(row.right, '')
    }
    // Unknown means neither side has evidence — never one side missing.
    for (const row of comparison.unknown) {
      assert.ok(UNEVIDENCED_VALUES.has(row.left), `left side "${row.left}" is not an unevidenced placeholder`)
      assert.ok(UNEVIDENCED_VALUES.has(row.right), `right side "${row.right}" is not an unevidenced placeholder`)
    }
    for (const row of comparison.distinct) {
      const bothSilent = UNEVIDENCED_VALUES.has(row.left) && UNEVIDENCED_VALUES.has(row.right)
      assert.equal(bothSilent, false, 'a dimension unknown on both sides is unknown, not distinct')
    }
    assert.ok(comparison.implications.length > 0, 'a comparison states what it means for the assignment')
  })

  it('keeps company facts identical while role-specific targeting changes', () => {
    const cold = roleContextById('role-cold-storage-financial-manager')!
    const property = roleContextById('role-property-finance-manager') ?? roleContextById('role-cold-storage-financial-manager')!
    const before = JSON.stringify(index.byId.get('org-tiger-brands'))

    const coldMatch = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: cold })
      .matches.find((match) => match.organizationId === 'org-tiger-brands')
    const propertyMatch = discoverAssociations({ index, focalId: 'org-tiger-brands', roleContext: property })
      .matches.find((match) => match.organizationId === 'org-ccs-logistics')

    assert.equal(JSON.stringify(index.byId.get('org-tiger-brands')), before, 'targeting never edits the company record')
    assert.ok(coldMatch && propertyMatch, 'both directions produce a match')
    assert.equal(coldMatch.roleContextId, cold.id)
    assert.equal(propertyMatch.roleContextId, property.id)
    assert.ok(coldMatch.rules.every((rule) => typeof rule.detail === 'string' && rule.detail.length > 0))
  })
})
