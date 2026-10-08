# South African Corporate Taxonomy Framework

A production reference taxonomy for classifying **every registered company in South Africa**, from an
unregistered spaza shop in KwaMashu to a JSE-listed conglomerate, on one consistent four-tier sector
architecture and one scale-band model.

This document is the design specification. The taxonomy itself is data, not prose, so it stays
machine-usable and cannot drift away from this document:

| Artifact | Path | Role |
|---|---|---|
| Sector tree (729 nodes) | `markets/organizations/taxonomy/sector-tree.json` | The four-tier L1→L4 hierarchy |
| Generated outline | `markets/organizations/taxonomy/sector-tree-outline.md` | Human-readable outline, regenerated from the JSON |
| Scale bands | `markets/organizations/taxonomy/scale-bands.json` | Segmentation thresholds and precedence rule |
| Statutory schedule | `markets/organizations/taxonomy/statutory-schedule-1.json` | Sector-specific statutory turnover ceilings |
| Controlled vocabularies | `markets/organizations/taxonomy/controlled-vocabularies.json` | Entity types, CIPC/SARS/COIDA statuses, B-BBEE, provinces, municipalities, hubs |
| Company profile schema | `markets/organizations/taxonomy/sa-company-profile.schema.json` | Generated JSON Schema (draft 2020-12) |
| Crosswalk | `markets/organizations/taxonomy/industry-crosswalk.json` | Maps the existing Maps organization model onto the national taxonomy |
| Worked examples | `markets/organizations/taxonomy/examples/` | Validated records at both ends of the scale |
| Classification engine | `src/data/taxonomy/classify.ts`, `validate.ts` | Band derivation and semantic validation |

Regenerate and verify:

```bash
npm run taxonomy:schema     # regenerate the JSON Schema from the data files
npm run taxonomy:outline    # regenerate the Markdown outline from the sector tree
npm run validate:taxonomy   # integrity + crosswalk coverage + example validation (build gate)
npm test                    # includes tests/sa-corporate-taxonomy.test.ts
```

---

## 1. Definitional & segmentation breakdown

Five bands, ordered by rank. The first three are statutory classes under the National Small Enterprise
Act; the last two are institutional corporate-banking bands layered on top so one taxonomy covers the
whole registered universe.

| Rank | Band | FTE employees | Annual turnover | Statutory class | Corporate banking equivalent |
|---|---|---|---|---|---|
| 1 | **Micro / Informal** | 1–10 | up to R10m _(sector dependent)_ | micro | Entry / micro-business banking, largely unbanked |
| 2 | **Small** | 11–50 | R10m – R50m | small | Business Banking, relationship managed |
| 3 | **Medium** | 51–250 | R50m – R100m / R250m _(sector dependent)_ | medium | Commercial Banking / Mid-Market |
| 4 | **Large / Enterprise** | 251–999 | R250m – R1bn | _none_ | Corporate Banking / Large Enterprise |
| 5 | **Tier 1 Conglomerate / JSE Listed** | 1000+ | R1bn+ | _none_ | Corporate & Investment Banking |

### 1.1 The precedence rule (the part that actually breaks imports)

The Act measures size with **two proxies**, and they routinely disagree. A cleaning contractor with
300 employees and R8m turnover is large by headcount and micro by turnover. The framework resolves this
deterministically instead of silently:

- `bandByEmployees` and `bandByTurnover` are both computed and stored.
- The record's `band` is the **higher of the two** — the conservative reading used for state-support
  eligibility, supplier-development targets and bank segmentation. A 300-employee employer is not a
  micro enterprise, whatever its revenue.
- `bandConflict: true` is written whenever the proxies disagree, so the disagreement is visible to a
  reviewer instead of being hidden by the rule.
- If **neither** proxy is known the band is `unclassified`, never `micro`. Defaulting unknown data to
  micro would quietly inflate the SMME population.

### 1.2 Reconciliation with the statute

Three honest deviations from a literal reading of the Act, all deliberate:

1. **`large` and `tier-1` are not statutory classes.** Schedule 1 stops at medium (≤250 FTE). Those two
   bands exist because a taxonomy that cannot describe Anglo American, Eskom or Shoprite is not a
   taxonomy of the South African corporate universe. Records in those bands carry
   `statutoryClass: null` and the validator enforces it.
