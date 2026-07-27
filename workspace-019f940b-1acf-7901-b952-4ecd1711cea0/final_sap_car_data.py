from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

out = 'South_Africa_SAP_CAR_POSDTA_market_map_final.xlsx'
wb = Workbook()
# Remove default
ws = wb.active
ws.title = 'Confirmed end users'

header_fill = PatternFill('solid', fgColor='1F4E78')
header_font = Font(color='FFFFFF', bold=True)
sub_fill = PatternFill('solid', fgColor='D9EAF7')
red_fill = PatternFill('solid', fgColor='FCE4D6')
yellow_fill = PatternFill('solid', fgColor='FFF2CC')
green_fill = PatternFill('solid', fgColor='E2F0D9')
grey_fill = PatternFill('solid', fgColor='E7E6E6')
thin = Side(style='thin', color='D9D9D9')
border = Border(left=thin, right=thin, top=thin, bottom=thin)

def write_table(ws, headers, rows, widths=None):
    ws.append(headers)
    for c in range(1, len(headers)+1):
        cell = ws.cell(row=1, column=c)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(wrap_text=True, vertical='top')
        cell.border = border
    for r in rows:
        ws.append(r)
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(wrap_text=True, vertical='top')
            cell.border = border
    ws.freeze_panes = 'A2'
    ws.auto_filter.ref = ws.dimensions
    if widths:
        for i, w in enumerate(widths, start=1):
            ws.column_dimensions[get_column_letter(i)].width = w
    else:
        for i in range(1, len(headers)+1):
            ws.column_dimensions[get_column_letter(i)].width = 20

confirmed_headers = [
    'Company', 'Sector / role', 'Evidence tier', 'Strict inclusion decision',
    'Public SAP CAR interaction', 'POSDTA', 'DDF', 'UDF', 'OAA',
    'Business context', 'Primary sources', 'Notes / caveats'
]
confirmed_rows = [
    [
        'Pick n Pay Group',
        'FMCG grocery / general merchandise retailer; brands include Pick n Pay, Boxer and TM.',
        'Tier A — direct SAP + implementation partner + supporting customer story',
        'Confirmed end user. Include in strict market map.',
        'SAP Africa says Pick n Pay chose and implemented SAP Customer Activity Repository to eliminate reporting/reconciliation delays. Beyond Technologies says Pick n Pay selected SAP CAR as replacement platform for previous SAP POSDM application.',
        'Confirmed. SAP Africa explicitly references POSDTA operations; Beyond says implementation focused on POSDTA and master data as POSDM replacement.',
        'Not explicitly confirmed. Beyond says required master data; no source names DDF.',
        'Not explicitly confirmed. Pick n Pay Investor Relations mentions forecast-driven replenishment enabled by integrated SAP platform, but not UDF.',
        'Not explicitly confirmed.',
        'High transaction volumes (>30bn); transaction/reconciliation acceleration; accurate real-time data and analytics; improved ecommerce stock/inventory visibility; one-click admin/financial reporting.',
        'SAP Africa Pick n Pay case; Beyond Technologies Pick n Pay SAP CAR POSDTA case; OpenText Pick n Pay customer story; Pick n Pay Investor Relations at-a-glance.',
        'Some syndications describe S/4HANA; the SAP Africa page fetched for this sweep says ECC. The market map records CAR/POSDTA status, not the ECC/S/4 nuance.'
    ],
    [
        'Shoprite Group',
        'Grocery / omnichannel retail group; brands include Shoprite, Checkers, Usave, LiquorShop, etc.',
        'Tier B — company job advert confirms CAR landscape; partner/SAP articles support SAP Retail context',
        'Confirmed SAP CAR interaction, but not confirmed POSDTA. Include in broad CAR map; exclude from strict POSDTA-only list.',
        'A Shoprite-posted CareerJunction job advert states the SAP Retail system consists of Retail, GTS, Finance, Gateway and CAR. GK Software quotes Shoprite CIO on integration into SAP merchandise management; GK describes SAP retail data streams between GK OmniPOS and SAP CPI, CAR and S/4HANA and says the model has proven itself at Shoprite.',
        'Not explicitly confirmed by accepted source.',
        'Not explicitly confirmed.',
        'Not explicitly confirmed.',
        'Not explicitly confirmed.',
        'SAP News says Shoprite is the largest SAP retail customer by number of transactions. SAP News also says SAP Retail is source of stock ledger and real-time sales for Sixty60 fulfilment, and supplies promotional information, prices and article data. This supports SAP Retail maturity, not module-level CAR proof.',
        'CareerJunction Shoprite SAP Technical Consultant job advert; GK Software Model Company blog; SAP Africa Shoprite market-share article; SAP Africa Checkers online shopping article; Shoprite B2B EDI technical guide.',
        'Because Shoprite CAR evidence is a job advert/landscape statement rather than a CAR case study, confidence is lower than Pick n Pay. Do not infer POSDTA/DDF/UDF/OAA.'
    ],
]
write_table(ws, confirmed_headers, confirmed_rows, [22,30,28,28,55,32,24,24,24,50,42,42])
# Apply evidence colors
for row in range(2, ws.max_row+1):
    tier = ws.cell(row,3).value or ''
    for col in range(1, ws.max_column+1):
        if 'Tier A' in tier:
            ws.cell(row,col).fill = green_fill
        elif 'Tier B' in tier:
            ws.cell(row,col).fill = yellow_fill

