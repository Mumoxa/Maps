import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { TreeNode, Profile } from '../../data'

interface NodeData extends Record<string, unknown> {
  label: string
  subtitle?: string
  profile?: Profile
  segment?: string
  isDuplicate?: boolean
}

function SegmentNode({ data }: NodeProps) {
  const d = data as NodeData
  return (
    <div className="segment-node">
      <Handle type="source" position={Position.Bottom} />
      <div>{d.label}</div>
      <div className="map-node-sub">Segment</div>
    </div>
  )
}

function CompanyNode({ data }: NodeProps) {
  const d = data as NodeData
  return (
    <div className="company-node">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div className="map-node-title">{d.label}</div>
      <div className="map-node-sub">{d.subtitle || 'Company'}</div>
    </div>
  )
}

function ProfileNode({ data }: NodeProps) {
  const d = data as NodeData
  const profile = d.profile
  const isVerification = profile?.company === 'Needs verification'
  return (
    <div className={`profile-node ${isVerification ? 'verification' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="map-node-title">
        {profile?.name || d.label}
        {d.isDuplicate && <span className="map-node-dup"> (dup)</span>}
      </div>
      {profile && (
        <div className="map-node-fit">
          Fit: {profile.fit_score}/10
        </div>
      )}
    </div>
  )
}

const nodeTypes = {
  segment: SegmentNode,
  company: CompanyNode,
  profile: ProfileNode,
}

interface OrgChartCanvasProps {
  tree: TreeNode[]
  searchQuery?: string
  onProfileClick?: (profile: Profile) => void
  onNodeHover?: (node: { label: string; data: Record<string, unknown> } | null) => void
  filterSegment?: string
  duplicateNames?: Set<string>
}

const NODE_WIDTH = 160
const LEVEL_SPACING = 80
const SIBLING_SPACING = 20

function layoutTree(tree: TreeNode[], duplicateNames: Set<string>): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  let yOffset = 0
  for (const seg of tree) {
    const segId = `seg-${seg.id}`
    nodes.push({
      id: segId,
      type: 'segment',
      position: { x: 0, y: yOffset },
      data: { label: seg.label, segment: seg.label },
    })

    if (seg.children.length > 0) {
      const companyStartY = yOffset + LEVEL_SPACING
      let xOffset = -(Math.max(0, seg.children.length - 1) * SIBLING_SPACING + Math.max(0, seg.children.length - 1) * NODE_WIDTH) / 2

      for (const company of seg.children) {
        const compId = `${segId}-comp-${company.id}`
        nodes.push({
          id: compId,
          type: 'company',
          position: { x: xOffset, y: companyStartY },
          data: { label: company.label, subtitle: `${company.children.length} profiles`, segment: seg.label },
        })
        edges.push({
          id: `e-${segId}-${compId}`,
          source: segId,
          target: compId,
          type: 'smoothstep',
        })

        if (company.children.length > 0) {
          const profileStartY = companyStartY + LEVEL_SPACING
          let pxOffset = -(Math.max(0, company.children.length - 1) * SIBLING_SPACING + Math.max(0, company.children.length - 1) * 120) / 2

          for (const profile of company.children) {
            const profId = `${compId}-prof-${profile.id}`
            const p = profile.data as Profile | null
            nodes.push({
              id: profId,
              type: 'profile',
              position: { x: pxOffset, y: profileStartY },
              data: {
                label: profile.label,
                profile: profile.data,
                segment: seg.label,
                isDuplicate: p ? duplicateNames.has(p.name) : false,
              },
            })
            edges.push({
              id: `e-${compId}-${profId}`,
              source: compId,
              target: profId,
              type: 'smoothstep',
            })
            pxOffset += 130
          }
        }
        xOffset += NODE_WIDTH + SIBLING_SPACING
      }
    }
    yOffset += LEVEL_SPACING * 3
  }

  return { nodes, edges }
}

const EMPTY_NAMES: Set<string> = new Set()

export function OrgChartCanvas({ tree, searchQuery, onProfileClick, onNodeHover, filterSegment, duplicateNames = EMPTY_NAMES }: OrgChartCanvasProps) {
  const layout = useMemo(() => layoutTree(tree, duplicateNames), [tree, duplicateNames])
  const [nodes, , onNodesChange] = useNodesState(layout.nodes)
  const [edges, , onEdgesChange] = useEdgesState(layout.edges)
  const [hoveredNode, setHoveredNode] = useState<{ label: string; data: NodeData } | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.type === 'profile' && onProfileClick) {
      const profile = (node.data as NodeData).profile
      if (profile) onProfileClick(profile)
    }
  }, [onProfileClick])

  const onNodeMouseEnter = useCallback((_event: React.MouseEvent, node: Node) => {
    const d = node.data as NodeData
    const info = { label: d.label, data: d }
    setHoveredNode(info)
    if (onNodeHover) onNodeHover(info)
  }, [onNodeHover])

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNode(null)
    if (onNodeHover) onNodeHover(null)
  }, [onNodeHover])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 })
  }, [])

  const filteredNodes = useMemo(() => {
    if (!searchQuery && !filterSegment) return nodes
    const q = searchQuery?.trim().toLowerCase()
    return nodes.map(n => {
      const d = n.data as NodeData
      const matchesSearch = !q || d.label?.toLowerCase().includes(q)
      const matchesSegment = !filterSegment || d.segment === filterSegment
      return { ...n, className: matchesSearch && matchesSegment ? '' : 'node-dim' }
    })
  }, [nodes, searchQuery, filterSegment])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} onMouseMove={onMouseMove}>
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background />
      </ReactFlow>

      {hoveredNode && (
        <div
          className="map-tooltip"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div style={{ fontWeight: 600 }}>{hoveredNode.label}</div>
          {hoveredNode.data.profile && (
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Company: {hoveredNode.data.profile.company}<br />
              Title: {hoveredNode.data.profile.title}<br />
              Fit: {hoveredNode.data.profile.fit_score}/10
            </div>
          )}
          {hoveredNode.data.subtitle && (
            <div className="map-tooltip-sub">{hoveredNode.data.subtitle}</div>
          )}
        </div>
      )}
    </div>
  )
}
