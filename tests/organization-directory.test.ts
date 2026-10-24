import assert from 'node:assert/strict'
import test from 'node:test'
import { buildOrganizationIndex } from '../src/data/organizations/load'
import { companyDossier, emptyFilters } from '../src/data/organizations/query'
import { buildUniverseViews, filterCompanyViews } from '../src/data/organizations/universeView'
import { discoverRoleTargets, filterMatches } from '../src/data/organizations/discovery'
import { roleContextById } from '../src/data/organizations/roleContexts'
import { organization } from './helpers/organizations'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

const directoryEntry = {
  directory: 'MBAWC member directory',
  recordKey: '17',
  sourceUrl: 'https://example.test/members/17',
  checkedOn: '2026-10-22',
  fields: {
    'Membership code': 'TEST017',
    'Registration number': '2026/012345/07',
    Categories: 'Damp and waterproofing',
  },
  notes: 'Operating area inferred from postal code; not independently verified.',
}

const company = {
  ...organization({ id: 'org-directory-fixture', name: 'Directory fixture company' }),
  directoryEntries: [directoryEntry],
}
const index = buildOrganizationIndex()
index.organizations = [company]
index.byId = new Map([[company.id, company]])
const views = buildUniverseViews(index, [company])

test('company dossiers retain attributed directory metadata and inference caveats', () => {
  const dossier = JSON.parse(JSON.stringify(companyDossier(index, company.id)))
  assert.deepEqual(dossier.directoryEntries, [{
    directory: 'MBAWC member directory',
    recordKey: '17',
    sourceUrl: 'https://example.test/members/17',
    checkedOn: '2026-10-22',
    fields: {
      'Membership code': 'TEST017',
      'Registration number': '2026/012345/07',
      Categories: 'Damp and waterproofing',
    },
    notes: 'Operating area inferred from postal code; not independently verified.',
  }])
})

test('existing company dossiers remain readable without directory metadata', () => {
  const existing = buildOrganizationIndex()
  const dossier = JSON.parse(JSON.stringify(companyDossier(existing, 'org-ccs-logistics')))
  assert.deepEqual(dossier.directoryEntries, [])
})

test('factual company search finds directory membership, registration and category details', () => {
  for (const query of ['mbawc', 'test017', '2026/012345/07', 'waterproofing']) {
    const found = filterCompanyViews(views, { ...emptyFilters(), query }, index)
    assert.deepEqual(found.map((view) => view.organizationId), ['org-directory-fixture'], query)
  }
  assert.deepEqual(filterCompanyViews(views, { ...emptyFilters(), query: 'not-recorded' }, index), [])
})

test('recruitment and association search sees the same directory details without changing relevance', () => {
  const roleContext = roleContextById('role-cold-storage-financial-manager')!
  const discovery = discoverRoleTargets({ index, roleContext, organizations: [company] })
  assert.equal(discovery.matches.length, 1)
  for (const query of ['mbawc', 'test017', 'waterproofing']) {
    const found = filterMatches(discovery.matches, index, { ...emptyFilters(), query })
    assert.deepEqual(found.map((match) => match.organizationId), ['org-directory-fixture'], query)
    assert.equal(found[0].tier, discovery.matches[0].tier)
    assert.deepEqual(found[0].rules, discovery.matches[0].rules)
  }
})

test('the company dossier renders complete directory facts with source attribution and inference notes', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
  try {
    const { OrganizationDirectoryEntries } = await server.ssrLoadModule('/src/pages/OrganizationPage.tsx')
    const html = renderToStaticMarkup(React.createElement(OrganizationDirectoryEntries, { entries: [directoryEntry] }))
    const document = new JSDOM(html).window.document
    assert.equal(document.querySelectorAll('h2').length, 1)
    assert.equal(document.querySelector('h3')?.textContent, 'MBAWC member directory')
    assert.deepEqual([...document.querySelectorAll('dt')].map((node) => node.textContent), [
      'Membership code', 'Registration number', 'Categories',
    ])
    assert.deepEqual([...document.querySelectorAll('dd')].map((node) => node.textContent), [
      'TEST017', '2026/012345/07', 'Damp and waterproofing',
    ])
    assert.match(document.body.textContent ?? '', /Operating area inferred from postal code; not independently verified\./)
    assert.match(document.body.textContent ?? '', /2026-10-22/)
    assert.equal(document.querySelector('a')?.getAttribute('href'), 'https://example.test/members/17')
  } finally {
    await server.close()
  }
})
