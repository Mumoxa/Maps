import { useState } from 'react'
import { CaretDown, CaretRight } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import {
  EVIDENCE_CLASS_LABELS,
  EVIDENCE_CLASS_NOTES,
  type AssociationGroup,
  type IndustryAssociationResult,
} from '../../data/organizations/industryDiscovery'

interface AssociationGroupsProps {
  result: IndustryAssociationResult
  index: OrganizationIndex
  onOpenCompany: (organizationId: string) => void
  onFocusCompany: (organizationId: string) => void
}

/**
 * Associations grouped by what they are evidence of.
 *
 * The grouping is the point: a shared industry and a verified shareholding look
 * identical in a network diagram and mean completely different things. Each
 * group names its evidence class before any company is listed.
 */
export function AssociationGroups({ result, index, onOpenCompany, onFocusCompany }: AssociationGroupsProps) {
  if (result.groups.length === 0) {
    return (
      <EmptyGroups />
    )
  }

  return (
    <div className="assoc-groups">
      {result.groups.map((group) => (
        <GroupCard
          key={group.kind}
          group={group}
          index={index}
          onOpenCompany={onOpenCompany}
          onFocusCompany={onFocusCompany}
        />
      ))}

      {result.unlinkedOrganizationIds.length > 0 && (
        <section className="assoc-group assoc-group-unknown">
          <header className="assoc-group-head">
            <h3>Companies with no evidenced association in this scope</h3>
            <span className={`assoc-evidence-class assoc-evidence-unknown-relationship`}>
              {EVIDENCE_CLASS_LABELS['unknown-relationship']}
            </span>
          </header>
          <p className="assoc-group-description">{EVIDENCE_CLASS_NOTES['unknown-relationship']}</p>
          <ul className="assoc-cluster-members">
            {result.unlinkedOrganizationIds.slice(0, 60).map((organizationId) => (
              <li key={organizationId}>
                <button type="button" className="assoc-link-button" onClick={() => onOpenCompany(organizationId)}>
                  {index.byId.get(organizationId)?.name ?? organizationId}
                </button>
              </li>
            ))}
          </ul>
          {result.unlinkedOrganizationIds.length > 60 && (
            <p className="assoc-graph-note">
              {result.unlinkedOrganizationIds.length - 60} more companies share nothing evidenced in
              this scope. That is a research gap, not evidence of isolation.
            </p>
          )}
        </section>
      )}
    </div>
  )
}

function EmptyGroups() {
  return (
    <EmptyStateBlock
      title="No associations can be evidenced in this scope"
      description="Widen the branch or the filters. Nothing here is inferred to make the picture look busier."
    />
  )
}

function EmptyStateBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="assoc-group assoc-group-empty">
      <h3>{title}</h3>
      <p className="assoc-group-description">{description}</p>
    </div>
  )
}

function GroupCard({
  group,
  index,
  onOpenCompany,
  onFocusCompany,
}: {
  group: AssociationGroup
  index: OrganizationIndex
  onOpenCompany: (organizationId: string) => void
  onFocusCompany: (organizationId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? group.clusters : group.clusters.slice(0, 3)
  const hidden = group.clusters.length - shown.length

  return (
    <section className="assoc-group" aria-labelledby={`group-${group.kind}`}>
      <header className="assoc-group-head">
        <h3 id={`group-${group.kind}`}>{group.label}</h3>
        <span className={`assoc-evidence-class assoc-evidence-${group.evidenceClass}`}>
          {EVIDENCE_CLASS_LABELS[group.evidenceClass]}
        </span>
        <span className="assoc-group-count">{group.clusters.length} clusters</span>
      </header>
      <p className="assoc-group-description">{group.description}</p>

      <ul className="assoc-cluster-list">
        {shown.map((cluster) => (
          <li key={cluster.key} className="assoc-cluster">
            <div className="assoc-cluster-head">
              <strong>{cluster.label}</strong>
              <span className="assoc-cluster-count">{cluster.organizationIds.length}</span>
            </div>
            {cluster.evidence && <p className="assoc-cluster-evidence">{cluster.evidence}</p>}
            <ul className="assoc-cluster-members">
              {cluster.organizationIds.slice(0, 14).map((organizationId) => (
                <li key={organizationId}>
                  <button type="button" className="assoc-link-button" onClick={() => onOpenCompany(organizationId)}>
                    {index.byId.get(organizationId)?.name ?? organizationId}
                  </button>
                </li>
              ))}
            </ul>
            {cluster.organizationIds.length > 14 && (
              <button
                type="button"
                className="assoc-link-button"
                onClick={() => onFocusCompany(cluster.organizationIds[0])}
              >
                Open {cluster.organizationIds.length - 14} more as a company-centred network
              </button>
            )}
            {cluster.sourceUrl && (
              <a href={cluster.sourceUrl} target="_blank" rel="noreferrer" className="assoc-cluster-source">
                {cluster.sourceUrl}
              </a>
            )}
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setExpanded(true)}>
          {expanded ? <CaretDown size={12} aria-hidden /> : <CaretRight size={12} aria-hidden />}
          Show {hidden} more cluster{hidden === 1 ? '' : 's'}
        </button>
      )}

      {group.truncatedEdges > 0 && (
        <p className="assoc-graph-note">
          {group.truncatedEdges} further pairwise links in this group are not drawn, to keep the
          network readable. Every cluster above lists its complete membership.
        </p>
      )}
    </section>
  )
}
