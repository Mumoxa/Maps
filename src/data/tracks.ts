export interface TalentTrack {
  id: string
  slug: string
  name: string
  shortLabel: string
  summary: string
  detail: string
  accent: 'salesforce' | 'credit' | 'sap' | 'murex' | 'calypso' | 'hackathon' | 'accounting'
  scope: {
    geography: 'South Africa'
    category: 'business-platform' | 'risk-discipline' | 'capital-markets-platform' | 'talent-pool'
  }
  actions: {
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
  }
  nextSteps: string[]
}

export const talentTracks: TalentTrack[] = [
  {
    id: 'credit-risk',
    slug: 'credit-risk',
    name: 'Credit Risk',
    shortLabel: 'Track 01',
    summary: 'Continue into the current South African Credit Risk market map with profiles, companies, segments, shortlist, and the interactive map.',
    detail: 'The first skills pool built in the SA Talent Map and its live reference implementation, with the full bundled dataset and interactive exploration experience.',
    accent: 'credit',
    scope: { geography: 'South Africa', category: 'risk-discipline' },
    actions: {
      primaryLabel: 'Open Credit Risk',
      primaryHref: '/credit-risk',
      secondaryLabel: 'Back to SA Talent home',
      secondaryHref: '/',
    },
    nextSteps: [
      'Keep expanding the current dataset through verified append-only batches.',
      'Use this branch as the reference architecture for future market tracks.',
      'Share reusable components and lookup utilities with new track pages as they come online.',
    ],
  },
  {
    id: 'salesforce',
    slug: 'salesforce',
    name: 'Salesforce',
    shortLabel: 'Track 02',
    summary: 'Search South African Salesforce professionals by cloud, certification signal, employer, location, and ecosystem segment.',
    detail: 'The Salesforce branch combines the retained legacy dataset with append-only source-verified batches and the ecosystem intelligence page.',
    accent: 'salesforce',
    scope: { geography: 'South Africa', category: 'business-platform' },
    actions: {
      primaryLabel: 'Back to SA Talent home',
      primaryHref: '/',
      secondaryLabel: 'View Credit Risk',
      secondaryHref: '/credit-risk',
    },
    nextSteps: [
      'Continue adding verified Salesforce profiles through the shared append-only batch importer.',
      'Add Salesforce company/detail pages if the next data pack includes deeper account hierarchy fields.',
      'Keep market-specific Salesforce facts in auditable attributes without changing the shared profile contract.',
    ],
  },
  {
    id: 'hackathons',
    slug: 'hackathons',
    name: 'Hackathon Talent',
    shortLabel: 'Track 03',
    summary: 'Search the SA hackathon contestant pool: verified winners, top-3 and top-10 placements with event, year, university, organisation and province.',
    detail: 'Candidates are source-retained from the SA Hackathon Census — a public-source, evidence-linked census of South African hackathon participants. Every record keeps its participation history and evidence URL; nothing is inferred.',
    accent: 'hackathon',
    scope: { geography: 'South Africa', category: 'talent-pool' },
    actions: {
      primaryLabel: 'Open Hackathon Talent',
      primaryHref: '/hackathons',
      secondaryLabel: 'Back to SA Talent home',
      secondaryHref: '/',
    },
    nextSteps: [
      'Grow the pool through the census continuation passes (profile discovery, recursion, series archives).',
      'Keep candidate records append-only and evidence-linked; never attach profiles on name similarity alone.',
      'Link standout candidates to market tracks once employers or ventures are publicly confirmed.',
    ],
  },
  {
    id: 'sap-erp',
    slug: 'sap-erp',
    name: 'SAP ERP',
    shortLabel: 'Track 04',
    summary: 'Explore the verified South African SAP ERP market information within the same specialist-talent product structure.',
    detail: 'The SAP ERP market is now part of SA Talent Map as a verified specialist business-platform track, ready for structured people, company, skill, and ecosystem additions.',
    accent: 'sap',
    scope: { geography: 'South Africa', category: 'business-platform' },
    actions: {
      primaryLabel: 'Search specialist talent',
      primaryHref: '/talent-search?q=SAP%20ERP',
      secondaryLabel: 'Back to SA Talent home',
      secondaryHref: '/',
    },
    nextSteps: [
      'Keep additions within the South African SAP ERP talent and ecosystem scope.',
      'Add people through the shared batch model with source evidence and supplier verification.',
      'Introduce SAP-specific company, skill, and ecosystem views only when their supporting data is available.',
    ],
  },
  {
    id: 'murex',
    slug: 'murex',
    name: 'Murex',
    shortLabel: 'Track 05',
    summary: 'Prepare a dedicated route for South African Murex talent, platform specialists, and adjacent market intelligence.',
    detail: 'The Murex branch is now reserved in the app structure so incoming additions can plug straight into a dedicated page and future data model.',
    accent: 'murex',
    scope: { geography: 'South Africa', category: 'capital-markets-platform' },
    actions: {
      primaryLabel: 'Back to SA Talent home',
      primaryHref: '/',
      secondaryLabel: 'View Credit Risk',
      secondaryHref: '/credit-risk',
    },
    nextSteps: [
      'Prepare a verified Murex CSV batch using the shared import template.',
      'Add Murex-specific segment and company models once the source information is available.',
      'Reuse the shared directory and detail-page patterns where they fit the Murex workflow.',
    ],
  },
  {
    id: 'calypso',
    slug: 'calypso',
    name: 'Calypso',
    shortLabel: 'Track 06',
    summary: 'Create space for South African Calypso talent mapping, market coverage, and future recruiting workflows.',
    detail: 'The Calypso branch gives the interactive site a clear place for the next wave of platform-specific additions without crowding the home page.',
    accent: 'calypso',
    scope: { geography: 'South Africa', category: 'capital-markets-platform' },
    actions: {
      primaryLabel: 'Back to SA Talent home',
      primaryHref: '/',
      secondaryLabel: 'View Credit Risk',
      secondaryHref: '/credit-risk',
    },
    nextSteps: [
      'Prepare a verified Calypso CSV batch using the shared import template.',
      'Decide which Credit Risk components transfer directly and which need Calypso-specific adaptation.',
      'Layer in track-specific summaries and views as soon as the first Calypso data lands.',
    ],
  },
  {
    id: 'accounting-finance',
    slug: 'accounting-finance',
    name: 'Accounting & Finance',
    shortLabel: 'Track 07',
    summary: 'Search professionally qualified South African accountants and finance professionals by designation, province, industry, role family, and employer.',
    detail: 'Evidence-backed candidates from the SA Qualified Accountant & Finance Skills Intelligence Map — CA(SA), AGA(SA), PA(SA), CIMA (ACMA/FCMA/CGMA) and ACCA/FCCA professionals. Every record carries its qualification evidence and source URLs; nothing is inferred.',
    accent: 'accounting',
    scope: { geography: 'South Africa', category: 'talent-pool' },
    actions: {
      primaryLabel: 'Open Accounting & Finance',
      primaryHref: '/accounting-finance',
      secondaryLabel: 'Back to SA Talent home',
      secondaryHref: '/',
    },
    nextSteps: [
      'Grow the pool through the append-only research batches under markets/accountants/.',
      'Keep candidate records evidence-linked; consult people_index.md before adding anyone and never attach on name similarity alone.',
      'Expand systems-linked and under-covered-province coverage as verified sources are found.',
    ],
  },
]

const talentTrackBySlug = new Map(talentTracks.map((track) => [track.slug, track]))

export function getTalentTrackBySlug(slug: string) {
  return talentTrackBySlug.get(slug)
}
