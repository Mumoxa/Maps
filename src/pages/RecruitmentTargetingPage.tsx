import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, FloppyDisk, SlidersHorizontal, Target, X } from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Drawer } from '../components/ui/Drawer'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { useDialogLayer } from '../hooks/useDialogLayer'
import { useWorkspace, useSelection, useOverrides } from '../hooks/useWorkspace'
import { useCompanyUniverse } from '../hooks/useCompanyUniverse'
import { discoverAssociations, discoverRoleTargets, filterMatches } from '../data/organizations/discovery'
import { NO_ROLE_CONTEXT, assignmentContexts, roleContextById, roleContexts } from '../data/organizations/roleContexts'
import { discoverTargets, exportTargetsCsv, readFilters, writeFilters } from '../data/organizations/query'
import {
  focalPoolDefinition,
  industryPoolDefinition,
  saveSelectionToPool,
  targetDropPayload,
} from '../data/organizations/workspace'
import { atlasNodeTitle, companiesAtNode, isUnclassifiedBranch } from '../data/organizations/atlas'
import { ExplorerFilters, TIER_LABELS } from '../components/associations/ExplorerFilters'
import { CompanyTable } from '../components/associations/CompanyTable'
import { CompanyInspector } from '../components/associations/CompanyInspector'
import { bankSearches } from '../data/searchBank/bank'
import { type AssociationMatch } from '../data/organizations/types'

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
 * Recruitment targeting: the optional application of company intelligence.
 *
 * Nothing here runs until a brief exists. No role is selected by default, no
 * company is centred by default, and the tiers this page renders are explicitly
 * conditional on the brief — they are never presented as company size, market
 * position or industry importance.
 */
