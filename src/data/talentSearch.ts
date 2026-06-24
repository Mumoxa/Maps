import Fuse from 'fuse.js'
import type { DataBundle, TalentProfile } from './types'
import { manualTalentProfiles } from './talentRegistry'

let cachedTalentProfiles: TalentProfile[] | null = null
let cachedTalentIndex: Fuse<TalentProfile> | null = null

function toCreditRiskTalentProfiles(data: DataBundle): TalentProfile[] {
  return data.profiles.map((profile) => ({
    id: `credit-risk-${profile.id}`,
    track: 'Credit Risk',
    trackSlug: 'credit-risk',
    name: profile.name,
    company: profile.company,
    title: profile.title,
    location: profile.location,
    seniority: profile.seniority,
    skills: [profile.specialism, profile.function, profile.segment].filter(Boolean),
    sectors: [profile.segment, profile.category].filter(Boolean),
    summary: profile.evidence || profile.notes || `${profile.title} at ${profile.company}`,
    linkedinUrl: profile.linkedin_url,
    sourceType: 'bundled',
    sourceProfileId: profile.id,
  }))
}

export function getTalentProfiles(data: DataBundle): TalentProfile[] {
  if (cachedTalentProfiles) return cachedTalentProfiles

  const bundledProfiles = toCreditRiskTalentProfiles(data)
  cachedTalentProfiles = [...bundledProfiles, ...manualTalentProfiles]
  return cachedTalentProfiles
}

export function createTalentSearchIndex(talentProfiles: TalentProfile[]) {
  if (cachedTalentIndex) return cachedTalentIndex

  cachedTalentIndex = new Fuse(talentProfiles, {
    keys: [
      { name: 'name', weight: 0.24 },
      { name: 'title', weight: 0.18 },
      { name: 'company', weight: 0.14 },
      { name: 'location', weight: 0.14 },
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
    if (filters.location && !includesIgnoreCase(profile.location, filters.location)) return false
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
