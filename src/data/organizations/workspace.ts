// Recruiter workspace persistence for the Company Association Explorer.
//
// Honest scope: this is a browser-local store. It keeps the recruiter's target
// pools, working selection and recorded overrides between sessions on this
// device, and it is the source for the export and for the Search Bank drop that
// `npm run bank:import` commits to the repository. It is NOT a shared server
// store, and the UI says so wherever it appears: no multi-user persistence has
// been provisioned for Maps, and pretending otherwise would be a false claim.

import type {
  AssociationFilters,
  AssociationTier,
  TargetPool,
  TargetPoolDefinition,
  TargetPoolEntry,
  TargetPoolScope,
} from './types'
import { EMPTY_FILTERS } from './types'
import { emptyFilters } from './query'

export const WORKSPACE_STORAGE_KEY = 'maps:company-intelligence:v1'

/**
 * Schema version 2.
 *
 * v2 widens a dynamic pool's definition from `{focalId, roleContextId, filters}`
 * to `{scope, filters}`, so a pool can be defined by an industry branch with no
 * focal company. The storage key is unchanged on purpose: existing saved work
 * lives under v1, and renaming it would orphan every pool a recruiter has ever
 * saved. v1 records are migrated on read instead.
 */
export const WORKSPACE_SCHEMA_VERSION = 2

export interface RecruiterOverride {
  tier: AssociationTier
  reason: string
  reviewer: string
  recordedOn: string
}

export interface WorkspaceState {
  version: number
  pools: TargetPool[]
  /** Working selection: organization id -> reason captured at selection time. */
  selection: { organizationId: string; reason: string; tier: AssociationTier | null; addedOn: string }[]
  /** Key: `${roleContextId}:${organizationId}`. */
  overrides: Record<string, RecruiterOverride>
  lastFocalId: string
  lastRoleContextId: string
  /** Last atlas branch visited, so a return visit lands where the recruiter left off. */
  lastNodeId: string
}

export const EMPTY_WORKSPACE: WorkspaceState = {
  version: WORKSPACE_SCHEMA_VERSION,
  pools: [],
  selection: [],
  overrides: {},
  lastFocalId: '',
  lastRoleContextId: '',
  lastNodeId: '',
}

function completeFilters(filters: Partial<AssociationFilters> | undefined): AssociationFilters {
  return { ...emptyFilters(), ...EMPTY_FILTERS, ...(filters ?? {}) }
}

function isScope(value: unknown): value is TargetPoolScope {
  if (!value || typeof value !== 'object') return false
  const candidate = value as { kind?: unknown }
  if (candidate.kind === 'focal') {
    const focal = value as { focalId?: unknown; roleContextId?: unknown }
    return typeof focal.focalId === 'string' && typeof focal.roleContextId === 'string'
  }
  if (candidate.kind === 'industry') {
    const industry = value as { nodeId?: unknown; roleContextId?: unknown }
    return (industry.nodeId === null || typeof industry.nodeId === 'string')
      && (industry.roleContextId === null || typeof industry.roleContextId === 'string')
  }
  if (candidate.kind === 'universe') {
    const universe = value as { roleContextId?: unknown }
    return universe.roleContextId === null || typeof universe.roleContextId === 'string'
  }
  return false
}

/**
 * Migrate one pool definition.
 *
 * A v1 definition always carried a focal company, so it becomes a `focal` scope
 * with exactly the same focal id and role context: the pool keeps deriving the
 * same membership after migration. A definition that cannot be recognised is
 * downgraded to `null` rather than dropped, which turns the pool into a snapshot
 * of its current entries instead of deleting the recruiter's saved work.
 */
export function migratePoolDefinition(raw: unknown): TargetPoolDefinition | null {
  if (!raw || typeof raw !== 'object') return null
  const candidate = raw as {
    scope?: unknown
    filters?: Partial<AssociationFilters>
    focalId?: unknown
    roleContextId?: unknown
  }
  if (isScope(candidate.scope)) {
    return { scope: candidate.scope, filters: completeFilters(candidate.filters) }
  }
  if (typeof candidate.focalId === 'string' && typeof candidate.roleContextId === 'string') {
    return {
      scope: { kind: 'focal', focalId: candidate.focalId, roleContextId: candidate.roleContextId },
      filters: completeFilters(candidate.filters),
    }
  }
  return null
}

