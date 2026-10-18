import type { MarketBatch, MarketProfile } from './types'

interface BuildMarketRegistryInput {
  legacyProfiles: MarketProfile[]
  batches: MarketBatch[]
  trackNames: ReadonlyMap<string, string>
}

function locationLabel(location: MarketProfile['location']) {
  return [location.city, location.province, location.country]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(', ')
}

export function buildMarketRegistry({
  legacyProfiles,
  batches,
  trackNames,
}: BuildMarketRegistryInput): MarketProfile[] {
  const profilesById = new Map<string, MarketProfile>()
  const supersededIds = new Set<string>()

  for (const profile of legacyProfiles) {
    profilesById.set(profile.id, profile)
    if (profile.supersedesId) supersededIds.add(profile.supersedesId)
  }

  for (const batch of batches) {
    const track = trackNames.get(batch.trackSlug)
    if (!track) throw new Error(`Unknown market track: ${batch.trackSlug}`)

    for (const record of batch.records) {
      if (profilesById.has(record.id)) {
        throw new Error(`Duplicate market profile ID: ${record.id}`)
      }
      if (record.supersedesId) {
        if (supersededIds.has(record.supersedesId)) {
          throw new Error(`Conflicting correction chain for ${record.supersedesId}`)
        }
        supersededIds.add(record.supersedesId)
      }

      profilesById.set(record.id, {
        ...record,
        track,
        trackSlug: batch.trackSlug,
        locationLabel: locationLabel(record.location),
        provenance: {
          kind: 'batch',
          batchId: batch.batchId,
          sourceProfileId: null,
        },
      })
    }
  }

  return [...profilesById.values()]
    .filter(({ id }) => !supersededIds.has(id))
    .sort((left, right) => (
      left.trackSlug.localeCompare(right.trackSlug)
      || left.name.localeCompare(right.name)
      || left.id.localeCompare(right.id)
    ))
}
