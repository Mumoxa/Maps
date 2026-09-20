#!/usr/bin/env python3
"""Batch 14 — Western Cape accounting/audit firm partner sweeps (bulk source pattern).

Source pattern: a firm's public team page states the designation **next to each
individual's name**, which satisfies qualification_rules.md (a designation is only
CONFIRMED where it appears against the individual).

Dedup applied against people_index.md before writing. **Nadia van der Westhuizen**
appears on the Ratio Group team page but is already in the store as acc-0123
(LDP Chartered Accountants) — she is NOT re-added; that record should be enriched
with the Ratio Group affiliation instead.

Milton Kirsten (Ratio Group, "B Com Financial Accounting") is deliberately NOT added:
no target designation, so he fails scope.md inclusion criteria.

No person-level location is invented. Firms state an office, not a residence, so
`location_confidence` stays UNCONFIRMED and city/province stay null.
"""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402
from bulk_lib import make_specs  # noqa: E402

TODAY = "2026-09-19"

RATIO = "https://ratiogroup.co.za/"
SCAUDIT = "https://scaudit.co.za/"
ZEELIE = "https://www.zeelie.com/"
VANWYK = "https://www.vanwykauditors.com/"
TCINC = "https://www.tc-inc.co.za/"
SCHOEMANS = "https://www.schoemans.co.za/"

PEOPLE = []
COMPANIES = []
SOURCES = []

# ------------------------------------------------------------------ Ratio Group
PEOPLE += make_specs(
    rows=[
        ("Francois Geldenhuys", ["CA(SA)"], "Director, Ratio Advisory (Pty) Ltd",
         {"academic": ["B Compt (Hons)"], "role_family": "Tax & Advisory"}),
        ("Tian van der Merwe", ["CA(SA)"], "Director, Ratio Auditors Incorporated",
         {"academic": ["B Compt (Hons)"], "role_family": "External Audit"}),
        ("Annebelle Malan", ["CA(SA)"], "Director, Ratio Auditors Incorporated",
         {"academic": ["B Acc (Hons)"], "role_family": "External Audit"}),
        ("Christiaan Laubscher", ["CA(SA)"], "Director, Ratio Advisory (Pty) Ltd",
         {"academic": ["B Acc (Hons)", "H Dip Tax", "B Com (Hons) (Tax)"],
          "role_family": "Tax & Advisory"}),
        ("Alice le Roux", ["CA(SA)"], "Director, Ratio Auditors Incorporated",
         {"academic": ["B Compt (Hons)"], "role_family": "External Audit"}),
    ],
    employer="Ratio Group",
    industry="Accounting / Audit",
    sub_industry="Audit and advisory practice",
    evidence='Ratio Group "Meet the Team" page lists each director with the designation '
             'against their name — e.g. "Tian van der Merwe — B Compt (Hons), CA (SA), RA"; '
             '"Annebelle Malan — B Acc (Hons), CA (SA), RA". The page also records that the '
             'firm runs "a team of SAICA trainees".',
    source_urls=[RATIO],
    date=TODAY,
)

# ------------------------------------------------------------------ SC Audit
PEOPLE += make_specs(
    rows=[
        ("Niel Schoeman", ["CA(SA)"], "Partner, SC Audit (Registered Auditor since 2001)",
         {"role_family": "External Audit",
          "notes": "Also operates Schoemans (Tygervalley and Malmesbury) and Acredo (Paarl, "
                   "Centurion). CA(SA) and Registered Auditor since 2001 per the SC Audit "
                   "team page."}),
        ("Simone Coetzee", ["CA(SA)"], "Partner, SC Audit (Registered Auditor since 2017)",
         {"role_family": "External Audit",
          "notes": "CA(SA) and Registered Auditor since 2017 per the SC Audit team page. "
                   "Co-founder with Niel Schoeman."}),
        ("Hennie Meyer", ["CA(SA)"], "Registered Auditor, SC Audit",
         {"role_family": "External Audit",
          "notes": "CA(SA) since 2021 and Registered Auditor since 2024 per the SC Audit "
                   "team page."}),
    ],
    employer="SC Audit (Schoeman Coetzee Audit)",
    industry="Accounting / Audit",
    sub_industry="Audit and assurance practice",
    evidence='SC Audit "MEET THE TEAM" section states the designation and registration year '
             'for each partner: "NIEL SCHOEMAN — CA(SA) and Registered Auditor since 2001"; '
             '"SIMONE COETZEE — CA(SA) and Registered Auditor since 2017"; "HENNIE MEYER — '
             'CA(SA) since 2021 and Registered Auditor since 2024".',
    source_urls=[SCAUDIT],
    date=TODAY,
)

