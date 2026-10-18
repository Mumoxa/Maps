import { Link } from 'react-router-dom'
import { ArrowsLeftRight } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import { corporateHierarchy } from '../../data/organizations/industryDiscovery'

interface OwnershipTreeProps {
  index: OrganizationIndex
  organizationId: string
}

/**
 * Verified corporate hierarchy.
 *
 * Rendered only from sourced relationship records. This is kept structurally
 * separate from the industry tree on purpose: an industry tree answers "what
 * does this company do", a corporate tree answers "who controls it", and
 * collapsing them is how a passive holding company ends up credited with its
 * subsidiary's operating capability.
 *
 * Vertical position here means ownership and nothing else. Elsewhere in the
 * product, vertical position never means ownership.
 */
export function OwnershipTree({ index, organizationId }: OwnershipTreeProps) {
  const { parent, subsidiaries, otherRelationships } = corporateHierarchy(index, organizationId)
  const current = index.byId.get(organizationId)
  const hasAny = Boolean(parent) || subsidiaries.length > 0 || otherRelationships.length > 0

  if (!hasAny) {
    return (
      <section className="ownership" aria-labelledby="ownership-heading">
        <h3 id="ownership-heading">Corporate ownership</h3>
        <p className="assoc-section-note">
          No ownership, acquisition, joint-venture or partnership relationship has been sourced for
          this company. That is missing research, not evidence that the company is independent.
        </p>
      </section>
    )
  }

  return (
    <section className="ownership" aria-labelledby="ownership-heading">
      <h3 id="ownership-heading">Corporate ownership</h3>
      <p className="assoc-section-note">
        Built only from sourced corporate records. Nothing here is inferred from an industry
        placement, a shared attribute or a recruiting history.
      </p>

      <ul className="ownership-tree">
        {parent && (
          <li className="ownership-node ownership-parent">
            <Link to={`/organizations/${encodeURIComponent(parent.id)}`}>{parent.name}</Link>
            <span className="ownership-role">Parent</span>
            {parent.evidence && <span className="ownership-evidence">{parent.evidence}</span>}
            {parent.sourceUrl && (
              <a href={parent.sourceUrl} target="_blank" rel="noreferrer">source</a>
            )}
          </li>
        )}

        <li className="ownership-node ownership-current">
          <span className="ownership-name">{current?.name ?? organizationId}</span>
          <span className="ownership-role">This company</span>
        </li>

        {subsidiaries.map((subsidiary) => (
          <li key={subsidiary.id} className="ownership-node ownership-subsidiary">
            <Link to={`/organizations/${encodeURIComponent(subsidiary.id)}`}>{subsidiary.name}</Link>
            <span className="ownership-role">Subsidiary</span>
            {subsidiary.evidence && <span className="ownership-evidence">{subsidiary.evidence}</span>}
            {subsidiary.sourceUrl && (
              <a href={subsidiary.sourceUrl} target="_blank" rel="noreferrer">source</a>
            )}
          </li>
        ))}
      </ul>

      {otherRelationships.length > 0 && (
        <div className="ownership-other">
          <h4>
            <ArrowsLeftRight size={13} aria-hidden /> Other evidenced corporate relationships
          </h4>
          <ul>
            {otherRelationships.map((relationship) => (
              <li key={relationship.id}>
                <strong>{relationship.type.replace(/-/g, ' ')}</strong>{' '}
                <Link to={`/organizations/${encodeURIComponent(relationship.counterpartyId)}`}>
                  {relationship.counterpartyName}
                </Link>
                <span className="ownership-evidence">{relationship.evidence}</span>
                <span className="ownership-confidence">confidence {relationship.confidence}</span>
                {relationship.sourceUrl && (
                  <a href={relationship.sourceUrl} target="_blank" rel="noreferrer">source</a>
                )}
              </li>
            ))}
          </ul>
          <p className="assoc-section-note">
            A joint venture or partnership is not ownership, and none of these relationships
            transfers operating capability between the companies involved.
          </p>
        </div>
      )}
    </section>
  )
}
