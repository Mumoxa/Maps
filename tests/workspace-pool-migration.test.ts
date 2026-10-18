import test from 'node:test'
import assert from 'node:assert/strict'
import {
  EMPTY_WORKSPACE,
  WORKSPACE_SCHEMA_VERSION,
  focalPoolDefinition,
  industryPoolDefinition,
  migratePool,
  migratePoolDefinition,
  normalizeWorkspace,
  universePoolDefinition,
} from '../src/data/organizations/workspace'
import { emptyFilters } from '../src/data/organizations/query'
import { EMPTY_FILTERS, FILTER_KEYS } from '../src/data/organizations/types'

const ENTRY = { organizationId: 'org-ccs-logistics', reason: 'Shared cold chain', tier: 1 as const, addedOn: '2026-10-08' }

test('the serialised filter keys include every dimension the UI offers', () => {
  // The macro-sector omission was a real bug: the panel and the engine supported
  // it, the URL round-trip did not, so a selected macro-sector vanished.
  assert.ok(FILTER_KEYS.includes('macroSectors'))
  assert.ok(FILTER_KEYS.includes('footprint'))
  assert.ok(FILTER_KEYS.includes('groups'))
  for (const key of FILTER_KEYS) {
    assert.ok(Array.isArray(EMPTY_FILTERS[key]), `${key} must be a list filter`)
    assert.ok(Array.isArray(emptyFilters()[key]), `emptyFilters() must initialise ${key}`)
  }
})

test('a legacy focal pool definition migrates to a focal scope unchanged', () => {
  const migrated = migratePoolDefinition({
    focalId: 'org-ccs-logistics',
    roleContextId: 'role-cold-storage-financial-manager',
    filters: { provinces: ['Western Cape'] },
  })
  assert.ok(migrated)
  assert.equal(migrated.scope.kind, 'focal')
  assert.deepEqual(migrated.scope, {
    kind: 'focal',
    focalId: 'org-ccs-logistics',
    roleContextId: 'role-cold-storage-financial-manager',
  })
  assert.deepEqual(migrated.filters.provinces, ['Western Cape'])
})

test('an industry-defined pool needs no focal company', () => {
  const definition = industryPoolDefinition({ ...emptyFilters(), footprint: ['major-national'] }, 'TRA-COLD')
  assert.equal(definition.scope.kind, 'industry')
  assert.deepEqual(definition.scope, { kind: 'industry', nodeId: 'TRA-COLD', roleContextId: null })
  assert.deepEqual(definition.filters.footprint, ['major-national'])

  const withRole = industryPoolDefinition(emptyFilters(), 'TRA', 'role-cold-storage-financial-manager')
  assert.deepEqual(withRole.scope, { kind: 'industry', nodeId: 'TRA', roleContextId: 'role-cold-storage-financial-manager' })

  const universe = universePoolDefinition(emptyFilters())
  assert.deepEqual(universe.scope, { kind: 'universe', roleContextId: null })
})

test('a focal definition still records the focal company and the brief', () => {
  const definition = focalPoolDefinition(emptyFilters(), 'org-slm-developments', 'role-slm-property-development')
  assert.equal(definition.scope.kind, 'focal')
  assert.deepEqual(definition.scope, {
    kind: 'focal',
    focalId: 'org-slm-developments',
    roleContextId: 'role-slm-property-development',
  })
})

test('a v1 pool survives migration with its membership intact', () => {
  const legacy = {
    id: 'pool-legacy-1',
    name: 'Western Cape cold chain sources',
    description: 'Saved before the Industry Atlas existed.',
    classification: 'Industry pocket',
    owner: 'Talent Tree',
    kind: 'dynamic',
    entries: [ENTRY],
    definition: {
      focalId: 'org-ccs-logistics',
      roleContextId: 'role-cold-storage-financial-manager',
      filters: { provinces: ['Western Cape'] },
    },
    searchId: null,
    createdOn: '2026-10-08',
    lastVerified: '2026-10-08',
    reuseCount: 3,
  }
  const pool = migratePool(legacy)
  assert.ok(pool, 'a legacy pool must not be discarded')
  assert.equal(pool.entries.length, 1)
  assert.equal(pool.entries[0].organizationId, 'org-ccs-logistics')
  assert.equal(pool.reuseCount, 3)
  assert.equal(pool.kind, 'dynamic')
  assert.equal(pool.definition?.scope.kind, 'focal')
})

test('a saved snapshot is never given a definition it did not have', () => {
  const pool = migratePool({
    id: 'pool-snap',
    name: 'Snapshot pool',
    kind: 'snapshot',
    entries: [ENTRY],
    definition: { focalId: 'org-ccs-logistics', roleContextId: 'x', filters: {} },
  })
  assert.ok(pool)
  assert.equal(pool.kind, 'snapshot')
  assert.equal(pool.definition, null)
})

test('an unreadable definition degrades to a snapshot instead of deleting saved work', () => {
  const pool = migratePool({
    id: 'pool-broken',
    name: 'Broken definition pool',
    kind: 'dynamic',
    entries: [ENTRY],
    definition: { nonsense: true },
  })
  assert.ok(pool, 'the pool itself must survive')
  assert.equal(pool.entries.length, 1)
  assert.equal(pool.kind, 'snapshot', 'an underivable dynamic pool becomes a snapshot, not a deletion')
})

test('a whole workspace normalises to the current schema without losing pools', () => {
  const legacyState = {
    version: 1,
    pools: [
      { id: 'a', name: 'Legacy A', kind: 'dynamic', entries: [ENTRY], definition: { focalId: 'x', roleContextId: 'y', filters: {} } },
      { id: 'b', name: 'Legacy B', kind: 'snapshot', entries: [] },
    ],
    selection: [ENTRY],
    overrides: { 'role-x:org-y': { tier: 2, reason: 'test', reviewer: 'reviewer', recordedOn: '2026-10-08' } },
    lastFocalId: 'org-ccs-logistics',
    lastRoleContextId: 'role-cold-storage-financial-manager',
  }
  const normalised = normalizeWorkspace(legacyState as never)
  assert.equal(normalised.version, WORKSPACE_SCHEMA_VERSION)
  assert.equal(normalised.pools.length, 2)
  assert.equal(normalised.selection.length, 1)
  assert.equal(normalised.lastNodeId, '', 'a v1 record has no atlas branch, and that is not an error')
  assert.equal(normalised.overrides['role-x:org-y'].tier, 2)
})

test('an empty workspace chooses no company and no brief', () => {
  assert.equal(EMPTY_WORKSPACE.lastFocalId, '')
  assert.equal(EMPTY_WORKSPACE.lastRoleContextId, '')
  assert.equal(EMPTY_WORKSPACE.lastNodeId, '')
  assert.equal(EMPTY_WORKSPACE.pools.length, 0)
})
