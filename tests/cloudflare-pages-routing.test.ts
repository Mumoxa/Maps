import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('Cloudflare Pages SPA routes are not masked by a top-level 404 document', () => {
  const packageData = JSON.parse(readFileSync(resolve('package.json'), 'utf8'))
  const redirects = readFileSync(resolve('public/_redirects'), 'utf8')
  assert.equal(existsSync(resolve('public/404.html')), false)
  assert.doesNotMatch(packageData.scripts.build, /404\.html|copyFileSync/)
  assert.match(redirects, /\/\*\s+\/index\.html\s+200/)
})