2. **Turnover ceilings are sector-specific, not global.** The R100m / R250m range in the Medium row is a
   shorthand: the binding figure is the Schedule 1 line for the company's sector. A medium construction
   firm tops out at R170m; a medium agricultural enterprise at R35m; a medium wholesale business at
   R220m. Each macro-sector therefore carries a `statutorySector` field that resolves to the correct
   Schedule 1 class, and the ceilings live in `statutory-schedule-1.json`, not in code.
3. **The statutory schedule counts FTE from zero, this taxonomy from one.** A registered entity that
   reports no FTE data resolves to micro with `fteReported: false` recorded, rather than being dropped
   or guessed at.

### 1.3 The schedule was replaced in 2026 — and that is a design input

On 27 May 2026 the Department of Small Business Development gazetted proclamations replacing the
schedule to the National Small Enterprise Act 102 of 1996: one proclamation giving effect to section 8
of the National Small Enterprise Amendment Act of 2024 (which repeals the 1996 schedule), and a second
inserting the replacement schedule, whose criteria were published in draft for comment in September 2025.

The gazetted 2026 sector turnover table was **not retrievable from this environment**, so it is not in
this repository. `statutory-schedule-1.json` records the 2019 revision (Government Notice 399) as
`source-verified`, and carries the 2026 schedule as `existence-verified-values-unverified` with an
**empty sector table** — an empty list fails loudly rather than presenting an invented number as law.
A test asserts it stays empty until populated. Every band assignment stores the `scheduleId` it was
derived from, so a re-derivation after the 2026 table is loaded is a data operation, not a rewrite.

---

## 2. Macro-sector to micro-niche architecture

**Macro-Sector (L1) → Industry Sector (L2) → Sub-Industry (L3) → Operational/Product Niche (L4)**

| Tier | Nodes | Example path |
|---|---|---|
| L1 Macro-Sector | 16 | `CON` Construction, Engineering & Property |
| L2 Industry Sector | 129 | `CON-ENG` Engineering Services & Consulting |
| L3 Sub-Industry | 490 | `CON-ENG-MECH` Mechanical & Plant Engineering |
| L4 Operational / Product Niche | 94 | `CON-ENG-MECH-PETRO` Petrochemical Plant Maintenance & Shutdown Services |
| **Total** | **729** | |

The complete nested outline, including the South African operating context recorded against each node,
is generated at **[`markets/organizations/taxonomy/sector-tree-outline.md`](../markets/organizations/taxonomy/sector-tree-outline.md)**.
It is regenerated from the JSON by `npm run taxonomy:outline`, and a test fails if the committed outline
and the tree disagree.

Structural rules the validator enforces: node ids are unique, ids begin with their parent's id (so the
path is readable from the id alone), parents always precede children, tiers cannot be skipped, and
every L1 macro-sector resolves to a real Schedule 1 sector class.

### 2.1 The sixteen macro-sectors

| Code | Macro-sector | Statutory sector class |
|---|---|---|
| `MIN` | Mining, Quarrying & Extractive Industries | mining-and-quarrying |
| `ENR` | Energy, Power & Green Transition | electricity-gas-and-water |
| `AGR` | Agriculture, Forestry & Agribusiness | agriculture |
| `MFG` | Manufacturing & Industrial Processing | manufacturing |
| `RTL` | Retail, FMCG & Consumer Goods | retail, motor trade and repair services |
| `WHL` | Wholesale, Distribution & Supply Chain Trade | wholesale |
| `TRA` | Transport, Freight & Logistics | transport, storage and communications |
| `FIN` | Financial Services, Banking & Insurance | finance and business services |
| `ICT` | Information Technology, Telecommunications & BPO | transport, storage and communications |
| `CON` | Construction, Engineering & Property | construction |
| `PRO` | Professional, Advisory & Business Services | finance and business services |
| `HLC` | Health, Life Sciences & Wellness | community, social and personal services |
| `TOU` | Tourism, Hospitality & Events | catering, accommodation and other trade |
| `PUB` | Public Sector, State-Owned Companies & Utilities | community, social and personal services |
| `EDU` | Education, Training & Skills Development | community, social and personal services |
| `CIV` | Civil Society, Foundations & Community Organisations | community, social and personal services |

