import { useEffect, useId, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { CompanySelector } from '../components/associations/CompanySelector'
import { RequirementEditor } from '../components/associations/RoleContextPicker'
import { downloadText, PrivateNotice, TierBadge } from '../components/intelligence/IntelBits'
import { useNoIndex } from '../hooks/useNoIndex'
import { bankCandidates, bankSearches } from '../data/searchBank/bank'
import { findOrganization } from '../data/intelligence/graph'
import { roleContexts, roleContextById } from '../data/intelligence/index'
import { assessOrganization, emptyRequirement, prepareRequirement, requirementFromTemplate } from '../data/intelligence/targeting'
import { useIntelligenceGraph } from '../data/intelligence/useIntelligence'
import {
  addSearchPerson,
  contextKeyFor,
  createSearch,
  deleteSearch,
  overridesFor,
  removeSearchPerson,
  removeTarget,
  setTargetStatus,
  updateSearch,
  updateSearchPerson,
} from '../data/workspace/operations'
import { parseWorkspace } from '../data/workspace/store'
import { ASSIGNMENT_STATUSES, SEARCH_PERSON_STATUSES, TARGET_STATUSES, type AssignmentStatus, type SearchPersonStatus, type TargetStatus } from '../data/workspace/types'
import { clearWorkspace, replaceWorkspace, useWorkspace, workspaceStoreInfo } from '../data/workspace/useWorkspace'

export function AssignmentsPage() {
  useNoIndex()
  const { id } = useParams()
  return id ? <AssignmentDetail id={id} /> : <AssignmentList />
}

function AssignmentList() {
  const graph = useIntelligenceGraph()
  const { workspace, update } = useWorkspace()
  const baseId = useId()
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [context, setContext] = useState('')
  const [focus, setFocus] = useState<string[]>([])
  const [bankSearchId, setBankSearchId] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const info = workspaceStoreInfo()

  useEffect(() => {
    document.title = 'SA Talent Map | Search assignments'
  }, [])

  const counts = useMemo(() => {
    const targets = new Map<string, number>()
    const people = new Map<string, number>()
    for (const row of workspace.targets) targets.set(row.searchId, (targets.get(row.searchId) ?? 0) + 1)
    for (const row of workspace.searchPeople) people.set(row.searchId, (people.get(row.searchId) ?? 0) + 1)
    return { targets, people }
  }, [workspace])

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Search bank', to: '/search-bank' }, { label: 'Assignments' }]} />
        <div className="page-head">
          <div>
            <h1>Search assignments</h1>
            <p>Each assignment holds a role requirement, target companies, people being approached and search-specific assessments.</p>
          </div>
        </div>
        <PrivateNotice description={info.description} />

        <section className="section-block" aria-labelledby={`${baseId}-new`}>
          <h2 id={`${baseId}-new`}>New assignment</h2>
          <form
            className="ca-form ca-form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              const template = roleContextById.get(context)
              const requirement = template ? requirementFromTemplate(template) : { ...emptyRequirement(), label: name.trim() || 'Custom requirement' }
              const error = update((ws, ctx) => createSearch(ws, ctx, { name, client, requirement, focalOrganizationIds: focus, bankSearchId: bankSearchId || null }).workspace)
              setMessage(error ?? `Created “${name.trim()}” in this browser`)
              if (!error) {
                setName('')
                setClient('')
                setFocus([])
              }
            }}
          >
            <label htmlFor={`${baseId}-name`}>Assignment name</label>
            <input id={`${baseId}-name`} className="ca-input" value={name} onChange={(event) => setName(event.target.value)} required />
            <label htmlFor={`${baseId}-client`}>Client (confidential)</label>
            <input id={`${baseId}-client`} className="ca-input" value={client} onChange={(event) => setClient(event.target.value)} />
            <label htmlFor={`${baseId}-context`}>Start from role template</label>
            <select id={`${baseId}-context`} className="filter-select" value={context} onChange={(event) => setContext(event.target.value)}>
              <option value="">Blank requirement</option>
              {roleContexts.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </select>
            <label htmlFor={`${baseId}-bank`}>Link to Search Bank search</label>
            <select id={`${baseId}-bank`} className="filter-select" value={bankSearchId} onChange={(event) => setBankSearchId(event.target.value)}>
              <option value="">{bankSearches.length ? 'Not linked' : 'No Search Bank searches loaded'}</option>
              {bankSearches.map((search) => (
                <option key={search.id} value={search.id}>
                  {search.name}
                </option>
              ))}
            </select>
            <div className="ca-form-wide">
              <CompanySelector graph={graph} value={null} label="Add client or focus company" onSelect={(orgId) => orgId && setFocus((list) => (list.includes(orgId) ? list : [...list, orgId]))} />
              <p className="ca-chip-list">
                {focus.map((orgId) => (
                  <span key={orgId} className="chip">
                    {graph.organizationById.get(orgId)?.name}
                    <button type="button" className="ca-chip-remove" aria-label={`Remove ${graph.organizationById.get(orgId)?.name}`} onClick={() => setFocus((list) => list.filter((item) => item !== orgId))}>
                      ×
                    </button>
                  </span>
                ))}
              </p>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Create assignment
            </button>
          </form>
          {message && (
            <p className="ca-status" role="status">
              {message}
            </p>
          )}
        </section>

        <section className="section-block" aria-labelledby={`${baseId}-list`}>
          <h2 id={`${baseId}-list`}>Assignments ({workspace.searches.length})</h2>
          {workspace.searches.length === 0 ? (
            <p className="intel-muted">No assignments in this browser yet.</p>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <caption className="sr-only">Search assignments in this browser</caption>
                <thead>
                  <tr>
                    <th scope="col">Assignment</th>
                    <th scope="col">Client</th>
                    <th scope="col">Status</th>
                    <th scope="col">Targets</th>
                    <th scope="col">People</th>
                  </tr>
                </thead>
                <tbody>
                  {workspace.searches.map((search) => (
                    <tr key={search.id}>
                      <td>
                        <Link to={`/search-bank/assignments/${search.id}`} className="cell-strong">
                          {search.name}
                        </Link>
                      </td>
                      <td>{search.client || <span className="intel-muted">Not set</span>}</td>
                      <td>{search.status}</td>
                      <td className="ca-num">{counts.targets.get(search.id) ?? 0}</td>
                      <td className="ca-num">{counts.people.get(search.id) ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="section-block" aria-labelledby={`${baseId}-backup`}>
          <h2 id={`${baseId}-backup`}>Workspace backup</h2>
          <p className="intel-muted">The workspace lives only in this browser. Export a backup to keep it or move it to another device; treat the file as confidential.</p>
          <div className="ca-inspector-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => downloadText(`talent-map-workspace-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(workspace, null, 2), 'application/json')}>
              Export backup
            </button>
            <label htmlFor={`${baseId}-restore`} className="btn btn-ghost btn-sm">
              Restore from backup
            </label>
            <input
              id={`${baseId}-restore`}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0]
                if (!file) return
                try {
                  const parsed = parseWorkspace(JSON.parse(await file.text()))
                  if (!parsed) throw new Error('Not a workspace backup')
                  replaceWorkspace(parsed)
                  setMessage('Workspace restored from backup')
                } catch (error) {
                  setMessage(`Restore failed: ${(error as Error).message}`)
                }
              }}
            />
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (window.confirm('Delete every assignment, pool, override and private import in this browser?')) clearWorkspace()
              }}
            >
              Clear workspace
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function AssignmentDetail({ id }: { id: string }) {
  const graph = useIntelligenceGraph()
  const { workspace, update } = useWorkspace()
  const baseId = useId()
  const [openCompany, setOpenCompany] = useState<string | null>(null)
  const search = workspace.searches.find((row) => row.id === id) ?? null

  useEffect(() => {
    document.title = `SA Talent Map | ${search ? search.name : 'Assignment not found'}`
  }, [search])

  const assessments = useMemo(() => {
    if (!search) return new Map()
    const prepared = prepareRequirement(graph, search.requirement)
    const overrides = overridesFor(workspace, contextKeyFor(search.id, null))
    const out = new Map<string, ReturnType<typeof assessOrganization>>()
    for (const target of workspace.targets) if (target.searchId === search.id) out.set(target.organizationId, assessOrganization(graph, target.organizationId, prepared, overrides.get(target.organizationId) ?? null))
    return out
  }, [graph, search, workspace])

  const bankByOrg = useMemo(() => {
    const map = new Map<string, typeof bankCandidates>()
    for (const candidate of bankCandidates) {
      const orgId = candidate.employer ? findOrganization(graph, candidate.employer) : null
      if (!orgId) continue
      map.set(orgId, [...(map.get(orgId) ?? []), candidate])
    }
    return map
  }, [graph])

  if (!search) {
    return (
      <div className="page">
        <div className="container">
          <EmptyState title="Assignment not found" description="Assignments are stored in the browser where they were created. Restore a workspace backup to see it here." action={{ label: 'All assignments', to: '/search-bank/assignments' }} />
        </div>
      </div>
    )
  }

  const targets = workspace.targets.filter((row) => row.searchId === search.id)
  const people = workspace.searchPeople.filter((row) => row.searchId === search.id)
  const peopleIds = new Set(people.map((row) => row.personId))
  const explorerUrl = `/company-associations?context=search:${search.id}${search.focalOrganizationIds[0] ? `&focus=${search.focalOrganizationIds[0]}` : ''}`

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Search bank', to: '/search-bank' }, { label: 'Assignments', to: '/search-bank/assignments' }, { label: search.name }]} />
        <div className="page-head">
          <div>
            <h1>{search.name}</h1>
            <p>
              {search.client ? `Client: ${search.client}. ` : ''}
              {search.focalOrganizationIds.length ? `Focus: ${search.focalOrganizationIds.map((orgId) => graph.organizationById.get(orgId)?.name ?? orgId).join(', ')}.` : ''}
            </p>
          </div>
          <div className="page-head-aside">
            <Link className="btn btn-primary btn-sm" to={explorerUrl}>
              Find target companies
            </Link>
          </div>
        </div>
        <PrivateNotice description={workspaceStoreInfo().description} />

        <div className="ca-controls">
          <div className="ca-field">
            <label htmlFor={`${baseId}-status`} className="ca-label">
              Status
            </label>
            <select id={`${baseId}-status`} className="filter-select" value={search.status} onChange={(event) => update((ws, ctx) => updateSearch(ws, ctx, search.id, { status: event.target.value as AssignmentStatus }))}>
              {ASSIGNMENT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="ca-field">
            <span className="ca-label">Search Bank link</span>
            <span>{search.bankSearchId ? bankSearches.find((row) => row.id === search.bankSearchId)?.name ?? search.bankSearchId : 'Not linked'}</span>
          </div>
        </div>

        <details className="ca-requirement-box" open>
          <summary>
            Requirement <span className="intel-muted">(drives tiers for this assignment only)</span>
          </summary>
          <RequirementEditor graph={graph} requirement={search.requirement} onChange={(key, values) => update((ws, ctx) => updateSearch(ws, ctx, search.id, { requirement: { ...search.requirement, [key]: values } }))} />
        </details>

        <section className="section-block" aria-labelledby={`${baseId}-targets`}>
          <h2 id={`${baseId}-targets`}>Target companies ({targets.length})</h2>
          {targets.length === 0 ? (
            <p className="intel-muted">
              No targets yet. Use <Link to={explorerUrl}>the explorer</Link>, select companies and add them to this assignment.
            </p>
          ) : (
            <ul className="intel-target-list">
              {targets.map((target) => {
                const org = graph.organizationById.get(target.organizationId)
                const assessment = assessments.get(target.organizationId)
                const employees = (graph.employmentsByOrg.get(target.organizationId) ?? []).filter((row) => row.current)
                const bank = bankByOrg.get(target.organizationId) ?? []
                const isOpen = openCompany === target.organizationId
                return (
                  <li key={target.id} className="intel-target">
                    <div className="intel-target-head">
                      <Link to={`/organizations/${target.organizationId}`} className="cell-strong">
                        {org?.name ?? target.organizationId}
                      </Link>
                      {assessment && <TierBadge tier={assessment.tier} overridden={Boolean(assessment.override)} />}
                      {target.tierWhenAdded && assessment && target.tierWhenAdded !== assessment.tier && <span className="intel-muted">was {target.tierWhenAdded} when added</span>}
                      <label htmlFor={`${baseId}-ts-${target.id}`} className="sr-only">
                        Target status for {org?.name}
                      </label>
                      <select id={`${baseId}-ts-${target.id}`} className="filter-select ca-select-sm" value={target.status} onChange={(event) => update((ws, ctx) => setTargetStatus(ws, ctx, target.id, event.target.value as TargetStatus))}>
                        {TARGET_STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="btn btn-ghost btn-sm" aria-expanded={isOpen} onClick={() => setOpenCompany(isOpen ? null : target.organizationId)}>
                        {employees.length} people{bank.length ? ` · ${bank.length} in bank` : ''}
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => update((ws, ctx) => removeTarget(ws, ctx, target.id))} aria-label={`Remove ${org?.name} from targets`}>
                        Remove
                      </button>
                    </div>
                    {isOpen && (
                      <div className="intel-target-body">
                        {employees.length === 0 && bank.length === 0 && <p className="intel-muted">No mapped people at this company yet (unknown, not zero).</p>}
                        <ul className="intel-people">
                          {employees.map((row) => {
                            const person = graph.personById.get(row.personId)
                            if (!person) return null
                            return (
                              <li key={row.personId}>
                                <Link to={person.href}>{person.name}</Link> <span className="intel-muted">{row.title || person.title}</span>{' '}
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  disabled={peopleIds.has(row.personId)}
                                  onClick={() => update((ws, ctx) => addSearchPerson(ws, ctx, search.id, row.personId, target.organizationId).workspace)}
                                >
                                  {peopleIds.has(row.personId) ? 'In search' : 'Add to search'}
                                </button>
                              </li>
                            )
                          })}
                          {bank.map((candidate) => (
                            <li key={candidate.id}>
                              {candidate.fullName} <span className="intel-muted">Search Bank · {candidate.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="section-block" aria-labelledby={`${baseId}-people`}>
          <h2 id={`${baseId}-people`}>People in this search ({people.length})</h2>
          <p className="intel-muted">Assessments here belong to this search only. Working at a target company is not evidence of a skill.</p>
          {people.length === 0 ? (
            <p className="intel-muted">Nobody added yet.</p>
          ) : (
            <ul className="intel-target-list">
              {people.map((row) => {
                const person = graph.personById.get(row.personId)
                return (
                  <li key={row.id} className="intel-target">
                    <div className="intel-target-head">
                      {person ? <Link to={person.href}>{person.name}</Link> : row.personId}
                      <span className="intel-muted">{row.organizationId ? graph.organizationById.get(row.organizationId)?.name : ''}</span>
                      <label htmlFor={`${baseId}-ps-${row.id}`} className="sr-only">
                        Status for {person?.name}
                      </label>
                      <select id={`${baseId}-ps-${row.id}`} className="filter-select ca-select-sm" value={row.status} onChange={(event) => update((ws, ctx) => updateSearchPerson(ws, ctx, row.id, { status: event.target.value as SearchPersonStatus }))}>
                        {SEARCH_PERSON_STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => update((ws, ctx) => removeSearchPerson(ws, ctx, row.id))} aria-label={`Remove ${person?.name} from search`}>
                        Remove
                      </button>
                    </div>
                    <label htmlFor={`${baseId}-pa-${row.id}`} className="sr-only">
                      Search-specific assessment for {person?.name}
                    </label>
                    <textarea
                      id={`${baseId}-pa-${row.id}`}
                      className="ca-textarea"
                      rows={2}
                      placeholder="Assessment for this search only"
                      defaultValue={row.assessment}
                      onBlur={(event) => update((ws, ctx) => updateSearchPerson(ws, ctx, row.id, { assessment: event.target.value }))}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => {
            if (window.confirm(`Delete “${search.name}” and its targets, people and overrides from this browser?`)) update((ws, ctx) => deleteSearch(ws, ctx, search.id))
          }}
        >
          Delete assignment
        </button>
      </div>
    </div>
  )
}
