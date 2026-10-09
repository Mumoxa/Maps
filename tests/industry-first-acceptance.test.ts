import test from 'node:test'
import assert from 'node:assert/strict'
import { mountPage, allText } from './helpers/mount'

/**
 * Route-level acceptance tests for the industry-first architecture.
 *
 * These render the real pages with the real router, because the defect being
 * corrected lived in the rendered default state, not in a data function: the
 * pages are what selected a client company and a client brief for every visitor.
 */

const ATLAS = '/src/pages/IndustryAtlasPage.tsx'
const ASSOCIATIONS = '/src/pages/CompanyAssociationsPage.tsx'
const DIRECTORY = '/src/pages/CompanyDirectory.tsx'
const TARGETING = '/src/pages/RecruitmentTargetingPage.tsx'
const ORGANIZATION = '/src/pages/OrganizationPage.tsx'

test('1 · the Industry Atlas opens with no focal company selected', async () => {
  const page = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas')
  assert.match(page.lowerText, /industry atlas/)
  // No company is named as a centre anywhere in the default view.
  assert.ok(!page.container.querySelector('.assoc-node-focal'),
    'the atlas must not render a focal graph node')
  assert.ok(!page.lowerText.includes('focal company'),
    'the atlas must not present a focal company')
  assert.match(page.lowerText, /no company is selected|no company selected|no company is privileged/i)
})

test('2 · Company Associations with no parameters does not select CCS Logistics', async () => {
  const page = await mountPage(ASSOCIATIONS, 'CompanyAssociationsPage', '/company-associations')
  const focusInput = page.container.querySelector('.assoc-context-field input') as HTMLInputElement | null
  assert.ok(focusInput, 'a focus company control must exist')
  assert.equal(focusInput.value, '', 'the focus company field must start empty')
  assert.match(focusInput.getAttribute('placeholder') ?? '', /no company selected/i)
  assert.ok(!page.lowerText.includes('clear company focus'),
    'no company focus is set, so no focus can be cleared')
  // The CCS assignment is offered in the brief list, but it must not be selected.
  const roleSelect = page.container.querySelector('select.filter-select') as HTMLSelectElement | null
  assert.ok(roleSelect, 'the brief selector must exist')
  assert.equal(roleSelect.value, 'none', 'no recruitment brief may be selected by default')
  assert.ok(!page.container.querySelector('.assoc-brief'), 'no brief panel on load')
  assert.ok(!page.container.querySelector('.assoc-node-focal'), 'no focal network node on load')
  assert.ok(!page.container.querySelector('.assoc-graph'), 'the radial network is not the default view')
})

test('3 · no recruitment context is active by default in the general atlas', async () => {
  const atlas = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas')
  assert.ok(!atlas.container.querySelector('.assoc-brief'), 'the atlas shows no assignment brief')
  assert.equal(atlas.container.querySelectorAll('.assoc-tier').length, 0,
    'the atlas shows no relevance tiers')

  const associations = await mountPage(ASSOCIATIONS, 'CompanyAssociationsPage', '/company-associations')
  assert.ok(!associations.container.querySelector('.assoc-brief'),
    'associations open with no brief, not with a client assignment')
  assert.match(associations.lowerText, /no recruitment brief is active/i)
})

test('4 · CCS Logistics is treated like every other organisation', async () => {
  const page = await mountPage(
    ORGANIZATION,
    'OrganizationPage',
    '/organizations/org-ccs-logistics',
    { pattern: '/organizations/:organizationId' },
  )
  assert.match(page.lowerText, /ccs logistics/)
  assert.ok(!page.lowerText.includes('focal'),
    'the CCS dossier must not describe it as a focal or default company')
  // Its record carries the same sections as any other organisation.
  for (const heading of ['industry placement', 'operating capabilities', 'corporate ownership', 'indicative footprint']) {
    assert.ok(page.lowerText.includes(heading), `the CCS dossier is missing "${heading}"`)
  }
})

