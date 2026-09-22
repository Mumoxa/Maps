#!/usr/bin/env python3
"""Batch 16 — Gap-fill for remaining IB companies: Radisson, Fidelity ADT (ADT SA), Retail Capital treasury, Freshstop FC context."""
import os, sys
BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib
db_lib.TODAY = "2026-09-22"

PEOPLE = []
SOURCES = []

PEOPLE += [
    dict(
        name="Anene Engelbrecht", first="Anene", surname="Engelbrecht",
        des=[],
        status="CONFIRMED",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Financial Controller",
        employer="Radisson Blu Hotel Waterfront, Cape Town (Radisson Hotel Group)",
        role_family="Financial Control",
        industry="Hospitality",
        sub_industry="Hotel — flagship property Middle East & Africa",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        evidence=(
            "eTurboNews 15 Aug 2018: 'Anene Engelbrecht has been appointed Financial Controller at the iconic Radisson Blu Hotel Waterfront'. "
            "MyPressportal same date: appointment announcement; background Bay Hotel 2002, Westin, Mount Nelson, BON Hotels, Radisson Blu Le Vendome, Park Inn Newlands prior to Waterfront FC. "
            "CFO South Africa 16 May 2021: 'first deaf financial controller in the global Radisson Hotel Group and the only deaf financial controller in South Africa’s hospitality sector'; "
            "Cluster Financial Controller for Radisson (two hotels), joined Radisson May 2016 at Le Vendome."
        ),
        career=[
            {"employer": "Radisson Blu Le Vendome", "title": "Cluster Financial Controller", "notes": "May 2016– prior to Waterfront; managed two hotels"},
            {"employer": "BON Hotels", "title": "Group Financial Manager", "notes": "prior"},
            {"employer": "The Westin", "title": "Hotel Accountant", "notes": "prior"},
            {"employer": "Bay Hotel", "title": "Office Admin", "notes": "2002 start"},
        ],
        source_urls=[
            "https://eturbonews.com/radisson-blu-hotel-waterfront-capetown-two-new-appointments/",
            "https://pressportal.co.za/leisure-and-entertainment/story/two-senior-appointments-at-the-radisson-blu-hotel-waterfront.html",
            "https://cfo.co.za/articles/anene-engelbrecht-redefining-transformation/",
        ],
        notes="Relevant to cmp-0089 Radisson Hotel Group Africa managed portfolio — SA property-level financial controller verified. Regional Area Director Finance Middle East Africa & SEAP is Neil Reddington (Dubai-based, not SA).",
        employer_systems=[],
    ),
    dict(
        name="Carel Smit", first="Carel", surname="Smit",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="General Manager Finance",
        employer="Fidelity ADT (Pty) Ltd / ADT Security Services (Pty) Ltd",
        role_family="Financial Management",
        industry="Security Services",
        sub_industry="Electronic security, armed response, monitoring",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        linkedin="https://www.linkedin.com/in/carel-smit-1b278820b/",
        evidence=(
            "RocketReach Fidelity ADT Management: Carel Smit General Manager Finance at Fidelity ADT, Cape Town. "
            "LinkedIn: Experienced Senior Finance Manager, Fidelity ADT, Cape Town; UNISA education; "
            "ZoomInfo: General Manager Finance at Fidelity ADT, previously Senior Manager Finance Coastal Fidelity Services Group, Empact Group Regional GM, Alexforbes multiple finance roles from Accounting Trainee at Pyper Turner."
        ),
        career=[
            {"employer": "Fidelity Services Group", "title": "Senior Manager, Finance Coastal", "notes": "prior"},
            {"employer": "Empact Group", "title": "Regional General Manager / Regional Manager Financial", "notes": "prior"},
            {"employer": "Alexforbes", "title": "Project Accountant → Group Manager Financial → Financial Executive", "notes": "early career"},
        ],
        source_urls=[
            "https://rocketreach.co/fidelity-adt-management_b4473681faecf2e4",
            "https://www.linkedin.com/in/carel-smit-1b278820b/",
            "https://www.zoominfo.com/p/Carel-Smit/2324534466",
        ],
        notes="Covers cmp-0090 ADT South Africa (now Fidelity ADT). Employer systems: Sage 300 per IB register. Location Cape Town per RocketReach, HQ Midrand.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
    dict(
        name="Alex Appleby", first="Alex", surname="Appleby",
        alternate_names=["Alex Ca"],
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Head of Treasury",
        employer="Retail Capital (Pty) Ltd",
        role_family="Treasury/Tax",
        industry="Financial Services",
        sub_industry="SME funding, merchant cash advance",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        evidence=(
            "RocketReach Retail Capital SA: Alex Ca Head of Treasury at Retail Capital SA, Cape Town; "
            "ZoomInfo: Alex Appleby Head of Treasury at Retail Capital, Cape Town, 2017–present; "
            "Address 155 Campground Rd, Cape Town."
        ),
        source_urls=[
            "https://rocketreach.co/retail-capital-sa-profile_b5e440dcf42e6530",
            "https://www.zoominfo.com/p/Alex-Appleby/-1182960593",
        ],
        notes="Covers cmp-0112 Retail Capital. Display name 'Alex Ca' may indicate CA pathway but insufficient for CA(SA) confirmation. Treasury function relevant to finance talent map.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# Also add context for Freshstop / Fruit & Veg City group finance structure (no named person yet, but role exists)
# We'll log title variant and unverified queue via research datasets later, not via people.jsonl

src_list = [
    ("https://eturbonews.com/radisson-blu-hotel-waterfront-capetown-two-new-appointments/", "News", "Anene Engelbrecht appointed Financial Controller Radisson Blu Hotel Waterfront"),
    ("https://pressportal.co.za/leisure-and-entertainment/story/two-senior-appointments-at-the-radisson-blu-hotel-waterfront.html", "News", "Same appointment; background Bay Hotel, Westin, Mount Nelson, BON, Le Vendome"),
    ("https://cfo.co.za/articles/anene-engelbrecht-redefining-transformation/", "News", "Anene Engelbrecht first deaf FC in global Radisson Hotel Group, only deaf FC in SA hospitality; Cluster FC"),
    ("https://rocketreach.co/fidelity-adt-management_b4473681faecf2e4", "Directory", "Fidelity ADT: Carel Smit General Manager Finance"),
    ("https://www.linkedin.com/in/carel-smit-1b278820b/", "LinkedIn", "Carel Smit Senior Finance Manager Fidelity ADT, Cape Town"),
    ("https://rocketreach.co/retail-capital-sa-profile_b5e440dcf42e6530", "Directory", "Retail Capital: Alex Ca Head of Treasury"),
    ("https://www.zoominfo.com/p/Alex-Appleby/-1182960593", "Directory", "Alex Appleby Head of Treasury Retail Capital 2017–present"),
]

sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_list:
    SOURCES.append(dict(
        id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
        evidence_type="GENERAL", evidence_summary=summ,
        qualification_supported=False, skill_supported=None, system_supported=None,
        employment_supported=True, accessed_date=db_lib.TODAY,
        reliability="STRONG",
        status="USED",
    ))
    sid+=1

people = db_lib.append_batch(PEOPLE, company_specs=None, source_specs=SOURCES, label="Batch 16 (gap-fill)")
print(f"Batch 16 prepared: {len(people)}")
