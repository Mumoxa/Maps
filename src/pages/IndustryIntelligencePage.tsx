import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowSquareOut, Download, MagnifyingGlass, ShareNetwork } from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { Pagination } from '../components/ui/Pagination'
import { bodyById, industryIntelligence, recruitmentNetworks } from '../data/industryIntelligence/load'
import {
  associationMembersCsv,
  filterAssociationMembers,
  filterCompanyRelationships,
  filterIndustryBodies,
  type IntelligenceFilters,
} from '../data/industryIntelligence/query'
import type { AssociationMember, EvidenceStatus, ParticipantType } from '../data/industryIntelligence/types'
import progressManifest from '../../markets/industry-intelligence/progress-manifest.json'
import './IndustryIntelligencePage.css'

type ExplorerView = 'bodies' | 'company-map' | 'members' | 'networks' | 'leadership' | 'coverage'
const PAGE_SIZE = 40
const viewLabels: Record<ExplorerView, string> = {
  bodies: 'Body directory', 'company-map': 'Company map', members: 'Association members', networks: 'Recruitment networks', leadership: 'Leadership', coverage: 'Coverage & remaining work',
}
const statuses: EvidenceStatus[] = ['Confirmed', 'Historical', 'Unverified', 'Unknown', 'Not applicable']
const participantTypes: ParticipantType[] = ['producer-operator', 'corporate-member', 'associate-supplier', 'contractor', 'professional-services', 'financial-product-provider', 'investment-holding', 'association', 'educational-institution', 'public-institution', 'unknown']

function readFilters(params: URLSearchParams): IntelligenceFilters {
  return {
    query: params.get('q') ?? '', bodyId: params.get('body') ?? '', category: params.get('category') ?? '',
    status: (params.get('status') ?? '') as IntelligenceFilters['status'], participantType: (params.get('type') ?? '') as IntelligenceFilters['participantType'],
    region: params.get('region') ?? '', networkId: params.get('network') ?? '', tier: (params.get('tier') ?? '') as IntelligenceFilters['tier'],
  }
}

