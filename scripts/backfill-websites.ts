// Backfill the official-website field from sources the record already carries.
//
//   npm run atlas:backfill-websites            dry run, prints the plan
//   npm run atlas:backfill-websites -- --commit write the data files
//
// Why this exists: 239 organisations carry a curated record whose own evidence
// cites a corporate URL, yet the `website` field is empty. That is a
// normalisation gap, not missing research, and `website` is the field the
// verification gate depends on.
//
// What it will NOT do, because a plausible-looking wrong value is worse than an
// empty one:
//
//   * It never uses an aggregator, directory or job board as a company website.
//   * It never takes a domain shared by several companies. A host cited by three
//     or more organisations is an external body (a master-builders association, a
//     franchisor, a directory) and is never adopted as any one company's site.
//     This is the rule that stops 89 MBAWC members inheriting mbawc.org.za.
//   * It only reads sources the record already cites, so the value is exactly as
//     evidenced as the source it came from.
//
// Every write is a derived value with its originating URL kept as a
// `system-inferred` evidence record, plus a note stating where it came from, so
// a reviewer can see the derivation rather than find an unexplained value.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { EvidenceRecord, Organization } from '../src/data/organizations/types'

const DIR = resolve('markets/organizations')
const ORGANIZATIONS_FILE = resolve(DIR, 'organizations.json')

/** A host cited by at least this many organisations is an external body. */
const SHARED_DOMAIN_THRESHOLD = 3

/** Source types that are allowed to establish a company's own domain. */
const CORPORATE_SOURCE_TYPES = new Set(['company-website', 'corporate-disclosure'])

/** Aggregators and directories: never a company's own website. */
const NON_CORPORATE_HOSTS = new Set([
  'linkedin.com', 'zoominfo.com', 'rocketreach.co', 'datanyze.com', 'crunchbase.com',
  'bizcommunity.com', 'snupit.co.za', 'facebook.com', 'twitter.com', 'x.com',
  'instagram.com', 'youtube.com', 'wikipedia.org', 'wikimedia.org', 'emis.com',
  'pitchbook.com', 'owler.com', 'globaldata.com', 'bloomberg.com', 'reuters.com',
  'jse.co.za', 'cipc.co.za', 'dnb.com', 'glassdoor.com', 'indeed.com', 'pnet.co.za',
  'careerjunction.co.za', 'careers24.com', 'sagoodnews.co.za', 'yellowpages.co.za',
  'brabys.com', 'africanadvice.com', 'moneyweb.co.za', 'businesslive.co.za',
  'news24.com', 'iol.co.za', 'sowetanlive.co.za', 'timeslive.co.za',
  'engineeringnews.co.za', 'creamermedia.co.za', 'github.com', 'google.com',
  'sars.gov.za', 'statssa.gov.za', 'gov.za', 'the dti.gov.za', 'amazonaws.com',
])

/**
 * Aggregator host patterns. A finite list always leaks (the first dry run let
 * `yellowpages.net.za` through), so directory-shaped hosts are matched by name
 * as well as from the explicit list above.
 */
const NON_CORPORATE_HOST_PATTERNS: RegExp[] = [
  /yellowpages/,
  /whitepages/,
  /-?directory\./,
  /\bdirectory\b/,
  /brabys/,
  /hotfrog/,
  /cylex/,
  /tuugo/,
  /kompass/,
  /findglocal/,
  /yelp/,
  /tripadvisor/,
  /africanadvice/,
  /sagoodnews/,
  /^za\./,
  /^admin\./,
]

interface Candidate {
  url: string
  host: string
  index: number
}

function parseUrl(raw: string): URL | null {
  try {
    return new URL(raw.includes('://') ? raw : `https://${raw}`)
  } catch {
    return null
  }
}

/** Registrable-ish host: strip a leading www. so both spellings share a key. */
function hostOf(url: URL): string {
  return url.hostname.toLowerCase().replace(/^www\./, '')
}

function isNonCorporate(host: string): boolean {
  for (const blocked of NON_CORPORATE_HOSTS) {
    if (host === blocked || host.endsWith(`.${blocked}`)) return true
  }
  return NON_CORPORATE_HOST_PATTERNS.some((pattern) => pattern.test(host))
}

/** Every corporate URL a record already cites, in citation order. */
function corporateUrls(organization: Organization): string[] {
  const urls: string[] = []
  for (const source of organization.sources) {
    if (!source.url) continue
    if (!CORPORATE_SOURCE_TYPES.has(source.type)) continue
    urls.push(source.url)
  }
  if (organization.taxonomy?.sourceUrl) urls.push(organization.taxonomy.sourceUrl)
  for (const link of organization.industries) if (link.sourceUrl) urls.push(link.sourceUrl)
  return urls
}

