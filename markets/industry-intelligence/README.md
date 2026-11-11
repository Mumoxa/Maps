# Industry-body intelligence

Reusable, evidence-backed external-body intelligence for Talent Tree Consulting. The product flow is:

**Companies → Industry bodies → Membership directories → Other participants → Brief-specific recruitment target markets**

This is a separate intelligence layer. It does **not** rewrite `markets/organizations/organizations.json`, the existing company-to-company sourcing associations, the taxonomy, recruiter notes or historical records.

## Current status

**Verified partial coverage.** See [generated/coverage-report.md](generated/coverage-report.md) for counts calculated from saved output and [progress-manifest.json](progress-manifest.json) for remaining work. Do not describe the whole company universe as researched.

The first batches include:

- ASPASA historical producer operations and associate participants, current Minerals Council and GAIN body links, dated 2025 ASPASA leadership, and SATURC’s explicitly **Unknown** ASPASA status.
- Current BASA, CODI, Prudential Authority locally controlled bank, ASISA and SAIA rows, with voluntary membership, statutory participation and regulation kept separate.
- Current SA REIT members, SAPOA pages 1–5, Agbiz, Agbiz Grain, the 25-row MBAWC member portal and Unverified SAFCEC homepage-logo leads.
- Institutional scope for IQSA, DMPR, MHSC, FSCA, CGCSA, CESA, SARMA and other bodies without imported company rows.

Source discrepancies are preserved: SAIA narrates 55 members but exposed 53 linked rows; CODI narrates 34 institutions but exposed 33 table rows; the PA PDF prints `FIRSTHAND BANK LIMITED`. No values are invented to close those gaps.

## Deliverables

| Output | JSON | CSV |
| --- | --- | --- |
| Industry Body Master Directory | `generated/industry-intelligence.json` → `bodies` | `exports/industry-body-master-directory.csv` |
| Company Membership and External Relationship Map | `generated/industry-intelligence.json` → `relationships` | `exports/company-membership-map.csv` |
| Association Member Directory | `generated/industry-intelligence.json` → `members` | `exports/association-member-directory.csv` |
| Published leadership | `generated/industry-intelligence.json` → `leadership` | `exports/industry-leadership.csv` |
| Industry networks | `generated/industry-intelligence.json` → `networks` | `exports/recruitment-networks.csv` |
| Brief-specific Tier 1/2/3 classifications | `generated/industry-intelligence.json` → `classifications` | `exports/recruitment-classifications.csv` |
| Proposed companies absent from canonical Maps | `generated/industry-intelligence.json` → `proposedCompanies` | `exports/proposed-companies.csv` |
| Expanded source inventory | `generated/company-inventory.json` | `exports/company-inventory.csv` |
| Coverage | `generated/coverage.json` and `generated/coverage-report.md` | calculated from the same records |

The application consumes `src/data/industryIntelligence/dataset.json`, an exact copy of the canonical generated dataset checked by validation. The Explorer is available at `/industry-bodies`.

## Evidence and identity rules

1. Prefer official association directories, company disclosures, regulator registers and published board/committee pages. Search results are discovery aids, not row-level evidence.
2. `Confirmed`, `Historical`, `Unverified`, `Unknown` and `Not applicable` are different states. An inaccessible or unestablished membership is `Unknown`, not `No`.
3. Membership, regulation, accreditation, certification, committee representation and industry similarity are separate relationship types.
4. Old directory entries remain Historical. Association logos without adequate directory context remain Unverified.
5. Parent-company membership does not transfer to subsidiaries. Legal entity, trading name, parent, subsidiary and source names remain distinct.
6. Only unique exact normalized matches or explicitly reviewed canonical IDs resolve automatically. Ambiguous names are quarantined. Proposed records never become canonical organizations through generation.
7. Producers/operators are distinct from suppliers, contractors, professional-services firms, associations, public institutions and educational institutions.
8. IQSA represents individuals; employer representation on a committee belongs to that individual. Public leadership data contains no private contact details or inferred candidate availability.
9. Recruitment tiers belong to a named brief. Shared membership does not establish direct competition or universal company rank.
10. Personal emails, phone numbers, postal addresses, tax details and other private recruiter information are excluded from source seeds and generated data.

## Refresh procedure

1. **Retrieve and review** the official page, PDF or register. Record publication/effective date where available and the actual retrieval date.
2. **Update source records**:
   - Body scope: `source/industry-bodies.json`
   - Aggregates/mining/MBAWC/CODI: `source/directory-seeds.ts`
   - Financial associations: `source/financial-seeds.ts`
   - Agribusiness: `source/agribusiness-seeds.ts`
   - Property and SAFCEC: `source/property-seeds.ts`
   - Regulator registers: `source/regulator-seeds.ts`
3. Preserve the original directory name, category, participant type, evidence URL, publication date, operations and geography. Do not import personal contact fields.
4. Add an explicit canonical ID only after identity review. Otherwise leave it proposed or unresolved. Never “fix” a source spelling silently.
5. Run:

   ```bash
   npm run intelligence:build
   npm run intelligence:validate
   npm test
   npm run build
   npm run smoke:routes
   npm run audit:ui
   ```

6. Review the generated coverage report and remaining-work manifest. A new source batch must update its batch status truthfully.
7. Commit on the active feature branch and open a reviewed pull request. These commands do not deploy.

## Stable IDs and regeneration

- `body-*`: external body.
- `member-<body>-<hash>`: one source-directory row; the same legal entity can have separate rows in different classes or bodies.
- `relationship-<hash>`: company/body or body/body external relationship.
- `leader-aspasa-*`: dated public leadership row.
- `network-*`: named recruitment brief.
- `classification-<hash>`: member relevance within one named brief.
- `proposed-*`: reviewed-for-inclusion candidate, not a canonical organization.
- `source-*`: exact source-name-only repository identity outside the composed application universe.
- `unresolved-*`: quarantined identity candidate; never auto-merge.

IDs derive from saved source names and categories, not array positions. Generated files should be regenerated together rather than edited independently.

## Application integration

- Types: `src/data/industryIntelligence/types.ts`
- Typed loader: `src/data/industryIntelligence/load.ts`
- Filters and CSV serialization: `src/data/industryIntelligence/query.ts`
- Explorer: `src/pages/IndustryIntelligencePage.tsx`
- Tests: `tests/industry-intelligence.test.ts`
- Build: `scripts/build-industry-intelligence.ts`
- Independent validation: `scripts/validate-industry-intelligence.ts`
- Integration report: `generated/integration-report.md`

The normal production build runs `intelligence:validate`. The Explorer is lazy-loaded so its dataset does not inflate the initial application route.
