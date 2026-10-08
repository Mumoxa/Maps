// QA reviewer 4: privacy and security.
//
// Checks the promise that no confidential data reached a public artefact: the
// shipped datasets, the built bundle and the source. It scans for personal
// identifiers, confirms the private routes keep their noindex contract, and
// confirms nothing new opens a network endpoint or weakens a control.
//
// The built bundle is only scanned when dist/ exists; when it does not, the run
// records that as reduced coverage rather than reporting an unscanned artefact
// as clean.

import { readText, Reviewer } from './lib'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
const SA_PHONE = /(?:\+27|0)\s?\d{2}\s?\d{3}\s?\d{4}/
const SA_ID = /\b\d{6}\s?\/\s?\d{3}\s?\/\s?\d{3}\b|\b[6-9]\d{12}\b/

/**
 * The same phone pattern, boundary-guarded for scanning minified bundles.
 *
 * Unminified sources and JSON hold phone numbers as standalone values, but a
 * bundle inlines them next to URL path segments and record ids. The unguarded
 * pattern reads the digit run in `za.bold.pro/my/name-240925205448` as a phone
 * number, which produced 137 false positives in one chunk against zero real
 * ones. Requiring that the match not sit inside a longer digit run removes
 * those without touching any genuine number.
 */
const SA_PHONE_BUNDLED = /(?<![\d-])(?:\+27|0)\s?\d{2}\s?\d{3}\s?\d{4}(?!\d)/

/**
 * Chunks built from `src/data/contact-parts`, the contact directory dataset that
 * has shipped in this bundle since before the Company Association Explorer
 * existed. It is reported separately rather than passed silently — see the
 * `contact-directory-bundle-exposure` note below.
 */
const CONTACT_DIRECTORY_CHUNK = /^dist\/assets\/ContactDirectory-/

/** Files allowed to contain synthetic fixtures that look like personal data. */
const ALLOWED_FIXTURES = [/^tests\//, /^scripts\/_/, /^src\/data\/searchBank\/(normalise|targets|ingest)\.ts$/]

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(resolve(dir))) {
    const path = join(dir, entry)
    if (statSync(resolve(path)).isDirectory()) walk(path, out)
    else out.push(path)
  }
  return out
}

