# Scope — SA Qualified Accountant & Finance Skills Intelligence Map

Status: live research document. Update as scope decisions are made.

## Objective

Build the most comprehensive possible **public-domain database of professionally qualified
accountants and finance professionals across South Africa**, with verified information about
designation, professional body, academic qualifications, articles/practical-training route,
employment, location, industry, finance specialisation, systems and skills.

This is a **national skills pool and market-intelligence database**, not a shortlist.

## Target population

Confirmed holders of one or more recognised professional accountancy designations:

| Designation | Normalised | Professional body |
|---|---|---|
| Chartered Accountant (South Africa) | `CA(SA)` | `SAICA` |
| Professional Accountant (SA) | `PA(SA)` | `SAIPA` |
| Associate General Accountant (SA) | `AGA(SA)` | `SAICA` |
| ACCA member / fellow | `ACCA` / `FCCA` | `ACCA` |
| CIMA associate / fellow | `ACMA` / `FCMA` | `CIMA` |
| Chartered Global Management Accountant | `CGMA` | depends on evidence |

Secondary (retained, not counted in the main qualified population):

- People with **confirmed completed articles** whose current designation is unverified
  (`ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED`).
- `RESEARCH_HOLD` — potentially relevant people needing more evidence.
- `REJECTED` — investigated and found not to meet inclusion criteria (with reason).

## Geographic scope

All nine provinces: Western Cape, Gauteng, KwaZulu-Natal, Eastern Cape, Free State, Limpopo,
Mpumalanga, North West, Northern Cape.

Location is recorded at the most precise level the evidence supports (country → province →
city/metro → suburb). Suburb is never invented from an employer head office.

## Role families covered

All finance families where qualification is the binding criterion (see `skills_taxonomy.md`),
ranging from Accountant through Financial Controller / Finance Manager / FP&A / Group Accounting
to CFO / Finance Director. **Qualifications are more important than title.**

## Designation × route separation

For every record, the following are answered **independently** and never collapsed: (1) professionally
qualified? (2) designation? (3) body? (4) completed articles? (5) which articles? (6) where? (7) or
an alternative recognised route (RPL / reciprocity / PER / other)?

See `qualification_rules.md` for the full truth model.

## Out of scope

- People whose only evidence is being a student / candidate / trainee / affiliate (retained as
  `REJECTED` / `RESEARCH_HOLD` where discovered, not counted as qualified).
- CIBA-designated bookkeepers/accounting officers unless also holding a target designation.
- Non-South-Africa geographies (except transient evidence of an SA-qualified person abroad, which
  is noted but not the focus).

## Data versioning

- JSONL stores are append-only within a session; corrections are made by rewriting the line for
  the same `id` (record history is preserved by `date_last_verified` and `notes`).
- New records get sequential ids `acc-####`, `cmp-####`, `src-####`; document generation policy
  in `schema.md`.
