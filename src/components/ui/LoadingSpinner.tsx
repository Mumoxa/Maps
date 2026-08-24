interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container">
      <div className={`spinner spinner-${size}`} role="status" aria-label="Loading" />
    </div>
  )
}
