import { Link } from 'react-router-dom'
import { ArrowSquareOut } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import {
  ENTITY_SCOPE_LABELS,
  FOOTPRINT_SHORT_LABELS,
} from '../../data/organizations/footprint'
import type { CompanyView } from '../../data/organizations/universeView'
import { REVIEW_STATUS_LABELS } from './reviewLabels'

interface CompanySummaryPanelProps {
  index: OrganizationIndex
  view: CompanyView
  /** Query preserved on outbound links so the reader returns to the same branch. */
  linkSuffix?: string
  onClose?: () => void
}

/**
 * The atlas inspector: a factual summary of one company.
 *
 * It renders no relevance tier and no suitability score. Those belong to a
 * recruitment brief, and the atlas is deliberately unbriefed.
 */
export function CompanySummaryPanel({ index, view, linkSuffix = '', onClose }: CompanySummaryPanelProps) {
  const organization = index.byId.get(view.organizationId)
  const footprint = view.footprintClassification

  return (
    <div className="atlas-inspector-body">
      {onClose && (
        <button type="button" className="atlas-inspector-close" onClick={onClose}>Close</button>
      )}

      <header className="atlas-inspector-head">
        <h3>{view.name}</h3>
        {view.legalName && view.legalName !== view.name && (
          <p className="atlas-inspector-legal">{view.legalName}</p>
        )}
        <p className="atlas-inspector-status">
          {view.status === 'verified' ? 'Verified' : 'Pending verification'}
          {view.lastVerified ? ` · last checked ${view.lastVerified}` : ''}
        </p>
      </header>

      <section>
        <h4>Indicative market footprint</h4>
        <p className={`footprint-chip footprint-band-${view.footprint}`}>
          {FOOTPRINT_SHORT_LABELS[view.footprint]}
        </p>
        <p className="atlas-inspector-note">{footprint.basis}</p>
        <p className="atlas-inspector-note">
          {ENTITY_SCOPE_LABELS[footprint.entityScope]} · {REVIEW_STATUS_LABELS[footprint.reviewStatus]}
        </p>
      </section>

      <section>
        <h4>Industry placement</h4>
        {view.taxonomyPaths.length > 0 ? (
          <ul className="atlas-inspector-list">
            {[...new Set(view.taxonomyPaths)].map((path) => <li key={path}>{path}</li>)}
          </ul>
        ) : (
          <p className="atlas-inspector-note">
            Not yet placed in the national taxonomy. This is a research gap, not a statement that the
            company has no industry.
          </p>
        )}
      </section>

      <section>
        <h4>Evidenced capabilities</h4>
        {view.observedCapabilityIds.length > 0 ? (
          <ul className="atlas-inspector-chips">
            {view.observedCapabilityIds.map((id) => (
              <li key={id}>{index.capabilityById.get(id)?.name ?? id}</li>
            ))}
          </ul>
        ) : (
          <p className="atlas-inspector-note">No operating capability evidenced yet.</p>
        )}
      </section>

      <section>
        <h4>Operating geography</h4>
        {view.provinces.length > 0 ? (
          <ul className="atlas-inspector-chips">
            {view.provinces.map((province) => <li key={province}>{province}</li>)}
          </ul>
        ) : (
          <p className="atlas-inspector-note">No sourced South African location.</p>
        )}
      </section>

      {organization && organization.scale.length > 0 && (
        <section>
          <h4>Sourced scale</h4>
          <ul className="atlas-inspector-list">
            {organization.scale.map((entry) => (
              <li key={`${entry.metric}-${entry.value}`}>
                {entry.metric}: {entry.value}
                <span className="atlas-inspector-meta"> ({entry.basis}, {entry.asOf})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h4>Talent already mapped</h4>
        <p className="atlas-inspector-note">
          {view.mappedProfessionals > 0
            ? `${view.mappedProfessionals} professional${view.mappedProfessionals === 1 ? '' : 's'} across ${view.datasets.join(', ')}`
            : 'No professional mapped at this company yet.'}
        </p>
      </section>

      <div className="atlas-inspector-actions">
        <Link className="btn btn-primary btn-sm" to={`/organizations/${encodeURIComponent(view.organizationId)}${linkSuffix}`}>
          Open company intelligence
        </Link>
        <Link
          className="btn btn-ghost btn-sm"
          to={`/company-associations?focus=${encodeURIComponent(view.organizationId)}`}
        >
          Associations
        </Link>
        <Link
          className="btn btn-ghost btn-sm"
          to={`/recruitment-targeting?org=${encodeURIComponent(view.organizationId)}`}
        >
          Recruitment targeting
        </Link>
        {organization?.website && (
          <a className="btn btn-ghost btn-sm" href={organization.website} target="_blank" rel="noreferrer">
            Website <ArrowSquareOut size={12} aria-hidden />
          </a>
        )}
      </div>
    </div>
  )
}
