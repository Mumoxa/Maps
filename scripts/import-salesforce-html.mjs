import fs from 'node:fs'
import path from 'node:path'

const sourcePath = process.argv[2] ?? 'C:\\Users\\craff\\Downloads\\SA_Salesforce_Market_Map_v2_FULL.html'
const outputPath = process.argv[3] ?? path.resolve('markets', 'salesforce', 'people.json')

const html = fs.readFileSync(sourcePath, 'utf8')
const table = html.match(/<table[^>]*id=["']peopleTable["'][^>]*>[\s\S]*?<\/table>/i)?.[0]

if (!table) {
  throw new Error('Could not find <table id="peopleTable"> in Salesforce HTML export.')
}

function decodeHtml(value) {
  const entities = new Map([
    ['&nbsp;', ' '],
    ['&amp;', '&'],
    ['&lt;', '<'],
    ['&gt;', '>'],
    ['&quot;', '"'],
    ['&#39;', "'"],
    ['&apos;', "'"],
    ['&mdash;', '-'],
    ['&ndash;', '-'],
  ])

  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:nbsp|amp|lt|gt|quot|apos|mdash|ndash);|&#39;/g, (entity) => entities.get(entity) ?? entity)
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00c2/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeAttribute(value) {
  return decodeHtml(value.replace(/\\"/g, '"'))
}

function splitList(value) {
  return decodeHtml(value)
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getCellValue(cells, index) {
  return cells[index] ? decodeHtml(cells[index]) : ''
}

const body = table.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] ?? table
const rowMatches = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
const people = []

for (const rowMatch of rowMatches) {
  const rowHtml = rowMatch[1]
  const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cellMatch) => cellMatch[1])
  if (cells.length < 10) continue

  const linkedinUrl = cells[10]?.match(/href=["']([^"']+)["']/i)?.[1] ?? ''
  const yearsValue = getCellValue(cells, 9)
  const yearsSalesforceExperience = Number.parseFloat(yearsValue)

  people.push({
    id: `sf-${String(people.length + 1).padStart(4, '0')}`,
    fullName: getCellValue(cells, 0),
    jobTitle: getCellValue(cells, 1),
    employer: getCellValue(cells, 2),
    employerType: getCellValue(cells, 3),
    city: getCellValue(cells, 4),
    province: getCellValue(cells, 5),
    country: 'South Africa',
    certifications: splitList(cells[6] ?? ''),
    clouds: splitList(cells[7] ?? ''),
    trailheadRank: getCellValue(cells, 8),
    yearsSalesforceExperience: Number.isFinite(yearsSalesforceExperience) ? yearsSalesforceExperience : null,
    linkedinUrl: linkedinUrl ? decodeAttribute(linkedinUrl) : '',
    source: path.basename(sourcePath),
  })
}

if (people.length === 0) {
  throw new Error('No Salesforce people rows were parsed from the HTML export.')
}

// --- Provenance guard (added July 2026 audit) -------------------------------
// The original SA_Salesforce_Market_Map_v2_FULL.html contained 959 machine-generated
// people out of 1,047. Re-running this importer against that file would reintroduce
// them. These checks fail the import when the tell-tale signatures reappear.
// Override only for a source you have manually verified: --allow-unverified
function auditProvenance(rows) {
  const warnings = []
  const slugOf = (row) => row.linkedinUrl.replace(/\/+$/, '').split('/').pop() ?? ''

  const sequential = rows.filter((row) => /-\d{1,4}$/.test(slugOf(row)))
  if (sequential.length > rows.length * 0.1) {
    warnings.push(
      `${sequential.length}/${rows.length} LinkedIn slugs end in a short numeric counter ` +
      `(e.g. "${slugOf(sequential[0])}"). Real LinkedIn identifiers are 7-9 digit hashes.`,
    )
  }

  const names = new Map()
  for (const row of rows) names.set(row.fullName, (names.get(row.fullName) ?? 0) + 1)
  const duplicates = [...names.values()].filter((count) => count > 1).length
  if (duplicates > rows.length * 0.02) {
    warnings.push(`${duplicates} full names occur more than once - suggests names recombined from a fixed pool.`)
  }

  const firstNames = new Set(rows.map((row) => row.fullName.split(' ')[0]))
  if (rows.length > 100 && firstNames.size < rows.length * 0.3) {
    warnings.push(`Only ${firstNames.size} distinct first names across ${rows.length} people - name pool is too small to be organic.`)
  }

  const titles = new Map()
  for (const row of rows) titles.set(row.jobTitle, (titles.get(row.jobTitle) ?? 0) + 1)
  const massRepeated = [...titles.values()].filter((count) => count >= 50).length
  if (massRepeated >= 5) {
    warnings.push(`${massRepeated} job titles each appear 50+ times - bulk rows are template-generated.`)
  }

  return warnings
}

const warnings = auditProvenance(people)
if (warnings.length > 0) {
  const report = warnings.map((warning) => `  - ${warning}`).join('\n')
  if (!process.argv.includes('--allow-unverified')) {
    throw new Error(
      `Provenance check failed for ${path.basename(sourcePath)}:\n${report}\n\n` +
      'This source looks machine-generated. 959 such records were removed from this repo in the\n' +
      'July 2026 audit - see markets/salesforce/README.md. Verify the export before importing.\n' +
      'To import anyway after manual verification, re-run with --allow-unverified.',
    )
  }
  process.stderr.write(`WARNING - provenance check flagged this source:\n${report}\n\n`)
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(people, null, 2)}\n`)

process.stdout.write(`${JSON.stringify({
  source: sourcePath,
  output: outputPath,
  people: people.length,
  first: people[0]?.fullName,
  last: people.at(-1)?.fullName,
}, null, 2)}\n`)
