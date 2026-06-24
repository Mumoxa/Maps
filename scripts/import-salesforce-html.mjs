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

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(people, null, 2)}\n`)

process.stdout.write(`${JSON.stringify({
  source: sourcePath,
  output: outputPath,
  people: people.length,
  first: people[0]?.fullName,
  last: people.at(-1)?.fullName,
}, null, 2)}\n`)
