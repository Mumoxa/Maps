import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; to: string }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <Button to={action.to}>{action.label}</Button>}
    </div>
  )
}
