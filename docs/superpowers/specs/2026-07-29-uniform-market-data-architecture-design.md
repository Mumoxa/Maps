# Uniform Market Data Architecture Design

**Date:** 29 July 2026
**Status:** Implemented; final branch verification pending
**Scope:** Credit Risk, Salesforce, SAP ERP, Murex, Calypso, and future MAPS markets

## Objective

Standardise MAPS so every future source-verified addition follows one data contract and can be added repeatedly without rewriting pages, manually changing counts, creating duplicate people, or changing existing market-specific source files.

Verification happens before data is supplied to MAPS. MAPS validates the structure and the supplied verification evidence; it does not independently research, approve, or hide records in a verification queue.

## Decision

Use a shared append-only batch format for all new profiles, combined with adapters for the existing Credit Risk and Salesforce datasets.

This approach was selected over:

1. **Migrating all existing data into one large file.** This would look uniform immediately, but it would create a high-risk rewrite, large merge conflicts, and poor provenance for later additions.
2. **Moving MAPS to a database and API.** This would support much larger runtime volumes, but it adds hosting, authentication, migration, backup, and operational complexity that the current static Vite product does not need.
3. **Keeping separate market-specific importers.** This would be quick for the next addition, but schema drift and duplicated logic would continue.

The selected batch-and-adapter design gives MAPS one future-facing standard without discarding working source data.

## Architecture

### Existing data

- Credit Risk continues to load from the current root JSON files through a Credit Risk adapter.
- The 88 retained Salesforce records continue to load from `markets/salesforce/people.json` through a Salesforce adapter.
- Existing source IDs remain unchanged inside their source files.
- The unverified manual Salesforce correction remains preserved as source history, but it is excluded from the shared source-verified talent registry until it is replaced by a complete verified record.

### New additions

Every new addition is stored in:

```text
markets/<track-slug>/batches/<batch-id>.json
```

Examples:

```text
markets/salesforce/batches/2026-08-01-salesforce-technical-leads.json
markets/murex/batches/2026-08-15-murex-consultants.json
```

Each file is immutable after publication. Corrections are supplied as a later batch with an explicit `supersedesId`; history is not silently overwritten.

At build time, Vite loads all batch files with one shared loader. Market pages, global talent search, track counts, company distributions, location distributions, and skill distributions use the combined adapter-plus-batch registry.

## Shared Batch Contract

Each batch has this shape:

```json
{
  "schemaVersion": 1,
  "batchId": "2026-08-01-salesforce-technical-leads",
  "trackSlug": "salesforce",
  "sourceFile": "Salesforce Technical Leads 2026-08-01.csv",
  "suppliedOn": "2026-08-01",
  "records": []
}
```

Each record has this shape:

```json
{
  "id": "salesforce-3f88d2c9b74a",
  "name": "Example Person",
  "title": "Salesforce Technical Lead",
  "company": "Example Company",
  "location": {
    "city": "Cape Town",
    "province": "Western Cape",
    "country": "South Africa"
  },
  "seniority": "Lead / Manager",
  "skills": ["Salesforce", "Apex"],
  "sectors": ["Salesforce"],
  "specialisms": ["Technical Leadership"],
  "summary": "Evidence-based description of the person's relevant experience.",
  "linkedinUrl": "https://www.linkedin.com/in/example-person",
  "sources": [
    {
      "url": "https://www.linkedin.com/in/example-person",
      "type": "linkedin",
      "evidence": "Profile identifies the person, current role and Salesforce experience.",
      "checkedOn": "2026-08-01"
    }
  ],
  "suppliedAsVerified": true,
  "supersedesId": null,
  "attributes": {
    "clouds": ["Sales Cloud"],
    "certifications": ["Platform Developer I"]
  }
}
```

### Required fields

The importer rejects a batch unless every record has:

- a schema version and registered track slug;
- a stable ID;
- name, current title, company, location, seniority, and summary;
- at least one skill, sector, and specialism;
- at least one resolvable `https` evidence URL;
- a short evidence note explaining what the source proves;
- an ISO evidence-check date;
- `suppliedAsVerified: true`.

`attributes` holds market-specific facts without changing the shared profile contract. Examples include Salesforce clouds and certifications, SAP modules, Murex domains, Calypso modules, or Credit Risk product areas.

## Stable Identity and Duplicate Prevention

For new records, the importer generates the ID from:

```text
<track-slug>-<12-character hash of the canonical identity URL>
```

The identity URL is the normalised LinkedIn URL when present; otherwise it is the first evidence URL. Tracking parameters, fragments, trailing slashes, host casing, and equivalent LinkedIn URL forms are removed before comparison.

