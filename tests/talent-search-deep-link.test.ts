import test from 'node:test'
import assert from 'node:assert/strict'
import { mountPage } from './helpers/mount'

test('a global talent-search deep link applies the imported alternate name on its first render', async () => {
  const page = await mountPage('/src/pages/TalentSearchPage.tsx', 'TalentSearchPage', '/talent-search?q=Donnafeg%20Msiska', { withData: true })
  const rows = Array.from(page.container.querySelectorAll('.talent-result-row'))
  const donna = rows.find(row => row.querySelector('h2')?.textContent === 'Donna Msiska')
  assert.ok(donna, 'The URL query must find the imported alias without requiring another keystroke')
  assert.equal(page.container.querySelector<HTMLInputElement>('input[aria-label="Search talent"]')?.value, 'Donnafeg Msiska')
  assert.equal(Boolean(donna.querySelector('.verified-dot')), false, 'Workbook-reported claims must not render a verified checkmark')
})
