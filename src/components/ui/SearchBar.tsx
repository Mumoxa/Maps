import React, { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SearchResult {
  label: string
  type: 'profile' | 'company' | 'segment'
  slug: string
}

interface SearchBarProps {
  value?: string
  onChange?: (val: string) => void
  onSearch?: (val: string) => void
  placeholder?: string
  results?: SearchResult[]
  onSelect?: (result: SearchResult) => void
  global?: boolean
}

export function SearchBar({ value, onChange, onSearch, placeholder = 'Search...', results = [], onSelect }: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value || '')
  const [showResults, setShowResults] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const currentValue = value !== undefined ? value : internalValue

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleChange = (val: string) => {
    if (onChange) onChange(val)
    else setInternalValue(val)
    setShowResults(true)
  }

  const handleSelect = (result: SearchResult) => {
    setShowResults(false)
    if (onSelect) onSelect(result)
    else navigate(`/${result.type}s/${result.slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowResults(false)
      if (onSearch) onSearch(currentValue)
      else if (currentValue.trim()) navigate(`/profiles?q=${encodeURIComponent(currentValue.trim())}`)
    }
  }

  return (
    <div className="search-bar" ref={ref}>
      <Search className="search-icon" size={16} />
      <input
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowResults(true)}
        aria-label="Search"
      />
      {showResults && results.length > 0 && currentValue.trim() && (
        <div className="search-results">
          {results.map((r, i) => (
            <div key={i} className="search-result-item" onClick={() => handleSelect(r)}>
              <div style={{ fontWeight: 500 }}>{r.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{r.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type { SearchResult }
