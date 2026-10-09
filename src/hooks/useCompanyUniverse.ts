import { useMemo } from 'react'
import { buildCompanyIntelligence, type DatasetSources } from '../data/organizations/universe'
import { buildIndustryAtlas } from '../data/organizations/atlas'
import { buildUniverseViews } from '../data/organizations/universeView'

/**
 * The one canonical company universe for a page.
 *
 * Built once per page and memoised, so the atlas, the directory and the dossier
 * on a given route always read the same index, the same taxonomy rollup and the
 * same factual views. There is deliberately no notion of a current or default
 * company here: a page that needs a focal company asks for one explicitly.
 *
 * `sources` lets a caller fold in dataset employers the default composition does
 * not include - the credit-risk dataset, for example - so they become ordinary,
 * discoverable members of the same universe instead of a separate directory.
 */
export function useCompanyUniverse(sources?: DatasetSources) {
  const sourceKey = useMemo(
    () => (sources?.creditRiskCompanies ?? [])
      .map((company) => `${company.name}:${company.profileCount ?? 0}`)
      .join('|'),
    [sources],
  )
  const intelligence = useMemo(() => buildCompanyIntelligence(sources ?? {}), [sourceKey])
  const atlas = useMemo(
    () => buildIndustryAtlas(intelligence.index, intelligence.all),
    [intelligence],
  )
  const views = useMemo(
    () => buildUniverseViews(intelligence.index, intelligence.all),
    [intelligence],
  )
  return { ...intelligence, atlas, views }
}
