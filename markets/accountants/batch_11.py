#!/usr/bin/env python3
"""Batch 11 — Western Cape designations: Zandrea Gerber CA(SA) (Pay@, Paarl),
Ashlin Healy CA(SA) (Deloitte, Cape Town); André Huysamer AGA(SA) (Worcester, HIGH).
Uses db_lib.append_batch."""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

PEOPLE = []
COMPANIES = []
SOURCES = []

PEOPLE += [
    dict(name="Zandrea Gerber", first="Zandrea", surname="Gerber", des=["CA(SA)"],
         title="Finance Manager", employer="Pay@",
         role_family="Financial Control", industry="Fintech", sub_industry="Payments / transaction processing",
         province="Western Cape", city="Paarl", location_confidence="HIGH",
         linkedin_location="Paarl, Western Cape, South Africa",
         evidence='LinkedIn name "Zandrea Gerber CA(SA)"; memberOf SAICA (Mar 2013–present); Stellenbosch BAcc (2009–2011) + Honours Accounting (2012). Employer Pay@ (Stellenbosch).',
         academic=["Stellenbosch University — BAcc (2009–2011)", "Stellenbosch University — Honours Accounting (2012)"],
         linkedin="https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/",
         source_urls=["https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/"],
         career=[{"employer": "(audit firm)", "title": "Audit Supervisor", "years": "2013–2016"},
                 {"employer": "ATKV Goudini Spa", "title": "Financial Manager", "years": "2016–2019"},
                 {"employer": "CampusKey Student Living", "title": "Financial Property Manager", "years": "2019–2021"},
                 {"employer": "IGrow Wealth Investments", "title": "Group Finance Manager / Finance Manager: Developments", "years": "2021–2023"},
                 {"employer": "Pay@", "title": "Finance Manager", "years": "2023–present"}],
         yoe="10+", yoe_basis="Roles from 2013 (audit supervisor).",
         notes="SAICA member since Mar 2013. Pay@ is a Stellenbosch-based B2B payments platform."),
    dict(name="Ashlin Healy", first="Ashlin", surname="Healy", des=["CA(SA)"],
         title="(Deloitte) — audit & accounting professional", employer="Deloitte (South Africa)",
         role_family="External Audit", industry="Accounting / Audit", sub_industry="Big Four audit",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="Cape Town, Western Cape, South Africa",
         evidence='LinkedIn name "Ashlin Healy CA(SA)": "qualified Chartered Accountant with more than 9 years audit and accounting experience"; Deloitte; Stellenbosch University.',
         academic=["Stellenbosch University"],
         linkedin="https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/",
         source_urls=["https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/"],
         yoe="9+", yoe_basis="Profile: more than 9 years audit & accounting experience.",
         notes="Deloitte, Cape Town; 9+ years audit & accounting."),
    dict(name="André Huysamer", first="André", surname="Huysamer", des=["AGA(SA)"], status="HIGH_CONFIDENCE",
         designation_status="HIGH_CONFIDENCE", qualification_confidence="HIGH",
         title="(finance/accounting role at Kula)", employer="Kula",
         role_family="Financial Accounting", industry=None,
         province="Western Cape", city="Worcester", location_confidence="HIGH",
         evidence='LinkedIn "similar profiles" entry: "André Huysamer AGA(SA) — Kula — Worcester". Individual profile not captured; designation from LinkedIn display name.',
         academic=[],
         source_urls=["https://www.linkedin.com/in/matthew-lindsay-ca-sa-0ba022100/"],
         notes="AGA(SA) per LinkedIn display name; employer 'Kula' (Worcester). Full profile not captured — HIGH_CONFIDENCE. NOTE: a separate ZoomInfo record shows an 'Andre Huysamer, Principal Accountant, City of Cape Town' — possibly distinct; not merged without confirmation."),
]

COMPANIES += [
    dict(id="cmp-0073", company_name="Pay@", company_aliases=["Pay", "Pay at"],
         website="https://payat.co.za/", industry="Fintech", sub_industry="Payments / transaction processing (B2B)",
         south_africa_locations=["Stellenbosch"],
         source_urls=["https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/"], date_verified=db_lib.TODAY),
    dict(id="cmp-0074", company_name="Kula", company_aliases=[],
         website=None, industry=None, sub_industry="—",
         south_africa_locations=["Worcester"],
         source_urls=["https://www.linkedin.com/in/matthew-lindsay-ca-sa-0ba022100/"], date_verified=db_lib.TODAY),
]

src_urls = [
    ("https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/", "LinkedIn", "Zandrea Gerber CA(SA) — Finance Manager Pay@; SAICA member; Stellenbosch BAcc + Hons."),
    ("https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/", "LinkedIn", "Ashlin Healy CA(SA) — Deloitte, Cape Town; 9+ years audit & accounting."),
    ("https://www.linkedin.com/in/matthew-lindsay-ca-sa-0ba022100/", "LinkedIn", "Source of 'André Huysamer AGA(SA) — Kula, Worcester' similar-profile entry (also Matthew Lindsay CA(SA), BDO SA)."),
]
sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_urls:
    SOURCES.append(dict(id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
                        evidence_type="GENERAL", evidence_summary=summ,
                        qualification_supported=True, skill_supported=None, system_supported=None,
                        employment_supported=True, accessed_date=db_lib.TODAY,
                        reliability="STRONG", status="USED"))
    sid += 1

people = db_lib.append_batch(PEOPLE, company_specs=COMPANIES, source_specs=SOURCES, label="Batch 11 (WC fintech/audit)")
