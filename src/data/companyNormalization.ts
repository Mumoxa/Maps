/**
 * Company-name normalisation — canonical entities + alias table.
 *
 * Built from a frequency scan of every company string in the talent pool and
 * contacts directory (2026-08-26): profiles.json, markets/salesforce (legacy +
 * batches), markets/hackathons (candidate organisations) and the 5,070-contact
 * contact directory (src/data/contact-parts). Variants observed in the data are
 * listed explicitly below so every merge stays auditable — nothing is merged on
 * guesswork. The generic legal-suffix stripper catches "Ltd / (Pty) Ltd / Limited"
 * style variants beyond this table.
 *
 * Keys are lowercase; values are the canonical display names.
 */
const CANONICAL_ALIASES: Record<string, string> = {
  // Existing research names CCH as Commercial Cold Holdings (acc-0833..0835).
  'cch commercial cold holdings': 'Commercial Cold Holdings',
  // Banks
  'absa': 'Absa',
  'absa group': 'Absa',
  'absa group limited': 'Absa',
  'absa bank': 'Absa',
  'absa bank limited': 'Absa',
  'absa cib': 'Absa',
  'absa card': 'Absa',
  'standard bank': 'Standard Bank',
  'standard bank group': 'Standard Bank',
  'standard bank group limited': 'Standard Bank',
  'standard bank south africa': 'Standard Bank',
  'standard bank corporate and investment banking': 'Standard Bank',
  'murex / standard bank south africa': 'Standard Bank',
  'tesserai / standard bank history': 'Standard Bank',
  'fnb': 'FNB',
  'fnb south africa': 'FNB',
  'first national bank': 'FNB',
  'fnb commercial south africa': 'FNB',
  'fnb / rmb': 'FNB',
  'fnb (firstrand) / recent moves noted': 'FNB',
  'fnb namibia / fnb south africa history': 'FNB',
  'nedbank': 'Nedbank',
  'nedbank group': 'Nedbank',
  'nedbank corporate & investment banking': 'Nedbank',
  'nedbank corporate and investment banking': 'Nedbank',
  'nedbank (data science intern)': 'Nedbank',
  'capitec': 'Capitec',
  'capitec bank': 'Capitec',
  'investec': 'Investec',
  'investec asset management': 'Investec',
  'african bank': 'African Bank',
  'tymebank': 'TymeBank',
  // Insurers / wealth
  'old mutual': 'Old Mutual',
  'old mutual south africa': 'Old Mutual',
  'old mutual insure': 'Old Mutual',
  'old mutual limited': 'Old Mutual',
  'old mutual investment group': 'Old Mutual',
  'old mutual wealth': 'Old Mutual',
  'sanlam': 'Sanlam',
  'sanlam investments': 'Sanlam',
  'sanlam fintech': 'Sanlam',
  'sanlam corporate': 'Sanlam',
  'glacier by sanlam': 'Sanlam',
  'discovery': 'Discovery',
  'discovery limited': 'Discovery',
  'discovery bank': 'Discovery',
  'discovery health': 'Discovery',
  'discovery vitality': 'Discovery',
  'momentum': 'Momentum Metropolitan',
  'momentum metropolitan': 'Momentum Metropolitan',
  // Telecoms
  'vodacom': 'Vodacom',
  'vodacom group': 'Vodacom',
  'vodacom business - south africa': 'Vodacom',
  'vodacom financial services': 'Vodacom',
  'vodacom / former capitec': 'Vodacom',
  'mtn': 'MTN',
  'mtn group': 'MTN',
  'mtn south africa': 'MTN',
  'mtn business south africa': 'MTN',
  'momo from mtn': 'MTN',
  'telkom': 'Telkom',
  'telkom business': 'Telkom',
  'telkom sa': 'Telkom',
  // Retail
  'tfg (the foschini group)': 'TFG (The Foschini Group)',
  'tfg': 'TFG (The Foschini Group)',
  'tfg - the foschini group': 'TFG (The Foschini Group)',
  'the shoprite group of companies': 'Shoprite',
  'shoprite': 'Shoprite',
  'shoprite group': 'Shoprite',
  'shopritex': 'Shoprite',
  'shoprite financial services': 'Shoprite',
  'shoprite checkers group': 'Shoprite',
  'shoprite checkers - ok franchise division': 'Shoprite',
  'woolworths': 'Woolworths',
  'woolworths financial services': 'Woolworths',
  'woolworths / bash': 'Woolworths',
  'truworths': 'Truworths',
  'mr price': 'Mr Price',
  'pick n pay': 'Pick n Pay',
  // Tech / platforms
  'takealot': 'Takealot',
  'takealot.com': 'Takealot',
  'multichoice': 'MultiChoice',
  'multichoice group': 'MultiChoice',
  'entelect': 'Entelect',
  'amazon web services (aws)': 'Amazon Web Services',
  'microsoft south africa': 'Microsoft',
  // Universities (frequent organisation values in the candidate pool)
  'uct': 'University of Cape Town',
  'wits': 'University of the Witwatersrand',
  'wits university': 'University of the Witwatersrand',
  'university of the witwatersrand': 'University of the Witwatersrand',
  'university of south africa/universiteit van suid-afrika': 'University of South Africa',
  'unisa': 'University of South Africa',
  'north-west university / noordwes-universiteit': 'North-West University',
  'nwu': 'North-West University',
  'sut': 'Stellenbosch University',
}

