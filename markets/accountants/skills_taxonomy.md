# Skills, Systems & Industry Taxonomy (controlled vocabularies)

Use these normalised values in records. Preserve the source's raw wording in `notes`/evidence.

## Finance function families (for `current_role_family` / `current_function`)

Bookkeeping · Financial Accounting · Group Accounting · Management Accounting · Cost Accounting ·
Financial Analysis · Financial Control · Group Reporting · Consolidations · FP&A · Commercial Finance ·
Finance Business Partnering · Operational Finance · Manufacturing Finance · Treasury · Tax ·
Internal Audit · External Audit · Risk · Shared Services · Accounts Payable Leadership ·
Accounts Receivable Leadership · Revenue · Finance Transformation · Systems Finance ·
Project Finance · Executive Finance · Accounts Payable Leadership · Accounts Receivable Leadership · Payroll Leadership · Other

A role family may be derived from an explicit title. Detailed technical skills are **not**
inferred from a broad title (e.g. `Group Financial Accountant` → `Group Accounting`, but not
automatically `consolidations`).

## Verified skill categories

- Bookkeeping: cashbook, bank reconciliations, general ledger support, journals, trial balance, bookkeeping controls
- Financial accounting: month-end, journals, general ledger, balance-sheet reconciliations,
  management accounts, annual financial statements, IFRS, IFRS for SMEs, audit preparation,
  statutory reporting
- Group finance: group reporting, consolidations, intercompany accounting, multi-entity accounting,
  foreign subsidiaries, eliminations, group packs, holding-company reporting
- Management accounting: budgeting, forecasting, variance analysis, costing, standard costing,
  activity-based costing, inventory costing, margin analysis, profitability analysis
- FP&A: financial modelling, forecasting, planning, scenario modelling, management reporting,
  business performance analysis, dashboards
- Commercial finance: pricing, commercial modelling, margin optimisation, profitability, business
  partnering, investment appraisal, contract analysis
- Operational finance: plant finance, manufacturing finance, stock, inventory, production costing,
  logistics finance, supply-chain finance
- Leadership: team management, finance-team leadership, shared-services leadership, stakeholder
  management, process ownership, finance transformation
- Systems/transformation: ERP implementation, ERP migration, system integration, finance-system
  implementation, chart-of-accounts redesign, process automation, reporting automation,
  master-data management

Each skill stores: skill, evidence, source_url, confidence, current_or_historic, employer_context.

## Accounting / ERP systems (person-linked only on individual evidence)

Sage 300 · Sage ERP 300 (normalise → `Sage 300 / ACCPAC`) · ACCPAC · Sage X3 · Sage 200 ·
Sage Evolution · Sage Pastel · SAP · SAP S/4HANA · SAP FI · SAP CO · Oracle · Oracle Financials ·
Oracle Fusion · NetSuite · Microsoft Dynamics · Dynamics 365 · Business Central · Syspro ·
JD Edwards · Xero · QuickBooks · Pastel · Great Plains · Workday Finance · Infor · Unit4 ·
Pronto · Acumatica · Other

## Analytics / finance technology tools

Excel · Power BI · Power Query · Power Pivot · SQL · Tableau · Qlik · Alteryx · VBA · Python ·
Hyperion · OneStream · SAP BPC · Cognos · Adaptive Planning · Anaplan · Other

## Systems evidence rule

`person_systems_confirmed` vs `employer_systems_observed` are always separate. "Company X uses
Sage 300" never establishes "Person Y uses Sage 300". Systems also carry a temporal status:
`CURRENT` | `HISTORIC` | `DATE_UNKNOWN`.

## Industry taxonomy (`current_industry`, `current_sub_industry`, `historic_industry_exposure`)

Accounting / Audit · Banking · Insurance · Fintech · Financial Services · Asset Management ·
Investment Management · Retail · Wholesale · FMCG · Food & Beverage · Manufacturing · Automotive ·
Mining · Quarrying / Aggregates · Construction · Building Materials · Engineering · Energy ·
Renewable Energy · Oil & Gas · Agriculture · Agribusiness · Logistics · Transport · Shipping ·
Aviation · Technology · Software · Telecommunications · Healthcare · Pharmaceuticals · Education ·
Hospitality · Tourism · Property · Real Estate · Professional Services · Government ·
State-Owned Enterprise · Non-Profit · Media · Advertising · Consumer Services · Other

Employer industry ≠ the person's specialisation. Career history drives `historic_industry_exposure`.

## Boolean filter fields (values `true` / `false` / `unknown` — never silently false when unknown)

bookkeeping · financial_accounting · ca_sa · pa_sa · aga_sa · acca · fcca · acma · fcma · cgma · saica_articles_confirmed ·
saipa_articles_confirmed · acca_per_confirmed · cima_per_confirmed · group_accounting ·
consolidations · management_accounting · cost_accounting · fpa · commercial_finance · finance_business_partnering · financial_control · treasury · tax · ap_leadership · ar_leadership · payroll_leadership ·
sage300_accpac · sap · oracle · syspro · dynamics
