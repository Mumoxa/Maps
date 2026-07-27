from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

out='South_Africa_SAP_CAR_POSDTA_people_market_map.xlsx'
wb=Workbook()
ws=wb.active
ws.title='SA-linked people map'

header_fill=PatternFill('solid', fgColor='1F4E78')
header_font=Font(color='FFFFFF', bold=True)
green=PatternFill('solid', fgColor='E2F0D9')
yellow=PatternFill('solid', fgColor='FFF2CC')
orange=PatternFill('solid', fgColor='FCE4D6')
grey=PatternFill('solid', fgColor='E7E6E6')
blue=PatternFill('solid', fgColor='D9EAF7')
thin=Side(style='thin', color='D9D9D9')
border=Border(left=thin,right=thin,top=thin,bottom=thin)

def write_table(ws, headers, rows, widths):
    ws.append(headers)
    for c in range(1,len(headers)+1):
        cell=ws.cell(row=1,column=c)
        cell.fill=header_fill
        cell.font=header_font
        cell.alignment=Alignment(wrap_text=True, vertical='top')
        cell.border=border
    for r in rows:
        ws.append(r)
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment=Alignment(wrap_text=True, vertical='top')
            cell.border=border
    ws.freeze_panes='A2'
    ws.auto_filter.ref=ws.dimensions
    for i,w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width=w