const LEGAL_SUFFIX =
  /[\s,]*(\(\s*(?:pty|rf|public)\s*\)\s*)?((?:ltd|limited|incorporated|inc|plc|rf)[\s,.]*)?(\(\s*(?:pty|rf)\s*\))?$/i

/**
 * Employer strings that are notes about the data, not company names.
 *
 * The contact and accountant sources record uncertainty in the employer column
 * itself ("Employer verify", "Current employer unconfirmed"). Treated as company
 * names, each one becomes a phantom organization in the atlas with people
 * attached to it, which then reads as a real employer with an odd name.
 *
 * This is a configuration table rather than a special case in business logic: it
 * lists the phrasings the sources actually contain, so a new note-style value is
 * added here (and covered by a test) instead of being rendered as a company.
 *
 * Matching happens on the whole value with punctuation flattened, so a real
 * company whose name merely contains one of these words is never excluded.
 */
export const EMPLOYER_PLACEHOLDER_PATTERNS: RegExp[] = [
  /^employer\s+(?:to\s+)?verify$/,
  /^employer\s+unconfirmed$/,
  /^employer\s+and\s+title\s+unconfirmed$/,
  /^employer\s+current\s+unconfirmed$/,
  /^current\s+employer\s+(?:to\s+)?verify$/,
  /^current\s+employer\s+unconfirmed$/,
  /^current\s+company\s+unconfirmed$/,
  /^current\s+renewable\s+energy\s+employer\s+verify$/,
  /^project\s+based\s+employer\s+unconfirmed$/,
  /^growth\s+stage\s+business\s+employer\s+verify$/,
  /^entrepreneurial\s+cfo\s+employer\s+verify$/,
  /^finance\s+executive\s+employer\s+verify$/,
  /^property\s+and\s+private\s+company\s+finance\s+employer\s+verify$/,
  /^renewables\s+company\s+verify$/,
  /^unconfirmed$/,
  /^unknown$/,
  /^not\s+applicable$/,
  /^n\s*a$/,
  /^-$/,
]

/** Lowercase, punctuation and spacing flattened, so matching is total. */
function placeholderKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * True when an employer value is a source's uncertainty note rather than a
 * company. Such a value must never resolve to a company record: the people
 * behind it are reported as "employer not established" instead.
 */
export function isEmployerPlaceholder(raw: string | null | undefined): boolean {
  const key = placeholderKey(raw ?? '')
  if (!key) return true
  return EMPLOYER_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(key))
}

function tidy(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').replace(/[.,;]+$/, '')
}

function lookup(raw: string): string | null {
  const direct = CANONICAL_ALIASES[raw.toLowerCase()]
  if (direct) return direct
  // "The X" collapses when X is a known entity ("The Shoprite Group" case handled by exact alias above)
  const theLess = raw.replace(/^the\s+/i, '')
  const theHit = CANONICAL_ALIASES[theLess.toLowerCase()]
  return theHit ?? null
}

/**
 * Resolve any company/organisation string to its canonical display name.
 * Unknown names return tidied as-is (canonical === itself), so nothing is lost.
 */
export function canonicalCompanyName(raw: string | null | undefined): string {
  const value = tidy(raw ?? '')
  if (!value) return ''
  const direct = lookup(value)
  if (direct) return direct
  const stripped = value.replace(LEGAL_SUFFIX, '').trim()
  if (stripped !== value) {
    const strippedHit = lookup(stripped)
    if (strippedHit) return strippedHit
    if (stripped) return stripped
  }
  return value
}

/** True when two company strings refer to the same canonical entity. */
export function sameCompany(left: string | null | undefined, right: string | null | undefined): boolean {
  const a = canonicalCompanyName(left)
  const b = canonicalCompanyName(right)
  return Boolean(a) && Boolean(b) && a.toLowerCase() === b.toLowerCase()
}

/** All known aliases that resolve to the given canonical name (for tooltips/labels). */
export function companyAliasesFor(canonical: string): string[] {
  return Object.entries(CANONICAL_ALIASES)
    .filter(([, target]) => target === canonical)
    .map(([alias]) => alias)
}

/** For UI: "{ canonical, original }" so cards can show what was merged. */
export function canonicalCompanyWithOrigin(raw: string | null | undefined): { canonical: string; original: string } {
  const original = tidy(raw ?? '')
  return { canonical: canonicalCompanyName(raw), original }
}

/** Visible for tests/review: number of documented alias mappings. */
export const COMPANY_ALIAS_COUNT = Object.keys(CANONICAL_ALIASES).length
