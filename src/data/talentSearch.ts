import Fuse from 'fuse.js'
import type { DataBundle, TalentProfile } from './types'
import { adaptCreditRiskProfiles, adaptSalesforceProfiles } from './marketData/adapters'
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
