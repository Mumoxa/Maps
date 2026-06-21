interface MapLegendProps {
  segmentCount?: number
}

export function MapLegend({ segmentCount }: MapLegendProps) {
  return (
    <div className="map-legend">
      <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Legend</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#e8effd', border: '1px solid #1a56db' }} />
          <span>Segment</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#f0fdf4', border: '1px solid #10b981' }} />
          <span>Company</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#fefce8', border: '1px solid #f59e0b' }} />
          <span>Profile</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#ffedd5', border: '1px dashed #f97316' }} />
          <span>Needs verification</span>
        </div>
      </div>
      {segmentCount !== undefined && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#6b7280' }}>
          {segmentCount} segments · 79 companies · 344 profiles
        </div>
      )}
    </div>
  )
}
