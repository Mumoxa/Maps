# The Candidate Search Bank — dropping candidates in

The search bank is the recruiter's workspace inside the SA Talent Map: one place where every candidate from a
dedicated client search is stored the same way, filed under that search, and retrievable later by title, skill,
qualification, location, status or rating.

The point is that it never turns into a mess: a candidate is never stored as free text, and it is never stored
without a search attached.

---

## 1. Drop candidates in

Open **`/search-bank`** and use the **Drop candidates in** panel at the top. You can:

- **Paste** a CSV, a JSON list, or plain `Key: value` text copied out of a CV, LinkedIn or an email;
- **Choose a file** (`.csv`, `.json`, `.txt`, `.md`);
- optionally type the search once in **"File these under this search"** if your paste does not name one.

The panel normalises the drop immediately and shows you a preview table — exactly the record shape the bank
will store: name, search, title, employer, location, seniority, skills, qualifications, status, and whether the
candidate is **new** or would **update** someone already in the bank. Anything it could not read is listed with
the reason, and nothing is stored until you import it.

Two buttons carry the normalised drop into the repo:

- **Download normalised CSV** → save it into `incoming/` (git-ignored) or straight into the repo;
- **Copy JSON** → the same records as JSON, if you prefer to keep the drop as a file you can diff.

> The site is a static build with no backend, so the browser can normalise and export but cannot write the
> bank file itself. The import step below is what stores them — and it is the step that keeps the bank
> auditable.

## 2. Store them in the bank

```bash
npm run bank:import -- incoming/drop.csv
```

The importer:

1. normalises every row onto the uniform record (the same normaliser the page uses);
2. files each candidate under its search, **creating the search** if the bank does not have it yet;
3. **updates** anyone already in the bank instead of duplicating them;
4. rewrites `markets/search-bank/bank.json` and writes an audit of the drop to `markets/search-bank/drops/`.

Useful flags:

| Flag | Effect |
|---|---|
| `--search "Name"` | File the whole drop under this search when the rows do not name one |
| `--client "Client"` | Record this client on any search the drop creates |
| `--source "label"` | Override the source label stored on each candidate (default: file name) |
| `--supplied-on YYYY-MM-DD` | Stamp `addedOn` / `updatedOn` (default: today) |
| `--dry-run` | Normalise and report, write nothing |

Then commit `markets/search-bank/bank.json` (and the drop audit) and deploy as usual.

## 3. Retrieve them

`/search-bank` shows the bank as **groups — one per search** — with the search's client, target role, size and
status on the group header. Inside each group, candidates are ordered by your rating, then seniority, then name.

Every candidate card is labelled with:

- the **search** it belongs to (click to filter the bank down to that search);
- **pipeline status** (New → Screening → Shortlisted → Contacted → Submitted → Interviewing → Placed / Archived);
- **title**, **seniority**, **employer**, **location**, **years of experience**, **availability**;
- **skills** and **qualifications** as clickable chips (click to filter);
- your **rating**, **tags**, **notes**, and the date it entered the bank.

Retrieve with:

- the free-text box (name, title, employer, skill, qualification, notes, contact);
- the facet panel — Search, Pipeline status, Seniority, Title, Skill, Qualification, Employer, Province,
  Availability, Rating, Tag — with live counts;
- the URL, which always carries the current filters (bookmark or share a search view);
- **Export … as CSV** to take the current filtered set out of the bank.

## 4. What the normaliser does for you

| You drop | The bank stores |
|---|---|
| `Sandton, Gauteng` / `Cape Town, Western Cape` / `Johannesburg` / `London, UK` | `city`, `province`, `country` + a `locationLabel` |
| `Credit Risk Manager`, `Senior Credit Analyst`, `Head of Credit`, `Chief Risk Officer` | the seniority ladder value (`Lead / Manager`, `Senior`, `Head`, `C-suite`) |
| `bcom hons; ca(sa)` | `BCom (Hons)`, `CA(SA)` |
| `Credit risk; PD modelling; C#, SQL` | `Credit risk`, `PD modelling`, `C#`, `SQL` (de-duplicated, `C#` kept whole) |
| `1 month`, `immediately`, `Negotiable` | `1 month notice`, `Immediate`, `Negotiable` |
| `4`, `4/5`, `80%` | rating `4` |
| `shortlist`, `Submitted` | `shortlisted`, `submitted` |
| `Thabo Mokoena` dropped twice | one record, updated — never a duplicate |
| a table with no header row (`Thabo Mokoena,Credit Risk Manager`) | name + title, read positionally and flagged in the report |
| a plain list of names, one per line | one record per name |

Unknown values pass through unchanged; nothing is guessed. `Key: value` pastes keep multi-line values (a skill
list spread over three lines stays one list).

## 5. Guardrails

- **Never fabricate candidates.** Only drop in people you actually have, with the details you actually have.
- The bank holds personal contact details and recruiter notes — keep it behind the project's private access
  boundary, and never publish a client's live search list.
- Every drop is auditable: `markets/search-bank/drops/<date>-<file>.json` records what was read, added,
  updated, created and flagged, so the bank can always be reconstructed and explained.
- `npm test` covers the normaliser, the merge rules, the CLI and the retrieval facets; `npm run smoke:routes`
  renders every route (including `/search-bank`) to catch runtime breakage before deploy.
