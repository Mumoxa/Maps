// The single normaliser for the search bank.
//
// Every way a candidate can enter the bank — a dropped CSV, a dropped JSON
// file, or a blob of text pasted out of a CV or LinkedIn — is parsed here and
// mapped onto the one BankCandidate shape in ./types. The CLI importer
// (scripts/import-search-bank.ts) and the in-browser drop panel
// (src/pages/SearchBankPage.tsx) both call these functions, so a candidate
// stored through either route is stored in exactly the same shape.
//
// This module is deliberately dependency-free (no Node APIs) so it can be
// bundled for the browser as well as run by the importer.

import {
  type BankCandidate,
  type BankDraft,
  type BankLocation,
  type DropFormat,
  type DropIssue,
  type DropParseResult,
} from './types'

// ---------------------------------------------------------------------------
// Vocabulary tables — auditable, never inline in the logic.
// ---------------------------------------------------------------------------

/** Canonical field name -> every header spelling accepted for it. */
export const FIELD_ALIASES: Record<string, string[]> = {
  fullName: ['name', 'full name', 'candidate', 'candidate name', 'person'],
  title: ['job title', 'current title', 'role title', 'position', 'current role', 'current position'],
  employer: ['company', 'current company', 'organisation', 'organization', 'employer name', 'org'],
  searchName: ['search', 'search name', 'brief', 'client search', 'requisition', 'req', 'search / brief'],
  client: ['client name', 'end client', 'hiring company'],
  role: ['target role', 'role brief', 'position brief', 'vacancy'],
  city: ['town', 'location city', 'city / town'],
  province: ['state', 'region', 'province / state'],
  country: ['country / region'],
  location: ['location', 'area', 'based in', 'city, province', 'location (city, province)'],
  skills: ['key skills', 'core skills', 'skills / expertise', 'competencies', 'skillset'],
  qualifications: ['qualification', 'education', 'academic qualifications', 'degrees', 'certifications', 'certs', 'qualifications / education'],
  experienceYears: ['years experience', 'experience', 'years', 'yrs experience', 'years of experience', 'yrs'],
  availability: ['notice period', 'available', 'availability / notice'],
  email: ['e-mail', 'mail', 'email address', 'e-mail address'],
  phone: ['mobile', 'cell', 'cellphone', 'contact number', 'telephone', 'tel'],
  profileUrl: ['linkedin', 'linkedin url', 'profile', 'profile link', 'cv link', 'url', 'profile url'],
  rating: ['score', 'fit', 'fit score'],
  status: ['stage', 'pipeline status', 'candidate status'],
  tags: ['labels', 'tag', 'keywords'],
  notes: ['comment', 'comments', 'summary', 'remarks'],
  source: ['origin', 'source file', 'drop'],
  seniority: ['level', 'seniority level'],
}

/** Reverse lookup: header spelling (lower-cased) -> canonical field. */
const HEADER_TO_FIELD = new Map<string, string>()
for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
  HEADER_TO_FIELD.set(field.toLowerCase(), field)
  for (const alias of aliases) HEADER_TO_FIELD.set(alias.toLowerCase(), field)
}

const SENIORITY_ALIASES: Record<string, string> = {
  intern: 'Intern / Graduate',
  internship: 'Intern / Graduate',
  graduate: 'Intern / Graduate',
  entry: 'Intern / Graduate',
  junior: 'Junior',
  jnr: 'Junior',
  mid: 'Mid',
  midlevel: 'Mid',
  'mid-level': 'Mid',
  intermediate: 'Mid',
  senior: 'Senior',
  snr: 'Senior',
  lead: 'Lead / Manager',
  leader: 'Lead / Manager',
  manager: 'Lead / Manager',
  management: 'Lead / Manager',
  supervisor: 'Lead / Manager',
  head: 'Head',
  director: 'Director',
  vp: 'VP',
  'vice president': 'VP',
  executive: 'VP',
  csuite: 'C-suite',
  'c-suite': 'C-suite',
  chief: 'C-suite',
  'not stated': 'Not stated',
  unknown: 'Not stated',
  '': 'Not stated',
}

