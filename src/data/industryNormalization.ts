/**
 * Industry normalization for Bellville CA(SA) recruitment data.
 * Maps 316 unique industry strings to 11 core sectors for filtering.
 *
 * Core sectors cover the property, infrastructure, finance and adjacent
 * capital-project domains relevant to the Bellville Project Finance role.
 */

export const CORE_INDUSTRIES = {
  PROPERTY_DEVELOPMENT: 'Property Development & Investment',
  PROPERTY_FINANCE: 'Property Finance & Banking',
  CONSTRUCTION: 'Construction & Engineering',
  INFRASTRUCTURE: 'Infrastructure & Renewables',
  AUDIT_ACCOUNTING: 'Audit, Assurance & Accounting',
  REAL_ESTATE_SERVICES: 'Real Estate Services',
  FINANCIAL_SERVICES: 'Financial Services & Capital Markets',
  PRIVATE_EQUITY: 'Private Equity & Alternative Assets',
  ADJACENT_CAPEX: 'Adjacent Capex & Operations',
  UNCONFIRMED: 'Unconfirmed Sector',
  OTHER: 'Other',
} as const

export type CoreIndustry = typeof CORE_INDUSTRIES[keyof typeof CORE_INDUSTRIES]

/**
 * Normalize a raw industry string (from people.jsonl) to a core industry.
 * Uses keyword matching with longest-match-wins logic.
 */
export function normalizeIndustry(rawIndustry: string | null | undefined): CoreIndustry {
  if (!rawIndustry || rawIndustry.trim() === '') {
    return CORE_INDUSTRIES.UNCONFIRMED
  }

  const input = rawIndustry.toLowerCase().trim()

  // Check for exact matches first (fast path)
  if (
    input.includes('unconfirmed') ||
    input === 'unknown' ||
    input === ''
  ) {
    return CORE_INDUSTRIES.UNCONFIRMED
  }

  // Property Development & Investment
  if (
    /property.*development|residential|mixed-use|estate|development.*property|property.*investment(?!.*bank|.*finance|.*lend)/i.test(input) ||
    /developer|reit.*property|property.*reit|property.*fund|property\s+[a-z]*\s+development/i.test(input) ||
    /self-storage.*development|student.*property|campus.*development|retirement.*property/i.test(input)
  ) {
    return CORE_INDUSTRIES.PROPERTY_DEVELOPMENT
  }

  // Property Finance & Banking
  if (
    /property.*finance|property.*bank|property.*lend|mortgage.*finance|commercial.*lend|property.*credit|development.*finance.*property/i.test(input) ||
    /property.*investment.*bank|investment.*banking.*real.*estate|reit|property.*portfolio/i.test(input) ||
    /real.*estate.*lend|commercial.*property.*invest/i.test(input)
  ) {
    return CORE_INDUSTRIES.PROPERTY_FINANCE
  }

  // Construction & Engineering
  if (
    /construction|engineering|contractor|civil|building|formwork|scaffolding|concrete|infrastructure\s*construct/i.test(input) ||
    /construction.*material|building.*material|construction.*supply|construction.*engineering/i.test(input)
  ) {
    return CORE_INDUSTRIES.CONSTRUCTION
  }

  // Infrastructure & Renewables
  if (
    /renewable|energy|infrastructure|wind|solar|power|electricity|fibre|telecom.*tower|port.*logistics|water.*infra|roads/i.test(input) ||
    /renewable.*project|renewable.*development|energy.*finance|infra.*invest|renewable.*capital/i.test(input) ||
    /renewable.*project.*finance|project.*finance.*infra|infrastructure.*project/i.test(input)
  ) {
    return CORE_INDUSTRIES.INFRASTRUCTURE
  }

  // Audit, Assurance & Accounting (standalone sector)
  if (
    /audit|assurance.*(?!construction)|audit.*property|audit.*reit|audit.*real.*estate|audit.*construct/i.test(input) ||
    /professional.*accounting|accounting.*practice|audit.*accounting|internal.*audit/i.test(input)
  ) {
    return CORE_INDUSTRIES.AUDIT_ACCOUNTING
  }

  // Real Estate Services (valuations, brokerage, property services)
  if (
    /valuation|valuations|tax.*real.*estate|real.*estate.*service|property.*service|cbre|broll|advisory(?!.*audit)/i.test(input) ||
    /professional.*services.*valuat|commercial.*real.*estate|real.*estate|property.*broker/i.test(input)
  ) {
    return CORE_INDUSTRIES.REAL_ESTATE_SERVICES
  }

  // Financial Services & Capital Markets
  if (
    /banking|investment.*bank|capital.*market|corporate.*finance|finance.*advisory|financial.*services|credit.*risk|treasury|fintech/i.test(input) ||
    /corporate.*finance.*not.*property|investment.*banking(?!.*real.*estate)|capital.*market|financial\s+institution/i.test(input) ||
    /payments|lending|asset.*management.*not.*property|wealth.*management/i.test(input)
  ) {
    return CORE_INDUSTRIES.FINANCIAL_SERVICES
  }

  // Private Equity & Alternative Assets
  if (
    /private.*equity|private.*capital|alternative.*asset|private.*market|venture.*capital|private.*debt|climate.*capital|impact.*invest/i.test(input) ||
    /private.*credit|fund.*investment|investment.*fund(?!.*property|.*real.*estate)|asset.*manage.*alternative/i.test(input)
  ) {
    return CORE_INDUSTRIES.PRIVATE_EQUITY
  }

  // Adjacent Capex & Operations
  if (
    /retail|hospitality|hotel|casino|resort|higher.*education|school|hospital|medical|pharmaceutical|agriculture|mining|manufacturing|logistics|food.*retail|data.*centre|telecom/i.test(input) ||
    /tech|software|saas|platform|media|insurance|pharma|healthcare|educational|accommodation|storage\s+(?!property|real)/i.test(input) ||
    /multi.*industry|group.*finance|corporate|operational.*finance|private.*company|smb|sme/i.test(input)
  ) {
    return CORE_INDUSTRIES.ADJACENT_CAPEX
  }

  // If no clear match, classify as OTHER
  return CORE_INDUSTRIES.OTHER
}

/**
 * Extract all normalized industries from a profile set.
 * Returns counts to display in filter UI.
 */
export function extractIndustries(
  profiles: Array<{ attributes?: Record<string, unknown> }>,
): Record<CoreIndustry, number> {
  const counts: Record<CoreIndustry, number> = {
    [CORE_INDUSTRIES.PROPERTY_DEVELOPMENT]: 0,
    [CORE_INDUSTRIES.PROPERTY_FINANCE]: 0,
    [CORE_INDUSTRIES.CONSTRUCTION]: 0,
    [CORE_INDUSTRIES.INFRASTRUCTURE]: 0,
    [CORE_INDUSTRIES.AUDIT_ACCOUNTING]: 0,
    [CORE_INDUSTRIES.REAL_ESTATE_SERVICES]: 0,
    [CORE_INDUSTRIES.FINANCIAL_SERVICES]: 0,
    [CORE_INDUSTRIES.PRIVATE_EQUITY]: 0,
    [CORE_INDUSTRIES.ADJACENT_CAPEX]: 0,
    [CORE_INDUSTRIES.UNCONFIRMED]: 0,
    [CORE_INDUSTRIES.OTHER]: 0,
  }

  profiles.forEach((profile) => {
    const rawIndustry = (profile.attributes?.current_industry || '').toString()
    const normalized = normalizeIndustry(rawIndustry)
    counts[normalized]++
  })

  return counts
}
