// Search Bank — the uniform record contract for the recruiter's candidate bank.
//
// A "search" (SearchBrief) is one dedicated client search: the group every
// dropped candidate is filed under. A candidate (BankCandidate) is the single
// normalised shape every drop — CSV, JSON or pasted text — is transformed into
// before it is stored, so the bank stays retrievable and never turns into a mess.

export type SearchStatus = 'active' | 'on-hold' | 'filled' | 'closed'

export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'shortlisted'
  | 'contacted'
  | 'submitted'
  | 'interviewing'
  | 'placed'
  | 'archived'

export const SEARCH_STATUSES: readonly SearchStatus[] = ['active', 'on-hold', 'filled', 'closed']

export const CANDIDATE_STATUSES: readonly CandidateStatus[] = [
  'new',
  'screening',
  'shortlisted',
  'contacted',
  'submitted',
  'interviewing',
  'placed',
  'archived',
]

/** Seniority ladder, least to most senior. Derived from the title, never guessed at beyond it. */
export const SENIORITY_LEVELS: readonly string[] = [
  'Intern / Graduate',
  'Junior',
  'Mid',
  'Senior',
  'Lead / Manager',
  'Head',
  'Director',
  'VP',
  'C-suite',
  'Not stated',
]

export interface BankLocation {
  city: string
  province: string
  country: string
}

export interface SearchBrief {
  /** Stable slug id, e.g. `search-credit-risk-manager-firstrand`. */
  id: string
  /** The search as the recruiter names it, e.g. "Credit Risk Manager — FirstRand". */
  name: string
  client: string
  /** Target title for the search. */
  role: string
  /** ISO date (YYYY-MM-DD) the search was opened. */
  openedOn: string
  status: SearchStatus
  notes: string
}

export interface BankCandidate {
  /** Stable id derived from search + name, so re-dropping the same person updates them. */
  id: string
  /** Which search this candidate is filed under (SearchBrief.id). */
  searchId: string
  fullName: string
  title: string
  seniority: string
  employer: string
  location: BankLocation
  /** Pre-computed "City, Province, Country" label. */
  locationLabel: string
  /** What they can do. */
  skills: string[]
  /** Degrees, designations and certifications. */
  qualifications: string[]
  experienceYears: number | null
  availability: string
  email: string
  phone: string
  profileUrl: string
  /** Recruiter assessment, 1–5. */
  rating: number | null
  status: CandidateStatus
  /** Free-form labels the recruiter adds on top of the facets. */
  tags: string[]
  notes: string
  /** Where the drop came from (file name, "pasted", "manual"). */
  source: string
  /** ISO date the candidate first entered the bank. */
  addedOn: string
  /** ISO date of the last change to the record. */
  updatedOn: string
}

export interface SearchBankFile {
  schemaVersion: 1
  /** ISO date the bank file was last written. */
  generatedOn: string
  searches: SearchBrief[]
  candidates: BankCandidate[]
}

/** One normalised candidate plus the provenance of the row it came from. */
export interface BankDraft extends BankCandidate {
  /** The search name exactly as the drop spelled it (used to create the brief). */
  searchName: string
  /** Client named by the drop, recorded on the search when it is created. */
  searchClient: string
  /** Target role named by the drop, recorded on the search when it is created. */
  searchRole: string
  /** Row number in the dropped file (1-based, header excluded) or block index. */
  rowNumber: number
  /** True when this draft updates a candidate already in the bank. */
  existed: boolean
}

export type DropFormat = 'csv' | 'json' | 'text'

export interface DropIssue {
  rowNumber: number
  field: string
  reason: string
}

export interface DropParseResult {
  format: DropFormat
  rows: Record<string, string>[]
  issues: DropIssue[]
}

export interface DropReport {
  format: DropFormat
  /** Rows read from the drop. */
  read: number
  /** Candidates appended to the bank. */
  added: number
  /** Existing candidates updated in place. */
  updated: number
  /** Rows skipped because they could not be normalised. */
  skipped: number
  /** Searches created because the drop named a search the bank did not have. */
  searchesCreated: string[]
  /** Names already filed under a different search (kept, flagged for review). */
  crossSearchMatches: string[]
  issues: DropIssue[]
}
