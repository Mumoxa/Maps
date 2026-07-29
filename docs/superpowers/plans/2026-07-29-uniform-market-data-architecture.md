# Uniform Market Data Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every registered MAPS market accept repeated, source-verified profile additions through one atomic, idempotent batch-import workflow without market-page code changes.

**Architecture:** Preserve the existing Credit Risk and Salesforce JSON files behind adapters, load all future `markets/<track>/batches/*.json` files through a shared registry, and make public search/counts consume that registry. A TypeScript CLI converts the standard CSV template into immutable batches, while the same validation and identity utilities protect both imports and production builds.

**Tech Stack:** Vite 5, React 18, TypeScript 5.6, Node.js built-in test runner, `tsx`, `csv-parse`.

## Global Constraints

- Verification happens before data is supplied to MAPS; there is no verification queue.
- Every new record requires a source URL, evidence note, evidence date, and `suppliedAsVerified: true`.
- Existing Credit Risk IDs and the 88 retained Salesforce source IDs remain unchanged in their source files.
- The unverified manual Salesforce correction remains source history but is excluded from the shared public registry.
- New batches are append-only and immutable; corrections use `supersedesId`.
- One invalid row rejects the entire import and writes no batch.
- Re-importing identical content is a no-op; reusing a batch ID with changed content fails.
- All profile counts and distributions are derived from the combined registry.
- No new candidate records are imported during this architecture change.
- `dist/`, `node_modules/`, and `*.tsbuildinfo` remain untracked.

---

### Task 1: Test Runner and Shared Contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/data/types.ts`
- Create: `src/data/marketData/types.ts`
- Create: `tests/market-data-contract.test.ts`

**Interfaces:**
- Produces: `MarketBatch`, `MarketBatchRecord`, `MarketLocation`, `MarketSource`, `MarketProfile`, `MarketProvenance`, and `MarketDataIssue`.
- Produces: `TalentProfile` as an alias of the canonical `MarketProfile`.

- [ ] **Step 1: Add the failing contract test**

```ts
import test from 'node:test'
import assert from 'node:assert/strict'
import type { MarketBatch, MarketProfile } from '../src/data/marketData/types'

test('the public profile and batch record share the canonical fields', () => {
  const batch: MarketBatch = {
    schemaVersion: 1,
    batchId: '2026-08-01-salesforce-leads',
    trackSlug: 'salesforce',
    sourceFile: 'salesforce.csv',
    suppliedOn: '2026-08-01',
    records: [],
  }
  const required: (keyof MarketProfile)[] = [
    'id', 'track', 'trackSlug', 'name', 'title', 'company', 'location',
    'locationLabel', 'seniority', 'skills', 'sectors', 'specialisms', 'summary',
    'linkedinUrl', 'sources', 'suppliedAsVerified', 'supersedesId', 'attributes',
    'provenance',
  ]
  assert.equal(batch.schemaVersion, 1)
  assert.equal(required.length, 19)
})
```

- [ ] **Step 2: Run the test and confirm the missing module failure**

Run: `npm test -- tests/market-data-contract.test.ts`

Expected: FAIL because `src/data/marketData/types.ts` and the `test` script do not exist.

- [ ] **Step 3: Add the test tooling and canonical types**

Add scripts:

```json
"test": "tsx --test tests/**/*.test.ts",
"validate:data": "tsx scripts/validate-market-data.ts",
"market:import": "tsx scripts/import-market-batch.ts"
```

Add dev dependencies `tsx` and `@types/node`, and runtime dependency `csv-parse`.

Define the canonical fields exactly as approved, with legacy provenance allowing a nullable evidence date:

```ts
export interface MarketLocation {
  city: string
  province: string
  country: string
}

export interface MarketSource {
  url: string
  type: string
  evidence: string
  checkedOn: string | null
}

export interface MarketBatchRecord {
  id: string
  name: string
  title: string
  company: string
  location: MarketLocation
  seniority: string
  skills: string[]
  sectors: string[]
  specialisms: string[]
  summary: string
  linkedinUrl: string
  sources: MarketSource[]
  suppliedAsVerified: true
  supersedesId: string | null
  attributes: Record<string, unknown>
}
```

`MarketProfile` extends the record with `track`, `trackSlug`, `locationLabel`, and provenance `{ kind: 'legacy' | 'batch'; batchId: string | null; sourceProfileId: string | null }`.

- [ ] **Step 4: Run the contract test**

Run: `npm test -- tests/market-data-contract.test.ts`

