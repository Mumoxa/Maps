import React from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

/**
 * CSS-only tooltip: no state, no listeners, and it reveals on keyboard focus
 * as well as pointer hover.
 */
export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className="tooltip" data-tooltip={content} tabIndex={0}>
      {children}
    </span>
  )
}
