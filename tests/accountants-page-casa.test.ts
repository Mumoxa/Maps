import test from 'node:test'
import assert from 'node:assert/strict'
import { accountantCandidates } from '../src/data/accountantsPeople'
import { mountPage } from './helpers/mount'

test('the CA(SA) browse link opens the filtered pool and exposes the inventory download', async () => {
  const page = await mountPage(
    '/src/pages/AccountantsPage.tsx',
    'AccountantsPage',
    '/accounting-finance?qualification=CA%28SA%29',
  )
  const expected = accountantCandidates.filter((candidate) => candidate.designations.includes('CA(SA)')).length
  assert.match(page.lowerText, new RegExp(`${expected} candidates match the current filters`))
  assert.ok(page.container.querySelector('a[href*="qualification=CA%28SA%29"]'))
  const download = page.container.querySelector('a[download="ca_sa_inventory.csv"]')
  assert.ok(download?.getAttribute('href')?.includes('ca_sa_inventory.csv'))
  const cards = Array.from(page.container.querySelectorAll('article.scan-card'))
  assert.ok(cards.length > 0)
  assert.ok(cards.every((card) => card.textContent?.includes('CA(SA)')))
  assert.ok(cards.some((card) => card.querySelector('a[href*="linkedin.com/in/"]')))
})
