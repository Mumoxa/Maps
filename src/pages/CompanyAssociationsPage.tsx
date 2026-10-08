import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowSquareOut, Download, FloppyDisk, SlidersHorizontal, Users } from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Drawer } from '../components/ui/Drawer'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { useDialogLayer } from '../hooks/useDialogLayer'
import { useWorkspace, useSelection, useOverrides } from '../hooks/useWorkspace'
import { buildCompanyIntelligence } from '../data/organizations/universe'
import { discoverAssociations, filterMatches, organizationOrStub } from '../data/organizations/discovery'
import { FACTUAL_CONTEXT, NO_ROLE_CONTEXT, roleContextById, roleContexts } from '../data/organizations/roleContexts'
import { coverageByIndustry, universeStats } from '../data/organizations/analysis'
import { discoverTargets, exportTargetsCsv } from '../data/organizations/query'
import { dynamicPoolDefinition, saveSelectionToPool, targetDropPayload } from '../data/organizations/workspace'
import { bankSearches } from '../data/searchBank/bank'
import { ExplorerFilters, TIER_LABELS } from '../components/associations/ExplorerFilters'
import { AssociationGraph } from '../components/associations/AssociationGraph'
import { PocketView } from '../components/associations/PocketView'
import { CompanyTable } from '../components/associations/CompanyTable'
import { CompanyInspector } from '../components/associations/CompanyInspector'
import { ComparePanel } from '../components/associations/ComparePanel'
import { EMPTY_FILTERS, type AssociationFilters, type AssociationMatch, type AssociationTier } from '../data/organizations/types'

type ViewMode = 'network' | 'pockets' | 'table'

const VIEW_LABELS: Record<ViewMode, string> = {
  network: 'Network',
  pockets: 'Industry pockets',
  table: 'Company table',
}

const FILTER_KEYS: (keyof AssociationFilters)[] = [
  'pockets', 'industries', 'capabilities', 'provinces', 'scale', 'confidence', 'tiers', 'relationshipTypes', 'status',
]

function readFilters(params: URLSearchParams): AssociationFilters {
  const listFilters = Object.fromEntries(FILTER_KEYS.map((key) => {
    const raw = params.get(key)
    return [key, raw ? raw.split(',').map((value) => value.trim()).filter(Boolean) : []]
  })) as Record<string, string[]>
  const people = params.get('people')
  return {
    ...EMPTY_FILTERS,
    ...listFilters,
    query: params.get('q') ?? '',
    hasMappedProfessionals: people === 'yes' || people === 'no' ? people : 'any',
  } as AssociationFilters
}

function writeFilters(params: URLSearchParams, filters: AssociationFilters): URLSearchParams {
  const next = new URLSearchParams(params)
  for (const key of FILTER_KEYS) {
    const values = filters[key] as string[]
    if (values.length > 0) next.set(key, values.join(','))
    else next.delete(key)
  }
  if (filters.query.trim()) next.set('q', filters.query)
  else next.delete('q')
  if (filters.hasMappedProfessionals !== 'any') next.set('people', filters.hasMappedProfessionals)
  else next.delete('people')
  return next
}

