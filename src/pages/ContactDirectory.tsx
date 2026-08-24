import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  ExternalLink,
  Filter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
  X,
} from 'lucide-react'
import { ContactFacetGroup } from '../components/ui/ContactFacetGroup'
import {
  activeContactFilterCount,
  buildContactFacets,
  filterContacts,
} from '../data/contactDirectory'
import type { ContactFacetKey, ContactSelections } from '../data/contactDirectory'
import { contacts } from '../data/contacts'
import type { Contact, ContactPosition } from '../data/contacts'

const PAGE_SIZE = 48

const FACET_GROUPS: { key: ContactFacetKey; label: string; defaultOpen?: boolean }[] = [
  { key: 'companies', label: 'Companies', defaultOpen: true },
  { key: 'titles', label: 'Titles', defaultOpen: true },
  { key: 'sectors', label: 'Sectors', defaultOpen: true },
  { key: 'locations', label: 'Locations', defaultOpen: true },
  { key: 'companySizes', label: 'Company sizes' },
  { key: 'companySubIndustries', label: 'Company sub-industries' },
  { key: 'companyCountries', label: 'Company countries' },
  { key: 'companyCities', label: 'Company cities' },
  { key: 'companyRevenues', label: 'Company revenues' },
  { key: 'companyYearsFounded', label: 'Company founding years' },
  { key: 'companySpecialties', label: 'Company specialties' },
  { key: 'companyDomains', label: 'Company domains' },
  { key: 'emailStatuses', label: 'Email statuses' },
  { key: 'emailTypes', label: 'Email types' },
  { key: 'phoneTypes', label: 'Phone types' },
  { key: 'seniorities', label: 'Seniorities' },
  { key: 'departments', label: 'Departments' },
  { key: 'technologies', label: 'Technologies' },
  { key: 'software', label: 'Software lists' },
  { key: 'tags', label: 'Tags' },
  { key: 'triggers', label: 'Triggers' },
  { key: 'remarks', label: 'Remarks' },
  { key: 'outreachStatuses', label: 'Outreach statuses' },
  { key: 'datesAdded', label: 'Date values' },
  { key: 'sourceSheets', label: 'Source lists' },
  { key: 'sourceFiles', label: 'Source files' },
  { key: 'roleTitles', label: 'Related role titles' },
  { key: 'roleNames', label: 'Related role names' },
  { key: 'roleGroups', label: 'Related role groups' },
  { key: 'roleLevels', label: 'Related role levels' },
  { key: 'newRoleGroups', label: 'Related new role groups' },
  { key: 'newRoleNames', label: 'Related new role names' },
  { key: 'roleStatuses', label: 'Related role statuses' },
  { key: 'roleDepartmentCodes', label: 'Related department codes' },
  { key: 'roleLocations', label: 'Related role locations' },
]

function firstPosition(contact: Contact): ContactPosition {
  for (const position of contact.positions) {
    if (position.title || position.company) return position
  }
  return contact.positions[0]
}

function unique(values: string[]): string[] {
  const result: string[] = []
  const seen = new Set<string>()
  for (const value of values) {
    if (!value || seen.has(value)) continue
    seen.add(value)
    result.push(value)
  }
  return result
}

function sourceLabel(contact: Contact): string {
  const count = contact.sourceRecords.length
  return `${count.toLocaleString()} source record${count === 1 ? '' : 's'}`
}

interface ContactCardData {
  contact: Contact
  primary: ContactPosition
  sectors: string[]
  sizes: string[]
  companies: string[]
  titles: string[]
  companyOverviews: ContactPosition[]
  facetDetails: string[]
  initials: string
}

function buildContactCardData(contact: Contact): ContactCardData {
  const primary = firstPosition(contact)
  const sectors = unique(contact.positions.map(position => position.sector))
  const sizes = unique(contact.positions.map(position => position.companySize))
  const companies = unique(contact.positions.map(position => position.company))
  const titles = unique(contact.positions.map(position => position.title))
  const companyOverviews: ContactPosition[] = []
  for (const position of contact.positions) {
    if (position.companyDescription) companyOverviews.push(position)
  }
  const facetDetails = unique([
    ...contact.seniorities,
    ...contact.departments,
    ...contact.technologies,
    ...contact.software,
    ...contact.tags,
  ])
  const initialParts: string[] = []
  for (const part of contact.name.split(' ')) {
    if (!part) continue
    initialParts.push(part[0])
    if (initialParts.length === 2) break
  }
  const initials = initialParts.join('').toLocaleUpperCase()

  return { contact, primary, sectors, sizes, companies, titles, companyOverviews, facetDetails, initials }
}

const CONTACT_CARD_DATA = new Map<string, ContactCardData>()
const CONTACT_COMPANIES = new Set<string>()
for (const contact of contacts) {
  CONTACT_CARD_DATA.set(contact.id, buildContactCardData(contact))
  for (const position of contact.positions) {
    if (position.company) CONTACT_COMPANIES.add(position.company)
  }
}
const CONTACT_COMPANY_COUNT = CONTACT_COMPANIES.size