test('5 · one company has one canonical record, reachable by the same id everywhere', async () => {
  const byId = await mountPage(
    ORGANIZATION,
    'OrganizationPage',
    '/organizations/org-ccs-logistics',
    { pattern: '/organizations/:organizationId' },
  )
  assert.match(byId.lowerText, /org-ccs-logistics/)
  // A deep link with a return-to-branch parameter still resolves to the same record.
  const withParams = await mountPage(
    ORGANIZATION,
    'OrganizationPage',
    '/organizations/org-ccs-logistics?from=TRA',
    { pattern: '/organizations/:organizationId' },
  )
  assert.match(withParams.lowerText, /org-ccs-logistics/)
  assert.equal(
    byId.container.querySelectorAll('h1').length,
    1,
    'one company renders one dossier heading',
  )
})

test('6 · an unmeasured company stays unclassified rather than ranked', async () => {
  const page = await mountPage(
    ORGANIZATION,
    'OrganizationPage',
    '/organizations/org-dataset:absa',
    { pattern: '/organizations/:organizationId' },
  )
  const footprintCard = page.container.querySelector('.footprint-card')
  if (footprintCard) {
    assert.match((footprintCard.textContent ?? '').toLowerCase(), /footprint not established|no sourced scale/)
  }
  // A dataset-only employer is still addressable and still rendered.
  assert.ok(page.lowerText.length > 0)
})

test('11 · factual industry browsing shows no recruitment suitability tiers', async () => {
  const page = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas?node=TRA')
  assert.ok(!page.container.querySelector('.assoc-tier'), 'no tier chips in the atlas')
  assert.ok(!page.lowerText.includes('tier 1'), 'no tier language in the atlas')
  assert.match(page.lowerText, /indicative market footprint/)
})

test('12 · selecting a role activates contextual targeting and only then shows tiers', async () => {
  const before = await mountPage(TARGETING, 'RecruitmentTargetingPage', '/recruitment-targeting')
  assert.ok(!before.container.querySelector('.assoc-tier'), 'no tiers without a brief')
  assert.match(before.lowerText, /choose a brief to begin/i)

  const after = await mountPage(
    TARGETING,
    'RecruitmentTargetingPage',
    '/recruitment-targeting?role=role-cold-storage-financial-manager',
  )
  assert.ok(after.container.querySelectorAll('.assoc-tier').length > 0,
    'a brief activates relevance tiers')
  assert.match(after.lowerText, /tiers are conditional on/i)
  assert.match(after.lowerText, /not a company size measure/i)
})

test('13 · recruitment targeting works with no focal company at all', async () => {
  const page = await mountPage(
    TARGETING,
    'RecruitmentTargetingPage',
    '/recruitment-targeting?role=role-cold-storage-financial-manager',
  )
  assert.match(page.lowerText, /scored against the brief alone, with no company centred/i)
  const rows = page.container.querySelectorAll('.data-table tbody tr')
  assert.ok(rows.length > 0, 'a brief alone must still produce targets')
})

test('16 · an explicit company deep link still opens that company-centred view', async () => {
  const page = await mountPage(
    ASSOCIATIONS,
    'CompanyAssociationsPage',
    '/company-associations?org=org-ccs-logistics',
  )
  assert.match(page.lowerText, /ccs logistics/)
  assert.match(page.lowerText, /clear company focus/i)
  // The legacy `org` parameter is honoured, and the network becomes available.
  const viewButtons = allText(page.container, '.assoc-viewswitch button')
  assert.ok(viewButtons.some((label) => /network/i.test(label)))
})

test('17 · a macro-sector filter survives a URL round trip', async () => {
  // Read back through the page's own writer: the URL is the contract.
  const page = await mountPage(
    DIRECTORY,
    'CompanyDirectory',
    '/companies?macroSectors=TRA&footprint=major-national',
    { withData: true },
  )
  assert.ok(page.container.textContent?.includes('in view'), 'the directory rendered')
  // The filter is present in the rendered checkbox state, not just the URL.
  const checked = Array.from(page.container.querySelectorAll('input[type=checkbox]:checked'))
  assert.ok(checked.length >= 2, `expected the macro-sector and footprint filters to be checked, saw ${checked.length}`)
})

