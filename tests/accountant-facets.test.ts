import test from 'node:test'
import assert from 'node:assert/strict'
import {
  accountantCandidates,
  accountantFacetDefs,
  accountantTextMatcher,
} from '../src/data/accountantsPeople'
import {
  activeFilterCount,
  buildFacetOptions,
  filterByFacets,
  readSelections,
  toggleValue,
  writeSelections,
  type FacetSelections,
} from '../src/data/facets'

function emptySelections(): FacetSelections {
  const selections: FacetSelections = {}
  for (const def of accountantFacetDefs) selections[def.key] = []
  return selections
}

function run(selections: FacetSelections, query = '') {
  return filterByFacets({
    records: accountantCandidates,
    defs: accountantFacetDefs,
    selections,
    query,
    textMatcher: accountantTextMatcher,
  })
}

test('designation and professional route are distinct facets', () => {
  // A CA(SA) filter is not the same population as a "SAICA Articles" filter.
  const caSa = run({ ...emptySelections(), qualification: ['CA(SA)'] })
  const saicaArticles = run({ ...emptySelections(), route: ['SAICA Articles'] })

  assert.ok(caSa.length > 0, 'expected CA(SA) holders')
  assert.ok(saicaArticles.length > 0, 'expected SAICA articles completers')

  // Every CA(SA) result actually holds the designation; every route result actually has the route.
  assert.ok(caSa.every((c) => c.designations.includes('CA(SA)')))
  assert.ok(saicaArticles.every((c) => c.professionalRoutes.includes('SAICA Articles')))

  // The two sets are not identical — the distinction is meaningful, not cosmetic.
  const caSaIds = new Set(caSa.map((c) => c.id))
  assert.ok(saicaArticles.some((c) => !caSaIds.has(c.id)) || caSa.some((c) => !c.professionalRoutes.includes('SAICA Articles')))
})

test('OR within a facet widens results', () => {
  const caSaOnly = run({ ...emptySelections(), qualification: ['CA(SA)'] }).length
  const both = run({ ...emptySelections(), qualification: ['CA(SA)', 'PA(SA)'] }).length
  const paSaOnly = run({ ...emptySelections(), qualification: ['PA(SA)'] }).length
  assert.ok(both >= caSaOnly)
  assert.ok(both >= paSaOnly)
  // No candidate holds both CA(SA) and PA(SA) in this dataset, so OR is the exact union.
  assert.equal(both, caSaOnly + paSaOnly)
})

test('AND across facets narrows results', () => {
  const caSa = run({ ...emptySelections(), qualification: ['CA(SA)'] }).length
  const caSaWc = run({ ...emptySelections(), qualification: ['CA(SA)'], province: ['Western Cape'] }).length
  assert.ok(caSaWc <= caSa)
  assert.ok(run({ ...emptySelections(), qualification: ['CA(SA)'], province: ['Western Cape'] })
    .every((c) => c.designations.includes('CA(SA)') && c.province === 'Western Cape'))
})

test('text query combines with facets (AND)', () => {
  const withText = run({ ...emptySelections(), province: ['Western Cape'] }, 'audit')
  const withoutText = run({ ...emptySelections(), province: ['Western Cape'] })
  assert.ok(withText.length <= withoutText.length)
  assert.ok(withText.every((c) => c.province === 'Western Cape'))
})

test('contextual counts exclude the target facet but honour others', () => {
  const selections = { ...emptySelections(), province: ['Western Cape'] }
  const input = { records: accountantCandidates, defs: accountantFacetDefs, selections, query: '', textMatcher: accountantTextMatcher }
  const qualDef = accountantFacetDefs.find((d) => d.key === 'qualification')!
  const options = buildFacetOptions(input, qualDef)
  const caSa = options.find((o) => o.value === 'CA(SA)')
  // The CA(SA) count under a Western Cape context equals CA(SA) AND Western Cape.
  const expected = run(selections).filter((c) => c.designations.includes('CA(SA)')).length
  assert.equal(caSa?.count, expected)
})

test('selected values stay visible even when context zeroes them', () => {
  // Select a route and a province combination that yields no overlap, then confirm the
  // selected route option is still present (count 0) so it can be deselected.
  const selections = { ...emptySelections(), route: ['ACCA PER'], province: ['Eastern Cape'] }
  const input = { records: accountantCandidates, defs: accountantFacetDefs, selections, query: '', textMatcher: accountantTextMatcher }
  const routeDef = accountantFacetDefs.find((d) => d.key === 'route')!
  const options = buildFacetOptions(input, routeDef)
  assert.ok(options.some((o) => o.value === 'ACCA PER'))
})

test('URL round-trip preserves multi-select selections', () => {
  const selections = { ...emptySelections(), qualification: ['CA(SA)', 'PA(SA)'], province: ['Western Cape'] }
  const params = writeSelections(new URLSearchParams(), selections)
  assert.equal(params.get('qualification'), 'CA(SA),PA(SA)')
  const parsed = readSelections(params, accountantFacetDefs)
  assert.deepEqual(parsed.qualification, ['CA(SA)', 'PA(SA)'])
  assert.deepEqual(parsed.province, ['Western Cape'])
  assert.deepEqual(parsed.route, [])
})

test('writeSelections drops empty facets and resets page', () => {
  const params = new URLSearchParams('qualification=CA(SA)&page=3')
  const next = writeSelections(params, { ...emptySelections(), qualification: [] })
  assert.equal(next.get('qualification'), null)
  assert.equal(next.get('page'), null)
})

test('toggleValue adds then removes', () => {
  let selections = emptySelections()
  selections = toggleValue(selections, 'qualification', 'CA(SA)')
  assert.deepEqual(selections.qualification, ['CA(SA)'])
  assert.equal(activeFilterCount(selections), 1)
  selections = toggleValue(selections, 'qualification', 'CA(SA)')
  assert.deepEqual(selections.qualification, [])
  assert.equal(activeFilterCount(selections), 0)
})

test('impossible combination yields zero results', () => {
  // Search string that cannot appear alongside a narrow facet.
  const results = run({ ...emptySelections(), route: ['SAICA Articles'] }, 'zzzznotarealtoken')
  assert.equal(results.length, 0)
})
