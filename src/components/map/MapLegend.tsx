interface MapLegendProps {
  segmentCount?: number
  companyCount?: number
  profileCount?: number
}

export function MapLegend({ segmentCount, companyCount, profileCount }: MapLegendProps) {
  return (
    <div className="map-legend">
      <div className="map-legend-title">Legend</div>
      <div className="map-legend-items">
        <div className="map-legend-item">
          <div className="map-legend-swatch map-legend-swatch-segment" />
          <span>Segment</span>
        </div>
        <div className="map-legend-item">
          <div className="map-legend-swatch map-legend-swatch-company" />
          <span>Company</span>
        </div>
        <div className="map-legend-item">
          <div className="map-legend-swatch map-legend-swatch-profile" />
          <span>Profile</span>
        </div>
        <div className="map-legend-item">
          <div className="map-legend-swatch map-legend-swatch-verification" />
          <span>Needs verification</span>
        </div>
      </div>
      {segmentCount !== undefined && (
        <div className="map-legend-count">
          {segmentCount.toLocaleString()} segments
          {companyCount !== undefined && ` · ${companyCount.toLocaleString()} companies`}
          {profileCount !== undefined && ` · ${profileCount.toLocaleString()} profiles`}
        </div>
      )}
    </div>
  )
}
