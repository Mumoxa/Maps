import { resolve } from 'node:path'
import { assertValidMarketData } from '../src/data/marketData/validate'
import { loadRepositoryMarketData } from './market-data-repository'

async function validateRepository() {
  const repository = await loadRepositoryMarketData(resolve('.'))
  const issues = await assertValidMarketData({
    legacyProfiles: repository.legacyProfiles,
    batches: repository.batches,
    registeredTrackSlugs: repository.registeredTrackSlugs,
  })
  const perTrack = Object.fromEntries(
    repository.registeredTrackSlugs.map((trackSlug) => [
      trackSlug,
      repository.profiles.reduce(
        (count, profile) => count + Number(profile.trackSlug === trackSlug),
        0,
      ),
    ]),
  )
  const batchRecordCount = repository.batches.reduce(
    (count, batch) => count + batch.records.length,
    0,
  )
  const supersededCount = repository.legacyProfiles.length
    + batchRecordCount
    - repository.profiles.length

  process.stdout.write(`${JSON.stringify({
    totalProfiles: repository.profiles.length,
    perTrack,
    batchCount: repository.batches.length,
    legacyCount: repository.legacyProfiles.length,
    batchRecordCount,
    supersededCount,
    warnings: issues.filter(({ severity }) => severity === 'warning'),
  }, null, 2)}\n`)
}

validateRepository().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
