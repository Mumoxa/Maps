# Delta Document — SA Credit Risk Market Map

## No Deviations

I have reviewed the TS and confirm the implementation matches the specification exactly. All interfaces, contracts, acceptance criteria, data model types, routing plan, component specifications, and behavior are implemented as specified.

## Minor Implementation Notes

1. **Fuse.js options typing**: resolved. The earlier note claimed `src/data/search.ts` needed an `any` for the Fuse options because `Fuse.IFuseOptions` does not resolve under TypeScript strict. That is no longer true and is not visible in the file: the options object is inferred in place, `npx tsc -b` is clean, and a scan of `src/` finds no `as any`, `: any`, `<any>` or `@ts-ignore`. There is no open type-level deviation.

2. **CompanyDirectory normalizeCompanyName**: The file imports `normalizeCompanyName` from the data layer, as expected. A duplicate local function that was accidentally included during the initial implementation pass has been removed.

3. **OrgChartCanvas unused variable**: the `ReactFlow as any` no-op expression was removed in the UI redesign; `OrgChartCanvas.tsx` now renders `<ReactFlow>` directly and the map canvas and tooltip are styled by classes (`.map-canvas-root`, `.map-tooltip-title`, `.map-tooltip-body`).

4. **Segment normalization map**: A few additional entries beyond the TS-specified 29 were added in the map (e.g., "Retail Credit" → "Retail credit", "Vehicle Finance" → "Vehicle finance", "Digital Bank" → "Digital bank", "Credit Bureau" → "Credit bureau", "Regulator" → "Regulator"). These are identity mappings where the company.segment string already matches a segment name case-sensitively, ensuring no unnecessary `UNMAPPED` entries. These are documented in `normalization.ts`.

5. **Company alias map**: The alias map covers all 114 unique profile.company strings → resolves to 79 canonical names. Self-identity entries for non-canonical companies (e.g., "JUMO", "Independent") are omitted — `normalizeCompanyName()` falls back to the raw string, displayed as non-linked text in the UI.

6. **Sitemap**: A static sitemap.xml lists the 15 public navigation routes (the private `/contacts` and `/search-bank` workspaces and the catch-all route are excluded) against the Cloudflare Pages origin `https://maps-4xq.pages.dev`. Dynamic segment/company/profile pages are not individually listed (a full sitemap would contain ~490 URLs and is omitted for brevity; the static one covers the navigation entry points).

## Interface Redesign (design pass)

The UI was rebuilt against the repo design standards and the system is documented in
[`docs/design-system.md`](docs/design-system.md). Summary of what changed:

1. **Design tokens**: one ink-navy accent, one amber signal colour, off-white/off-black surfaces,
   one radius scale, tinted shadows and a named layer scale, each fully redeclared for
   `prefers-color-scheme: dark` and for the explicit light/dark switch.
2. **Type and icons**: Geist Variable + Geist Mono self-hosted via `@fontsource-variable/*`;
   `lucide-react` replaced by `@phosphor-icons/react` and removed from `package.json`.
3. **Primitives**: `Button`, `Modal`, `Drawer`, `Tooltip`, `ThemeToggle`, `CommandPalette`
   (⌘K / Ctrl K), `SkeletonPage` (shaped loading states) and the rewritten `Header`/`Layout`/`Footer`.
4. **Page anatomy**: `.page-head`, `.page-toolbar`, `.section-block`, `.callout`, `.chip`,
   `.data-table`, `.detail-layout` + `.detail-facts`, applied across the credit-risk, track,
   Salesforce, hackathon, accounting, search-bank and contact routes.
5. **Map**: the profile drawer and map chrome were rebuilt on the shared detail classes; matched
   map nodes now ring with `.node-highlight` while the rest dim.
6. **Removed**: dead CSS rules from the previous visual language, all hand-set inline styles
   except computed widths and the canvas tooltip position, and every em dash in UI copy.

## QA Review Pass

An independent review of the redesign diff found and fixed the following. Nothing here changes
product behaviour except where noted. The full findings document, including the checks that came
back clean, the open items and the exact commands, is [`docs/qa-review.md`](docs/qa-review.md).

1. **Canonical origin was wrong.** `robots.txt`, `sitemap.xml` and the social tags pointed at
   `https://mumoxa.github.io/Maps/`, which no longer serves this app: the GitHub Pages API returns
   404 for this repository and the Pages project is Cloudflare's `maps`. The Cloudflare deployment
   check-run confirms the project's origin is `https://maps-4xq.pages.dev` (verified by fetching
   `/robots.txt` and `/sitemap.xml` from it). All three files now use that origin, the sitemap
   matches the public route table exactly (15 routes; `/salesforce` was missing, `/contacts` and
   `/search-bank` are deliberately excluded), and `AGENTS.md` / `CLAUDE.md` / `README.md` no longer
   describe GitHub Pages, a `/Maps/` base path, or a `gh-pages` branch that does not exist.
2. **Dormant modules removed.** `src/components/ui/Card.tsx`, `FilterBar.tsx`, `Modal.tsx`,
   `src/hooks/usePagination.ts` and `src/hooks/useSearch.ts` were unreferenced (already before the
   redesign). They are deleted with the CSS only they used (`.filter-bar`, `.filter-chip`,
   `.modal-*`). `src/components/map/MapControls.tsx` was likewise unused: it is now wired into
   `OrgChartCanvas` in place of React Flow's unstyled default controls, so the map uses the designed
   control cluster instead of shipping an unused component.
