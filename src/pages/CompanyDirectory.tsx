import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Download, SlidersHorizontal } from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { Pagination } from '../components/ui/Pagination'
import { SkeletonPage } from '../components/ui/LoadingSpinner'
import { useDialogLayer } from '../hooks/useDialogLayer'
import { useData } from '../context/DataContext'
import { useCompanyUniverse } from '../hooks/useCompanyUniverse'
import { atlasNodeTitle, isUnclassifiedBranch, UNCLASSIFIED_BRANCH_ID } from '../data/organizations/atlas'
import {
  companyExportColumns,
  exportCompanyViewsCsv,
  filterCompanyViews,
  paginate,
  summarizeViews,
  viewsAtNode,
} from '../data/organizations/universeView'
import type { CompanyView } from '../data/organizations/universeView'
import { readFilters, writeFilters } from '../data/organizations/query'


import { CompanyFilters } from '../components/atlas/CompanyFilters'
import { UniversalCompanyCard } from '../components/intelligence/UniversalCompanyCard'

type SortKey = 'name' | 'footprint' | 'professionals'

const SORT_LABELS: Record<SortKey, string> = {
  name: 'Company name (A–Z)',
  footprint: 'Indicative footprint',
  professionals: 'Mapped professionals',
}

const PAGE_SIZE = 24
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
 * The universal company directory.
 *
 * This replaces the credit-risk-only list that used to live here. Every
 * organisation Maps holds - curated records and employers known only from a
 * dataset - is one entry here, reachable by the same canonical id the atlas, the
 * dossier and the recruitment workflows use.
 *
 * Credit risk survives as a track-specific entry point and a dataset filter, not
 * as the definition of what a company is.
 */
