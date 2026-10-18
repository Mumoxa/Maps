import test from 'node:test'
import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { resolve } from 'node:path'
import { build } from 'vite'

test('the Vite-compiled batch loader publishes every immutable batch', async () => {
  const result = await build({
    configFile: false,
    root: resolve('.'),
    logLevel: 'silent',
    build: {
      target: 'esnext',
      write: false,
      lib: {
        entry: resolve('src/data/marketData/batchLoader.ts'),
        formats: ['es'],
        fileName: 'batch-loader',
      },
      rollupOptions: {
        external: [],
      },
    },
  })
  const outputs = Array.isArray(result) ? result : [result]
  const entryChunk = outputs
    .flatMap((output) => 'output' in output ? output.output : [])
    .find((item) => item.type === 'chunk' && item.isEntry)

  assert.ok(entryChunk && entryChunk.type === 'chunk')

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(entryChunk.code).toString('base64')}`
  const compiledLoader = await import(moduleUrl) as {
    loadPublishedMarketBatches: () => Array<{ records: unknown[] }>
  }
  const batches = compiledLoader.loadPublishedMarketBatches()
  const recordCount = batches.reduce((total, batch) => total + batch.records.length, 0)

  assert.equal(batches.length, 1)
  assert.equal(recordCount, 851)
})