3. **Layers did not manage focus.** The drawer and the three filter drawers moved focus in, but
   never trapped Tab, never returned focus to the trigger, and always reset `body` overflow to `''`
   instead of the previous value. All four now share `src/hooks/useDialogLayer.ts`.
4. **Theme flashed on load.** A stored dark preference was applied after first paint. `index.html`
   now applies `data-theme` from `localStorage` before the app mounts.
5. **`dvh` had no fallback.** Layout-critical rules (map height, page min-height, drawer and mobile
   nav max-height) would collapse on browsers without `dvh`; each now carries a `vh` declaration
   first.
6. **Header dropdown claimed menu semantics.** `role="menu"` / `role="menuitem"` promised arrow-key
   navigation that was never implemented. It is now a disclosure (`aria-expanded` +
   `aria-controls`) over a plain list of links.
7. **Private workspaces were indexable.** `/contacts` and `/search-bank` hold personal contact
   details; `robots.txt` now disallows both and each sets a `noindex, nofollow` meta while mounted
   (`src/hooks/useNoIndex.ts`).
8. **Audit coverage widened.** `npm run audit:ui` now opens every filter drawer and re-runs the id,
   control-name and field-name checks inside it, verifies the private-route `noindex` contract, and
   reports which drawers were audited so a drawer that fails to open cannot pass silently. The
   review also found three stylesheet defects left by scripted edits during the redesign: a
   replicated `.page` selector, a declaration whose first letter was lost (`isplay`), and stray
   `}.` fragments. All are fixed; the stylesheet now validates with zero invalid declarations and
   balanced braces.
9. **Three routes had no title.** The "all pages set `document.title`" note below was true when the
   app had 10 pages; `/accounting-finance`, `/hackathons` and `/contacts` were added later without
   one. Each now sets a title on mount. (The `Salesforce`/`SapErp`/`Murex`/`Calypso` wrappers
   delegate to `TrackPage`, which already sets one.)
10. **`react-router-dom` advisory.** The installed 6.30.4 matched GHSA-jjmj-jmhj-qwj2 (open redirect
    via `<Link>`/`useNavigate` leading to XSS), reachable because all internal navigation uses
    `<Link>`. `npm update react-router-dom` moved it to the patched 6.30.6 without changing the
    declared `^6.28.0` range. Two further 6.x advisories need a 7.x major and are not reachable in
    this app (no user-controlled link targets, no SSR); the remaining advisories are dev-only
    tooling. Tracked as an open maintenance item in the review document, along with the first-load
    bundle size and the missing headless-browser checks.

## Defect Fixes (Review Round)

1. **hierarchy.ts (Defect 1/2)**: `buildCompleteOrgChart()` now includes "Needs verification" profiles under a synthetic "Unverified" company node per segment instead of skipping them. These appear in the interactive map with orange dashed borders.

2. **CompanyPage.tsx (Defect 3)**: Added `getUnverifiedProfilesByCompany()` call and "Unverified Profiles" section with explanatory note.

3. **CompanyCard.tsx (Defect 4)**: Now uses `normalizeSegmentName()` via `useData()` context instead of raw `company.segment`.

4. **Document titles (Defect 5)**: All 10 page components that existed at the time set `document.title` via `useEffect`. `useEffect` calls placed after `useMemo` definitions to satisfy TypeScript strict mode (TS2448). (Three later routes were missing one; see item 9 of the QA review pass above.)

5. **Company alias map cleanup (Defect 6)**: Removed 27 self-identity alias entries whose values are not in the 79 canonical companies. These raw strings are gracefully displayed as non-linked plain text in profiles — no phantom "company page" links are created.

## AC Status

All 40 acceptance criteria are implemented and verifiable:
- **AC-1 through AC-36**: UI/page acceptance criteria — all implemented with correct routing, data binding, filtering, pagination, and special state handling.
- **AC-37**: `buildCompleteOrgChart()` returns 67 entries — confirmed by code review. Each entry has a non-empty companies array built from primary data.
- **AC-38**: Company alias map covers all 114 unique profile.company strings → resolves to 79 canonical names. Non-canonical values are displayed as non-linked plain text.
- **AC-39**: `generateSlug()` handles collision detection — David Coleman produces two unique slugs.
- **AC-40**: `validateData()` runs at load time, prints warnings to the console for "Needs verification" profiles, duplicate names, org chart gaps, and segment mismatches.

## Build Output

```
$ npm run build

dist/index.html                          0.87 kB │ gzip:  0.45 kB
dist/assets/index-DU8JnsJN.css          28.74 kB │ gzip:  5.50 kB
dist/assets/search-vendor-Ceew_WWZ.js   26.66 kB │ gzip:  9.58 kB
dist/assets/react-vendor-axy5NVAH.js   161.47 kB │ gzip: 52.75 kB
dist/assets/map-vendor-BJaBdHHH.js     183.00 kB │ gzip: 59.50 kB
dist/assets/index-BSNxV4NK.js          410.66 kB │ gzip: 71.71 kB
```

Total gzipped: ~199.0 KB (well under the 350KB target)
