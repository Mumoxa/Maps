# Company Association Explorer

Route: `/company-associations`. Supporting routes: `/organizations` (directory, coverage and data
quality tabs), `/organizations/:id` (dossier), `/industries(/:id)`, `/capabilities(/:id)`,
`/qualifications(/:slug)`, and the private workspace routes `/search-bank/assignments(/:id)`,
`/target-pools` and `/intelligence/import`.

The explorer answers one question: "given this company and this role, which other companies
should a recruiter look at, and why?" It shows associations as facts, inferences and
suggestions, keeps them apart, and never turns missing evidence into a negative.

## Using it

1. **Pick a company** (type to search, arrow keys and Enter to select). Optional: with no
   company the explorer ranks the whole universe for a role.
2. **Pick a role context.** "No role" shows associations only, without tiers. Templates
   (Financial Manager for temperature-controlled storage, Head of Finance for agri commodity
   businesses, Finance for property development and so on) live in
   `markets/intelligence/taxonomy/role-contexts.json`, not in code. "Custom" or any template can be
   edited in the requirement box (mandatory and preferred capabilities, preferred, adjacent and
   deprioritised industries, geography). A Search Bank assignment can supply the requirement.
3. **Filter.** Filters are AND across dimensions and OR within one (e.g. Tier 1 or Tier 2, and
   Western Cape). All state, including the selected company, view, expanded pockets and the
   comparison set, is in the URL, so a link reproduces the exact view.
4. **Switch views.** Network (graph), Pockets (industry groups with counts) and Table (sortable,
   multi-select, CSV and JSON export) share the same selection and filters. Nothing is capped at
   a top N: pockets with many companies show "+N more" in the graph and the full list elsewhere.
5. **Inspect a company.** The inspector separates sourced facts (with evidence links, dates and
   staleness), inferences (industry priors, labelled as hypotheses), and recruiter suggestions.
   It shows the tier, why, what is missing and the weakest confidence the tier rests on.
6. **Compare** two to four companies: shared, distinct and partly unknown industries and
   capabilities, scale metrics (never compared across different kinds) and what that implies
   for the role.
7. **Act.** Override a tier (a reason is required; the computed tier stays visible), add a curated
   association with a reason, add companies to an assignment, or save a target pool (snapshot keeps
   the exact list and reports drift; dynamic re-runs the query).

### Graph keyboard and pointer controls

Pan by dragging, zoom with the wheel or the zoom controls, "Fit view" to frame everything. Every
node is a real button reachable with Tab. On a pocket, Enter or Space expands or collapses it. On
a company, Enter or click opens the inspector, Shift/Ctrl/Cmd-click or the C key adds it to the
multi-selection, and R or double-click recentres the explorer on it ("Recentre here" in the
inspector does the same). "Back" returns to the previous view (browser history, because all state
is in the URL). Table view has row checkboxes for multi-select.

## Association types

| Type | Basis | Meaning |
|---|---|---|
| Same industry | fact | Both have the same sourced industry classification |
| Same sector | fact | Different sub-industries under one parent sector |
| Value chain | fact | Industries recorded as supplier/customer neighbours in the taxonomy |
| Shared operational process | fact | Both have observed (probable or better) operational capabilities in common |
| Shared financial complexity | fact | Shared observed financial capabilities (e.g. commodity hedging, capital projects) |
| Shared technology | fact | Shared observed systems (e.g. Sage 300 from legacy research) |
| Corporate relationship | fact | Evidence-backed parent, subsidiary, division, JV |
| Geography | fact | Shared province (shown, never used to rank on its own) |
| Previous recruitment | suggestion | Both targeted together in a previous private assignment |
| Recruiter observation | suggestion | Curated association with a written reason |

## Tier rules (role-conditional, rule based)

Implemented in `src/data/intelligence/targeting.ts`. No scores or weights.

- Excluded organization or industry: **Excluded**.
- No role criteria: **Not applicable** (associations only).
- No sourced industry and no sourced capability: **Unassessed** (unknown is not zero).
- Mandatory capabilities all observed: **Tier 1** if in a preferred industry or two or more
  preferred capabilities are observed, otherwise **Tier 2**.
- Some mandatory observed: **Tier 2** if preferred or adjacent industry, else **Tier 3**.
- A mandatory capability evidenced as not observed: **Tier 4**.
- Mandatory capability unknown or only an industry hypothesis: **Tier 2** in a preferred
  industry, **Tier 3** in an adjacent one, otherwise **Tier 4**, always with "missing evidence"
  explaining what would change the tier.
- No mandatory capabilities: Tier 1 needs a preferred industry and two preferred capabilities;
  Tier 2 one of those; Tier 3 an adjacent industry or one preferred capability; else Tier 4.
- A deprioritised industry caps Tier 1 and 2 at Tier 3 unless every mandatory capability is
  observed.

## What the explorer never does

- Never invents companies, capabilities, relationships or people. Every fact cites an evidence
  record in `markets/intelligence/research/*.json`.
- Never infers what a person did from where they worked. People counts come from public
  profiles and link back to the track that holds them.
- Never merges people on name similarity.
- Never claims coverage is complete. The coverage tab in `/organizations` reports what is and is
  not classified.

## Data and privacy

Public, non-confidential company intelligence is committed under `markets/intelligence/` and
bundled into the static site. Everything confidential (assignments, client names, overrides,
curated associations, candidate assessments, private research imports, target pools) is stored
only in the recruiter's browser (`localStorage` key `talent-map.workspace.v1`) through the
`WorkspaceStore` interface in `src/data/workspace/store.ts`. It is never committed, bundled or
sent anywhere. It is also not shared, synced or backed up: the assignments page has backup
export and restore. A secure, authenticated server store is the intended replacement; the target
schema is `db/migrations/0001_canonical_intelligence.sql`.

## Adding research

- Recruiter, private: `/intelligence/import` (CSV or JSON, preview, commit, rollback).
- Public, committed: `npm run intel:import -- file.csv` to preview, `--write <name>` to write a
  research batch, register it in `src/data/intelligence/index.ts`, then
  `npm run intel:reconcile`, `npm run validate:intel` and `npm test`.

Every row needs `evidence_url` or `supports`. Rows without evidence are rejected, duplicates of
existing facts are reported as duplicates, contradictions as conflicts, and the same file is never
imported twice (content hash).
