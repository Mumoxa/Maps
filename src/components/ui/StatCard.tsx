export type StatTone = 'default' | 'primary' | 'success' | 'accent' | 'purple'

interface StatCardProps {
  value: number | string
  label: string
  tone?: StatTone
}

/**
 * One figure with its label. Tone is a token name rather than a colour value so
 * every stat card stays inside the palette and both themes stay in sync.
 */
export function StatCard({ value, label, tone = 'default' }: StatCardProps) {
  return (
    <div className="card stat-card">
      <div className={`stat-value${tone === 'default' ? '' : ` stat-value-${tone}`}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
