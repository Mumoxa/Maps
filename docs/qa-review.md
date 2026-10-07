# Independent QA Review

Scope: the whole application as it stands on branch `arena/050c0e35-maps` (redesign commit `52c5d15`
plus the origin and remediation work described below). The review was written from the code itself:
every claim was re-derived by reading files and running commands in this repository. The interface
redesign summary was **not** used as evidence, so findings here can contradict it.

Reviewed by: agent QA pass, 2026-10-08. Severity uses the usual scale — **High** (users or search
engines see something wrong, or the build is at risk), **Medium** (a real defect with a limited
blast radius), **Low** (hygiene, documentation, or single-route polish), **Info** (no action
needed, recorded for completeness).

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| QA-01 | High | Deployment metadata advertised a dead origin | Fixed |
| QA-02 | High | Stylesheet corrupted by scripted edits | Fixed |
| QA-03 | Medium | Dialog layers leaked focus and scroll state | Fixed |
| QA-04 | Medium | Theme flashed on first paint | Fixed |
| QA-05 | Medium | Private contact workspaces were indexable | Fixed |
| QA-06 | Medium | `dvh` layout values had no fallback | Fixed |
| QA-07 | Medium | Header dropdown promised menu semantics it did not implement | Fixed |
| QA-08 | Medium | `react-router-dom` carried a reachable XSS advisory | Fixed |
| QA-09 | Low | Dead modules and one unused map component | Fixed |
| QA-10 | Low | Three routes never set `document.title` | Fixed |
| QA-11 | Low | UI audit could not see drawers or the private-route contract | Fixed |
| QA-12 | Low | `DELTA.md` documented a `Fuse` `any` that does not exist | Fixed |
| QA-13 | Medium | First-load JavaScript ships the whole dataset | Open |
| QA-14 | Low | Ten dependency advisories remain | Partly open |
| QA-15 | Low | A data script hard-codes an absolute path | Open |
| QA-16 | Info | No headless browser, so no pixel-level verification | Open |
| QA-17 | Info | Some page bodies still use pre-redesign markup | Open |

## Method

Commands run, in this order, on a clean checkout of the branch:

```
git status && git diff --stat          # scope of the uncommitted work
git grep -n "mumoxa.github.io"         # stale-origin sweep across tracked files
npm ls --depth=1 && npm audit          # dependency and advisory review
npx tsc -b                             # type gate
npm test                               # 82 tests across 15 files
npm run build                          # production bundle
npm run smoke:routes                   # 17 routes, real DOM, jsdom
npm run audit:ui                       # duplicate ids, control names, field names, inline styles
```

Static checks were run against `src/`, `scripts/` and `tests/` with `git grep` and small Python
scanners (anchor/tag parsing, brace balancing, per-declaration CSS validation, keyframe property
inspection). The dev server was used only to confirm the app serves and transforms modules
(`/`, `/src/main.tsx`, `/src/App.tsx` all 200); there is no headless browser in this environment,
so visual and contrast behaviour is asserted from source, not screenshots (see QA-16).

## Findings

### QA-01 · High · Deployment metadata advertised a dead origin — fixed

`public/robots.txt` and `public/sitemap.xml` both pointed at `https://mumoxa.github.io/Maps/`, and
`AGENTS.md`, `CLAUDE.md` and `README.md` described a GitHub Pages deployment with a `/Maps/` base
path and a `gh-pages` branch. Verified live: `https://maps-4xq.pages.dev/robots.txt` returned the
GitHub Pages sitemap URL, which makes that host the only real deployment — the GitHub Pages API
returns 404 for this repository, and the deploy workflow uses
`npx wrangler pages deploy dist --project-name maps`.

Impact: search engines were pointed at a sitemap that does not resolve, and social cards resolved
against the wrong host (the `og:url`/`og:image` tags in `index.html` were unset or wrong).