headers=['Name','Surname','Title / role','Organisation','Geography','LinkedIn profile','CAR','POSDTA','DDF','UDF','OAA','Connection to CAR / POSDTA / DDF / UDF / OAA','Evidence grade','Primary public evidence','Source URLs','Important caveat']
rows=[
    ['Karl','Bend','UDF / F&R Solution Architect; Partner / Head of CC Intelligent Ordering','retailsolutions group','UK-based; LinkedIn shows a current Johannesburg UDF/F&R project','https://www.linkedin.com/in/karl-bend-74219bab/','Yes','Adjacent via POS inbound references','Yes','Yes','No direct OAA evidence','LinkedIn states he is overall responsible for design and implementation of UDF and integration to F&R in City of Johannesburg; also lists DDF data cleansing, POS data analysis, enhancements to POS inbound and DRFOUT, UDF configuration, rollout, optimisation. retailsolutions webinar article quotes him on UDF in SAP CAR landscape.','A — direct LinkedIn + provider article','Direct LinkedIn profile and retailsolutions SA UDF webinar article','https://www.linkedin.com/in/karl-bend-74219bab/ ; https://www.retailsolutions-sa.co.za/news/details/accurate-forecasts-for-future-customer-demand','Not necessarily South African resident; included because public LinkedIn shows Johannesburg SAP UDF/F&R work and retailsolutions has South Africa presence.'],
    ['Nizaam','Mahomed','SAP CAR Functional Consultant','GK Software Africa','Johannesburg Metropolitan Area','https://www.linkedin.com/in/nizaam-mahomed-870056190/','Yes','Yes','No direct evidence','No direct evidence','No direct evidence','LinkedIn profile lists SAP CAR W26CAR Workshop, SAP POSDTA W26POS Workshop, and project “Integration of Cow Hills POS to SAP CAR.” Public directories also list him as SAP CAR Functional Consultant at GK Africa.','B — direct LinkedIn project/training evidence; title corroborated by public directories','LinkedIn profile snippet; SignalHire/other public directory title corroboration','https://www.linkedin.com/in/nizaam-mahomed-870056190/ ; https://www.signalhire.com/companies/gk-software-africa','Title is not fully visible in the direct LinkedIn snippet; title corroborated from public directories. No DDF/UDF/OAA evidence found.'],
    ['Waseem Ahmed','Dawood','SAP OAA Solution Architect / Senior SAP CAR, POSDM, OAA, Retail Consultant','JD Group','Johannesburg / South Africa-linked','https://www.linkedin.com/in/waseem-ahmed-dawood-230b3a80/','Yes','POSDM/POSDTA adjacent; POSDTA not directly visible in LinkedIn snippet','No direct evidence','No direct evidence','Yes','LinkedIn snippet lists SAP CAR implementation project: “Implement a GK POS - CAR solution with OAA & Hybris - MAKRO.” Public people directories identify him as SAP OAA Solution Architect at JD Group and Senior SAP CAR, POSDM, OAA, Retail Consultant.','B/C — direct LinkedIn project evidence; title from public people directories','LinkedIn profile snippet; ContactOut/ZoomInfo title evidence','https://www.linkedin.com/in/waseem-ahmed-dawood-230b3a80/ ; https://contactout.com/waseem-ahmed-dawood-38581 ; https://www.zoominfo.com/p/Waseem-Dawood/2384699045','Because title comes from people-data directories, verify directly before treating as current. Do not use contact details from those directories.'],
    ['Leon','Van Niekerk','Head of Testing / SAP Test Integration Manager','Pick n Pay','City of Cape Town, Western Cape','https://www.linkedin.com/in/leon-van-niekerk-8210b511/','Indirect','Yes — testing/QA landscape','No','No','No','OpenText customer story states Pick n Pay uses SAP POSDTA solutions and quotes Leon van Niekerk on testing mission-critical systems; LinkedIn confirms Head of Testing at Pick n Pay and “SAP Test Integration Manager.”','B — directly tied to POSDTA landscape, but as QA/testing lead not configurator','LinkedIn profile; OpenText Pick n Pay customer story','https://www.linkedin.com/in/leon-van-niekerk-8210b511/ ; https://www.opentext.com/customers/pick-n-pay','Not a CAR/POSDTA functional consultant; included as testing/QA specialist connected to SAP POSDTA operations.'],
    ['Christian','Bowker','Managing Director, Syntax South Africa; formerly Managing Partner, Beyond Technologies South Africa','Syntax / former Beyond Technologies South Africa','City of Cape Town, Western Cape','https://www.linkedin.com/in/christianbowker/','Yes','Yes via Pick n Pay CAR/DTA project context','No','No','No','SAP/Beyond Pick n Pay case quotes Christian Bowker as Managing Partner at Beyond Technologies saying SAP CAR was a fit for Pick n Pay. Beyond case confirms implementation focused on SAP CAR POSDTA. LinkedIn confirms Christian Bowker profile and current Syntax South Africa role.','B — executive/provider lead, not configurator','LinkedIn profile; SAP Africa/Beyond Pick n Pay case studies','https://www.linkedin.com/in/christianbowker/ ; https://news.sap.com/africa/2023/04/pick-n-pay-sparks-retail-revolution-with-powerful-sap-deployment/ ; https://www.beyondtechnologies.com/news/pick-n-pay-sap-car/','Executive sponsor/partner-side lead; not evidence that he personally configures CAR/POSDTA.'],
    ['Matthew','Barker','Senior SAP Consultant / SAP Retail consultant','retailsolutions group','UK-based; has retailsolutions work history including Cape Town / SA references in LinkedIn snippet','https://www.linkedin.com/in/matthew-barker-rs/','Yes','Yes — public skill/recruiting evidence','No direct evidence','Yes','Yes — public skill/recruiting evidence','retailsolutions UDF webinar article lists Matthew Barker among senior SAP consultant speakers for UDF in the SAP CAR landscape. LinkedIn snippet includes retailsolutions post recruiting F&R, UDF, PMR, POSDTA, OAA and Retail skills and shows retailsolutions experience.','B — provider article + LinkedIn, but not a named SA customer implementation','LinkedIn profile; retailsolutions SA UDF webinar article','https://www.linkedin.com/in/matthew-barker-rs/ ; https://www.retailsolutions-sa.co.za/news/details/accurate-forecasts-for-future-customer-demand','Not necessarily South Africa-based. Direct personal project details for POSDTA/OAA not fully visible; UDF connection is provider article.'],
    ['Quentin','Lotriet','Principal SAP Consultant','Beyond Technologies','South Africa-linked via Beyond Technologies and retailsolutions webinar speaker list','https://www.linkedin.com/in/quentin-lotriet-04089222/','Indirect via SAP CAR/UDF article','No direct evidence','No direct evidence','Yes','No direct evidence','retailsolutions SA UDF webinar article lists Quentin Lotriet among senior SAP consultant speakers for a SAP UDF webinar; TheOrg lists him as Principal SAP Consultant at Beyond Technologies and provides the LinkedIn profile.','B/C — UDF speaker evidence; title/link from TheOrg','retailsolutions SA UDF webinar article; TheOrg public profile','https://www.retailsolutions-sa.co.za/news/details/accurate-forecasts-for-future-customer-demand ; https://theorg.com/org/beyond-technologies/org-chart/quentin-lotriet','TheOrg marks some org data as unverified; verify current employment before outreach.'],
    ['Camdin','Govender','SAP & Functional Consulting Team Lead','GK Software Africa','City of Johannesburg, Gauteng','https://za.linkedin.com/in/camdin-govender-0960586a','Indirect via GK Africa SAP CAR implementation capability','Indirect via GK POS / retail integration capability','No direct evidence','No direct evidence','No direct evidence','LinkedIn directly confirms SAP & Functional Consulting Team Lead at GK Software Africa. GK Africa public descriptions list SAP CAR implementation and retail POS SAP integration as services.','C — adjacent ecosystem lead; no personal CAR/POSDTA module claim found','LinkedIn profile; GK Africa public company/profile data','https://za.linkedin.com/in/camdin-govender-0960586a ; https://www.signalhire.com/companies/gk-software-africa','Do not treat as personal CAR/POSDTA specialist unless confirmed directly; included as adjacent SAP/POS functional lead.'],
]
write_table(ws, headers, rows, [16,18,35,28,32,48,12,14,12,12,12,60,25,45,70,45])
for r in range(2, ws.max_row+1):
    grade=ws.cell(r,13).value or ''
    fill = green if grade.startswith('A') else yellow if grade.startswith('B') else orange if grade.startswith('C') else grey
    for c in range(1, ws.max_column+1): ws.cell(r,c).fill=fill