### 2.2 How the priority sectors are mapped

**Mining & Extractive (`MIN`, 62 nodes below L1).** PGM, gold, coal, iron ore and manganese, diamonds
and battery minerals each get their own L2. Crucially, the **junior / SMME end of the value chain is in
the same tree as the majors**, not in a separate "small business" silo: `MIN-PGM-MINE-DEEP`
(deep-level mechanised stoping) and `MIN-PGM-JR-BLACK` (black-owned junior and small-scale mining under
MPRDA small-scale permits) are siblings. Gold carries `MIN-GOLD-TAIL` (tailings retreatment) and
`MIN-GOLD-ART` (artisanal and informal extraction, explicitly flagged informal) because both are real
parts of the economy. `MIN-SV` holds contract mining, shaft sinking, drilling, equipment and safety
services — where most SMME participation in mining actually occurs — and `MIN-REHAB` holds closure,
revegetation and acid mine drainage.

**Financial Services (`FIN`, 70 nodes below L1).** The Big Five sit at `FIN-BANK-BIG5` with L4 niches for
retail transaction banking, SME banking, private banking, card and POS acquiring, and property finance —
because those are distinct company propositions even inside one bank. Digital disruptors get their own
branch (`FIN-DIGIBANK-CHAL-LICENSED`, `FIN-DIGIBANK-CHAL-NEOBANK`). The **funeral ecosystem is modelled
properly**: `FIN-INS-FUNERAL-PARLOUR` (parlour operators, overwhelmingly micro and small, often also
acting as FSPs), `FIN-INS-FUNERAL-POLICY` (licensed underwriting and administration) and
`FIN-INS-FUNERAL-CLAIM` (claims, repatriation and ancillary services). **Stokvel administration** gets
`FIN-INFORMAL-STOKVEL-ACCUM` (the savings society itself, informal) and
`FIN-INFORMAL-STOKVEL-ADMIN` (the formal administrators and fintech platforms that bridge into it), with
a cross-reference to `RTL-INFORMAL-STOKVEL` where the same money becomes a December grocery purchase.

**Agriculture & Agribusiness (`AGR`, 70 nodes below L1).** The barbell structure is explicit.
`AGR-COMM-COOP-FULL` captures the full-service commercial mega-co-operative model (input supply, storage,
grain marketing, mechanisation, fuel and finance in one member-owned regional structure, the NWK / Senwes
pattern), while `AGR-SMALL-EMERG`, `AGR-SMALL-LANDREFORM` and `AGR-SMALL-SUBS` capture emerging, land-reform
and subsistence producers. Export commodities are separate branches: `AGR-HORT-CITRUS` (with
`AGR-HORT-CITRUS-PACK` for the packhouse node that defines the regional logistics hub), `AGR-VITI-WINE`,
`AGR-VITI-TABLE`, `AGR-FIELD-MAIZE-COMM` and `AGR-FIELD-MAIZE-EMERG`. **Regional hubs are a metadata
dimension, not tree nodes** — see `regionalEconomicHubs` in §3.4 — because a citrus producer is
classified by what it does, and located by where it does it.

**Manufacturing & Industrial (`MFG`, 81 nodes below L1).** `MFG-AUTO-OEM` (vehicle assembly, the Eastern
Cape and Gauteng plants) sits above `MFG-AUTO-CAT1` (Tier 1, with L4 niches for exhaust and catalytic
converters, interiors, wiring harnesses, tyres and castings) and `MFG-AUTO-CAT2` (Tier 2, where most
black-owned automotive participation sits). Note the deliberate value-chain link:
`MFG-AUTO-CAT1-EXH` consumes what `MIN-PGM-PROC-BM` refines. Heavy chemicals run through
`MFG-CHEM-CTL-SYNFUEL` (Secunda-type synthetic fuel conversion) to fertiliser and specialty chemicals;
FMCG manufacturing runs through `MFG-FOOD` with L4 niches down to `MFG-FOOD-BAKERY-ART` (artisan and
township bakeries) and `MFG-FOOD-PRIVATE-HOUSE` (retail house-brand co-manufacturing, a major SMME route
into formal retail supply chains).

