import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { FILTER_PARAM } from '../components/associations/explorerState'
import { PrivateNotice, TierBadge } from '../components/intelligence/IntelBits'
import { useNoIndex } from '../hooks/useNoIndex'
import { useIntelligenceGraph } from '../data/intelligence/useIntelligence'
import { addTargets, deletePool, resolvePool } from '../data/workspace/operations'
import type { SavedTargetPool } from '../data/workspace/types'
import { useWorkspace, workspaceStoreInfo } from '../data/workspace/useWorkspace'

function explorerUrl(pool: SavedTargetPool): string {
  const params = new URLSearchParams()
  const { query } = pool
  if (query.focalId) params.set('focus', query.focalId)
  if (pool.searchId) params.set('context', `search:${pool.searchId}`)
  else if (query.roleContextId) params.set('context', query.roleContextId)
  if (query.scope === 'all') params.set('scope', 'all')
  for (const [key, param] of Object.entries(FILTER_PARAM)) {
    const values = query.filters[key as keyof typeof FILTER_PARAM]
    if (values.length) params.set(param, values.join(','))
  }
  if (query.filters.q) params.set('q', query.filters.q)
  params.set('view', 'table')
  return `/company-associations?${params.toString()}`
}

export function TargetPoolsPage() {
  useNoIndex()
  const graph = useIntelligenceGraph()
  const { workspace, update } = useWorkspace()
  const baseId = useId()
  const [message, setMessage] = useState<string | null>(null)
  const [assignmentFor, setAssignmentFor] = useState<Record<string, string>>({})

  useEffect(() => {
    document.title = 'SA Talent Map | Target pools'
  }, [])

  const resolved = useMemo(() => new Map(workspace.pools.map((pool) => [pool.id, resolvePool(graph, pool)])), [graph, workspace.pools])

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Target pools' }]} />
        <div className="page-head">
          <div>
            <h1>Saved target pools</h1>
            <p>Snapshot pools keep the exact list you saved and show what has changed since. Dynamic pools re-run the saved query against current data.</p>
          </div>
        </div>
        <PrivateNotice description={workspaceStoreInfo().description} />
        {message && (
          <p className="ca-status" role="status">
            {message}
          </p>
        )}
        {workspace.pools.length === 0 ? (
          <p className="intel-muted">
            No pools yet. Select companies in the <Link to="/company-associations">Company Association Explorer</Link> and save them as a pool.
          </p>
        ) : (
          <ul className="intel-target-list">
            {workspace.pools.map((pool) => {
              const result = resolved.get(pool.id)
              if (!result) return null
              const selectId = `${baseId}-${pool.id}`
              return (
                <li key={pool.id} className="intel-target">
                  <div className="intel-target-head">
                    <h2 className="ca-pocket-title">{pool.name}</h2>
                    <span className="chip">{pool.mode === 'snapshot' ? 'Snapshot' : 'Dynamic'}</span>
                    <span className="intel-muted">
                      {result.organizationIds.length} companies · saved {pool.createdAt.slice(0, 10)}
                    </span>
                    <Link className="btn btn-ghost btn-sm" to={explorerUrl(pool)}>
                      Open query in explorer
                    </Link>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => update((ws, ctx) => deletePool(ws, ctx, pool.id))} aria-label={`Delete pool ${pool.name}`}>
                      Delete
                    </button>
                  </div>
                  {pool.mode === 'snapshot' && (result.added.length > 0 || result.removed.length > 0 || result.tierChanged.length > 0) && (
                    <p className="intel-muted">
                      Since saving: {result.added.length} new matches for the query, {result.removed.length} no longer match, {result.tierChanged.length} changed tier.
                    </p>
                  )}
                  <ul className="intel-org-list">
                    {result.organizationIds.map((orgId) => (
                      <li key={orgId}>
                        <Link to={`/organizations/${orgId}`}>{graph.organizationById.get(orgId)?.name ?? orgId}</Link> {result.tiers[orgId] && <TierBadge tier={result.tiers[orgId]} />}
                      </li>
                    ))}
                  </ul>
                  {workspace.searches.length > 0 && (
                    <div className="ca-inspector-actions">
                      <label htmlFor={selectId} className="sr-only">
                        Assignment for pool {pool.name}
                      </label>
                      <select id={selectId} className="filter-select ca-select-sm" value={assignmentFor[pool.id] ?? ''} onChange={(event) => setAssignmentFor((current) => ({ ...current, [pool.id]: event.target.value }))}>
                        <option value="">Add all to assignment…</option>
                        {workspace.searches.map((search) => (
                          <option key={search.id} value={search.id}>
                            {search.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={!assignmentFor[pool.id]}
                        onClick={() => {
                          let added = 0
                          const error = update((ws, ctx) => {
                            const out = addTargets(ws, ctx, assignmentFor[pool.id], result.organizationIds.map((orgId) => ({ organizationId: orgId, tier: result.tiers[orgId] ?? null })), 'pool')
                            added = out.added
                            return out.workspace
                          })
                          setMessage(error ?? `Added ${added} companies from ${pool.name}`)
                        }}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
