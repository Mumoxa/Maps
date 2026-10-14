# CA(SA) research inventory — coverage and gaps

**This is not a complete register of all CA(SA)s in South Africa.** It is a derived snapshot of the existing Accounting & Finance research pool (`people.jsonl`), which covers in-scope finance roles, not all members or professions. No authoritative SAICA membership roster has been supplied; the total population and coverage percentage are **unknown**. Exporting does not re-check the underlying sources.

- CA(SA)-tagged, non-rejected research records: **135** (including records outside South Africa).
- Records labelled South Africa in the research DB: **134**. This is not a verified resident count: `country` may default to South Africa.
- Of SA-labelled records, designation confirmed in the recorded public evidence: **126**; designation needs further confirmation: **8**. This does **not** establish currently active SAICA membership.
- SA-labelled location assessments: **38** confirmed; **50** high confidence (may be employer-based); **46** not evidenced. **1** additional records are explicitly outside South Africa; **0** have no country.
- Latest recorded per-person source-check date in this subset: **2026-09-20**. Titles and employers may have changed since their individual check dates.
- Industry supplied from an exact, uniquely named employer in the existing sourced company catalogue: **11** SA-labelled records. This is employer-sector context, **not a personally verified specialism**, and the company sources were not rechecked during export. Other industries come from the person research record.

## Missing details among SA-labelled records

| Field not recorded / not established | Records |
|---|---:|
| Title | 15 |
| Employer | 15 |
| Industry | 33 |
| LinkedIn profile URL | 78 |
| SA location evidence | 46 |

See [ca_sa_inventory.csv](./ca_sa_inventory.csv) for one row per recorded person, with a research ID, name, title, employer, industry (with basis and a separate employer source URL when derived), **actual** LinkedIn URL where recorded, sources, last-checked date, designation status and location assessment. Blank cells mean **unknown**, not "unemployed" or "no LinkedIn"; research titles explicitly marked "not stated" are exported as blank. The CSV also retains out-of-scope country rows, explicitly flagged, so they cannot silently inflate the SA total. It contains public professional information only; no contact details, ID numbers or inferred profile URLs.

## To work toward a genuinely complete account

1. Obtain a current, **authorised** SAICA member/registrant roster, with permission for this use and a scope definition (active vs inactive; resident vs employed in SA; reporting date). Do not scrape gated directories or LinkedIn.
2. Use the private `npm run accountants:casa-reconcile` workflow on a rights-cleared roster to account for **every supplied row** against the existing research pool. It links only an exact, curator-verified person-profile URL **and** matching name; name-only hits remain for human review. No roster has been supplied or processed here. Keep licensed data out of the public repository. Record unmatched people and ambiguous identities as gaps, not invented records.
3. For each matched person, verify designation, SA location, role, employer, industry and profile URL independently; store field-level sources and check dates. Allow corrections and removal requests, and recheck changing employment details on a defined cadence.
4. Only claim population coverage once the authorised roster, rights, inclusion rules, reconciliation outcomes and unmatched counts have been audited. Missing LinkedIn profiles cannot be manufactured to fill gaps.

Regenerate after updating the research DB with `npm run accountants:casa-export`. This report and CSV are derived artifacts; `people.jsonl` remains the source of truth.
