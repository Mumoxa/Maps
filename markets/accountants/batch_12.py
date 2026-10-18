#!/usr/bin/env python3
"""Batch 12 — Western Cape CIMA (ACMA/CGMA) + multi-designation holders:
Valentine Dzvova (CA(SA), ACMA, CGMA), Mieke Hoffman (ACMA, CGMA), Dylin Kuni (ACMA, CGMA).
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
    dict(name="Valentine Dzvova", first="Valentine", surname="Dzvova", des=["CA(SA)", "ACMA", "CGMA"],
         title="Group Financial Manager / business leader", employer="AYO Technology Solutions Limited",
         role_family="Executive Finance", industry="Technology", sub_industry="ICT investment group",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn name "Valentine Dzvova → CA(SA),CIA, ACMA, CGMA, Cert.Dir®": "inspirational business leader with over a decade of high-impact experience"; AYO Technology Solutions; University of Cape Town.',
         academic=["University of Cape Town"],
         linkedin="https://za.linkedin.com/in/valentine-dzvova",
         source_urls=["https://za.linkedin.com/in/valentine-dzvova"],
         route="CA(SA) + ACMA/CGMA (multi-designation); also CIA",
         notes="Also holds CIA and Cert.Dir®. AYO Technology Solutions (Cape Town)."),
    dict(name="Mieke Hoffman", first="Mieke", surname="Hoffman", des=["ACMA", "CGMA"],
         title="Finance role (The Fieldbar Co.)", employer="The Fieldbar Co.",
         role_family="Financial Control", industry="Manufacturing", sub_industry="Consumer goods",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="Cape Town, Western Cape, South Africa",
         evidence='LinkedIn name "Mieke Hoffman ACMA, CGMA" — The Fieldbar Co.; Stellenbosch University.',
         academic=["Stellenbosch University"],
         linkedin="https://za.linkedin.com/in/mieke-hoffman",
         source_urls=["https://za.linkedin.com/in/mieke-hoffman"],
         route="CIMA → ACMA/CGMA"),
    dict(name="Dylin Kuni", first="Dylin", surname="Kuni", des=["ACMA", "CGMA"],
         title="Chartered Management Accountant / Project Manager", employer="M+C Saatchi Group",
         role_family="Other", function="Management accounting / project management", industry="Professional Services", sub_industry="Marketing services",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn: "I am a Chartered Management Accountant and Project Manager"; "becoming an Associate Chartered Management Accountant (ACMA, CGMA) through CIMA"; M+C Saatchi Group.',
         academic=["ACMA — Chartered Management Accountant (CIMA)"],
         linkedin="https://www.linkedin.com/in/dylinkuni/",
         source_urls=["https://www.linkedin.com/in/dylinkuni/"],
         route="CIMA → ACMA, CGMA",
         notes="ACMA, CGMA through CIMA."),
]

COMPANIES += [
    dict(id="cmp-0075", company_name="AYO Technology Solutions Limited", company_aliases=["AYO"],
         website="https://www.ayotechgroup.com/", industry="Technology", sub_industry="ICT investment group",
         south_africa_locations=["Cape Town"],
         source_urls=["https://za.linkedin.com/in/valentine-dzvova"], date_verified=db_lib.TODAY),
    dict(id="cmp-0076", company_name="The Fieldbar Co.", company_aliases=[],
         website="https://www.fieldbar.co.za/", industry="Manufacturing", sub_industry="Consumer goods",
         south_africa_locations=["Cape Town"],
         source_urls=["https://za.linkedin.com/in/mieke-hoffman"], date_verified=db_lib.TODAY),
    dict(id="cmp-0077", company_name="M+C Saatchi Group", company_aliases=["M&C Saatchi"],
         website=None, industry="Professional Services", sub_industry="Marketing services",
         south_africa_locations=["Cape Town"],
         source_urls=["https://www.linkedin.com/in/dylinkuni/"], date_verified=db_lib.TODAY),
]

src_urls = [
    ("https://za.linkedin.com/in/valentine-dzvova", "LinkedIn", "Valentine Dzvova CA(SA), CIA, ACMA, CGMA, Cert.Dir® — AYO Technology Solutions, Cape Town."),
    ("https://za.linkedin.com/in/mieke-hoffman", "LinkedIn", "Mieke Hoffman ACMA, CGMA — The Fieldbar Co., Cape Town."),
    ("https://www.linkedin.com/in/dylinkuni/", "LinkedIn", "Dylin Kuni ACMA, CGMA — M+C Saatchi Group; Associate CIMA."),
]
sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_urls:
    SOURCES.append(dict(id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
                        evidence_type="GENERAL", evidence_summary=summ,
                        qualification_supported=True, skill_supported=None, system_supported=None,
                        employment_supported=True, accessed_date=db_lib.TODAY,
                        reliability="STRONG", status="USED"))
    sid += 1

people = db_lib.append_batch(PEOPLE, company_specs=COMPANIES, source_specs=SOURCES, label="Batch 12 (WC CIMA)")