# Global appendix
ws=wb.create_sheet('Global specialist appendix')
headers2=headers
rows2=[
    ['Rahul','Mukhi','Senior Consultant (UDF consulting and implementation); Senior CAR UDF Consultant','retailsolutions group','Switzerland / global','https://www.linkedin.com/in/rahul-mukhi-246b5114/','Yes','No direct POSDTA evidence','Yes via UDF input/data context','Yes','No direct evidence','LinkedIn states he is SAP CAR UDF consultant; provides functional and technical solutions for SAP CAR UDF, implementation to go-live and rollout, UDF training, analysis of input data and integration with F&R.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/rahul-mukhi-246b5114/','Global specialist; no South Africa-specific assignment found.'],
    ['Muthusamy Raja','Chokkalingam','SAP CAR / SAP Retail Consultant','retailsolutions group','UK / global','https://www.linkedin.com/in/cmraja333/','Yes','No direct POSDTA evidence','No direct evidence','Indirect via Dis-Chem UDF post liked; not personal evidence','No direct evidence','TheOrg lists him as SAP CAR / SAP Retail Consultant; LinkedIn confirms retailsolutions profile. Search result also shows he engaged with retailsolutions Dis-Chem UDF project announcement.','C — title from TheOrg; LinkedIn confirms profile but title redacted','TheOrg; LinkedIn profile snippet','https://www.linkedin.com/in/cmraja333/ ; https://theorg.com/org/retailsolutions-group/teams/sap-retail-consulting','Verify current module specialism directly. Do not infer Dis-Chem project involvement from a liked post.'],
    ['Priten','Sikotra','Senior Consultant','retailsolutions group','UK / global','https://www.linkedin.com/in/priten-sikotra-18790822/','Yes via SAP CAR/UDF context','No direct evidence','No direct evidence','Yes','No direct evidence','LinkedIn snippet says he successfully designed and implemented SAP Unified Demand Forecasting at Axfood, with workshops, system design/configuration and testing.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/priten-sikotra-18790822/','Global; no South Africa-specific assignment found.'],
    ['Antoine','Garneau Gauthier','Director, Consumer Industries; former SAP Solution Director / SAP Retail Consultant','EverBlue Partners; formerly Beyond Technologies','Canada / global','https://www.linkedin.com/in/antoine-garneau-gauthier-0a996b12a/','Yes','Yes','No direct evidence','No direct evidence','No direct evidence','LinkedIn profile lists Beyond Technologies roles with Master Data Specialist, CAR POSDTA, POS Outbound, Pricing & Promotions, GK OmniPOS integration and Commerce Integration.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/antoine-garneau-gauthier-0a996b12a/','Global; former Beyond Technologies, no South Africa-specific project evidence found.'],
    ['Madhan','Raj','Technology Consultant SAP IS Retail / SAP CAR','Tata Consultancy Services','India / global','https://www.linkedin.com/in/madhan01/','Yes','Yes','No direct evidence','No direct evidence','Yes','LinkedIn profile says specialized in omnichannel consulting; worked in SAP CAR OAA and POSDTA; current focus on CAR OAA functionality and H&M Group solution design.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/madhan01/','Global; no South Africa-specific assignment found.'],
    ['Sumita','Mondal','SAP CAR Consultant (POSDTA, OAA, OPP)','TECHBRAWN','India / global','https://www.linkedin.com/in/sumitaofficial/','Yes','Yes','No direct evidence','No direct evidence','Yes','LinkedIn profile title says SAP CAR Consultant (POSDTA, OAA, OPP); profile says expertise in SAP CAR powered by HANA and POS Data Transfer and Audit configuration in CAR.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/sumitaofficial/','Global; profile mentions openings in South Africa but does not show a South African assignment.'],
    ['Ashish','Chaudhary','SAP Consultant','Freelance','Global / not SA-confirmed','https://www.linkedin.com/in/ashish-chaudhary-841ba2239/','Yes','Yes','No direct evidence','No direct evidence','Yes','LinkedIn snippet lists mapping processes to POSDTA for store sales and Omnichannel Article Availability for e-commerce; setup POSDTA configuration in CAR, SLT for S/4 and CAR, POS transaction mapping to SAP CAR.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/ashish-chaudhary-841ba2239/','Global; no South Africa-specific assignment found.'],
    ['Leonel','Mendes','SAP S/4HANA & SAP CAR System Consultant / SAP Consultant','Accenture Middle East','Dubai / global','https://www.linkedin.com/in/leonelmendes/','Yes','Yes','No direct evidence','Yes','Yes','LinkedIn says he specializes in SAP CAR modules including OAA, OPP(s), PMR, AMR, POSDTA, UDF.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/leonelmendes/','Global; no South Africa-specific assignment found.'],
    ['Dinesh','J N','SAP CAR (POSDTA) Consultant','Tata Consultancy Services','India / global','https://www.linkedin.com/in/dinesh-j-n-43ba1324b/','Yes','Yes','No direct evidence','No direct evidence','No direct evidence','LinkedIn snippet states SAP CAR (POSDTA) Consultant at TCS.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/dinesh-j-n-43ba1324b/','Global; no South Africa-specific assignment found.'],
    ['Gunjan','Goel','SAP Solution Lead','PwC','United States / global','https://www.linkedin.com/in/gunjan-goel-648a25124/','Yes','Yes','No direct evidence','No direct evidence','No direct evidence','LinkedIn says skilled in SAP CAR / POSDTA.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/gunjan-goel-648a25124/','Global; no South Africa-specific assignment found.'],
    ['Sheo','Singh','SAP CAR/POSDTA Consultant / SAP BW specialist','Novus Technologies Inc','United States / global','https://www.linkedin.com/in/sheo-singh-5b05046/','Yes','Yes','No direct evidence','No direct evidence','No direct evidence','LinkedIn profile title says SAP CAR/POSDTA Consultant / SAP BW and SME in SAP BW, CAR/POSDTA, HANA, BW-IP.','A — direct LinkedIn','LinkedIn profile','https://www.linkedin.com/in/sheo-singh-5b05046/','Global; no South Africa-specific assignment found.'],
    ['Rahul','Jain','SAP CAR POSDTA author / specialist','Not clearly visible in source','Global / not SA-confirmed','https://www.linkedin.com/in/rahul-jain-5115397','Yes','Yes','No direct evidence','No direct evidence','No direct evidence','LinkedIn article “SAP CAR POSDTA innovations in Retail using Fiori” discusses CAR POSDTA implementation requirements and Fiori KPIs for POSDTA support analysts.','B — LinkedIn article, author profile in metadata','LinkedIn Pulse article / SAP Community tag page','https://www.linkedin.com/pulse/sap-car-posdta-innovations-retail-using-fiori-rahul-jain ; https://www.linkedin.com/in/rahul-jain-5115397','Profile title not visible in source; included as public CAR/POSDTA author/specialist lead.'],
    ['Jose Paredes','Hernandez','IBM Consulting - Global SAP Retail Leader','IBM Consulting','Global','LinkedIn profile not surfaced; LinkedIn article URL only','Yes','Yes','No direct evidence','No direct evidence','Yes','LinkedIn article by Jose Paredes Hernandez discusses SAP CAR, POS DTA and OAA; source labels him IBM Consulting Global SAP Retail Leader.','B — LinkedIn article but profile URL not surfaced','LinkedIn Pulse article','https://www.linkedin.com/pulse/sales-audit-modernization-why-now-sap-car-jose-paredes-hernandez','No separate LinkedIn profile link found in public search results; keep as content-source lead, not profile-complete row.'],
]
write_table(ws, headers2, rows2, [16,18,35,28,32,48,12,14,12,12,12,65,25,45,70,45])
for r in range(2, ws.max_row+1):
    grade=ws.cell(r,13).value or ''
    fill = green if grade.startswith('A') else yellow if grade.startswith('B') else orange
    for c in range(1, ws.max_column+1): ws.cell(r,c).fill=fill

