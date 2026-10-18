// Data-quality checks for the company-intelligence model.
//
// These are the checks that stop the dataset quietly degrading: an unknown
// capability must never be recorded as an absence, a company must never be
// related to itself, a scale figure must always have a source, and a recruiter
// judgement must always carry a reviewer. Two of the conditions exercised here
// were found in the seed research and removed from the data rather than
// repaired, so they are covered by fixtures instead.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import capabilitiesRaw from '../markets/organizations/capabilities.json'
import industriesRaw from '../markets/organizations/industries.json'
import organizationsRaw from '../markets/organizations/organizations.json'
import relationshipsRaw from '../markets/organizations/corporate-relationships.json'
import associationsRaw from '../markets/organizations/associations.json'
import intelligenceRaw from '../markets/organizations/recruiter-intelligence.json'
import { issuesForOrganization, runQualityChecks } from '../src/data/organizations/quality'
import type { Capability, Industry, Organization } from '../src/data/organizations/types'
import {
  TODAY,
  association,
  capability,
  capabilityLink,
  industry,
  industryLink,
  intelligence,
  organization,
  relationship,
} from './helpers/organizations'

const INDUSTRIES = industriesRaw as Industry[]
const CAPABILITIES = capabilitiesRaw as Capability[]

function check(overrides: Partial<Parameters<typeof runQualityChecks>[0]> = {}) {
  return runQualityChecks({
    organizations: [],
    industries: INDUSTRIES,
    capabilities: CAPABILITIES,
    relationships: [],
    associations: [],
    intelligence: [],
    today: TODAY,
    ...overrides,
  })
}

function codes(issues: { code: string }[]): string[] {
  return issues.map((issue) => issue.code)
}

