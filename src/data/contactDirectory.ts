import type { Contact } from './contacts'

export const UNSPECIFIED_FACET_VALUE = '__not_provided__'

export type ContactFacetKey =
  | 'companies'
  | 'titles'
  | 'sectors'
  | 'locations'
  | 'companySizes'
  | 'companySubIndustries'
  | 'companyCountries'
  | 'companyCities'
  | 'companyRevenues'
  | 'companyYearsFounded'
  | 'companySpecialties'
  | 'companyDomains'
  | 'emailStatuses'
  | 'emailTypes'
  | 'phoneTypes'
  | 'seniorities'
  | 'departments'
  | 'technologies'
  | 'software'
  | 'tags'
  | 'triggers'
  | 'remarks'
  | 'outreachStatuses'
  | 'datesAdded'
  | 'sourceSheets'
  | 'sourceFiles'
  | 'roleTitles'
  | 'roleNames'
  | 'roleGroups'
  | 'roleLevels'
  | 'newRoleGroups'
  | 'newRoleNames'
  | 'roleStatuses'
  | 'roleDepartmentCodes'
  | 'roleLocations'

export type ContactSelections = Partial<Record<ContactFacetKey, string[]>>

export interface ContactFacetOption {
  value: string
  label: string
  count: number
}

export type ContactFacets = Record<ContactFacetKey, ContactFacetOption[]>

const FACET_KEYS: ContactFacetKey[] = [
  'companies',
  'titles',
  'sectors',
  'locations',
  'companySizes',
  'companySubIndustries',
  'companyCountries',
  'companyCities',
  'companyRevenues',
  'companyYearsFounded',
  'companySpecialties',
  'companyDomains',
  'emailStatuses',
  'emailTypes',
  'phoneTypes',
  'seniorities',
  'departments',
  'technologies',
  'software',
  'tags',
  'triggers',
  'remarks',
  'outreachStatuses',
  'datesAdded',
  'sourceSheets',
  'sourceFiles',
  'roleTitles',
  'roleNames',
  'roleGroups',
  'roleLevels',
  'newRoleGroups',
  'newRoleNames',
  'roleStatuses',
  'roleDepartmentCodes',
  'roleLocations',
]

function unique(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map(value => value?.trim() ?? '').filter(Boolean))]
}