const STATUS_ALIASES: Record<string, string> = {
  new: 'new',
  'new candidate': 'new',
  fresh: 'new',
  screening: 'screening',
  reviewing: 'screening',
  review: 'screening',
  shortlisted: 'shortlisted',
  shortlist: 'shortlisted',
  contacted: 'contacted',
  contact: 'contacted',
  submitted: 'submitted',
  submit: 'submitted',
  interviewing: 'interviewing',
  interview: 'interviewing',
  placed: 'placed',
  hired: 'placed',
  archived: 'archived',
  archive: 'archived',
}

const AVAILABILITY_ALIASES: Record<string, string> = {
  immediate: 'Immediate',
  immediately: 'Immediate',
  now: 'Immediate',
  asap: 'Immediate',
  'available immediately': 'Immediate',
  '1 month': '1 month notice',
  'one month': '1 month notice',
  '30 days': '1 month notice',
  '2 months': '2 months notice',
  'two months': '2 months notice',
  '60 days': '2 months notice',
  '3 months': '3 months notice',
  'three months': '3 months notice',
  '90 days': '3 months notice',
  negotiable: 'Negotiable',
  flexible: 'Negotiable',
  employed: 'Employed — open to approaches',
  passive: 'Employed — open to approaches',
}

/** Lower-cased qualification spelling -> canonical form. Unknown values pass through unchanged. */
const QUALIFICATION_ALIASES: Record<string, string> = {
  bcom: 'BCom',
  'b.com': 'BCom',
  bcomm: 'BCom',
  bcompt: 'BCompt',
  bsc: 'BSc',
  'b.sc': 'BSc',
  bsceng: 'BSc (Eng)',
  'bsc eng': 'BSc (Eng)',
  beng: 'BEng',
  ba: 'BA',
  llb: 'LLB',
  btech: 'BTech',
  ndip: 'National Diploma',
  'national diploma': 'National Diploma',
  mcom: 'MCom',
  mba: 'MBA',
  msc: 'MSc',
  llm: 'LLM',
  pgdip: 'PGDip',
  'postgraduate diploma': 'PGDip',
  'post graduate diploma': 'PGDip',
  honours: 'Honours',
  hons: 'Honours',
  casa: 'CA(SA)',
  'ca(sa)': 'CA(SA)',
  'ca sa': 'CA(SA)',
  agasa: 'AGA(SA)',
  'aga(sa)': 'AGA(SA)',
  pasa: 'PA(SA)',
  'pa(sa)': 'PA(SA)',
  cima: 'CIMA',
  acca: 'ACCA',
  saica: 'SAICA',
  cfa: 'CFA',
  frm: 'FRM',
  prmia: 'PRMIA',
  'prm ia': 'PRMIA',
}

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
]

/** Province abbreviations and shorthand spellings. */
const PROVINCE_ABBREVIATIONS: Record<string, string> = {
  kzn: 'KwaZulu-Natal',
  'kwazulu natal': 'KwaZulu-Natal',
  ec: 'Eastern Cape',
  fs: 'Free State',
  gp: 'Gauteng',
  lp: 'Limpopo',
  mp: 'Mpumalanga',
  nw: 'North West',
  nc: 'Northern Cape',
  wc: 'Western Cape',
}

