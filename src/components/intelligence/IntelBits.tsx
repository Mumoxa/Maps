// Small presentational pieces shared by the company-intelligence pages.

import { Link } from 'react-router-dom'
import { evidenceAge, type IntelligenceGraph } from '../../data/intelligence/graph'
import { TIER_LABELS, TIER_SHORT, type Tier } from '../../data/intelligence/targeting'
import type { Confidence, Origin } from '../../data/intelligence/types'

export function TierBadge({ tier, overridden = false }: { tier: Tier; overridden?: boolean }) {
  return (
    <span className={`intel-tier intel-tier-${tier}`} title={TIER_LABELS[tier]}>
      {TIER_SHORT[tier]}
      {overridden && <span className="intel-tier-flag"> (override)</span>}
    </span>
  )
}

const CONFIDENCE_TEXT: Record<Confidence, string> = {
  confirmed: 'Confirmed',
  probable: 'Probable',
  hypothesis: 'Hypothesis',
  unknown: 'Unknown',
}

export function ConfidenceTag({ value }: { value: Confidence }) {
  return <span className={`intel-conf intel-conf-${value}`}>{CONFIDENCE_TEXT[value]}</span>
}

const ORIGIN_TEXT: Record<Origin, string> = {
  'source-reported': 'Source reported',
  'recruiter-supplied': 'Recruiter supplied',
  'system-inferred': 'System inferred',
  'recruiter-reviewed': 'Recruiter reviewed',
}

export function OriginTag({ value }: { value: Origin }) {
  return <span className="intel-origin">{ORIGIN_TEXT[value]}</span>
}

export function EvidenceLinks({ graph, ids }: { graph: IntelligenceGraph; ids: string[] }) {
  if (!ids.length) return <span className="intel-muted">No evidence recorded</span>
  return (
    <ul className="intel-evidence">
      {ids.map((id) => {
        const evidence = graph.evidenceById.get(id)
        if (!evidence) return <li key={id}>Missing evidence record {id}</li>
        const age = evidenceAge(evidence, graph.asOf)
        return (
          <li key={id}>
            {evidence.url ? (
              <a href={evidence.url} target="_blank" rel="noopener noreferrer">
                {evidence.sourceName}
              </a>
            ) : (
              <span>{evidence.sourceName}</span>
            )}
            <span className="intel-muted"> · {evidence.publishedOn ?? 'undated'}</span>
            {age === 'stale' && <span className="intel-stale"> · stale</span>}
            <span className="intel-evidence-supports">{evidence.supports}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function OrgLink({ graph, id }: { graph: IntelligenceGraph; id: string }) {
  const org = graph.organizationById.get(id)
  return <Link to={`/organizations/${id}`}>{org?.name ?? id}</Link>
}

/** Downloads a text file in the browser. Used for exports only: it never stands in for saving. */
export function downloadText(fileName: string, body: string, type: string) {
  const blob = new Blob([body], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export function PrivateNotice({ description }: { description: string }) {
  return (
    <p className="intel-private-note" role="note">
      Private workspace. {description}
    </p>
  )
}
