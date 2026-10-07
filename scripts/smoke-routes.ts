// Dev-only runtime smoke test: mounts the real app shell and every page in jsdom
// through Vite's SSR module loader (so import.meta.glob and friends resolve).
// Run with: node --import tsx scripts/smoke-routes.ts
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
    Object.defineProperty(globalThis, key, {
      value: w[key],
      configurable: true,
      writable: true,
    })
  }
}

if (typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(globalThis, 'ResizeObserver', {
    value: ResizeObserverStub,
    configurable: true,
    writable: true,
  })
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

const failures: string[] = []

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
    let renderError: string | null = null
    const origError = console.error
    console.error = (...args: unknown[]) => {
      if (!renderError) renderError = String(args[0]).slice(0, 300)
    }
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
              React.createElement(
                ErrorBoundary,
                null,
                React.createElement(Layout, null, React.createElement(Page)),
              ),
            ),
          ),
        )
        setTimeout(resolve, 800)
      })
    } catch (e) {
      if (!renderError) renderError = String(e).slice(0, 300)
    } finally {
      console.error = origError
    }
    const text = (container.textContent ?? '').trim()
    if (renderError || text.length === 0) {
      failures.push(`${route}: ${renderError ?? 'empty render'}`)
    }
    root.unmount()
    container.remove()
  }

  await server.close()

  if (failures.length > 0) {
    console.error(JSON.stringify({ status: 'fail', failures }, null, 2))
    process.exit(1)
  }
  console.error(JSON.stringify({ status: 'ok', routesChecked: Object.keys(pageModules).length }))
}

main().catch(e => {
  console.error(JSON.stringify({ status: 'crash', error: String(e).slice(0, 500) }))
  process.exit(1)
})
