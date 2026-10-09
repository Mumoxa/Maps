import { useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { useCompanyUniverse } from '../hooks/useCompanyUniverse'
import { atlasNodeTitle } from '../data/organizations/atlas'
import { classifyFootprint, FOOTPRINT_SHORT_LABELS } from '../data/organizations/footprint'
import { companyDossier } from '../data/organizations/query'
import { EVIDENCE_CLASS_LABELS } from '../data/organizations/industryDiscovery'
import { FootprintCard } from '../components/intelligence/FootprintCard'
import { OwnershipTree } from '../components/intelligence/OwnershipTree'
import type { Organization } from '../data/organizations/types'

/**
 * Company intelligence: the canonical dossier for one organisation.
 *
 * One record per company, addressed by the same canonical id everywhere. Client
 * relevance and recruitment context are absent unless the reader brings one, so
 * the facts here never shift with an assignment.
 *
 * Fields the repository has no sourced data for are shown as research gaps.
 * Nothing is inferred to make the page look complete.
 */
export function OrganizationPage() {
  const { organizationId = '' } = useParams<{ organizationId: string }>()
  const [searchParams] = useSearchParams()
  const { index, atlas } = useCompanyUniverse()

  const decodedId = useMemo(() => {
    try { return decodeURIComponent(organizationId) } catch { return organizationId }
  }, [organizationId])

  const organization = index.byId.get(decodedId) ?? null
  const employer = index.employersByOrg.get(decodedId)

  useEffect(() => {
    document.title = organization
      ? `${organization.name} · Company intelligence`
      : 'Company not found · Maps'
  }, [organization])

  const fromNode = searchParams.get('from')
  const dossier = useMemo(
    () => (organization || employer ? companyDossier(index, decodedId) : null),
    [index, decodedId, organization, employer],
  )

  if (!organization && !employer) {
    return (
      <div className="page container">
        <EmptyState
          title="Company not found"
          description="No organisation in the Maps company universe carries that identifier."
          action={{ label: 'Open the company universe', to: '/companies' }}
        />
      </div>
    )
  }

  // A dataset-only employer has no curated record: show what is known and name
  // the gap, rather than inventing a dossier.
  if (!organization) {
    return (
      <ErrorBoundary>
        <div className="page">
          <div className="container">
            <Breadcrumb crumbs={[
              { label: 'Home', to: '/' },
              { label: 'Companies', to: '/companies' },
              { label: employer?.canonicalName ?? decodedId },
            ]} />
            <header className="page-head">
              <div>
                <h1>{employer?.canonicalName ?? decodedId}</h1>
                <p>
                  Maps knows this employer from its datasets, but no curated company record exists
                  yet. Everything below is what the datasets actually say, and every other section is
                  a research gap rather than an assumption.
                </p>
              </div>
              <div className="page-head-aside">
                <span className="page-head-meta"><b>{employer?.professionals ?? 0}</b> mapped professionals</span>
                <span className="page-head-meta">{(employer?.datasets ?? []).join(', ') || 'No dataset recorded'}</span>
              </div>
            </header>
            <section className="card section-block">
              <h2>Research backlog</h2>
              <ul className="assoc-gap-list">
                <li>No curated identity: legal name, website and aliases have not been verified.</li>
                <li>No industry placement in the national taxonomy.</li>
                <li>No operating capability evidenced.</li>
                <li>No sourced scale measure, so no indicative footprint.</li>
              </ul>
              <p className="assoc-section-note">
                This company stays discoverable and addressable by the id{' '}
                <code>{decodedId}</code>, so a curated record can be added without breaking any link.
              </p>
            </section>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  const footprint = classifyFootprint(organization)

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', to: '/' },
            ...(fromNode ? [{ label: 'Industry Atlas', to: `/industry-atlas?node=${encodeURIComponent(fromNode)}` }] : []),
            { label: 'Companies', to: '/companies' },
            { label: organization.name },
          ]} />

          <header className="page-head">
            <div>
              <h1>{organization.name}</h1>
              {organization.legalName && organization.legalName !== organization.name && (
                <p className="detail-legal">{organization.legalName}</p>
              )}
              <p>
                {organization.industries.length > 0
                  ? organization.industries
                    .map((link) => index.industryById.get(link.industryId)?.name ?? link.industryId)
                    .join(' · ')
                  : 'Not yet classified into the national taxonomy'}
              </p>
              {organization.aliases.length > 0 && (
                <p className="detail-aliases">Also known as {organization.aliases.join(', ')}</p>
              )}
            </div>
            <div className="page-head-aside">
              <span className={`footprint-chip footprint-band-${footprint.band}`}>
                {FOOTPRINT_SHORT_LABELS[footprint.band]}
              </span>
              <span className="page-head-meta">
                {organization.status === 'verified' ? 'Verified' : 'Pending verification'}
                {organization.lastVerified ? ` · ${organization.lastVerified}` : ''}
              </span>
              {organization.website && (
                <a className="btn btn-sm" href={organization.website} target="_blank" rel="noopener noreferrer">
                  <ArrowSquareOut size={14} aria-hidden /> Website
                </a>
              )}
            </div>
          </header>

          <div className="detail-layout">
            <div className="detail-main">
              <section className="section-block">
                <h2>Industry placement</h2>
                {organization.industries.length === 0 ? (
                  <p className="assoc-section-note">
                    No industry has been evidenced for this company. It remains listed in the
                    unclassified research backlog rather than being assigned a guessed sector.
                  </p>
                ) : (
                  <ul className="dossier-industries">
                    {organization.industries.map((link) => {
                      const industry = index.industryById.get(link.industryId)
                      const pocket = index.pocketById.get(industry?.pocket ?? '')
                      return (
                        <li key={link.industryId}>
                          <div className="dossier-industry-head">
                            <strong>{industry?.name ?? link.industryId}</strong>
                            {link.primary && <span className="chip">Primary</span>}
                            <span className="chip">{link.confidence}</span>
                          </div>
                          {pocket && (
                            <p className="dossier-industry-meta">
                              Sourcing pocket {pocket.name} · value-chain stage {pocket.valueChainStage}
                            </p>
                          )}
                          <p className="dossier-evidence">{link.evidence}</p>
                          {link.sourceUrl && (
                            <a href={link.sourceUrl} target="_blank" rel="noreferrer">
                              {link.sourceUrl} <ArrowSquareOut size={11} aria-hidden />
                            </a>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}

                {dossier && dossier.taxonomy.length > 0 && (
                  <div className="dossier-taxonomy">
                    <h3>National taxonomy placement</h3>
                    <ul>
                      {dossier.taxonomy.map((entry) => (
                        <li key={`${entry.industryId}-${entry.path}`}>{entry.path}</li>
                      ))}
                    </ul>
                    <p className="assoc-section-note">
                      Derived through the Maps industry crosswalk. Placement in a branch is an
                      industry statement, never a statement about ownership.
                    </p>
                  </div>
                )}
              </section>

              <section className="section-block">
                <h2>Operating capabilities and processes</h2>
                <CapabilityGroup title="Operating processes" group="operating" organization={organization} index={index} />
                <CapabilityGroup title="Commercial activity" group="commercial" organization={organization} index={index} />
                <CapabilityGroup title="Financial complexity" group="financial" organization={organization} index={index} />
                <CapabilityGroup title="Systems and technology" group="technology" organization={organization} index={index} />
                <p className="assoc-section-note">
                  A capability is a fact about the company. It is never evidence that any individual
                  at the company has performed that work.
                </p>
              </section>

              <section className="section-block">
                <h2>Business model and value-chain role</h2>
                {organization.industries.length === 0 ? (
                  <p className="assoc-section-note">No industry placed, so no value-chain role is derived.</p>
                ) : (
                  <ul className="dossier-plain-list">
                    {[...new Set(organization.industries
                      .map((link) => index.pocketById.get(index.industryById.get(link.industryId)?.pocket ?? '')?.valueChainStage)
                      .filter(Boolean))].map((stage) => (
                        <li key={stage as string}>Value-chain stage: {stage}</li>
                      ))}
                  </ul>
                )}
                <p className="assoc-section-note">
                  Products and services are not modelled separately in the company register yet.
                  Where a source describes them, the description is carried in the industry and
                  capability evidence above; nothing is added here to fill the section.
                </p>
              </section>

              <section className="section-block">
                <OwnershipTree index={index} organizationId={organization.id} />
              </section>

              <section className="section-block">
                <h2>Evidenced associations</h2>
                <AssociationList index={index} organizationId={organization.id} />
              </section>

              {dossier && (
                <section className="section-block">
                  <h2>Sources and evidence</h2>
                  {dossier.sources.length === 0 ? (
                    <p className="assoc-section-note">
                      No source has been recorded for this company, so nothing here can be treated as
                      verified.
                    </p>
                  ) : (
                    <ul className="assoc-source-list">
                      {dossier.sources.map((source) => (
                        <li key={source.url}>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            {source.url} <ArrowSquareOut size={12} aria-hidden />
                          </a>
                          <span className="assoc-source-meta">{source.type} · read {source.checkedOn}</span>
                          <span className="assoc-source-evidence">{source.evidence}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {dossier && dossier.researchGaps.length > 0 && (
                <section className="section-block">
                  <h2>Research gaps</h2>
                  <p className="assoc-section-note">
                    Unknown is not absence. Each item below has never been checked, so it must not be
                    read as a negative fact about the company.
                  </p>
                  <ul className="assoc-gap-list">
                    {dossier.researchGaps.map((gap) => <li key={gap}>{gap}</li>)}
                  </ul>
                </section>
              )}
            </div>

            <aside className="detail-aside">
              <section className="card">
                <h2 className="text-sm mb-1">Indicative footprint</h2>
                <FootprintCard classification={footprint} scale={organization.scale} />
              </section>

              <section className="card">
                <h2 className="text-sm mb-1">Record facts</h2>
                <dl className="detail-facts">
                  <div className="detail-fact">
                    <dt>Canonical id</dt>
                    <dd className="detail-mono">{organization.id}</dd>
                  </div>
                  <div className="detail-fact">
                    <dt>Verification</dt>
                    <dd>
                      {organization.status === 'verified' ? 'Verified' : 'Pending verification'}
                      {organization.lastVerified ? ` · ${organization.lastVerified}` : ''}
                    </dd>
                  </div>
                  <div className="detail-fact">
                    <dt>South African locations</dt>
                    <dd>
                      {organization.locations.length > 0
                        ? organization.locations
                          .map((location) => `${location.city ? `${location.city}, ` : ''}${location.province}`)
                          .join('; ')
                        : 'No sourced location yet'}
                    </dd>
                  </div>
                  <div className="detail-fact">
                    <dt>Professionals mapped</dt>
                    <dd>
                      {dossier && dossier.talent.mappedProfessionals > 0
                        ? `${dossier.talent.mappedProfessionals} (${dossier.talent.sources.map((source) => `${source.dataset}: ${source.count}`).join('; ')})`
                        : 'None mapped yet'}
                    </dd>
                  </div>
                  <div className="detail-fact">
                    <dt>Datasets referencing this company</dt>
                    <dd>{(employer?.datasets ?? organization.datasets).join(', ') || 'Canonical record only'}</dd>
                  </div>
                </dl>
              </section>

              <section className="card">
                <h2 className="text-sm mb-1">Take this company further</h2>
                <div className="dossier-actions">
                  <Link className="btn btn-ghost btn-sm" to={`/company-associations?focus=${encodeURIComponent(organization.id)}`}>
                    Association exploration
                  </Link>
                  <Link className="btn btn-ghost btn-sm" to={`/recruitment-targeting?org=${encodeURIComponent(organization.id)}`}>
                    Recruitment targeting
                  </Link>
                  <Link
                    className="btn btn-ghost btn-sm"
                    to={`/talent-search?q=${encodeURIComponent(organization.name)}`}
                  >
                    Search people mentioning this company
                  </Link>
                  {fromNode && (
                    <Link className="btn btn-ghost btn-sm" to={`/industry-atlas?node=${encodeURIComponent(fromNode)}`}>
                      Back to {atlasNodeTitle(atlas, fromNode)}
                    </Link>
                  )}
                </div>
              </section>

              {dossier && dossier.recruiterIntelligence.length > 0 && (
                <section className="card">
                  <h2 className="text-sm mb-1">Recruiter observations</h2>
                  <ul className="assoc-gap-list">
                    {dossier.recruiterIntelligence.map((record) => (
                      <li key={`${record.kind}-${record.scope}-${record.recordedOn}`}>
                        <strong>{record.kind}</strong> ({record.scope}): {record.observation}
                        <span className="assoc-source-meta"> {record.reviewer} · {record.recordedOn}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="assoc-section-note">
                    {EVIDENCE_CLASS_LABELS['recruiter-judgement']}. Not verified company data.
                  </p>
                </section>
              )}

              {organization.notes && (
                <section className="card">
                  <h2 className="text-sm mb-1">Record note</h2>
                  <p className="text-sm text-secondary">{organization.notes}</p>
                </section>
              )}
            </aside>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

function CapabilityGroup({
  title,
  group,
  organization,
  index,
}: {
  title: string
  group: 'operating' | 'commercial' | 'financial' | 'technology'
  organization: Organization
  index: ReturnType<typeof useCompanyUniverse>['index']
}) {
  const links = organization.capabilities.filter(
    (link) => index.capabilityById.get(link.capabilityId)?.group === group,
  )
  if (links.length === 0) return null
  const observed = links.filter((link) => link.status === 'observed')
  const unknown = links.filter((link) => link.status === 'unknown')
  const notObserved = links.filter((link) => link.status === 'not-observed')

  return (
    <div className="dossier-capability-group">
      <h3>{title}</h3>
      {observed.length > 0 && (
        <ul className="assoc-capability-list">
          {observed.map((link) => (
            <li key={link.capabilityId}>
              <strong>{index.capabilityById.get(link.capabilityId)?.name ?? link.capabilityId}</strong>
              <span>{link.evidence}</span>
              {link.sourceUrl && (
                <a href={link.sourceUrl} target="_blank" rel="noreferrer">
                  source <ArrowSquareOut size={11} aria-hidden />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      {unknown.length > 0 && (
        <p className="assoc-unknown">
          Never checked ({unknown.length}):{' '}
          {unknown.map((link) => index.capabilityById.get(link.capabilityId)?.name ?? link.capabilityId).join(', ')}.
          Unknown is not the same as absent.
        </p>
      )}
      {notObserved.length > 0 && (
        <p className="assoc-absent">
          Checked and not observed ({notObserved.length}):{' '}
          {notObserved.map((link) => index.capabilityById.get(link.capabilityId)?.name ?? link.capabilityId).join(', ')}.
        </p>
      )}
    </div>
  )
}

function AssociationList({
  index,
  organizationId,
}: {
  index: ReturnType<typeof useCompanyUniverse>['index']
  organizationId: string
}) {
  const asFocal = index.associationsByFocal.get(organizationId) ?? []
  const asAssociated = index.associationsByAssociated.get(organizationId) ?? []
  const all = [
    ...asFocal.map((entry) => ({ entry, counterpartyId: entry.associatedId })),
    ...asAssociated.map((entry) => ({ entry, counterpartyId: entry.focalId })),
  ]

  if (all.length === 0) {
    return (
      <p className="assoc-section-note">
        No curated or reviewed association has been recorded for this company. Associations are
        generated on demand from the industry universe rather than precomputed for every pair.
      </p>
    )
  }

  return (
    <ul className="dossier-associations">
      {all.map(({ entry, counterpartyId }) => (
        <li key={entry.id}>
          <Link to={`/organizations/${encodeURIComponent(counterpartyId)}`}>
            {index.byId.get(counterpartyId)?.name ?? counterpartyId}
          </Link>
          <span className="chip">{entry.relationshipType.replace(/-/g, ' ')}</span>
          <span className="chip">{entry.status}</span>
          <span className="chip">{entry.confidence}</span>
          <p>{entry.narrative}</p>
          <p className="dossier-evidence">{entry.evidence}</p>
          {entry.sourceUrl && (
            <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
              {entry.sourceUrl} <ArrowSquareOut size={11} aria-hidden />
            </a>
          )}
        </li>
      ))}
    </ul>
  )
}
