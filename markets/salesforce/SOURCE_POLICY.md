# Salesforce information: source and addition policy

This market area is a talent-data exploration product. It may describe records in the committed dataset and may publish market intelligence only when every factual claim has reviewable evidence.

## Required format for new information

Add each proposed fact to a review note before adding it to the application. Use one entry per claim:

```yaml
claim: "The exact, narrowly scoped statement proposed for publication"
scope: "person | company | customer-use | partner | market | event"
source_url: "https://direct-url-to-the-supporting-page.example"
publisher: "Organisation responsible for the source"
published_date: "YYYY-MM-DD or unknown"
accessed_date: "YYYY-MM-DD"
source_excerpt_or_location: "Short excerpt (within copyright limits), page, heading or table row"
verification_status: "verified | needs-review | rejected"
verified_by: "reviewer name"
verified_date: "YYYY-MM-DD"
expires_or_review_date: "YYYY-MM-DD or not-applicable"
notes: "Interpretation, conflicts, limitations and transformation details"
```

The repository must retain either the source URL or a legally retainable source artefact. A filename that is not committed and cannot be reviewed is not sufficient evidence.

## Review checklist

1. Confirm the claim is in product scope: South African Salesforce talent, employers, skills, ecosystem classification or directly relevant market context.
2. Open the source and confirm it supports the exact claim. Search snippets, AI output and another dataset's assertion are discovery leads, not verification.
3. Prefer a primary source (the relevant person, company, regulator, event organiser or product owner). If only a secondary source exists, label the limitation.
4. Record dates. Current employment, titles, certifications, customer use, partner status, product availability and counts are time-sensitive.
5. Keep observation and inference separate. Do not turn a job advert, employee skill, domain technology signal or partner case study into a broader implementation or licence claim.
6. For a person, retain only fields necessary for the talent-map purpose. Do not add inferred contact details. Duplicate names must not be merged without identity evidence.
7. Have a human reviewer set `verification_status: verified` before public display. `needs-review` information may be kept in a non-public review queue only.
8. Derive all displayed aggregates from accepted structured records; do not copy totals into page components.
9. Run `npm run build`, inspect the affected route, and check that source and limitation labels remain visible at mobile, tablet and desktop widths.

## Updating the structured people dataset

The importer accepts the supplied HTML export:

```bash
npm run import:salesforce -- "/path/to/source.html"
```

Before committing its output, ensure the source artefact is reviewable or document its lawful storage location, audit unexpected record-count changes, inspect duplicate identities, and confirm that every public profile has a direct evidence URL. The importer does not itself verify the truth or freshness of imported fields.

## Information that must not be published yet

- Claims supported only by an unavailable local file.
- Inferred email addresses or other inferred contact details.
- Customer implementations, cloud products, licence counts, use cases or implementation-partner attribution without claim-level sources.
- Headcount, certification, revenue, market-size, jobs-impact or product-launch figures without dated sources.
- A person's current role, employer, skill, availability or identity when the cited evidence does not establish it.

When evidence is incomplete, keep the proposal in a review note with `verification_status: needs-review`; do not represent it as verified by adding a disclaimer beside it.
