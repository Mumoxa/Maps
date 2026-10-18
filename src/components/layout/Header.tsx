import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CaretDown, MagnifyingGlass, ShareNetwork } from '@phosphor-icons/react'
import { talentTracks } from '../../data'
import { CommandPalette } from '../ui/CommandPalette'
import { ThemeToggle } from '../ui/ThemeToggle'

const candidatePoolLinks = [
  { to: '/talent-search', label: 'All candidates', hint: 'Every searchable profile' },
  ...talentTracks.map((track) => ({ to: `/${track.slug}`, label: track.name, hint: track.scope.category.replace(/-/g, ' ') })),
]

const candidatePaths = ['/talent-search', ...talentTracks.map((track) => `/${track.slug}`)]

/**
 * Company intelligence navigation. The Industry Atlas is first because it is the
 * default company-intelligence experience: it opens on the South African
 * industry universe, with no company and no recruitment brief selected.
 */
const companyLinks: { to: string; label: string; hint: string; extraPath?: string }[] = [
  // The atlas is both `/` and `/industry-atlas`, so it needs both paths to
  // register as the current page.
  { to: '/industry-atlas', label: 'Industry Atlas', hint: 'Sectors, sub-industries and company footprint', extraPath: '/' },
  { to: '/companies', label: 'Company universe', hint: 'Every organisation Maps holds' },
  { to: '/company-associations', label: 'Company associations', hint: 'Evidence-backed relationships' },
  { to: '/recruitment-targeting', label: 'Recruitment targeting', hint: 'Apply a brief to the universe' },
]

const companyPaths = ['/', '/industry-atlas', '/companies', '/organizations', '/company-associations', '/recruitment-targeting']

const creditRiskNavLinks = [
  { to: '/map', label: 'Map' },
  { to: '/segments', label: 'Segments' },
  { to: '/companies', label: 'Companies' },
  { to: '/profiles', label: 'Candidates' },
  { to: '/shortlist', label: 'Shortlist' },
  { to: '/markets/salesforce', label: 'Salesforce' },
]

const isPath = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(`${path}/`)

