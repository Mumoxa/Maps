#!/usr/bin/env python3
"""Batch 7 — Western Cape/retail CFOs with explicit CA(SA) evidence:
Ralph Buddle (TFG), Owen van Tonder & Zaid Manjra (Woolworths); TFG board CAs(SA);
Edburg Strauss (netCFO, Gauteng). Uses db_lib.append_batch."""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

PEOPLE = []
COMPANIES = []
SOURCES = []

TFG_URL = "https://tfglimited.co.za/our-brands/"
MANJRA_URL = "https://www.businessday.co.za/bd/companies/retail-and-consumer/2023-11-21-woolworths-names-zaid-manjra-as-cfo/"
VANTONDER_URL = "https://www.linkedin.com/in/owen-van-tonder-ca-sa-a8482131/"

PEOPLE += [
    # ---- TFG Limited (Cape Town/Parow) ----
    dict(name="Ralph Buddle", first="Ralph", surname="Buddle", des=["CA(SA)"],
         title="Executive Director | Chief Financial Officer", employer="TFG Limited (The Foschini Group)",
         role_family="Executive Finance", industry="Retail", sub_industry="Clothing/footwear/omnichannel retail",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         evidence='TFG Limited board profile: "Executive Director | Chief Financial Officer — CA (SA). Ralph joined the Group in September 2023, and was appointed CFO effective 1 April 2024. Previously interim CFO of Oceana Group and director of strategy & business development at Woolworths Holdings."',
         academic=[], source_urls=[TFG_URL],
         route="CA(SA); joined TFG Sep 2023, CFO from Apr 2024",
         career=[{"employer": "Woolworths Holdings Limited", "title": "Director of Strategy & Business Development", "years": "—"},
                 {"employer": "Oceana Group Limited", "title": "Interim CFO", "years": "—"},
                 {"employer": "TFG Limited", "title": "Executive Director & CFO", "years": "CFO from Apr 2024"}],
         notes="TFG CFO; member of Risk and Finance Committees."),
    dict(name="Graham Davin", first="Graham", surname="Davin", des=["CA(SA)"],
         title="Lead Independent Director", employer="TFG Limited (The Foschini Group)",
         role_family="Other", function="Board / governance", industry="Retail", sub_industry="Clothing/footwear/omnichannel retail",
         province=None, city=None, location_confidence="UNCONFIRMED",
         evidence='TFG Limited board profile: "Graham Davin (70) — Lead Independent Director — BCom, BAcc, CA (SA), MBA ... qualified with Arthur Andersen in Johannesburg and joined Investec Bank after an MBA at UCT."',
         academic=["BCom", "BAcc", "MBA (UCT)"], source_urls=[TFG_URL],
         route="CA(SA) — articled/trained at Arthur Andersen (Johannesburg)",
         articles_status="CONFIRMED_EXPLICIT", articles_body="SAICA", articles_employer="Arthur Andersen",
         articles_period="pre-1990s", articles_location="Johannesburg",
         notes="Career banker; Deputy Chair of United Trust Bank (UK). Residence not disclosed — location left UNCONFIRMED (TFG HQ is Cape Town)."),
    dict(name="Jan Potgieter", first="Jan", surname="Potgieter", des=["CA(SA)"], status="HIGH_CONFIDENCE",
         designation_status="HIGH_CONFIDENCE", qualification_confidence="HIGH",
         title="Non-executive Director", employer="TFG Limited (The Foschini Group)",
         role_family="Other", function="Board / governance", industry="Retail", sub_industry="Clothing/footwear/omnichannel retail",
         province=None, city=None, location_confidence="UNCONFIRMED",
         evidence='TFG Limited board profile: "Jan Potgieter (57) — ... is a chartered accountant and has extensive senior-level experience in manufacturing, retail and supply chain, most recently CEO of Italtile and formerly CEO of Massdiscounters."',
         academic=[], source_urls=[TFG_URL],
         notes='Source states "chartered accountant" (designation letters "CA(SA)" not literally quoted) — HIGH_CONFIDENCE. Ex-CEO Italtile; former SABMiller senior financial roles.'),
    # ---- Woolworths ----
    dict(name="Owen van Tonder", first="Owen", surname="van Tonder", des=["CA(SA)"],
         title="Chief Financial Officer — Fashion, Beauty and Home", employer="Woolworths Holdings Ltd",
         role_family="Executive Finance", industry="Retail", sub_industry="Premium food & apparel retail",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn: "Owen van Tonder CA(SA)" at Woolworths; "I have been a CFO in the Woolworths group for over eight years"; theorg.com: "Owen van Tonder CA(SA) is the Chief Financial Officer for Fashion, Beauty and Home at Woolworths since September 2015."',
         academic=["Babson Executive Education (Boston)"],
         linkedin=VANTONDER_URL, source_urls=[VANTONDER_URL, "https://theorg.com/org/woolworths/org-chart/owen-van-tonder-ca"],
         career=[{"employer": "Woolworths", "title": "Head of Finance — Africa; Planning & Performance Analyst (Supply Chain/Global Sourcing); Franchise Billing Manager", "years": "—"},
                 {"employer": "Woolworths", "title": "CFO Fashion, Beauty and Home", "years": "Sep 2015 – present"}],
         yoe="18+", yoe_basis="LinkedIn headline: eighteen years, one company.",
         notes="18+ years at Woolworths; CFO of Fashion, Beauty & Home since Sep 2015."),
    dict(name="Zaid Manjra", first="Zaid", surname="Manjra", des=["CA(SA)"],
         title="Group Chief Financial Officer / Finance Director", employer="Woolworths Holdings Ltd",
         role_family="Executive Finance", industry="Retail", sub_industry="Premium food & apparel retail",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         evidence='BusinessDay (21 Nov 2023): Woolworths appointed CFO "Zaid Manjra ... a chartered accountant with more than 30 years working experience"; cfo.co.za: "Zaid is a qualified CA(SA) with more than 30 years of post-qualification experience, 15 of which he has spent with Woolworths."',
         academic=[], source_urls=[MANJRA_URL, "https://cfo.co.za/articles/fd-zaid-manjra-proud-to-be-part-of-woolworths-new-leadership-team/"],
         route="CA(SA)",
         career=[{"employer": "Woolworths Holdings Ltd", "title": "Senior finance leadership roles (15 years)", "years": "c.2008–present"},
                 {"employer": "Woolworths Holdings Ltd", "title": "Group CFO / Finance Director", "years": "1 Dec 2023 – present"}],
         yoe="30+", yoe_basis="30+ years post-qualification per cfo.co.za/BusinessDay.",
         notes="Interim FD from July 2023; permanent CFO from 1 Dec 2023; member of Woolworths treasury, risk/IT committees."),
    # ---- Gauteng (national scope) ----
    dict(name="Edburg Strauss", first="Edburg", surname="Strauss", des=["CA(SA)"],
         title="Managing Director", employer="netCFO",
         role_family="Executive Finance", industry="Accounting / Audit", sub_industry="Outsourced / virtual CFO services",
         province="Gauteng", city="Pretoria", location_confidence="HIGH",
         linkedin_location="Pretoria, Gauteng, South Africa",
         evidence='LinkedIn: "Edburg Strauss CA(SA)" — Managing Director, netCFO; University of Pretoria; JTC Chartered Accountants (Faerie Glen, Pretoria).',
         academic=["University of Pretoria"],
         linkedin="https://www.linkedin.com/in/edburg-strauss/",
         source_urls=["https://www.linkedin.com/in/edburg-strauss/"],
         employer_systems=["Xero (netCFO platform)"],
         career=[{"employer": "JTC Chartered Accountants", "title": "Chartered accountant", "years": "2020"},
                 {"employer": "netCFO", "title": "Managing Director", "years": "Sep 2023 – present"}],
         notes="netCFO uses Xero for client accounting (employer-level system observation); CA(SA) registration completion announced on LinkedIn."),
]

