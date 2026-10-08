import React from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  onClick?: () => void
  to?: string
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit'
  title?: string
  ariaLabel?: string
}

/**
 * One button primitive. `trail` children (an icon wrapped in .btn-trail) get
 * the nested-circle treatment used on primary CTAs.
 */
export function Button({
  children,
  variant = 'primary',
  onClick,
  to,
  href,
  className = '',
  size = 'md',
  disabled,
  type = 'button',
  title,
  ariaLabel,
}: ButtonProps) {
  const cls = ['btn', `btn-${variant}`, size !== 'md' ? `btn-${size}` : '', className]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={cls} title={title} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={cls} title={title} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button className={cls} onClick={onClick} disabled={disabled} type={type} title={title} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