function download(filename: string, contents: string) {
  const blob = new Blob([contents], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function StatusBadge({ status }: { status: EvidenceStatus }) {
  return <span className={`ii-status ii-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
}

function CompanyName({ member }: { member: AssociationMember }) {
  const canonicalLink = member.companyId?.startsWith('org-') && member.identityStatus === 'resolved'
  return (
    <div className="ii-company-name">
      {canonicalLink ? <Link to={`/organizations/${encodeURIComponent(member.companyId!)}`}>{member.companyName}</Link> : <strong>{member.companyName}</strong>}
      {member.originalDirectoryName !== member.companyName && <span>Listed as “{member.originalDirectoryName}”</span>}
      <span className={`ii-identity ii-identity-${member.identityStatus}`}>
        {member.identityStatus === 'resolved' ? 'Repository identity' : member.identityStatus === 'proposed' ? 'Proposed — not in canonical Maps' : member.identityStatus === 'body-reference' ? 'Industry body' : 'Identity unresolved'}
      </span>
    </div>
  )
}

export function IndustryIntelligencePage() {
  useEffect(() => { document.title = 'SA Talent Map | Industry Bodies' }, [])
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const requestedView = searchParams.get('view') as ExplorerView | null
  const view: ExplorerView = requestedView && requestedView in viewLabels ? requestedView : 'bodies'
  const filters = useMemo(() => readFilters(searchParams), [searchParams])
  const activeNetworkId = view === 'networks' ? filters.networkId || recruitmentNetworks[0]?.id || '' : filters.networkId
  const effectiveFilters = useMemo(() => ({ ...filters, networkId: activeNetworkId }), [filters, activeNetworkId])
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const { coverage } = industryIntelligence

  const setParams = useCallback((mutate: (params: URLSearchParams) => URLSearchParams) => {
    setSearchParams((previous) => mutate(new URLSearchParams(previous)), { replace: true })
  }, [setSearchParams])
  const setFilter = useCallback((key: string, value: string) => {
    setParams((params) => {
      if (value) params.set(key, value)
      else params.delete(key)
      if (key !== 'page') params.delete('page')
      return params
    })
  }, [setParams])
  const setView = useCallback((next: ExplorerView) => {
    setParams((params) => { params.set('view', next); params.delete('page'); return params })
  }, [setParams])
  const resetFilters = useCallback(() => {
    setSearchInput('')
    setSearchParams(view === 'bodies' ? {} : { view }, { replace: true })
  }, [setSearchParams, view])

  useEffect(() => { setSearchInput(filters.query) }, [filters.query])

  const filteredMembers = useMemo(() => filterAssociationMembers(effectiveFilters), [effectiveFilters])
  const filteredBodies = useMemo(() => filterIndustryBodies(filters), [filters])
  const filteredRelationships = useMemo(() => filterCompanyRelationships(effectiveFilters), [effectiveFilters])
  const filteredLeadership = useMemo(() => industryIntelligence.leadership.filter((leader) => {
    if (filters.bodyId && leader.bodyId !== filters.bodyId) return false
    if (filters.status && leader.verificationStatus !== filters.status) return false
    const body = bodyById.get(leader.bodyId)
    const text = [leader.individualName, leader.associationRole, leader.currentEmployer, leader.corporateTitle, body?.officialName ?? '', body?.acronym ?? ''].join(' ').toLowerCase()
    return !filters.query || text.includes(filters.query.toLowerCase())
  }), [filters])
  const activeRows = view === 'company-map' ? filteredRelationships : filteredMembers
  const totalPages = Math.max(1, Math.ceil(activeRows.length / PAGE_SIZE))
  const visibleMembers = filteredMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const visibleRelationships = filteredRelationships.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeNetwork = recruitmentNetworks.find((network) => network.id === activeNetworkId)
  const tieredMembers = useMemo(() => {
    const tiers = new Map(industryIntelligence.classifications.filter((item) => item.networkId === activeNetworkId).map((item) => [item.memberId, item.tier]))
    return filteredMembers.reduce((groups, member) => {
      const tier = tiers.get(member.id)
      if (tier) groups[tier].push(member)
      return groups
    }, { 1: [], 2: [], 3: [] } as Record<1 | 2 | 3, AssociationMember[]>)
  }, [filteredMembers, activeNetworkId])

  const exportCsv = useCallback(() => {
    download(`industry-association-members-${activeNetworkId || filters.bodyId || 'filtered'}.csv`, associationMembersCsv(filteredMembers, activeNetworkId))
  }, [filteredMembers, activeNetworkId, filters.bodyId])

  const selectBody = useCallback((bodyId: string) => {
    setSearchParams({ view: 'members', body: bodyId }, { replace: true })
  }, [setSearchParams])

  return (
    <ErrorBoundary>
      <main className="page ii-page">
        <div className="container container-wide">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Industry bodies' }]} />
          <header className="page-head ii-hero">
            <div>
              <span className="ii-eyebrow"><ShareNetwork size={16} aria-hidden /> External industry intelligence</span>
              <h1>Industry Association Explorer</h1>
              <p>Follow companies into the associations, professional bodies, statutory schemes and regulators around them—and back out to other directory participants. Membership, regulation, committee representation and operational similarity stay explicitly separate.</p>
            </div>
            <div className="page-head-aside">
              <span className="page-head-meta"><b>{coverage.distinctBodies}</b> body records</span>
              <span className="page-head-meta"><b>{coverage.associationMemberRows}</b> directory rows</span>
              <span className="page-head-meta"><b>{coverage.companiesResearched}</b> existing identities researched</span>
              <span className="page-head-meta"><b>{coverage.proposedCompanyRecords}</b> proposed companies</span>
            </div>
          </header>

          <div className="ii-coverage-notice" role="note">
            <strong>Verified partial coverage.</strong> {coverage.companiesPending.toLocaleString()} of {coverage.sourceCompanyUniverse.toLocaleString()} reconciled source identities are still pending. Proposed companies are not inserted into the canonical organization register. Historical and unverified rows never display as current confirmed membership.
          </div>

          <nav className="ii-view-tabs" aria-label="Industry intelligence views">
            {(Object.entries(viewLabels) as [ExplorerView, string][]).map(([id, label]) => (
              <button type="button" key={id} className={view === id ? 'active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)}>{label}</button>
            ))}
          </nav>

          {view !== 'coverage' && (
            <section className="ii-filter-panel" aria-labelledby="ii-filter-title">
              <div className="ii-section-heading">
                <div><h2 id="ii-filter-title">Search and filter</h2><p>Search company, source name, body, industry, niche, region or membership category.</p></div>
                <button type="button" className="button button-secondary" onClick={resetFilters}>Reset filters</button>
              </div>
              <form className="ii-filters" onSubmit={(event) => { event.preventDefault(); setFilter('q', searchInput.trim()) }}>
                <label className="ii-search-field">Search intelligence
                  <span><MagnifyingGlass size={16} aria-hidden /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="e.g. Afrimat, ASPASA, aggregates, Western Cape" /></span>
                </label>
                <button type="submit" className="button button-primary ii-search-submit">Search</button>
                <label>Industry body
                  <select value={filters.bodyId} onChange={(event) => setFilter('body', event.target.value)}>
                    <option value="">All bodies</option>
                    {industryIntelligence.bodies.map((body) => <option value={body.id} key={body.id}>{body.acronym} — {body.officialName}</option>)}
                  </select>
                </label>
                <label>Body category
                  <select value={filters.category} onChange={(event) => setFilter('category', event.target.value)}>
                    <option value="">All categories</option>
                    {[...new Set(industryIntelligence.bodies.map((body) => body.category))].sort().map((category) => <option key={category} value={category}>{category.replace(/-/g, ' ')}</option>)}
                  </select>
                </label>
                <label>Evidence status
                  <select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}>
                    <option value="">All statuses</option>
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label>Participant type
                  <select value={filters.participantType} onChange={(event) => setFilter('type', event.target.value)}>
                    <option value="">All participants</option>
                    {participantTypes.map((type) => <option key={type} value={type}>{type.replace(/-/g, ' ')}</option>)}
                  </select>
                </label>
                <label>Region contains
                  <input value={filters.region} onChange={(event) => setFilter('region', event.target.value)} placeholder="e.g. Western Cape" />
                </label>
                <label>Recruitment brief
                  <select value={activeNetworkId} onChange={(event) => setFilter('network', event.target.value)}>
                    <option value="">No brief applied</option>
                    {recruitmentNetworks.map((network) => <option key={network.id} value={network.id}>{network.specialistNiche}</option>)}
                  </select>
                </label>
                <label>Brief tier
                  <select value={filters.tier} onChange={(event) => setFilter('tier', event.target.value)} disabled={!activeNetworkId}>
                    <option value="">All tiers</option>
                    <option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option>
                  </select>
                </label>
              </form>
              <div className="ii-filter-summary"><span>{activeRows.length.toLocaleString()} matching {view === 'company-map' ? 'relationships' : 'directory rows'}</span><button type="button" className="button button-secondary" onClick={exportCsv} disabled={filteredMembers.length === 0}><Download size={16} aria-hidden /> Export members CSV</button></div>
            </section>
          )}

          {view === 'bodies' && (
            <section aria-labelledby="ii-bodies-title">
              <div className="ii-section-heading"><div><h2 id="ii-bodies-title">Industry Body Master Directory</h2><p>{filteredBodies.length} bodies match. Directory availability describes the latest review, not membership completeness.</p></div></div>
              <div className="ii-body-grid">
                {filteredBodies.map((body) => {
                  const bodyMembers = industryIntelligence.members.filter((member) => member.bodyId === body.id)
                  const confirmed = bodyMembers.filter((member) => member.verificationStatus === 'Confirmed').length
                  return (
                    <article className="ii-body-card" key={body.id}>
                      <div className="ii-card-topline"><span>{body.category.replace(/-/g, ' ')}</span><span>{body.participationBasis}</span></div>
                      <h3>{body.acronym}</h3>
                      <p className="ii-body-official-name">{body.officialName}</p>
                      <p>{body.notes}</p>
                      <dl className="ii-body-facts">
                        <div><dt>Represents</dt><dd>{body.represents}</dd></div>
                        <div><dt>Coverage</dt><dd>{body.geographicCoverage.join('; ')}</dd></div>
                        <div><dt>Saved rows</dt><dd>{bodyMembers.length} ({confirmed} confirmed)</dd></div>
                        <div><dt>Last verified</dt><dd>{body.lastVerified}</dd></div>
                      </dl>
                      <div className="ii-tag-list">{body.subIndustries.slice(0, 5).map((item) => <span key={item}>{item}</span>)}</div>
                      <div className="ii-card-actions">
                        <button type="button" className="button button-primary" onClick={() => selectBody(body.id)} disabled={bodyMembers.length === 0}>Explore {bodyMembers.length} rows</button>
                        <a href={body.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Official evidence for ${body.acronym}`}>Official evidence <ArrowSquareOut size={14} aria-hidden /></a>
                      </div>
                    </article>
                  )
                })}
              </div>
              {filteredBodies.length === 0 && <div className="ii-empty"><h3>No bodies match</h3><p>Reset or broaden the filters. Empty results are not evidence that a body or membership does not exist.</p></div>}
            </section>
          )}

          {(view === 'members' || view === 'networks') && (
            <section aria-labelledby="ii-members-title">
              {view === 'networks' && activeNetwork && (
                <div className="ii-brief">
                  <div><span className="ii-eyebrow">Brief-specific executive-search intelligence</span><h2>{activeNetwork.specialistNiche}</h2><p>{activeNetwork.brief}</p></div>
                  <dl><div><dt>Target</dt><dd>{activeNetwork.targetCompanyName}</dd></div><div><dt>Geography</dt><dd>{activeNetwork.geographicRelevance.join('; ')}</dd></div></dl>
                  <p><strong>Coverage:</strong> {activeNetwork.researchCoverage}</p>
                </div>
              )}
              <div className="ii-section-heading"><div><h2 id="ii-members-title">{view === 'networks' ? 'Recruitment target market' : 'Association Member Directory'}</h2><p>{view === 'networks' ? 'Tiers describe relevance to this brief only. They are not universal company rankings or findings about any individual.' : 'Original directory names, participant roles and identity state remain visible alongside canonical links.'}</p></div></div>
              {view === 'networks' ? (
                <div className="ii-tier-grid">
                  {([1, 2, 3] as const).map((tier) => (
                    <section className="ii-tier" key={tier} aria-labelledby={`ii-tier-${tier}`}>
                      <h3 id={`ii-tier-${tier}`}>Tier {tier} <span>{tieredMembers[tier].length}</span></h3>
                      <p>{activeNetwork?.tierCriteria[`tier${tier}` as 'tier1' | 'tier2' | 'tier3']}</p>
                      {tieredMembers[tier].slice(0, 80).map((member) => (
                        <article className="ii-target-card" key={member.id}>
                          <CompanyName member={member} />
                          <span>{bodyById.get(member.bodyId)?.acronym} · {member.membershipCategory}</span>
                          <p>{member.industryNiche}</p>
                          <div><StatusBadge status={member.verificationStatus} /><a href={member.evidenceUrl} target="_blank" rel="noreferrer" aria-label={`Evidence for ${member.companyName}`}>Evidence <ArrowSquareOut size={13} aria-hidden /></a></div>
                        </article>
                      ))}
                      {tieredMembers[tier].length === 0 && <p className="ii-muted">No saved participants match this tier and filter set.</p>}
                    </section>
                  ))}
                </div>
              ) : (
                <>
                  <div className="ii-table-wrap">
                    <table className="ii-table">
                      <caption className="sr-only">Filtered association member directory</caption>
                      <thead><tr><th>Company / identity</th><th>Body and category</th><th>Participant and niche</th><th>Region</th><th>Evidence</th></tr></thead>
                      <tbody>{visibleMembers.map((member) => (
                        <tr key={member.id}>
                          <td><CompanyName member={member} />{member.operationNames.length > 0 && <span className="ii-cell-note">{member.operationNames.length} source-listed operations</span>}</td>
                          <td><strong>{bodyById.get(member.bodyId)?.acronym}</strong><span>{member.membershipCategory}</span></td>
                          <td><span>{member.participantType.replace(/-/g, ' ')}</span><span>{member.industryNiche}</span></td>
                          <td>{member.location || 'Not stated'}</td>
                          <td><StatusBadge status={member.verificationStatus} /><a className="ii-evidence-link" href={member.evidenceUrl} target="_blank" rel="noreferrer">Source <ArrowSquareOut size={13} aria-hidden /></a><span className="ii-cell-note">Checked {member.lastChecked}</span></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                  {filteredMembers.length === 0 && <div className="ii-empty"><h3>No directory rows match</h3><p>Try fewer filters. An empty result is not proof of non-membership.</p></div>}
                  <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} total={filteredMembers.length} onChange={(next) => setFilter('page', String(next))} />
                </>
              )}
            </section>
          )}

          {view === 'company-map' && (
            <section aria-labelledby="ii-company-map-title">
              <div className="ii-section-heading"><div><h2 id="ii-company-map-title">Company Membership & External Relationship Map</h2><p>Voluntary membership, mandatory statutory participation, regulation and committee representation are different claims.</p></div></div>
              <div className="ii-table-wrap"><table className="ii-table"><caption className="sr-only">Company to external body relationships</caption>
                <thead><tr><th>Company / source identity</th><th>External body</th><th>Relationship</th><th>Basis</th><th>Status and evidence</th></tr></thead>
                <tbody>{visibleRelationships.map((relationship) => (
                  <tr key={relationship.id}><td><strong>{relationship.companyName}</strong><span className="ii-cell-note">{relationship.companyId}</span></td><td>{bodyById.get(relationship.bodyId)?.officialName}</td><td><span>{relationship.relationshipType.replace(/-/g, ' ')}</span><span>{relationship.membershipCategory || 'Category not established'}</span></td><td>{relationship.participationBasis}</td><td><StatusBadge status={relationship.status} /><a className="ii-evidence-link" href={relationship.evidenceUrl} target="_blank" rel="noreferrer">Source <ArrowSquareOut size={13} aria-hidden /></a><span className="ii-cell-note">{relationship.subIndustry}</span></td></tr>
                ))}</tbody></table></div>
              {filteredRelationships.length === 0 && <div className="ii-empty"><h3>No relationships match</h3><p>Unknown is used when research has not established membership; an empty filter result is not a negative finding.</p></div>}
              <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} total={filteredRelationships.length} onChange={(next) => setFilter('page', String(next))} />
            </section>
          )}

          {view === 'leadership' && (
            <section aria-labelledby="ii-leadership-title">
              <div className="ii-section-heading"><div><h2 id="ii-leadership-title">Published Association Leadership</h2><p>Public professional roles only. Dated committee service does not imply candidate suitability, availability or current employment.</p></div></div>
              <div className="ii-table-wrap"><table className="ii-table"><caption className="sr-only">Published association leadership</caption><thead><tr><th>Individual</th><th>Association role</th><th>Published employer and title</th><th>Evidence</th></tr></thead>
                <tbody>{filteredLeadership.map((leader) => <tr key={leader.id}><td><strong>{leader.individualName}</strong></td><td>{leader.associationRole}</td><td><span>{leader.currentEmployer}</span><span>{leader.corporateTitle}</span></td><td><StatusBadge status={leader.verificationStatus} /><a className="ii-evidence-link" href={leader.evidenceUrl} target="_blank" rel="noreferrer">{leader.evidenceDate} source <ArrowSquareOut size={13} aria-hidden /></a><span className="ii-cell-note">Checked {leader.verifiedDate}</span></td></tr>)}</tbody></table></div>
              {filteredLeadership.length === 0 && <div className="ii-empty"><h3>No leadership rows match</h3><p>Leadership has only been imported for the dated ASPASA 2025 MANCOM batch.</p></div>}
            </section>
          )}

          {view === 'coverage' && (
            <section aria-labelledby="ii-coverage-title" className="ii-coverage">
              <div className="ii-section-heading"><div><h2 id="ii-coverage-title">Research Coverage Report</h2><p>Calculated from the saved inventory and relationship output on {coverage.generatedOn}; no manual coverage totals.</p></div><button type="button" className="button button-secondary" onClick={exportCsv}><Download size={16} aria-hidden /> Export current member CSV</button></div>
              <div className="ii-metric-grid">
                {[
                  ['Application companies', coverage.applicationCompanyUniverse], ['Additional source-only identities', coverage.additionalSourceOnlyOrganizations],
                  ['Existing identities researched', coverage.companiesResearched], ['With confirmed external relationship', coverage.companiesWithConfirmedRelationship],
                  ['Researched without confirmed relationship', coverage.companiesResearchedWithoutConfirmedRelationship], ['Pending', coverage.companiesPending],
                  ['Association member rows', coverage.associationMemberRows], ['Proposed company records', coverage.proposedCompanyRecords],
                ].map(([label, value]) => <div className="ii-metric" key={label}><strong>{Number(value).toLocaleString()}</strong><span>{label}</span></div>)}
              </div>
              <div className="ii-coverage-columns">
                <section><h3>Scope and caveats</h3><ul>{coverage.scopeNotes.map((note) => <li key={note}>{note}</li>)}</ul></section>
                <section><h3>Identity warnings</h3><ul>{coverage.identityWarnings.map((note) => <li key={note}>{note}</li>)}</ul></section>
              </div>
              <section aria-labelledby="ii-remaining-title"><h3 id="ii-remaining-title">Persistent remaining-work manifest</h3><div className="ii-batch-list">{progressManifest.batches.map((batch) => <article key={batch.id}><div><strong>{batch.id.replace(/-/g, ' ')}</strong><span>{batch.status.replace(/-/g, ' ')}</span></div><span>{batch.records} saved rows</span><p>{batch.next}</p></article>)}</div></section>
              <section aria-labelledby="ii-refresh-title"><h3 id="ii-refresh-title">Refresh contract</h3><p>Review the official source, preserve its publication or effective date, add or update a compact source seed, then run <code>npm run intelligence:build</code> and <code>npm run intelligence:validate</code>. JSON, CSV, coverage and the Explorer are regenerated from the same records. Never overwrite a historical source with an undated current assumption.</p></section>
            </section>
          )}
        </div>
      </main>
    </ErrorBoundary>
  )
}
