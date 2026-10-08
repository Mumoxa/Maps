#!/usr/bin/env python3
"""Seed batch 1 for the canonical organization model.

Every company here is a real South African operating business and every fact
carries the URL it was read from on 2026-10-08. Nothing is invented: where a
source did not state something (website, headcount, location) the field is left
empty and the organization is marked `needs-verification`, so the UI can render
"not yet researched" instead of a fabricated zero.

Run:  python3 markets/organizations/seed/build_seed_1.py
Writes the JSON files the app imports and the importer validates.
"""
import json
import re
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
CHECKED = "2026-10-08"

# ---------------------------------------------------------------------------
# Industry taxonomy
# ---------------------------------------------------------------------------

POCKETS = [
    ("cold-chain", "Cold Chain & Storage", "Storage & handling",
     "Commercial refrigerated storage, blast freezing and temperature-controlled handling."),
    ("refrigerated-distribution", "Cold Chain Distribution", "Distribution",
     "Temperature-controlled transport and multi-temperature distribution centres."),
    ("food-manufacturing", "Food Manufacturing & Processing", "Manufacturing",
     "Food, beverage and edible-oil manufacturing and processing."),
    ("fisheries", "Fisheries & Seafood", "Manufacturing",
     "Fishing, seafood processing and frozen seafood distribution."),
    ("milling-feed", "Milling & Feed", "Manufacturing",
     "Flour milling, oilseed crushing and animal feed manufacturing."),
    ("agri-commodities", "Agricultural Commodities", "Commodity trading",
     "Grain and oilseed marketing, storage, grading and commodity trading."),
    ("transport-logistics", "Transport & Logistics", "Distribution",
     "Contract logistics, road freight, freight forwarding and supply chain management."),
    ("fmcg-distribution", "FMCG Distribution & Retail", "Retail",
     "Foodservice distribution, wholesale and grocery retail."),
    ("property-development", "Property Development", "Development",
     "Commercial, residential and mixed-use property development."),
    ("property-investment", "Property Investment & Funds", "Investment",
     "Property holding, listed property funds and development finance structures."),
    ("construction", "Construction & Infrastructure", "Project delivery",
     "Construction contracting, infrastructure delivery and construction materials."),
    ("renewable-energy", "Renewable Energy", "Development",
     "Renewable project development and independent power production."),
]

INDUSTRIES = [
    # cold chain
    ("cold-storage-operations", "Commercial cold storage", None, "cold-chain",
     "Refrigerated and frozen warehousing operated for third parties.", ["cold store", "refrigerated warehousing", "cold chain storage"]),
    ("fresh-produce-export", "Perishable export handling", None, "cold-chain",
     "Dockside handling, pre-cooling and export preparation of perishables.", ["fruit handling", "export cold chain"]),
    ("refrigerated-transport", "Temperature-controlled distribution", None, "refrigerated-distribution",
     "Multi-temperature transport and cold chain distribution.", ["cold chain logistics", "reefer transport"]),
    # food
    ("food-manufacturing", "Food manufacturing", None, "food-manufacturing",
     "Branded and private-label food manufacturing.", ["food processing", "FMCG manufacturing"]),
    ("edible-oils-fats", "Edible oils and fats", None, "food-manufacturing",
     "Oil refining, extraction and edible fat production.", ["oil refinery", "oilseed processing"]),
    ("poultry-production", "Poultry and protein production", None, "food-manufacturing",
     "Integrated poultry, egg and protein production with abattoir operations.", ["broiler production", "egg production"]),
    # fisheries
    ("seafood-processing", "Seafood processing", None, "fisheries",
     "Wet fish processing, freezing and value-added seafood production.", ["fish processing", "hake processing"]),
    ("fishing-operations", "Fishing fleet operations", None, "fisheries",
     "Owned or chartered fishing fleet operations.", ["trawling"]),
    # milling & feed
    ("animal-feed-manufacturing", "Animal feed manufacturing", None, "milling-feed",
     "Compound feed manufacturing and feed formulation.", ["feed milling", "stockfeed"]),
    ("flour-milling", "Flour milling", None, "milling-feed",
     "Wheat and maize milling.", ["maize milling", "grain milling"]),
    ("oilseed-crushing", "Oilseed crushing", None, "milling-feed",
     "Oilseed crushing and oil extraction.", ["soya crushing", "canola processing"]),
    # agri commodities
    ("grain-trading", "Grain and commodity trading", None, "agri-commodities",
     "Buying, marketing and trading of grain and agricultural commodities.", ["commodity marketing", "grain marketing"]),
    ("agri-cooperative", "Agricultural co-operative", None, "agri-commodities",
     "Farmer-owned co-operative grain marketing, storage and input supply.", ["co-op", "landbou"]),
    ("grain-storage-handling", "Grain storage and handling", None, "agri-commodities",
     "Silo storage, weighing, grading, drying and cleaning of grain.", ["silo services", "grain handling"]),
    # transport
    ("contract-logistics", "Contract logistics", None, "transport-logistics",
     "Warehousing and distribution operated under contract for clients.", ["3PL", "warehousing and distribution"]),
    ("road-freight", "Road freight", None, "transport-logistics",
     "Bulk and line-haul road transport.", ["transport operator", "haulage"]),
    ("freight-forwarding", "Freight forwarding", None, "transport-logistics",
     "Clearing, forwarding and cross-border project logistics.", ["clearing agent", "customs clearing"]),
    # fmcg distribution & retail
    ("foodservice-distribution", "Foodservice distribution", None, "fmcg-distribution",
     "Broadline distribution of frozen, chilled and ambient product to foodservice customers.", ["broadline distribution", "food wholesale"]),
    ("grocery-retail", "Grocery retail", None, "fmcg-distribution",
     "Supermarket and grocery retail operations with own distribution.", ["food retail", "supermarket"]),
    ("fmcg-wholesale", "Cash and carry wholesale", None, "fmcg-distribution",
     "Cash and carry and wholesale distribution to independent retailers.", ["cash and carry", "wholesale distribution"]),
    # property
    ("property-development", "Property development", None, "property-development",
     "Development of commercial, residential and mixed-use property.", ["developer", "property developer"]),
    ("residential-development", "Residential development", None, "property-development",
     "Housing estate and residential-for-rental development.", ["housing development", "residential fund"]),
    ("retail-property", "Retail property", None, "property-development",
     "Convenience and neighbourhood retail property development and management.", ["retail centre development"]),
    ("property-investment", "Property investment", None, "property-investment",
     "Property holding, funds and REIT structures.", ["REIT", "property fund"]),
    ("logistics-property", "Logistics and industrial property", None, "property-investment",
     "Development and letting of logistics and industrial property.", ["industrial property"]),
    ("self-storage", "Self-storage property", None, "property-investment",
     "Self-storage facility development and operation.", ["storage units"]),
    # construction
    ("construction-contracting", "Construction contracting", None, "construction",
     "Building and civils construction contracting.", ["civil engineering", "building contractor"]),
    ("infrastructure-development", "Infrastructure development", None, "construction",
     "Roads, water, public infrastructure and construction materials.", ["roads and earthworks", "construction materials"]),
    # renewables
    ("renewable-development", "Renewable energy project development", None, "renewable-energy",
     "Development, financing and construction management of renewable energy projects.", ["IPP development", "REIPPPP"]),
    ("independent-power-production", "Independent power production", None, "renewable-energy",
     "Ownership and operation of generating assets.", ["IPP", "power producer"]),
]

# ---------------------------------------------------------------------------
# Capability taxonomy
# ---------------------------------------------------------------------------

