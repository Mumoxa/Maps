# MBAWC workbook import — 22 October 2026 source

The supplied `MBAWC_Members (2).xlsx` is preserved byte-for-byte under
`markets/organizations/import-sources/mbawc-2026-10-22.xlsx`. Its SHA-256 is
`b1c97dfdda3e4077889b8c4e6afda9077cfdcf2cfe72c6d82123a06c432d43f3`.
The adjacent JSON retains every sheet and row, cell value, formula, hyperlink,
number format and merged-cell range. The original workbook retains its other
formatting. README methodology, suggested actions and prior-agent instructions
are archived as source content; they are not executed.

## Imported coverage

- All 346 member rows and their 346 location rows resolve to 345 unique member
  companies in the canonical company register. Source keys 20 and 21 are the
  same AZ Building entity: matching VAT, membership code, domain, address and
  telephone numbers. Both original directory rows remain visible. The different
  contact names remain separate pending identity review.
- All 24 Financial Leadership rows resolve to Accounting & Finance profiles:
  15 existing profiles were enriched and 9 were added. Seven corroborated old
  duplicate records are retained as `REJECTED` records with `merged_into` IDs;
  their complete originals are also retained in the survivor's merge history.
- The workbook reports CA(SA) for 22 people. Anja Griesche and Jan Hugo van der
  Merwe remain unconfirmed/conflicting and do not pass the CA(SA) designation
  filter. Workbook assertions are not independent verification or SAICA
  membership confirmation. Public search carries `source_reported: true` and
  does not label the imported claims as supplied verified facts.
- Every member contact and all seven additional people mentioned only in the
  README/notes are retained in Contacts. General contacts and reference-only
  people are not silently promoted into CA(SA) or verified finance profiles.
- Compass Fire, DPG Construct and Golden Rewards have no supplied categories.
  They remain visible in the Atlas's unclassified branch. Other missing
  activities on company/group names mentioned only in finance notes likewise
  remain unknown.

## Search and linking

In Accounting & Finance, select **Source cohort → MBAWC 2026-10-22**, then
**Professional designation → CA(SA)** for the 22 source-reported CA records.
The equivalent route is
`/accounting-finance?sourceCohort=MBAWC%202026-10-22&qualification=CA%28SA%29`.
Remove the qualification selection to include the two unconfirmed finance
leaders. Full names, corroborated aliases, employers, source notes and cohort
are searchable. Alternate names also reach global Talent Search.

Company membership codes, registration details, categories and directory
fields are searchable in the shared company views. For example, `1ST01`
finds the same canonical company in the Atlas, Companies, Associations and
role-scoped Recruitment Targeting. Source-supported taxonomy placements feed
the existing association rules; membership alone does not create a corporate
partnership, company capability or employee skill.

Finance cards link to canonical company dossiers and correctly filtered
Contacts. Board and group affiliations remain labelled separately from direct
employment. A blank employer on a board-only person does not prevent linking
the sourced board company. Company dossiers retain membership, trading/legal
names, registration/VAT values, addresses, categories, website/certificate
details and the workbook's location-inference caveats.

The workbook's postal-code province and national-reach heuristics are labelled
as inferred directory fields. They are not measured company scale or personal
residence. Company head-office geography does not populate personal geography;
stronger existing individual evidence survives corroborating workbook claims.
Sisandile Thambo's conflicting URL, role and Ghana assignment are retained for
review without replacing the established profile's identity or geography.

Contact names, emails and telephone channels remain in the existing Contacts
dataset rather than being copied into public company facts. **A noindex route
is not authentication.** The repository/source archive and static Contacts
dataset require the project's real access boundary if they are to be restricted;
this import adds no access-control system. The changes are local repository
changes and do not publish or deploy the data.

## Repeatable import

Run commands from the repository root. Re-extraction requires the pinned
`openpyxl` dependency in `requirements-contact-import.txt`; importing the
already-extracted JSON uses only Python's standard library.

```bash
# Optional: re-extract the same original, using a Python with openpyxl installed.
python3 scripts/extract_mbawc_workbook.py SOURCE.xlsx markets/organizations/import-sources/mbawc-2026-10-22.json

# Dry-run; no tracked files are written.
python3 scripts/import_mbawc.py

# Apply only after reviewing the explicit identity/category mapping.
python3 scripts/import_mbawc.py --commit
python3 markets/accountants/gen_people_json.py
python3 markets/accountants/gen_people_index.py
npm run contacts:reconcile
npm run accountants:casa-export

npm test
npm run build
npm run smoke:routes
npm run audit:ui
```

The adjacent `mbawc-2026-10-22-mapping.json` pins both source hashes and records
the identity/merge decisions and exact category-to-taxonomy mapping. A different
workbook needs its own reviewed mapping. The import audit maps every member,
finance row, contact, research-company record and related company ID. Repeating
the current import is a no-op, including stable IDs and audit records.

The source ledgers and generated UI exports remain separate: the importer
updates the authoritative research/contact/company records, and the documented
generators refresh their consumers. The company-contact manifest contains only
company names and aggregated counts, with no contact names, emails or phones.

## Validation performed

The final full suite passed **312 tests, zero failures, zero skipped**. The
production build, 21-route runtime smoke check and isolated 20-route UI audit
passed; the UI audit reported zero findings. Chromium checks exercised the
CA/cohort filters, imported aliases, first-load global search, company searches,
inspectors, canonical dossiers and source-contact links. The importer dry-run
reports no changes after application. An earlier concurrent UI audit saw one
Accounting & Finance title-timing failure; the isolated rerun passed. The build
still reports the existing large-chunk warning. No live third-party identity or
qualification re-verification, push, deployment or publication was performed.
