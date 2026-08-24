import { useState, useCallback, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { globalSearch, talentTracks } from '../../data'
import { buildSlugSets } from '../../data'

const trackNavLinks = [
  { to: '/', label: 'Home' },
  { to: '/talent-search', label: 'Talent Search' },
  { to: '/contacts', label: 'Client Contacts' },
  ...talentTracks.map((track) => ({ to: `/${track.slug}`, label: track.name })),
]

const creditRiskNavLinks = [
  { to: '/map', label: 'Map' },
  { to: '/segments', label: 'Segments' },
  { to: '/companies', label: 'Companies' },
  { to: '/profiles', label: 'Candidates' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/shortlist', label: 'Shortlist' },
  { to: '/markets/salesforce', label: 'Salesforce' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [searchResults, setSearchResults] = useState<{ label: string; type: string; slug: string }[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const { data } = useData()
  const searchRef = useRef<HTMLDivElement>(null)
  const showCreditRiskNav = ['/credit-risk', '/map', '/segments', '/companies', '/profiles', '/contacts', '/shortlist']
    .some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`))

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = useCallback((val: string) => {
    setSearchVal(val)
    if (!val.trim() || !data?.profiles) {
      setSearchResults([])
      return
    }
    const result = globalSearch(data, val)
    const slugSets = buildSlugSets(data)
    const items: { label: string; type: string; slug: string }[] = []
    for (const p of result.profiles) {
      const slug = slugSets.profileIdToSlug.get(p.id)
      if (slug) items.push({ label: p.name, type: 'Profile', slug })
    }
    for (const c of result.companies) {
      const slug = slugSets.companyIdToSlug.get(c.id)
      if (slug) items.push({ label: c.name, type: 'Company', slug })
    }
    for (const s of result.segments) {
      const slug = slugSets.segmentIdToSlug.get(s.id)
      if (slug) items.push({ label: s.name, type: 'Segment', slug })
    }
    setSearchResults(items.slice(0, 8))
  }, [data])

  const handleSelect = useCallback((item: { label: string; type: string; slug: string }) => {
    setSearchResults([])
    setSearchVal('')
    const prefix = item.type.toLowerCase() + 's'
    navigate(`/${prefix}/${item.slug}`)
  }, [navigate])

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          SA Talent Map
        </Link>

        <nav className="header-nav">
          {trackNavLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {showCreditRiskNav && (
          <div className="header-search" ref={searchRef}>
            <div className="search-bar">
              <Search className="search-icon" size={14} />
              <input
                type="text"
                placeholder="Search credit risk track data..."
                value={searchVal}
                onChange={e => handleSearch(e.target.value)}
                aria-label="Search credit risk track data"
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((item) => (
                    <button key={`${item.type}-${item.slug}`} type="button" className="search-result-item" onClick={() => handleSelect(item)}>
                      <div className="search-result-name">{item.label}</div>
                      <div className="search-result-type">{item.type}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {showCreditRiskNav && (
        <div className="header-subnav">
          <div className="header-subnav-inner">
            {creditRiskNavLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        {trackNavLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {showCreditRiskNav && creditRiskNavLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
