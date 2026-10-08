// Workspace persistence behind a swappable interface. Today the only real
// implementation is browser-local storage: data stays on the recruiter's
// device and is never sent anywhere. A secure server store (authenticated,
// access-controlled) can implement the same interface later.

import { emptyWorkspace, type Workspace } from './types'

export const WORKSPACE_STORAGE_KEY = 'talent-map.workspace.v1'

export interface WorkspaceStore {
  kind: 'browser-local' | 'memory'
  /** Plain-language description shown in the UI so nobody mistakes local storage for a shared database. */
  description: string
  load(): Workspace
  save(workspace: Workspace): void
  clear(): void
}

const ARRAY_KEYS: (keyof Workspace)[] = ['searches', 'targets', 'searchPeople', 'pools', 'overrides', 'curatedAssociations', 'imports', 'researchBatches']

/** Accepts a parsed backup or stored value only when it has the workspace shape. */
export function parseWorkspace(value: unknown): Workspace | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (record.schemaVersion !== 1) return null
  for (const key of ARRAY_KEYS) if (!Array.isArray(record[key])) return null
  return { ...emptyWorkspace(), ...(record as unknown as Workspace) }
}

export function createMemoryStore(initial: Workspace = emptyWorkspace()): WorkspaceStore {
  let current = initial
  return {
    kind: 'memory',
    description: 'In-memory only. Nothing is saved when the page closes.',
    load: () => current,
    save: (workspace) => {
      current = workspace
    },
    clear: () => {
      current = emptyWorkspace()
    },
  }
}

export function createBrowserStore(storage: Storage): WorkspaceStore {
  return {
    kind: 'browser-local',
    description: 'Saved in this browser on this device only. Not shared, not backed up and not synced. Export a backup to move it.',
    load: () => {
      try {
        const raw = storage.getItem(WORKSPACE_STORAGE_KEY)
        return (raw && parseWorkspace(JSON.parse(raw))) || emptyWorkspace()
      } catch {
        return emptyWorkspace()
      }
    },
    save: (workspace) => {
      storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace))
    },
    clear: () => {
      storage.removeItem(WORKSPACE_STORAGE_KEY)
    },
  }
}

export function defaultStore(): WorkspaceStore {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const probe = '__talent_map_probe__'
      window.localStorage.setItem(probe, '1')
      window.localStorage.removeItem(probe)
      return createBrowserStore(window.localStorage)
    }
  } catch {
    // Storage blocked (private mode or policy): fall through to memory.
  }
  return createMemoryStore()
}
