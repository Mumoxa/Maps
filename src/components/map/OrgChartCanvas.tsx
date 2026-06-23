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
}

function SegmentNode({ data }: NodeProps) {
  const d = data as NodeData
  return (
    <div className="segment-node">
      <Handle type="source" position={Position.Bottom} />
      <div>{d.label}</div>
      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Segment</div>
    </div>
  )
}

function CompanyNode({ data }: NodeProps) {
  const d = data as NodeData
  return (
    <div className="company-node">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div style={{ fontWeight: 500 }}>{d.label}</div>
      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{d.subtitle || 'Company'}</div>
    </div>
  )
}

function ProfileNode({ data }: NodeProps) {
  const d = data as NodeData
  const profile = d.profile
  const isVerification = profile?.company === 'Needs verification'
  const isDup = profile?.name === 'David Coleman'
  return (
    <div className={`profile-node ${isVerification ? 'verification' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div style={{ fontWeight: 500, fontSize: '0.75rem' }}>
        {profile?.name || d.label}
        {isDup && <span style={{ color: '#6b7280', fontSize: '0.65rem' }}> (dup)</span>}
      </div>
      {profile && (
        <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>
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
}

const NODE_WIDTH = 160
const LEVEL_SPACING = 80
const SIBLING_SPACING = 20

function layoutTree(tree: TreeNode[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  let yOffset = 0
  for (const seg of tree) {
    const segId = `seg-${seg.id}`
    nodes.push({
      id: segId,
      type: 'segment',
      position: { x: 0, y: yOffset },
      data: { label: seg.label },
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
          data: { label: company.label, subtitle: `${company.children.length} profiles` },
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
            nodes.push({
              id: profId,
              type: 'profile',
              position: { x: pxOffset, y: profileStartY },
              data: { label: profile.label, profile: profile.data },
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

export function OrgChartCanvas({ tree, searchQuery, onProfileClick, onNodeHover, filterSegment }: OrgChartCanvasProps) {
  const layout = useMemo(() => layoutTree(tree), [tree])
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
    const q = searchQuery?.toLowerCase()
    return nodes.map(n => {
      const match = !q || (n.data?.label as string)?.toLowerCase().includes(q)
      return { ...n, className: match ? '' : 'node-dim' }
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
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{hoveredNode.data.subtitle}</div>
          )}
        </div>
      )}
    </div>
  )
}
