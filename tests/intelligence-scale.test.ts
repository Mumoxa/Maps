// Scale check with an explicitly SYNTHETIC in-memory fixture (no real company
// names, never written to disk): the discovery engine must return every
// matching organization (no top-N cap) and stay interactive at several
// thousand organizations.

import test from 'node:test'
import assert from 'node:assert/strict'
import { taxonomy, roleContextById } from '../src/data/intelligence/index'
import { buildGraph } from '../src/data/intelligence/graph'
import { applyFilters, discover, EMPTY_FILTERS } from '../src/data/intelligence/discovery'
import { requirementFromTemplate } from '../src/data/intelligence/targeting'
import type { Organization, ResearchBatch } from '../src/data/intelligence/types'

const SIZE = 5000

function syntheticGraph() {
  const industries = taxonomy.industries.filter((row) => row.parentId).map((row) => row.id)
  const capabilities = taxonomy.capabilities.map((row) => row.id)
  const provinces = ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Free State']
  const organizations: Organization[] = []
  const batch: ResearchBatch = {
    schemaVersion: 1,
    batchId: 'rb-synthetic-scale',
    researchedOn: '2026-10-08',
    researcher: 'synthetic fixture',
    scope: 'Synthetic scale fixture',
    identities: [],
    evidence: [{ id: 'ev-synthetic', url: null, sourceName: 'Synthetic fixture', sourceType: 'internal-dataset', publishedOn: '2026-10-01', supports: 'Synthetic test data' }],
    organizationIndustries: [],
    organizationCapabilities: [],
    organizationRelationships: [],
    locations: [],
    scaleMetrics: [],
    openQuestions: [],
  }
  for (let index = 0; index < SIZE; index++) {
    const id = `org-synthetic-${index}`
    organizations.push({ id, name: `Synthetic Organization ${index}`, aliases: [], formerNames: [], legalName: null, website: null, domain: null, identityStatus: 'unresolved', southAfrican: true, lineage: [], lastVerified: null })
    if (index % 10 === 9) continue // 10% unclassified on purpose
    batch.organizationIndustries.push({ organizationId: id, industryId: industries[index % industries.length], role: 'primary', evidenceIds: ['ev-synthetic'], confidence: 'probable', origin: 'source-reported' })
    batch.organizationCapabilities.push({ organizationId: id, capabilityId: capabilities[index % capabilities.length], status: 'observed', evidenceIds: ['ev-synthetic'], confidence: 'probable', origin: 'source-reported', summary: 'synthetic' })
    batch.locations.push({ organizationId: id, province: provinces[index % provinces.length], city: '', evidenceIds: ['ev-synthetic'], confidence: 'probable' })
    if (index > 0 && index % 50 === 0) batch.organizationRelationships.push({ fromId: id, toId: 'org-synthetic-0', type: 'subsidiary-of', evidenceIds: ['ev-synthetic'], confidence: 'probable', summary: 'synthetic' })
  }
  return buildGraph({ taxonomy, organizations, batches: [batch], asOf: '2026-10-08' })
}

test(`discovery over ${SIZE} synthetic organizations returns everything, quickly`, () => {
  const started = performance.now()
  const graph = syntheticGraph()
  const template = roleContextById.get('fm-temperature-controlled')
  assert.ok(template)
  const result = discover(graph, { focalId: 'org-synthetic-0', requirement: requirementFromTemplate(template), scope: 'all' })
  const filtered = applyFilters(graph, result.rows, { ...EMPTY_FILTERS, provinces: ['Western Cape', 'Gauteng'] })
  const elapsed = performance.now() - started
  assert.equal(result.rows.length, SIZE, 'no top-N cap: every organization is returned in scope=all')
  assert.ok(filtered.length > SIZE / 3)
  const unclassified = result.pockets.find((pocket) => pocket.id === 'pocket:unclassified')
  assert.equal(unclassified?.organizationIds.length, SIZE / 10)
  const pocketTotal = result.pockets.reduce((sum, pocket) => sum + pocket.organizationIds.length, 0)
  assert.equal(pocketTotal, SIZE - 1, 'every non-focal organization lands in exactly one pocket')
  assert.ok(elapsed < 10000, `took ${Math.round(elapsed)}ms`)
})
