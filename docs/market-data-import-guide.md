# MAPS Verified Market Data Import Guide

Use this workflow for every new person added to Credit Risk, Salesforce, SAP ERP, Murex,
Calypso, or a future registered MAPS track. Verification happens before import; MAPS has no
verification queue.

## 1. Prepare the CSV

Copy the standard template into the ignored local `incoming/` folder:

```bash
mkdir -p incoming
cp templates/market-profile-import.csv incoming/2026-08-01-salesforce.csv
```

Populate one row per verified person. The columns are:

| Column | Format |
|---|---|
| `name`, `title`, `company`, `seniority`, `summary` | Required text |
| `city`, `province`, `country` | Required location text |
| `skills`, `sectors`, `specialisms` | One or more values separated by semicolons |
| `linkedinUrl` | Canonical identity URL using HTTPS |
| `sourceUrl` | HTTPS evidence URL |
| `sourceType` | Short label such as `linkedin`, `company-profile`, or `conference` |
| `evidence` | Short note stating exactly what the source proves |
| `checkedOn` | ISO date: `YYYY-MM-DD` |
| `supersedesId` | Blank for additions; prior same-track profile ID for corrections |
| `attributes` | JSON object for track-specific facts, for example `{"clouds":["Sales Cloud"]}` |

Do not add a row unless you have checked the source and are supplying it as verified. The
importer validates evidence declarations and structure; it does not browse sources or judge
whether a claim is true.

## 2. Import the complete batch

```bash
npm run market:import -- \
  --track salesforce \
  --file incoming/2026-08-01-salesforce.csv \
  --batch 2026-08-01-salesforce-technical-leads \
  --supplied-on 2026-08-01
```

The command:

1. reads every row;
2. generates stable track-scoped IDs from canonical identity URLs;
3. checks the batch against legacy profiles and all published batches;
4. rejects missing evidence, invalid dates or URLs, duplicate identities, and invalid corrections;
5. writes one immutable JSON file only if the whole CSV passes.

If one row fails, no batch file is created.

## 3. Re-import and corrections

Running the same command with identical content returns `unchanged` and does not modify the file.
Reusing the same batch ID with changed content fails.

Do not edit a published batch. Correct a profile in a new batch and place the prior public profile
ID in `supersedesId`. Corrections must remain within the same track and one profile may be
superseded only once.

## 4. Verify before committing

```bash
npm run validate:data
npm test
npm run build
```

The validator reports derived profile totals by track. Counts and distributions in the product
come from the shared registry, so a valid batch updates search and track readiness without page
code or manual count changes.

Review the generated file under:

```text
markets/<track-slug>/batches/<batch-id>.json
```

Commit the generated batch and any intentional documentation changes. Do not commit the source
CSV or other working files from `incoming/`.

## Legacy exception

The retained Credit Risk dataset contains one historical placeholder URL on record `SA-CR-009`.
Validation reports it as a warning to preserve the existing dataset. This exception applies only
to that legacy record; new batches require valid HTTPS identity and evidence URLs.
