// Wiring tests: every count the product states must open the list it counts.
//
// The defect this file guards against is a number that reads as information but
// is a dead end, or a link that opens a different set than the number beside it.
// Both halves are asserted:
//
//   1. The data: the filter a link writes reproduces the count it came from,
//      for every branch of the national taxonomy and for the unclassified
//      backlog.
//   2. The render: the atlas, the dossier inspector and the directory actually
//      render those links, and the people list resolves to the same placement.

import test from 'node:test'
import assert from 'node:assert/strict'
import { mountPage } from './helpers/mount'
import companiesRaw from '../companies.json'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { UNCLASSIFIED_BRANCH_ID, buildIndustryAtlas, companiesAtNode } from '../src/data/organizations/atlas'
import { buildUniverseViews, filterCompanyViews, summarizeViews, viewsAtNode } from '../src/data/organizations/universeView'
import { readFilters } from '../src/data/organizations/query'
import {
  branchCompaniesHref,
  branchFootprintHref,
  branchPendingHref,
  branchProfessionalsHref,
  branchVerifiedHref,
  branchWithProfessionalsHref,
  companyProfessionalsHref,
  ESTABLISHED_FOOTPRINT_BANDS,
  PENDING_VERIFICATION_STATUSES,
} from '../src/data/organizations/links'
import { contactsInScope } from '../src/data/organizations/professionals'
import {
  emptyIntelligenceFilters,
  filterAssociationMembers,
  filterCompanyRelationships,
  filterIndustryBodies,
} from '../src/data/industryIntelligence/query'
import { industryIntelligence } from '../src/data/industryIntelligence/load'
import { resolveEmployerOrganizationId } from '../src/data/organizations/load'
import { contacts } from '../src/data/contacts'

const ATLAS = '/src/pages/IndustryAtlasPage.tsx'
const CONTACTS = '/src/pages/ContactDirectory.tsx'
const BODIES = '/src/pages/IndustryIntelligencePage.tsx'

// The same composition the app's hook builds, including the bundled credit-risk
// employers. A reconciliation proved against a smaller universe would pass while
// the deployed product disagreed with itself.
const intelligence = buildCompanyIntelligence({
  creditRiskCompanies: (companiesRaw as { name: string; segment: string; profile_count: number }[])
    .map((company) => ({ name: company.name, segment: company.segment, profileCount: company.profile_count })),
})
const { index, all } = intelligence
const atlas = buildIndustryAtlas(index, all)
const views = buildUniverseViews(index, all)

function filtersOf(href: string) {
  return readFilters(new URL(href, 'https://maps.invalid').searchParams)
}

function listFor(href: string, nodeId: string) {
  const scoped = viewsAtNode(views, atlas, index, nodeId)
  return filterCompanyViews(scoped, filtersOf(href), index)
}

function hrefsOf(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('a[href]')).map((anchor) => anchor.getAttribute('href') ?? '')
}

test('every coverage count on a branch opens exactly the companies it counts', () => {
  const nodes = [
    ...atlas.roots.filter((root) => root.counts.organizations > 0),
    ...[...atlas.nodes.values()].filter((node) => node.counts.organizations > 20).slice(0, 12),
    UNCLASSIFIED_BRANCH_ID,
  ]
  assert.ok(nodes.length > 3)

  for (const node of nodes) {
    const nodeId = typeof node === 'string' ? node : node.id
    const summary = summarizeViews(viewsAtNode(views, atlas, index, nodeId))
    const checks: [string, number, string][] = [
      ['companies', summary.organizations, branchCompaniesHref(nodeId)],
      ['verified', summary.verified, branchVerifiedHref(nodeId)],
      ['pending', summary.pendingVerification, branchPendingHref(nodeId)],
      ['with people', summary.withMappedProfessionals, branchWithProfessionalsHref(nodeId)],
      ['with footprint', summary.footprintEstablished, branchFootprintHref(nodeId)],
    ]
    for (const [label, expected, href] of checks) {
      assert.equal(listFor(href, nodeId).length, expected,
        `${nodeId}: "${label}" link opens ${listFor(href, nodeId).length} but the branch states ${expected}`)
    }
  }
})

test('the pending count includes both non-verified states, not just one', () => {
  assert.deepEqual([...PENDING_VERIFICATION_STATUSES].sort(), ['listed-only', 'needs-verification'])
  const pending = filtersOf(branchPendingHref('CON'))
  assert.deepEqual([...pending.status].sort(), ['listed-only', 'needs-verification'])
})

test('the footprint count names every established band and never the unknown band', () => {
  const filters = filtersOf(branchFootprintHref('CON'))
  assert.deepEqual([...filters.footprint].sort(), [...ESTABLISHED_FOOTPRINT_BANDS].sort())
  assert.ok(!filters.footprint.includes('not-established'),
    'a company with no sourced measure must not be counted as having an established footprint')
})