/** Cities that sit inside exactly one province — they fill the city AND the province. */
const CITY_TO_PROVINCE: Record<string, string> = {
  johannesburg: 'Gauteng',
  jhb: 'Gauteng',
  pretoria: 'Gauteng',
  'cape town': 'Western Cape',
  cpt: 'Western Cape',
  stellenbosch: 'Western Cape',
  durban: 'KwaZulu-Natal',
  umhlanga: 'KwaZulu-Natal',
  pietermaritzburg: 'KwaZulu-Natal',
  'port elizabeth': 'Eastern Cape',
  gqeberha: 'Eastern Cape',
  'east london': 'Eastern Cape',
  bloemfontein: 'Free State',
  polokwane: 'Limpopo',
  nelspruit: 'Mpumalanga',
  mbombela: 'Mpumalanga',
  rustenburg: 'North West',
  kimberley: 'Northern Cape',
}

const COUNTRY_ALIASES: Record<string, string> = {
  sa: 'South Africa',
  'south africa': 'South Africa',
  rsa: 'South Africa',
  za: 'South Africa',
  namibia: 'Namibia',
  botswana: 'Botswana',
  zimbabwe: 'Zimbabwe',
  mozambique: 'Mozambique',
  lesotho: 'Lesotho',
  eswatini: 'Eswatini',
  uk: 'United Kingdom',
  'united kingdom': 'United Kingdom',
  australia: 'Australia',
  ireland: 'Ireland',
  dubai: 'United Arab Emirates',
  uae: 'United Arab Emirates',
  'united arab emirates': 'United Arab Emirates',
}

const HONOURS_PATTERN = /honours|hons/i

// ---------------------------------------------------------------------------
// Small pure helpers
// ---------------------------------------------------------------------------

/** Collapse whitespace and trim. */
export function clean(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).replace(/\s+/g, ' ').trim()
}

/**
 * Split a list field. `;`, `|`, newlines and bullets always separate; commas
 * separate too, except that a `#` glued to a comma (C#, ...) stays attached.
 */
export function splitList(value: string, allowComma = true): string[] {
  const protectedValue = value.replace(/\s*#\s*/g, '#')
  const separators = allowComma ? /[;|\n\r•·]+|,/g : /[;|\n\r•·]+/g
  const seen = new Set<string>()
  const result: string[] = []
  for (const rawPart of protectedValue.split(separators)) {
    const part = clean(rawPart).replace(/^[-–—*]\s*/, '')
    if (!part) continue
    const key = part.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(part)
  }
  return result
}

export function dedupe(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(value)
  }
  return result
}

/** Canonical spelling for a known qualification; anything else passes through trimmed. */
export function normaliseQualification(value: string): string {
  const trimmed = clean(value)
  if (!trimmed) return ''
  const key = trimmed.toLowerCase().replace(/\s+/g, ' ')
  const mapped = QUALIFICATION_ALIASES[key]
  if (mapped) return mapped
  if (HONOURS_PATTERN.test(trimmed) && !trimmed.includes('(')) {
    const base = trimmed.replace(/\s*(honours|hons)\s*/gi, '').trim()
    const canonicalBase = normaliseQualification(base)
    if (canonicalBase) return `${canonicalBase} (Hons)`
  }
  return trimmed
}

/**
 * Split qualifications: commas only separate when every part is a known
 * qualification, so "BCom, University of Cape Town" stays one entry.
 */
export function splitQualifications(value: string): string[] {
  const coarse = splitList(value, false)
  const result: string[] = []
  for (const part of coarse) {
    const byComma = part.split(',').map((piece) => clean(piece)).filter(Boolean)
    if (byComma.length > 1 && byComma.every((piece) => QUALIFICATION_ALIASES[piece.toLowerCase()])) {
      result.push(...byComma)
    } else {
      result.push(part)
    }
  }
  return dedupe(result.map(normaliseQualification))
}

/** Deterministic id so the same dropped candidate always lands on the same record. */
export function hashId(input: string): string {
  let hash = 0x811c9dc5
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(36).padStart(7, '0')
}

export function slugifySearchName(name: string): string {
  return clean(name)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-')
}

