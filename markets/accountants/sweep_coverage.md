# Sweep Coverage — Western Cape industrial & manufacturing companies

**This ledger is the completeness contract for the sweep.** Every company in
`inputs/2026-09-19-wc-industrial-companies.tsv` (transcribed from the supplied
`Companies.csv`, 2026-09-20) appears below exactly once. **No company may be dropped.**

A company is only `COVERED` once at least one person holding a recognised SAIPA / SAICA /
CIMA / ACCA designation is recorded against it in `people.jsonl` **with evidence**.
Everything else stays `PENDING` — an empty cell is an open work item, never a silent omission.

Regenerate after every batch: `python3 gen_sweep_coverage.py`

## Status

| Metric | Count |
|---|---|
| Companies in sweep scope | 176 |
| COVERED (≥1 registered person with evidence) | 2 |
| PENDING (research outstanding) | 174 |
| Partially covered (covered by a person who is also a director of a related entity) | 0 |

## Related closures outside the sweep list

| Company | ID | Person | Note |
|---|---|---|---|
| TCTA (Trans-Caledon Tunnel Authority) | cmp-0016 | Andisa Zinja CA(SA) — acc-0135 | Pre-existing registry company that had zero mapped people; closed 2026-09-19. |

## Ledger (every company in the sweep list)

