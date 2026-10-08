import { useEffect, useId, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Pagination } from '../components/ui/Pagination'
import reportFile from '../../markets/intelligence/reconciliation-report.json'
import { coverageSummary, QUALITY_LABELS, runQualityChecks, type QualityCheck, type QualityIssue } from '../data/intelligence/quality'
import { useIntelligenceGraph } from '../data/intelligence/useIntelligence'

const PAGE_SIZE = 50
type Tab = 'all' | 'coverage' | 'quality'

interface ReportShape {
  runDate: string
  counts: Record<string, number>
  merges: { organizationId: string; name: string; refs: string[]; reason: string }[]
  duplicatesWithinSource: { dataset: string; name: string; refs: string[] }[]
  unmappedIndustryLabels: { label: string; refs: string[] }[]
  unclassifiedOrganizations: { organizationId: string; name: string }[]
  unmatchedCoverageTargets: { targetId: string; name: string }[]
  unresolvedParents: { ref: string; parent: string }[]
}
const report = reportFile as ReportShape

export function OrganizationDirectory() {
  const graph = useIntelligenceGraph()
  const [params, setParams] = useSearchParams()
  const baseId = useId()
  const tab = (['coverage', 'quality'].includes(params.get('tab') ?? '') ? params.get('tab') : 'all') as Tab
  const q = params.get('q') ?? ''
  const identity = params.get('identity') ?? ''
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1)

  useEffect(() => {
    document.title = 'SA Talent Map | Organizations'
  }, [])

  const patch = (values: Record<string, string | null>) =>
    setParams((current) => {
      const next = new URLSearchParams(current)
      for (const [key, value] of Object.entries(values)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      return next
    })

  const orgs = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return graph.organizations.filter((org) => {
      if (needle && ![org.name, ...org.aliases].some((name) => name.toLowerCase().includes(needle))) return false
      if (identity && org.identityStatus !== identity) return false
      return true
    })
  }, [graph, q, identity])
  const totalPages = Math.max(1, Math.ceil(orgs.length / PAGE_SIZE))
  const slice = orgs.slice((Math.min(page, totalPages) - 1) * PAGE_SIZE, Math.min(page, totalPages) * PAGE_SIZE)
  const coverage = useMemo(() => coverageSummary(graph), [graph])
  const issues = useMemo(() => (tab === 'quality' ? runQualityChecks(graph) : []), [graph, tab])
  const issuesByCheck = useMemo(() => {
    const map = new Map<QualityCheck, QualityIssue[]>()
    for (const issue of issues) map.set(issue.check, [...(map.get(issue.check) ?? []), issue])
    return map
  }, [issues])

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Organizations' }]} />
        <div className="page-head">
          <div>
            <h1>Organizations</h1>
            <p>One canonical record per company across every talent track, with lineage back to the legacy lists, coverage reporting and data-quality checks.</p>
          </div>
          <div className="page-head-aside">
            <span className="page-head-meta">
              <b>{graph.organizations.length.toLocaleString()}</b> organizations
            </span>
          </div>
        </div>

        <div className="ca-view-switch" role="tablist" aria-label="Organization views">
          {(['all', 'coverage', 'quality'] as Tab[]).map((value) => (
            <button key={value} type="button" role="tab" aria-selected={tab === value} className={tab === value ? 'ca-tab is-active' : 'ca-tab'} onClick={() => patch({ tab: value === 'all' ? null : value, page: null })}>
              {value === 'all' ? 'All organizations' : value === 'coverage' ? 'Coverage and reconciliation' : 'Data quality'}
            </button>
          ))}
        </div>

        {tab === 'all' && (
          <>
            <div className="page-toolbar">
              <label htmlFor={`${baseId}-q`} className="sr-only">
                Search organizations
              </label>
              <input id={`${baseId}-q`} type="search" className="ca-input" placeholder="Search names and aliases" value={q} onChange={(event) => patch({ q: event.target.value, page: null })} />
              <label htmlFor={`${baseId}-identity`} className="sr-only">
                Identity status
              </label>
              <select id={`${baseId}-identity`} className="filter-select" value={identity} onChange={(event) => patch({ identity: event.target.value, page: null })}>
                <option value="">Any identity status</option>
                <option value="verified">Verified</option>
                <option value="probable">Probable</option>
                <option value="unresolved">Unresolved</option>
              </select>
            </div>
            <div className="data-table-wrap">
              <table className="data-table">
                <caption className="sr-only">Organizations with industries, identity status, lineage and linked people</caption>
                <thead>
                  <tr>
                    <th scope="col">Organization</th>
                    <th scope="col">Industries</th>
                    <th scope="col">Identity</th>
                    <th scope="col">Source lists</th>
                    <th scope="col">People</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((org) => {
                    const industries = graph.industriesByOrg.get(org.id) ?? []
                    const current = (graph.employmentsByOrg.get(org.id) ?? []).filter((row) => row.current).length
                    return (
                      <tr key={org.id}>
                        <td>
                          <Link to={`/organizations/${org.id}`} className="cell-strong">
                            {org.name}
                          </Link>
                          {!org.southAfrican && <span className="intel-muted"> (foreign parent)</span>}
                        </td>
                        <td>{industries.length ? industries.map((ind) => graph.taxonomy.industryById.get(ind.industryId)?.name).join(', ') : <span className="intel-muted">Unknown</span>}</td>
                        <td>{org.identityStatus}</td>
                        <td>{org.lineage.length ? [...new Set(org.lineage.map((ref) => ref.dataset))].join(', ') : 'research only'}</td>
                        <td className="ca-num">{current}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} total={orgs.length} onChange={(value) => patch({ page: value > 1 ? String(value) : null })} />
          </>
        )}

        {tab === 'coverage' && (
          <>
            <section className="section-block" aria-labelledby="cov-title">
              <h2 id="cov-title">Coverage</h2>
              <p className="intel-muted">South African organizations only. Unknown is reported separately from zero; coverage is not exhaustive.</p>
              <dl className="intel-stats">
                {[
                  ['Organizations', coverage.organizations],
                  ['Industry classified', coverage.classified],
                  ['Industry unknown', coverage.unclassified],
                  ['With an observed capability', coverage.withObservedCapability],
                  ['Capabilities still unknown', coverage.capabilityUnknown],
                  ['With locations', coverage.withLocations],
                  ['With mapped people', coverage.withPeople],
                  ['Identity verified', coverage.verifiedIdentity],
                  ['With sourced scale figures', coverage.withMetrics],
                  ['Evidence records', coverage.evidenceRecords],
                  ['People (public profiles)', coverage.persons],
                  ['Employer names not yet linked', coverage.unresolvedEmployers],
                ].map(([label, value]) => (
                  <div key={label} className="intel-stat">
                    <dt>{label}</dt>
                    <dd>{Number(value).toLocaleString()}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="section-block" aria-labelledby="rec-title">
              <h2 id="rec-title">Legacy reconciliation ({report.runDate})</h2>
              <p>
                {report.counts.legacyRecords} legacy company records became {report.counts.organizations} organizations. {report.counts.mergedRecords} records merged into an existing
                organization, {report.counts.industryMapped} legacy labels mapped to the industry taxonomy, {report.counts.industryUnmapped} labels unmapped and{' '}
                {report.counts.noLegacyIndustry} records had no industry.
              </p>
              <h3>Merged records</h3>
              <ul>
                {report.merges.map((merge) => (
                  <li key={merge.organizationId}>
                    <Link to={`/organizations/${merge.organizationId}`}>{merge.name}</Link>: {merge.refs.join(', ')} ({merge.reason})
                  </li>
                ))}
              </ul>
              {report.duplicatesWithinSource.length > 0 && (
                <>
                  <h3>Duplicates inside one legacy list</h3>
                  <ul>{report.duplicatesWithinSource.map((dup) => <li key={dup.refs.join()}>{dup.dataset}: “{dup.name}” appears as {dup.refs.join(', ')}</li>)}</ul>
                </>
              )}
              <h3>Unresolved parent companies</h3>
              <ul>{report.unresolvedParents.map((row) => <li key={row.ref}>{row.ref} names parent “{row.parent}”, which is not an organization yet</li>)}</ul>
              <h3>Finance-team targets not matched to an organization ({report.unmatchedCoverageTargets.length})</h3>
              <p className="intel-muted">{report.unmatchedCoverageTargets.map((row) => row.name).join(', ')}</p>
              <h3>Organizations without any industry ({report.unclassifiedOrganizations.length})</h3>
              <p className="intel-muted">{report.unclassifiedOrganizations.map((row) => row.name).join(', ')}</p>
            </section>
          </>
        )}

        {tab === 'quality' && (
          <section className="section-block" aria-labelledby="dq-title">
            <h2 id="dq-title">Data-quality checks</h2>
            <p className="intel-muted">{issues.length} findings. Errors block trust in a fact; warnings and information items guide research.</p>
            {[...issuesByCheck.entries()].map(([check, list]) => (
              <details key={check} className="ca-filter-group" open={list.some((issue) => issue.severity !== 'info')}>
                <summary>
                  {QUALITY_LABELS[check]} <span className="ca-filter-count">{list.length}</span>
                </summary>
                <ul className="intel-issues">
                  {list.map((issue, index) => (
                    <li key={`${check}-${index}`} className={`intel-issue-${issue.severity}`}>
                      <span className="intel-muted">{issue.severity}</span> {issue.message}{' '}
                      {issue.organizationIds.slice(0, 4).map((id) => (
                        <Link key={id} to={`/organizations/${id}`} className="intel-issue-link">
                          {graph.organizationById.get(id)?.name ?? id}
                        </Link>
                      ))}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
