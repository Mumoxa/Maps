import { Link } from 'react-router-dom'
import {
  CaretRight,
} from '@phosphor-icons/react'

interface Crumb {
  label: string
  to?: string
}

interface BreadcrumbProps {
  crumbs: Crumb[]
}

export function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i}>
          {i > 0 && <CaretRight size={14} aria-hidden />}
          {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}
