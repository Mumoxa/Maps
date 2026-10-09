import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WarningCircle } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import {
  FOOTPRINT_DEFINITIONS,
  FOOTPRINT_LABELS,
  FOOTPRINT_SHORT_LABELS,
} from '../../data/organizations/footprint'
import { classifyFootprint } from '../../data/organizations/footprint'
import type { FootprintBand } from '../../data/organizations/types'
import type { FootprintGroup } from '../../data/organizations/atlas'

interface FootprintBandsProps {
  groups: FootprintGroup[]
  index: OrganizationIndex
  /** Companies rendered per band before a "show all" control appears. */
  initialVisible?: number
  onOpenCompany?: (organizationId: string) => void
  /** Extra query kept on the company link, e.g. the branch the reader came from. */
  linkSuffix?: string
}

/**
 * The company landscape for one industry branch, organised into indicative
 * footprint bands.
 *
 * Two properties are deliberate and load-bearing:
 *
 *   - Every band is rendered, including the empty ones. A reader can see which
 *     levels of an industry Maps has not reached.
 *   - Companies within a band are alphabetical. The bands are approximate, so a
 *     numeric rank inside one would imply a precision the evidence does not have.
 *
 * Nothing here is a size fact: the band is labelled as indicative reach and the
 * basis behind each company's band lives on that company's dossier.
 */
export function FootprintBands({
  groups,
  index,
  initialVisible = 12,
  onOpenCompany,
  linkSuffix = '',
}: FootprintBandsProps) {
  return (
    <div className="footprint-bands">
      <p className="footprint-bands-note">
        <WarningCircle size={13} aria-hidden />
        <span>
          <strong>Indicative market footprint</strong> groups companies by approximate operating
          reach. It is not a statutory size band, not a revenue or headcount figure, and not a
          ranking. Companies with no comparable sourced measure stay in <em>Footprint not established</em>.
        </span>
      </p>

      {groups.map((group) => (
        <Band
          key={group.band}
          band={group.band}
          organizationIds={group.organizationIds}
          index={index}
          initialVisible={initialVisible}
          onOpenCompany={onOpenCompany}
          linkSuffix={linkSuffix}
        />
      ))}
    </div>
  )
}

function Band({
  band,
  organizationIds,
  index,
  initialVisible,
  onOpenCompany,
  linkSuffix,
}: {
  band: FootprintBand
  organizationIds: string[]
  index: OrganizationIndex
  initialVisible: number
  onOpenCompany?: (organizationId: string) => void
  linkSuffix: string
}) {
  // Each band owns its own disclosure state, so expanding one never expands all.
  // This is a rendering decision and deliberately stays out of URL state, which
  // has to remain shareable.
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? organizationIds : organizationIds.slice(0, initialVisible)
  const hidden = organizationIds.length - visible.length

  return (
    <section className={`footprint-band footprint-band-${band}`} aria-labelledby={`band-${band}`}>
      <header className="footprint-band-head">
        <h3 id={`band-${band}`} className="footprint-band-title">{FOOTPRINT_LABELS[band]}</h3>
        <span className="footprint-band-count">{organizationIds.length}</span>
      </header>
      <p className="footprint-band-definition">{FOOTPRINT_DEFINITIONS[band]}</p>

      {organizationIds.length === 0 ? (
        <p className="footprint-band-empty">
          No company in this branch is currently classified at this level.
        </p>
      ) : (
        <>
          <ul className="footprint-band-list">
            {visible.map((organizationId) => {
              const organization = index.byId.get(organizationId)
              const name = organization?.name ?? organizationId
              const classification = organization ? classifyFootprint(organization) : null
              const professionals = index.employersByOrg.get(organizationId)?.professionals ?? 0
              const body = (
                <>
                  <span className="footprint-company-name">{name}</span>
                  <span className="footprint-company-meta">
                    {organization?.status === 'verified' ? 'Verified' : 'Pending verification'}
                    {professionals > 0 ? ` · ${professionals} mapped` : ''}
                    {classification?.reviewStatus === 'pending-review' ? ' · indicative' : ''}
                  </span>
                </>
              )
              return (
                <li key={organizationId}>
                  {onOpenCompany ? (
                    <button
                      type="button"
                      className="footprint-company"
                      onClick={() => onOpenCompany(organizationId)}
                    >
                      {body}
                    </button>
                  ) : (
                    <Link className="footprint-company" to={`/organizations/${encodeURIComponent(organizationId)}${linkSuffix}`}>
                      {body}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
          {hidden > 0 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setExpanded(true)}>
              Show {hidden} more in {FOOTPRINT_SHORT_LABELS[band]}
            </button>
          )}
        </>
      )}
    </section>
  )
}
