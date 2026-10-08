import { useMemo } from 'react'
import { useWorkspace } from '../workspace/useWorkspace'
import { buildIntelligenceGraph, publicGraph } from './index'
import type { IntelligenceGraph } from './graph'

/** Public graph plus any private research batches committed in this browser's workspace. */
export function useIntelligenceGraph(): IntelligenceGraph {
  const { workspace } = useWorkspace()
  const batches = workspace.researchBatches
  return useMemo(() => {
    if (batches.length === 0) return publicGraph()
    return buildIntelligenceGraph(batches, new Set(batches.map((batch) => batch.batchId)))
  }, [batches])
}
