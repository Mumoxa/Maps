import test from 'node:test'
import assert from 'node:assert/strict'
import { contacts } from '../src/data/contacts'
import { filterContacts, readContactSelections } from '../src/data/contactDirectory'
import { mountPage } from './helpers/mount'

test('an imported candidate links one canonical dossier and the source company contacts', async () => {
  const page = await mountPage(
    '/src/pages/AccountantsPage.tsx',
    'AccountantsPage',
    '/accounting-finance?sourceCohort=MBAWC%202026-10-22&q=Gerrit%20van%20Niekerk',
  )
  const card = page.container.querySelector('article.scan-card')
  assert.ok(card)
  assert.match(card.textContent ?? '', /Gerrit van Niekerk/)
  assert.equal(card.querySelectorAll('a[href="/organizations/org-mbawc-156"]').length, 1,
    'employer and member aliases must lead to one canonical company dossier')
  const contactLink = card.querySelector<HTMLAnchorElement>('a[href^="/contacts?"]')
  assert.ok(contactLink)
  const params = new URLSearchParams(contactLink.getAttribute('href')!.split('?')[1])
  assert.equal(params.has('company'), false, 'the singular company parameter is not a contacts filter')
  assert.ok(params.getAll('companies').length > 0)
  const found = filterContacts(contacts, '', readContactSelections(params))
  assert.ok(found.some((contact) => contact.sourceRecords.some((source) => (
    source.sheet === 'MBAWC Members' && source.row === 157
  ))), 'the link must retrieve the member directory contact, not an unfiltered directory')
})

test('a board-only candidate links the associated company without inventing an employer', async () => {
  const page = await mountPage(
    '/src/pages/AccountantsPage.tsx',
    'AccountantsPage',
    '/accounting-finance?sourceCohort=MBAWC%202026-10-22&q=Kunyalala%20Maphisa',
  )
  const card = page.container.querySelector('article.scan-card')
  assert.ok(card)
  assert.match(card.textContent ?? '', /Kunyalala Maphisa/)
  assert.equal(card.querySelectorAll('a[href="/organizations/org-mbawc-235"]').length, 1)
  const employerControl = card.querySelector<HTMLButtonElement>('.scan-stat-action')
  assert.equal(employerControl?.disabled, true, 'a board association must not turn into employment')
})
