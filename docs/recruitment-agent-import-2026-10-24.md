# Recruitment Agent research transfer — 24 October 2026

The public evidence from `D:\Recruitment Agent` is imported into the existing
Accounting & Finance research store and canonical company register. The source
research ran through 23 October 2026. This transfer does not independently
recheck the cited external pages, professional membership or current employment.

## Imported results

- **11 distinct production candidate records:** six added profiles and five
  enriched existing profiles. The older progress report claims 12; the actual
  production CSV has 11 named rows. Azelle Vreij is mentioned in the report but
  is not an additional production CSV record and has not been silently invented
  as a twelfth candidate.
- New profiles: Stefan du Toit, Ruard Nel, Marinus Prinsloo, Zack Humphreys,
  Xola Mxhalisa and Shaun Williams.
- Enriched profiles: Dawid Brink, Lene Dippenaar, Pieter Toerien,
  Ernst van Vondel and Clarinda Engelbrecht.
- Five duplicate legacy records for four of those people were merged on the
  same canonical LinkedIn `/in/` identity. Original records survive in merge
  history and as rejected records with survivor IDs. They are not new leads.
- Nine profiles carry a source-reported CA(SA) claim. Ruard Nel and Shaun
  Williams retain unknown designations and do not pass the CA(SA) filter.
  A credential number or public qualification claim is not active SAICA
  membership confirmation. Existing stronger evidence is retained.
- All **27 employer rows** resolve to canonical organizations: 14 added to the
  curated register and 13 existing organizations enriched. The source's
  geographic exclusions remain local search decisions; they do not become
  global employer exclusions in Maps.
- The source snapshot also retains a ranked industry overlap map using the
  existing taxonomy. Company context does not establish an employee's skills,
  individual project responsibilities, remuneration or availability.
- Previously confirmed personal geography takes precedence over the newer
  source-reported location text, which remains preserved in the source record.

## Find the research

In Accounting & Finance, use **Source cohort → Recruitment Agent 2026-10-23**:

`/accounting-finance?sourceCohort=Recruitment%20Agent%202026-10-23`

Add the CA(SA) designation filter to see nine source-reported qualification
claims. Leave it off to include the two profiles with unknown designations.
The same profiles are available through Talent Search, and their employers
resolve through the company directory and Atlas. No new page or filter was
needed.

## Provenance and privacy

The reviewed public snapshot is
`markets/organizations/import-sources/recruitment-agent-2026-10-24.json`.
Its adjacent import audit records every production row, canonical company,
person ID, addition, enrichment and duplicate merge. The audit pins the public
snapshot's SHA-256; the snapshot lists hashes and byte counts of the 25 original
workspace files.

All 25 originals are preserved byte-for-byte in the ignored local directory
`.local/recruitment-agent/2026-10-24/`, including the original baseline files,
full operational report, vacancy context, ranked employer assessments,
screening decisions, previous interactions and contact priorities. The user
selected **public evidence only** for publication. Internal screening and
recruiter feedback are therefore excluded from this new public source snapshot.
This local backup is not an online private storage service.

Seven candidate rows omit the screening column; five company rows contain
unquoted commas. The reviewed snapshot restores the intended field boundaries
without changing any original file. Historical contact priorities are not
promoted into current recommendations. Public records carry
`source_reported: true`; the transfer date is not a fresh external verification
date. Newly added records retain the source research date, with the caveat
visible in their evidence and notes.

## Reproduce and verify

```sh
python3 scripts/import_recruitment_agent.py             # dry-run
python3 scripts/import_recruitment_agent.py --commit    # apply reviewed snapshot
python3 markets/accountants/gen_people_json.py
python3 markets/accountants/gen_people_index.py
npm run accountants:casa-export
npm run contacts:reconcile
npm test
npm run build
npm run smoke:routes
npm run audit:ui
```

The importer refuses an unreviewed identity collision or changed published
snapshot. Replaying the current snapshot is a no-op. The repository's normal
CI and Cloudflare workflow control online publication after the upload.

Local verification: the full test run passed 315 of 317 tests; the two failures
were byte comparisons against unchanged files checked out with Windows CRLF
line endings. Testing the committed LF bytes passed all 38 affected import and
taxonomy tests, after which the original checkout bytes were restored. The
21-route smoke check passed. Final CI remains the full-suite publication gate.
