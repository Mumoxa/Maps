interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

/** Inline busy indicator, for actions rather than whole pages. */
export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container">
      <div className={`spinner spinner-${size}`} role="status" aria-label="Loading" />
    </div>
  )
}

interface SkeletonPageProps {
  /** grid = card directory, list = dense rows, detail = record + aside, map = canvas */
  variant?: 'grid' | 'list' | 'detail' | 'map'
  cards?: number
  label?: string
}

/**
 * Page-level placeholder shaped like the content that is about to arrive, so
 * the layout does not jump when data resolves.
 */
export function SkeletonPage({ variant = 'grid', cards = 6, label = 'Loading content' }: SkeletonPageProps) {
  const cardCount = Math.max(1, cards)

  return (
    <div className="page">
      <div className="container skeleton-page" role="status" aria-live="polite" aria-label={label}>
        <div className="skeleton-head">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-row" />
        </div>
        <div className="skeleton skeleton-toolbar" />

        {variant === 'grid' && (
          <div className="skeleton-grid">
            {Array.from({ length: cardCount }, (_, index) => (
              <div className="skeleton skeleton-card" key={index} />
            ))}
          </div>
        )}

        {variant === 'list' && (
          <div className="rail">
            {Array.from({ length: cardCount }, (_, index) => (
              <div className="skeleton-list-item" key={index}>
                <div className="skeleton skeleton-line skeleton-line-lead" />
                <div className="skeleton skeleton-line skeleton-line-tail" />
              </div>
            ))}
          </div>
        )}

        {variant === 'detail' && (
          <div className="detail-layout">
            <div className="skeleton skeleton-panel" />
            <div className="skeleton skeleton-panel-sm" />
          </div>
        )}

        {variant === 'map' && (
          <div className="skeleton skeleton-panel-map" />
        )}
      </div>
    </div>
  )
}
