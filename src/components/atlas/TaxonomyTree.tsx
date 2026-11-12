import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretDown, CaretRight } from '@phosphor-icons/react'
import type { AtlasNode, IndustryAtlas } from '../../data/organizations/atlas'
import { UNCLASSIFIED_BRANCH_ID, isUnclassifiedBranch } from '../../data/organizations/atlas'
import { branchCompaniesHref, companyUniverseHref } from '../../data/organizations/links'

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

  // The whole universe, not only the placed part: the root row promises "all
  // industries", and a count that excluded the backlog would be a smaller number
  // than the list it opens.
  const universeTotal = atlas.totals.mappedOrganizations + atlas.totals.unclassifiedOrganizations

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

      <div className="atlas-tree-root-row">
        <button
          type="button"
          className={`atlas-tree-root ${selectedNodeId === null ? 'selected' : ''}`}
          onClick={() => onSelect(null)}
          aria-current={selectedNodeId === null ? 'true' : undefined}
        >
          <span>All industries</span>
        </button>
        <Link
          className="atlas-tree-count atlas-tree-count-link"
          to={companyUniverseHref()}
          title={`Open all ${universeTotal} companies in the universe`}
          aria-label={`Open all ${universeTotal} companies in the universe`}
        >
          {universeTotal}
        </Link>
      </div>

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
                </button>
                {row.organizations > 0 ? (
                  <Link
                    className="atlas-tree-count atlas-tree-count-link"
                    to={branchCompaniesHref(row.id)}
                    title={`Open the ${row.organizations} companies mapped in ${row.name}`}
                    aria-label={`Open the ${row.organizations} companies mapped in ${row.name}`}
                  >
                    {row.organizations}
                  </Link>
                ) : (
                  <span
                    className="atlas-tree-count atlas-tree-count-empty"
                    title={`No mapped companies in ${row.name} yet. This is a gap in the map, not a claim that none operate there.`}
                  >
                    0
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="atlas-tree-root-row">
        <button
          type="button"
          className={`atlas-tree-root ${isUnclassifiedBranch(selectedNodeId ?? '') ? 'selected' : ''}`}
          onClick={() => onSelect(UNCLASSIFIED_BRANCH_ID)}
        >
          <span>Not yet classified</span>
        </button>
        <Link
          className="atlas-tree-count atlas-tree-count-link"
          to={branchCompaniesHref(UNCLASSIFIED_BRANCH_ID)}
          title={`Open the ${atlas.totals.unclassifiedOrganizations} employers with no placement yet`}
          aria-label={`Open the ${atlas.totals.unclassifiedOrganizations} employers with no placement yet`}
        >
          {atlas.totals.unclassifiedOrganizations}
        </Link>
      </div>
      <p className="atlas-tree-note">
        Employers Maps already references but has not yet placed in the national taxonomy. They are
        listed, not hidden, and not invented into a sector.
      </p>
    </div>
  )
}