# Module Evidence Matrix
ws = wb.create_sheet('Module matrix')
headers = ['Company','SAP CAR','POSDTA','DDF','UDF','OAA','Module-level conclusion']
rows = [
    ['Pick n Pay Group','Confirmed','Confirmed','Not publicly confirmed','Not publicly confirmed','Not publicly confirmed','Only POSDTA is explicitly confirmed. DDF/UDF/OAA should remain blank unless a new source is found.'],
    ['Shoprite Group','Confirmed','Not publicly confirmed','Not publicly confirmed','Not publicly confirmed','Not publicly confirmed','CAR landscape interaction is confirmed; no accepted public evidence for POSDTA/DDF/UDF/OAA.'],
]
write_table(ws, headers, rows, [22,20,20,24,24,24,60])
for row in range(2, ws.max_row+1):
    for col in range(2,6+1):
        val = str(ws.cell(row,col).value)
        if val == 'Confirmed': ws.cell(row,col).fill = green_fill
        elif 'Not' in val: ws.cell(row,col).fill = red_fill

# Ecosystem Providers
ws = wb.create_sheet('Ecosystem providers')
headers = ['Company','Role','SAP CAR / POSDTA public interaction','South Africa link','Use in market map','Sources']
rows = [
    ['Beyond Technologies South Africa','Implementation partner / SAP consultancy','Implemented Pick n Pay SAP CAR with focus on POSDTA and required master data; helped reconciliation solution.','Offices listed in Bryanston, Johannesburg and Green Point, Cape Town.','Confirmed ecosystem actor; implementation partner for Pick n Pay.','Beyond Technologies case; SAP Africa Pick n Pay article'],
    ['SAP Africa / SAP SE','Vendor / publisher','Published Pick n Pay SAP CAR deployment; SAP product page describes CARAB capabilities.','SAP Africa News Center; Southern Africa regional director quoted.','Primary vendor source.','SAP Africa Pick n Pay; SAP CAR product page; AFSUG overview'],
    ['retailsolutions AG South Africa','SAP Retail consultancy','Public service pages for SAP CAR, POSDTA and UDF; customer references are mostly European/non-SA on SA-hosted site.','Home page lists South Africa among global locations.','Provider capability only; no named SA end-user found.','retailsolutions SA home; CAR page; POSDTA page; UDF page'],
    ['Britehouse / Dimension Data / NTT','SAP Retail services practice','Launch announcement says SAP Retail practice covers core ERP, CAR, BI, customer engagement and commerce.','Johannesburg release; Middle East and Africa incl. South Africa.','Provider capability only; no named CAR end-user in release.','ITWeb/Britehouse release'],
    ['GK Software Africa','Store/POS solution provider; SAP integration partner','GK Model Company uses data streams between GK OmniPOS and SAP CPI, CAR and S/4HANA; blog quotes Shoprite CIO.','GK Software Africa office in Sandton.','Ecosystem actor; supports Shoprite SAP integration context.','GK Model Company blog; GK About page'],
    ['OpenText / VicIT','Testing / DevOps tooling around SAP landscape','OpenText Pick n Pay story says Pick n Pay uses SAP POSDTA solutions and tests mission-critical apps.','Pick n Pay SA customer story.','Supporting source for Pick n Pay POSDTA existence.','OpenText Pick n Pay customer story'],
]
write_table(ws, headers, rows, [28,30,58,34,34,40])

