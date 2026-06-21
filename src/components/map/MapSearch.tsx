import { Search } from 'lucide-react'

interface MapSearchProps {
  value: string
  onChange: (val: string) => void
}

export function MapSearch({ value, onChange }: MapSearchProps) {
  return (
    <div className="map-search">
      <div className="search-bar">
        <Search className="search-icon" size={14} />
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
