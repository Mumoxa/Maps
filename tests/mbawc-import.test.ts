import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { accountantCandidates, accountantFacetDefs, accountantTextMatcher } from '../src/data/accountantsPeople'
import { contacts } from '../src/data/contacts'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { organizationTaxonomy } from '../src/data/organizations/taxonomyPlacement'
import { filterByFacets } from '../src/data/facets'

const auditPath = 'markets/organizations/import-audits/mbawc-2026-10-22.json'
function audit() {
  assert.ok(existsSync(auditPath), 'Every MBAWC source row needs an auditable import mapping')
  return JSON.parse(readFileSync(auditPath, 'utf8'))
}

test('MBAWC import retains the original workbook and every sheet row', () => {
  const a = audit()
  const bytes = readFileSync(a.sourceWorkbook)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), a.sourceSha256)
  const source = JSON.parse(readFileSync(a.sourceArchive, 'utf8'))
  assert.deepEqual(source.sheets.map((s: { name: string }) => s.name), ['README', 'MBAWC Members', 'Locations', 'Financial Leadership'])
  assert.equal(source.sheets.find((s: { name: string }) => s.name === 'MBAWC Members').rows.length, 347)
  assert.equal(source.sheets.find((s: { name: string }) => s.name === 'Locations').rows.length, 347)
  assert.equal(source.sheets.find((s: { name: string }) => s.name === 'Financial Leadership').rows.length, 25)
})

test('all MBAWC companies are canonical, classified and linked to source-retained private contacts', () => {
  const a = audit()
  const { index } = buildCompanyIntelligence()
  const contactById = new Map(contacts.map(c => [c.id, c]))
  assert.equal(a.members.length, 346)
  assert.equal(new Set(a.members.map((m: { sourceRow: number }) => m.sourceRow)).size, 346)
  for (const member of a.members) {
    const company = index.byId.get(member.organizationId)
    assert.ok(company, `Missing company for source row ${member.sourceRow}`)
    assert.ok(organizationTaxonomy(company).entries.length > 0 || member.classificationGap === 'No categories supplied; business activity not established')
    assert.ok(company.directoryEntries?.some(e => e.directory === 'MBAWC' && e.recordKey === member.sourceKey))
    const contact = contactById.get(member.contactId)
    assert.ok(contact?.sourceRecords.some(s => s.file === 'MBAWC_Members (2).xlsx' && s.sheet === 'MBAWC Members' && s.row === member.sourceRow))
    assert.ok(index.employersByOrg.get(company.id)?.contactEmployerNames.length)
    for (const entry of company.directoryEntries ?? []) {
      assert.equal(Object.hasOwn(entry.fields, 'Contact Person'), false)
      assert.equal(Object.hasOwn(entry.fields, 'Cellphone'), false)
      assert.equal(Object.hasOwn(entry.fields, 'Email'), false)
    }
  }
})

test('all 24 finance rows resolve to searchable profiles with honest CA designation filters', () => {
  const a = audit()
  const byId = new Map(accountantCandidates.map(c => [c.id, c]))
  assert.equal(a.people.length, 24)
  assert.equal(new Set(a.people.map((p: { personId: string }) => p.personId)).size, 24)
  for (const row of a.people) {
    const person = byId.get(row.personId)
    assert.ok(person, `Missing finance row ${row.sourceRow}`)
    assert.ok(accountantTextMatcher(person, 'mbawc'))
    if (row.caStatus === 'unconfirmed') assert.equal(person.designations.includes('CA(SA)'), false)
    else assert.ok(person.designations.includes('CA(SA)'))
  }
  const subset = a.people.map((p: { personId: string }) => byId.get(p.personId)!)
  const result = filterByFacets({ records: subset, defs: accountantFacetDefs, selections: { qualification: ['CA(SA)'] }, query: '', textMatcher: accountantTextMatcher })
  assert.equal(result.length, 22)
})

test('duplicate MBAWC company rows merge on VAT, membership and contact evidence without losing either row', () => {
  const a = audit()
  const first = a.members.find((m: { sourceKey: string }) => m.sourceKey === '20')
  const second = a.members.find((m: { sourceKey: string }) => m.sourceKey === '21')
  assert.equal(first.organizationId, second.organizationId)
  assert.equal(new Set(a.members.map((m: { organizationId: string }) => m.organizationId)).size, 345)
  const company = buildCompanyIntelligence().index.byId.get(first.organizationId)!
  const entries = company.directoryEntries!.filter(e => e.directory === 'MBAWC')
  assert.equal(entries.length, 2)
  assert.ok(entries.some(e => e.fields['Company Registration No.'] === '2016/475993/07'))
})

test('a newly imported finance profile keeps personal geography unknown when only company geography is supplied', () => {
  const row = audit().people.find((p: { sourceRow: number }) => p.sourceRow === 4)
  const person = accountantCandidates.find(p => p.id === row.personId)!
  assert.equal(person.province, '')
  assert.equal(person.city, '')
  assert.equal(person.country, '')
})

test('a group head-office label does not become Donna Msiska personal geography', () => {
  const person = accountantCandidates.find(p => p.id === 'acc-1157')!
  assert.equal(person.city, '')
  assert.equal(person.province, '')
})

test('imported source names and corroborated aliases remain searchable', () => {
  for (const [id, query] of [
    ['acc-1134', 'esethu dazana'], ['acc-0441', 'andrew christopher logan'],
    ['acc-0903', 'pieter gabriel stephanus de wit'], ['acc-1145', 'samuel jacobus odendaal'],
    ['acc-1157', 'donnafeg msiska'],
  ]) {
    const person = accountantCandidates.find(p => p.id === id)!
    assert.ok(accountantTextMatcher(person, query), `${id} is missing searchable name ${query}`)
  }
  const jay = accountantCandidates.find(p => p.fullName.includes('Venkanna'))!
  assert.ok(accountantTextMatcher(jay, 'jay venkanna'))
})

test('re-importing the archived MBAWC workbook is a no-op', () => {
  const a = audit()
  const run = spawnSync('python3', ['scripts/import_mbawc.py', a.sourceArchive], { encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
  const result = JSON.parse(run.stdout)
  assert.deepEqual(result.changedFiles, [])
})
