import type { DataBundle, CompanyAliasMap, SegmentNormalizationMap } from './types'

let cachedAliasMap: CompanyAliasMap | null = null
let cachedSegmentMap: SegmentNormalizationMap | null = null

export function buildCompanyAliasMap(data: DataBundle): CompanyAliasMap {
  if (cachedAliasMap) return cachedAliasMap

  const map: CompanyAliasMap = {
    "FNB": "FirstRand / FNB / WesBank / RMB",
    "FNB South Africa": "FirstRand / FNB / WesBank / RMB",
    "FNB / RMB": "FirstRand / FNB / WesBank / RMB",
    "FNB (FirstRand) / recent moves noted": "FirstRand / FNB / WesBank / RMB",
    "FNB Commercial South Africa": "FirstRand / FNB / WesBank / RMB",
    "FNB Namibia / FNB South Africa history": "FirstRand / FNB / WesBank / RMB",
    "FNB / RMB history": "FirstRand / FNB / WesBank / RMB",
    "First National Bank": "FirstRand / FNB / WesBank / RMB",
    "FirstRand": "FirstRand / FNB / WesBank / RMB",
    "FirstRand Group": "FirstRand / FNB / WesBank / RMB",
    "FirstRand Bank Limited": "FirstRand / FNB / WesBank / RMB",
    "FirstRand Bank Ltd": "FirstRand / FNB / WesBank / RMB",
    "FirstRand Group / Rand Merchant Bank": "FirstRand / FNB / WesBank / RMB",
    "RMB - Rand Merchant Bank": "FirstRand / FNB / WesBank / RMB",
    "Rand Merchant Bank": "FirstRand / FNB / WesBank / RMB",
    "WesBank (FirstRand)": "WesBank",
    "Former WesBank": "WesBank",
    "Absa": "Absa Group",
    "ABSA": "Absa Group",
    "Absa CIB": "Absa Group",
    "Absa Card": "Absa Group",
    "Barclays Africa Group Limited": "Absa Group",
    "Standard Bank": "Standard Bank Group",
    "Standard Bank South Africa": "Standard Bank Group",
    "Standard Bank Corporate and Investment Banking": "Standard Bank Group",
    "Murex / Standard Bank South Africa": "Standard Bank Group",
    "Tesserai / Standard Bank history": "Standard Bank Group",
    "Capitec Bank": "Capitec",
    "Capitec Bank (former)": "Capitec",
    "Capitec / KPMG South Africa": "Capitec",
    "Capitec / Prodigy Finance": "Capitec",
    "Nedbank Corporate & Investment Banking": "Nedbank",
    "Deloitte": "Deloitte South Africa",
    "EY": "EY South Africa",
    "KPMG": "KPMG South Africa",
    "Experian": "Experian South Africa",
    "Experian South Africa": "Experian South Africa",
    "Experian / Credit Risk & Finance Professional": "Experian South Africa",
    "RCS Personal Finance": "RCS",
    "RCS / Principa": "RCS",
    "TFG": "TFG (The Foschini Group)",
    "Tyme": "TymeBank",
    "JUMO": "JUMO",
    "JUMO.WORLD": "JUMO",
    "TransUnion": "TransUnion Africa",
    "SAS Institute South Africa": "SAS South Africa",
    "Principa": "Principa",
    "Principa Decisions": "Principa",
    "Lewis Group": "Lewis Group Ltd",
    "Monocle Solutions / GSFP": "Monocle Solutions",
    "The Shoprite Group of Companies": "Shoprite / Money Market",
    "Shoprite Checkers - OK Franchise Division": "Shoprite / Money Market",
    "South African Reserve Bank - Prudential Authority": "South African Reserve Bank (PA)",
    "Pepkor Lifestyle / Connect Financial Solutions": "Pepkor",
    "Pepkor Payments and Lending": "Pepkor",
    "Lula": "Lula / Lulalend",
    "Merchant Capital South Africa": "Merchant Capital",
    "Yoco": "Yoco Capital",
    "VVM Inc": "VVM",
    "Old Mutual South Africa": "Old Mutual Finance / OM Bank",
    "DirectAxis": "DirectAxis",
    "Sanlam Personal Loans / former DirectAxis": "Sanlam",
    "DBSA": "Development Bank of Southern Africa",
    "Truworths": "Truworths",
    "HomeChoice": "HomeChoice",
    "Woolworths Financial Services": "Woolworths Financial Services",
    "African Bank": "African Bank",
    "Investec": "Investec",
    "Bayport Financial Services": "Bayport Financial Services",
    "Intelligent Debt Management": "Intelligent Debt Management",
    "Discovery Bank": "Discovery Bank",
    "Discovery Limited": "Discovery Limited",
    "Capfin": "Capfin",
  }

  cachedAliasMap = map
  return map
}

export function buildSegmentNormalizationMap(data: DataBundle): SegmentNormalizationMap {
  if (cachedSegmentMap) return cachedSegmentMap

  const map: SegmentNormalizationMap = {
    "Bank / Digital Bank": "Bank",
    "Bank / Wealth": "Bank",
    "Collections": "Collections / debt recovery",
    "Collections / Debt Recovery": "Collections / debt recovery",
    "Consulting / Analytics": "Analytics Consulting",
    "Consulting / Technology": "Consulting",
    "Credit Bureau / Data": "Credit bureau / analytics",
    "Credit Repair / Fintech": "Fintech lending",
    "Credit Risk Consulting": "Consulting",
    "Data Provider": "Credit bureau / analytics",
    "Debt Review": "Debt review / fintech",
    "Finance / Insurance": "Insurance / lending",
    "Fintech / Asset Finance": "Fintech lending",
    "Fintech / BNPL": "Fintech lending",
    "Fintech Lending": "Fintech lending",
    "Insurance": "Insurance / lending",
    "Insurance / Digital": "Digital bank / insurance",
    "Insurance / Finance": "Insurance / lending",
    "Insurance / Wealth": "Insurance / lending",
    "KYC / Fraud": "Corporate credit / trade credit",
    "Lending / Collections": "Collections / debt recovery",
    "Payments / Fintech": "Fintech lending",
    "Risk Data / Analytics": "Analytics / bank",
    "Risk Software": "Risk software / bank",
    "Risk Technology": "Risk software / bank",
    "Unsecured Lender": "Unsecured lender",
    "Asset Management": "Investment / Credit",
    "Analytics Software": "Analytics / Software",
    "BNPL": "Fintech lending",
    "Retail Credit": "Retail credit",
    "Vehicle Finance": "Vehicle finance",
    "Digital Bank": "Digital bank",
    "Credit Bureau": "Credit bureau",
  }

  cachedSegmentMap = map
  return map
}

export function normalizeCompanyName(raw: string, data: DataBundle): string {
  if (raw === 'Needs verification') return 'Needs verification'
  const map = buildCompanyAliasMap(data)
  return map[raw] || raw
}

export function normalizeSegmentName(raw: string, data: DataBundle): string {
  const map = buildSegmentNormalizationMap(data)
  return map[raw] || raw
}
