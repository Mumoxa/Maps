import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { AssociationGraph } from '../components/associations/AssociationGraph'
import { CompanyInspector } from '../components/associations/CompanyInspector'
import { CompanySelector } from '../components/associations/CompanySelector'
import { CompanyTable } from '../components/associations/CompanyTable'
import { ComparePanel } from '../components/associations/ComparePanel'
import { ExplorerFilterPanel, type ListKey } from '../components/associations/ExplorerFilterPanel'
import { PocketsView } from '../components/associations/PocketsView'
import { RequirementEditor, RoleContextPicker, type RequirementKey } from '../components/associations/RoleContextPicker'
import { FILTER_PARAM, patchParams, readExplorerState, type ExplorerView } from '../components/associations/explorerState'
import { downloadText } from '../components/intelligence/IntelBits'
import { rowsToCsv, rowToResult, LIMITATIONS } from '../data/intelligence/api'
import { applyFilters, discover, type Pocket } from '../data/intelligence/discovery'
import { roleContexts, roleContextById } from '../data/intelligence/index'
import { emptyRequirement, hasRoleCriteria, requirementFromTemplate, type Tier } from '../data/intelligence/targeting'
import type { SearchRequirement } from '../data/intelligence/types'
import { useIntelligenceGraph } from '../data/intelligence/useIntelligence'
import {
  addCuratedAssociation,
  addTargets,
  clearOverride,
  contextKeyFor,
  overridesFor,
  previousTargetsFor,
  savePool,
  setOverride,
} from '../data/workspace/operations'
import { useWorkspace } from '../data/workspace/useWorkspace'

const VIEWS: { id: ExplorerView; label: string }[] = [
  { id: 'network', label: 'Network' },
  { id: 'pockets', label: 'Pockets' },
  { id: 'table', label: 'Table' },
]

const EXAMPLES = [
  { label: 'Cold storage: Financial Manager', params: 'focus=org-commercial-cold-holdings&context=fm-temperature-controlled' },
  { label: 'SLM Developments: Finance (property development)', params: 'focus=org-slm-developments&context=finance-property-development' },
  { label: 'Bester Feed & Grain: Head of Finance', params: 'focus=org-bester-feed-grain&context=hof-agri-commodity' },
]

