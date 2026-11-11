import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { organizations } from '../data/organizations/load'
import {
  bodyDirectoryLeadsByBody, bodyResearchCoverage, companyBodyLinks, industryBodies,
} from '../data/organizations/industryBodies'

const organizationsById = new Map(organizations.map((organization) => [organization.id, organization]))

function downloadCsv(filename: string, rows: string[][]): void {
  const contents = rows
    .map((row) => row.map((cell) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)).join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

/**
 * External industry organisations are different from the existing Company
 * Association Explorer's same-process/industry sourcing suggestions.
 * Directory leads are not promoted into current member claims.
 */
export function IndustryBodiesPage() {
  useEffect(() => { document.title = 'SA Talent Map | Industry bodies and member networks' }, [])
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const bodyParam = params.get('body')
  const nodeId = params.get('node') ?? ''
  const selectedBody = industryBodies.filter((body) => body.id === bodyParam)[0]
    ?? (nodeId ? industryBodies.filter((body) => body.taxonomyNodeIds.includes(nodeId))[0] : null)
    ?? industryBodies[0] ?? null

  const filteredBodies = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return industryBodies.filter((body) => (
      (!nodeId || body.taxonomyNodeIds.includes(nodeId)) &&
      (!needle || [body.name, body.acronym, body.category, body.jurisdiction, ...body.specialistNiches]
        .some((part) => part.toLowerCase().includes(needle)))
    ))
  }, [query, nodeId])
  const selectedLeads = selectedBody ? bodyDirectoryLeadsByBody.get(selectedBody.id) ?? [] : []
  const selectedLinks = selectedBody ? companyBodyLinks.filter((link) => link.bodyId === selectedBody.id) : []
  const pending = bodyResearchCoverage.filter((record) => record.status !== 'reviewed')

  const exportLeads = () => {
    if (!selectedBody) return
    downloadCsv(`${selectedBody.id}-directory-leads.csv`, [
      ['body_id', 'published_company', 'canonical_company_id', 'category', 'status', 'evidence_url', 'checked_on'],
      ...selectedLeads.map((lead) => [
        lead.bodyId, lead.publishedCompanyName, lead.organizationId ?? '',
        lead.category, lead.status, lead.sourceUrl, lead.checkedOn,
      ]),
    ])
  }

  return (
    <ErrorBoundary>
      <main className="page">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Industry Atlas', to: '/industry-atlas' },
            { label: 'Industry bodies' },
          ]} />
          <header className="page-head">
            <div>
              <h1>Industry bodies &amp; member networks</h1>
              <p>
                Start an industry search with its trade associations, professional bodies, regulators
                and published member directories. Verified company memberships are separate from
                directory leads, suppliers and recruiters' role-specific sourcing tiers.
              </p>
            </div>
            <div className="page-head-aside">
              <span className="page-head-meta"><b>{industryBodies.length}</b> researched bodies</span>
              <span className="page-head-meta"><b>{companyBodyLinks.length}</b> sourced company-body links</span>
              <span className="page-head-meta"><b>{pending.length}</b> research scopes pending</span>
            </div>
          </header>

          <section className="assoc-context" aria-label="Find an industry body">
            <label className="assoc-context-field">
              <span>Search associations, industry niches or regulators</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. aggregates, ASPASA, mining" />
            </label>
            <p>Unresearched sectors are unknown, not evidence that no association exists.</p>
            {nodeId && <p>Industry Atlas scope: {nodeId}. <Link to="/industry-bodies">Clear scope</Link></p>}
          </section>

          <section aria-labelledby="industry-body-list">
            <h2 id="industry-body-list">Industry organisations</h2>
            {filteredBodies.length === 0 ? <p>No researched bodies match this filter. Research may still be pending.</p> : (
              <ul>
                {filteredBodies.map((body) => (
                  <li key={body.id}>
                    <button type="button" className="btn btn-ghost btn-sm"
                      aria-pressed={selectedBody?.id === body.id}
                      onClick={() => setParams({ body: body.id }, { replace: true })}>
                      {body.name} ({body.acronym})
                    </button>
                    {' — '}{body.category} · {body.specialistNiches.join(', ')}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {selectedBody && (
            <section aria-labelledby="industry-body-detail">
              <h2 id="industry-body-detail">{selectedBody.name}</h2>
              <p>{selectedBody.category} · {selectedBody.jurisdiction} · {selectedBody.membershipBasis} participation</p>
              <p>{selectedBody.taxonomyNodeIds.map((node) => (
                <Link key={node} to={`/industry-atlas?node=${encodeURIComponent(node)}`}>{node} (Industry Atlas) </Link>
              ))}</p>
              <p>{selectedBody.notes}</p>
              <p>
                <a href={selectedBody.website} target="_blank" rel="noopener noreferrer">Official website</a>
                {' · '}
                <a href={selectedBody.evidenceUrl} target="_blank" rel="noopener noreferrer">About / evidence</a>
                {selectedBody.membershipDirectoryUrl && (
                  <> · <a href={selectedBody.membershipDirectoryUrl} target="_blank" rel="noopener noreferrer">Member directory</a></>
                )}
              </p>

              <h3>Evidence-linked company relationships ({selectedLinks.length})</h3>
              {selectedLinks.length === 0
                ? <p>No canonical company memberships have been verified in Maps yet. This does not mean the association has no members.</p>
                : <ul>{selectedLinks.map((link) => {
                  const company = organizationsById.get(link.organizationId)
                  return <li key={link.id}>
                    {company ? <Link to={`/organizations/${company.id}`}>{company.name}</Link> : link.organizationId}
                    {' — '}{link.relationship}; {link.status}; {link.memberCategory}
                    {' · '}<a href={link.evidenceUrl} target="_blank" rel="noopener noreferrer">Evidence</a>
                  </li>
                })}</ul>}

              <h3>Published directory company leads ({selectedLeads.length})</h3>
              <p>
                These names appear in published association material. Listing does not prove
                current membership, corporate identity, candidate suitability or recruitment Tier 1.
              </p>
              {selectedLeads.length > 0 && (
                <>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={exportLeads}>
                    Export directory leads (CSV)
                  </button>
                  <ul>{selectedLeads.map((lead) => (
                    <li key={lead.id}>
                      {lead.organizationId && organizationsById.has(lead.organizationId)
                        ? <Link to={`/organizations/${lead.organizationId}`}>{lead.publishedCompanyName}</Link>
                        : <strong>{lead.publishedCompanyName}</strong>}
                      {' — '}{lead.status}; {lead.category}
                      {' · '}<a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer">Directory evidence</a>
                      <p>{lead.note}</p>
                    </li>
                  ))}</ul>
                </>
              )}
            </section>
          )}

          <section aria-labelledby="industry-body-coverage">
            <h2 id="industry-body-coverage">Association-first research coverage</h2>
            <p>Each specialist market needs association and membership research before candidate targeting.</p>
            <ul>{bodyResearchCoverage.map((record) => (
              <li key={`${record.scopeType}:${record.scopeId}`}>
                <strong>{record.scopeId}</strong> — {record.status}
                {record.sourceUrls.length > 0 && <> · <a href={record.sourceUrls[0]} target="_blank" rel="noopener noreferrer">Research source</a></>}
              </li>
            ))}</ul>
          </section>
          <p><Link to="/recruitment-targeting">Continue to role-specific recruitment targeting</Link></p>
        </div>
      </main>
    </ErrorBoundary>
  )
}
