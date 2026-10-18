import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowSquareOut, Download, FloppyDisk, SlidersHorizontal, Users, X } from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Drawer } from '../components/ui/Drawer'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { useDialogLayer } from '../hooks/useDialogLayer'
import { useWorkspace, useSelection, useOverrides } from '../hooks/useWorkspace'
import { useCompanyUniverse } from '../hooks/useCompanyUniverse'
import { discoverAssociations, filterMatches, organizationOrStub } from '../data/organizations/discovery'
import { FACTUAL_CONTEXT, NO_ROLE_CONTEXT, roleContextById, roleContexts } from '../data/organizations/roleContexts'
import { universeStats } from '../data/organizations/analysis'
import { discoverTargets, exportTargetsCsv, readFilters, writeFilters } from '../data/organizations/query'
import {
  focalPoolDefinition,
  industryPoolDefinition,
  saveSelectionToPool,
  targetDropPayload,
} from '../data/organizations/workspace'
import { atlasNodeTitle, isUnclassifiedBranch } from '../data/organizations/atlas'
import { filterCompanyViews, viewsAtNode } from '../data/organizations/universeView'
import { industryAssociations } from '../data/organizations/industryDiscovery'
import { AssociationGroups } from '../components/atlas/AssociationGroups'
import { bankSearches } from '../data/searchBank/bank'
import { ExplorerFilters, TIER_LABELS } from '../components/associations/ExplorerFilters'
import { AssociationGraph } from '../components/associations/AssociationGraph'
import { PocketView } from '../components/associations/PocketView'
import { CompanyTable } from '../components/associations/CompanyTable'
import { CompanyInspector } from '../components/associations/CompanyInspector'
import { ComparePanel } from '../components/associations/ComparePanel'
import { CompanyFilters } from '../components/atlas/CompanyFilters'
import {

  type AssociationMatch,
} from '../data/organizations/types'

type ViewMode = 'groups' | 'network' | 'pockets' | 'table'

