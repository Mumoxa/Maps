import { useEffect } from 'react'
import { Button } from '../components/ui/Button'

export function NotFound() {
  useEffect(() => { document.title = 'Page Not Found'; }, [])
  return (
    <div className="page">
      <div className="container not-found">
        <h1>404</h1>
        <h2 className="mb-2">Page Not Found</h2>
        <p className="text-secondary mb-3">The page you're looking for doesn't exist.</p>
        <Button to="/">Go to Home</Button>
      </div>
    </div>
  )
}
