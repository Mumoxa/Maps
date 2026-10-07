// Filing normalised drafts into the bank, and exporting the bank back out.
//
// Merge rules (the whole point of the bank staying a bank, not a pile):
//  - a candidate whose stable id is already in the bank is UPDATED in place —
//    re-dropping the same person never creates a duplicate, and addedOn (when
//    they first entered the bank) is always preserved;
//  - a search named by a drop that the bank does not have yet is CREATED, so
//    every candidate always has a group to live in;
//  - the same person dropped under two different searches is kept under both
//    and flagged in the report — a recruiter may legitimately run one person in
//    two client searches, but it should never happen silently.

import {
  type BankCandidate,
  type BankDraft,
  type DropReport,
  type SearchBankFile,
  type SearchBrief,
} from './types'
import { clean, normaliseDrop, parseDrop, type NormaliseOptions } from './normalise'

export interface MergeOptions extends NormaliseOptions {
  /** The bank as it stands before this drop. */
  bank: SearchBankFile
}

export interface MergeResult {
  bank: SearchBankFile
  report: DropReport
}

/** Draft fields that carry a value win; blanks never wipe existing data. */
function patchFrom(draft: BankCandidate): Partial<BankCandidate> {
  const patch: Partial<BankCandidate> = {}
  const assign = <K extends keyof BankCandidate>(key: K) => {
    const value = draft[key]
    const empty = value === null
      || value === undefined
      || (typeof value === 'string' && value.trim().length === 0)
      || (Array.isArray(value) && value.length === 0)
    if (!empty) patch[key] = value as never
  }
  const keys: (keyof BankCandidate)[] = [
    'fullName', 'title', 'seniority', 'employer', 'location', 'locationLabel', 'skills',
    'qualifications', 'experienceYears', 'availability', 'email', 'phone', 'profileUrl',
    'rating', 'status', 'tags', 'notes', 'source',
  ]
  for (const key of keys) assign(key)
  return patch
}

/** File a set of drafts into the bank. */
export function mergeDrafts(drafts: BankDraft[], options: MergeOptions): MergeResult {
  const { bank, today } = options
  const searches: SearchBrief[] = bank.searches.map((search) => ({ ...search }))
  const candidates: BankCandidate[] = bank.candidates.map((candidate) => ({ ...candidate }))

  const searchByName = new Map(searches.map((search) => [search.name.toLowerCase(), search]))
  const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]))
  const nameToSearchId = new Map(candidates.map((candidate) => [candidate.fullName.toLowerCase(), candidate.searchId]))

  const report: DropReport = {
    format: 'csv',
    read: drafts.length,
    added: 0,
    updated: 0,
    skipped: 0,
    searchesCreated: [],
    crossSearchMatches: [],
    issues: [],
  }

  for (const draft of drafts) {
    const nameKey = draft.searchName.toLowerCase()
    let search = searchByName.get(nameKey)
    if (!search) {
      search = {
        id: draft.searchId,
        name: draft.searchName,
        client: draft.searchClient || clean(options.defaultClient ?? ''),
        role: draft.searchRole,
        openedOn: today,
        status: 'active',
        notes: '',
      }
      searches.push(search)
      searchByName.set(nameKey, search)
      report.searchesCreated.push(search.name)
    }

    const existing = candidateById.get(draft.id)
    if (existing) {
      const index = candidates.indexOf(existing)
      candidates[index] = {
        ...existing,
        ...patchFrom(draft),
        addedOn: existing.addedOn,
        updatedOn: today,
      }
      candidateById.set(existing.id, candidates[index])
      report.updated += 1
      continue
    }

    const previousSearchId = nameToSearchId.get(draft.fullName.toLowerCase())
    if (previousSearchId && previousSearchId !== draft.searchId) {
      report.crossSearchMatches.push(draft.fullName)
    }
    nameToSearchId.set(draft.fullName.toLowerCase(), draft.searchId)

    const stored: BankCandidate = { ...toStoredCandidate(draft), addedOn: today, updatedOn: today }
    candidates.push(stored)
    candidateById.set(stored.id, stored)
    report.added += 1
  }

  const orderedCandidates = candidates.sort((left, right) =>
    left.searchId.localeCompare(right.searchId)
    || left.fullName.localeCompare(right.fullName)
    || left.id.localeCompare(right.id))

  report.searchesCreated = [...new Set(report.searchesCreated)]
  report.crossSearchMatches = [...new Set(report.crossSearchMatches)]

  return {
    bank: {
      schemaVersion: 1,
      generatedOn: today,
      searches: searches.sort((left, right) => left.name.localeCompare(right.name)),
      candidates: orderedCandidates,
    },
    report,
  }
}

/** End-to-end: text in, merged bank out. Used by the CLI and by the tests. */
export function ingestDrop(text: string, options: MergeOptions & { fileName?: string }): MergeResult {
  const parseResult = parseDrop(text, options.fileName ?? '')
  const { drafts, issues } = normaliseDrop(parseResult, options)
  const result = mergeDrafts(drafts, options)
  result.report.format = parseResult.format
  result.report.issues = issues
  return result
}

/** A brand-new, empty bank. */
export function emptyBank(today: string): SearchBankFile {
  return { schemaVersion: 1, generatedOn: today, searches: [], candidates: [] }
}

// ---------------------------------------------------------------------------
// Export — the bank leaves in the same uniform shape it entered in
// ---------------------------------------------------------------------------

const CSV_COLUMNS: (keyof BankCandidate)[] = [
  'fullName', 'title', 'seniority', 'employer', 'locationLabel', 'skills', 'qualifications',
  'experienceYears', 'availability', 'email', 'phone', 'profileUrl', 'rating', 'status',
  'tags', 'notes', 'source', 'addedOn', 'updatedOn',
]

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function candidatesToCsv(candidates: BankCandidate[], searchNameForId: (id: string) => string): string {
  const lines = [['search', ...CSV_COLUMNS].join(',')]
  for (const candidate of candidates) {
    const cells = [csvCell(searchNameForId(candidate.searchId))]
    for (const column of CSV_COLUMNS) {
      const value = candidate[column]
      cells.push(Array.isArray(value) ? csvCell(value.join('; ')) : csvCell(value))
    }
    lines.push(cells.join(','))
  }
  return `${lines.join('\n')}\n`
}

/** Candidate rows without the drop-only bookkeeping fields. */
export function toStoredCandidate(draft: BankDraft): BankCandidate {
  const stored: BankCandidate = { ...draft }
  delete (stored as Partial<BankDraft>).searchName
  delete (stored as Partial<BankDraft>).searchClient
  delete (stored as Partial<BankDraft>).searchRole
  delete (stored as Partial<BankDraft>).rowNumber
  delete (stored as Partial<BankDraft>).existed
  return stored
}

