// Target companies in the Search Bank — the write-back path from the Company
// Association Explorer.
//
// A recruiter builds a target pool in the explorer, exports it, and drops it
// here so the companies travel with the assignment they belong to. The rules are
// the bank's own rules, applied to companies instead of people:
//
//  - a company already attached to the same search is UPDATED in place, so
//    re-dropping the same pool never creates a duplicate (addedOn is preserved);
//  - a search named by a drop that the bank does not have yet is CREATED, so
//    every target always has an assignment to belong to;
//  - a company attached to two different searches is kept under both: the same
//    company can legitimately be a target for two client searches.
//
// What is stored is the company record and the reasoning behind the proposal.
// Nothing here asserts that any individual at the company is suitable — the
// explorer keeps those two ideas separate, and so does the bank.

import {
  type BankTargetCompany,
  type DropFormat,
  type DropIssue,
  type SearchBankFile,
  type SearchBrief,
  type TargetDropReport,
  TARGET_STATUSES,
  type TargetRecruiterStatus,
} from './types'
import { clean, dedupe, hashId, parseCsvRows, searchIdFor, splitList } from './normalise'

/** Header spellings the importer accepts, normalised to canonical field names. */
const TARGET_HEADERS: Record<string, string> = {
  company: 'name',
  companyname: 'name',
  company_name: 'name',
  organisation: 'name',
  organization: 'name',
  name: 'name',
  targetcompany: 'name',
  target_company: 'name',
  legalname: 'legalName',
  legal_name: 'legalName',
  registeredname: 'legalName',
  registered_name: 'legalName',
  organizationid: 'organizationId',
  organization_id: 'organizationId',
  organisationid: 'organizationId',
  pocket: 'pocket',
  industrypocket: 'pocket',
  industry_pocket: 'pocket',
  sector: 'pocket',
  tier: 'tier',
  relevancetier: 'tier',
  relevance_tier: 'tier',
  tierlabel: 'tierLabel',
  tier_label: 'tierLabel',
  reasons: 'reasons',
  why: 'reasons',
  rulehits: 'reasons',
  rule_hits: 'reasons',
  matchedrules: 'reasons',
  matched_rules: 'reasons',
  mappedprofessionals: 'mappedProfessionals',
  mapped_professionals: 'mappedProfessionals',
  professionals: 'mappedProfessionals',
  evidencestate: 'evidenceState',
  evidence_state: 'evidenceState',
  evidence: 'evidenceState',
  missingevidence: 'missingEvidence',
  missing_evidence: 'missingEvidence',
  gaps: 'missingEvidence',
  recruiterstatus: 'status',
  recruiter_status: 'status',
  status: 'status',
  addedon: 'addedOn',
  added_on: 'addedOn',
  search: 'searchName',
  searchname: 'searchName',
  search_name: 'searchName',
  assignment: 'searchName',
  client: 'clientName',
  clientname: 'clientName',
  client_name: 'clientName',
  role: 'searchRole',
}

function headerKey(value: string): string {
  return clean(value).toLowerCase().replace(/[^a-z0-9_]/g, '').replace(/__/g, '_')
}

/** A parsed row, keyed by canonical field name. Values are strings; typing happens in the normaliser. */
export type ParsedTargetRow = Record<string, string>

export interface ParsedTargetDrop {
  format: DropFormat
  /** Search named by the drop itself (the explorer payload carries one). */
  searchName: string
  clientName: string
  searchRole: string
  rows: ParsedTargetRow[]
  issues: DropIssue[]
}

/**
 * Map one raw record onto canonical fields. Two spellings can land on the same
 * field ("Tier" and "Relevance tier" both mean tier), so the first non-empty
 * value wins instead of the last column silently overwriting it.
 */
function rowFromRecord(entry: Record<string, unknown>): ParsedTargetRow {
  const record: ParsedTargetRow = {}
  for (const [rawKey, rawValue] of Object.entries(entry)) {
    const field = TARGET_HEADERS[headerKey(rawKey)]
    if (!field) continue
    const value = Array.isArray(rawValue)
      ? rawValue.map((item) => clean(item)).filter(Boolean).join('; ')
      : clean(rawValue)
    if (value && !record[field]) record[field] = value
  }
  return record
}

/**
 * Read a target drop. Accepted shapes: the explorer payload
 * (`{ kind: "search-targets", search, targets: [...] }`), a bare JSON array of
 * target objects, or CSV with a header row.
 */
