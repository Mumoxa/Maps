interface MapFilterProps {
  segmentOptions: { value: string; label: string }[]
  activeSegment: string
  onChange: (val: string) => void
}

export function MapFilter({ segmentOptions, activeSegment, onChange }: MapFilterProps) {
  return (
    <div className="map-filter">
      <select
        value={activeSegment}
        onChange={e => onChange(e.target.value)}
        aria-label="Filter by segment"
        style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.85rem' }}
      >
        <option value="">All Segments</option>
        {segmentOptions.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