# Watchlist / Exclusions
ws = wb.create_sheet('Watchlist & exclusions')
headers = ['Company','Observed public signal','Why not strict-confirmed','Recommended follow-up']
rows = [
    ['Woolworths Holdings / Woolworths South Africa','Search results found strong CAR/POSDTA evidence for Woolworths Group Australia and a weak/ambiguous LinkedIn signal around Woolworths SA.','No accepted company, SAP, or partner source tying Woolworths Holdings South Africa to SAP CAR/POSDTA. Avoid conflating with Woolworths Group Australia.','Check Woolworths SA official job archive, SAP partner case studies, and tender decks if available.'],
    ['Massmart','LinkedIn profile signal: employee says Massmart daily IT operations include SAP CAR, S/4HANA, ECC, GKPOS. Official site confirms only SAP ERP / application support context.','Employee profile is public but not a company/partner case or official deployment confirmation. Not enough under strict rules.','Seek Massmart or Walmart technology case study; verify GK/SAP CAR integration in official sources.'],
    ['Pepkor / JD Group / Pepkor Lifestyle','Aggregator listing for Pepkor Lifestyle SAP SD role mentions POSDM/POSDTA processes; search snippets show JD Group SAP CAR roles.','Aggregator/job-search snippets were not backed by fetchable official job pages. They imply skills/operations, not a confirmed SAP CAR deployment.','Find original Pepkor/JD Group job advert or SAP partner case; verify whether CAR is in production.'],
    ['SPAR Group South Africa','Public SAP ERP/S/4HANA implementation/problem coverage exists.','No accepted public CAR/POSDTA source found.','Search project documents for CARAB/POSDTA; avoid assuming from SAP ERP.'],
    ['TFG / The Foschini Group','General SAP HANA/analytics references only.','No accepted public CAR/POSDTA source found.','Search current/archived job adverts and partner case studies.'],
    ['Clicks Group','SAP interfacing/project references found but no CAR/POSDTA.','No accepted public CAR/POSDTA source found.','Search Clicks official careers and partner pages.'],
    ['Dis-Chem','No reliable CAR/POSDTA source found.','No accepted public CAR/POSDTA source found.','Search partner case studies and careers.'],
    ['Truworths','No reliable CAR/POSDTA source found.','No accepted public CAR/POSDTA source found.','Search partner case studies and careers.'],
    ['Mr Price Group','No reliable CAR/POSDTA source found.','No accepted public CAR/POSDTA source found.','Search official careers/technology roles.'],
    ['Food Lover’s Market','No reliable CAR/POSDTA source found.','No accepted public CAR/POSDTA source found.','Search partner case studies and careers.'],
    ['Avolta, Bergendahls, Coop Norge, Axfood, Valora, etc.','Appear as references on retailsolutions South Africa-hosted pages.','Not South African companies/end users for this map.','Exclude from SA market map; retain only as provider proof of capability.'],
]
write_table(ws, headers, rows, [32,60,56,45])
for row in range(2, ws.max_row+1):
    for col in range(1, ws.max_column+1):
        ws.cell(row,col).fill = grey_fill