CAPABILITIES = [
    # operating
    ("cold-storage-operations", "Cold storage operations", "operating", None,
     "Refrigerated and frozen warehouse operations for third-party stock.", ["cold store", "refrigerated warehousing"]),
    ("multi-temperature-warehousing", "Multi-temperature warehousing", "operating", "cold-storage-operations",
     "Segregated temperature zones from deep frozen to chilled.", ["multi-temp", "chilled and frozen zones"]),
    ("blast-freezing", "Blast freezing", "operating", "cold-storage-operations",
     "Rapid product freezing as a service.", ["quick freezing"]),
    ("bonded-warehousing", "Bonded warehousing", "operating", "cold-storage-operations",
     "Customs-bonded storage and import handling.", ["bonded store"]),
    ("warehouse-operations", "Warehouse operations", "operating", None,
     "Receiving, storage, picking and dispatch at scale.", ["DC operations", "pallet picking"]),
    ("inventory-management", "Inventory management", "operating", "warehouse-operations",
     "Stock control, cycle counting and stock integrity across sites.", ["stock control"]),
    ("distribution-network", "Distribution network operation", "operating", None,
     "Operating a multi-site distribution network to customers or stores.", ["distribution centres", "network distribution"]),
    ("temperature-controlled-distribution", "Temperature-controlled distribution", "operating", "distribution-network",
     "Refrigerated transport and cold chain delivery.", ["reefer distribution", "cold chain distribution"]),
    ("port-dockside-operations", "Port and dockside operations", "operating", None,
     "Dockside handling, container staging, vessel loading and state vet facilitation.", ["port operations", "container handling"]),
    ("food-safety-compliance", "Food safety and quality compliance", "operating", None,
     "Food safety, hygiene and export certification regimes.", ["HACCP", "BRC", "PPECB"]),
    ("production-manufacturing", "Production manufacturing", "operating", None,
     "Factory-based manufacturing with production scheduling and yield management.", ["plant operations", "manufacturing"]),
    ("feed-milling", "Feed milling", "operating", "production-manufacturing",
     "Compound feed milling and formulation.", ["feed plant"]),
    ("flour-milling-ops", "Flour milling operations", "operating", "production-manufacturing",
     "Wheat or maize milling operations.", ["mill operations"]),
    ("oilseed-crushing-ops", "Oilseed crushing operations", "operating", "production-manufacturing",
     "Oilseed crushing, extraction and refining.", ["oil extraction"]),
    ("grain-handling-storage", "Grain handling and storage", "operating", None,
     "Weighing, grading, drying, cleaning and silo storage of grain.", ["silo operations"]),
    ("fleet-operations", "Fleet operations", "operating", None,
     "Owned or contracted vehicle fleet management.", ["transport fleet"]),
    ("agricultural-logistics", "Agricultural logistics", "operating", "fleet-operations",
     "Bulk agricultural commodity transport and farm-gate collection.", ["grain transport"]),
    ("poultry-livestock-operations", "Poultry and livestock operations", "operating", None,
     "Breeder, broiler, abattoir and further processing operations.", ["abattoir", "broiler production"]),
    ("fishing-fleet", "Fishing fleet operations", "operating", None,
     "Owned trawler or vessel fleet operations.", ["trawler fleet"]),
    ("project-development", "Project development", "operating", None,
     "Origination, permitting and development of capital projects.", ["development pipeline"]),
    ("construction-project-costing", "Construction project costing", "operating", None,
     "Project-based costing across concurrent construction contracts.", ["project costing", "contract costing"]),
    ("multi-project-management", "Multi-project management", "operating", None,
     "Managing a portfolio of concurrent projects with separate profitability.", ["project portfolio"]),
    ("capital-project-management", "Capital project management", "operating", None,
     "Managing capital expenditure programmes and contractor structures.", ["capex programme"]),
    ("property-holding-structures", "Property holding structures", "operating", None,
     "SPV and holding structures for property assets and funds.", ["SPV structures", "property vehicles"]),
    ("multi-site-operations", "Multi-site operations", "operating", None,
     "Operating multiple sites or stores under one management structure.", ["branch network"]),
    ("regulatory-reporting", "Regulatory reporting", "operating", None,
     "Sector-specific regulatory reporting obligations.", ["compliance reporting"]),
    # commercial
    ("commodity-trading", "Commodity trading", "commercial", None,
     "Buying and selling physical agricultural or other commodities for own account or on behalf of clients.", ["commodity marketing", "trading desk"]),
    ("commodity-contracts", "Commodity purchase and sales contracts", "commercial", "commodity-trading",
     "Forward and physical purchase and sales contract management.", ["forward contracts"]),
    ("commodity-price-risk", "Commodity price risk management", "commercial", "commodity-trading",
     "Price risk management on commodity positions, including Safex participation.", ["hedging", "Safex", "price risk"]),
    ("contract-management", "Contract management", "commercial", None,
     "Managing customer and supplier contract terms and renewals.", ["contracts"]),
    ("supplier-management", "Supplier and procurement management", "commercial", None,
     "Procurement, supplier terms and inbound supply management.", ["procurement"]),
    ("customer-credit", "Customer credit management", "commercial", None,
     "Customer credit granting, control and collections.", ["credit control", "debtor management"]),
    ("export-trading", "Export trading", "commercial", None,
     "Export documentation, terms and international customer management.", ["exports"]),
    ("retail-trading", "Retail trading", "commercial", None,
     "Retail margin, promotions and store-level trading management.", ["retail margin"]),
    ("franchise-network", "Franchise network management", "commercial", None,
     "Franchise or dealer network commercial management.", ["franchisee management"]),
    # financial
    ("cost-accounting", "Cost accounting", "financial", None,
     "Standard costing, variances and operational cost accounting.", ["costing", "variance analysis"]),
    ("inventory-accounting", "Inventory accounting", "financial", None,
     "Stock valuation, write-downs, provisions and stock accounting controls.", ["stock valuation"]),
    ("project-accounting", "Project accounting", "financial", None,
     "Accounting for projects with work-in-progress, retention and stage recognition.", ["WIP accounting"]),
    ("development-cost-accounting", "Development cost accounting", "financial", "project-accounting",
     "Development cost capitalisation, borrowing costs and pipeline reporting.", ["development costs", "capitalisation"]),
    ("working-capital-management", "Working capital management", "financial", None,
     "Managing receivables, payables and inventory as working capital.", ["cash conversion"]),
    ("multi-entity-consolidation", "Multi-entity consolidation", "financial", None,
     "Consolidating multiple legal entities, SPVs or funds.", ["group consolidation", "multi-entity reporting"]),
    ("multi-site-finance", "Multi-site finance management", "financial", None,
     "Finance control across multiple operating sites or stores.", ["branch finance"]),
    ("operational-management-reporting", "Operational management reporting", "financial", None,
     "High-volume operational transaction processing and management reporting.", ["management accounts"]),
    ("capital-expenditure", "Capital expenditure management", "financial", None,
     "Capex budgeting, authorisation and post-implementation review.", ["capex"]),
    ("project-finance", "Project finance", "financial", None,
     "Non-recourse or limited-recourse project financing and lender reporting.", ["project funding", "PPA finance"]),
    ("foreign-currency-transactions", "Foreign currency transactions", "financial", None,
     "Import/export currency exposure and translation.", ["forex", "currency exposure"]),
    ("hedging-derivative-accounting", "Hedging and derivative accounting", "financial", None,
     "Hedge accounting and derivative valuation.", ["hedge accounting"]),
    ("tax-compliance", "Tax compliance", "financial", None,
     "Corporate tax compliance and submissions.", ["SARS compliance"]),
    ("statutory-audit", "Statutory audit and external reporting", "financial", None,
     "Statutory financial statements and external audit.", ["IFRS reporting"]),
    ("group-consolidation", "Group consolidation", "financial", "multi-entity-consolidation",
     "Listed-group consolidation and reporting.", ["listed reporting"]),
    # technology
    ("erp-sap", "SAP ERP", "technology", None,
     "SAP ERP in production use.", ["SAP", "S/4HANA"]),
    ("erp-other", "Non-SAP ERP", "technology", None,
     "A non-SAP ERP in production use.", ["Syspro", "Sage", "Microsoft Dynamics"]),
    ("wms", "Warehouse management system", "technology", None,
     "A warehouse management system in production use.", ["WMS"]),
    ("tms", "Transport management system", "technology", None,
     "A transport management system in production use.", ["fleet system"]),
    ("trading-platform", "Commodity trading platform", "technology", None,
     "A commodity trading or risk system in production use.", ["CTRM", "trading system"]),
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def src(url, kind, evidence, confidence="confirmed"):
    return {"url": url, "type": kind, "evidence": evidence, "checkedOn": CHECKED,
            "reviewer": "", "confidence": confidence}


def ind(code, primary=True, confidence="confirmed", evidence="", url=""):
    return {"industryId": code, "primary": primary, "confidence": confidence,
            "evidence": evidence, "sourceUrl": url, "checkedOn": CHECKED}


def cap(code, status="observed", confidence="confirmed", evidence="", url="", unit=""):
    link = {"capabilityId": code, "status": status, "confidence": confidence,
            "evidence": evidence, "sourceUrl": url, "checkedOn": CHECKED}
    if unit:
        link["businessUnit"] = unit
    return link


def loc(city, province, url=""):
    return {"city": city, "province": province, "sourceUrl": url, "checkedOn": CHECKED}


def scale(metric, value, basis, as_of, url):
    return {"metric": metric, "value": value, "basis": basis, "asOf": as_of,
            "sourceUrl": url, "checkedOn": CHECKED}


ORGS = []


def org(org_id, name, industries, capabilities, sources, *, legal="", aliases=(),
        website="", status="verified", locations=(), scales=(), parent=None,
        datasets=("organizations",), notes=""):
    ORGS.append({
        "id": org_id,
        "name": name,
        "legalName": legal,
        "aliases": list(aliases),
        "website": website,
        "status": status,
        "industries": industries,
        "capabilities": capabilities,
        "locations": list(locations),
        "scale": list(scales),
        "parentId": parent,
        "sources": sources,
        "datasets": list(datasets),
        "lastVerified": CHECKED,
        "notes": notes,
    })


# --- Cold chain -------------------------------------------------------------

PITCHBOOK_CCH = "https://pitchbook.com/profiles/company/510085-63"
COLDSA = "https://coldchainsa.com/mapping-south-africas-cold-storage-gap-a-provincial-assessment/"

org("org-commercial-cold-holdings", "Commercial Cold Holdings",
    [ind("cold-storage-operations", evidence="Group of commercial cold-storage operators assembled through acquisitions of CCS Logistics, Sequence Logistics, iDube Cold Storage and Port Elizabeth Cold Storage.", url=PITCHBOOK_CCH)],
    [cap("cold-storage-operations", evidence="Platform exceeding 160,000 pallet positions assembled through cold-store acquisitions.", url=COLDSA),
     cap("multi-site-operations", evidence="Group operates cold stores in Gauteng, Western Cape, KwaZulu-Natal and Eastern Cape.", url=COLDSA),
     cap("multi-entity-consolidation", evidence="Group holding company consolidating acquired cold-store subsidiaries.", url=PITCHBOOK_CCH)],
    [src(PITCHBOOK_CCH, "business-directory", "Company profile: private, PE-backed, HQ Cape Town, ~820 total employees, three listed subsidiary acquisitions.", "probable"),
     src(COLDSA, "industry-report", "Facility-by-facility provincial assessment naming CCH facilities and pallet capacity.", "probable")],
    legal="Commercial Cold Holdings (Pty) Ltd", aliases=["CCH", "Commercial Cold Holdings Group"],
    website="https://www.cchcold.com",
    locations=[loc("Cape Town", "Western Cape", PITCHBOOK_CCH)],
    scales=[scale("employees", "820 total employees", "third-party-estimate", "2026", PITCHBOOK_CCH)],
    notes="Parent group for the CCS Logistics / Sequence / iDube / PECS cold-store platform.")

CCS = "https://www.ccslogistics.co.za/home"
DNB_CCS = "https://www.dnb.com/business-directory/company-profiles/commercial-cold-storage-(pty)-ltd.c5c0e44670286f83fd64333e16a82267"
org("org-ccs-logistics", "CCS Logistics",
    [ind("cold-storage-operations", evidence="Describes itself as South Africa's leading commercial cold storage and logistics operator with certified dockside facilities.", url=CCS),
     ind("fresh-produce-export", evidence="Services include fruit handling, container staging and vessel loading.", url=CCS),
     ind("contract-logistics", primary=False, evidence="Lists pallet picking, palletisation and container transport alongside storage.", url=CCS)],
    [cap("cold-storage-operations", evidence="Cold storage is the core listed service.", url=CCS),
     cap("blast-freezing", evidence="Blast freezing is a listed service.", url=CCS),
     cap("bonded-warehousing", evidence="Bonded warehousing is a listed service.", url=CCS),
     cap("port-dockside-operations", evidence="Vessel loading, container staging, state vet facilitation and dockside facilities at Duncan Dock.", url=CCS),
     cap("inventory-management", evidence="Pallet picking and palletisation of client stock across sites.", url=CCS),
     cap("warehouse-operations", evidence="Operational hubs at Paarden Eiland, Epping, Duncan Dock and Midrand.", url=CCS),
     cap("multi-site-operations", evidence="Four South African sites plus Walvis Bay.", url=CCS),
     cap("food-safety-compliance", evidence="Certified dockside facilities and state vet facilitation for perishable exports.", url=CCS),
     cap("foreign-currency-transactions", status="unknown", evidence="Export handling suggests exposure but the source does not state currency arrangements.", url=""),
     cap("wms", status="unknown", evidence="No source read states which warehouse system is in production.", url="")],
    [src(CCS, "company-website", "Service list (cold storage, blast freezing, bonded warehousing, pallet picking, fruit handling, vessel loading) and site list."),
     src(DNB_CCS, "business-directory", "Registered as Commercial Cold Storage (Pty) Ltd, 25 Vrystaat Street, Paarden Eiland, Cape Town; warehousing and storage industry.", "probable"),
     src(COLDSA, "industry-report", "CCS Logistics Johannesburg and Cape Town identified as CCH/AIIM bulk storage operations.", "probable")],
    legal="Commercial Cold Storage (Pty) Ltd", aliases=["Commercial Cold Storage", "CCS"],
    website=CCS, parent="org-commercial-cold-holdings",
    locations=[loc("Cape Town", "Western Cape", DNB_CCS), loc("Midrand", "Gauteng", CCS)],
    scales=[scale("sites", "4 South African sites (Paarden Eiland, Epping, Duncan Dock, Midrand)", "source-reported", "2026", CCS)],
    notes="Scenario A focal company: commercial cold-storage operator recruiting a Financial Manager.")

org("org-sequence-logistics", "Sequence Logistics",
    [ind("cold-storage-operations", evidence="Cold-store platform member providing secondary distribution and load consolidation.", url=COLDSA),
     ind("contract-logistics", primary=False, evidence="Distribution hub operations at Aeroton, Stikland and Hammersdale.", url=COLDSA)],
    [cap("cold-storage-operations", evidence="Operates cold storage as part of the CCH platform.", url=COLDSA),
     cap("warehouse-operations", evidence="Distribution and load consolidation at Aeroton (Gauteng) and Stikland (Western Cape).", url=COLDSA),
     cap("multi-site-operations", evidence="Sites in Gauteng, Western Cape and KwaZulu-Natal (Hammersdale).", url=COLDSA)],
    [src(PITCHBOOK_CCH, "business-directory", "Listed as a Commercial Cold Holdings subsidiary (buyout/LBO 2023-08-08), Johannesburg, founded 2009.", "probable"),
     src(COLDSA, "industry-report", "Sequence Logistics Aeroton, Stikland and Hammersdale described as distribution and consolidation operations.", "probable")],
    parent="org-commercial-cold-holdings", aliases=["Sequence"],
    locations=[loc("Johannesburg", "Gauteng", PITCHBOOK_CCH)],
    notes="Acquired into the CCH platform in 2023.")

org("org-idube-cold-storage", "iDube Cold Storage",
    [ind("cold-storage-operations", evidence="Cold storage facility at Dube Trade Port, King Shaka International Airport.", url="https://coldchainsa.com/directory/transport/idube-cold-storage-cch/")],
    [cap("cold-storage-operations", evidence="Airfreight-adjacent cold storage with North Coast route access and Durban Port connections.", url="https://coldchainsa.com/directory/transport/idube-cold-storage-cch/"),
     cap("multi-temperature-warehousing", evidence="Directory records multi-temperature capability.", url="https://coldchainsa.com/directory/transport/idube-cold-storage-cch/"),
     cap("inventory-management", evidence="Regional cold chain distribution handling for KwaZulu-Natal.", url="https://coldchainsa.com/directory/transport/idube-cold-storage-cch/")],
    [src("https://coldchainsa.com/directory/transport/idube-cold-storage-cch/", "industry-directory", "Directory entry: website, multi-temperature capability, KwaZulu-Natal coverage.", "probable"),
     src(PITCHBOOK_CCH, "business-directory", "Listed as a Commercial Cold Holdings subsidiary (buyout/LBO 2024-08-26), Durban, founded 2014.", "probable")],
    aliases=["iDube"], website="https://www.idubecoldstorage.co.za/",
    parent="org-commercial-cold-holdings",
    locations=[loc("Durban", "KwaZulu-Natal", "https://coldchainsa.com/directory/transport/idube-cold-storage-cch/")],
    scales=[scale("pallet-positions", "9,000 pallets", "third-party-estimate", "2026", COLDSA)])

org("org-pecs", "Port Elizabeth Cold Storage",
    [ind("cold-storage-operations", evidence="Cold storage at Coega SEZ serving citrus exports.", url=COLDSA),
     ind("fresh-produce-export", primary=False, evidence="Citrus export focus.", url=COLDSA)],
    [cap("cold-storage-operations", evidence="15,000 pallet citrus export facility at Coega.", url=COLDSA),
     cap("food-safety-compliance", evidence="Export-oriented perishable facility.", url=COLDSA)],
    [src(COLDSA, "industry-report", "PECS Coega SEZ described as 15,000 pallets, citrus export, 70% CCH/AIIM.", "probable"),
     src(PITCHBOOK_CCH, "business-directory", "Listed as a Commercial Cold Holdings investment (buyout/LBO 2025-11-08).", "probable")],
    aliases=["PECS"], parent="org-commercial-cold-holdings", status="needs-verification",
    locations=[loc("Gqeberha", "Eastern Cape", COLDSA)],
    scales=[scale("pallet-positions", "15,000 pallets", "third-party-estimate", "2026", COLDSA)],
    notes="Website not established from the sources read.")

org("org-table-bay-cold-storage", "Table Bay Cold Storage",
    [ind("cold-storage-operations", evidence="Provider of cold storage, shipping and logistics services in Cape Town for over 80 years.", url="https://www.tbcs.co.za"),
     ind("freight-forwarding", primary=False, evidence="Integrated services include freight forwarding and dry cargo handling.", url="https://www.zoominfo.com/c/table-bay-cold-storage/447006805")],
    [cap("cold-storage-operations", evidence="Temperature-controlled storage and handling for frozen and chilled products, particularly for the EU market.", url="https://www.zoominfo.com/c/table-bay-cold-storage/447006805"),
     cap("bonded-warehousing", status="unknown", evidence="Import/export focus suggests bonded capability but no source read confirms it.", url=""),
     cap("export-trading", evidence="Import/export focus with EU market orientation.", url="https://www.zoominfo.com/c/table-bay-cold-storage/447006805"),
     cap("foreign-currency-transactions", status="unknown", evidence="EU-market activity implies currency exposure; not stated in sources read.", url="")],
    [src("https://www.zoominfo.com/c/table-bay-cold-storage/447006805", "business-directory", "Website, 6 Auckland Street Cape Town HQ, service description, 80+ years.", "probable"),
     src("https://www.courierslist.com/detail/south-africa/cape-town/warehousing-companies/1272054/table-bay-cold-storage-pty-ltd", "industry-directory", "Registered address 6 Auckland Street, Paarden Eiland, Cape Town.", "probable")],
    aliases=["TBCS"], website="https://www.tbcs.co.za",
    locations=[loc("Cape Town", "Western Cape", "https://www.courierslist.com/detail/south-africa/cape-town/warehousing-companies/1272054/table-bay-cold-storage-pty-ltd")])

CHILL = "https://coldchainsa.com/directory/transport/chilleweni-cold-storage/"
org("org-chilleweni", "Chilleweni Cold Storage Solutions",
    [ind("cold-storage-operations", evidence="Multi-temperature cold storage facility serving commercial and industrial customers.", url=CHILL)],
    [cap("cold-storage-operations", evidence="Commercial and industrial cold storage.", url=CHILL),
     cap("multi-temperature-warehousing", evidence="Segregated temperature zones from deep frozen to chilled.", url=CHILL),
     cap("inventory-management", evidence="Storage solutions for food manufacturers, distributors and retailers.", url=CHILL)],
    [src(CHILL, "industry-directory", "Directory entry: website chilleweni.com, multi-temperature zones, Gauteng.", "probable")],
    website="https://www.chilleweni.com/",
    locations=[loc("Johannesburg", "Gauteng", CHILL)],
    notes="Family-run operator identified as one of the few facilities offering short-term flexible storage to smaller operators.")

org("org-etlin-international", "Etlin International",
    [ind("cold-storage-operations", evidence="Listed among cold-storage providers serving Durban (eThekwini) and the Eastern Cape.", url=CHILL)],
    [cap("cold-storage-operations", evidence="Cold storage operator named in the South African cold chain market overview.", url="https://www.kenresearch.com/industry-reports/south-africa-cold-chain-market"),
     cap("multi-temperature-warehousing", status="unknown", evidence="Temperature range not stated in the sources read.", url="")],
    [src("https://www.kenresearch.com/industry-reports/south-africa-cold-chain-market", "industry-report", "Named as one of the major companies operating in the South African cold chain market.", "probable"),
     src(CHILL, "industry-directory", "Appears in the South African cold storage directory listing for Durban and Eastern Cape.", "probable")],
    status="needs-verification",
    locations=[loc("Durban", "KwaZulu-Natal", CHILL)],
    notes="Website, legal identity and scale not established from the sources read.")

org("org-eThekwini-cold-stores", "eThekwini Cold Stores",
    [ind("cold-storage-operations", evidence="Described as a premium cold store with cutting-edge technology and facilities in Durban.", url="https://www.yellowpages.net.za/places/cold-storage-facility")],
    [cap("cold-storage-operations", evidence="Cold store operations in Durban.", url="https://www.yellowpages.net.za/places/cold-storage-facility")],
    [src("https://www.yellowpages.net.za/places/cold-storage-facility", "industry-directory", "Directory listing for cold storage facilities in South Africa.", "probable"),
     src("https://rentechdigital.com/smartscraper/business-report-details/list-of-cold-storage-facilities-in-south-africa", "industry-directory", "Listed as a Durban cold storage facility.", "probable")],
    aliases=["Ethekwini Cold Stores"], status="needs-verification",
    locations=[loc("Durban", "KwaZulu-Natal", "https://www.yellowpages.net.za/places/cold-storage-facility")],
    notes="Independent facility; no group relationship evidenced.")

org("org-reefer-cold-storage", "Reefer Cold Storage",
    [ind("cold-storage-operations", evidence="Handling and storage of frozen and chilled products since 1993.", url="https://www.yellowpages.net.za/places/cold-storage-facility")],
    [cap("cold-storage-operations", evidence="11,000 pallet facility in Durban.", url=COLDSA),
     cap("bonded-warehousing", evidence="Directory records bonded warehouse capability.", url=COLDSA)],
    [src("https://www.yellowpages.net.za/places/cold-storage-facility", "industry-directory", "Family-run business operating since 1993 dealing only in handling and storage of frozen and chilled products.", "probable"),
     src(COLDSA, "industry-report", "Reefer Cold Storage, Durban: 11,000 pallets with bonded warehouse capability.", "probable")],
    aliases=["Reefer Storage (Pty) Ltd"], status="needs-verification",
    locations=[loc("Durban", "KwaZulu-Natal", COLDSA)],
    scales=[scale("pallet-positions", "11,000 pallets", "third-party-estimate", "2026", COLDSA)])

# --- Refrigerated distribution / logistics ----------------------------------

VECTOR = "https://www.vectorlog.com/"
org("org-vector-logistics", "Vector Logistics",
    [ind("refrigerated-transport", evidence="Delivers cold chain solutions and supply chain services across Southern Africa.", url=VECTOR),
     ind("contract-logistics", primary=False, evidence="Multi-temperature distribution centres and bulk storage sites.", url=VECTOR),
     ind("foodservice-distribution", primary=False, confidence="probable", evidence="Positions itself as driving food solutions with daily case delivery volumes.", url=VECTOR)],
    [cap("temperature-controlled-distribution", evidence="Cold chain solutions across Southern Africa with multi-temperature distribution centres.", url=VECTOR),
     cap("multi-temperature-warehousing", evidence="114,000 pallet positions plus over 12,700 across export sites and joint ventures.", url=VECTOR),
     cap("cold-storage-operations", evidence="Three bulk storage sites at Midrand, Roodepoort and Dartprops.", url=VECTOR),
     cap("warehouse-operations", evidence="27 distribution centres and 5,600 drop points.", url=VECTOR),
     cap("distribution-network", evidence="5,600 drop points and 311,000 cases delivered daily.", url=VECTOR),
     cap("fleet-operations", evidence="440 vehicles.", url=VECTOR),
     cap("inventory-management", evidence="Bulk storage and distribution-centre stock handling.", url=VECTOR),
     cap("multi-site-operations", evidence="Operations across South Africa and Namibia with shareholdings in Botswana and Zambia.", url=VECTOR),
     cap("cost-accounting", status="unknown", evidence="Not stated in the sources read.", url=""),
     cap("wms", status="unknown", evidence="System estate not stated in the sources read.", url="")],
    [src(VECTOR, "company-website", "Company facts: 3 bulk storage sites, 27 DCs, 440 vehicles, 5,300 employees, 5,600 drop points, 114,000 pallet positions, 311,000 cases daily, 990,000 tonnes annually; HQ Westville, Durban.")],
    website=VECTOR,
    locations=[loc("Durban", "KwaZulu-Natal", VECTOR), loc("Midrand", "Gauteng", VECTOR)],
    scales=[scale("employees", "5,300 employees", "source-reported", "2026", VECTOR),
            scale("pallet-positions", "114,000 pallet positions (over 12,700 across export sites/JVs)", "source-reported", "2026", VECTOR)])

org("org-imperial-logistics", "Imperial Logistics",
    [ind("contract-logistics", evidence="Leading logistics supplier in South Africa providing contract logistics, road freight and lead logistics provider solutions.", url="https://www.imperiallogistics.com/this-is-us.php"),
     ind("road-freight", primary=False, evidence="Road freight is a listed core service.", url="https://www.imperiallogistics.com/this-is-us.php"),
     ind("freight-forwarding", primary=False, evidence="Market access solutions connecting Africa and global markets.", url="https://www.imperiallogistics.com/this-is-us.php")],
    [cap("warehouse-operations", evidence="Warehousing in all major South African centres, over 48,000 m2 under roof in Cape Town and Pretoria alone.", url=COLDSA),
     cap("cold-storage-operations", evidence="Warehousing includes cold storage capacity, particularly serving healthcare logistics.", url=COLDSA),
     cap("distribution-network", evidence="Significant African footprint with contract logistics and road freight networks.", url="https://www.imperiallogistics.com/this-is-us.php"),
     cap("fleet-operations", evidence="Road freight operations across African markets.", url="https://www.imperiallogistics.com/this-is-us.php"),
     cap("multi-entity-consolidation", evidence="Wholly owned business of DP World since March 2022 within a wider group.", url="https://www.imperiallogistics.com/this-is-us.php"),
     cap("commodity-trading", status="unknown", evidence="Commodities is a focus industry for logistics services, but no source read states own-account commodity trading.", url="")],
    [src("https://www.imperiallogistics.com/this-is-us.php", "company-website", "African-focused integrated market access and logistics provider; focus industries healthcare, consumer, automotive, chemicals, industrial and commodities; 25,000 people; DP World ownership since March 2022."),
     src(COLDSA, "industry-report", "Warehousing footprint and cold storage capacity in South African centres.", "probable")],
    aliases=["Imperial", "Imperial, a DP World Company"], website="https://www.imperiallogistics.com",
    locations=[loc("Johannesburg", "Gauteng", "https://www.imperiallogistics.com/")],
    scales=[scale("employees", "25,000 people", "source-reported", "2026", "https://www.imperiallogistics.com/this-is-us.php")],
    notes="Wholly owned by DP World since March 2022.")

org("org-cargo-carriers", "Cargo Carriers",
    [ind("road-freight", evidence="Southern African provider of integrated supply chain and transport logistics solutions.", url="https://www.cargocarriers.co.za/"),
     ind("contract-logistics", primary=False, evidence="Supply chain management consulting and implementation services.", url="https://www.cargocarriers.co.za/")],
    [cap("fleet-operations", evidence="One of Southern Africa's biggest transporters with extensive infrastructure.", url="https://www.cargocarriers.co.za/"),
     cap("distribution-network", evidence="Infrastructure throughout Southern Africa.", url="https://www.cargocarriers.co.za/"),
     cap("cost-accounting", status="unknown", evidence="Not stated in the sources read.", url=""),
     cap("inventory-management", status="unknown", evidence="Bulk transport focus; warehousing not evidenced.", url="")],
    [src("https://www.cargocarriers.co.za/", "company-website", "Specialist transport to fuel, steel, chemicals, gas, powders, mining and sugar industries; established 1956; logistics IT systems and route optimisation.")],
    website="https://www.cargocarriers.co.za/",
    locations=[loc("Durban", "KwaZulu-Natal", "https://www.cargocarriers.co.za/")],
    notes="Head office location inferred from company history page; not independently confirmed.")

org("org-hestony-transport", "Hestony Transport",
    [ind("refrigerated-transport", evidence="One of South Africa's largest refrigerated transport operators.", url=COLDSA)],
    [cap("temperature-controlled-distribution", evidence="Refrigerated transport fleet exceeding 1,000 vehicles.", url=COLDSA),
     cap("fleet-operations", evidence="Fleet exceeding 1,000 vehicles over 30+ years of operation.", url=COLDSA),
     cap("agricultural-logistics", status="unknown", evidence="Refrigerated transport suggests perishable freight; commodity scope not stated.", url="")],
    [src(COLDSA, "industry-report", "Head office in Bloemfontein, fleet exceeding 1,000 vehicles, 30+ years of operation.", "probable")],
    status="needs-verification",
    locations=[loc("Bloemfontein", "Free State", COLDSA)],
    scales=[scale("sites", "Fleet exceeding 1,000 vehicles", "third-party-estimate", "2026", COLDSA)],
    notes="Website and legal identity not established from the sources read.")

org("org-unitrans", "Unitrans Supply Chain Solutions",
    [ind("road-freight", evidence="Logistics and supply chain company serving agricultural, petroleum, mining and consumer goods industries.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/"),
     ind("contract-logistics", primary=False, evidence="Customised logistics solutions under long-term customer partnerships.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/")],
    [cap("fleet-operations", evidence="Fleet of specialised vehicles handling fuel, livestock, grain, chemicals and refrigerated cargo.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/"),
     cap("agricultural-logistics", evidence="Agriculture is a named served industry including grain and livestock transport.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/"),
     cap("temperature-controlled-distribution", evidence="Refrigerated cargo handling.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/"),
     cap("commodity-trading", status="unknown", evidence="Transports commodities; own-account trading not evidenced.", url="")],
    [src("https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/", "industry-directory", "Decades of experience supporting agricultural, petroleum, mining and consumer goods industries with specialised fleets.", "probable"),
     src("https://www.zoominfo.com/c/unitrans-supply-chain-solutions-pty-ltd/372856758", "business-directory", "Head office Edenvale, Gauteng; website upslogistics.co.za.", "probable")],
    website="https://upslogistics.co.za",
    locations=[loc("Edenvale", "Gauteng", "https://www.dnb.com/business-directory/company-profiles.unitrans_supply_chain_solutions_(pty)_ltd.7cb8942922a7dc1c2c459c528db1e1c3.html")],
    notes="Two websites appear across sources (upslogistics.co.za and unitransafrica.com); treated as needing verification.")

org("org-value-logistics", "Value Logistics",
    [ind("contract-logistics", evidence="Integrated logistics solutions for FMCG, retail, healthcare and industrial sectors.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/")],
    [cap("warehouse-operations", evidence="Warehouse optimisation is a named focus area.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/"),
     cap("inventory-management", evidence="Inventory management is a named focus area.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/"),
     cap("distribution-network", evidence="Transport planning and last-mile delivery across supply chains.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/")],
    [src("https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/", "industry-directory", "Reputation for integrated logistics across FMCG, retail, healthcare and industrial sectors.", "probable")],
    status="needs-verification",
    notes="Website, locations and scale not established from the sources read.")

org("org-super-group", "Super Group",
    [ind("contract-logistics", evidence="Fleet management, dedicated transport, warehousing, contract logistics and vehicle leasing.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/")],
    [cap("warehouse-operations", evidence="Warehousing and contract logistics operations.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/"),
     cap("fleet-operations", evidence="Fleet management and dedicated transport at national scale.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/"),
     cap("multi-site-operations", evidence="Nationwide infrastructure with distribution across South Africa and neighbouring countries.", url="https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/")],
    [src("https://theafricalogistics.com/logistics/list-of-leading-logistics-companies-in-south-africa/", "industry-directory", "Diversified Southern African logistics business serving mining, petrochemicals, retail, FMCG, agriculture and manufacturing.", "probable")],
    aliases=["Super Group Supply Chain"], status="needs-verification",
    notes="Website, head office and scale not established from the sources read.")

org("org-grindrod", "Grindrod",
    [ind("freight-forwarding", evidence="Licensed clearing agents with offices on all major Southern African transit corridors.", url="https://za.linkedin.com/company/sturrockgrindrod"),
     ind("road-freight", primary=False, evidence="Transport and logistics solutions from single shipments to fully integrated services.", url="https://za.linkedin.com/company/sturrockgrindrod")],
    [cap("fleet-operations", status="unknown", evidence="Fleet scale not stated in the sources read.", url=""),
     cap("distribution-network", evidence="Offices on all major transit corridors in Southern Africa.", url="https://za.linkedin.com/company/sturrockgrindrod"),
     cap("export-trading", status="unknown", evidence="Cross-border project logistics evidenced; trading activity not stated.", url=""),
     cap("capital-project-management", evidence="Project cargo and cross-border project shipments managed end to end.", url="https://za.linkedin.com/company/sturrockgrindrod")],
    [src("https://za.linkedin.com/company/sturrockgrindrod", "industry-directory", "Company page: website grindrod.com, HQ Durban, 201-500 employees, cross-border logistics speciality.", "probable")],
    aliases=["Grindrod Logistics Africa", "GLA"], website="https://www.grindrod.com",
    locations=[loc("Durban", "KwaZulu-Natal", "https://za.linkedin.com/company/sturrockgrindrod")],
    scales=[scale("employees", "201-500 employees", "third-party-estimate", "2026", "https://za.linkedin.com/company/sturrockgrindrod")])

org("org-laser-logistics", "Laser Logistics",
    [ind("contract-logistics", evidence="Contract logistics, specialised retail back-door distribution and bulk warehousing.", url="https://www.yellowpages.net.za/places/cold-storage-facility"),
     ind("refrigerated-transport", primary=False, evidence="Cold chain solutions in all major centres of South Africa.", url="https://www.yellowpages.net.za/places/cold-storage-facility")],
    [cap("warehouse-operations", evidence="Bulk warehousing operations.", url="https://www.yellowpages.net.za/places/cold-storage-facility"),
     cap("temperature-controlled-distribution", evidence="Cold chain solutions in all major South African centres.", url="https://www.yellowpages.net.za/places/cold-storage-facility"),
     cap("distribution-network", evidence="Retail back-door distribution across major centres.", url="https://www.yellowpages.net.za/places/cold-storage-facility")],
    [src("https://www.yellowpages.net.za/places/cold-storage-facility", "industry-directory", "Kuils River, Western Cape operator: contract logistics, retail back-door distribution, bulk warehousing and cold chain solutions.", "probable")],
    status="needs-verification",
    locations=[loc("Cape Town", "Western Cape", "https://www.yellowpages.net.za/places/cold-storage-facility")],
    notes="Website and scale not established from the sources read.")

# --- Food manufacturing and seafood -----------------------------------------

WIKI_TIGER = "https://en.wikipedia.org/wiki/Tiger_Brands"
org("org-tiger-brands", "Tiger Brands",
    [ind("food-manufacturing", evidence="South Africa's largest food company producing branded food, beverage, home and personal care products.", url=WIKI_TIGER)],
    [cap("production-manufacturing", evidence="34 manufacturing plants in South Africa.", url=WIKI_TIGER),
     cap("multi-site-operations", evidence="34 manufacturing plants across the country.", url=WIKI_TIGER),
     cap("multi-entity-consolidation", evidence="Listed group with 41 subsidiaries.", url=WIKI_TIGER),
     cap("group-consolidation", evidence="JSE-listed group reporting.", url=WIKI_TIGER),
     cap("inventory-accounting", status="unknown", evidence="Not stated in the sources read.", url=""),
     cap("erp-sap", status="unknown", evidence="System estate not stated in the sources read.", url="")],
    [src(WIKI_TIGER, "news", "Company profile: JSE TBS, HQ Waterfall City Midrand, 34 manufacturing plants, 41 subsidiaries, largest SA food company.", "probable")],
    website="https://www.tigerbrands.com",
    locations=[loc("Midrand", "Gauteng", WIKI_TIGER)],
    scales=[scale("sites", "34 manufacturing plants in South Africa", "source-reported", "2026", WIKI_TIGER)])

WIKI_PIONEER = "https://en.wikipedia.org/wiki/Pioneer_Foods"
org("org-pioneer-foods", "Pioneer Foods",
    [ind("food-manufacturing", evidence="Production, distribution, marketing and selling of food, beverages and related products.", url=WIKI_PIONEER)],
    [cap("production-manufacturing", evidence="Manufacturing group with brands including Bokomo, Sasko, Ceres, Liqui-Fruit, Safari, Spekko and White Star.", url=WIKI_PIONEER),
     cap("distribution-network", evidence="Operates in South Africa and two other African countries and exports globally.", url=WIKI_PIONEER),
     cap("export-trading", evidence="Exports a number of its brands globally.", url=WIKI_PIONEER),
     cap("group-consolidation", evidence="Subsidiary of PepsiCo since 2020 with African operations.", url=WIKI_PIONEER)],
    [src(WIKI_PIONEER, "news", "Company profile: HQ Bellville, approximately 8,600 permanent employees, PepsiCo subsidiary since 2020, brand portfolio listed.", "probable")],
    website="https://www.pioneerfoods.co.za",
    locations=[loc("Cape Town", "Western Cape", WIKI_PIONEER)],
    scales=[scale("employees", "approximately 8,600 permanent employees", "source-reported", "2026", WIKI_PIONEER)],
    notes="Also present in the Accounting & Finance dataset as PepsiCo South Africa / Pioneer Foods.")

FOODBIZ = "https://www.foodbusinessafrica.com/top100/"
org("org-rcl-foods", "RCL Foods",
    [ind("food-manufacturing", evidence="Leading South African food processor manufacturing branded and private-label food products.", url=FOODBIZ)],
    [cap("production-manufacturing", evidence="Produces culinary, pet food and beverage products including Selati sugar, Supreme flour, Rainbow and Farmer Brown chicken, Pieman's pies, Sunbake bread.", url=FOODBIZ),
     cap("inventory-accounting", status="unknown", evidence="Not stated in the sources read.", url="")],
    [src(FOODBIZ, "industry-directory", "Top 100 Food Companies in Africa entry describing product portfolio and processing operations.", "probable")],
    website="https://www.rclfoods.com",
    notes="Registered legal entity and head office not established from the sources read.")

org("org-astral-foods", "Astral Foods",
    [ind("poultry-production", evidence="Integrated poultry producer engaged in feed manufacturing, broiler genetics, hatcheries, breeder and broiler production, abattoir and further processing.", url=FOODBIZ),
     ind("animal-feed-manufacturing", primary=False, evidence="Manufactures animal feeds with nine feed mills.", url=FOODBIZ)],
    [cap("production-manufacturing", evidence="Four fully integrated broiler production facilities and further processing operations.", url=FOODBIZ),
     cap("feed-milling", evidence="Nine feed mills.", url=FOODBIZ),
     cap("poultry-livestock-operations", evidence="Broiler genetics, day-old chicks, hatching eggs, breeder and broiler production, abattoir operations.", url=FOODBIZ),
     cap("multi-site-operations", evidence="Nine feed mills and 180 agricultural sites.", url=FOODBIZ),
     cap("inventory-accounting", status="unknown", evidence="Not stated in the sources read.", url=""),
     cap("commodity-trading", status="unknown", evidence="Feed ingredient buying implied; own-account trading not evidenced.", url="")],
    [src(FOODBIZ, "industry-directory", "Integrated poultry producer: four broiler facilities, nine feed mills, 180 agricultural sites.", "probable")],
    website="https://www.astralfoods.com",
    scales=[scale("sites", "9 feed mills, 4 integrated broiler facilities, 180 agricultural sites", "source-reported", "2026", FOODBIZ)])

org("org-quantum-foods", "Quantum Foods",
    [ind("poultry-production", evidence="Diversified feeds and poultry business and the largest egg producer in South Africa.", url=FOODBIZ),
     ind("animal-feed-manufacturing", primary=False, evidence="Nova Feeds subsidiary manufactures feed.", url=FOODBIZ)],
    [cap("feed-milling", evidence="Nova Feeds subsidiary.", url=FOODBIZ),
     cap("poultry-livestock-operations", evidence="Nulaid eggs and layer unit and the Tydstroom broiler business.", url=FOODBIZ),
     cap("multi-site-operations", evidence="Operations in South Africa, Zambia, Uganda and Mozambique.", url=FOODBIZ),
     cap("multi-entity-consolidation", evidence="Group with multiple operating subsidiaries.", url=FOODBIZ)],
    [src(FOODBIZ, "industry-directory", "Diversified feeds and poultry business, largest SA egg producer, subsidiaries Nulaid, Tydstroom and Nova Feeds.", "probable")],
    website="https://www.quantumfoods.co.za",
    notes="Also present in the Accounting & Finance dataset as Quantum Foods Ltd.")

IJ_ABOUT = "https://www.ij.co.za/about/"
IJ_PMG = "https://pmg.org.za/files/201027IJ_Overview.pdf"
org("org-ij", "I&J",
    [ind("seafood-processing", evidence="Supplier of wild-caught Cape Hake and farmed Cape Abalone with a wet fish primary processing plant in Woodstock, Cape Town.", url=IJ_ABOUT),
     ind("fishing-operations", primary=False, evidence="Owns and operates a fleet of 10 trawlers operating from Cape Town.", url=IJ_PMG)],
    [cap("production-manufacturing", evidence="Three land-based processing factories plus processing and freezing at sea.", url=IJ_PMG),
     cap("cold-storage-operations", evidence="Owns and operates a large freezer storage and logistics facility in Paarden Eiland.", url=IJ_PMG),
     cap("fishing-fleet", evidence="Fleet of 10 trawlers fishing 50 to 200 kilometres offshore.", url=IJ_PMG),
     cap("export-trading", evidence="In excess of 700 reefer containers of frozen fish products shipped worldwide annually.", url=IJ_PMG),
     cap("food-safety-compliance", evidence="Sustainably wild-caught hake and export-grade processing.", url=IJ_ABOUT),
     cap("capital-expenditure", evidence="Invests R40m to R100m annually; recent ±R500m investment in trawlers and factory expansion.", url=IJ_PMG),
     cap("foreign-currency-transactions", status="unknown", evidence="Export volumes imply currency exposure; not stated in the sources read.", url="")],
    [src(IJ_ABOUT, "company-website", "Company history and Woodstock wet fish primary processing plant."),
     src(IJ_PMG, "corporate-disclosure", "Presentation to Parliament: fleet of 10 trawlers, three processing factories, Paarden Eiland freezer storage and logistics facility, abalone operations, annual capex R40m to R100m."),
     src("https://www.brimstone.co.za/investments", "corporate-disclosure", "Sea Harvest and FPG Property Fund listed as Brimstone investments, evidencing group relationships in this sector.")],
    legal="Irvin & Johnson Limited", aliases=["Irvin & Johnson", "I and J"], website="https://www.ij.co.za",
    locations=[loc("Cape Town", "Western Cape", IJ_ABOUT), loc("Hermanus", "Western Cape", IJ_PMG)],
    scales=[scale("employees", "145 full time employees (abalone pump-ashore facility, Danger Point)", "source-reported", "2020", IJ_PMG)],
    notes="Group shareholding by AVI described in the source; parent id not asserted without a current ownership source.")

org("org-sea-harvest", "Sea Harvest",
    [ind("seafood-processing", confidence="probable", evidence="Named as a South African seafood processor competing in coated fish products.", url="https://fastmoving.co.za/fmcg-suppliers/i-j-109/food-9")],
    [cap("production-manufacturing", status="unknown", evidence="Processing scope not stated in the sources read.", url=""),
     cap("cold-storage-operations", status="unknown", evidence="Frozen seafood business implied; facilities not evidenced.", url="")],
    [src("https://www.brimstone.co.za/investments", "corporate-disclosure", "Listed as a Brimstone investment."),
     src("https://fastmoving.co.za/fmcg-suppliers/i-j-109/food-9", "industry-directory", "Named in a South African seafood market note alongside I&J.", "probable")],
    aliases=["Sea Harvest Group"], status="needs-verification",
    notes="Website, sites and scale not established from the sources read.")

org("org-premier-fmcg", "Premier FMCG",
    [ind("flour-milling", confidence="probable", evidence="Listed in the South African grain and oilseed milling company directory.", url="https://www.dnb.com/business-directory/company-information.grain_and_oilseed_milling.za.html")],
    [cap("flour-milling-ops", status="unknown", evidence="Directory classification supports milling; specific mill operations not evidenced.", url=""),
     cap("production-manufacturing", status="unknown", confidence="probable", evidence="The business directory classifies the company under grain and oilseed milling. A classification is not evidence of a manufacturing process, so this stays unresearched.")],
    [src("https://www.dnb.com/business-directory/company-information.grain_and_oilseed_milling.za.html", "business-directory", "Premier FMCG (Pty) Ltd listed as a Johannesburg, Gauteng grain and oilseed milling company.", "probable")],
    legal="Premier FMCG (Pty) Ltd", status="needs-verification",
    locations=[loc("Johannesburg", "Gauteng", "https://www.dnb.com/business-directory/company-information.grain_and_oilseed_milling.za.html")],
    notes="Also appears in the Accounting & Finance dataset as Premier Foods / Premier FMCG (Kerry Group Africa); identity reconciliation outstanding.")

org("org-willowton-group", "Willowton Group",
    [ind("edible-oils-fats", evidence="Leading producer of edible oil-based products including edible oils, soaps, margarine, spreads, chocolate, baking and industrial fats.", url="https://www.zoominfo.com/c/willowton-group/347898576"),
     ind("food-manufacturing", primary=False, evidence="Manufacturer of FMCG products.", url="https://www.zoominfo.com/c/willowton-group/347898576")],
    [cap("oilseed-crushing-ops", status="unknown", evidence="Edible oil production evidenced; crushing versus refining split not stated.", url=""),
     cap("production-manufacturing", evidence="One of South Africa's largest manufacturers of edible oil-based FMCG products.", url="https://www.zoominfo.com/c/willowton-group/347898576"),
     cap("commodity-trading", status="unknown", evidence="Oil input purchasing implied; trading activity not evidenced.", url="")],
    [src("https://www.zoominfo.com/c/willowton-group/347898576", "business-directory", "Family-owned since 1970, KwaZulu-Natal, product range and manufacturing scale.", "probable"),
     src("https://www.dnb.com/business-directory/company-information.grain_and_oilseed_milling.za.html", "business-directory", "Willowton Refineries (Pty) Ltd listed as a Pietermaritzburg grain and oilseed milling company.", "probable")],
    legal="Willowton Refineries (Pty) Ltd", website="https://www.willowtongroup.com",
    locations=[loc("Pietermaritzburg", "KwaZulu-Natal", "https://www.dnb.com/business-directory/company-information.grain_and_oilseed_milling.za.html")])

SSK = "https://www.ssk.co.za/en/about/group-structure/"
org("org-ssk", "SSK Group",
    [ind("agri-cooperative", evidence="Humansdorpse Landbou Korporasie established 1944 as a milling company to support local grain farmers, within the SSK group.", url=SSK),
     ind("oilseed-crushing", primary=False, evidence="Southern Oil, part of the group, is an oil extraction plant and edible oil refinery.", url=SSK)],
    [cap("flour-milling-ops", evidence="Group origin is a milling company supporting grain farmers.", url=SSK),
     cap("grain-handling-storage", status="unknown", evidence="Co-operative grain handling implied; facilities not stated in the source read.", url=""),
     cap("multi-entity-consolidation", evidence="Group structure with multiple operating subsidiaries including Southern Oil and Oleos do Sul.", url=SSK)],
    [src(SSK, "company-website", "Group structure page listing Southern Oil (SOILL), Oleos do Sul and Humansdorpse Landbou Korporasie.")],
    aliases=["Sentraal-Suid Koöperasie", "SSK"], website="https://www.ssk.co.za",
    locations=[loc("Humansdorp", "Eastern Cape", SSK)],
    notes="Also present in the Accounting & Finance dataset as Sentraal-Suid Co-operative (SSK).")

org("org-southern-oil", "Southern Oil (SOILL)",
    [ind("oilseed-crushing", evidence="Modern oil extraction plant and edible oil refinery situated in Swellendam.", url=SSK)],
    [cap("oilseed-crushing-ops", evidence="Oil extraction plant and edible oil refinery; flagship brand B-Well Canola Oil.", url=SSK),
     cap("production-manufacturing", evidence="Extraction and refining operations.", url=SSK),
     cap("export-trading", evidence="Committed to providing oils both nationally and internationally.", url=SSK),
     cap("commodity-trading", status="unknown", evidence="Canola input purchasing implied; trading not evidenced.", url="")],
    [src(SSK, "company-website", "Group structure entry: Swellendam oil extraction plant and edible oil refinery, B-Well Canola Oil brand.")],
    aliases=["SOILL", "Southern Oil"], website="https://www.soill.co.za",
    parent="org-ssk",
    locations=[loc("Swellendam", "Western Cape", SSK)],
    notes="Also present in the Accounting & Finance dataset as Southern Oil (SOILL).")

org("org-meadow-feeds", "Meadow Feeds",
    [ind("animal-feed-manufacturing", evidence="Regarded as the market leader in the southern African animal feed industry, producing specialised diets and custom feed mixes.", url="https://www.meadowfeeds.co.za/")],
    [cap("feed-milling", evidence="Produces specialised diets and custom feed mixes for livestock and game industries.", url="https://www.meadowfeeds.co.za/"),
     cap("production-manufacturing", evidence="Feed manufacturing operations including the Standerton plant.", url="https://www.meadowfeeds.co.za/"),
     cap("multi-site-operations", evidence="Regional operations including Randfontein (Gauteng) and Standerton (Mpumalanga).", url="https://www.goafricaonline.com/za/1340689-meadow-feeds-northern-region"),
     cap("commodity-trading", status="unknown", evidence="Feed input procurement implied; own-account trading not evidenced.", url="")],
    [src("https://www.meadowfeeds.co.za/", "company-website", "Market position, product range and Standerton operational excellence award."),
     src("https://www.goafricaonline.com/za/1340689-meadow-feeds-northern-region", "industry-directory", "Northern region site at 144 Main Reef Road, Randfontein, Gauteng.", "probable")],
    website="https://www.meadowfeeds.co.za/",
    locations=[loc("Randfontein", "Gauteng", "https://www.goafricaonline.com/za/1340689-meadow-feeds-northern-region")])

org("org-epol", "Epol",
    [ind("animal-feed-manufacturing", evidence="Animal feed producer serving farmers since 1916.", url="https://epol.co.za/")],
    [cap("feed-milling", evidence="High-quality animal feed production and distribution.", url="https://epol.co.za/")],
    [src("https://www.linkedin.com/company/epolsouthafrica", "industry-directory", "Company page: website epol.co.za, animal feed producer since 1916.", "probable")],
    website="https://epol.co.za/",
    notes="Ownership and mill locations not established from the sources read.")

org("org-voermol", "Voermol Feeds",
    [ind("animal-feed-manufacturing", confidence="probable", evidence="Listed as a South African food production business alongside other feed manufacturers.", url="https://www.linkedin.com/company/epolsouthafrica")],
    [cap("feed-milling", status="unknown", evidence="Classification supports feed manufacturing; operations not evidenced.", url="")],
    [src("https://www.linkedin.com/company/epolsouthafrica", "industry-directory", "Appears as a related South African feed production company.", "probable")],
    legal="Voermol Feeds (Pty) Ltd", status="needs-verification",
    notes="Website, sites and scale not established from the sources read.")

org("org-nutri-feeds", "Nutri Feeds",
    [ind("animal-feed-manufacturing", confidence="probable", evidence="Listed as a South African food and beverage manufacturing business in the feed sector.", url="https://www.linkedin.com/company/epolsouthafrica")],
    [cap("feed-milling", status="unknown", evidence="Operations not evidenced in the sources read.", url="")],
    [src("https://www.linkedin.com/company/epolsouthafrica", "industry-directory", "Appears as a related South African feed manufacturing company.", "probable")],
    status="needs-verification",
    notes="Website, sites and scale not established from the sources read.")

org("org-nova-feeds", "Nova Feeds",
    [ind("animal-feed-manufacturing", evidence="Nova Feeds named as a Quantum Foods subsidiary feed business.", url=FOODBIZ)],
    [cap("feed-milling", evidence="Feed manufacturing business within the Quantum Foods group.", url=FOODBIZ)],
    [src(FOODBIZ, "industry-directory", "Quantum Foods subsidiaries include Nulaid, Tydstroom broiler business and Nova Feeds.", "probable"),
     src("https://www.linkedin.com/company/epolsouthafrica", "industry-directory", "Listed as a farming business in Wellington, Western Cape.", "probable")],
    parent="org-quantum-foods", status="needs-verification",
    locations=[loc("Wellington", "Western Cape", "https://www.linkedin.com/company/epolsouthafrica")])

# --- Agricultural commodities -----------------------------------------------

AGBIZ = "https://agbiz.co.za/content/about-us?page=members"
BESTER_LEI = "https://globalfinreg.com/en/lookup/Bester-Feed-and-Grain-Pty-Ltd/South-Africa/3789BFDYDZGX0SH5BH08"
BESTER_CRUNCH = "https://www.crunchbase.com/organization/bester-feed-grain"
BESTER_PROFILE = "https://chemdmart.com/company-profile/bester-feed-and-grain-pty-ltd"
org("org-bester-feed-grain", "Bester Feed & Grain",
    [ind("grain-trading", evidence="Agricultural trading company specialising in marketing agricultural commodities domestically and internationally.", url=BESTER_CRUNCH),
     ind("animal-feed-manufacturing", primary=False, confidence="probable", evidence="Formulation services for the feed industry.", url=BESTER_PROFILE)],
    [cap("commodity-trading", evidence="Markets grains, fishmeal, feed additives, oilcakes and oilseeds domestically and internationally.", url=BESTER_PROFILE),
     cap("commodity-contracts", evidence="Trading in physical agricultural commodities for clients.", url=BESTER_CRUNCH),
     cap("commodity-price-risk", evidence="Uses market knowledge and risk management to optimise client outcomes.", url=BESTER_CRUNCH),
     cap("grain-handling-storage", evidence="Logistical support, storage and grading facilities with 35,000 metric ton capacity.", url=BESTER_PROFILE),
     cap("agricultural-logistics", evidence="Operates in the agriculture and logistics sectors with domestic and international footprint.", url=BESTER_PROFILE),
     cap("export-trading", evidence="International commodity marketing; trade data shows imports of oilcake under HS 23040000.", url="https://www.eximpedia.app/companies/bester-feed-and-grain-pty-limited/94056880"),
     cap("foreign-currency-transactions", status="unknown", confidence="probable", evidence="Cross-border commodity trade is evidenced, but the sources read say nothing about currency arrangements."),
     cap("inventory-accounting", status="unknown", confidence="probable", evidence="The sourced 35,000 MT storage and grading capacity implies material stock valuation, but no source states the accounting process."),
     cap("hedging-derivative-accounting", status="unknown", evidence="Risk management is claimed but no source read states hedge accounting or derivative instruments.", url="")],
    [src(BESTER_LEI, "corporate-disclosure", "Legal Entity Identifier record: Bester Feed and Grain (Pty) Ltd, 29 Elektron Road, Techno Park, Stellenbosch 7600, Western Cape, active private company."),
     src(BESTER_CRUNCH, "business-directory", "Agricultural trading company marketing agricultural commodities; Stellenbosch; 101-250 employees; www.bester.co.za.", "probable"),
     src(BESTER_PROFILE, "business-directory", "Established 1994 as a subsidiary of the BexGroup; grains, fishmeal, feed additives, oilcakes, oilseeds; storage and grading capacity 35,000 MT; formulation services for the feed industry.", "probable"),
     src("https://www.eximpedia.app/companies/bester-feed-and-grain-pty-limited/94056880", "industry-directory", "Trade data: imports under HS 23040000 (oilcake) processed through Ariamsvlei and Trans Kalahari.", "probable")],
    legal="Bester Feed and Grain (Pty) Ltd", aliases=["Bester", "Bester Feed and Grain"],
    website="https://www.bester.co.za",
    locations=[loc("Stellenbosch", "Western Cape", BESTER_LEI)],
    scales=[scale("employees", "101-250 employees", "third-party-estimate", "2026", BESTER_CRUNCH),
            scale("sites", "Storage and grading capacity of 35,000 metric tons", "source-reported", "2026", BESTER_PROFILE)],
    notes="Scenario C focal company: Head of Finance requirement with mandatory commodity trading exposure. Part of the BexGroup; the group entity itself is not yet mapped.")

NWK_SRC = "https://sg.linkedin.com/showcase/grain-marketing"
org("org-nwk", "NWK Ltd",
    [ind("grain-trading", evidence="Offers marketing, price risk management and value trading services to producers and buyers of grain.", url=NWK_SRC),
     ind("grain-storage-handling", primary=False, evidence="Silo facilities provide weighing, grading, cleaning, drying and storage.", url=NWK_SRC),
     ind("agri-cooperative", primary=False, confidence="probable", evidence="Farmer-facing co-operative style service model across its area of service.", url=NWK_SRC)],
    [cap("commodity-trading", evidence="Marketing of white and yellow maize, sunflower, soybeans, dry beans, grain sorghum and wheat.", url=NWK_SRC),
     cap("commodity-price-risk", evidence="Price risk management and Safex broker service.", url=NWK_SRC),
     cap("grain-handling-storage", evidence="Silo services: weighing, grading, cleaning, drying and storage of grain and oilseeds.", url=NWK_SRC),
     cap("trading-platform", status="unknown", evidence="Safex broker service evidenced; internal trading system not stated.", url=""),
     cap("agricultural-logistics", evidence="NWK Logistics operates within the group.", url=NWK_SRC),
     cap("multi-entity-consolidation", evidence="Group includes EPKO Oil Seed Crushing, NWK Retail, Opti Feeds and NWK Logistics.", url=NWK_SRC)],
    [src(NWK_SRC, "company-website", "Grain marketing page: commodities traded, market information, Safex broker service, silo services; affiliated group businesses."),
     src(AGBIZ, "industry-directory", "Corporate member listing with contact details for NWK.", "probable"),
     src("https://www.agribook.co.za/agribusiness/", "industry-directory", "Agribusiness role-player listing with website.", "probable")],
    website="https://www.nwk.co.za",
    locations=[loc("Lichtenburg", "North West", NWK_SRC)],
    notes="Opti Feeds, EPKO Oil Seed Crushing, NWK Retail and NWK Logistics are named group businesses but are not separately mapped yet.")

org("org-afgri", "AFGRI",
    [ind("agri-cooperative", evidence="Corporate member of the Agricultural Business Chamber operating agri services.", url=AGBIZ),
     ind("grain-trading", primary=False, confidence="probable", evidence="AFGRI Operations Limited listed in the grain marketing role-player listings.", url=NWK_SRC)],
    [cap("grain-handling-storage", status="unknown", evidence="Silo network implied by role; facilities not evidenced in the sources read.", url=""),
     cap("commodity-trading", status="unknown", evidence="Agri services scope implied; trading activity not evidenced in the sources read.", url=""),
     cap("feed-milling", status="unknown", evidence="AFGRI Animal Nutrition / Meadow Feeds are associated in market commentary but not evidenced here.", url="")],
    [src(AGBIZ, "industry-directory", "Corporate member listing: Afgri Agri Services with contact details.", "probable"),
     src("https://www.agribook.co.za/agribusiness/", "industry-directory", "Agribusiness role-player listing.", "probable")],
    aliases=["AFGRI Agri Services", "AFGRI Operations Limited"], website="https://www.afgri.co.za",
    locations=[loc("Centurion", "Gauteng", NWK_SRC)], status="needs-verification",
    notes="Ownership history and current structure not established from the sources read; treat capability evidence as incomplete.")

org("org-senwes", "Senwes",
    [ind("agri-cooperative", evidence="Corporate member of the Agricultural Business Chamber of South Africa.", url=AGBIZ),
     ind("grain-trading", primary=False, confidence="probable", evidence="Listed among South African grain marketing role players.", url="https://www.agribook.co.za/agribusiness/")],
    [cap("commodity-trading", status="unknown", evidence="Grain marketing role indicated by directory listings; trading activity not directly evidenced.", url=""),
     cap("grain-handling-storage", status="unknown", evidence="Silo operations not evidenced in the sources read.", url="")],
    [src(AGBIZ, "industry-directory", "Corporate member listing with contact details.", "probable"),
     src("https://www.agribook.co.za/agribusiness/", "industry-directory", "Agribusiness role-player listing.", "probable")],
    website="https://www.senwes.co.za", status="needs-verification",
    notes="Capability evidence deliberately left unknown: directory membership is not proof of operating capability.")

org("org-vkb", "VKB",
    [ind("agri-cooperative", evidence="Corporate member of the Agricultural Business Chamber listed as VKB Agriculture.", url=AGBIZ)],
    [cap("grain-handling-storage", status="unknown", evidence="Not evidenced in the sources read.", url=""),
     cap("commodity-trading", status="unknown", evidence="Not evidenced in the sources read.", url="")],
    [src(AGBIZ, "industry-directory", "Corporate member listing with contact details.", "probable"),
     src("https://www.agribook.co.za/agribusiness/", "industry-directory", "Listed as VKB Group.", "probable")],
    aliases=["VKB Agriculture", "VKB Group"], website="https://www.vkb.co.za", status="needs-verification")

org("org-twk", "TWK Agri",
    [ind("agri-cooperative", evidence="Corporate member of the Agricultural Business Chamber listed as TWK Agriculture.", url=AGBIZ)],
    [cap("grain-handling-storage", status="unknown", evidence="Not evidenced in the sources read.", url="")],
    [src(AGBIZ, "industry-directory", "Corporate member listing with contact details.", "probable"),
     src("https://www.agribook.co.za/agribusiness/", "industry-directory", "Agribusiness role-player listing.", "probable")],
    aliases=["TWK Agriculture"], website="https://www.twkagri.com", status="needs-verification",
    locations=[loc("Piet Retief", "Mpumalanga", NWK_SRC)])

org("org-gwk", "GWK",
    [ind("agri-cooperative", confidence="probable", evidence="Listed among South African agribusiness role players.", url="https://www.agribook.co.za/agribusiness/")],
    [cap("grain-handling-storage", status="unknown", evidence="Not evidenced in the sources read.", url="")],
    [src("https://www.agribook.co.za/agribusiness/", "industry-directory", "Agribusiness role-player listing with website.", "probable")],
    website="https://www.gwk.co.za", status="needs-verification")

org("org-kaap-agri", "Kaap Agri",
    [ind("agri-cooperative", evidence="Corporate member of the Agricultural Business Chamber listed as Kaap Agri Bedryf Ltd.", url=AGBIZ)],
    [cap("grain-handling-storage", status="unknown", evidence="Not evidenced in the sources read.", url=""),
     cap("retail-trading", status="unknown", confidence="probable", evidence="The role-player directory lists the company under retail. Directory membership alone is not capability evidence, so this stays unresearched.")],
    [src(AGBIZ, "industry-directory", "Corporate member listing with contact details.", "probable"),
     src(NWK_SRC, "industry-directory", "Listed as Kaap Agri Bedryf Bpk, Drakenstein, Western Cape.", "probable")],
    aliases=["Kaap Agri Bedryf Ltd", "Agrimark"], website="https://www.kaapagri.co.za", status="needs-verification",
    locations=[loc("Paarl", "Western Cape", NWK_SRC)],
    notes="Also present in the Accounting & Finance dataset as Kaap Agri / Agrimark.")

org("org-obaro", "Obaro",
    [ind("agri-cooperative", confidence="probable", evidence="Listed as a Brits, North West farming business alongside grain marketing role players.", url=NWK_SRC)],
    [cap("grain-handling-storage", status="unknown", evidence="Not evidenced in the sources read.", url="")],
    [src(NWK_SRC, "industry-directory", "Similar-page listing: Obaro, farming, Brits, North West.", "probable")],
    website="https://www.obaro.co.za", status="needs-verification",
    locations=[loc("Brits", "North West", NWK_SRC)])

# --- Property development ---------------------------------------------------

SLM = "https://slmdev.co.za/corporate-profile/"
SLM_SERVICES = "https://slmdev.co.za/group-services/"
org("org-slm-developments", "SLM Developments",
    [ind("property-development", evidence="Full-spectrum property development and project management company.", url="https://slmdev.co.za/"),
     ind("residential-development", primary=False, evidence="Residential fund management of large-scale residential-for-rental portfolios.", url="https://slmdev.co.za/")],
    [cap("project-development", evidence="Property development and project management from initial planning through completion.", url=SLM_SERVICES),
     cap("development-cost-accounting", evidence="Group services include financial reporting and monthly reporting for development projects.", url=SLM_SERVICES),
     cap("multi-project-management", evidence="Structured project management applied to each development project across a portfolio.", url=SLM_SERVICES),
     cap("property-holding-structures", evidence="Residential Long-term Funds managed through INQB8 Portfolio Management.", url=SLM_SERVICES),
     cap("multi-entity-consolidation", evidence="Group companies include INQB8 Portfolio Management, SLM Sales and Marketing, SLM Skill Solutions and Stockhouse Capital.", url="https://b2bhint.com/en/company/za/slm-developments--K2019081416"),
     cap("project-finance", evidence="Stockhouse Capital provides development and acquisition finance solutions to developers and property investors.", url=SLM_SERVICES),
     cap("capital-expenditure", status="unknown", evidence="Capex governance not stated in the sources read.", url=""),
     cap("construction-project-costing", status="unknown", evidence="On-site project management evidenced; contract costing detail not stated.", url="")],
    [src("https://slmdev.co.za/", "company-website", "Company positioning: property development, project management and residential fund management."),
     src(SLM, "company-website", "Corporate profile: residential, retail, commercial and educational rental property portfolios; Level 2 BEE with 51% black ownership."),
     src(SLM_SERVICES, "company-website", "Group services: property development/project management, portfolio management via INQB8, sales and marketing (EAAB F148014), skill solutions, private credit via Stockhouse Capital with Creation Capital."),
     src("https://b2bhint.com/en/company/za/slm-developments--K2019081416", "business-directory", "Company registration K2019081416, incorporated 2019-02-15, Bellville Western Cape; related entities at the same address include INQB8 Portfolio Management, SLM Sales and Marketing, SLM Skill Solutions and SLM Invest.", "probable"),
     src("https://www.dnb.com/business-directory/company-profiles/slm-developments-(pty)-ltd.4d1c10a01914e3d416b1c9b4d19b4ef3", "business-directory", "Registered as SLM Developments (Pty) Ltd, Cape Town; 1-24 employees modelled.", "probable")],
    legal="SLM Developments (Pty) Ltd", aliases=["SLM", "SLM Property Development", "SLM Development"],
    website="https://slmdev.co.za",
    locations=[loc("Cape Town", "Western Cape", "https://b2bhint.com/en/company/za/slm-developments--K2019081416")],
    scales=[scale("employees", "1-24 employees (modelled)", "third-party-estimate", "2026", "https://www.dnb.com/business-directory/company-profiles/slm-developments-(pty)-ltd.4d1c10a01914e3d416b1c9b4d19b4ef3")],
    notes="Scenario B focal company. Verified identity is SLM Developments (Pty) Ltd; the brief's \"SLM Property Development\" is an alias, not the registered name.")

RABIE = "https://www.linkedin.com/company/rabie-property-group-pty-ltd"
org("org-rabie-property-group", "Rabie Property Group",
    [ind("property-development", evidence="Independent Cape Town property developer creating residential, commercial and mixed-use developments.", url=RABIE),
     ind("residential-development", primary=False, evidence="New urban estates and multi-generational neighbourhoods.", url=RABIE)],
    [cap("project-development", evidence="Award-winning residential, commercial and mixed-use developments since 1978, including Century City.", url=RABIE),
     cap("multi-project-management", evidence="Portfolio of concurrent developments across the Western Cape.", url=RABIE),
     cap("property-holding-structures", status="unknown", evidence="Holding structure not stated in the sources read.", url=""),
     cap("development-cost-accounting", status="unknown", evidence="Not stated in the sources read.", url=""),
     cap("capital-project-management", evidence="Ground-breaking public private partnerships and large-scale estate delivery.", url=RABIE)],
    [src(RABIE, "company-website", "Company page: independent Cape Town developer since 1978, Century City, 51-200 employees, HQ 2 Energy Lane, Bridgeways Precinct."),
     src("https://www.zoominfo.com/c/rabie-property-group/430064055", "business-directory", "Head office, website rabie.co.za, industry classification and leadership roles including Director, Financial.", "probable")],
    legal="Rabie Property Group (Pty) Ltd", aliases=["Rabie", "Rabie Property Developers"],
    website="https://www.rabie.co.za",
    locations=[loc("Cape Town", "Western Cape", RABIE)],
    scales=[scale("employees", "51-200 employees", "third-party-estimate", "2026", RABIE)])

FPG = "https://za.linkedin.com/company/fpg-property-fund"
org("org-fpg-property-fund", "FPG Property Fund",
    [ind("property-investment", evidence="Privately held property investment and development company.", url=FPG),
     ind("retail-property", primary=False, evidence="Focus on the retail convenience sector across South Africa and offshore.", url=FPG)],
    [cap("property-holding-structures", evidence="Privately held fund structure with related holding entities.", url="https://www.brimstone.co.za/investments"),
     cap("project-development", evidence="Developments and acquisitions over a 33-year history, including the Moreleta Corner redevelopment.", url=FPG),
     cap("development-cost-accounting", status="unknown", evidence="Not stated in the sources read.", url=""),
     cap("capital-expenditure", status="unknown", confidence="probable", evidence="Redevelopment programmes are evidenced, but capital expenditure governance is not stated.")],
    [src(FPG, "company-website", "Company page: privately held property investment and development company, founded 1990, HQ Parow Western Cape, retail convenience focus."),
     src("https://www.brimstone.co.za/investments", "corporate-disclosure", "FPG Investments owns 87% of FPG Property Fund, 87% of FPG Foods and 30% of Polar Ice Cream.")],
    aliases=["FPG"], website="https://www.fpggroup.co.za",
    locations=[loc("Cape Town", "Western Cape", FPG)],
    scales=[scale("employees", "51-200 employees", "third-party-estimate", "2026", FPG)],
    notes="Owned 87% by FPG Investments; the holding entity is not separately mapped yet.")

SAREIT = "https://sareit.co.za/members/"
org("org-growthpoint-properties", "Growthpoint Properties",
    [ind("property-investment", evidence="South Africa's largest listed real estate investment trust.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/"),
     ind("property-development", primary=False, evidence="Dominant force in commercial property development across office, industrial, retail and logistics.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/")],
    [cap("property-holding-structures", evidence="REIT structure holding a diversified portfolio.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/"),
     cap("project-development", evidence="Green buildings, ESG-aligned developments and mixed-use urban precincts.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/"),
     cap("group-consolidation", evidence="JSE-listed property group reporting.", url=SAREIT)],
    [src(SAREIT, "industry-directory", "SA REIT member listing with Sandton head office and contact details.", "probable"),
     src("https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/", "industry-report", "Described as South Africa's largest listed REIT with a diversified office, industrial, retail and logistics portfolio.", "probable")],
    website="https://www.growthpoint.co.za",
    locations=[loc("Sandton", "Gauteng", SAREIT)])

org("org-redefine-properties", "Redefine Properties",
    [ind("property-investment", evidence="SA REIT member and listed property investment group.", url=SAREIT)],
    [cap("property-holding-structures", evidence="Listed property investment structures.", url=SAREIT),
     cap("project-development", status="unknown", evidence="Development activity not evidenced in the sources read.", url="")],
    [src(SAREIT, "industry-directory", "SA REIT member listing with Sandton head office and contact details.", "probable")],
    website="https://www.redefine.co.za",
    locations=[loc("Sandton", "Gauteng", SAREIT)])

ATTACQ = "https://www.african-markets.com/en/stock-markets/jse/listed-companies/company?code=ATT"
org("org-attacq", "Attacq",
    [ind("property-investment", evidence="Property holding, development and investment group investing in and developing A-grade properties.", url=ATTACQ),
     ind("property-development", primary=False, evidence="Develops A-grade properties as long-term investments.", url=ATTACQ)],
    [cap("project-development", evidence="Invests in and develops A-grade properties generating rental income and capital growth.", url=ATTACQ),
     cap("property-holding-structures", evidence="Ownership of directly held investment properties.", url=ATTACQ),
     cap("development-cost-accounting", status="unknown", evidence="Not stated in the sources read.", url=""),
     cap("group-consolidation", evidence="JSE-listed group (ATT, ISIN ZAE000177218).", url=ATTACQ)],
    [src(ATTACQ, "corporate-disclosure", "JSE company profile: property holding, development and investment group; ISIN ZAE000177218.", "probable"),
     src(SAREIT, "industry-directory", "Member listing: Nexus 1, 44 Magwa Crescent, Waterfall City.", "probable")],
    website="https://www.attacq.co.za",
    locations=[loc("Midrand", "Gauteng", SAREIT)])

org("org-equites", "Equites Property Fund",
    [ind("logistics-property", evidence="Positioned at the centre of South Africa's logistics and industrial property market.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/"),
     ind("property-investment", primary=False, evidence="Listed property fund.", url=SAREIT)],
    [cap("project-development", evidence="Development of logistics and industrial property.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/"),
     cap("property-holding-structures", evidence="Listed fund structure.", url=SAREIT)],
    [src(SAREIT, "industry-directory", "Member listing: 14th Floor Portside Tower, 4 Bree Street, Cape Town.", "probable"),
     src("https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/", "industry-report", "Logistics and industrial development focus.", "probable")],
    website="https://www.equites.co.za",
    locations=[loc("Cape Town", "Western Cape", SAREIT)])

org("org-stor-age", "Stor-Age Property REIT",
    [ind("self-storage", evidence="Listed self-storage property REIT.", url=SAREIT)],
    [cap("property-holding-structures", evidence="REIT structure holding self-storage assets.", url=SAREIT),
     cap("warehouse-operations", status="unknown", evidence="Self-storage operations differ from distribution warehousing; not evidenced either way.", url="")],
    [src(SAREIT, "industry-directory", "Member listing: 216 Main Road, Claremont, Cape Town.", "probable")],
    website="https://www.stor-age.co.za",
    locations=[loc("Cape Town", "Western Cape", SAREIT)])

org("org-devmark", "Devmark Property Group",
    [ind("residential-development", evidence="Reputation in premium residential and coastal real estate developments.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/")],
    [cap("project-development", evidence="Premium residential and coastal development projects.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/")],
    [src("https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/", "industry-report", "Named among South Africa's leading real estate developers.", "probable")],
    status="needs-verification",
    notes="Website, head office and scale not established from the sources read.")

org("org-rebosis", "Rebosis Property Fund",
    [ind("property-investment", evidence="Retail, commercial and mixed-use real estate portfolio.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/"),
     ind("retail-property", primary=False, evidence="Portfolio anchored by high-footfall shopping centres.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/")],
    [cap("property-holding-structures", evidence="JSE-listed property fund.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/"),
     cap("project-development", confidence="probable", evidence="Described as a real estate development player.", url="https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/")],
    [src("https://shore.africa/2026-01-11/top-real-estate-developers-in-south-africa/", "industry-report", "One of the first black-owned property companies listed on the JSE; retail, commercial and mixed-use development.", "probable")],
    status="needs-verification",
    notes="Website and head office not established from the sources read.")

# --- Construction -----------------------------------------------------------

BRIEFLY = "https://briefly.co.za/25037-top-30-construction-companies-south-africa.html"
CONSTRSA = "https://www.constructionsouthafrica.co.za/top-40-construction-companies-in-south-africa/"
org("org-wbho", "WBHO Construction",
    [ind("construction-contracting", evidence="One of the largest construction companies in Southern Africa, listed on the JSE.", url=CONSTRSA)],
    [cap("construction-project-costing", status="unknown", confidence="probable", evidence="The company profile lists roads, earthworks, building and engineering contracting, which implies project-based costing, but no source describes the costing process."),
     cap("multi-project-management", status="unknown", confidence="probable", evidence="The company profile describes a national contracting portfolio, but nothing read states how many projects run concurrently, so this stays unresearched."),
     cap("capital-project-management", status="unknown", evidence="Not stated in the sources read.", url="")],
    [src(BRIEFLY, "industry-directory", "Services (roads and earthworks, building and engineering, design and construction) and head office 53 Andries Street, Wynberg, Johannesburg.", "probable"),
     src(CONSTRSA, "industry-directory", "Listed among the largest Southern African construction companies, JSE-listed.", "probable")],
    website="https://www.wbho.co.za",
    locations=[loc("Johannesburg", "Gauteng", BRIEFLY)],
    notes="Also present in the Accounting & Finance dataset as WBHO Construction - Cape Division.")

org("org-raubex", "Raubex Group",
    [ind("infrastructure-development", evidence="Infrastructure development and construction materials supply group.", url=CONSTRSA)],
    [cap("construction-project-costing", status="unknown", evidence="Materials supply and road surfacing evidenced; contract costing not stated.", url=""),
     cap("multi-site-operations", evidence="Operates across South Africa and throughout southern Africa.", url=CONSTRSA),
     cap("group-consolidation", evidence="Listed on the JSE since March 2007.", url=CONSTRSA)],
    [src(CONSTRSA, "industry-directory", "Established 1974, JSE-listed March 2007, operations across South Africa and southern Africa.", "probable")],
    website="https://www.raubex.com",
    notes="Also present in the Accounting & Finance dataset as Raubex / Roadmac Surfacing Cape.")

org("org-concor", "Concor",
    [ind("construction-contracting", evidence="Diversified infrastructure and services construction company (formerly Murray & Roberts Construction).", url=CONSTRSA)],
    [cap("construction-project-costing", status="unknown", confidence="probable", evidence="The source lists infrastructure, building, mining and property development contracting. Those sectors do not evidence contract costing, so this stays unresearched."),
     cap("multi-project-management", status="unknown", confidence="probable", evidence="A diversified contracting portfolio across sectors is described, but concurrent project delivery is not stated, so this stays unresearched."),
     cap("project-development", evidence="Property development is named as a core competency.", url=CONSTRSA)],
    [src(CONSTRSA, "industry-directory", "Core competencies in infrastructure, building, mining and property development sectors.", "probable")],
    website="https://www.concor.co.za",
    notes="Also present in the Accounting & Finance dataset as Concor. Formerly Murray & Roberts Construction.")

org("org-aveng", "Aveng",
    [ind("construction-contracting", evidence="Construction and engineering group operating in infrastructure and public works.", url=CONSTRSA),
     ind("infrastructure-development", primary=False, evidence="Steel, engineering, manufacturing, mining, concessions, public infrastructure and water treatment.", url=CONSTRSA)],
    [cap("construction-project-costing", status="unknown", evidence="Not stated in the sources read.", url=""),
     cap("capital-project-management", status="unknown", confidence="probable", evidence="Concessions and public infrastructure delivery are described, but capital project management is not stated, so this stays unresearched.")],
    [src(CONSTRSA, "industry-directory", "Operating sectors: steel, engineering, manufacturing, mining, concessions, public infrastructure and water treatment.", "probable")],
    website="https://www.aveng.co.za")

org("org-stefanutti-stocks", "Stefanutti Stocks",
    [ind("construction-contracting", evidence="One of South Africa's leading construction groups with over 7,000 employees.", url=CONSTRSA)],
    [cap("multi-project-management", status="unknown", confidence="probable", evidence="Marketing copy claims capacity to deliver a range of projects of any scale. A capacity claim is not an observation of concurrent project delivery, so this stays unresearched."),
     cap("construction-project-costing", status="unknown", evidence="Not stated in the sources read.", url="")],
    [src(CONSTRSA, "industry-directory", "Leading construction group with over 7,000 employees.", "probable")],
    website="https://www.stefanuttistocks.com",
    scales=[scale("employees", "over 7,000 employees", "third-party-estimate", "2026", CONSTRSA)])

org("org-murray-roberts", "Murray & Roberts",
    [ind("construction-contracting", evidence="South African construction group.", url=BRIEFLY),
     ind("infrastructure-development", primary=False, confidence="probable", evidence="Historic infrastructure engineering group.", url=CONSTRSA)],
    [cap("capital-project-management", status="unknown", evidence="Not stated in the sources read.", url="")],
    [src(BRIEFLY, "industry-directory", "Postal address Bedfordview and website murrob.com.", "probable"),
     src(CONSTRSA, "industry-directory", "Concor described as formerly Murray & Roberts Construction.", "probable")],
    aliases=["Murray and Roberts"], website="https://www.murrob.com",
    locations=[loc("Johannesburg", "Gauteng", BRIEFLY)])

org("org-esor", "Esor",
    [ind("construction-contracting", confidence="probable", evidence="Listed among South African construction companies.", url="https://sapac.co.za/blogs/news/top-40-construction-companies-in-south-africa-2024-search-ranking")],
    [cap("construction-project-costing", status="unknown", evidence="Not stated in the sources read.", url="")],
    [src("https://sapac.co.za/blogs/news/top-40-construction-companies-in-south-africa-2024-search-ranking", "industry-directory", "Top 40 construction companies listing.", "probable")],
    website="https://esor.co.za", status="needs-verification")

org("org-motheo", "Motheo Construction Group",
    [ind("construction-contracting", confidence="probable", evidence="Listed among South African construction companies.", url="https://sapac.co.za/blogs/news/top-40-construction-companies-in-south-africa-2024-search-ranking")],
    [cap("construction-project-costing", status="unknown", evidence="Not stated in the sources read.", url="")],
    [src("https://sapac.co.za/blogs/news/top-40-construction-companies-in-south-africa-2024-search-ranking", "industry-directory", "Top 40 construction companies listing.", "probable")],
    website="https://motheogroup.co.za", status="needs-verification")

org("org-power-group", "Power Group",
    [ind("construction-contracting", confidence="probable", evidence="Listed among South African construction companies.", url="https://sapac.co.za/blogs/news/top-40-construction-companies-in-south-africa-2024-search-ranking")],
    [cap("construction-project-costing", status="unknown", evidence="Not stated in the sources read.", url="")],
    [src("https://sapac.co.za/blogs/news/top-40-construction-companies-in-south-africa-2024-search-ranking", "industry-directory", "Top 40 construction companies listing.", "probable")],
    website="https://www.powergrp.co.za", status="needs-verification",
    notes="Also present in the Accounting & Finance dataset as Power Group.")

# --- Renewable energy -------------------------------------------------------

IPP_ACED = "https://ippjournal.com/company/african-clean-energy-developments-aced"
org("org-aced", "African Clean Energy Developments",
    [ind("renewable-development", evidence="South African company dedicated to developing renewable energy projects in southern Africa since 2008.", url=IPP_ACED)],
    [cap("project-development", evidence="Over 1.2 GW of renewable projects developed (over 715 MW wind and over 473 MW solar PV) under REIPPPP.", url=IPP_ACED),
     cap("project-finance", evidence="Consortium with AIIM and Reatile Renewables achieved financial close on the 89 MW Castle Wind Farm.", url=IPP_ACED),
     cap("capital-project-management", status="unknown", confidence="probable", evidence="Project delivery through construction phases is described, but capital project management is not stated, so this stays unresearched."),
     cap("multi-project-management", evidence="Portfolio of projects operating or under construction.", url=IPP_ACED),
     cap("multi-entity-consolidation", status="unknown", confidence="probable", evidence="Project companies are held in consortium structures, but no source states that the accounts are consolidated, so this stays unresearched.")],
    [src(IPP_ACED, "industry-directory", "Company profile: Cape Town, since 2008, over 1.2 GW developed under REIPPPP; Castle Wind Farm financial close with AIIM and Reatile Renewables."),
     src("https://www.zoominfo.com/c/african-clean-energy-developments-aced/472527985", "business-directory", "Head office 1 Oakdale Road, Fernwood House, Cape Town; website aced.co.za.", "probable")],
    aliases=["ACED"], website="https://www.aced.co.za",
    locations=[loc("Cape Town", "Western Cape", IPP_ACED)])

MULILO = "https://za.linkedin.com/company/mulilo-renewable-energy"
org("org-mulilo", "Mulilo Energy",
    [ind("renewable-development", evidence="Renewable energy developer and independent power producer established in 2008.", url=MULILO),
     ind("independent-power-production", primary=False, evidence="One of the leading independent power producers in Southern Africa.", url=MULILO)],
    [cap("project-development", evidence="Concluded numerous PPAs under REIPPPP and with large corporate energy users.", url=MULILO),
     cap("project-finance", evidence="Project finance is a named speciality; 500 MW of projects under financial close.", url=MULILO),
     cap("capital-project-management", evidence="Construction contracts and management is a named speciality.", url=MULILO),
     cap("multi-project-management", evidence="450 MW operational across wind and solar PV with a further pipeline.", url=MULILO),
     cap("regulatory-reporting", status="unknown", confidence="probable", evidence="Environmental impact studies are a named speciality. That is environmental compliance work, not regulatory financial reporting, so this stays unresearched.")],
    [src(MULILO, "company-website", "Company page: developer and IPP since 2008, 450 MW operational, 500 MW under financial close, specialities include project finance, construction contracts and management, energy storage.", "probable")],
    website="http://www.mulilo.com",
    locations=[loc("Cape Town", "Western Cape", MULILO)],
    scales=[scale("employees", "51-200 employees", "third-party-estimate", "2026", MULILO)])

RED_ROCKET = "https://za.linkedin.com/company/redrocketenergy"
RED_ROCKET_EN = "https://www.engineeringnews.co.za/article/red-rocket-powering-solutions-across-the-mining-value-chain-2026-02-04"
RED_ROCKET_TOURNEE = "https://www.engineeringnews.co.za/article/r52bn-red-rocket-solar-park-first-and-only-project-to-emerge-from-eskoms-land-lease-scheme-2025-10-31"
RED_ROCKET_IOL = "https://iol.co.za/capeargus/news/2022-10-20-cape-town-based-ipps-rocket-sa-into-the-energy-realm/"

org("org-red-rocket", "Red Rocket",
    [ind("renewable-development", evidence="Integrated renewable energy IPP that develops, designs, constructs, operates and owns utility-scale grid-connected wind, solar, hydro and biomass projects.", url=RED_ROCKET),
     ind("independent-power-production", evidence="Projects awarded under REIPPPP bid windows and private bilateral PPAs; Roggeveld wind farm feeds the Eskom grid.", url=RED_ROCKET_IOL)],
    [cap("project-development", evidence="Portfolio of 377 MW in operation, under construction and awarded under public and private bids, plus a development pipeline above 2 GW.", url=RED_ROCKET),
     cap("capital-project-management", evidence="Financial close reached on the R5.2 billion, 300 MW Tournee Solar Park on Eskom-leased land at Standerton.", url=RED_ROCKET_TOURNEE),
     cap("project-finance", evidence="Raised US$160 million from Inspired Evolution, Bill Kilgore Investments, FMO and STOA in 2023.", url=RED_ROCKET_IOL),
     cap("commodity-trading", status="unknown", confidence="probable", evidence="An Engineering News article of 2026-02-04 reports a NERSA electricity trading licence granted in December 2025, but nothing read describes how energy trading is accounted for, so this stays unresearched."),
     cap("multi-entity-consolidation", status="unknown", evidence="Operates across several African countries, but no group structure was read.", url=""),
     cap("hedging-derivative-accounting", status="unknown", evidence="The company profile describes ZAR, USD and EUR currency exposure in strategy terms only; no hedging arrangement was read.")],
    [src(RED_ROCKET, "company-website", "Company profile: integrated renewable IPP, founded 2012, HQ Cape Town, 51-200 employees, wind/solar/hydro/biomass, 377 MW portfolio with 2 GW+ pipeline.", "probable"),
     src(RED_ROCKET_EN, "news", "5.3 GW portfolio across REIPPPP and C&I; six solar projects totalling 1,402 MWp awarded in Bid Window 7; NERSA electricity trading licence granted December 2025; Witberg (108 MW), Overberg (400 MW) and Tournee (331 MWp) C&I projects."),
     src(RED_ROCKET_TOURNEE, "news", "Financial close on the R5.2 billion Tournee Solar Park: 463,000 bifacial modules, 132 kV connection, ~720 GWh a year over 20 years, Standerton site."),
     src(RED_ROCKET_IOL, "news", "1,000 MW of projects in operation, under construction and near financial close across South Africa, Uganda, Zambia and Mali; Roggeveld wind 147 MW installed / 140 MW contracted; three Bid Window 5 onshore wind wins.", "probable")],
    legal="Red Rocket South Africa (Pty) Ltd", aliases=["Red Rocket Energy", "Red Rocket South Africa"],
    website="http://www.redrocket.energy",
    locations=[loc("Cape Town", "Western Cape", RED_ROCKET)],
    scales=[scale("employees", "51-200 employees", "third-party-estimate", "2026", RED_ROCKET)],
    notes="Upgraded from a stub on 2026-10-08: previously only a directory mention with no website or portfolio.")

org("org-reatile-renewables", "Reatile Renewables",
    [ind("renewable-development", confidence="probable", evidence="Consortium partner on the 89 MW Castle Wind Farm financing.", url=IPP_ACED)],
    [cap("project-development", confidence="probable", evidence="Party to a wind project that reached financial close.", url=IPP_ACED),
     cap("project-finance", confidence="probable", evidence="Achieved financial close on the 89 MW Castle Wind Farm with AIIM and ACED.", url=IPP_ACED)],
    [src(IPP_ACED, "industry-directory", "AIIM-led consortium financing for the 89 MW Castle Wind Farm in the Northern Cape.", "probable")],
    legal="Reatile Renewables (Pty) Ltd", status="needs-verification",
    notes="Website and broader portfolio not established from the sources read.")

org("org-edf-renewables-sa", "EDF Renewables South Africa",
    [ind("renewable-development", confidence="probable", evidence="Named as preferred bidder alongside Mulilo Energy in a South African renewable procurement.", url=MULILO)],
    [cap("project-development", status="unknown", confidence="probable", evidence="Preferred bidder status on a renewable project with a local developer is reported, but development activity is not evidenced, so this stays unresearched.")],
    [src(MULILO, "industry-directory", "Consortium of Mulilo Energy and EDF Renewables (South Africa) selected as preferred bidders.", "probable")],
    status="needs-verification",
    notes="South African entity details not established from the sources read.")

# --- FMCG distribution and retail -------------------------------------------

BIDFOOD = "https://www.zoominfo.com/c/bidfood-south-africa/425369067"
org("org-bidfood", "Bidfood South Africa",
    [ind("foodservice-distribution", evidence="Leading broadline supplier of frozen, chilled, ambient grocery and allied products to foodservice businesses.", url=BIDFOOD)],
    [cap("cold-storage-operations", status="unknown", confidence="probable", evidence="The company profile describes frozen and chilled product distribution and a branch network, which implies refrigerated storage, but no source evidences a cold store."),
     cap("temperature-controlled-distribution", evidence="Frozen and chilled delivery to over 27,000 customers.", url=BIDFOOD),
     cap("distribution-network", evidence="18 branches located in major provinces.", url="https://rocketreach.co/bidfood-south-africa-profile_b4440d4dfaaba22e"),
     cap("warehouse-operations", evidence="Broadline warehousing and delivery operations.", url=BIDFOOD),
     cap("inventory-management", evidence="Grocery, frozen and chilled stock managed across branches.", url=BIDFOOD),
     cap("customer-credit", status="unknown", evidence="Foodservice credit terms not stated in the sources read.", url=""),
     cap("multi-entity-consolidation", evidence="Part of BidCorp Limited, an international broadline food services company.", url=BIDFOOD)],
    [src(BIDFOOD, "business-directory", "Head office 60 Saturn Crescent, Linbro Business Park; website bidfood.co.za; established 1988.", "probable"),
     src("https://rocketreach.co/bidfood-south-africa-profile_b4440d4dfaaba22e", "business-directory", "18 branches in major provinces and over 27,000 customers.", "probable"),
     src(COLDSA, "industry-report", "Bidfood operates a branch in Bloemfontein serving foodservice customers.", "probable")],
    aliases=["Bidfood"], website="https://www.bidfood.co.za",
    locations=[loc("Sandton", "Gauteng", BIDFOOD), loc("Bloemfontein", "Free State", COLDSA)],
    scales=[scale("sites", "18 branches in major provinces", "third-party-estimate", "2026", "https://rocketreach.co/bidfood-south-africa-profile_b4440d4dfaaba22e")])

SHOPRITE = "https://www.moneyweb.co.za/tools-and-data/click-a-company/SHP/"
org("org-shoprite-holdings", "Shoprite Holdings",
    [ind("grocery-retail", evidence="Africa's largest food retailer, operating 3,478 stores across eight countries.", url=SHOPRITE)],
    [cap("multi-site-operations", evidence="3,478 stores across eight countries.", url=SHOPRITE),
     cap("distribution-network", status="unknown", confidence="probable", evidence="Supermarket retailing at the reported scale requires own distribution, but the source read describes no distribution centre network."),
     cap("inventory-management", status="unknown", confidence="probable", evidence="Stock management across the reported store network is implied by scale, but the source read does not state it."),
     cap("group-consolidation", evidence="Investment holding company with primary JSE listing and three secondary listings.", url=SHOPRITE),
     cap("multi-entity-consolidation", evidence="Acquired Massmart's Rhino, Massfresh and Cash & Carry businesses (2022) and 94 Massmart stores (2023).", url="https://pitchbook.com/profiles/company/59352-58")],
    [src(SHOPRITE, "corporate-disclosure", "Company profile: investment holding company headquartered in Cape Town, 3,478 stores across eight countries, JSE Food Retailers and Wholesalers sector."),
     src("https://www.morningstar.com/stocks/xjse/shp/quote", "business-directory", "Approximately 168,000 employees and website shopriteholdings.co.za.", "probable"),
     src("https://pitchbook.com/profiles/company/59352-58", "business-directory", "Acquisitions of Massmart food businesses and 94 stores.", "probable")],
    website="https://www.shopriteholdings.co.za",
    locations=[loc("Cape Town", "Western Cape", SHOPRITE)],
    scales=[scale("employees", "approximately 168,000 employees", "third-party-estimate", "2026", "https://www.morningstar.com/stocks/xjse/shp/quote")])

org("org-massmart", "Massmart Holdings",
    [ind("grocery-retail", confidence="probable", evidence="Food retail and wholesale businesses including Rhino, Massfresh and Cash & Carry.", url="https://pitchbook.com/profiles/company/59352-58"),
     ind("fmcg-wholesale", primary=False, confidence="probable", evidence="Cash & Carry wholesale operations.", url="https://pitchbook.com/profiles/company/59352-58")],
    [cap("multi-site-operations", status="unknown", confidence="probable", evidence="A South African store network is implied by the scope of the acquisition, but no source describes multi-site operations."),
     cap("inventory-management", status="unknown", evidence="Not stated in the sources read.", url="")],
    [src("https://pitchbook.com/profiles/company/59352-58", "business-directory", "Shoprite acquired Massmart's Rhino, Massfresh and Cash & Carry businesses in 2022 and 94 stores in 2023.", "probable"),
     src(SHOPRITE, "corporate-disclosure", "Listed among JSE comparables as BOXER / Massmart food retail peers.", "probable")],
    status="needs-verification",
    notes="Current ownership structure after the 2022-2023 transactions is not established from the sources read. Also present in the Accounting & Finance dataset as Massmart.")

org("org-spar-group", "SPAR Group",
    [ind("grocery-retail", confidence="probable", evidence="Listed South African food retailer in JSE market data.", url=SHOPRITE)],
    [cap("franchise-network", status="unknown", evidence="Retail model not evidenced in the sources read.", url=""),
     cap("distribution-network", status="unknown", evidence="Distribution centres not evidenced in the sources read.", url="")],
    [src(SHOPRITE, "corporate-disclosure", "Listed as a JSE food retail comparable.", "probable")],
    status="needs-verification",
    notes="Website, head office and operating model not established from the sources read.")

# ---------------------------------------------------------------------------
# Corporate relationships (factual, evidenced)
# ---------------------------------------------------------------------------

RELATIONSHIPS = [
    ("rel-sola-wbho", "verified-partnership", "org-sola", "org-wbho",
     "The Naos 1 EPC contractor is a SOLA Build and WBHO joint venture.",
     "https://www.greenbuildingafrica.co.za/sola-group-reaches-financial-close-and-starts-construction-on-landmark-hybrid-solar-and-battery-project-in-south-africa/", "confirmed"),
    ("rel-pnp-boxer", "parent-of", "org-pick-n-pay", "org-boxer",
     "Pick n Pay sold a 34.4% stake in Boxer in the November 2024 IPO and retained 65.6%.",
     "https://www.reuters.com/business/retail-consumer/south-africas-pick-n-pay-raises-471-mln-boxer-ipo-2024-11-25/", "confirmed"),
    ("rel-cch-ccs", "parent-of", "org-commercial-cold-holdings", "org-ccs-logistics",
     "CCS is proud to be part of the Commercial Cold Holdings (CCH) Group.", "https://www.ccslogistics.co.za/home", "confirmed"),
    ("rel-cch-sequence", "parent-of", "org-commercial-cold-holdings", "org-sequence-logistics",
     "Sequence Logistics listed as a Commercial Cold Holdings subsidiary acquired 2023-08-08.", "https://pitchbook.com/profiles/company/510085-63", "probable"),
    ("rel-cch-idube", "parent-of", "org-commercial-cold-holdings", "org-idube-cold-storage",
     "iDube Cold Storage listed as a Commercial Cold Holdings subsidiary acquired 2024-08-26.", "https://pitchbook.com/profiles/company/510085-63", "probable"),
    ("rel-cch-pecs", "parent-of", "org-commercial-cold-holdings", "org-pecs",
     "Port Elizabeth Cold Storage listed as a Commercial Cold Holdings investment acquired 2025-11-08.", "https://pitchbook.com/profiles/company/510085-63", "probable"),
    ("rel-quantum-nova", "parent-of", "org-quantum-foods", "org-nova-feeds",
     "Nova Feeds named as a Quantum Foods subsidiary.", "https://www.foodbusinessafrica.com/top100/", "probable"),
    ("rel-ssk-soill", "parent-of", "org-ssk", "org-southern-oil",
     "Southern Oil (SOILL) is listed in the SSK group structure.", "https://www.ssk.co.za/en/about/group-structure/", "confirmed"),
    ("rel-aced-reatile", "verified-partnership", "org-aced", "org-reatile-renewables",
     "Consortium with AIIM achieved financial close on the 89 MW Castle Wind Farm.", "https://ippjournal.com/company/african-clean-energy-developments-aced", "probable"),
    ("rel-mulilo-edf", "verified-partnership", "org-mulilo", "org-edf-renewables-sa",
     "Mulilo Energy and EDF Renewables (South Africa) selected as preferred bidders on a renewable project.", "https://za.linkedin.com/company/mulilo-renewable-energy", "probable"),
    ("rel-shoprite-massmart", "acquired", "org-shoprite-holdings", "org-massmart",
     "Shoprite acquired Massmart's Rhino, Massfresh and Cash & Carry businesses (2022) and 94 stores (2023).", "https://pitchbook.com/profiles/company/59352-58", "probable"),
]

# ---------------------------------------------------------------------------
# Recruiter intelligence (judgment, kept separate from company facts)
# ---------------------------------------------------------------------------

INTELLIGENCE = [
    ("ri-vector-cold-chain", "org-vector-logistics", "strong-source", "financial-manager-cold-chain",
     "Cold chain distribution business with multi-temperature DCs and published operating metrics; strong source for operational finance exposure in a cold-chain environment.",
     "probable", "Company website operating metrics reviewed 2026-10-08", "Talent Tree", "2026-10-08"),
    ("ri-ccs-reference", "org-ccs-logistics", "client-preferred", "financial-manager-cold-chain",
     "Client entity for the commercial cold storage Financial Manager assignment; retained as the reference company rather than a sourcing target.",
     "confirmed", "Client brief", "Talent Tree", "2026-10-08"),
    ("ri-bester-reference", "org-bester-feed-grain", "client-preferred", "head-of-finance-commodity",
     "Client entity for the Head of Finance commodity trading assignment.",
     "confirmed", "Client brief", "Talent Tree", "2026-10-08"),
    ("ri-slm-reference", "org-slm-developments", "client-preferred", "group-financial-manager-property",
     "Client entity for the property development assignment; verified identity SLM Developments (Pty) Ltd.",
     "confirmed", "Client brief and company registration K2019081416", "Talent Tree", "2026-10-08"),
    ("ri-nwk-trading", "org-nwk", "strong-source", "head-of-finance-commodity",
     "Publishes grain marketing, price risk management and Safex broker services; strong source for commodity trading finance exposure where evidence holds.",
     "probable", "Company grain marketing page reviewed 2026-10-08", "Talent Tree", "2026-10-08"),
    ("ri-rabie-development", "org-rabie-property-group", "strong-source", "group-financial-manager-property",
     "Long-established Western Cape developer with a multi-project portfolio; strong source for development project finance exposure.",
     "probable", "Company page reviewed 2026-10-08", "Talent Tree", "2026-10-08"),
]

# ---------------------------------------------------------------------------
# Batch 2 (added 2026-10-08): gap companies researched to close the coverage
# holes in property investment, contract logistics and FMCG distribution.
# One entry from the original gap list was deliberately NOT added: nukor.co.za
# is Nukor Sawmilling, Woodworking & Agricultural Equipment, the South African
# representative for CPM feed-milling machinery. It is an equipment supplier,
# not an animal-feed manufacturer, so "Nukor Feeds" was a mistaken assumption
# rather than an unresearched company.
# ---------------------------------------------------------------------------

HYPROP = "https://pitchbook.com/profiles/company/61315-21"
HYPROP_ORG = "https://theorg.com/org/hyprop-investments-ltd"
HYPROP_LI = "https://au.linkedin.com/company/hyprop-investments-limited"

org("org-hyprop", "Hyprop Investments",
    [ind("property-investment", evidence="Specialist shopping centre REIT owning and managing commercial real estate across South Africa, sub-Saharan Africa and South-Eastern Europe.", url=HYPROP),
     ind("retail-property", primary=False, evidence="South African portfolio includes Canal Walk, Capegate, Clearwater, Hyde Park Corner, Rosebank Mall, Somerset Mall, The Glen and Woodlands.", url=HYPROP_ORG)],
    [cap("property-holding-structures", evidence="REIT structure with listed property portfolio; JSE-listed as HYP.", url=HYPROP),
     cap("multi-site-operations", evidence="Portfolio of shopping centres in major metropolitan areas across three regions, plus sub-Saharan African interests in Zambia, Ghana and Nigeria.", url=HYPROP_ORG),
     cap("multi-entity-consolidation", evidence="Group reports consolidated South African and sub-Saharan African revenue streams separately.", url=HYPROP),
     cap("capital-expenditure", evidence="Redevelopment and refurbishment of existing centres is a stated investment approach, including the Rosebank Mall expansion.", url=HYPROP_ORG),
     cap("foreign-currency-transactions", evidence="Investments outside South Africa in sub-Saharan Africa and South-Eastern Europe.", url=HYPROP_ORG),
     cap("development-cost-accounting", status="unknown", evidence="Develops and redevelops centres, but the sources read do not state how development costs are capitalised.", url=""),
     cap("hedging-derivative-accounting", status="unknown", evidence="The PitchBook profile reports total debt of US$808 million but no hedging policy, so this stays unresearched.")],
    [src(HYPROP, "business-directory", "Public company, JSE ticker HYP, HQ Cradock Heights, 21 Cradock Avenue, Rosebank; REIT primary industry; 237 total employees; FY2026 revenue US$302 million, total assets US$2.579 billion.", "probable"),
     src(HYPROP_ORG, "news", "Portfolio detail: South African malls plus Manda Hill (Lusaka), Accra Mall, Achimota Mall, West Hills Mall (Ghana), Ikeja City Mall (Lagos) and Kumasi City Mall under construction.", "probable"),
     src(HYPROP_LI, "company-website", "Company size 201-500 employees, headquarters Johannesburg, founded 1987, public company.", "probable")],
    legal="Hyprop Investments Limited", aliases=["Hyprop"],
    website="https://www.hyprop.co.za",
    locations=[loc("Johannesburg", "Gauteng", HYPROP)],
    scales=[scale("employees", "237 total employees", "third-party-estimate", "2026", HYPROP)],
    notes="Registered office listed by one source as a London address; South African operating headquarters is Rosebank, Johannesburg.")

VUKILE = "https://bouncewatch.com/company/vukile-property-fund"

org("org-vukile", "Vukile Property Fund",
    [ind("property-investment", evidence="Specialist retail REIT operating in South Africa, Spain and Portugal.", url=VUKILE)],
    [cap("property-holding-structures", evidence="REIT; one of the first to receive REIT status from the JSE.", url=VUKILE),
     cap("multi-site-operations", evidence="Geographically diversified portfolio valued at R37 billion across South Africa, Spain and Portugal.", url=VUKILE),
     cap("multi-entity-consolidation", evidence="58% of assets held through the Madrid-listed subsidiary Castellana Properties Socimi.", url=VUKILE),
     cap("foreign-currency-transactions", evidence="Majority of the portfolio is denominated outside South Africa via a Spanish listed subsidiary.", url=VUKILE),
     cap("development-cost-accounting", status="unknown", evidence="No development accounting policy was read.", url=""),
     cap("hedging-derivative-accounting", status="unknown", evidence="Euro-denominated assets are described, but no hedging arrangement was read.", url="")],
    [src(VUKILE, "business-directory", "Specialist retail REIT, founded 2004, Johannesburg, 69 employees; R37 billion portfolio, 58% in Spain through Castellana Properties Socimi; JSE-listed since 2004 and Namibian exchange since 2007.", "probable")],
    legal="Vukile Property Fund Limited", aliases=["Vukile"],
    website="https://www.vukile.co.za", status="needs-verification",
    locations=[loc("Johannesburg", "Gauteng", VUKILE)],
    scales=[scale("employees", "69 employees", "third-party-estimate", "2026", VUKILE)],
    notes="Single aggregator source read on 2026-10-08; primary investor relations material not yet reviewed, hence needs-verification.")

DSV = "https://www.dsv.com/en-za/"
DSV_CL = "https://www.dsv.com/en-za/our-solutions/contract-logistics"
DSV_STRUCT = "https://www.dsv.com/en-za/about-dsv/company-structure"
DSV_PARK = "https://www.aircargonews.net/dsv-inaugurates-its-largest-logistics-centre-in-africa/1043908.article"

org("org-dsv-sa", "DSV South Africa",
    [ind("contract-logistics", evidence="Contract logistics division designs, implements and improves warehousing and value-add services throughout South Africa.", url=DSV_STRUCT),
     ind("freight-forwarding", primary=False, evidence="Air & Sea division offers air, ocean and road freight forwarding and customs brokerage from five branches at major terminals and ports.", url=DSV_STRUCT),
     ind("road-freight", primary=False, evidence="Road division specialises in configured supply chain solutions, secure courier and last-mile parcel delivery.", url=DSV_STRUCT)],
    [cap("warehouse-operations", evidence="Network across South Africa with more than 320,000 square metres of warehouse space.", url=DSV_CL),
     cap("multi-site-operations", evidence="Footprint includes Johannesburg, Cape Town, Durban, East London, Gqeberha and Pretoria.", url=DSV_CL),
     cap("distribution-network", evidence="Multi-client campuses with integrated warehousing and distribution.", url=DSV_CL),
     cap("inventory-management", evidence="Inbound processing, value-added services, kitting, labelling and quality inspection described as standard offerings.", url=DSV_CL),
     cap("cold-storage-operations", status="unknown", confidence="probable", evidence="The contract logistics page lists cold chain among value-added services, but no facility, certification or capacity detail was read."),
     cap("wms", status="unknown", evidence="No warehouse management system named in the sources read.", url=""),
     cap("tms", status="unknown", evidence="No transport management system named in the sources read.", url=""),
     cap("foreign-currency-transactions", evidence="Part of DSV A/S, listed on NASDAQ Copenhagen, operating in more than 80 countries.", url=DSV_STRUCT)],
    [src(DSV, "company-website", "More than 50 years in South Africa; national footprint across Johannesburg, Cape Town, Durban and Pretoria supported by a network in more than 90 countries."),
     src(DSV_CL, "company-website", "Contract logistics network with total capacity of more than 320,000 square metres of warehouse space and named site locations."),
     src(DSV_STRUCT, "company-website", "Divisional structure in South Africa: Air & Sea (five branches), Road, Contract Logistics; DSV A/S listed on NASDAQ Copenhagen."),
     src(DSV_PARK, "news", "DSV Park Gauteng near OR Tambo: 130,000 sq m site comprising a 79,000 sq m warehouse, 41,000 sq m cross-dock and 10,000 sq m of offices, consolidating the South African operation.", "probable")],
    legal="DSV South Africa", aliases=["DSV", "DSV Africa"],
    website=DSV, status="needs-verification",
    locations=[loc("Johannesburg", "Gauteng", DSV_PARK), loc("Cape Town", "Western Cape", DSV_CL), loc("Durban", "KwaZulu-Natal", DSV_CL)],
    notes="South African legal entity name and registration not established from the sources read.")

KN = "https://theloadstar.com/kuehnenagel-significantly-expands-footprint-in-africa/"

org("org-kuehne-nagel-sa", "Kuehne+Nagel South Africa",
    [ind("freight-forwarding", evidence="Full-service logistics provider; African network managed from a regional control tower in South Africa.", url=KN),
     ind("contract-logistics", primary=False, confidence="probable", evidence="Described as a full-service logistics provider combining local presence with global operating systems; contract logistics scope not detailed in the source read.", url=KN)],
    [cap("multi-site-operations", evidence="African network represented in 18 countries, coordinated from a control tower in Durban.", url=KN),
     cap("distribution-network", confidence="probable", evidence="Integrated network across the continent with shipment visibility and cargo-flow management.", url=KN),
     cap("regulatory-reporting", status="unknown", confidence="probable", evidence="The network is externally audited for compliance and ethical standards. An external audit is not regulatory reporting, so this stays unresearched."),
     cap("warehouse-operations", status="unknown", evidence="No South African warehousing footprint was read.", url=""),
     cap("foreign-currency-transactions", status="unknown", evidence="Part of a Swiss-headquartered global group, but South African currency arrangements were not read.", url="")],
    [src(KN, "news", "Kuehne+Nagel present in Africa since opening its first office in Johannesburg in 1954; regional control tower in Durban; expanded network covers 18 African countries.", "probable")],
    legal="Kuehne + Nagel (Pty) Ltd", aliases=["Kuehne+Nagel", "Kuehne + Nagel"],
    website="https://home.kuehne-nagel.com", status="needs-verification",
    locations=[loc("Durban", "KwaZulu-Natal", KN), loc("Johannesburg", "Gauteng", KN)],
    notes="Legal entity spelling and South African service lines need primary-source confirmation.")

DHL_SC = "https://shiftmate.co.za/companies/dhl-supply-chain-south-africa"
DHL_INV = "https://procurementmag.com/news/dhl-group-invests-in-africa"

org("org-dhl-supply-chain-sa", "DHL Supply Chain South Africa",
    [ind("contract-logistics", evidence="Contract logistics division of Deutsche Post DHL Group running dedicated warehousing, distribution and supply chain operations for multinational and domestic clients.", url=DHL_SC)],
    [cap("warehouse-operations", evidence="Managed warehouse sites and dedicated distribution centres in FMCG, retail, automotive, healthcare and technology.", url=DHL_SC),
     cap("multi-site-operations", evidence="Operations in Johannesburg (head office), Cape Town, Durban, Gqeberha and Centurion.", url=DHL_SC),
     cap("inventory-management", evidence="Inventory controller and receiving roles across managed sites; Lean and Six Sigma process frameworks applied.", url=DHL_SC),
     cap("food-safety-compliance", status="unknown", confidence="probable", evidence="Temperature-sensitive and regulated sectors are named in the group investment announcement, but no certification was read."),
     cap("wms", status="unknown", evidence="No warehouse system named in the sources read.", url=""),
     cap("foreign-currency-transactions", evidence="Applies global group standards and is part of a US$350 million sub-Saharan African investment programme.", url=DHL_INV)],
    [src(DHL_SC, "business-directory", "Approximately 6,000 employees in South Africa across managed warehouse sites, distribution centres and support functions; head office Johannesburg; founded 1969.", "probable"),
     src(DHL_INV, "news", "DHL Group confirmed a US$350 million sub-Saharan African investment; DHL Supply Chain is scaling warehousing, fulfilment and fleet capacity in South Africa for temperature-sensitive, regulated and fast-moving sectors.", "probable")],
    legal="DHL Supply Chain South Africa", aliases=["DHL Supply Chain"],
    website="https://www.dhl.com/za-en/home/our-divisions/supply-chain.html", status="needs-verification",
    locations=[loc("Johannesburg", "Gauteng", DHL_SC), loc("Cape Town", "Western Cape", DHL_SC), loc("Durban", "KwaZulu-Natal", DHL_SC)],
    scales=[scale("employees", "6,000+ employees in South Africa", "third-party-estimate", "2026", DHL_SC)],
    notes="Registered South African entity name not established from the sources read.")

PNP = "https://www.picknpayinvestor.co.za/pnp-at-a-glance.php"
PNP_WIKI = "https://en.wikipedia.org/wiki/Pick_n_Pay"
PNP_BOXER = "https://www.reuters.com/business/retail-consumer/south-africas-pick-n-pay-raises-471-mln-boxer-ipo-2024-11-25/"

org("org-pick-n-pay", "Pick n Pay Group",
    [ind("grocery-retail", evidence="Retail business in the FMCG industry operating 2,261 stores across multiple formats in six southern African countries.", url=PNP),
     ind("fmcg-wholesale", primary=False, confidence="probable", evidence="Group supplies a franchise network alongside company-owned stores.", url=PNP)],
    [cap("retail-trading", evidence="Supermarkets, hypermarkets, clothing, liquor and express formats across 2,261 stores.", url=PNP),
     cap("franchise-network", evidence="620 franchised Pick n Pay supermarkets plus franchised Boxer and TM stores.", url=PNP),
     cap("distribution-network", evidence="Localised network of distribution centres, the main one being the Eastport Distribution Centre.", url=PNP_WIKI),
     cap("multi-site-operations", evidence="2,102 South African stores plus eSwatini, Zambia and Botswana operations.", url=PNP),
     cap("multi-entity-consolidation", evidence="Group consolidates Pick n Pay, Boxer (65.6% held) and an associate stake in TM Supermarkets.", url=PNP_BOXER),
     cap("inventory-accounting", status="unknown", confidence="probable", evidence="A multi-format retail estate with franchised and owned stock models is described, but no source states the inventory accounting process, so this stays unresearched."),
     cap("group-consolidation", evidence="Listed holding company reporting across owned, franchised and associate operations.", url=PNP),
     cap("cost-accounting", status="unknown", evidence="No costing or margin accounting policy was read.", url=""),
     cap("erp-sap", status="unknown", evidence="No ERP system named in the sources read.", url="")],
    [src(PNP, "company-website", "2,261 stores across six countries: 950 owned and 620 franchised Pick n Pay stores, 564 owned Boxer stores, 73 TM associate stores; 211 supermarkets, 190 Express stores and seven market stores."),
     src(PNP_WIKI, "news", "Founded 1967 in Cape Town, HQ Kenilworth, JSE-listed; 2,269 stores across seven countries in 2025; approximately 90,000 employees; Eastport Distribution Centre; 65.6% stake retained in Boxer.", "probable"),
     src(PNP_BOXER, "news", "Boxer IPO raised R8.5 billion for a 34.4% stake at R54 per share; Pick n Pay retained 65.6%.", "probable")],
    legal="Pick n Pay Group Limited", aliases=["Pick n Pay", "PnP"],
    website="https://www.picknpay.co.za",
    locations=[loc("Cape Town", "Western Cape", PNP_WIKI)],
    scales=[scale("employees", "approximately 90,000 employees", "third-party-estimate", "2024", PNP_WIKI),
            scale("sites", "2,261 stores", "source-reported", "2025", PNP)],
    notes="Store counts differ slightly between the investor page (2,261) and the encyclopedia summary (2,269); both are recorded with their sources.")

BOXER = "https://www.picknpayinvestor.co.za/pdf/investor-centre/boxer-ipo/boxer-itf-announcement.pdf"
BOXER_REUTERS = "https://www.reuters.com/business/retail-consumer/south-african-retailer-boxers-shares-jump-16-market-debut-2024-11-28/"

org("org-boxer", "Boxer Superstores",
    [ind("grocery-retail", evidence="Discount grocery retailer trading through Boxer Superstores, Boxer Liquors and Boxer Build formats in South Africa and eSwatini.", url=BOXER)],
    [cap("retail-trading", evidence="489 stores across three formats as at 25 August 2024: 300 Superstores, 159 Liquors and 30 Build.", url=BOXER),
     cap("multi-site-operations", evidence="Store estate across all South African provinces plus eSwatini, with a rollout programme of 60 to 70 new stores a year.", url=BOXER_REUTERS),
     cap("distribution-network", evidence="Distribution centre added in Benoni, Gauteng in late 2023, with a further DC planned in FY2026 to serve about 200 additional stores.", url=BOXER),
     cap("inventory-accounting", status="unknown", confidence="probable", evidence="The investor announcement describes a focused range of approximately 3,000 SKUs with a confined-label programme. A product range is not an accounting process, so this stays unresearched."),
     cap("cost-accounting", status="unknown", confidence="probable", evidence="The investor announcement describes a low cost-to-turnover ratio as the basis of the discount operating model. A reported ratio is not evidence of a costing process, so this stays unresearched."),
     cap("working-capital-management", evidence="Uses an intra-month facility for working capital requirements.", url=BOXER),
     cap("wms", status="unknown", evidence="The investor announcement describes investment in optimised stock management and digitisation of head office processes without naming a system."),
     cap("franchise-network", status="unknown", evidence="The investor announcement reports approximately 2,700 registered spaza shop customers but does not say whether they are franchised.")],
    [src(BOXER, "corporate-disclosure", "Boxer introduction to financial investors: 489 stores at 25 August 2024, three formats, approximately 30,000 employees, approximately 3,000 SKUs of which 600 confined label, Benoni DC added late 2023, further DC planned FY2026."),
     src(BOXER_REUTERS, "news", "Founded 1977 in KwaZulu-Natal; JSE listing November 2024 with a 34.4% stake sold and 65.6% retained by Pick n Pay; approximately 68% share of the discount grocery market; plans to double the store footprint in six to seven years.", "probable")],
    legal="Boxer Superstores (Pty) Ltd", aliases=["Boxer", "Boxer Build", "Boxer Liquors"],
    website="https://www.boxer.co.za", parent="org-pick-n-pay",
    locations=[loc("Westville", "KwaZulu-Natal", "https://en.wikipedia.org/wiki/Retailing_in_South_Africa")],
    scales=[scale("employees", "approximately 30,000 employees", "source-reported", "2024", BOXER),
            scale("sites", "489 stores", "source-reported", "2024-08-25", BOXER)],
    notes="Head office city taken from a retail-sector encyclopedia table; primary confirmation outstanding.")

FLM = "https://en.wikipedia.org/wiki/Food_Lover%27s_Market"

org("org-food-lovers", "Food Lover's Market",
    [ind("grocery-retail", evidence="Franchised fresh-focused supermarket chain operating in Southern Africa.", url=FLM)],
    [cap("retail-trading", evidence="Supermarket chain with integrated delis, bakeries and produce sections, plus convenience formats.", url=FLM),
     cap("franchise-network", evidence="Predominantly franchise-driven operating model; member of the Franchise Association of South Africa.", url=FLM),
     cap("multi-site-operations", evidence="More than 120 stores in Southern Africa as at 2025, including Botswana, Zimbabwe and Namibia.", url=FLM),
     cap("multi-entity-consolidation", evidence="Group owns Seattle Coffee Company, FreshStop and FVC International.", url=FLM),
     cap("distribution-network", status="unknown", confidence="probable", evidence="Distribution centres in each South African province are reported in secondary retail press but not in the primary source read.", url=""),
     cap("foreign-currency-transactions", evidence="Operations outside South Africa in Botswana, Zimbabwe and Namibia.", url=FLM),
     cap("cost-accounting", status="unknown", evidence="Privately held; no costing disclosure was read.", url="")],
    [src(FLM, "news", "Founded 1993 in Cape Town as Fruit & Veg City; HQ Brackenfell; 120+ stores in 2025; approximately 22,000 employees; subsidiaries Seattle Coffee Company, FreshStop, FVC International, Market Liquors.", "probable")],
    legal="Food Lover's Market", aliases=["Food Lovers Market", "FVC", "Fruit & Veg City"],
    website="https://www.foodloversmarket.co.za", status="needs-verification",
    locations=[loc("Cape Town", "Western Cape", FLM)],
    scales=[scale("employees", "22,000 employees", "third-party-estimate", "2025", FLM)],
    notes="Store counts vary between sources (120+ in 2025, 300+ in 2022); the difference reflects format and franchise counting and is left unresolved rather than averaged.")


# --- Batch 3 (2026-10-08): property funds and renewable developers ----------
# Researched gaps: Heriot REIT, Accelerate, Dipula, Scatec SA, Cennergi,
# Pele Green, Mainstream SA, SOLA Group.
#
# Deliberately NOT added: Exxaro Resources. Cennergi is its wholly owned
# subsidiary, but Exxaro is a mining group and the industry taxonomy has no
# mining node, so recording it would mean inventing a classification. It stays
# a gap and the affiliation is recorded in Cennergi's notes instead.

HERIOT_HY24 = "https://senspdf.jse.co.za/documents/2024/JSE/ISSE/HETE/HY2024.pdf"
HERIOT_FY23 = "https://senspdf.jse.co.za/documents/2023/jse/isse/HETE/FY2023.pdf"
HERIOT_FLASH = "https://propertyflash.co.za/2025-12-19/heriot-cements-its-position-as-well-managed-reit-with-transformative-2025/"
HERIOT_TV = "https://www.tradingview.com/symbols/JSE-HET/"
org("org-heriot", "Heriot REIT",
    [ind("property-investment", evidence="Approved as a REIT by the JSE; investment property across retail, industrial, office, specialised and residential sectors.", url=HERIOT_HY24)],
    [cap("property-holding-structures", evidence="Approved as a REIT by the JSE; investment property held directly and through subsidiaries including Safari RSA Investments.", url=HERIOT_FY23),
     cap("multi-site-operations", evidence="48 properties across all major sectors within South Africa.", url=HERIOT_HY24),
     cap("multi-entity-consolidation", evidence="Safari RSA Investments Limited consolidated into Heriot's results as at 30 June 2023.", url=HERIOT_FY23),
     cap("capital-expenditure", evidence="Solar plants installed across five major retail centres at a cost of R46,0 million.", url=HERIOT_FY23),
     cap("regulatory-reporting", evidence="Reviewed condensed consolidated financial statements published to the JSE for the year ended 30 June 2023.", url=HERIOT_FY23),
     cap("development-cost-accounting", status="unknown", confidence="probable", evidence="The group redevelops properties and disposed of Hagley, which was developing a 36 900m2 distribution centre for Ackermans, but no source describes development cost accounting."),
     cap("foreign-currency-transactions", status="unknown", confidence="probable", evidence="Operations in Namibia are reported by a third-party profile, but no source describes currency arrangements."),
     cap("hedging-derivative-accounting", status="unknown", evidence="No hedging policy was read.")],
    [src(HERIOT_HY24, "corporate-disclosure", "Group interim results for the six months ended 31 December 2023: portfolio valued at R9,372 billion, vacancy 1,6%, 48 properties, sector split 71% retail / 19% industrial / 3% office / 2% specialised / 4% residential; head office of 717m2 in Melrose Arch; registration 2017/167697/06; JSE code HET."),
     src(HERIOT_FY23, "corporate-disclosure", "Reviewed condensed consolidated financial statements for the year ended 30 June 2023: investment property R9,258 billion, Safari consolidation of R3,720 billion, R46,0 million of solar plants across five retail centres."),
     src(HERIOT_FLASH, "news", "December 2025: completed the acquisition of 100% of Safari Investments; R13 billion in assets; distribution per share 121,91 cents, up 14,3%; NAV per share R20,59, up 17,5%."),
     src(HERIOT_TV, "business-directory", "Company profile: founded by Steven Bernard Herring in 1998, headquartered in Johannesburg, listed on the JSE AltX in July 2017.", "probable")],
    legal="Heriot REIT Limited", aliases=["Heriot", "HET"],
    status="verified",
    locations=[loc("Johannesburg", "Gauteng", HERIOT_TV)],
    scales=[scale("sites", "48 properties", "source-reported", "2023-12-31", HERIOT_HY24)],
    notes="Portfolio value differs by reporting date: R9,258 billion at 30 June 2023, R9,372 billion at 31 December 2023, and R13 billion in assets reported in December 2025 after Safari Investments became wholly owned. The figures are not averaged. No company website was established from the sources read.")

APF_IAR = "https://www.accelerate-pf.co.za/wp-content/uploads/2026/07/APF_IAR_2026_Combined_V21.pdf"
APF_MW = "https://www.moneyweb.co.za/tools-and-data/click-a-company/APF/"
org("org-accelerate", "Accelerate Property Fund",
    [ind("property-investment", evidence="JSE-listed REIT with a portfolio focused on retail and commercial assets.", url=APF_IAR)],
    [cap("property-holding-structures", evidence="South African REIT listed on the JSE holding an investment property portfolio including assets held for sale.", url=APF_IAR),
     cap("multi-site-operations", evidence="Key properties include Fourways Mall, Cedar Square Shopping Centre, KPMG Crescent and the Citibank Building.", url=APF_IAR),
     cap("capital-expenditure", evidence="Sale of non-core assets to the value of R788,5 million for repayment of debt, and R126,9 million of total procurement spend.", url=APF_IAR),
     cap("foreign-currency-transactions", evidence="Single-tenant, long-term lease investments in Austria and Slovakia complement the local portfolio.", url=APF_MW),
     cap("regulatory-reporting", evidence="Unaudited interim consolidated condensed financial results published for the six months ended 30 September 2025.", url=APF_MW),
     cap("multi-entity-consolidation", status="unknown", confidence="probable", evidence="Austrian and Slovakian lease investments are held, but no source describes how the foreign entities are consolidated."),
     cap("development-cost-accounting", status="unknown", evidence="No development cost accounting was read.")],
    [src(APF_IAR, "corporate-disclosure", "Integrated Report 2026: investment property valued at R6,6 billion (2025: R7,7 billion); NAV per share R1,81; total gross lettable area 235 922m2; vacancies 10,9%; 40 employees (2025: 49)."),
     src(APF_MW, "business-directory", "Company profile: JSE-listed REIT; local portfolio of retail, commercial and industrial assets complemented by single-tenant long-term lease investments in Austria and Slovakia.")],
    legal="Accelerate Property Fund Limited", aliases=["Accelerate", "APF", "ACCPROP"],
    website="https://www.accelerate-pf.co.za",
    status="verified",
    scales=[scale("employees", "40 employees", "source-reported", "2026-03-31", APF_IAR)],
    notes="The 2026 integrated report does not state a head office city in the material read, so no location is recorded. Portfolio value fell from R7,7 billion to R6,6 billion as non-core assets were sold to repay debt.")

DIPULA_RF = "https://richerfin.com/markets/johannesburg-stock-exchange/DIBJ.J/"
DIPULA_FM = "https://www.financialmail.businessday.co.za/investing/2025-11-20-how-dipula-became-the-jses-biggest-money-spinner/"
DIPULA_RR = "https://rocketreach.co/dipula-income-fund-ltd-dib-profile_b45a983afc65f296"
org("org-dipula", "Dipula Income Fund",
    [ind("property-investment", evidence="JSE-listed REIT owning retail, office, industrial and residential rental assets throughout South Africa.", url=DIPULA_RF)],
    [cap("property-holding-structures", evidence="Internally managed JSE-listed REIT holding retail, office, industrial and residential rental assets.", url=DIPULA_RF),
     cap("multi-site-operations", evidence="80 shopping centres of roughly 10 000m2 to 20 000m2, with assets in all nine provinces.", url=DIPULA_FM),
     cap("capital-expenditure", evidence="Acquired the 24 000m2 Protea Gardens Mall in Soweto for R480 million, one of five transactions worth about R700 million.", url=DIPULA_FM),
     cap("regulatory-reporting", evidence="Audited annual financial statements for the year ended 31 August 2025 published to the JSE.", url=DIPULA_RF),
     cap("multi-entity-consolidation", status="unknown", evidence="No group structure or consolidation was read."),
     cap("development-cost-accounting", status="unknown", evidence="Refurbishment programmes are described, but no development cost accounting was read.")],
    [src(DIPULA_RF, "business-directory", "Company profile: approximately 166 properties with 879 007m2 of gross lettable area; 86 retail, 35 office, 45 industrial and four residential properties; revenue of R1 517 431 thousand for the year ended 31 August 2025."),
     src(DIPULA_FM, "news", "November 2025: portfolio doubled from R5,4 billion to R10,8 billion over a decade; 80 shopping centres; Protea Gardens Mall acquired for R480 million; NAV up 7,5%."),
     src(DIPULA_RR, "business-directory", "Company profile: Johannesburg-based REIT, portfolio spanning all nine provinces, 45 employees.", "probable")],
    legal="Dipula Income Fund Limited", aliases=["Dipula", "DIB"],
    status="verified",
    locations=[loc("Johannesburg", "Gauteng", DIPULA_RR)],
    scales=[scale("employees", "45 employees", "third-party-estimate", "2025", DIPULA_RR)],
    notes="Sources conflict and are not reconciled: property counts of 166 (Richerfin), 170 (MarketScreener, August 2023) and 80 shopping centres (Financial Mail, November 2025); portfolio values of R7,1 billion, R9,8 billion and R10,8 billion at different dates. No company website was established from the sources read.")

SCATEC_TGS = "https://www.tgs.com/reliable-operations-at-scale-inside-scatecs-kenhardt-hybrid-project"
SCATEC_MOGOBE = "https://www.engineeringnews.co.za/article/scatec-making-final-preparations-for-construction-of-r3bn-northern-cape-battery-project-2024-10-18"
SCATEC_EN = "https://www.engineeringnews.co.za/article/south-africa-to-add-further-solar-pv-in-2024-scatec-2024-01-08"
SCATEC_HTXT = "https://htxt.co.za/2025-12-273mw-solar-plant-fires-up-in-western-cape/"
org("org-scatec-sa", "Scatec South Africa",
    [ind("renewable-development", evidence="Developed the Kenhardt hybrid solar and battery project and the Grootfontein solar plants in South Africa.", url=SCATEC_EN),
     ind("independent-power-production", primary=False, evidence="Supplies dispatchable renewable power to the national grid under a 20-year power purchase agreement with Eskom.", url=SCATEC_TGS)],
    [cap("project-development", evidence="Developed the hybrid Kenhardt project of 540 MW solar PV with 225 MW/1 140 MWh of battery storage in the Northern Cape.", url=SCATEC_TGS),
     cap("project-finance", evidence="Financial close reached on the R3-billion Mogobe battery project on 16 October 2024 under a 15-year power purchase agreement.", url=SCATEC_MOGOBE),
     cap("capital-project-management", evidence="Scatec is the engineering, procurement and construction contractor for the Mogobe project and provides operations, maintenance and asset management services.", url=SCATEC_MOGOBE),
     cap("multi-project-management", evidence="Kenhardt in the Northern Cape, the 273 MW Grootfontein plants in the Western Cape and the 103 MW/412 MWh Mogobe project near Kathu are all Scatec projects.", url=SCATEC_EN),
     cap("multi-entity-consolidation", evidence="Scatec owns 51% of the equity in the Grootfontein project; H1 Holdings holds 46,5% and the Grootfontein Local Community Trust 2,5%.", url=SCATEC_HTXT),
     cap("foreign-currency-transactions", evidence="Kenhardt carries capital expenditure of US$1 billion.", url=SCATEC_HTXT),
     cap("regulatory-reporting", status="unknown", evidence="No statutory reporting for the South African entity was read.")],
    [src(SCATEC_TGS, "industry-report", "Kenhardt hybrid project: 540 MWp solar PV with 225 MW/1 140 MWh battery storage in the Northern Cape, delivering 150 MW of dispatchable power from 05:00 to 21:30 daily."),
     src(SCATEC_MOGOBE, "news", "October 2024: R3-billion Mogobe battery project of 103 MW/412 MWh near Kathu reached financial close; Scatec is EPC contractor and provides O&M and asset management."),
     src(SCATEC_EN, "news", "January 2024: Kenhardt trio of 540 MW solar and 1 140 MWh storage; financial close on the 273 MW Grootfontein trio, with completion expected in 2025."),
     src(SCATEC_HTXT, "news", "December 2025: commercial operations began at the 273 MW Grootfontein facility, the first in the Western Cape; Kenhardt capital expenditure of US$1 billion; Scatec owns 51% of the equity.")],
    legal="", aliases=["Scatec"],
    status="needs-verification",
    locations=[loc("Kenhardt", "Northern Cape", SCATEC_TGS),
               loc("Kathu", "Northern Cape", SCATEC_MOGOBE)],
    scales=[scale("capacity", "540 MW solar PV with 225 MW/1 140 MWh battery storage at Kenhardt", "source-reported", "2026", SCATEC_TGS)],
    notes="Scatec is a Norwegian group; the South African legal entity was not established from the sources read, so the record is flagged for verification rather than given a legal name. Project sites are recorded as locations because they are the operational footprint that was sourced.")

CENNERGI_SQ = "https://solarquarter.com/2025-12-15/exxaro-expands-renewable-portfolio-in-south-africa-with-majority-stake-acquisition-in-213-mw-wind-and-solar-assets/"
CENNERGI_ET = "https://economictimes.indiatimes.com/industry/energy/power/tata-powers-south-african-joint-venture-operationalises-134-mw-wind-farm/articleshow/53448522.cms"
CENNERGI_BID = "https://economictimes.indiatimes.com/industry/energy/power/tata-power-exxaro-jv-cennergi-to-develop-two-wind-projects-in-south-africa/articleshow/13409497.cms"
org("org-cennergi", "Cennergi",
    [ind("renewable-development", evidence="Developed the Amakhala Emoyeni and Tsitsikamma wind farms under the Renewable Energy Independent Power Producer Procurement Programme.", url=CENNERGI_BID),
     ind("independent-power-production", primary=False, evidence="Operational wind and solar assets supplying electricity to Eskom under 20-year take-or-pay power purchase agreements.", url=CENNERGI_SQ)],
    [cap("project-development", evidence="Developed the 134 MW Amakhala Emoyeni and 95 MW Tsitsikamma wind farms, both of which reached commercial operations.", url=CENNERGI_ET),
     cap("multi-site-operations", evidence="Operating assets in the Western Cape (Gouda Wind Farm) and the Northern Cape (Sishen Solar Facility).", url=CENNERGI_SQ),
     cap("multi-entity-consolidation", evidence="Cennergi will acquire Acciona's 80% stake in Acciona Energy South Africa O&M; the remaining 20% is held by Soul City.", url=CENNERGI_SQ),
     cap("capital-project-management", evidence="A further 180 MW of net capacity is under construction.", url=CENNERGI_SQ),
     cap("project-finance", status="unknown", confidence="probable", evidence="The Gouda and Sishen acquisition is corporate rather than project finance, and no lender structure was read."),
     cap("foreign-currency-transactions", status="unknown", evidence="No currency arrangements were read."),
     cap("regulatory-reporting", status="unknown", evidence="No statutory reporting was read.")],
    [src(CENNERGI_SQ, "news", "December 2025: Exxaro's wholly owned subsidiary Cennergi is acquiring majority stakes in the 138 MW Gouda Wind Farm and the 75 MW Sishen Solar Facility from Acciona Energia for R1,7 to R1,8 billion, plus Acciona's 80% of the O&M company; net operating capacity rises from 200 MW to about 317 MW."),
     src(CENNERGI_ET, "news", "July 2016: Cennergi (Pty) Ltd achieved commercial operations for the 134 MW Amakhala Emoyeni wind farm."),
     src(CENNERGI_BID, "news", "Cennergi was the preferred bidder for the 139 MW Amakhala and 95 MW Tsitsikamma wind projects, a total of 234 MW, under the second window of the procurement programme.")],
    legal="Cennergi (Pty) Ltd", aliases=["Cennergi Energy"],
    status="verified",
    locations=[loc("Gouda", "Western Cape", CENNERGI_SQ),
               loc("Sishen", "Northern Cape", CENNERGI_SQ)],
    scales=[scale("capacity", "200 MW net operating, rising to about 317 MW", "source-reported", "2025-12-15", CENNERGI_SQ)],
    notes="Wholly owned subsidiary of Exxaro Resources. Exxaro is deliberately not in this register: it is a mining group and the industry taxonomy has no mining node, so adding it would mean inventing a classification. Ownership history: originally a 50:50 joint venture between Exxaro and Khopoli Investments, a Tata Power subsidiary, which divested its stake. No company website was established from the sources read.")

PELE_TR = "https://www.pelegreenenergy.com/track-record"
PELE_NORFUND = "https://www.norfund.no/investment-in-new-south-african-energy-platform-to-avoid-1-9-million-tons-of-co2/"
PELE_RENEWS = "https://renews.biz/97396/sa-ipp-reaches-financial-close-on-100mw-pv-plant/"
org("org-pele-green", "Pele Green Energy",
    [ind("renewable-development", evidence="Develops, owns, builds and operates renewable energy projects; among the first independent power producers to operate in South Africa.", url=PELE_TR),
     ind("independent-power-production", primary=False, evidence="Feeds the national grid and supplies private energy-intensive users.", url=PELE_TR)],
    [cap("project-development", evidence="Develops, owns, builds and operates renewable energy projects, with 980 MW in operation and 670 MW under construction.", url=PELE_NORFUND),
     cap("project-finance", evidence="Financial close reached on the 100 MW Sonvanger Solar PV plant, the first utility-scale project closed by a sole sponsor and single IPP in South Africa.", url=PELE_RENEWS),
     cap("multi-entity-consolidation", evidence="Projects are held through special purpose vehicles including Phofu Solar Power Plant (RF) Pty Ltd and Sonvanger Solar Power Plant (RF) (Pty) Ltd.", url=PELE_TR),
     cap("multi-project-management", evidence="980 MW in operation, 670 MW under construction and a pipeline of more than 5 GW under development.", url=PELE_NORFUND),
     cap("contract-management", evidence="Wheeling arrangements with Eskom supply the Sonvanger plant to a mining pooling and sharing joint venture in three provinces.", url=PELE_TR),
     cap("foreign-currency-transactions", evidence="Norfund invested approximately 400 million NOK in the group in 2023.", url=PELE_NORFUND),
     cap("capital-project-management", status="unknown", evidence="No contractor structure was read."),
     cap("regulatory-reporting", status="unknown", evidence="No statutory reporting was read.")],
    [src(PELE_TR, "company-website", "Track record: operating since 2009; Phofu Solar Power Plant (RF) Pty Ltd is a special purpose vehicle for a plant of up to 100 MW near Viljoenskroon in the Free State; Sonvanger Solar Power Plant (RF) (Pty) Ltd is a 100 MW plant near Theunissen wheeled to a mining joint venture."),
     src(PELE_NORFUND, "news", "March 2025: South African BEE infrastructure company founded in 2009; 980 MW in operation, 670 MW under construction and a pipeline above 5 GW; Norfund invested about 400 million NOK in 2023."),
     src(PELE_RENEWS, "news", "November 2024: financial close on the 100 MW Sonvanger Solar PV plant for the Glencore Merafe Venture, the first utility-scale project closed by a sole sponsor and single IPP in South Africa.")],
    legal="", aliases=["PGE", "Pele Green Energy Group", "Pele Energy Group"],
    website="https://www.pelegreenenergy.com",
    status="verified",
    locations=[loc("Theunissen", "Free State", PELE_TR),
               loc("Viljoenskroon", "Free State", PELE_TR)],
    scales=[scale("capacity", "980 MW in operation with 670 MW under construction", "source-reported", "2025-03-08", PELE_NORFUND)],
    notes="No registered legal entity name is asserted: the sources read describe the business as Pele Green Energy Group without giving a registration. The only registered names sourced are the project special purpose vehicles, Phofu Solar Power Plant (RF) Pty Ltd and Sonvanger Solar Power Plant (RF) (Pty) Ltd. Locations are the sourced project sites rather than a head office, which the sources read do not state.")

MS_MIGA = "https://miga.org/node/2989?esrsid=167&pid=3521"
MS_AE = "https://www.africa-energy.com/live-data/article/south-africa-khobab-and-loeriesfontein-wind-plants-start-operating"
MS_NEWS = "https://www.mainstreamrp.com/news/new-hub-helping-loeriesfontein-entrepreneurs-do-business-better/"
org("org-mainstream-sa", "Mainstream Renewable Power South Africa",
    [ind("renewable-development", evidence="Developed five wind farms in the Northern and Western Cape under the Renewable Energy Independent Power Producer Procurement Programme.", url=MS_MIGA)],
    [cap("project-development", evidence="Developed five wind farms in the Northern and Western Cape: Khobab, Loeriesfontein 2, Noupoort, Kangnas and Perdekraal East.", url=MS_MIGA),
     cap("capital-project-management", evidence="Mainstream is responsible for acquiring the required permits and developing the necessary environmental and social studies during project development.", url=MS_MIGA),
     cap("multi-entity-consolidation", evidence="Projects are held through separate special purpose vehicles including Mainstream Renewable Power Khobab Wind (RF) Pty Ltd and Loeriesfontein 2 (RF) Pty Ltd.", url=MS_MIGA),
     cap("multi-project-management", evidence="Five wind farms across two provinces, with construction workforces of roughly 100 to 550 people per project.", url=MS_MIGA),
     cap("project-finance", status="unknown", evidence="MIGA support is referenced but no financing structure was read."),
     cap("regulatory-reporting", status="unknown", evidence="No statutory reporting was read.")],
    [src(MS_MIGA, "industry-report", "Project description: construction and operation of five wind farms — Khobab 140 MW, Loeriesfontein 2 140 MW, Noupoort 80,5 MW, Kangnas 140 MW and Perdekraal East 110 MW — developed by Mainstream Renewable Power, with assets acquired by Lekela and managed by MAMSA on completion."),
     src(MS_AE, "news", "Khobab and Loeriesfontein, both 140 MW, began commercial operations on 11 December using 122 Siemens SWT-2.3-108 turbines across 6 653 hectares; Lekela, a joint venture between Actis and Mainstream, holds a 40% stake."),
     src(MS_NEWS, "company-website", "Loeriesfontein 2 Wind Farm reached its commercial operations date in December 2017 under bid window 3; developed, constructed and operated by Mainstream for Lekela Power.")],
    legal="", aliases=["Mainstream Renewable Power"],
    website="https://www.mainstreamrp.com",
    status="needs-verification",
    locations=[loc("Loeriesfontein", "Northern Cape", MS_NEWS),
               loc("Noupoort", "Northern Cape", MS_MIGA)],
    notes="Recorded as the developer, not the owner: the sources state that on completion the assets are acquired by Lekela Power and managed by MAMSA, so attributing ownership to Mainstream would be a mistaken corporate affiliation. Capacity for Loeriesfontein 2 is reported as 140 MW by Africa Energy and 138 MW by Mainstream's own project page; both are recorded rather than averaged. The South African legal entity was not established from the sources read.")

SOLA_NAOS = "https://www.greenbuildingafrica.co.za/sola-group-reaches-financial-close-and-starts-construction-on-landmark-hybrid-solar-and-battery-project-in-south-africa/"
SOLA_INVESTEC = "https://www.investec.com/en_za/investec-for-corporates/transactions/sola-group-2026.html"
SOLA_TRONOX = "https://www.greenbuildingafrica.co.za/the-sola-group-connects-256mw-solar-pv-wheeling-project-in-south-africa/"
SOLA_SPRINGBOK = "https://www.engineeringnews.co.za/article/springbok-solar-photovoltaic-plant-south-africa-2024-02-16"
org("org-sola", "SOLA Group",
    [ind("renewable-development", evidence="South African renewable energy developer and independent power producer with utility-scale solar and battery storage projects.", url=SOLA_INVESTEC),
     ind("independent-power-production", primary=False, evidence="More than 1 GW of projects in operation and construction, supplying private offtakers under power purchase agreements.", url=SOLA_NAOS)],
    [cap("project-development", evidence="Since 2022 SOLA has developed, financed and constructed 748 MW of renewable capacity.", url=SOLA_INVESTEC),
     cap("project-finance", evidence="Financial close reached on the Naos 1 hybrid solar and battery project, the largest privately contracted hybrid renewable energy project to reach financial close in South Africa.", url=SOLA_NAOS),
     cap("capital-project-management", evidence="Expertise spans development, engineering, procurement and construction and operations and maintenance; the Naos 1 EPC contractor is a SOLA Build and WBHO joint venture.", url=SOLA_INVESTEC),
     cap("multi-project-management", evidence="More than 1 GW of projects in operation and construction, with a further 600 MW at an advanced stage of development.", url=SOLA_NAOS),
     cap("contract-management", evidence="Long-term power purchase agreements signed with Sasol and Air Liquide, and a wheeling agreement supplying Tronox Mineral Sands across the Eskom transmission network.", url=SOLA_TRONOX),
     cap("multi-entity-consolidation", evidence="SOLA Group, SOLA Assets and SOLA Build are named as separate entities within the group.", url=SOLA_NAOS),
     cap("commodity-trading", status="unknown", confidence="probable", evidence="Electricity is wheeled to private offtakers, but no source describes energy trading."),
     cap("foreign-currency-transactions", status="unknown", evidence="No currency arrangements were read."),
     cap("regulatory-reporting", status="unknown", evidence="No statutory reporting was read.")],
    [src(SOLA_NAOS, "news", "February 2026: financial close and start of construction on Naos 1 near Viljoenskroon in the Free State, a 300 MW solar facility with battery storage, under long-term power purchase agreements with Sasol and Air Liquide; commercial operation targeted for 2028."),
     src(SOLA_INVESTEC, "industry-report", "Since 2022 SOLA has developed, financed and constructed 748 MW of renewable capacity, of which 450 MW is utility-scale and about 350 MW already operational."),
     src(SOLA_TRONOX, "news", "Connected 126 MWp and 130 MWp solar PV wheeling projects outside Lichtenburg in the North West, supplying Tronox Mineral Sands via the Eskom transmission network."),
     src(SOLA_SPRINGBOK, "news", "Springbok solar photovoltaic plant of 195 MW in the Free State, capital expenditure R2,8 billion, first electricity scheduled for mid-2025.")],
    legal="", aliases=["SOLA", "The SOLA Group"],
    status="needs-verification",
    locations=[loc("Viljoenskroon", "Free State", SOLA_NAOS),
               loc("Lichtenburg", "North West", SOLA_TRONOX)],
    scales=[scale("capacity", "748 MW developed, financed and constructed since 2022", "source-reported", "2026", SOLA_INVESTEC)],
    notes="The Naos 1 battery capacity is reported as both 660 MWh and 855 MWh within the same article; the conflict is recorded rather than resolved. The South African legal entity and head office were not established from the sources read, and no website is asserted. Locations are sourced project sites.")

# ---------------------------------------------------------------------------
# Curated associations (materialized, reviewed relationships only)
# ---------------------------------------------------------------------------

ASSOCIATIONS = [
    ("assoc-ccs-vector", "org-ccs-logistics", "org-vector-logistics", "shared-operating-process",
     ["cold-storage-operations", "multi-temperature-warehousing", "inventory-management"],
     ["cold-storage-operations"], "Storage and handling to temperature-controlled distribution",
     "Vector operates 114,000 pallet positions and multi-temperature distribution centres, so its operational finance team works with the same stock, temperature and site complexity as a commercial cold store.",
     "Vector Logistics company website operating metrics.", "https://www.vectorlog.com/", "probable", "reviewed"),
    ("assoc-ccs-ij", "org-ccs-logistics", "org-ij", "shared-operating-process",
     ["cold-storage-operations", "inventory-management"], ["cold-storage-operations"],
     "Shared freezer storage and handling",
     "I&J owns and operates its own freezer storage and logistics facility, so it employs finance staff who deal with frozen stock valuation and site operations, but it is a captive facility rather than a third-party cold store.",
     "I&J presentation to Parliament describing the Paarden Eiland freezer storage and logistics facility.", "https://pmg.org.za/files/201027IJ_Overview.pdf", "probable", "reviewed"),
    ("assoc-bester-nwk", "org-bester-feed-grain", "org-nwk", "shared-operating-process",
     ["commodity-trading", "grain-handling-storage"], ["grain-trading"],
     "Commodity marketing to grain storage and handling",
     "NWK publishes commodity marketing, price risk management and Safex broker services alongside silo handling, which matches the trading and stock complexity in the Bester Feed & Grain brief.",
     "NWK grain marketing page.", "https://sg.linkedin.com/showcase/grain-marketing", "probable", "reviewed"),
    ("assoc-slm-rabie", "org-slm-developments", "org-rabie-property-group", "shared-operating-process",
     ["project-development", "multi-project-management"], ["property-development"],
     "Development pipeline management",
     "Rabie has delivered residential, commercial and mixed-use developments since 1978, including Century City, giving it development project and pipeline management exposure comparable to SLM's development programme.",
     "Rabie Property Group company page.", "https://www.linkedin.com/company/rabie-property-group-pty-ltd", "probable", "reviewed"),
]

# ---------------------------------------------------------------------------
# Write
# ---------------------------------------------------------------------------

def write(name, payload):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)
        handle.write("\n")
    print(f"wrote {name}: {len(payload)} records")


