// QA reviewer 3: interface and access.
//
// Mounts the company-intelligence surfaces in jsdom and checks the promises the
// product makes to a visitor:
//
//   - the industry atlas opens on the industry universe, with no company and no
//     recruitment brief selected
//   - company associations default to evidence groups, not a radial network
//   - every view that renders fewer companies than exist says so
//   - a company is reachable without a graph canvas
//   - filters reach every view
//   - unknown never reads as a verified absence
//
// The reviewer deliberately does NOT assert that a network is the default view.
// That was the old contract: a company-centred radial graph with a client at the
// centre, selected for every visitor. Asserting it would re-lock the defect.

import { click, mountPage, Reviewer, text } from './lib'

const ATLAS_MODULE = '/src/pages/IndustryAtlasPage.tsx'
const ASSOCIATIONS_MODULE = '/src/pages/CompanyAssociationsPage.tsx'

export async function review(): Promise<Reviewer> {
  const reviewer = new Reviewer(
    'interface-access',
    'rendered /industry-atlas and /company-associations in jsdom',
  )

  // ── The Industry Atlas: industry-first, nothing centred ──────────────────
  const atlas = await mountPage(ATLAS_MODULE, 'IndustryAtlasPage', '/industry-atlas')
  const atlasContainer = atlas.container
  const atlasText = atlasContainer.textContent ?? ''

  reviewer.check('atlas-single-h1', atlasContainer.querySelectorAll('h1').length === 1,
    `${atlasContainer.querySelectorAll('h1').length} h1 elements`)

  const atlasHeadings = Array.from(atlasContainer.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  let previous = 0
  const skips: string[] = []
  for (const heading of atlasHeadings) {
    const level = Number(heading.tagName.slice(1))
    if (previous && level > previous + 1) skips.push(`h${previous}->h${level} "${text(heading).slice(0, 40)}"`)
    previous = level
  }
  reviewer.check('atlas-heading-order', skips.length === 0, skips.join('; ') || 'none')

  reviewer.check('atlas-has-no-focal-company',
    !atlasContainer.querySelector('.assoc-node-focal') && !/focal company/i.test(atlasText),
    'the atlas must not designate any company as focal')

  reviewer.check('atlas-has-no-relevance-tier',
    atlasContainer.querySelectorAll('.assoc-tier').length === 0,
    'the atlas must not render recruitment relevance tiers')

  reviewer.check('atlas-shows-the-taxonomy',
    atlasContainer.querySelectorAll('.atlas-tree-row, .atlas-macro').length > 0,
    'no taxonomy navigation rendered')

  reviewer.check('atlas-states-coverage-limits',
    /not a claim|mapped coverage only|gap in the map|not exhaustive/i.test(atlasText),
    'no statement limiting the coverage claim')

  reviewer.check('atlas-explains-footprint-is-indicative',
    /indicative market footprint/i.test(atlasText)
      && /not a statutory size band|not a revenue or headcount figure|not a ranking/i.test(atlasText),
    'the footprint bands are not labelled as approximate')

  // Drilling into a branch must render bands, including the unknown one.
  const macroButton = atlasContainer.querySelector<HTMLElement>('.atlas-macro')
  if (macroButton) {
    await click(macroButton)
    const bands = atlasContainer.querySelectorAll('.footprint-band').length
    reviewer.check('atlas-branch-renders-every-footprint-band', bands === 5,
      `${bands} footprint bands rendered; empty bands must still appear so gaps are visible`)
    const branchText = atlasContainer.textContent ?? ''
    reviewer.check('atlas-branch-states-coverage',
      /companies in branch/i.test(branchText) && /coverage counts what maps has researched/i.test(branchText),
      'the branch does not report its own coverage')

    const companyControl = atlasContainer.querySelector<HTMLElement>('.footprint-company')
    reviewer.check('atlas-company-is-reachable', !!companyControl,
      'no company control exists in the landscape')
    if (companyControl) {
      await click(companyControl)
      const inspector = atlasContainer.querySelector('.atlas-inspector')
      const inspectorText = text(inspector)
      reviewer.check('atlas-inspector-opens', inspectorText.length > 80,
        `${inspectorText.length} characters of inspector content`)
      reviewer.check('atlas-inspector-shows-footprint-basis',
        /footprint/i.test(inspectorText) && /not stated|consolidated group|south african operation|operating division|standalone/i.test(inspectorText),
        'the inspector does not say which entity the figures cover')
    }
  } else {
    reviewer.check('atlas-branch-renders-every-footprint-band', false, 'no macro-sector control to drill into')
  }

  // ── Company associations: no default company, no default brief ───────────
  const { container, document } = await mountPage(
    ASSOCIATIONS_MODULE,
    'CompanyAssociationsPage',
    '/company-associations',
  )

  reviewer.check('single-h1', container.querySelectorAll('h1').length === 1,
    `${container.querySelectorAll('h1').length} h1 elements`)

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

  const focusInput = container.querySelector<HTMLInputElement>('.assoc-context-field input')
  reviewer.check('no-company-is-selected-by-default',
    !!focusInput && focusInput.value === '',
    `focus company field holds "${focusInput?.value ?? 'no field'}"`)

  const roleSelect = container.querySelector<HTMLSelectElement>('select.filter-select')
  reviewer.check('no-brief-is-selected-by-default',
    !!roleSelect && roleSelect.value === 'none',
    `brief selector holds "${roleSelect?.value ?? 'no field'}"`)

  reviewer.check('no-client-brief-panel-on-load',
    !container.querySelector('.assoc-brief'),
    'an assignment brief renders before a recruiter selects one')

  reviewer.check('network-is-not-the-default-view',
    !container.querySelector('.assoc-graph'),
    'a radial company network is still the landing view')

  const switchButtons = Array.from(container.querySelectorAll('.assoc-viewswitch button'))
  reviewer.check('views-are-offered', switchButtons.length >= 2,
    switchButtons.map((button) => text(button)).join(', ') || 'no view switch rendered')

  const summaryBefore = text(container.querySelector('.assoc-summary'))
  reviewer.check('result-count-is-stated', /\d+/.test(summaryBefore), summaryBefore || 'no summary line')

  const groups = container.querySelectorAll('.assoc-group').length
  reviewer.check('association-groups-render', groups > 0, `${groups} association groups rendered`)

  const clusterMembers = container.querySelectorAll('.assoc-cluster-members .assoc-link-button').length
  reviewer.check('company-is-reachable-without-the-graph', clusterMembers > 0,
    'no company control exists outside the graph canvas')

  const evidenceClasses = container.querySelectorAll('.assoc-evidence-class').length
  reviewer.check('associations-are-labelled-by-evidence-class', evidenceClasses > 0,
    'associations render without stating what kind of evidence they are')

  const groupText = container.textContent ?? ''
  reviewer.check('association-disclaims-ownership',
    /never imply|never does|only a corporate ownership record|not ownership/i.test(groupText),
    'the page does not say that sharing an industry is not ownership')

  // ── Filters reach the views ─────────────────────────────────────────────
  const trigger = container.querySelector<HTMLElement>('.facet-filter-trigger')
  reviewer.check('filter-trigger-exists', !!trigger, 'no .facet-filter-trigger on the page')
  if (trigger) {
    await click(trigger)
    const drawer = container.querySelector('[role="dialog"], .facet-drawer')
    reviewer.check('filter-drawer-opens', !!drawer, 'the filter trigger did not open a dialog')
    if (drawer) {
      const dimensions = drawer.querySelectorAll('.facet-group').length
      reviewer.check('filter-dimensions-are-offered', dimensions >= 6,
        `${dimensions} filter groups in the drawer`)
      const option = drawer.querySelector<HTMLElement>('.facet-option input[type="checkbox"]')
      if (option) {
        await click(option)
        const summaryAfterFilter = text(container.querySelector('.assoc-summary'))
        reviewer.check('filter-changes-the-result-set', summaryAfterFilter !== summaryBefore,
          `before: "${summaryBefore}" after: "${summaryAfterFilter}"`)
      }
      const closeDrawer = drawer.querySelector<HTMLElement>('.facet-drawer-close')
      if (closeDrawer) await click(closeDrawer)
    }
  }

  // ── Honesty about scope ─────────────────────────────────────────────────
  const pageText = container.textContent ?? ''
  reviewer.check('page-disclaims-exhaustive-coverage',
    /not a claim|mapped coverage only|not exhaustive|gap in the map/i.test(pageText),
    'no statement limiting the coverage claim')
  reviewer.check('page-states-local-storage-scope',
    /this browser only|not on a shared server/i.test(pageText),
    'target pools are not labelled as browser-local')
  reviewer.check('page-disclaims-person-suitability',
    /never implies ownership|companies, not people|not.*suitab|never evidence that any individual/i.test(pageText),
    'no statement separating company similarity from person suitability')

  const exportButton = Array.from(container.querySelectorAll('button'))
    .find((button) => /export/i.test(text(button)))
  reviewer.check('export-is-offered', !!exportButton, 'no export control on the page')

  reviewer.check('document-title-is-set', (document.title ?? '').length > 0, `title: "${document.title}"`)

  // ── Unknown must never read as a verified absence ────────────────────────
  for (const [label, route] of [
    ['curated company with unknown capabilities', '/company-associations?inspect=org-bester-feed-grain'],
    ['dataset-derived company, never researched', '/company-associations?inspect=org-dataset:123consulting'],
  ] as const) {
    const { container: page } = await mountPage(ASSOCIATIONS_MODULE, 'CompanyAssociationsPage', route)
    const panel = page.querySelector('[role="dialog"]')?.querySelector('.assoc-inspector')
      ?? page.querySelector('.assoc-inspector')
    const panelText = text(panel)
    const statesUnknown = /unknown|not yet researched|not yet classified|never (been )?checked|no sourced/i.test(panelText)
    const absenceQualified = /absence of evidence|missing research|not verified absent|no evidence recorded|unknown is not the same as absent|research gap/i.test(panelText)
    reviewer.check('unknown-never-reads-as-absence',
      statesUnknown && absenceQualified,
      `${label}: reports unknown = ${statesUnknown}, qualifies it as missing research = ${absenceQualified}`)
  }

  // ── An explicit deep link still opens a company-centred view ─────────────
  const focused = await mountPage(
    ASSOCIATIONS_MODULE,
    'CompanyAssociationsPage',
    '/company-associations?org=org-ccs-logistics',
  )
  reviewer.check('explicit-deep-link-still-opens-a-company-view',
    /clear company focus/i.test(focused.container.textContent ?? ''),
    'an explicit ?org deep link must still centre the named company')
  reviewer.check('company-focus-is-cleared-on-request',
    !!focused.container.querySelector('.assoc-clear-focus'),
    'no way to clear a company focus')

  return reviewer
}
