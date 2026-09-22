#!/usr/bin/env python3
"""Batch 15 — Additional verified finance talent for remaining IB companies."""
import os, sys
BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib
db_lib.TODAY = "2026-09-22"

PEOPLE = []
SOURCES = []

PEOPLE += [
    dict(
        name="Donovan Humphreys", first="Donovan", surname="Humphreys",
        des=["CA(SA)"],
        title="Finance Controller",
        employer="Samsonite Southern Africa",
        role_family="Financial Control",
        industry="Wholesale / Distribution",
        sub_industry="Luggage, bags, travel accessories",
        province="KwaZulu-Natal", city="Durban",
        location_confidence="HIGH",
        linkedin="https://za.linkedin.com/in/donovan-humphreys-a13b52a9/",
        linkedin_location="Durban, KwaZulu-Natal, South Africa",
        evidence=(
            "LinkedIn: Finance Controller at Samsonite Southern Africa Dec 2008–Present (16yrs); "
            "Education: SAICA CA(SA); Experienced Chartered Accountant, consumer goods industry; "
            "Location Durban."
        ),
        academic=["CA(SA) — SAICA"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "Samsonite Southern Africa", "title": "Finance Controller", "notes": "Dec 2008–present"},
        ],
        source_urls=[
            "https://za.linkedin.com/in/donovan-humphreys-a13b52a9/",
            "https://www.linkedin.com/in/donovan-humphreys-a13b52a9/",
        ],
        notes="Durban permanent SA office per installed-base register. Employer systems observed: Sage 300 (company-level).",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
    dict(
        name="Anneline Smit", first="Anneline", surname="Smit",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Financial Operations Manager / Financial Controller",
        employer="Inala Broadcast (Pty) Ltd",
        role_family="Financial Management",
        industry="Technology",
        sub_industry="Broadcast solutions integration",
        province="Gauteng", city="Midrand",
        location_confidence="HIGH",
        evidence=(
            "Inala Broadcast about-us page: 'Anneline Smit — Financial Operations Manager — anneline.smit@inalabroadcast.co.za'. "
            "ZoomInfo: Anneline Smit Financial Controller at Inala Technologies; Manager Finance 1996–2015; "
            "Manager Operations & Finance at Inala Broadcast 2017–."
        ),
        career=[
            {"employer": "Inala Technologies", "title": "Manager, Finance", "notes": "1996–2015"},
            {"employer": "Inala Broadcast", "title": "Manager, Operations & Finance", "notes": "2017–"},
        ],
        source_urls=[
            "https://www.inalabroadcast.co.za/about-us/",
            "https://www.zoominfo.com/p/Anneline-Smit/8160779285",
            "https://www.zoominfo.com/pic/inala-technologies-ltd/345791011",
        ],
        notes="Employer migrated Sage 300 → Sage Intacct (2020, Lorge case study). Finance contact for BBBEE per site. Designation not verified.",
        employer_systems=["Sage 300 / ACCPAC", "Sage Intacct"],
    ),
    dict(
        name="Willie Robbertse", first="Willie", surname="Robbertse",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Financial and Logistics Manager / Manager, Financial & Logistics",
        employer="Geiger & Klotzbucher (Pty) Ltd",
        role_family="Financial Management",
        industry="Manufacturing",
        sub_industry="Packaging equipment and materials — food industry",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        linkedin="https://www.linkedin.com/in/willie-robbertse-34747a38",
        evidence=(
            "RocketReach management: Willie Robbertse Financial and Logistics Manager at Geiger & Klotzbucher (Pty) Ltd. "
            "ZoomInfo: Manager Financial & Logistics; prior Financial Controller Gilbarco AFS leading finance dept 11 staff; "
            "BCom Accounting North-West University Potchefstroom 1992–1995."
        ),
        academic=["BCom Accounting — NorthWest University Potchefstroom (1992–1995)"],
        career=[
            {"employer": "Gilbarco AFS", "title": "Financial Controller", "notes": "2014–2018; led finance dept"},
            {"employer": "Flemingo International", "title": "Assistant General Manager: Finance and Accounts", "notes": "2012–2014"},
        ],
        source_urls=[
            "https://rocketreach.co/geiger-klotzbucher-pty-ltd-management_b4447554fa932288",
            "https://www.zoominfo.com/p/Willie-Robbertse/1860730097",
            "https://rocketreach.co/willie-robbertse-email_44876486",
        ],
        notes="No CA(SA) confirmed; BCom Accounting. HQ 1 Venus Way, Ottery, Cape Town.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

src_list = [
    ("https://za.linkedin.com/in/donovan-humphreys-a13b52a9/", "LinkedIn", "Donovan Humphreys Finance Controller Samsonite Southern Africa; SAICA CA(SA); Durban; Dec 2008–present"),
    ("https://www.inalabroadcast.co.za/about-us/", "Employer Website", "Inala Broadcast about: Anneline Smit Financial Operations Manager"),
    ("https://www.zoominfo.com/p/Anneline-Smit/8160779285", "Directory", "Anneline Smit Financial Controller Inala Technologies; Manager Finance history"),
    ("https://rocketreach.co/geiger-klotzbucher-pty-ltd-management_b4447554fa932288", "Directory", "Geiger & Klotzbucher management: Willie Robbertse Financial and Logistics Manager"),
    ("https://www.zoominfo.com/p/Willie-Robbertse/1860730097", "Directory", "Willie Robbertse Manager Financial & Logistics; ex Gilbarco Financial Controller"),
]

sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_list:
    SOURCES.append(dict(
        id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
        evidence_type="GENERAL", evidence_summary=summ,
        qualification_supported=True, skill_supported=None, system_supported=None,
        employment_supported=True, accessed_date=db_lib.TODAY,
        reliability="PRIMARY" if typ in ("Employer Website",) else "STRONG",
        status="USED",
    ))
    sid+=1

people = db_lib.append_batch(PEOPLE, company_specs=None, source_specs=SOURCES, label="Batch 15 (remaining IB)")
print(f"Batch 15 prepared: {len(people)}")