describe('data-quality checks', () => {
  it('passes the shipped dataset with no errors', () => {
    const issues = check({
      organizations: organizationsRaw as Organization[],
      relationships: relationshipsRaw as never,
      associations: associationsRaw as never,
      intelligence: intelligenceRaw as never,
    })
    const errors = issues.filter((issue) => issue.severity === 'error')
    assert.deepEqual(errors, [], 'the shipped dataset must not carry data-quality errors')
  })

  it('flags the same company stored twice under different ids', () => {
    const issues = check({
      organizations: [
        organization({ id: 'org-a', name: 'Example Cold Storage' }),
        organization({ id: 'org-b', name: 'Example Cold Storage (Pty) Ltd' }),
      ],
    })
    assert.ok(codes(issues).includes('duplicate-organization'))
  })

  it('flags an alias that resolves to two companies', () => {
    const issues = check({
      organizations: [
        organization({ id: 'org-a', name: 'Alpha Foods', aliases: ['Beta'] }),
        organization({ id: 'org-b', name: 'Beta Logistics', aliases: ['Beta'] }),
      ],
    })
    assert.ok(codes(issues).includes('ambiguous-alias'))
  })

  it('flags an industry or capability id that the taxonomy does not contain', () => {
    const issues = check({
      organizations: [
        organization({
          id: 'org-a',
          name: 'Example Foods',
          industries: [industryLink({ industryId: 'not-in-the-taxonomy' })],
          capabilities: [capabilityLink({ capabilityId: 'not-a-real-capability' })],
        }),
      ],
    })
    const unsupported = issues.filter((issue) => issue.code === 'unsupported-industry')
    assert.equal(unsupported.length, 2, 'both the industry and the capability are reported')
    assert.match(unsupported[1].detail, /unknown capability/)
  })

  it('never accepts "not observed" without saying what was checked', () => {
    const issues = check({
      organizations: [
        organization({
          id: 'org-a',
          name: 'Example Foods',
          capabilities: [capabilityLink({
            capabilityId: CAPABILITIES[0].id,
            status: 'not-observed',
            evidence: '',
          })],
        }),
      ],
    })
    const issue = issues.find((entry) => entry.code === 'unknown-rendered-as-absent')
    assert.ok(issue, 'an unevidenced absence must be an error')
    assert.equal(issue.severity, 'error')
  })

  it('allows an unknown capability with no evidence, because unknown is not a claim', () => {
    const issues = check({
      organizations: [
        organization({
          id: 'org-a',
          name: 'Example Foods',
          capabilities: [capabilityLink({
            capabilityId: CAPABILITIES[0].id,
            status: 'unknown',
            evidence: '',
            confidence: 'unknown',
            sourceUrl: '',
          })],
        }),
      ],
    })
    assert.deepEqual(codes(issues).filter((code) => code !== 'relevance-without-evidence'), [])
  })

  it('flags the same capability recorded with two different statuses', () => {
    const issues = check({
      organizations: [
        organization({
          id: 'org-a',
          name: 'Example Foods',
          capabilities: [
            capabilityLink({ capabilityId: CAPABILITIES[0].id, status: 'observed' }),
            capabilityLink({ capabilityId: CAPABILITIES[0].id, status: 'not-observed', evidence: 'Checked the annual report.' }),
          ],
        }),
      ],
    })
    assert.ok(codes(issues).includes('conflicting-capability'))
  })

  it('flags a scale figure and a location with no source', () => {
    const issues = check({
      organizations: [
        organization({
          id: 'org-a',
          name: 'Example Foods',
          scale: [{ metric: 'employees', value: '5,000', basis: 'third-party-estimate', asOf: TODAY, sourceUrl: '', checkedOn: TODAY }],
          locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: '', checkedOn: TODAY }],
        }),
      ],
    })
    assert.ok(codes(issues).includes('scale-without-source'))
    assert.ok(codes(issues).includes('unsourced-location'))
  })

  it('flags a company related to itself and a relationship to a company that does not exist', () => {
    const issues = check({
      organizations: [organization({ id: 'org-a', name: 'Example Foods' })],
      relationships: [
        relationship({ id: 'rel-self', type: 'joint-venture', fromId: 'org-a', toId: 'org-a' }),
        relationship({ id: 'rel-ghost', type: 'parent-of', fromId: 'org-a', toId: 'org-ghost' }),
      ],
    })
    const mistaken = issues.filter((issue) => issue.code === 'mistaken-corporate-affiliation')
    assert.equal(mistaken.length, 2, 'the self-loop and the unknown counterparty are both errors')
    assert.match(mistaken[0].detail, /to itself/)
  })

  it('flags a parent relationship that contradicts the child record', () => {
    const issues = check({
      organizations: [
        organization({ id: 'org-parent', name: 'Example Holdings' }),
        organization({ id: 'org-other', name: 'Other Holdings' }),
        organization({ id: 'org-child', name: 'Example Foods', parentId: 'org-other' }),
      ],
      relationships: [relationship({ id: 'rel-1', type: 'parent-of', fromId: 'org-parent', toId: 'org-child' })],
    })
    assert.ok(codes(issues).includes('conflicting-parent'))
  })

  it('flags a relationship with no evidence, and an association with no explanation', () => {
    const issues = check({
      organizations: [
        organization({ id: 'org-a', name: 'Example Foods' }),
        organization({ id: 'org-b', name: 'Example Logistics' }),
      ],
      relationships: [relationship({ id: 'rel-1', type: 'verified-partnership', fromId: 'org-a', toId: 'org-b', evidence: '', sourceUrl: '' })],
      associations: [association({ id: 'assoc-1', focalId: 'org-a', associatedId: 'org-b', narrative: '' })],
    })
    assert.ok(codes(issues).includes('unsupported-association'))
    assert.ok(codes(issues).includes('relevance-without-evidence'))
  })

  it('refuses an unattributed recruiter judgement', () => {
    const issues = check({
      organizations: [organization({ id: 'org-a', name: 'Example Foods' })],
      intelligence: [intelligence({ id: 'ri-1', organizationId: 'org-a', reviewer: '' })],
    })
    const issue = issues.find((entry) => entry.code === 'similarity-as-person-suitability')
    assert.ok(issue, 'a judgement nobody can be held to must be an error')
    assert.equal(issue.severity, 'error')
  })

  it('warns when activity is confirmed from the industry alone', () => {
    const issues = check({
      organizations: [
        organization({
          id: 'org-a',
          name: 'Example Foods',
          industries: [industryLink({ industryId: INDUSTRIES[0].id, confidence: 'confirmed', evidence: '   ' })],
        }),
      ],
    })
    const issue = issues.find((entry) => entry.code === 'activity-assumed-from-industry')
    assert.ok(issue)
    assert.equal(issue.severity, 'warning')
  })

  it('warns about verification that has gone stale but stays usable', () => {
    const issues = check({
      staleAfterDays: 180,
      organizations: [organization({ id: 'org-a', name: 'Example Foods', lastVerified: '2025-01-01' })],
    })
    const issue = issues.find((entry) => entry.code === 'stale-verification')
    assert.ok(issue)
    assert.equal(issue.severity, 'warning', 'stale evidence is still usable, so it is a warning')
  })

  it('scopes issues to one organization for the inspector', () => {
    const issues = check({
      organizations: [
        organization({ id: 'org-a', name: 'Example Foods', capabilities: [capabilityLink({ capabilityId: 'ghost-capability' })] }),
        organization({ id: 'org-b', name: 'Example Logistics' }),
      ],
    })
    assert.deepEqual(codes(issuesForOrganization(issues, 'org-a')), ['unsupported-industry'])
    assert.deepEqual(issuesForOrganization(issues, 'org-b'), [], 'a clean company has no issues attached to it')
  })

  it('checks a fixture taxonomy as well as the shipped one', () => {
    const issues = check({
      industries: [industry({ id: 'fixture-industry', name: 'Fixture industry' })],
      capabilities: [capability({ id: 'fixture-capability', name: 'Fixture capability' })],
      organizations: [
        organization({
          id: 'org-a',
          name: 'Example Foods',
          industries: [industryLink({ industryId: 'fixture-industry' })],
          capabilities: [capabilityLink({ capabilityId: 'fixture-capability' })],
        }),
      ],
    })
    assert.deepEqual(codes(issues), [], 'a clean fixture raises nothing')
  })
})