/**
 * Migrate one pool. Membership (`entries`) is never touched, so a migrated
 * snapshot still names the companies the recruiter selected.
 */
export function migratePool(raw: unknown): TargetPool | null {
  if (!raw || typeof raw !== 'object') return null
  const pool = raw as Partial<TargetPool> & { definition?: unknown; entries?: unknown }
  if (typeof pool.id !== 'string' || typeof pool.name !== 'string' || !Array.isArray(pool.entries)) return null
  const definition = pool.kind === 'dynamic' ? migratePoolDefinition(pool.definition) : null
  return {
    id: pool.id,
    name: pool.name,
    description: pool.description ?? '',
    classification: pool.classification ?? 'Industry pocket',
    owner: pool.owner ?? 'Talent Tree',
    // A dynamic pool whose definition cannot be derived is really a fixed list.
    // Calling it a snapshot keeps the UI from offering a re-derive it cannot do.
    kind: pool.kind === 'dynamic' && definition !== null ? 'dynamic' : 'snapshot',
    entries: pool.entries.filter((entry): entry is TargetPoolEntry =>
      Boolean(entry) && typeof (entry as TargetPoolEntry).organizationId === 'string'),
    definition,
    searchId: pool.searchId ?? null,
    createdOn: pool.createdOn ?? '',
    lastVerified: pool.lastVerified ?? '',
    reuseCount: typeof pool.reuseCount === 'number' ? pool.reuseCount : 0,
  }
}

type Listener = () => void
const listeners = new Set<Listener>()
let cache: WorkspaceState = EMPTY_WORKSPACE
let loaded = false
/** Pool ids must stay unique even when two pools are saved in the same millisecond. */
let poolSequence = 0

function storage(): Storage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

function isState(value: unknown): value is WorkspaceState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<WorkspaceState>
  return typeof candidate.version === 'number'
    && Array.isArray(candidate.pools)
    && Array.isArray(candidate.selection)
    && typeof candidate.overrides === 'object' && candidate.overrides !== null
}

/**
 * Normalise a stored record, migrating pools saved under any earlier schema.
 *
 * A pool whose definition cannot be understood is kept as a snapshot rather
 * than discarded: silently deleting a recruiter's saved search because the
 * schema moved on is worse than losing the ability to re-derive it.
 */
export function normalizeWorkspace(parsed: WorkspaceState): WorkspaceState {
  return {
    ...EMPTY_WORKSPACE,
    ...parsed,
    version: WORKSPACE_SCHEMA_VERSION,
    pools: parsed.pools.map(migratePool).filter((pool): pool is TargetPool => pool !== null),
    lastNodeId: typeof parsed.lastNodeId === 'string' ? parsed.lastNodeId : '',
  }
}

export function loadWorkspace(): WorkspaceState {
  if (loaded) return cache
  const store = storage()
  if (!store) {
    loaded = true
    return cache
  }
  try {
    const raw = store.getItem(WORKSPACE_STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isState(parsed)) {
        cache = normalizeWorkspace(parsed)
        // Persist the migrated shape once, so a later downgrade is not required
        // to understand the record.
        if (cache.pools.length > 0) persist(cache)
      }
    }
  } catch {
    // A corrupt local record must never break the explorer; start clean.
    cache = EMPTY_WORKSPACE
  }
  loaded = true
  return cache
}

function persist(next: WorkspaceState): void {
  const store = storage()
  if (!store) return
  try {
    store.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Quota or privacy mode: the session keeps working in memory.
  }
}

function commit(next: WorkspaceState): void {
  cache = next
  persist(next)
  for (const listener of listeners) listener()
}

