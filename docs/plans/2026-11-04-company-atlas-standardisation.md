# Company atlas standardisation — programme plan (4 November 2026)

## The instruction

Every company in the atlas must be **verified** and **mapped in the correct way**, properly wired
with **all information in a standardised manner**. This is a long-running programme, delivered in
reviewed batches with an auditable ledger.

## What "verified" means here

A company is verified only when its identity and classification are supported by a dated, cited
source. The repository already has the vocabulary for this (`Organization.status`,
`EvidenceRecord.confidence`); the work is to actually populate it, not to relax it.

The evidence gate for `status: verified`:

1. an official website or corporate disclosure (`website` non-empty and cited),
2. at least one `sources` record with URL, checked date and a statement of what it supports,
3. a defensible industry / national-taxonomy placement with its own evidence,
4. a sourced operating location.

Nothing is marked verified because it "looks like" a big company. Where a source cannot be found,
the record keeps `needs-verification` and says what is missing.

## What "mapped in the correct way" means here

- **Classification** resolves to the canonical 731-node sector tree (`taxonomy.primaryNode`),
  never to a made-up sector, and the node is always an existing tree node.
- **Industry pockets** (the 30 specialist Maps industries) stay a separate role-matching layer and
  are never blended into the taxonomy placement.
- **Corporate relationships** are recorded as evidenced facts with a direction, so a group
  headcount is never silently attributed to a subsidiary.
- **Footprint** is derived from sourced metrics only, and `not-established` is kept as an honest
  answer rather than replaced with a guess.

## What "standardised" means here

One dossier standard, applied to every organisation in the visible universe, measured by
`npm run atlas:coverage` against 13 fields:

| Field | Why it is in the standard |
| --- | --- |
| Named identity | the minimum a dossier can carry |
| Official website | the primary source for what the company does |
| Legal entity name | separates trading brand from registered entity |
| Recorded aliases | dataset spellings resolve to one company, not several |
| Industry classification | a company with no industry cannot be found by sector |
| National taxonomy placement | places the company in the sector tree |
| At least one evidence source | no claim without a source and a checked date |
| Verification within 180 days | a stale dossier is not presented as current |
| Sourced operating location | province is the recruiter's first filter |
| Sourced scale measure | headcount, revenue or sites, verbatim and dated |
| Established footprint band | read an industry by size without inventing one |
| Evidenced capability | what the company operates, not just its sector |
| Corporate relationship | group structure without double-counting headcount |

## Delivery sequence

1. **Ledger first.** A coverage ledger measures the whole universe against the standard, so every
   later batch has a measured before and after (`scripts/atlas-coverage.ts`).
2. **Pipeline before data.** The importer must be able to record a verification decision with its
   evidence gate, so batches cannot half-verify a company. Nothing bypasses
   `organizations:import`; hand-edited JSON is not a delivery mechanism.
3. **Batch research, highest value first.** Companies carrying the most mapped professionals are
   researched first: they are what a recruiter actually reaches. Then sector coverage, then the
   dataset-only employer names.
4. **Every batch gets a review file** under `markets/organizations/research/atlas/` recording
   accepted sources, rejections, conflicts and the measured delta.
5. **Every batch runs the full gate**: `npm test`, `npx tsc -b`, `validate:organizations`,
   `validate:taxonomy`, `atlas:coverage`, production build.

## Batch register

Status as of 4 November 2026. Measured with `npm run atlas:coverage` after every batch.

| Batch | Scope | Status |
| --- | --- | --- |
| 01 | Pipeline: verification gate in the importer, coverage ledger in the build gate | **done** |
| 02 | Employer-identity defects: source notes rendered as companies, identity review queue | **done** |
| 03 | Official-website backfill from sources records already cite (100 records) | **done** |
| 04 | Register identity correction: 3 duplicate curated records merged, redirects kept | **done** |
| 05 | Promotion of the 56 records that already met the gate; 276 verification dates derived | **done** |
| 06 | Financial services core: Absa, Capitec, Standard Bank, Old Mutual, Investec | **done** |
| 07 | Telecoms: MTN, Vodacom | **done** |
| 08 | Professional services, consumer, industrial and retail | next |
| 09 | Dataset-only employer names, highest people count first | planned |
| 10 | Taxonomy placement for the 438 records still unclassified or unlocated | planned |

### Measured position

| Measure | Before | Latest |
| --- | ---: | ---: |
| Universe (organisations shown) | 2,407 | 2,390 |
| Curated register | 632 | 629 |
| Verified | 131 | 191 |
| Official website (curated) | 399 | 497 |
| Verification within 180 days (curated) | 356 | 629 |
| Sourced location | 207 | 211 |
| Sourced scale | 139 | 144 |
| Phantom employers removed from the universe | 16 | 0 |
| Identity review queue | not measured | 75 names / 168 people |

Every remaining shortfall is a research gap, not a modelling one, and each is a named row in
`markets/organizations/research/atlas-coverage.json`.

### What blocks the remainder

- Several official sites (Shoprite, Sasol, EY, KPMG) return no readable address or head office page to
  this tooling. Those companies stay unenriched rather than being filled from an aggregator.
- Most remaining curated records are small MBAWC directory members whose only identity evidence is the
  association's own member PDF. They are promotable, which is why 56 of them now are, but their scale
  and capability fields need per-company websites that the directory does not carry.
- 1,761 dataset-only employer names have no curated record at all. Each needs identity research before
  it can carry anything.

## Explicit non-goals

- No unsourced values, no inferred headcounts, no "approximately" figures presented as fact.
- No automatic promotion of a company to `verified` on the strength of a name.
- No second company directory: everything lands in `markets/organizations/`.
- No fabricated contact details; personal data stays in the private contact directory.
