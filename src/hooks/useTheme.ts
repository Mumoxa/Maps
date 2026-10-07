import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'sa-talent-map:theme'

function readStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // Private browsing / disabled storage: fall back to the system preference.
  }
  return 'system'
}

/** Applies the preference to <html data-theme>, which every token block keys off. */
function applyTheme(preference: ThemePreference) {
  const root = document.documentElement
  if (preference === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', preference)
  }
}

/**
 * One theme decision for the whole app. Resolved value is exposed so the
 * toggle can show the theme the user is actually looking at, not the
 * preference string.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => readStoredTheme())
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false,
  )

  useEffect(() => {
    applyTheme(preference)
  }, [preference])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((next: ThemePreference) => {
    setPreference(next)
    try {
      if (next === 'system') window.localStorage.removeItem(STORAGE_KEY)
      else window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the in-memory preference still applies this session.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }, [preference, systemDark, setTheme])

  const resolved: 'light' | 'dark' = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference

  return { preference, resolved, setTheme, toggleTheme }
}