**Retail & Wholesale (`RTL` 50 nodes, `WHL` 36 nodes).** The grocery chains sit at `RTL-GROC-HYPER` with
`RTL-GROC-HYPER-FRAN` for franchise-operated stores and `RTL-GROC-VOLUNT-MEMBER` for voluntary-group
member stores — where **the legal entity is the member, not the group**, so taxonomy assignment must be
made at member level. The informal trade network is a first-class branch, not an afterthought:
`RTL-INFORMAL-SPAZA-INDEP`, `RTL-INFORMAL-SPAZA-CHAIN` (formalising multi-site township operators),
`RTL-INFORMAL-STREET-HAWK`, `RTL-INFORMAL-TAXI`, `RTL-INFORMAL-RECYC` and
`RTL-INFORMAL-STOKVEL`. The **spaza supply chain** lives in wholesale where it economically belongs:
`WHL-FMCG-SPAZA-DEPOT` (township depot and break-bulk) and `WHL-FMCG-SPAZA-ROUTE`. Franchise operators get
`RTL-FRAN-RETAIL-GROC`, `RTL-FRAN-RETAIL-MULTI`, `RTL-FRAN-QSR` and `RTL-FRAN-SVC`.

**IT & Telecommunications (`ICT`, 55 nodes below L1).** `ICT-TELCO-MNO` (national mobile network
operators), `ICT-TELCO-FIXED`, `ICT-TELCO-MVNO-RETAIL` and `ICT-TELCO-PANAF` (South African-headquartered
Pan-African operators) cover the infrastructure layer. Systems integration splits by what is integrated:
`ICT-SI-ERP`, `ICT-SI-CRM`, `ICT-SI-INFRA`, `ICT-SI-MSP`, `ICT-SI-CUSTOM`. The SMME software economy gets
its own branch with L4 niches for product, mobile, enterprise and AI studios (`ICT-SW-AGENCY-*`) plus
`ICT-SW-EMERG` (bootcamp-graduate micro studios). BPO is modelled by service line:
`ICT-BPO-VOICE-CAMPUS`, `ICT-BPO-OMNI`, `ICT-BPO-FIN-COLLECT`, `ICT-BPO-TECH-OFFSHORE` (GBS captives).

**Energy & Infrastructure (`ENR`, 51 nodes below L1).** `ENR-GEN-IPP` covers bid-window IPPs with L4
niches for solar, wind and battery project companies and `ENR-GEN-IPP-SPV` for shareholder structuring —
recorded with an explicit warning that **IPP headcount is tiny while turnover is large**, so the scale
band must be driven by turnover. Solar splits by market: `ENR-SOLAR-EPC` (utility scale),
`ENR-SOLAR-CI` (commercial and industrial, with wheeling and O&M niches), and `ENR-SOLAR-RES` for the
**grid-decentralisation gap**, including `ENR-SOLAR-RES-INSTALL` (CoC-issuing installers working to
SANS 10142-2 and NRS 097-2-1) and `ENR-SOLAR-RES-INFORMAL` (unregistered installers, tracked as a
data-quality and safety flag rather than excluded). Wind and green hydrogen
(`ENR-HYDRO-PROD-EXPORT`) are separate branches, and `ENR-SVC` holds the electrical contracting, ESCO,
metering and audit layer.

---

## 3. Metadata & data attribute schema

Every company profile carries six blocks. The full contract is the generated
[`sa-company-profile.schema.json`](../markets/organizations/taxonomy/sa-company-profile.schema.json);
the field-level intent is below.

### 3.1 Legal entity identifier (`legal`)