# Named stakeholders without LinkedIn
ws=wb.create_sheet('Named no LinkedIn found')
headers3=['Name','Surname','Title / role','Organisation','CAR/POSDTA/UDF connection','Public source','LinkedIn status','Reason not in main map']
rows3=[
    ['Anja','Leonard','Enterprise Solutions Architect','Pick n Pay','SAP Africa article quotes Leonard explaining POS DM to CAR/DTA move, CAR/DTA go-live in Jan 2022, and Pick n Pay in process of implementing UDF.','https://news.sap.com/africa/2023/07/pick-n-pay-modernises-its-pos/','No reliable LinkedIn profile found in final sweep','User requested LinkedIn profile link; therefore not included in main profile map.'],
    ['Elize','de Klerk','IT Supply Senior System Manager','Pick n Pay','SAP Africa and syndicated press quote de Klerk on choosing SAP Customer Activity Repository and POSDTA benefits.','https://news.sap.com/africa/2023/04/pick-n-pay-sparks-retail-revolution-with-powerful-sap-deployment/','No reliable LinkedIn profile found in final sweep','User requested LinkedIn profile link; therefore not included in main profile map.'],
    ['Emma','Warttig','Senior SAP Consultant','retailsolutions','retailsolutions SA UDF webinar page lists Emma Warttig among senior SAP consultant speakers for SAP UDF in CAR landscape.','https://www.retailsolutions-sa.co.za/news/details/accurate-forecasts-for-future-customer-demand','No reliable LinkedIn profile found in final sweep','User requested LinkedIn profile link; therefore not included in main profile map.'],
    ['Vaughn','Booyens','S/4HANA Move Business Lead','Britehouse','AFSUG/Britehouse S/4 technical readiness deck includes SAP Retail topics such as article hierarchy and CAR integration, but not personal CAR/POSDTA specialism.','https://afsug.com/wp-content/uploads/2020/06/S4HANA-Technical-Readiness-V-Booyens-Britehouse.pdf','LinkedIn link appears in deck: https://www.linkedin.com/in/vaughn-booyens-1ab845','Excluded from main because CAR reference is architectural context, not evidence of SAP CAR/POSDTA/DDF/UDF/OAA specialist role.'],
]
write_table(ws, headers3, rows3, [18,18,30,28,65,70,45,55])
for r in range(2, ws.max_row+1):
    for c in range(1, ws.max_column+1): ws.cell(r,c).fill=grey

