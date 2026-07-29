import {
  existsSync,
  readFileSync,
  readdirSync,
} from 'node:fs'
import { join } from 'node:path'
import { adaptCreditRiskProfiles, adaptSalesforceProfiles } from '../src/data/marketData/adapters'
import { buildMarketRegistry } from '../src/data/marketData/registry'
import type {
  MarketBatch,
  MarketProfile,
} from '../src/data/marketData/types'
import { talentTracks } from '../src/data/tracks'
import type { DataBundle, Profile } from '../src/data/types'
import type { SalesforcePerson } from '../src/data/marketData/adapters'

export interface RepositoryMarketData {
  registeredTrackSlugs: string[]
  trackNames: Map<string, string>
  legacyProfiles: MarketProfile[]
  batches: MarketBatch[]
  profiles: MarketProfile[]
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function loadBatches(rootDir: string) {
  const marketsDir = join(rootDir, 'markets')
  if (!existsSync(marketsDir)) return []

  const paths = readdirSync(marketsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const batchesDir = join(marketsDir, entry.name, 'batches')
      if (!existsSync(batchesDir)) return []
      return readdirSync(batchesDir)
        .filter((name) => name.endsWith('.json'))
        .map((name) => join(batchesDir, name))
    })
    .sort()

  return paths.map((path) => readJson<MarketBatch>(path))
}

function loadLegacyProfiles(rootDir: string) {
  const profilesPath = join(rootDir, 'profiles.json')
  const salesforcePath = join(rootDir, 'markets', 'salesforce', 'people.json')
  const legacyProfiles: MarketProfile[] = []

  if (existsSync(profilesPath)) {
    const profiles = readJson<Profile[]>(profilesPath)
    const data = {
      profiles,
      companies: [],
      segments: [],
      orgChart: [],
      shortlist: [],
      summary: {},
    } as unknown as DataBundle
    legacyProfiles.push(...adaptCreditRiskProfiles(data))
  }

  if (existsSync(salesforcePath)) {
    legacyProfiles.push(
      ...adaptSalesforceProfiles(readJson<SalesforcePerson[]>(salesforcePath)),
    )
  }

  return legacyProfiles
}

export async function loadRepositoryMarketData(rootDir: string): Promise<RepositoryMarketData> {
  const registeredTrackSlugs = talentTracks.map(({ slug }) => slug).sort()
  const trackNames = new Map(talentTracks.map(({ slug, name }) => [slug, name]))
  const legacyProfiles = loadLegacyProfiles(rootDir)
  const batches = loadBatches(rootDir)
  const profiles = buildMarketRegistry({ legacyProfiles, batches, trackNames })

  return {
    registeredTrackSlugs,
    trackNames,
    legacyProfiles,
    batches,
    profiles,
  }
}
