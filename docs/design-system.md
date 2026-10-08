# Interface and design system

The interface is one system across every route: one accent, one neutral family, one radius
scale, one motion vocabulary, and one documented set of primitives. This file is the reference
for anyone adding a surface. If markup needs a style that is not here, add the style to
`src/styles/globals.css` as a class and document it here in the same change.

## Where things live

| Concern | File |
|---|---|
| All styles (tokens, primitives, page blocks, responsive, motion) | `src/styles/globals.css` |
| Shared primitives (`Button`, `Drawer`, `Tooltip`, `Badge`, `SearchBar`, facets, `Pagination`, `SkeletonPage`) | `src/components/ui/` |
| App chrome (header, subnav, mobile nav, ⌘K palette, footer) | `src/components/layout/` |
| Map interface (canvas, controls, legend, filter, search, profile drawer) | `src/components/map/` + `MapPage.tsx` |
| Layer behaviour (focus in, focus trap, Escape, focus restore, scroll lock) | `src/hooks/useDialogLayer.ts` |
| Theme preference (`data-theme` on `<html>`) | `src/hooks/useTheme.ts`, pre-paint script in `index.html`, `src/components/ui/ThemeToggle.tsx` |
| Private-route indexing contract | `src/hooks/useNoIndex.ts`, `public/robots.txt` |
| Fonts | `src/main.tsx` imports `@fontsource-variable/geist/wght.css` and `geist-mono/wght.css` |

## Tokens

Everything visual comes from a token in the `:root` block; colour tokens are redeclared in full
for `prefers-color-scheme: dark` and for the explicit `[data-theme='dark']` / `[data-theme='light']`
switch, so light and dark are never partially themed.

- **Accent** — one: ink navy `--color-primary` (`#1b3a8f`, dark `#8aa7f0`).
- **Signal** — one: amber `--color-accent` (`#a8600a`, dark `#e0a94c`), reserved for
  attention-worthy state (P1, warnings, "needs verification"). Not decoration.
- **Track identity** — each market keeps a muted tone from its own token pair
  (`--color-salesforce-700`, `--color-sap`, `--color-murex-700`, `--color-calypso-700`,
  `--color-hackathon-700`, `--color-accounting-700`) used only as data encoding on track cards,
  badges and map nodes. Never as chrome.
- **Surfaces** — off-white paper (`--color-surface #fdfdFB`) and off-black (`#0b0e15`), never
  pure `#fff` or `#000`, so elevation has somewhere to go.
- **Elevation** — five tinted shadows (`--shadow-xs` … `--shadow-xl`) using
  `rgba(16, 23, 37, …)`, the same hue as the text ink.
- **Radius** — one scale, applied by role: `--radius-micro 4` (chips/keys), `--radius-sm 8`
  (controls), `--radius 12` (inputs/small cards), `--radius-lg 16` (panels/cards),
  `--radius-xl 22` (feature shells), `--radius-full` (pills/toggles).
- **Layout** — `--max-width 1320px`, `--max-width-wide 1560px`, `--header-height 68px`,
  `--subnav-height 44px`.
- **Motion** — `--transition-fast/base/slow` on non-linear easings
  (`cubic-bezier(0.16, 1, 0.3, 1)`, `cubic-bezier(0.32, 0.72, 0, 1)`). Keyframes animate only
  `transform` and `opacity`.
- **Layers** — `--z-sticky 30`, `--z-header 50`, `--z-dropdown 60`, `--z-overlay 80`,
  `--z-modal 90`, `--z-toast 100`. No ad-hoc z-index values.

## Type

Geist Variable for interface copy, Geist Mono for every number, code label and data table cell
that is compared down a column (`font-variant-numeric: tabular-nums`). Headings are set in one
ramp: `h1` at `clamp()` scale, then a strict down-shift. Numeric emphasis never uses a different
family than the surrounding data.

## Page anatomy

Every content route composes the same blocks:

```html
<main class="page">
  <div class="container">
    <div class="page-head">        <!-- h1 + one-line description + .page-head-aside (CTA / stats) -->
      <div>…</div>
      <div class="page-head-aside">…</div>
      <span class="page-head-meta">…</span>
    </div>
    <div class="page-toolbar">     <!-- search + .select-group of .filter-select controls -->
      …
    </div>
    <section class="section-block">
      <h2>…</h2>
      …
    </section>
  </div>
</main>
```

- Detail routes (`CompanyPage`, `SegmentPage`, `ProfilePage`) use `.detail-layout` (main column
  plus `.detail-aside`) and render key/value records with `.detail-facts` / `.detail-fact`.
- Faceted routes (`TalentSearchPage`, `AccountantsPage`, `SearchBankPage`, `ContactDirectory`)
  use `.facet-layout` with a `.facet-sidebar` and a `.facet-drawer` that replaces it below
  1024px (trigger: `.facet-filter-trigger`, actions: `.facet-drawer-apply`).
- Tables use `.data-table-wrap` > `.data-table`, with `.cell-strong` for the identifying column.
- Notices use `.callout` / `.callout-warning`; tags use `.chip`.
- Loading uses `SkeletonPage` shaped like the layout being loaded; never a bare spinner for a
  full page.

### Company intelligence surfaces

