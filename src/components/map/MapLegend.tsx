interface MapLegendProps {
  segmentCount?: number
}

export function MapLegend({ segmentCount }: MapLegendProps) {
  return (
    <div className="map-legend">
      <div className="map-legend-title">Legend</div>
      <div className="map-legend-items">
        <div className="map-legend-item">
          <div className="map-legend-swatch" style={{ background: '#eff6ff', border: '1.5px solid #2563eb' }} />
          <span>Segment</span>
        </div>
        <div className="map-legend-item">
          <div className="map-legend-swatch" style={{ background: '#ecfdf5', border: '1.5px solid #10b981' }} />
          <span>Company</span>
        </div>
        <div className="map-legend-item">
          <div className="map-legend-swatch" style={{ background: '#fffbeb', border: '1.5px solid #f59e0b' }} />
          <span>Profile</span>
        </div>
        <div className="map-legend-item">
          <div className="map-legend-swatch" style={{ background: '#fff7ed', border: '1.5px dashed #f97316' }} />
          <span>Needs verification</span>
        </div>
      </div>
      {segmentCount !== undefined && (
        <div className="map-legend-count">
          {segmentCount} segments · 79 companies · 344 profiles
        </div>
      )}
    </div>
  )
}
