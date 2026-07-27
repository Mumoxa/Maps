export interface TalentTrack {
  id: string
  slug: string
  name: string
  shortLabel: string
  status: 'live' | 'planned'
  summary: string
  detail: string
  accent: 'salesforce' | 'credit' | 'sap' | 'murex' | 'calypso'
  scope: {
    geography: 'South Africa'
    category: 'business-platform' | 'risk-discipline' | 'capital-markets-platform'
    evidenceStatus: 'verified' | 'awaiting-data'
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
    id: 'salesforce',
    slug: 'salesforce',
    name: 'Salesforce',
    shortLabel: 'Track 01',
    status: 'live',
    summary: 'Search South African Salesforce professionals by cloud, certification signal, employer, location, and ecosystem segment.',
    detail: 'The Salesforce branch now includes the imported v2 market-map people table alongside manual corrections and the ecosystem intelligence page.',
    accent: 'salesforce',
    scope: { geography: 'South Africa', category: 'business-platform', evidenceStatus: 'verified' },
    actions: {
      primaryLabel: 'Back to SA Talent home',
      primaryHref: '/',
      secondaryLabel: 'View Credit Risk',
      secondaryHref: '/credit-risk',
    },
    nextSteps: [
      'Keep profile-level Salesforce additions flowing through the HTML importer or manual correction registry.',
      'Add Salesforce company/detail pages if the next data pack includes deeper account hierarchy fields.',
      'Layer in verification status and outreach workflow fields before using records for client submission.',
    ],
  },
  {
    id: 'credit-risk',
    slug: 'credit-risk',
    name: 'Credit Risk',
    shortLabel: 'Track 02',
    status: 'live',
    summary: 'Continue into the current South African Credit Risk market map with profiles, companies, segments, shortlist, and the interactive map.',
    detail: 'The Credit Risk branch is the live reference implementation with the full bundled dataset and interactive exploration experience.',
    accent: 'credit',
    scope: { geography: 'South Africa', category: 'risk-discipline', evidenceStatus: 'verified' },
    actions: {
      primaryLabel: 'Open Credit Risk',
      primaryHref: '/credit-risk',
      secondaryLabel: 'Back to SA Talent home',
      secondaryHref: '/',
    },
    nextSteps: [
      'Keep expanding the current dataset and improving the interactive map experience.',
      'Use this branch as the reference architecture for future market tracks.',
      'Share reusable components and lookup utilities with new track pages as they come online.',
    ],
  },
  {
    id: 'sap-erp',
    slug: 'sap-erp',
    name: 'SAP ERP',
    shortLabel: 'Track 03',
    status: 'live',
    summary: 'Explore the verified South African SAP ERP market information within the same specialist-talent product structure.',
    detail: 'The SAP ERP market is now part of SA Talent Map as a verified specialist business-platform track, ready for structured people, company, skill, and ecosystem additions.',
    accent: 'sap',
    scope: { geography: 'South Africa', category: 'business-platform', evidenceStatus: 'verified' },
    actions: {
      primaryLabel: 'Search specialist talent',
      primaryHref: '/talent-search?q=SAP%20ERP',
      secondaryLabel: 'Back to SA Talent home',
      secondaryHref: '/',
    },
    nextSteps: [
      'Keep additions within the South African SAP ERP talent and ecosystem scope.',
      'Add people through the shared talent profile model with a source and verification state.',
      'Introduce SAP-specific company, skill, and ecosystem views only when their supporting data is available.',
    ],
  },
  {
    id: 'murex',
    slug: 'murex',
    name: 'Murex',
    shortLabel: 'Track 04',
    status: 'planned',
    summary: 'Prepare a dedicated route for South African Murex talent, platform specialists, and adjacent market intelligence.',
    detail: 'The Murex branch is now reserved in the app structure so incoming additions can plug straight into a dedicated page and future data model.',
    accent: 'murex',
    scope: { geography: 'South Africa', category: 'capital-markets-platform', evidenceStatus: 'awaiting-data' },
    actions: {
      primaryLabel: 'Back to SA Talent home',
      primaryHref: '/',
      secondaryLabel: 'View Credit Risk',
      secondaryHref: '/credit-risk',
    },
    nextSteps: [
      'Define the Murex talent scope, target roles, and source files for the first dataset drop.',
      'Add Murex-specific segment and company models once the source information is available.',
      'Reuse the shared directory and detail-page patterns where they fit the Murex workflow.',
    ],
  },
  {
    id: 'calypso',
    slug: 'calypso',
    name: 'Calypso',
    shortLabel: 'Track 05',
    status: 'planned',
    summary: 'Create space for South African Calypso talent mapping, market coverage, and future recruiting workflows.',
    detail: 'The Calypso branch gives the interactive site a clear place for the next wave of platform-specific additions without crowding the home page.',
    accent: 'calypso',
    scope: { geography: 'South Africa', category: 'capital-markets-platform', evidenceStatus: 'awaiting-data' },
    actions: {
      primaryLabel: 'Back to SA Talent home',
      primaryHref: '/',
      secondaryLabel: 'View Credit Risk',
      secondaryHref: '/credit-risk',
    },
    nextSteps: [
      'Define the Calypso dataset structure and import path for people, companies, and segments.',
      'Decide which Credit Risk components transfer directly and which need Calypso-specific adaptation.',
      'Layer in track-specific summaries and views as soon as the first Calypso data lands.',
    ],
  },
]

const talentTrackBySlug = new Map(talentTracks.map((track) => [track.slug, track]))

export function getTalentTrackBySlug(slug: string) {
  return talentTrackBySlug.get(slug)
}
