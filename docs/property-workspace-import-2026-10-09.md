# Property workspace import — 9 October 2026

## Objective and current baseline

This import builds on the industry-first Atlas already merged into `main` at commit `8df1e4c`. It does **not** replay the superseded documentation-only audit patch, restore CCS Logistics as a focal company, add a second incompatible Property Atlas UI, or overwrite previously curated company records.

The workspace ZIP contains a pre-Atlas snapshot and `uploads/Info.csv`. Despite the `.csv` extension, `Info.csv` is an AI-session transcript with code snippets and draft JSON, not a sourced market-data export.

## What is imported into the live canonical register

Fourteen additional property-related organisations were matched to direct company publications and inserted as `Organization` records in `markets/organizations/organizations.json`:

- Atterbury Property — [company source](https://www.atterbury.co.za/)
- Calgro M3 — [company source](https://www.calgrom3.com/2026/05/18/calgro-m3-makes-excellent-progress-at-bankenveld-district-city-development/)
- Zenprop Property Holdings — [company source](https://zenprop.co.za/about-zenprop/)
- Amdec Group — [company source](https://www.amdec.co.za/our-business/)
- Abland — [company source](https://abland.co.za/developments/)
- Fortress REIT — [company source](https://fortressfund.co.za/)
- Century Property Developments — [company source](https://century.co.za/)
- Craft Homes — [company source](https://crafthomes.co.za/developments/)
- Eris Property Group — [company source](https://eris.co.za/)
- Divercity Urban Property — [company source](https://www.divercity.co.za/portfolio/current-developments/)
- Blok — [company source](https://blok.co.za/)
- Dube TradePort Corporation — [company source](https://www.dubetradeport.co.za/index.php/our-business/dube-tradezone)
- Improvon — [company source](https://improvon.co.za/)
- Evergreen Lifestyle — [company source](https://www.evergreenlifestyle.co.za/poised-for-growth-evergreen-lifestyle-expands-across-the-western-cape/)

**Verification scope:** their names, direct development or adjacent property activities, and carefully selected places explicitly found in those sources. `status: verified` records that specific source-backed company record; it does not certify every potential fact about the group or every entity with a similar name.

No unsourced metrics were copied from the transcript. No ownership percentages, funding arrangements, legal entity names, group-scale figures, project valuations, number-of-employees estimates or supposed rankings were imported. This avoids confusing a property fund with a developer merely because it owns assets.

The company register increases from **96** to **110** curated entries on this branch. The normal `useCompanyUniverse` composition path exposes those records in the current Industry Atlas and company directory once this change is merged and deployed.

## Research queue (not auto-published)

`markets/organizations/research/property-workspace-leads-2026-10-09.json` preserves:

- **81** name-level company / organisation leads present in the transcript (the transcript incorrectly claimed **147**).
- **16** project name leads.
- **28** names now matched to a canonical record in this branch (existing plus the 14 added above).
- **53** unmatched names held for further research.
- Original candidate website strings, labelled **unverified discovery hints**, not references supporting company facts.

A research lead may be a property investor, listed REIT, construction division, public development agency, housing regulator, project name or trading name rather than a standalone private developer. The intake therefore must not be bulk-cast into verified company entities, or automatically assigned an industry branch.

The 16 projects have not been inserted as first-class entities: the published company-intelligence schema does not yet have a dedicated development-project registry. Claims about project value, status, participants, geography and dates are deliberately absent until a claim-level source and appropriate data model exist.

## Follow-up work

1. Resolve remaining lead identities, legal versus trading status, and aliases against direct official sources. Reject non-entities and duplicates without deleting the original intake.
2. Research project-to-developer and source-to-fact relationships with evidence URLs, as-of dates, project stages, geographic locations and scope.
3. Extend the national taxonomy or project data contract only where current nodes cannot represent observed operations. Do not reintroduce a parallel taxonomy.
4. Promote reviewed rows incrementally into `organizations.json`, preserving original IDs and running the canonical validators and CI.
5. Check deployed Atlas route and CI build after this PR merges. This upload changes data only; it does not itself attest to a production deployment.

### Verification

The import checks canonical identity collisions and that all new `industryId` values exist in the present `industries.json`. Every new confirmed industry placement has its own evidence statement, URL and `checkedOn` date; no claims of full South African market coverage are made.