# Search log / evidence rules
ws=wb.create_sheet('Method & search log')
headers4=['Area','What was searched','Result / rule applied']
rows4=[
    ['Scope assumption','Interpreted as South Africa-linked SAP CAR/POSDTA talent because it follows the South Africa company market map. Added a global appendix for specialists surfaced during the sweep.','Main sheet includes SA-linked people only. Global appendix is separated and should not be treated as South African market capacity.'],
    ['Accepted evidence','Public LinkedIn profiles/articles, SAP/customer/provider pages, job adverts, and company/provider pages.','No private data, no emails, no phone numbers included.'],
    ['Weak evidence handling','ZoomInfo, ContactOut, SignalHire, TheOrg and similar people databases were not used alone for final conclusions.','If such sources were used, rows are marked B/C or C and include a verification caveat.'],
    ['Search terms','SAP CAR, POSDTA, SAP CAR Functional Consultant South Africa, SAP CAR Consultant South Africa LinkedIn, site:za.linkedin.com/in SAP CAR, Pick n Pay SAP CAR LinkedIn, GK Africa SAP CAR, retailsolutions UDF, Dis-Chem UDF, Beyond Technologies POSDTA, SAP OAA South Africa.','Few direct South Africa-based profiles were publicly indexed; most results were jobs, company pages, or global profiles.'],
    ['Exclusions','Profiles where SAP CAR/POSDTA appeared only in “people also viewed”, comments, liked posts, or unrelated job adverts were excluded or placed in caveats.','Examples: Anwar Frank/Innocentia search snippets showed a nearby “SAP CAR (POSDM/POSDTA) FUNCTIONAL” item, but the snippet did not attribute it to the named profile.'],
]
write_table(ws, headers4, rows4, [28,80,80])

