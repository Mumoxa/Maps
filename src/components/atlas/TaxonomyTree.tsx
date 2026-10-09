import { useMemo, useState } from 'react'
import { CaretDown, CaretRight } from '@phosphor-icons/react'
import type { AtlasNode, IndustryAtlas } from '../../data/organizations/atlas'
import { UNCLASSIFIED_BRANCH_ID, isUnclassifiedBranch } from '../../data/organizations/atlas'

interface TaxonomyTreeProps {
  atlas: IndustryAtlas
  selectedNodeId: string | null
  onSelect: (nodeId: string | null) => void
  /** Hide branches with no mapped companies. Off by default: gaps are data. */
  onlyPopulated: boolean
  onToggleOnlyPopulated: () => void
}

interface Row {
  id: string
  name: string
  level: number
  depth: number
  organizations: number
  hasChildren: boolean
}

/**
 * The atlas navigation rail.
 *
 * This is a tree of industries, not a network of companies: nothing sits at its
 * centre. A branch with no mapped companies is still shown when "only branches
 * with companies" is off, and always reports zero, because a gap in the map is
 * information and hiding it would make the atlas look more complete than it is.
 */
export function TaxonomyTree({
  atlas,
  selectedNodeId,
  onSelect,
  onlyPopulated,
  onToggleOnlyPopulated,
}: TaxonomyTreeProps) {
  const [manuallyExpanded, setManuallyExpanded] = useState<Set<string>>(() => new Set())

  /** Ancestors of the selected branch, so the current path is always open. */
  const pathIds = useMemo(() => {
    const set = new Set<string>()
    for (const node of atlas.nodes.get(selectedNodeId ?? '')?.path ?? []) set.add(node.id)
    return set
  }, [selectedNodeId, atlas])

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    // A branch is open when the reader opened it, or when it is on the path to
    // the branch currently being viewed. Collapsing a branch therefore never
    // strands the reader inside a hidden parent.
    const isOpen = (nodeId: string) => manuallyExpanded.has(nodeId) || pathIds.has(nodeId)

    const walk = (nodes: AtlasNode[], depth: number) => {
      for (const node of nodes) {
        const children = node.childIds
          .map((id) => atlas.nodes.get(id))
          .filter((entry): entry is AtlasNode => Boolean(entry))
          .sort((left, right) => (
            right.counts.organizations - left.counts.organizations
            || left.node.name.localeCompare(right.node.name)
          ))
        const visibleChildren = onlyPopulated
          ? children.filter((child) => child.counts.organizations > 0)
          : children
        if (onlyPopulated && node.counts.organizations === 0 && depth > 0) continue
        out.push({
          id: node.id,
          name: node.node.name,
          level: node.node.level,
          depth,
          organizations: node.counts.organizations,
          hasChildren: visibleChildren.length > 0,
        })
        if (isOpen(node.id)) walk(visibleChildren, depth + 1)
      }
    }

    const roots = onlyPopulated
      ? atlas.roots.filter((node) => node.counts.organizations > 0)
      : atlas.roots
    walk(roots, 0)
    return out
  }, [atlas, onlyPopulated, manuallyExpanded, pathIds])

  const toggle = (nodeId: string) => {
    setManuallyExpanded((current) => {
      const next = new Set(current)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  return (
    <div className="atlas-tree">
      <div className="atlas-tree-head">
        <h2 className="facet-heading">South African industry taxonomy</h2>
        <label className="atlas-tree-toggle">
          <input type="checkbox" checked={onlyPopulated} onChange={onToggleOnlyPopulated} />
          Only branches with mapped companies
        </label>
      </div>

      <button
        type="button"
        className={`atlas-tree-root ${selectedNodeId === null ? 'selected' : ''}`}
        onClick={() => onSelect(null)}
        aria-current={selectedNodeId === null ? 'true' : undefined}
      >
        <span>All industries</span>
        <span className="atlas-tree-count">{atlas.totals.mappedOrganizations}</span>
      </button>

      <ul className="atlas-tree-list" role="tree" aria-label="Industry taxonomy">
        {rows.map((row) => {
          const isOpen = manuallyExpanded.has(row.id) || pathIds.has(row.id)
          const isSelected = selectedNodeId === row.id
          const inPath = pathIds.has(row.id)
          return (
            <li key={row.id} role="none">
              <div
                className={`atlas-tree-row ${isSelected ? 'selected' : ''} ${inPath ? 'in-path' : ''}`}
                role="treeitem"
                aria-expanded={row.hasChildren ? isOpen : undefined}
                aria-selected={isSelected}
                aria-level={row.level}
              >
                {row.hasChildren ? (
                  <button
                    type="button"
                    className="atlas-tree-caret"
                    onClick={() => toggle(row.id)}
                    aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${row.name}`}
                  >
                    {isOpen
                      ? <CaretDown size={11} weight="bold" aria-hidden />
                      : <CaretRight size={11} weight="bold" aria-hidden />}
                  </button>
                ) : (
                  <span className="atlas-tree-caret atlas-tree-caret-empty" aria-hidden />
                )}
                <button
                  type="button"
                  className="atlas-tree-label"
                  style={{ paddingLeft: `${row.depth * 0.8}rem` }}
                  onClick={() => onSelect(row.id)}
                >
                  <span className="atlas-tree-name">{row.name}</span>
                  <span className="atlas-tree-count">{row.organizations}</span>
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        className={`atlas-tree-root ${isUnclassifiedBranch(selectedNodeId ?? '') ? 'selected' : ''}`}
        onClick={() => onSelect(UNCLASSIFIED_BRANCH_ID)}
      >
        <span>Not yet classified</span>
        <span className="atlas-tree-count">{atlas.totals.unclassifiedOrganizations}</span>
      </button>
      <p className="atlas-tree-note">
        Employers Maps already references but has not yet placed in the national taxonomy. They are
        listed, not hidden, and not invented into a sector.
      </p>
    </div>
  )
}
