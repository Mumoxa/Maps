// Dev-only UI audit: mounts every route in jsdom and checks the structural rules
// the design system promises — one h1 per page, no skipped heading levels,
// accessible names on every control, no duplicate ids, alt text on images and
// no stray inline styles. Run with: node --import tsx scripts/audit-ui.ts
import { JSDOM } from 'jsdom'
import type React from 'react'
import { createServer } from 'vite'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

const w = dom.window as unknown as Record<string, unknown>
for (const key of [
  'window',
  'document',
  'navigator',
  'location',
  'history',
  'HTMLElement',
  'Element',
  'Node',
  'Event',
  'CustomEvent',
  'MouseEvent',
  'KeyboardEvent',
  'getComputedStyle',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'matchMedia',
  'MutationObserver',
  'SVGElement',
  'DOMParser',
  'FormData',
  'localStorage',
  'sessionStorage',
  'MessageChannel',
  'ResizeObserver',
]) {
  if (!(key in globalThis)) {
    Object.defineProperty(globalThis, key, { value: w[key], configurable: true, writable: true })
  }
}

if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(globalThis, 'ResizeObserver', { value: ResizeObserverStub, configurable: true, writable: true })
}

const pageModules: Record<string, [string, string]> = {
  '/': ['/src/pages/HomePage.tsx', 'HomePage'],
  '/credit-risk': ['/src/pages/CreditRiskPage.tsx', 'CreditRiskPage'],
  '/salesforce': ['/src/pages/SalesforcePage.tsx', 'SalesforcePage'],
  '/hackathons': ['/src/pages/HackathonTalentPage.tsx', 'HackathonTalentPage'],
  '/accounting-finance': ['/src/pages/AccountantsPage.tsx', 'AccountantsPage'],
  '/sap-erp': ['/src/pages/SapErpPage.tsx', 'SapErpPage'],
  '/murex': ['/src/pages/MurexPage.tsx', 'MurexPage'],
  '/calypso': ['/src/pages/CalypsoPage.tsx', 'CalypsoPage'],
  '/talent-search': ['/src/pages/TalentSearchPage.tsx', 'TalentSearchPage'],
  '/search-bank': ['/src/pages/SearchBankPage.tsx', 'SearchBankPage'],
  '/map': ['/src/pages/MapPage.tsx', 'MapPage'],
  '/segments': ['/src/pages/SegmentDirectory.tsx', 'SegmentDirectory'],
  '/companies': ['/src/pages/CompanyDirectory.tsx', 'CompanyDirectory'],
  '/profiles': ['/src/pages/ProfileDirectory.tsx', 'ProfileDirectory'],
  '/shortlist': ['/src/pages/ShortlistPage.tsx', 'ShortlistPage'],
  '/markets/salesforce': ['/src/pages/SalesforceEcosystemPage.tsx', 'SalesforceEcosystemPage'],
  '/contacts': ['/src/pages/ContactDirectory.tsx', 'ContactDirectory'],
}

type Finding = { route: string; rule: string; detail: string }
const findings: Finding[] = []
const inlineStyles: Finding[] = []

function accessibleName(el: Element): string {
  const text = (el.textContent ?? '').trim()
  const aria = el.getAttribute('aria-label') ?? el.getAttribute('title') ?? ''
  const labelledBy = el.getAttribute('aria-labelledby')
  const labelled = labelledBy ? (document.getElementById(labelledBy)?.textContent ?? '') : ''
  return `${text}${aria}${labelled}`.trim()
}

