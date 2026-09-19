# Scope — SA Accounting & Finance Talent Intelligence Map

Status: live research document. Update as scope decisions are made.

## Objective

Build the most comprehensive possible **public-domain database of finance professionals in South Africa from bookkeeper-equivalent level through Finance Director / CFO**, with source-verified information about current role, employer, location, academic qualifications, professional designation/body registration, articles or practical-training route, industry, finance specialisation, systems, skills and career history.

This is a **national skills pool and market-intelligence database**, not a shortlist.

Professional qualification is an important attribute and filter. It is **not** the inclusion gate for the wider finance-team population.

## Target population

### Primary finance-team population

Include current finance professionals whose role is at **bookkeeper-equivalent level or above**, including:

- Bookkeeper / Senior Bookkeeper
- Assistant Accountant / Junior Accountant / Accountant / Senior Accountant
- Financial Accountant / Group Accountant / Management Accountant / Cost Accountant
- Plant / Operations / Operational / Manufacturing Accountant
- Commercial Accountant / Finance Analyst / Financial Analyst / FP&A
- Finance Business Partner / Commercial Finance
- Financial Controller / Finance Controller / Group / Divisional / Regional / Plant / Business Controller where the role is explicitly finance
- Financial Manager / Finance Manager / Group / Divisional / Regional / Operational Financial Manager
- Head of Finance / Head of Financial Control / Group Reporting / Consolidation leadership
- Finance Executive / Financial Director / Finance Director / CFO
- Accounts Payable, Accounts Receivable, Creditors, Debtors and Payroll **controller / supervisor / manager / leadership** roles where the public evidence places the role at bookkeeper-equivalent level or above

### Professionally qualified subset

Record and filter confirmed holders of recognised professional accountancy designations independently:

| Designation | Normalised | Professional body |
|---|---|---|
| Chartered Accountant (South Africa) | `CA(SA)` | `SAICA` |
| Professional Accountant (SA) | `PA(SA)` | `SAIPA` |
| Associate General Accountant (SA) | `AGA(SA)` | `SAICA` |
| ACCA member / fellow | `ACCA` / `FCCA` | `ACCA` |
| CIMA associate / fellow | `ACMA` / `FCMA` | `CIMA` |
| Chartered Global Management Accountant | `CGMA` | depends on evidence |

People with no confirmed professional designation remain valid finance-team records when their identity, current finance employment and in-scope title are source-verified.

## Company-led coverage rule

When research is driven by a closed target-company universe, **every company must receive an explicit outcome**:

- `RESEARCHED_WITH_PEOPLE` — one or more in-scope current finance people verified.
- `RESEARCHED_ZERO_PUBLIC_RESULTS` — the defined searches were completed but no in-scope current finance person could be source-verified.
- `NEEDS_RESEARCH` — not yet completed.
- `IDENTIFIER_AMBIGUOUS` — company identity/domain collision requires manual resolution.

A company may never disappear from the sweep simply because no public finance profile was found. “No verified public individual located” is different from “the company has no finance team.”

## Geographic scope

All nine provinces: Western Cape, Gauteng, KwaZulu-Natal, Eastern Cape, Free State, Limpopo, Mpumalanga, North West, Northern Cape.

Location is recorded at the most precise level the evidence supports (country → province → city/metro → suburb). Suburb is never invented from an employer head office.

For a Western Cape company-led sweep, retain South African group finance people outside the Western Cape when they are part of the same employer finance structure; location remains filterable.

## Qualification × route separation

For every record, answer these **independently**:

1. Is the person professionally qualified?
2. What professional designation(s) do they hold?
3. What professional body registration is publicly evidenced?
4. Did they complete SAICA / SAIPA articles or another explicit training contract?
5. Which body / training office?
6. Where and when, if publicly evidenced?
7. Is the route ACCA PER / CIMA PER / RPL / reciprocity / other?
8. What academic qualifications are publicly evidenced?

A designation never proves a specific articles employer or route by itself.

See `qualification_rules.md` for the full truth model.

## Role floor / out of scope

Out of scope for this wider finance-team population unless stronger evidence establishes bookkeeper-equivalent responsibility:

- pure creditors / debtors / AP / AR clerks;
- finance or accounting interns / trainees;
- generic finance administrators whose public role does not establish bookkeeper-equivalent responsibility;
- payroll clerks / administrators;
- data-entry / cash-office / settlement clerks;
- non-finance “controller” roles such as quality, stock, inventory, logistics, transport, document, technical or production controller;
- people attached only by name similarity or inferred employer.

These may be retained in a research rejection/audit log, but they do not enter the published candidate population.

## Data versioning

- JSONL stores remain the research source of truth.
- New records append; corrections rewrite the same `id`.
- New people use sequential `acc-####`; companies `cmp-####`; sources `src-####`.
- The UI export is regenerated from the research store and is never treated as authoritative.