export function CompanyAssociationsPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const graph = useIntelligenceGraph()
  const { workspace, update } = useWorkspace()
  const state = useMemo(() => readExplorerState(params), [params])
  const baseId = useId()
  const [poolName, setPoolName] = useState('')
  const [poolMode, setPoolMode] = useState<'snapshot' | 'dynamic'>('snapshot')
  const [assignmentId, setAssignmentId] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'SA Talent Map | Company associations'
  }, [])

  const set = useCallback(
    (patch: Record<string, string | string[] | null>, replace = false) => setParams((current) => patchParams(current, patch), { replace }),
    [setParams],
  )

  // ----- Requirement for the chosen role context -----
  const searchId = state.context.startsWith('search:') ? state.context.slice('search:'.length) : null
  const assignment = searchId ? workspace.searches.find((search) => search.id === searchId) ?? null : null
  const template = roleContextById.get(state.context) ?? null
  const requirement: SearchRequirement = useMemo(() => {
    if (assignment) return assignment.requirement
    if (template) return requirementFromTemplate(template)
    if (state.context === 'custom') {
      return {
        ...emptyRequirement(),
        label: 'Custom requirement',
        mandatoryCapabilities: state.custom.mandatory,
        preferredCapabilities: state.custom.preferred,
        preferredIndustries: state.custom.preferredIndustries,
        adjacentIndustries: state.custom.adjacentIndustries,
        deprioritisedIndustries: state.custom.deprioritisedIndustries,
      }
    }
    return emptyRequirement()
  }, [assignment, template, state.context, state.custom])
  const roleActive = hasRoleCriteria(requirement)
  const contextKey = contextKeyFor(assignment?.id ?? null, template?.id ?? null)

  // ----- Discovery -----
  const overrides = useMemo(() => overridesFor(workspace, contextKey), [workspace, contextKey])
  const previousTargets = useMemo(() => previousTargetsFor(workspace, state.focus), [workspace, state.focus])
  const discovery = useMemo(
    () =>
      discover(graph, {
        focalId: state.focus,
        requirement,
        scope: state.scope,
        overrides,
        curatedAssociations: workspace.curatedAssociations,
        previousTargets,
      }),
    [graph, state.focus, requirement, state.scope, overrides, workspace.curatedAssociations, previousTargets],
  )
  const filtered = useMemo(() => applyFilters(graph, discovery.rows, state.filters), [graph, discovery.rows, state.filters])
  const visibleIds = useMemo(() => new Set(filtered.map((row) => row.organizationId)), [filtered])
  const targetsInView = filtered.filter((row) => row.role !== 'focal')
  const expanded = useMemo(() => {
    if (params.has('expanded')) return new Set(state.expanded)
    const defaults = discovery.pockets.filter((pocket) => pocket.fit === 'preferred').map((pocket) => pocket.id)
    return new Set(defaults.length ? defaults : discovery.pockets.slice(0, 1).map((pocket) => pocket.id))
  }, [params, state.expanded, discovery.pockets])
  const compare = useMemo(() => new Set(state.compare), [state.compare])
  const focalOrg = state.focus ? graph.organizationById.get(state.focus) : null

  // ----- Handlers -----
  const togglePocket = useCallback(
    (id: string) => {
      const next = new Set(expanded)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      set({ expanded: next.size ? [...next] : 'none' })
    },
    [expanded, set],
  )
  const selectOrg = useCallback(
    (id: string, additive: boolean) => {
      if (additive) {
        const next = new Set(compare)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        set({ compare: [...next] }, true)
      } else {
        set({ org: id }, true)
      }
    },
    [compare, set],
  )
  const recentre = useCallback((id: string) => set({ focus: id, org: null, expanded: null, page: null }), [set])
  const showPocketInTable = useCallback(
    (pocket: Pocket) => set({ view: 'table', ind: pocket.industryId ? [pocket.industryId] : null, page: null }),
    [set],
  )
  const toggleFilter = (key: ListKey, value: string) => {
    const current = state.filters[key] as string[]
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    set({ [FILTER_PARAM[key]]: next, page: null }, true)
  }
  const clearFilters = () => {
    const patch: Record<string, null> = { q: null, page: null }
    for (const param of Object.values(FILTER_PARAM)) patch[param] = null
    set(patch, true)
  }
  const editRequirement = (key: RequirementKey, values: string[]) => {
    const param = { mandatoryCapabilities: 'mand', preferredCapabilities: 'pref', preferredIndustries: 'pind', adjacentIndustries: 'aind', deprioritisedIndustries: 'dind' }[key]
    set({ [param]: values })
  }

  const exportRows = (ids: Set<string> | null, format: 'csv' | 'json') => {
    const rows = ids ? targetsInView.filter((row) => ids.has(row.organizationId)) : targetsInView
    const stamp = graph.asOf
    if (format === 'csv') downloadText(`company-associations-${stamp}.csv`, rowsToCsv(graph, rows), 'text/csv')
    else
      downloadText(
        `company-associations-${stamp}.json`,
        JSON.stringify({ schemaVersion: 1, asOf: stamp, focal: state.focus, requirement, filters: state.filters, total: rows.length, results: rows.map((row) => rowToResult(graph, row)), limitations: LIMITATIONS }, null, 2),
        'application/json',
      )
  }

  const selectionTiers = (): Record<string, Tier> => Object.fromEntries(targetsInView.filter((row) => compare.has(row.organizationId)).map((row) => [row.organizationId, row.assessment.tier]))

  const selectedRow = state.selected ? discovery.rowById.get(state.selected) ?? null : null
  const showCompare = params.get('cmp') === '1' && compare.size >= 2

  return (
    <div className="page">
      <div className="container container-wide">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Company associations' }]} />
        <div className="page-head">
          <div>
            <h1>Company Association Explorer</h1>
            <p>
              Start from a company, choose a role context, and see which other companies are associated, why, and how relevant each is for the role. Every tier
              comes with its reasons and gaps.
            </p>
          </div>
          <div className="page-head-aside">
            <span className="page-head-meta">
              <b>{targetsInView.length.toLocaleString()}</b> companies in view of {discovery.universeSize.toLocaleString()} considered
            </span>
          </div>
        </div>

        <div className="ca-controls">
          <CompanySelector graph={graph} value={state.focus} onSelect={(id) => set({ focus: id, org: null, expanded: null, page: null, compare: null })} />
          <RoleContextPicker value={state.context} templates={roleContexts} assignments={workspace.searches} onChange={(value) => set({ context: value === 'none' ? null : value, page: null })} />
          <div className="ca-field">
            <label htmlFor={`${baseId}-scope`} className="ca-label">
              Scope
            </label>
            <select id={`${baseId}-scope`} className="filter-select ca-select" value={state.scope} onChange={(event) => set({ scope: event.target.value === 'all' ? 'all' : null, page: null })}>
              <option value="associated">Associated or role relevant</option>
              <option value="all">Every South African company</option>
            </select>
          </div>
          <div className="ca-field">
            <label htmlFor={`${baseId}-q`} className="ca-label">
              Search in results
            </label>
            <input id={`${baseId}-q`} type="search" className="ca-input" value={state.filters.q} placeholder="Company name" onChange={(event) => set({ q: event.target.value, page: null }, true)} />
          </div>
        </div>

        {!state.focus && (
          <div className="ca-examples">
            <span className="ca-label">Worked examples</span>
            {EXAMPLES.map((example) => (
              <Link key={example.label} className="chip" to={`/company-associations?${example.params}`}>
                {example.label}
              </Link>
            ))}
          </div>
        )}

        {(roleActive || state.context === 'custom') && (
          <details className="ca-requirement-box" open={state.context === 'custom'}>
            <summary>
              Requirement: <b>{requirement.label}</b>
              {template && <span className="intel-muted"> · {template.summary}</span>}
            </summary>
            <RequirementEditor graph={graph} requirement={requirement} onChange={editRequirement} readOnly={state.context !== 'custom'} />
            {state.context !== 'custom' && (
              <p className="intel-muted">
                Templates are edited in markets/intelligence/taxonomy/role-contexts.json. Pick “Custom requirement” to adjust criteria for this view, or create a
                private assignment.
              </p>
            )}
          </details>
        )}
        {searchId && !assignment && <p className="ca-status" role="status">That assignment is not in this browser's workspace. Showing company associations without a role.</p>}

        <div className="ca-view-switch" role="tablist" aria-label="Explorer view">
          {VIEWS.map((view) => (
            <button key={view.id} type="button" role="tab" aria-selected={state.view === view.id} className={state.view === view.id ? 'ca-tab is-active' : 'ca-tab'} onClick={() => set({ view: view.id === 'network' ? null : view.id })}>
              {view.label}
            </button>
          ))}
          <span className="ca-view-spacer" />
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportRows(null, 'csv')}>
            Export CSV ({targetsInView.length})
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportRows(null, 'json')}>
            Export JSON
          </button>
        </div>

        {compare.size > 0 && (
          <div className="ca-bulk" role="region" aria-label="Selected companies">
            <span>
              <b>{compare.size}</b> selected
            </span>
            <button type="button" className="btn btn-secondary btn-sm" disabled={compare.size < 2} onClick={() => set({ cmp: '1' })}>
              Compare
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportRows(compare, 'csv')}>
              Export selected
            </button>
            <label htmlFor={`${baseId}-assign`} className="sr-only">
              Assignment to add the selected companies to
            </label>
            <select id={`${baseId}-assign`} className="filter-select ca-select-sm" value={assignmentId} onChange={(event) => setAssignmentId(event.target.value)}>
              <option value="">Add to assignment…</option>
              {workspace.searches.map((search) => (
                <option key={search.id} value={search.id}>
                  {search.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={!assignmentId}
              onClick={() => {
                const tiers = selectionTiers()
                let result = { added: 0, skipped: 0 }
                const error = update((ws, ctx) => {
                  const out = addTargets(ws, ctx, assignmentId, [...compare].map((id) => ({ organizationId: id, tier: tiers[id] ?? null })), 'explorer')
                  result = { added: out.added, skipped: out.skipped }
                  return out.workspace
                })
                setStatus(error ?? `Added ${result.added} target companies (${result.skipped} already on the assignment)`)
              }}
            >
              Add
            </button>
            <label htmlFor={`${baseId}-pool`} className="sr-only">
              Pool name
            </label>
            <input id={`${baseId}-pool`} className="ca-input ca-input-sm" placeholder="Pool name" value={poolName} onChange={(event) => setPoolName(event.target.value)} />
            <label htmlFor={`${baseId}-pool-mode`} className="sr-only">
              Pool type
            </label>
            <select id={`${baseId}-pool-mode`} className="filter-select ca-select-sm" value={poolMode} onChange={(event) => setPoolMode(event.target.value === 'dynamic' ? 'dynamic' : 'snapshot')}>
              <option value="snapshot">Snapshot (fixed list)</option>
              <option value="dynamic">Dynamic (re-run query)</option>
            </select>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const tiers = selectionTiers()
                const error = update(
                  (ws, ctx) =>
                    savePool(ws, ctx, {
                      name: poolName,
                      mode: poolMode,
                      query: { focalId: state.focus, roleContextId: template?.id ?? null, requirement, filters: state.filters, scope: state.scope },
                      organizationIds: [...compare],
                      tiers,
                      searchId: assignment?.id ?? null,
                    }).workspace,
                )
                setStatus(error ?? `Saved pool “${poolName.trim()}” in this browser`)
                if (!error) setPoolName('')
              }}
            >
              Save pool
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => set({ compare: null, cmp: null }, true)}>
              Clear
            </button>
          </div>
        )}
        {status && (
          <p className="ca-status" role="status">
            {status} <Link to="/target-pools">Pools</Link> · <Link to="/search-bank/assignments">Assignments</Link>
          </p>
        )}

        {showCompare && (
          <ComparePanel
            graph={graph}
            organizationIds={[...compare]}
            requirement={roleActive ? requirement : null}
            onRemove={(id) => set({ compare: [...compare].filter((item) => item !== id) }, true)}
            onClose={() => set({ cmp: null }, true)}
          />
        )}

        <div className={state.selected ? 'ca-layout has-inspector' : 'ca-layout'}>
          <ExplorerFilterPanel graph={graph} rows={discovery.rows} filters={state.filters} onToggle={toggleFilter} onClear={clearFilters} />
          <div className="ca-main">
            {state.view === 'network' && (
              <AssociationGraph
                rootLabel={focalOrg?.name ?? (roleActive ? requirement.label : 'All companies')}
                rootSubtitle={focalOrg ? (roleActive ? requirement.label : 'Focus company') : 'Choose a focus company to see associations'}
                pockets={discovery.pockets}
                rowById={discovery.rowById}
                visibleIds={visibleIds}
                expanded={expanded}
                selected={state.selected}
                compare={compare}
                onTogglePocket={togglePocket}
                onExpandAll={() => set({ expanded: discovery.pockets.map((pocket) => pocket.id) })}
                onCollapseAll={() => set({ expanded: 'none' })}
                onSelect={selectOrg}
                onRecentre={recentre}
                onShowPocketInTable={showPocketInTable}
                onBack={() => navigate(-1)}
              />
            )}
            {state.view === 'pockets' && (
              <PocketsView pockets={discovery.pockets} rowById={discovery.rowById} visibleIds={visibleIds} expanded={expanded} selected={state.selected} compare={compare} onTogglePocket={togglePocket} onSelect={selectOrg} />
            )}
            {state.view === 'table' && (
              <CompanyTable
                graph={graph}
                rows={filtered}
                page={state.page}
                selected={state.selected}
                compare={compare}
                onPage={(page) => set({ page: page > 1 ? String(page) : null })}
                onSelect={selectOrg}
                onSetSelection={(ids) => set({ compare: ids }, true)}
              />
            )}
            <p className="intel-muted ca-limitations">{LIMITATIONS[0]} {LIMITATIONS[1]}</p>
          </div>
          {state.selected && (
            <CompanyInspector
              graph={graph}
              organizationId={state.selected}
              row={selectedRow}
              focalId={state.focus}
              roleActive={roleActive}
              compared={compare.has(state.selected)}
              onClose={() => set({ org: null }, true)}
              onRecentre={recentre}
              onToggleCompare={(id) => selectOrg(id, true)}
              onOverride={(id, tier, reason) => update((ws, ctx) => setOverride(ws, ctx, contextKey, id, tier, reason, 'recruiter'))}
              onClearOverride={(id) => update((ws, ctx) => clearOverride(ws, ctx, contextKey, id))}
              onAssociate={(id, reason) => (state.focus ? update((ws, ctx) => addCuratedAssociation(ws, ctx, state.focus as string, id, reason, 'recruiter')) : 'Choose a focus company first')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