test('the unclassified backlog opens every employer without a placement', () => {
  const backlog = filtersOf(branchCompaniesHref(UNCLASSIFIED_BRANCH_ID))
  assert.equal(backlog.status.length, 0)
  const ids = companiesAtNode(atlas, index, UNCLASSIFIED_BRANCH_ID)
  assert.equal(ids.length, atlas.totals.unclassifiedOrganizations)
  assert.equal(listFor(branchCompaniesHref(UNCLASSIFIED_BRANCH_ID), UNCLASSIFIED_BRANCH_ID).length, ids.length)
})

test('the professionals list resolves people onto the same placement the atlas counts', () => {
  const branchIds = new Set(companiesAtNode(atlas, index, 'CON'))
  const people = contactsInScope(index, atlas, { nodeId: 'CON' })
  assert.ok(people.length > 0, 'Construction should hold mapped contact-directory people')

  // Every person returned holds a sourced position at a company in the branch.
  for (const person of people) {
    const placed = person.positions.some((position) => {
      const organizationId = position.company ? resolveEmployerOrganizationId(index, position.company) : null
      return organizationId ? branchIds.has(organizationId) : false
    })
    assert.ok(placed, `${person.name} has no position inside the Construction branch`)
  }

  // And the scope is exactly the directory filtered by that placement, not a
  // separate list that could drift from it.
  const expected = contacts.filter((contact) => contact.positions.some((position) => {
    const organizationId = position.company ? resolveEmployerOrganizationId(index, position.company) : null
    return organizationId ? branchIds.has(organizationId) : false
  }))
  assert.equal(people.length, expected.length)
  assert.ok(people.length < contacts.length, 'a branch scope must narrow the directory')
})

test('a company people list matches that company\'s contact-dataset count', () => {
  const employer = index.employersByOrg.get('org-mbawc-107')
  assert.ok(employer, 'Form-Scaff should resolve to a canonical company')
  const contactSource = employer.professionalSources.find((source) => source.dataset === 'contacts')
  assert.ok(contactSource)
  assert.equal(
    contactsInScope(index, atlas, { organizationId: 'org-mbawc-107' }).length,
    contactSource.count,
    'the company people list must open exactly the contacts the dataset counts',
  )
  assert.equal(companyProfessionalsHref('org-mbawc-107'), '/contacts?org=org-mbawc-107')
  assert.equal(branchProfessionalsHref('CON'), '/contacts?node=CON')
})

test('the atlas renders a link for every count in the branch header', async () => {
  const page = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas?node=CON')
  const hrefs = hrefsOf(page.container)

  assert.ok(hrefs.includes('/companies?node=CON'), 'the branch company count must open the branch list')
  const verified = hrefs.find((href) => href.startsWith('/companies?') && href.includes('status=verified'))
  assert.ok(verified, 'the verified count must open the verified companies')
  const pending = hrefs.find((href) => href.startsWith('/companies?') && href.includes('needs-verification'))
  assert.ok(pending, 'the pending count must open both pending states')
  const people = hrefs.find((href) => href.startsWith('/companies?') && href.includes('people=yes'))
  assert.ok(people, 'the mapped-professional count must open the companies that hold people')
  const footprint = hrefs.find((href) => href.startsWith('/companies?') && href.includes('footprint='))
  assert.ok(footprint, 'the footprint count must open the companies with an established band')

  assert.ok(hrefs.includes('/contacts?node=CON'), 'the branch must offer the professionals list')
  assert.ok(hrefs.includes('/company-associations?node=CON'), 'the branch must offer its associations')
  assert.ok(hrefs.some((href) => href.startsWith('/industry-bodies') && href.includes('node=CON')),
    'the branch must offer the industry bodies whose members sit in it')
})

test('the taxonomy rail links each populated branch count to its company list', async () => {
  const page = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas?node=CON&gaps=all')
  const rootCount = page.container.querySelector<HTMLAnchorElement>('.atlas-tree-root-row .atlas-tree-count-link')
  assert.equal(rootCount?.getAttribute('href'), '/companies', 'the whole-universe count must open the universe')
  const count = page.container.querySelector<HTMLAnchorElement>('.atlas-tree-list .atlas-tree-count-link')
  assert.ok(count, 'a populated branch count must be a link, not loose text')
  assert.match(count.getAttribute('href') ?? '', /^\/companies\?node=/)
  assert.match(count.getAttribute('aria-label') ?? '', /companies mapped in/)
  // Empty branches stay text: there is no list to open, and a dead link would
  // suggest the branch had companies.
  const empty = page.container.querySelector('.atlas-tree-count-empty')
  assert.ok(empty, 'an empty branch count must stay text rather than link to nothing')
  assert.equal(empty.textContent, '0')
})

