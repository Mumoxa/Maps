import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Buildings,
  ChartBar,
  MagnifyingGlass,
  MapTrifold,
  SquaresFour,
  Stack,
  Users,
} from '@phosphor-icons/react'
import { useData } from '../../context/DataContext'
import { buildSlugSets, globalSearch, talentTracks } from '../../data'

interface PaletteItem {
  id: string
  group: string
  label: string
  sub?: string
  to: string
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

const MAX_PER_GROUP = 5

/**
 * One keyboard entry point for the whole product: jump to any page or any
 * record without leaving the keyboard. Opened with Cmd/Ctrl+K.
 */
export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { data } = useData()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const destinations = useMemo<PaletteItem[]>(() => {
    const pages: PaletteItem[] = [
      { id: 'page-home', group: 'Pages', label: 'Home', sub: 'All talent tracks', to: '/' },
      { id: 'page-talent-search', group: 'Pages', label: 'People search', sub: 'Every searchable candidate', to: '/talent-search' },
      { id: 'page-credit-risk', group: 'Pages', label: 'Credit risk track', sub: 'Market map overview', to: '/credit-risk' },
      { id: 'page-map', group: 'Pages', label: 'Interactive map', sub: 'Segments, companies, people', to: '/map' },
      { id: 'page-segments', group: 'Pages', label: 'Segments', sub: 'Industry segments', to: '/segments' },
      { id: 'page-companies', group: 'Pages', label: 'Companies', sub: 'Employers in the map', to: '/companies' },
      { id: 'page-profiles', group: 'Pages', label: 'Candidates', sub: 'Credit risk profiles', to: '/profiles' },
      { id: 'page-shortlist', group: 'Pages', label: 'Shortlist', sub: 'Priority candidates', to: '/shortlist' },
      { id: 'page-market-salesforce', group: 'Pages', label: 'Salesforce ecosystem', sub: 'Ecosystem intelligence', to: '/markets/salesforce' },
      { id: 'page-search-bank', group: 'Pages', label: 'Search bank', sub: 'Client search workspace', to: '/search-bank' },
      { id: 'page-contacts', group: 'Pages', label: 'Contacts', sub: 'Contact directory', to: '/contacts' },
    ]
    const tracks: PaletteItem[] = talentTracks.map((track) => ({
      id: `track-${track.slug}`,
      group: 'Talent tracks',
      label: track.name,
      sub: track.scope.geography,
      to: `/${track.slug}`,
    }))
    return [...pages, ...tracks]
  }, [])

  const recordItems = useMemo<PaletteItem[]>(() => {
    const trimmed = query.trim()
    if (!data || trimmed.length < 2) return []
    const slugs = buildSlugSets(data)
    const found = globalSearch(data, trimmed)
    const items: PaletteItem[] = []
    for (const profile of found.profiles.slice(0, MAX_PER_GROUP)) {
      const slug = slugs.profileIdToSlug.get(profile.id)
      if (slug) items.push({ id: `profile-${profile.id}`, group: 'Candidates', label: profile.name, sub: profile.title, to: `/profiles/${slug}` })
    }
    for (const company of found.companies.slice(0, MAX_PER_GROUP)) {
      const slug = slugs.companyIdToSlug.get(company.id)
      if (slug) items.push({ id: `company-${company.id}`, group: 'Companies', label: company.name, sub: company.segment, to: `/companies/${slug}` })
    }
    for (const segment of found.segments.slice(0, MAX_PER_GROUP)) {
      const slug = slugs.segmentIdToSlug.get(segment.id)
      if (slug) items.push({ id: `segment-${segment.id}`, group: 'Segments', label: segment.name, sub: 'Industry segment', to: `/segments/${slug}` })
    }
    return items
  }, [data, query])

  const items = useMemo<PaletteItem[]>(() => {
    const needle = query.trim().toLowerCase()
    const matches = needle
      ? destinations.filter((item) =>
          `${item.label} ${item.sub ?? ''} ${item.group}`.toLowerCase().includes(needle),
        )
      : destinations
    return [...matches.slice(0, 8), ...recordItems]
  }, [destinations, recordItems, query])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(0)
      const frame = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(frame)
    }
    return undefined
  }, [isOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const runItem = useCallback(
    (item: PaletteItem) => {
      navigate(item.to)
      onClose()
    },
    [navigate, onClose],
  )

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((index) => (items.length ? (index + 1) % items.length : 0))
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((index) => (items.length ? (index - 1 + items.length) % items.length : 0))
        return
      }
      if (event.key === 'Enter') {
        const item = items[activeIndex]
        if (item) {
          event.preventDefault()
          runItem(item)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, items, activeIndex, onClose, runItem])

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!isOpen) return null

  let lastGroup = ''

  return (
    <div className="cmdk-root" role="dialog" aria-modal="true" aria-label="Search and navigate">
      <div className="cmdk-backdrop" onClick={onClose} />
      <div className="cmdk-panel">
        <div className="cmdk-input-row">
          <MagnifyingGlass size={18} aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, candidates, companies, segments..."
            aria-label="Search pages and records"
            aria-controls="cmdk-list"
            aria-activedescendant={items[activeIndex]?.id}
            autoComplete="off"
          />
          <span className="cmdk-hint">
            <kbd>Esc</kbd>
          </span>
        </div>

        {items.length === 0 ? (
          <p className="cmdk-empty">No matches. Try a name, a company, or a segment.</p>
        ) : (
          <ul className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
            {items.map((item, index) => {
              const showGroup = item.group !== lastGroup
              lastGroup = item.group
              return (
                <li key={item.id}>
                  {showGroup && <div className="cmdk-group-label">{item.group}</div>}
                  <button
                    type="button"
                    id={item.id}
                    role="option"
                    aria-selected={index === activeIndex}
                    className="cmdk-option"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runItem(item)}
                  >
                    <PaletteGlyph group={item.group} />
                    <span>{item.label}</span>
                    {item.sub && <span className="cmdk-option-sub">{item.sub}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div className="cmdk-footer">
          <span className="cmdk-hint"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span className="cmdk-hint"><kbd>↵</kbd> open</span>
          <span className="cmdk-hint"><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

function PaletteGlyph({ group }: { group: string }) {
  const size = 16
  if (group === 'Candidates') return <Users size={size} aria-hidden />
  if (group === 'Companies') return <Buildings size={size} aria-hidden />
  if (group === 'Segments') return <ChartBar size={size} aria-hidden />
  if (group === 'Talent tracks') return <Stack size={size} aria-hidden />
  if (group === 'Pages') return <SquaresFour size={size} aria-hidden />
  return <MapTrifold size={size} aria-hidden />
}