Expected: PASS with one test.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/data/types.ts src/data/marketData/types.ts tests/market-data-contract.test.ts
git commit -m "test: establish shared market data contract"
```

---

### Task 2: Canonical Identity and Stable IDs

**Files:**
- Create: `src/data/marketData/identity.ts`
- Create: `tests/market-data-identity.test.ts`

**Interfaces:**
- Produces: `canonicalizeIdentityUrl(value: string): string`.
- Produces: `generateMarketProfileId(trackSlug: string, identityUrl: string): Promise<string>`.
- Produces: `canonicalPersonKey(record): string`.

- [ ] **Step 1: Write failing identity tests**

```ts
test('canonicalises equivalent LinkedIn URLs', () => {
  assert.equal(
    canonicalizeIdentityUrl('HTTPS://ZA.LinkedIn.com/in/Example-Person/?trk=public#about'),
    'https://www.linkedin.com/in/example-person',
  )
})

test('generates deterministic track-scoped IDs', async () => {
  assert.equal(
    await generateMarketProfileId('salesforce', 'https://www.linkedin.com/in/example-person'),
    await generateMarketProfileId('salesforce', 'https://za.linkedin.com/in/example-person/'),
  )
  assert.match(
    await generateMarketProfileId('salesforce', 'https://www.linkedin.com/in/example-person'),
    /^salesforce-[a-f0-9]{12}$/,
  )
})
```

- [ ] **Step 2: Run the identity test and confirm failure**

Run: `npm test -- tests/market-data-identity.test.ts`

Expected: FAIL because the identity utilities do not exist.

- [ ] **Step 3: Implement canonicalisation and Web Crypto hashing**

Canonicalisation must lowercase hosts and LinkedIn path identifiers, convert `za.linkedin.com` and other LinkedIn subdomains to `www.linkedin.com`, remove query strings/fragments/trailing slashes, and reject non-HTTPS input. Stable IDs use SHA-256 through `globalThis.crypto.subtle.digest` and the first 12 hexadecimal characters.

- [ ] **Step 4: Run identity tests**

Run: `npm test -- tests/market-data-identity.test.ts`

Expected: PASS for equivalent URLs, HTTPS rejection, and deterministic IDs.

- [ ] **Step 5: Commit**

```bash
git add src/data/marketData/identity.ts tests/market-data-identity.test.ts
git commit -m "feat: add stable market profile identities"
```

---

### Task 3: Batch Validation, Duplicate Protection, and Corrections

**Files:**
- Create: `src/data/marketData/validate.ts`
- Create: `src/data/marketData/registry.ts`
- Create: `tests/market-data-validation.test.ts`
- Create: `tests/market-data-registry.test.ts`

**Interfaces:**
- Consumes: canonical URL and person-key utilities from Task 2.
- Produces: `validateMarketBatches({ legacyProfiles, batches, registeredTrackSlugs }): MarketDataIssue[]`.
- Produces: `buildMarketRegistry({ legacyProfiles, batches, trackNames }): MarketProfile[]`.
- Produces: `assertValidMarketData(...)` which throws a newline-delimited, field-specific error report.

- [ ] **Step 1: Write failing validation tests**

Cover one behavior per test:

```ts
test('rejects missing evidence declarations', () => {
  const batch = validBatch()
  batch.records[0].sources[0].evidence = ''
  assert.match(() => assertValidMarketData(inputWith(batch)), /records\\[0\\]\\.sources\\[0\\]\\.evidence/)
})

test('rejects duplicate canonical LinkedIn identities across legacy and batches', () => {
  assert.match(() => assertValidMarketData(inputWithDuplicateLegacyIdentity()), /identity already exists/)
})

test('rejects same normalised name company and title unless it supersedes', () => {
  assert.match(() => assertValidMarketData(inputWithRepeatedPerson()), /same name, company and title/)
})

