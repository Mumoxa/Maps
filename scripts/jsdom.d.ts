// jsdom ships no type declarations and @types/jsdom is not a project dependency.
// The audit and smoke scripts only ever reach for `window`, so this shim keeps
// `tsc -b` honest about the rest of the script sources without inventing a
// full DOM surface jsdom does not guarantee.
declare module 'jsdom' {
  export interface JSDOMWindow extends Window {
    [key: string]: unknown
  }
  export class JSDOM {
    constructor(html?: string, options?: Record<string, unknown>)
    window: JSDOMWindow
    serialize(): string
  }
}
