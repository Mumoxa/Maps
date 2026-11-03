import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import {
  FOOTPRINT_BANDS,
  FOOTPRINT_LABELS,
  classifyFootprint,
  footprintCounts,
  footprintFor,
  isEstablishedBand,
} from '../src/data/organizations/footprint'
import { organizations } from '../src/data/organizations/load'
import type { Organization, OrganizationScale } from '../src/data/organizations/types'

const { index } = buildCompanyIntelligence()

function scale(metric: OrganizationScale['metric'], value: string): OrganizationScale {
  return { metric, value, basis: 'source-reported', asOf: '2026-10-08', sourceUrl: 'https://example.test', checkedOn: '2026-10-08' }
}

function organizationWith(scaleEntries: OrganizationScale[], id = 'org-test-footprint'): Organization {
  return {
    id,
    name: 'Test Footprint Company',
    legalName: '',
    aliases: [],
    website: '',
    status: 'verified',
    industries: [],
    capabilities: [],
    locations: [],
    scale: scaleEntries,
    parentId: null,
    sources: [],
    datasets: [],
    lastVerified: '2026-10-08',
    notes: '',
  }
}

test('the footprint contract carries every field required to audit a classification', () => {
  const classification = classifyFootprint(organizationWith([scale('employees', '12,000 employees')], 'org-fp-contract'))
  for (const field of [
    'organizationId', 'band', 'classificationKind', 'basis', 'supportingMetricIds',
    'evidenceReferences', 'confidence', 'reviewStatus', 'reviewedBy', 'reviewedOn',
    'entityScope', 'note',
  ]) {
    assert.ok(field in classification, `the classification must carry ${field}`)
  }
  assert.ok(FOOTPRINT_BANDS.includes(classification.band))
  assert.ok(FOOTPRINT_LABELS[classification.band].length > 0)
})

test('a company with no sourced scale stays unclassified, it is never treated as small', () => {
  const classification = classifyFootprint(organizationWith([], 'org-fp-empty'))
  assert.equal(classification.band, 'not-established')
  assert.equal(classification.classificationKind, 'unclassified')
  assert.equal(classification.confidence, 'unknown')
  assert.equal(isEstablishedBand(classification.band), false)
  assert.match(classification.basis, /no sourced scale measure/i)
})

test('sector-specific capacity alone never assigns a footprint band', () => {
  const pallets = classifyFootprint(organizationWith([scale('pallet-positions', '114,000 pallet positions')], 'org-fp-pallets'))
  assert.equal(pallets.band, 'not-established', 'pallet positions are not comparable across sectors')
  assert.match(pallets.note, /cannot be compared across industries/i)

  const megawatts = classifyFootprint(organizationWith([scale('capacity', '980 MW in operation')], 'org-fp-mw'))
  assert.equal(megawatts.band, 'not-established')
})

test('a tonnage figure filed under sites is not read as a site count', () => {
  const classification = classifyFootprint(
    organizationWith([scale('sites', 'Storage and grading capacity of 35,000 metric tons')], 'org-fp-tons'),
  )
  assert.equal(classification.band, 'not-established')
  assert.match(classification.basis, /sector-specific measures are sourced/i)
})

test('a range bands on its lower bound, never its upper bound', () => {
  const classification = classifyFootprint(organizationWith([scale('employees', '51-200 employees')], 'org-fp-range'))
  // 51 employees is regional-specialist; 200 with 4+ sites would be large.
  assert.equal(classification.band, 'regional-specialist')
  assert.match(classification.basis, /51/)
})

test('a division-scoped headcount cannot establish national reach', () => {
  const division = classifyFootprint(
    organizationWith([scale('employees', '145 full time employees (abalone pump-ashore facility, Danger Point)')], 'org-fp-division'),
  )
  assert.equal(division.entityScope, 'operating-division')
  assert.equal(division.band, 'regional-specialist')

  const group = classifyFootprint(organizationWith([scale('employees', 'approximately 168,000 employees')], 'org-fp-group'))
  assert.equal(group.band, 'major-national')

  const hugeDivision = classifyFootprint(
    organizationWith([scale('employees', '25,000 people at the group')], 'org-fp-group-2'),
  )
  assert.equal(hugeDivision.band, 'major-national')
  assert.equal(hugeDivision.entityScope, 'consolidated-group')
})

