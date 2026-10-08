import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfidenceTag, EvidenceLinks, OriginTag } from '../components/intelligence/IntelBits'
import { companyDossier } from '../data/intelligence/api'
import { useIntelligenceGraph } from '../data/intelligence/useIntelligence'

const LEGACY_LINKS: Record<string, (name: string) => string> = {
  accountants: (name) => `/accounting-finance?q=${encodeURIComponent(name)}`,
  'credit-risk': (name) => `/companies?q=${encodeURIComponent(name)}`,
}

export function OrganizationPage() {
  const { id = '' } = useParams()
  const graph = useIntelligenceGraph()
  const dossier = useMemo(() => companyDossier(graph, id), [graph, id])

  useEffect(() => {
    document.title = `SA Talent Map | ${dossier?.organization.name ?? 'Organization not found'}`
  }, [dossier])

  if (!dossier) {
    return (
      <div className="page">
        <div className="container">
          <EmptyState title="Organization not found" description="No organization has this id. It may have been renamed in a newer reconciliation." action={{ label: 'All organizations', to: '/organizations' }} />
        </div>
      </div>
    )
  }
  const { organization: org } = dossier
  const capName = (capId: string) => graph.taxonomy.capabilityById.get(capId)?.name ?? capId
  const employment = graph.employmentsByOrg.get(org.id) ?? []

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Organizations', to: '/organizations' }, { label: org.name }]} />
        <div className="page-head">
          <div>
            <h1>{org.name}</h1>
            <p>
              Identity {org.identityStatus}
              {org.legalName ? ` · ${org.legalName}` : ''}
              {org.aliases.length ? ` · also known as ${org.aliases.join(', ')}` : ''}
              {org.formerNames.length ? ` · formerly ${org.formerNames.join(', ')}` : ''}
            </p>
          </div>
          <div className="page-head-aside">
            <Link className="btn btn-primary btn-sm" to={`/company-associations?focus=${org.id}`}>
              Explore associations
            </Link>
          </div>
        </div>

        <div className="intel-columns">
          <section className="section-block" aria-labelledby="org-facts">
            <h2 id="org-facts">Facts</h2>
            {org.website && (
              <p>
                Website:{' '}
                <a href={org.website} target="_blank" rel="noopener noreferrer">
                  {org.website}
                </a>
              </p>
            )}
            {dossier.parents.length > 0 && <p>Group: {dossier.parents.map((parent) => parent.name).join(' → ')}</p>}
            <h3>Industries</h3>
            {dossier.industries.length === 0 ? (
              <p className="intel-muted">Industry not recorded yet (unknown, not zero).</p>
            ) : (
              <ul>
                {dossier.industries.map((row) => (
                  <li key={row.industryId}>
                    <Link to={`/industries/${row.industryId}`}>{graph.taxonomy.industryById.get(row.industryId)?.name}</Link> ({row.role}) <ConfidenceTag value={row.confidence} /> <OriginTag value={row.origin} />
                    <EvidenceLinks graph={graph} ids={row.evidenceIds} />
                  </li>
                ))}
              </ul>
            )}
            <h3>Observed capabilities</h3>
            {dossier.capabilities.observed.length === 0 ? (
              <p className="intel-muted">None observed in sources yet.</p>
            ) : (
              <ul>
                {dossier.capabilities.observed.map((row) => (
                  <li key={row.capabilityId}>
                    <Link to={`/capabilities/${row.capabilityId}`}>{capName(row.capabilityId)}</Link> <ConfidenceTag value={row.confidence} /> <OriginTag value={row.origin} />
                    {row.summary && <span className="intel-evidence-supports">{row.summary}</span>}
                    <EvidenceLinks graph={graph} ids={row.evidenceIds} />
                  </li>
                ))}
              </ul>
            )}
            {dossier.capabilities.notObserved.length > 0 && (
              <>
                <h3>Sources say not carried out</h3>
                <ul>{dossier.capabilities.notObserved.map((row) => <li key={row.capabilityId}>{capName(row.capabilityId)}: {row.summary}</li>)}</ul>
              </>
            )}
            {dossier.capabilities.unknownSourced.length > 0 && (
              <>
                <h3>Checked, still unknown</h3>
                <ul>{dossier.capabilities.unknownSourced.map((row) => <li key={row.capabilityId}>{capName(row.capabilityId)}: {row.summary}</li>)}</ul>
              </>
            )}
            {dossier.relationships.length > 0 && (
              <>
                <h3>Corporate relationships</h3>
                <ul>
                  {dossier.relationships.map((rel) => (
                    <li key={`${rel.fromId}-${rel.toId}-${rel.type}`}>
                      <Link to={`/organizations/${rel.fromId}`}>{graph.organizationById.get(rel.fromId)?.name}</Link> {rel.type}{' '}
                      <Link to={`/organizations/${rel.toId}`}>{graph.organizationById.get(rel.toId)?.name}</Link> <ConfidenceTag value={rel.confidence} />
                      <EvidenceLinks graph={graph} ids={rel.evidenceIds} />
                    </li>
                  ))}
                </ul>
              </>
            )}
            {dossier.scaleMetrics.length > 0 && (
              <>
                <h3>Scale (as sourced)</h3>
                <ul>
                  {dossier.scaleMetrics.map((metric, index) => (
                    <li key={`${metric.metric}-${index}`}>
                      {metric.metric}: {metric.valueText} {metric.note && <span className="intel-muted">({metric.note})</span>}
                      <EvidenceLinks graph={graph} ids={metric.evidenceIds} />
                    </li>
                  ))}
                </ul>
              </>
            )}
            {dossier.locations.length > 0 && (
              <>
                <h3>Locations</h3>
                <p>{[...new Set(dossier.locations.map((loc) => [loc.city, loc.province].filter(Boolean).join(', ')))].join('; ')}</p>
              </>
            )}
          </section>

          <section className="section-block" aria-labelledby="org-more">
            <h2 id="org-more">Inferences, research status and lineage</h2>
            <h3>Industry-typical hypotheses</h3>
            {dossier.capabilities.industryHypotheses.length === 0 ? (
              <p className="intel-muted">None.</p>
            ) : (
              <ul>{dossier.capabilities.industryHypotheses.map((row) => <li key={row.capabilityId}>{capName(row.capabilityId)} <ConfidenceTag value="hypothesis" /></li>)}</ul>
            )}
            {dossier.openQuestions.length > 0 && (
              <>
                <h3>Open questions</h3>
                <ul>{dossier.openQuestions.map((question) => <li key={question.issue}>{question.kind}: {question.issue}</li>)}</ul>
              </>
            )}
            {dossier.coverage.length > 0 && (
              <>
                <h3>Research coverage</h3>
                <ul>
                  {dossier.coverage.map((rec, index) => (
                    <li key={index}>
                      {rec.scope}: {rec.status.replace(/-/g, ' ')}
                      {rec.verifiedPeopleCount !== null ? ` (${rec.verifiedPeopleCount} verified)` : ''}
                      {rec.lastChecked ? `, checked ${rec.lastChecked}` : ''}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h3>Source records</h3>
            {org.lineage.length === 0 ? (
              <p className="intel-muted">Added by research only.</p>
            ) : (
              <ul>
                {org.lineage.map((ref) => (
                  <li key={ref.ref}>
                    {LEGACY_LINKS[ref.dataset] ? <Link to={LEGACY_LINKS[ref.dataset](ref.sourceName)}>{ref.sourceName}</Link> : ref.sourceName} <span className="intel-muted">({ref.ref})</span>
                  </li>
                ))}
              </ul>
            )}
            <h3>People ({employment.length})</h3>
            <p className="intel-muted">{dossier.people.note}</p>
            {employment.length > 0 && (
              <ul className="intel-people">
                {employment.map((row) => {
                  const person = graph.personById.get(row.personId)
                  if (!person) return null
                  return (
                    <li key={`${row.personId}-${row.employerName}`}>
                      <Link to={person.href}>{person.name}</Link> <span className="intel-muted">{row.current ? row.title || person.title : `former: ${row.title || 'role not stated'}`}</span>
                      {row.match === 'alias-table' && <span className="intel-muted"> · employer matched via alias table (“{row.employerName}”)</span>}
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