const VIEW_LABELS: Record<ViewMode, string> = {
  groups: 'Association groups',
  network: 'Company network',
  pockets: 'Industry pockets',
  table: 'Company table',
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

/**
 * Company associations: optional, evidence-backed relationship exploration.
 *
 * The defect this page used to embody is gone: no organisation is selected
 * unless the reader selects one. `org` / `focus` is read when present - so an
 * explicit deep link still opens a company-centred view - and when it is absent
 * the page explores the industry universe instead. A recruitment brief is
 * likewise optional, and is off by default.
 */
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

  const { index, extraOrganizations, all, atlas, views } = useCompanyUniverse()
  const stats = useMemo(() => universeStats(index), [index])

  // `org` is the legacy parameter; `focus` is the current one. Both are honoured
  // so an old deep link still opens the company it named - but neither has a
  // default value.
  const focusParam = searchParams.get('focus') ?? searchParams.get('org') ?? ''
  const focusId = focusParam && index.byId.has(focusParam) ? focusParam : null
  const focus = focusId ? index.byId.get(focusId) ?? null : null

  const nodeParam = searchParams.get('node') ?? ''
  const nodeId = nodeParam && (atlas.nodes.has(nodeParam) || isUnclassifiedBranch(nodeParam)) ? nodeParam : null

  const roleParam = searchParams.get('role') ?? ''
  // No role context by default. Nothing in this repository names a default
  // assignment any more: relevance is something a recruiter switches on.
  const roleContext = roleParam && roleParam !== NO_ROLE_CONTEXT
    ? roleContextById(roleParam) ?? FACTUAL_CONTEXT
    : FACTUAL_CONTEXT
  const roleActive = roleContext.id !== FACTUAL_CONTEXT.id

  const filters = useMemo(() => readFilters(searchParams), [searchParams])
  const contexts = useMemo(() => roleContexts(), [])
  const overrides = useOverrides(roleContext.id)

  const availableViews = useMemo<ViewMode[]>(
    () => (focusId ? ['network', 'pockets', 'table'] : ['groups', 'table']),
    [focusId],
  )
  const requestedView = searchParams.get('view') as ViewMode | null
  const view: ViewMode = requestedView && availableViews.includes(requestedView)
    ? requestedView
    : availableViews[0]

  const inspectId = searchParams.get('inspect')
  const setParams = useCallback((mutate: (params: URLSearchParams) => URLSearchParams) => {
    setSearchParams((previous) => mutate(new URLSearchParams(previous)), { replace: true })
  }, [setSearchParams])

  // --- Industry-scoped universe (no focal company) --------------------------
  const scoped = useMemo(
    () => (nodeId ? viewsAtNode(views, atlas, index, nodeId) : views),
    [views, atlas, index, nodeId],
  )
  const scopedFiltered = useMemo(
    () => filterCompanyViews(scoped, filters, index),
    [scoped, filters, index],
  )
  const associations = useMemo(
    () => (focusId ? null : industryAssociations(index, scopedFiltered)),
    [index, scopedFiltered, focusId],
  )

  // --- Focal-company discovery (only when the reader named a company) -------
  const discovery = useMemo(
    () => (focusId
      ? discoverAssociations({ index, focalId: focusId, roleContext, extraOrganizations })
      : null),
    [index, focusId, roleContext, extraOrganizations],
  )
  const filtered = useMemo(
    () => (discovery ? filterMatches(discovery.matches, index, filters) : []),
    [discovery, index, filters],
  )
  const filteredPockets = useMemo(
    () => (discovery
      ? discovery.pockets
        .map((pocket) => ({ ...pocket, matches: filterMatches(pocket.matches, index, filters) }))
        .filter((pocket) => pocket.matches.length > 0)
      : []),
    [discovery, index, filters],
  )

  const defaultPocketId = useMemo(() => (discovery
    ? discovery.pockets.reduce<{ id: string; strong: number } | null>(
      (best, pocket) => {
        const strong = pocket.matches.filter((match) => match.tier <= 2).length
        return !best || strong > best.strong ? { id: pocket.pocket.id, strong } : best
      },
      null,
    )?.id ?? null
    : null), [discovery])
  const expandedPockets = chosenPockets ?? (defaultPocketId ? [defaultPocketId] : [])
  const setExpandedPockets = useCallback((next: string[] | ((current: string[]) => string[])) => {
    setChosenPockets(typeof next === 'function' ? next(expandedPockets) : next)
  }, [expandedPockets])

  const matchById = useMemo(() => {
    const map = new Map<string, AssociationMatch>()
    for (const match of discovery?.matches ?? []) map.set(match.organizationId, match)
    return map
  }, [discovery])

  const inspectorId = inspectId && (index.byId.has(inspectId) || index.employersByOrg.has(inspectId))
    ? inspectId
    : null
  const inspectorMatch = inspectorId ? matchById.get(inspectorId) ?? null : null

  const openCompany = useCallback((organizationId: string) => {
    setParams((params) => { params.set('inspect', organizationId); return params })
    setInspectorOpen(true)
  }, [setParams])

  const setFocus = useCallback((organizationId: string) => {
    setParams((params) => {
      params.set('focus', organizationId)
      params.delete('org')
      params.delete('inspect')
      params.delete('view')
      return params
    })
    setExpandedPockets([])
    setInspectorOpen(false)
  }, [setParams, setExpandedPockets])

  const clearFocus = useCallback(() => {
    setParams((params) => {
      params.delete('focus')
      params.delete('org')
      params.delete('inspect')
      params.delete('view')
      return params
    })
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

  const exportRows = focusId ? filtered.length : scopedFiltered.length
  const exportCsv = useCallback(() => {
    if (discovery && focusId) {
      const payload = discoverTargets({
        index,
        focalId: focusId,
        roleContext,
        filters,
        extraOrganizations,
        page: 1,
        pageSize: Math.max(1, filtered.length),
      })
      download(`company-associations-${focusId}-${roleContext.id}.csv`, exportTargetsCsv(payload), 'text/csv;charset=utf-8')
      return
    }
    const header = ['organization_id', 'company', 'taxonomy_path', 'indicative_footprint', 'provinces', 'mapped_professionals', 'status']
    const rows = scopedFiltered.map((view) => [
      view.organizationId,
      view.name,
      view.taxonomyPaths[0] ?? '',
      view.footprint,
      view.provinces.join('; '),
      String(view.mappedProfessionals),
      view.status,
    ].map((cell) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)).join(','))
    download(
      `industry-associations-${nodeId ?? 'all-industries'}.csv`,
      [header.join(','), ...rows].join('\n'),
      'text/csv;charset=utf-8',
    )
  }, [discovery, focusId, index, roleContext, filters, extraOrganizations, filtered.length, scopedFiltered, nodeId])

  const toggleSelectMatch = useCallback((match: AssociationMatch) => {
    toggleSelection(match.organizationId, match.rules.map((rule) => rule.label).join('; '), match.tier)
  }, [toggleSelection])

  const savePool = useCallback(() => {
    const name = poolForm.name.trim()
    if (name.length === 0 || workspace.selection.length === 0) return
    const definition = focusId
      ? focalPoolDefinition(filters, focusId, roleContext.id)
      : industryPoolDefinition(filters, nodeId, roleActive ? roleContext.id : null)
    const pool = saveSelectionToPool(name, poolForm.classification, 'Talent Tree', poolForm.kind, definition)
    if (pool) {
      setPoolNotice(`Saved "${pool.name}" with ${pool.entries.length} companies (${pool.kind}). Stored in this browser only.`)
      setPoolForm({ name: '', classification: poolForm.classification, kind: poolForm.kind })
    }
  }, [poolForm, workspace.selection.length, filters, focusId, roleContext.id, nodeId, roleActive])

  const exportPoolDrop = useCallback((poolId: string) => {
    const pool = workspace.pools.find((entry) => entry.id === poolId)
    if (!pool) return
    const contextsById = new Map(all.map((organization) => [organization.id, {
      name: organization.name,
      legalName: organization.legalName,
      pocket: index.pocketById.get(index.industryById.get(organization.industries[0]?.industryId ?? '')?.pocket ?? '')?.name ?? '',
      tierLabel: '',
      mappedProfessionals: index.employersByOrg.get(organization.id)?.professionals ?? 0,
      evidenceState: organization.status === 'verified' ? 'known-verified' : 'unknown',
      missingEvidence: [] as string[],
    }]))
    const searchName = dropSearch.trim()
      || (roleContext.clientId ? `${roleContext.clientName} · ${roleContext.role}` : roleContext.role)
    const drop = targetDropPayload(pool, contextsById, searchName, roleContext.clientName, roleContext.role)
    download(
      `${pool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-targets.json`,
      JSON.stringify(drop, null, 2),
      'application/json',
    )
    setPoolNotice(`Drop file written for "${pool.name}" (${pool.entries.length} companies, filed under "${searchName}").`)
  }, [workspace.pools, all, index, dropSearch, roleContext])

  return (
    <ErrorBoundary>
      <main className="page">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Industry Atlas', to: '/industry-atlas' },
            ...(nodeId ? [{ label: atlasNodeTitle(atlas, nodeId), to: `/industry-atlas?node=${encodeURIComponent(nodeId)}` }] : []),
            { label: 'Company associations' },
          ]} />

          <header className="page-head">
            <div>
              <h1>Company associations</h1>
              <p>
                Explore evidence-backed relationships across the industry universe - by industry,
                sub-industry, capability, technology, geography, value-chain position or verified
                corporate relationship. A company becomes the centre only when you choose one, and
                that focus is temporary state, never a product default.
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
              <span>Focus company (optional)</span>
              <input
                list="assoc-company-options"
                value={focus?.name ?? ''}
                onChange={(event) => {
                  const id = companyIdsByName.get(event.target.value.trim().toLowerCase())
                  if (id) setFocus(id)
                }}
                placeholder="No company selected — exploring the industry universe"
              />
              <datalist id="assoc-company-options">
                {companyOptions.map((name) => <option key={name} value={name} />)}
              </datalist>
            </label>

            {focus && (
              <button type="button" className="btn btn-ghost btn-sm assoc-clear-focus" onClick={clearFocus}>
                <X size={13} aria-hidden /> Clear company focus
              </button>
            )}

            <label className="assoc-context-field">
              <span>Recruitment context</span>
              <select
                className="filter-select"
                value={roleActive ? roleContext.id : NO_ROLE_CONTEXT}
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
              {availableViews.map((mode) => (
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

          {nodeId && (
            <p className="callout">
              Scoped to <strong>{atlasNodeTitle(atlas, nodeId)}</strong>.{' '}
              <button
                type="button"
                className="assoc-link-button"
                onClick={() => setParams((params) => { params.delete('node'); return params })}
              >
                Clear branch scope
              </button>
            </p>
          )}

          {roleActive ? (
            <section className="assoc-brief" aria-labelledby="assoc-brief-heading">
              <h2 id="assoc-brief-heading" className="assoc-brief-title">
                Brief: {roleContext.clientName} · {roleContext.role}
              </h2>
              <p className="assoc-brief-text">{roleContext.brief}</p>
              {roleContext.mandatoryCapabilities.length > 0 && (
                <p className="assoc-brief-line">
                  <strong>Mandatory operational exposure:</strong>{' '}
                  {roleContext.mandatoryCapabilities.map((id) => index.capabilityById.get(id)?.name ?? id).join(', ')}
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
              <p className="assoc-brief-line">
                Relevance tiers below are conditional on this brief. They are not company size and
                not industry importance, and they disappear when the brief is switched off.
              </p>
            </section>
          ) : (
            <p className="callout">
              No recruitment brief is active. This is factual relationship exploration: shared
              industries, capabilities, technologies, geographies and verified corporate
              relationships, with each association labelled by the kind of evidence behind it.
            </p>
          )}

          <div className="assoc-layout">
            <aside className="facet-sidebar assoc-sidebar" aria-label="Association filters">
              <h2 className="facet-heading">Filters</h2>
              {discovery ? (
                <ExplorerFilters
                  matches={discovery.matches}
                  filters={filters}
                  index={index}
                  idPrefix="assoc-side"
                  onChange={(next) => setParams((params) => writeFilters(params, next))}
                />
              ) : (
                <CompanyFilters
                  views={scoped}
                  filters={filters}
                  index={index}
                  idPrefix="assoc-side"
                  onChange={(next) => setParams((params) => writeFilters(params, next))}
                />
              )}
            </aside>

            <section className="assoc-main" aria-label="Association views">
              <p className="assoc-coverage-note">
                Mapped coverage only, not a claim of national completeness. Associations are
                companies, not people: company similarity never implies ownership, and it is never
                evidence that any individual is suitable for a role.
              </p>
              <div className="assoc-summary">
                {discovery ? (
                  <>
                    <span><b>{filtered.length}</b> of {discovery.matches.length} matched companies in view</span>
                    <span>Scanned {discovery.coverage.organizationsScanned} companies</span>
                    {([1, 2, 3, 4, 5] as const).map((tier) => (
                      <span key={tier} className={`assoc-tier assoc-tier-${tier}`}>
                        {filtered.filter((match) => match.tier === tier).length} × tier {tier}
                      </span>
                    ))}
                  </>
                ) : (
                  <>
                    <span><b>{scopedFiltered.length}</b> companies in scope</span>
                    <span>{associations?.coverage.clusters ?? 0} evidence clusters</span>
                    <span>{associations?.coverage.edges ?? 0} rendered associations</span>
                    <span>{associations?.coverage.withUnknownRelationship ?? 0} with nothing evidenced</span>
                  </>
                )}
              </div>

              {view === 'groups' && associations && (
                <AssociationGroups
                  result={associations}
                  index={index}
                  onOpenCompany={openCompany}
                  onFocusCompany={setFocus}
                />
              )}

              {view === 'network' && focus && (
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
                    <span className="assoc-graph-hint">
                      A company-centred network, shown because you selected {focus.name}. It is one
                      view of the universe, not its structure.
                    </span>
                  </div>
                  <AssociationGraph
                    index={index}
                    focal={focus}
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
                  onToggleSelect={(match) => toggleSelectMatch(match)}
                />
              )}

              {view === 'table' && discovery && (
                <CompanyTable
                  index={index}
                  matches={filtered}
                  selectedIds={selected}
                  onOpenCompany={openCompany}
                  onToggleSelect={(match) => toggleSelectMatch(match)}
                  onToggleSelectMany={(matches, nextSelected) => {
                    for (const match of matches) {
                      if (nextSelected !== selected.has(match.organizationId)) toggleSelectMatch(match)
                    }
                  }}
                  onExport={exportCsv}
                />
              )}

              {view === 'table' && !discovery && (
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">Company</th>
                        <th scope="col">Industry placement</th>
                        <th scope="col">Evidenced capabilities</th>
                        <th scope="col">Geography</th>
                        <th scope="col">Mapped</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scopedFiltered.slice(0, 200).map((entry) => (
                        <tr key={entry.organizationId}>
                          <td className="cell-strong">
                            <button
                              type="button"
                              className="assoc-link-button"
                              onClick={() => openCompany(entry.organizationId)}
                            >
                              {entry.name}
                            </button>
                          </td>
                          <td>{entry.taxonomyPaths[0] ?? 'Not yet classified'}</td>
                          <td>{entry.observedCapabilityIds.length}</td>
                          <td>{entry.provinces.join(', ') || 'No sourced location'}</td>
                          <td>{entry.mappedProfessionals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {scopedFiltered.length > 200 && (
                    <p className="assoc-graph-note">
                      Showing the first 200 of {scopedFiltered.length} companies in scope. Narrow the
                      branch or filters for a shorter list, or export for the complete set.
                    </p>
                  )}
                </div>
              )}

              {filtered.length === 0 && scopedFiltered.length === 0 && (
                <EmptyState
                  title="No companies match these filters"
                  description="Widen the filters, clear the branch scope, or clear the company focus to explore the whole industry universe."
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
                  focalName={focus?.name ?? 'the industry universe'}
                  selected={selected.has(inspectorId)}
                  onToggleSelect={() => {
                    const match = matchById.get(inspectorId)
                    if (match) toggleSelectMatch(match)
                  }}
                  onCompare={() => { setCompareRight(null); setCompareOpen(true) }}
                  onRecenter={() => setFocus(inspectorId)}
                  onOverride={(tier, reason) => overrides.set(inspectorId, tier, reason, 'Talent Tree')}
                  override={overrides.forOrganization(inspectorId)}
                />
              ) : (
                <div className="assoc-inspector-empty">
                  <h2>Company inspector</h2>
                  <p>
                    Select any company to see its verified record, its evidence, the associations it
                    holds and the professionals Maps already knows there. Nothing is pre-selected.
                  </p>
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
                {workspace.selection.map((entry) => {
                  const match = matchById.get(entry.organizationId)
                  return (
                    <li key={entry.organizationId}>
                      <button type="button" className="assoc-link-button" onClick={() => openCompany(entry.organizationId)}>
                        {index.byId.get(entry.organizationId)?.name ?? entry.organizationId}
                      </button>
                      {entry.tier !== null && <span className={`assoc-tier assoc-tier-${entry.tier}`}>{TIER_LABELS[String(entry.tier)]}</span>}
                      {!entry.tier && match === undefined && <span className="assoc-tier">no tier: no brief active</span>}
                    </li>
                  )
                })}
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
                  <option value="dynamic">Dynamic: re-derives from this scope</option>
                </select>
              </label>
              <button type="button" className="btn btn-primary btn-sm" onClick={savePool} disabled={workspace.selection.length === 0 || poolForm.name.trim().length === 0}>
                <FloppyDisk size={13} aria-hidden /> Save pool
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={clearSelection} disabled={workspace.selection.length === 0}>
                Clear selection
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={exportCsv}>
                <Download size={13} aria-hidden /> Export {exportRows} companies
              </button>
            </div>
            {poolForm.kind === 'dynamic' && (
              <p className="assoc-pool-note">
                {focusId
                  ? 'This pool will re-derive from the filters around the selected focus company and role context.'
                  : 'This pool will re-derive from the industry branch and filters, with no focal company. Saved industry-defined pools work without one.'}
              </p>
            )}
            {poolNotice && <p className="callout">{poolNotice}</p>}

            {workspace.pools.length > 0 && (
              <ul className="assoc-pool-list">
                {workspace.pools.map((pool) => (
                  <li key={pool.id}>
                    <strong>{pool.name}</strong>
                    <span className="assoc-pool-meta">
                      {pool.kind === 'dynamic' ? 'Dynamic pool' : 'Snapshot'} · {pool.classification} ·{' '}
                      {pool.entries.length} companies · created {pool.createdOn} · reused {pool.reuseCount} time{pool.reuseCount === 1 ? '' : 's'}
                      {pool.definition && ` · ${poolLabel(pool.definition.scope.kind)}`}
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
            <h2 id="assoc-method-heading">How associations are classified</h2>
            <p>
              Every association carries the kind of evidence behind it: a verified factual
              relationship (a sourced corporate record), a shared sourced attribute (both companies
              evidenced the same thing), a derived operational association (same value-chain stage or
              taxonomy branch), a recruiter judgement, or unknown. Only a corporate ownership record
              may imply control: appearing in the same industry, the same province or the same
              capability list never does.
            </p>
            <a href="/search-bank">
              Open the Search Bank to attach these targets to an assignment <ArrowSquareOut size={12} aria-hidden />
            </a>
          </section>
        </div>
      </main>

      <div className="assoc-drawer-host" ref={filtersLayer} hidden={!filtersOpen}>
        {filtersOpen && (
          <div className="facet-drawer" role="dialog" aria-modal="true" aria-label="Association filters">
            <div className="facet-drawer-head">
              <h2 className="facet-heading">Filters</h2>
              <button type="button" className="facet-drawer-close" onClick={closeFilters} aria-label="Close filters">Close</button>
            </div>
            <div className="facet-drawer-body">
              {discovery ? (
                <ExplorerFilters
                  matches={discovery.matches}
                  filters={filters}
                  index={index}
                  idPrefix="assoc-drawer"
                  onChange={(next) => setParams((params) => writeFilters(params, next))}
                />
              ) : (
                <CompanyFilters
                  views={scoped}
                  filters={filters}
                  index={index}
                  idPrefix="assoc-drawer"
                  onChange={(next) => setParams((params) => writeFilters(params, next))}
                />
              )}
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
              focalName={focus?.name ?? 'the industry universe'}
              selected={selected.has(inspectorId)}
              onToggleSelect={() => {
                const match = matchById.get(inspectorId)
                if (match) toggleSelectMatch(match)
              }}
              onCompare={() => { setCompareRight(null); setCompareOpen(true) }}
              onRecenter={() => setFocus(inspectorId)}
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
              roleContext={roleActive ? roleContext : null}
              onRightChange={setCompareRight}
            />
          </div>
        </Drawer>
      )}
    </ErrorBoundary>
  )
}

function poolLabel(kind: string): string {
  if (kind === 'focal') return 'defined around a focus company'
  if (kind === 'industry') return 'defined by an industry branch'
  return 'defined by filters over the universe'
}
