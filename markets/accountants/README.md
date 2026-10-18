# South Africa Accounting & Finance Skills Intelligence Map

Persistent, evidence-backed national talent-mapping project for **finance professionals from bookkeeper-equivalent level through Finance Director / CFO across South Africa, with professional qualifications and training routes recorded where publicly verified**.

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

## Population and evidence standard (non-negotiable)

- The wider population includes source-verified finance professionals from bookkeeper-equivalent level upward, whether professionally designated or not.
- Professional qualification, body registration and articles/training route are independent evidence fields, not inclusion assumptions.
- Closed company sweeps must record an explicit outcome for every target employer; zero-result companies are not omitted.

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

## CA(SA) inventory (derived, partial)

Run `npm run accountants:casa-export` after any change to `people.jsonl` to regenerate
[`ca_sa_inventory.csv`](./ca_sa_inventory.csv) and the [coverage and gaps report](./ca_sa_coverage.md).
The export includes only records explicitly tagged `CA(SA)` (never people inferred from a name,
profile slug, articles or an employer), excludes `REJECTED` rows, and distinguishes confirmed
from high-confidence designation evidence. It includes a country/location assessment: the default
`South Africa` country in the research DB **does not establish a person's residence**. An
out-of-country record remains in the CSV, labelled `OUTSIDE_SA`, to make the exclusion auditable.
Blank LinkedIn and employer values remain blank. A missing industry is supplied only for an
**exact, unique employer-name match** with an industry and source URL in `companies.jsonl`;
`industry_basis` and `industry_source_url` disclose this employer-level derivation. All other
unknown industries stay blank. Source titles explicitly marked "not stated" are exported as
blank, not as job titles. Sources and per-person check dates are retained. This is a **research
inventory, not a SAICA member register or an exhaustive national CA(SA) census**. See the report
for current counts, missing fields and requirements for reconciling an authorised complete roster. Do not add licensed member lists to this public repo
without publication rights.

## Private CA(SA) roster reconciliation (tool available; no roster supplied)

Once a rights-cleared, current roster is available, reduce it **outside this public repo** to
[`templates/ca-sa-roster-reconciliation.csv`](../../templates/ca-sa-roster-reconciliation.csv):
`full_name,public_profile_url`. The profile URL is optional, but when present it must be a
person's **individually verified public LinkedIn URL**, not a URL guessed from their name. Do not
include SAICA membership numbers, national IDs, email addresses, phone numbers or other extra
columns. If the original source provides no LinkedIn URL, leave that cell blank; a name match is
**never** enough to link two identities.

Place the reduced roster under ignored `.local/casa/` (or use an external private volume), then:

```sh
npm run accountants:casa-reconcile -- .local/casa/roster.csv --as-of=2026-10-14 --scope=resident-in-sa --source-reference=approved-roster-date --rights-confirmed
npm run accountants:casa-reconcile -- .local/casa/roster.csv --as-of=2026-10-14 --scope=resident-in-sa --source-reference=approved-roster-date --rights-confirmed --write
```

Use the roster's actual check date, scope (`resident-in-sa` or `working-in-sa`) and a non-sensitive
source reference, not the example values above. `--rights-confirmed` asserts the operator's
permission to use the data; it is **not** a licence. The first command is an aggregate-only
**dry run**; the second writes `.local/casa/reconciliation.csv` and `summary.json` with private
file permissions. No personal roster rows are printed to the terminal or put into `people.jsonl`,
`people.json`, the website, or Git. `.local/` is Git-ignored and excluded from Arena snapshots;
retain the approved original in your authorised storage system.

Every input row appears once in the private ledger. Exact, canonical person-profile URL **and**
conservatively normalised name may link an existing research record; a name-only hit or a URL/name
conflict stays in the review queue. A link is *not* proof of active membership, SA residence,
accurate employment, or a verified CA(SA) designation; the ledger carries separate evidence and
missing-field statuses. Unlike the public CSV, the private ledger reads person-record industry
only; employer-catalogue sectors never count as verified per-person industry. The supplied
roster's completeness is not proved by this tool. Curators must investigate unresolved rows and
promote only source-verified, publication-permitted facts through the normal `people.jsonl`
workflow, then regenerate the public export.