Fix: `robots.txt`, the 15-URL `sitemap.xml` and the OG/Twitter tags in `index.html` all use
`https://maps-4xq.pages.dev`; the sitemap matches the public route table (previously `/salesforce`
was missing and `/contacts` plus `/search-bank` were listed); the three docs now describe the
Cloudflare Pages target, base `/`, and no `gh-pages` branch. A repository-wide sweep for
`mumoxa.github.io` now only matches the deliberate "GitHub Pages is not enabled" sentences.

Note: the deployed artifact keeps serving the old files until a deploy runs from `main`, because
`public/` is copied at build time.

### QA-02 · High · Stylesheet corrupted by scripted edits — fixed

`src/styles/globals.css` had been rewritten by several scripted edits during the redesign and no
longer parsed cleanly. Concrete damage found:

- a declaration whose first letter had been lost: `{isplay: flex;`
- three stray `}.` fragments left after block removal
- a duplicated, nested `.page` selector that swallowed the rest of a rule
- 387 rules spliced onto the line of the previous rule's closing brace (functionally legal, but it
  had already caused a dead-rule deletion sweep to match zero blocks)
- 258 blocks repeating a declaration that an earlier line in the same block already set
- unbalanced braces (816 open / 815 close), so everything after the break was being parsed inside
  the wrong block

Impact: high. A single unmatched brace silently disables every rule after it in most browsers; the
file's own validation was the only thing keeping the app's appearance intact.

Fix: three repair passes (structure, then `vh`/`dvh` pair merging, then a per-block declaration
dedupe), each followed by re-validation. The stylesheet now reports 811 balanced brace pairs, 797
rules, 14 `@media` blocks, zero invalid declarations and zero blocks with repeated declarations.
`npm run audit:ui` re-checks the file's integrity on every run.

### QA-03 · Medium · Dialog layers leaked focus and scroll state — fixed

`Drawer` and the three facet drawers (accounting/finance, talent search, contacts) moved focus into
the panel on open, but never trapped Tab inside it, never returned focus to the element that opened
them, and on close always reset `document.body.style.overflow = ''` instead of the value it had
before (clobbering the previous state if two layers overlapped).

Fix: `src/hooks/useDialogLayer.ts` owns the contract — focus the panel, trap Tab, close on Escape,
restore focus to the previously focused element, and lock body scroll with the previous value
restored. All four layers use it. The audit now opens the drawers and re-runs the id and
control-name checks inside them, reporting `filterDrawersAudited`, so a drawer that fails to open
can no longer pass silently.

### QA-04 · Medium · Theme flashed on first paint — fixed

`useTheme` applied a stored `dark` preference in an effect, so a dark-mode user got a light first
paint (and a layout-wide repaint) on every load. Fix: a small inline script in `index.html` reads
`localStorage['sa-talent-map:theme']` and sets `data-theme` before the app mounts; verified once in
the built `dist/index.html`.

### QA-05 · Medium · Private contact workspaces were indexable — fixed

`/contacts` (which renders personal names, e-mail addresses, phone numbers and LinkedIn URLs) and
`/search-bank` (candidate pipeline notes) were reachable and listed in `sitemap.xml`. Only a client
-side route guard, nothing stopped crawling.

Fix: `robots.txt` disallows both paths; `src/hooks/useNoIndex.ts` appends a
`<meta name="robots" content="noindex, nofollow">` while either page is mounted and removes it on
unmount; both paths were dropped from the sitemap. The audit asserts this contract on every run
(`privateRoutesNoIndexed`).

### QA-06 · Medium · `dvh` layout values had no fallback — fixed

Nine declarations used `dvh` (map canvas height, page `min-height`, drawer and mobile-nav
`max-height`, hero sizing). In browsers without `dvh` support the whole declaration is dropped,
which collapses those boxes rather than degrading.

Fix: each of the nine now carries the equivalent `vh` declaration first. Verified mechanically:
9 `dvh` declarations, 9 immediately preceded by their `vh` fallback, none missing.

