// Private workspace: operations, persistence, import idempotence and rollback.
// Every company named "Synthetic ..." below is an explicitly labelled test
// fixture. Fixtures live only in memory during the test and are never written
// to the repository.

import test from 'node:test'
import assert from 'node:assert/strict'
import { buildIntelligenceGraph, publicGraph, roleContextById } from '../src/data/intelligence/index'
import { discover, EMPTY_FILTERS } from '../src/data/intelligence/discovery'
import { requirementFromTemplate } from '../src/data/intelligence/targeting'
import {
  addCuratedAssociation,
  addSearchPerson,
  addTargets,
  clearOverride,
  commitImport,
  contextKeyFor,
  createSearch,
  deleteSearch,
  overridesFor,
  previousTargetsFor,
  resolvePool,
  rollbackImport,
  savePool,
  setOverride,
  type OpContext,
} from '../src/data/workspace/operations'
import { createBrowserStore, createMemoryStore, parseWorkspace, WORKSPACE_STORAGE_KEY } from '../src/data/workspace/store'
import { previewImport, validateResearchBatch } from '../src/data/workspace/importer'
import { emptyWorkspace, type ImportBatchRecord } from '../src/data/workspace/types'

const graph = publicGraph()

function ctx(): OpContext {
  let counter = 0
  return { now: '2026-10-08T10:00:00.000Z', newId: (prefix) => `${prefix}-${++counter}` }
}

const fmRequirement = () => {
  const template = roleContextById.get('fm-temperature-controlled')
  assert.ok(template)
  return requirementFromTemplate(template)
}

test('assignments: create, target companies once, add people per search, delete cascades', () => {
  const c = ctx()
  const { workspace: ws1, search } = createSearch(emptyWorkspace(), c, { name: 'Synthetic FM search', client: 'Synthetic client', requirement: fmRequirement(), focalOrganizationIds: ['org-commercial-cold-holdings'] })
  assert.throws(() => createSearch(ws1, c, { name: '   ', client: '', requirement: fmRequirement() }))
  const added = addTargets(ws1, c, search.id, [{ organizationId: 'org-snolink', tier: 'tier-1' }, { organizationId: 'org-snolink', tier: 'tier-1' }, { organizationId: 'org-oceana-group', tier: 'tier-1' }], 'explorer')
  assert.equal(added.added, 2)
  assert.equal(added.skipped, 1)
  const again = addTargets(added.workspace, c, search.id, [{ organizationId: 'org-snolink', tier: 'tier-1' }], 'pool')
  assert.equal(again.added, 0)
  const person = addSearchPerson(again.workspace, c, search.id, 'person:accountants:test', 'org-snolink')
  assert.equal(person.added, true)
  assert.equal(addSearchPerson(person.workspace, c, search.id, 'person:accountants:test', 'org-snolink').added, false)
  const previous = previousTargetsFor(person.workspace, 'org-commercial-cold-holdings')
  assert.deepEqual(previous.get('org-snolink'), ['Synthetic FM search'])
  const withOverride = setOverride(person.workspace, c, contextKeyFor(search.id, null), 'org-snolink', 'tier-2', 'Synthetic reason', 'tester')
  const removed = deleteSearch(withOverride, c, search.id)
  assert.equal(removed.searches.length, 0)
  assert.equal(removed.targets.length, 0)
  assert.equal(removed.searchPeople.length, 0)
  assert.equal(removed.overrides.length, 0)
})

test('overrides: a reason is mandatory and overrides are scoped to a context', () => {
  const c = ctx()
  assert.throws(() => setOverride(emptyWorkspace(), c, 'custom', 'org-snolink', 'tier-4', '  ', 'tester'))
  const ws = setOverride(emptyWorkspace(), c, 'context:fm-temperature-controlled', 'org-snolink', 'tier-4', 'Synthetic: client competitor', 'tester')
  assert.equal(overridesFor(ws, 'context:fm-temperature-controlled').get('org-snolink')?.tier, 'tier-4')
  assert.equal(overridesFor(ws, 'context:hof-agri-commodity').size, 0)
  assert.equal(clearOverride(ws, c, 'context:fm-temperature-controlled', 'org-snolink').overrides.length, 0)
})

test('curated associations need a reason and appear as suggestions, not facts', () => {
  const c = ctx()
  assert.throws(() => addCuratedAssociation(emptyWorkspace(), c, 'org-commercial-cold-holdings', 'org-avi', '', 'tester'))
  const ws = addCuratedAssociation(emptyWorkspace(), c, 'org-commercial-cold-holdings', 'org-avi', 'Synthetic: recruiter judgement', 'tester')
  const result = discover(graph, { focalId: 'org-commercial-cold-holdings', requirement: fmRequirement(), scope: 'associated', curatedAssociations: ws.curatedAssociations })
  const row = result.rowById.get('org-avi')
  assert.ok(row)
  const curated = row.dimensions.find((dim) => dim.type === 'recruiter-observation')
  assert.ok(curated)
  assert.equal(curated.basis, 'suggestion')
})

