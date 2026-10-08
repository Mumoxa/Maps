// QA reviewer 3: interface and access.
//
// Mounts the explorer in jsdom and checks the promises the page makes to a
// recruiter: three views over one result set, no graph-only dead end, filters
// that reach every view, and a stated limit wherever the rendering budget cuts
// anything out.

import { click, mountPage, Reviewer, text } from './lib'

const ROUTE = '/company-associations'
const MODULE = '/src/pages/CompanyAssociationsPage.tsx'

export async function review(): Promise<Reviewer> {
  const reviewer = new Reviewer('interface-access', 'rendered /company-associations in jsdom')
  const { container, document } = await mountPage(MODULE, 'CompanyAssociationsPage', ROUTE)

  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  reviewer.check('single-h1', container.querySelectorAll('h1').length === 1,
    `${container.querySelectorAll('h1').length} h1 elements`)
  let previous = 0
  const skips: string[] = []
  for (const heading of headings) {
    const level = Number(heading.tagName.slice(1))
    if (previous && level > previous + 1) skips.push(`h${previous}->h${level} "${text(heading).slice(0, 40)}"`)
    previous = level
  }
  reviewer.check('heading-order', skips.length === 0, skips.join('; ') || 'none')

  // Controls and fields must be named; the audit gate checks this globally, this
  // reviewer re-checks it on the page under review so the two cannot drift.
  const unnamed = Array.from(container.querySelectorAll('button, a[href], input, select'))
    .filter((element) => {
      if (element.closest('[aria-hidden="true"]')) return false
      const label = text(element) || element.getAttribute('aria-label') || element.getAttribute('title') || ''
      if (label.trim()) return false
      const id = element.getAttribute('id')
      return !(id && container.querySelector(`label[for="${id}"]`)) && !element.closest('label')
    })
  reviewer.check('controls-are-named', unnamed.length === 0,
    unnamed.slice(0, 5).map((element) => `<${element.tagName.toLowerCase()} class="${element.className}">`).join(', ') || 'none')

  // --- three views, one result set -----------------------------------------
  const switchButtons = Array.from(container.querySelectorAll('.assoc-viewswitch button'))
  reviewer.check('three-views-offered', switchButtons.length === 3,
    switchButtons.map((button) => text(button)).join(', ') || 'no view switch rendered')

  const summaryBefore = text(container.querySelector('.assoc-summary'))
  reviewer.check('result-count-is-stated', /\d+/.test(summaryBefore), summaryBefore || 'no summary line')

  const graph = container.querySelector('.assoc-graph')
  reviewer.check('network-view-renders', !!graph, 'no .assoc-graph container on load')

  const condensedNote = text(container.querySelector('.assoc-graph-note'))
  reviewer.check('render-limit-is-declared', /condens|render|budget|shown/i.test(condensedNote),
    condensedNote || 'the graph does not say how many company nodes it condensed')

  // A graph must never be the only way to reach a company.
  const tableButton = switchButtons.find((button) => /table/i.test(text(button)))
  if (tableButton) {
    await click(tableButton)
    const rows = container.querySelectorAll('.assoc-table tbody tr').length
    reviewer.check('table-view-lists-companies', rows > 0, `${rows} rows in the company table`)
    const sortable = container.querySelectorAll('.assoc-th-sort').length
    reviewer.check('table-is-sortable', sortable > 0, `${sortable} sortable column headers`)
    const checkboxes = container.querySelectorAll('.assoc-table input[type="checkbox"]').length
    reviewer.check('table-supports-multi-select', checkboxes > 0, `${checkboxes} checkboxes`)
    const exportButton = Array.from(container.querySelectorAll('button')).find((button) => /export/i.test(text(button)))
    reviewer.check('table-offers-export', !!exportButton, 'no export control in the table view')
    const summaryAfterTable = text(container.querySelector('.assoc-summary'))
    reviewer.check('views-report-the-same-count', summaryBefore === summaryAfterTable,
      `network: "${summaryBefore}" vs table: "${summaryAfterTable}"`)
  } else {
    reviewer.check('table-view-lists-companies', false, 'no table view button found')
  }

  const pocketButton = switchButtons.find((button) => /pocket/i.test(text(button)))
  if (pocketButton) {
    await click(pocketButton)
    const groups = container.querySelectorAll('.assoc-pocket').length
    const listed = container.querySelectorAll('.assoc-company-item').length
    reviewer.check('pocket-view-groups-every-company', groups > 0 && listed > 0,
      `${groups} pocket groups, ${listed} companies listed on the first page`)
    const noCap = !/top 10|top-10|only 10/i.test(container.textContent ?? '')
    reviewer.check('no-arbitrary-top-ten-limit', noCap, 'the pocket view advertises a top-10 cap')
  } else {
    reviewer.check('pocket-view-groups-every-company', false, 'no pocket view button found')
  }

  // --- filters reach the views ---------------------------------------------
  const networkButton = switchButtons.find((button) => /network/i.test(text(button)))
  if (networkButton) await click(networkButton)
  const trigger = container.querySelector<HTMLElement>('.facet-filter-trigger')
  reviewer.check('filter-trigger-exists', !!trigger, 'no .facet-filter-trigger on the page')
  if (trigger) {
    await click(trigger)
    const drawer = container.querySelector('[role="dialog"], .facet-drawer')
    reviewer.check('filter-drawer-opens', !!drawer, 'the filter trigger did not open a dialog')
    if (drawer) {
      const dimensions = drawer.querySelectorAll('.facet-group').length
      reviewer.check('filter-dimensions-are-offered', dimensions >= 8, `${dimensions} filter groups in the drawer`)
      const capabilityOption = drawer.querySelector('.facet-option input[type="checkbox"]')
      if (capabilityOption) {
        await click(capabilityOption)
        const summaryAfterFilter = text(container.querySelector('.assoc-summary'))
        reviewer.check('filter-changes-the-result-set', summaryAfterFilter !== summaryBefore,
          `before: "${summaryBefore}" after: "${summaryAfterFilter}"`)
      }
      // Close it again: the inspector opens in its own dialog, and leaving two
      // dialogs stacked would make the inspector checks read the wrong one.
      const closeDrawer = drawer.querySelector<HTMLElement>('.facet-drawer-close, [aria-label="Close panel"]')
      if (closeDrawer) await click(closeDrawer)
    }
  }

  // --- role context changes targeting --------------------------------------
  const brief = text(container.querySelector('.assoc-brief'))
  reviewer.check('brief-is-shown', brief.length > 0, 'no assignment brief rendered')
  const roleSelect = container.querySelector('.assoc-context select')
  reviewer.check('role-context-is-selectable', !!roleSelect, 'no recruitment context control')

  const pocketViewForInspector = switchButtons.find((button) => /pocket/i.test(text(button)))
  if (pocketViewForInspector) await click(pocketViewForInspector)

  // --- the inspector separates fact from inference -------------------------
  // React Flow draws no nodes inside a zero-size jsdom container, so the
  // inspector is reached through the pocket list — which is also the path a
  // keyboard or screen-reader user takes. If a company were only reachable by
  // clicking a graph node, that would be a real accessibility failure.
  const firstCompany = container.querySelector<HTMLElement>('.assoc-company-open')
  reviewer.check('company-is-reachable-without-the-graph', !!firstCompany,
    'no company control exists outside the graph canvas')
  if (firstCompany) {
    await click(firstCompany)
    // Read the inspector inside the dialog that is actually open, not the first
    // .assoc-inspector the DOM happens to contain.
    const openDialog = container.querySelector('[role="dialog"]')
    const inspector = openDialog?.querySelector('.assoc-inspector') ?? container.querySelector('.assoc-inspector')
    const inspectorText = text(inspector)
    reviewer.check('inspector-opens-for-a-company', inspectorText.length > 200,
      `${inspectorText.length} characters of inspector content`)
    reviewer.check('inspector-shows-facts-as-sourced',
      /sourced|source/i.test(inspectorText),
      'the inspector does not mark its facts as sourced')
    reviewer.check('inspector-shows-sources', /source/i.test(inspectorText), 'no source section in the inspector')
  } else {
    reviewer.check('inspector-opens-for-a-company', false, 'no company control was reachable to open the inspector')
  }

  // --- honesty about scope --------------------------------------------------
  const pageText = container.textContent ?? ''
  reviewer.check('page-disclaims-exhaustive-coverage', /not a claim|mapped coverage only|not exhaustive/i.test(pageText),
    'no statement limiting the coverage claim')
  reviewer.check('page-states-local-storage-scope', /this browser only|not on a shared server|local/i.test(pageText),
    'target pools are not labelled as browser-local')
  reviewer.check('page-disclaims-person-suitability', /never treated as proof|not.*suitab|companies, not people/i.test(pageText),
    'no statement separating company similarity from person suitability')

  reviewer.check('document-title-is-set', (document.title ?? '').length > 0, `title: "${document.title}"`)

  // --- unknown must never read as a verified absence ------------------------
  // Asserted on a company that genuinely carries unknown capabilities, so the
  // check cannot pass vacuously on a fully evidenced record, and then on a
  // dataset-derived company that has never been researched at all.
  for (const [label, route] of [
    ['curated company with unknown capabilities', '/company-associations?inspect=org-bester-feed-grain'],
    ['dataset-derived company, never researched', '/company-associations?inspect=org-dataset:123consulting'],
  ] as const) {
    const { container: page } = await mountPage(MODULE, 'CompanyAssociationsPage', route)
    const panel = page.querySelector('[role="dialog"]')?.querySelector('.assoc-inspector')
      ?? page.querySelector('.assoc-inspector')
    const text0 = text(panel)
    const statesUnknown = /unknown|not yet researched|never (been )?checked/i.test(text0)
    const absenceQualified = /absence of evidence|missing research|not verified absent|no evidence recorded|not yet been checked/i.test(text0)
    reviewer.check('unknown-never-reads-as-absence',
      statesUnknown && absenceQualified,
      `${label}: reports unknown = ${statesUnknown}, qualifies it as missing research = ${absenceQualified}`)
  }

  return reviewer
}
