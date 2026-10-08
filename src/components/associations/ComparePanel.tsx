import { useMemo, useState } from 'react'
import type { OrganizationIndex } from '../../data/organizations/load'
import { compareOrganizations } from '../../data/organizations/analysis'
import type { RoleContext } from '../../data/organizations/types'

interface ComparePanelProps {
  index: OrganizationIndex
  leftId: string
  rightId: string | null
  roleContext: RoleContext | null
  onRightChange: (organizationId: string) => void
}

export function ComparePanel({ index, leftId, rightId, roleContext, onRightChange }: ComparePanelProps) {
  const left = index.byId.get(leftId)
  const [needle, setNeedle] = useState('')

  const options = useMemo(() => {
    const term = needle.trim().toLowerCase()
    return [...index.byId.values()]
      .filter((organization) => organization.id !== leftId)
      .filter((organization) => !term || organization.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 40)
  }, [index, leftId, needle])

  const comparison = useMemo(
    () => (rightId ? compareOrganizations(index, leftId, rightId, roleContext) : null),
    [index, leftId, rightId, roleContext],
  )
  const right = rightId ? index.byId.get(rightId) : null

  if (!left) return <p className="assoc-empty">Select a company to compare.</p>

  return (
    <div className="assoc-compare">
      <p className="assoc-compare-intro">
        Comparing <strong>{left.name}</strong>
        {right ? ` with ${right.name}` : ' with another company you choose'}.
        Shared characteristics are evidenced on both sides; unknown characteristics are missing research, not proven absence.
      </p>

      <label className="assoc-compare-picker">
        <span>Compare with</span>
        <input
          type="search"
          value={needle}
          onChange={(event) => setNeedle(event.target.value)}
          placeholder="Find a company"
          aria-label="Find a company to compare with"
        />
      </label>
      <ul className="assoc-compare-options">
        {options.map((organization) => (
          <li key={organization.id}>
            <button type="button" className="assoc-link-button" onClick={() => onRightChange(organization.id)}>
              {organization.name}
            </button>
          </li>
        ))}
        {options.length === 0 && <li className="assoc-compare-empty">No company matches that search.</li>}
      </ul>

      {comparison && right && (
        <>
          <section className="assoc-section" aria-labelledby="assoc-compare-shared">
            <h3 id="assoc-compare-shared">Shared characteristics</h3>
            {comparison.shared.length > 0 ? (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th scope="col">Dimension</th><th scope="col">{left.name}</th><th scope="col">{right.name}</th></tr>
                  </thead>
                  <tbody>
                    {comparison.shared.map((row) => (
                      <tr key={row.dimension}><td className="cell-strong">{row.dimension}</td><td>{row.left}</td><td>{row.right}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="assoc-section-note">No evidenced characteristic is shared by both records.</p>}
          </section>

          <section className="assoc-section" aria-labelledby="assoc-compare-distinct">
            <h3 id="assoc-compare-distinct">Distinct characteristics</h3>
            {comparison.distinct.length > 0 ? (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th scope="col">Dimension</th><th scope="col">{left.name}</th><th scope="col">{right.name}</th></tr>
                  </thead>
                  <tbody>
                    {comparison.distinct.map((row) => (
                      <tr key={row.dimension}><td className="cell-strong">{row.dimension}</td><td>{row.left}</td><td>{row.right}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="assoc-section-note">No evidenced difference between the two records.</p>}
          </section>

          <section className="assoc-section" aria-labelledby="assoc-compare-unknown">
            <h3 id="assoc-compare-unknown">Unknown characteristics</h3>
            {comparison.unknown.length > 0 ? (
              <ul className="assoc-gap-list">
                {comparison.unknown.map((row) => (
                  <li key={row.dimension}><strong>{row.dimension}:</strong> {row.left} / {row.right}</li>
                ))}
              </ul>
            ) : <p className="assoc-section-note">Both records are fully evidenced across the compared dimensions.</p>}
          </section>

          <section className="assoc-section" aria-labelledby="assoc-compare-implications">
            <h3 id="assoc-compare-implications">Implications for this assignment</h3>
            <ul className="assoc-gap-list">
              {comparison.implications.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
