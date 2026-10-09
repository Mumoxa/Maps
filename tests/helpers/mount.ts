// jsdom mount helper for route-level tests.
//
// Deliberately separate from `scripts/qa/lib.ts`: the QA reviewers must stay
// independent of the app, while these tests want to render the real pages with
// the real router. The mounting mechanics are the same, so a page that renders
// here renders in the QA harness.

import { JSDOM } from 'jsdom'

const GLOBAL_KEYS = [
  'window', 'document', 'navigator', 'location', 'history', 'HTMLElement', 'Element', 'Node',
  'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'getComputedStyle', 'requestAnimationFrame',
  'cancelAnimationFrame', 'matchMedia', 'MutationObserver', 'SVGElement', 'DOMParser', 'FormData',
  'localStorage', 'sessionStorage', 'MessageChannel', 'ResizeObserver',
]

let domReady = false

function installDom(): void {
  if (domReady) return
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  })
  const win = dom.window as unknown as Record<string, unknown>
  for (const key of GLOBAL_KEYS) {
    if (!(key in globalThis)) {
      Object.defineProperty(globalThis, key, { value: win[key], configurable: true, writable: true })
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
  domReady = true
}

export interface MountedPage {
  container: HTMLElement
  /** Full rendered text, lower-cased, for assertions about what the page says. */
  lowerText: string
  html: string
}

export interface MountOptions {
  /**
   * Route pattern to mount the component under, when the page reads URL
   * parameters. Without it `useParams()` returns nothing, which would hide a
   * routing bug rather than prove the route works.
   */
  pattern?: string
  /** Wrap in the app's DataProvider, for pages that read the loaded dataset. */
  withData?: boolean
}

/**
 * Render a page component with the real router at `route`.
 *
 * `route` includes the query string, which is how these tests prove that a URL
 * with no parameters selects no company and activates no brief.
 */
export async function mountPage(
  modulePath: string,
  exportName: string,
  route = '/',
  options: MountOptions = {},
): Promise<MountedPage> {
  installDom()
  const React = (await import('react')).default
  const { createRoot } = await import('react-dom/client')
  const { MemoryRouter, Route, Routes } = await import('react-router-dom')
  const { createServer } = await import('vite')

  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
  const loaded = await server.ssrLoadModule(modulePath)
  const Component = loaded[exportName] as React.ComponentType

  const element = options.pattern
    ? React.createElement(Routes, null,
      React.createElement(Route, { path: options.pattern, element: React.createElement(Component) }))
    : React.createElement(Component)

  let tree: React.ReactElement = React.createElement(MemoryRouter, { initialEntries: [route] }, element)
  if (options.withData) {
    // Loaded through the same Vite server as the page: the data loader uses
    // import.meta.glob, which only exists inside Vite's module graph.
    const { DataProvider } = await server.ssrLoadModule('/src/context/DataContext.tsx')
    tree = React.createElement(DataProvider, null, tree)
  }

  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  root.render(tree)
  await new Promise((done) => setTimeout(done, 600))
  await server.close()

  const container = host
  return {
    container,
    lowerText: (container.textContent ?? '').toLowerCase(),
    html: container.innerHTML,
  }
}

export function textOf(element: Element | null): string {
  return (element?.textContent ?? '').trim()
}

export function allText(container: HTMLElement, selector: string): string[] {
  return Array.from(container.querySelectorAll(selector)).map((element) => textOf(element))
}
