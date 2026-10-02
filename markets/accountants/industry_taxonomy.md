# Industry, Seniority & Adjacency Taxonomy — CA(SA) Talent Map

Companion to `skills_taxonomy.md`. Where `skills_taxonomy.md` covers finance *functions,
skills and systems*, this file covers the **market-mapping layer** required by the CA(SA) master
research instruction: seniority bands, employer normalisation and scale, primary / grouped
industry, industry adjacency, business-model tags and finance-environment tags.

The machine-readable source of truth is [`industry_taxonomy.json`](./industry_taxonomy.json),
loaded by [`taxonomy.py`](./taxonomy.py). Nothing here is evidence about a person — these are
**classification tools applied on top of evidenced fields**. If the evidence is absent, the
classification output is `Unknown`, never a guess (Section 30).

---

## 1. Seniority bands (S1–S8)

Section 14 of the master instruction maps onto `seniority_bands` in the JSON:

| Band | Label | Vocabulary examples |
|---|---|---|
| S1 | Accounting / Specialist | Accountant, Financial Accountant, Reporting Accountant |
| S2 | Senior Individual Contributor | Senior Financial Accountant, Senior Management Accountant, Senior Finance Business Partner |
| S3 | Manager | Financial Manager, Finance Manager, Commercial Finance Manager, Financial Controller |
| S4 | Senior Manager / Group | Senior Financial Manager, Group Financial Manager, Group Financial Controller, Divisional Finance Manager |
| S5 | Head | Head of Finance, Head of Commercial Finance, Head of FP&A, Head of Finance Operations |
| S6 | Director | Finance Director, Financial Director, Executive Director: Finance |
| S7 | CFO | CFO, Group CFO, Divisional CFO, Chief Financial Officer |
| S8 | Broader Executive | COO, Managing Director, CEO (where CA(SA) is confirmed) |

Rules:

- The band is derived from the **evidenced current title** (longest keyword wins, `S8` takes
  precedence over `S7` so that "CEO and Executive Director" is not mis-banded).
- An *acting* or *interim* elevation never sets the band — the substantive role does (for
  example `acc-1019` Henry Enslin is S3 Financial Manager while acting CFO for a month).
- A record's explicit `seniority_band` always wins over the derived value.

## 2. Primary industry → grouped industry (Sections 15–16)

`grouped_industries` holds the 22-value controlled taxonomy (Consumer & FMCG, Retail &
Wholesale, Industrial & Manufacturing, Construction & Building Materials, Agriculture &
Agri-processing, Mining & Resources, Energy & Utilities, Logistics & Supply Chain, Banking &
Lending, Insurance, Investments & Capital Markets, Fintech & Payments, Technology & Software,
Telecommunications, Healthcare & Life Sciences, Property & Real Estate, Hospitality Leisure &
Tourism, Professional Services, Media & Communications, Government & Public Sector, Education,
NGO / Non-Profit). Each grouped industry lists the **primary industries** that roll up into it.

- `current_industry` on a record remains the specific, evidence-based classification
  (for example `Pharmaceutical Retail`, not "retail").
- The grouped industry is derived deterministically from that primary industry.
- A primary industry whose name is itself a grouped industry (e.g. `FMCG`) rolls up to itself.

## 3. Associated industry groups (Section 17) and adjacency (Section 22)

`industry_adjacency` records, per primary industry, which **grouped industries** share
operational characteristics relevant to finance-talent mobility — `strong` first, then
`moderate`. `associated_industry_groups()` returns the record's own grouped industry first,
then up to three adjacencies.

The output is a *search-surface* label only. It does **not** assert that a person is suitable
for, or willing to move into, an adjacent industry (Section 22's explicit prohibition).

## 4. Business-model tags (Section 18)

Controlled list in `business_model_tags`. Two rules keep this honest:

1. **Employer facts, not person inferences.** A tag such as `JSE Listed`, `Multinational`,
   `Manufacturing` or `Asset Intensive` describes the evidenced employer, not the individual.
2. **Evidence only.** Tags are attached during research from the cited source (listing status,
   annual report, company profile) and filtered against the controlled vocabulary by
   `evidence_backed_tags()`. Titles never generate tags.

## 5. Finance-environment tags (Section 19)

Controlled list in `finance_environment_tags`. These describe the finance environment the
person is *evidenced* to work in — for example `Treasury` and `Capital Management` for an FD
whose cited biography includes a decade running corporate finance and treasury, or `M&A` for a
CFO recruited for capital-structure work. A title alone never produces a tag; where no source
supports the environment, the field stays empty and the master export prints `Unknown`.

## 6. Employer normalisation (Section 23) and scale (Section 24)

`employer_normalization` maps raw employer strings and aliases to a `canonical` employer and an
`employer_group` (for example `Imperial Logistics` → canonical `Imperial Logistics`, group
`DP World`; `Albany Bakeries` → group `Tiger Brands`). `employer_ownership_types` and
`employer_scales` are the controlled values; measurable scale (revenue, employees, market
position) is recorded on the company record in `companies.jsonl`, never invented.

## 7. Geography

`metro_map` converts an evidenced city into a metro / region label (Cape Town → City of Cape
Town Metro, Westville → eThekwini Metro, Emalahleni → Emalahleni Local Municipality …).
No residential location is ever inferred: city and metro are populated only from the
professional location evidenced at source, otherwise `Unknown`.

## 8. Master export (Section 32) and coverage (Section 39)

```bash
python3 gen_master_export.py
```

writes three artefacts from the append-only `people.jsonl`:

| File | Contents |
|---|---|
| `master_ca_sa.jsonl` | One JSON object per CA(SA) holder, in the Section 32 master schema |
| `master_ca_sa.csv` | The same rows as a flat 47-column CSV for recruiter use |
| `coverage_matrix.json` | Counts by CA(SA) confidence, province, seniority band, grouped industry and primary industry |

The projection **never mutates** the research DB. Every derived field is reproducible: rerun the
script and the output regenerates from the JSONL plus this taxonomy.
