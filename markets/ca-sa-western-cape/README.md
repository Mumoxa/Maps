# Western Cape CA(SA) Talent Pool Map

This folder documents the Chartered Accountant (CA(SA)) talent-map layer for `Mumoxa/Maps`.

## Scope

- Total named CA(SA)-track professionals analysed: 133
- Geography: Western Cape, South Africa — Cape Town metro, Winelands/Boland, Overberg, Garden Route, with Karoo/West Coast and metro-deep scans in progress
- Segments covered: Big 4, mid-tier international networks (PKF, Moore, Baker Tilly, Nexia, BDO, Grant Thornton, RSM), independent public-practice firms, commerce & industry (retail, banking, insurance, FMCG, property), and public sector (provincial treasury, universities)
- Website route: pending (data-pack stage, same as the initial Salesforce commit)
- Data file: `people.json`

## Coverage By Region (as scanned)

| Region | Towns | Status |
|---|---|---|
| Cape Town metro & Big 4 / industry | Cape Town CBD, Pinelands, Bellville, Kenilworth, Parow, Century City, Rondebosch, Foreshore | Complete |
| Winelands & Boland | Stellenbosch, Paarl, Somerset West, Wellington, Caledon | Complete |
| Overberg & Garden Route | Hermanus, Bredasdorp, George, Mossel Bay, Knysna, Plettenberg Bay, Oudtshoorn | Complete |
| Karoo & West Coast | Worcester, Malmesbury, Saldanha, Beaufort West etc. | Scan launched |
| Cape metro suburbs deep pass | Bellville, Durbanville, Claremont, Goodwood, Sea Point etc. | Scan launched |

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

The master dataset is maintained as a deduplicated CSV and converted to `people.json` with the schema used by the talent registry (same shape as `markets/salesforce/people.json`). Remaining regional scans (Karoo/West Coast, metro deep pass) will be appended and this README's counts updated in the same commit.