write("industries.json", [
    {"id": iid, "name": iname, "parentId": parent, "pocket": pocket,
     "description": desc, "synonyms": syns}
    for iid, iname, parent, pocket, desc, syns in INDUSTRIES
])

write("pockets.json", [
    {"id": pid, "name": pname, "valueChainStage": stage, "description": desc}
    for pid, pname, stage, desc in POCKETS
])

write("capabilities.json", [
    {"id": cid, "name": cname, "group": group, "parentId": parent,
     "synonyms": syns, "description": desc}
    for cid, cname, group, parent, desc, syns in CAPABILITIES
])

INFERENTIAL = re.compile(r"impl(y|ies)|suggest|not stated|not explicitly|not read|assumed|presumed|requires own", re.I)
# Proxy indicators: things that correlate with a capability without evidencing it.
# Kept to unambiguous proxies. "Portfolio" and "named speciality" are not here
# on purpose: "a portfolio of concurrent developments" evidences concurrent
# project delivery, while "a diversified contracting portfolio" does not, and a
# keyword cannot tell those apart — that distinction is a human judgement.
PROXY_EVIDENCE = re.compile(r"classified under|listed under|externally audited|preferred bidder|capacity to deliver", re.I)


def assert_capability_discipline(orgs):
    """
    A capability's status must say what a source establishes, never what we
    inferred from it. `cap()` defaults to observed, so an inference written
    without a status silently becomes a positive claim — these checks turn that
    into a build failure instead of bad data.
    """
    problems = []
    for organization in orgs:
        for link in organization["capabilities"]:
            where = f'{organization["name"]}/{link["capabilityId"]}'
            if link["status"] == "observed" and not link["sourceUrl"]:
                problems.append(f"{where}: observed without a source url")
            elif link["status"] == "observed" and INFERENTIAL.search(link["evidence"]):
                problems.append(f'{where}: evidence says "{link["evidence"][:60]}" — an inference cannot be status observed')
            elif link["status"] == "observed" and PROXY_EVIDENCE.search(link["evidence"]):
                problems.append(f'{where}: "{link["evidence"][:60]}" is a proxy indicator, not the capability itself')
            elif link["status"] == "unknown" and link["sourceUrl"]:
                problems.append(f"{where}: unknown must not claim a source url")
            elif link["status"] == "not-observed" and not link["evidence"]:
                problems.append(f"{where}: a stated absence needs evidence")
    if problems:
        raise SystemExit("capability discipline check failed:\n  " + "\n  ".join(problems))


assert_capability_discipline(ORGS)

write("organizations.json", ORGS)

write("corporate-relationships.json", [
    {"id": rid, "type": rtype, "fromId": a, "toId": b, "evidence": ev,
     "sourceUrl": url, "confidence": conf, "checkedOn": CHECKED, "note": ""}
    for rid, rtype, a, b, ev, url, conf in RELATIONSHIPS
])

write("recruiter-intelligence.json", [
    {"id": iid, "organizationId": oid, "kind": kind, "scope": scope,
     "observation": obs, "confidence": conf, "source": source,
     "reviewer": reviewer, "recordedOn": CHECKED}
    for iid, oid, kind, scope, obs, conf, source, reviewer, _ in INTELLIGENCE
])

write("associations.json", [
    {"id": aid, "focalId": f, "associatedId": a, "relationshipType": rt,
     "sharedProcesses": procs, "sharedIndustries": inds, "valueChainOverlap": vc,
     "narrative": narr, "evidence": ev, "sourceUrl": url, "confidence": conf,
     "status": status, "reviewer": "Talent Tree", "checkedOn": CHECKED}
    for aid, f, a, rt, procs, inds, vc, narr, ev, url, conf, status in ASSOCIATIONS
])
