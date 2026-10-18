// Shared plumbing for the independent QA reviewers.
//
// Deliberately thin: it provides a finding harness and a jsdom mount helper and
// nothing else. Every reviewer writes its own assertions against the raw JSON
// data files, the source text or the rendered DOM, so a bug in the app's own
// loaders or ranking cannot make a reviewer agree with itself.

import { JSDOM } from 'jsdom'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type Severity = 'fail' | 'warn'

export interface Finding {
  reviewer: string
  severity: Severity
  check: string
  detail: string
}

export class Reviewer {
  readonly findings: Finding[] = []
  /** Every assertion this reviewer evaluated, passing or not. */
  evaluated = 0

  constructor(readonly name: string, readonly scope: string) {}

  /** Record the outcome of one assertion. */
  check(check: string, pass: boolean, detail: string, severity: Severity = 'fail'): boolean {
    this.evaluated += 1
    if (!pass) this.findings.push({ reviewer: this.name, severity, check, detail })
    return pass
  }

  /** Record a fact the reviewer verified, so the report shows coverage, not just failures. */
  note(check: string, detail: string): void {
    this.findings.push({ reviewer: this.name, severity: 'warn', check: `note:${check}`, detail })
  }

  get fails(): Finding[] {
    return this.findings.filter((finding) => finding.severity === 'fail')
  }
}

/** Read one canonical data file straight off disk, bypassing the app's loaders. */
export function readData<T>(name: string): T {
  return JSON.parse(readFileSync(resolve('markets/organizations', name), 'utf8')) as T
}

/** Read any repo file as text. */
export function readText(path: string): string {
  return readFileSync(resolve(path), 'utf8')
}

export interface MountedPage {
  container: HTMLElement
  document: Document
  window: Window
}

const GLOBAL_KEYS = [
  'window', 'document', 'navigator', 'location', 'history', 'HTMLElement', 'Element', 'Node',
  'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'getComputedStyle', 'requestAnimationFrame',
  'cancelAnimationFrame', 'matchMedia', 'MutationObserver', 'SVGElement', 'DOMParser', 'FormData',
  'localStorage', 'sessionStorage', 'MessageChannel', 'ResizeObserver',
]

let domReady = false

/** Install the jsdom globals once, then mount a page module into a container. */
export async function mountPage(
  modulePath: string,
  exportName: string,
  route: string,
): Promise<MountedPage> {
  if (!domReady) {
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

  const React = (await import('react')).default
  const { createRoot } = await import('react-dom/client')
  const { MemoryRouter } = await import('react-router-dom')
  const { createServer } = await import('vite')

  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
  const loaded = await server.ssrLoadModule(modulePath)
  const Component = loaded[exportName] as React.ComponentType
  await server.close()

  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  root.render(React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(Component)))
  await new Promise((done) => setTimeout(done, 400))

  return { container: host, document, window: window as unknown as Window }
}

/** Click an element and let React settle. */
export async function click(element: Element): Promise<void> {
  element.dispatchEvent(new (globalThis as unknown as { MouseEvent: typeof MouseEvent }).MouseEvent('click', { bubbles: true }))
  await new Promise((done) => setTimeout(done, 200))
}

export function text(element: Element | null): string {
  return (element?.textContent ?? '').trim()
}
