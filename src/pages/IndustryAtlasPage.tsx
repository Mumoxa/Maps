import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Download, SlidersHorizontal, TreeStructure } from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Drawer } from '../components/ui/Drawer'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { Pagination } from '../components/ui/Pagination'
import { useDialogLayer } from '../hooks/useDialogLayer'
import { useCompanyUniverse } from '../hooks/useCompanyUniverse'
import {
  UNCLASSIFIED_BRANCH_ID,
  atlasNodeTitle,
  childrenWithCounts,
  companiesAtNode,
  isUnclassifiedBranch,
} from '../data/organizations/atlas'
import { filterCompanyViews, groupByFootprint, paginate, summarizeViews, viewsAtNode } from '../data/organizations/universeView'
import type { CompanyView } from '../data/organizations/universeView'
import { companyExportColumns, exportCompanyViewsCsv } from '../data/organizations/universeView'
import { readFilters, writeFilters } from '../data/organizations/query'


import { TaxonomyTree } from '../components/atlas/TaxonomyTree'
import { CompanyFilters } from '../components/atlas/CompanyFilters'
import { CompanySummaryPanel } from '../components/atlas/CompanySummaryPanel'
import { FootprintBands } from '../components/atlas/FootprintBands'
import { rememberScope } from '../data/organizations/workspace'

type AtlasView = 'landscape' | 'table'

const VIEW_LABELS: Record<AtlasView, string> = {
  landscape: 'Company landscape',
  table: 'Company table',
}

const PAGE_SIZE = 40

/**
 * Every multi-select filter dimension, including `macroSectors`.
 *
 * `macroSectors` is supported by the filter panel and the filtering engine but
 * was previously missing from the page's URL read/write list, so a selected
 * macro-sector was dropped on the next navigation. Serialisation now derives
 * from the shared `FILTER_KEYS` contract instead of a hand-maintained list.
 */
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
 * The Industry Atlas: the default company-intelligence experience.
 *
 * It opens on the South African industry universe. No company is selected, no
 * recruitment brief is active, and no organisation is treated as the centre of
 * the product. Company focus is something a reader does, never something the
 * page assumes.
 */