# Source register
ws = wb.create_sheet('Source register')
headers = ['#','Source','URL','Evidence extracted','Reliability / use']
sources = [
    [1,'SAP Africa News Center — Pick n Pay Sparks Retail Revolution with Powerful SAP Deployment','https://news.sap.com/africa/2023/04/pick-n-pay-sparks-retail-revolution-with-powerful-sap-deployment/','Pick n Pay implemented SAP Customer Activity Repository; POSDTA operations; benefits; partner Beyond Technologies.','Tier A primary vendor/customer story.'],
    [2,'Beyond Technologies — Pick n Pay: Building the retail business of the future with SAP CAR POSDTA','https://www.beyondtechnologies.com/news/pick-n-pay-sap-car/','SAP CAR selected as POSDM replacement; focus on POSDTA and required master data; 30bn+ transaction volume; benefits.','Tier A implementation partner case.'],
    [3,'OpenText — Pick n Pay customer story','https://www.opentext.com/customers/pick-n-pay','Pick n Pay uses SAP POSDTA solutions among mission-critical systems.','Supporting independent customer story.'],
    [4,'Pick n Pay Investor Relations — PnP at a glance','https://www.picknpayinvestor.co.za/pnp-at-a-glance.php','Integrated SAP platform supports automated centralised processing and forecast-driven replenishment; advanced POS systems.','Context only; not module confirmation beyond SAP platform.'],
    [5,'CareerJunction / Shoprite job advert — SAP Technical Consultant – Senior Fiori Developer','https://www.careerjunction.co.za/sap-technical-consultant-senior-fiori-developer-at-shoprite-group-job-2397944.aspx','Shoprite job advert states SAP Retail system consists of Retail, GTS, Finance, Gateway and CAR.','Tier B company job advert; confirms CAR in landscape.'],
    [6,'GK Software — GK Model Company blog','https://www.gk-software.com/us/newsroom/blog/en-blog-20240116-gk-model-company','Quotes Shoprite CIO; describes data streams between GK OmniPOS and SAP CPI, CAR and S/4HANA; proven at Shoprite.','Supporting partner context for Shoprite.'],
    [7,'SAP Africa — Shoprite Holdings Gains Market Share','https://news.sap.com/africa/2024/10/shoprite-holdings-gains-market-share-for-the-fifth-consecutive-year/','Shoprite says it is largest SAP retail customer by number of transactions.','Context; does not confirm CAR modules.'],
    [8,'SAP Africa — Checkers Online Shopping Bonanza','https://news.sap.com/africa/2024/07/checkers-online-shopping-bonanza/','SAP Retail is source of stock ledger and real-time sales for Sixty60 fulfilment; ERP supplies promotional info, prices, article data.','Context; does not confirm CAR modules.'],
    [9,'Shoprite B2B Supplier RESTful API technical guide','https://b2b.shopriteholdings.co.za/B2BWebAPISupplierServices/Home/About','Official Shoprite guide says Shoprite was busy with large-scale SAP Retail implementation impacting ordering, receiving, shipping.','Context; not CAR proof.'],
    [10,'ITWeb / Britehouse — SAP Retail practice','https://www.itweb.co.za/article/britehouse-launches-sap-retail-practice/G98Yd7Lx2np7X2PD','Britehouse retail practice covers SAP CAR across MEA including South Africa.','Ecosystem provider proof.'],
    [11,'retailsolutions SA — SAP Customer Activity Repository','https://www.retailsolutions-sa.co.za/focus-areas/omnichannel-customer-centricity/sap-customer-activity-repository','Describes CAR components incl. POSDTA, OAA, UDF; SA office site.','Ecosystem/provider capability; general product context.'],
    [12,'retailsolutions SA — POSDTA','https://www.retailsolutions-sa.co.za/focus-areas/omnichannel-customer-centricity/posdta','POSDTA is integrated in SAP CAR and successor of POSDM; processes POS data.','General module / provider capability.'],
    [13,'retailsolutions SA — SAP UDF','https://www.retailsolutions-sa.co.za/focus-areas/forecasting-planning-applications/sap-udf-unified-demand-forecast','UDF as part of CAR delivers demand forecasts.','General module / provider capability.'],
    [14,'GK Software — About GK','https://www.gk-software.com/us/about/about-gk','Lists GK Software Africa office in Sandton.','Ecosystem provider location.'],
    [15,'AFSUG PDF — SAP Customer Activity Repository overview','https://afsug.com/wp-content/uploads/2020/10/SAP-Customer-Activity-Repository-THE-omnichannel-platform.pdf','General SAP CAR architecture/components: POSDTA, DDF, UDF, OAA/inventory visibility; DDF prerequisite for UDF.','General module definitions for African SAP User Group; not customer proof.'],
    [16,'SAP CAR product page','https://www.sap.com/africa/products/crm/customer-activity-repository.html','SAP CAR applications bundle functions and benefits.','Vendor product context.'],
]
write_table(ws, headers, sources, [6,42,70,70,32])

