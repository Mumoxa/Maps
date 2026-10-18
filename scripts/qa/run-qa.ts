// Independent QA gate.
//
//   npm run qa
//
// Runs five reviewers that were written against the brief rather than against
// the implementation: data integrity (raw JSON), explainability (source text +
// a live discovery run), interface and access (rendered page), privacy and
// security (datasets, source tree), and the directive's acceptance conditions.
//
// Each reviewer prints its own verdict. The command exits non-zero if any
// reviewer fails, so it can be used as a gate in CI alongside the unit tests.

import { review as dataIntegrity } from './reviewer-data'
import { review as explainability } from './reviewer-explainability'
import { review as interfaceAccess } from './reviewer-ui'
import { review as privacySecurity } from './reviewer-privacy'
import { review as acceptance } from './reviewer-acceptance'
import type { Reviewer } from './lib'

const REVIEWERS: (() => Promise<Reviewer>)[] = [
  dataIntegrity,
  explainability,
  interfaceAccess,
  privacySecurity,
  acceptance,
]

async function main() {
  const started = Date.now()
  const results: Reviewer[] = []
  const failures: { reviewer: string; error: string }[] = []

  for (const run of REVIEWERS) {
    try {
      results.push(await run())
    } catch (error) {
      failures.push({
        reviewer: run.name,
        error: error instanceof Error ? `${error.message}\n${error.stack ?? ''}` : String(error),
      })
    }
  }

  const width = 96
  process.stdout.write(`\n${'='.repeat(width)}\nINDEPENDENT QA REPORT\n${'='.repeat(width)}\n`)

  for (const reviewer of results) {
    const fails = reviewer.findings.filter((finding) => finding.severity === 'fail')
    const notes = reviewer.findings.filter((finding) => finding.check.startsWith('note:'))
    const checks = reviewer.evaluated
    const verdict = fails.length === 0 ? 'PASS' : `FAIL (${fails.length})`
    process.stdout.write(`\n${reviewer.name.toUpperCase()} — ${verdict}\n`)
    process.stdout.write(`  scope: ${reviewer.scope}\n`)
    process.stdout.write(`  assertions evaluated: ${checks}\n`)
    for (const note of notes) {
      process.stdout.write(`  · ${note.check.slice(5)}: ${note.detail}\n`)
    }
    for (const fail of fails) {
      process.stdout.write(`  ✗ ${fail.check}: ${fail.detail}\n`)
    }
  }

  for (const failure of failures) {
    process.stdout.write(`\n${failure.reviewer.toUpperCase()} — ERROR\n  ${failure.error}\n`)
  }

  const totalFails = results.reduce((total, reviewer) => total
    + reviewer.findings.filter((finding) => finding.severity === 'fail').length, 0)
  const totalChecks = results.reduce((total, reviewer) => total + reviewer.evaluated, 0)

  process.stdout.write(`\n${'='.repeat(width)}\n`)
  process.stdout.write(`${results.length} reviewers · ${totalChecks} assertions · ${totalFails} failures`)
  if (failures.length > 0) process.stdout.write(` · ${failures.length} reviewer(s) crashed`)
  process.stdout.write(` · ${((Date.now() - started) / 1000).toFixed(1)}s\n`)
  process.stdout.write(totalFails === 0 && failures.length === 0
    ? 'VERDICT: PASS — the build satisfies the conditions these reviewers were written against.\n\n'
    : 'VERDICT: FAIL — the failures above are the conditions the build does not yet satisfy.\n\n')

  if (totalFails > 0 || failures.length > 0) process.exitCode = 1
}

main()