The Company Association Explorer and its supporting pages (`/company-associations`,
`/organizations`, `/industries`, `/capabilities`, `/qualifications`, `/target-pools`,
`/search-bank/assignments`, `/intelligence/import`) use two class families, all defined in the
"Company intelligence" block at the end of `globals.css`:

- `ca-*` (explorer): `.container-wide` (uses `--max-width-wide`), `.ca-controls` with `.ca-field` /
  `.ca-label` / `.ca-input` / `.ca-select` (`.ca-select-sm`, `.ca-input-sm`) / `.ca-textarea`
  (`.ca-textarea-tall` for pasted data), the combobox `.ca-selector*`, `.ca-examples`,
  `.ca-requirement-box` with `.ca-requirement-row` and `.ca-chip-list` / `.ca-chip-remove`, the view
  tabs `.ca-view-switch` / `.ca-tab`, `.ca-bulk` (multi-select actions), `.ca-status` (live result
  line), `.ca-layout` (filters | main | `.has-inspector`), `.ca-filters` / `.ca-filter-*`, the graph
  `.ca-graph` / `.ca-node-*` / `.ca-fit-*` / `.ca-edge-*`, pockets `.ca-pockets` / `.ca-pocket*`
  (`.ca-pocket-title`), the table helpers `.ca-sort` / `.ca-num` / `.ca-check-*`, `.ca-inspector*`,
  forms `.ca-form` / `.ca-form-grid` / `.ca-form-wide`, `.ca-compare*` / `.ca-cell-*`, and the
  inline action `.ca-link-button`.
- `intel-*` (shared facts): `.intel-tier` / `.intel-tier-<tier>` (TierBadge), `.intel-conf-<confidence>`,
  `.intel-origin`, `.intel-evidence`, `.intel-stale`, `.intel-private-note` (PrivateNotice: says
  where private data is stored), `.intel-stats` / `.intel-stat`, `.intel-issues`, `.intel-columns`,
  `.intel-tree*`, `.intel-org-list`, `.intel-people`, `.intel-target*` (assignment targets) and
  `.intel-import-<status>` (new, duplicate, conflict, rejected) for import previews.
- Destructive actions use the existing `.btn-danger`.

Tiers and confidence are never colour-only: every badge carries its text label, and hypotheses
and unknowns use dashed borders so they read differently from sourced facts in greyscale.
Below 1180px the inspector drops under the results, below 1024px the filter panel stacks above
them, below 768px form grids collapse to one column and the graph legend hides, and below 480px
pockets are single-column.

## Interaction rules

- Keyboard first: every control is a real `button`/`a`/`input`, focus is visible through the
  single global `:focus-visible` ring, and the ring follows each element's own radius.
- Escape closes the innermost layer (command palette, drawer, mobile nav, dropdown).
- Every layer is built on `useDialogLayer`: focus moves to the first control inside, Tab cycles
  within the panel, body scroll is locked for the duration, and focus returns to whatever opened it.
- The mobile nav and the talent-pool dropdown are disclosures (`aria-expanded` + `aria-controls`),
  not ARIA menus, so they carry no arrow-key contract they do not implement.
- `/contacts`, `/search-bank` (including `/search-bank/assignments`), `/target-pools` and
  `/intelligence/import` are private workspaces: both set a `noindex, nofollow` meta while
  mounted, `robots.txt` disallows them, and neither appears in `sitemap.xml`. The UI audit fails the
  build if that contract breaks.
- ⌘K / Ctrl K and `/` open the command palette (pages, tracks, candidates, companies, segments);
  the shortcut is suppressed while typing in a field.
- Motion respects `prefers-reduced-motion`; glass surfaces fall back to solid fills under
  `prefers-reduced-transparency`.
- Copy contains no em dashes; separators are middots or colons.
- Every route sets `document.title` on mount (prefixed `SA Talent Map | ` for the app's own pages),
  so the browser tab never falls back to the static title in `index.html`.

## Verification

```bash
npx tsc -b              # strict types
npm run build           # data validation + tsc + production build
npm test                # data/behaviour tests (incl. intelligence acceptance tests)
npm run validate:intel  # taxonomy, research evidence, generated registry, public-bundle guard
npm run smoke:routes    # every route renders in jsdom
npm run audit:ui        # structural audit: one h1, heading order, control names,
                        # duplicate ids, image alt, stray inline styles, the per-route
                        # tab title, the private-route noindex contract, and the filter
                        # drawers (it opens each one and re-checks inside)
```

`npm run audit:ui` is the design-system gate. It must report `findings: 0`, and its summary lists
which filter drawers were opened (`filterDrawersAudited`), which private routes honoured noindex
(`privateRoutesNoIndexed`) and the title each route set (`routeTitles`), so a drawer that fails to
open, a private route that stops opting out or a route that forgets its title is visible rather
than silently skipped. The inline-style section it prints is grouped by shape and should only
ever contain computed values (bar widths, the map tooltip position) and vendored `@xyflow/react`
node geometry: anything else is a hand-set style that belongs in a class.

The canonical origin for `robots.txt`, `sitemap.xml` and the social tags in `index.html` is
`https://maps-4xq.pages.dev` (Cloudflare Pages project `maps`). GitHub Pages is not enabled for this
repository. If a custom domain is attached, change all three files together.
