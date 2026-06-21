import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
}

export function MapControls({ onZoomIn, onZoomOut, onFitView }: MapControlsProps) {
  return (
    <div className="map-controls">
      <button className="btn btn-ghost btn-sm" onClick={onZoomIn} title="Zoom in"><ZoomIn size={18} /></button>
      <button className="btn btn-ghost btn-sm" onClick={onZoomOut} title="Zoom out"><ZoomOut size={18} /></button>
      <button className="btn btn-ghost btn-sm" onClick={onFitView} title="Fit view"><Maximize2 size={18} /></button>
    </div>
  )
}
