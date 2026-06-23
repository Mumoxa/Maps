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
      >
        <option value="">All Segments</option>
        {segmentOptions.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