test('a South African operation is scoped as one, not as the group', () => {
  const classification = classifyFootprint(organizationWith([scale('employees', '6,000+ employees in South Africa')], 'org-fp-sa'))
  assert.equal(classification.entityScope, 'south-african-operation')
})

test('a source that does not state the scope is reported as not stated, never defaulted', () => {
  const classification = classifyFootprint(organizationWith([scale('employees', '820 total employees')], 'org-fp-unscoped'))
  assert.equal(classification.entityScope, 'not-stated')
  assert.match(classification.note, /does not state whether/i)
})

test('site counts band reach with probable confidence and a review request', () => {
  const classification = classifyFootprint(organizationWith([scale('sites', '34 manufacturing plants in South Africa')], 'org-fp-sites'))
  assert.equal(classification.band, 'large-multi-site')
  assert.equal(classification.confidence, 'probable')
  assert.equal(classification.reviewStatus, 'pending-review')
  assert.match(classification.note, /site counts indicate reach/i)
})

test('every derived band is pending review until a human has reviewed it', () => {
  for (const organization of organizations) {
    const classification = classifyFootprint(organization)
    if (classification.band === 'not-established') continue
    assert.notEqual(classification.reviewStatus, 'reviewed',
      `${organization.id} claims human review without a reviewer record`)
    assert.equal(classification.reviewedBy, '')
    assert.equal(classification.reviewedOn, '')
  }
})

test('footprint is derived from sourced metrics only, and the metrics are cited', () => {
  for (const organization of organizations) {
    const classification = classifyFootprint(organization)
    if (classification.band === 'not-established') continue
    assert.ok(classification.supportingMetricIds.length > 0,
      `${organization.id} has band ${classification.band} with no cited metric`)
    for (const metricId of classification.supportingMetricIds) {
      const position = Number(metricId.split(':').pop())
      assert.ok(organization.scale[position], `${organization.id} cites ${metricId} which does not exist`)
    }
    assert.ok(classification.basis.length > 0)
  }
})

test('no curated company is assigned a band that its evidence cannot support', () => {
  const counts = footprintCounts(organizations)
  assert.equal(counts.length, FOOTPRINT_BANDS.length)
  const total = counts.reduce((sum, entry) => sum + entry.count, 0)
  assert.equal(total, organizations.length, 'every company lands in exactly one band')
  for (const entry of counts) {
    assert.ok(entry.count >= 0)
  }
  // The register is mostly unmeasured, so "not established" must be the largest
  // band. Asserting the opposite would mean the classifier invented reach.
  const notEstablished = counts.find((entry) => entry.band === 'not-established')?.count ?? 0
  const established = total - notEstablished
  assert.ok(notEstablished > established,
    `expected most companies to be unmeasured, got ${established} classified of ${total}`)
})

test('a dataset-only employer resolves to not-established rather than being dropped', () => {
  const classification = footprintFor(index, 'org-dataset:does-not-exist')
  assert.equal(classification.band, 'not-established')
  assert.equal(classification.confidence, 'unknown')
  assert.match(classification.basis, /no curated company record/i)
})

test('the same company always classifies identically (deterministic layout input)', () => {
  for (const organization of organizations.slice(0, 30)) {
    assert.deepEqual(classifyFootprint(organization), classifyFootprint(organization))
  }
})

test('Rand revenue expands billion and million multipliers before banding', () => {
  const billions = classifyFootprint(organizationWith([scale('revenue', 'R28.3 billion')], 'org-fp-revenue-bn'))
  assert.equal(billions.band, 'major-national')
  assert.match(billions.basis, /28,300,000,000|28 300 000 000/)

  const millions = classifyFootprint(organizationWith([scale('revenue', 'R125m')], 'org-fp-revenue-m'))
  assert.equal(millions.band, 'large-multi-site')
})

