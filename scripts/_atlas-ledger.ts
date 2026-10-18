import fs from 'node:fs'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { organizationTaxonomy } from '../src/data/organizations/taxonomyPlacement'
import type { Company } from '../src/data/types'

const companies = JSON.parse(fs.readFileSync('companies.json', 'utf8')) as Company[]
const creditRisk = companies.map((company) => ({
  name: company.name,
  segment: company.segment,
  profileCount: company.profile_count ?? 0,
}))

const intelligence = buildCompanyIntelligence({ creditRiskCompanies: creditRisk })

const rows: {
  id: string
  name: string
  datasets: string[]
  professionals: number
  classification: string
  curated: boolean
  placed: boolean
}[] = []

for (const org of intelligence.all) {
  const placement = organizationTaxonomy(org)
  const employer = intelligence.index.employersByOrg.get(org.id)
  rows.push({
    id: org.id,
    name: org.name,
    datasets: employer?.datasets ?? (org.datasets.length ? org.datasets : []),
    professionals: employer?.professionals ?? 0,
    classification: employer?.classifications.map((c) => c.value).filter(Boolean).join(' / ') ?? '',
    curated: intelligence.index.byId.has(org.id),
    placed: placement.entries.length > 0,
  })
}

const out = 'C:/Users/User/AppData/Local/Temp/opencode/universe-ledger.json'
fs.writeFileSync(out, JSON.stringify(rows, null, 2))

const unclassified = rows.filter((r) => !r.placed && !r.curated)
console.log('total rows:', rows.length)
console.log('unclassified (not placed, not curated):', unclassified.length)
const byDataset = new Map<string, number>()
for (const row of unclassified) {
  for (const d of row.datasets) byDataset.set(d, (byDataset.get(d) ?? 0) + 1)
}
console.log('unclassified by dataset:', [...byDataset.entries()])
console.log('--- 60 sample unclassified names ---')
console.log(unclassified.slice(0, 60).map((r) => `${r.name}  [${r.datasets.join(',')}]`).join('\n'))
console.log('\nwrote', out)
