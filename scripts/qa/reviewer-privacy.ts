// QA reviewer 4: privacy and security.
//
// Checks the promise that no confidential data reached a public artefact: the
// shipped datasets, the built bundle and the source. It scans for personal
// identifiers, confirms the private routes keep their noindex contract, and
// confirms nothing new opens a network endpoint or weakens a control.

import { readText, Reviewer } from './lib'
import { readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
/**
 * A bare ten-digit run also occurs in CIPC, VAT and tax reference numbers, so an
 * unspaced sequence only counts as a phone number when separators or a +27
 * prefix mark it as one, or when a contact-ish key names it.
 */
const SA_PHONE = /(?:\+27[\s-]?|0)(?:\d[\s-]?){9}\d|(?:"[a-z]*(?:phone|tel|mobile|cell|whatsapp|fax)[a-z]*"\s*:\s*")(?:\+27|0)\d[\d\s-]{8,}"/i
const SA_ID = /\b\d{6}\s?\/\s?\d{3}\s?\/\s?\d{3}\b|\b[6-9]\d{12}\b/

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
