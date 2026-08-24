import auditRaw from '../contacts.audit.json'
import { contacts } from '../src/data/contacts'

interface ContactAudit {
  rawPersonRows: number
  uniqueContacts: number
  sourceRecordCount: number
  sourceRowsReconciled: boolean
  duplicateIds: number
  sourcePersonRows: Record<string, number>
}

const audit = auditRaw as ContactAudit
const errors: string[] = []
const ids = new Set<string>()
let sourceRecordCount = 0

function compatibleNames(left: string, right: string): boolean {
  const tokens = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/)
  const leftTokens = tokens(left)
  const rightTokens = tokens(right)
  return leftTokens.join(' ') === rightTokens.join(' ')
    || (leftTokens.length >= 2 && rightTokens.length >= 2
      && leftTokens[0] === rightTokens[0]
      && leftTokens.at(-1) === rightTokens.at(-1))
}

for (const [index, contact] of contacts.entries()) {
  const label = `contacts[${index}]`
  if (!contact.id.trim()) errors.push(`${label}.id is empty`)
  if (ids.has(contact.id)) errors.push(`${label}.id duplicates ${contact.id}`)
  ids.add(contact.id)
  if (!contact.name.trim()) errors.push(`${label}.name is empty`)
  if (contact.name.includes('@')) errors.push(`${label}.name looks like a shifted email address`)
  for (const alias of contact.nameAliases) {
    if (!compatibleNames(contact.name, alias)) errors.push(`${label}.nameAliases contains a conflicting person name`)
  }
  if (!contact.positions.length) errors.push(`${label}.positions is empty`)
  if (!contact.positions.some(position => position.company.trim())) {
    errors.push(`${label} has no sourced company`)
  }
  for (const position of contact.positions) {
    if (position.website && !/^https?:\/\//i.test(position.website)) {
      errors.push(`${label}.website is not an absolute HTTP URL`)
    }
    if (position.companyLinkedin && !/^https:\/\/www\.linkedin\.com\/company\//i.test(position.companyLinkedin)) {
      errors.push(`${label}.companyLinkedin is not a company URL`)
    }
  }
  for (const linkedin of contact.linkedinUrls) {
    if (!/^https:\/\/www\.linkedin\.com\/in\//i.test(linkedin)) {
      errors.push(`${label}.linkedinUrls contains a non-profile URL`)
    }
  }
  if (!contact.sourceRecords.length) errors.push(`${label}.sourceRecords is empty`)
  for (const source of contact.sourceRecords) {
    if (!source.file.trim() || !source.sheet.trim() || source.row < 1) {
      errors.push(`${label} has an invalid source record`)
    }
  }
  for (const phone of contact.phones) {
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(phone.number)) {
      errors.push(`${label}.phones contains a shifted date value`)
    }
  }
  sourceRecordCount += contact.sourceRecords.length
  const serialised = JSON.stringify(contact)
  if (serialised.includes('#REF!') || serialised.includes('#N/A')) {
    errors.push(`${label} contains a spreadsheet formula error`)
  }
}

if (contacts.length !== audit.uniqueContacts) {
  errors.push(`contacts.json has ${contacts.length} contacts; audit expects ${audit.uniqueContacts}`)
}
if (sourceRecordCount !== audit.rawPersonRows || sourceRecordCount !== audit.sourceRecordCount) {
  errors.push(`source trail has ${sourceRecordCount} rows; audit expects ${audit.rawPersonRows}`)
}
if (!audit.sourceRowsReconciled || audit.duplicateIds !== 0) {
  errors.push('contact audit did not reconcile cleanly')
}
const auditedSourceRows = Object.values(audit.sourcePersonRows).reduce((total, count) => total + count, 0)
if (auditedSourceRows !== audit.rawPersonRows) {
  errors.push(`source-file audit has ${auditedSourceRows} rows; expected ${audit.rawPersonRows}`)
}

const metadataResetRegressions = [
  {
    name: 'Leonard Mundida', company: 'TRAFICC GLOBAL', website: '', sector: '', companySize: '',
    companyLinkedin: 'https://www.linkedin.com/company/traficc-global',
  },
  {
    name: 'Naresh Maharaj', company: 'MAHLE Behr South Africa', website: 'https://www.mahle.com/',
    sector: '', companySize: '', companyLinkedin: '',
  },
]
for (const expected of metadataResetRegressions) {
  const contact = contacts.find(candidate => candidate.name === expected.name)
  const position = contact?.positions.find(candidate => candidate.company === expected.company)
  if (!position) {
    errors.push(`missing metadata reset regression contact ${expected.name}`)
    continue
  }
  for (const field of ['website', 'sector', 'companySize', 'companyLinkedin'] as const) {
    if (position[field] !== expected[field]) {
      errors.push(`${expected.name}.${field} is ${position[field] || 'blank'}; expected ${expected[field] || 'blank'}`)
    }
  }
}

if (errors.length) {
  throw new Error(`Contact data validation failed:\n${errors.slice(0, 50).join('\n')}`)
}

process.stdout.write(
  `Contact data valid: ${contacts.length.toLocaleString()} unique contacts, ${sourceRecordCount.toLocaleString()} source rows.\n`,
)
