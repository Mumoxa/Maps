# Industry-body intelligence — required foundation for Maps research

**Status: Partially implemented (2026-11-11).** The evidence contract, validator,
initial ASPASA body/directory leads, research-coverage register and discovery route
are implemented on a feature branch. Comprehensive association research across
all companies is **not completed**. No researched association memberships have yet
been attached to canonical company IDs.

## The required discovery order

1. **Industry / specialist operational niche.** Use the existing national taxonomy,
   preserving the distinction between quarrying, ready-mix concrete, aggregate
   production, supplier/service providers and general construction.
2. **Industry associations and institutional bodies.** Discover trade bodies, chambers,
   professional bodies, regulators, certification organisations and umbrella forums.
   Classify each by type. Regulation does not equal voluntary membership.
3. **Directory evidence.** Visit published membership lists, operating-site maps,
   registers, committee pages and annual reports. Capture original spelling, member
   class, publication year/date and direct primary URLs.
4. **Member-company reconciliation.** Resolve published names against canonical
   `markets/organizations/organizations.json`, existing aliases and parent-child
   identities. If identity is unresolved, leave `organizationId: null`.
5. **Company universe expansion.** Add genuinely new companies only after identity
   evidence and deduplication; do not import machinery suppliers as quarry operators.
6. **Role-specific sourcing tiers.** Only after a recruitment brief exists, rank
   companies Tier 1/2/3 according to **demonstrated specialist operations**,
   operating complexity and actual role fit. Association co-membership alone
   never confers Tier 1 status.
7. **Potential people.** Investigate leaders and candidates only from sourced
   company target markets, with valid public evidence and privacy safeguards.

### Reverse discovery is mandatory

Research both **company → association** and **association → other corporate members**.
Continue through umbrellas/chapters only where relevant. Record unresearched or
inaccessible directories as pending, not "no members."

## Repository contract

The new files under `markets/organizations/industry-body-intelligence/` are:

- `bodies.json`: one row per external body. Body type, member-directory URL
  and verified national taxonomy node IDs are factual institutional attributes.
- `company-links.json`: *only* canonical company-to-body relationships with
  direct evidence, dated observation and explicit company/entity scope. "Member",
  "regulated by", "accredited by" and "affiliated with" are different relationships.
- `directory-leads.json`: original names found in published lists. These are
  leads, not automatically confirmed current members. Preserve published wording
  and allow `organizationId: null`.
- `coverage.json`: mandatory track-level research ledger, including the
  unresearched legacy tracks. A new `talentTracks` slug must receive its own
  coverage entry or CI fails; "not-started" is valid but openly pending.

This is deliberately **not** `markets/organizations/associations.json`, which
contains recruiter-oriented company similarity and operating-process links, nor
`corporate-relationships.json`, which records ownership and other corporate ties.

The type contract and fast indexes live in
`src/data/organizations/industryBodies.ts`; validation lives in
`src/data/organizations/industryBodiesQuality.ts` and
`scripts/validate-industry-bodies.ts`.

## Research evidence policy

- Cite an actual page that supports the asserted relationship, not generic search results.
- Date every check in ISO YYYY-MM-DD.
- Preserve historical sources as historical, and distinguish page listing from
  current membership status.
- Keep individual professional memberships separate from employer memberships.
- Never inherit a group-company membership onto a subsidiary without evidence.
- Never treat regulator oversight as an association membership.
- Do not invent Linkedin links, leadership identities or company classifications.
- Never publish private candidate/contact information in this public repository.
- An unresearched company = "Unknown"; it does not mean "not a member."

## ASPASA pilot

Official resources:
- https://aspasa.co.za/about/
- https://aspasa.co.za/member-list/
- https://aspasa.co.za/?da_image=map

ASPASA describes voluntary membership for small surface mining producers,
suppliers and individuals. An official published operating-site map names
AFRIMAT, AFRISAM, PPC Aggregate Quarries, Raumix Aggregates, Portland Quarry
and Ciolli Bros. These six are **source-listed research leads only**; their
current membership, legal entity mapping and precise category are not yet
verified in `company-links.json`. Do not infer any membership for Satork.

## Every market-mapping assignment — required agent preflight

- [ ] Read root `AGENTS.md` and canonical Mumoxa instructions.
- [ ] Identify the exact industry and operational niche.
- [ ] Open `/industry-bodies` or inspect the four intelligence files.
- [ ] Search for all relevant bodies, not only the best-known example.
- [ ] Check official directories and reverse-discover other member companies.
- [ ] Reconcile names against canonical company identities, including parent/subsidiary.
- [ ] Attach sources, checked-on dates and evidence status.
- [ ] Record coverage status for the market track or specialist niche.
- [ ] Explain directory gaps and why any Tier 1 company genuinely fits a job.
- [ ] Validate with `npm run validate:industry-bodies`, `npm test`, `npm run build`.

### First-class UI

The `/industry-bodies` route displays the directory and links, directory leads,
evidence and pending coverage. The `/company-associations` explorer still shows
company similarities, and `/recruitment-targeting` still applies the
brief-specific company tiers. This is an additive layer, not a replacement.

### Next research passes (not yet completed)

1. Resolve all ASPASA site/company names against canonical employer IDs.
2. Check member category and date on current official ASPASA registers.
3. Identify other quarrying, concrete and construction-material organisations.
4. Move through each existing Maps industry and company systematically.
5. Investigate association governance, company leaders and candidate pipelines
   only from verified, suitable source evidence.

Validation checks structured evidence and coverage completeness **as a register**;
it cannot verify that a website's contents are truthful or that every potential
association has been discovered. Human source review remains necessary.
