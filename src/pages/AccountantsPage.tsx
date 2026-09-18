import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Building2, ExternalLink, Filter, MapPin, Search } from 'lucide-react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import {
  accountantDesignations,
  accountantIndustries,
  accountantProvinces,
  accountantRoleFamilies,
  accountantUniverse,
  filterAccountantCandidates,
  type AccountantCandidate,
} from '../data/accountantsPeople'
import { canonicalCompanyName } from '../data/companyNormalization'

const PAGE_SIZE = 20

function statusBadge(status: string): { cls: string; label: string; title: string } {
  switch (status) {
    case 'CONFIRMED':
      return { cls: 'acc-badge-confirmed', label: 'Confirmed', title: 'Designation confirmed by evidence' }
    case 'HIGH_CONFIDENCE':
      return { cls: 'acc-badge-high', label: 'High confidence', title: 'Strong evidence, designation not fully confirmed' }
    case 'ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED':
      return { cls: 'acc-badge-articles', label: 'Articles confirmed', title: 'Training/articles confirmed; designation unverified' }
    case 'CONFLICTING':
      return { cls: 'acc-badge-conflicting', label: 'Conflicting', title: 'Conflicting evidence on designation — under review' }
    default:
      return { cls: '', label: status || 'Recorded', title: 'Record status' }
  }
}

function CandidateCard({ candidate, onFilter }: { candidate: AccountantCandidate; onFilter: (key: string, value: string) => void }) {
  const badge = statusBadge(candidate.status)
  const systems = [...candidate.accountingSystems, ...candidate.erpSystems, ...candidate.analyticsTools]
  const canonicalEmployer = candidate.employer ? canonicalCompanyName(candidate.employer) : ''
  const evidenceUrl = candidate.sourceUrls[0] || candidate.primarySource
  return (
    <article className="hack-candidate-card">
      <header className="hack-candidate-head">
        <div>
          <h3 className="hack-candidate-name">{candidate.fullName}</h3>
          <p className="hack-candidate-sub">
            {candidate.designations.map((designation) => (
              <button
                key={designation}
                type="button"
                className="hack-badge acc-badge-designation"
                title="Show all candidates with this designation"
                onClick={() => onFilter('designation', designation)}
              >
                {designation}
              </button>
            ))}
          </p>
        </div>
        <span className={`hack-badge ${badge.cls}`} title={badge.title}>{badge.label}</span>
      </header>

      {candidate.title && (
        <p className="acc-candidate-title">{candidate.title}</p>
      )}

      <div className="hack-candidate-meta">
        {candidate.employer && (
          <button
            type="button"
            className="hack-meta-link"
            title={canonicalEmployer === candidate.employer ? 'Show all candidates at this employer' : `Show all candidates at ${canonicalEmployer} (listed as ${candidate.employer})`}
            onClick={() => onFilter('employer', canonicalEmployer)}
          >
            <Building2 size={14} aria-hidden /> {canonicalEmployer}
          </button>
        )}
        {candidate.roleFamily && (
          <button type="button" className="hack-meta-link" title="Show all candidates in this role family" onClick={() => onFilter('roleFamily', candidate.roleFamily)}>
            {candidate.roleFamily}
          </button>
        )}
        {candidate.industry && (
          <button type="button" className="hack-meta-link" title="Show all candidates in this industry" onClick={() => onFilter('industry', candidate.industry)}>
            {candidate.industry}
          </button>
        )}
        {candidate.province && (
          <button type="button" className="hack-meta-link" title="Show all candidates in this province" onClick={() => onFilter('province', candidate.province)}>
            <MapPin size={14} aria-hidden /> {candidate.province}
          </button>
        )}
      </div>

      {candidate.employer && (
        <div className="hack-crosslinks">
          <Link to={`/talent-search?q=${encodeURIComponent(canonicalEmployer)}`} title="Search this employer across every pool">
            {canonicalEmployer} across all pools
          </Link>
          <Link to={`/contacts?company=${encodeURIComponent(canonicalEmployer)}`} title="Open the contacts directory at this company">
            Contacts at {canonicalEmployer}
          </Link>
        </div>
      )}

      {systems.length > 0 && (
        <p className="acc-systems">
          {systems.map((system) => (
            <span key={system} className="hack-badge acc-badge-system">{system}</span>
          ))}
        </p>
      )}

      {candidate.qualificationEvidence && (
        <p className="acc-evidence-text">{candidate.qualificationEvidence}</p>
      )}

      <footer className="hack-candidate-foot">
        {evidenceUrl ? (
          <a className="hack-evidence-link" href={evidenceUrl} target="_blank" rel="noreferrer">
            Evidence <ExternalLink size={12} aria-hidden />
          </a>
        ) : (
          <span className="hack-source-note">Evidence recorded in the research database</span>
        )}
        {candidate.sourceUrls.length > 1 && (
          <span className="hack-source-note">+ {candidate.sourceUrls.length - 1} more source{candidate.sourceUrls.length - 1 === 1 ? '' : 's'}</span>
        )}
      </footer>
    </article>
  )
}

