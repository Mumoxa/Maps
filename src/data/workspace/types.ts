// Private recruiter workspace contracts. Everything here is confidential:
// assignments, client labels, target decisions, tier overrides, candidate
// pipeline state, saved pools and private research imports.
//
// It is persisted only through a WorkspaceStore (browser-local today). It is
// never committed to the repository and never bundled into the public site.

import type { CuratedAssociation, ExplorerFilters } from '../intelligence/discovery'
import type { Tier, TierOverride } from '../intelligence/targeting'
import type { ResearchBatch, SearchRequirement } from '../intelligence/types'

export type AssignmentStatus = 'open' | 'on-hold' | 'closed'
export const ASSIGNMENT_STATUSES: readonly AssignmentStatus[] = ['open', 'on-hold', 'closed']

export interface RecruitmentSearch {
  id: string
  name: string
  /** Confidential client label. */
  client: string
  status: AssignmentStatus
  createdAt: string
  updatedAt: string
  requirement: SearchRequirement
  focalOrganizationIds: string[]
  /** Optional link to a Search Bank search (SearchBrief.id). */
  bankSearchId: string | null
  notes: string
}

export type TargetStatus = 'proposed' | 'approved' | 'researching' | 'mapped' | 'excluded'
export const TARGET_STATUSES: readonly TargetStatus[] = ['proposed', 'approved', 'researching', 'mapped', 'excluded']

export interface SearchTargetCompany {
  id: string
  searchId: string
  organizationId: string
  status: TargetStatus
  /** Tier computed by the rules when the company was added (kept for audit). */
  tierWhenAdded: Tier | null
  addedAt: string
  addedFrom: 'explorer' | 'pool' | 'manual'
  notes: string
}

export type SearchPersonStatus = 'identified' | 'approached' | 'interested' | 'not-interested' | 'shortlisted' | 'rejected'
export const SEARCH_PERSON_STATUSES: readonly SearchPersonStatus[] = ['identified', 'approached', 'interested', 'not-interested', 'shortlisted', 'rejected']

/** A person's state in one search. The assessment belongs to this search only and is never copied to another. */
export interface SearchPerson {
  id: string
  searchId: string
  personId: string
  organizationId: string | null
  status: SearchPersonStatus
  assessment: string
  addedAt: string
  updatedAt: string
}

export interface PoolQuery {
  focalId: string | null
  roleContextId: string | null
  requirement: SearchRequirement
  filters: ExplorerFilters
  scope: 'associated' | 'all'
}

export interface SavedTargetPool {
  id: string
  name: string
  /** snapshot keeps the exact list; dynamic re-runs the query against current data. */
  mode: 'snapshot' | 'dynamic'
  createdAt: string
  query: PoolQuery
  snapshot: { organizationIds: string[]; tiers: Record<string, Tier>; capturedAt: string } | null
  searchId: string | null
}

export interface StoredOverride extends TierOverride {
  /** `search:<id>`, `context:<role context id>` or `custom`. */
  contextKey: string
  organizationId: string
}

export interface ImportBatchRecord {
  id: string
  fileName: string
  importedAt: string
  contentHash: string
  format: 'csv' | 'json'
  rowCount: number
  accepted: number
  duplicates: number
  conflicts: number
  rejected: number
  newOrganizations: number
  researchBatchId: string
  status: 'committed' | 'rolled-back'
}

export interface Workspace {
  schemaVersion: 1
  searches: RecruitmentSearch[]
  targets: SearchTargetCompany[]
  searchPeople: SearchPerson[]
  pools: SavedTargetPool[]
  overrides: StoredOverride[]
  curatedAssociations: CuratedAssociation[]
  imports: ImportBatchRecord[]
  researchBatches: ResearchBatch[]
  updatedAt: string
}

export function emptyWorkspace(): Workspace {
  return {
    schemaVersion: 1,
    searches: [],
    targets: [],
    searchPeople: [],
    pools: [],
    overrides: [],
    curatedAssociations: [],
    imports: [],
    researchBatches: [],
    updatedAt: '',
  }
}
