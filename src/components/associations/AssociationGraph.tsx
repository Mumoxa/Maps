import { useMemo, type KeyboardEvent, type MouseEvent } from 'react'
import { Background, Controls, Handle, Panel, Position, ReactFlow, useReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { DiscoveryRow, Pocket } from '../../data/intelligence/discovery'
import { TIER_SHORT } from '../../data/intelligence/targeting'

/** Companies drawn per expanded pocket before a "+N more" node hands over to the table (the table has everything). */
export const POCKET_FAN_LIMIT = 30
const FAN_COLUMNS = 6

interface RootData extends Record<string, unknown> {
  label: string
  subtitle: string
}

interface PocketData extends Record<string, unknown> {
  pocket: Pocket
  expanded: boolean
  onToggle: (id: string) => void
}

interface CompanyData extends Record<string, unknown> {
  row: DiscoveryRow
  selected: boolean
  compared: boolean
  onSelect: (id: string, additive: boolean) => void
  onRecentre: (id: string) => void
}

interface MoreData extends Record<string, unknown> {
  pocket: Pocket
  hidden: number
  onShowAll: (pocket: Pocket) => void
}

function RootNode({ data }: NodeProps) {
  const d = data as RootData
  return (
    <div className="ca-node ca-node-root">
      <Handle type="source" position={Position.Bottom} className="ca-handle" />
      <div className="ca-node-title">{d.label}</div>
      <div className="ca-node-sub">{d.subtitle}</div>
    </div>
  )
}

function PocketNode({ data }: NodeProps) {
  const d = data as PocketData
  const { pocket } = d
  const total = pocket.organizationIds.length
  return (
    <div className={`ca-node ca-node-pocket ca-fit-${pocket.fit}`}>
      <Handle type="target" position={Position.Top} className="ca-handle" />
      <Handle type="source" position={Position.Bottom} className="ca-handle" />
      <button
        type="button"
        className="ca-node-button"
        aria-expanded={d.expanded}
        aria-label={`${pocket.label}: ${total} companies, ${pocket.currentPeople} mapped people. ${d.expanded ? 'Collapse' : 'Expand'} pocket`}
        onClick={() => d.onToggle(pocket.id)}
      >
        <span className="ca-node-title">{pocket.label}</span>
        <span className="ca-node-sub">
          {total} companies · {pocket.currentPeople} people{pocket.unassessed ? ` · ${pocket.unassessed} unassessed` : ''}
        </span>
      </button>
    </div>
  )
}

function CompanyNode({ data }: NodeProps) {
  const d = data as CompanyData
  const { row } = d
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault()
      d.onRecentre(row.organizationId)
    } else if (event.key === 'c' || event.key === 'C') {
      event.preventDefault()
      d.onSelect(row.organizationId, true)
    }
  }
  const onClick = (event: MouseEvent<HTMLButtonElement>) => d.onSelect(row.organizationId, event.shiftKey || event.metaKey || event.ctrlKey)
  const classes = ['ca-node', 'ca-node-company', `ca-node-${row.assessment.tier}`, d.selected ? 'is-selected' : '', d.compared ? 'is-compared' : ''].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      <Handle type="target" position={Position.Top} className="ca-handle" />
      <button
        type="button"
        className="ca-node-button"
        aria-pressed={d.compared}
        aria-label={`${row.name}, ${TIER_SHORT[row.assessment.tier]}, ${row.dimensions.length} association dimensions. Enter to inspect, C to compare, R to recentre`}
        onClick={onClick}
        onDoubleClick={() => d.onRecentre(row.organizationId)}
        onKeyDown={onKeyDown}
      >
        <span className="ca-node-title">{row.name}</span>
        <span className="ca-node-sub">
          {TIER_SHORT[row.assessment.tier]}
          {row.assessment.override ? ' (override)' : ''} · {row.currentPeople} people
        </span>
      </button>
    </div>
  )
}

function MoreNode({ data }: NodeProps) {
  const d = data as MoreData
  return (
    <div className="ca-node ca-node-more">
      <Handle type="target" position={Position.Top} className="ca-handle" />
      <button type="button" className="ca-node-button" onClick={() => d.onShowAll(d.pocket)}>
        +{d.hidden} more in table
      </button>
    </div>
  )
}

const nodeTypes = { root: RootNode, pocket: PocketNode, company: CompanyNode, more: MoreNode }