// The shortcut is labelled with the modifier the visitor's keyboard actually has.
const isApplePlatform =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
const shortcutLabel = isApplePlatform ? '⌘K' : 'Ctrl K'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [poolsOpen, setPoolsOpen] = useState(false)
  const [companiesOpen, setCompaniesOpen] = useState(false)
  const location = useLocation()
  const poolsRef = useRef<HTMLDivElement>(null)
  const companiesRef = useRef<HTMLDivElement>(null)

  const showCreditRiskNav = ['/credit-risk', '/map', '/segments', '/profiles', '/shortlist']
    .some((path) => isPath(location.pathname, path))
  const candidatesActive = candidatePaths.some((path) => isPath(location.pathname, path))
  const companiesActive = companyPaths.some((path) => isPath(location.pathname, path))

  // Close transient layers whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
    setPoolsOpen(false)
    setCompaniesOpen(false)
  }, [location.pathname])

  // Cmd/Ctrl+K is the single documented shortcut for search everywhere.
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
      if (event.key === '/' && !isTypingTarget(event.target)) {
        event.preventDefault()
        setPaletteOpen(true)
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    if (!poolsOpen && !companiesOpen) return undefined
    const handleClick = (event: MouseEvent) => {
      if (poolsOpen && poolsRef.current && !poolsRef.current.contains(event.target as Node)) setPoolsOpen(false)
      if (companiesOpen && companiesRef.current && !companiesRef.current.contains(event.target as Node)) setCompaniesOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [poolsOpen, companiesOpen])

  // Escape closes the menu layers this component owns, innermost first.
  useEffect(() => {
    if (!menuOpen && !poolsOpen && !companiesOpen) return undefined
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (companiesOpen) setCompaniesOpen(false)
      else if (poolsOpen) setPoolsOpen(false)
      else setMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen, poolsOpen, companiesOpen])

  const closeAll = useCallback(() => {
    setMenuOpen(false)
    setPoolsOpen(false)
    setCompaniesOpen(false)
  }, [])

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="header-logo" onClick={closeAll}>
            <span className="logo-mark" aria-hidden>
              <ShareNetwork size={19} weight="bold" />
            </span>
            <span className="header-logo-text">
              SA Talent Map
              <span className="header-logo-sub">Market intelligence</span>
            </span>
          </Link>

          <nav className="header-nav" aria-label="Primary">
            <div className="nav-item" data-open={poolsOpen} ref={poolsRef}>
              <button
                type="button"
                className={`nav-heading ${candidatesActive ? 'active' : ''}`}
                aria-expanded={poolsOpen}
                aria-controls="talent-pool-menu"
                onClick={() => setPoolsOpen((open) => !open)}
              >
                Talent pools
                <CaretDown size={12} weight="bold" aria-hidden />
              </button>
              <ul className="nav-dropdown" id="talent-pool-menu" aria-label="Talent pools">
                {candidatePoolLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={isPath(location.pathname, link.to) ? 'active' : ''}
                      onClick={closeAll}
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-item" data-open={companiesOpen} ref={companiesRef}>
              <button
                type="button"
                className={`nav-heading ${companiesActive ? 'active' : ''}`}
                aria-expanded={companiesOpen}
                aria-controls="company-menu"
                onClick={() => setCompaniesOpen((open) => !open)}
              >
                Companies
                <CaretDown size={12} weight="bold" aria-hidden />
              </button>
              <ul className="nav-dropdown" id="company-menu" aria-label="Company intelligence">
                {companyLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={isPath(location.pathname, link.to) || (link.extraPath ? isPath(location.pathname, link.extraPath) : false) ? 'active' : ''}
                      onClick={closeAll}
                    >
                      <span>{link.label}</span>
                      <span className="nav-dropdown-hint">{link.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/search-bank"
              className={`nav-heading ${isPath(location.pathname, '/search-bank') ? 'active' : ''}`}
              onClick={closeAll}
            >
              Search bank
            </Link>
            <Link
              to="/contacts"
              className={`nav-heading ${isPath(location.pathname, '/contacts') ? 'active' : ''}`}
              onClick={closeAll}
            >
              Contacts
            </Link>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="header-search-trigger"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search people, companies, segments and pages"
            >
              <MagnifyingGlass size={15} aria-hidden />
              <span className="header-search-trigger-label">Search</span>
              <kbd className="header-search-trigger-key">{shortcutLabel}</kbd>
            </button>

            <ThemeToggle />

            <button
              type="button"
              className="hamburger"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {showCreditRiskNav && (
          <nav className="header-subnav" aria-label="Credit risk track">
            <div className="header-subnav-inner">
              {creditRiskNavLinks.map((link) => (
                <Link key={link.to} to={link.to} className={location.pathname === link.to ? 'active' : ''}>
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}

        <div className={`mobile-nav ${menuOpen ? 'open' : ''}`} id="mobile-nav">
          <div className="mobile-nav-heading">Talent pools</div>
          {candidatePoolLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={isPath(location.pathname, link.to) ? 'active' : ''}
              onClick={closeAll}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-nav-heading">Companies</div>
          {companyLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={isPath(location.pathname, link.to) || (link.extraPath ? isPath(location.pathname, link.extraPath) : false) ? 'active' : ''}
              onClick={closeAll}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-nav-heading">Recruiter workspace</div>
          <Link to="/search-bank" className={isPath(location.pathname, '/search-bank') ? 'active' : ''} onClick={closeAll}>
            Search bank
          </Link>
          <Link to="/contacts" className={isPath(location.pathname, '/contacts') ? 'active' : ''} onClick={closeAll}>
            Contacts
          </Link>
          {showCreditRiskNav && (
            <>
              <div className="mobile-nav-heading">Credit risk track</div>
              {creditRiskNavLinks.map((link) => (
                <Link key={link.to} to={link.to} className={location.pathname === link.to ? 'active' : ''} onClick={closeAll}>
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </div>
      </header>

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}
