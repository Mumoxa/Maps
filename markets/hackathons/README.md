# SA Hackathon Contestants — Talent Pool data pack

Candidate pool for the Maps talent pool, generated from the **SA Hackathon Census**
(`hackathon-census/` in this repository) — a public-source, evidence-linked census of South African
hackathon participants, winners and placed teams.

## Scope (Phase 5 of the census, 2026-08-26)

| Metric | Value |
|---|---|
| Candidates in `people.json` | 342 (category **Candidate**, segment **Hackathon contestants**) |
| Census unique individuals | 347 |
| Excluded from the talent pool | 5 — one pseudonymous record and four single-name-only roster listings (retained in the census CSVs; they cannot be meaningfully matched or contacted) |
| Winners in pool | 197 (winning-team members; team membership individually evidenced) |
| Event editions covered | 115 (2012 → 2026-08) |
| Evidence | every candidate keeps participation history + source URLs |

## Fields

`id`, `censusPersonId` (cross-ref to census `Person_ID`), `fullName`, `category`, `segment`,
`bestTier`, `bestResultLabel`, `winner`/`top3`/`top10`, `events[]` (event, edition, year, placement,
tier, team, project, award, city, province, evidenceUrl), `organisationAtTime`,
`universityAtTime`, `province` (**event province — where the person competed, not their residence**),
`confidence`, `evidenceUrl`, `notes`, `source`.

## Privacy boundary

Public professional information only. No contact details, addresses, ID numbers or private accounts.
No profile is attached on name similarity alone (§8 two-signal rule); profile columns stay empty until
verified. Pseudonymous participants are never deanonymised.

## Regenerate

```bash
python3 scripts/generate_hackathon_candidates.py
```

App layer: `src/data/hackathonPeople.ts` (adapter) → `/hackathons` page
(`src/pages/HackathonTalentPage.tsx`), registered as the "Hackathon Talent" track in
`src/data/tracks.ts` (scope: South Africa / talent-pool / evidence status: source-retained census).