### QA-07 · Medium · Header dropdown promised menu semantics it did not implement — fixed

The talent-pool dropdown was marked up as `role="menu"` with `role="menuitem"` children, which
promises arrow-key navigation and roving focus. It is a plain list of links, so screen-reader users
were told to use keys that did nothing.

Fix: it is now a disclosure — `aria-expanded` plus `aria-controls` on a button, a plain list of
links below — and the mobile nav toggle follows the same pattern. No `role="menu"` remains in
`src/`.

### QA-08 · Medium · `react-router-dom` carried a reachable XSS advisory — fixed

`npm audit` reported GHSA-jjmj-jmhj-qwj2 (open redirect via `<Link>`/`useNavigate` leading to XSS)
against the installed `react-router-dom@6.30.4`. Every internal link in this app goes through
`<Link>`, so the advisory is in the shipped runtime rather than in tooling.

Fix: `npm update react-router-dom` resolved to `6.30.6`, the patched 6.x release, inside the
declared `^6.28.0` range (no manifest change). Two further 6.x advisories remain, see QA-14 — both
are unreachable here, and neither has a 6.x fix.

### QA-09 · Low · Dead modules and one unused map component — fixed

An import-graph scan found six modules with zero importers, five of which predated the redesign:
`src/components/ui/Card.tsx`, `FilterBar.tsx`, `Modal.tsx`, `src/hooks/usePagination.ts`,
`src/hooks/useSearch.ts`. The sixth, `src/components/map/MapControls.tsx`, was written during the
redesign and never mounted, so the map shipped React Flow's default unstyled controls while a
designed cluster sat unused.

Fix: the five orphans are deleted along with the CSS only they used (`.filter-bar`, `.filter-chip`,
`.modal-*`); `MapControls` is wired into `OrgChartCanvas` in place of React Flow's default
`<Controls>`, with zoom in, zoom out and fit-view driven through `useReactFlow()`.

### QA-10 · Low · Three routes never set `document.title` — fixed

`DELTA.md` claimed "all 10 page components set `document.title`", which was true when the app had
10 pages. It now has 22 page modules, and three of them — `AccountantsPage`,
`HackathonTalentPage`, `ContactDirectory` — set no title, so the tab kept the static
`<title>SA Talent Map</title>` from `index.html`. (The four track wrappers `SalesforcePage`,
`SapErpPage`, `MurexPage`, `CalypsoPage` delegate to `TrackPage`, which does set a title; the first
grep suggested otherwise and the delegation was checked before reporting.)

Fix: each of the three sets a title in a mount effect, following the existing pattern.

### QA-11 · Low · UI audit could not see drawers or the private-route contract — fixed

`scripts/audit-ui.ts` walked the 17 static routes and checked duplicate ids, control names, field
names and the inline-style census — but the filter drawers are rendered only after a click, and
nothing verified that private routes refuse indexing. Both regressions were therefore invisible to
the only automated UI gate in the project.

Fix: the audit now clicks each `.facet-filter-trigger`, waits for the layer, and re-runs the id,
control-name and field-name checks inside `.facet-drawer, [role="dialog"]`; it asserts the
`noindex` meta on the two private routes and reports both lists in its JSON summary. It also gained
a `document-title` rule — every route must set a title, and keeping the previous route's title is a
failure — plus a `routeTitles` map in the summary, so the QA-10 class of defect cannot come back
silently.

### QA-12 · Low · `DELTA.md` documented a `Fuse` `any` that does not exist — fixed

The deviation log stated that `Fuse.IFuseOptions` is unavailable under strict mode and that
`src/data/search.ts` therefore uses `any`. Neither is true today: `src/data/search.ts` declares no
`any`, `Fuse.IFuseOptions` appears nowhere outside that sentence, and `npx tsc -b` is clean. A
repo-wide scan finds no `as any`, no `: any`, no `<any>` and no `@ts-ignore` anywhere in `src/`.

