import type { MarketProfile } from './types'

function increment(map: Map<string, number>, value: string) {
  if (!value) return
  map.set(value, (map.get(value) ?? 0) + 1)
}

export function deriveMarketSummary(profiles: MarketProfile[]) {
  const byTrack = new Map<string, number>()
  const byCompany = new Map<string, number>()
  const byLocation = new Map<string, number>()
  const byProvince = new Map<string, number>()
  const bySeniority = new Map<string, number>()
  const bySkill = new Map<string, number>()
  const bySpecialism = new Map<string, number>()
  const byProvenance = new Map<string, number>()
  let sourceCoverage = 0

  for (const profile of profiles) {
    increment(byTrack, profile.trackSlug)
    increment(byCompany, profile.company)
    increment(byLocation, profile.locationLabel)
    increment(byProvince, profile.location.province)
    increment(bySeniority, profile.seniority)
    increment(byProvenance, profile.provenance.kind)
    if (profile.sources.length > 0) sourceCoverage += 1
    for (const skill of profile.skills) increment(bySkill, skill)
    for (const specialism of profile.specialisms) increment(bySpecialism, specialism)
  }

  return {
    totalProfiles: profiles.length,
    byTrack,
    byCompany,
    byLocation,
    byProvince,
    bySeniority,
    bySkill,
    bySpecialism,
    byProvenance,
    sourceCoverage,
  }
}