/** Stable candidate id: same person + same search = same record, re-drops update. */
export function candidateId(searchId: string, fullName: string): string {
  const nameKey = clean(fullName).toLowerCase().replace(/[^a-z0-9]+/g, '')
  return `sb-${hashId(`${searchId}|${nameKey}`)}`
}

export function searchIdFor(name: string): string {
  const slug = slugifySearchName(name)
  return `search-${slug || hashId(name.toLowerCase())}`
}

/** Parse a number written as "5", "5 years", "10+". */
export function parseYears(value: string): number | null {
  const trimmed = clean(value)
  if (!trimmed) return null
  const match = trimmed.match(/\d+(?:\.\d+)?/)
  if (!match) return null
  const years = Number.parseFloat(match[0])
  if (!Number.isFinite(years) || years < 0 || years > 60) return null
  return Math.round(years)
}

/** Parse a rating written as "4", "4/5", "4.5", "80%". */
export function parseRating(value: string): number | null {
  const trimmed = clean(value)
  if (!trimmed) return null
  const percent = trimmed.match(/^(\d+(?:\.\d+)?)\s*%$/)
  if (percent) {
    const scaled = Math.round((Number.parseFloat(percent[1]) / 100) * 5)
    return scaled >= 1 && scaled <= 5 ? scaled : null
  }
  const outOf = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:\/|out of)\s*5$/i)
  if (outOf) {
    const rating = Math.round(Number.parseFloat(outOf[1]))
    return rating >= 1 && rating <= 5 ? rating : null
  }
  const plain = trimmed.match(/^(\d+(?:\.\d+)?)$/)
  if (plain) {
    const rating = Math.round(Number.parseFloat(plain[1]))
    return rating >= 1 && rating <= 5 ? rating : null
  }
  return null
}

export function normaliseStatus(value: string): string {
  const key = clean(value).toLowerCase()
  if (!key) return 'new'
  return STATUS_ALIASES[key] ?? 'new'
}

export function normaliseAvailability(value: string): string {
  const key = clean(value).toLowerCase().replace(/\.$/, '')
  if (!key) return ''
  return AVAILABILITY_ALIASES[key] ?? clean(value)
}

/** Explicit seniority value, or '' when it is not on the ladder. */
export function normaliseSeniority(value: string): string {
  const key = clean(value).toLowerCase()
  if (!key) return ''
  return SENIORITY_ALIASES[key] ?? ''
}

/**
 * Derive seniority from the title. Explicit values always win; this only fills
 * the gap, and returns 'Not stated' rather than guessing when nothing matches.
 */
export function inferSeniority(title: string): string {
  const value = clean(title)
  if (!value) return 'Not stated'
  if (/\b(intern|internship|trainee|graduate|entry[\s-]?level)\b/i.test(value)) return 'Intern / Graduate'
  if (/\b(junior|jnr)\b/i.test(value)) return 'Junior'
  if (/\b(chief|\bceo\b|\bcfo\b|\bcoo\b|\bcio\b|\bcto\b|\bcro\b|\bcco\b)\b/i.test(value)) return 'C-suite'
  if (/\b(vice president|\bvp\b)\b/i.test(value)) return 'VP'
  if (/\b(head of)\b/i.test(value)) return 'Head'
  if (/\bdirector\b/i.test(value)) return 'Director'
  if (/\b(lead|leader|manager|management|supervisor)\b/i.test(value)) return 'Lead / Manager'
  if (/\b(senior|snr|principal)\b/i.test(value)) return 'Senior'
  if (/\b(analyst|consultant|specialist|officer|administrator|coordinator|engineer|developer|advisor|adviser|associate)\b/i.test(value)) {
    return 'Mid'
  }
  return 'Not stated'
}

