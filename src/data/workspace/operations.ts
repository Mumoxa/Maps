// Pure workspace operations. Every function returns a new Workspace and never
// mutates its input, so the React layer and tests share the same logic.

import { applyFilters, discover, type CuratedAssociation } from '../intelligence/discovery'
import type { IntelligenceGraph } from '../intelligence/graph'
import type { Tier, TierOverride } from '../intelligence/targeting'
import type { ResearchBatch, SearchRequirement } from '../intelligence/types'
import type {
  ImportBatchRecord,
  PoolQuery,
  RecruitmentSearch,
  SavedTargetPool,
  SearchPerson,
  SearchPersonStatus,
  SearchTargetCompany,
  StoredOverride,
  TargetStatus,
  Workspace,
} from './types'

export interface OpContext {
  now: string
  newId: (prefix: string) => string
}

export function defaultOpContext(): OpContext {
  return {
    now: new Date().toISOString(),
    newId: (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
  }
}

function touch(ws: Workspace, ctx: OpContext, patch: Partial<Workspace>): Workspace {
  return { ...ws, ...patch, updatedAt: ctx.now }
}

// ----- Assignments -----

export function createSearch(
  ws: Workspace,
  ctx: OpContext,
  input: { name: string; client: string; requirement: SearchRequirement; focalOrganizationIds?: string[]; bankSearchId?: string | null; notes?: string },
): { workspace: Workspace; search: RecruitmentSearch } {
  const name = input.name.trim()
  if (!name) throw new Error('An assignment needs a name')
  const search: RecruitmentSearch = {
    id: ctx.newId('search'),
    name,
    client: input.client.trim(),
    status: 'open',
    createdAt: ctx.now,
    updatedAt: ctx.now,
    requirement: input.requirement,
    focalOrganizationIds: [...new Set(input.focalOrganizationIds ?? [])],
    bankSearchId: input.bankSearchId ?? null,
    notes: input.notes ?? '',
  }
  return { workspace: touch(ws, ctx, { searches: [...ws.searches, search] }), search }
}

export function updateSearch(ws: Workspace, ctx: OpContext, id: string, patch: Partial<Omit<RecruitmentSearch, 'id' | 'createdAt'>>): Workspace {
  return touch(ws, ctx, { searches: ws.searches.map((search) => (search.id === id ? { ...search, ...patch, updatedAt: ctx.now } : search)) })
}

export function deleteSearch(ws: Workspace, ctx: OpContext, id: string): Workspace {
  return touch(ws, ctx, {
    searches: ws.searches.filter((search) => search.id !== id),
    targets: ws.targets.filter((target) => target.searchId !== id),
    searchPeople: ws.searchPeople.filter((person) => person.searchId !== id),
    overrides: ws.overrides.filter((override) => override.contextKey !== `search:${id}`),
    pools: ws.pools.map((pool) => (pool.searchId === id ? { ...pool, searchId: null } : pool)),
  })
}

// ----- Target companies -----

/** Adds companies to a search; a company already targeted is not added twice. */
export function addTargets(
  ws: Workspace,
  ctx: OpContext,
  searchId: string,
  items: { organizationId: string; tier: Tier | null }[],
  addedFrom: SearchTargetCompany['addedFrom'],
): { workspace: Workspace; added: number; skipped: number } {
  const existing = new Set(ws.targets.filter((target) => target.searchId === searchId).map((target) => target.organizationId))
  const additions: SearchTargetCompany[] = []
  let skipped = 0
  for (const item of items) {
    if (existing.has(item.organizationId)) {
      skipped++
      continue
    }
    existing.add(item.organizationId)
    additions.push({
      id: ctx.newId('target'),
      searchId,
      organizationId: item.organizationId,
      status: 'proposed',
      tierWhenAdded: item.tier,
      addedAt: ctx.now,
      addedFrom,
      notes: '',
    })
  }
  return { workspace: touch(ws, ctx, { targets: [...ws.targets, ...additions] }), added: additions.length, skipped }
}

export function setTargetStatus(ws: Workspace, ctx: OpContext, targetId: string, status: TargetStatus, notes?: string): Workspace {
  return touch(ws, ctx, { targets: ws.targets.map((target) => (target.id === targetId ? { ...target, status, notes: notes ?? target.notes } : target)) })
}

export function removeTarget(ws: Workspace, ctx: OpContext, targetId: string): Workspace {
  return touch(ws, ctx, { targets: ws.targets.filter((target) => target.id !== targetId) })
}

// ----- People in a search -----

/** Adds a person to a search once. The same person in another search gets a separate record and assessment. */
export function addSearchPerson(ws: Workspace, ctx: OpContext, searchId: string, personId: string, organizationId: string | null): { workspace: Workspace; added: boolean } {
  if (ws.searchPeople.some((row) => row.searchId === searchId && row.personId === personId)) return { workspace: ws, added: false }
  const row: SearchPerson = {
    id: ctx.newId('sp'),
    searchId,
    personId,
    organizationId,
    status: 'identified',
    assessment: '',
    addedAt: ctx.now,
    updatedAt: ctx.now,
  }
  return { workspace: touch(ws, ctx, { searchPeople: [...ws.searchPeople, row] }), added: true }
}

export function updateSearchPerson(ws: Workspace, ctx: OpContext, id: string, patch: { status?: SearchPersonStatus; assessment?: string }): Workspace {
  return touch(ws, ctx, { searchPeople: ws.searchPeople.map((row) => (row.id === id ? { ...row, ...patch, updatedAt: ctx.now } : row)) })
}

export function removeSearchPerson(ws: Workspace, ctx: OpContext, id: string): Workspace {
  return touch(ws, ctx, { searchPeople: ws.searchPeople.filter((row) => row.id !== id) })
}

// ----- Tier overrides -----

export function contextKeyFor(searchId: string | null, roleContextId: string | null): string {
  if (searchId) return `search:${searchId}`
  if (roleContextId) return `context:${roleContextId}`
  return 'custom'
}

/** Records a recruiter override. A reason is mandatory; the computed tier is always kept alongside. */
export function setOverride(ws: Workspace, ctx: OpContext, contextKey: string, organizationId: string, tier: Tier, reason: string, by: string): Workspace {
  const trimmed = reason.trim()
  if (!trimmed) throw new Error('An override needs a reason')
  const override: StoredOverride = { contextKey, organizationId, tier, reason: trimmed, by: by.trim() || 'recruiter', at: ctx.now }
  const rest = ws.overrides.filter((row) => !(row.contextKey === contextKey && row.organizationId === organizationId))
  return touch(ws, ctx, { overrides: [...rest, override] })
}

export function clearOverride(ws: Workspace, ctx: OpContext, contextKey: string, organizationId: string): Workspace {
  return touch(ws, ctx, { overrides: ws.overrides.filter((row) => !(row.contextKey === contextKey && row.organizationId === organizationId)) })
}

export function overridesFor(ws: Workspace, contextKey: string): Map<string, TierOverride> {
  const map = new Map<string, TierOverride>()
  for (const row of ws.overrides) if (row.contextKey === contextKey) map.set(row.organizationId, { tier: row.tier, reason: row.reason, by: row.by, at: row.at })
  return map
}

// ----- Curated associations -----

export function addCuratedAssociation(ws: Workspace, ctx: OpContext, fromId: string, toId: string, reason: string, author: string): Workspace {
  if (!reason.trim()) throw new Error('A recruiter association needs a reason')
  if (fromId === toId) throw new Error('A company cannot be associated with itself')
  const row: CuratedAssociation = { id: ctx.newId('assoc'), fromId, toId, reason: reason.trim(), author: author.trim() || 'recruiter', createdAt: ctx.now }
  return touch(ws, ctx, { curatedAssociations: [...ws.curatedAssociations, row] })
}

export function removeCuratedAssociation(ws: Workspace, ctx: OpContext, id: string): Workspace {
  return touch(ws, ctx, { curatedAssociations: ws.curatedAssociations.filter((row) => row.id !== id) })
}

/** Other companies targeted in searches that also targeted (or focused on) the given company. */
export function previousTargetsFor(ws: Workspace, focalId: string | null): Map<string, string[]> {
  const out = new Map<string, string[]>()
  if (!focalId) return out
  const searchById = new Map(ws.searches.map((search) => [search.id, search]))
  const targetsBySearch = new Map<string, string[]>()
  for (const target of ws.targets) {
    const list = targetsBySearch.get(target.searchId) ?? []
    list.push(target.organizationId)
    targetsBySearch.set(target.searchId, list)
  }
  for (const [searchId, orgIds] of targetsBySearch) {
    const search = searchById.get(searchId)
    if (!search) continue
    if (!orgIds.includes(focalId) && !search.focalOrganizationIds.includes(focalId)) continue
    for (const orgId of orgIds) {
      if (orgId === focalId) continue
      const list = out.get(orgId) ?? []
      if (!list.includes(search.name)) list.push(search.name)
      out.set(orgId, list)
    }
  }
  return out
}

// ----- Saved target pools -----

export function savePool(
  ws: Workspace,
  ctx: OpContext,
  input: { name: string; mode: SavedTargetPool['mode']; query: PoolQuery; organizationIds: string[]; tiers: Record<string, Tier>; searchId?: string | null },
): { workspace: Workspace; pool: SavedTargetPool } {
  const name = input.name.trim()
  if (!name) throw new Error('A pool needs a name')
  const pool: SavedTargetPool = {
    id: ctx.newId('pool'),
    name,
    mode: input.mode,
    createdAt: ctx.now,
    query: input.query,
    snapshot: input.mode === 'snapshot' ? { organizationIds: [...input.organizationIds], tiers: { ...input.tiers }, capturedAt: ctx.now } : null,
    searchId: input.searchId ?? null,
  }
  return { workspace: touch(ws, ctx, { pools: [...ws.pools, pool] }), pool }
}

export function deletePool(ws: Workspace, ctx: OpContext, id: string): Workspace {
  return touch(ws, ctx, { pools: ws.pools.filter((pool) => pool.id !== id) })
}

/** Current membership of a pool. Snapshot pools also report what the live query would change. */
export function resolvePool(graph: IntelligenceGraph, pool: SavedTargetPool, overrides?: Map<string, TierOverride>) {
  const live = discover(graph, { focalId: pool.query.focalId, requirement: pool.query.requirement, scope: pool.query.scope, overrides })
  const liveRows = applyFilters(graph, live.rows, pool.query.filters).filter((row) => row.role !== 'focal')
  const liveIds = liveRows.map((row) => row.organizationId)
  const liveTiers: Record<string, Tier> = Object.fromEntries(liveRows.map((row) => [row.organizationId, row.assessment.tier]))
  if (pool.mode === 'dynamic' || !pool.snapshot) return { organizationIds: liveIds, tiers: liveTiers, added: [] as string[], removed: [] as string[], tierChanged: [] as string[] }
  const snapshotSet = new Set(pool.snapshot.organizationIds)
  const liveSet = new Set(liveIds)
  return {
    organizationIds: pool.snapshot.organizationIds,
    tiers: pool.snapshot.tiers,
    added: liveIds.filter((id) => !snapshotSet.has(id)),
    removed: pool.snapshot.organizationIds.filter((id) => !liveSet.has(id)),
    tierChanged: pool.snapshot.organizationIds.filter((id) => liveSet.has(id) && liveTiers[id] !== pool.snapshot?.tiers[id]),
  }
}

// ----- Private research imports -----

export function commitImport(ws: Workspace, ctx: OpContext, record: ImportBatchRecord, batch: ResearchBatch): Workspace {
  if (ws.imports.some((row) => row.contentHash === record.contentHash && row.status === 'committed')) throw new Error('This file has already been imported')
  return touch(ws, ctx, { imports: [...ws.imports, record], researchBatches: [...ws.researchBatches, batch] })
}

export function rollbackImport(ws: Workspace, ctx: OpContext, importId: string): Workspace {
  const record = ws.imports.find((row) => row.id === importId)
  if (!record) return ws
  return touch(ws, ctx, {
    imports: ws.imports.map((row) => (row.id === importId ? { ...row, status: 'rolled-back' as const } : row)),
    researchBatches: ws.researchBatches.filter((batch) => batch.batchId !== record.researchBatchId),
  })
}
