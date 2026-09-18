# South Africa Qualified Accountant & Finance Skills Intelligence Map

Persistent, evidence-backed national talent-mapping project for **professionally qualified
accountants and finance professionals across South Africa**.

This folder is the primary persistent research database for the project. It follows the
`markets/<slug>/` data-pack convention used elsewhere in `Mumoxa/Maps`, but the authoritative
research stores here are **append-only JSONL research databases**, not the web-UI `people.json`
export yet.

## Live research stores (append-only, primary)

| File | Purpose |
|---|---|
| `people.jsonl` | One JSON object per line per person. The person master database. |
| `companies.jsonl` | One JSON object per line per employer / training office. |
| `sources.jsonl` | One JSON object per line per evidence source. |
| `interim.csv` | Filterable one-row-per-person export, regenerated at checkpoints. |

## Working / governance documents

| File | Purpose |
|---|---|
| `scope.md` | Project scope, target population, geographic scope, data-version decisions. |
| `qualification_rules.md` | The qualification truth model, safe-assumption matrix, rejection rules. |
| `skills_taxonomy.md` | Controlled vocabularies for functions, skills, systems, industries. |
| `schema.md` | Exact JSONL field schemas for people / companies / sources. |
| `progress.md` | Running totals, coverage matrix, blockers, outstanding avenues. |
| `search_queries.md` | Executed search log (engine, date, target, yield, exhaustion). |
| `people_index.md` | **Master name registry (dedup source of truth) — consult FIRST before adding anyone.** |
| `gen_people_index.py` | Regenerates `people_index.md` from the JSONL stores after every batch. |

> **Dedup rule:** every future batch must consult `people_index.md` first. If a name/company/
> source is already listed there, enrich the existing record instead of adding a new one.

## Evidence standard (non-negotiable)

- Every material claim carries evidence, normally a source URL recorded in `sources.jsonl`.
- Claims are labelled `CONFIRMED` / `INFERRED` / `UNCONFIRMED` / `UNKNOWN` / `CONFLICTING`.
- A professional designation does **not** automatically prove a specific articles/training route.
- ACCA PER and CIMA PER are practical-experience frameworks, **not** "articles".
- People with confirmed articles but unverified designation are retained separately
  (`status = ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED`).
- No fabricated LinkedIn URLs, employers, locations, skills, or systems.
- Employer ERP systems are captured as `employer_systems_observed`, never as `person_systems_confirmed`
  without individual-level evidence.

## Privacy boundary

Public professional information only. No contact details, ID numbers, home addresses or private
accounts. Records are attached to identities only on evidence, never on name similarity alone.

## Website layer (built)

This research database now powers the **Accounting & Finance** talent track in the web UI
(route `/accounting-finance`, registered in `src/data/tracks.ts`). The pipeline is:

```text
people.jsonl  →  python3 gen_people_json.py  →  people.json  →  src/data/accountantsPeople.ts
              →  adaptAccountantCandidates (src/data/marketData/adapters.ts)
              →  talentSearch.ts (global /talent-search)  +  src/pages/AccountantsPage.tsx
```

The append-only JSONL files remain the **source of truth** and must never be overwritten by the
export step. `gen_people_json.py` only derives the read-only `people.json` the UI imports; rerun it
after every batch. Records with `status = REJECTED` are excluded from the export; every other
retained status is published with its status carried through so the UI can label it.

For the full end-to-end contributor workflow (adding people here, or adding a brand-new track), see
[`docs/adding-to-the-talent-map.md`](../../docs/adding-to-the-talent-map.md).
