import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Briefcase,
  Buildings,
  ClipboardText,
  Copy,
  DownloadSimple,
  FileArrowDown,
  GraduationCap,
  MapPin,
  MagnifyingGlass,
  SlidersHorizontal,
  Sparkle,
  Star,
  Tag,
  X,
} from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { FacetPanel } from '../components/ui/FacetPanel'
import { useDialogLayer } from '../hooks/useDialogLayer'
import { useNoIndex } from '../hooks/useNoIndex'
import {
  bankCandidates,
  bankSearches,
  bankUniverse,
  compareCandidates,
  searchBankFacetDefs,
  searchBankTextMatcher,
  searchNameLookup,
  statusLabel,
  targetCompaniesForSearch,
  type BankUniverse,
} from '../data/searchBank/bank'
import {
  activeFilterCount,
  buildFacetOptions,
  filterByFacets,
  readSelections,
  toggleValue,
  writeSelections,
  type FacetSelections,
} from '../data/facets'
import { candidatesToCsv, toStoredCandidate } from '../data/searchBank/ingest'
import { normaliseDrop, parseDrop } from '../data/searchBank/normalise'
import type { BankCandidate, BankDraft, SearchBrief } from '../data/searchBank/types'

const PAGE_SIZE = 20

const FACET_LABELS: Record<string, string> = Object.fromEntries(
  searchBankFacetDefs.map((def) => [def.key, def.label]),
)

const STATUS_BADGE_CLASS: Record<string, string> = {
  new: 'bank-badge-new',
  screening: 'bank-badge-screening',
  shortlisted: 'bank-badge-shortlisted',
  contacted: 'bank-badge-contacted',
  submitted: 'bank-badge-submitted',
  interviewing: 'bank-badge-interviewing',
  placed: 'bank-badge-placed',
  archived: 'bank-badge-archived',
}

const EXAMPLE_DROP = [
  'search,client,name,title,company,location,skills,qualifications,experience,availability,rating,status,tags',
  'Credit Risk Manager, FirstRand,FirstRand,Example Candidate,Credit Risk Manager,Example Bank,"Sandton, Gauteng",Credit risk; PD modelling,"BCom (Hons); CA(SA)",8 years,1 month,4,shortlisted,priority',
  'Credit Risk Manager, FirstRand,FirstRand,Example Candidate Two,Senior Credit Analyst,Example Insurer,"Cape Town, Western Cape",IFRS 9,BSc,5,immediately,3,,',
].join('\n')

function Rating({ value }: { value: number | null }) {
  if (value === null) return <span className="bank-rating bank-rating-none" title="Not rated yet">Not rated</span>
  return (
    <span className="bank-rating" title={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          size={13}
          aria-hidden
          className={step <= value ? 'bank-star bank-star-on' : 'bank-star'}
        />
      ))}
      <span className="bank-rating-value">{value}</span>
    </span>
  )
}