| Field | Notes |
|---|---|
| `entityType` | `pty-ltd`, `ltd-public`, `ltd-inc` (Inc), `npc`, `cc` (legacy Close Corporation), `sole-proprietorship`, `partnership`, `trust`, `co-operative`, `soc-ltd`, `public-entity`, `municipal-entity`, `provincial-department`, `npo-association`, `foreign-branch`, `unregistered-informal` |
| `cipcRegistrationNumber` | `YYYY/NNNNNN/NN`. The two-digit suffix encodes the entity type (`/07` private, `/06` public, `/08` NPC, `/23` CC, `/24` co-op, `/30` SOC, `/10` external company) and is validated against `entityType` |
| `cipcStatus` | `registered`, `ar-in-arrears`, `deregistered`, `final-deregistration`, `provisional-liquidation`, `in-liquidation`, `business-rescue`, `under-review`, `unknown` |
| `jseListingStatus` + `jseListingAsOf` | `primary-listed`, `secondary-listed`, `delisted`, `not-listed`, `unverified`. **Dated by design**: listings change through demergers and takeovers, and an unverified listing must never render as not-listed |
| `vatNumber`, `incomeTaxNumber`, `isin`, `leiNumber` | Populated where a source establishes them |

`ar-in-arrears` is deliberately **not** treated as insolvency: annual returns running years overdue is
the single most common defect in South African company data and says nothing about whether a business
trades.

### 3.2 Scale (`scale` + derived `scaleBand`)

`employeesFte`, `fteReported`, `annualTurnoverZar`, `turnoverFyEnd`, `turnoverBasis`
(`audited` / `reviewed` / `provisional-management` / `source-reported` / `third-party-estimate` /
`unknown`), `assetValueZar` (the retired third proxy, retained because older records carry it),
`informal`, `reportingBasis` (`standalone-entity` vs `group-consolidated`) and a `provenance` block.

`scaleBand` is **derived, never hand-entered**: `band`, `bandByEmployees`, `bandByTurnover`,
`bandConflict`, `statutoryClass`, `scheduleId`, `derivedOn`. The validator recomputes it from the record's
own numbers on every run and rejects a record whose declared band disagrees.

### 3.3 Regulatory compliance vectors (`regulatory` + `bbbee`)

| Vector | Fields |
|---|---|
| SARS | `sarsTaxComplianceStatus` (`tcs-valid`, `tcs-applied`, `tcs-expired`, `non-compliant`, `vat-registered`, `turnover-tax`, `not-registered`, `unknown`), `sarsTcsPin`, `sarsPinExpiry` |
| COIDA | `coidaStatus` (`lgs-valid`, `lgs-expired`, `registered-not-current`, `not-registered`, `exempt`, `unknown`), `coidaLgsNumber`, `coidaLgsExpiry` — gating for construction and mining work |
| CSD | `csdRegistered` — National Treasury Central Supplier Database, required for state procurement |
| PFMA / MFMA | `pfmaOrMfmaApplicable` — flags SOEs, public entities and municipalities |
| Sector licences | `sectorLicences[]`: `regulator` (from a controlled list of 20 authorities: CIPC, SARS, dtic, SANAS, CIDB, NHBRC, PSIRA, PPRA, FSCA, SARB, FIC, NERSA, ICASA, SAHPRA, ECSA, SACPCMP, MDB, SEDA, Compensation Fund, CSD), `licenceType`, `licenceNumber`, `status`, `validTo` |

**B-BBEE** (`bbbee`) is modelled as its own block because it is a measured attribute with its own
evidence chain, not a label:

| Field | Notes |
|---|---|
| `category` | `eme`, `qse`, `generic`, `startup`, `not-verified`, `not-applicable` |
| `level` | `1`–`8`, `non-compliant`, `not-verified` |
| `sectorCode` | `general`, `agriculture`, `construction`, `financial-services`, `forestry`, `ict`, `marketing-advertising-communications`, `property`, `tourism`, `transport`, `mining-charter`, `defence` |
| `scorecardType` | `generic`, `qse`, `eme-affidavit`, `startup-affidavit`, `sector-code`, `none` |
| `evidenceType` | `sworn-affidavit`, `verification-certificate`, `cipc-certificate`, `dtic-database-record`, `none` |
| Ownership | `blackOwnershipPct`, `blackFemaleOwnershipPct` |
| Verification | `verificationAgency`, `sanasAccredited`, `certificateNumber`, `validFrom`, `validTo` |

The turnover boundaries are **sector-code dependent and validated**: the general Codes put EME at
≤R10m and QSE at R10m–R50m, but the Construction Sector Code sets the EME boundary at R3m, and the
Tourism Code uses R5m / R45m. A record claiming EME on R68m turnover fails validation with
`bbbee-category-mismatch`. An EME on a sworn affidavit may only be Level 4 — or Level 2 at ≥51% and
Level 1 at 100% black ownership — so any other level with affidavit evidence is rejected.