export function CompanyDirectory() {
  useEffect(() => { document.title = 'SA Talent Map | South African company universe' }, [])

  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { data, loading } = useData()

  const creditRisk = useMemo(() => (data
    ? data.companies.map((company) => ({ name: company.name, segment: company.segment }))
    : []), [data])

  const { index, atlas, views } = useCompanyUniverse({ creditRiskCompanies: creditRisk })

  const nodeParam = searchParams.get('node') ?? ''
  const nodeId = nodeParam && (atlas.nodes.has(nodeParam) || isUnclassifiedBranch(nodeParam)) ? nodeParam : null
  const datasetFilter = searchParams.get('dataset') ?? ''
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const sort = (searchParams.get('sort') as SortKey | null) ?? 'name'
  const filters = useMemo(() => readFilters(searchParams), [searchParams])

  const setParams = useCallback((mutate: (params: URLSearchParams) => URLSearchParams) => {
    setSearchParams((previous) => mutate(new URLSearchParams(previous)), { replace: true })
  }, [setSearchParams])

  const scoped = useMemo(
    () => (nodeId ? viewsAtNode(views, atlas, index, nodeId) : views),
    [views, atlas, index, nodeId],
  )
  const filtered = useMemo(() => {
    const byFilters = filterCompanyViews(scoped, filters, index)
    if (!datasetFilter) return byFilters
    return byFilters.filter((view) => view.datasets.includes(datasetFilter))
  }, [scoped, filters, index, datasetFilter])

  const sorted = useMemo(() => {
    const rows = [...filtered]
    if (sort === 'professionals') {
      rows.sort((left, right) => (
        right.mappedProfessionals - left.mappedProfessionals
        || left.name.localeCompare(right.name)
      ))
      return rows
    }
    if (sort === 'footprint') {
      // Band order is the declared band order; within a band the order is the
      // company name, because a footprint band is not a precise rank.
      const order = new Map(views.map((view, position) => [view.organizationId, position]))
      rows.sort((left, right) => {
        const leftBand = BAND_ORDER.indexOf(left.footprint)
        const rightBand = BAND_ORDER.indexOf(right.footprint)
        if (leftBand !== rightBand) return leftBand - rightBand
        return (order.get(left.organizationId) ?? 0) - (order.get(right.organizationId) ?? 0)
      })
      return rows
    }
    return rows
  }, [filtered, sort, views])

  const summary = useMemo(() => summarizeViews(filtered), [filtered])
  const pageRows = useMemo(() => paginate(sorted, page, PAGE_SIZE), [sorted, page])

  const closeFilters = useCallback(() => setFiltersOpen(false), [])
  const filtersLayer = useDialogLayer<HTMLDivElement>(filtersOpen, closeFilters)

  const exportCsv = useCallback(() => {
    download(
      'sa-company-universe.csv',
      exportCompanyViewsCsv(filtered, companyExportColumns(index)),
      'text/csv;charset=utf-8',
    )
  }, [filtered, index])

  if (loading) return <SkeletonPage variant="grid" cards={6} />

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: nodeId ? 'Industry Atlas' : 'Companies', to: nodeId ? '/industry-atlas' : undefined },
    ...(nodeId ? [{ label: atlasNodeTitle(atlas, nodeId) }] : []),
    ...(nodeId ? [{ label: 'Companies' }] : []),
  ]

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={crumbs} />

          <header className="page-head">
            <div>
              <h1>{nodeId ? `Companies in ${atlasNodeTitle(atlas, nodeId)}` : 'South African company universe'}</h1>
              <p>
                Every organisation Maps holds, in one directory: curated company records and
                employers known only from a dataset. One company has one record here, reachable by
                the same identifier the Industry Atlas, the company dossier and recruitment
                targeting all use. Credit risk is a dataset filter, not the definition of the
                universe.
              </p>
            </div>
            <div className="page-head-aside">
              <span className="page-head-meta"><b>{summary.organizations}</b> in view</span>
              <span className="page-head-meta"><b>{views.length}</b> in the universe</span>
              <span className="page-head-meta"><b>{summary.verified}</b> verified</span>
              <span className="page-head-meta"><b>{summary.datasetOnly}</b> dataset-only</span>
            </div>
          </header>

          <section className="page-toolbar">
            <input
              type="search"
              className="filter-search-input"
              value={filters.query}
              onChange={(event) => setParams((params) => {
                const next = new URLSearchParams(params)
                if (event.target.value) next.set('q', event.target.value)
                else next.delete('q')
                next.delete('page')
                return next
              })}
              placeholder="Search companies, aliases, industries, places…"
              aria-label="Search the company universe"
            />
            <div className="select-group">
              <select
                className="filter-select"
                value={sort}
                onChange={(event) => setParams((params) => { params.set('sort', event.target.value); params.delete('page'); return params })}
                aria-label="Sort companies"
              >
                {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                  <option key={key} value={key}>{SORT_LABELS[key]}</option>
                ))}
              </select>
              <select
                className="filter-select"
                value={datasetFilter}
                onChange={(event) => setParams((params) => {
                  if (event.target.value) params.set('dataset', event.target.value)
                  else params.delete('dataset')
                  params.delete('page')
                  return params
                })}
                aria-label="Filter by source dataset"
              >
                <option value="">All sources</option>
                <option value="credit-risk">Credit risk dataset (track entry point)</option>
                <option value="accounting-finance">Accounting &amp; finance dataset</option>
                <option value="search-bank">Search bank dataset</option>
                <option value="contacts">Contact directory (5,070 contacts)</option>
              </select>
            </div>
            <button type="button" className="facet-filter-trigger" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen} aria-haspopup="dialog">
              <SlidersHorizontal size={15} aria-hidden /> Filters
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={exportCsv}>
              <Download size={13} aria-hidden /> Export {filtered.length}
            </button>
          </section>

          {nodeId && (
            <p className="callout">
              Scoped to <strong>{atlasNodeTitle(atlas, nodeId)}</strong>.{' '}
              <Link to={`/industry-atlas?node=${encodeURIComponent(nodeId)}`}>Open this branch in the Industry Atlas</Link>{' '}
              {' · '}
              <button
                type="button"
                className="assoc-link-button"
                onClick={() => setParams((params) => { params.delete('node'); params.delete('page'); return params })}
              >
                Clear branch scope
              </button>
            </p>
          )}

          <div className="facet-layout">
            <aside className="facet-sidebar" aria-label="Company filters">
              <h2 className="facet-heading">Filters</h2>
              <CompanyFilters
                views={nodeId ? scoped : views}
                filters={filters}
                index={index}
                idPrefix="directory-side"
                onChange={(next) => setParams((params) => writeFilters(params, next))}
              />
              <h2 className="facet-heading">Coverage of this view</h2>
              <ul className="assoc-coverage-list">
                <li><span>Verified records</span><span className="assoc-coverage-counts">{summary.verified}</span></li>
                <li><span>Pending verification</span><span className="assoc-coverage-counts">{summary.pendingVerification}</span></li>
                <li><span>With mapped professionals</span><span className="assoc-coverage-counts">{summary.withMappedProfessionals}</span></li>
                <li><span>With a footprint band</span><span className="assoc-coverage-counts">{summary.footprintEstablished}</span></li>
                <li><span>Not yet classified</span><span className="assoc-coverage-counts">{summary.datasetOnly}</span></li>
              </ul>
              <p className="assoc-coverage-note">
                Mapped coverage only. This is not a claim that every South African company has been
                identified.
              </p>
            </aside>

            <section aria-label="Company results">
              {filtered.length === 0 ? (
                <EmptyState
                  title="No companies match these filters"
                  description="Widen the filters, or clear the branch scope. An empty result is reported honestly rather than backfilled."
                  action={filters.query ? { label: 'Clear search', to: '/companies' } : undefined}
                />
              ) : (
                <>
                  <div className="grid grid-3">
                    {pageRows.rows.map((view) => (
                      <UniversalCompanyCard key={view.organizationId} view={view} />
                    ))}
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
          </div>

          <p className="assoc-coverage-note">
            {atlas.totals.unclassifiedOrganizations} employers are known to Maps only from a dataset
            and have no national taxonomy placement yet.{' '}
            <Link to={`/companies?node=${encodeURIComponent(UNCLASSIFIED_BRANCH_ID)}`}>
              Open the unclassified research backlog
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="assoc-drawer-host" ref={filtersLayer} hidden={!filtersOpen}>
        {filtersOpen && (
          <div className="facet-drawer" role="dialog" aria-modal="true" aria-label="Company filters">
            <div className="facet-drawer-head">
              <h2 className="facet-heading">Filters</h2>
              <button type="button" className="facet-drawer-close" onClick={closeFilters} aria-label="Close filters">Close</button>
            </div>
            <div className="facet-drawer-body">
              <CompanyFilters
                views={nodeId ? scoped : views}
                filters={filters}
                index={index}
                idPrefix="directory-drawer"
                onChange={(next) => setParams((params) => writeFilters(params, next))}
              />
            </div>
            <div className="facet-drawer-foot">
              <button type="button" className="btn btn-primary facet-drawer-apply" onClick={closeFilters}>Show results</button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

const BAND_ORDER: CompanyView['footprint'][] = [
  'major-national',
  'large-multi-site',
  'regional-specialist',
  'smaller-emerging',
  'not-established',
]
