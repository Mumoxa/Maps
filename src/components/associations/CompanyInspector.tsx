import { useMemo, useState } from 'react'
import { ArrowSquareOut, Check, Plus } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import { companyDossier } from '../../data/organizations/query'
import type { AssociationMatch, AssociationTier, RoleContext } from '../../data/organizations/types'
import { TIER_LABELS, RELATIONSHIP_LABELS } from './ExplorerFilters'

interface CompanyInspectorProps {
  index: OrganizationIndex
  organizationId: string
  match: AssociationMatch | null
  roleContext: RoleContext
  focalName: string
  selected: boolean
  onToggleSelect: () => void
  onCompare: () => void
  onRecenter: () => void
  onOverride: (tier: AssociationTier, reason: string) => void
  override: { tier: AssociationTier; reason: string; reviewer: string } | undefined
}

const EVIDENCE_STATE_LABELS: Record<string, string> = {
  'known-verified': 'Known and verified',
  'recorded-stale': 'Recorded but stale',
  inferred: 'Inferred or suggested',
  unknown: 'Unknown or not yet researched',
}

export function CompanyInspector({
  index,
  organizationId,
  match,
  roleContext,
  focalName,
  selected,
  onToggleSelect,
  onCompare,
  onRecenter,
  onOverride,
  override,
}: CompanyInspectorProps) {
  const dossier = useMemo(() => companyDossier(index, organizationId), [index, organizationId])
  const [overrideReason, setOverrideReason] = useState('')
  const [overrideTier, setOverrideTier] = useState<AssociationTier>(3)

  if (!dossier) {
    return <p className="assoc-empty">No company record for that identifier.</p>
  }

  const grouped = {
    operating: dossier.capabilities.filter((capability) => capability.group === 'operating'),
    commercial: dossier.capabilities.filter((capability) => capability.group === 'commercial'),
    financial: dossier.capabilities.filter((capability) => capability.group === 'financial'),
    technology: dossier.capabilities.filter((capability) => capability.group === 'technology'),
  }

  return (
    <div className="assoc-inspector-body">
      <div className="assoc-inspector-head">
        <h2>{dossier.identity.name}</h2>
        <p className="assoc-inspector-legal">
          {dossier.identity.legalName || 'Legal identity not established'}
          {dossier.identity.aliases.length > 0 && ` · also known as ${dossier.identity.aliases.join(', ')}`}
        </p>
        <div className="assoc-inspector-badges">
          <span className={`chip ${dossier.identity.status === 'verified' ? 'chip-ok' : 'chip-warn'}`}>
            {dossier.identity.status === 'verified' ? 'Identity verified' : 'Identity pending verification'}
          </span>
          <span className="chip">{EVIDENCE_STATE_LABELS[dossier.identity.evidenceState]}</span>
          {match && <span className={`assoc-tier assoc-tier-${match.tier}`}>{TIER_LABELS[String(match.tier)]}</span>}
        </div>
      </div>

      <div className="assoc-inspector-actions">
        <button type="button" className={`btn ${selected ? 'btn-secondary' : 'btn-primary'} btn-sm`} onClick={onToggleSelect}>
          {selected ? <><Check size={13} aria-hidden /> In target pool</> : <><Plus size={13} aria-hidden /> Add to target pool</>}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCompare}>Compare with another company</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onRecenter}>Recenter the map here</button>
        <a className="btn btn-ghost btn-sm" href={`/companies?q=${encodeURIComponent(dossier.identity.name)}`}>Open in company directory</a>
      </div>

      <section className="assoc-section" aria-labelledby="assoc-facts-heading">
        <h3 id="assoc-facts-heading">Factual company record</h3>
        <p className="assoc-section-note">Everything below is sourced. Nothing here is inferred from another company.</p>
        <dl className="detail-facts">
          <div className="detail-fact">
            <dt>Industries</dt>
            <dd>{dossier.industries.length > 0
              ? dossier.industries.map((industry) => `${industry.name}${industry.primary ? ' (primary)' : ''}`).join(', ')
              : 'Not classified yet'}</dd>
          </div>
          <div className="detail-fact">
            <dt>Website</dt>
            <dd>{dossier.identity.website
              ? <a href={dossier.identity.website} target="_blank" rel="noreferrer">{dossier.identity.website} <ArrowSquareOut size={12} aria-hidden /></a>
              : 'Not established from the sources read'}</dd>
          </div>
          <div className="detail-fact">
            <dt>South African locations</dt>
            <dd>{dossier.locations.length > 0
              ? dossier.locations.map((location) => `${location.city ? `${location.city}, ` : ''}${location.province}`).join('; ')
              : 'No sourced location yet'}</dd>
          </div>
          <div className="detail-fact">
            <dt>Scale</dt>
            <dd>{dossier.scale.length > 0
              ? dossier.scale.map((entry) => `${entry.metric}: ${entry.value} (${entry.basis}, ${entry.asOf})`).join('; ')
              : 'No sourced scale measure (headcount, revenue or sites)'}</dd>
          </div>
          <div className="detail-fact">
            <dt>Corporate structure</dt>
            <dd>
              {dossier.corporateStructure.parent && <span>Parent: {dossier.corporateStructure.parent.name}. </span>}
              {dossier.corporateStructure.subsidiaries.length > 0 && (
                <span>Subsidiaries: {dossier.corporateStructure.subsidiaries.map((entry) => entry.name).join(', ')}. </span>
              )}
              {dossier.corporateStructure.relationships.map((relationship) => (
                <span key={`${relationship.type}-${relationship.counterparty}`}>
                  {relationship.type} with {relationship.counterparty}.{' '}
                </span>
              ))}
              {!dossier.corporateStructure.parent && dossier.corporateStructure.subsidiaries.length === 0
                && dossier.corporateStructure.relationships.length === 0 && 'No documented corporate relationship.'}
            </dd>
          </div>
          <div className="detail-fact">
            <dt>Datasets referencing this company</dt>
            <dd>{dossier.identity.datasets.length > 0 ? dossier.identity.datasets.join(', ') : 'Canonical company record only'}</dd>
          </div>
          <div className="detail-fact">
            <dt>Last verified</dt>
            <dd>{dossier.identity.lastVerified || 'Not verified yet'}</dd>
          </div>
        </dl>
      </section>

      <CapabilitySection title="Operating processes" capabilities={grouped.operating} index={index} />
      <CapabilitySection title="Commercial activity" capabilities={grouped.commercial} index={index} />
      <CapabilitySection title="Financial complexity" capabilities={grouped.financial} index={index} />
      <CapabilitySection title="Systems" capabilities={grouped.technology} index={index} />

      <section className="assoc-section" aria-labelledby="assoc-why-heading">
        <h3 id="assoc-why-heading">Why this company appears for {roleContext.role}</h3>
        <p className="assoc-section-note">
          This is a sourcing recommendation about an operating environment, not a statement about any individual.
        </p>
        {match ? (
          <>
            <p className="assoc-inspector-relation">
              Relationship to the focal company ({focalName}): {match.relationshipTypes.map((type) => RELATIONSHIP_LABELS[type] ?? type).join(', ') || 'none evidenced'}.
              An association never implies ownership, partnership or shared clients.
            </p>
            <ul className="assoc-rule-list">
              {match.rules.map((rule) => (
                <li key={rule.rule}>
                  <strong>{rule.label}</strong>
                  <span>{rule.detail}</span>
                  {rule.evidence && <span className="assoc-rule-evidence">{rule.evidence}</span>}
                </li>
              ))}
            </ul>
            {match.gaps.length > 0 && (
              <div className="callout callout-warning">
                <strong>Missing evidence</strong>
                <ul>
                  {match.gaps.map((gap) => (
                    <li key={gap.requirement}>{gap.requirement}: {gap.reason}</li>
                  ))}
                </ul>
              </div>
            )}
            {override && (
              <p className="assoc-override">
                Recruiter override in force: tier {override.tier} by {override.reviewer} — {override.reason}
              </p>
            )}
            <details className="assoc-override-form">
              <summary>Record a recruiter override</summary>
              <label className="assoc-override-field">
                <span>Tier</span>
                <select className="filter-select" value={overrideTier} onChange={(event) => setOverrideTier(Number(event.target.value) as AssociationTier)} aria-label="Override relevance tier">
                  {([1, 2, 3, 4, 5] as AssociationTier[]).map((tier) => (
                    <option key={tier} value={tier}>{TIER_LABELS[String(tier)]}</option>
                  ))}
                </select>
              </label>
              <label className="assoc-override-field">
                <span>Reason</span>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={(event) => setOverrideReason(event.target.value)}
                  placeholder="Why this company should be treated differently"
                />
              </label>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={overrideReason.trim().length === 0}
                onClick={() => onOverride(overrideTier, overrideReason.trim())}
              >
                Save override with explanation
              </button>
            </details>
          </>
        ) : (
          <p className="assoc-section-note">
            This company is not in the current discovery result for {roleContext.role}. Select a role context or clear filters to see why.
          </p>
        )}
      </section>

      <section className="assoc-section" aria-labelledby="assoc-people-heading">
        <h3 id="assoc-people-heading">Talent already known to Maps</h3>
        {dossier.talent.mappedProfessionals > 0 ? (
          <dl className="detail-facts">
            <div className="detail-fact">
              <dt>Mapped professionals</dt>
              <dd>{dossier.talent.mappedProfessionals}</dd>
            </div>
            <div className="detail-fact">
              <dt>From datasets</dt>
              <dd>{dossier.talent.sources.map((source) => `${source.dataset}: ${source.count}`).join('; ')}</dd>
            </div>
          </dl>
        ) : (
          <p className="assoc-section-note">
            No professional has been mapped at this company yet. The company stays visible so the gap is research work, not a zero.
          </p>
        )}
        <a className="btn btn-ghost btn-sm" href={`/talent-search?q=${encodeURIComponent(dossier.identity.name)}`}>
          Search candidates mentioning {dossier.identity.name}
        </a>
      </section>

      <section className="assoc-section" aria-labelledby="assoc-sources-heading">
        <h3 id="assoc-sources-heading">Sources and evidence</h3>
        {dossier.sources.length > 0 ? (
          <ul className="assoc-source-list">
            {dossier.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.url} <ArrowSquareOut size={12} aria-hidden /></a>
                <span className="assoc-source-meta">{source.type} · read {source.checkedOn}</span>
                <span className="assoc-source-evidence">{source.evidence}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="assoc-section-note">No sources recorded yet. This record cannot be treated as verified.</p>
        )}
      </section>

      <section className="assoc-section" aria-labelledby="assoc-gaps-heading">
        <h3 id="assoc-gaps-heading">Research gaps</h3>
        {dossier.researchGaps.length > 0 ? (
          <ul className="assoc-gap-list">
            {dossier.researchGaps.map((gap) => <li key={gap}>{gap}</li>)}
          </ul>
        ) : (
          <p className="assoc-section-note">No outstanding research gaps recorded.</p>
        )}
      </section>
    </div>
  )
}