### 3.4 Geographic anchor matrix (`geography`)

`province` (9 provinces) cross-referenced with **either** `metropolitanMunicipality` (the 8 metros)
**or** `districtMunicipality` (the 44 district municipalities) — mutually exclusive and validated as
such, because a metro is not inside a district municipality. Then `localMunicipality`, `city`, `suburb`,
`streetAddress`, `latitude`/`longitude`, `operatingProvinces` and `crossBorderCountries`.

Two deliberate decisions:

- **Local municipalities are free text with provenance, not a hardcoded list.** There are 205 of them and
  the Municipal Demarcation Board amends boundaries; a stale enumeration silently misassigns every
  company in the affected area. The policy is recorded in `localMunicipalityPolicy` in the vocabularies.
- **`regionalEconomicHubs`** carries the economic-geography dimension the brief asks for — 21 hubs such
  as `fs-chem-industrial-corridor` (Sasolburg / Vaal), `ec-automotive-cluster`, `wc-tech-bpo`,
  `nw-pgm-rustenburg-belt`, `mp-coal-energy-belt`, `nc-iron-ore-kalahari`, `kzn-logistics-corridor`,
  `sr-citrus-export`. This is what makes regional economic density measurable by cluster rather than by
  raw address counts.

### 3.5 Taxonomy placement (`taxonomy`)

`primaryNode` (the deepest defensible node), `secondaryNodes[]` (**multi-homing** — a retailer that runs
its own logistics belongs in both branches), `valueChainStage` and `sourcingPocket` (the existing Maps
pocket id, preserved through the crosswalk).

### 3.6 Provenance

Scale, B-BBEE and regulatory blocks each carry a `provenance` object (`sourceUrl`, `checkedOn`,
`confidence`, `sourceType`). `confidence` and `sourceType` are **imported from the existing organization
model**, not redefined, so the repository has one evidence vocabulary. `unknown` is a value, never
silently promoted to a clean status, and an illustrative record must be flagged `illustrativeRecord: true`.

---

## 4. Integration with the existing organization model

This taxonomy does not replace `markets/organizations/industries.json` or `pockets.json`; it binds to
them. `industry-crosswalk.json` maps **all 30 industries and all 12 sourcing pockets** onto taxonomy
nodes, and `npm run validate:taxonomy` fails the build if any industry or pocket loses its mapping or if
a mapping points at a node that no longer exists. Companies can therefore carry either vocabulary
without losing the other.

---

## 5. Output format: JSON schema and a worked mapping