function CandidateCard({
  candidate,
  onToggle,
  searchLabel,
}: {
  candidate: BankCandidate
  onToggle: (key: string, value: string) => void
  searchLabel: string
}) {
  return (
    <article className="hack-candidate-card bank-candidate-card">
      <header className="hack-candidate-head">
        <div>
          <h3 className="hack-candidate-name">{candidate.fullName}</h3>
          <p className="hack-candidate-sub">
            <span className={`hack-badge ${STATUS_BADGE_CLASS[candidate.status] ?? ''}`}>
              {statusLabel(candidate.status)}
            </span>
            {candidate.seniority && candidate.seniority !== 'Not stated' && (
              <span className="hack-badge">{candidate.seniority}</span>
            )}
            {candidate.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="hack-badge bank-badge-tag"
                title={`Filter by the ${tag} tag`}
                onClick={() => onToggle('tag', tag)}
              >
                <Tag size={11} aria-hidden /> {tag}
              </button>
            ))}
          </p>
        </div>
        <Rating value={candidate.rating} />
      </header>

      {candidate.title && <p className="acc-candidate-title">{candidate.title}</p>}

      <div className="hack-candidate-meta">
        {candidate.employer && (
          <button
            type="button"
            className="hack-meta-link"
            title="Filter by this employer"
            onClick={() => onToggle('employer', candidate.employer)}
          >
            <Buildings size={14} aria-hidden /> {candidate.employer}
          </button>
        )}
        {candidate.locationLabel && (
          <button
            type="button"
            className="hack-meta-link"
            title="Filter by this location"
            onClick={() => onToggle('province', candidate.location.province)}
          >
            <MapPin size={14} aria-hidden /> {candidate.locationLabel}
          </button>
        )}
        {candidate.experienceYears !== null && (
          <span title="Years of experience recorded on the drop">{candidate.experienceYears} yrs experience</span>
        )}
        {candidate.availability && (
          <span className="bank-availability" title="Availability recorded on the drop">
            <ClipboardText size={13} aria-hidden /> {candidate.availability}
          </span>
        )}
      </div>

      {candidate.skills.length > 0 && (
        <p className="acc-systems" aria-label="Skills">
          {candidate.skills.map((skill) => (
            <button
              key={skill}
              type="button"
              className="hack-badge bank-badge-skill"
              title={`Filter by the ${skill} skill`}
              onClick={() => onToggle('skill', skill)}
            >
              {skill}
            </button>
          ))}
        </p>
      )}

      {candidate.qualifications.length > 0 && (
        <p className="acc-systems" aria-label="Qualifications">
          {candidate.qualifications.map((qualification) => (
            <button
              key={qualification}
              type="button"
              className="hack-badge bank-badge-qualification"
              title={`Filter by ${qualification}`}
              onClick={() => onToggle('qualification', qualification)}
            >
              <GraduationCap size={11} aria-hidden /> {qualification}
            </button>
          ))}
        </p>
      )}

      {candidate.notes && <p className="acc-evidence-text">{candidate.notes}</p>}

      <footer className="hack-candidate-foot">
        <button
          type="button"
          className="hack-meta-link bank-search-chip"
          title="Filter the bank down to this search"
          onClick={() => onToggle('search', candidate.searchId)}
        >
          <Briefcase size={12} aria-hidden /> {searchLabel}
        </button>
        <span className="hack-source-note">
          Added {candidate.addedOn}
          {candidate.profileUrl && (
            <>
              {' · '}
              <a className="hack-evidence-link" href={candidate.profileUrl} target="_blank" rel="noreferrer">
                Profile
              </a>
            </>
          )}
        </span>
      </footer>
    </article>
  )
}

interface GroupHeaderProps {
  name: string
  client: string
  role: string
  status: string
  openedOn: string
  count: number
}

function GroupHeader({ name, client, role, status, openedOn, count }: GroupHeaderProps) {
  return (
    <div className="bank-group-head">
      <h2 className="bank-group-title">{name}</h2>
      <p className="bank-group-meta">
        {[client, role].filter(Boolean).join(' · ')}
        {client || role ? ' · ' : ''}
        {count} candidate{count === 1 ? '' : 's'} · opened {openedOn}
        {' · '}
        <span className={`hack-badge ${STATUS_BADGE_CLASS[status] ?? ''}`}>{status}</span>
      </p>
    </div>
  )
}

/**
 * The companies attached to a search as sourcing targets — the write-back from
 * the Company Association Explorer. Kept visibly separate from candidates: a
 * company being worth approaching says nothing about any individual in it.
 */