/** "Cape Town, Western Cape" -> { city, province, country }. Unknown parts become the city. */
export function parseLocation(value: string): BankLocation {
  const parts = splitList(value, true)
  const location: BankLocation = { city: '', province: '', country: 'South Africa' }
  const cityParts: string[] = []
  for (const part of parts.length > 0 ? parts : [clean(value)]) {
    const key = part.toLowerCase().replace(/[.]/g, '')
    if (COUNTRY_ALIASES[key]) {
      location.country = COUNTRY_ALIASES[key]
      continue
    }
    if (PROVINCES.some((province) => province.toLowerCase() === key)) {
      location.province = part
      continue
    }
    if (PROVINCE_ABBREVIATIONS[key]) {
      if (!location.province) location.province = PROVINCE_ABBREVIATIONS[key]
      continue
    }
    if (CITY_TO_PROVINCE[key]) {
      if (!location.city) {
        cityParts.push(part)
        if (!location.province) location.province = CITY_TO_PROVINCE[key]
        continue
      }
      if (!location.province) location.province = CITY_TO_PROVINCE[key]
      continue
    }
    cityParts.push(part)
  }
  location.city = cityParts.join(', ')
  if (!location.province) {
    const mapped = CITY_TO_PROVINCE[location.city.toLowerCase()]
    if (mapped) location.province = mapped
  }
  return location
}

export function locationLabel(location: BankLocation): string {
  return [location.city, location.province, location.country].filter(Boolean).join(', ')
}

// ---------------------------------------------------------------------------
// Parsing: three drop formats -> uniform rows
// ---------------------------------------------------------------------------

/** RFC 4180 CSV reader: quotes, escaped quotes, commas and newlines inside quotes. */
export function parseCsvRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }
    if (char === '"') {
      inQuotes = true
      continue
    }
    if (char === ',') {
      row.push(field)
      field = ''
      continue
    }
    if (char === '\n' || char === '\r') {
      if (char === '\r' && text[index + 1] === '\n') index += 1
      row.push(field)
      field = ''
      if (row.some((cell) => cell.trim().length > 0)) rows.push(row)
      row = []
      continue
    }
    field += char
  }
  row.push(field)
  if (row.some((cell) => cell.trim().length > 0)) rows.push(row)
  return rows
}

/** Map a header row onto canonical field names; unknown columns are dropped. */
export function mapHeader(header: string[]): (string | null)[] {
  return header.map((cell) => HEADER_TO_FIELD.get(normaliseKey(cell)) ?? null)
}

function normaliseKey(cell: string): string {
  return clean(cell).toLowerCase().replace(/[*:]/g, '').trim()
}

function rowsFromTable(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) return []
  const header = mapHeader(rows[0])
  const mapped: Record<string, string>[] = []
  for (const cells of rows.slice(1)) {
    const record: Record<string, string> = {}
    let recognised = 0
    header.forEach((field, index) => {
      if (!field) return
      const value = clean(cells[index] ?? '')
      if (value) recognised += 1
      if (value) record[field] = value
    })
    if (recognised > 0) mapped.push(record)
  }
  return mapped
}

/**
 * Pasted text: blank-line separated blocks of `Key: value` lines. This is what
 * a recruiter gets when copying a shortlist out of an email or a chat message.
 * A block with no `Key: value` lines at all is read as a plain list of names,
 * one record per line.
 */