# ------------------------------------------------------------------ Zeelie Auditors
PEOPLE += make_specs(
    rows=[
        ("Pieter Zeelie", ["CA(SA)"], "Founder and partner, Zeelie Auditors",
         {"role_family": "External Audit",
          "notes": "Established Zeelie Auditors in 1991; the firm's About page names him as "
                   "Pieter Zeelie CA (SA)."}),
        ("Suzel Breytenbach", ["CA(SA)"], "Partner, Zeelie Auditors",
         {"role_family": "External Audit"}),
        ("Trudie Botha", ["CA(SA)"], "Partner, Zeelie Auditors",
         {"role_family": "External Audit"}),
    ],
    employer="Zeelie Auditors",
    industry="Accounting / Audit",
    sub_industry="Audit practice",
    evidence='Zeelie Auditors About page: "established in 1991 by Pieter Zeelie CA (SA) ... '
             'grown into a dynamic small/medium sized practise which allowed for the '
             'appointment of two more partners, Suzel Breytenbach CA (SA) and Trudie Botha '
             'CA (SA)." Designation stated against each name.',
    source_urls=[ZEELIE],
    date=TODAY,
)

# ------------------------------------------------------------------ Van Wyk Auditors
PEOPLE += make_specs(
    rows=[
        ("Willem Schoeman", ["CA(SA)"], "Partner, Van Wyk Auditors",
         {"academic": ["Hons B Compt"]}),
        ("Justus van Wyk", ["CA(SA)"], "Partner, Van Wyk Auditors",
         {"academic": ["Hons B Compt"]}),
        ("Carmen Coetzee", ["CA(SA)"], "Partner, Van Wyk Auditors",
         {"academic": ["Hons B Compt"]}),
        ("Tanya Oberholzer", ["CA(SA)"], "Partner, Van Wyk Auditors",
         {"academic": ["Hons B Compt"]}),
    ],
    employer="Van Wyk Auditors",
    industry="Accounting / Audit",
    sub_industry="Audit practice",
    evidence='Van Wyk Auditors contact page lists each partner with "Hons B Compt. '
             'GR(SA) / CA(SA)" against their name.',
    source_urls=[VANWYK],
    date=TODAY,
)

# ------------------------------------------------------------------ TC inc.
PEOPLE += make_specs(
    rows=[
        ("André Conradie", ["CA(SA)"], "Founder, TC inc. (chartered accountant, registered "
                                       "auditor and tax practitioner)",
         {"role_family": "External Audit",
          "notes": "Founded the practice in Durbanville in 2006 as Turner Conradie; the firm "
                   "was later renamed TC inc."}),
        ("Eddie Turner", ["CA(SA)"], "Partner, TC inc. (chartered accountant, registered "
                                     "auditor and tax practitioner)",
         {"role_family": "External Audit"}),
        ("Abré van Wyk", ["CA(SA)"], "Partner, TC inc. (chartered accountant and tax "
                                     "practitioner)",
         {"role_family": "Tax & Advisory"}),
    ],
    employer="TC inc.",
    industry="Accounting / Audit",
    sub_industry="Audit, accounting and tax practice",
    evidence='TC inc. site: "Both André Conradie and Eddie Turner are chartered accountants, '
             'registered auditors and tax practitioners, whereas Abré van Wyk is a chartered '
             'accountant and tax practitioners." Leadership pages are titled "YOUR SUCCESS '
             'COUNTS – André Conradie CA(SA)" and "A VIEW FROM THE TOP – Abré van Wyk CA(SA)".',
    source_urls=[TCINC],
    date=TODAY,
)

# ------------------------------------------------------------------ Schoemans Group
PEOPLE += make_specs(
    rows=[
        ("Dirk Visser", ["CA(SA)"], "Partner, Schoemans Accountants",
         {"role_family": "Tax & Advisory"}),
        ("Severus Smith", ["CA(SA)"], "Partner, Schoemans Accountants",
         {"role_family": "Tax & Advisory"}),
    ],
    employer="Schoemans Registered Auditors and Chartered Accountants",
    industry="Accounting / Audit",
    sub_industry="Accounting, tax and audit practice",
    evidence='Schoemans site: "Owner and operator Niel Schoeman have been a practising CA (SA) '
             'and registered auditor since 2001 and, alongside Partners Dirk Visser and Severus '
             'Smith, manages offices in both Tygervalley and Malmesbury." The firm describes '
             '"a team of SAICA-, SAIPA- and IRBA-registered professionals". Recorded as '
             'HIGH_CONFIDENCE: the partners are named within a sentence anchored on CA (SA) '
             'rather than having the designation repeated against each individual name.',
    source_urls=[SCHOEMANS],
    date=TODAY,
)

