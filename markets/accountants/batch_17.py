#!/usr/bin/env python3
"""Batch 17 — Final IB gap-fill: BCMDA, DALRRD/NDA, SAHRC, M-KOPA."""
import os, sys
BASE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,BASE)
import db_lib
db_lib.TODAY="2026-09-22"

PEOPLE=[]
SOURCES=[]

PEOPLE+=[
    dict(
        name="Sabelo Mavundla", first="Sabelo", surname="Mavundla",
        des=[],
        status="CONFIRMED",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer",
        employer="Buffalo City Metropolitan Development Agency (BCMDA)",
        role_family="Executive Finance",
        industry="Government / Development",
        sub_industry="Municipal development agency — Buffalo City Metro",
        province="Eastern Cape", city="East London",
        location_confidence="HIGH",
        linkedin="https://www.linkedin.com/in/sabelo-mavundla-369a01105/",
        evidence=(
            "LinkedIn: Chief Financial Officer @ Buffalo City Metropolitan Development Agency Aug 2025–Present, East London; "
            "KPMG articles 2010–2013, Auditor-General, University of KwaZulu-Natal. "
            "ZoomInfo org chart: CFO Vicky Ntsodo (prior), also Busisiwe Lubelwana CFO (resigned Nov 2024 per News24 to preserve mental health). "
            "BCMDA address 12 Esplanade St, East London."
        ),
        career=[
            {"employer":"KPMG","title":"Articles","notes":"2010–2013 East London"},
            {"employer":"Auditor-General of South Africa","title":"Not stated","notes":"prior"},
        ],
        source_urls=[
            "https://www.linkedin.com/in/sabelo-mavundla-369a01105/",
            "https://www.zoominfo.com/c/buffalo-city-metropolitan-development-agency/482691773",
            "https://www.news24.com/southafrica/news/buffalo-city-metros-agency-cfo-resigns-to-preserve-mental-health-reputation-20241104",
        ],
        notes="Covers cmp-0108 BCMDA (Excluded for Sage ERP but still finance talent). Previous CFOs: Busisiwe Lubelwana resigned 2024, Vicky Ntsodo listed on ZoomInfo.",
        employer_systems=[],
    ),
    dict(
        name="Vicky Ntsodo", first="Vicky", surname="Ntsodo",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer (prior)",
        employer="Buffalo City Metropolitan Development Agency (BCMDA)",
        role_family="Executive Finance",
        industry="Government / Development",
        sub_industry="Municipal development agency",
        province="Eastern Cape", city="East London",
        location_confidence="HIGH",
        evidence=(
            "ZoomInfo BCMDA org chart: CFO is Vicky Ntsodo; CEO Ayanda Gqoboka. "
            "Alternative spelling/alternate CFO Busisiwe Lubelwana also listed."
        ),
        source_urls=[
            "https://www.zoominfo.com/c/buffalo-city-metropolitan-development-agency/482691773",
        ],
        notes="Prior CFO listing; current appears Sabelo Mavundla from Aug 2025. Retained as HIGH for historic coverage.",
    ),
    dict(
        name="Busisiwe Lubelwana", first="Busisiwe", surname="Lubelwana",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer (former, resigned Nov 2024)",
        employer="Buffalo City Metropolitan Development Agency (BCMDA)",
        role_family="Executive Finance",
        industry="Government / Development",
        sub_industry="Municipal development agency",
        province="Eastern Cape", city="East London",
        location_confidence="HIGH",
        evidence=(
            "News24 04 Nov 2024: 'chief financial officer of the embattled Buffalo City Metropolitan Development Agency has resigned after a mere year in the post' — Busisiwe Lubelwana resigned. "
            "ZoomInfo also lists Busisiwe Lubelwana as CFO."
        ),
        source_urls=[
            "https://www.news24.com/southafrica/news/buffalo-city-metros-agency-cfo-resigns-to-preserve-mental-health-reputation-20241104",
            "https://www.zoominfo.com/c/buffalo-city-metropolitan-development-agency/482691773",
        ],
        notes="Resigned 2024, noted for completeness of BCMDA finance leadership timeline.",
    ),
    dict(
        name="Mokete Mokono", first="Mokete", surname="Mokono",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer (Acting)",
        employer="Department of Agriculture, Land Reform and Rural Development (DALRRD)",
        role_family="Executive Finance",
        industry="Government",
        sub_industry="Agriculture, land reform and rural development",
        province="Gauteng", city="Pretoria",
        location_confidence="HIGH",
        evidence=(
            "National government DALRRD management: Chief Financial Officer Ms Mokete Mokono (Acting). "
            "PMG committee meetings 26 Nov 2024 and 19 Mar 2025: Ms Mokete Mokono CFO DALRRD led briefing on Q2 performance, underspend 17%, ALHA under DLRRD after split."
        ),
        source_urls=[
            "https://nationalgovernment.co.za/units/management/427/department-of-agriculture-land-reform-and-rural-development-dalrrd",
            "https://pmg.org.za/committee-meeting/39961/",
            "https://pmg.org.za/committee-meeting/40430/",
        ],
        notes="Covers cmp-0109 NDA (Excluded for Sage ERP but still finance talent). Acting CFO.",
    ),
    dict(
        name="Talifhani Khubana", first="Talifhani", surname="Khubana",
        alternate_names=["Dr Talifhani Khubana"],
        des=[],
        status="CONFIRMED",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer",
        employer="South African Human Rights Commission (SAHRC)",
        role_family="Executive Finance",
        industry="Government",
        sub_industry="Constitutional body — human rights",
        province="Gauteng", city="Johannesburg",
        location_confidence="HIGH",
        evidence=(
            "National government SAHRC management: Chief Financial Officer Dr Talifhani Khubana. "
            "PMG 16 Oct 2024: Dr Talifhani Khubana CFO SAHRC presented annual performance and financial report 2023/24. "
            "SAHRC APP 2024/25 lists Dr Talifhani Khubana CFO, Mr Vusumuzi Mkhize CEO."
        ),
        source_urls=[
            "https://nationalgovernment.co.za/units/management/61/south-african-human-rights-commission-sahrc",
            "https://pmg.org.za/committee-meeting/39653/",
            "https://www.sahrc.org.za/home/21/files/SAHRC_APP%202024_v13_100424.pdf",
        ],
        notes="Covers cmp-0110 SAHRC (Excluded for Sage ERP). Also Acting CFO Lutendo Siphugu listed in AFS 2023 per nationalgovernment entity annual.",
    ),
    dict(
        name="Faraimose Kutadzaushe", first="Faraimose", surname="Kutadzaushe",
        alternate_names=["Faraimose Kutadzaushe CFA"],
        des=["CA(SA)", "CA(Zimbabwe)", "CFA"],
        status="CONFIRMED",
        designation_status="CONFIRMED",
        qualification_confidence="CONFIRMED",
        title="Chief Financial Officer & Executive Director",
        employer="M-KOPA",
        role_family="Executive Finance",
        industry="Energy / Fintech",
        sub_industry="Solar home systems, smartphone financing — pay-as-you-go asset financing",
        province="Outside South Africa (Kenya; Sage Africa & Middle East channel)", city="Nairobi",
        location_confidence="HIGH",
        linkedin="https://www.linkedin.com/in/faraimose-kutadzaushe-cfa-40a628a",
        evidence=(
            "M-KOPA about page leadership: Faraimose Kutadzaushe Chief Financial Officer, also board CFO Executive Director. "
            "TheOrg: CFO at M-KOPA; education: Chartered Accountant (South Africa) SAICA 2008; Chartered Accountant (Zimbabwe) ICAZ 2006-2007; "
            "Bachelor of Accounting (Honours) UNISA 2003-2005; MBA Stanford 2011-2013; CFA Charterholder CFA Institute 2009-2011; "
            "prior Co-Founder & Director Supreme Brands Zimbabwe, Investment Specialist Investec Asset Management Africa private equity, "
            "Investment Banking Associate Goldman Sachs, Manager Deloitte Consulting."
        ),
        academic=[
            "Bachelor of Accounting (Honours) — University of South Africa (2003–2005)",
            "MBA — Stanford Graduate School of Business (2011–2013)",
            "Chartered Accountant (South Africa) — SAICA (2008)",
            "Chartered Accountant (Zimbabwe) — ICAZ (2006–2007)",
            "CFA Charterholder — CFA Institute (2009–2011)",
        ],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer":"Supreme Brands Zimbabwe","title":"Co-Founder & Director","notes":"led formation and growth"},
            {"employer":"Investec Asset Management","title":"Investment Specialist","notes":"Africa private equity funds"},
            {"employer":"Goldman Sachs","title":"Investment Banking Associate","notes":"healthcare and consumer retail"},
            {"employer":"Deloitte Consulting","title":"Manager","notes":"prior"},
        ],
        historic_industries=["Professional Services","Investment Banking","Private Equity","Consumer goods"],
        source_urls=[
            "https://www.m-kopa.com/about",
            "https://theorg.com/org/m-kopa/org-chart/faraimose-kutadzaushe",
            "https://theorg.com/org/m-kopa?person=faraimose-kutadzaushe",
        ],
        notes="Covers cmp-0113 M-KOPA Solar (Outside South Africa, Kenya) — Level 2 note only out of geographic scope per IB register, but verified CFO with SA CA(SA). Also co-founder Chad Larson was early CFO per historic management sample.",
        employer_systems=[],
    ),
]

