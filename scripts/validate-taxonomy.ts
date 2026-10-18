// Validator for the national South African corporate taxonomy.
//
//   npm run validate:taxonomy
//
// Checks the reference tree for internal consistency, confirms the crosswalk
// still covers every industry and pocket in the organization model, validates
// every example company profile against both the JSON Schema and the semantic
// rules, then prints coverage so gaps are visible instead of silent.
//
// Fails the build on errors; prints warnings and coverage either way.

import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import {
  getChildren,
  getMacroSectors,
  industryCrosswalk,
  scaleBands,
  sectorTree,
  statutorySchedules,
  vocabularies,
} from '../src/data/taxonomy/load'
import { runTaxonomyIntegrityChecks, validateCompanyProfile } from '../src/data/taxonomy/validate'
import type { CompanyProfile, TaxonomyIssue, TaxonomyNode } from '../src/data/taxonomy/types'
import industriesRaw from '../markets/organizations/industries.json'
import pocketsRaw from '../markets/organizations/pockets.json'

const TAXONOMY_DIR = resolve('markets/organizations/taxonomy')
const EXAMPLES_DIR = resolve(TAXONOMY_DIR, 'examples')

const TODAY = '2026-10-08'

function report(issues: TaxonomyIssue[]): { errors: TaxonomyIssue[]; warnings: TaxonomyIssue[] } {
  const errors = issues.filter((issue) => issue.severity === 'error')
  const warnings = issues.filter((issue) => issue.severity === 'warning')
  for (const issue of errors) console.error(`  ERROR  [${issue.code}] ${issue.subject}: ${issue.detail}`)
  for (const issue of warnings) console.warn(`  WARN   [${issue.code}] ${issue.subject}: ${issue.detail}`)
  return { errors, warnings }
}

function main() {
  const industries = industriesRaw as { id: string }[]
  const pockets = pocketsRaw as { id: string }[]
  const schedules = statutorySchedules.schedules

  console.log('Taxonomy integrity')
  const integrity = report(
    runTaxonomyIntegrityChecks({ nodes: sectorTree, crosswalk: industryCrosswalk, industries, pockets, schedules }),
  )

  console.log('\nExample company profiles')
  const schemaPath = resolve(TAXONOMY_DIR, 'sa-company-profile.schema.json')
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8')) as Record<string, unknown>
  const ajv = new Ajv2020({ allErrors: true, strict: false })
  addFormats(ajv)
  const validate = ajv.compile(schema)

  const exampleFiles = readdirSync(EXAMPLES_DIR).filter((name) => name.endsWith('.json')).sort()
  let profileErrors = 0
  let profileWarnings = 0

  for (const file of exampleFiles) {
    const parsed: unknown = JSON.parse(readFileSync(resolve(EXAMPLES_DIR, file), 'utf8'))
    const profile = parsed as CompanyProfile

    // Validated against `parsed`, not `profile`: Ajv's compiled validator is a type
    // guard, so narrowing the typed variable would reduce it to `never` here.
    const schemaValid = validate(parsed)
    if (!schemaValid) {
      for (const error of validate.errors ?? []) {
        console.error(`  ERROR  [json-schema] ${file}: ${error.instancePath || '(root)'} ${error.message}`)
        profileErrors += 1
      }
    }

    const semantic = report(validateCompanyProfile({ profile, today: TODAY, schedules }))
    profileErrors += semantic.errors.length
    profileWarnings += semantic.warnings.length

    console.log(
      `  ${profile.id} -> ${profile.scaleBand.band} (${profile.scaleBand.bandLabel}), B-BBEE Level ${profile.bbbee.level} ${profile.bbbee.category.toUpperCase()}, node ${profile.taxonomy.primaryNode}, ${profile.geography.province}${
        profile.geography.metropolitanMunicipality ? ` / ${profile.geography.metropolitanMunicipality}` : ` / ${profile.geography.districtMunicipality}`
      }`,
    )
  }

  console.log('\nCoverage')
  const byLevel = new Map<number, number>()
  for (const node of sectorTree) byLevel.set(node.level, (byLevel.get(node.level) ?? 0) + 1)
  for (const level of [1, 2, 3, 4]) {
    console.log(`  level ${level}: ${byLevel.get(level) ?? 0} nodes`)
  }
  console.log(`  scale bands: ${scaleBands.map((band) => band.id).join(', ')}`)
  console.log(`  statutory schedules: ${schedules.map((schedule) => `${schedule.id} (${schedule.verificationStatus})`).join(', ')}`)
  console.log(`  municipalities: ${vocabularies.metropolitanMunicipalities.length} metros, ${vocabularies.districtMunicipalities.length} district municipalities`)
  console.log(`  regional economic hubs: ${vocabularies.regionalEconomicHubs.length}`)
  console.log(`  crosswalk: ${industryCrosswalk.pocketMappings.length}/${pockets.length} pockets, ${industryCrosswalk.industryMappings.length}/${industries.length} industries mapped`)

  console.log('\nMacro-sector branch sizes')
  for (const macro of getMacroSectors()) {
    const l2 = getChildren(macro.id)
    let descendants = 0
    const stack = [...l2]
    while (stack.length > 0) {
      const node = stack.pop() as TaxonomyNode
      descendants += 1
      stack.push(...getChildren(node.id))
    }
    console.log(`  ${macro.id.padEnd(4)} ${macro.name.padEnd(52)} ${String(l2.length).padStart(3)} sectors, ${String(descendants).padStart(4)} nodes below`)
  }

  const unverifiedSchedule = schedules.find((schedule) => schedule.sectorClasses.length === 0)
  if (unverifiedSchedule) {
    console.log(`\n  NOTE ${unverifiedSchedule.id} has no sector turnover table yet (${unverifiedSchedule.verificationStatus}). Populate it from the Government Gazette proclamation before using it for a statutory eligibility decision.`)
  }

  const totalErrors = integrity.errors.length + profileErrors
  const totalWarnings = integrity.warnings.length + profileWarnings
  console.log(`\n${totalErrors} errors, ${totalWarnings} warnings across ${sectorTree.length} taxonomy nodes and ${exampleFiles.length} example profiles`)

  if (totalErrors > 0) process.exit(1)
}

main()