test('pools: snapshot keeps its list and reports drift, dynamic follows the query', () => {
  const c = ctx()
  const requirement = fmRequirement()
  const query = { focalId: 'org-commercial-cold-holdings', roleContextId: 'fm-temperature-controlled', requirement, filters: { ...EMPTY_FILTERS, tiers: ['tier-1' as const] }, scope: 'associated' as const }
  const live = resolvePool(graph, { id: 'x', name: 'x', mode: 'dynamic', createdAt: '', query, snapshot: null, searchId: null })
  assert.ok(live.organizationIds.includes('org-snolink'))
  const { pool } = savePool(emptyWorkspace(), c, { name: 'Synthetic snapshot', mode: 'snapshot', query, organizationIds: ['org-snolink', 'org-absa-group'], tiers: { 'org-snolink': 'tier-2', 'org-absa-group': 'tier-1' } })
  const drift = resolvePool(graph, pool)
  assert.deepEqual(drift.organizationIds, ['org-snolink', 'org-absa-group'])
  assert.ok(drift.removed.includes('org-absa-group'))
  assert.ok(drift.tierChanged.includes('org-snolink'))
  assert.ok(drift.added.length > 0)
})

test('store: browser store round-trips and rejects foreign shapes; memory store clears', () => {
  const backing = new Map<string, string>()
  const storage = {
    getItem: (key: string) => backing.get(key) ?? null,
    setItem: (key: string, value: string) => void backing.set(key, value),
    removeItem: (key: string) => void backing.delete(key),
  } as unknown as Storage
  const store = createBrowserStore(storage)
  assert.equal(store.kind, 'browser-local')
  const { workspace } = createSearch(emptyWorkspace(), ctx(), { name: 'Synthetic', client: '', requirement: fmRequirement() })
  store.save(workspace)
  assert.equal(store.load().searches[0].name, 'Synthetic')
  backing.set(WORKSPACE_STORAGE_KEY, '{"not":"a workspace"}')
  assert.equal(store.load().searches.length, 0)
  backing.set(WORKSPACE_STORAGE_KEY, 'not json')
  assert.equal(store.load().searches.length, 0)
  assert.equal(parseWorkspace({ schemaVersion: 2 }), null)
  const memory = createMemoryStore(workspace)
  memory.clear()
  assert.equal(memory.load().searches.length, 0)
})

const CSV = [
  'company,website,industry,industry_role,capability,capability_status,confidence,evidence_url,source_name,source_type,published_on,supports,province,city,related_company,relationship_type',
  'Synthetic Cold Store Fixture,,cold-chain,primary,cold-storage,observed,probable,https://example.invalid/fixture,Test fixture,recruiter-note,2026-10-01,Synthetic statement for tests,Western Cape,Cape Town,,',
  'Synthetic Cold Store Fixture,,,,,,,,,,,,,,,',
  'Synthetic No Evidence Fixture,,cold-chain,primary,,,probable,,,,,,,,,',
  'Overberg Agri,,agri-merchants,primary,,,confirmed,https://example.invalid/dup,Test fixture,recruiter-note,,Synthetic duplicate statement,,,,',
].join('\n')

test('import: preview classifies rows, commit is idempotent and rollback removes facts', () => {
  const preview = previewImport(graph, CSV, 'fixture.csv', '2026-10-08', new Set())
  assert.equal(preview.fatal, null)
  const byLine = new Map(preview.rows.map((row) => [row.line, row]))
  assert.equal(byLine.get(2)?.status, 'new')
  assert.equal(byLine.get(3)?.status, 'rejected')
  assert.equal(byLine.get(4)?.status, 'rejected')
  assert.ok(byLine.get(4)?.issues.some((issue) => issue.includes('evidence')))
  assert.equal(byLine.get(5)?.status, 'duplicate')
  assert.deepEqual(validateResearchBatch(graph, preview.batch), [])

  const record: ImportBatchRecord = {
    id: 'import-1',
    fileName: 'fixture.csv',
    importedAt: '2026-10-08T10:00:00.000Z',
    contentHash: preview.contentHash,
    format: preview.format,
    rowCount: preview.summary.rows,
    accepted: preview.summary.accepted,
    duplicates: preview.summary.duplicates,
    conflicts: preview.summary.conflicts,
    rejected: preview.summary.rejected,
    newOrganizations: preview.summary.newOrganizations,
    researchBatchId: preview.batch.batchId,
    status: 'committed',
  }
  const c = ctx()
  const ws = commitImport(emptyWorkspace(), c, record, preview.batch)
  assert.throws(() => commitImport(ws, c, record, preview.batch), /already been imported/)
  const again = previewImport(graph, CSV, 'fixture.csv', '2026-10-08', new Set([preview.contentHash]))
  assert.equal(again.alreadyImported, true)

  const privateGraph = buildIntelligenceGraph(ws.researchBatches, new Set(ws.researchBatches.map((batch) => batch.batchId)))
  const fixtureId = preview.rows[0].organizationId
  assert.ok(fixtureId && privateGraph.organizationById.has(fixtureId))
  assert.ok(privateGraph.privateFactOrgs.has(fixtureId))
  assert.ok(!graph.organizationById.has(fixtureId), 'private import never touches the public graph')

  const rolled = rollbackImport(ws, c, 'import-1')
  assert.equal(rolled.researchBatches.length, 0)
  assert.equal(rolled.imports[0].status, 'rolled-back')
})

test('import: malformed input is reported, not guessed', () => {
  assert.ok(previewImport(graph, '', 'empty.csv', '2026-10-08', new Set()).fatal)
  assert.ok(previewImport(graph, 'name,website\nX,y', 'bad.csv', '2026-10-08', new Set()).fatal)
  assert.ok(previewImport(graph, '{broken', 'bad.json', '2026-10-08', new Set()).fatal)
  const unknownIndustry = previewImport(graph, 'company,industry,evidence_url\nSynthetic Fixture,not-a-real-industry,https://example.invalid', 'x.csv', '2026-10-08', new Set())
  assert.equal(unknownIndustry.rows[0].status, 'rejected')
})