# Summary sheet first
ws=wb.create_sheet('Executive summary',0)
ws['A1']='SAP CAR / POSDTA / DDF / UDF / OAA People Market Map — South Africa-linked final sweep'
ws['A1'].font=Font(bold=True, size=15, color='1F4E78')
summary=[
    ('Main finding','The public web exposes a small set of South Africa-linked people with direct or adjacent SAP CAR/POSDTA/UDF evidence. The strongest SA-linked specialist evidence is for Karl Bend (UDF/F&R in Johannesburg), Nizaam Mahomed (SAP CAR/POSDTA training and SAP CAR integration project), Waseem Ahmed Dawood (SAP CAR/OAA project at Makro/JD Group), and Leon Van Niekerk (Pick n Pay POSDTA testing/QA landscape).'),
    ('Important expansion from final sweep','A SAP Africa article says Pick n Pay moved from POS DM to CAR/DTA and is in the process of implementing UDF. retailsolutions references publicly state Dis-Chem is moving to SAP F&R and UDF.'),
    ('Evidence discipline','Where a profile title came from a public people directory rather than a direct LinkedIn snippet, I marked it B/C or C and added a verification caveat. I did not include emails or phone numbers.'),
    ('Global appendix','A separate appendix lists global SAP CAR/POSDTA/UDF/OAA specialists surfaced by the sweep. These should not be counted as South African market resources unless separately verified.'),
]
for i,(k,v) in enumerate(summary,start=3):
    ws.cell(i,1).value=k; ws.cell(i,1).font=Font(bold=True); ws.cell(i,1).fill=blue; ws.cell(i,1).border=border
    ws.cell(i,2).value=v; ws.cell(i,2).alignment=Alignment(wrap_text=True, vertical='top'); ws.cell(i,2).border=border
ws.column_dimensions['A'].width=32; ws.column_dimensions['B'].width=120

wb.save(out)
print(out)