export function parseTargetDrop(text: string, fileName = ''): ParsedTargetDrop {
  const issues: DropIssue[] = []
  const trimmed = text.trim()
  const extension = fileName.toLowerCase().split('.').pop() ?? ''

  if (trimmed.startsWith('{') || trimmed.startsWith('[') || extension === 'json') {
    let parsed: unknown
    try {
      parsed = JSON.parse(trimmed)
    } catch {
      throw new Error('target drop is not valid JSON')
    }
    if (Array.isArray(parsed)) {
      return {
        format: 'json',
        searchName: '',
        clientName: '',
        searchRole: '',
        rows: parsed.map((entry, index) => {
          if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
            issues.push({ rowNumber: index + 1, field: 'company', reason: 'entry is not an object' })
            return {}
          }
          return rowFromRecord(entry as Record<string, unknown>)
        }),
        issues,
      }
    }
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('target drop must be an array of targets or an object with a "targets" array')
    }
    const payload = parsed as Record<string, unknown>
    const list = Array.isArray(payload.targets)
      ? payload.targets
      : Array.isArray(payload.targetCompanies)
        ? payload.targetCompanies
        : null
    if (!list) {
      throw new Error('target drop must be an array of targets or an object with a "targets" array')
    }
    return {
      format: 'json',
      searchName: clean(payload.search ?? payload.searchName),
      clientName: clean(payload.client ?? payload.clientName),
      searchRole: clean(payload.role ?? payload.searchRole),
      rows: list.map((entry, index) => {
        if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
          issues.push({ rowNumber: index + 1, field: 'company', reason: 'entry is not an object' })
          return {}
        }
        return rowFromRecord(entry as Record<string, unknown>)
      }),
      issues,
    }
  }

  const table = parseCsvRows(trimmed)
  if (table.length === 0) return { format: 'csv', searchName: '', clientName: '', searchRole: '', rows: [], issues }
  const header = table[0].map((cell) => TARGET_HEADERS[headerKey(cell)] ?? '')
  const rows: ParsedTargetRow[] = []
  table.slice(1).forEach((cells, index) => {
    const record: ParsedTargetRow = {}
    let recognised = 0
    header.forEach((field, columnIndex) => {
      if (!field) return
      const value = clean(cells[columnIndex] ?? '')
      if (!value) return
      recognised += 1
      // Same rule as the JSON path: a duplicate spelling never overwrites.
      if (!record[field]) record[field] = value
    })
    if (recognised > 0) rows.push(record)
    else issues.push({ rowNumber: index + 2, field: 'company', reason: 'row has no recognised columns' })
  })
  return { format: 'csv', searchName: '', clientName: '', searchRole: '', rows, issues }
}

function parseTier(value: string): number | null {
  const digits = value.match(/\d/)
  if (!digits) return null
  const tier = Number(digits[0])
  return tier >= 1 && tier <= 5 ? tier : null
}

function parseStatus(value: string): TargetRecruiterStatus {
  const normalised = clean(value).toLowerCase().replace(/[\s-]+/g, '')
  const found = TARGET_STATUSES.find((status) => status.replace(/-/g, '') === normalised)
  return found ?? 'proposed'
}

function parseProfessionals(value: string): number {
  const digits = clean(value).replace(/[^\d]/g, '')
  return digits.length > 0 ? Number(digits) : 0
}

/** Stable id: the same company under the same search is always the same record. */
export function targetCompanyId(searchId: string, organizationId: string, name: string): string {
  const identity = (organizationId || name).trim().toLowerCase()
  return `target-${hashId(`${searchId}|${identity}`)}`
}

export interface TargetDraft extends BankTargetCompany {
  searchName: string
  clientName: string
  searchRole: string
  rowNumber: number
  existed: boolean
}

export interface TargetNormaliseOptions {
  today: string
  /** Search to attach to when the drop does not name one. */
  defaultSearch?: string
  defaultClient?: string
  source?: string
}

/** Turn parsed rows into bank-shaped target drafts. */
export function normaliseTargetRows(
  parsed: ParsedTargetDrop,
  options: TargetNormaliseOptions,
): { drafts: TargetDraft[]; issues: DropIssue[] } {
  const issues = [...parsed.issues]
  const drafts: TargetDraft[] = []
  const searchName = clean(parsed.searchName) || clean(options.defaultSearch ?? '')
  const clientName = clean(parsed.clientName) || clean(options.defaultClient ?? '')

  parsed.rows.forEach((row, index) => {
    const rowNumber = index + 1
    const name = clean(row['name'] ?? '')
    if (!name) {
      issues.push({ rowNumber, field: 'company', reason: 'no company name on the row' })
      return
    }
    const rowSearchName = clean(row['searchName'] ?? '') || searchName
    if (!rowSearchName) {
      issues.push({ rowNumber, field: 'search', reason: 'no search named on the row or on the drop' })
      return
    }
    const searchId = searchIdFor(rowSearchName)
    const organizationId = clean(row['organizationId'] ?? '')
    const tier = parseTier(row['tier'] ?? '')
    drafts.push({
      id: targetCompanyId(searchId, organizationId, name),
      searchId,
      organizationId,
      name,
      legalName: clean(row['legalName'] ?? ''),
      pocket: clean(row['pocket'] ?? ''),
      tier,
      tierLabel: clean(row['tierLabel'] ?? ''),
      reasons: dedupe(splitList(row['reasons'] ?? '', true)),
      mappedProfessionals: parseProfessionals(row['mappedProfessionals'] ?? ''),
      evidenceState: clean(row['evidenceState'] ?? '') || 'unknown',
      missingEvidence: dedupe(splitList(row['missingEvidence'] ?? '', true)),
      status: parseStatus(row['status'] ?? ''),
      source: clean(options.source ?? '') || 'target-drop',
      addedOn: clean(row['addedOn'] ?? '') || options.today,
      updatedOn: options.today,
      searchName: rowSearchName,
      clientName: clean(row['clientName'] ?? '') || clientName,
      searchRole: clean(row['searchRole'] ?? '') || clean(parsed.searchRole ?? ''),
      rowNumber,
      existed: false,
    })
  })
  return { drafts, issues }
}