test('rejects a supersedesId from another track', () => {
  assert.match(() => assertValidMarketData(inputWithCrossTrackCorrection()), /belongs to track/)
})
```

- [ ] **Step 2: Run validation tests and confirm failure**

Run: `npm test -- tests/market-data-validation.test.ts tests/market-data-registry.test.ts`

Expected: FAIL because validation and registry functions do not exist.

- [ ] **Step 3: Implement exhaustive validation**

Validate batch metadata, ISO `YYYY-MM-DD` dates, HTTPS URLs, required strings/arrays, exact `suppliedAsVerified: true`, stable ID equality, registered tracks, duplicate batch IDs, duplicate IDs/identity URLs, same-person collisions, and one-way same-track supersession chains. Errors include batch ID, row index, field, and reason; duplicate names alone are warnings.

- [ ] **Step 4: Implement registry supersession**

Build O(1) maps for IDs and canonical identities. Preserve legacy/batch provenance, exclude superseded profiles from the public result, reject conflicting correction chains, and sort deterministically by track, name, and ID.

- [ ] **Step 5: Run validation and registry tests**

Run: `npm test -- tests/market-data-validation.test.ts tests/market-data-registry.test.ts`

Expected: PASS for valid data, required evidence, collisions, and correction chains.

- [ ] **Step 6: Commit**

```bash
git add src/data/marketData/validate.ts src/data/marketData/registry.ts tests/market-data-validation.test.ts tests/market-data-registry.test.ts
git commit -m "feat: validate append-only market batches"
```

---

### Task 4: Legacy Adapters and Vite Batch Loader

**Files:**
- Create: `src/data/marketData/adapters.ts`
- Create: `src/data/marketData/batchLoader.ts`
- Modify: `src/data/salesforcePeople.ts`
- Modify: `src/data/talentSearch.ts`
- Delete: `src/data/talentRegistry.ts`
- Modify: `src/data/index.ts`
- Create: `tests/market-data-adapters.test.ts`

**Interfaces:**
- Produces: `adaptCreditRiskProfiles(data: DataBundle): MarketProfile[]`.
- Produces: `adaptSalesforceProfiles(rows): MarketProfile[]`.
- Produces: `loadPublishedMarketBatches(): MarketBatch[]` using eager `import.meta.glob`.
- Produces: `getTalentProfiles(data)` from legacy adapters plus every published batch.

- [ ] **Step 1: Write failing adapter tests**

```ts
test('retains all legacy Credit Risk and Salesforce records', () => {
  assert.equal(adaptCreditRiskProfiles(loadData()).length, 344)
  assert.equal(adaptSalesforceProfiles(salesforceRows).length, 88)
})

test('excludes the unverified manual correction from the public registry', () => {
  const names = getTalentProfiles(loadData()).map((profile) => profile.name)
  assert.equal(names.includes('Katlego Magnificent Seapi'), false)
})
```

- [ ] **Step 2: Run adapter tests and confirm failure**

Run: `npm test -- tests/market-data-adapters.test.ts`

Expected: FAIL because adapters and the batch loader do not exist.

- [ ] **Step 3: Implement adapters and loader**

Map legacy location strings into `{ city, province, country }` without inventing missing detail, store the original display string in `locationLabel`, convert source evidence into `MarketSource`, and mark provenance as `legacy`. Use:

```ts
const modules = import.meta.glob('../../../markets/*/batches/*.json', {
  eager: true,
  import: 'default',
})
```

The loader returns batches sorted by file path. The shared registry validates and combines both adapters and all batches. Remove the manual TypeScript addition route.

- [ ] **Step 4: Run adapter tests**

Run: `npm test -- tests/market-data-adapters.test.ts`

Expected: PASS with exactly 344 Credit Risk and 88 Salesforce legacy profiles, plus any committed batch profiles.

- [ ] **Step 5: Commit**

```bash
git add src/data/marketData/adapters.ts src/data/marketData/batchLoader.ts src/data/salesforcePeople.ts src/data/talentSearch.ts src/data/index.ts tests/market-data-adapters.test.ts
git rm src/data/talentRegistry.ts
git commit -m "feat: combine legacy adapters with published batches"
```

---

### Task 5: Atomic CSV-to-Batch Importer

**Files:**
- Create: `scripts/market-data-repository.ts`
- Create: `scripts/import-market-batch.ts`
- Create: `templates/market-profile-import.csv`
- Create: `tests/market-data-import.test.ts`

**Interfaces:**
- Consumes: the shared types, identity, validation, adapters, and registry.
- Produces: `importMarketBatch(options): Promise<{ status: 'created' | 'unchanged'; outputPath: string; accepted: number; warnings: MarketDataIssue[] }>`.
- CLI arguments: `--track`, `--file`, `--batch`, optional `--supplied-on`.

- [ ] **Step 1: Write failing importer tests**

Use temporary directories and real CSV text to prove:

```ts
test('converts valid CSV into one immutable batch', async () => {
  const result = await importMarketBatch(validOptions())
  assert.equal(result.status, 'created')
  assert.equal(JSON.parse(readFileSync(result.outputPath, 'utf8')).records.length, 1)
})

test('re-imports identical content without changing the file', async () => {
  const first = await importMarketBatch(validOptions())
  const before = statSync(first.outputPath).mtimeMs
  const second = await importMarketBatch(validOptions())
  assert.equal(second.status, 'unchanged')
  assert.equal(statSync(first.outputPath).mtimeMs, before)
})