Fix: the note is corrected; the file is unchanged. This means the project currently has **no**
open type-level deviation.

### QA-13 · Medium · First-load JavaScript ships the whole dataset — open

Measured on the production build (`npm run build`, all sizes raw / gzipped):

| Asset | Raw | Gzip | Loaded |
| --- | --- | --- | --- |
| `index-*.js` (entry) | 3,843,057 B | 439,056 B | every route |
| `ContactDirectory-*.js` (lazy) | 6,036,585 B | 689,211 B | `/contacts` only |
| `map-vendor-*.js` | 182,987 B | 59,488 B | map routes |
| `react-vendor-*.js` | 161,274 B | 52,590 B | every route |
| `index-*.css` | 121,189 B | 18,969 B | every route |

The entry bundle inlines datasets that most routes never read: `markets/accountants/people.json`
(1.81 MB), `markets/hackathons/people.json` (0.41 MB), `markets/salesforce/people.json` (49 kB) and
the root `profiles/companies/segments/org_chart/shortlist/summary` JSON (~0.44 MB) are all static
imports, so they are parsed on the critical path for the home page. The contact dataset (6.3 MB
across `src/data/contact-parts/*.json`) is route-split but still arrives as one 6 MB script rather
than streamed data.

Impact: a first-time visitor on a mid-range phone downloads ~440 kB gzip of JavaScript plus fonts
before the home page becomes interactive, and roughly 1.2 MB gzip before the contact directory is
usable. This is a pre-existing data-layer design, not a redesign regression, and it is the single
largest performance finding in the codebase.

Recommended fix, in order: (1) move the three track datasets behind route-level `import()` so they
stop being entry-chunk payload; (2) fetch `public/data/*.json` over the network instead of
importing it, keeping `loadData()` behind an async boundary and a skeleton state, which the design
system already supports (`SkeletonPage`); (3) split `contact-parts` so the contact directory pages
its data. Left open because it changes the data-loading contract, which is outside the scope of an
origin-metadata fix and deserves its own change set.

### QA-14 · Low · Ten dependency advisories remain — partly open

`npm audit` reports 10 advisories: 5 moderate, 5 high, none critical. After the QA-08 upgrade:

- **Runtime, unreachable.** `react-router` 6.30.6 still matches two advisories fixed only in
  7.18.0: a backslash open-redirect bypass in `<Link>`/`useNavigate`, which needs an
  attacker-controlled destination (every route target here is a literal or a slug derived from
  locally stored JSON, never from user input), and a constructor-injection issue in
  `deserializeErrors()` during SSR hydration (this app is client-rendered only, via `createRoot`;
  there is no SSR).
- **Runtime, script-only.** `csv-parse` 6.2.1 (`<7.0.2`, prototype replacement) is a dependency of
  `scripts/import-market-batch.ts` alone — not imported by `src/` — and the fix requires a 7.x
  major bump.
- **Dev-only.** `vite` (three advisories, two Windows-specific path issues), `esbuild`
  (dev-server request reading), `postcss`, `nanoid`, `source-map-js`, `browserslist` and
  `baseline-browser-mapping` are build/dev dependencies. They are not part of the deployed
  artifact.

Recommendation: schedule a maintenance bump of Vite (5 → 7) and `csv-parse` (6 → 7) as its own
change set with the full gate, rather than mixing majors into feature work. None of these
advisories is reachable from the deployed site as written.

### QA-15 · Low · A data script hard-codes an absolute path — open

`markets/accountants/fix_dupes.py` sets `BASE = "/home/user/Maps/markets/accountants"`, so it only
runs on one machine layout. It is a one-off data-repair script, not part of the build, test or
deploy path. Recommendation: derive the path from `Path(__file__).parent`, or move the script under
`scripts/` with the rest of the tooling.