test('the landing page links each macro-sector count to its filtered list', async () => {
  const page = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas')
  const hrefs = hrefsOf(page.container)
  assert.ok(hrefs.some((href) => /^\/companies\?node=[A-Z]+$/.test(href)), 'a macro-sector must open its companies')
  assert.ok(hrefs.some((href) => href.includes('status=verified')), 'a macro-sector must open its verified companies')
  assert.ok(hrefs.some((href) => href.includes('people=yes')), 'a macro-sector must open its companies with people')
  assert.ok(hrefs.some((href) => href.startsWith('/contacts?node=')), 'a macro-sector must open its people list')
})

test('the company inspector wires the people list, the branch, the bodies and the associations', async () => {
  const page = await mountPage(ATLAS, 'IndustryAtlasPage', '/industry-atlas?node=CON&inspect=org-mbawc-107')
  assert.match(page.lowerText, /form-scaff/)
  const hrefs = hrefsOf(page.container)
  assert.ok(hrefs.includes('/contacts?org=org-mbawc-107'), 'the inspector must open this company\'s people list')
  assert.ok(hrefs.includes('/company-associations?focus=org-mbawc-107'), 'the inspector must open its associations')
  assert.ok(hrefs.some((href) => href.startsWith('/industry-bodies?view=company-map&q=Form-Scaff')),
    'the inspector must open the industry bodies that reference the company')
  assert.ok(hrefs.some((href) => href.startsWith('/industry-atlas?node=')),
    'each taxonomy placement must open its national branch')
  assert.ok(hrefs.some((href) => href.startsWith('/companies?node=CON&footprint=') || href.startsWith('/companies?footprint=')),
    'the footprint chip must open its band')
})

test('the contact directory scopes to a branch and keeps the scope on the URL', async () => {
  const page = await mountPage(CONTACTS, 'ContactDirectory', '/contacts?node=CON')
  assert.match(page.lowerText, /mapped professionals in construction/)
  assert.match(page.lowerText, /scoped to/i)

  const hrefs = hrefsOf(page.container)
  assert.ok(hrefs.includes('/industry-atlas?node=CON'), 'the scoped list must return to its branch')
  assert.ok(hrefs.includes('/companies?node=CON'), 'the scoped list must reach the companies behind it')

  const scoped = page.container.querySelectorAll('.contact-card').length
  assert.ok(scoped > 0, 'the branch scope must still render people')
  const match = page.lowerText.match(/showing ([\d,]+) of ([\d,]+) matching contacts/)
  assert.ok(match, 'the scoped result count must be stated')
  assert.ok(Number((match[2] ?? '0').replace(/,/g, '')) < contacts.length,
    'a branch scope must be narrower than the whole directory')
})

test('the contact directory scopes to one company by canonical id', async () => {
  const page = await mountPage(CONTACTS, 'ContactDirectory', '/contacts?org=org-mbawc-107')
  assert.match(page.lowerText, /mapped professionals in form-scaff/)
  const hrefs = hrefsOf(page.container)
  assert.ok(hrefs.includes('/organizations/org-mbawc-107'), 'the scoped list must open the company dossier')
  const match = page.lowerText.match(/scoped to .*?([\d,]+) mapped professional/)
  assert.ok(match, 'the company scope must state how many people it holds')
  assert.equal(Number((match[1] ?? '0').replace(/,/g, '')), 2, 'Form-Scaff holds two contact-directory people')
})

test('the industry-body explorer links its counts to the views that hold them', async () => {
  const page = await mountPage(BODIES, 'IndustryIntelligencePage', '/industry-bodies')
  const hrefs = hrefsOf(page.container)
  assert.ok(hrefs.some((href) => href.includes('view=members')), 'the directory-row count must open the member rows')
  assert.ok(hrefs.some((href) => href.includes('view=company-map')), 'the researched-company count must open the company map')
  assert.ok(hrefs.some((href) => href.includes('view=coverage')), 'the coverage count must open the coverage report')
})