function ContactCard({ data }: { data: ContactCardData }) {
  const { contact, primary, sectors, sizes, companies, titles, companyOverviews, facetDetails, initials } = data

  return (
    <article className="contact-card">
      <div className="contact-card-top">
        <div className="avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h2>{contact.name}</h2>
          <p className="contact-title">{primary?.title || 'Title not provided'}</p>
        </div>
      </div>

      <div className="contact-company">
        <Building2 size={15} aria-hidden="true" />
        <span>{primary?.company || 'Company not provided'}</span>
        {primary?.website && (
          <a href={primary.website} target="_blank" rel="noreferrer" aria-label={`Open ${primary.company} website`}>
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="contact-tags">
        {sectors.map(value => <span key={`sector-${value}`}>{value}</span>)}
        {sizes.map(value => <span key={`size-${value}`}><Users size={13} aria-hidden="true" />{value}</span>)}
        {contact.locations.map(value => <span key={`location-${value}`}><MapPin size={13} aria-hidden="true" />{value}</span>)}
        {facetDetails.slice(0, 5).map(value => <span key={`detail-${value}`}>{value}</span>)}
      </div>

      <div className="contact-details">
        {contact.emails.slice(0, 3).map(email => email.masked ? (
          <span className="contact-detail-row" key={`${email.address}-${email.type}`}>
            <Mail size={15} aria-hidden="true" />{email.address}<em>{email.status || email.type}</em>
          </span>
        ) : (
          <a href={`mailto:${email.address}`} key={`${email.address}-${email.type}`}>
            <Mail size={15} aria-hidden="true" />{email.address}<em>{email.status || email.type}</em>
          </a>
        ))}
        {contact.phones.slice(0, 3).map(phone => (
          <a href={`tel:${phone.number}`} key={`${phone.number}-${phone.type}`}>
            <Phone size={15} aria-hidden="true" />{phone.number}<em>{phone.type}</em>
          </a>
        ))}
        {contact.linkedinUrls.map(linkedin => (
          <a href={linkedin} target="_blank" rel="noreferrer" key={linkedin}>
            <Linkedin size={15} aria-hidden="true" />LinkedIn profile
          </a>
        ))}
      </div>

      {(contact.remarks.length > 0 || contact.triggers.length > 0 || contact.outreachStatuses.length > 0) && (
        <div className="contact-note">
          <b>Relationship information</b>
          {[...contact.triggers, ...contact.remarks, ...contact.outreachStatuses].map((value, index) => (
            <p key={`${value}-${index}`}>{value}</p>
          ))}
        </div>
      )}

      <details className="contact-record-details">
        <summary>All available information</summary>
        <div>
          {(contact.linkedinUrls.length > 0 || contact.emails.length > 0 || contact.phones.length > 0) && (
            <section>
              <h3>Contact methods</h3>
              <ul>
                {contact.emails.map(email => (
                  <li key={`all-${email.address}-${email.type}`}>
                    <strong>{email.address}</strong><span>{unique([email.type, email.status]).join(' · ')}</span>
                  </li>
                ))}
                {contact.phones.map(phone => (
                  <li key={`all-${phone.number}-${phone.type}`}><strong>{phone.number}</strong><span>{phone.type}</span></li>
                ))}
                {contact.linkedinUrls.map(linkedin => (
                  <li key={`all-${linkedin}`}><a href={linkedin} target="_blank" rel="noreferrer">{linkedin}</a></li>
                ))}
              </ul>
            </section>
          )}

          <h3>Positions</h3>
          <ul>{contact.positions.map((position, index) => (
            <li key={`${position.company}-${position.title}-${index}`}>
              <strong>{position.title || 'Title not provided'}</strong>
              <span>{position.company || 'Company not provided'}</span>
              <small>{unique([
                position.sector,
                position.companySubIndustry,
                position.companySize,
                position.companyCity,
                position.companyCountry,
                position.companyRevenue,
                position.companyYearFounded && `Founded ${position.companyYearFounded}`,
              ]).join(' · ')}</small>
              {(position.website || position.companyLinkedin) && (
                <span className="contact-position-links">
                  {position.website && <a href={position.website} target="_blank" rel="noreferrer">Website</a>}
                  {position.companyLinkedin && <a href={position.companyLinkedin} target="_blank" rel="noreferrer">Company LinkedIn</a>}
                </span>
              )}
              {position.companySpecialties && <small>Specialties: {position.companySpecialties}</small>}
            </li>
          ))}</ul>

          {(contact.nameAliases.length > 0 || facetDetails.length > 0 || contact.datesAdded.length > 0) && (
            <section>
              <h3>Other attributes</h3>
              {contact.nameAliases.length > 0 && <p>Also listed as: {contact.nameAliases.join(', ')}</p>}
              {facetDetails.length > 0 && <p>{facetDetails.join(' · ')}</p>}
              {contact.datesAdded.length > 0 && <p>Date values supplied: {contact.datesAdded.join(' · ')}</p>}
            </section>
          )}

          {companyOverviews.map((position, index) => (
            <section key={`${position.company}-overview-${index}`}>
              <h3>{position.company} overview</h3>
              <p>{position.companyDescription}</p>
            </section>
          ))}

          {contact.relatedRoles.length > 0 && (
            <section>
              <h3>Related hiring roles</h3>
              <ul>{contact.relatedRoles.map((role, index) => (
                <li key={`${role.roleTitle}-${role.roleName}-${index}`}>
                  <strong>{role.roleTitle || role.roleName || 'Related role'}</strong>
                  <span>{unique([role.roleName, role.roleGroup, role.level, role.location, role.status]).join(' · ')}</span>
                </li>
              ))}</ul>
            </section>
          )}

          <section>
            <h3>Source trail</h3>
            <ul>{contact.sourceRecords.map(source => (
              <li key={`${source.file}-${source.sheet}-${source.row}`}>
                <strong>{source.sheet}</strong><span>{source.file}, row {source.row}</span>
              </li>
            ))}</ul>
          </section>
        </div>
      </details>

      <footer>
        <span>{companies.length.toLocaleString()} compan{companies.length === 1 ? 'y' : 'ies'}</span>
        <span>{titles.length.toLocaleString()} title{titles.length === 1 ? '' : 's'}</span>
        <span>{sourceLabel(contact)}</span>
      </footer>
    </article>
  )
}

export function ContactDirectory() {
  const [query, setQuery] = useState('')
  const [selections, setSelections] = useState<ContactSelections>({})
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const facets = useMemo(() => buildContactFacets(contacts), [])
  const results = useMemo(() => filterContacts(contacts, query, selections), [query, selections])
  const selectedCount = activeContactFilterCount(selections)
  const visibleContacts = results.slice(0, visibleCount)

  useEffect(() => setVisibleCount(PAGE_SIZE), [query, selections])

  function toggleSelection(key: ContactFacetKey, value: string) {
    setSelections(current => {
      const values = current[key] ?? []
      const next = values.includes(value) ? values.filter(item => item !== value) : [...values, value]
      return { ...current, [key]: next }
    })
  }

  function clearFilters() {
    setSelections({})
  }

  return (
    <div className="page">
      <div className="container">
        <div className="contact-hero">
          <div>
            <p className="eyebrow">Contacts</p>
            <h1>Contact directory</h1>
            <p>Every sourced person is retained with their available company, title, sector, location, contact details and source trail. Missing information stays explicitly unfilled.</p>
          </div>
          <div className="contact-stats">
            <strong>{contacts.length.toLocaleString()}</strong><span>unique contacts</span>
            <strong>{CONTACT_COMPANY_COUNT.toLocaleString()}</strong><span>companies</span>
          </div>
        </div>

        <div className="contact-toolbar">
          <div className="contact-search">
            <Search size={17} aria-hidden="true" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search any available contact field"
              aria-label="Search all contact information"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear contact search"><X size={15} /></button>
            )}
          </div>
          <div className="contact-active-filter-count"><Filter size={15} />{selectedCount.toLocaleString()} selected</div>
          {selectedCount > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear filters</button>}
        </div>

        <div className="contact-directory-layout">
          <aside className="contact-filter-panel" aria-label="Contact filters">
            <div className="contact-filter-heading">
              <div><Filter size={16} /><strong>Filter contacts</strong></div>
              <span>Choose more than one checkbox in any group</span>
            </div>
            {FACET_GROUPS.map(group => (
              <ContactFacetGroup
                key={group.key}
                label={group.label}
                options={facets[group.key]}
                selected={selections[group.key] ?? []}
                onToggle={value => toggleSelection(group.key, value)}
                defaultOpen={group.defaultOpen}
              />
            ))}
          </aside>

          <section className="contact-results" aria-label="Contact results">
            <p className="contact-count" aria-live="polite" aria-atomic="true">
              Showing {visibleContacts.length.toLocaleString()} of {results.length.toLocaleString()} matching contacts
            </p>
            {results.length ? (
              <>
                <div className="contacts-grid">{visibleContacts.map(contact => (
                  <ContactCard data={CONTACT_CARD_DATA.get(contact.id)!} key={contact.id} />
                ))}</div>
                {visibleCount < results.length && (
                  <button type="button" className="btn contact-load-more" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>
                    Load {Math.min(PAGE_SIZE, results.length - visibleCount).toLocaleString()} more
                  </button>
                )}
              </>
            ) : (
              <div className="empty-state"><h2>No contacts match</h2><p>Clear a checkbox or try a broader search.</p></div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
