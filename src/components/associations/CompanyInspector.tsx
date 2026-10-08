import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { ASSOCIATION_LABELS, type DiscoveryRow } from '../../data/intelligence/discovery'
import { parentChain, type IntelligenceGraph } from '../../data/intelligence/graph'
import { TIER_LABELS, TIER_ORDER, type Tier } from '../../data/intelligence/targeting'
import { ConfidenceTag, EvidenceLinks, OriginTag, TierBadge } from '../intelligence/IntelBits'

interface CompanyInspectorProps {
  graph: IntelligenceGraph
  organizationId: string
  row: DiscoveryRow | null
  focalId: string | null
  roleActive: boolean
  compared: boolean
  onClose: () => void
  onRecentre: (id: string) => void
  onToggleCompare: (id: string) => void
  onOverride: (id: string, tier: Tier, reason: string) => string | null
  onClearOverride: (id: string) => void
  onAssociate: (id: string, reason: string) => string | null
}

/** Separates sourced facts, system inferences and recruiter suggestions for one company. */
export function CompanyInspector(props: CompanyInspectorProps) {
  const { graph, organizationId, row } = props
  const baseId = useId()
  const [overrideTier, setOverrideTier] = useState<Tier>('tier-2')
  const [overrideReason, setOverrideReason] = useState('')
  const [assocReason, setAssocReason] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const org = graph.organizationById.get(organizationId)
  if (!org) return null

  const industries = graph.industriesByOrg.get(organizationId) ?? []
  const caps = [...(graph.capabilitiesByOrg.get(organizationId)?.values() ?? [])]
  const observed = caps.filter((cap) => cap.status === 'observed')
  const notObserved = caps.filter((cap) => cap.status === 'not-observed')
  const unknownSourced = caps.filter((cap) => cap.status === 'unknown' && !cap.inferredFromIndustry)
  const hypotheses = caps.filter((cap) => cap.inferredFromIndustry)
  const relationships = graph.relationshipsByOrg.get(organizationId) ?? []
  const parents = parentChain(graph, organizationId)
  const metrics = graph.metricsByOrg.get(organizationId) ?? []
  const locations = graph.locationsByOrg.get(organizationId) ?? []
  const questions = graph.questionsByOrg.get(organizationId) ?? []
  const coverage = graph.coverageByOrg.get(organizationId) ?? []
  const capName = (id: string) => graph.taxonomy.capabilityById.get(id)?.name ?? id
  const indName = (id: string) => graph.taxonomy.industryById.get(id)?.name ?? id
  const facts = row?.dimensions.filter((dim) => dim.basis === 'fact') ?? []
  const suggestions = row?.dimensions.filter((dim) => dim.basis === 'suggestion') ?? []
  const assessment = row?.assessment

  return (
    <aside className="ca-inspector" aria-labelledby={`${baseId}-title`}>
      <header className="ca-inspector-head">
        <div>
          <h2 id={`${baseId}-title`} className="ca-panel-title">
            {org.name}
          </h2>
          <p className="intel-muted">
            Identity {org.identityStatus}
            {org.website && (
              <>
                {' · '}
                <a href={org.website} target="_blank" rel="noopener noreferrer">
                  {org.domain ?? org.website}
                </a>
              </>
            )}
          </p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={props.onClose} aria-label="Close inspector">
          Close
        </button>
      </header>

      <div className="ca-inspector-actions">
        {props.focalId !== organizationId && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => props.onRecentre(organizationId)}>
            Recentre here
          </button>
        )}
        <button type="button" className="btn btn-secondary btn-sm" aria-pressed={props.compared} onClick={() => props.onToggleCompare(organizationId)}>
          {props.compared ? 'Remove from selection' : 'Add to selection'}
        </button>
        <Link className="btn btn-ghost btn-sm" to={`/organizations/${organizationId}`}>
          Full profile
        </Link>
      </div>

      {assessment && props.roleActive && (
        <section className="ca-inspector-section">
          <h3>Role assessment</h3>
          <p>
            <TierBadge tier={assessment.tier} overridden={Boolean(assessment.override)} /> {TIER_LABELS[assessment.tier]}
          </p>
          {assessment.override && (
            <p className="ca-override-note">
              Recruiter override by {assessment.override.by}: {assessment.override.reason}. Rules computed {TIER_LABELS[assessment.computedTier]}.{' '}
              <button type="button" className="ca-link-button" onClick={() => props.onClearOverride(organizationId)}>
                Remove override
              </button>
            </p>
          )}
          <p className="intel-muted">Assessment confidence: <ConfidenceTag value={assessment.confidence} /></p>
          {assessment.reasons.length > 0 && (
            <>
              <h4>Why</h4>
              <ul>{assessment.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
            </>
          )}
          {assessment.gaps.length > 0 && (
            <>
              <h4>Gaps</h4>
              <ul>{assessment.gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
            </>
          )}
          {assessment.missingEvidence.length > 0 && (
            <>
              <h4>Missing evidence</h4>
              <ul>{assessment.missingEvidence.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}
          <form
            className="ca-form"
            onSubmit={(event) => {
              event.preventDefault()
              const error = props.onOverride(organizationId, overrideTier, overrideReason)
              setMessage(error ?? 'Override saved in this browser')
              if (!error) setOverrideReason('')
            }}
          >
            <h4>Override tier</h4>
            <label htmlFor={`${baseId}-tier`}>Tier</label>
            <select id={`${baseId}-tier`} className="filter-select" value={overrideTier} onChange={(event) => setOverrideTier(event.target.value as Tier)}>
              {TIER_ORDER.filter((tier) => tier !== 'not-applicable').map((tier) => (
                <option key={tier} value={tier}>
                  {TIER_LABELS[tier]}
                </option>
              ))}
            </select>
            <label htmlFor={`${baseId}-reason`}>Reason (required)</label>
            <textarea id={`${baseId}-reason`} className="ca-textarea" value={overrideReason} onChange={(event) => setOverrideReason(event.target.value)} rows={2} />
            <button type="submit" className="btn btn-secondary btn-sm">
              Save override
            </button>
          </form>
        </section>
      )}

      <section className="ca-inspector-section">
        <h3>Facts (sourced)</h3>
        {facts.length > 0 && (
          <>
            <h4>Why it is associated</h4>
            <ul>
              {facts.map((dim) => (
                <li key={dim.type}>
                  <b>{ASSOCIATION_LABELS[dim.type]}:</b> {dim.detail} <ConfidenceTag value={dim.confidence} />
                </li>
              ))}
            </ul>
          </>
        )}
        <h4>Industries</h4>
        {industries.length === 0 ? (
          <p className="intel-muted">Industry not recorded (unknown, not zero).</p>
        ) : (
          <ul>
            {industries.map((ind) => (
              <li key={ind.industryId}>
                <Link to={`/industries/${ind.industryId}`}>{indName(ind.industryId)}</Link> ({ind.role}) <ConfidenceTag value={ind.confidence} /> <OriginTag value={ind.origin} />
                <EvidenceLinks graph={graph} ids={ind.evidenceIds} />
              </li>
            ))}
          </ul>
        )}
        <h4>Observed capabilities</h4>
        {observed.length === 0 ? (
          <p className="intel-muted">None observed in sources yet.</p>
        ) : (
          <ul>
            {observed.map((cap) => (
              <li key={cap.capabilityId}>
                <Link to={`/capabilities/${cap.capabilityId}`}>{capName(cap.capabilityId)}</Link> <ConfidenceTag value={cap.confidence} />
                {cap.summary && <span className="intel-evidence-supports">{cap.summary}</span>}
                <EvidenceLinks graph={graph} ids={cap.evidenceIds} />
              </li>
            ))}
          </ul>
        )}
        {notObserved.length > 0 && (
          <>
            <h4>Sources say not carried out</h4>
            <ul>
              {notObserved.map((cap) => (
                <li key={cap.capabilityId}>
                  {capName(cap.capabilityId)}: {cap.summary}
                  <EvidenceLinks graph={graph} ids={cap.evidenceIds} />
                </li>
              ))}
            </ul>
          </>
        )}
        {unknownSourced.length > 0 && (
          <>
            <h4>Checked, still unknown</h4>
            <ul>{unknownSourced.map((cap) => <li key={cap.capabilityId}>{capName(cap.capabilityId)}: {cap.summary}</li>)}</ul>
          </>
        )}
        {(relationships.length > 0 || parents.length > 0) && (
          <>
            <h4>Corporate relationships</h4>
            <ul>
              {relationships.map((rel) => {
                const other = rel.fromId === organizationId ? rel.toId : rel.fromId
                const direction = rel.fromId === organizationId ? rel.type : `has ${rel.type.replace('-of', '')}`
                return (
                  <li key={`${rel.fromId}-${rel.toId}-${rel.type}`}>
                    {direction} <Link to={`/organizations/${other}`}>{graph.organizationById.get(other)?.name ?? other}</Link> <ConfidenceTag value={rel.confidence} />
                    <EvidenceLinks graph={graph} ids={rel.evidenceIds} />
                  </li>
                )
              })}
            </ul>
          </>
        )}
        {metrics.length > 0 && (
          <>
            <h4>Scale (as sourced, not comparable across kinds)</h4>
            <ul>
              {metrics.map((metric, index) => (
                <li key={`${metric.metric}-${index}`}>
                  {metric.metric}: {metric.valueText} {metric.note && <span className="intel-muted">({metric.note})</span>}
                  <EvidenceLinks graph={graph} ids={metric.evidenceIds} />
                </li>
              ))}
            </ul>
          </>
        )}
        {locations.length > 0 && (
          <>
            <h4>Locations</h4>
            <p>{[...new Set(locations.map((loc) => [loc.city, loc.province].filter(Boolean).join(', ')))].join('; ')}</p>
          </>
        )}
        <h4>People</h4>
        <p>
          {row?.currentPeople ?? 0} current and {row?.formerPeople ?? 0} former public profiles linked.{' '}
          <span className="intel-muted">Employment shows where someone works, not what they did.</span>
        </p>
      </section>

      <section className="ca-inspector-section">
        <h3>Inferences (system)</h3>
        {hypotheses.length === 0 ? (
          <p className="intel-muted">No industry-typical hypotheses.</p>
        ) : (
          <ul>
            {hypotheses.map((cap) => (
              <li key={cap.capabilityId}>
                {capName(cap.capabilityId)} <ConfidenceTag value="hypothesis" /> <span className="intel-muted">{cap.summary}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="ca-inspector-section">
        <h3>Suggestions (recruiter and workspace)</h3>
        {suggestions.length === 0 ? (
          <p className="intel-muted">No recruiter observations for this pair yet.</p>
        ) : (
          <ul>{suggestions.map((dim, index) => <li key={`${dim.type}-${index}`}><b>{ASSOCIATION_LABELS[dim.type]}:</b> {dim.detail}</li>)}</ul>
        )}
        {props.focalId && props.focalId !== organizationId && (
          <form
            className="ca-form"
            onSubmit={(event) => {
              event.preventDefault()
              const error = props.onAssociate(organizationId, assocReason)
              setMessage(error ?? 'Association saved in this browser')
              if (!error) setAssocReason('')
            }}
          >
            <label htmlFor={`${baseId}-assoc`}>Record why these companies are related (private)</label>
            <textarea id={`${baseId}-assoc`} className="ca-textarea" value={assocReason} onChange={(event) => setAssocReason(event.target.value)} rows={2} />
            <button type="submit" className="btn btn-secondary btn-sm">
              Save observation
            </button>
          </form>
        )}
      </section>

      {(questions.length > 0 || coverage.length > 0) && (
        <section className="ca-inspector-section">
          <h3>Research status</h3>
          {coverage.map((rec, index) => (
            <p key={`${rec.dataset}-${index}`}>
              {rec.scope}: {rec.status.replace(/-/g, ' ')}
              {rec.verifiedPeopleCount !== null ? ` (${rec.verifiedPeopleCount} verified)` : ''}
              {rec.lastChecked ? `, checked ${rec.lastChecked}` : ''}
            </p>
          ))}
          {questions.length > 0 && <ul>{questions.map((question) => <li key={question.issue}>{question.kind}: {question.issue}</li>)}</ul>}
        </section>
      )}
      {message && (
        <p className="ca-status" role="status">
          {message}
        </p>
      )}
    </aside>
  )
}
