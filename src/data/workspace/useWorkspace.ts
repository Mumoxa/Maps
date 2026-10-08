// React binding for the private workspace: one module-level store shared by
// every page (no provider needed), persisted through the WorkspaceStore and
// kept in sync across tabs via the storage event.

import { useCallback, useSyncExternalStore } from 'react'
import { defaultOpContext, type OpContext } from './operations'
import { defaultStore, parseWorkspace, WORKSPACE_STORAGE_KEY, type WorkspaceStore } from './store'
import type { Workspace } from './types'

let store: WorkspaceStore | null = null
let state: Workspace | null = null
const listeners = new Set<() => void>()

function ensure(): { store: WorkspaceStore; state: Workspace } {
  if (!store || !state) {
    store = defaultStore()
    state = store.load()
    if (typeof window !== 'undefined' && store.kind === 'browser-local') {
      window.addEventListener('storage', (event) => {
        if (event.key !== WORKSPACE_STORAGE_KEY || !store) return
        const next = event.newValue ? parseWorkspace(JSON.parse(event.newValue)) : null
        state = next ?? store.load()
        for (const listener of listeners) listener()
      })
    }
  }
  return { store, state }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function snapshot(): Workspace {
  return ensure().state
}

export type WorkspaceUpdate = (workspace: Workspace, ctx: OpContext) => Workspace

/** Apply an operation, persist, notify. Returns an error message instead of throwing. */
export function updateWorkspace(update: WorkspaceUpdate): string | null {
  const current = ensure()
  try {
    const next = update(current.state, defaultOpContext())
    if (next === current.state) return null
    current.store.save(next)
    state = next
    for (const listener of listeners) listener()
    return null
  } catch (error) {
    return (error as Error).message
  }
}

export function replaceWorkspace(next: Workspace) {
  const current = ensure()
  current.store.save(next)
  state = next
  for (const listener of listeners) listener()
}

export function clearWorkspace() {
  const current = ensure()
  current.store.clear()
  state = current.store.load()
  for (const listener of listeners) listener()
}

export function workspaceStoreInfo(): Pick<WorkspaceStore, 'kind' | 'description'> {
  const { store: active } = ensure()
  return { kind: active.kind, description: active.description }
}

export function useWorkspace() {
  const workspace = useSyncExternalStore(subscribe, snapshot, snapshot)
  const update = useCallback((fn: WorkspaceUpdate) => updateWorkspace(fn), [])
  return { workspace, update }
}