function comparable(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

function valuesFor(contact: Contact, facet: ContactFacetKey): string[] {
  switch (facet) {
    case 'companies': return unique(contact.positions.map(position => position.company))
    case 'titles': return unique(contact.positions.map(position => position.title))
    case 'sectors': return unique(contact.positions.map(position => position.sector))
    case 'locations': return unique(contact.locations)
    case 'companySizes': return unique(contact.positions.map(position => position.companySize))
    case 'companySubIndustries': return unique(contact.positions.map(position => position.companySubIndustry))
    case 'companyCountries': return unique(contact.positions.map(position => position.companyCountry))
    case 'companyCities': return unique(contact.positions.map(position => position.companyCity))
    case 'companyRevenues': return unique(contact.positions.map(position => position.companyRevenue))
    case 'companyYearsFounded': return unique(contact.positions.map(position => position.companyYearFounded))
    case 'companySpecialties': return unique(contact.positions.map(position => position.companySpecialties))
    case 'companyDomains': return unique(contact.positions.map(position => position.companyDomain))
    case 'emailStatuses': return unique(contact.emails.map(email => email.status))
    case 'emailTypes': return unique(contact.emails.map(email => email.type))
    case 'phoneTypes': return unique(contact.phones.map(phone => phone.type))
    case 'seniorities': return unique(contact.seniorities)
    case 'departments': return unique(contact.departments)
    case 'technologies': return unique(contact.technologies)
    case 'software': return unique(contact.software)
    case 'tags': return unique(contact.tags)
    case 'triggers': return unique(contact.triggers)
    case 'remarks': return unique(contact.remarks)
    case 'outreachStatuses': return unique(contact.outreachStatuses)
    case 'datesAdded': return unique(contact.datesAdded)
    case 'sourceSheets': return unique(contact.sourceSheets)
    case 'sourceFiles': return unique(contact.sourceRecords.map(source => source.file))
    case 'roleTitles': return unique(contact.relatedRoles.map(role => role.roleTitle))
    case 'roleNames': return unique(contact.relatedRoles.map(role => role.roleName))
    case 'roleGroups': return unique(contact.relatedRoles.map(role => role.roleGroup))
    case 'roleLevels': return unique(contact.relatedRoles.map(role => role.level))
    case 'newRoleGroups': return unique(contact.relatedRoles.map(role => role.newRoleGroup))
    case 'newRoleNames': return unique(contact.relatedRoles.map(role => role.newRoleName))
    case 'roleStatuses': return unique(contact.relatedRoles.map(role => role.status))
    case 'roleDepartmentCodes': return unique(contact.relatedRoles.map(role => role.departmentCode))
    case 'roleLocations': return unique(contact.relatedRoles.map(role => role.location))
  }
}

const searchTextCache = new WeakMap<Contact, string>()

function searchableText(contact: Contact): string {
  const cached = searchTextCache.get(contact)
  if (cached !== undefined) return cached
  const text = [
    contact.name,
    ...contact.nameAliases,
    ...contact.positions.flatMap(position => Object.values(position)),
    ...contact.linkedinUrls,
    ...contact.emails.flatMap(email => [email.address, email.status, email.type]),
    ...contact.phones.flatMap(phone => [phone.number, phone.type]),
    ...contact.locations,
    ...contact.seniorities,
    ...contact.departments,
    ...contact.technologies,
    ...contact.software,
    ...contact.tags,
    ...contact.triggers,
    ...contact.remarks,
    ...contact.outreachStatuses,
    ...contact.datesAdded,
    ...contact.sourceSheets,
    ...contact.sourceRecords.flatMap(source => [source.file, source.sheet, String(source.row)]),
    ...contact.relatedRoles.flatMap(role => Object.values(role)),
  ].join(' ').toLocaleLowerCase()
  searchTextCache.set(contact, text)
  return text
}

export function filterContacts(
  contacts: Contact[],
  query: string,
  selections: ContactSelections,
): Contact[] {
  const normalisedQuery = query.trim().toLocaleLowerCase()
  return contacts.filter(contact => {
    if (normalisedQuery && !searchableText(contact).includes(normalisedQuery)) return false
    return FACET_KEYS.every(facet => {
      const selected = selections[facet] ?? []
      if (!selected.length) return true
      const values = valuesFor(contact, facet)
      return selected.some(value =>
        value === UNSPECIFIED_FACET_VALUE
          ? values.length === 0
          : values.some(contactValue => comparable(contactValue) === comparable(value)),
      )
    })
  })
}

function buildFacet(contacts: Contact[], facet: ContactFacetKey): ContactFacetOption[] {
  const counts = new Map<string, { label: string; count: number }>()
  for (const contact of contacts) {
    const values = valuesFor(contact, facet)
    const effectiveValues = values.length ? values : [UNSPECIFIED_FACET_VALUE]
    const contactValues = new Map<string, string>()
    for (const value of effectiveValues) contactValues.set(comparable(value), value)
    for (const [key, value] of contactValues) {
      const current = counts.get(key)
      counts.set(key, { label: current?.label ?? value, count: (current?.count ?? 0) + 1 })
    }
  }
  return [...counts.values()]
    .map(({ label, count }) => ({
      value: label,
      label: label === UNSPECIFIED_FACET_VALUE ? 'Not provided' : label,
      count,
    }))
    .sort((left, right) => left.label.localeCompare(right.label))
}

export function buildContactFacets(contacts: Contact[]): ContactFacets {
  return Object.fromEntries(FACET_KEYS.map(facet => [facet, buildFacet(contacts, facet)])) as ContactFacets
}

export function activeContactFilterCount(selections: ContactSelections): number {
  return Object.values(selections).reduce((total, values) => total + (values?.length ?? 0), 0)
}
