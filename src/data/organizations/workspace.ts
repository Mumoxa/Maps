// Recruiter workspace persistence for the Company Association Explorer.
//
// Honest scope: this is a browser-local store. It keeps the recruiter's target
// pools, working selection and recorded overrides between sessions on this
// device, and it is the source for the export and for the Search Bank drop that
// `npm run bank:import` commits to the repository. It is NOT a shared server
// store, and the UI says so wherever it appears: no multi-user persistence has
// been provisioned for Maps, and pretending otherwise would be a false claim.

import type { AssociationFilters, AssociationTier, TargetPool, TargetPoolEntry } from './types'
import { emptyFilters } from './query'

export const WORKSPACE_STORAGE_KEY = 'maps:company-intelligence:v1'

export interface RecruiterOverride {
  tier: AssociationTier
  reason: string
  reviewer: string
  recordedOn: string
}

export interface WorkspaceState {
  version: 1
  pools: TargetPool[]
  /** Working selection: organization id -> reason captured at selection time. */
  selection: { organizationId: string; reason: string; tier: AssociationTier | null; addedOn: string }[]
  /** Key: `${roleContextId}:${organizationId}`. */
  overrides: Record<string, RecruiterOverride>
  lastFocalId: string
  lastRoleContextId: string
}

export const EMPTY_WORKSPACE: WorkspaceState = {
  version: 1,
  pools: [],
  selection: [],
  overrides: {},
  lastFocalId: '',
  lastRoleContextId: '',
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
  return candidate.version === 1 && Array.isArray(candidate.pools) && Array.isArray(candidate.selection)
    && typeof candidate.overrides === 'object' && candidate.overrides !== null
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
        cache = { ...EMPTY_WORKSPACE, ...parsed }
      }
    }
  } catch {
    // A corrupt local record must never break the explorer; start clean.
    cache = EMPTY_WORKSPACE
  }
  loaded = true
  return cache
}

function commit(next: WorkspaceState): void {
  cache = next
  const store = storage()
  if (store) {
    try {
      store.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Quota or privacy mode: the session keeps working in memory.
    }
  }
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

export function rememberContext(focalId: string, roleContextId: string): void {
  const state = getWorkspace()
  if (state.lastFocalId === focalId && state.lastRoleContextId === roleContextId) return
  commit({ ...state, lastFocalId: focalId, lastRoleContextId: roleContextId })
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

export function dynamicPoolDefinition(filters: AssociationFilters, focalId: string, roleContextId: string): TargetPool['definition'] {
  return { focalId, roleContextId, filters: { ...emptyFilters(), ...filters } }
}
