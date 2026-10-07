import { useReactFlow } from '@xyflow/react'
import {
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  CornersOut,
} from '@phosphor-icons/react'

/**
 * Map viewport controls. Rendered inside <ReactFlow>, so it reads the flow
 * instance from context rather than taking callbacks from the page.
 */
export function MapControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <div className="map-controls">
      <button type="button" className="btn btn-ghost btn-sm" aria-label="Zoom in" onClick={() => zoomIn()}>
        <MagnifyingGlassPlus size={18} aria-hidden />
      </button>
      <button type="button" className="btn btn-ghost btn-sm" aria-label="Zoom out" onClick={() => zoomOut()}>
        <MagnifyingGlassMinus size={18} aria-hidden />
      </button>
      <button type="button" className="btn btn-ghost btn-sm" aria-label="Fit map to view" onClick={() => fitView({ duration: 300 })}>
        <CornersOut size={18} aria-hidden />
      </button>
    </div>
  )
}
