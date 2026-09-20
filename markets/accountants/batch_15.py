#!/usr/bin/env python3
"""Batch 15 — Accountancy SA "CA(SA) Profiles" index (bulk source, chunks 0-1).

Source: https://www.accountancysa.org.za/casa-profiles/ — a multi-chunk index of
SAICA member profile articles. Each entry states CA(SA) against the individual.

Dedup applied against people_index.md:
  - Kerry Cassel CA(SA), CEO Motus Mobility Solutions -> already acc-0046. NOT re-added.
  - Polani Sokombela, Jody Baumgarten -> already in store. NOT re-added.
  - Bernard Rolfe Whitaker / BR Whitaker & Co (est. 1933) -> historical family-firm
    narrative, deceased founder. OUT OF SCOPE (not a live talent-pool candidate).

Location: none of these three has a person-level location in the source, and an
employer's head office is NOT a work location for a specific role (unlike a firm
partner page). So city/province stay null and location_confidence stays
UNCONFIRMED rather than being inferred from the employer.
"""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

TODAY = "2026-09-19"
INDEX = "https://www.accountancysa.org.za/casa-profiles/"

PEOPLE = [
    dict(
        date=TODAY, verified=TODAY, status="CONFIRMED",
        name="Mbeko Mbebe", first="Mbeko", surname="Mbebe",
        des=["CA(SA)"],
        title="Chartered Accountant",
        role_family="Other",
        industry=None,
        articles_status="CONFIRMED_EXPLICIT", articles_body="SAICA",
        articles_employer=None, articles_period=None,
        articles_location="South Africa (training office not stated in source)",
        evidence='Accountancy SA profile "Mbeko Mbebe – Delay and perseverance: An inspiring '
                 'journey to CA(SA)": "With the release of the December 2022 Assessment of '
                 'Professional Competence (APC) results in February 2023, Mbeko Mbebe became a '
                 'chartered accountant." Passing the APC is the final SAICA qualification step, '
                 'which requires a completed training contract.',
        academic=[],
        source_urls=["https://www.accountancysa.org.za/profile-mbeko-mbebe-delay-and-"
                     "perseverance-an-inspiring-journey-to-casa/"],
        primary_source=INDEX,
        notes="Qualified February 2023 (APC results). Employer not stated in the profile. "
              "No location evidence.",
    ),
    dict(
        date=TODAY, verified=TODAY, status="CONFIRMED",
        name="Neil Morris", first="Neil", surname="Morris",
        des=["CA(SA)"],
        title="Global Head of Assurance and ESG Methodology",
        employer="KPMG (South Africa)",
        role_family="External Audit", function="Assurance and ESG methodology",
        industry="Accounting / Audit", sub_industry="Audit network",
        evidence='Accountancy SA profile "Neil Morris – The rise of ESG Reporting": interview '
                 'with "Neil Morris, Global Head of Assurance and ESG Methodology at KPMG", '
                 'published in the CA(SA) Profiles series.',
        academic=[],
        source_urls=["https://www.accountancysa.org.za/profile-neil-morris-the-rise-of-esg-"
                     "reporting/"],
        primary_source=INDEX,
        notes="Global (not SA-specific) role, so no South African location is asserted even "
              "though KPMG South Africa is the employer of record. Location unverified.",
    ),
    dict(
        date=TODAY, verified=TODAY, status="CONFIRMED",
        name="Bhavna Gounder", first="Bhavna", surname="Gounder",
        des=["CA(SA)"],
        title="Banking finance professional (Investec Bank)",
        employer="Investec Bank",
        role_family="Financial Control", function="Corporate banking",
        industry="Banking", sub_industry="Corporate and investment banking",
        evidence='Accountancy SA profile "Bhavna Gounder – Juggling a thriving career and '
                 'motherhood": her career "has flourished since she qualified as a CA(SA) in '
                 'the mid-2000s"; "Bhavna Gounder started her career at Investec Bank as debt '
                 'transactor for corporate clients."',
        academic=[],
        career=[{"employer": "Investec Bank", "title": "Debt transactor, corporate clients "
                 "(career start)", "notes": "Period not stated in source"}],
        source_urls=["https://www.accountancysa.org.za/profile-bhavna-gounder-juggling-a-"
                     "thriving-career-and-motherhood/"],
        primary_source=INDEX,
        yoe="20", yoe_basis="Qualified as a CA(SA) in the mid-2000s.",
        notes="Investec Bank is the stated career-start employer; her current employer and role "
              "are not stated in the profile, so employment currency is UNCONFIRMED. "
              "Co-authored a published book with her daughter. No location evidence.",
    ),
]

