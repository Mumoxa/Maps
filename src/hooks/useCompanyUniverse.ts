import { useMemo } from 'react'
import { buildCompanyIntelligence, type DatasetSources } from '../data/organizations/universe'
import { buildIndustryAtlas } from '../data/organizations/atlas'
import { buildUniverseViews } from '../data/organizations/universeView'
import { useOptionalData } from '../context/DataContext'

/**
 * The one canonical company universe for a page.
 *
 * Built once per page and memoised, so the atlas, the directory and the dossier
 * on a given route always read the same index, the same taxonomy rollup and the
 * same factual views. There is deliberately no notion of a current or default
 * company here: a page that needs a focal company asks for one explicitly.
 *
 * The bundled credit-risk dataset is folded in by default, not only on the
 * directory route. It used to be passed by one page, which meant the atlas and
 * the directory disagreed by the handful of employers that dataset contributes,
 * and a company linked from the directory could have no dossier. One universe
 * for every surface is what makes a count and the list behind it reconcile.
 *
 * `sources` still lets a caller substitute or extend the datasets - an import
 * preview, for example - without forking the composition.
 */
export function useCompanyUniverse(sources?: DatasetSources) {
  const data = useOptionalData()?.data
  const bundledCreditRisk = useMemo(
    () => (data
      ? data.companies.map((company) => ({
        name: company.name,
        segment: company.segment,
        profileCount: company.profile_count,
      }))
      : []),
    [data],
  )
  const effectiveSources = useMemo<DatasetSources>(
    () => ({ creditRiskCompanies: bundledCreditRisk, ...sources }),
    [bundledCreditRisk, sources],
  )
  const sourceKey = useMemo(
    () => (effectiveSources.creditRiskCompanies ?? [])
      .map((company) => `${company.name}:${company.profileCount ?? 0}`)
      .join('|'),
    [effectiveSources],
  )
  const intelligence = useMemo(() => buildCompanyIntelligence(effectiveSources), [sourceKey])
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
