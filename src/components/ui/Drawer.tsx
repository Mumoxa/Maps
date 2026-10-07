import React, { useEffect, useRef } from 'react'
import { X } from '@phosphor-icons/react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

/**
 * Detail drawer: slides in from the trailing edge, traps nothing it should not,
 * and always offers Escape plus a visible close control.
 */
export function Drawer({ isOpen, onClose, title, subtitle, children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return undefined
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside
        className="drawer-content"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panelRef}
      >
        <div className="drawer-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="text-secondary text-sm">{subtitle}</p>}
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close panel">
            <X size={16} aria-hidden />
          </button>
        </div>
        {children}
      </aside>
    </>
  )
}
