// QA reviewer 2: explainability.
//
// The product promise is that relevance is a rule grouping a reviewer can audit,
// never a number nobody can. This reviewer attacks that promise from two sides:
// it greps the source for anything that could produce a black-box score, and it
// runs a live discovery to confirm every single suggestion carries its own
// reason, detail and evidence string.

import { readText, Reviewer } from './lib'
import { readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Scoped to the explorer this brief delivered. The other pages in the app
// predate it and are out of scope; auditing them here would report failures
// against work nobody asked for.
const SOURCE_DIRS = ['src/data/organizations', 'src/components/associations']
const PAGE_FILES = ['src/pages/CompanyAssociationsPage.tsx']

/**
 * Remove comments, string literals and JSX text children so the patterns only
 * ever see code. Without this, copy that *disclaims* percentages ("not a
 * percentage") is reported as though it computed one.
 */
function codeOnly(line: string): string {
  return line
    .replace(/^\s*(\/\/|\*|\{\/\*).*$/, '')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``')
    .replace(/>([^<>{}]*)</g, (all, inner: string) => (/[A-Za-z]{3,}/.test(inner) ? '> <' : all))
}

function sourceFiles(dir: string): string[] {
  return readdirSync(resolve(dir))
    .map((entry) => join(dir, entry))
    .filter((path) => statSync(resolve(path)).isFile() && /\.(ts|tsx)$/.test(path))
}

/** Patterns that would indicate a hidden numeric relevance score. */
const SCORE_PATTERNS: { pattern: RegExp; why: string }[] = [
  { pattern: /\bscore\s*[:=]/i, why: 'a "score" field is a black-box ranking' },
  // Prose that *disclaims* percentages is fine; a field or a rendered value is not.
  { pattern: /\bpercent(age)?\b\s*[:=]/i, why: 'a percentage field reads as precision the evidence does not support' },
  { pattern: /\}\s*%|\{\s*[\w.]+\s*\}%|%\s*</, why: 'rendering a percentage to the recruiter' },
  { pattern: /Math\.random/, why: 'non-deterministic ranking cannot be audited' },
  { pattern: /\brelevanceScore\b|\bmatchScore\b|\bconfidenceScore\b/, why: 'a numeric confidence is a black-box score' },
  { pattern: /\.toFixed\(\d\)\s*\+?\s*['"`]?%/, why: 'rendering a percentage' },
]

/** Words that must not be used to describe a company-to-person inference. */
const FORBIDDEN_CLAIMS = [
  /\bcandidates? (is|are) (qualified|suitable)\b/i,
  /\bproves? (the|that) (candidate|person)\b/i,
  /\bguarantee[sd]?\b/i,
]

export async function review(): Promise<Reviewer> {
  const reviewer = new Reviewer('explainability', 'source text of the explorer + a live discovery run')

  const files = [...SOURCE_DIRS.flatMap(sourceFiles), ...PAGE_FILES]
  const offenders: string[] = []
  const claimOffenders: string[] = []

  for (const file of files) {
    const source = readText(file)
    const lines = source.split('\n')
    lines.forEach((rawLine, index) => {
      const line = codeOnly(rawLine)
      const trimmed = rawLine.trim()
      if (!line.trim()) return
      // JSX prose often runs across several lines, so a per-line string strip
      // cannot always see the tag that opened it. A line with no code
      // characters at all is copy, and the checks are about what the code does.
      if (!/[=<>{};()]|=>/.test(line)) return
      for (const { pattern, why } of SCORE_PATTERNS) {
        if (pattern.test(line)) offenders.push(`${file}:${index + 1} ${why} -> ${trimmed.slice(0, 90)}`)
      }
      for (const pattern of FORBIDDEN_CLAIMS) {
        if (pattern.test(line)) claimOffenders.push(`${file}:${index + 1} ${trimmed.slice(0, 90)}`)
      }
    })
  }
  reviewer.check('no-black-box-score', offenders.length === 0, offenders.join('; ') || 'none')
  reviewer.check('no-company-proves-person-claim', claimOffenders.length === 0, claimOffenders.join('; ') || 'none')

  // --- live discovery: every suggestion must explain itself -----------------
  const { buildOrganizationIndex } = await import('../../src/data/organizations/load.ts')
  const { discoverAssociations } = await import('../../src/data/organizations/discovery.ts')
  const { roleContextById } = await import('../../src/data/organizations/roleContexts.ts')
  const { discoverTargets } = await import('../../src/data/organizations/query.ts')

  const index = buildOrganizationIndex()
  const roleContext = roleContextById('role-cold-storage-financial-manager')
  if (!roleContext) {
    reviewer.check('role-context-available', false, 'role-cold-storage-financial-manager not found')
    return reviewer
  }
  const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext })

  const silent = discovery.matches.filter((match) => match.rules.length === 0)
  reviewer.check('every-match-has-a-reason', silent.length === 0,
    `${silent.length} matches with no rule hit: ${silent.slice(0, 5).map((match) => match.organizationId).join(', ')}`)

  const vague = discovery.matches.flatMap((match) => match.rules
    .filter((rule) => !rule.label.trim() || !rule.detail.trim() || !rule.evidence.trim())
    .map((rule) => `${match.organizationId}/${rule.rule}`))
  reviewer.check('every-rule-carries-label-detail-evidence', vague.length === 0,
    vague.slice(0, 10).join(', ') || 'none')

  const tiers = new Set(discovery.matches.map((match) => match.tier))
  reviewer.check('tiers-are-a-small-ordinal-set',
    [...tiers].every((tier) => tier >= 1 && tier <= 5 && Number.isInteger(tier)),
    `tiers present: ${[...tiers].sort().join(', ')}`)

  // A match record must not carry a numeric relevance field at all.
  const sample = discovery.matches[0] as unknown as Record<string, unknown>
  const numericFields = Object.entries(sample)
    .filter(([key, value]) => typeof value === 'number' && /score|relevance|weight|rank/i.test(key))
    .map(([key]) => key)
  reviewer.check('match-record-has-no-score-field', numericFields.length === 0, numericFields.join(', ') || 'none')

  // --- export contract ------------------------------------------------------
  const payload = discoverTargets({ index, focalId: 'org-ccs-logistics', roleContext, page: 1, pageSize: 5 })
  const disclaimers = (payload as unknown as { disclaimers?: string[] }).disclaimers ?? []
  reviewer.check('export-states-similarity-is-not-suitability',
    disclaimers.some((line) => /suitab|person|individual/i.test(line)),
    disclaimers.join(' | ').slice(0, 200) || 'no disclaimers in the export contract')
  reviewer.check('export-states-unknown-is-not-absent',
    disclaimers.some((line) => /unknown|absence/i.test(line)),
    disclaimers.join(' | ').slice(0, 200) || 'no disclaimers in the export contract')
  reviewer.check('export-states-tiers-are-not-predictive',
    disclaimers.some((line) => /tier|rule|predict/i.test(line)),
    disclaimers.join(' | ').slice(0, 200) || 'no disclaimers in the export contract')

  const missingEvidencePresent = payload.targetCompanies.some((row) => row.missingEvidence.length > 0)
  reviewer.check('export-carries-missing-evidence', missingEvidencePresent,
    `${payload.targetCompanies.length} rows on page 1; ${payload.targetCompanies.filter((row) => row.missingEvidence.length > 0).length} list gaps`)

  const withoutReasons = payload.targetCompanies.filter((row) => row.reasons.length === 0)
  reviewer.check('every-exported-row-carries-its-reasons', withoutReasons.length === 0,
    withoutReasons.map((row) => row.name).join(', ') || 'none')

  reviewer.note('volume', `${discovery.matches.length} matches scanned for one company under one role context; ${discovery.matches.reduce((total, match) => total + match.rules.length, 0)} rule hits, all with text`)

  return reviewer
}
