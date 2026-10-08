import type { DiscoveryRow, Pocket } from '../../data/intelligence/discovery'
import { TIER_ORDER, TIER_SHORT } from '../../data/intelligence/targeting'
import { TierBadge } from '../intelligence/IntelBits'

const FIT_LABELS: Record<Pocket['fit'], string> = {
  preferred: 'Preferred industry',
  adjacent: 'Adjacent industry',
  neutral: 'Other industry',
  deprioritised: 'Deprioritised for this role',
  unclassified: 'Industry unknown',
}

interface PocketsViewProps {
  pockets: Pocket[]
  rowById: Map<string, DiscoveryRow>
  visibleIds: Set<string>
  expanded: Set<string>
  selected: string | null
  compare: Set<string>
  onTogglePocket: (id: string) => void
  onSelect: (id: string, additive: boolean) => void
}

export function PocketsView({ pockets, rowById, visibleIds, expanded, selected, compare, onTogglePocket, onSelect }: PocketsViewProps) {
  const shown = pockets.map((pocket) => ({ pocket, ids: pocket.organizationIds.filter((id) => visibleIds.has(id)) })).filter((entry) => entry.ids.length > 0)
  if (!shown.length) return <p className="intel-muted">No companies match the current filters.</p>
  return (
    <div className="ca-pockets">
      {shown.map(({ pocket, ids }) => {
        const isOpen = expanded.has(pocket.id)
        let people = 0
        let withoutPeople = 0
        const tiers = new Map<string, number>()
        for (const id of ids) {
          const row = rowById.get(id)
          if (!row) continue
          people += row.currentPeople
          if (row.currentPeople === 0) withoutPeople++
          tiers.set(row.assessment.tier, (tiers.get(row.assessment.tier) ?? 0) + 1)
        }
        return (
          <section key={pocket.id} className={`ca-pocket ca-fit-${pocket.fit}`} aria-labelledby={`${pocket.id}-title`}>
            <header className="ca-pocket-head">
              <h3 id={`${pocket.id}-title`} className="ca-pocket-title">
                {pocket.label}
              </h3>
              <span className="ca-pocket-fit">{FIT_LABELS[pocket.fit]}</span>
            </header>
            <dl className="ca-pocket-stats">
              <div>
                <dt>Companies</dt>
                <dd>{ids.length}</dd>
              </div>
              <div>
                <dt>Mapped people</dt>
                <dd>{people}</dd>
              </div>
              <div>
                <dt>Not yet mapped</dt>
                <dd>{withoutPeople}</dd>
              </div>
            </dl>
            <p className="ca-pocket-tiers">
              {TIER_ORDER.filter((tier) => tiers.has(tier)).map((tier) => (
                <span key={tier} className="chip">
                  {TIER_SHORT[tier]} {tiers.get(tier)}
                </span>
              ))}
            </p>
            <button type="button" className="btn btn-ghost btn-sm" aria-expanded={isOpen} onClick={() => onTogglePocket(pocket.id)}>
              {isOpen ? 'Hide companies' : `Show all ${ids.length} companies`}
            </button>
            {isOpen && (
              <ul className="ca-pocket-list">
                {ids.map((id) => {
                  const row = rowById.get(id)
                  if (!row) return null
                  return (
                    <li key={id} className={selected === id ? 'is-selected' : undefined}>
                      <input
                        type="checkbox"
                        id={`pocket-compare-${id}`}
                        checked={compare.has(id)}
                        onChange={() => onSelect(id, true)}
                        aria-label={`Select ${row.name} for compare and bulk actions`}
                      />
                      <button type="button" className="ca-link-button" onClick={() => onSelect(id, false)}>
                        {row.name}
                      </button>
                      <TierBadge tier={row.assessment.tier} overridden={Boolean(row.assessment.override)} />
                      <span className="intel-muted">{row.currentPeople} people</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}
