import {
  MagnifyingGlass,
} from '@phosphor-icons/react'

interface MapSearchProps {
  value: string
  onChange: (val: string) => void
}

export function MapSearch({ value, onChange }: MapSearchProps) {
  return (
    <div className="map-search">
      <div className="search-bar">
        <MagnifyingGlass className="search-icon" size={14} />
        <input
          type="text"
          placeholder="Search nodes..."
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label="Search map nodes"
        />
      </div>
    </div>
  )
}