COMPANIES = [{
    "id": None,
    "company_name": "Investec Bank",
    "company_aliases": ["Investec"],
    "website": "https://www.investec.com/",
    "industry": "Banking",
    "sub_industry": "Corporate and investment banking",
    "headquarters": None,
    "south_africa_locations": [],
    "company_size_if_public": None,
    "listed_or_private": "listed",
    "parent_company": "Investec Limited",
    "source_urls": ["https://www.accountancysa.org.za/profile-bhavna-gounder-juggling-a-"
                    "thriving-career-and-motherhood/"],
    "date_verified": TODAY,
    "notes": "Added from the Accountancy SA CA(SA) Profiles index (batch 15).",
}]

SOURCES = [
    (INDEX, "Professional Body",
     "Accountancy SA CA(SA) Profiles index — multi-chunk list of SAICA member profile "
     "articles; mined chunks 0-1 in batch 15.", "STRONG"),
    ("https://www.accountancysa.org.za/profile-mbeko-mbebe-delay-and-perseverance-an-inspiring-"
     "journey-to-casa/", "Professional Body",
     "Mbeko Mbebe became a chartered accountant with the February 2023 release of the December "
     "2022 APC results.", "STRONG"),
    ("https://www.accountancysa.org.za/profile-neil-morris-the-rise-of-esg-reporting/",
     "Professional Body",
     "Neil Morris — Global Head of Assurance and ESG Methodology at KPMG, CA(SA) Profiles "
     "series.", "STRONG"),
    ("https://www.accountancysa.org.za/profile-bhavna-gounder-juggling-a-thriving-career-and-"
     "motherhood/", "Professional Body",
     "Bhavna Gounder qualified as a CA(SA) in the mid-2000s; career started at Investec Bank.",
     "STRONG"),
]


def main():
    import json
    # assign company ids
    cid = db_lib.next_id(os.path.join(BASE, "companies.jsonl"), "cmp")
    existing = set()
    with open(os.path.join(BASE, "companies.jsonl"), encoding="utf-8") as f:
        for line in f:
            if line.strip():
                rec = json.loads(line)
                existing.add(rec["company_name"].lower())
                for a in rec.get("company_aliases") or []:
                    existing.add(a.lower())
    companies = []
    for c in COMPANIES:
        if c["company_name"].lower() in existing:
            print("  SKIP existing company:", c["company_name"])
            continue
        c["id"] = "cmp-%04d" % cid
        cid += 1
        companies.append(c)

    sid = db_lib.next_id(os.path.join(BASE, "sources.jsonl"), "src")
    sources = []
    for url, stype, summary, rel in SOURCES:
        sources.append({
            "id": "src-%04d" % sid, "url": url, "source_type": stype,
            "person_id": None, "company_id": None, "evidence_type": "GENERAL",
            "evidence_summary": summary, "qualification_supported": True,
            "skill_supported": None, "system_supported": None,
            "employment_supported": True, "accessed_date": TODAY,
            "reliability": rel, "status": "USED",
        })
        sid += 1

    db_lib.append_batch(PEOPLE, companies, sources,
                        label="Batch 15 (Accountancy SA CA(SA) Profiles index)")


if __name__ == "__main__":
    main()
