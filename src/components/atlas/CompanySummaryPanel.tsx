import { Link } from 'react-router-dom'
import { ArrowSquareOut } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import {
  ENTITY_SCOPE_LABELS,
  FOOTPRINT_SHORT_LABELS,
  SCALE_METRIC_LABELS,
} from '../../data/organizations/footprint'
import { organizationTaxonomy } from '../../data/organizations/taxonomyPlacement'
import type { CompanyView } from '../../data/organizations/universeView'
import {
  atlasBranchHref,
  branchCompaniesHref,
  branchFootprintHref,
  companiesInProvinceHref,
  companiesWithCapabilityHref,
  companyAssociationsHref,
  companyBodiesHref,
  companyProfessionalsHref,
  PEOPLE_DATASET_LABELS,
  peopleDatasetHref,
} from '../../data/organizations/links'
import { REVIEW_STATUS_LABELS } from './reviewLabels'

interface CompanySummaryPanelProps {
  index: OrganizationIndex
  view: CompanyView
  /** Branch the reader is inspecting from, so scoped links stay in context. */
  nodeId?: string | null
  /** Query preserved on outbound links so the reader returns to the same branch. */
  linkSuffix?: string
  onClose?: () => void
}

/**
 * The atlas inspector: a factual summary of one company.
 *
 * It renders no relevance tier and no suitability score. Those belong to a
 * recruitment brief, and the atlas is deliberately unbriefed.
 *
 * Every set this panel states is reachable: the footprint band, each taxonomy
 * placement, each capability, each province and every mapped-professional
 * source opens the list it counts. A panel that states a number and offers no
 * way to see the companies behind it is the defect this wiring removes.
 */
export function CompanySummaryPanel({ index, view, nodeId = null, linkSuffix = '', onClose }: CompanySummaryPanelProps) {
  const organization = index.byId.get(view.organizationId)
  const footprint = view.footprintClassification
  const employer = index.employersByOrg.get(view.organizationId)
  const placement = organization ? organizationTaxonomy(organization) : null

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
        <Link
          className={`footprint-chip footprint-chip-link footprint-band-${view.footprint}`}
          to={branchFootprintHref(nodeId, view.footprint)}
          title={`Open every company in this branch classified as ${FOOTPRINT_SHORT_LABELS[view.footprint]}`}
        >
          {FOOTPRINT_SHORT_LABELS[view.footprint]}
        </Link>
        <p className="atlas-inspector-note">{footprint.basis}</p>
        <p className="atlas-inspector-note">
          {ENTITY_SCOPE_LABELS[footprint.entityScope]} · {REVIEW_STATUS_LABELS[footprint.reviewStatus]}
        </p>
      </section>

      <section>
        <h4>Industry placement</h4>
        {placement && placement.entries.length > 0 ? (
          <ul className="atlas-inspector-list">
            {placement.entries.map((entry) => (
              <li key={`${entry.node.id}-${entry.industryId}`}>
                <Link to={atlasBranchHref(entry.node.id)} title={`Open ${entry.node.name} in the Industry Atlas`}>
                  {entry.path.map((node) => node.name).join(' › ')}
                </Link>
                <span className="atlas-inspector-meta">
                  {' '}{entry.source === 'taxonomy' ? 'directly classified' : 'via the Maps industry crosswalk'}
                </span>
              </li>
            ))}
          </ul>
        ) : view.taxonomyPaths.length > 0 ? (
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
              <li key={id}>
                <Link to={companiesWithCapabilityHref(id, nodeId)}>
                  {index.capabilityById.get(id)?.name ?? id}
                </Link>
              </li>
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
            {view.provinces.map((province) => (
              <li key={province}>
                <Link to={companiesInProvinceHref(province, nodeId)}>{province}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="atlas-inspector-note">No sourced South African location.</p>
        )}
      </section>

      {organization && organization.scale.length > 0 && (
        <section>
          <h4>Sourced scale</h4>
          <ul className="atlas-inspector-list">
            {organization.scale.map((entry, position) => (
              <li key={`${entry.metric}-${entry.value}-${entry.asOf}-${position}`}>
                <strong>{SCALE_METRIC_LABELS[entry.metric]}:</strong> {entry.value}
                <span className="atlas-inspector-meta">
                  {' '}({entry.basis}{entry.confidence ? `, ${entry.confidence}` : ''}; metric date {entry.asOf}
                  {entry.entityScope ? `; ${ENTITY_SCOPE_LABELS[entry.entityScope]}` : ''}; checked {entry.checkedOn})
                </span>
                {entry.sourceUrl && (
                  <a href={entry.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Source for ${SCALE_METRIC_LABELS[entry.metric]}`}>
                    {' '}<ArrowSquareOut size={11} aria-hidden />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {organization?.notes && (
        <section>
          <h4>Record and research notes</h4>
          <p className="atlas-inspector-note">{organization.notes}</p>
        </section>
      )}

      <section>
        <h4>Talent already mapped</h4>
        {employer && employer.professionals > 0 ? (
          <>
            <p className="atlas-inspector-note">
              {employer.professionals} professional{employer.professionals === 1 ? '' : 's'} mapped across{' '}
              {employer.datasets.map((dataset) => PEOPLE_DATASET_LABELS[dataset] ?? dataset).join(', ')}. Each
              source below opens the people it records.
            </p>
            <ul className="atlas-inspector-list">
              {employer.professionalSources.map((source) => {
                const href = peopleDatasetHref(source.dataset, view.organizationId, view.name)
                const label = PEOPLE_DATASET_LABELS[source.dataset] ?? source.dataset
                return (
                  <li key={source.dataset}>
                    {href
                      ? <Link to={href}>{source.count} recorded in the {label}</Link>
                      : <span>{source.count} recorded in the {label}</span>}
                  </li>
                )
              })}
            </ul>
            <Link className="atlas-inspector-people-link" to={companyProfessionalsHref(view.organizationId)}>
              Open the contact-directory people list for this company
            </Link>
          </>
        ) : (
          <p className="atlas-inspector-note">No professional mapped at this company yet.</p>
        )}
      </section>

      <div className="atlas-inspector-actions">
        <Link className="btn btn-primary btn-sm" to={`/organizations/${encodeURIComponent(view.organizationId)}${linkSuffix}`}>
          Open company intelligence
        </Link>
        <Link className="btn btn-ghost btn-sm" to={companyAssociationsHref(view.organizationId)}>
          Associations
        </Link>
        <Link className="btn btn-ghost btn-sm" to={companyBodiesHref(view.name)}>
          Industry bodies
        </Link>
        <Link
          className="btn btn-ghost btn-sm"
          to={`/recruitment-targeting?org=${encodeURIComponent(view.organizationId)}`}
        >
          Recruitment targeting
        </Link>
        {nodeId && (
          <Link className="btn btn-ghost btn-sm" to={branchCompaniesHref(nodeId)}>
            All companies in this branch
          </Link>
        )}
        {organization?.website && (
          <a className="btn btn-ghost btn-sm" href={organization.website} target="_blank" rel="noreferrer">
            Website <ArrowSquareOut size={12} aria-hidden />
          </a>
        )}
      </div>
    </div>
  )
}
