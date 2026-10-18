import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { contacts } from '../src/data/contacts'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import { filterContacts, readContactSelections } from '../src/data/contactDirectory'
import { buildCompanyIntelligence, contactDatasetEmployers } from '../src/data/organizations/universe'
import {
  contactDirectoryUrlForEmployer,
  resolveEmployerOrganizationId,
} from '../src/data/organizations/load'
import contactManifest from '../markets/organizations/contact-employers.json'

/**
 * End-to-end contact -> Companies contract against ALL bundled source contacts.
 * No person-level data is duplicated in the generated employer index.
 */
describe('contact employers resolve to the universal company register', () => {
  const intelligence = buildCompanyIntelligence()
  const index = intelligence.index
  const visible = new Set(intelligence.all.map((company) => company.id))
  const expectedByOrganization = new Map<string, Set<string>>()
  const employerNames = new Set<string>()
  let positions = 0

  for (const contact of contacts) {
    assert.ok(contact.positions.some((position) => position.company.trim()), `No employer for contact ${contact.id}`)
    for (const position of contact.positions) {
      const name = position.company.trim()
      if (!name) continue
      positions += 1
      employerNames.add(name)
      const id = resolveEmployerOrganizationId(index, name)
      assert.ok(id, `Employer ${name} is missing a company id`)
      assert.ok(visible.has(id), `Employer ${name} has no visible company dossier`)
      assert.ok(index.employersByOrg.get(id)?.datasets.includes('contacts'))
      const set = expectedByOrganization.get(id) ?? new Set<string>()
      set.add(contact.id)
      expectedByOrganization.set(id, set)
    }
  }

  it('accounts for every source person, position, employer name and organization', () => {
    assert.equal(contacts.length, contactManifest.audit.uniqueContacts)
    assert.equal(positions, contactManifest.audit.employerPositionEntries)
    assert.equal(employerNames.size, contactManifest.audit.distinctEmployerNames)
    assert.equal(expectedByOrganization.size, contactManifest.audit.distinctOrganizationEntries)
    assert.equal(contactManifest.audit.contactsWithoutEmployer, 0)
    assert.equal(contactDatasetEmployers().length, expectedByOrganization.size)
  })

  it('deduplicates by person inside each canonical company, even across aliases', () => {
    for (const [organizationId, people] of expectedByOrganization) {
      const employer = index.employersByOrg.get(organizationId)
      assert.ok(employer, `No indexed employer ${organizationId}`)
      const count = employer.professionalSources.find((source) => source.dataset === 'contacts')?.count
      assert.equal(count, people.size, `Duplicate or lost contacts at ${organizationId}`)
      assert.ok(employer.contactEmployerNames.length > 0)
    }
  })

  it('links each employer to one navigable company dossier without inventing company facts', () => {
    for (const [organizationId] of expectedByOrganization) {
      const employer = index.employersByOrg.get(organizationId)!
      const url = contactDirectoryUrlForEmployer(employer)
      assert.ok(url?.startsWith('/contacts?companies='), `No contact reverse-link for ${organizationId}`)
      for (const rawName of employer.contactEmployerNames) {
        assert.equal(resolveEmployerOrganizationId(index, rawName), organizationId)
      }
      if (!index.byId.has(organizationId)) {
        const stub = intelligence.all.find((org) => org.id === organizationId)
        assert.equal(stub?.status, 'needs-verification')
        assert.deepEqual(stub?.industries, [], 'An unverified contact sector must not become an industry fact')
        assert.deepEqual(stub?.scale, [], 'An unverified contact company size must not become a sourced metric')
      }
    }
  })

  it('the company dossier contact link finds every linked person, including aliases', () => {
    const employer = [...index.employersByOrg.values()]
      .find((row) => row.datasets.includes('contacts') && row.contactEmployerNames.length >= 2)
    assert.ok(employer, 'Expected a company with more than one source employer spelling')
    const link = contactDirectoryUrlForEmployer(employer)!
    const params = new URLSearchParams(link.slice(link.indexOf('?') + 1))
    const names = new Set(params.getAll('companies'))
    for (const rawName of employer.contactEmployerNames) {
      assert.ok(names.has(canonicalCompanyName(rawName)))
    }
    const listed = filterContacts(contacts, '', readContactSelections(params))
    const wanted = expectedByOrganization.get(employer.organizationId)!
    assert.deepEqual(new Set(listed.map((person) => person.id)), wanted)
  })
})
