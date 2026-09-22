#!/usr/bin/env python3
"""Batch 18 — Board-level CA(SA) expansion for IB: Novus Holdings Pitsi Mnisi + additional."""
import os, sys
BASE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,BASE)
import db_lib
db_lib.TODAY="2026-09-22"

PEOPLE=[]
SOURCES=[]

PEOPLE+=[
    dict(
        name="Pitsi Mnisi", first="Pitsi", surname="Mnisi",
        alternate_names=["Pitsi J. Mnisi","Ms Pitsi Mnisi"],
        des=["CA(SA)"],
        status="CONFIRMED",
        designation_status="CONFIRMED",
        qualification_confidence="CONFIRMED",
        qualified="true",
        title="Independent Non-Executive Director & Member of Audit and Risk Committee",
        employer="Novus Holdings Ltd",
        role_family="Executive Finance",
        industry="Manufacturing",
        sub_industry="Commercial printing, labels, flexible packaging, tissue — board / audit committee",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        linkedin=None,
        evidence=(
            "Novus Holdings board page: Pitsi Mnisi CA(SA) appointed to Board in 2025, holds BCom and BCom Honours Accounting University of Natal, BCom Honours Taxation UCT, MBA Heriot-Watt, advanced certificate Emerging Markets Fordham USA. "
            "Novus AFS 2025: Audit and Risk Committee composition — Ms P Mnisi appointed 01 April 2025. "
            "MarketScreener: Ms Pitsi J. Mnisi Independent Non-Executive Director Novus Holdings Ltd (2025-03-31), also Nampak, Super Group, African Rainbow Minerals; previously Finance Manager De Beers Consolidated Mines. "
            "InsidEntity: Qualification BCom, BCom (Hons) Acc, BCom (Hons) Tax, CA(SA), MBA; Board Member Novus Holdings 31/03/2025; Audit Member."
        ),
        academic=[
            "BCom — University of Natal",
            "BCom Honours Accounting — University of Natal",
            "BCom Honours Taxation — University of Cape Town",
            "MBA — Heriot-Watt University",
            "Advanced certificate Emerging Markets and Country-Risk Analysis — Fordham University USA",
            "CA(SA) — SAICA",
        ],
        career=[
            {"employer":"De Beers Consolidated Mines (Pty) Ltd","title":"Finance Manager","notes":"former per MarketScreener"},
            {"employer":"Lynshpin Cedar","title":"Managing Director / Founder","notes":"wholly black owned consulting and corporate finance advisory"},
            {"employer":"Mcorp Investments Pty Ltd","title":"Founder / Director","notes":"investment holding"},
            {"employer":"African Rainbow Minerals Ltd","title":"Independent Non-Executive Director","notes":"Board 2020-09-29, Audit Member"},
            {"employer":"Super Group Ltd","title":"Independent Non-Executive Director","notes":"Board 2020-09-30, Audit/Risk/Nominations/Social & Ethics"},
            {"employer":"Nampak Ltd","title":"Independent Non-Executive Director","notes":"Board 2023-09-30, Audit/Risk"},
        ],
        historic_industries=["Mining","Investments","Transportation","Manufacturing","Construction","Professional Services"],
        source_urls=[
            "https://novus.holdings/about/board-members/",
            "https://novus.holdings/wp-content/uploads/2025/06/IAR25-Annual-Financial-Statements-v_Final.pdf",
            "https://www.marketscreener.com/insider/PITSI-MNISI-A236N6/",
            "https://www.insidentity.com/director/pitsi-mnisi/",
        ],
        notes="Board-level CA(SA) for Novus Holdings Ltd cmp-0077 — expands IB title family coverage to Audit Committee / INED finance. Appointed 31 Mar 2025 / 01 Apr 2025. Also relevant to Nampak, Super Group, ARM boards.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

src_list=[
    ("https://novus.holdings/about/board-members/","Employer Website","Novus board: Pitsi Mnisi CA(SA) BCom Hons Acc, BCom Hons Tax, MBA, appointed 2025"),
    ("https://novus.holdings/wp-content/uploads/2025/06/IAR25-Annual-Financial-Statements-v_Final.pdf","Annual Report","Novus AFS 2025: Audit and Risk Committee Ms P Mnisi appointed 01 April 2025"),
    ("https://www.marketscreener.com/insider/PITSI-MNISI-A236N6/","Directory","Pitsi Mnisi INED Novus 2025-03-31, also Nampak, Super Group, ARM; ex Finance Manager De Beers"),
    ("https://www.insidentity.com/director/pitsi-mnisi/","Directory","Pitsi Mnisi qualification BCom, BCom Hons Acc, BCom Hons Tax, CA(SA), MBA; Board Novus 31/03/2025"),
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

people=db_lib.append_batch(PEOPLE, company_specs=None, source_specs=SOURCES, label="Batch 18 (Pitsi Mnisi Novus INED)")
print(f"Batch 18 prepared: {len(people)}")
