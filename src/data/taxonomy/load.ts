// Loader and indexes for the national corporate taxonomy.
//
// Every lookup here is O(1) on purpose: the tree is walked from L4 to L1 per
// company, and doing that with `.find()` inside a render or import loop is how
// a 700-node reference tree turns into a performance bug.

import sectorTreeRaw from '../../../markets/organizations/taxonomy/sector-tree.json'
import scaleBandsRaw from '../../../markets/organizations/taxonomy/scale-bands.json'
import statutoryRaw from '../../../markets/organizations/taxonomy/statutory-schedule-1.json'
import vocabulariesRaw from '../../../markets/organizations/taxonomy/controlled-vocabularies.json'
import crosswalkRaw from '../../../markets/organizations/taxonomy/industry-crosswalk.json'
import type {
  ControlledVocabulariesFile,
  CrosswalkFile,
  ScaleBand,
  ScaleBandId,
  ScaleBandsFile,
  StatutoryScheduleFile,
  TaxonomyNode,
} from './types'

export const sectorTree = sectorTreeRaw as TaxonomyNode[]
export const scaleBandsFile = scaleBandsRaw as ScaleBandsFile
export const statutorySchedules = statutoryRaw as StatutoryScheduleFile
export const vocabularies = vocabulariesRaw as ControlledVocabulariesFile
export const industryCrosswalk = crosswalkRaw as CrosswalkFile

export const scaleBands: ScaleBand[] = scaleBandsFile.bands

/** Bands by rank, ascending, for the higher-of-both-proxies comparison. */
const bandsByRank: ScaleBand[] = [...scaleBands].sort((a, b) => a.rank - b.rank)
const bandById: Map<string, ScaleBand> = new Map(scaleBands.map((band) => [band.id, band]))
const nodeById: Map<string, TaxonomyNode> = new Map(sectorTree.map((node) => [node.id, node]))
const childrenByParent: Map<string | null, TaxonomyNode[]> = new Map()
for (const node of sectorTree) {
  const siblings = childrenByParent.get(node.parentId) ?? []
  siblings.push(node)
  childrenByParent.set(node.parentId, siblings)
}

export function getScaleBand(id: ScaleBandId | string): ScaleBand | null {
  return bandById.get(id) ?? null
}

export function getRankedBands(): ScaleBand[] {
  return bandsByRank
}

export function getTaxonomyNode(id: string): TaxonomyNode | null {
  return nodeById.get(id) ?? null
}

export function getTaxonomyNodeIds(): string[] {
  return [...nodeById.keys()]
}

export function getMacroSectors(): TaxonomyNode[] {
  return childrenByParent.get(null) ?? []
}

export function getChildren(parentId: string | null): TaxonomyNode[] {
  return childrenByParent.get(parentId) ?? []
}

/** L1 -> L2 -> L3 -> L4 chain for a node, from the macro-sector downwards. */
export function resolveSectorPath(nodeId: string): TaxonomyNode[] {
  const path: TaxonomyNode[] = []
  let current: TaxonomyNode | undefined = nodeById.get(nodeId)
  while (current) {
    path.unshift(current)
    current = current.parentId ? nodeById.get(current.parentId) : undefined
  }
  return path
}

/** The Schedule 1 sector class a node resolves to, via its macro-sector. */
export function resolveStatutorySector(nodeId: string): string | null {
  const path = resolveSectorPath(nodeId)
  return path.length > 0 ? path[0].statutorySector ?? null : null
}

/** Vocabulary membership as O(1) sets, built once. */
const vocabularySets: Record<string, Set<string>> = {
  entityType: new Set(vocabularies.entityTypes.map((option) => option.id)),
  cipcStatus: new Set(vocabularies.cipcStatuses.map((option) => option.id)),
  taxComplianceStatus: new Set(vocabularies.taxComplianceStatuses.map((option) => option.id)),
  coidaStatus: new Set(vocabularies.coidaStatuses.map((option) => option.id)),
  bbbeeCategory: new Set(vocabularies.bbbee.categories.map((option) => option.id)),
  bbbeeLevel: new Set(vocabularies.bbbee.levels),
  bbbeeScorecardType: new Set(vocabularies.bbbee.scorecardTypes),
  bbbeeSectorCode: new Set(vocabularies.bbbee.sectorCodes.map((option) => option.id)),
  bbbeeEvidenceType: new Set(vocabularies.bbbee.evidenceTypes),
  province: new Set(vocabularies.provinces.map((option) => option.id)),
  metropolitanMunicipality: new Set(vocabularies.metropolitanMunicipalities.map((option) => option.id)),
  districtMunicipality: new Set(vocabularies.districtMunicipalities.map((option) => option.id)),
  regionalEconomicHub: new Set(vocabularies.regionalEconomicHubs.map((option) => option.id)),
  scaleBasis: new Set(vocabularies.scaleBasis),
  jseListingStatus: new Set(vocabularies.jseListingStatuses.map((option) => option.id)),
  regulator: new Set(vocabularies.registrationRegulators.map((option) => option.id)),
}

export function isKnown(vocabulary: keyof typeof vocabularySets, value: string): boolean {
  return vocabularySets[vocabulary].has(value)
}

export function getBeeSectorCode(id: string) {
  return vocabularies.bbbee.sectorCodes.find((option) => option.id === id) ?? null
}

/**
 * The municipality a company sits in, resolved from whichever of the two levels
 * is populated. Returns null when neither is, which the validator reports
 * rather than guessing.
 */
export function resolveMunicipality(province: string, metro: string, district: string) {
  if (metro) {
    const found = vocabularies.metropolitanMunicipalities.find((option) => option.id === metro)
    return found && found.province === province ? { ...found, level: 'metro' as const } : null
  }
  if (district) {
    const found = vocabularies.districtMunicipalities.find((option) => option.id === district)
    return found && found.province === province ? { ...found, level: 'district' as const } : null
  }
  return null
}