function download(filename: string, contents: string, mime: string): void {
  const blob = new Blob([contents], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function CompanyAssociationsPage() {
  useEffect(() => { document.title = 'SA Talent Map | Company Associations' }, [])

  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareRight, setCompareRight] = useState<string | null>(null)
  const [chosenPockets, setChosenPockets] = useState<string[] | null>(null)
  const [poolForm, setPoolForm] = useState({ name: '', classification: 'Industry pocket', kind: 'snapshot' as 'snapshot' | 'dynamic' })
  const [poolNotice, setPoolNotice] = useState('')
  const [dropSearch, setDropSearch] = useState('')

  const workspace = useWorkspace()
  const { selected, toggle: toggleSelection, clear: clearSelection } = useSelection()

  const intelligence = useMemo(() => buildCompanyIntelligence(), [])
  const { index, extraOrganizations, all } = intelligence
  const stats = useMemo(() => universeStats(index), [index])
  const coverage = useMemo(() => coverageByIndustry(index), [index])

  const orgParam = searchParams.get('org') ?? ''
  const focalId = orgParam && index.byId.has(orgParam) ? orgParam : 'org-ccs-logistics'
  const roleParam = searchParams.get('role') ?? ''
  const roleContext = roleParam === NO_ROLE_CONTEXT
    ? FACTUAL_CONTEXT
    : roleContextById(roleParam) ?? roleContextById('role-cold-storage-financial-manager')!
  const view = (searchParams.get('view') as ViewMode | null) ?? 'network'
  const inspectId = searchParams.get('inspect')
  const filters = useMemo(() => readFilters(searchParams), [searchParams])
  const overrides = useOverrides(roleContext.id)

  const focal = index.byId.get(focalId)
  const contexts = useMemo(() => roleContexts(), [])

  const discovery = useMemo(() => discoverAssociations({ index, focalId, roleContext, extraOrganizations }), [
    index, focalId, roleContext, extraOrganizations,
  ])

  // One filtered result set feeds every view, so the three can never disagree.
  const filtered = useMemo(() => filterMatches(discovery.matches, index, filters), [discovery.matches, index, filters])
  const filteredPockets = useMemo(() => discovery.pockets
    .map((pocket) => ({ ...pocket, matches: filterMatches(pocket.matches, index, filters) }))
    .filter((pocket) => pocket.matches.length > 0), [discovery.pockets, index, filters])

  /**
   * The network view opens with its strongest pocket already expanded. A
   * recruiter who lands on the graph must be able to reach a real company
   * without first working out which pocket to open, so a graph of nothing but
   * collapsed sectors is never the default. `chosenPockets` stays null until
   * the recruiter changes it, which keeps this a default rather than a lock.
   */
  const defaultPocketId = useMemo(() => discovery.pockets.reduce<{ id: string; strong: number } | null>(
    (best, pocket) => {
      const strong = pocket.matches.filter((match) => match.tier <= 2).length
      return !best || strong > best.strong ? { id: pocket.pocket.id, strong } : best
    }, null,
  )?.id ?? null, [discovery.pockets])
  const expandedPockets = chosenPockets ?? (defaultPocketId ? [defaultPocketId] : [])
  const setExpandedPockets = useCallback((next: string[] | ((current: string[]) => string[])) => {
    setChosenPockets(typeof next === 'function' ? next(expandedPockets) : next)
  }, [expandedPockets])

  const matchById = useMemo(() => {
    const map = new Map<string, AssociationMatch>()
    for (const match of discovery.matches) map.set(match.organizationId, match)
    return map
  }, [discovery.matches])

  // Curated records and dataset-derived companies are both inspectable; only an
  // identifier that resolves to no company at all is rejected.
  const inspectorId = inspectId && (index.byId.has(inspectId) || index.employersByOrg.has(inspectId))
    ? inspectId
    : null
  const inspectorMatch = inspectorId ? matchById.get(inspectorId) ?? null : null

  const setParams = useCallback((mutate: (params: URLSearchParams) => URLSearchParams) => {
    setSearchParams((previous) => mutate(new URLSearchParams(previous)), { replace: true })
  }, [setSearchParams])

  const openCompany = useCallback((organizationId: string) => {
    setParams((params) => { params.set('inspect', organizationId); return params })
    setInspectorOpen(true)
  }, [setParams])

  const recenter = useCallback((organizationId: string) => {
    setParams((params) => { params.set('org', organizationId); params.delete('inspect'); return params })
    setExpandedPockets([])
    setInspectorOpen(false)
  }, [setParams])

  const closeInspector = useCallback(() => setInspectorOpen(false), [])
  const closeCompare = useCallback(() => setCompareOpen(false), [])
  const inspectorLayer = useDialogLayer<HTMLDivElement>(inspectorOpen, closeInspector)
  const compareLayer = useDialogLayer<HTMLDivElement>(compareOpen, closeCompare)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const filtersLayer = useDialogLayer<HTMLDivElement>(filtersOpen, closeFilters)

  const companyOptions = useMemo(() => all.map((organization) => organization.name).sort(), [all])
  const companyIdsByName = useMemo(() => {
    const map = new Map<string, string>()
    for (const organization of all) map.set(organization.name.toLowerCase(), organization.id)
    return map
  }, [all])

  const exportCsv = useCallback(() => {
    const payload = discoverTargets({
      index,
      focalId,
      roleContext,
      filters,
      extraOrganizations,
      page: 1,
      pageSize: Math.max(1, filtered.length),
    })
    download(
      `company-associations-${focalId}-${roleContext.id}.csv`,
      exportTargetsCsv(payload),
      'text/csv;charset=utf-8',
    )
  }, [index, focalId, roleContext, filters, extraOrganizations, filtered.length])

  const toggleSelectMatch = useCallback((match: AssociationMatch) => {
    toggleSelection(match.organizationId, match.rules.map((rule) => rule.label).join('; '), match.tier)
  }, [toggleSelection])

  const toggleSelectMany = useCallback((matches: AssociationMatch[], nextSelected: boolean) => {
    for (const match of matches) {
      if (nextSelected !== selected.has(match.organizationId)) toggleSelectMatch(match)
    }
  }, [selected, toggleSelectMatch])

  const savePool = useCallback(() => {
    const name = poolForm.name.trim()
    if (name.length === 0 || workspace.selection.length === 0) return
    const pool = saveSelectionToPool(
      name,
      poolForm.classification,
      'Talent Tree',
      poolForm.kind,
      dynamicPoolDefinition(filters, focalId, roleContext.id),
    )
    if (pool) {
      setPoolNotice(`Saved "${pool.name}" with ${pool.entries.length} companies (${pool.kind}). Stored in this browser only.`)
      setPoolForm({ name: '', classification: poolForm.classification, kind: poolForm.kind })
    }
  }, [poolForm, workspace.selection.length, filters, focalId, roleContext.id])

  const exportPoolDrop = useCallback((poolId: string) => {
    const pool = workspace.pools.find((entry) => entry.id === poolId)
    if (!pool) return

    // Take every company's record from the export contract, so the drop carries
    // exactly what a reviewer sees: reasons, missing evidence, evidence state.
    const payload = discoverTargets({
      index,
      focalId,
      roleContext,
      filters,
      extraOrganizations,
      page: 1,
      pageSize: Math.max(1, discovery.matches.length),
    })
    const contexts = new Map(payload.targetCompanies.map((row) => [row.organizationId, {
      name: row.name,
      legalName: row.legalName,
      pocket: row.pocket,
      tierLabel: row.tierLabel,
      mappedProfessionals: row.mappedProfessionals,
      evidenceState: row.evidenceState,
      missingEvidence: row.missingEvidence,
    }]))
    const searchName = dropSearch.trim()
      || (roleContext.clientId ? `${roleContext.clientName} · ${roleContext.role}` : roleContext.role)
    const drop = targetDropPayload(pool, contexts, searchName, roleContext.clientName, roleContext.role)
    download(
      `${pool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-targets.json`,
      JSON.stringify(drop, null, 2),
      'application/json',
    )
    setPoolNotice(
      `Drop file written for "${pool.name}" (${pool.entries.length} companies, filed under "${searchName}"). `
      + 'Store it in the bank with: npm run bank:import -- <file> --targets',
    )
  }, [workspace.pools, index, focalId, roleContext, filters, extraOrganizations, discovery.matches.length, dropSearch])

  const tierCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<AssociationTier, number>
    for (const match of filtered) counts[match.tier] += 1
    return counts
  }, [filtered])

  if (!focal) {
    return <EmptyState title="Company not found" description="That company is not in the canonical register." action={{ label: 'Back to companies', to: '/companies' }} />
  }

  return (
    <ErrorBoundary>
      <main className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Companies', to: '/companies' }, { label: 'Company associations' }]} />

          <header className="page-head">
            <div>
              <h1>Company associations</h1>
              <p>
                Pick any mapped South African company, choose a recruitment context, and see which other operating
                environments could employ people with transferable experience. Every suggestion shows the evidence
                behind it, and company facts never change with the role.
              </p>
            </div>
            <div className="page-head-aside">
              <span className="page-head-meta"><b>{stats.organizations}</b> companies in the register</span>
              <span className="page-head-meta"><b>{stats.mappedProfessionals}</b> mapped professionals</span>
              <span className="page-head-meta"><b>{stats.pendingVerification}</b> pending verification</span>
              <span className="page-head-meta">Last research {stats.lastResearchDate || 'not recorded'}</span>
            </div>
          </header>

          <section className="assoc-context" aria-labelledby="assoc-context-heading">
            <h2 id="assoc-context-heading" className="visually-hidden">Exploration context</h2>

            <label className="assoc-context-field">
              <span>Focal company</span>
              <input
                list="assoc-company-options"
                value={focal.name}
                onChange={(event) => {
                  const id = companyIdsByName.get(event.target.value.trim().toLowerCase())
                  if (id) setParams((params) => { params.set('org', id); params.delete('inspect'); return params })
                }}
                placeholder="Search the company register"
              />
              <datalist id="assoc-company-options">
                {companyOptions.map((name) => <option key={name} value={name} />)}
              </datalist>
            </label>

            <label className="assoc-context-field">
              <span>Recruitment context</span>
              <select
                className="filter-select"
                value={roleContext.id === FACTUAL_CONTEXT.id ? NO_ROLE_CONTEXT : roleContext.id}
                onChange={(event) => setParams((params) => { params.set('role', event.target.value); return params })}
              >
                <option value={NO_ROLE_CONTEXT}>No role context: factual relationships only</option>
                <optgroup label="Live assignments">
                  {contexts.filter((entry) => entry.origin === 'search-bank').map((entry) => (
                    <option key={entry.id} value={entry.id}>{entry.clientName} · {entry.role}</option>
                  ))}
                </optgroup>
                <optgroup label="Role families">
                  {contexts.filter((entry) => entry.origin === 'role-family').map((entry) => (
                    <option key={entry.id} value={entry.id}>{entry.role}</option>
                  ))}
                </optgroup>
              </select>
            </label>

            <div className="assoc-viewswitch" role="group" aria-label="Presentation mode">
              {(Object.keys(VIEW_LABELS) as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`btn btn-sm ${view === mode ? 'btn-primary' : 'btn-ghost'}`}
                  aria-pressed={view === mode}
                  onClick={() => setParams((params) => { params.set('view', mode); return params })}
                >
                  {VIEW_LABELS[mode]}
                </button>
              ))}
            </div>

            <button type="button" className="facet-filter-trigger" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen} aria-haspopup="dialog">
              <SlidersHorizontal size={15} aria-hidden /> Filters
            </button>
          </section>

          <section className="assoc-brief" aria-labelledby="assoc-brief-heading">
            <h2 id="assoc-brief-heading" className="assoc-brief-title">Brief: {roleContext.clientName} · {roleContext.role}</h2>
            <p className="assoc-brief-text">{roleContext.brief}</p>
            {roleContext.mandatoryCapabilities.length > 0 && (
              <p className="assoc-brief-line">
                <strong>Mandatory operational exposure:</strong> {roleContext.mandatoryCapabilities.map((id) => index.capabilityById.get(id)?.name ?? id).join(', ')}
              </p>
            )}
            {roleContext.priorities.length > 0 && (
              <ul className="assoc-brief-list">
                {roleContext.priorities.map((priority) => <li key={priority}>{priority}</li>)}
              </ul>
            )}
            {roleContext.exclusions.map((exclusion) => (
              <p key={exclusion} className="assoc-brief-exclusion">{exclusion}</p>
            ))}
          </section>

          <div className="assoc-layout">
            <aside className="facet-sidebar assoc-sidebar" aria-label="Association filters">
              <h2 className="facet-heading">Filters</h2>
              <ExplorerFilters
                matches={discovery.matches}
                filters={filters}
                index={index}
                idPrefix="assoc-side"
                onChange={(next) => setParams((params) => writeFilters(params, next))}
              />
              <h2 className="facet-heading">Coverage</h2>
              <p className="assoc-coverage-note">
                Mapped coverage only. This is not a claim that every South African company in a sector has been identified.
              </p>
              <ul className="assoc-coverage-list">
                {coverage.slice(0, 8).map((entry) => (
                  <li key={entry.industryId}>
                    <span>{entry.industryName}</span>
                    <span className="assoc-coverage-counts">
                      {entry.organizations} mapped · {entry.withMappedProfessionals} with people
                    </span>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="assoc-main" aria-label="Association views">
              <div className="assoc-summary">
                <span><b>{filtered.length}</b> of {discovery.matches.length} matched companies in view</span>
                <span>Scanned {discovery.coverage.organizationsScanned} companies</span>
                {([1, 2, 3, 4, 5] as AssociationTier[]).map((tier) => (
                  <span key={tier} className={`assoc-tier assoc-tier-${tier}`}>
                    {tierCounts[tier]} × tier {tier}
                  </span>
                ))}
              </div>

              {view === 'network' && (
                <>
                  <div className="assoc-graph-controls">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setExpandedPockets((current) => (
                        current.length > 0 ? [] : [...new Set(filtered.map((match) => match.pocketId))]
                      ))}
                    >
                      {expandedPockets.length > 0 ? 'Collapse all pockets' : 'Expand all pockets'}
                    </button>
                    <span className="assoc-graph-hint">Pockets are collapsed by default so the network stays readable.</span>
                  </div>
                  <AssociationGraph
                    index={index}
                    focal={focal}
                    matches={filtered}
                    expandedPockets={expandedPockets}
                    onTogglePocket={(pocketId) => setExpandedPockets((current) => (
                      current.includes(pocketId) ? current.filter((entry) => entry !== pocketId) : [...current, pocketId]
                    ))}
                    onOpenCompany={openCompany}
                    selectedOrganizationId={inspectorId}
                    selectedIds={selected}
                  />
                </>
              )}

              {view === 'pockets' && (
                <PocketView
                  index={index}
                  pockets={filteredPockets}
                  selectedIds={selected}
                  onOpenCompany={openCompany}
                  onToggleSelect={toggleSelectMatch}
                />
              )}

              {view === 'table' && (
                <CompanyTable
                  index={index}
                  matches={filtered}
                  selectedIds={selected}
                  onOpenCompany={openCompany}
                  onToggleSelect={toggleSelectMatch}
                  onToggleSelectMany={toggleSelectMany}
                  onExport={exportCsv}
                />
              )}

              {filtered.length === 0 && (
                <EmptyState
                  title="No associated companies match these filters"
                  description="Widen the filters, or clear them to see the full associated universe for this company and role context."
                />
              )}
            </section>

            <aside className="assoc-inspector" aria-label="Company intelligence inspector">
              {inspectorId ? (
                <CompanyInspector
                  index={index}
                  organizationId={inspectorId}
                  match={inspectorMatch}
                  roleContext={roleContext}
                  focalName={focal.name}
                  selected={selected.has(inspectorId)}
                  onToggleSelect={() => {
                    const match = matchById.get(inspectorId)
                    if (match) toggleSelectMatch(match)
                  }}
                  onCompare={() => { setCompareRight(null); setCompareOpen(true) }}
                  onRecenter={() => recenter(inspectorId)}
                  onOverride={(tier, reason) => overrides.set(inspectorId, tier, reason, 'Talent Tree')}
                  override={overrides.forOrganization(inspectorId)}
                />
              ) : (
                <div className="assoc-inspector-empty">
                  <h2>Company inspector</h2>
                  <p>Select a company in any view to see its verified record, why it appears for this role, its evidence, and the professionals Maps already knows there.</p>
                </div>
              )}
            </aside>
          </div>

          <section className="assoc-poolbar" aria-labelledby="assoc-pool-heading">
            <h2 id="assoc-pool-heading">Target pool</h2>
            <p className="assoc-pool-note">
              {workspace.selection.length} company{workspace.selection.length === 1 ? '' : 'ies'} selected
              {' · '}stored in this browser only, not on a shared server.
            </p>
            {workspace.selection.length > 0 && (
              <ul className="assoc-pool-selection">
                {workspace.selection.map((entry) => (
                  <li key={entry.organizationId}>
                    <button type="button" className="assoc-link-button" onClick={() => openCompany(entry.organizationId)}>
                      {index.byId.get(entry.organizationId)?.name ?? entry.organizationId}
                    </button>
                    {entry.tier !== null && <span className={`assoc-tier assoc-tier-${entry.tier}`}>{TIER_LABELS[String(entry.tier)]}</span>}
                  </li>
                ))}
              </ul>
            )}
            <div className="assoc-pool-actions">
              <label className="assoc-pool-field">
                <span>Pool name</span>
                <input
                  type="text"
                  value={poolForm.name}
                  onChange={(event) => setPoolForm((form) => ({ ...form, name: event.target.value }))}
                  placeholder="e.g. Western Cape cold chain finance sources"
                />
              </label>
              <label className="assoc-pool-field">
                <span>Search Bank assignment</span>
                <input
                  list="assoc-bank-searches"
                  value={dropSearch}
                  onChange={(event) => setDropSearch(event.target.value)}
                  placeholder={roleContext.clientId ? `${roleContext.clientName} · ${roleContext.role}` : roleContext.role}
                />
                <datalist id="assoc-bank-searches">
                  {bankSearches.map((search) => <option key={search.id} value={search.name} />)}
                </datalist>
              </label>
              <label className="assoc-pool-field">
                <span>Classification</span>
                <select className="filter-select" value={poolForm.classification} onChange={(event) => setPoolForm((form) => ({ ...form, classification: event.target.value }))}>
                  <option value="Industry pocket">Industry pocket</option>
                  <option value="Role sourcing list">Role sourcing list</option>
                  <option value="Client preference">Client preference</option>
                  <option value="Research backlog">Research backlog</option>
                </select>
              </label>
              <label className="assoc-pool-field">
                <span>Type</span>
                <select className="filter-select" value={poolForm.kind} onChange={(event) => setPoolForm((form) => ({ ...form, kind: event.target.value as 'snapshot' | 'dynamic' }))}>
                  <option value="snapshot">Snapshot: fixed membership</option>
                  <option value="dynamic">Dynamic: re-derives from these filters</option>
                </select>
              </label>
              <button type="button" className="btn btn-primary btn-sm" onClick={savePool} disabled={workspace.selection.length === 0 || poolForm.name.trim().length === 0}>
                <FloppyDisk size={13} aria-hidden /> Save pool
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={clearSelection} disabled={workspace.selection.length === 0}>
                Clear selection
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={exportCsv}>
                <Download size={13} aria-hidden /> Export filtered CSV
              </button>
            </div>
            {poolNotice && <p className="callout">{poolNotice}</p>}

            {workspace.pools.length > 0 && (
              <ul className="assoc-pool-list">
                {workspace.pools.map((pool) => (
                  <li key={pool.id}>
                    <strong>{pool.name}</strong>
                    <span className="assoc-pool-meta">
                      {pool.kind === 'dynamic' ? 'Dynamic pool' : 'Snapshot'} · {pool.classification} · {pool.entries.length} companies · created {pool.createdOn} · reused {pool.reuseCount} time{pool.reuseCount === 1 ? '' : 's'}
                    </span>
                    <span className="assoc-pool-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportPoolDrop(pool.id)}>
                        <Users size={13} aria-hidden /> Search Bank drop
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="assoc-footer-note" aria-labelledby="assoc-method-heading">
            <h2 id="assoc-method-heading">How relevance is decided</h2>
            <p>
              Relevance is a transparent, rule-based tier, not a percentage: tier 1 needs the role's mandatory exposure
              evidenced, or the same industry plus a shared operating process; tier 2 is a strong adjacent environment;
              tier 3 shares operating or financial processes; tier 4 is partial or contextual overlap; tier 5 is weak for
              this brief. Missing evidence is listed as missing research, never rendered as a confirmed absence, and a
              company-level similarity is never treated as proof that an individual can do the job.
            </p>
            <a href="/search-bank">Open the Search Bank to attach these targets to an assignment <ArrowSquareOut size={12} aria-hidden /></a>
          </section>
        </div>
      </main>

      {/* Mobile and tablet: filters and inspector move into dialogs. */}
      <div className="assoc-drawer-host" ref={filtersLayer} hidden={!filtersOpen}>
        {filtersOpen && (
          <div className="facet-drawer" role="dialog" aria-modal="true" aria-label="Association filters">
            <div className="facet-drawer-head">
              <h2 className="facet-heading">Filters</h2>
              <button type="button" className="facet-drawer-close" onClick={closeFilters} aria-label="Close filters">Close</button>
            </div>
            <div className="facet-drawer-body">
              <ExplorerFilters
                matches={discovery.matches}
                filters={filters}
                index={index}
                idPrefix="assoc-drawer"
                onChange={(next) => setParams((params) => writeFilters(params, next))}
              />
            </div>
            <div className="facet-drawer-foot">
              <button type="button" className="btn btn-primary facet-drawer-apply" onClick={closeFilters}>Show results</button>
            </div>
          </div>
        )}
      </div>

      {inspectorOpen && inspectorId && (
        <Drawer isOpen={inspectorOpen} onClose={closeInspector} title={organizationOrStub(index, inspectorId).name} subtitle="Company intelligence">
          <div ref={inspectorLayer}>
            <CompanyInspector
              index={index}
              organizationId={inspectorId}
              match={inspectorMatch}
              roleContext={roleContext}
              focalName={focal.name}
              selected={selected.has(inspectorId)}
              onToggleSelect={() => {
                const match = matchById.get(inspectorId)
                if (match) toggleSelectMatch(match)
              }}
              onCompare={() => { setCompareRight(null); setCompareOpen(true) }}
              onRecenter={() => recenter(inspectorId)}
              onOverride={(tier, reason) => overrides.set(inspectorId, tier, reason, 'Talent Tree')}
              override={overrides.forOrganization(inspectorId)}
            />
          </div>
        </Drawer>
      )}

      {compareOpen && inspectorId && (
        <Drawer isOpen={compareOpen} onClose={closeCompare} title="Compare companies" subtitle="Shared, distinct and unknown characteristics">
          <div ref={compareLayer}>
            <ComparePanel
              index={index}
              leftId={inspectorId}
              rightId={compareRight}
              roleContext={roleContext.id === FACTUAL_CONTEXT.id ? null : roleContext}
              onRightChange={setCompareRight}
            />
          </div>
        </Drawer>
      )}
    </ErrorBoundary>
  )
}