export interface TargetMergeOptions extends TargetNormaliseOptions {
  bank: SearchBankFile
}

export interface TargetMergeResult {
  bank: SearchBankFile
  report: TargetDropReport
}

/** File target drafts into the bank. Re-attaching the same pool updates in place. */
export function mergeTargetDrafts(drafts: TargetDraft[], options: TargetMergeOptions): TargetMergeResult {
  const { bank, today } = options
  const searches: SearchBrief[] = bank.searches.map((search) => ({ ...search }))
  const targets: BankTargetCompany[] = (bank.targetCompanies ?? []).map((target) => ({ ...target }))
  const searchById = new Map(searches.map((search) => [search.id, search]))
  const targetById = new Map(targets.map((target) => [target.id, target]))
  const searchesCreated: string[] = []
  let added = 0
  let updated = 0

  for (const draft of drafts) {
    if (!searchById.has(draft.searchId)) {
      const search: SearchBrief = {
        id: draft.searchId,
        name: draft.searchName,
        client: draft.clientName,
        role: draft.searchRole,
        openedOn: today,
        status: 'active',
        notes: 'Created from a target-company drop in the Company Association Explorer.',
      }
      searches.push(search)
      searchById.set(search.id, search)
      searchesCreated.push(search.name)
    }

    const existing = targetById.get(draft.id)
    if (existing) {
      const merged: BankTargetCompany = { ...existing }
      // Draft values win; blanks never wipe recorded data.
      if (draft.organizationId) merged.organizationId = draft.organizationId
      if (draft.legalName) merged.legalName = draft.legalName
      if (draft.pocket) merged.pocket = draft.pocket
      if (draft.tier !== null) { merged.tier = draft.tier; merged.tierLabel = draft.tierLabel }
      if (draft.reasons.length > 0) merged.reasons = draft.reasons
      if (draft.mappedProfessionals > 0) merged.mappedProfessionals = draft.mappedProfessionals
      if (draft.evidenceState) merged.evidenceState = draft.evidenceState
      if (draft.missingEvidence.length > 0) merged.missingEvidence = draft.missingEvidence
      if (draft.status) merged.status = draft.status
      if (draft.source) merged.source = draft.source
      // addedOn is the date the target first entered the bank; a later drop
      // restating it never moves it, matching the candidate merge rule.
      merged.updatedOn = today
      draft.existed = true
      updated += 1
      targetById.set(merged.id, merged)
      const position = targets.findIndex((target) => target.id === merged.id)
      if (position >= 0) targets[position] = merged
      else targets.push(merged)
      continue
    }

    const stored: BankTargetCompany = {
      id: draft.id,
      searchId: draft.searchId,
      organizationId: draft.organizationId,
      name: draft.name,
      legalName: draft.legalName,
      pocket: draft.pocket,
      tier: draft.tier,
      tierLabel: draft.tierLabel,
      reasons: draft.reasons,
      mappedProfessionals: draft.mappedProfessionals,
      evidenceState: draft.evidenceState,
      missingEvidence: draft.missingEvidence,
      status: draft.status,
      source: draft.source,
      addedOn: draft.addedOn || today,
      updatedOn: today,
    }
    targets.push(stored)
    targetById.set(stored.id, stored)
    added += 1
  }

  const report: TargetDropReport = {
    format: 'json',
    read: drafts.length,
    added,
    updated,
    skipped: drafts.filter((draft) => !draft.id).length,
    searchesCreated: dedupe(searchesCreated),
    issues: [],
  }

  const orderedTargets = [...targets].sort((left, right) => (
    left.searchId.localeCompare(right.searchId)
    || (left.tier ?? 9) - (right.tier ?? 9)
    || left.name.localeCompare(right.name)
  ))

  return {
    bank: {
      schemaVersion: 1,
      generatedOn: today,
      searches,
      candidates: bank.candidates.map((candidate) => ({ ...candidate })),
      targetCompanies: orderedTargets,
    },
    report,
  }
}

/** End-to-end: a dropped target file in, a merged bank out. */
export function ingestTargetDrop(
  text: string,
  options: TargetMergeOptions & { fileName?: string },
): TargetMergeResult {
  const parsed = parseTargetDrop(text, options.fileName ?? '')
  const { drafts, issues } = normaliseTargetRows(parsed, options)
  const result = mergeTargetDrafts(drafts, options)
  result.report.format = parsed.format
  result.report.issues = issues
  return result
}

/** Targets attached to one search, ordered by relevance tier. */
export function targetsForSearch(bank: SearchBankFile, searchId: string): BankTargetCompany[] {
  return (bank.targetCompanies ?? []).filter((target) => target.searchId === searchId)
}

