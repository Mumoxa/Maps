# Adding to the SA Talent Map — the structured path forward

The Talent Map is an **ongoing build**. The long-term goal is to map every individual in the
South African talent pool, so what is in the repo today is a portion, not the finish line. This
guide is the master reference for adding to it **without breaking the current system**: new tracks
(talent pools) and new people inside existing tracks both have a defined, repeatable path into the
UI.

Read this first. It links out to the batch-specific mechanics in
[`market-data-import-guide.md`](./market-data-import-guide.md).

---

## The two ingestion patterns (pick one per track)

Every track feeds the same shared registry (`getTalentProfiles`) that powers the global
`/talent-search`, the home-page cards, and the header nav. There are **two** supported ways a
track's data reaches that registry. Choose by a single question:

> **Does every person in this population have a canonical, public identity URL (e.g. a public
> LinkedIn profile) you can supply as verified?**

| | Pattern A — Batch pipeline | Pattern B — Research-DB pool |
|---|---|---|
| **Use when** | Every row has a public identity URL + evidence URL | People are evidenced from directories/bodies/news and often have **no** public profile URL |
| **Source of truth** | A verified CSV imported to an immutable batch | An append-only JSONL research database under `markets/<slug>/` |
| **On disk** | `markets/<slug>/batches/<batch-id>.json` | `markets/<slug>/people.jsonl` → generated `markets/<slug>/people.json` |
| **Validation** | Strict: `npm run validate:data` enforces per-row identity URL, stable hashed IDs, ISO dates, ≥1 source | The JSONL is the research contract; the UI export is derived, not batch-validated |
| **Reaches the UI via** | The batch loader (`markets/*/batches/*.json`, auto-discovered) | A typed `src/data/<slug>People.ts` module + an adapter wired into `talentSearch.ts` |
| **Reference tracks** | Credit Risk, Salesforce, SAP ERP, Murex, Calypso | Hackathon Talent, **Accounting & Finance** |

**Do not fabricate identity URLs to force a population into Pattern A.** The evidence rules
(`markets/<slug>/README.md`, `qualification_rules.md`) forbid inventing LinkedIn URLs, employers,
or locations. If the population is evidenced without per-person profile URLs, it belongs in
Pattern B. This is exactly why Accounting & Finance uses Pattern B.

---

## Adding people to an EXISTING track

### Pattern A track (Credit Risk, Salesforce, SAP ERP, Murex, Calypso)

Follow [`market-data-import-guide.md`](./market-data-import-guide.md): prepare a CSV from
`templates/market-profile-import.csv`, run `npm run market:import`, then verify. A valid batch
updates search results and counts with **no** page or count edits.

### Pattern B track (Hackathon Talent, Accounting & Finance)

1. Append verified records to the JSONL research store (never rewrite existing lines except to
   correct the same `id`). Consult the track's dedup registry first — e.g.
   `markets/accountants/people_index.md` — so nobody is added twice.
2. Regenerate the UI export from the JSONL:
   - Accounting & Finance: `python3 markets/accountants/gen_people_json.py`
   - Hackathon Talent: `python3 scripts/generate_hackathon_candidates.py`
3. Verify (see **Guardrails** below) and commit the JSONL, the regenerated `people.json`, and the
   generator — **not** any local working files.

Counts (`134 candidates`, `96 CA(SA)`, home-page card totals, etc.) are all derived at runtime.
Adding records changes them automatically; do not hardcode a count anywhere (CLAUDE.md rule 4).

---

## Adding a NEW track end-to-end

A track is registered **once** in `src/data/tracks.ts`; the home-page cards, the header/mobile
nav dropdowns, and the "Candidates" grouping all derive from that array, so those wire themselves.
The steps below are the complete surface you must touch.

### 1. Register the track (both patterns)

In `src/data/tracks.ts` add an entry to `talentTracks`:

- `id` and `slug` — the slug is the route (`/<slug>`) and the `trackSlug` on every adapted profile.
- `name`, `shortLabel` (`Track NN`), `summary`, `detail`, `nextSteps`.
- `accent` — pick an existing accent, **or** add a new one. A new accent value must be added in
  **three** places or the build fails:
  1. the `accent` union in `src/data/tracks.ts`;
  2. `accentIconMap` in `src/pages/HomePage.tsx`;
  3. `accentIconMap` in `src/pages/TrackPage.tsx`.
  If you add a new accent, also add a `.talent-track-card-<accent>` rule in
  `src/styles/globals.css` (and optionally a `.track-hero-<accent> .track-hero-badge` rule).
