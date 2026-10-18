import Fuse from 'fuse.js'
import type { DataBundle, TalentProfile } from './types'
import { adaptAccountantCandidates, adaptCreditRiskProfiles, adaptDataScienceCandidates, adaptHackathonCandidates, adaptSalesforceProfiles } from './marketData/adapters'
import { normalizeIndustry } from './industryNormalization'
import { accountantCandidates } from './accountantsPeople'
import { dataScienceCandidates } from './dataSciencePeople'
import { hackathonCandidates } from './hackathonPeople'
import { loadPublishedMarketBatches } from './marketData/batchLoader'
import { buildMarketRegistry } from './marketData/registry'
import { salesforcePeople } from './salesforcePeople'
import { talentTracks } from './tracks'

let cachedTalentProfiles: TalentProfile[] | null = null
let cachedTalentIndex: Fuse<TalentProfile> | null = null

export function getTalentProfiles(data: DataBundle): TalentProfile[] {
  if (cachedTalentProfiles) return cachedTalentProfiles

  const legacyProfiles = [
    ...adaptCreditRiskProfiles(data),
    ...adaptSalesforceProfiles(salesforcePeople),
    ...adaptHackathonCandidates(hackathonCandidates),
    ...adaptAccountantCandidates(accountantCandidates),
    ...adaptDataScienceCandidates(dataScienceCandidates),
  ]
  const trackNames = new Map(talentTracks.map((track) => [track.slug, track.name]))
  cachedTalentProfiles = buildMarketRegistry({
    legacyProfiles,
    batches: loadPublishedMarketBatches(),
    trackNames,
  })
  return cachedTalentProfiles
}

export function createTalentSearchIndex(talentProfiles: TalentProfile[]) {
  if (cachedTalentIndex) return cachedTalentIndex

  cachedTalentIndex = new Fuse(talentProfiles, {
    keys: [
      { name: 'name', weight: 0.24 },
      { name: 'title', weight: 0.18 },
      { name: 'company', weight: 0.14 },
      { name: 'locationLabel', weight: 0.14 },
      { name: 'skills', weight: 0.16 },
      { name: 'summary', weight: 0.08 },
      { name: 'track', weight: 0.04 },
      { name: 'sectors', weight: 0.02 },
    ],
    threshold: 0.35,
    includeScore: true,
    ignoreLocation: true,
  })

  return cachedTalentIndex
}

export interface TalentSearchFilters {
  track?: string
  location?: string
  seniority?: string
  skill?: string
  industry?: string // Normalized industry (e.g., "Property Development & Investment")
  // Recruitment-sourced profile filters (from attributes)
  caConfidence?: 'CONFIRMED' | 'UNCONFIRMED' | 'HIGH' | 'MEDIUM' | 'LOW'
  projectFinanceEvidence?: boolean // Has evidence of project/development finance
  locationConfidence?: 'HIGH' | 'UNCONFIRMED' // Western Cape vs unknown
  researchTier?: 'A' | 'B' | 'C' // From designation_status
  recruitmentBatch?: string // batch_id from attributes
  searchName?: string // Recruitment search campaign name (e.g., "SLM - Head of Finance")
}

function includesIgnoreCase(value: string, query?: string) {
  if (!query) return true
  return value.toLowerCase().includes(query.toLowerCase())
}

function arrayIncludesIgnoreCase(values: string[], query?: string) {
  if (!query) return true
  const loweredQuery = query.toLowerCase()
  return values.some((value) => value.toLowerCase().includes(loweredQuery))
}