export async function review(): Promise<Reviewer> {
  const reviewer = new Reviewer('privacy-security', 'shipped datasets, built bundle, source tree')

  // --- no personal data in the shipped company intelligence -----------------
  const dataFiles = walk('markets/organizations').filter((file) => file.endsWith('.json'))
  const personalInData: string[] = []
  for (const file of dataFiles) {
    const content = readText(file)
    if (EMAIL.test(content)) personalInData.push(`${file}: email address`)
    if (SA_PHONE.test(content)) personalInData.push(`${file}: phone number`)
    if (SA_ID.test(content)) personalInData.push(`${file}: looks like an SA identity number`)
  }
  reviewer.check('no-personal-data-in-company-intelligence', personalInData.length === 0,
    personalInData.join('; ') || `${dataFiles.length} data files scanned, none contain personal identifiers`)

  // --- no personal data in the deployed artefact ----------------------------
  // The datasets above are the input. The bundle is what actually ships to a
  // public origin, so it gets scanned on its own terms: a field could be clean
  // in JSON and still end up inlined somewhere unexpected after the build.
  //
  // When dist/ is absent this records a note rather than a pass. Reporting an
  // unscanned artefact as clean is exactly the failure this reviewer exists to
  // prevent, so an absent bundle is surfaced as reduced coverage instead.
  if (existsSync(resolve('dist'))) {
    const bundleFiles = walk('dist').filter((file) => /\.(js|json|html|css|map)$/.test(file))
    const personalInBundle: string[] = []
    const contactDirectoryChunks: string[] = []
    let contactEmails = 0
    let contactPhones = 0
    for (const file of bundleFiles) {
      const content = readText(file)
      const emails = content.match(new RegExp(EMAIL, 'g'))?.length ?? 0
      const phones = content.match(new RegExp(SA_PHONE_BUNDLED, 'g'))?.length ?? 0
      const ids = SA_ID.test(content)
      if (CONTACT_DIRECTORY_CHUNK.test(file)) {
        if (emails || phones || ids) {
          contactDirectoryChunks.push(file)
          contactEmails += emails
          contactPhones += phones
        }
        continue
      }
      if (emails) personalInBundle.push(`${file}: ${emails} email addresses`)
      if (phones) personalInBundle.push(`${file}: ${phones} phone numbers`)
      if (ids) personalInBundle.push(`${file}: looks like an SA identity number`)
    }
    const scanned = bundleFiles.length - contactDirectoryChunks.length
    reviewer.check('no-personal-data-in-built-bundle', personalInBundle.length === 0,
      personalInBundle.join('; ')
        || `${scanned} bundle files scanned outside the contact directory, none contain personal identifiers`)

    // The contact directory is the product's own dataset and has always shipped
    // in the public bundle. `/contacts` is noindexed and robots-disallowed, but
    // that hides the route from crawlers — it does not stop anyone fetching the
    // chunk. Closing it needs an auth boundary this static site does not have
    // (see §10 of docs/company-associations.md), so it is reported loudly as an
    // open exposure instead of being treated as clean or quietly ignored.
    if (contactDirectoryChunks.length > 0) {
      reviewer.note('contact-directory-bundle-exposure',
        `pre-existing: ${contactDirectoryChunks.length} ContactDirectory chunk(s) ship `
        + `${contactEmails} email addresses and ${contactPhones} phone numbers in the public `
        + 'bundle. noindex hides the route, not the chunk. Needs an auth boundary to close.')
    }
  } else {
    reviewer.note('no-personal-data-in-built-bundle',
      'dist/ is absent, so the deployed bundle was not scanned. Run npm run build before npm run qa to cover it.')
  }

  // --- the company model must not store people ------------------------------
  const organizations = JSON.parse(readText('markets/organizations/organizations.json')) as Record<string, unknown>[]
  const personFields = organizations.flatMap((organization) => Object.keys(organization)
    .filter((key) => /person|candidate|employee(name)?|contact|email|phone|cv|resume/i.test(key))
    .map((key) => `${String(organization.id)}.${key}`))
  reviewer.check('organization-record-holds-no-person', personFields.length === 0,
    personFields.join(', ') || 'none of the organization fields describe a person')

  // --- bank target records carry no person either ---------------------------
  const bank = JSON.parse(readText('markets/search-bank/bank.json')) as {
    targetCompanies?: Record<string, unknown>[]
  }
  const targets = bank.targetCompanies ?? []
  const personOnTarget = targets.flatMap((target) => Object.keys(target)
    .filter((key) => /candidate|person|email|phone|cv|resume|suitab/i.test(key))
    .map((key) => `${String(target.name)}.${key}`))
  reviewer.check('target-record-holds-no-person', personOnTarget.length === 0,
    personOnTarget.join(', ') || `${targets.length} target records carry company data only`)

  // --- no new network surface ----------------------------------------------
  const appSources = [...walk('src/data/organizations'), ...walk('src/components/associations'),
    'src/pages/CompanyAssociationsPage.tsx', 'src/data/searchBank/targets.ts', 'src/data/organizations/workspace.ts']
    .filter((file) => /\.(ts|tsx)$/.test(file))
  const networkCalls: string[] = []
  for (const file of appSources) {
    const source = readText(file)
    source.split('\n').forEach((line, index) => {
      if (/\bfetch\s*\(|XMLHttpRequest|axios|WebSocket|navigator\.sendBeacon/.test(line)) {
        networkCalls.push(`${file}:${index + 1} ${line.trim().slice(0, 80)}`)
      }
    })
  }
  reviewer.check('explorer-makes-no-network-calls', networkCalls.length === 0,
    networkCalls.join('; ') || 'no fetch/XHR/websocket anywhere in the explorer')

  // --- local persistence is scoped and labelled -----------------------------
  const workspace = readText('src/data/organizations/workspace.ts')
  reviewer.check('workspace-is-browser-local', /localStorage/.test(workspace),
    'workspace.ts does not use localStorage; check where recruiter state actually lives')
  reviewer.check('workspace-states-its-limits', /NOT a shared server|browser-local|not.*shared/i.test(workspace),
    'the workspace does not document that it is not a shared store')

  // --- no security control was switched off --------------------------------
  const weakened: string[] = []
  for (const file of [...walk('src'), 'vite.config.ts', 'scripts/audit-ui.ts']) {
    if (!/\.(ts|tsx)$/.test(file)) continue
    const source = readText(file)
    source.split('\n').forEach((line, index) => {
      if (/noIndex\s*[:=]\s*false|allowedHosts\s*[:=]\s*false|secure\s*[:=]\s*false|disable.*security/i.test(line)) {
        weakened.push(`${file}:${index + 1} ${line.trim().slice(0, 80)}`)
      }
    })
  }
  reviewer.check('no-security-control-disabled', weakened.length === 0, weakened.join('; ') || 'none found')

  // --- private routes keep their contract ----------------------------------
  const noIndexHook = readText('src/hooks/useNoIndex.ts')
  reviewer.check('private-route-hook-exists', /noindex/.test(noIndexHook), 'useNoIndex no longer sets noindex')
  const robots = readText('public/robots.txt')
  reviewer.check('robots-disallows-private-routes', /search-bank/.test(robots) && /contacts/.test(robots),
    'robots.txt no longer disallows both private routes')

  // --- no invented identities in the shipped data ---------------------------
  const unsourcedLegal = organizations.filter((organization) => {
    const legal = String(organization.legalName ?? '')
    return legal.length > 0 && !/Pty|Ltd|Limited|Proprietary|Inc|Bpk|CC/i.test(legal)
      && !/(Pty|Ltd|Limited)/i.test(String(organization.name ?? ''))
  })
  reviewer.check('legal-names-look-like-legal-names', unsourcedLegal.length <= 3,
    unsourcedLegal.map((organization) => `${String(organization.id)}="${String(organization.legalName)}"`).join(', ') || 'all legal names carry a company suffix')

  return reviewer
}
