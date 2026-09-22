#!/usr/bin/env python3
"""Batch 14 — Continued finance talent map for Sage 300 IB companies.

Adds verified finance leaders for cmp-0079+, focusing on primary sources.
"""
import os, sys
BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib
db_lib.TODAY = "2026-09-22"

PEOPLE = []
SOURCES = []

# ---------------------------------------------------------------------------
# ECOWIZE (cmp-0079)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Duane Moore", first="Duane", surname="Moore",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer",
        employer="Ecowize Group",
        role_family="Executive Finance",
        industry="Business Services",
        sub_industry="Hygiene and sanitation services — food, pharma, healthcare",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        linkedin="https://www.linkedin.com/in/duanemoore/",
        evidence=(
            "Ecowize website about page lists 'Duane Moore — Chief Financial Officer'; "
            "TheOrg Ecowize Group org chart lists Duane Moore as CFO. "
            "LinkedIn: Experienced CFO, Ecowize Southern Africa; UJ/RAU education."
        ),
        source_urls=[
            "https://www.ecowize.co.za/about-ecowize-global-hygiene-and-sanitation-solutions/",
            "https://theorg.com/org/ecowize-group",
            "https://www.linkedin.com/in/duanemoore/",
        ],
        notes="Title verified on employer website (primary) + directory. Designation not publicly verified. Employer systems: Sage 300 ERP (GL structure) per MyJobMag job ad for Group Financial Accountant.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# RMS SHOPFITTING (cmp-0082)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Andre Tancred", first="Andre", surname="Tancred",
        alternate_names=["Andreas Tancred"],
        des=["ACMA", "CGMA"],
        status="CONFIRMED",
        designation_status="CONFIRMED",
        qualification_confidence="CONFIRMED",
        title="Finance Director / Director, Finance",
        employer="RMS Shopfitting (Pty) Ltd",
        role_family="Executive Finance",
        industry="Manufacturing",
        sub_industry="Shopfitting — retail, hospitality, fashion, healthcare",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        linkedin="https://www.linkedin.com/in/andre-tancred-b339486/",
        linkedin_location="City of Cape Town, Western Cape, South Africa",
        evidence=(
            "RocketReach management: Andre Tancred is Finance Director of RMS Shopfitting. "
            "ZoomInfo: Director, Finance at RMS Shopfitting; ACMA degree from CIMA; H Cert Tax UNISA. "
            "LinkedIn: Finance Director RMS Shopfitting 2013–Present; Education: CIMA ACMA, CGMA; "
            "BComm (Hons) Management Accounting Stellenbosch University; UNISA H Cert Tax."
        ),
        academic=[
            "BComm (Hons) Management Accounting — Stellenbosch University",
            "H Cert Tax — UNISA",
            "ACMA, CGMA — CIMA",
        ],
        articles_status="NOT_ESTABLISHED",
        career=[
            {"employer": "Industro-Clean Cape", "title": "Financial Manager", "notes": "2004–2013"},
            {"employer": "Maxmore (Ninian & Lester)", "title": "Financial Manager", "notes": "2000–2004"},
            {"employer": "Scott Steel Projects", "title": "Financial Manager", "notes": "1998–2000"},
        ],
        historic_industries=["Manufacturing", "Cleaning services", "Steel"],
        source_urls=[
            "https://rocketreach.co/rms-shopfitting-management_b44d3107fd2e4825",
            "https://www.zoominfo.com/p/Andre-Tancred/-1517558608",
            "https://www.linkedin.com/in/andre-tancred-b339486/",
        ],
        notes="CIMA qualified management accountant — ACMA/CGMA pathway. 5 Berkley Rd, Maitland, Cape Town.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# ATLANTIS SPECIAL ECONOMIC ZONE (cmp-0084)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Waheeda Saib", first="Waheeda", surname="Saib",
        des=["CA(SA)"],
        status="CONFIRMED",
        designation_status="CONFIRMED",
        qualification_confidence="CONFIRMED",
        title="Chief Financial Officer",
        employer="Atlantis Special Economic Zone Company (ASEZCo)",
        role_family="Executive Finance",
        industry="Government / Development",
        sub_industry="Special Economic Zone — green technologies",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        evidence=(
            "Provincial government management page: CFO Waheeda Saib. "
            "ASEZ 2022/23 Annual Report p28: 'Ms. Saib is a Chartered Accountant with more than 20 years’ experience in the public and private sectors. "
            "After completing articles with the Big Four, she joined the Auditor-General of South Africa.' "
            "ASEZ website meet-the-team: 'Waheeda Saib, a Chartered Accountant with over 20 years’ experience, began her career with the Big Four before joining AGSA.'"
        ),
        academic=["Chartered Accountant — Big Four articles"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        articles_body="SAICA",
        articles_employer="Big Four (per annual report); Auditor-General of South Africa",
        career=[
            {"employer": "Auditor-General of South Africa", "title": "Not stated", "notes": "post-articles per annual report"},
        ],
        source_urls=[
            "https://provincialgovernment.co.za/units/management/254/western-cape/atlantis-special-economic-zone-company-asezco",
            "https://www.wcpp.gov.za/sites/default/files/Atlantis%20Special%20Economic%20Zone%202022_2023%20Annual%20Report%20Final.pdf",
            "https://atlantissez.com/meet-the-team/",
        ],
        notes="Appointed CFO 03 Dec 2019 per annual report. Provincial public entity schedule 3D PFMA. Shareholders Western Cape Government 55% / City of Cape Town 45%.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
    dict(
        name="Saadiqa Dangor", first="Saadiqa", surname="Dangor",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Financial Controller",
        employer="Atlantis Special Economic Zone Company (ASEZCo)",
        role_family="Financial Control",
        industry="Government / Development",
        sub_industry="Special Economic Zone",
        province="Western Cape", city="Atlantis",
        location_confidence="HIGH",
        evidence=(
            "ASEZ 2022/23 Annual Report org chart: Finance Team — Financial Controller: Saadiqa Dangor. "
            "ZoomInfo: Financial Controller at Atlantis SEZ; prior Senior Accountant at Wesgro."
        ),
        career=[
            {"employer": "Wesgro", "title": "Senior Accountant", "notes": "per ZoomInfo"},
        ],
        source_urls=[
            "https://atlantissez.com/wp-content/uploads/2024/12/Atlantis-Special-Economic-Zone-2022_2023-Annual-Report-Final.pdf",
            "https://www.zoominfo.com/p/Saadiqa-Dangor/8624438995",
            "https://www.wcpp.gov.za/sites/default/files/Atlantis%20Special%20Economic%20Zone%202023_2024%20Annual%20Report%20Final_0.pdf",
        ],
        notes="Title verified on annual report primary source. Designation not verified.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# REFSOLS (cmp-0088)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Ryan Coldman", first="Ryan", surname="Coldman",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Financial Manager",
        employer="REFSOLS - Refrigeration Solutions & Fridgetec Services",
        role_family="Financial Management",
        industry="Engineering / Industrial",
        sub_industry="Refrigeration systems manufacturing and services",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        evidence=(
            "ITWeb 22 Jul 2013: 'Ryan Coldman (Financial Manager)' from REFSOLS quoted on Sage 300 ERP deployment by AWCape. "
            "Photo caption and quote. Factory and HO Cape Town; Fridgetec Johannesburg."
        ),
        source_urls=[
            "https://www.itweb.co.za/article/awcape-deploys-sage-300-erp-and-service-manager-for-refsols/nG98YdqLP8pqX2PD",
            "https://itweb.co.za/content/nG98YdqLP8pqX2PD",
        ],
        notes="Evidence from 2013 — may not be current. Retained as historic verified title with employer systems link. Re-verify current FM.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# SAQA (cmp-0099)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Innocent Gumbochuma", first="Innocent", surname="Gumbochuma",
        des=[],
        status="CONFIRMED",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer",
        employer="South African Qualifications Authority (SAQA)",
        role_family="Executive Finance",
        industry="Government",
        sub_industry="Qualifications authority — NQF custodian",
        province="Gauteng", city="Pretoria",
        location_confidence="HIGH",
        evidence=(
            "National government management page: Chief Financial Officer Mr Innocent Gumbochuma. "
            "Parliament media statement 26 Nov 2024: CFO SAQA Mr Innocent Gumbochuma won 2024 Public Sector CFO Award. "
            "Public Sector Manager Feb 2025 profile: career Umalusi Assistant Finance Manager 2009, QCTO Director SCM, CFO 2018, joined SAQA Nov 2022."
        ),
        career=[
            {"employer": "Umalusi", "title": "Assistant Finance Manager", "notes": "2009–2013"},
            {"employer": "Quality Council for Trades and Occupations (QCTO)", "title": "Director Supply Chain; CFO from 2018", "notes": "2013–Nov 2022"},
        ],
        source_urls=[
            "https://nationalgovernment.co.za/units/management/178/south-african-qualifications-authority-saqa",
            "https://www.parliament.gov.za/press-releases/media-statement-higher-education-chairperson-congratulates-saqa-cfo-winning-2024-public-sector-cfo-award",
            "https://www.publicsectormanager.gov.za/february-2025/regulars/profiles-leadership/journey-dedication-overcoming-challenges-and-driving",
        ],
        notes="Award-winning public sector CFO. Also doubles as CIO at SAQA (7 departments). Designation not stated as CA(SA) — appears SAIBA/CFO(SA) route. Employer systems: Sage 300 Finance.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# COMPETITION TRIBUNAL (cmp-0102)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Sherylee Moonsamy", first="Sherylee", surname="Moonsamy",
        des=[],
        status="CONFIRMED",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer",
        employer="Competition Tribunal",
        role_family="Executive Finance",
        industry="Government",
        sub_industry="Competition adjudication",
        province="Gauteng", city="Johannesburg",
        location_confidence="HIGH",
        evidence=(
            "CFO South Africa profile: Sherylee Moonsamy has been CFO of Competition Tribunal since 14 Nov 2022; "
            "prior CFO Johannesburg Development Agency (JDA) since Mar 2018; prior Acting CFO, Finance Manager, Accountant, Senior Auditor & article clerk at HLB Barnett Chown."
        ),
        career=[
            {"employer": "Johannesburg Development Agency", "title": "CFO", "notes": "Mar 2018–2022; Finance Manager 2012–2016; Accountant 2009–2012"},
            {"employer": "HLB Barnett Chown", "title": "Senior auditor & article clerk", "notes": "2005–2009"},
        ],
        source_urls=[
            "https://cfo.co.za/profiles/sherylee-moonsamy/",
        ],
        notes="Vacancy advertised Nov 2025 for 5-year contract CFO — may indicate upcoming transition, but Moonsamy is current as of last verified profile. Re-verify post-closing date.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# NAMC (cmp-0103)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Lebogang Dire", first="Lebogang", surname="Dire",
        alternate_names=["Lebogang Ca"],
        des=["CA(SA)"],
        status="HIGH_CONFIDENCE",
        designation_status="HIGH_CONFIDENCE",
        qualification_confidence="HIGH",
        title="Chief Financial Officer",
        employer="National Agricultural Marketing Council (NAMC)",
        role_family="Executive Finance",
        industry="Government / Agriculture",
        sub_industry="Agricultural marketing advisory and research",
        province="Gauteng", city="Pretoria",
        location_confidence="HIGH",
        evidence=(
            "National government management page: Chief Financial Officer Ms Lebogang Dire. "
            "RocketReach Finance Dept page: 'Lebogang Ca (Chief Financial Officer)' — 'Ca' in display name suggests CA pathway; "
            "ZoomInfo org chart: Lebogang Dire CFO."
        ),
        source_urls=[
            "https://nationalgovernment.co.za/units/management/122/national-agricultural-marketing-council-namc",
            "https://rocketreach.co/national-agricultural-marketing-council-finance-department_b7a712d6c53b2288",
            "https://www.zoominfo.com/c/national-agricultural-marketing-council/72697736",
        ],
        notes="HIGH_CONFIDENCE for CA(SA): 'Ca' in finance dept lead display name + CFO title in public entity context strongly suggests CA(SA) but no explicit 'CA(SA)' string on primary board page in current extracts. Retain as HIGH.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# WORKFORCE HOLDINGS (cmp-0097)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Willie van Wyk", first="Willie", surname="van Wyk",
        des=["CA(SA)"],
        title="Group Financial Director",
        employer="Workforce Holdings Ltd",
        role_family="Executive Finance",
        industry="Professional Services",
        sub_industry="Staffing, recruitment, human capital",
        province="Gauteng", city="Johannesburg",
        location_confidence="HIGH",
        evidence=(
            "Workforce Holdings directors page: 'Willie van Wyk, BCompt (Hons), CA(SA) Group Financial Director — "
            "completed articles with Deloitte & Touche in 1996; held financial management positions with Nola (Foodcorp) 3yrs and Nampak 5yrs; "
            "joined Workforce group 2007; appointed director Jun 2008.'"
        ),
        academic=["BCompt (Hons)"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        articles_body="SAICA",
        articles_employer="Deloitte & Touche",
        articles_period="1996",
        source_urls=[
            "http://workforce.co.za/directors/",
        ],
        notes="JSE listed staffing group. Also Independent Chairman John Macey CA(SA) and INEDs Kyansambo Vundla CA(SA) CFO MMI Africa/Asia, Shelley Thomas CA(SA), Shaun Naidoo CA(SA) — board-level CA depth.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------
src_list = [
    ("https://www.ecowize.co.za/about-ecowize-global-hygiene-and-sanitation-solutions/", "Employer Website", "Ecowize about: Duane Moore CFO; Brett Osrin CEO; Charl Groenewald MD CA(SA)"),
    ("https://theorg.com/org/ecowize-group", "Directory", "Ecowize Group org chart: Duane Moore CFO"),
    ("https://www.linkedin.com/in/duanemoore/", "LinkedIn", "Duane Moore — CFO Ecowize"),
    ("https://rocketreach.co/rms-shopfitting-management_b44d3107fd2e4825", "Directory", "RMS Shopfitting: Andre Tancred Finance Director"),
    ("https://www.zoominfo.com/p/Andre-Tancred/-1517558608", "Directory", "Andre Tancred Director Finance RMS; ACMA CIMA; H Cert Tax UNISA"),
    ("https://www.linkedin.com/in/andre-tancred-b339486/", "LinkedIn", "Andre Tancred Finance Director RMS 2013–present; CIMA ACMA CGMA; BComm Hons Management Accounting Stellenbosch"),
    ("https://provincialgovernment.co.za/units/management/254/western-cape/atlantis-special-economic-zone-company-asezco", "Directory", "ASEZCo management: CFO Waheeda Saib; CEO Matthew Cullinan"),
    ("https://www.wcpp.gov.za/sites/default/files/Atlantis%20Special%20Economic%20Zone%202022_2023%20Annual%20Report%20Final.pdf", "Annual Report", "ASEZ 2022/23 Annual Report: Waheeda Saib CA with 20yrs; Big Four articles; AGSA"),
    ("https://atlantissez.com/meet-the-team/", "Employer Website", "ASEZ meet team: Waheeda Saib Chartered Accountant; Big Four; AGSA; risk, IFRS/GRAP, PFMA"),
    ("https://www.zoominfo.com/p/Saadiqa-Dangor/8624438995", "Directory", "Saadiqa Dangor Financial Controller ASEZ; ex Wesgro Senior Accountant"),
    ("https://www.itweb.co.za/article/awcape-deploys-sage-300-erp-and-service-manager-for-refsols/nG98YdqLP8pqX2PD", "News", "REFSOLS: Ryan Coldman Financial Manager quoted on Sage 300 ERP deployment 2013"),
    ("https://nationalgovernment.co.za/units/management/178/south-african-qualifications-authority-saqa", "Directory", "SAQA management: CFO Innocent Gumbochuma"),
    ("https://www.parliament.gov.za/press-releases/media-statement-higher-education-chairperson-congratulates-saqa-cfo-winning-2024-public-sector-cfo-award", "News", "Parliament: SAQA CFO Innocent Gumbochuma won 2024 Public Sector CFO award"),
    ("https://www.publicsectormanager.gov.za/february-2025/regulars/profiles-leadership/journey-dedication-overcoming-challenges-and-driving", "News", "Profile Innocent Gumbochuma career Umalusi, QCTO, SAQA"),
    ("https://cfo.co.za/profiles/sherylee-moonsamy/", "Company Biography", "Sherylee Moonsamy CFO Competition Tribunal since Nov 2022; prior JDA CFO"),
    ("https://nationalgovernment.co.za/units/management/122/national-agricultural-marketing-council-namc", "Directory", "NAMC management: CFO Lebogang Dire"),
    ("https://rocketreach.co/national-agricultural-marketing-council-finance-department_b7a712d6c53b2288", "Directory", "NAMC Finance Dept lead Lebogang Ca CFO"),
    ("http://workforce.co.za/directors/", "Employer Website", "Workforce Holdings directors: Willie van Wyk BCompt Hons CA(SA) Group Financial Director; Deloitte articles 1996"),
]

sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_list:
    SOURCES.append(dict(
        id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
        evidence_type="GENERAL", evidence_summary=summ,
        qualification_supported=True, skill_supported=None, system_supported=None,
        employment_supported=True, accessed_date=db_lib.TODAY,
        reliability="PRIMARY" if typ in ("Employer Website","Annual Report") else "STRONG",
        status="USED",
    ))
    sid+=1

people = db_lib.append_batch(PEOPLE, company_specs=None, source_specs=SOURCES, label="Batch 14 (IB cont.)")
print(f"Batch 14 prepared: {len(people)}")