export function parseTextBlocks(text: string): Record<string, string>[] {
  const records: Record<string, string>[] = []
  for (const block of text.split(/\n\s*\n/)) {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    if (lines.length === 0) continue
    const record: Record<string, string> = {}
    let currentKey = ''
    let sawKey = false
    for (const line of lines) {
      const match = line.match(/^([A-Za-z][A-Za-z /()#-]{0,40}?)\s*[:=]\s*(.*)$/)
      const key = match ? HEADER_TO_FIELD.get(normaliseKey(match[1])) : undefined
      if (key) {
        sawKey = true
        currentKey = key
        if (clean(match?.[2] ?? '')) record[key] = clean(match?.[2] ?? '')
        continue
      }
      if (currentKey) {
        record[currentKey] = clean(`${record[currentKey] ?? ''} ${line.replace(/^[-•*]\s*/, '')}`)
      } else if (!record.fullName) {
        // A bare first line is the candidate's name.
        record.fullName = clean(line.replace(/^[-•*\d.)\s]+/, ''))
      }
    }
    if (sawKey && Object.keys(record).length > 0) {
      records.push(record)
      continue
    }
    // Nothing in the block was a `Key: value` line: read it as a list of names.
    for (const line of lines) {
      records.push({ fullName: clean(line.replace(/^[-•*\d.)\s]+/, '')) })
    }
  }
  return records
}

function looksLikeJson(text: string): boolean {
  const trimmed = text.trim()
  return trimmed.startsWith('[') || trimmed.startsWith('{')
}

function rowsFromJson(text: string): Record<string, string>[] {
  const parsed: unknown = JSON.parse(text)
  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { candidates?: unknown[] }).candidates)
      ? (parsed as { candidates: unknown[] }).candidates
      : null
  if (!list) throw new Error('JSON drop must be an array of candidates or an object with a "candidates" array')
  return list.map((entry, index) => {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      throw new Error(`JSON entry ${index + 1} must be an object`)
    }
    const record: Record<string, string> = {}
    for (const [rawKey, rawValue] of Object.entries(entry as Record<string, unknown>)) {
      const key = HEADER_TO_FIELD.get(normaliseKey(rawKey))
      if (!key) continue
      const value = Array.isArray(rawValue)
        ? rawValue.map((item) => clean(item)).filter(Boolean).join('; ')
        : clean(rawValue)
      if (value) record[key] = value
    }
    return record
  })
}

function detectFormat(text: string, fileName: string): DropFormat {
  const extension = fileName.toLowerCase().split('.').pop() ?? ''
  if (extension === 'json') return 'json'
  if (extension === 'csv') return 'csv'
  return looksLikeJson(text) ? 'json' : 'text'
}

/** Detect the drop format and return uniform rows plus non-fatal issues. */
export function parseDrop(text: string, fileName = ''): DropParseResult {
  const trimmed = text.trim()
  if (!trimmed) {
    return { format: 'csv', rows: [], issues: [{ rowNumber: 0, field: 'file', reason: 'drop is empty' }] }
  }
  const format = detectFormat(trimmed, fileName)

  if (format === 'json') {
    try {
      return { format, rows: rowsFromJson(trimmed), issues: [] }
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'invalid JSON'
      return { format, rows: [], issues: [{ rowNumber: 0, field: 'file', reason }] }
    }
  }

  const table = parseCsvRows(trimmed)
  if (mapHeader(table[0] ?? []).filter(Boolean).length >= 2) {
    return { format: 'csv', rows: rowsFromTable(table), issues: [] }
  }
  // No header row: a rectangular table is read positionally as name, title.
  // Reported as an issue so the reading is never silent.
  if (table.length >= 2 && new Set(table.map((row) => row.length)).size === 1 && table[0].length >= 2) {
    return {
      format: 'csv',
      rows: table
        .map((row) => ({ fullName: clean(row[0]), title: clean(row[1]) }))
        .filter((row) => row.fullName),
      issues: [{ rowNumber: 0, field: 'file', reason: 'no header row found — read positionally as name, title' }],
    }
  }
  const blocks = parseTextBlocks(trimmed)
  if (blocks.length > 0) return { format: 'text', rows: blocks, issues: [] }
  return {
    format: 'text',
    rows: [],
    issues: [{ rowNumber: 0, field: 'file', reason: 'no recognisable candidate rows in the drop' }],
  }
}

// ---------------------------------------------------------------------------
// Normalising rows -> BankCandidate drafts
// ---------------------------------------------------------------------------

