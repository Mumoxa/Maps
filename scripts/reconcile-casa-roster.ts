// Offline, private reconciliation of an authorised CA(SA) roster against the
// existing Accounting & Finance research pool. This never publishes or imports
// roster people into the website. See markets/accountants/README.md.

import { randomUUID } from 'node:crypto'
import { chmodSync, existsSync, mkdirSync, readFileSync, realpathSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import type { AccountantCandidate } from '../src/data/accountantsPeople'
import { canonicalizeIdentityUrl } from '../src/data/marketData/identity'
import { csvCell, linkedinProfileUrl } from './export-casa-inventory'
import { privateDataDir } from './hiring-storage'

type ResearchPerson = Pick<AccountantCandidate,
  | 'id' | 'fullName' | 'status' | 'designationStatus' | 'designations'
  | 'title' | 'employer' | 'industry' | 'country' | 'locationConfidence'
  | 'linkedinUrl' | 'dateLastVerified'
>

export type RosterScope = 'resident-in-sa' | 'working-in-sa'
export type IdentityStatus =
  | 'PROFILE_AND_NAME_MATCH'
  | 'PROFILE_NAME_CONFLICT'
  | 'PROFILE_COLLISION_REVIEW'
  | 'NAME_ONLY_REVIEW'
  | 'PROFILE_NOT_FOUND_NAME_REVIEW'
  | 'NOT_IN_MAP'

export interface RosterEntry {
  rowNumber: number
  fullName: string
  publicProfileUrl: string
}

export interface ReconciledRow {
  rowNumber: number
  rosterName: string
  rosterProfileUrl: string
  identityStatus: IdentityStatus
  researchId: string
  researchName: string
  designationEvidence: 'CONFIRMED' | 'NEEDS_REVIEW' | 'NOT_ESTABLISHED' | ''
  title: string
  employer: string
  industry: string
  researchLinkedinUrl: string
  researchCountry: string
  researchLocationConfidence: string
  researchLastVerified: string
  possibleResearchIds: string[]
  missingFields: string[]
}

export interface Reconciliation {
  rows: ReconciledRow[]
  summary: {
    sourceReference: string
    scope: RosterScope
    asOf: string
    suppliedRows: number
    linkedByProfileAndName: number
    needsIdentityReview: number
    notInMap: number
    recordedDesignationConfirmed: number
    recordedSaLocationConfirmed: number
    missingAmongLinked: { title: number; employer: number; industry: number }
    rosterCompletenessVerified: false
    activeMembershipVerifiedByTool: false
  }
}

const INPUT_HEADERS = ['full_name', 'public_profile_url']

/** No membership numbers, emails or extra fields are accepted into the private ledger. */
export function parseRosterCsv(csv: string): RosterEntry[] {
  let header: unknown[][]
  let parsed: Array<Record<string, string>>
  try {
    header = parse(csv, { bom: true, to_line: 1, skip_empty_lines: true, max_record_size: 4096 }) as unknown[][]
    parsed = parse(csv, { bom: true, columns: true, trim: true, skip_empty_lines: true, max_record_size: 4096 }) as Array<Record<string, string>>
  } catch {
    throw new Error('Invalid roster CSV. Use the two-column template; no personal details are printed in errors.')
  }
  if (JSON.stringify(header[0]) !== JSON.stringify(INPUT_HEADERS)) {
    throw new Error('Roster columns must be exactly: full_name,public_profile_url. Remove IDs, contact details and other columns.')
  }
  if (parsed.length === 0) throw new Error('Roster contains no people.')

  const seenProfileUrls = new Set<string>()
  return parsed.map((entry, index) => {
    const rowNumber = index + 2
    const fullName = entry.full_name?.trim().replace(/\s+/g, ' ') ?? ''
    if (!fullName) throw new Error(`roster row ${rowNumber}: full_name is required`)
    const profile = entry.public_profile_url?.trim() ?? ''
    const publicProfileUrl = profile ? canonicalizeIdentityUrl(linkedinProfileUrl(profile, rowNumber)) : ''
    if (publicProfileUrl && seenProfileUrls.has(publicProfileUrl)) {
      throw new Error(`roster row ${rowNumber}: duplicate public profile URL; resolve identity before reconciling`)
    }
    if (publicProfileUrl) seenProfileUrls.add(publicProfileUrl)
    return { rowNumber, fullName, publicProfileUrl }
  })
}

/** Read only the fields needed for linkage, from the authoritative JSONL research store. */
export function readCasaResearchPeople(jsonl: string): ResearchPerson[] {
  const people: ResearchPerson[] = []
  for (const [index, line] of jsonl.split(/\r?\n/).entries()) {
    if (!line.trim()) continue
    let row: Record<string, unknown>
    try {
      row = JSON.parse(line) as Record<string, unknown>
    } catch {
      throw new Error(`research line ${index + 1}: invalid JSON`)
    }
    if (!row || typeof row !== 'object' || Array.isArray(row)
      || typeof row.id !== 'string' || !row.id
      || typeof row.full_name !== 'string' || !row.full_name
      || typeof row.status !== 'string'
      || !Array.isArray(row.professional_designations)
      || !row.professional_designations.every((value) => typeof value === 'string')) {
      throw new Error(`research line ${index + 1}: invalid identity or designation fields`)
    }
    if (row.status === 'REJECTED') continue
    const optional = (key: string): string => {
      const value = row[key]
      if (value == null) return ''
      if (typeof value !== 'string') throw new Error(`research line ${index + 1}: invalid ${key}`)
      return value.trim()
    }
    people.push({
      id: row.id,
      fullName: row.full_name,
      status: row.status,
      designationStatus: optional('designation_status'),
      designations: row.professional_designations as string[],
      title: optional('current_title'),
      employer: optional('current_employer'),
      industry: optional('current_industry'),
      country: optional('country'),
      locationConfidence: optional('location_confidence'),
      linkedinUrl: optional('linkedin_url'),
      dateLastVerified: optional('date_last_verified'),
    })
  }
  return people
}

function nameKey(value: string): string {
  // Conservative: accents, different given names and reordered names are NOT
  // silently merged. They remain for human review, even with an identical URL.
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-ZA')
}

function indexResearch(people: readonly ResearchPerson[]) {
  const byProfile = new Map<string, ResearchPerson[]>()
  const byName = new Map<string, string[]>()
  const ids = new Set<string>()
  for (const person of people) {
    if (person.status === 'REJECTED') continue
    if (!person.id || !person.fullName || ids.has(person.id)) throw new Error('Research pool has missing or duplicate identities.')
    ids.add(person.id)
    const key = nameKey(person.fullName)
    const nameMatches = byName.get(key) ?? []
    nameMatches.push(person.id)
    byName.set(key, nameMatches)
    if (!person.linkedinUrl) continue
    const profile = canonicalizeIdentityUrl(linkedinProfileUrl(person.linkedinUrl, 0))
    const profileMatches = byProfile.get(profile) ?? []
    profileMatches.push(person)
    byProfile.set(profile, profileMatches)
  }
  return { byProfile, byName }
}

function designationEvidence(person: ResearchPerson): ReconciledRow['designationEvidence'] {
  if (!person.designations.includes('CA(SA)')) return 'NOT_ESTABLISHED'
  if (person.status === 'CONFIRMED' && person.designationStatus === 'CONFIRMED') return 'CONFIRMED'
  return 'NEEDS_REVIEW'
}

/** Every roster row yields exactly one ledger row; no name-only identity joins. */
export function reconcileCasaRoster(
  entries: readonly RosterEntry[],
  people: readonly ResearchPerson[],
  metadata: { sourceReference: string; scope: RosterScope; asOf: string },
): Reconciliation {
  const { byProfile, byName } = indexResearch(people)
  const rows: ReconciledRow[] = []
  const summary: Reconciliation['summary'] = {
    ...metadata,
    suppliedRows: entries.length,
    linkedByProfileAndName: 0,
    needsIdentityReview: 0,
    notInMap: 0,
    recordedDesignationConfirmed: 0,
    recordedSaLocationConfirmed: 0,
    missingAmongLinked: { title: 0, employer: 0, industry: 0 },
    rosterCompletenessVerified: false,
    activeMembershipVerifiedByTool: false,
  }

  for (const entry of entries) {
    const profileMatches = entry.publicProfileUrl ? (byProfile.get(entry.publicProfileUrl) ?? []) : []
    const nameMatches = byName.get(nameKey(entry.fullName)) ?? []
    const profilePerson = profileMatches.length === 1 ? profileMatches[0] : null
    const matched = profilePerson && nameKey(profilePerson.fullName) === nameKey(entry.fullName) ? profilePerson : null
    let identityStatus: IdentityStatus
    if (profileMatches.length > 1) identityStatus = 'PROFILE_COLLISION_REVIEW'
    else if (profilePerson && !matched) identityStatus = 'PROFILE_NAME_CONFLICT'
    else if (matched) identityStatus = 'PROFILE_AND_NAME_MATCH'
    else if (nameMatches.length && entry.publicProfileUrl) identityStatus = 'PROFILE_NOT_FOUND_NAME_REVIEW'
    else if (nameMatches.length) identityStatus = 'NAME_ONLY_REVIEW'
    else identityStatus = 'NOT_IN_MAP'

    const possibleResearchIds = matched ? [] : [...new Set([...profileMatches.map((person) => person.id), ...nameMatches])].sort()
    const title = matched && !/\bnot stated\b/i.test(matched.title) ? matched.title : ''
    const employer = matched?.employer ?? ''
    const industry = matched?.industry ?? ''
    const evidence = matched ? designationEvidence(matched) : ''
    const missingFields = [
      !matched && 'identity',
      evidence !== 'CONFIRMED' && 'ca_designation',
      (!matched || matched.country !== 'South Africa' || !['CONFIRMED', 'HIGH'].includes(matched.locationConfidence)) && 'sa_location',
      !title && 'title',
      !employer && 'employer',
      !industry && 'industry',
      !matched?.linkedinUrl && 'linkedin',
    ].filter((field): field is string => Boolean(field))

    rows.push({
      rowNumber: entry.rowNumber,
      rosterName: entry.fullName,
      rosterProfileUrl: entry.publicProfileUrl,
      identityStatus,
      researchId: matched?.id ?? '',
      researchName: matched?.fullName ?? '',
      designationEvidence: evidence,
      title,
      employer,
      industry,
      researchLinkedinUrl: matched?.linkedinUrl ?? '',
      researchCountry: matched?.country ?? '',
      researchLocationConfidence: matched?.locationConfidence ?? '',
      researchLastVerified: matched?.dateLastVerified ?? '',
      possibleResearchIds,
      missingFields,
    })
    if (matched) {
      summary.linkedByProfileAndName += 1
      if (evidence === 'CONFIRMED') summary.recordedDesignationConfirmed += 1
      if (matched.country === 'South Africa' && matched.locationConfidence === 'CONFIRMED') {
        summary.recordedSaLocationConfirmed += 1
      }
      if (!title) summary.missingAmongLinked.title += 1
      if (!employer) summary.missingAmongLinked.employer += 1
      if (!industry) summary.missingAmongLinked.industry += 1
    } else if (identityStatus === 'NOT_IN_MAP') summary.notInMap += 1
    else summary.needsIdentityReview += 1
  }
  return { rows, summary }
}

export function reconciliationCsv({ rows }: Reconciliation): string {
  const headers = [
    'roster_row', 'roster_name', 'roster_public_profile_url', 'identity_status',
    'research_id', 'research_name', 'designation_evidence', 'title', 'employer',
    'industry', 'research_linkedin_url', 'research_country', 'research_location_confidence',
    'research_last_verified', 'possible_research_ids', 'missing_fields',
  ]
  const data = [headers.join(',')]
  for (const row of rows) {
    data.push([
      String(row.rowNumber), row.rosterName, row.rosterProfileUrl, row.identityStatus,
      row.researchId, row.researchName, row.designationEvidence, row.title, row.employer,
      row.industry, row.researchLinkedinUrl, row.researchCountry, row.researchLocationConfidence,
      row.researchLastVerified, row.possibleResearchIds.join('; '), row.missingFields.join('; '),
    ].map(csvCell).join(','))
  }
  return `${data.join('\r\n')}\r\n`
}

function option(args: string[], key: string): string {
  const match = args.filter((arg) => arg.startsWith(`${key}=`))
  if (match.length !== 1) throw new Error(`Provide exactly one ${key}=... option.`)
  return match[0].slice(key.length + 1)
}

function isDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`)
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === value
}

function privateInputPath(input: string): string {
  // Resolving symlinks prevents an ignored-path alias to a tracked file.
  let path: string
  try {
    path = realpathSync(resolve(input))
  } catch {
    throw new Error('Private roster file not found or unreadable.')
  }
  privateDataDir(path)
  if (statSync(path).size > 25 * 1024 * 1024) throw new Error('Roster exceeds the 25 MB input limit.')
  return path
}

function privateOutputDir(): string {
  const root = resolve('.local')
  if (!existsSync(root)) mkdirSync(root, { mode: 0o700 })
  privateDataDir(realpathSync(root))
  const target = resolve(root, 'casa')
  if (!existsSync(target)) mkdirSync(target, { mode: 0o700 })
  privateDataDir(realpathSync(target))
  chmodSync(target, 0o700)
  return target
}

function writePrivateOutput(directory: string, filename: string, contents: string): void {
  // A fresh file and atomic rename never follow an existing output symlink
  // into the public repo. File mode remains private even on repeated runs.
  const destination = resolve(directory, filename)
  const temporary = resolve(directory, `.${filename}.${randomUUID()}.tmp`)
  try {
    writeFileSync(temporary, contents, { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    renameSync(temporary, destination)
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary)
  }
}

function main(): void {
  const args = process.argv.slice(2)
  const file = args.filter((arg) => !arg.startsWith('--'))
  const allowed = args.every((arg) => !arg.startsWith('--') || arg === '--write' || arg === '--rights-confirmed'
    || ['--as-of=', '--scope=', '--source-reference='].some((prefix) => arg.startsWith(prefix)))
  if (file.length !== 1 || !allowed) {
    throw new Error('Usage: npm run accountants:casa-reconcile -- PRIVATE_ROSTER.csv --as-of=YYYY-MM-DD --scope=resident-in-sa|working-in-sa --source-reference=LABEL --rights-confirmed [--write]')
  }
  if (!args.includes('--rights-confirmed')) {
    throw new Error('Refusing to read the roster without --rights-confirmed (explicit permission for this use).')
  }
  const asOf = option(args, '--as-of')
  const scope = option(args, '--scope')
  const sourceReference = option(args, '--source-reference')
  if (!isDate(asOf) || !['resident-in-sa', 'working-in-sa'].includes(scope)) {
    throw new Error('Provide a valid roster date and either resident-in-sa or working-in-sa scope.')
  }
  if (!/^[a-z0-9][a-z0-9._:-]{0,99}$/i.test(sourceReference)) {
    throw new Error('Use a non-sensitive alphanumeric source reference (letters, digits, . _ : -).')
  }
  const input = privateInputPath(file[0])
  const entries = parseRosterCsv(readFileSync(input, 'utf8'))
  const people = readCasaResearchPeople(readFileSync(resolve('markets/accountants/people.jsonl'), 'utf8'))
  const result = reconcileCasaRoster(entries, people, { sourceReference, scope: scope as RosterScope, asOf })
  const mode = args.includes('--write') ? 'private-ledger-written' : 'dry-run'
  if (mode === 'private-ledger-written') {
    const directory = privateOutputDir()
    writePrivateOutput(directory, 'reconciliation.csv', reconciliationCsv(result))
    writePrivateOutput(directory, 'summary.json', `${JSON.stringify(result.summary, null, 2)}\n`)
  }
  // Never print roster names or public profile URLs to the terminal.
  process.stdout.write(`${JSON.stringify({ mode, ...result.summary }, null, 2)}\n`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    main()
  } catch (error: unknown) {
    process.stderr.write(`${error instanceof Error ? error.message : 'Roster reconciliation failed.'}\n`)
    process.exitCode = 1
  }
}