### QA-16 · Info · No headless browser, so no pixel-level verification — open

Everything in this review is derived from source, the DOM (jsdom) and the build. Contrast ratios,
dark-mode rendering, hover and focus visuals, drawer animation smoothness and the map canvas under
load were not measured in a real browser because none is available in this environment. The
recommendation is to add Playwright to CI with three checks that jsdom cannot do: a screenshot
diff of the light and dark home page, an axe-core accessibility pass per route, and a bundle-size
budget check on `dist/assets/*.js` (which would have surfaced QA-13 automatically).

### QA-17 · Info · Some page bodies still use pre-redesign markup — open

`TalentSearchPage`, `SapErpPage`, `TrackPage`, `NotFound` and the `Calypso`/`Murex`/`Salesforce`
track pages still contain markup blocks written before the design system existed; they render
correctly and pass the audit, but their internals do not consistently use the `.page-head` /
`.section-block` / `.panel` vocabulary documented in `docs/design-system.md`. Cosmetic backlog, not
a defect.

## Verified sound

Checks that came back clean and needed no action:

- **ARIA id resolution.** Every `aria-controls`, `aria-labelledby` and `aria-describedby` in `src/`
  resolves to an id that exists in the same render tree; static ids are unique per page and
  `FacetPanel` prefixes them per instance.
- **Keyboard reachability.** The tooltip reveals on `:focus-within` as well as hover; buttons,
  drawers and the command palette all show a `:focus-visible` ring; Escape closes the drawers, the
  palette and the mobile nav.
- **Inline styles.** 580 inline declarations across 13 distinct shapes, all of them computed
  geometry (43 `.bar-fill` widths, ~530 React Flow node/renderer/viewport/panel coordinates, one
  minimap custom property, two `display: none` toggles). No static styling inline.
- **Motion rules.** No `transition: all`; no transition animates a layout property; all seven
  `@keyframes` touch only `transform` and `opacity`; `prefers-reduced-motion` is handled globally,
  including for the scroll-driven reveal.
- **Markup hygiene.** All 19 `target="_blank"` occurrences set `rel="noopener noreferrer"` or
  `rel="noreferrer"`; no `<img>` is missing `alt`; no `console.log`, `TODO`, `FIXME` or `HACK`
  remains in `src/`, `scripts/` or `tests/`; no `role="menu"` remains.
- **Route/data integrity.** The public sitemap matches the route table exactly (15 URLs; parameter
  routes, `/contacts`, `/search-bank` and the catch-all excluded deliberately); the redesign diff
  does not touch `src/data/`, `markets/` or `public/media/`; the only files removed from
  `public/media/` (`contour-paper.jpg`) had no remaining reference.
- **Gate.** `npx tsc -b` clean · `npm test` 82/82 · `npm run build` 8.1 s ·
  `npm run smoke:routes` 17/17 · `npm run audit:ui`
  `{"status":"ok","routesChecked":17,"filterDrawersAudited":["/accounting-finance","/talent-search","/contacts"],"privateRoutesNoIndexed":["/search-bank","/contacts"],"routeTitles":{"…":"17 distinct titles, listed in the run output"},"findings":0}`.

## How to reproduce

```bash
npx tsc -b                                   # types
npm test                                     # 82 tests / 15 files
npm run build                                # production artifacts in dist/
npm run smoke:routes                         # 17 routes in jsdom
npm run audit:ui                             # ~110 s; prints the JSON summary above
python3 - <<'PY'                             # stylesheet integrity
import pathlib; css = pathlib.Path('src/styles/globals.css').read_text()
print(css.count('{'), css.count('}'))
PY
```

Data-layer warnings printed by `validateData()` during tests are pre-existing and expected: 27
profiles marked `needs_verification`, an incomplete org chart (7 of 67 published entries) and a
duplicate name ("David Coleman", CRSA-065/081). They are dataset content, not code defects.
