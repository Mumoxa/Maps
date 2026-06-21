import React from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  onClick?: () => void
  to?: string
  className?: string
  size?: 'sm' | 'md'
  disabled?: boolean
}

export function Button({ children, variant = 'primary', onClick, to, className = '', size = 'md', disabled }: ButtonProps) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`

  if (to) {
    return <Link to={to} className={cls}>{children}</Link>
  }

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
