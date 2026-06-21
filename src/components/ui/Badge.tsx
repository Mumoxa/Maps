interface BadgeProps {
  text: string
  variant: 'confidence' | 'segment' | 'priority' | 'verification' | 'duplicate'
  confidence?: 'High' | 'Medium' | 'Low'
  priority?: 'P1' | 'P2' | 'P3'
}

export function Badge({ text, variant, confidence, priority }: BadgeProps) {
  let cls = 'badge'
  if (variant === 'confidence' && confidence) {
    cls += ` badge-${confidence}`
  } else if (variant === 'priority' && priority) {
    cls += ` badge-${priority}`
  } else if (variant === 'verification') {
    cls += ' badge-verification'
  } else if (variant === 'duplicate') {
    cls += ' badge-duplicate'
  } else {
    cls += ' badge-Medium'
  }
  return <span className={cls}>{text}</span>
}
