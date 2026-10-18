# Western Cape CA(SA) Talent Pool Map

This folder documents the Chartered Accountant (CA(SA)) talent-map layer for `Mumoxa/Maps`.

## Scope

- Total named CA(SA)-track professionals in the master dataset: 230
- LinkedIn-verified candidates published in `people.json`: 188 (every published candidate has a valid `linkedin.com/in/` profile URL)
- Remaining 42 records are held in the enrichment backlog until a personal LinkedIn profile is verified — the pack only publishes candidates reachable via LinkedIn
- Geography: Western Cape, South Africa — Cape Town metro & industry, Winelands/Boland, Overberg, Garden Route, Karoo & West Coast, Cape metro suburbs (Bellville, Durbanville, Claremont, Wynberg, Fish Hoek, Milnerton, Sunningdale etc.)
- Segments covered: Big 4, mid-tier international networks (PKF, Moore, Baker Tilly, Nexia, BDO, Grant Thornton, RSM), independent public-practice firms, commerce & industry (retail, banking, insurance, FMCG, property), and public sector (provincial treasury, universities)
- Website route: pending (data-pack stage, same as the initial Salesforce commit)
- Data file: `people.json`

## Coverage By Region (as scanned)

| Region | Towns | Status |
|---|---|---|
| Cape Town metro & Big 4 / industry | Cape Town CBD, Pinelands, Bellville, Kenilworth, Parow, Century City, Rondebosch, Foreshore | Complete |
| Winelands & Boland | Stellenbosch, Paarl, Somerset West, Wellington, Caledon | Complete |
| Overberg & Garden Route | Hermanus, Bredasdorp, George, Mossel Bay, Knysna, Plettenberg Bay, Oudtshoorn | Complete |
| Karoo & West Coast | Worcester, Malmesbury, Ceres, Moorreesburg, Robertson, Saldanha, Vredenburg, Vredendal | Complete |
| Cape metro suburbs deep pass | Bellville, Durbanville, Kuils River, Claremont, Wynberg, Fish Hoek, Green Point, Constantia, Milnerton, Sunningdale | Complete |

## Candidate Eligibility Rule (LinkedIn)

All candidates published in `people.json` must have a **valid personal LinkedIn profile URL** (`https://www.linkedin.com/in/<slug>`):

- LinkedIn URLs are normalised to `https://www.linkedin.com/in/<slug>` (company pages, post URLs and non-LinkedIn links do not qualify).
- Records sourced from firm team pages without a confirmed personal profile are kept in the master CSV dataset but excluded from `people.json` until the profile is verified — an enrichment backlog.
- Enrichment runs as a dedicated pass: search for the person's profile by name + firm + town, confirm the match against the profile preview, then merge the verified URL back into the master CSV and regenerate `people.json`.
- Match provenance is recorded in `Notes` (`LinkedIn match (high|medium): <evidence>`) so uncertain matches can be re-checked before candidate-facing use.

## Field Notes

- `employerType` taxonomy: `Big4`, `Mid-tier-international`, `Independent`, `Industry-Retail`, `Industry-FMCG`, `Industry-Banking`, `Industry-Insurance`, `Industry-Property`, `Public sector`, `Other`.
- `isCA` / `isRA` flags are set from explicit designation evidence (CA(SA) / RA on the profile or firm bio), not inferred.
- `yearsExperience` is numeric when the source states it; `yearsExperienceRaw` preserves the original phrasing (e.g. "~28 (partner since 2002)").
- Every record carries `source` and `confidence` (`high` = firm team page or detailed LinkedIn profile; `medium` = directory or search-result evidence; verification pending).

## Data Quality And Privacy Guardrails

- All records are compiled from publicly available sources: firm team/about pages, public LinkedIn profile summaries, business directories and SAICA-adjacent public pages.
- No email patterns are inferred. Emails appear only where the firm publishes them as partner contact details.
- SAICA's "Find a Member" directory terms prohibit direct marketing use of its data; nothing in this pack is sourced from that directory. This pack is a market-map of publicly identifiable practitioners, not a marketing list.
- Roles, employers and designations sourced from LinkedIn summaries must be re-verified before client-facing or candidate-facing submission. `confidence: medium` records especially need verification.
- Duplicate names across offices (e.g. partners with both Stellenbosch and Hermanus offices) are retained once with the primary practice location; secondary-office presence is noted in the specialization/notes during later enrichment passes.

## Refresh Process

The master dataset is maintained as a deduplicated CSV and converted to `people.json` (LinkedIn-verified candidates only) with the schema used by the talent registry (same shape as `markets/salesforce/people.json`). LinkedIn enrichment passes move candidates from the backlog into the pack; counts in this README are updated in the same commit.
