#!/usr/bin/env python3
"""Batch 13 — CA(SA) award-cohort expansion (public research only, 2026-10-14).

Scope agreed with the requester on 2026-10-14:
  * in-scope = SA resident OR working in SA (each basis recorded separately);
  * current finance roles only (bookkeeper-equivalent and above);
  * reporting / check date 2026-10-14;
  * NO authorised SAICA roster — lawful public-professional sources only.
    Nothing in this batch verifies current SAICA membership.

Sources are SAICA Top-35-Under-35 profiles (2023/2024 cohorts), CFO Awards
reporting, employer leadership/people pages and professional publications.
Roles stated only on a dated award profile are HIGH_CONFIDENCE, not CONFIRMED,
and are flagged in `notes` as at the award date until re-verified. No LinkedIn
URL is recorded unless an employer page itself links that person's profile
(Carel Snyman via Altron leadership page); all others are left blank on purpose.
Uses db_lib.append_batch (people/companies/sources + interim.csv regen).
Idempotent guard: a full_name already in people.jsonl is skipped, never duplicated.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

CHECK = "2026-10-14"
QUAL_NOT_EST = "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED"

SAICA24 = "https://www.saica.org.za/initiatives/awards-and-competitions/top-35-under-35-awards/2024-2/2024-top-35-under-35-finalists/"
TOP35 = "https://www.top35-under-35.saicaevents.co.za/wp/dt_team/"

# ---------------------------------------------------------------- people ---
# status CONFIRMED  = designation + finance role corroborated on a live
#                     employer page or a 2025/2026 source accessed on CHECK.
# status HIGH_CONFIDENCE = designation evidenced on the SAICA award profile;
#                     title/employer are as at that award date (see notes).
PEOPLE = [
    # ---- CONFIRMED (live / recent corroboration) ----
    dict(name="Sanele Nkosi", first="Sanele", surname="Nkosi", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Audit Partner", employer="BDO South Africa",
         role_family="External Audit", industry="Accounting / Audit",
         province="KwaZulu-Natal", city="Durban", location_confidence="CONFIRMED",
         evidence='BDO South Africa people page (accessed 2026-10-14): "Sanele Nkosi — Audit Partner", contact office "BDO Durban", Qualifications: "Chartered Accountant South Africa"; serves on SAICA APTEC in the Eastern Region as ABASA representative in KZN. SAICA 2024 Top-35 profile: "Sanele Nkosi CA(SA) ... Partner - BDO".',
         source_urls=["https://www.bdo.co.za/en-za/our-people/sanele-nkosi",
                      SAICA24 + "sanele-nkosi"],
         notes="Workplace location is the BDO Durban office named on his employer people page (person-specific office, not employer HQ inference). Current SAICA membership NOT verified (no authorised roster)."),
    dict(name="Sibabalwe Bebeza", first="Sibabalwe", surname="Bebeza", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Associate Director", employer="BDO South Africa",
         role_family="External Audit", industry="Accounting / Audit",
         province="Gauteng", city="Johannesburg", location_confidence="CONFIRMED",
         evidence='SAICA 2024 Top-35 profile: "Sibabalwe Bebeza CA(SA) is a Registered Auditor (RA) ... Associate Director - BDO". BDO people page lists her as Associate Director with contact office "BDO Johannesburg". "Eligible CGMA" on the SAICA profile is NOT a confirmed CGMA designation and is not recorded as one.',
         source_urls=[SAICA24 + "sibabalwe-bebeza",
                      "https://www.bdo.co.za/en-za/our-people/sibabalwe-bebeza"],
         notes="Workplace = BDO Johannesburg office on employer people page. CGMA eligibility explicitly not counted as a designation. Current SAICA membership NOT verified."),
    dict(name="Ellen Gower-Mzolo", first="Ellen", surname="Gower-Mzolo", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer and Executive Director", employer="The Fulcrum Group",
         role_family="Executive Finance", industry="Insurance",
         sub_industry="Short-term insurance premium collections and insurance premium finance",
         evidence='SAICA Top-35 (2023) profile: "Ellen Gower-Mzolo CA(SA) ... Chief Financial Officer and Executive Director at Fulcrum Group (Pty) Ltd ... an experienced CFO and a CA(SA)"; Fulcrum Collect/Premium Finance described as short-term insurance premium collections/financing businesses. Role still described as "Ellen Gower-Mzolo, CFO of Fulcrum" in a February 2026 COVER podcast listing (accessed 2026-10-14).',
         source_urls=[TOP35 + "ellen-gower-mzolo/",
                      "https://www.cover.co.za/market-place-companies/axa-group"],
         notes="No person-specific SA workplace/residence statement found in the sources used; location not evidenced (employer being South African is not treated as proof). Current SAICA membership NOT verified."),
    dict(name="Brecht Mohonathan", first="Brecht", surname="Mohonathan", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="Lions Cricket",
         role_family="Executive Finance", industry="Other",
         sub_industry="Sports administration (cricket union)",
         province="Gauteng", city="Johannesburg", location_confidence="HIGH",
         evidence='SAICA 2023 Top-35 finalist listing: "Brecht Mohonathan CA(SA) — Chief Financial Officer at Lions Cricket (Gauteng Cricket Board t/a Central Gauteng Lions)". Lions Cricket management-team page (employer, accessed 2026-10-14) still lists "Brecht Mohonathan – Chief Financial Officer".',
         source_urls=["https://www.top35-under-35.saicaevents.co.za/wp/2023-finalists/",
                      "https://lionscricket.co.za/management-team/"],
         notes="Location is employer-based (Lions Cricket / Wanderers, Johannesburg) — labelled HIGH, not personal residence evidence. Industry is the employer's sports-administration sector, not a personal specialism. Current SAICA membership NOT verified."),
    dict(name="Carel Snyman", first="Carel", surname="Snyman", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="Altron",
         role_family="Executive Finance", industry="Technology",
         academic=["BMil (Economics) — University of Stellenbosch",
                   "BCom (Accounting) — University of Cape Town",
                   "BCom (Accounting) Honours — University of KwaZulu-Natal"],
         linkedin="https://www.linkedin.com/in/carel-snyman-3573252/",
         evidence='Altron leadership page (employer, accessed 2026-10-14): "Carel Snyman ... Chief Financial Officer ... Carel is a qualified CA (SA) with over 20 years of financial experience", joined Altron Board June 2023; the same employer page itself hyperlinks his LinkedIn person profile. CFO Awards 2025: Carel Snyman, group CFO Altron — Strategy Execution / Finance Transformation awards.',
         source_urls=["https://www.altron.com/leadership",
                      "https://cfoawards.co.za/hall-of-fame/"],
         notes="LinkedIn URL is recorded only because the employer's own leadership page links that exact profile for this person; it was not constructed from his name. No person-specific SA workplace/residence statement on the sources used; location not evidenced. Current SAICA membership NOT verified."),
    dict(name="Mike Davis", first="Mike", surname="Davis", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="Nedbank Group",
         role_family="Executive Finance", industry="Banking",
         academic=["BCom (Hons)", "DipAcc", "AMP — INSEAD"],
         articles_status="TRAINING_CONTRACT_CONFIRMED", articles_body="SAICA",
         articles_employer="Deloitte",
         evidence='Nedbank Group leadership page (employer, accessed 2026-10-14): "Mike Davis, Chief Financial Officer, Appointed: October 2020, Qualifications: BCom (Hons), DipAcc, CA (SA), AMP (Insead) ... Before joining Nedbank ... Mike completed his articles at Deloitte". CFO Awards 2024: CFO of the Year, Nedbank Group.',
         source_urls=["https://group.nedbank.co.za/home/leadership/mike-davis.html",
                      "https://cfoawards.co.za/hall-of-fame/"],
         notes="Articles: employer page explicitly states completed articles at Deloitte (named training office); period not stated. \"Nationality: South African\" on that page is nationality, NOT residence/workplace evidence, so location is not evidenced here. Current SAICA membership NOT verified."),
    dict(name="Christiaan Barnard", first="Christiaan", surname="Barnard", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="Spear REIT Limited",
         role_family="Executive Finance", industry="Property",
         sub_industry="Real Estate (REIT)",
         academic=["B.Acc — Stellenbosch University"],
         province="Western Cape", city="Cape Town", location_confidence="CONFIRMED",
         articles_status="CONFIRMED_EXPLICIT", articles_body="SAICA",
         articles_employer="PKF Inc.",
         evidence='CFO South Africa profile: "Christiaan Barnard is a Chartered Accountant (SA) by qualification. He completed his articles at PKF Inc. ... appointed CFO of Spear REIT in August 2016". CFO South Africa article (1 June 2026): "Spear REIT CFO and 2025 Young CFO of the Year Christiaan Barnard ... lives in Cape Town\'s leafy northern suburbs – a fair commute from the bustling CBD" and works from the Spear office. Note: some CFO South Africa pages misspell the employer "Spier Reit"; the listed company is Spear REIT Limited.',
         source_urls=["https://cfo.co.za/profiles/christiaan-barnard/",
                      "https://cfo.co.za/articles/cfo-christiaan-barnard-knows-all-about-the-art-of-switching-off-at-the-top/"],
         notes="SA location evidence is personal: residence in Cape Town northern suburbs and commute to a CBD workplace (2026 article). Articles explicitly stated as completed at PKF Inc.; period from the profile work history. Current SAICA membership NOT verified."),
    dict(name="Andisa Zinja", first="Andisa", surname="Zinja", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="Trans-Caledon Tunnel Authority (TCTA)",
         role_family="Executive Finance", industry="Government",
         sub_industry="State-owned water infrastructure",
         academic=["BCom (Accounting) — Rhodes University",
                   "BCom (Accounting) Honours — University of KwaZulu-Natal",
                   "MPhil (Corporate Strategy) — GIBS Business School"],
         evidence='TCTA (employer) announcement, January 2026: "its Chief Financial Officer, Ms Andisa Zinja, CA (SA), MPhil (Strategy), has been named the 2025 Public Sector CFO of the Year ... Appointed CFO of TCTA in April 2025 ... Before joining TCTA, she was CFO at the Council for Medical Schemes from 2020". CFO South Africa profile confirms the same April 2025 TCTA appointment (the 2025 award itself was for her prior Council for Medical Schemes role).',
         source_urls=["https://www.tcta.co.za/wp-content/uploads/2026/01/TCTA-CFO-Wins-Award.pdf",
                      "https://cfo.co.za/profiles/andisa-zinja/"],
         notes="CONFLICT flagged and not resolved into a fact: sources differ on her PwC article-clerk location (CFO profile text says Papua New Guinea; TCTA announcement says Port Elizabeth), so no articles employer/location is asserted. No person-specific current SA workplace statement used; location not evidenced. Current SAICA membership NOT verified."),
    dict(name="Dineo Molefe", first="Dineo", surname="Molefe", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="MTN South Africa",
         role_family="Executive Finance", industry="Telecommunications",
         academic=["BCompt (Hons) / CTA — University of South Africa",
                   "MCom (International Accounting) — University of Johannesburg",
                   "Advanced Management Program — Wharton Business School"],
         evidence='CFO South Africa profile: "Dineo Molefe was appointed CFO of MTN SA in November 2020 ... Dineo is a qualified chartered accountant (SA)" with work history "2020–Present CFO, MTN SA". CFO Awards 2025 (CFO South Africa): Transformation & Empowerment Award — Dineo Molefe, CFO, MTN South Africa.',
         source_urls=["https://cfo.co.za/profiles/dineo-molefe/",
                      "https://cfoawards.co.za/hall-of-fame/"],
         notes="Being raised in Soweto (biographical articles) is origin, not current residence/workplace evidence, and is not used as location. Current SAICA membership NOT verified."),
    dict(name="Sandiso Gcwabe", first="Sandiso", surname="Gcwabe", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="Wesgro",
         role_family="Executive Finance", industry="Government",
         sub_industry="Tourism, trade and investment promotion (Western Cape public agency)",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         evidence='Accounting Standards Board staff page (accessed 2026-10-14): "Sandiso Gcwabe is a Chartered Accountant [CA(SA)] and is currently the Chief Financial Officer at Wesgro" (appointed ASB board member February 2024). Speaker biography: "Sandiso Gcwabe CA(SA), Chief Financial Officer (CFO) Wesgro ... Wesgro, Cape Town and the Western Cape\'s official tourism, trade and investment promotion agency"; started at Wesgro January 2023. CFO Awards 2024: Transformation & Empowerment Award, Wesgro.',
         source_urls=["https://www.asb.co.za/staff/mr-sandiso-gcwabe/",
                      "https://in-for-sight-summit.co.za/speakers/"],
         notes="Location HIGH: role is stated as at Wesgro in Cape Town; this is workplace-agency evidence, not a personal residence statement. Articles narrative (Auditor-General) appears in a CFO South Africa article but no training-contract completion wording is asserted here, so articles remain not established. Current SAICA membership NOT verified."),
    dict(name="Riaan Davel", first="Riaan", surname="Davel", des=["CA(SA)"],
         status="CONFIRMED", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="DRDGOLD Limited",
         role_family="Executive Finance", industry="Mining", sub_industry="Gold",
         academic=["BCom (Hons) (Accounting) — University of Johannesburg",
                   "MCom (International Accounting) — University of Johannesburg"],
         evidence='University of Johannesburg (Accountancy@UJ, July 2025): "Mr Riaan Davel, Chief Financial Officer of DRDGOLD Limited ... a proud UJ alumnus and qualified CA(SA)". CFO South Africa profile: CFO of DRDGOLD since January 2015, previously audit partner at KPMG; company described as a South African gold producer. CFO Awards 2024: Finance & ESG Award, DRDGOLD.',
         source_urls=["https://x.com/UJAccountancy/status/1944699692840845733",
                      "https://cfo.co.za/profiles/riaan-davel/"],
         notes="No person-specific SA workplace/residence statement in the sources used; location not evidenced. Audit-partner history does not by itself establish an articles employer/route. Current SAICA membership NOT verified."),

    # ---- HIGH_CONFIDENCE (SAICA award-date role; see notes) ----
    dict(name="Arthi Daya", first="Arthi", surname="Daya", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="BBF Safety Group",
         role_family="Executive Finance", industry="Manufacturing",
         sub_industry="Safety footwear manufacturing",
         evidence='SAICA 2024 Top-35 profile: "Arthi Daya, a CA(SA), is the CFO of the BBF Safety Group, the largest safety footwear manufacturer in Africa ... driving force behind the financial strategy, risk management and compliance".',
         source_urls=[SAICA24 + "arthi-daya"],
         notes="HISTORICAL-ROLE FLAG: title/employer as stated on the 2024 SAICA finalist profile, accessed 2026-10-14; not independently re-verified as current in 2025/26. Industry is the employer's manufacturing sector per SAICA, not a personal specialism. Directory listings (e.g. Pinetown address) were NOT used as location evidence. Current SAICA membership NOT verified."),
    dict(name="Mhlengi Tenza", first="Mhlengi", surname="Tenza", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="Standard Insurance Limited",
         role_family="Executive Finance", industry="Insurance",
         evidence='SAICA 2024 Top-35 profile: "Mhlengi Tenza CA(SA) ... Mhlengi is currently the CFO of Standard Insurance Limited, where he leads the Finance and Value Management function ... leading a team of 21 finance professionals"; training completed at Deloitte in 2018 per the same profile.',
         source_urls=[SAICA24 + "mhlengi-tenza-31/"],
         notes="HISTORICAL-ROLE FLAG: role as at the 2024 award profile. Origin (Ixopo, KwaZulu-Natal) and a historic Deloitte Johannesburg manager role are NOT current-location evidence, so location is not evidenced. Training at Deloitte (2018) is stated; a SAICA training-contract completion wording is not asserted. Current SAICA membership NOT verified."),
    dict(name="Jason Grieve", first="Jason", surname="Grieve", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="Crawford Dougall Holdings",
         role_family="Executive Finance", industry="Insurance",
         sub_industry="Insurance brokerage",
         academic=["MCom — University of Cape Town"],
         evidence='SAICA 2024 Top-35 profile: heading "Chief Financial Officer - Crawford Dougall Holdings"; body "Jason Grieve CA(SA) is a Master of Commerce graduate (UCT) ... As Group CFO of an international insurance brokerage ...".',
         source_urls=[SAICA24 + "jason-grieve"],
         notes="HISTORICAL-ROLE FLAG: role as at 2024 award profile. Heading employer and body description (Group CFO, insurance brokerage) are recorded together without inventing a legal-entity link. Eastern Cape non-profit co-founding is not workplace evidence. Current SAICA membership NOT verified."),
    dict(name="Jared Moodley", first="Jared", surname="Moodley", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Managing Partner: Deloitte Africa's Valuation and Modelling Business",
         employer="Deloitte",
         role_family="Financial Analysis", industry="Professional Services",
         sub_industry="Valuation and modelling",
         evidence='SAICA 2024 Top-35 profile: "Jared Moodley, a CA(SA), was at the age of 34 appointed as the managing partner of Deloitte Africa\'s Valuation and Modelling business".',
         source_urls=[SAICA24 + "jared-moodley"],
         notes="HISTORICAL-ROLE FLAG: role as at 2024 award profile. \"Deloitte Africa\" scope is continental; no person-specific SA office/residence statement, so location is not evidenced. Current SAICA membership NOT verified."),
    dict(name="Lindie Scholtz", first="Lindie", surname="Scholtz", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Regional Head of Credit", employer="FNB",
         role_family="Risk", industry="Banking",
         evidence='SAICA 2024 Top-35 profile: "Lindie Scholtz CA(SA) ... Regional Head of Credit - FNB, a Division of FirstRand Bank ... within the Commercial Credit team".',
         source_urls=[SAICA24 + "lindie-scholtz-35"],
         notes="HISTORICAL-ROLE FLAG: role as at 2024 award profile. No region/office stated for her personally, so location is not evidenced (a regional credit role does not prove where she sits). Current SAICA membership NOT verified."),
    dict(name="Nokuzola Morata", first="Nokuzola", surname="Morata", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Group Financial Manager", employer="Knight Piésold (Pty) Ltd",
         role_family="Group Accounting", industry="Engineering",
         evidence='SAICA 2024 Top-35 profile: heading "Group Financial Manager - Knight Piésold (Pty) Ltd"; body "Nokuzola Morata CA(SA) has over 10 years\' experience in various industries, including energy, engineering, and technologies ... Group Finance Manager at Knight Piésold Southern Africa".',
         source_urls=[SAICA24 + "nokuzola-morata"],
         notes="HISTORICAL-ROLE FLAG: role as at 2024 award profile; heading/body title wording (Financial vs Finance Manager) preserved in this note. Co-chairing an AWCA Gauteng subcommittee is professional activity in Gauteng, not workplace/residence proof. Current SAICA membership NOT verified."),
    dict(name="Simphiwe Mahlangu", first="Simphiwe", surname="Mahlangu", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Director: Audit and IT Centre of Excellence", employer="BDO South Africa",
         role_family="External Audit", industry="Accounting / Audit",
         evidence='SAICA 2024 Top-35 profile: "Simphiwe Mahlangu CA(SA) is Director: Audit and IT Centre of Excellence at BDO South Africa ... also responsible for her own audit clients as an audit engagement partner ... a registered SAICA assessor".',
         source_urls=[SAICA24 + "simphiwe-mahlangu"],
         notes="HISTORICAL-ROLE FLAG: role as at 2024 award profile. No BDO office stated for her personally, so location is not evidenced. \"Registered SAICA assessor\" is a SAICA role, not proof of current membership status. Current SAICA membership NOT verified."),
    dict(name="Dorcas Nhlapho", first="Dorcas", surname="Nhlapho", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         alternate_names=["Dorcas Livhuwani Nhlapo"],
         title="Associate Director", employer="BDO South Africa",
         role_family="External Audit", industry="Accounting / Audit",
         province="Gauteng", city="Johannesburg", location_confidence="CONFIRMED",
         evidence='SAICA 2024 Top-35 profile: heading "Dorcas Nhlapho ... Associate Director - BDO South Africa Inc"; body "Dorcas Livhuwani Nhlapo CA(SA) is a Registered Auditor, a SAICA Assessor, and Associate Director at BDO SA in the Johannesburg office". A BDO South Africa article (2024) also bylines a Dorcas Nhlapo of BDO South Africa.',
         source_urls=[SAICA24 + "dorcas-nhlapho",
                      "https://www.bdo.co.za/en-za/insights/2024/advisory/the-evolving-landscape-of-copper"],
         notes="NAME VARIANT preserved: SAICA heading \"Nhlapho\" vs body/BDO \"Nhlapo\" — recorded as an alternate name, not silently normalised. Workplace (Johannesburg office) is explicitly stated; role currency is as at 2024. Current SAICA membership NOT verified."),
    dict(name="Manoka Mathye", first="Manoka", surname="Mathye", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Partner", employer="KPMG South Africa",
         role_family="External Audit", industry="Accounting / Audit",
         evidence='SAICA Top-35 (2023) profile: "Manoka Mathye CA(SA) — Partner at KPMG South Africa ... partner at KPMG South Africa ... in their technical department ... conducting pre-issuance reviews ... also has her own audit clients ... co-chairs KPMG\'s National Audit Transformation Committee".',
         source_urls=[TOP35 + "manoka-mathye/"],
         notes="HISTORICAL-ROLE FLAG: role as at 2023 award profile. A national (South Africa) employer role does not state her office/residence, so location is not evidenced. Current SAICA membership NOT verified."),
    dict(name="Omar Ahmed Baker", first="Omar", surname="Baker", des=["CA(SA)"],
         alternate_names=["Omar Baker"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Chief Financial Officer", employer="FNB Islamic Banking",
         role_family="Executive Finance", industry="Banking",
         evidence='SAICA Top-35 (2023) profile: "Omar Ahmed Baker CA(SA) — Chief Financial Officer at FNB (Islamic Banking) ... His position as a CA(SA) and a tax practitioner ... also runs his own successful business, OAB Chartered Accountants".',
         source_urls=[TOP35 + "omar-ahmed-baker/"],
         notes="HISTORICAL-ROLE FLAG: bank role as at 2023 award profile. Concurrent OAB Chartered Accountants is recorded only in this note (no separate employer assertion). No person-specific SA office/residence statement, so location is not evidenced. A LinkedIn URL seen in search results was NOT recorded — it was not opened/verified as his individual profile for this batch. Current SAICA membership NOT verified."),
    dict(name="Dima Masedi", first="Dima", surname="Masedi", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Head of Financial Shared Services", employer="Standard Bank",
         role_family="Financial Control", industry="Banking",
         academic=["MBA"],
         evidence='SAICA Top-35 (2023) profile: "Dima Masedi CA(SA), MBA — Head of Financial Shared Services at Standard Bank ... expertise encompasses financial management, accounting, strategic planning, budgeting, change management, controls and digitisation ... a SAICA-certified assessor".',
         source_urls=[TOP35 + "dima-masedi/"],
         notes="HISTORICAL-ROLE FLAG: role as at 2023 award profile. Search-result location snippets (directory/LinkedIn) were NOT used as location evidence. Current SAICA membership NOT verified."),
    dict(name="Boitumelo Loate", first="Boitumelo", surname="Loate", des=["CA(SA)"],
         status="HIGH_CONFIDENCE", designation_status="CONFIRMED",
         title="Portfolio Manager – Multi Asset, and Investment Analyst",
         employer="36ONE Asset Management",
         role_family="Financial Analysis", industry="Asset Management",
         academic=["MBA — Oxford University", "MCom — Wits University"],
         evidence='SAICA Top-35 (2023) profile: "Boitumelo Loate CA(SA) — Portfolio Manager – Multi Asset, and Investment Analyst at 36ONE Asset Management ... oversees the multi-asset portfolios ... managing the fixed income portion within all 36ONE portfolios"; Lead category winner, SAICA Top-35 2023. Prior role: manager at KPMG Financial Services (per same profile).',
         source_urls=[TOP35 + "boitumelo-loate/"],
         notes="HISTORICAL-ROLE FLAG: role as at 2023 award profile. Part-time university lecturing (Wits/UP/UKZN, per SAICA profile) is academic activity, not her finance workplace, and is not used as location. Current SAICA membership NOT verified."),
]

# ------------------------------------------------------------- companies ---
COMPANIES = [
    dict(company_name="BBF Safety Group", company_aliases=[], website=None,
         industry="Manufacturing", sub_industry="Safety footwear manufacturing",
         south_africa_locations=[], source_urls=[SAICA24 + "arthi-daya"]),
    dict(company_name="Standard Insurance Limited", company_aliases=[], website=None,
         industry="Insurance", sub_industry=None,
         south_africa_locations=[], source_urls=[SAICA24 + "mhlengi-tenza-31/"]),
    dict(company_name="Crawford Dougall Holdings", company_aliases=[], website=None,
         industry="Insurance", sub_industry="Insurance brokerage",
         south_africa_locations=[], source_urls=[SAICA24 + "jason-grieve"]),
    dict(company_name="First National Bank (FNB)", company_aliases=["FNB", "FNB Islamic Banking"],
         website=None, industry="Banking", sub_industry=None,
         south_africa_locations=[], source_urls=[SAICA24 + "lindie-scholtz-35"]),
    dict(company_name="Knight Piésold (Pty) Ltd", company_aliases=["Knight Piésold Southern Africa"],
         website=None, industry="Engineering", sub_industry="Consulting engineering",
         south_africa_locations=[], source_urls=[SAICA24 + "nokuzola-morata"]),
    dict(company_name="The Fulcrum Group", company_aliases=["Fulcrum Group (Pty) Ltd"],
         website=None, industry="Insurance",
         sub_industry="Short-term insurance premium collections and insurance premium finance",
         south_africa_locations=[], source_urls=[TOP35 + "ellen-gower-mzolo/"]),
    dict(company_name="36ONE Asset Management", company_aliases=["36ONE"],
         website=None, industry="Asset Management", sub_industry=None,
         south_africa_locations=[], source_urls=[TOP35 + "boitumelo-loate/"]),
    dict(company_name="Lions Cricket", company_aliases=["Central Gauteng Lions", "Gauteng Cricket Board"],
         website="https://lionscricket.co.za/", industry="Other",
         sub_industry="Sports administration (cricket union)",
         south_africa_locations=["Johannesburg"], source_urls=["https://lionscricket.co.za/management-team/"]),
    dict(company_name="Spear REIT Limited", company_aliases=["Spear REIT"],
         website=None, industry="Property", sub_industry="Real Estate (REIT)",
         south_africa_locations=["Cape Town"], source_urls=["https://cfo.co.za/profiles/christiaan-barnard/"]),
    dict(company_name="Altron", company_aliases=["Altron Group"],
         website="https://www.altron.com/", industry="Technology", sub_industry=None,
         south_africa_locations=[], source_urls=["https://www.altron.com/leadership"]),
    dict(company_name="MTN South Africa", company_aliases=["MTN SA"],
         website=None, industry="Telecommunications", sub_industry=None,
         south_africa_locations=[], source_urls=["https://cfo.co.za/profiles/dineo-molefe/"]),
    dict(company_name="Wesgro", company_aliases=["Western Cape Tourism, Trade and Investment Promotion Agency"],
         website=None, industry="Government",
         sub_industry="Tourism, trade and investment promotion",
         south_africa_locations=["Cape Town"], source_urls=["https://www.asb.co.za/staff/mr-sandiso-gcwabe/"]),
    dict(company_name="DRDGOLD Limited", company_aliases=["DRDGOLD"],
         website=None, industry="Mining", sub_industry="Gold",
         south_africa_locations=[], source_urls=["https://cfo.co.za/profiles/riaan-davel/"]),
    dict(company_name="Standard Bank", company_aliases=["Standard Bank Group"],
         website=None, industry="Banking", sub_industry=None,
         south_africa_locations=[], source_urls=[TOP35 + "dima-masedi/"]),
]

# --------------------------------------------------------------- sources ---
SOURCE_META = {
    # url: (source_type, reliability, summary)
    "https://www.bdo.co.za/en-za/our-people/sanele-nkosi": ("Employer Website", "PRIMARY", "BDO people page: Sanele Nkosi, Audit Partner, BDO Durban office; qualification Chartered Accountant South Africa."),
    "https://www.bdo.co.za/en-za/our-people/sibabalwe-bebeza": ("Employer Website", "PRIMARY", "BDO people page: Sibabalwe Bebeza, Associate Director, contact office BDO Johannesburg."),
    "https://www.cover.co.za/market-place-companies/axa-group": ("News", "MODERATE", "COVER listing (Feb 2026 podcast) describing Ellen Gower-Mzolo as CFO of Fulcrum; corroborates role currency only."),
    "https://lionscricket.co.za/management-team/": ("Employer Website", "PRIMARY", "Lions Cricket management team page listing Brecht Mohonathan as Chief Financial Officer."),
    "https://www.altron.com/leadership": ("Employer Website", "PRIMARY", "Altron leadership page: Carel Snyman, CFO, qualified CA (SA); page itself links his LinkedIn profile."),
    "https://group.nedbank.co.za/home/leadership/mike-davis.html": ("Employer Website", "PRIMARY", "Nedbank leadership page: Mike Davis, CFO since Oct 2020, qualifications include CA (SA); completed articles at Deloitte."),
    "https://cfo.co.za/profiles/christiaan-barnard/": ("Company Biography", "STRONG", "CFO South Africa profile: Christiaan Barnard, Chartered Accountant (SA), articles at PKF Inc., CFO Spear REIT since Aug 2016."),
    "https://cfo.co.za/articles/cfo-christiaan-barnard-knows-all-about-the-art-of-switching-off-at-the-top/": ("News", "STRONG", "CFO South Africa (1 Jun 2026): Spear REIT CFO Christiaan Barnard, 2025 Young CFO of the Year, lives in Cape Town northern suburbs and commutes to CBD office."),
    "https://www.tcta.co.za/wp-content/uploads/2026/01/TCTA-CFO-Wins-Award.pdf": ("Employer Website", "PRIMARY", "TCTA announcement (Jan 2026): Andisa Zinja CA (SA), CFO of TCTA since Apr 2025, named 2025 Public Sector CFO of the Year for prior CMS role."),
    "https://cfo.co.za/profiles/andisa-zinja/": ("Company Biography", "STRONG", "CFO South Africa profile: Andisa Zinja appointed TCTA CFO Apr 2025; previously Council for Medical Schemes CFO 2020-2025; education history."),
    "https://cfo.co.za/profiles/dineo-molefe/": ("Company Biography", "STRONG", "CFO South Africa profile: Dineo Molefe, qualified chartered accountant (SA), CFO MTN SA since Nov 2020."),
    "https://www.asb.co.za/staff/mr-sandiso-gcwabe/": ("Professional Body", "STRONG", "Accounting Standards Board: Sandiso Gcwabe CA(SA), currently CFO at Wesgro."),
    "https://in-for-sight-summit.co.za/speakers/": ("Conference Biography", "MODERATE", "Speaker bio: Sandiso Gcwabe CA(SA), CFO Wesgro, Cape Town / Western Cape agency."),
    "https://x.com/UJAccountancy/status/1944699692840845733": ("University", "STRONG", "University of Johannesburg Accountancy (Jul 2025): Riaan Davel, CFO DRDGOLD Limited, qualified CA(SA)."),
    "https://cfo.co.za/profiles/riaan-davel/": ("Company Biography", "STRONG", "CFO South Africa profile: Riaan Davel, CFO DRDGOLD since Jan 2015; DRDGOLD described as South African gold producer."),
    "https://cfoawards.co.za/hall-of-fame/": ("News", "STRONG", "CFO Awards hall of fame: 2024/2025 winners and employers (Mike Davis, Carel Snyman, Dineo Molefe, Christiaan Barnard et al)."),
    "https://www.bdo.co.za/en-za/insights/2024/advisory/the-evolving-landscape-of-copper": ("Employer Website", "STRONG", "BDO South Africa article bylined Dorcas Nhlapo of BDO South Africa (identity corroboration for the Nhlapo/Nhlapho variant)."),
}


def main():
    existing_names = {
        json.loads(line)["full_name"].strip().lower()
        for line in open(db_lib.PEOPLE_PATH) if line.strip()
    }
    new_specs = []
    for spec in PEOPLE:
        if spec["name"].strip().lower() in existing_names:
            print(f"SKIP existing (enrich, do not duplicate): {spec['name']}")
            continue
        spec = dict(spec)
        spec.setdefault("date", CHECK)
        spec.setdefault("verified", CHECK)
        spec.setdefault("articles_status", QUAL_NOT_EST)
        new_specs.append(spec)

    # company records (skip names already catalogued, case-insensitive)
    existing_companies = {
        json.loads(line)["company_name"].strip().lower()
        for line in open(db_lib.COMPANIES_PATH) if line.strip()
    }
    cid = db_lib.next_id(db_lib.COMPANIES_PATH, "cmp")
    company_specs = []
    for comp in COMPANIES:
        if comp["company_name"].strip().lower() in existing_companies:
            continue
        company_specs.append(dict(
            id="cmp-%04d" % cid, company_name=comp["company_name"],
            company_aliases=comp["company_aliases"], website=comp["website"],
            industry=comp["industry"], sub_industry=comp["sub_industry"],
            headquarters=None, south_africa_locations=comp["south_africa_locations"],
            company_size_if_public=None, listed_or_private="unknown",
            parent_company=None,
            finance_team_research_status="RESEARCHED_WITH_PEOPLE",
            finance_people_verified_count=1,
            finance_team_research_notes="Added in batch 13 (CA(SA) award cohorts, 2026-10-14) with a verified finance person; sector as sourced in the cited source.",
            source_urls=comp["source_urls"], date_verified=CHECK))
        cid += 1

    # source records: one per unique person source URL not already in sources.jsonl
    existing_urls = {
        json.loads(line)["url"] for line in open(db_lib.SOURCES_PATH) if line.strip()
    }
    pid_start = db_lib.next_id(db_lib.PEOPLE_PATH, "acc")
    sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
    source_specs = []
    seen_new_urls = set()
    for offset, spec in enumerate(new_specs):
        person_id = "acc-%04d" % (pid_start + offset)
        for url in spec["source_urls"]:
            if url in existing_urls or url in seen_new_urls:
                continue
            seen_new_urls.add(url)
            meta = SOURCE_META.get(url)
            if meta:
                stype, reliability, summary = meta
            elif "saica.org.za" in url or "saicaevents.co.za" in url:
                stype, reliability = "Professional Body", "PRIMARY"
                summary = f"SAICA Top-35-Under-35 profile for {spec['name']}: CA(SA) designation and award-date title/employer as recorded in the person record."
            else:
                stype, reliability = "Other", "MODERATE"
                summary = f"Source for {spec['name']} as recorded in the person record."
            source_specs.append(dict(
                id="src-%04d" % sid, url=url, source_type=stype,
                person_id=person_id, company_id=None,
                evidence_type="designation_and_employment",
                evidence_summary=summary,
                qualification_supported="true", skill_supported=None,
                system_supported=None, employment_supported="true",
                accessed_date=CHECK, reliability=reliability, status="USED"))
            sid += 1

    people = db_lib.append_batch(new_specs, company_specs=company_specs,
                                 source_specs=source_specs,
                                 label="Batch 13 (CA(SA) award cohorts)")
    # post-set fields db_lib.build does not carry
    if people:
        by_id = {p["id"]: p for p in people}
        lines = open(db_lib.PEOPLE_PATH).read().splitlines()
        out = []
        for line in lines:
            if not line.strip():
                continue
            rec = json.loads(line)
            if rec["id"] not in by_id:
                out.append(line)  # preserve untouched records byte-for-byte
                continue
            if True:
                spec = next(s for s in new_specs if s["name"] == rec["full_name"])
                rec["role_scope_status"] = "IN_SCOPE"
                rec["seniority"] = ("Executive" if any(
                    k in (spec.get("title") or "")
                    for k in ("Chief Financial Officer", "Managing Partner", "Partner"))
                    else "Head / Director")
                if rec["full_name"] == "Omar Ahmed Baker":
                    rec["current_company_affiliations"] = [{
                        "company": "OAB Chartered Accountants",
                        "relationship": "own business (concurrent, per SAICA profile)",
                        "evidence_url": TOP35 + "omar-ahmed-baker/",
                    }]
            out.append(json.dumps(rec, ensure_ascii=False, separators=(",", ":")))
        with open(db_lib.PEOPLE_PATH, "w") as fh:
            fh.write("\n".join(out) + "\n")
    print(f"Batch 13 done: {len(people)} new people, "
          f"{len(company_specs)} companies, {len(source_specs)} sources.")


if __name__ == "__main__":
    main()
