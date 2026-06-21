interface StatCardProps {
  value: number | string
  label: string
  color?: string
}

export function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className="card stat-card">
      <div className="stat-value" style={color ? { color } : undefined}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
