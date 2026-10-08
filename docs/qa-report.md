# Independent QA report

Date: 2026-10-08 · Branch: `arena/e728a500-maps` · Gate: `npm run qa`

## What this is

The brief asked for independent QA agents to review the build. This environment has no sub-agent or
subprocess tool, so "independent" is implemented structurally instead: five reviewer programs under
`scripts/qa/`, each of which reads its subject from a different angle than the code under test, each
with its own pass/fail verdict, plus an aggregator that exits non-zero on any failure.

```
npm run qa
```

```
DATA-INTEGRITY     PASS   23 assertions
EXPLAINABILITY     PASS   11 assertions
INTERFACE-ACCESS   PASS   30 assertions
PRIVACY-SECURITY   PASS   10 assertions
ACCEPTANCE         PASS   16 assertions
5 reviewers · 90 assertions · 0 failures · 7.7s
VERDICT: PASS
```

| Reviewer | Reads | Deliberately does not read |
| --- | --- | --- |
| `reviewer-data.ts` | `markets/organizations/*.json` off disk | the app's loaders, index builder, discovery engine |
| `reviewer-explainability.ts` | explorer source text + a live discovery run | the ranking implementation's own helpers |
| `reviewer-ui.ts` | the rendered page in jsdom | component internals |
| `reviewer-privacy.ts` | shipped datasets, source tree, bank records | — |
| `reviewer-acceptance.ts` | the directive's acceptance conditions, run live | fixtures built to pass |

## What the reviewers found

Every finding below was fixed in the product or the data. Four were reviewer bugs, and those were
fixed in the reviewer — they are listed too, because a reviewer that reports false failures is as
useless as one that reports none.

### Product bugs

**1. A company from an existing dataset opened an empty inspector.** `companyDossier` resolved ids
through `index.byId`, which holds only the 80 curated records, so clicking any of the 323
dataset-derived companies rendered the "Select a company" placeholder. Fixed in
`src/data/organizations/query.ts`: the dossier now falls back to a record built from the employer
data, so an un-researched company shows its gaps rather than dead-ending. The page guard in
`CompanyAssociationsPage.tsx` accepts curated and dataset ids alike.

**2. The network view started with nothing to click.** Every pocket was collapsed on load, so a
recruiter who landed on the graph saw the focal company and 13 closed sectors and no way to reach a
company record. Fixed: the pocket with the most tier-1/2 matches opens by default, and the
recruiter's own choice still overrides it (`chosenPockets` stays `null` until changed).

### Data defects

**3. Seven batch-2 rows claimed a source for something never verified.** Capability links written as
`status: unknown` carried a `sourceUrl`, which asserts a verification that did not happen. The URLs
were moved into the evidence prose.

**4. Eight rows recorded an inference as an observation.** The seed's `cap()` helper defaults
`status` to `observed`, so evidence like "Frozen and chilled product distribution implies
refrigerated storage" became a positive claim. Downgraded to `unknown`/`probable`.

**5. Fifteen rows recorded a proxy as an observation.** The worst consequence: Boxer Superstores sat
at **tier 1** for a cold-storage Financial Manager brief because "a focused range of approximately
3,000 SKUs" was recorded as inventory accounting and a reported cost-to-turnover ratio as cost
accounting. Both mandatory rules fired on evidence that does not support them. All 15 are now
`unknown`/`probable` with the proxy named; Boxer is tier 2. The same class covered directory
classifications ("Classified under grain and oilseed milling"), portfolio breadth ("National
contracting portfolio"), an external audit offered as regulatory reporting, and a preferred-bidder
status offered as project development.

**6. `build_seed_1.py` now refuses to build bad records.** `assert_capability_discipline` fails the
seed if a capability is `observed` without a source URL, `observed` on inferential wording,
`observed` on proxy wording, `unknown` with a source URL, or `not-observed` without evidence. The
proxy keyword list is deliberately narrow — "portfolio" was removed after it flagged 13 legitimate
records such as Rabie's "portfolio of concurrent developments", which does evidence concurrent
delivery. That distinction is human judgement, not a regex.

Four capability records were reviewed and **kept** as `observed`/`probable` because the source states
the activity rather than a proxy: Rebosis ("described as a real estate development player"), Reatile
×2 (financial close achieved on the 89 MW Castle Wind Farm), Kuehne+Nagel ("integrated network
across the continent with shipment visibility and cargo-flow management").

### Reviewer bugs (fixed in the reviewers)

- `reviewer-data` crashed on `.map(organization.name)`.
- `reviewer-explainability` scanned legacy pages outside this brief's scope, and matched the word
  "percentage" inside copy that *disclaims* percentages. Scoped to the explorer; comments, string
  literals and JSX prose are now stripped before pattern matching.
- `reviewer-ui` read the filter dialog instead of the inspector, because it never closed the drawer.
- `reviewer-acceptance` asserted the scan equals the universe; the focal company is not a candidate
  for itself, so the correct expectation is universe minus one (403 scanned → 402 candidates).
- `reviewer-ui`'s unknown-vs-absence check passed vacuously on a fully evidenced record. It now
  opens a company that genuinely carries unknown capabilities, and one that has never been
  researched.

### A defect the reviewers did **not** catch

The 15 proxy rows were found by reading a scenario result, not by an assertion: Boxer appearing at
tier 1 for a cold-storage brief was wrong on its face, and tracing it exposed the class. A keyword
guard now covers the common proxies, but "does this source actually state this capability" remains a
judgement call that no check in this repo can make. Records should be read, not only validated.

## Design decision the review settled

Tier 1 is reached either by evidencing a mandatory requirement (R2) or by sharing the industry or
pocket **and** an operating process (R1|R3 + R5). In scenario A, all 17 tier-1 companies list
"Inventory accounting; Cost accounting" as missing research, because public sources rarely describe
a company's accounting processes.

The engine does not demote for that gap. Missing research is not a verified absence, and demoting on
an unverified field would convert unknown coverage into a negative signal — the one thing the brief
forbids. The gap is shown on the company instead, which is also the useful output: it tells the
recruiter which exposure to verify first.

## Verification of this build

| Command | Result |
| --- | --- |
| `npm run qa` | 5 reviewers · 90 assertions · **0 failures** |
| `npm test` | **151 pass / 0 fail** |
| `npx tsc -b --force` | clean across `src`, `scripts`, `tests` |
| `npm run build` | exit 0, validator 0 errors / 0 warnings, built in 9.06 s |
| `npm run smoke:routes` | `{"status":"ok","routesChecked":18}` |
| `npm run audit:ui` | `{"status":"ok","routesChecked":18,"findings":0}` |
| `npm run validate:organizations` | 80 organizations, 10 relationships, 0 errors, 0 warnings |
| `npm run scenarios` | A: 17/11/12/23/339 · B: 7/12/12/15/356 · C: 1/2/14/30/355 (402 matched of 403 scanned) |

Coverage after removing the 15 proxy claims: `withWebsite 60, withScale 28, withLocations 55,
withEvidencedCapabilities 59` (down from 66 — the honest cost of withdrawing claims the sources did
not support), `pendingVerification 34`.

## What is not covered

- No browser rendering: `reviewer-ui` and `audit:ui` run in jsdom. React Flow draws no nodes in a
  zero-size container, so graph layout, pan/zoom and node interaction are **not** verified by
  automation. The company record is reachable without the graph, which is asserted.
- No screenshots were produced.
- `npm run qa` is not wired into `npm run build`; it takes about eight seconds and belongs in CI.
