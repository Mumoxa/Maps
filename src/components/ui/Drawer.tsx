import React from 'react'
import { X } from '@phosphor-icons/react'
import { useDialogLayer } from '../../hooks/useDialogLayer'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

/**
 * Detail drawer: slides in from the trailing edge, keeps focus inside while it
 * is open, closes on Escape or the close control, and hands focus back to
 * whatever opened it.
 */
export function Drawer({ isOpen, onClose, title, subtitle, children }: DrawerProps) {
  const panelRef = useDialogLayer<HTMLElement>(isOpen, onClose)

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
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