# the Schoemans partners are inferred from a CA(SA)-anchored sentence, not stated per name
for spec in PEOPLE[-2:]:
    spec["status"] = "HIGH_CONFIDENCE"
    spec["designation_status"] = "HIGH_CONFIDENCE"

# ------------------------------------------------------------------ companies
NEW_COMPANIES = [
    ("Ratio Group", ["Ratio Auditors Incorporated", "Ratio Advisory (Pty) Ltd"], RATIO,
     "Accounting / Audit", "Audit and advisory practice"),
    ("SC Audit (Schoeman Coetzee Audit)", ["Schoeman Coetzee Audit", "SC Audit"], SCAUDIT,
     "Accounting / Audit", "Audit and assurance practice"),
    ("Zeelie Auditors", [], ZEELIE, "Accounting / Audit", "Audit practice"),
    ("Van Wyk Auditors", [], VANWYK, "Accounting / Audit", "Audit practice"),
    ("TC inc.", ["Turner Conradie"], TCINC, "Accounting / Audit",
     "Audit, accounting and tax practice"),
    ("Acredo", ["Acredo Quality Auditing, Accounting and Tax Compliance"], SCHOEMANS,
     "Accounting / Audit", "Quality auditing, accounting and tax compliance"),
]


def build_companies():
    import json
    existing = set()
    with open(os.path.join(BASE, "companies.jsonl"), encoding="utf-8") as f:
        for line in f:
            if line.strip():
                rec = json.loads(line)
                existing.add(rec["company_name"].lower())
                for a in rec.get("company_aliases") or []:
                    existing.add(a.lower())
    nid = db_lib.next_id(os.path.join(BASE, "companies.jsonl"), "cmp")
    out = []
    for name, aliases, site, industry, sub in NEW_COMPANIES:
        if name.lower() in existing:
            print("  SKIP existing company:", name)
            continue
        out.append({
            "id": "cmp-%04d" % nid,
            "company_name": name,
            "company_aliases": aliases,
            "website": site,
            "industry": industry,
            "sub_industry": sub,
            "headquarters": None,
            "south_africa_locations": [],
            "company_size_if_public": None,
            "listed_or_private": "private",
            "parent_company": None,
            "source_urls": [site],
            "date_verified": TODAY,
            "notes": "Western Cape audit/accounting practice added during the firm-team-page "
                     "sweep (batch 14).",
        })
        nid += 1
    return out


SOURCE_ROWS = [
    (RATIO, "Employer Website",
     "Ratio Group 'Meet the Team': six directors with CA(SA)/RA stated against each name.",
     "PRIMARY"),
    (SCAUDIT, "Employer Website",
     "SC Audit 'MEET THE TEAM': three partners with CA(SA) and RA registration years stated.",
     "PRIMARY"),
    (ZEELIE, "Employer Website",
     "Zeelie Auditors About page: founder and two partners named as CA (SA).", "PRIMARY"),
    (VANWYK, "Employer Website",
     "Van Wyk Auditors contact page: four partners listed as Hons B Compt, GR(SA)/CA(SA).",
     "PRIMARY"),
    (TCINC, "Employer Website",
     "TC inc.: André Conradie and Eddie Turner chartered accountants/registered auditors; "
     "Abré van Wyk chartered accountant. Leadership pages carry CA(SA) in the title.",
     "PRIMARY"),
    (SCHOEMANS, "Employer Website",
     "Schoemans: Niel Schoeman practising CA(SA) and registered auditor since 2001, alongside "
     "Partners Dirk Visser and Severus Smith; offices in Tygervalley and Malmesbury.",
     "PRIMARY"),
]


def main():
    import json
    sid = db_lib.next_id(os.path.join(BASE, "sources.jsonl"), "src")
    for url, stype, summary, rel in SOURCE_ROWS:
        SOURCES.append({
            "id": "src-%04d" % sid, "url": url, "source_type": stype,
            "person_id": None, "company_id": None, "evidence_type": "GENERAL",
            "evidence_summary": summary, "qualification_supported": True,
            "skill_supported": None, "system_supported": None,
            "employment_supported": True, "accessed_date": TODAY,
            "reliability": rel, "status": "USED",
        })
        sid += 1

    companies = build_companies()
    db_lib.append_batch(PEOPLE, companies, SOURCES,
                        label="Batch 14 (WC firm team-page sweep)")


if __name__ == "__main__":
    main()
