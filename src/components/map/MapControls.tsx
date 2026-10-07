import {
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  CornersOut,
} from '@phosphor-icons/react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
}

export function MapControls({ onZoomIn, onZoomOut, onFitView }: MapControlsProps) {
  return (
    <div className="map-controls">
      <button className="btn btn-ghost btn-sm" onClick={onZoomIn} title="Zoom in"><MagnifyingGlassPlus size={18} /></button>
      <button className="btn btn-ghost btn-sm" onClick={onZoomOut} title="Zoom out"><MagnifyingGlassMinus size={18} /></button>
      <button className="btn btn-ghost btn-sm" onClick={onFitView} title="Fit view"><CornersOut size={18} /></button>
    </div>
  )
}
