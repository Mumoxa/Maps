import { Link } from 'react-router-dom'
import { FOOTPRINT_SHORT_LABELS } from '../../data/organizations/footprint'
import type { CompanyView } from '../../data/organizations/universeView'

interface UniversalCompanyCardProps {
  view: CompanyView
  linkSuffix?: string
  onOpen?: (organizationId: string) => void
}

/**
 * One company in the universal directory.
 *
 * The card shows what is known and, just as importantly, what is not: an
 * unplaced company says "Not yet classified" rather than borrowing a sector, and
 * an unclassified footprint is shown as unknown rather than as small.
 */
export function UniversalCompanyCard({ view, linkSuffix = '', onOpen }: UniversalCompanyCardProps) {
  const body = (
    <>
      <div className="ucompany-name">{view.name}</div>
      <p className="ucompany-path">
        {view.taxonomyPaths.length > 0
          ? view.taxonomyPaths[0]
          : 'Not yet classified into the national taxonomy'}
      </p>
      <div className="ucompany-meta">
        <span className={`footprint-chip footprint-band-${view.footprint}`}>
          {FOOTPRINT_SHORT_LABELS[view.footprint]}
        </span>
        <span>{view.status === 'verified' ? 'Verified' : 'Pending verification'}</span>
      </div>
      <div className="ucompany-meta">
        <span>{view.provinces.length > 0 ? view.provinces.join(', ') : 'No sourced location'}</span>
        <span>
          {view.mappedProfessionals > 0
            ? `${view.mappedProfessionals} mapped`
            : 'No mapped professionals'}
        </span>
      </div>
    </>
  )

  if (onOpen) {
    return (
      <button type="button" className="card ucompany-card ucompany-card-button" onClick={() => onOpen(view.organizationId)}>
        {body}
      </button>
    )
  }
  return (
    <Link className="card ucompany-card" to={`/organizations/${encodeURIComponent(view.organizationId)}${linkSuffix}`}>
      {body}
    </Link>
  )
}