# Search log
ws = wb.create_sheet('Final sweep log')
headers = ['Search theme','Queries / coverage','Outcome']
rows = [
    ['Direct POSDTA/CAR South Africa','SAP POSDTA South Africa retailer; SAP POS DTA South Africa; POSDM POSDTA South Africa retail; SAP CAR South Africa POSDTA excluding Pick n Pay.','No new strict-confirmed South African end user beyond Pick n Pay. Results mostly provider pages and global/non-SA references.'],
    ['Module-specific DDF/UDF/OAA','Demand Data Foundation South Africa SAP CAR; Unified Demand Forecast South Africa; Omnichannel Article Availability South Africa; SAP OAA + major retailers.','No South African customer module deployment found. Only provider/product literature and global examples.'],
    ['Major South African retailers','Shoprite, Woolworths SA, Massmart, SPAR, Pepkor/JD, TFG, Mr Price, Clicks, Dis-Chem, Truworths, Food Lover’s Market, Cashbuild, Italtile, Takealot.','Only Shoprite broad CAR landscape confirmation and Pick n Pay POSDTA confirmation. Others remain excluded/watchlist.'],
    ['Official domains','shopriteholdings.co.za, picknpayinvestor.co.za, pnp.co.za, massmart.co.za, careers domains.','Pick n Pay IR and Shoprite official SAP Retail context added; no new CAR module confirmations.'],
    ['Events/user groups/provider ecosystem','AFSUG, Mastering SAP Africa, South African Retail Forum, retailsolutions, Britehouse, GK Software.','Added AFSUG technical component source and provider ecosystem detail. No additional named SA customers.'],
]
write_table(ws, headers, rows, [28,70,70])

# Summary sheet
ws = wb.create_sheet('Executive summary', 0)
ws['A1'] = 'South Africa SAP CAR / POSDTA Market Map — Final Sweep Summary'
ws['A1'].font = Font(bold=True, size=16, color='1F4E78')
ws['A3'] = 'Strict POSDTA-confirmed end users'
ws['B3'] = 'Pick n Pay Group only.'
ws['A4'] = 'Broad SAP CAR-confirmed end users'
ws['B4'] = 'Pick n Pay Group and Shoprite Group.'
ws['A5'] = 'DDF / UDF / OAA confirmed in SA end users'
ws['B5'] = 'No accepted public confirmation found.'
ws['A6'] = 'Final sweep result'
ws['B6'] = 'No additional strict-confirmed SAP CAR/POSDTA South African end users found. Expanded context and watchlist added.'
for row in range(3,7):
    ws.cell(row,1).font = Font(bold=True)
    ws.cell(row,1).fill = sub_fill
    ws.cell(row,1).border = border
    ws.cell(row,2).border = border
    ws.cell(row,2).alignment = Alignment(wrap_text=True, vertical='top')
ws.column_dimensions['A'].width = 40
ws.column_dimensions['B'].width = 100

wb.save(out)
print(out)