export function RecruitmentTargetingPage() {
  useEffect(() => { document.title = 'SA Talent Map | Recruitment Targeting' }, [])

  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [poolForm, setPoolForm] = useState({ name: '', classification: 'Role sourcing list', kind: 'snapshot' as 'snapshot' | 'dynamic' })
  const [poolNotice, setPoolNotice] = useState('')
  const [dropSearch, setDropSearch] = useState('')

  const workspace = useWorkspace()
  const { selected, toggle: toggleSelection, clear: clearSelection } = useSelection()
  const { index, extraOrganizations, all, atlas } = useCompanyUniverse()

  const roleParam = searchParams.get('role') ?? ''
  const roleContext = roleParam && roleParam !== NO_ROLE_CONTEXT ? roleContextById(roleParam) ?? null : null

  // Optional focal company. Absent means "score the industry universe", which is
  // the mode the atlas exists to enable.
  const focusParam = searchParams.get('org') ?? ''
  const focusId = focusParam && index.byId.has(focusParam) ? focusParam : null
  const focus = focusId ? index.byId.get(focusId) ?? null : null

  const nodeParam = searchParams.get('node') ?? ''
  const nodeId = nodeParam && (atlas.nodes.has(nodeParam) || isUnclassifiedBranch(nodeParam)) ? nodeParam : null

  const filters = useMemo(() => readFilters(searchParams), [searchParams])
  const overrides = useOverrides(roleContext?.id ?? NO_ROLE_CONTEXT)
  const contexts = useMemo(() => roleContexts(), [])
  const assignments = useMemo(() => assignmentContexts(), [])

  const setParams = useCallback((mutate: (params: URLSearchParams) => URLSearchParams) => {
    setSearchParams((previous) => mutate(new URLSearchParams(previous)), { replace: true })
  }, [setSearchParams])

  const scopedIds = useMemo(
    () => (nodeId ? companiesAtNode(atlas, index, nodeId) : null),
    [atlas, index, nodeId],
  )

  const discovery = useMemo(() => {
    if (!roleContext) return null
    if (focusId) {
      return {
        mode: 'focal' as const,
        result: discoverAssociations({ index, focalId: focusId, roleContext, extraOrganizations }),
      }
    }
    return {
      mode: 'universe' as const,
      result: discoverRoleTargets({
        index,
        roleContext,
        organizations: all,
        scope: {
          nodeId,
          label: nodeId ? atlasNodeTitle(atlas, nodeId) : 'Whole mapped universe',
          organizationIds: scopedIds ?? undefined,
        },
      }),
    }
  }, [roleContext, focusId, index, extraOrganizations, all, nodeId, atlas, scopedIds])

  const matches = useMemo<AssociationMatch[]>(() => {
    if (!discovery) return []
    const rows = discovery.mode === 'focal' ? discovery.result.matches : discovery.result.matches
    return filterMatches(rows, index, filters)
  }, [discovery, index, filters])

  const matchById = useMemo(() => {
    const map = new Map<string, AssociationMatch>()
    for (const match of matches) map.set(match.organizationId, match)
    return map
  }, [matches])

  const tierCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const match of matches) counts[match.tier] += 1
    return counts
  }, [matches])

  const inspectId = searchParams.get('inspect')
  const inspectorMatch = inspectId ? matchById.get(inspectId) ?? null : null
  const openCompany = useCallback((organizationId: string) => {
    setParams((params) => { params.set('inspect', organizationId); return params })
    setInspectorOpen(true)
  }, [setParams])

  const closeInspector = useCallback(() => setInspectorOpen(false), [])
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const filtersLayer = useDialogLayer<HTMLDivElement>(filtersOpen, closeFilters)
  const inspectorLayer = useDialogLayer<HTMLDivElement>(inspectorOpen, closeInspector)

  const exportCsv = useCallback(() => {
    if (!roleContext) return
    if (focusId) {
      const payload = discoverTargets({
        index,
        focalId: focusId,
        roleContext,
        filters,
        extraOrganizations,
        page: 1,
        pageSize: Math.max(1, matches.length),
      })
      download(`targets-${focusId}-${roleContext.id}.csv`, exportTargetsCsv(payload), 'text/csv;charset=utf-8')
      return
    }
    const header = ['organization_id', 'company', 'tier', 'tier_label', 'reasons', 'missing_evidence', 'mapped_professionals']
    const rows = matches.map((match) => {
      const name = index.byId.get(match.organizationId)?.name ?? match.organizationId
      return [
        match.organizationId,
        name,
        String(match.tier),
        match.tierLabel,
        match.rules.map((rule) => rule.label).join('; '),
        match.gaps.map((gap) => gap.requirement).join('; '),
        String(match.mappedProfessionals),
      ].map((cell) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)).join(',')
    })
    download(`targets-${roleContext.id}.csv`, [header.join(','), ...rows].join('\n'), 'text/csv;charset=utf-8')
  }, [roleContext, focusId, index, filters, extraOrganizations, matches])

  const toggleSelectMatch = useCallback((match: AssociationMatch) => {
    toggleSelection(match.organizationId, match.rules.map((rule) => rule.label).join('; '), match.tier)
  }, [toggleSelection])

  const savePool = useCallback(() => {
    const name = poolForm.name.trim()
    if (!name || workspace.selection.length === 0) return
    const definition = focusId
      ? focalPoolDefinition(filters, focusId, roleContext?.id ?? NO_ROLE_CONTEXT)
      : industryPoolDefinition(filters, nodeId, roleContext?.id ?? null)
    const pool = saveSelectionToPool(name, poolForm.classification, 'Talent Tree', poolForm.kind, definition)
    if (pool) {
      setPoolNotice(`Saved "${pool.name}" with ${pool.entries.length} companies (${pool.kind}). Stored in this browser only.`)
      setPoolForm({ name: '', classification: poolForm.classification, kind: poolForm.kind })
    }
  }, [poolForm, workspace.selection.length, filters, focusId, roleContext, nodeId])

  const exportPoolDrop = useCallback((poolId: string) => {
    const pool = workspace.pools.find((entry) => entry.id === poolId)
    if (!pool || !roleContext) return
    const contextsById = new Map(matches.map((match) => [match.organizationId, {
      name: index.byId.get(match.organizationId)?.name ?? match.organizationId,
      legalName: index.byId.get(match.organizationId)?.legalName ?? '',
      pocket: index.pocketById.get(match.pocketId)?.name ?? match.pocketId,
      tierLabel: match.tierLabel,
      mappedProfessionals: match.mappedProfessionals,
      evidenceState: match.confidence,
      missingEvidence: match.gaps.map((gap) => gap.requirement),
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
  }, [workspace.pools, matches, index, dropSearch, roleContext])

  return (
    <ErrorBoundary>
      <main className="page">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Industry Atlas', to: '/industry-atlas' },
            ...(nodeId ? [{ label: atlasNodeTitle(atlas, nodeId), to: `/industry-atlas?node=${encodeURIComponent(nodeId)}` }] : []),
            { label: 'Recruitment targeting' },
          ]} />

          <header className="page-head">
            <div>
              <h1>Recruitment targeting</h1>
              <p>
                Apply a search assignment or role brief to the company universe and see which
                organisations are relevant, with the evidence and the missing evidence behind every
                recommendation. This is an application of the company intelligence in the Industry
                Atlas - the brief changes relevance, never the company facts.
              </p>
            </div>
            <div className="page-head-aside">
              <span className="page-head-meta"><b>{all.length}</b> companies in the universe</span>
              <span className="page-head-meta"><b>{assignments.length}</b> live assignments</span>
              <span className="page-head-meta">
                Scope: {nodeId ? atlasNodeTitle(atlas, nodeId) : 'whole universe'}
              </span>
            </div>
          </header>

          <section className="assoc-context" aria-labelledby="target-context-heading">
            <h2 id="target-context-heading" className="visually-hidden">Targeting context</h2>

            <label className="assoc-context-field">
              <span>Recruitment brief</span>
              <select
                className="filter-select"
                value={roleContext?.id ?? NO_ROLE_CONTEXT}
                onChange={(event) => setParams((params) => { params.set('role', event.target.value); return params })}
              >
                <option value={NO_ROLE_CONTEXT}>No brief selected</option>
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

            <label className="assoc-context-field">
              <span>Industry scope</span>
              <select
                className="filter-select"
                value={nodeId ?? ''}
                onChange={(event) => setParams((params) => {
                  if (event.target.value) params.set('node', event.target.value)
                  else params.delete('node')
                  return params
                })}
              >
                <option value="">Whole mapped universe</option>
                {atlas.roots.map((root) => (
                  <option key={root.id} value={root.id}>{root.node.name}</option>
                ))}
              </select>
            </label>

            <label className="assoc-context-field">
              <span>Compare against a client company (optional)</span>
              <input
                list="target-company-options"
                value={focus?.name ?? ''}
                onChange={(event) => {
                  const id = all.find((organization) => organization.name.toLowerCase() === event.target.value.trim().toLowerCase())?.id
                  if (id) setParams((params) => { params.set('org', id); params.delete('inspect'); return params })
                }}
                placeholder="No company: score the universe against the brief"
              />
              <datalist id="target-company-options">
                {all.map((organization) => <option key={organization.id} value={organization.name} />)}
              </datalist>
            </label>

            {focus && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setParams((params) => { params.delete('org'); params.delete('inspect'); return params })}>
                <X size={13} aria-hidden /> Clear comparison company
              </button>
            )}

            {roleContext && (
              <button type="button" className="facet-filter-trigger" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen} aria-haspopup="dialog">
                <SlidersHorizontal size={15} aria-hidden /> Filters
              </button>
            )}
          </section>

          {!roleContext ? (
            <section className="assoc-brief" aria-labelledby="target-select-heading">
              <h2 id="target-select-heading" className="assoc-brief-title">Choose a brief to begin</h2>
              <p className="assoc-brief-text">
                No recruitment brief is active, and none is applied by default. Select a live
                assignment or a role family above and this page will score the company universe
                against it. Until then nothing is ranked, because relevance without a brief is not a
                fact about any company.
              </p>
              <ul className="assoc-brief-list">
                <li>Relevance tiers appear only while a brief is active.</li>
                <li>Tiers describe fit to that brief, not company size or industry importance.</li>
                <li>Changing the brief changes the ranking and leaves every company fact untouched.</li>
              </ul>
              <p className="assoc-brief-text">
                To explore companies without a brief, use the{' '}
                <a href="/industry-atlas">Industry Atlas</a> or the{' '}
                <a href="/companies">company universe</a>.
              </p>
            </section>
          ) : (
            <>
              <section className="assoc-brief" aria-labelledby="target-brief-heading">
                <h2 id="target-brief-heading" className="assoc-brief-title">
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
              </section>

              <div className="assoc-layout">
                <aside className="facet-sidebar assoc-sidebar" aria-label="Targeting filters">
                  <h2 className="facet-heading">Filters</h2>
                  <ExplorerFilters
                    matches={matches}
                    filters={filters}
                    index={index}
                    idPrefix="target-side"
                    onChange={(next) => setParams((params) => writeFilters(params, next))}
                  />
                </aside>

                <section className="assoc-main" aria-label="Targeting results">
                  <div className="assoc-summary">
                    <span><b>{matches.length}</b> companies scored</span>
                    <span>
                      {discovery?.mode === 'focal'
                        ? `Compared against ${focus?.name}`
                        : 'Scored against the brief alone, with no company centred'}
                    </span>
                    {([1, 2, 3, 4, 5] as const).map((tier) => (
                      <span key={tier} className={`assoc-tier assoc-tier-${tier}`}>
                        {tierCounts[tier]} × tier {tier}
                      </span>
                    ))}
                  </div>

                  <p className="assoc-graph-hint">
                    <Target size={13} aria-hidden /> Tiers are conditional on{' '}
                    <strong>{roleContext.role}</strong>. They are not a company size measure and not a
                    statement of industry importance. A company is not tier 1 merely for appearing in
                    the same industry.
                  </p>

                  {matches.length === 0 ? (
                    <EmptyState
                      title="No companies match this brief and these filters"
                      description="Widen the filters, or choose a different industry scope."
                    />
                  ) : (
                    <CompanyTable
                      index={index}
                      matches={matches}
                      selectedIds={selected}
                      onOpenCompany={openCompany}
                      onToggleSelect={toggleSelectMatch}
                      onToggleSelectMany={(rows, nextSelected) => {
                        for (const match of rows) {
                          if (nextSelected !== selected.has(match.organizationId)) toggleSelectMatch(match)
                        }
                      }}
                      onExport={exportCsv}
                    />
                  )}
                </section>

                <aside className="assoc-inspector" aria-label="Target inspector">
                  {inspectId ? (
                    <CompanyInspector
                      index={index}
                      organizationId={inspectId}
                      match={inspectorMatch}
                      roleContext={roleContext}
                      focalName={focus?.name ?? 'the brief'}
                      selected={selected.has(inspectId)}
                      onToggleSelect={() => {
                        const match = matchById.get(inspectId)
                        if (match) toggleSelectMatch(match)
                      }}
                      onCompare={() => undefined}
                      onRecenter={() => setParams((params) => { params.set('org', inspectId); return params })}
                      onOverride={(tier, reason) => overrides.set(inspectId, tier, reason, 'Talent Tree')}
                      override={overrides.forOrganization(inspectId)}
                    />
                  ) : (
                    <div className="assoc-inspector-empty">
                      <h2>Target inspector</h2>
                      <p>
                        Select a company to read why it appears for {roleContext.role}, which
                        mandatory requirements are evidenced, and which are missing research rather
                        than confirmed absences.
                      </p>
                    </div>
                  )}
                </aside>
              </div>

              <section className="assoc-poolbar" aria-labelledby="target-pool-heading">
                <h2 id="target-pool-heading">Target pool</h2>
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
                      placeholder="e.g. Cold chain finance sources"
                    />
                  </label>
                  <label className="assoc-pool-field">
                    <span>Search Bank assignment</span>
                    <input
                      list="target-bank-searches"
                      value={dropSearch}
                      onChange={(event) => setDropSearch(event.target.value)}
                      placeholder={roleContext.clientId ? `${roleContext.clientName} · ${roleContext.role}` : roleContext.role}
                    />
                    <datalist id="target-bank-searches">
                      {bankSearches.map((search) => <option key={search.id} value={search.name} />)}
                    </datalist>
                  </label>
                  <label className="assoc-pool-field">
                    <span>Classification</span>
                    <select className="filter-select" value={poolForm.classification} onChange={(event) => setPoolForm((form) => ({ ...form, classification: event.target.value }))}>
                      <option value="Role sourcing list">Role sourcing list</option>
                      <option value="Industry pocket">Industry pocket</option>
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
                    <Download size={13} aria-hidden /> Export {matches.length} targets
                  </button>
                </div>
                {poolNotice && <p className="callout">{poolNotice}</p>}

                {workspace.pools.length > 0 && (
                  <ul className="assoc-pool-list">
                    {workspace.pools.map((pool) => (
                      <li key={pool.id}>
                        <strong>{pool.name}</strong>
                        <span className="assoc-pool-meta">
                          {pool.kind === 'dynamic' ? 'Dynamic pool' : 'Snapshot'} · {pool.classification} ·{' '}
                          {pool.entries.length} companies · created {pool.createdOn} · reused {pool.reuseCount} time{pool.reuseCount === 1 ? '' : 's'}
                          {pool.definition && ` · ${pool.definition.scope.kind === 'focal' ? 'defined around a client company' : 'defined by an industry branch'}`}
                        </span>
                        <span className="assoc-pool-actions">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportPoolDrop(pool.id)}>
                            Search Bank drop
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <div className="assoc-drawer-host" ref={filtersLayer} hidden={!filtersOpen}>
        {filtersOpen && roleContext && (
          <div className="facet-drawer" role="dialog" aria-modal="true" aria-label="Targeting filters">
            <div className="facet-drawer-head">
              <h2 className="facet-heading">Filters</h2>
              <button type="button" className="facet-drawer-close" onClick={closeFilters} aria-label="Close filters">Close</button>
            </div>
            <div className="facet-drawer-body">
              <ExplorerFilters
                matches={matches}
                filters={filters}
                index={index}
                idPrefix="target-drawer"
                onChange={(next) => setParams((params) => writeFilters(params, next))}
              />
            </div>
            <div className="facet-drawer-foot">
              <button type="button" className="btn btn-primary facet-drawer-apply" onClick={closeFilters}>Show results</button>
            </div>
          </div>
        )}
      </div>

      {inspectorOpen && inspectId && roleContext && (
        <Drawer isOpen={inspectorOpen} onClose={closeInspector} title={index.byId.get(inspectId)?.name ?? inspectId} subtitle="Targeting evidence">
          <div ref={inspectorLayer}>
            <CompanyInspector
              index={index}
              organizationId={inspectId}
              match={inspectorMatch}
              roleContext={roleContext}
              focalName={focus?.name ?? 'the brief'}
              selected={selected.has(inspectId)}
              onToggleSelect={() => {
                const match = matchById.get(inspectId)
                if (match) toggleSelectMatch(match)
              }}
              onCompare={() => undefined}
              onRecenter={() => setParams((params) => { params.set('org', inspectId); return params })}
              onOverride={(tier, reason) => overrides.set(inspectId, tier, reason, 'Talent Tree')}
              override={overrides.forOrganization(inspectId)}
            />
          </div>
        </Drawer>
      )}
    </ErrorBoundary>
  )
}