function CapabilitySection({
  title,
  capabilities,
  index,
}: {
  title: string
  capabilities: { id: string; name: string; status: string; evidence: string; sourceUrl: string }[]
  index: OrganizationIndex
}) {
  const observed = capabilities.filter((capability) => capability.status === 'observed')
  const unknown = capabilities.filter((capability) => capability.status === 'unknown')
  const notObserved = capabilities.filter((capability) => capability.status === 'not-observed')
  if (capabilities.length === 0) return null
  const headingId = `assoc-cap-${title.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <section className="assoc-section" aria-labelledby={headingId}>
      <h3 id={headingId}>{title}</h3>
      {observed.length > 0 && (
        <ul className="assoc-capability-list">
          {observed.map((capability) => (
            <li key={capability.id}>
              <strong>{capability.name}</strong>
              <span>{capability.evidence}</span>
              {capability.sourceUrl && (
                <a href={capability.sourceUrl} target="_blank" rel="noreferrer">source <ArrowSquareOut size={11} aria-hidden /></a>
              )}
            </li>
          ))}
        </ul>
      )}
      {unknown.length > 0 && (
        <p className="assoc-unknown">
          Never checked ({unknown.length}): {unknown.map((capability) => index.capabilityById.get(capability.id)?.name ?? capability.name).join(', ')}.
          Unknown is not the same as absent.
        </p>
      )}
      {notObserved.length > 0 && (
        <p className="assoc-absent">
          Checked and not observed ({notObserved.length}): {notObserved.map((capability) => capability.name).join(', ')}.
        </p>
      )}
    </section>
  )
}