function TargetCompanies({ searchId }: { searchId: string }) {
  const targets = useMemo(() => targetCompaniesForSearch(searchId), [searchId])

  if (targets.length === 0) {
    return (
      <p className="bank-targets-none">
        No sourcing companies attached to this search. Build a target pool in the{' '}
        <Link to="/company-associations">Company Association Explorer</Link>, export it, then store it with{' '}
        <code>npm run bank:import -- &lt;file&gt; --targets</code>.
      </p>
    )
  }

  return (
    <section className="bank-targets" aria-label="Target companies">
      <h3 className="bank-targets-title">
        Target companies <span className="bank-targets-count">{targets.length}</span>
      </h3>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Company</th>
              <th scope="col">Pocket</th>
              <th scope="col">Relevance tier</th>
              <th scope="col">Mapped professionals</th>
              <th scope="col">Evidence state</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((target) => (
              <tr key={target.id}>
                <td className="cell-strong" title={target.legalName || target.name}>{target.name}</td>
                <td>{target.pocket || 'Not classified'}</td>
                <td>{target.tier !== null ? `Tier ${target.tier}${target.tierLabel ? ` · ${target.tierLabel}` : ''}` : 'Not tiered'}</td>
                <td>{target.mappedProfessionals}</td>
                <td>{target.evidenceState}</td>
                <td>{target.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="bank-targets-note">
        Sourcing targets are companies, not people. Missing evidence is missing research, not a confirmed absence.
      </p>
    </section>
  )
}

interface DropPreview {
  format: string
  drafts: BankDraft[]
  issues: { rowNumber: number; field: string; reason: string }[]
}

function DropPanel({ searches, candidates }: { searches: SearchBrief[]; candidates: BankCandidate[] }) {
  // An empty bank opens straight onto the drop panel: the first thing a
  // recruiter needs is to get candidates in, not to read an empty list.
  const [open, setOpen] = useState(candidates.length === 0)
  const [text, setText] = useState('')
  const [searchName, setSearchName] = useState('')
  const [preview, setPreview] = useState<DropPreview | null>(null)
  const [copied, setCopied] = useState(false)

  const existingIds = useMemo(() => new Set(candidates.map((candidate) => candidate.id)), [candidates])

  const normalise = useCallback((value: string, fallbackSearch: string) => {
    if (!value.trim()) {
      setPreview(null)
      return
    }
    const parsed = parseDrop(value, 'pasted.csv')
    const { drafts, issues } = normaliseDrop(parsed, {
      today: new Date().toISOString().slice(0, 10),
      defaultSearch: fallbackSearch,
      source: 'pasted',
    })
    setPreview({ format: parsed.format, drafts, issues })
  }, [])

  const download = (contents: string, fileName: string) => {
    const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyJson = async () => {
    if (!preview) return
    const stored = preview.drafts.map((draft) => ({
      ...toStoredCandidate(draft),
      inBank: existingIds.has(draft.id) ? 'update' : 'new',
    }))
    try {
      await navigator.clipboard.writeText(JSON.stringify(stored, null, 2))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const newCount = preview ? preview.drafts.filter((draft) => !existingIds.has(draft.id)).length : 0
  const updateCount = preview ? preview.drafts.length - newCount : 0

  return (
    <section className="bank-drop">
      <button
        type="button"
        className="bank-drop-trigger"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Sparkle size={15} aria-hidden />
        Drop candidates in
        <span className="bank-drop-trigger-hint">paste, or choose a file</span>
      </button>

      {open && (
        <div className="bank-drop-body">
          <p className="bank-drop-lede">
            Paste anything you have: a CSV, a JSON list, or plain <code>Key: value</code> text copied out of a CV
            or an email. Every row is normalised onto the same record shape the bank stores, so what you see here is
            exactly what the bank will hold.
          </p>
          <div className="bank-drop-controls">
            <label className="bank-drop-field">
              <span>File these under this search (optional)</span>
              <input
                type="text"
                value={searchName}
                onChange={(event) => {
                  setSearchName(event.target.value)
                  normalise(text, event.target.value)
                }}
                placeholder="e.g. Credit Risk Manager, FirstRand"
              />
            </label>
            <label className="bank-drop-field bank-drop-file">
              <span>…or choose a file</span>
              <input
                type="file"
                accept=".csv,.json,.txt,.md,text/csv,application/json,text/plain"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  const contents = await file.text()
                  setText(contents)
                  normalise(contents, searchName)
                }}
              />
            </label>
          </div>
          <label className="bank-drop-field">
            <span>Candidate text</span>
            <textarea
              value={text}
              onChange={(event) => {
                setText(event.target.value)
                normalise(event.target.value, searchName)
              }}
              rows={8}
              placeholder={'search,name,title,company,location,skills,qualifications\nCredit Risk Manager, FirstRand,Example Candidate,Credit Risk Manager,Example Bank,"Sandton, Gauteng",Credit risk; PD modelling,"BCom (Hons); CA(SA)"'}
              aria-label="Candidate text to normalise"
            />
          </label>
          <div className="bank-drop-actions">
            <button
              type="button"
              className="bank-drop-secondary"
              onClick={() => {
                setText(EXAMPLE_DROP)
                normalise(EXAMPLE_DROP, searchName)
              }}
            >
              Load an example drop
            </button>
            <button
              type="button"
              className="bank-drop-secondary"
              disabled={!preview || preview.drafts.length === 0}
              onClick={() => download(candidatesToCsv(preview?.drafts ?? [], searchNameLookup(searches)), 'search-bank-drop.csv')}
            >
              <FileArrowDown size={14} aria-hidden /> Download normalised CSV
            </button>
            <button
              type="button"
              className="bank-drop-secondary"
              disabled={!preview || preview.drafts.length === 0}
              onClick={copyJson}
            >
              <Copy size={14} aria-hidden /> {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>

          {preview && (
            <div className="bank-drop-preview">
              <p className="bank-drop-summary">
                <strong>{preview.drafts.length}</strong> record{preview.drafts.length === 1 ? '' : 's'} normalised from{' '}
                {preview.format} · <span className="bank-drop-new">{newCount} new</span>
                {updateCount > 0 && <> · <span className="bank-drop-update">{updateCount} would update</span></>}
              </p>
              {preview.issues.length > 0 && (
                <ul className="bank-drop-issues">
                  {preview.issues.map((issue, index) => (
                    <li key={`${issue.rowNumber}-${issue.field}-${index}`}>
                      Row {issue.rowNumber} · {issue.field}: {issue.reason}
                    </li>
                  ))}
                </ul>
              )}
              {preview.drafts.length > 0 && (
                <div className="bank-drop-table-wrap">
                  <table className="bank-drop-table">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Search</th>
                        <th scope="col">Title</th>
                        <th scope="col">Employer</th>
                        <th scope="col">Location</th>
                        <th scope="col">Seniority</th>
                        <th scope="col">Skills</th>
                        <th scope="col">Qualifications</th>
                        <th scope="col">Status</th>
                        <th scope="col">In bank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.drafts.map((draft) => (
                        <tr key={draft.id}>
                          <td>{draft.fullName}</td>
                          <td>{draft.searchName}</td>
                          <td>{draft.title}</td>
                          <td>{draft.employer}</td>
                          <td>{draft.locationLabel}</td>
                          <td>{draft.seniority}</td>
                          <td>{draft.skills.join('; ')}</td>
                          <td>{draft.qualifications.join('; ')}</td>
                          <td>{statusLabel(draft.status)}</td>
                          <td>{existingIds.has(draft.id) ? 'update' : 'new'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="bank-drop-foot">
                To store them in the bank: download the normalised CSV (or copy the JSON) and run{' '}
                <code>npm run bank:import -- &lt;file&gt;</code>. The importer files every candidate under its search,
                creates any search the bank does not have yet, and updates rather than duplicates anyone already
                stored.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export function SearchBankPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const query = searchParams.get('q') ?? ''
  const selections = useMemo(() => readSelections(searchParams, searchBankFacetDefs), [searchParams])

  const commit = useCallback((next: FacetSelections, nextQuery: string) => {
    setSearchParams((prev) => {
      const written = writeSelections(prev, next)
      if (nextQuery.trim()) written.set('q', nextQuery)
      else written.delete('q')
      return written
    }, { replace: true })
    setPage(0)
  }, [setSearchParams])

  const onToggle = useCallback((key: string, value: string) => {
    commit(toggleValue(selections, key, value), query)
  }, [commit, selections, query])

  const setQuery = (value: string) => commit(selections, value)

  const clearAll = () => {
    const cleared: FacetSelections = {}
    for (const def of searchBankFacetDefs) cleared[def.key] = []
    commit(cleared, '')
  }

  const filterInput = useMemo(
    () => ({
      records: bankCandidates,
      defs: searchBankFacetDefs,
      selections,
      query,
      textMatcher: searchBankTextMatcher,
    }),
    [selections, query],
  )
  const results = useMemo(() => filterByFacets(filterInput).sort(compareCandidates), [filterInput])
  const optionsFor = useCallback((def: typeof searchBankFacetDefs[number]) => buildFacetOptions(filterInput, def), [filterInput])

  const universe: BankUniverse = useMemo(() => bankUniverse(), [])
  const activeCount = activeFilterCount(selections)
  const hasFilters = activeCount > 0 || Boolean(query)

  const activeChips = searchBankFacetDefs.flatMap((def) =>
    (selections[def.key] ?? []).map((value) => ({ key: def.key, value, group: FACET_LABELS[def.key] })),
  )

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = results.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  /** Candidates on this page, grouped under their search so the bank never reads as one flat list. */
  const pageGroups = useMemo(() => {
    const groups: { searchId: string; candidates: BankCandidate[] }[] = []
    for (const candidate of pageItems) {
      const current = groups[groups.length - 1]
      if (current && current.searchId === candidate.searchId) current.candidates.push(candidate)
      else groups.push({ searchId: candidate.searchId, candidates: [candidate] })
    }
    return groups
  }, [pageItems])

  const searchMeta = useMemo(() => {
    const meta = new Map<string, { name: string; client: string; role: string; status: string; openedOn: string }>()
    for (const search of bankSearches) {
      meta.set(search.id, { name: search.name, client: search.client, role: search.role, status: search.status, openedOn: search.openedOn })
    }
    return meta
  }, [])

  /** Searches with nothing dropped into them yet. Only shown on the unfiltered bank. */
  const emptyGroups = useMemo(() => {
    if (hasFilters) return []
    const filled = new Set(bankCandidates.map((candidate) => candidate.searchId))
    return bankSearches.filter((search) => !filled.has(search.id))
  }, [hasFilters])

  const resultSearchCount = useMemo(
    () => new Set(results.map((candidate) => candidate.searchId)).size,
    [results],
  )

  const nameLookup = useMemo(() => searchNameLookup(bankSearches), [])

  const downloadResults = () => {
    const csv = candidatesToCsv(results, (id) => nameLookup(id))
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'search-bank-export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Focus enters the panel, Tab stays inside it, Escape closes, focus returns to the trigger.
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const drawerRef = useDialogLayer<HTMLDivElement>(drawerOpen, closeDrawer)

  useEffect(() => {
    document.title = 'Candidate Search Bank'
  }, [])

  // Private recruiter workspace: keep it out of search indexes while mounted.
  useNoIndex()

  const emptyBank = universe.candidates === 0

  return (
    <main className="page">
      <div className="container">
      <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Search bank' }]} />
      <header className="hack-hero bank-hero">
        <p className="hack-kicker">Recruiter workspace · Private search bank</p>
        <h1>Candidate search bank</h1>
        <p className="hack-lede">
          Every candidate you drop in is stored the same way and filed under the search it belongs to, so the bank
          stays retrievable instead of turning into a pile. Each record is labelled with its search, title, employer,
          location, seniority, skills, qualifications, availability, rating and pipeline status.
        </p>
        <div className="hack-kpis">
          <div className="hack-kpi"><strong>{universe.searches}</strong><span>Searches</span></div>
          <div className="hack-kpi"><strong>{universe.candidates}</strong><span>Candidates</span></div>
          <div className="hack-kpi"><strong>{universe.inPipeline}</strong><span>In pipeline</span></div>
          <div className="hack-kpi"><strong>{universe.shortlisted}</strong><span>Shortlisted</span></div>
          <div className="hack-kpi"><strong>{universe.submitted}</strong><span>Submitted</span></div>
          <div className="hack-kpi"><strong>{universe.placed}</strong><span>Placed</span></div>
          <div className="hack-kpi"><strong>{universe.provinces}</strong><span>Provinces</span></div>
        </div>
      </header>

      <DropPanel searches={bankSearches} candidates={bankCandidates} />

      {emptyBank ? (
        <EmptyState
          title="No candidates in the bank yet"
          description="Use the drop panel above to normalise a candidate list, then run npm run bank:import -- <file> to store it. Every candidate lands under its search, and each search becomes a group you can retrieve by title, skill, qualification, location, status or rating."
        />
      ) : (
        <>
          <div className="facet-searchbar">
            <div className="hack-control hack-control-search facet-searchbar-input">
              <MagnifyingGlass size={15} aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, title, employer, skill, qualification, notes…"
                aria-label="Search the bank"
              />
            </div>
            <button
              type="button"
              className="facet-filter-trigger"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-haspopup="dialog"
            >
              <SlidersHorizontal size={15} aria-hidden /> Filters{activeCount ? ` (${activeCount})` : ''}
            </button>
            <button type="button" className="bank-export" onClick={downloadResults}>
              <DownloadSimple size={15} aria-hidden /> Export {results.length} as CSV
            </button>
          </div>

          {(activeChips.length > 0 || query) && (
            <div className="facet-active" aria-label="Active filters">
              {query && (
                <button type="button" className="facet-chip" onClick={() => setQuery('')} aria-label={`Remove search: ${query}`}>
                  <span>“{query}”</span> <X size={13} aria-hidden />
                </button>
              )}
              {activeChips.map((chip) => (
                <button
                  key={`${chip.key}:${chip.value}`}
                  type="button"
                  className="facet-chip"
                  onClick={() => onToggle(chip.key, chip.value)}
                  aria-label={`Remove ${chip.group} filter: ${chip.value}`}
                >
                  <span className="facet-chip-group">{chip.group}:</span> <span>{chip.value}</span> <X size={13} aria-hidden />
                </button>
              ))}
              <button type="button" className="facet-clear" onClick={clearAll}>Clear all</button>
            </div>
          )}

          <div className="facet-layout">
            <aside className="facet-sidebar" aria-label="Filters">
              <FacetPanel defs={searchBankFacetDefs} selections={selections} optionsFor={optionsFor} onToggle={onToggle} idPrefix="bank-side" />
            </aside>

            <div className="facet-results">
              <p className="hack-results-count">
                {results.length} candidate{results.length === 1 ? '' : 's'} in {resultSearchCount} search
                {resultSearchCount === 1 ? '' : 'es'}
                {hasFilters ? ' match the current filters' : 'ing the bank'}
              </p>

              {pageItems.length === 0 ? (
                <div className="facet-zero">
                  <EmptyState
                    title="No candidates match these filters"
                    description={activeChips.length
                      ? `Active filters: ${activeChips.map((chip) => `${chip.group}: ${chip.value}`).join('; ')}${query ? `; search “${query}”` : ''}. Remove a filter to widen the results.`
                      : 'Try a different search term.'}
                  />
                  {hasFilters && (
                    <button type="button" className="facet-drawer-apply" onClick={clearAll}>Clear all filters</button>
                  )}
                </div>
              ) : (
                <div className="bank-results">
                  {pageGroups.map((group) => {
                    const meta = searchMeta.get(group.searchId)
                    return (
                      <section key={group.searchId} className="bank-group" aria-label={meta?.name ?? group.searchId}>
                        <GroupHeader
                          name={meta?.name ?? nameLookup(group.searchId)}
                          client={meta?.client ?? ''}
                          role={meta?.role ?? ''}
                          status={meta?.status ?? 'active'}
                          openedOn={meta?.openedOn ?? ''}
                          count={group.candidates.length}
                        />
                        <TargetCompanies searchId={group.searchId} />
                        <div className="hack-candidate-grid">
                          {group.candidates.map((candidate) => (
                            <CandidateCard
                              key={candidate.id}
                              candidate={candidate}
                              onToggle={onToggle}
                              searchLabel={nameLookup(candidate.searchId)}
                            />
                          ))}
                        </div>
                      </section>
                    )
                  })}
                  {emptyGroups.map((search) => (
                    <section key={search.id} className="bank-group bank-group-empty" aria-label={search.name}>
                      <GroupHeader
                        name={search.name}
                        client={search.client}
                        role={search.role}
                        status={search.status}
                        openedOn={search.openedOn}
                        count={0}
                      />
                      <TargetCompanies searchId={search.id} />
                      <p className="bank-group-empty-note">No candidates dropped into this search yet.</p>
                    </section>
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
            </div>
          </div>

          {drawerOpen && (
            <div className="facet-drawer-root">
              <div className="facet-drawer-backdrop" onClick={closeDrawer} aria-hidden="true" />
              <div className="facet-drawer" role="dialog" aria-modal="true" aria-label="Filters" tabIndex={-1} ref={drawerRef}>
                <div className="facet-drawer-head">
                  <h2 className="facet-heading">Filters{activeCount ? ` (${activeCount})` : ''}</h2>
                  <button type="button" className="facet-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                    <X size={18} aria-hidden />
                  </button>
                </div>
                <div className="facet-drawer-body">
                  <FacetPanel defs={searchBankFacetDefs} selections={selections} optionsFor={optionsFor} onToggle={onToggle} idPrefix="bank-drawer" />
                </div>
                <div className="facet-drawer-foot">
                  {hasFilters && <button type="button" className="facet-clear" onClick={clearAll}>Clear all</button>}
                  <button type="button" className="facet-drawer-apply" onClick={() => setDrawerOpen(false)}>
                    Show {results.length} result{results.length === 1 ? '' : 's'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <footer className="hack-page-foot">
        <p>
          Stored in <code>markets/search-bank/bank.json</code> and generated by <code>npm run bank:import</code> from
          the files you drop in: every drop is kept under <code>markets/search-bank/drops/</code> so the bank can
          always be audited. The bank holds personal contact details and recruiter notes: keep it behind the project's
          private access boundary and never publish a client's search list.
        </p>
      </footer>
          </div>
    </main>
  )
}
