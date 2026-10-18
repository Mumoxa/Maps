import { useCallback, useSyncExternalStore } from 'react'
import {
  clearOverride,
  clearSelection,
  getWorkspace,
  overrideFor,
  setOverride,
  subscribeWorkspace,
  toggleSelected,
  type WorkspaceState,
} from '../data/organizations/workspace'
import type { AssociationTier } from '../data/organizations/types'

/**
 * Live view of the recruiter's browser-local workspace: target pools, working
 * selection and recorded relevance overrides.
 */
export function useWorkspace(): WorkspaceState {
  return useSyncExternalStore(subscribeWorkspace, getWorkspace, getWorkspace)
}

export function useSelection() {
  const workspace = useWorkspace()
  const selected = new Set(workspace.selection.map((entry) => entry.organizationId))
  const toggle = useCallback((organizationId: string, reason: string, tier: AssociationTier | null) => {
    toggleSelected(organizationId, reason, tier)
  }, [])
  return { workspace, selected, toggle, clear: clearSelection }
}

export function useOverrides(roleContextId: string) {
  const workspace = useWorkspace()
  const forOrganization = useCallback(
    (organizationId: string) => overrideFor(workspace, roleContextId, organizationId),
    [workspace, roleContextId],
  )
  const set = useCallback((organizationId: string, tier: AssociationTier, reason: string, reviewer: string) => {
    setOverride(roleContextId, organizationId, tier, reason, reviewer)
  }, [roleContextId])
  const clear = useCallback((organizationId: string) => clearOverride(roleContextId, organizationId), [roleContextId])
  return { forOrganization, set, clear }
}