interface AssociationGraphProps {
  rootLabel: string
  rootSubtitle: string
  pockets: Pocket[]
  rowById: Map<string, DiscoveryRow>
  visibleIds: Set<string>
  expanded: Set<string>
  selected: string | null
  compare: Set<string>
  onTogglePocket: (id: string) => void
  onExpandAll: () => void
  onCollapseAll: () => void
  onSelect: (id: string, additive: boolean) => void
  onRecentre: (id: string) => void
  onShowPocketInTable: (pocket: Pocket) => void
  onBack: () => void
}

function FitButton() {
  const flow = useReactFlow()
  return (
    <button type="button" className="btn btn-secondary btn-sm" onClick={() => flow.fitView({ padding: 0.15, duration: 250 })}>
      Fit view
    </button>
  )
}

export function AssociationGraph(props: AssociationGraphProps) {
  const { pockets, rowById, visibleIds, expanded, selected, compare } = props

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [{ id: 'root', type: 'root', position: { x: -110, y: -30 }, data: { label: props.rootLabel, subtitle: props.rootSubtitle }, draggable: false }]
    const edges: Edge[] = []
    const shown = pockets
      .map((pocket) => ({ pocket, ids: pocket.organizationIds.filter((id) => visibleIds.has(id)) }))
      .filter((entry) => entry.ids.length > 0)
    const radius = Math.max(360, shown.length * 46)
    shown.forEach(({ pocket, ids }, index) => {
      const angle = (2 * Math.PI * index) / Math.max(shown.length, 1) - Math.PI / 2
      const px = Math.cos(angle) * radius
      const py = Math.sin(angle) * radius
      const pocketView: Pocket = { ...pocket, organizationIds: ids }
      nodes.push({ id: pocket.id, type: 'pocket', position: { x: px - 110, y: py - 30 }, data: { pocket: pocketView, expanded: expanded.has(pocket.id), onToggle: props.onTogglePocket } })
      edges.push({ id: `root-${pocket.id}`, source: 'root', target: pocket.id, label: String(ids.length), className: `ca-edge ca-edge-${pocket.fit}` })
      if (!expanded.has(pocket.id)) return
      const dx = Math.cos(angle)
      const dy = Math.sin(angle)
      const visible = ids.slice(0, POCKET_FAN_LIMIT)
      visible.forEach((orgId, i) => {
        const row = rowById.get(orgId)
        if (!row) return
        const ring = Math.floor(i / FAN_COLUMNS)
        const col = (i % FAN_COLUMNS) - (FAN_COLUMNS - 1) / 2
        const distance = 190 + ring * 95
        const x = px + dx * distance - dy * col * 180
        const y = py + dy * distance + dx * col * 70
        const nodeId = `org:${orgId}`
        nodes.push({
          id: nodeId,
          type: 'company',
          position: { x: x - 85, y: y - 24 },
          data: { row, selected: selected === orgId, compared: compare.has(orgId), onSelect: props.onSelect, onRecentre: props.onRecentre },
        })
        edges.push({ id: `${pocket.id}-${nodeId}`, source: pocket.id, target: nodeId, className: `ca-edge ca-edge-${row.associationStrength}` })
      })
      if (ids.length > visible.length) {
        const ring = Math.ceil(visible.length / FAN_COLUMNS)
        const id = `more:${pocket.id}`
        nodes.push({ id, type: 'more', position: { x: px + dx * (190 + ring * 95) - 70, y: py + dy * (190 + ring * 95) - 18 }, data: { pocket: pocketView, hidden: ids.length - visible.length, onShowAll: props.onShowPocketInTable } })
        edges.push({ id: `${pocket.id}-${id}`, source: pocket.id, target: id, className: 'ca-edge' })
      }
    })
    return { nodes, edges }
  }, [pockets, rowById, visibleIds, expanded, selected, compare, props.rootLabel, props.rootSubtitle, props.onTogglePocket, props.onSelect, props.onRecentre, props.onShowPocketInTable])

  return (
    <div className="ca-graph" aria-label="Company association network">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }} minZoom={0.1} maxZoom={2} nodesConnectable={false} proOptions={{ hideAttribution: true }}>
        <Background gap={24} />
        <Controls showInteractive={false} />
        <Panel position="top-left" className="ca-graph-toolbar">
          <FitButton />
          <button type="button" className="btn btn-secondary btn-sm" onClick={props.onExpandAll}>
            Expand all
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={props.onCollapseAll}>
            Collapse all
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={props.onBack}>
            Back
          </button>
        </Panel>
        <Panel position="bottom-left" className="ca-graph-legend">
          Click a pocket to expand it. Click a company to inspect; Shift or C adds it to compare; double-click or R recentres on it.
        </Panel>
      </ReactFlow>
    </div>
  )
}
