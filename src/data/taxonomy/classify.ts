// Scale-band classification.
//
// The National Small Enterprise Act measures size with two proxies - full-time
// equivalent employees and annual turnover - and they routinely disagree. A
// cleaning company with 300 employees and R9m turnover is large by headcount and
// micro by turnover. Rather than hide that, the classifier returns both
// readings, resolves the record to the higher of the two, and flags the
// disagreement so a reviewer can see it instead of trusting a silent rule.
//
// `unclassified` is returned when neither proxy is known. Defaulting unknown
// data to `micro` would quietly inflate the SMME population.

import type { ScaleBand, ScaleBandAssignment, ScaleBandId } from './types'

export interface ScaleInput {
  employeesFte: number | null
  fteReported: boolean
  annualTurnoverZar: number | null
}

function bandForEmployees(employees: number, bands: ScaleBand[]): ScaleBandId {
  for (const band of bands) {
    if (employees >= band.employeesMin && (band.employeesMax === null || employees <= band.employeesMax)) {
      return band.id
    }
  }
  return 'unclassified'
}

function bandForTurnover(turnover: number, bands: ScaleBand[]): ScaleBandId {
  for (const band of bands) {
    if (turnover >= band.turnoverMin && (band.turnoverMax === null || turnover <= band.turnoverMax)) {
      return band.id
    }
  }
  return 'unclassified'
}

export function assignScaleBand(
  input: ScaleInput,
  bands: ScaleBand[],
  scheduleId: string,
  derivedOn: string,
): ScaleBandAssignment {
  const ordered = [...bands].sort((a, b) => a.rank - b.rank)

  const hasEmployees = input.fteReported && input.employeesFte !== null
  const bandByEmployees: ScaleBandId = hasEmployees
    ? bandForEmployees(input.employeesFte as number, ordered)
    : 'unclassified'

  const bandByTurnover: ScaleBandId =
    input.annualTurnoverZar === null ? 'unclassified' : bandForTurnover(input.annualTurnoverZar, ordered)

  const rankOf = (id: ScaleBandId): number => ordered.find((band) => band.id === id)?.rank ?? 0

  let band: ScaleBandId = 'unclassified'
  if (bandByEmployees !== 'unclassified' && bandByTurnover !== 'unclassified') {
    band = rankOf(bandByEmployees) >= rankOf(bandByTurnover) ? bandByEmployees : bandByTurnover
  } else if (bandByEmployees !== 'unclassified') {
    band = bandByEmployees
  } else if (bandByTurnover !== 'unclassified') {
    band = bandByTurnover
  }

  const resolved = ordered.find((candidate) => candidate.id === band) ?? null

  return {
    band,
    bandLabel: resolved?.label ?? 'Unclassified - no size proxy reported',
    bandByEmployees,
    bandByTurnover,
    bandConflict:
      bandByEmployees !== 'unclassified' && bandByTurnover !== 'unclassified' && bandByEmployees !== bandByTurnover,
    statutoryClass: resolved?.statutoryClass ?? null,
    scheduleId,
    derivedOn,
  }
}
