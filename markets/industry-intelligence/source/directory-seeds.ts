/**
 * Row-level transcriptions from the cited official pages. No personal contact
 * fields are imported. The compact pipe format is expanded and validated by
 * scripts/build-industry-intelligence.ts; generated JSON is the public contract.
 * Fields: name | category | participant type | niche | website | operations | location | reviewed canonical id
 */
export interface DirectorySeedGroup {
  bodyId: string
  evidenceUrl: string
  sourcePublicationDate: string
  status: 'Confirmed' | 'Historical' | 'Unverified'
  notes: string
  rows: string
}

export const directorySeedGroups: DirectorySeedGroup[] = [
  {
    bodyId: 'body-aspasa',
    evidenceUrl: 'https://aspasa.co.za/wp-content/uploads/2025/03/ASPASA-Members-artwork_page-0001-1.jpg',
    sourcePublicationDate: '2025-03',
    status: 'Historical',
    notes: 'Operation-level entries transcribed from the official artwork published in the website 2025-03 upload path. The artwork is undated and is not represented as a current November 2026 member register. Multiple sites are aggregated under the exact operator name printed on the artwork; related entities are not merged.',
    rows: `
Afrimat|Producer|producer-operator|Aggregates, sand, industrial minerals and limestone|https://www.afrimat.co.za/|Denver; Moregrove; Coega; Blue Rock; Rietkuil Farm; Qwa Qwa; Harrismith; Olive Hill (mothballed); Bethlehem; Glen Douglas; Lyttelton Dolomite; Midrand; Eastlynn; Ferro; Rooikraal; Silica; Umlaas Road; Stanger - Lafarge; Ridgeview; Tongaat - Lafarge; Ninians; Richards Bay - Lafarge; Vryheid; Hluhluwe; Umfolozi; Pietermaritzburg; Dundee; Scottburgh; Rietfontein; Marble Hall Mine; Polokwane (mothballed); Karino; Bushbuckridge Quarry; Dingwell; Demaneng; Afrimat Tswana Lime Quarry; De Kop; Palmiet; Rheebok; Peak; Tygerberg; Brewelskloof; Kliprug; Cape Lime Vredendal; Cape Lime Robertson; Driefontein; Stanford; Cape Lime (Sand); Macassar; Smalblaar; Dennegeur; De Anker; Keurkloof; Saldhana|Eastern Cape; Free State; Gauteng; KwaZulu-Natal; Limpopo; Mpumalanga; Northern Cape; North West; Western Cape|org-afrimat
Supacrush Bigwill|Producer|producer-operator|Aggregates and quarrying||St Albans PE|Eastern Cape|
Raumix Aggregates (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Queenstown Quarry; Aliwal Quarry; Petra Quarries; Rossway Quarry; Rosslyn Quarry; Crushco Quarry; Alfa Sand; Donkerhoek Quarry; Kimberley Quarry|Eastern Cape; Free State; Gauteng; Northern Cape|org-mbawc-related-f3c57e5312c5
Transkei Quarries|Producer|producer-operator|Aggregates and quarrying||Mthatha; Butterworth|Eastern Cape|
AfriSam (Pty) Ltd|Producer|producer-operator|Cement, aggregates and ready-mix concrete|https://www.afrisam.com/|Jukskei; Eikenhof; Ferro; Rooikraal; Zeekoewater; Coedmore; Verulam Redcliffe; Pietermaritzburg; Umlaas Road; Peninsula|Gauteng; KwaZulu-Natal; Mpumalanga; Western Cape|org-afrisam
Drift Supersand (Pty) Ltd|Producer|producer-operator|Sand and aggregates||Drift Supersand; Laezonia|Gauteng|
PPC Aggregate Quarries (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying|https://www.ppc.africa/|Mooiplaas Quarry; Laezonia Quarry|Gauteng|
Vergenoeg Mining Company (Pty) Ltd|Producer|producer-operator|Fluorspar and surface mining||Vergenoeg Mining|Gauteng|
Labucon Resources|Producer|producer-operator|Sand and aggregates||Krokodil Sand|Gauteng|
Tshwane Aggregates (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Four Rivers Quarry|Gauteng|
West End Claybrick (Pty) Ltd|Producer|producer-operator|Clay and brick raw materials||West End Clay Bricks; West End Clay Bricks|Gauteng; North West|
Aquarella Investments 389 (Pty) Ltd|Producer|producer-operator|Silica and quarrying||Leeuwkuil Quarry; Steelpark Quarry; Boekenhoutskloof; Syferfontein; Rooipoort Crusher; Cyferfontein|Gauteng; Limpopo|
Nokeng Fluorspar Mine|Producer|producer-operator|Fluorspar||Rust De Winter|Gauteng|
Sallies Holdings|Producer|producer-operator|Fluorspar, gypsum and industrial minerals||Olifantsfontein Dolomite Mine; Progyp Gypsum; Kanakies Gypsum|Gauteng; Mpumalanga; Northern Cape|
West End Roof Tile|Producer|producer-operator|Clay and roof-tile raw materials||West End Clay Bricks|Gauteng|
Mowcop|Producer|producer-operator|Silica||Silica Mine|Gauteng|
Idwala Industrial Holdings Limited|Producer|producer-operator|Lime, carbonates and industrial minerals|https://www.idwala.co.za/|Idwala Carbonates; Idwala Lime; Witpoort|KwaZulu-Natal; Northern Cape; North West|
Blurock Quarries (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Blurock Quarries|KwaZulu-Natal|
Midmar Quarry (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Midmar Quarry|KwaZulu-Natal|
South Coast Stone Crushers (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Margate Quarry|KwaZulu-Natal|
Sterkspruit Aggregates (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Sterkspruit Aggregates|KwaZulu-Natal|
Dorning Crushers|Producer|producer-operator|Aggregates and quarrying||Kokstad|KwaZulu-Natal|
Rossmin - Umzimkhulu Quarry|Producer|producer-operator|Limestone and quarrying||Umzimkhulu Industrial Holdings (Pty) Ltd|KwaZulu-Natal|
Procon Precast|Producer|producer-operator|Precast concrete and quarrying||Estcourt|KwaZulu-Natal|
Taylors Halt - Midmar Group|Producer|producer-operator|Aggregates and quarrying||Taylors Halt|KwaZulu-Natal|
Jannek Mining|Producer|producer-operator|Surface mining||Rooipoort Crusher|Limpopo|
ARM Andalusite|Producer|producer-operator|Andalusite||Northam|Limpopo|
Eskay Crushers|Producer|producer-operator|Aggregates and quarrying||Piet Retief|Mpumalanga|
B&E International (Pty) Ltd|Producer|producer-operator|Contract crushing and aggregates||Howards Quarry|Mpumalanga|
Trichard Crushers|Producer|producer-operator|Aggregates and quarrying||Secunda|Mpumalanga|
SPH Kundalila (Pty) Ltd|Producer|producer-operator|Crushing, sand and quarrying||Aroams Quarry; SPH Kundalila Aggeneys; SPH Kundalila|Northern Cape; Western Cape|
Strauss Civils (T5 Swivel)|Producer|contractor|Civil contracting and crushing||Poort Beton|Northern Cape|
Marlin Holdings (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Bloemhoek Quarry; Minaco Quarry; Wonderkop Quarry; Springbok Quarry; Taylor Quarry; Transvaal Quarry|Northern Cape; North West|
PPC Cement Slurry|Producer|producer-operator|Cement and limestone|https://www.ppc.africa/|Slurry|North West|
OMV (Pty) Ltd|Producer|producer-operator|Gypsum, limestone and aggregates|https://www.omv.co.za/|OMV Stilfontein|North West|
Red Graniti|Producer|producer-operator|Dimension stone||Rustenburg|North West|
Prolime Limestone|Producer|producer-operator|Limestone||Buhrmannsdrif|North West|
Stone Mining|Producer|producer-operator|Stone and aggregates||Zeerust|North West|
Maxima Silica Pty Ltd|Producer|producer-operator|Silica||Bultfontein|North West|
Ciolli Bros (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Gran Sasso Quarry|Western Cape|
Portland Quarry (Pty) Ltd|Producer|producer-operator|Aggregates and quarrying||Durbanville Quarries; Malmesbury|Western Cape|
4 Evergreen Environmental Consultants|Associate|professional-services|Environmental consulting|||; Southern Africa|
Agbiz Grain|Associate|association|Grain handling and storage|https://agbizgrain.co.za/||Southern Africa|
Assurecloud|Associate|professional-services|Assurance and laboratory services|https://assurecloud.co.za/||Southern Africa|
ASTEC Industries|Associate|associate-supplier|Quarry and asphalt plant equipment|https://www.astecindustries.com/||Southern Africa|
Booyco Electronics|Associate|associate-supplier|Mining safety electronics|https://booyco-electronics.co.za/||Southern Africa|
Brauteseth Blasting|Associate|contractor|Drilling and blasting|https://brautesethblasting.co.za/||Southern Africa|
CB Lifting Equipment|Associate|associate-supplier|Lifting equipment|||; Southern Africa|
DotNetix|Associate|associate-supplier|Mining safety technology|https://dotnetix.co.za/||Southern Africa|
Go2 Marketing|Associate|professional-services|Marketing services|||; Southern Africa|
IMS Engineering|Associate|associate-supplier|Crushing and screening equipment|https://imsengineering.co.za/||Southern Africa|
Magotteaux S.A.|Associate|associate-supplier|Grinding media and wear parts|https://www.magotteaux.com/||Southern Africa|
M.P.I. Mining Solutions|Associate|associate-supplier|Mining supplies|||; Southern Africa|
Mine Safe|Associate|professional-services|Mine safety services|||; Southern Africa|
Minrom Consulting|Associate|professional-services|Mining and geology consulting|https://minrom.co.za/||Southern Africa|
Multotec Manufacturing (Pty) Ltd|Associate|associate-supplier|Mineral processing equipment|https://www.multotec.com/||Southern Africa|
Nxuala / Pratley|Associate|unknown|Directory row contains two trading names; identity unresolved|https://www.pratley.com/||Southern Africa|
Pilot Crushtec|Associate|associate-supplier|Crushing and screening equipment|https://pilotcrushtec.com/||Southern Africa|
Sabita|Associate|association|Bitumen and asphalt|https://www.sabita.co.za/||Southern Africa|
SACAA - SA Coal Ash Association|Associate|association|Coal ash|https://www.sacaa.co.za/||Southern Africa|
Schauenburg Systems|Associate|associate-supplier|Mining electronics and safety|https://www.schauenburg.co.za/||Southern Africa|
SP Mine Safety|Associate|professional-services|Mine safety services|||; Southern Africa|
Umoya Occ Hygiene & Lab Sol (Pty) Ltd|Associate|professional-services|Occupational hygiene and laboratory services|||; Southern Africa|
UNISA|Associate|educational-institution|Higher education|https://www.unisa.ac.za/||South Africa|
Vietti Slurrytec (Pty) Ltd|Associate|professional-services|Slurry and process consulting|https://slurrytec.com/||Southern Africa|
VSV Group|Associate|associate-supplier|Mining and industrial supplies|||; Southern Africa|
`
  },
  {
    bodyId: 'body-minerals-council', evidenceUrl: 'https://www.mineralscouncil.org.za/about/members', sourcePublicationDate: '', status: 'Confirmed',
    notes: 'Live official member list checked 2026-11-11. The page publishes category or commodity labels. Association and contractor rows remain separate from mine operators; duplicate commodity business units remain separate directory identities.',
    rows: `
Afrimat|Other minerals|producer-operator|Industrial minerals and aggregates|https://www.afrimat.co.za/||South Africa|org-afrimat
AGA capital|Investment company|investment-holding|Mining investment|https://www.bgglobal.co.za/||South Africa|
Anglo American Corporation PLC|Corporate|producer-operator|Diversified mining|https://www.angloamerican.co.za/||South Africa|
AngloGold Ashanti Limited|Corporate|producer-operator|Gold mining|https://www.anglogoldashanti.com/||South Africa|
African Rainbow Minerals|Diversified minerals|producer-operator|Diversified mining|https://www.arm.co.za/||South Africa|
Aggregate & Sand Producers|Association|association|Aggregates and sand|https://www.aspasa.co.za/||Southern Africa|
Assore|Manganese|producer-operator|Manganese and iron ore|https://www.assore.com/||South Africa|
Barplats|Platinum|producer-operator|Platinum group metals|https://www.eastplats.com/||South Africa|
Bauba resources|Diversified minerals|producer-operator|Chrome and platinum|https://baubaresources.co.za/||South Africa|
Black Mountain Mining (Pty) Ltd|Zinc/Copper|producer-operator|Zinc and copper|https://www.vedanta-zincinternational.com/our-operations/black-mountain||South Africa|
Cementation Africa|Contractor|contractor|Mining contracting|https://cementationafrica.com/||South Africa|
Chrometco Limited|Chrome|producer-operator|Chrome|https://www.chrometco.co.za/||South Africa|
Clay Brick Association Limited|Association|association|Clay bricks|https://www.claybrick.org.za/||South Africa|
Coastal Fuels|Coal|associate-supplier|Coal supply|https://coastalfuels.co.za/||South Africa|
Corobrick (Pty) Limited|Other minerals|producer-operator|Clay and clay bricks|https://www.corobrik.co.za/||South Africa|
De Beers Consolidated Mines Limited|Diamonds|producer-operator|Diamonds|https://www.debeersgroup.com/||South Africa|
DRDGOLD|Gold|producer-operator|Gold tailings retreatment|https://www.drdgold.com/||South Africa|
Exxaro Resources Limited|Coal|producer-operator|Coal and diversified minerals|https://www.exxaro.com/||South Africa|
Fraser Alexander (Pty) Ltd|Contractor|contractor|Tailings and mining services|https://www.fraseralexander.co.za/||South Africa|
Glencore Alloys|Chrome|producer-operator|Chrome|https://www.glencore.com/||South Africa|
Glencore Coal|Coal|producer-operator|Coal|https://www.glencore.com/what-we-do/energy/coal||South Africa|
Gold Fields Limited|Gold|producer-operator|Gold|https://www.goldfields.co.za/||South Africa|
Harmony Gold Mining Company Limited|Gold|producer-operator|Gold|https://www.harmony.co.za/||South Africa|
HCI Coal|Coal|producer-operator|Coal|https://www.hcicoal.co.za/||South Africa|
Ilima CoalCompany|Coal|producer-operator|Coal|https://www.linkedin.com/company/ilima-coal-company-pty-ltd/about/||South Africa|
Imerys|Other minerals|producer-operator|Industrial minerals|https://www.imerys.com/||South Africa|
Impala Platinum Limited|Platinum|producer-operator|Platinum group metals|https://www.implats.co.za/||South Africa|
Ivanplats|Platinum|producer-operator|Platinum group metals|https://ivanplats.com/||South Africa|
Kolobe Nala Investment Company|Investment company|investment-holding|Mining investment|||South Africa|
Kudumane Manganese Resources|Manganese|producer-operator|Manganese|https://www.kudumane.com/||South Africa|
Kumba Iron Ore Limited|Iron ore|producer-operator|Iron ore|https://www.angloamericankumba.com/||South Africa|
Kropz Elandsfontein|Phosphate|producer-operator|Phosphate|https://www.kropz.com/our-projects/elandsfontein||South Africa|
Limberg Mining Company|Chrome/PGMs|producer-operator|Chrome and platinum group metals|https://limberg.co.za/||South Africa|
Mbuyelo Group (Pty) Ltd|Coal|producer-operator|Coal|https://www.mbuyelo.com/||South Africa|
MC Mining|Coal|producer-operator|Coal|https://www.mcmining.co.za/||South Africa|
Miracle Upon Miracle Investments|Investment company|investment-holding|Mining investment|||South Africa|
M-Resources|Other minerals|unknown|Minerals and resources|https://www.mresources.co.za/||South Africa|
Msobo Coal (Pty) Ltd|Coal|producer-operator|Coal|||South Africa|
New Venture Mining Investments|Investment company|investment-holding|Mining investment|||South Africa|
Nkwe Platinum|Platinum|producer-operator|Platinum group metals|https://www.nkweplatinum.com/||South Africa|
Northam Platinum Holdings Limited|Platinum|producer-operator|Platinum group metals|https://www.northam.co.za/||South Africa|
Orion minerals|Zinc/Copper|producer-operator|Zinc and copper|https://www.orionminerals.com.au/||South Africa|
Palabora Mining Company Limited|Zinc/Copper|producer-operator|Copper and magnetite|https://www.palabora.com/||South Africa|
Pan African Resources plc|Gold/Uranium|producer-operator|Gold and uranium|https://www.panafricanresources.com/||South Africa|
Petra Diamonds|Diamonds|producer-operator|Diamonds|https://www.petradiamonds.com/||South Africa|
Platinum Group Metals|Platinum|producer-operator|Platinum group metals|https://www.platinumgroupmetals.net/||South Africa|
Redpath Mining (South Africa) (Pty) Limited|Contractor|contractor|Mining contracting|https://www.redpathmining.com/regions/africa/||South Africa|
Richards Bay Minerals|Other minerals|producer-operator|Mineral sands|https://www.riotinto.com/||South Africa|
SADPO|Diamonds|association|Diamond producers|https://sadpo.co.za/||South Africa|
Sasol Mining (Pty) Limited|Coal|producer-operator|Coal|https://www.sasol.com/||South Africa|
Sedibelo Platinum Mines Ltd|Platinum|producer-operator|Platinum group metals|https://www.sedibeloplatinum.com/||South Africa|
Seriti Resources|Coal|producer-operator|Coal|https://seritiza.com/||South Africa|
Sibanye-Stillwater|Diversified minerals|producer-operator|Gold and platinum group metals|https://www.sibanyestillwater.com/||South Africa|
Siyanda Resources|Platinum|producer-operator|Platinum group metals|https://www.siyandaresources.co.za/||South Africa|
South African Diamond Producers' Association|Association|association|Diamond producers|https://sadpo.co.za/||South Africa|
South32 - South Africa Manganese|Manganese|producer-operator|Manganese|https://www.south32.net/our-business/southern-africa/south-africa-manganese||South Africa|
Tharisa|Chrome|producer-operator|Chrome and platinum group metals|https://www.tharisa.com/||South Africa|
Theta Gold Mines|Gold|producer-operator|Gold|http://thetagoldmines.com/||South Africa|
Thungela|Coal|producer-operator|Coal|https://www.thungela.com/||South Africa|
Tronox|Other minerals|producer-operator|Mineral sands and titanium|https://www.tronox.com/||South Africa|
Tshipi é Ntle Manganese Mining|Manganese|producer-operator|Manganese|https://www.tshipi.co.za/||South Africa|
United Manganese of Kalahari|Manganese|producer-operator|Manganese|https://umk.co.za/||South Africa|
Vaalbult Mining Company|Coal|producer-operator|Coal|||South Africa|
Valterra Platinum|Platinum|producer-operator|Platinum group metals|||South Africa|
Wesizwe Platinum|Platinum|producer-operator|Platinum group metals|https://www.wesizwe.co.za/||South Africa|
West Wits Mining|Gold|producer-operator|Gold|https://westwitsmining.com/||South Africa|
`
  },
  {
    bodyId: 'body-basa', evidenceUrl: 'https://banking.org.za/about-us/member-banks/', sourcePublicationDate: '', status: 'Confirmed',
    notes: 'All 29 names on the official member-bank page checked 2026-11-11. Brand links are retained verbatim; a banking group is not assumed to be the licensed bank unless its legal identity is explicit.',
    rows: `
Absa|Member bank|financial-product-provider|Commercial banking|https://www.absa.co.za/||South Africa|
Access Bank|Member bank|financial-product-provider|Commercial banking|https://www.grobank.co.za/||South Africa|
African Bank|Member bank|financial-product-provider|Commercial banking|https://www.africanbank.co.za/||South Africa|
Al Baraka|Member bank|financial-product-provider|Commercial banking|https://www.albaraka.co.za/||South Africa|
Bank of China|Member bank|financial-product-provider|Foreign bank branch|http://www.bankofchina.com/za/||South Africa|
Bank of Taiwan|Member bank|financial-product-provider|Foreign bank branch|https://www.bot.com.tw/||South Africa|
Barclays Bank PLC|Member bank|financial-product-provider|Banking|https://privatebank.barclays.com/||South Africa|
Bidvest Bank|Member bank|financial-product-provider|Commercial banking|https://www.bidvestbank.co.za/||South Africa|
BofA Securities|Member bank|financial-product-provider|Banking and securities|https://www.bofaml.com/||South Africa|
Communications Bank|Member bank|financial-product-provider|Foreign bank branch|https://www.bankcomm.com/||South Africa|
Capitec Bank|Member bank|financial-product-provider|Commercial banking|https://www.capitecbank.co.za/||South Africa|org-capitec
China Construction Bank|Member bank|financial-product-provider|Foreign bank branch|http://za.ccb.com/||South Africa|
Citibank|Member bank|financial-product-provider|Foreign bank branch|https://www.citigroup.com/southafrica/homepage/||South Africa|
Deutsche Bank|Member bank|financial-product-provider|Foreign bank branch|https://www.db.com/southafrica/||South Africa|
Discovery Bank|Member bank|financial-product-provider|Commercial banking|https://www.discovery.co.za/bank/join-discovery-bank||South Africa|
FinBond Mutual Bank|Member bank|financial-product-provider|Mutual banking|https://www.finbondmutualbank.co.za/||South Africa|
FirstRand|Member bank|financial-product-provider|Commercial banking|https://www.firstrand.co.za/||South Africa|
GBS Mutual Bank|Member bank|financial-product-provider|Mutual banking|https://www.gbsbank.co.za/||South Africa|
Goldman Sachs|Member bank|financial-product-provider|Foreign bank branch|https://www.goldmansachs.com/||South Africa|
HBZ Bank|Member bank|financial-product-provider|Commercial banking|https://hbzbank.co.za/||South Africa|
Investec|Member bank|financial-product-provider|Commercial banking|https://www.investec.com/en_za.html||South Africa|
JPMorgan Chase|Member bank|financial-product-provider|Foreign bank branch|https://www.jpmorganchase.com/||South Africa|
Nedbank|Member bank|financial-product-provider|Commercial banking|https://www.nedbank.co.za/||South Africa|
OM Bank limited|Member bank|financial-product-provider|Commercial banking|https://www.oldmutual.co.za/||South Africa|
Postbank|Member bank|financial-product-provider|Banking|https://www.postbank.co.za/||South Africa|
Standard Bank|Member bank|financial-product-provider|Commercial banking|https://www.standardbank.co.za/||South Africa|
Standard Chartered|Member bank|financial-product-provider|Foreign bank branch|https://www.sc.com/za/||South Africa|
State Bank of India|Member bank|financial-product-provider|Foreign bank branch|https://www.onlinesbi.com/||South Africa|
GoTyme Bank|Member bank|financial-product-provider|Commercial banking|https://www.tymebank.co.za/||South Africa|
`
  },
  {
    bodyId: 'body-codi', evidenceUrl: 'https://www.resbank.co.za/en/home/what-we-do/Deposit-insurance/member-banks0', sourcePublicationDate: '', status: 'Confirmed',
    notes: 'Statutory automatic participation, not voluntary association membership. All 33 rows published in the official table are included with its category labels. The page narrative says 34 institutions including 5 co-operative banks, but its table exposes only 4 co-operative-bank rows; that source discrepancy is preserved and no fifth institution is invented. The page also contains spelling variants such as Findbond; source names are preserved.',
    rows: `
ABSA Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.absa.co.za/||South Africa|
Access Bank|Commercial Banks|financial-product-provider|Commercial banking|https://www.grobank.co.za/||South Africa|
African Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.africanbank.co.za/||South Africa|
Albaraka Bank|Commercial Banks|financial-product-provider|Commercial banking|https://www.albaraka.co.za/||South Africa|
Bidvest Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.bidvestbank.co.za/||South Africa|
Capitec Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.capitecbank.co.za/||South Africa|org-capitec
Discovery Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.discovery.co.za/||South Africa|
FirstRand Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.firstrand.co.za/||South Africa|
Investec Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.investec.com/||South Africa|
Nedbank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.nedbank.co.za/||South Africa|
OM Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.oldmutual.co.za/||South Africa|
Sasfin Bank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.sasfin.com/||South Africa|
Standard Bank|Commercial Banks|financial-product-provider|Commercial banking|https://www.standardbank.co.za/||South Africa|
TymeBank Limited|Commercial Banks|financial-product-provider|Commercial banking|https://www.tymebank.co.za/||South Africa|
Bank of China|Local branches|financial-product-provider|Foreign bank branch|http://www.bankofchina.com/za/||South Africa|
Bank of Taiwan|Local branches|financial-product-provider|Foreign bank branch|https://www.bot.com.tw/||South Africa|
BNP Paribas S.A.|Local branches|financial-product-provider|Foreign bank branch|https://www.bnpparibas.co.za/||South Africa|
Bank of Communications Co.|Local branches|financial-product-provider|Foreign bank branch|https://www.bankcomm.com/||South Africa|
China Construction Bank Corporation|Local branches|financial-product-provider|Foreign bank branch|http://za.ccb.com/||South Africa|
Citibank N.A.|Local branches|financial-product-provider|Foreign bank branch|https://www.citigroup.com/southafrica/homepage/||South Africa|
Deutsche Bank|Local branches|financial-product-provider|Foreign bank branch|https://www.db.com/southafrica/||South Africa|
Goldman Sachs|Local branches|financial-product-provider|Foreign bank branch|https://www.goldmansachs.com/||South Africa|
HSBC|Local branches|financial-product-provider|Foreign bank branch|https://www.hsbc.co.za/||South Africa|
JP Morgan Chase Bank|Local branches|financial-product-provider|Foreign bank branch|https://www.jpmorganchase.com/||South Africa|
Standard Chartered Bank|Local branches|financial-product-provider|Foreign bank branch|https://www.sc.com/za/||South Africa|
State Bank of India|Local branches|financial-product-provider|Foreign bank branch|https://www.onlinesbi.com/||South Africa|
KSK|Co-operative banks|financial-product-provider|Co-operative banking|||South Africa|
OSK|Co-operative banks|financial-product-provider|Co-operative banking|||South Africa|
Ziphakamise|Co-operative banks|financial-product-provider|Co-operative banking|||South Africa|
GIG|Co-operative banks|financial-product-provider|Co-operative banking|||South Africa|
Bank Zero|Mutual banks|financial-product-provider|Mutual banking|https://www.bankzero.co.za/||South Africa|
Findbond|Mutual banks|financial-product-provider|Mutual banking|https://www.finbondmutualbank.co.za/||South Africa|
GBS|Mutual banks|financial-product-provider|Mutual banking|https://www.gbsbank.co.za/||South Africa|
`
  },
  {
    bodyId: 'body-sa-reit', evidenceUrl: 'https://sareit.co.za/reit-members/', sourcePublicationDate: '2026-06-30', status: 'Confirmed',
    notes: 'All 21 named REIT members on the official page. The page explicitly restricts this category to JSE-listed REITs registered in South Africa. Advisory members are not mixed into this register.',
    rows: `
Accelerate Property Fund|REIT Member|producer-operator|Listed retail property|http://www.acceleratepf.co.za/||South Africa|
Attacq|REIT Member|producer-operator|Listed mixed-use property|http://www.attacq.co.za/||South Africa|org-attacq
Burstone Group|REIT Member|producer-operator|Listed diversified property|https://www.burstone.com/||South Africa|
Delta Property Fund|REIT Member|producer-operator|Listed property|http://www.deltafund.co.za/||South Africa|
Dipula Properties|REIT Member|producer-operator|Listed diversified property|https://www.dipula.co.za/||South Africa|
Emira Property Fund|REIT Member|producer-operator|Listed diversified property|http://www.emira.co.za/||South Africa|
Equites Property Fund|REIT Member|producer-operator|Listed logistics property|http://www.equites.co.za/||South Africa|org-equites
Fairvest Limited|REIT Member|producer-operator|Listed retail property|http://www.fairvest.co.za/||South Africa|
Fortress Real Estate Investments|REIT Member|producer-operator|Listed logistics and retail property|http://www.fortressfund.co.za/||South Africa|org-fortress-reit
Growthpoint Properties|REIT Member|producer-operator|Listed diversified property|http://www.growthpoint.co.za/||South Africa|org-growthpoint-properties
Heriot REIT|REIT Member|producer-operator|Listed diversified property|http://www.heriotreit.com/||South Africa|
Hyprop Investments Limited|REIT Member|producer-operator|Listed retail and mixed-use property|http://www.hyprop.co.za/||South Africa|org-hyprop
Oasis Crescent Property Fund|REIT Member|producer-operator|Listed property|http://www.oasiscrescent.co.za/||South Africa|
Octodec Investments|REIT Member|producer-operator|Listed property|http://www.octodec.co.za/||South Africa|
Redefine Properties|REIT Member|producer-operator|Listed diversified property|http://www.redefine.co.za/||South Africa|org-redefine-properties
Resilient REIT|REIT Member|producer-operator|Listed retail property|http://www.resilient.co.za/||South Africa|org-resilient
SA Corporate Real Estate|REIT Member|producer-operator|Listed diversified property|http://www.sacorporatefund.co.za/||South Africa|
Safari Investments RSA|REIT Member|producer-operator|Listed retail property|http://www.safari-investments.com/||South Africa|
Spear REIT Limited|REIT Member|producer-operator|Listed Western Cape property|http://www.spearprop.co.za/||Western Cape; South Africa|
Stor-Age Property REIT Limited|REIT Member|producer-operator|Listed self-storage property|http://www.stor-age.co.za/||South Africa|org-stor-age
Vukile Property Fund|REIT Member|producer-operator|Listed retail property|http://www.vukile.co.za/||South Africa|org-vukile
`
  },
  {
    bodyId: 'body-agbiz-grain', evidenceUrl: 'https://agbizgrain.co.za/content/about-us?page=ag-members', sourcePublicationDate: '', status: 'Confirmed',
    notes: 'Thirteen operator members from the official specialist grain directory. Public individual email addresses on the page were deliberately not imported.',
    rows: `
Afgri|Member|producer-operator|Grain handling and storage|http://www.afgri.co.za||South Africa|org-afgri
AgriMark|Member|producer-operator|Grain handling and agricultural retail|https://www.kalgroup.co.za/||South Africa|org-kaap-agri
BKB Grainco (Pty) Ltd|Member|producer-operator|Grain handling and storage|http://www.bkb.co.za||South Africa|
GWK|Member|producer-operator|Grain handling and storage|http://www.vkb.co.za||South Africa|
NWK|Member|producer-operator|Grain handling and storage|http://www.nwk.co.za||South Africa|org-nwk
Overberg Agri|Member|producer-operator|Grain handling and storage|http://www.overbergagri.co.za||South Africa|
OVK|Member|producer-operator|Grain handling and storage|http://www.ovk.co.za||South Africa|
Schoeman Group|Member|producer-operator|Grain handling and storage|http://www.schoemangroup.co.za||South Africa|
Senwes|Member|producer-operator|Grain handling and storage|http://www.senwes.co.za||South Africa|org-senwes
Silostrat (Pty) LTD|Member|producer-operator|Grain storage|https://www.silostrat.com||South Africa|
SSK|Member|producer-operator|Grain handling and agricultural services|http://www.ssk.co.za||South Africa|
TWK Agri|Member|producer-operator|Grain handling and storage|http://www.twkagri.com||South Africa|org-twk
VKB|Member|producer-operator|Grain handling and storage|http://www.vkb.co.za||South Africa|org-vkb
`
  },
  {
    bodyId: 'body-mbawc', evidenceUrl: 'https://corporate.mymembership.co.za/?CommunityId=5185780b-6a31-40e8-8af5-28bd67e1460f', sourcePublicationDate: '', status: 'Confirmed',
    notes: 'All 25 companies exposed by the new official Find a Member portal checked 2026-11-11. The legacy 346-row search and 2025 PDF remain separate sources; this 25-row migrated portal is not asserted to be the association\'s complete current membership.',
    rows: `
1 Space Project Management (Pty) Ltd|Available Corporate|professional-services|Project management|||Western Cape|
1st Line Construction (Pty) Ltd|Available Corporate|contractor|General building contractor|https://www.1stline.co.za/||Western Cape|
A & C Herold Construction and Maintenance CC|Available Corporate|contractor|General building contractor|http://www.acmaintenance.co.za/||Western Cape|
A.G. Haefele & Sons CC|Available Corporate|contractor|Building contractor|||Western Cape|
Abbeydale Infrastructure (Pty) Ltd|Available Corporate|professional-services|Project management and property development|http://www.abbeydale.co.za/||Western Cape|
ABDA Building & Interior Projects CC|Available Corporate|contractor|Building and interior projects|https://www.abda.co.za/||Western Cape|
ACG Architects (Pty) Ltd|Available Corporate|professional-services|Architecture|||Western Cape|
Action Steel Doors CC|Available Corporate|associate-supplier|Steel doors and windows|https://www.actionsteeldoors.com/||Western Cape|
Affordable Ceilings & Partitions|Available Corporate|contractor|Ceilings and partitions|http://www.acponline.co.za/||Western Cape|
Afrisam (South Africa) (Pty) Ltd|Available Corporate|associate-supplier|Cement, aggregates and ready-mix concrete|http://www.afrisam.com/||Western Cape|org-afrisam
Airwise Airconditioning & Ventilation (Pty) Ltd|Available Corporate|contractor|Airconditioning and ventilation|http://www.airwise.co.za/||Western Cape|
Albocon cc|Available Corporate|professional-services|Construction consulting and inspections|||Western Cape|
Aldera & Martina CC|Available Corporate|contractor|Construction|||Western Cape|
All Window Repairs|Available Corporate|contractor|Window repairs|||Western Cape|
Alpha Occupational Health Services|Available Corporate|professional-services|Occupational health services|||Western Cape|
Alpine Scaffolding (Pty) Ltd|Available Corporate|contractor|Scaffolding|||Western Cape|
Anchor Builders West Coast|Available Corporate|contractor|Building contractor|||Western Cape|
AR Projects & Developments (Pty) Ltd|Available Corporate|contractor|Building projects and development|||Western Cape|
Aspect Waterproofing (Pty) Ltd|Available Corporate|contractor|Waterproofing|||Western Cape|
Atlantic iBuild (Pty) Ltd|Available Corporate|contractor|Building contractor|||Western Cape|
Atuba Construction (Pty) Ltd|Available Corporate|contractor|Building contractor|||Western Cape|
AZ Building and Project Management (Pty) Ltd|Available Corporate|contractor|Building and project management|||Western Cape|
B and D Homebuilders (Pty) Ltd|Available Corporate|contractor|Home building|||Western Cape|
B L Williams Construction Company (Pty) Ltd|Available Corporate|contractor|Building contractor|||Western Cape|
B Salie & Sons Carpenters CC|Available Corporate|contractor|Carpentry|||Western Cape|
`
  }
]