export function AccountantsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const param = (key: string) => searchParams.get(key) ?? ''
  const query = param('q')
  const designation = param('designation')
  const province = param('province')
  const industry = param('industry')
  const roleFamily = param('roleFamily')
  const employer = param('employer')
  const [page, setPage] = useState(0)
  const setParam = (key: string, value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    }, { replace: true })
  }

  const universe = useMemo(() => accountantUniverse(), [])
  const designations = useMemo(() => accountantDesignations(), [])
  const provinces = useMemo(() => accountantProvinces(), [])
  const industries = useMemo(() => accountantIndustries(), [])
  const roleFamilies = useMemo(() => accountantRoleFamilies(), [])

  const results = useMemo(
    () => filterAccountantCandidates({ query, designation, province, industry, roleFamily, employer }),
    [query, designation, province, industry, roleFamily, employer],
  )
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = results.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)
  const hasFilters = Boolean(query || designation || province || industry || roleFamily || employer)

  return (
    <main className="page">
      <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Accounting & Finance' }]} />
      <header className="hack-hero">
        <p className="hack-kicker">SA Talent Pool · Candidates</p>
        <h1>Accounting &amp; Finance professionals</h1>
        <p className="hack-lede">
          Evidence-backed candidates from the SA Qualified Accountant &amp; Finance Skills Intelligence Map — professionally
          qualified South African accountants and finance professionals (CA(SA), AGA(SA), PA(SA), CIMA and ACCA routes).
          Every record keeps its qualification evidence and source URLs; nothing is inferred.
        </p>
        <div className="hack-kpis">
          <div className="hack-kpi"><strong>{universe.candidates}</strong><span>Candidates</span></div>
          <div className="hack-kpi"><strong>{universe.confirmed}</strong><span>Confirmed qualified</span></div>
          <div className="hack-kpi"><strong>{universe.caSa}</strong><span>CA(SA)</span></div>
          <div className="hack-kpi"><strong>{universe.employers}</strong><span>Employers mapped</span></div>
          <div className="hack-kpi"><strong>{universe.provinces}</strong><span>Provinces</span></div>
        </div>
      </header>

      <section className="hack-controls" aria-label="Filters">
        <div className="hack-control hack-control-search">
          <Search size={15} aria-hidden />
          <input
            value={query}
            onChange={(change) => { setParam('q', change.target.value); setPage(0) }}
            placeholder="Search name, employer, title, evidence…"
            aria-label="Search candidates"
          />
        </div>
        <div className="hack-control">
          <Filter size={15} aria-hidden />
          <select value={designation} onChange={(change) => { setParam('designation', change.target.value); setPage(0) }} aria-label="Designation">
            <option value="">Any designation</option>
            {designations.map((option) => (
              <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
            ))}
          </select>
        </div>
        <div className="hack-control">
          <select value={province} onChange={(change) => { setParam('province', change.target.value); setPage(0) }} aria-label="Province">
            <option value="">All provinces</option>
            {provinces.map((option) => (
              <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
            ))}
          </select>
        </div>
        <div className="hack-control">
          <select value={industry} onChange={(change) => { setParam('industry', change.target.value); setPage(0) }} aria-label="Industry">
            <option value="">All industries</option>
            {industries.map((option) => (
              <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
            ))}
          </select>
        </div>
        <div className="hack-control">
          <select value={roleFamily} onChange={(change) => { setParam('roleFamily', change.target.value); setPage(0) }} aria-label="Role family">
            <option value="">All role families</option>
            {roleFamilies.map((option) => (
              <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
            ))}
          </select>
        </div>
        <div className="hack-control hack-control-search">
          <Building2 size={15} aria-hidden />
          <input
            value={employer}
            onChange={(change) => { setParam('employer', change.target.value); setPage(0) }}
            placeholder="Employer…"
            aria-label="Employer"
          />
        </div>
      </section>

      <p className="hack-results-count">
        {results.length} candidate{results.length === 1 ? '' : 's'} match{hasFilters ? ' the current filters' : 'ing the pool'}
        {hasFilters ? (
          <button className="hack-clear" onClick={() => setSearchParams({}, { replace: true })}>
            Clear filters
          </button>
        ) : null}
      </p>

      {pageItems.length === 0 ? (
        <EmptyState title="No candidates match" description="Try clearing a filter or searching a different employer, designation or name." />
      ) : (
        <div className="hack-candidate-grid">
          {pageItems.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} onFilter={setParam} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="hack-pagination" aria-label="Pagination">
          <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>Previous</button>
          <span>Page {safePage + 1} of {pageCount}</span>
          <button disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)}>Next</button>
        </nav>
      )}

      <footer className="hack-page-foot">
        <p>
          Source: SA Qualified Accountant &amp; Finance Skills Intelligence Map (markets/accountants/). Public professional
          information only. Records are attached to identities on evidence, never on name similarity alone; a professional
          designation does not by itself prove a specific articles/training route.
        </p>
      </footer>
    </main>
  )
}