/** Count how many organisations cite each host, to spot external bodies. */
function hostOrganisationCounts(organizations: Organization[]): Map<string, number> {
  const byHost = new Map<string, Set<string>>()
  for (const organization of organizations) {
    for (const raw of corporateUrls(organization)) {
      const parsed = parseUrl(raw)
      if (!parsed) continue
      const host = hostOf(parsed)
      const owners = byHost.get(host) ?? new Set<string>()
      owners.add(organization.id)
      byHost.set(host, owners)
    }
  }
  return new Map([...byHost.entries()].map(([host, owners]) => [host, owners.size]))
}

/** The most-cited eligible corporate URL for one organisation, if any. */
function pickWebsite(organization: Organization): Candidate | null {
  const counts = new Map<string, Candidate>()
  corporateUrls(organization).forEach((raw, index) => {
    const parsed = parseUrl(raw)
    if (!parsed) return
    const host = hostOf(parsed)
    if (isNonCorporate(host)) return
    const existing = counts.get(host)
    if (existing) return
    counts.set(host, { url: raw, host, index })
  })
  const candidates = [...counts.values()].sort((left, right) => left.index - right.index)
  return candidates[0] ?? null
}

/**
 * Canonicalise a cited corporate URL into the value the `website` field holds.
 *
 * The scheme and `www.` prefix are preserved exactly as the cited source wrote
 * them rather than rewritten: without network access this tool cannot prove that
 * a rewritten root resolves, and an unresolvable website value would be worse
 * than the cited URL it replaced. Only the trailing slash is normalised.
 */
function siteRoot(candidate: Candidate): string {
  const parsed = parseUrl(candidate.url)
  if (!parsed) return ''
  return `${parsed.protocol}//${parsed.host}/`
}

function main(): void {
  const args = process.argv.slice(2)
  const commit = args.includes('--commit')

  const organizations = JSON.parse(readFileSync(ORGANIZATIONS_FILE, 'utf8')) as Organization[]
  const hostCounts = hostOrganisationCounts(organizations)

  const planned: { organization: Organization; website: string; evidenceUrl: string; skipped?: string }[] = []
  for (const organization of organizations) {
    if (organization.website.trim() !== '') continue
    const candidate = pickWebsite(organization)
    if (!candidate) continue
    const shared = hostCounts.get(candidate.host) ?? 0
    if (shared >= SHARED_DOMAIN_THRESHOLD) {
      planned.push({
        organization,
        website: '',
        evidenceUrl: candidate.url,
        skipped: `${candidate.host} is cited by ${shared} organisations; treated as an external body, not this company's site`,
      })
      continue
    }
    const website = siteRoot(candidate)
    if (website === '') continue
    planned.push({ organization, website, evidenceUrl: candidate.url })
  }

  const applied = planned.filter((entry) => !entry.skipped)
  const skipped = planned.filter((entry) => entry.skipped)

  const summary = {
    mode: commit ? 'commit' : 'dry-run',
    considered: organizations.filter((organization) => organization.website.trim() === '').length,
    withEligibleSource: planned.length,
    wouldSet: applied.length,
    skippedSharedDomain: skipped.length,
    alreadySet: organizations.filter((organization) => organization.website.trim() !== '').length,
  }

  if (!commit) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n\n`)
    process.stdout.write('sample (first 15):\n')
    for (const entry of applied.slice(0, 15)) {
      process.stdout.write(`  ${entry.organization.name} -> ${entry.website}  (cited: ${entry.evidenceUrl})\n`)
    }
    process.stdout.write('\nskipped shared domains (first 10):\n')
    for (const entry of skipped.slice(0, 10)) {
      process.stdout.write(`  ${entry.organization.name}: ${entry.skipped}\n`)
    }
    process.stdout.write('\nNo file was written. Re-run with --commit to apply.\n')
    return
  }

  const checkedOn = new Date().toISOString().slice(0, 10)
  const note = (url: string): string =>
    `Website set on ${checkedOn} to the corporate URL this record already cites (${url}); no field value was rewritten.`
  const byId = new Map(applied.map((entry) => [entry.organization.id, entry]))
  const next = organizations.map((organization) => {
    const entry = byId.get(organization.id)
    if (!entry) return organization
    const evidence: EvidenceRecord = {
      url: entry.evidenceUrl,
      type: 'system-inferred',
      evidence: `Cited as corporate evidence for this company and adopted as its official website, because the record already relies on it.`,
      checkedOn,
      confidence: 'probable',
    }
    const alreadyRecorded = organization.sources.some((source) => source.url === entry.evidenceUrl)
    const addition = note(entry.evidenceUrl)
    return {
      ...organization,
      website: entry.website,
      sources: alreadyRecorded ? organization.sources : [...organization.sources, evidence],
      notes: organization.notes.includes(addition)
        ? organization.notes
        : [organization.notes, addition].filter(Boolean).join('\n'),
    }
  })

  writeFileSync(ORGANIZATIONS_FILE, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  process.stdout.write(`${JSON.stringify({ ...summary, wrote: 'markets/organizations/organizations.json' }, null, 2)}\n`)
}

main()
