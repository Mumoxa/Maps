import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { OrganizationIndex } from '../../data/organizations/load'
import type { AssociationMatch, Organization } from '../../data/organizations/types'
import { TIER_LABELS } from './ExplorerFilters'

interface GraphNodeData extends Record<string, unknown> {
  label: string
  subtitle?: string
  tier?: number
  organizationId?: string
  pocketId?: string
  expanded?: boolean
  count?: number
  selected?: boolean
  professionals?: number
  onOpen?: (organizationId: string) => void
  onToggle?: (pocketId: string) => void
}

const NODE_WIDTH = 210
const POCKET_RADIUS = 560
const COMPANY_SPREAD = 34

function FocalNode({ data }: NodeProps) {
  const nodeData = data as GraphNodeData
  return (
    <div className="assoc-node assoc-node-focal">
      <Handle type="source" position={Position.Bottom} />
      <div className="assoc-node-title">{nodeData.label}</div>
      <div className="assoc-node-sub">{nodeData.subtitle}</div>
    </div>
  )
}

function PocketNode({ data }: NodeProps) {
  const nodeData = data as GraphNodeData
  return (
    <div className={`assoc-node assoc-node-pocket ${nodeData.expanded ? 'expanded' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <button
        type="button"
        className="assoc-node-button"
        onClick={() => nodeData.onToggle?.(nodeData.pocketId ?? '')}
        aria-expanded={Boolean(nodeData.expanded)}
        aria-label={`${nodeData.expanded ? 'Collapse' : 'Expand'} ${nodeData.label}: ${nodeData.count} companies`}
      >
        <span className="assoc-node-title">{nodeData.label}</span>
        <span className="assoc-node-sub">{nodeData.count} companies · {nodeData.professionals} mapped</span>
      </button>
    </div>
  )
}

function CompanyNode({ data }: NodeProps) {
  const nodeData = data as GraphNodeData
  return (
    <div className={`assoc-node assoc-node-company tier-${nodeData.tier} ${nodeData.selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <button
        type="button"
        className="assoc-node-button"
        onClick={() => nodeData.onOpen?.(nodeData.organizationId ?? '')}
        aria-label={`Open ${nodeData.label}: ${TIER_LABELS[String(nodeData.tier)] ?? ''}`}
      >
        <span className="assoc-node-title">{nodeData.label}</span>
        <span className="assoc-node-sub">{nodeData.subtitle}</span>
      </button>
    </div>
  )
}

const nodeTypes = { focal: FocalNode, pocket: PocketNode, company: CompanyNode }

interface AssociationGraphProps {
  index: OrganizationIndex
  focal: Organization
  /** Matches already filtered, so the graph and the lists never disagree. */
  matches: AssociationMatch[]
  expandedPockets: string[]
  onTogglePocket: (pocketId: string) => void
  onOpenCompany: (organizationId: string) => void
  selectedOrganizationId: string | null
  selectedIds: Set<string>
  /** Hard ceiling on rendered company nodes, stated in the UI. */
  nodeBudget?: number
}

const NODE_BUDGET_DEFAULT = 60

/**
 * The association network. Layout is computed, never randomised, so the same
 * data always produces the same readable picture.
 *
 * The graph is a progressive-disclosure view: pockets are collapsed by default
 * and a rendered-node budget keeps it usable. The pocket and table views list
 * every matched company, so the rendering limit is never a data limit, and the
 * page states how many companies are condensed.
 */
export function AssociationGraph({
  index,
  focal,
  matches,
  expandedPockets,
  onTogglePocket,
  onOpenCompany,
  selectedOrganizationId,
  selectedIds,
  nodeBudget = NODE_BUDGET_DEFAULT,
}: AssociationGraphProps) {
  const { nodes, edges, condensed } = useMemo(() => {
    const builtNodes: Node[] = []
    const builtEdges: Edge[] = []

    builtNodes.push({
      id: `focal-${focal.id}`,
      type: 'focal',
      position: { x: 0, y: 0 },
      data: {
        label: focal.name,
        subtitle: 'Focal company',
      } satisfies GraphNodeData,
      draggable: false,
    })

    const pocketIds = [...new Set(matches.map((match) => match.pocketId))]
    const angleStep = (Math.PI * 2) / Math.max(1, pocketIds.length)
    const expanded = new Set(expandedPockets)
    let rendered = 0

    pocketIds.forEach((pocketId, pocketIndex) => {
      const pocketMatches = matches.filter((match) => match.pocketId === pocketId)
      const pocket = index.pocketById.get(pocketId)
      const angle = angleStep * pocketIndex - Math.PI / 2
      const pocketX = Math.cos(angle) * POCKET_RADIUS
      const pocketY = Math.sin(angle) * POCKET_RADIUS * 0.72
      const pocketNodeId = `pocket-${pocketId}`

      builtNodes.push({
        id: pocketNodeId,
        type: 'pocket',
        position: { x: pocketX, y: pocketY },
        data: {
          label: pocket?.name ?? 'Not yet classified',
          pocketId,
          count: pocketMatches.length,
          professionals: pocketMatches.reduce((total, match) => total + match.mappedProfessionals, 0),
          expanded: expanded.has(pocketId),
          onToggle: onTogglePocket,
        } satisfies GraphNodeData,
        draggable: false,
      })
      builtEdges.push({
        id: `edge-${focal.id}-${pocketId}`,
        source: `focal-${focal.id}`,
        target: pocketNodeId,
        type: 'smoothstep',
        label: pocket?.valueChainStage,
      })

      if (!expanded.has(pocketId)) return
      // Best tiers first, then the most reasons, so what is drawn is what matters.
      const ordered = [...pocketMatches].sort((left, right) => (
        left.tier - right.tier
        || right.rules.length - left.rules.length
        || left.organizationId.localeCompare(right.organizationId)
      ))
      const visible = ordered.slice(0, Math.max(0, nodeBudget - rendered))
      rendered += visible.length
      const perRow = Math.max(3, Math.ceil(Math.sqrt(visible.length * 1.6)))

      visible.forEach((match, companyIndex) => {
        const organization = index.byId.get(match.organizationId)
        const row = Math.floor(companyIndex / perRow)
        const column = companyIndex % perRow
        const companyNodeId = `company-${match.organizationId}`
        builtNodes.push({
          id: companyNodeId,
          type: 'company',
          position: {
            x: pocketX + (column - (perRow - 1) / 2) * (NODE_WIDTH + COMPANY_SPREAD),
            y: pocketY + 120 + row * 96,
          },
          data: {
            label: organization?.name ?? match.organizationId,
            subtitle: `${TIER_LABELS[String(match.tier)]}${match.mappedProfessionals > 0 ? ` · ${match.mappedProfessionals} mapped` : ''}`,
            tier: match.tier,
            organizationId: match.organizationId,
            selected: selectedOrganizationId === match.organizationId || selectedIds.has(match.organizationId),
            professionals: match.mappedProfessionals,
            onOpen: onOpenCompany,
          } satisfies GraphNodeData,
          draggable: false,
        })
        builtEdges.push({
          id: `edge-${pocketNodeId}-${match.organizationId}`,
          source: pocketNodeId,
          target: companyNodeId,
          type: 'smoothstep',
          animated: match.tier === 1,
        })
      })
    })

    const condensedCount = matches.length - rendered
    return { nodes: builtNodes, edges: builtEdges, condensed: condensedCount }
  }, [index, focal, matches, expandedPockets, onTogglePocket, onOpenCompany, selectedOrganizationId, selectedIds, nodeBudget])

  return (
    <div className="assoc-graph-wrap">
      <div className="assoc-graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          proOptions={{ hideAttribution: true }}
          nodesConnectable={false}
          aria-label={`Association network around ${focal.name}`}
        >
          <Background gap={22} size={1} />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </div>
      {condensed > 0 && (
        <p className="assoc-graph-note">
          The network condenses {condensed} matched company node{condensed === 1 ? '' : 's'} to stay readable.
          The industry pocket and company table views list every one of them.
        </p>
      )}
    </div>
  )
}