export interface NormaliseOptions {
  /** Fallback search name when a row does not name one. */
  defaultSearch?: string
  /** Default client recorded on searches created by this drop. */
  defaultClient?: string
  /** Where the drop came from — stored on every candidate. */
  source?: string
  /** ISO date stamped as addedOn/updatedOn. */
  today: string
}

function blank(value: string | undefined): boolean {
  return clean(value ?? '').length === 0
}

/**
 * Normalise one parsed row into a BankCandidate draft. Returns null when the
 * row cannot become a record (no name, or no search to file it under).
 */
export function normaliseRow(
  record: Record<string, string>,
  rowNumber: number,
  options: NormaliseOptions,
): { draft: BankCandidate | null; issues: DropIssue[] } {
  const issues: DropIssue[] = []
  if (blank(record.fullName)) {
    issues.push({ rowNumber, field: 'fullName', reason: 'is required — the row was skipped' })
    return { draft: null, issues }
  }
  const searchName = clean(record.searchName) || clean(options.defaultSearch ?? '')
  if (!searchName) {
    issues.push({ rowNumber, field: 'searchName', reason: 'no search named — pass --search or add a Search column' })
    return { draft: null, issues }
  }

  const fullName = clean(record.fullName)
  const title = clean(record.title)
  const searchId = searchIdFor(searchName)

  const explicitSeniority = normaliseSeniority(record.seniority ?? '')
  const seniority = explicitSeniority || inferSeniority(title)

  const fallbackLocation = parseLocation(clean(record.location))
  const location: BankLocation = {
    city: clean(record.city) || fallbackLocation.city,
    province: clean(record.province) || fallbackLocation.province,
    country: clean(record.country) || fallbackLocation.country,
  }

  const rating = blank(record.rating) ? null : parseRating(record.rating)
  if (!blank(record.rating) && rating === null) {
    issues.push({ rowNumber, field: 'rating', reason: `"${clean(record.rating)}" is not 1–5 — left unrated` })
  }
  const experienceYears = blank(record.experienceYears) ? null : parseYears(record.experienceYears)
  if (!blank(record.experienceYears) && experienceYears === null) {
    issues.push({
      rowNumber,
      field: 'experienceYears',
      reason: `"${clean(record.experienceYears)}" is not a number of years — left blank`,
    })
  }

  const draft: BankCandidate = {
    id: candidateId(searchId, fullName),
    searchId,
    fullName,
    title,
    seniority,
    employer: clean(record.employer),
    location,
    locationLabel: locationLabel(location),
    skills: splitList(record.skills ?? ''),
    qualifications: splitQualifications(record.qualifications ?? ''),
    experienceYears,
    availability: normaliseAvailability(record.availability ?? ''),
    email: clean(record.email),
    phone: clean(record.phone),
    profileUrl: clean(record.profileUrl),
    rating,
    status: normaliseStatus(record.status ?? '') as BankCandidate['status'],
    tags: splitList(record.tags ?? ''),
    notes: clean(record.notes),
    source: clean(options.source ?? '') || 'manual',
    addedOn: options.today,
    updatedOn: options.today,
  }
  return { draft, issues }
}

/** Turn every parsed row into drafts, keeping the row number for the report. */
export function normaliseDrop(
  parseResult: DropParseResult,
  options: NormaliseOptions,
): { drafts: BankDraft[]; issues: DropIssue[] } {
  const issues: DropIssue[] = [...parseResult.issues]
  const drafts: BankDraft[] = []
  for (const [index, record] of parseResult.rows.entries()) {
    const rowNumber = index + 1
    const result = normaliseRow(record, rowNumber, options)
    for (const issue of result.issues) issues.push(issue)
    if (!result.draft) continue
    const searchName = clean(record.searchName) || clean(options.defaultSearch ?? '')
    drafts.push({
      ...result.draft,
      searchName,
      searchClient: clean(record.client),
      searchRole: clean(record.role),
      rowNumber,
      existed: false,
    })
  }
  return { drafts, issues }
}
