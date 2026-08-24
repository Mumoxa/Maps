import test from 'node:test'
import assert from 'node:assert/strict'
import type { Contact } from '../src/data/contacts'
import {
  buildContactFacets,
  filterContacts,
  UNSPECIFIED_FACET_VALUE,
} from '../src/data/contactDirectory'
import type { ContactFacetKey, ContactSelections } from '../src/data/contactDirectory'

function contact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: 'person-one',
    name: 'Person One',
    nameAliases: [],
    positions: [{
      title: 'Head of Data',
      company: 'Example Bank',
      sector: 'Banking',
      companySize: '10,001+',
      website: '',
      companyLinkedin: '',
      companyDomain: '',
      companyDescription: '',
    }],
    linkedinUrls: ['https://www.linkedin.com/in/person-one'],
    emails: [{ address: 'person@example.com', status: 'Valid', type: 'work', masked: false }],
    phones: [{ number: '+27 82 000 0000', type: 'mobile' }],
    locations: ['Johannesburg, South Africa'],
    seniorities: ['Director'],
    departments: ['Data'],
    technologies: ['Azure'],
    software: [],
    tags: [],
    triggers: [],
    remarks: [],
    outreachStatuses: [],
    datesAdded: ['2026-08-24'],
    sourceSheets: ['AIDATA_SA'],
    sourceRecords: [{ file: 'contacts.xlsx', sheet: 'AIDATA_SA', row: 2 }],
    relatedRoles: [],
    ...overrides,
  }
}

test('uses OR within a checkbox group and AND across groups', () => {
  const contacts = [
    contact(),
    contact({
      id: 'person-two',
      name: 'Person Two',
      positions: [{
        title: 'Salesforce Lead', company: 'Example Consultancy', sector: 'Consulting',
        companySize: '201-500', website: '', companyLinkedin: '', companyDomain: '',
        companyDescription: '',
      }],
      locations: ['Cape Town, South Africa'],
    }),
    contact({
      id: 'person-three',
      name: 'Person Three',
      positions: [{
        title: 'CTO', company: 'Second Bank', sector: 'Banking', companySize: '1,001-5,000',
        website: '', companyLinkedin: '', companyDomain: '', companyDescription: '',
      }],
      locations: ['Cape Town, South Africa'],
    }),
  ]

  const results = filterContacts(contacts, '', {
    companies: ['Example Bank', 'Second Bank'],
    locations: ['Cape Town, South Africa'],
  })

  assert.deepEqual(results.map(result => result.id), ['person-three'])
})

test('searches all nested contact and company information', () => {
  const contacts = [contact()]

  assert.equal(filterContacts(contacts, 'azure', {}).length, 1)
  assert.equal(filterContacts(contacts, 'person@example.com', {}).length, 1)
  assert.equal(filterContacts(contacts, 'example bank', {}).length, 1)
  assert.equal(filterContacts(contacts, '2026-08-24', {}).length, 1)
  assert.equal(filterContacts(contacts, 'contacts.xlsx', {}).length, 1)
  assert.equal(filterContacts(contacts, 'not present', {}).length, 0)
})

test('wires all supplied categorical and related-role fields to checkbox facets', () => {
  const contacts = [contact({
    positions: [{
      title: 'Head of Data', company: 'Example Bank', sector: 'Banking', companySize: '10,001+',
      website: 'https://example.com', companyLinkedin: '', companyDomain: 'example.com',
      companyDescription: 'Example description', companySubIndustry: 'Retail Banking',
      companyCountry: 'South Africa', companyCity: 'Johannesburg', companyRevenue: 'R1bn+',
      companyYearFounded: '1999', companySpecialties: 'Analytics',
    }],
    tags: ['Priority'],
    triggers: ['Leadership change'],
    remarks: ['Warm relationship'],
    outreachStatuses: ['Contacted'],
    relatedRoles: [{
      roleTitle: 'Data Engineer', roleName: 'Software Engineer', roleGroup: 'Delivery', level: 'Senior',
      newRoleGroup: 'Data', newRoleName: 'Data Engineering', status: 'Open', departmentCode: 'DATA-1',
      location: 'Pretoria',
    }],
  })]

  const selections: Partial<Record<ContactFacetKey, string[]>> = {
    companySubIndustries: ['Retail Banking'], companyCountries: ['South Africa'],
    companyCities: ['Johannesburg'], companyRevenues: ['R1bn+'], companyYearsFounded: ['1999'],
    companySpecialties: ['Analytics'], companyDomains: ['example.com'], emailTypes: ['work'],
    phoneTypes: ['mobile'], tags: ['Priority'], triggers: ['Leadership change'],
    remarks: ['Warm relationship'], outreachStatuses: ['Contacted'], datesAdded: ['2026-08-24'],
    sourceFiles: ['contacts.xlsx'], roleTitles: ['Data Engineer'], roleNames: ['Software Engineer'],
    roleGroups: ['Delivery'], roleLevels: ['Senior'], newRoleGroups: ['Data'],
    newRoleNames: ['Data Engineering'], roleStatuses: ['Open'], roleDepartmentCodes: ['DATA-1'],
    roleLocations: ['Pretoria'],
  }

  for (const [facet, value] of Object.entries(selections)) {
    assert.equal(filterContacts(contacts, '', { [facet]: value } as ContactSelections).length, 1, facet)
  }
})

test('facet counts count each contact once and include missing values', () => {
  const contacts = [
    contact(),
    contact({ id: 'person-two', name: 'Person Two', positions: [], locations: [] }),
  ]
  const facets = buildContactFacets(contacts)

  assert.deepEqual(facets.companies, [
    { value: 'Example Bank', label: 'Example Bank', count: 1 },
    { value: UNSPECIFIED_FACET_VALUE, label: 'Not provided', count: 1 },
  ])
  assert.deepEqual(facets.locations, [
    { value: 'Johannesburg, South Africa', label: 'Johannesburg, South Africa', count: 1 },
    { value: UNSPECIFIED_FACET_VALUE, label: 'Not provided', count: 1 },
  ])
})

test('normalises checkbox values without changing the sourced labels', () => {
  const contacts = [
    contact(),
    contact({
      id: 'person-two',
      name: 'Person Two',
      positions: [{
        title: 'Head of Data', company: 'EXAMPLE BANK', sector: 'Banking', companySize: '10,001+',
        website: '', companyLinkedin: '', companyDomain: '', companyDescription: '',
      }],
    }),
  ]

  const facets = buildContactFacets(contacts)
  assert.deepEqual(facets.companies, [{ value: 'Example Bank', label: 'Example Bank', count: 2 }])
  assert.equal(filterContacts(contacts, '', { companies: ['Example Bank'] }).length, 2)
})