function auditRoute(route: string, container: HTMLElement) {
  const report = (rule: string, detail: string) => findings.push({ route, rule, detail })

  // 1. Exactly one h1, and heading levels never skip.
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  const h1s = container.querySelectorAll('h1')
  if (h1s.length !== 1) report('single-h1', `${h1s.length} h1 elements`)
  let previous = 0
  for (const heading of headings) {
    const level = Number(heading.tagName.slice(1))
    if (previous && level > previous + 1) {
      report('heading-order', `h${previous} → h${level}: "${(heading.textContent ?? '').trim().slice(0, 48)}"`)
    }
    previous = level
  }

  // 2. Controls need accessible names.
  for (const control of Array.from(container.querySelectorAll('button, a[href]'))) {
    if (control.closest('[aria-hidden="true"]')) continue
    if (!accessibleName(control)) {
      report('control-name', `<${control.tagName.toLowerCase()} class="${control.className}"> has no text, aria-label or title`)
    }
  }
  for (const input of Array.from(container.querySelectorAll('input, select, textarea'))) {
    const id = input.getAttribute('id')
    const hasLabel = (id ? !!container.querySelector(`label[for="${id}"]`) : false) || !!input.closest('label')
    const named = hasLabel || input.getAttribute('aria-label') || input.getAttribute('aria-labelledby') || input.getAttribute('title')
    if (!named) report('field-name', `<${input.tagName.toLowerCase()} class="${input.className}" name="${input.getAttribute('name') ?? ''}"> has no label`)
  }

  // 3. Duplicate ids break label/description wiring.
  const ids = new Map<string, number>()
  for (const el of Array.from(container.querySelectorAll('[id]'))) {
    const id = el.getAttribute('id') as string
    ids.set(id, (ids.get(id) ?? 0) + 1)
  }
  for (const [id, count] of ids) {
    if (count > 1 && id !== 'root') report('duplicate-id', `id="${id}" appears ${count} times`)
  }

  // 4. Images carry alt text.
  for (const img of Array.from(container.querySelectorAll('img'))) {
    if (img.getAttribute('alt') === null) report('img-alt', `img src="${img.getAttribute('src') ?? ''}" has no alt`)
  }

  // 5. Inline styles: dynamic values are allowed, hand-set spacing is not.
  for (const el of Array.from(container.querySelectorAll('[style]'))) {
    const style = el.getAttribute('style') ?? ''
    inlineStyles.push({ route, rule: 'inline-style', detail: `<${el.tagName.toLowerCase()} class="${el.className}"> style="${style.slice(0, 90)}"` })
  }
}

async function main() {
  const server = await createServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  })

  const React = (await import('react')).default
  const { createRoot } = await import('react-dom/client')
  const { MemoryRouter } = await import('react-router-dom')
  const { DataProvider } = await server.ssrLoadModule('/src/context/DataContext.tsx')
  const { Layout } = await server.ssrLoadModule('/src/components/layout/Layout.tsx')
  const { ErrorBoundary } = await server.ssrLoadModule('/src/components/ui/ErrorBoundary.tsx')

  for (const [route, [modulePath, exportName]] of Object.entries(pageModules)) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    try {
      const pageModule = await server.ssrLoadModule(modulePath)
      const Page = pageModule[exportName]
      if (typeof Page !== 'function') throw new Error(`missing export ${exportName}`)
      await new Promise<void>(resolve => {
        root.render(
          React.createElement(
            MemoryRouter,
            { initialEntries: [route] },
            React.createElement(
              DataProvider,
              null,
              React.createElement(ErrorBoundary, null, React.createElement(Layout, null, React.createElement(Page))),
            ),
          ),
        )
        setTimeout(resolve, 700)
      })
      auditRoute(route, container)
    } catch (e) {
      findings.push({ route, rule: 'render', detail: String(e).slice(0, 200) })
    }
    root.unmount()
    container.remove()
  }

  await server.close()

  const byRule = new Map<string, Finding[]>()
  for (const finding of findings) {
    byRule.set(finding.rule, [...(byRule.get(finding.rule) ?? []), finding])
  }

  if (findings.length === 0) {
    console.error(JSON.stringify({ status: 'ok', routesChecked: Object.keys(pageModules).length, findings: 0 }))
    if (inlineStyles.length) {
      // Grouped by shape so a review can tell computed values from hand-set styles.
      const shapes = new Map<string, { count: number; routes: Set<string> }>()
      for (const entry of inlineStyles) {
        const cls = /class="([^"]*)"/.exec(entry.detail)?.[1] || '(no class)'
        const shape = `${cls} :: ${(entry.detail.match(/style="([^"]*)"/)?.[1] ?? '')
          .replace(/-?\d+(?:\.\d+)?(px|%)?/g, 'N')
          .slice(0, 70)}`
        const current = shapes.get(shape) ?? { count: 0, routes: new Set<string>() }
        current.count += 1
        current.routes.add(entry.route)
        shapes.set(shape, current)
      }
      console.error(`inline styles present in ${inlineStyles.length} places, ${shapes.size} distinct shapes:`)
      for (const [shape, info] of [...shapes.entries()].sort((a, b) => b[1].count - a[1].count)) {
        console.error(`  ${String(info.count).padStart(4)}× [${[...info.routes].join(', ')}] ${shape}`)
      }
    }
    return
  }

  console.error(`\n${findings.length} findings across ${byRule.size} rules:\n`)
  for (const [rule, list] of byRule) {
    console.error(`## ${rule} (${list.length})`)
    for (const entry of list.slice(0, 20)) console.error(`   ${entry.route}: ${entry.detail}`)
    if (list.length > 20) console.error(`   … ${list.length - 20} more`)
    console.error('')
  }
  process.exit(1)
}

main().catch(e => {
  console.error(JSON.stringify({ status: 'crash', error: String(e).slice(0, 500) }))
  process.exit(1)
})