src_list=[
    ("https://www.linkedin.com/in/sabelo-mavundla-369a01105/","LinkedIn","Sabelo Mavundla CFO BCMDA Aug 2025–present, KPMG articles 2010-2013"),
    ("https://www.zoominfo.com/c/buffalo-city-metropolitan-development-agency/482691773","Directory","BCMDA org: CFO Vicky Ntsodo, CEO Ayanda Gqoboka, also Busisiwe Lubelwana CFO"),
    ("https://www.news24.com/southafrica/news/buffalo-city-metros-agency-cfo-resigns-to-preserve-mental-health-reputation-20241104","News","BCMDA CFO Busisiwe Lubelwana resigned Nov 2024"),
    ("https://nationalgovernment.co.za/units/management/427/department-of-agriculture-land-reform-and-rural-development-dalrrd","Directory","DALRRD management: Acting CFO Ms Mokete Mokono"),
    ("https://pmg.org.za/committee-meeting/39961/","News","PMG DALRRD Q2 2024/25: Mokete Mokono CFO"),
    ("https://nationalgovernment.co.za/units/management/61/south-african-human-rights-commission-sahrc","Directory","SAHRC management: CFO Dr Talifhani Khubana"),
    ("https://pmg.org.za/committee-meeting/39653/","News","PMG SAHRC 2023/24: Talifhani Khubana CFO presented"),
    ("https://www.sahrc.org.za/home/21/files/SAHRC_APP%202024_v13_100424.pdf","Annual Report","SAHRC APP 2024/25: Dr Talifhani Khubana CFO"),
    ("https://www.m-kopa.com/about","Employer Website","M-KOPA leadership: Faraimose Kutadzaushe CFO, CEO Jesse Moore"),
    ("https://theorg.com/org/m-kopa/org-chart/faraimose-kutadzaushe","Company Biography","Faraimose Kutadzaushe CFO M-KOPA: CA(SA) 2008, CA(Zimbabwe), BAcc Hons UNISA, MBA Stanford, CFA"),
]

sid=db_lib.next_id(db_lib.SOURCES_PATH,"src")
for url,typ,summ in src_list:
    SOURCES.append(dict(
        id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
        evidence_type="GENERAL", evidence_summary=summ,
        qualification_supported=True, skill_supported=None, system_supported=None,
        employment_supported=True, accessed_date=db_lib.TODAY,
        reliability="PRIMARY" if typ in ("Employer Website","Annual Report") else "STRONG",
        status="USED",
    ))
    sid+=1

people=db_lib.append_batch(PEOPLE, company_specs=None, source_specs=SOURCES, label="Batch 17 (BCMDA/DALRRD/SAHRC/M-KOPA)")
print(f"Batch 17 prepared: {len(people)}")