Validation rejects:

- duplicate IDs;
- duplicate canonical LinkedIn URLs;
- duplicate canonical identity URLs;
- the same person repeated within one batch;
- an identity already present in a legacy adapter or earlier batch;
- a `supersedesId` that does not exist or belongs to another track;
- a reused batch ID with different content.

Duplicate names alone produce a review warning rather than rejection because different people can share a name. A duplicate name combined with the same normalised company and title is rejected unless the record explicitly supersedes the earlier profile.

## Continuous Addition Workflow

The supported source format is the standard MAPS CSV template. Excel users can maintain the template in Excel and export the populated sheet as CSV before import.

The command is:

```bash
npm run market:import -- --track salesforce --file ./incoming/salesforce-leads.csv --batch 2026-08-01-salesforce-technical-leads
```

The workflow is atomic:

1. Read and normalise the full source file.
2. Validate every row and all evidence declarations.
3. Compare identities against every legacy record and published batch.
4. Show accepted count, warnings, errors, and derived track totals.
5. Write one immutable batch file only when the entire batch passes.
6. Run repository-wide data validation and the production build.

If any row fails, no batch file is written. Re-running the same batch with the same content makes no changes. Reusing the same batch ID with different content fails and requires a new correction batch.

## Validation Layers

### Import validation

Provides row-specific errors before a batch is created. It checks the contract, required evidence declarations, URL/date formats, registered values, duplicates, and correction references.

### Repository validation

`npm run validate:data` scans all legacy adapters and every batch. It fails on structural errors, identity collisions, unregistered tracks, invalid correction chains, and manual summary/count files that contradict derived data.

One inherited Credit Risk record (`SA-CR-009`) contains the legacy placeholder `Search required`
instead of a resolvable profile URL. Repository validation reports this as a visible legacy warning
so the existing 344-record dataset remains intact. The exception does not weaken new-batch rules:
every new identity and evidence URL must be valid HTTPS or the entire import fails.

### Build validation

`npm run build` runs `validate:data` before TypeScript and Vite. Invalid market data therefore cannot produce a successful deployment.

The validator confirms that supplied evidence fields exist and are well-formed. It does not browse sources or independently determine whether the information is true; that responsibility remains with the person supplying the verified batch.

## Derived Data

The shared registry calculates at build/runtime:

- total profiles by track;
- companies and profiles per company;
- locations;
- seniority;
- skills and specialisms;
- source coverage;
- legacy-versus-batch provenance;
- correction/supersession state.

No market page may hard-code profile totals or distributions. Existing narrative figures that cannot be derived from the profile registry must be labelled as separate market intelligence with their own source and as-of date.

## Uniform Product Behaviour

Every market track uses:

- the same shared profile type;
- the same search and filter field names;
- the same profile card and source/evidence display;
- the same empty-state behaviour;
- the same calculated summary model;
- the same import and validation commands;
- the same track registry and terminology.

Track-specific landing-page content may remain different where the market genuinely requires it. Uniformity applies to data contracts, provenance, search behaviour, counts, and additions—not to forcing all markets to have identical editorial content.

## Failure Handling

- Import errors identify the file, row, field, and reason.
- Validation never partially writes a failed batch.
- Existing published batches are not edited by the importer.
- A failed build leaves the prior deployed site unchanged.
- Unsupported columns are preserved only inside `attributes` when explicitly mapped; otherwise they are reported rather than silently discarded.
- Conflicting correction chains fail validation.

## Testing

Automated tests cover:

- valid CSV-to-batch conversion;
- missing source, evidence note, date, or verification attestation;
- URL canonicalisation;
- deterministic ID generation;
- duplicate detection within a batch and across legacy data;
- idempotent re-import;
- changed content under an existing batch ID;
- atomic failure with no output file;
- valid and invalid `supersedesId` chains;
- derived counts from mixed legacy and batch data;
- all registered market tracks loading through the shared registry.

Repository verification includes the complete data test suite, `npm run validate:data`, TypeScript strict compilation, the Vite production build, and a scan for hard-coded profile totals in market pages.

## Success Criteria

The architecture is ready for continuous additions when:

1. one valid batch can be imported into any registered market with the same command and template;
2. importing it again creates no duplicates or file changes;
3. invalid evidence or duplicate identities block the whole batch with row-specific errors;
4. all track totals and distributions update from data without page edits;
5. Credit Risk and the retained Salesforce data remain visible through adapters;
6. SAP ERP, Murex, Calypso, and a future registered track can accept batches without new importer code;
7. the production build cannot pass when market data violates the shared contract.
