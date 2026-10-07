import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Behaviour every layer (drawer, filter panel, palette) owes the user:
 * focus moves in, Tab stays inside, Escape closes, and focus returns to
 * whatever opened the layer. Body scroll is locked for the duration.
 */
export function useDialogLayer<T extends HTMLElement = HTMLElement>(
  isOpen: boolean,
  onClose: () => void,
): MutableRefObject<T | null> {
  const panelRef = useRef<T | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return undefined

    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const panel = panelRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Land on the first real control, so Escape and Tab are immediately useful.
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE)
    ;(firstFocusable ?? panel)?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      )
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      openerRef.current?.focus()
    }
  }, [isOpen, onClose])

  return panelRef
}
