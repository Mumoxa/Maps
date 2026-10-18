#!/usr/bin/env python3
"""Batch 8 — Western Cape practitioners verified on own firm/brand pages:
Kobus Boshoff (Boshoff Knoetze), Emma Pardoe (CA(SA) & RA), Johan Coetzee (Callidus),
Willem Theron (PSG Konsult chairman, CA(SA)). Uses db_lib.append_batch."""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

PEOPLE = []
COMPANIES = []
SOURCES = []

PEOPLE += [
    dict(name="Kobus Boshoff", first="Kobus", surname="Boshoff", des=["CA(SA)"],
         title="Managing Director (founder)", employer="Boshoff Knoetze Chartered Accountants",
         role_family="Executive Finance", industry="Accounting / Audit", sub_industry="Chartered accountants (family firm)",
         province="Western Cape", city="Somerset West", linkedin_location="City of Cape Town, Western Cape, South Africa",
         location_confidence="HIGH",
         evidence='LinkedIn licence: "Chartered Accountant (SA) SAICA CA(SA) Issued Jun 1982"; Stellenbosch University & UNISA; firm site: founded Kobus Boshoff and Associates (Mossel Bay) 1985.',
         academic=["Stellenbosch University", "University of South Africa (UNISA)"],
         linkedin="https://www.linkedin.com/in/kobus-boshoff-0a510888/",
         source_urls=["https://www.linkedin.com/in/kobus-boshoff-0a510888/", "https://www.kbgen.co.za/about-accounting"],
         route="CA(SA) issued Jun 1982",
         career=[{"employer": "Intercontinental Breweries (Johannesburg)", "title": "Group accountant", "years": "—"},
                 {"employer": "Trust Bank", "title": "Management information division (Head Office)", "years": "—"},
                 {"employer": "Searles Industrials Ltd", "title": "Group accountant", "years": "—"},
                 {"employer": "Great Brak Sawmills / Outiniqua Creosote Poles / Southern Volkswagen", "title": "Managing director", "years": "—"},
                 {"employer": "Kobus Boshoff and Associates (Mossel Bay)", "title": "Founder (accounting & auditing firm)", "years": "1985–2000"},
                 {"employer": "Boshoff Knoetze (Somerset West)", "title": "Managing Director", "years": "2017–present"}],
         yoe="35+", yoe_basis="CA(SA) issued Jun 1982; firm founded 1985.",
         notes="Founded Kobus Boshoff and Associates (Mossel Bay) 1985; sold share of Boshoff Visser Inc; founded Boshoff Knoetze 2017 with his children."),
    dict(name="Emma Pardoe", first="Emma", surname="Pardoe", des=["CA(SA)"],
         title="Chartered Accountant & Registered Auditor (principal)", employer="Emma Pardoe Chartered Accountants (SA)",
         role_family="External Audit", industry="Accounting / Audit", sub_industry="Chartered accountants & registered auditors",
         province="Western Cape", city="Somerset West", location_confidence="HIGH",
         evidence='Firm page: "Emma Pardoe Chartered Accountant (SA) & Registered Auditor is a well established accounting, auditin[g]..." — 5 Fagan Street, Somerset West.',
         academic=[],
         linkedin="https://www.linkedin.com/in/emmapardoe/",
         source_urls=["https://www.facebook.com/EmmaPardoeCA/", "https://brabys.com/south-africa/somerset-west/verified-business/emma-pardoe-chartered-accountants-sa/connect"],
         notes="Registered Auditor (RA) + CA(SA); firm established 2000. Principal/namesake."),
    dict(name="Johan Coetzee", first="Johan", surname="Coetzee", des=["CA(SA)"], status="HIGH_CONFIDENCE",
         designation_status="HIGH_CONFIDENCE", qualification_confidence="HIGH",
         title="Principal", employer="Callidus Accountants",
         role_family="External Audit", industry="Accounting / Audit", sub_industry="Accounting firm",
         province="Western Cape", city="Somerset West", location_confidence="HIGH",
         evidence='Somerset West business directory: "Johan Coetzee the Principal graduated in 1988 at RAU and is a registered Chartered Accountant. He is also a registered auditor with the IRBA and registered as a tax practitioner with SARS."',
         academic=["Rand Afrikaans University (RAU), 1988"],
         source_urls=["https://shopbiz.co.za/western-cape/somerset-west/accountants/"],
         notes="IRBA Registered Auditor (RA) status implies CA(SA); source is a third-party directory, so designation held at HIGH_CONFIDENCE."),
    dict(name="Willem Theron", first="Willem", surname="Theron", des=["CA(SA)"],
         title="Non-executive Chairman", employer="PSG Konsult Ltd (PSG Financial Services)",
         role_family="Other", function="Board / governance", industry="Financial Services", sub_industry="Wealth, asset management & insurance",
         province=None, city=None, location_confidence="UNCONFIRMED",
         evidence='PSG Konsult integrated report (FY2015) board profile: "Willem Theron (62) — Non-executive director and chairman — BCompt (Hons), CA(SA). Willem founded the chartered accountancy firm [Theron du Plessis]..."',
         academic=["BCompt (Hons)"],
         source_urls=["http://download.psg.co.za/files/investor-relations/financial-information/PSG-Konsult-Ltd-Integrated-Report-FY-2015.pdf"],
         route="BCompt (Hons), CA(SA); founded Theron du Plessis (Middelburg, 1976); co-founded PSG 1998",
         career=[{"employer": "Theron du Plessis", "title": "Founder (chartered accountancy firm)", "years": "1976–"},
                 {"employer": "PSG Financial Services / PSG Konsult Ltd", "title": "CEO (1998–2013) → Non-executive Chairman", "years": "1998–present"}],
         notes="Founder of PSG Financial Services and Theron du Plessis; personal location not stated (PSG group HQ Stellenbosch) — province left unconfirmed."),
]

