/**
 * Build/verify the privacy-minimised contact -> company manifest.
 *
 * Run: npm run contacts:reconcile       # rebuild after changing source contacts
 *      npm run validate:contact-employers  # fail on a stale mapping
 *
 * The production Companies route imports only this company-name/count manifest,
 * not the entire 5,070-person directory. No personal names, emails, telephone
 * numbers or contact IDs are written to the manifest.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { contacts } from '../src/data/contacts'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import organizationsRaw from '../markets/organizations/organizations.json'

interface OrganizationRef { id: string; name: string; legalName: string; aliases: string[] }
interface EmployerRow { organizationId: string; name: string; contactCount: number; sourceNames: string[] }
interface Manifest {
  schemaVersion: number
  origin: string
  notes: string
  audit: {
    uniqueContacts: number
    employerPositionEntries: number
    distinctEmployerNames: number
    contactsWithoutEmployer: number
    contactsWithMultipleEmployerNames: number
    distinctOrganizationEntries: number
    curatedCompanyMatches: number
    unverifiedDatasetOnly: number
  }
  employers: EmployerRow[]
}

const organizations = organizationsRaw as OrganizationRef[]
const normalize = (name: string) => canonicalCompanyName(name).toLowerCase()
const manifestPath = resolve('markets/organizations/contact-employers.json')

function generate(): Manifest {
  const curatedById = new Map(organizations.map((org) => [org.id, org]))
  const idByName = new Map<string, string>()
  for (const org of organizations) {
    for (const candidate of [org.name, org.legalName, ...org.aliases]) {
      if (candidate) {
        const key = normalize(candidate)
        const previous = idByName.get(key)
        if (previous && previous !== org.id) throw new Error(`Ambiguous canonical company name: ${candidate}`)
        idByName.set(key, org.id)
      }
    }
  }

  const groups = new Map<string, { name: string; people: Set<string>; sourceNames: Set<string> }>()
  const distinctRaw = new Set<string>()
  let positionEntries = 0
  let withoutEmployer = 0
  let withMultipleNames = 0
  for (const contact of contacts) {
    const rawNames = new Set<string>()
    for (const position of contact.positions) {
      const raw = position.company.trim()
      if (!raw) continue
      const key = normalize(raw)
      if (!key) continue
      positionEntries += 1
      distinctRaw.add(raw)
      rawNames.add(raw)
      const id = idByName.get(key) ?? `org-dataset:${key}`
      let row = groups.get(id)
      if (!row) {
        row = {
          name: curatedById.get(id)?.name ?? canonicalCompanyName(raw),
          people: new Set<string>(),
          sourceNames: new Set<string>(),
        }
        groups.set(id, row)
      }
      row.people.add(contact.id)
      row.sourceNames.add(raw)
    }
    if (rawNames.size === 0) withoutEmployer += 1
    if (rawNames.size > 1) withMultipleNames += 1
  }

  const employers: EmployerRow[] = [...groups.entries()]
    .map(([organizationId, row]) => ({
      organizationId,
      name: row.name,
      contactCount: row.people.size,
      sourceNames: [...row.sourceNames].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.organizationId.localeCompare(b.organizationId))

  return {
    schemaVersion: 1,
    origin: 'src/data/contact-parts/contacts-001.json ... contacts-013.json',
    notes: 'Generated contact-employer reconciliation; names and aggregated counts only. Contains no names, emails, phone numbers or contact IDs. This proves a contact dataset relationship, not legal identity or sourced taxonomy classification.',
    audit: {
      uniqueContacts: contacts.length,
      employerPositionEntries: positionEntries,
      distinctEmployerNames: distinctRaw.size,
      contactsWithoutEmployer: withoutEmployer,
      contactsWithMultipleEmployerNames: withMultipleNames,
      distinctOrganizationEntries: groups.size,
      curatedCompanyMatches: employers.filter((row) => !row.organizationId.startsWith('org-dataset:')).length,
      unverifiedDatasetOnly: employers.filter((row) => row.organizationId.startsWith('org-dataset:')).length,
    },
    employers,
  }
}

const generated = generate()
if (generated.audit.contactsWithoutEmployer > 0) {
  throw new Error(`${generated.audit.contactsWithoutEmployer} source contacts have no employer`)
}
if (process.argv.includes('--write')) {
  writeFileSync(manifestPath, JSON.stringify(generated, null, 2) + '\n')
  console.log(`Contact employer manifest regenerated: ${generated.employers.length} organizations`)
} else {
  const committed = JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest
  if (JSON.stringify(committed) !== JSON.stringify(generated)) {
    throw new Error('Contact employer manifest stale. Run npm run contacts:reconcile and commit the result.')
  }
  console.log(`Contact employer reconciliation valid: ${generated.audit.uniqueContacts} contacts, ${generated.audit.employerPositionEntries} positions, ${generated.audit.distinctEmployerNames} original employer names -> ${generated.audit.distinctOrganizationEntries} Companies records; zero unmapped.`)
}