- `scope.category` — use `talent-pool` for a people pool.

### 2A. Wire the data — Pattern A

Create `markets/<slug>/` and import the first verified batch with `npm run market:import`
(the batch loader auto-discovers `markets/*/batches/*.json`; no code change needed). If the track
needs a bespoke landing page, add one; otherwise `MarketTrackPage` (`src/pages/TrackPage.tsx`)
renders a registered track from the registry with zero track-specific code.

### 2B. Wire the data — Pattern B

Mirror the Accounting & Finance implementation exactly:

1. **Research store + export**: `markets/<slug>/people.jsonl` (source of truth) and a
   `gen_people_json.py` that derives `markets/<slug>/people.json` (camelCased, UI-lean, rejects
   nothing but `REJECTED` records). Keep the JSONL authoritative — the generator must never
   overwrite it.
2. **Typed module**: `src/data/<slug>People.ts` — `import peopleRaw from '../../markets/<slug>/people.json'`,
   export a typed array and the facet/filter/`universe` helpers the page needs. Build lookups once
   (Maps), never `.find()` in a render loop (CLAUDE.md rule 5).
3. **Adapter**: in `src/data/marketData/adapters.ts` add `adapt<Track>Candidates(): MarketProfile[]`
   mapping each record to a `MarketProfile` with `id: '<slug>-<sourceId>'`, `trackSlug: '<slug>'`,
   `track: '<Name>'`, and `provenance.kind: 'legacy'`.
4. **Register into the global search**: in `src/data/talentSearch.ts` spread
   `...adapt<Track>Candidates(<track>Candidates)` into `legacyProfiles`. This is what makes the
   track searchable in `/talent-search`.
5. **Dedicated page + route**: add `src/pages/<Track>Page.tsx` (the Hackathon and Accountants pages
   are the template — URL-driven filters via `useSearchParams`, keyboard-accessible controls,
   evidence links) and route it in `src/App.tsx`.
6. **Export barrel** (optional but consistent): re-export the module from `src/data/index.ts`.

### 3. Keep the guardrail test honest

`tests/market-data-repository.test.ts` asserts the exact sorted set of registered track slugs.
When you add a track, add its slug to that array. This is the tripwire that proves every
registered track is accounted for.

---

## Guardrails — what keeps additions from breaking the build

Run all three before committing (this is the CI/deploy gate):

```bash
npm run validate:data   # Pattern A batches + legacy registry integrity
npm test                # 33+ tests, incl. the registered-track-slug tripwire
npm run build           # validate:data + validate:contacts + tsc + vite build
```

Invariants that additions must preserve:

- **Never commit build artifacts** (`dist/`, `node_modules/`, `*.tsbuildinfo`) — CLAUDE.md rule 1.
- **Derive counts, never hardcode** — every total on a card or hero comes from the data at runtime.
- **New accent → three edits** (union + both `accentIconMap`s) + a CSS accent rule, or `tsc` fails.
- **Unique profile IDs** — Pattern B adapters must namespace IDs as `<slug>-<sourceId>`; the
  registry throws on a duplicate ID.
- **Pattern B data is not batch-validated**, so the JSONL research contract
  (`schema.md`, `qualification_rules.md`, the dedup index) is the quality gate. Honour it.
- **Evidence only** — no fabricated URLs, employers, locations, skills, or systems; public
  professional information only; attach a record to a person on evidence, never on name match.

---

## Where each track lives (current)

| Track | Slug / route | Pattern | Data |
|---|---|---|---|
| Credit Risk | `/credit-risk` | A (legacy) | `profiles.json` |
| Salesforce | `/salesforce` | A | `markets/salesforce/` |
| Hackathon Talent | `/hackathons` | B | `markets/hackathons/` + `hackathon-census/` |
| Accounting & Finance | `/accounting-finance` | B | `markets/accountants/` |
| SAP ERP | `/sap-erp` | A (ready) | registry-driven |
| Murex | `/murex` | A (ready) | registry-driven |
| Calypso | `/calypso` | A (ready) | registry-driven |