COMPANIES += [
    dict(id="cmp-0066", company_name="Boshoff Knoetze Chartered Accountants", company_aliases=["Boshoff Knoetze"],
         website="https://boshoffknoetze.co.za/", industry="Accounting / Audit", sub_industry="Chartered accountants (family firm)",
         south_africa_locations=["Somerset West (Helderberg)"],
         source_urls=["https://www.linkedin.com/in/kobus-boshoff-0a510888/"], date_verified=db_lib.TODAY),
    dict(id="cmp-0067", company_name="Emma Pardoe Chartered Accountants (SA)", company_aliases=["Emma Pardoe"],
         website="https://emmapardoe.co.za/", industry="Accounting / Audit", sub_industry="Chartered accountants & registered auditors",
         south_africa_locations=["Somerset West"],
         source_urls=["https://www.facebook.com/EmmaPardoeCA/"], date_verified=db_lib.TODAY),
    dict(id="cmp-0068", company_name="Callidus Accountants", company_aliases=[],
         website=None, industry="Accounting / Audit", sub_industry="Accounting firm",
         south_africa_locations=["Somerset West"],
         source_urls=["https://shopbiz.co.za/western-cape/somerset-west/accountants/"], date_verified=db_lib.TODAY),
    dict(id="cmp-0069", company_name="PSG Konsult Ltd", company_aliases=["PSG Konsult", "PSG Financial Services", "PSG"],
         website="https://www.psg.co.za/", industry="Financial Services", sub_industry="Wealth, asset management & insurance",
         south_africa_locations=["Stellenbosch (group HQ)"],
         source_urls=["http://download.psg.co.za/files/investor-relations/financial-information/PSG-Konsult-Ltd-Integrated-Report-FY-2015.pdf"], date_verified=db_lib.TODAY),
]

src_urls = [
    ("https://www.linkedin.com/in/kobus-boshoff-0a510888/", "LinkedIn", "Kobus Boshoff CA(SA) (SAICA, issued Jun 1982) — MD Boshoff Knoetze, Somerset West."),
    ("https://www.kbgen.co.za/about-accounting", "Employer Website", "Boshoff Knoetze: family of chartered accountants; Kobus Boshoff founding history."),
    ("https://www.facebook.com/EmmaPardoeCA/", "Employer Website", "Emma Pardoe Chartered Accountant (SA) & Registered Auditor, Somerset West."),
    ("https://shopbiz.co.za/western-cape/somerset-west/accountants/", "Directory", "Johan Coetzee (Callidus) — registered Chartered Accountant, IRBA RA, tax practitioner."),
    ("http://download.psg.co.za/files/investor-relations/financial-information/PSG-Konsult-Ltd-Integrated-Report-FY-2015.pdf", "Annual Report", "Willem Theron BCompt (Hons), CA(SA) — PSG Konsult chairman; founder of Theron du Plessis and PSG."),
]
sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_urls:
    SOURCES.append(dict(id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
                        evidence_type="GENERAL", evidence_summary=summ,
                        qualification_supported=True, skill_supported=None, system_supported=None,
                        employment_supported=True, accessed_date=db_lib.TODAY,
                        reliability="STRONG", status="USED"))
    sid += 1

people = db_lib.append_batch(PEOPLE, company_specs=COMPANIES, source_specs=SOURCES, label="Batch 8 (WC practitioners)")