test('non-Rand revenue is not silently compared against Rand thresholds', () => {
  const classification = classifyFootprint(organizationWith([scale('revenue', 'A$2.3 billion')], 'org-fp-revenue-aud'))
  assert.equal(classification.band, 'not-established')
  assert.equal(classification.supportingMetricIds.length, 0)
})

test('a narrow upper-only turnover bound stays smaller-emerging and is not displayed as exact turnover', () => {
  const classification = classifyFootprint(organizationWith([
    { ...scale('revenue', 'less than R1 million (estimated annual turnover)'), basis: 'third-party-estimate' as const },
  ], 'org-fp-revenue-upper-bound'))
  assert.equal(classification.band, 'smaller-emerging')
  assert.equal(classification.confidence, 'probable')
  assert.match(classification.basis, /below R1,000,000|below R1 000 000/)
  assert.doesNotMatch(classification.basis, /turnover of R1/)
  assert.equal(classification.supportingMetricIds.length, 1)
})

test('a broad upper-only turnover bound cannot choose between footprint bands', () => {
  const classification = classifyFootprint(organizationWith([
    scale('revenue', 'less than R25 million (estimated annual turnover)'),
  ], 'org-fp-revenue-broad-upper-bound'))
  assert.equal(classification.band, 'not-established')
  assert.equal(classification.supportingMetricIds.length, 0)
})

test('a lower-bounded turnover range is not mistaken for an upper-only bound', () => {
  const classification = classifyFootprint(organizationWith([
    scale('revenue', 'estimated annual turnover of R1 million but less than R10 million'),
  ], 'org-fp-revenue-lower-bounded-range'))
  assert.equal(classification.band, 'smaller-emerging')
  assert.match(classification.basis, /turnover of R1,000,000|turnover of R1 000 000/)
  assert.doesNotMatch(classification.basis, /upper-bound estimate/i)
})

test('third-party headcount estimates remain probable rather than confirmed', () => {
  const classification = classifyFootprint(organizationWith([
    { ...scale('employees', '8,000 employees'), basis: 'third-party-estimate' as const },
  ], 'org-fp-estimate'))
  assert.equal(classification.band, 'major-national')
  assert.equal(classification.confidence, 'probable')
})

test('total workforce is not substituted for the distinct employees measure', () => {
  const workforceOnly = classifyFootprint(organizationWith([
    scale('total-workforce', '22,042 including indirect employees'),
  ], 'org-fp-workforce-only'))
  assert.equal(workforceOnly.band, 'not-established')
  assert.match(workforceOnly.note, /not converted into headcount/i)

  const both = classifyFootprint(organizationWith([
    scale('employees', '9,208 employees'),
    scale('total-workforce', '22,042 including indirect employees'),
  ], 'org-fp-workforce-both'))
  assert.equal(both.band, 'major-national')
  assert.match(both.basis, /9,208/)
  assert.equal(both.supportingMetricIds.length, 1)
})

test('order books and delivered output stay visible without assigning a band', () => {
  const classification = classifyFootprint(organizationWith([
    scale('order-book', 'R37.6 billion'),
    scale('completed-projects', '2,000+ completed projects'),
    scale('homes-delivered', '90,000 homes and counting'),
  ], 'org-fp-context-only'))
  assert.equal(classification.band, 'not-established')
  assert.match(classification.basis, /contextual operating measures/i)
})

test('a primary headcount supersedes a larger third-party estimate for classification', () => {
  const classification = classifyFootprint(organizationWith([
    { ...scale('employees', 'over 7,000 employees'), basis: 'third-party-estimate' as const, asOf: '2026' },
    { ...scale('employees', '5,649 group employees'), asOf: '2026-02-28', entityScope: 'consolidated-group' as const },
  ], 'org-fp-primary-precedence'))
  assert.match(classification.basis, /5,649/)
  assert.equal(classification.entityScope, 'consolidated-group')
  assert.equal(classification.confidence, 'confirmed')
})