export function subscribeWorkspace(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getWorkspace(): WorkspaceState {
  return loadWorkspace()
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// --- Selection --------------------------------------------------------------

export function toggleSelected(organizationId: string, reason: string, tier: AssociationTier | null): void {
  const state = getWorkspace()
  const exists = state.selection.some((entry) => entry.organizationId === organizationId)
  commit({
    ...state,
    selection: exists
      ? state.selection.filter((entry) => entry.organizationId !== organizationId)
      : [...state.selection, { organizationId, reason, tier, addedOn: today() }],
  })
}

export function clearSelection(): void {
  commit({ ...getWorkspace(), selection: [] })
}

// --- Target pools -----------------------------------------------------------

export function createPool(input: {
  name: string
  description: string
  classification: string
  owner: string
  kind: TargetPool['kind']
  entries: TargetPoolEntry[]
  definition: TargetPool['definition']
  searchId: string | null
}): TargetPool {
  const state = getWorkspace()
  const pool: TargetPool = {
    id: `pool-${Date.now().toString(36)}-${(poolSequence += 1).toString(36)}`,
    name: input.name,
    description: input.description,
    classification: input.classification,
    owner: input.owner,
    kind: input.kind,
    entries: input.entries,
    definition: input.kind === 'dynamic' ? input.definition : null,
    searchId: input.searchId,
    createdOn: today(),
    lastVerified: today(),
    reuseCount: 0,
  }
  commit({ ...state, pools: [...state.pools, pool] })
  return pool
}

export function saveSelectionToPool(poolName: string, classification: string, owner: string, kind: TargetPool['kind'], definition: TargetPool['definition']): TargetPool | null {
  const state = getWorkspace()
  if (state.selection.length === 0) return null
  return createPool({
    name: poolName,
    description: `${state.selection.length} companies selected in the Company Association Explorer.`,
    classification,
    owner,
    kind,
    entries: state.selection.map((entry) => ({
      organizationId: entry.organizationId,
      reason: entry.reason,
      tier: entry.tier,
      addedOn: entry.addedOn,
    })),
    definition,
    searchId: null,
  })
}

export function addToPool(poolId: string, entries: TargetPoolEntry[]): void {
  const state = getWorkspace()
  commit({
    ...state,
    pools: state.pools.map((pool) => (pool.id === poolId
      ? {
        ...pool,
        entries: mergeEntries(pool.entries, entries),
        lastVerified: today(),
      }
      : pool)),
  })
}

export function removeFromPool(poolId: string, organizationId: string): void {
  const state = getWorkspace()
  commit({
    ...state,
    pools: state.pools.map((pool) => (pool.id === poolId
      ? { ...pool, entries: pool.entries.filter((entry) => entry.organizationId !== organizationId) }
      : pool)),
  })
}

export function deletePool(poolId: string): void {
  commit({ ...getWorkspace(), pools: getWorkspace().pools.filter((pool) => pool.id !== poolId) })
}

export function recordPoolReuse(poolId: string, searchId: string | null): void {
  const state = getWorkspace()
  commit({
    ...state,
    pools: state.pools.map((pool) => (pool.id === poolId
      ? { ...pool, reuseCount: pool.reuseCount + 1, searchId: searchId ?? pool.searchId, lastVerified: today() }
      : pool)),
  })
}

function mergeEntries(existing: TargetPoolEntry[], incoming: TargetPoolEntry[]): TargetPoolEntry[] {
  const merged = [...existing]
  for (const entry of incoming) {
    const index = merged.findIndex((current) => current.organizationId === entry.organizationId)
    if (index >= 0) merged[index] = { ...merged[index], ...entry }
    else merged.push(entry)
  }
  return merged
}

// --- Recruiter overrides ----------------------------------------------------

export function setOverride(roleContextId: string, organizationId: string, tier: AssociationTier, reason: string, reviewer: string): void {
  const state = getWorkspace()
  commit({
    ...state,
    overrides: {
      ...state.overrides,
      [`${roleContextId}:${organizationId}`]: { tier, reason, reviewer, recordedOn: today() },
    },
  })
}

export function clearOverride(roleContextId: string, organizationId: string): void {
  const state = getWorkspace()
  const next = { ...state.overrides }
  delete next[`${roleContextId}:${organizationId}`]
  commit({ ...state, overrides: next })
}

export function overrideFor(state: WorkspaceState, roleContextId: string, organizationId: string): RecruiterOverride | undefined {
  return state.overrides[`${roleContextId}:${organizationId}`]
}

/**
 * Remember where the recruiter left off.
 *
 * This is a convenience, never a default: nothing in the product opens from
 * these values. A first-time visitor has an empty workspace and lands on the
 * industry universe with no company and no brief selected.
 */
export function rememberContext(focalId: string, roleContextId: string): void {
  const state = getWorkspace()
  if (state.lastFocalId === focalId && state.lastRoleContextId === roleContextId) return
  commit({ ...state, lastFocalId: focalId, lastRoleContextId: roleContextId })
}

/** Remember the last atlas branch visited, alongside the focal context. */
export function rememberScope(input: { focalId?: string; roleContextId?: string; nodeId?: string }): void {
  const state = getWorkspace()
  const next: WorkspaceState = {
    ...state,
    lastFocalId: input.focalId ?? state.lastFocalId,
    lastRoleContextId: input.roleContextId ?? state.lastRoleContextId,
    lastNodeId: input.nodeId ?? state.lastNodeId,
  }
  if (next.lastFocalId === state.lastFocalId
    && next.lastRoleContextId === state.lastRoleContextId
    && next.lastNodeId === state.lastNodeId) return
  commit(next)
}

// --- Export -----------------------------------------------------------------

/** Search Bank drop payload: target companies for an assignment. */
/** What the drop file needs to know about each company, taken from the register. */
export interface PoolTargetContext {
  name: string
  legalName: string
  pocket: string
  tierLabel: string
  mappedProfessionals: number
  evidenceState: string
  missingEvidence: string[]
}

/**
 * The machine-readable hand-off from a saved pool to the Search Bank.
 * `npm run bank:import -- <file> --targets` files every company under the named
 * search; re-importing the same file updates the same records, never duplicates.
 */
export function targetDropPayload(
  pool: TargetPool,
  contextsById: Map<string, PoolTargetContext>,
  searchName: string,
  clientName = '',
  role = '',
) {
  return {
    kind: 'search-targets',
    search: searchName,
    client: clientName,
    role,
    pool: { id: pool.id, name: pool.name, kind: pool.kind, classification: pool.classification },
    generatedOn: today(),
    targets: pool.entries.map((entry) => {
      const context = contextsById.get(entry.organizationId)
      return {
        organization_id: entry.organizationId,
        company: context?.name ?? entry.organizationId,
        legal_name: context?.legalName ?? '',
        pocket: context?.pocket ?? '',
        tier: entry.tier,
        tier_label: entry.tier !== null ? context?.tierLabel ?? '' : '',
        reasons: entry.reason,
        mapped_professionals: context?.mappedProfessionals ?? 0,
        evidence_state: context?.evidenceState ?? 'unknown',
        missing_evidence: context?.missingEvidence ?? [],
        discovery_source: pool.kind === 'dynamic' ? 'association-explorer-dynamic-pool' : 'association-explorer-pool',
        recruiter_status: 'proposed',
        added_on: entry.addedOn,
      }
    }),
  }
}

/**
 * A dynamic pool defined by associations around one named company.
 *
 * The focal company belongs to the pool's definition, never to the product's
 * default state: a recruiter has to have chosen it.
 */
export function focalPoolDefinition(
  filters: AssociationFilters,
  focalId: string,
  roleContextId: string,
): TargetPoolDefinition {
  return { scope: { kind: 'focal', focalId, roleContextId }, filters: completeFilters(filters) }
}

/**
 * A dynamic pool defined by a branch of the national industry taxonomy, with no
 * focal company at all. This is the shape the Industry Atlas saves.
 */
export function industryPoolDefinition(
  filters: AssociationFilters,
  nodeId: string | null,
  roleContextId: string | null = null,
): TargetPoolDefinition {
  return { scope: { kind: 'industry', nodeId, roleContextId }, filters: completeFilters(filters) }
}

/** A dynamic pool defined by filters over the whole mapped universe. */
export function universePoolDefinition(
  filters: AssociationFilters,
  roleContextId: string | null = null,
): TargetPoolDefinition {
  return { scope: { kind: 'universe', roleContextId }, filters: completeFilters(filters) }
}

/** Backwards-compatible alias for pre-atlas callers. */
export const dynamicPoolDefinition = focalPoolDefinition
