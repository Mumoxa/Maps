import fs from 'node:fs'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { buildIndustryAtlas } from '../src/data/organizations/atlas'
import { organizationTaxonomy } from '../src/data/organizations/taxonomyPlacement'
import { sectorTree } from '../src/data/taxonomy/load'
import type { Company } from '../src/data/types'

const companies = JSON.parse(fs.readFileSync('companies.json', 'utf8')) as Company[]

const creditRisk = companies.map((company) => ({
  name: company.name,
  segment: company.segment,
  profileCount: company.profile_count ?? 0,
}))

const intelligence = buildCompanyIntelligence({ creditRiskCompanies: creditRisk })
const atlas = buildIndustryAtlas(intelligence.index, intelligence.all)

console.log('=== COMPANY UNIVERSE ===')
console.log('curated organizations.json:', intelligence.index.organizations.length)
console.log('dataset-only employers:', intelligence.extraOrganizations.length)
console.log('total visible organizations:', intelligence.all.length)
console.log()
console.log('=== ATLAS COVERAGE ===')
console.log('taxonomy nodes:', atlas.totals.taxonomyNodes)
console.log('mapped organizations:', atlas.totals.mappedOrganizations)
console.log('unclassified organizations:', atlas.totals.unclassifiedOrganizations)
console.log('populated branches:', atlas.totals.populatedBranches)
console.log('populated niches:', atlas.totals.populatedNiches, '/', atlas.totals.nicheCount)
console.log()
console.log('=== PLACEMENT DETAIL ===')
let placed = 0
let unplaced = 0
const byLevel: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
for (const org of intelligence.all) {
  const placement = organizationTaxonomy(org)
  if (placement.entries.length === 0) {
    unplaced += 1
    continue
  }
  placed += 1
  for (const entry of placement.entries) byLevel[entry.node.level] = (byLevel[entry.node.level] ?? 0) + 1
}
console.log('organizations with placement:', placed)
console.log('organizations without placement:', unplaced)
console.log('placement node-level distribution:', byLevel)
console.log()
console.log('=== EMPLOYERS BY DATASET (professionals>0) ===')
const dsCount = new Map<string, number>()
for (const employer of intelligence.index.employersByOrg.values()) {
  for (const dataset of employer.datasets) dsCount.set(dataset, (dsCount.get(dataset) ?? 0) + 1)
}
console.log([...dsCount.entries()].sort((a, b) => b[1] - a[1]))
console.log()
console.log('=== TAXONOMY NODE LEVELS ===')
const lvl: Record<number, number> = {}
for (const node of sectorTree) lvl[node.level] = (lvl[node.level] ?? 0) + 1
console.log(lvl)