| Company ID | Company / Group | Sector | Status | Registered person(s) found |
|---|---|---|---|---|
| cmp-0076 | Afrimat | Construction materials & mining | COVERED | Pieter de Wit (CA(SA)) — acc-0136 |
| cmp-0077 | AfriSam | Construction materials | PENDING | — |
| cmp-0078 | PPC | Construction materials | PENDING | — |
| cmp-0079 | Portland Group | Construction materials | PENDING | — |
| cmp-0080 | Ciolli Bros | Construction materials | PENDING | — |
| cmp-0081 | SPH Kundalila | Mining / materials | PENDING | — |
| cmp-0082 | Megamix | Construction materials | PENDING | — |
| cmp-0083 | Métier Mixed Concrete | Construction materials | PENDING | — |
| cmp-0084 | Much Asphalt | Construction materials | PENDING | — |
| cmp-0085 | SprayPave | Construction materials | PENDING | — |
| cmp-0086 | Cape Concrete Works | Construction materials | PENDING | — |
| cmp-0087 | TopFloor | Construction materials | PENDING | — |
| cmp-0088 | Mobicast | Construction materials | PENDING | — |
| cmp-0089 | Fick Sementwerke | Construction materials | PENDING | — |
| cmp-0090 | Lategan Sementwerke | Construction materials | PENDING | — |
| cmp-0091 | CAPECAST | Construction materials | PENDING | — |
| cmp-0092 | Apollo Brick (Atlantis) | Construction materials | PENDING | — |
| cmp-0093 | Bredasdorp Steenwerke | Construction materials | PENDING | — |
| cmp-0094 | Cabrico | Construction materials | PENDING | — |
| cmp-0095 | Klay | Construction materials | PENDING | — |
| cmp-0096 | Corobrik Lansdowne | Construction materials | PENDING | — |
| cmp-0097 | De Hoop Steenwerwe | Construction materials | PENDING | — |
| cmp-0098 | Johnson's Bricks | Construction materials | PENDING | — |
| cmp-0099 | Kurlandbrik | Construction materials | PENDING | — |
| cmp-0100 | Namakwa Kleistene | Construction materials | PENDING | — |
| cmp-0101 | Naude Bakstene | Construction materials | PENDING | — |
| cmp-0102 | Spitskop Steenwerke | Construction materials | PENDING | — |
| cmp-0103 | Worcester Bakstene | Construction materials | PENDING | — |
| cmp-0104 | Sika South Africa | Construction chemicals | PENDING | — |
| cmp-0105 | Chryso Southern Africa | Construction chemicals | PENDING | — |
| cmp-0106 | Saint-Gobain Gyproc | Building products | PENDING | — |
| cmp-0107 | Safintra South Africa | Building products | PENDING | — |
| cmp-0108 | Tronox Namakwa Sands | Mining & minerals | PENDING | — |
| cmp-0109 | Kropz Elandsfontein | Mining & minerals | PENDING | — |
| cmp-0110 | Mineral Sands Resources / Tormin | Mining & minerals | PENDING | — |
| cmp-0111 | Astron Energy | Energy / petrochemicals | PENDING | — |
| cmp-0112 | PetroSA | Energy / petrochemicals | PENDING | — |
| cmp-0113 | Sunrise Energy | Energy / terminals | PENDING | — |
| cmp-0114 | Power Group | Construction & infrastructure | PENDING | — |
| cmp-0115 | Civils 2000 | Construction & infrastructure | PENDING | — |
| cmp-0116 | WBHO Construction - Cape Division | Construction & infrastructure | PENDING | — |
| cmp-0117 | Haw & Inglis | Construction & infrastructure | PENDING | — |
| cmp-0118 | Martin & East | Construction & infrastructure | PENDING | — |
| cmp-0119 | ASLA | Construction & infrastructure | PENDING | — |
| cmp-0120 | Concor | Construction & infrastructure | PENDING | — |
| cmp-0121 | Raubex / Roadmac Surfacing Cape | Construction & infrastructure | PENDING | — |
| cmp-0122 | GVK-Siya Zama | Construction & infrastructure | PENDING | — |
| cmp-0123 | Isipani Construction | Construction & infrastructure | PENDING | — |
| cmp-0124 | R+N Master Builders | Construction & infrastructure | PENDING | — |
| cmp-0125 | Macsteel | Steel & industrial distribution | PENDING | — |
| cmp-0126 | NJR Steel | Steel & industrial distribution | PENDING | — |
| cmp-0127 | Meshco | Steel / wire manufacturing | PENDING | — |
| cmp-0128 | SA Metal Group | Metals / recycling | PENDING | — |
| cmp-0129 | Fabrinox | Engineering manufacturing | PENDING | — |
| cmp-0130 | Foct Engineering | Engineering manufacturing | PENDING | — |
| cmp-0131 | Bowler Metcalf / Bowler Plastics | Packaging manufacturing | PENDING | — |
| cmp-0132 | Mpact | Packaging / recycling | PENDING | — |
| cmp-0133 | Polyoak Packaging | Packaging manufacturing | PENDING | — |
| cmp-0134 | Ardagh Glass Packaging SA | Packaging manufacturing | PENDING | — |
| cmp-0135 | Nampak | Packaging / industrial | PENDING | — |
| cmp-0136 | RFG Foods | Food manufacturing | PENDING | — |
| cmp-0137 | PepsiCo South Africa / Pioneer Foods | Food manufacturing / FMCG | PENDING | — |
| cmp-0138 | Lactalis South Africa | Dairy manufacturing | PENDING | — |
| cmp-0139 | Fair Cape Dairies | Dairy / food manufacturing | PENDING | — |
| cmp-0140 | Peninsula Beverages | Beverage manufacturing | PENDING | — |
| cmp-0141 | Sea Harvest Group | Fishing / food processing | COVERED | Muhammad Brey (CA(SA)) — acc-0137 |
| cmp-0142 | Oceana Group | Fishing / food processing | PENDING | — |
| cmp-0143 | I&J | Fishing / food processing | PENDING | — |
| cmp-0144 | Premier Fishing & Brands | Fishing / processing | PENDING | — |
| cmp-0145 | LANCEWOOD | Dairy manufacturing | PENDING | — |
| cmp-0146 | Ladismith Cheese / Woodlands Dairy Group | Dairy manufacturing | PENDING | — |
| cmp-0147 | Southern Oil (SOILL) | Agri-processing | PENDING | — |
| cmp-0148 | HEINEKEN Beverages | Beverage manufacturing / distribution | PENDING | — |
| cmp-0149 | DGB | Beverage manufacturing | PENDING | — |
| cmp-0150 | KWV | Beverage manufacturing | PENDING | — |
| cmp-0151 | SAB / AB InBev - Newlands Brewery | Beverage manufacturing | PENDING | — |
| cmp-0152 | Overberg Agri | Agriculture / distribution | PENDING | — |
| cmp-0153 | Kaap Agri / Agrimark | Agriculture / distribution | PENDING | — |
| cmp-0154 | Sentraal-Suid Co-operative (SSK) | Agriculture / distribution | PENDING | — |
| cmp-0155 | Two-a-Day Group | Fruit / agri-processing | PENDING | — |
| cmp-0156 | Tru-Cape Fruit Marketing | Fresh produce | PENDING | — |
| cmp-0157 | Ceres Fruit Growers | Fresh produce / packhouse | PENDING | — |
| cmp-0158 | Kromco | Fresh produce / packhouse | PENDING | — |
| cmp-0159 | Dutoit Agri | Agriculture / fresh produce | PENDING | — |
| cmp-0160 | Capespan South Africa | Fresh produce | PENDING | — |
| cmp-0161 | Lona Group | Fresh produce / logistics | PENDING | — |
| cmp-0162 | Fruitways | Fresh produce | PENDING | — |
| cmp-0163 | Betko Fresh Produce | Fresh produce | PENDING | — |
| cmp-0164 | Core Fruit | Fresh produce | PENDING | — |
| cmp-0165 | Southern African Fruit Terminals (SAFT) | Cold chain / logistics | PENDING | — |
| cmp-0166 | Commercial Cold Holdings | Cold chain / logistics | PENDING | — |
| cmp-0167 | Snolink | Logistics / warehousing | PENDING | — |
| cmp-0168 | Cape Fruit Coolers | Cold chain / logistics | PENDING | — |
| cmp-0169 | DSV | Logistics / warehousing | PENDING | — |
| cmp-0170 | Bidvest International Logistics | Logistics / warehousing | PENDING | — |
| cmp-0171 | Grindrod / United Container Depots | Logistics / terminals | PENDING | — |
| cmp-0172 | Maersk | Logistics / cold chain | PENDING | — |
| cmp-0173 | Shoprite Holdings | Retail / distribution | PENDING | — |
| cmp-0174 | Pick n Pay | Retail / distribution | PENDING | — |
| — | Woolworths Holdings | Retail / distribution | PENDING | — |
| cmp-0175 | The Building Company | Building materials distribution | PENDING | — |
| cmp-0176 | Brights Hardware | Building materials distribution | PENDING | — |
| cmp-0177 | Cashbuild | Building materials distribution | PENDING | — |
| cmp-0178 | SOLA Group | Renewable energy / EPC | PENDING | — |
| cmp-0179 | JUWI South Africa | Renewable energy / EPC | PENDING | — |
| cmp-0180 | Scatec South Africa | Renewable energy / IPP | PENDING | — |
| cmp-0181 | Mulilo | Renewable energy / IPP | PENDING | — |
| cmp-0182 | Red Rocket | Renewable energy / IPP | PENDING | — |
| cmp-0183 | Mainstream Renewable Power | Renewable energy / development | PENDING | — |
| cmp-0184 | Lesedi Nuclear Services | Engineering / EPC | PENDING | — |
| cmp-0185 | Damen Shipyards Cape Town | Marine manufacturing | PENDING | — |
| cmp-0186 | Cape Cement Products | Construction materials | PENDING | — |
| cmp-0187 | Blublok Cement Manufacturers | Construction materials | PENDING | — |
| cmp-0188 | Quickslab | Construction materials | PENDING | — |
| cmp-0189 | Mouton Precast | Construction materials | PENDING | — |
| cmp-0190 | Inca Concrete Products | Construction materials | PENDING | — |
| cmp-0191 | SmartStone Cape Town | Construction materials | PENDING | — |
| cmp-0192 | Cape Paving | Construction materials | PENDING | — |
| cmp-0193 | Aldera & Martina | Construction materials | PENDING | — |
| cmp-0194 | Civil Pro Precast | Construction materials | PENDING | — |
| cmp-0195 | Omega Concrete | Construction materials | PENDING | — |
| cmp-0196 | Sandberg Transport | Construction materials / logistics | PENDING | — |
| cmp-0197 | CSV Construction | Construction & infrastructure | PENDING | — |
| cmp-0198 | Stabilid Cape Construction | Construction & infrastructure | PENDING | — |
| cmp-0199 | GeoCiv Group | Construction & engineering | PENDING | — |
| cmp-0200 | Southey Contracting | Industrial services | PENDING | — |
| cmp-0201 | Mazor Group | Engineering / manufacturing | PENDING | — |
| cmp-0202 | Duram Smart Paints | Chemicals / building products | PENDING | — |
| cmp-0203 | Air Products South Africa | Industrial gases | PENDING | — |
| cmp-0204 | Rheinmetall Denel Munition | Advanced manufacturing | PENDING | — |
| cmp-0205 | Italtile Group - Western Cape Distribution Centre | Building materials distribution | PENDING | — |
| cmp-0206 | Robertson & Caine | Marine manufacturing | PENDING | — |
| cmp-0207 | Two Oceans Marine Manufacturing | Marine manufacturing | PENDING | — |
| cmp-0208 | Balance Catamarans Cape Town | Marine manufacturing | PENDING | — |
| cmp-0209 | Phoenix Marine Manufacturing | Marine manufacturing | PENDING | — |
| cmp-0210 | Dormac | Marine / heavy engineering | PENDING | — |
| cmp-0211 | Atlantis Foundries | Heavy manufacturing | PENDING | — |
| cmp-0212 | Quantum Foods Holdings | Agri / food production | PENDING | — |
| cmp-0213 | Nova Feeds | Animal feed manufacturing | PENDING | — |
| cmp-0214 | Meadow Feeds | Animal feed manufacturing | PENDING | — |
| cmp-0215 | AFGRI Animal Feeds | Animal feed manufacturing | PENDING | — |
| cmp-0216 | County Fair | Poultry / food processing | PENDING | — |
| cmp-0217 | Tiger Brands | Food manufacturing | PENDING | — |
| cmp-0218 | Western Cape Milling | Grain / milling | PENDING | — |
| cmp-0219 | Group 35 Foods | Grain / milling | PENDING | — |
| cmp-0220 | Citrusdal Rollermeule | Grain / milling | PENDING | — |
| cmp-0221 | Eureka Mills | Grain / milling | PENDING | — |
| cmp-0222 | BKB GrainCo / GrainCo Storage | Grain / storage / logistics | PENDING | — |
| cmp-0223 | MTO Group - George Sawmill | Timber / manufacturing | PENDING | — |
| cmp-0224 | PG Bison / Thesen | Timber / manufacturing | PENDING | — |
| cmp-0225 | Geelhoutvlei Timbers | Timber / manufacturing | PENDING | — |
| cmp-0226 | Fechters Sawmill | Timber / manufacturing | PENDING | — |
| cmp-0227 | CCS Logistics | Cold chain / logistics | PENDING | — |
| cmp-0228 | Sequence Logistics | Cold chain / logistics | PENDING | — |
| cmp-0229 | Table Bay Cold Storage | Cold chain / logistics | PENDING | — |
| cmp-0230 | Blaauwberg Cold Storage | Cold chain / logistics | PENDING | — |
| cmp-0231 | WastePlan | Waste / recycling | PENDING | — |
| cmp-0232 | EnviroServ | Waste / environmental services | PENDING | — |
| cmp-0233 | Interwaste | Waste / recycling | PENDING | — |
| cmp-0234 | Averda South Africa | Waste / environmental services | PENDING | — |
| cmp-0235 | Resource Innovations Africa | Waste / recycling | PENDING | — |
| cmp-0236 | WasteGo Green | Waste / recycling | PENDING | — |
| cmp-0237 | Brito's Group | Food / meat processing | PENDING | — |
| cmp-0238 | Excellent Meat Group | Food / meat processing | PENDING | — |
| cmp-0239 | Libstar | Food manufacturing | PENDING | — |
| cmp-0240 | Cape Herb & Spice | Food manufacturing | PENDING | — |
| cmp-0241 | Namaqua Wines | Beverage manufacturing | PENDING | — |
| cmp-0242 | Stellenbosch Vineyards / Advini South Africa | Beverage manufacturing | PENDING | — |
| cmp-0243 | Boland Cellar | Beverage / agriculture | PENDING | — |
| cmp-0244 | Spier | Beverage / agriculture | PENDING | — |
| cmp-0245 | Afresh Brands Cape / Equi-Feeds | Animal feed manufacturing | PENDING | — |
| cmp-0246 | Osdam Eco Facility | Agri-processing / circular economy | PENDING | — |
| cmp-0247 | Reliance Compost | Waste / agri-processing | PENDING | — |
| cmp-0248 | Concretex | Construction materials | PENDING | — |
| cmp-0249 | WonderCrete Precast | Construction materials | PENDING | — |
| cmp-0250 | Profile Feeds | Animal feed manufacturing | PENDING | — |