test('writes nothing when any row is invalid', async () => {
  await assert.rejects(importMarketBatch(optionsWithInvalidSecondRow()), /row 3/)
  assert.equal(existsSync(expectedOutputPath()), false)
})

test('rejects changed content under an existing batch ID', async () => {
  await importMarketBatch(validOptions())
  await assert.rejects(importMarketBatch(changedOptions()), /batch ID already exists with different content/)
})
```

- [ ] **Step 2: Run importer tests and confirm failure**

Run: `npm test -- tests/market-data-import.test.ts`

Expected: FAIL because the importer does not exist.

- [ ] **Step 3: Implement CSV mapping and atomic writes**

The template columns are:

```text
name,title,company,city,province,country,seniority,skills,sectors,specialisms,summary,linkedinUrl,sourceUrl,sourceType,evidence,checkedOn,supersedesId,attributes
```

Split list columns on `;`, parse `attributes` as a JSON object, generate IDs from canonical identity URLs, validate the full prospective repository, write formatted JSON to a temporary sibling path, and rename only after all checks pass. Delete the temporary file on failure.

- [ ] **Step 4: Run importer tests**

Run: `npm test -- tests/market-data-import.test.ts`

Expected: PASS for creation, idempotence, changed-content rejection, and atomic failure.

- [ ] **Step 5: Commit**

```bash
git add scripts/market-data-repository.ts scripts/import-market-batch.ts templates/market-profile-import.csv tests/market-data-import.test.ts
git commit -m "feat: add atomic market batch importer"
```

---

### Task 6: Repository Validator and Build Gate

**Files:**
- Create: `scripts/validate-market-data.ts`
- Modify: `package.json`
- Create: `tests/market-data-repository.test.ts`

**Interfaces:**
- Consumes: `loadRepositoryMarketData(rootDir)` and shared validation.
- Produces: a CLI that exits non-zero on any data error and prints derived per-track totals on success.

- [ ] **Step 1: Write the failing repository test**

```ts
test('loads every registered track without track-specific importer code', async () => {
  const repository = await loadRepositoryMarketData(repoRoot)
  assert.deepEqual(
    repository.registeredTrackSlugs,
    ['calypso', 'credit-risk', 'murex', 'salesforce', 'sap-erp'],
  )
})
```

- [ ] **Step 2: Run the repository test and confirm failure**

Run: `npm test -- tests/market-data-repository.test.ts`

Expected: FAIL because repository loading and validation CLI are incomplete.

- [ ] **Step 3: Implement the validator and prepend it to build**

Set:

```json
"build": "npm run validate:data && tsc -b && vite build && node -e \"require('node:fs').copyFileSync('dist/index.html','dist/404.html')\""
```

The validator reads all legacy JSON and every `markets/*/batches/*.json`, invokes shared validation, and prints JSON containing total profiles, per-track totals, batch count, legacy count, and superseded count.

- [ ] **Step 4: Run tests and repository validation**

Run: `npm test -- tests/market-data-repository.test.ts && npm run validate:data`

Expected: PASS and derived totals of 344 Credit Risk plus 88 Salesforce profiles before any new batches.

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-market-data.ts scripts/market-data-repository.ts package.json tests/market-data-repository.test.ts
git commit -m "build: block invalid market data deployments"
```

---

### Task 7: Derived Product Counts and Uniform Evidence Display

**Files:**
- Create: `src/data/marketData/summary.ts`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/TrackPage.tsx`
- Modify: `src/pages/TalentSearchPage.tsx`
- Modify: `src/pages/SalesforceEcosystemPage.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/data/tracks.ts`
- Create: `tests/market-data-summary.test.ts`

**Interfaces:**
- Produces: `deriveMarketSummary(profiles)` with totals and O(1)-built distributions for tracks, companies, locations, seniority, skills, specialisms, provenance, and source coverage.
- Consumes: canonical `locationLabel`, `sources`, and provenance fields in search cards and track pages.

- [ ] **Step 1: Write failing summary tests**

```ts
test('derives counts from mixed legacy and batch profiles', () => {
  const summary = deriveMarketSummary(mixedProfiles())
  assert.equal(summary.totalProfiles, 3)
  assert.equal(summary.byTrack.get('salesforce'), 2)
  assert.equal(summary.byTrack.get('murex'), 1)
  assert.equal(summary.sourceCoverage, 3)
})
```

- [ ] **Step 2: Run the summary test and confirm failure**

Run: `npm test -- tests/market-data-summary.test.ts`

Expected: FAIL because the summary utility does not exist.

- [ ] **Step 3: Implement summaries and replace manual states**

Home and track-page status become data-derived: a registered track with profiles is live; a zero-profile track is ready for additions. Talent cards display the evidence source and checked date without exposing an unverified profile. Salesforce practitioner total, employer type, seniority, and province charts derive from the Salesforce registry slice; separate customer/partner market-intelligence figures remain clearly labelled editorial data with their source/as-of context.

- [ ] **Step 4: Remove hard-coded practitioner totals**

Run:

```bash
rg -n "Named Practitioners|Source-retained practitioners|const employerTypes|const seniorityDistribution|const provinceDistribution|track\\.status" src
```

Expected: no hard-coded profile total/distribution definitions and no manual track-status branch.

- [ ] **Step 5: Run tests and TypeScript build**

Run: `npm test -- tests/market-data-summary.test.ts && npx tsc -b`

Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/marketData/summary.ts src/pages/HomePage.tsx src/pages/TrackPage.tsx src/pages/TalentSearchPage.tsx src/pages/SalesforceEcosystemPage.tsx src/components/layout/Footer.tsx src/data/tracks.ts tests/market-data-summary.test.ts
git commit -m "feat: derive market counts and track readiness"
```

---

### Task 8: Operator Documentation and Source-History Alignment

**Files:**
- Create: `docs/market-data-import-guide.md`
- Modify: `markets/salesforce/README.md`
- Modify: `docs/superpowers/specs/2026-07-29-uniform-market-data-architecture-design.md`

**Interfaces:**
- Documents the exact CSV preparation, dry validation outcome, atomic import, correction, re-import, commit, and build workflow.

- [ ] **Step 1: Update documentation status truthfully**

Change the design status from awaiting review to implemented only after Tasks 1–7 pass. Document that the manual Salesforce correction remains in `manual_corrections.json` as excluded source history and that public searchable totals therefore use 88 verified Salesforce profiles, not 89 named entries.

- [ ] **Step 2: Document the constant-addition command**

Include:

```bash
cp templates/market-profile-import.csv incoming/2026-08-01-salesforce.csv
npm run market:import -- --track salesforce --file incoming/2026-08-01-salesforce.csv --batch 2026-08-01-salesforce-technical-leads
npm run validate:data
npm test
npm run build
```

Explain field formats, semicolon lists, JSON `attributes`, correction batches, idempotence, and that source truth is the supplier’s responsibility.

- [ ] **Step 3: Scan documentation for obsolete queue/import advice**

Run:

```bash
rg -n "verification queue|HTML importer or manual|verificationStatus.*pending|1,048 practitioners|Dataset coming next" docs markets src
```

Expected: only historical audit wording or explicit statements that no verification queue exists.

- [ ] **Step 4: Commit**

```bash
git add docs/market-data-import-guide.md markets/salesforce/README.md docs/superpowers/specs/2026-07-29-uniform-market-data-architecture-design.md
git commit -m "docs: explain continuous verified market additions"
```

---

### Task 9: Full Verification and Requirements Review

**Files:**
- Modify only if verification exposes a defect.

**Interfaces:**
- Proves the approved architecture success criteria against the exact branch state.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
npm test
npm run validate:data
npm run build
```

Expected: all tests pass, repository validation reports no errors, and the production build exits zero.

- [ ] **Step 2: Run repository-rule scans**

Run:

```bash
git ls-files 'dist/**' 'node_modules/**' '*.tsbuildinfo'
rg -n "\\|\\| true|&& false|if \\(true\\)|if \\(false\\)|console\\.log| as any" src scripts tests
rg -n "\\.(find|filter)\\([^\\n]*\\).*\\.(map|sort)\\(" src/data src/pages
git diff --check
```

Expected: no tracked artifacts, no debugging leftovers, no obvious search-inside-render loops in the new market-data path, and no whitespace errors.

- [ ] **Step 3: Prove idempotent import without retaining test data**

Copy the template to a temporary directory, populate one verified synthetic test fixture, run the importer twice against a temporary repository root, and confirm the first result is `created` and the second is `unchanged`. Do not write the fixture into `markets/`.

- [ ] **Step 4: Review every success criterion**

Confirm with file/test evidence that one command works for all registered tracks, re-imports are idempotent, invalid evidence/duplicates are atomic failures, counts are derived, legacy data remains visible, future registered tracks need no importer code, and invalid data blocks production builds.

- [ ] **Step 5: Inspect the final diff**

Run: `git status --short && git diff --stat 2c28cb1..HEAD && git log --oneline --decorate -12`

Expected: only the approved specification and uniform market-data architecture changes are present; no uploaded spreadsheets or candidate additions are committed.