export function IndustryAtlasPage() {
  useEffect(() => { document.title = 'SA Talent Map | Industry Atlas' }, [])

  const [searchParams, setSearchParams] = useSearchParams()
  const { index, atlas, views } = useCompanyUniverse()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(false)

  const nodeParam = searchParams.get('node') ?? ''
  const selectedNodeId = nodeParam && (atlas.nodes.has(nodeParam) || isUnclassifiedBranch(nodeParam))
    ? nodeParam
    : null
  const view: AtlasView = searchParams.get('view') === 'table' ? 'table' : 'landscape'
  const inspectId = searchParams.get('inspect') ?? ''
  const onlyPopulated = searchParams.get('gaps') !== 'all'
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const filters = useMemo(() => readFilters(searchParams), [searchParams])

  const setParams = useCallback((mutate: (params: URLSearchParams) => URLSearchParams) => {
    setSearchParams((previous) => mutate(new URLSearchParams(previous)), { replace: true })
  }, [setSearchParams])

  // Scope first by industry branch, then by filter. The branch is navigation;
  // filters narrow within it. Neither step introduces a focal company.
  const scoped = useMemo(
    () => (selectedNodeId ? viewsAtNode(views, atlas, index, selectedNodeId) : views),
    [views, atlas, index, selectedNodeId],
  )
  const filtered = useMemo(() => filterCompanyViews(scoped, filters, index), [scoped, filters, index])
  const summary = useMemo(() => summarizeViews(filtered), [filtered])

  const node = selectedNodeId && !isUnclassifiedBranch(selectedNodeId) ? atlas.nodes.get(selectedNodeId) : null
  const childNodes = useMemo(
    () => (selectedNodeId && !isUnclassifiedBranch(selectedNodeId) ? childrenWithCounts(atlas, selectedNodeId) : []),
    [atlas, selectedNodeId],
  )
  const branchCompanies = useMemo(
    () => (selectedNodeId ? companiesAtNode(atlas, index, selectedNodeId) : []),
    [atlas, index, selectedNodeId],
  )
  const filteredGroups = useMemo(() => groupByFootprint(filtered), [filtered])

  const inspectView = useMemo<CompanyView | null>(
    () => (inspectId ? filtered.find((entry) => entry.organizationId === inspectId)
      ?? scoped.find((entry) => entry.organizationId === inspectId)
      ?? views.find((entry) => entry.organizationId === inspectId)
      ?? null : null),
    [filtered, scoped, views, inspectId],
  )

  const pageRows = useMemo(() => paginate(filtered, page, PAGE_SIZE), [filtered, page])

  useEffect(() => {
    rememberScope({ nodeId: selectedNodeId ?? '' })
  }, [selectedNodeId])

  const openCompany = useCallback((organizationId: string) => {
    setParams((params) => { params.set('inspect', organizationId); return params })
    setInspectorOpen(true)
  }, [setParams])

  const closeInspector = useCallback(() => setInspectorOpen(false), [])
  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const filtersLayer = useDialogLayer<HTMLDivElement>(filtersOpen, closeFilters)
  const inspectorLayer = useDialogLayer<HTMLDivElement>(inspectorOpen, closeInspector)

  const exportCsv = useCallback(() => {
    const columns = companyExportColumns(index)
    download(
      `industry-atlas-${selectedNodeId ?? 'all-industries'}.csv`,
      exportCompanyViewsCsv(filtered, columns),
      'text/csv;charset=utf-8',
    )
  }, [index, filtered, selectedNodeId])

  const crumbs = useMemo(() => {
    const list = [{ label: 'Home', to: '/' }, { label: 'Industry Atlas' }]
    if (node) {
      for (const entry of node.path) list.push({ label: entry.name } as never)
    } else if (selectedNodeId) {
      list.push({ label: atlasNodeTitle(atlas, selectedNodeId) } as never)
    }
    return list
  }, [node, selectedNodeId, atlas])

  const linkSuffix = selectedNodeId ? `?from=${encodeURIComponent(selectedNodeId)}` : ''

  return (
    <ErrorBoundary>
      <main className="page">
        <div className="container">
          <Breadcrumb crumbs={crumbs} />

          <header className="page-head">
            <div>
              <h1>South African Industry Atlas</h1>
              <p>
                The national industry taxonomy with the companies Maps has mapped inside it. Explore
                sectors, sub-industries and operational niches, see how each industry is composed by
                indicative market footprint, and read the coverage gaps as gaps. No company is
                privileged here: every organisation, including every client, is an ordinary member of
                the universe.
              </p>
            </div>
            <div className="page-head-aside">
              <span className="page-head-meta"><b>{atlas.totals.mappedOrganizations}</b> companies mapped</span>
              <span className="page-head-meta"><b>{atlas.totals.taxonomyNodes}</b> taxonomy nodes</span>
              <span className="page-head-meta"><b>{atlas.totals.populatedBranches}</b> branches with companies</span>
              <span className="page-head-meta">
                <b>{atlas.totals.unclassifiedOrganizations}</b> not yet classified
              </span>
            </div>
          </header>

          <section className="atlas-controls" aria-label="Atlas controls">
            <div className="assoc-viewswitch" role="group" aria-label="Presentation mode">
              {(Object.keys(VIEW_LABELS) as AtlasView[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`btn btn-sm ${view === mode ? 'btn-primary' : 'btn-ghost'}`}
                  aria-pressed={view === mode}
                  onClick={() => setParams((params) => { params.set('view', mode); params.delete('page'); return params })}
                >
                  {VIEW_LABELS[mode]}
                </button>
              ))}
            </div>
            <button type="button" className="facet-filter-trigger" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen} aria-haspopup="dialog">
              <SlidersHorizontal size={15} aria-hidden /> Filters
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={exportCsv}>
              <Download size={13} aria-hidden /> Export {filtered.length} companies
            </button>
          </section>

          <div className="atlas-layout">
            <aside className="facet-sidebar atlas-sidebar" aria-label="Industry taxonomy">
              <TaxonomyTree
                atlas={atlas}
                selectedNodeId={selectedNodeId}
                onSelect={(nodeId) => setParams((params) => {
                  if (nodeId) params.set('node', nodeId)
                  else params.delete('node')
                  params.delete('page')
                  params.delete('inspect')
                  return params
                })}
                onlyPopulated={onlyPopulated}
                onToggleOnlyPopulated={() => setParams((params) => {
                  if (onlyPopulated) params.set('gaps', 'all')
                  else params.delete('gaps')
                  return params
                })}
              />
            </aside>

            <section className="atlas-main" aria-label="Industry branch">
              {selectedNodeId === null ? (
                <MacroSectorLanding
                  atlas={atlas}
                  onSelect={(nodeId) => setParams((params) => { params.set('node', nodeId); params.delete('page'); return params })}
                />
              ) : (
                <>
                  <div className="atlas-branch-head">
                    <h2>
                      <TreeStructure size={17} aria-hidden /> {atlasNodeTitle(atlas, selectedNodeId)}
                    </h2>
                    {node && <p className="atlas-branch-path">{node.path.map((entry) => entry.name).join('  ›  ')}</p>}
                    <dl className="atlas-coverage">
                      <div>
                        <dt>Companies in branch</dt>
                        <dd>{branchCompanies.length}</dd>
                      </div>
                      <div>
                        <dt>Verified</dt>
                        <dd>{node?.counts.verified ?? 0}</dd>
                      </div>
                      <div>
                        <dt>Pending verification</dt>
                        <dd>{node?.counts.pendingVerification ?? summary.pendingVerification}</dd>
                      </div>
                      <div>
                        <dt>With mapped professionals</dt>
                        <dd>{node?.counts.withMappedProfessionals ?? 0}</dd>
                      </div>
                      <div>
                        <dt>Footprint established</dt>
                        <dd>{node?.counts.footprintEstablished ?? 0}</dd>
                      </div>
                      <div>
                        <dt>Last research</dt>
                        <dd>{node?.lastResearchDate ?? 'not recorded'}</dd>
                      </div>
                    </dl>
                    <p className="assoc-coverage-note">
                      Coverage counts what Maps has researched. A zero is a gap in the map, not a
                      claim that no company operates there, and this is not a claim of national
                      completeness.
                    </p>
                  </div>

                  {childNodes.length > 0 && (
                    <section className="atlas-children" aria-labelledby="atlas-children-heading">
                      <h3 id="atlas-children-heading">
                        {node && node.node.level === 4 ? 'Operational niches' : 'Narrower branches'}
                      </h3>
                      <ul className="atlas-child-grid">
                        {childNodes.map((child) => (
                          <li key={child.id}>
                            <button
                              type="button"
                              className={`atlas-child ${child.counts.organizations === 0 ? 'atlas-child-empty' : ''}`}
                              onClick={() => setParams((params) => {
                                params.set('node', child.id)
                                params.delete('page')
                                params.delete('inspect')
                                return params
                              })}
                            >
                              <span className="atlas-child-name">{child.node.name}</span>
                              <span className="atlas-child-count">
                                {child.counts.organizations} mapped
                                {child.counts.organizations > 0
                                  ? ` · ${child.counts.footprintEstablished} with footprint`
                                  : ' · no mapped companies yet'}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </>
              )}

              {view === 'landscape' ? (
                <section aria-labelledby="atlas-landscape-heading">
                  <h3 id="atlas-landscape-heading">Company landscape by indicative footprint</h3>
                  {filtered.length === 0 ? (
                    <EmptyState
                      title="No companies match this branch and these filters"
                      description="Clear the filters, or choose a different branch. An empty branch is a real research gap and is reported as zero rather than filled in."
                    />
                  ) : (
                    <FootprintBands groups={filteredGroups} index={index} onOpenCompany={openCompany} linkSuffix={linkSuffix} />
                  )}
                </section>
              ) : (
                <section aria-labelledby="atlas-table-heading">
                  <h3 id="atlas-table-heading">
                    Companies in view ({filtered.length})
                  </h3>
                  {filtered.length === 0 ? (
                    <EmptyState title="No companies match" description="Widen the filters or choose another branch." />
                  ) : (
                    <>
                      <div className="data-table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th scope="col">Company</th>
                              <th scope="col">Industry placement</th>
                              <th scope="col">Indicative footprint</th>
                              <th scope="col">Geography</th>
                              <th scope="col">Mapped</th>
                              <th scope="col">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pageRows.rows.map((entry) => (
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
                                <td>{entry.footprint.replace(/-/g, ' ')}</td>
                                <td>{entry.provinces.join(', ') || 'No sourced location'}</td>
                                <td>{entry.mappedProfessionals}</td>
                                <td>{entry.status === 'verified' ? 'Verified' : 'Pending'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        page={page}
                        totalPages={pageRows.totalPages}
                        total={filtered.length}
                        onChange={(next) => setParams((params) => { params.set('page', String(next)); return params })}
                      />
                    </>
                  )}
                </section>
              )}

              {selectedNodeId !== null && (
                <section className="atlas-scope-links" aria-label="Next steps for this branch">
                  <h3>Take this industry further</h3>
                  <div className="atlas-scope-actions">
                    <Link className="btn btn-ghost btn-sm" to={`/companies?node=${encodeURIComponent(selectedNodeId)}`}>
                      Open this branch in the company directory
                    </Link>
                    <Link className="btn btn-ghost btn-sm" to={`/company-associations?node=${encodeURIComponent(selectedNodeId)}`}>
                      Explore associations in this branch
                    </Link>
                    <Link className="btn btn-ghost btn-sm" to={`/recruitment-targeting?node=${encodeURIComponent(selectedNodeId)}`}>
                      Apply a recruitment brief to this branch
                    </Link>
                  </div>
                  <p className="assoc-coverage-note">
                    Recruitment targeting is an application of this intelligence, never its organising
                    principle. No brief is active until you choose one.
                  </p>
                </section>
              )}
            </section>

            <aside className="atlas-inspector" aria-label="Company intelligence">
              {inspectView ? (
                <CompanySummaryPanel
                  index={index}
                  view={inspectView}
                  linkSuffix={linkSuffix}
                  onClose={() => setParams((params) => { params.delete('inspect'); return params })}
                />
              ) : (
                <div className="assoc-inspector-empty">
                  <h2>Company inspector</h2>
                  <p>
                    Select any company in the landscape to see its verified record, its indicative
                    footprint and the evidence behind both. Nothing is pre-selected: this panel stays
                    empty until you choose a company.
                  </p>
                  <p className="assoc-coverage-note">
                    {summary.organizations} companies in this view · {summary.verified} verified ·{' '}
                    {summary.datasetOnly} known only from a Maps dataset
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* Below 1024px the filter rail and the inspector become dialogs. */}
      <div className="assoc-drawer-host" ref={filtersLayer} hidden={!filtersOpen}>
        {filtersOpen && (
          <div className="facet-drawer" role="dialog" aria-modal="true" aria-label="Atlas filters">
            <div className="facet-drawer-head">
              <h2 className="facet-heading">Filters</h2>
              <button type="button" className="facet-drawer-close" onClick={closeFilters} aria-label="Close filters">Close</button>
            </div>
            <div className="facet-drawer-body">
              <CompanyFilters
                views={scoped}
                filters={filters}
                index={index}
                idPrefix="atlas-drawer"
                onChange={(next) => setParams((params) => writeFilters(params, next))}
              />
            </div>
            <div className="facet-drawer-foot">
              <button type="button" className="btn btn-primary facet-drawer-apply" onClick={closeFilters}>Show results</button>
            </div>
          </div>
        )}
      </div>

      {inspectorOpen && inspectView && (
        <Drawer
          isOpen={inspectorOpen}
          onClose={closeInspector}
          title={inspectView.name}
          subtitle="Company intelligence"
        >
          <div ref={inspectorLayer}>
            <CompanySummaryPanel index={index} view={inspectView} linkSuffix={linkSuffix} />
          </div>
        </Drawer>
      )}
    </ErrorBoundary>
  )
}

/**
 * The landing view: every macro-sector with its coverage.
 *
 * Market gaps are shown here rather than hidden, because an industry map that
 * only renders what it has already researched reads as complete when it is not.
 */
function MacroSectorLanding({
  atlas,
  onSelect,
}: {
  atlas: ReturnType<typeof useCompanyUniverse>['atlas']
  onSelect: (nodeId: string) => void
}) {
  const populated = atlas.roots.filter((root) => root.counts.organizations > 0)
  const empty = atlas.roots.filter((root) => root.counts.organizations === 0)

  return (
    <>
      <div className="atlas-branch-head">
        <h2>Sixteen national macro-sectors</h2>
        <p className="atlas-branch-path">
          Level 1 of the South African corporate taxonomy. Select a macro-sector to drill into its
          industries, sub-industries and operational niches, and to see the companies mapped in each.
        </p>
        <p className="assoc-coverage-note">
          Coverage counts what Maps has researched, so a zero is a gap in the map, not a claim that
          no company operates there. This is not a claim of national completeness.
        </p>
      </div>

      <section aria-labelledby="atlas-macro-heading">
        <h3 id="atlas-macro-heading">Macro-sectors with mapped companies ({populated.length})</h3>
        <ul className="atlas-macro-grid">
          {populated
            .slice()
            .sort((left, right) => right.counts.organizations - left.counts.organizations)
            .map((root) => (
              <li key={root.id}>
                <button type="button" className="atlas-macro" onClick={() => onSelect(root.id)}>
                  <span className="atlas-macro-name">{root.node.name}</span>
                  <span className="atlas-macro-count">{root.counts.organizations} companies</span>
                  <span className="atlas-macro-meta">
                    {root.counts.verified} verified · {root.counts.footprintEstablished} with footprint ·{' '}
                    {root.counts.withMappedProfessionals} with people
                  </span>
                  {root.node.saContext && <span className="atlas-macro-context">{root.node.saContext}</span>}
                </button>
              </li>
            ))}
        </ul>
      </section>

      {empty.length > 0 && (
        <section className="atlas-gaps" aria-labelledby="atlas-gaps-heading">
          <h3 id="atlas-gaps-heading">Market gaps: macro-sectors with nothing mapped yet ({empty.length})</h3>
          <p className="assoc-coverage-note">
            These branches are explorable and currently hold zero mapped organisations. They are
            shown as empty on purpose: populating them with placeholder companies would misrepresent
            what Maps has actually researched.
          </p>
          <ul className="atlas-gap-list">
            {empty.map((root) => (
              <li key={root.id}>
                <button type="button" className="atlas-gap" onClick={() => onSelect(root.id)}>
                  <span>{root.node.name}</span>
                  <span className="atlas-gap-count">0 mapped</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {atlas.totals.unclassifiedOrganizations > 0 && (
        <section className="atlas-gaps" aria-labelledby="atlas-unclassified-heading">
          <h3 id="atlas-unclassified-heading">
            Employers not yet placed in the taxonomy ({atlas.totals.unclassifiedOrganizations})
          </h3>
          <p className="assoc-coverage-note">
            Real employers referenced by existing Maps datasets that have no curated classification
            yet. They remain discoverable rather than being dropped.
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onSelect(UNCLASSIFIED_BRANCH_ID)}
          >
            Open the unclassified research backlog
          </button>
        </section>
      )}
    </>
  )
}
