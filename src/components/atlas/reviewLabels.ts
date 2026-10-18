import type { FootprintClassification } from '../../data/organizations/types'

/** Shared labels so the atlas, directory and dossier word these identically. */
export const REVIEW_STATUS_LABELS: Record<FootprintClassification['reviewStatus'], string> = {
  unreviewed: 'Not reviewed',
  'pending-review': 'Pending human review',
  reviewed: 'Human reviewed',
  contested: 'Contested',
}

export const CLASSIFICATION_KIND_LABELS: Record<FootprintClassification['classificationKind'], string> = {
  'sourced-metric': 'Derived from one sourced metric',
  'derived-metric-combination': 'Derived from a combination of sourced metrics',
  'human-reviewed-indicative': 'Human-reviewed indicative classification',
  unclassified: 'No defensible signal',
}
