import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '../../hooks/useTheme'

/**
 * Single-purpose theme control. Shows the mode you would switch to (the
 * universal convention), and exposes the current mode to assistive tech.
 */
export function ThemeToggle() {
  const { resolved, toggleTheme } = useTheme()
  const nextLabel = resolved === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggleTheme}
      title={nextLabel}
      aria-label={nextLabel}
    >
      {resolved === 'dark' ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
    </button>
  )
}