COMPANIES += [
    dict(id="cmp-0063", company_name="TFG Limited", company_aliases=["The Foschini Group", "TFG"],
         website="https://tfglimited.co.za/", industry="Retail", sub_industry="Clothing, footwear, homeware & omnichannel retail (40 brands)",
         south_africa_locations=["Cape Town (Parow)"],
         source_urls=[TFG_URL], date_verified=db_lib.TODAY),
    dict(id="cmp-0064", company_name="Woolworths Holdings Ltd", company_aliases=["Woolworths", "WHL"],
         website="https://www.woolworthsholdings.co.za/", industry="Retail", sub_industry="Premium food & apparel retail",
         south_africa_locations=["Cape Town"],
         source_urls=[VANTONDER_URL, MANJRA_URL], date_verified=db_lib.TODAY),
    dict(id="cmp-0065", company_name="netCFO", company_aliases=[],
         website=None, industry="Accounting / Audit", sub_industry="Outsourced accounting / virtual CFO (Xero)",
         south_africa_locations=["Pretoria"],
         source_urls=["https://www.linkedin.com/in/edburg-strauss/"], date_verified=db_lib.TODAY),
]

src_urls = [
    (TFG_URL, "Employer Website", "TFG board profiles: Ralph Buddle (Exec Director/CFO, CA(SA)); Graham Davin (BCom BAcc CA(SA) MBA — Arthur Andersen JHB); Jan Potgieter (chartered accountant)."),
    (VANTONDER_URL, "LinkedIn", "Owen van Tonder CA(SA) — CFO Fashion, Beauty & Home, Woolworths."),
    (MANJRA_URL, "News", "Zaid Manjra chartered accountant — Woolworths CFO (BusinessDay, 21 Nov 2023)."),
    ("https://cfo.co.za/articles/fd-zaid-manjra-proud-to-be-part-of-woolworths-new-leadership-team/", "News", "Zaid Manjra a qualified CA(SA), 30+ years, Woolworths FD (cfo.co.za)."),
    ("https://www.linkedin.com/in/edburg-strauss/", "LinkedIn", "Edburg Strauss CA(SA) — MD netCFO, Pretoria; University of Pretoria."),
]
sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_urls:
    SOURCES.append(dict(id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
                        evidence_type="GENERAL", evidence_summary=summ,
                        qualification_supported=True, skill_supported=None, system_supported=None,
                        employment_supported=True, accessed_date=db_lib.TODAY,
                        reliability="STRONG", status="USED"))
    sid += 1

people = db_lib.append_batch(PEOPLE, company_specs=COMPANIES, source_specs=SOURCES, label="Batch 7 (retail CFOs)")
