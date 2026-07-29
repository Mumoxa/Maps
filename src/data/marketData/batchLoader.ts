import type { MarketBatch } from './types'

const modules: Record<string, unknown> = typeof import.meta.glob === 'function'
  ? import.meta.glob('../../../markets/*/batches/*.json', {
      eager: true,
      import: 'default',
    })
  : {}

export function loadPublishedMarketBatches(): MarketBatch[] {
  return Object.entries(modules)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, batch]) => batch as MarketBatch)
}