export function filterTalentProfiles(profiles: TalentProfile[], filters: TalentSearchFilters) {
  return profiles.filter((profile) => {
    if (filters.track && profile.trackSlug !== filters.track) return false
    if (filters.location && !includesIgnoreCase(profile.locationLabel, filters.location)) return false
    if (filters.seniority && profile.seniority !== filters.seniority) return false
    if (filters.skill && !arrayIncludesIgnoreCase(profile.skills, filters.skill) && !includesIgnoreCase(profile.summary, filters.skill)) return false

    // Recruitment-context filters (from attributes field)
    const attrs = profile.attributes || {}

    // Industry filter (normalized)
    if (filters.industry) {
      const rawIndustry = (attrs.current_industry || '').toString()
      const normalized = normalizeIndustry(rawIndustry)
      if (normalized !== filters.industry) return false
    }

    if (filters.caConfidence) {
      // Map confidence field names: attributes might have 'confidence' or designation_status
      const confidence = (attrs.confidence || attrs.designation_status || '').toString().toUpperCase()
      if (!confidence.includes(filters.caConfidence)) return false
    }

    if (filters.projectFinanceEvidence !== undefined) {
      const hasEvidence = (attrs.project_finance_evidence || '')
        .toString()
        .toLowerCase()
        .includes('not established') === false &&
        (attrs.project_finance_evidence || '').toString().trim().length > 0
      if (filters.projectFinanceEvidence !== hasEvidence) return false
    }

    if (filters.locationConfidence) {
      const locConf = (attrs.location_confidence || '').toString().toUpperCase()
      if (!locConf.includes(filters.locationConfidence)) return false
    }

    if (filters.researchTier) {
      const tier = (attrs.designation_status || '').toString().toUpperCase()
      const tierMap: Record<string, string> = {
        'A': 'CONFIRMED',
        'B': 'UNCONFIRMED',
        'C': 'UNCONFIRMED',
      }
      if (tier !== tierMap[filters.researchTier]) return false
    }

    if (filters.recruitmentBatch) {
      const batch = (attrs.batch_id || '').toString()
      if (batch !== filters.recruitmentBatch) return false
    }

    // Search campaign filter (SLM - Head of Finance, etc.)
    if (filters.searchName) {
      const searchName = (attrs.search_name || '').toString()
      if (!includesIgnoreCase(searchName, filters.searchName)) return false
    }

    return true
  })
}

export function searchTalentProfiles(
  searchIndex: Fuse<TalentProfile>,
  allProfiles: TalentProfile[],
  query: string,
  filters: TalentSearchFilters,
) {
  const baseResults = query.trim()
    ? searchIndex.search(query.trim()).map((result) => result.item)
    : allProfiles

  return filterTalentProfiles(baseResults, filters)
}

/**
 * Extract available facet values from talent profiles for building filter UIs.
 * Used by /accounting-finance and /talent-search to populate dropdown/checkbox filters.
 */
export function extractTalentFacets(profiles: TalentProfile[]) {
  const facets = {
    industries: new Map<string, number>(),
    caConfidence: new Set<string>(),
    locationConfidence: new Set<string>(),
    researchTier: new Set<string>(),
    recruitmentBatches: new Set<string>(),
    searchNames: new Set<string>(),
    projectFinanceEvidenceCount: 0,
  }

  profiles.forEach((profile) => {
    const attrs = profile.attributes || {}

    // Industry normalization
    const rawIndustry = (attrs.current_industry || '').toString()
    const normalized = normalizeIndustry(rawIndustry)
    facets.industries.set(normalized, (facets.industries.get(normalized) || 0) + 1)

    const conf = (attrs.confidence || attrs.designation_status || '').toString().trim()
    if (conf) facets.caConfidence.add(conf)

    const locConf = (attrs.location_confidence || '').toString().trim()
    if (locConf) facets.locationConfidence.add(locConf)

    const tier = (attrs.designation_status || '').toString().trim()
    if (tier) facets.researchTier.add(tier)

    const batch = (attrs.batch_id || '').toString().trim()
    if (batch) facets.recruitmentBatches.add(batch)

    const searchName = (attrs.search_name || '').toString().trim()
    if (searchName) facets.searchNames.add(searchName)

    const hasEvidence = (attrs.project_finance_evidence || '')
      .toString()
      .toLowerCase()
      .includes('not established') === false &&
      (attrs.project_finance_evidence || '').toString().trim().length > 0
    if (hasEvidence) facets.projectFinanceEvidenceCount++
  })

  return {
    industries: Object.fromEntries(
      Array.from(facets.industries.entries()).sort((a, b) => b[1] - a[1])
    ),
    caConfidenceOptions: Array.from(facets.caConfidence).sort(),
    locationConfidenceOptions: Array.from(facets.locationConfidence).sort(),
    researchTierOptions: Array.from(facets.researchTier).sort(),
    recruitmentBatchOptions: Array.from(facets.recruitmentBatches).sort(),
    searchNameOptions: Array.from(facets.searchNames).sort(),
    projectFinanceEvidenceCount: facets.projectFinanceEvidenceCount,
  }
}
