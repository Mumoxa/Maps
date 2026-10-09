import { Info, WarningCircle } from '@phosphor-icons/react'
import {
  ENTITY_SCOPE_LABELS,
  FOOTPRINT_DEFINITIONS,
  FOOTPRINT_LABELS,
} from '../../data/organizations/footprint'
import type { FootprintClassification } from '../../data/organizations/types'
import { CLASSIFICATION_KIND_LABELS, REVIEW_STATUS_LABELS } from '../atlas/reviewLabels'

interface FootprintCardProps {
  classification: FootprintClassification
  /** Sourced scale records, rendered verbatim beneath the classification. */
  scale: { metric: string; value: string; basis: string; asOf: string; sourceUrl: string; entityScope?: string }[]
}

/**
 * Indicative market footprint, with its basis.
 *
 * The band is always shown next to the reason for it. A classification that
 * cannot explain itself becomes a ranking in the reader's head, which is exactly
 * what this contract exists to prevent.
 */
export function FootprintCard({ classification, scale }: FootprintCardProps) {
  const established = classification.band !== 'not-established'
  return (
    <section className={`footprint-card ${established ? '' : 'footprint-card-unknown'}`} aria-labelledby="footprint-card-heading">
      <h3 id="footprint-card-heading">Indicative market footprint</h3>

      <p className={`footprint-card-band footprint-band-${classification.band}`}>
        {FOOTPRINT_LABELS[classification.band]}
      </p>
      <p className="footprint-card-definition">{FOOTPRINT_DEFINITIONS[classification.band]}</p>

      <dl className="detail-facts">
        <div className="detail-fact">
          <dt>Why this band</dt>
          <dd>{classification.basis}</dd>
        </div>
        <div className="detail-fact">
          <dt>Basis of classification</dt>
          <dd>{CLASSIFICATION_KIND_LABELS[classification.classificationKind]}</dd>
        </div>
        <div className="detail-fact">
          <dt>Entity the figures cover</dt>
          <dd>
            {ENTITY_SCOPE_LABELS[classification.entityScope]}
            {classification.entityScope === 'not-stated' && (
              <span className="footprint-card-inline-warning">
                {' '}— the source does not say, so the figures must not be read as group-level.
              </span>
            )}
          </dd>
        </div>
        <div className="detail-fact">
          <dt>Confidence</dt>
          <dd>{classification.confidence}</dd>
        </div>
        <div className="detail-fact">
          <dt>Review status</dt>
          <dd>
            {REVIEW_STATUS_LABELS[classification.reviewStatus]}
            {classification.reviewedBy && ` · ${classification.reviewedBy} on ${classification.reviewedOn}`}
          </dd>
        </div>
        {classification.supportingMetricIds.length > 0 && (
          <div className="detail-fact">
            <dt>Supporting metrics</dt>
            <dd className="footprint-card-mono">{classification.supportingMetricIds.join(', ')}</dd>
          </div>
        )}
      </dl>

      {classification.note && (
        <p className="footprint-card-note">
          <Info size={13} aria-hidden /> {classification.note}
        </p>
      )}

      {classification.evidenceReferences.length > 0 && (
        <ul className="footprint-card-evidence">
          {classification.evidenceReferences.map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
            </li>
          ))}
        </ul>
      )}

      <div className="footprint-card-scale">
        <h4>Sourced scale measures, exactly as read</h4>
        {scale.length === 0 ? (
          <p className="footprint-card-warning">
            <WarningCircle size={13} aria-hidden /> No sourced scale measure. The company is left
            unclassified rather than assigned an assumed position.
          </p>
        ) : (
          <ul>
            {scale.map((entry) => (
              <li key={`${entry.metric}-${entry.value}`}>
                <strong>{entry.metric}</strong>: {entry.value}
                <span className="footprint-card-scale-meta">
                  {entry.basis} · as at {entry.asOf}
                  {entry.entityScope ? ` · ${ENTITY_SCOPE_LABELS[entry.entityScope as keyof typeof ENTITY_SCOPE_LABELS]}` : ''}
                </span>
                {entry.sourceUrl && (
                  <a href={entry.sourceUrl} target="_blank" rel="noreferrer">source</a>
                )}
              </li>
            ))}
          </ul>
        )}
        <p className="footprint-card-warning">
          <WarningCircle size={13} aria-hidden /> Headcount, turnover, site counts and sector
          capacity are never combined into one number. The band above is indicative reach, not a
          verified size.
        </p>
      </div>
    </section>
  )
}