test('the directory exposes the people filter that the atlas links rely on', async () => {
  const summary = summarizeViews(viewsAtNode(views, atlas, index, 'CON'))
  const page = await mountPage('/src/pages/CompanyDirectory.tsx', 'CompanyDirectory', '/companies?node=CON&people=yes', {
    withData: true,
  })

  // The link the atlas offers must land on a page that shows the filter as
  // active, otherwise the reader cannot tell why the list is shorter than the
  // branch count they clicked.
  const yes = page.container.querySelector<HTMLInputElement>('#directory-side-people-yes')
  const no = page.container.querySelector<HTMLInputElement>('#directory-side-people-no')
  const any = page.container.querySelector<HTMLInputElement>('#directory-side-people-any')
  assert.ok(yes && no && any, 'the people filter must be a real radio set, not a hidden URL parameter')
  assert.equal(yes.checked, true, 'arriving from the atlas must leave "has mapped professionals" selected')
  assert.equal(any.checked, false)

  // The facet counts are the scope totals, so the panel and the atlas agree.
  const counts = Array.from(page.container.querySelectorAll('.facet-option')).map((option) => ({
    label: (option.querySelector('.facet-option-label')?.textContent ?? '').toLowerCase(),
    count: Number((option.querySelector('.facet-option-count')?.textContent ?? '').replace(/,/g, '')),
  }))
  const yesCount = counts.find((entry) => entry.label === 'has mapped professionals')
  const noCount = counts.find((entry) => entry.label === 'no mapped professional')
  assert.equal(yesCount?.count, summary.withMappedProfessionals)
  assert.equal(noCount?.count, summary.organizations - summary.withMappedProfessionals)

  // And the rendered list is the same set the count promised.
  const expected = filterCompanyViews(viewsAtNode(views, atlas, index, 'CON'), {
    ...readFilters(new URLSearchParams('people=yes')),
  }, index)
  assert.equal(expected.length, summary.withMappedProfessionals)
})

test('the industry-body explorer scopes a branch through its member companies', () => {
  const nodeIds = new Set(companiesAtNode(atlas, index, 'CON'))
  const scope = { nodeCompanyIds: nodeIds }

  const bodies = filterIndustryBodies(emptyIntelligenceFilters, scope)
  assert.ok(bodies.length > 0, 'Construction should hold at least one body with a researched member')
  assert.ok(bodies.length < industryIntelligence.bodies.length, 'a branch scope must narrow the register')
  for (const body of bodies) {
    const placed = industryIntelligence.members.some((member) => (
      member.bodyId === body.id && member.companyId !== null && nodeIds.has(member.companyId)
    )) || industryIntelligence.relationships.some((relationship) => (
      relationship.bodyId === body.id && nodeIds.has(relationship.companyId)
    ))
    assert.ok(placed, `${body.acronym} was scoped into the branch without a placed member company`)
  }

  // Every row and relationship the scope returns belongs to a company the atlas
  // places in the branch - the scope is the placement, not a text guess.
  for (const member of filterAssociationMembers(emptyIntelligenceFilters, scope)) {
    assert.ok(member.companyId && nodeIds.has(member.companyId), `${member.companyName} is not in the branch`)
  }
  for (const relationship of filterCompanyRelationships(emptyIntelligenceFilters, scope)) {
    assert.ok(nodeIds.has(relationship.companyId), `${relationship.companyName} is not in the branch`)
  }

  // An unscoped call is unchanged: the scope is opt-in, never a default.
  assert.equal(filterIndustryBodies(emptyIntelligenceFilters).length, industryIntelligence.bodies.length)
})

test('the branch scope survives the industry-body directory', async () => {
  const nodeIds = new Set(companiesAtNode(atlas, index, 'CON'))
  const expected = filterIndustryBodies(emptyIntelligenceFilters, { nodeCompanyIds: nodeIds }).length
  const page = await mountPage(BODIES, 'IndustryIntelligencePage', '/industry-bodies?view=bodies&node=CON', {
    withData: true,
  })

  assert.match(page.lowerText, /scoped to construction/i)
  const hrefs = hrefsOf(page.container)
  assert.ok(hrefs.includes('/industry-atlas?node=CON'), 'a scoped body list must return to its branch')
  assert.ok(
    hrefs.some((href) => href.startsWith('/industry-bodies') && !href.includes('node=')),
    'the branch scope must be removable',
  )

  // The stated scoped total is the number of cards rendered.
  assert.equal(page.container.querySelectorAll('.ii-body-card').length, expected)
  assert.match(page.lowerText, new RegExp(`${expected} of ${industryIntelligence.bodies.length} bodies`))

  // The row button on each card counts the rows its scoped link opens.
  for (const card of Array.from(page.container.querySelectorAll('.ii-body-card'))) {
    const acronym = card.querySelector('h3')?.textContent ?? ''
    const body = industryIntelligence.bodies.find((item) => item.acronym === acronym)
    assert.ok(body, `${acronym} should be a real body`)
    const rows = filterAssociationMembers(
      { ...emptyIntelligenceFilters, bodyId: body.id },
      { nodeCompanyIds: nodeIds },
    ).length
    const action = card.querySelector('.ii-card-actions a, .ii-card-actions span')
    assert.match(action?.textContent ?? '', new RegExp(String(rows)))
  }
})
