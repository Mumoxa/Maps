# Candidate Search Bank — recruiter workspace data pack

The private candidate bank behind `/search-bank`. Unlike the public market tracks, this pack is **not** a
market map of South African talent: it is the recruiter's own working store — every candidate dropped in
during a dedicated client search, filed under that search so the bank stays retrievable.

## Where the data lives

| Path | Role |
|---|---|
| `markets/search-bank/bank.json` | The bank: `searches[]` (the groups) + `candidates[]` (the uniform records). The only source of truth. |
| `markets/search-bank/drops/` | One audit file per drop — what was read, added, updated, created and flagged. |
| `templates/search-bank-drop.csv` | The drop template (header aliases are accepted, see below). |
| `incoming/` | Git-ignored staging folder for drops that are not ready to commit. |

## The uniform record

Every candidate — however it was dropped in — is stored as one `BankCandidate`:

| Field | Meaning |
|---|---|
| `id` | Stable id from search + name, so re-dropping the same person **updates** them instead of duplicating |
| `searchId` | Which search the candidate is filed under (the group) |
| `fullName`, `title`, `seniority` | Identity, current title, and the seniority ladder (`Intern / Graduate` → `C-suite`, `Not stated`) |
| `employer`, `location` (`city`/`province`/`country`), `locationLabel` | Where they are and who they work for |
| `skills[]` | What they can do |
| `qualifications[]` | Degrees, designations and certifications (`bcom hons` → `BCom (Hons)`, `ca(sa)` → `CA(SA)`) |
| `experienceYears`, `availability` | Tenure and notice |
| `email`, `phone`, `profileUrl` | Contact + evidence link |
| `rating` | Recruiter assessment, 1–5 |
| `status` | Pipeline: `new` → `screening` → `shortlisted` → `contacted` → `submitted` → `interviewing` → `placed` / `archived` |
| `tags[]`, `notes` | Free-form labels the recruiter adds |
| `source`, `addedOn`, `updatedOn` | Where the record came from and when it first entered the bank |

A `SearchBrief` is one dedicated client search: `name`, `client`, `role`, `openedOn`, `status`
(`active` / `on-hold` / `filled` / `closed`) and `notes`. Searches are created automatically the first time a
drop names them, so a candidate is never left without a group.

## Ingest

```bash
npm run bank:import -- incoming/drop.csv                       # CSV
npm run bank:import -- incoming/drop.json                      # JSON array
npm run bank:import -- incoming/pasted.txt --search "Credit Risk Manager — FirstRand" --client FirstRand
npm run bank:import -- incoming/drop.csv --dry-run             # normalise and report, write nothing
```

Accepted drop formats:

- **CSV / TSV-style table** — header row, one candidate per row. Column names are matched case-insensitively
  against a wide alias table (`name` / `full name` / `candidate`, `title` / `job title`, `skills` / `key skills`,
  `qualifications` / `education`, `location` / `city, province`, `search` / `brief`, `linkedin` / `profile url`, …).
- **JSON** — an array of candidate objects, or `{ "candidates": [...] }`. Array values are joined with `; `.
- **Pasted text** — blank-line separated blocks of `Key: value` lines (what you get copying out of an email);
  a bare first line is read as the candidate's name.

Merge behaviour: new candidates are appended, existing ids are updated in place (blank columns never wipe
stored values, `addedOn` is preserved), unknown searches are created, and the same person appearing under two
different searches is kept under both and listed under `crossSearchMatches` in the report.

## Privacy boundary

The bank holds **personal contact details and recruiter notes about identifiable people**, and it exposes a
client's live search list. It must stay behind the project's private access boundary: do not publish it, do
not share a client's search list, and drop nothing in that you would not be comfortable defending to the
candidate. Only public professional information plus what the recruiter supplied should ever be stored.

## App layer

`src/data/searchBank/` (types → normalise → ingest → bank) → `/search-bank`
(`src/pages/SearchBankPage.tsx`). The same normaliser powers the in-page drop panel and the CLI, so a
candidate stored either way is stored identically. Tests: `tests/search-bank.test.ts`.
