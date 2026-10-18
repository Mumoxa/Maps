import { useEffect } from 'react'

/**
 * Keeps a private workspace out of search indexes for as long as it is mounted.
 * robots.txt already disallows these paths; this is the belt to that braces,
 * because the pages hold personal contact details.
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    meta.dataset.privateRoute = 'true'
    document.head.appendChild(meta)
    return () => {
      meta.remove()
    }
  }, [])
}