The schema is **generated** by `scripts/generate-taxonomy-schema.ts` from the same data files the
validator reads, so its enums can never drift from the taxonomy. A test asserts the committed schema's
node enum equals the tree and its band enum equals the scale bands. Excerpt:

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "South African Company Taxonomy Profile",
  "type": "object",
  "additionalProperties": false,
  "required": ["id","legal","scale","scaleBand","bbbee","regulatory","geography","taxonomy",
               "status","lastVerified","illustrativeRecord","notes"],
  "properties": {
    "legal":     { "$ref": "#/$defs/legalIdentity" },
    "scale":     { "$ref": "#/$defs/scaleProfile" },
    "scaleBand": { "$ref": "#/$defs/scaleBandAssignment" },
    "bbbee":     { "$ref": "#/$defs/beeProfile" },
    "regulatory":{ "$ref": "#/$defs/regulatoryProfile" },
    "geography": { "$ref": "#/$defs/geographicAnchor" },
    "taxonomy":  { "$ref": "#/$defs/taxonomyPlacement" }
  },
  "$defs": {
    "taxonomyNodeId": { "type": "string", "enum": [ /* all 729 taxonomy node ids */ ] },
    "scaleBandAssignment": {
      "type": "object", "additionalProperties": false,
      "description": "Derived from the scale proxies on every validation run. Never hand-entered.",
      "properties": {
        "band":            { "enum": ["micro","small","medium","large","tier-1","unclassified"] },
        "bandByEmployees": { "enum": ["micro","small","medium","large","tier-1","unclassified"] },
        "bandByTurnover":  { "enum": ["micro","small","medium","large","tier-1","unclassified"] },
        "bandConflict":    { "type": "boolean" },
        "statutoryClass":  { "enum": ["micro","small","medium",null] },
        "scheduleId":      { "type": "string" },
        "derivedOn":       { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" }
      }
    }
  },
  "allOf": [
    { "description": "A metro and a district municipality are mutually exclusive.",
      "oneOf": [
        { "properties": { "geography": { "properties": {
            "metropolitanMunicipality": { "not": { "const": "" } },
            "districtMunicipality":     { "const": "" } } } } },
        { "properties": { "geography": { "properties": {
            "metropolitanMunicipality": { "const": "" },
            "districtMunicipality":     { "not": { "const": "" } } } } } }
      ] },
    { "description": "A pty-ltd registration number carries the /07 entity-type suffix.",
      "if":   { "properties": { "legal": { "properties": { "entityType": { "const": "pty-ltd" } } } } },
      "then": { "properties": { "legal": { "properties": {
                   "cipcRegistrationNumber": { "pattern": "^\\d{4}/\\d{6}/07$" } } } } } },
    { "description": "An EME on a sworn affidavit can only be Level 1, 2 or 4.",
      "if":   { "properties": { "bbbee": { "properties": {
                   "category": { "const": "eme" }, "evidenceType": { "const": "sworn-affidavit" } } } } },
      "then": { "properties": { "bbbee": { "properties": { "level": { "enum": ["1","2","4"] } } } } } },
    { "description": "Tier 1 and large are not statutory SMME classes.",
      "if":   { "properties": { "scaleBand": { "properties": { "band": { "enum": ["large","tier-1"] } } } } },
      "then": { "properties": { "scaleBand": { "properties": { "statutoryClass": { "const": null } } } } } }
  ]
}
```

### Mapping one company: a Level 1 B-BBEE engineering firm in Sasolburg

A medium engineering contractor doing petrochemical plant shutdown work in the Free State chemical
corridor maps as follows (full validated record at
[`examples/za-eng-0001-engineering-sasolburg.json`](../markets/organizations/taxonomy/examples/za-eng-0001-engineering-sasolburg.json)):

```jsonc
{
  "id": "za-eng-0001",
  "legal": {
    "legalName": "Mohlodi Industrial Engineering (Pty) Ltd",
    "entityType": "pty-ltd",
    "cipcRegistrationNumber": "2014/128764/07",   // /07 suffix must match pty-ltd
    "cipcStatus": "registered",
    "jseListingStatus": "not-listed"
  },
  "scale": {
    "employeesFte": 84, "fteReported": true,
    "annualTurnoverZar": 68400000, "turnoverFyEnd": "2026-02-28",
    "turnoverBasis": "reviewed", "reportingBasis": "standalone-entity"
  },
  "scaleBand": {
    "band": "medium",              // both proxies agree
    "bandByEmployees": "medium",   // 84 FTE  -> 51-250
    "bandByTurnover": "medium",    // R68.4m  -> R50m-R250m
    "bandConflict": false,
    "statutoryClass": "medium",
    "scheduleId": "NSEA-S1-2019"
  },
  "bbbee": {
    "category": "generic",         // R68.4m > R50m, so above the QSE ceiling
    "level": "1",
    "sectorCode": "construction",  // Construction Sector Code, not the general Codes
    "scorecardType": "sector-code",
    "blackOwnershipPct": 76,
    "evidenceType": "verification-certificate",
    "sanasAccredited": true,
    "validTo": "2027-02-28"        // B-BBEE certificates run 12 months
  },
  "regulatory": {
    "sarsTaxComplianceStatus": "tcs-valid", "sarsTcsPin": "9071234567",
    "coidaStatus": "lgs-valid",    // Letter of Good Standing: gating for site work
    "csdRegistered": true,         // required to tender for state work
    "sectorLicences": [
      { "regulator": "cidb",      "licenceType": "Contractor grading 6CE and 5ME" },
      { "regulator": "sacpcmp",   "licenceType": "Pr Eng Mech responsible person" },
      { "regulator": "sanas",     "licenceType": "Pressure equipment inspection authority" },
      { "regulator": "dtic",      "licenceType": "Local content designated supplier" }
    ]
  },
  "geography": {
    "province": "FS",
    "metropolitanMunicipality": "",          // empty: Sasolburg is not in a metro
    "districtMunicipality": "fezile-dabi",   // Fezile Dabi District Municipality
    "localMunicipality": "Metsimaholo",
    "city": "Sasolburg", "suburb": "Brandwag Industrial Area",
    "regionalEconomicHubs": ["fs-chem-industrial-corridor"],
    "operatingProvinces": ["FS", "MP", "GP"]
  },
  "taxonomy": {
    "primaryNode": "CON-ENG-MECH-PETRO",     // L4: petrochemical plant maintenance & shutdowns
    "secondaryNodes": ["CON-ENG-MECH-BOILER", "CON-SPEC-ELEC"],
    "valueChainStage": "Services",
    "sourcingPocket": "construction"
  },
  "status": "needs-verification",
  "illustrativeRecord": true
}
```

The path resolves `CON` → `CON-ENG` → `CON-ENG-MECH` → `CON-ENG-MECH-PETRO`, and `CON` carries
`statutorySector: construction`, so the statutory medium ceiling for this company is the construction
line (R170m), not the general one. Note the teaching point the record is built to make: **B-BBEE Level 1
and SMME size class are independent axes.** This is a Level 1 empowered company and a *medium*
enterprise, not a micro one — conflating empowerment level with size class is the most common analytical
error in South African corporate data.

The contrasting record
[`examples/za-spa-0001-informal-spaza.json`](../markets/organizations/taxonomy/examples/za-spa-0001-informal-spaza.json)
shows the other end of the same taxonomy: an unregistered informal spaza shop in KwaMashu with no CIPC
number, micro on both proxies, and B-BBEE Level 1 reached through the 100% black-owned EME affidavit
route rather than a scorecard.

---

## 6. Verification status

Everything in this framework that could be checked against a source was checked on 2026-10-08. What
could not be verified is marked as such in the data rather than being filled in plausibly:

| Item | Status |
|---|---|
| Schedule 1 sector thresholds (2019 revision, GN 399) | Source-verified against gov.za and a DSBD procurement document |
| 2026 replacement of the schedule | Existence verified; **the new sector turnover table was not retrievable here and is left empty on purpose** |
| B-BBEE EME / QSE / Generic boundaries and sector-code variations | Verified against published dtic-aligned guidance |
| Municipalities (8 metros, 44 district municipalities) | Enumerated; demarcation codes deliberately not hardcoded (see `municipalityCodePolicy`) |
| Local municipalities | Not enumerated — free text with provenance, sourced from the Municipal Demarcation Board |
| JSE listing status of specific companies | Not asserted. Listing status is a dated field on the record, not a fact baked into the taxonomy |

Company names appearing in the sector tree's South African context notes are **illustrative anchors for
navigating the taxonomy**, not a dataset of verified companies. Headcount, turnover and listing status
are never asserted by the taxonomy itself — they are per-record fields with provenance.

One correction worth flagging for anyone mapping FMCG: **Pioneer Foods Group is no longer JSE-listed.**
It listed in 2008 under ticker PFG and delisted in 2020 following PepsiCo's acquisition (completed
23 March 2020); it is now a PepsiCo subsidiary. Similarly, Anglo American Platinum completed its demerger
on 31 May 2025 and continues as **Valterra Platinum** with a primary JSE listing (VAL) and an LSE
secondary listing from 2 June 2025 (VALT). Records in those niches must carry `jseListingAsOf` dates
rather than inherited assumptions.

---

## 7. Extending the taxonomy

1. Add the node to `markets/organizations/taxonomy/sector-tree.json`. The id must begin with its parent's
   id, the parent must already exist, and tiers cannot be skipped.
2. If it introduces a new macro-sector, add `statutorySector` and `sics`, and confirm the sector class
   exists in `statutory-schedule-1.json`.
3. Run `npm run taxonomy:outline` and `npm run taxonomy:schema` to regenerate the outline and the JSON
   Schema (the node enum changes).
4. Run `npm run validate:taxonomy` and `npm test`.
5. If the node should be reachable from the existing organization model, add the mapping to
   `industry-crosswalk.json`.