test('19 · the full universe stays retrievable without a hidden top-N cap', async () => {
  const page = await mountPage(DIRECTORY, 'CompanyDirectory', '/companies', { withData: true })
  const aside = page.container.querySelector('.page-head-aside')?.textContent ?? ''
  const inUniverse = Number((aside.match(/([\d,]+)\s*in the universe/) ?? [])[1]?.replace(/,/g, '') ?? '0')
  assert.ok(inUniverse > 200, `expected the whole universe, saw ${inUniverse}`)
  const inView = Number((aside.match(/([\d,]+)\s*in view/) ?? [])[1]?.replace(/,/g, '') ?? '0')
  assert.equal(inView, inUniverse, 'an unfiltered directory shows every company')
})

test('20 · every relevant route renders without throwing', async () => {
  const routes: [string, string, string][] = [
    [ATLAS, 'IndustryAtlasPage', '/industry-atlas'],
    [ATLAS, 'IndustryAtlasPage', '/industry-atlas?node=TRA&view=table'],
    [ATLAS, 'IndustryAtlasPage', '/industry-atlas?gaps=all'],
    [DIRECTORY, 'CompanyDirectory', '/companies'],
    [DIRECTORY, 'CompanyDirectory', '/companies?dataset=credit-risk'],
    [ORGANIZATION, 'OrganizationPage', '/organizations/org-ccs-logistics'],
    [ORGANIZATION, 'OrganizationPage', '/organizations/does-not-exist'],
    [ASSOCIATIONS, 'CompanyAssociationsPage', '/company-associations'],
    [ASSOCIATIONS, 'CompanyAssociationsPage', '/company-associations?role=role-slm-property-development'],
    [TARGETING, 'RecruitmentTargetingPage', '/recruitment-targeting'],
    [TARGETING, 'RecruitmentTargetingPage', '/recruitment-targeting?role=role-bester-head-of-finance'],
  ]
  for (const [modulePath, exportName, route] of routes) {
    const page = await mountPage(modulePath, exportName, route, {
      pattern: modulePath === ORGANIZATION ? '/organizations/:organizationId' : undefined,
      withData: modulePath === DIRECTORY,
    })
    assert.ok(page.container.textContent && page.container.textContent.length > 0,
      `${route} rendered nothing`)
    if (route.endsWith('does-not-exist')) {
      assert.match(page.lowerText, /company not found/, `${route} must say the company is unknown`)
      continue
    }
    assert.equal(page.container.querySelectorAll('h1').length, 1, `${route} must render exactly one h1`)
  }
})

test('the universal directory is not limited to the credit-risk dataset', async () => {
  const page = await mountPage(DIRECTORY, 'CompanyDirectory', '/companies', { withData: true })
  assert.match(page.lowerText, /south african company universe/)
  assert.match(page.lowerText, /credit risk is a dataset filter, not the definition of the universe/i)
  const aside = page.container.querySelector('.page-head-aside')?.textContent ?? ''
  const inUniverse = Number((aside.match(/([\d,]+)\s*in the universe/) ?? [])[1]?.replace(/,/g, '') ?? '0')
  // companies.json holds fewer employers than the canonical universe.
  assert.ok(inUniverse > 200, `the directory must span more than the credit-risk dataset, saw ${inUniverse}`)
})

test('the atlas states coverage gaps rather than hiding them', async () => {
  const page = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas?gaps=all')
  assert.match(page.lowerText, /market gaps/i)
  assert.match(page.lowerText, /0 mapped|zero mapped companies yet|nothing mapped yet/i)
  assert.match(page.lowerText, /not yet classified/i)
})

test('an empty branch is explorable and reports zero companies', async () => {
  const page = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas?node=CIV')
  assert.match(page.lowerText, /companies in branch/)
  assert.match(page.lowerText, /coverage counts what maps has researched/i)
})
