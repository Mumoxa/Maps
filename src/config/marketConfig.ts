import type { CompanyGroup, DataPackContract, MarketArea, PlatformConfig } from '../data/types'

export const dataPackContract: DataPackContract = {
  requiredFiles: [
    'profiles.json',
    'companies.json',
    'segments.json',
    'org_chart.json',
    'priority_shortlist.json',
    'summary.json',
  ],
  profileColumns: [
    'id',
    'name',
    'linkedin_url',
    'company',
    'title',
    'location',
    'market_area',
    'skill_pocket',
    'segment',
    'seniority',
    'function',
    'evidence',
    'source_url',
    'verification_basis',
    'fit_score',
    'confidence',
    'notes',
  ],
}

export const marketAreas: MarketArea[] = [
  {
    id: 'credit-risk-analytics',
    name: 'Credit Risk & Analytics',
    slug: 'credit-risk-analytics',
    status: 'live',
    summary: 'The first live speciality map, focused on South African credit risk, model risk, portfolio analytics and lending analytics talent.',
    dataPackId: 'credit-risk-analytics',
  },
  { id: 'ai-data-mlops', name: 'AI, Data Engineering & MLOps', slug: 'ai-data-mlops', status: 'planned', summary: 'Planned map for applied AI, machine learning engineering, data platforms and MLOps capability.' },
  { id: 'cloud-devops-platform', name: 'Cloud, DevOps & Platform Engineering', slug: 'cloud-devops-platform', status: 'planned', summary: 'Planned map for cloud infrastructure, SRE, DevOps, platform engineering and modern delivery teams.' },
  { id: 'cybersecurity-grc-soc', name: 'Cybersecurity, GRC & SOC', slug: 'cybersecurity-grc-soc', status: 'planned', summary: 'Planned map for security operations, governance, risk, compliance, application security and cyber leadership.' },
  { id: 'sap-enterprise-systems', name: 'SAP & Enterprise Systems', slug: 'sap-enterprise-systems', status: 'planned', summary: 'Planned map for SAP functional, technical, integration and enterprise systems capability.' },
  { id: 'salesforce-crm-digital', name: 'Salesforce, CRM & Digital Platforms', slug: 'salesforce-crm-digital', status: 'planned', summary: 'Planned map for CRM, Salesforce, digital platform and customer technology specialists.' },
  { id: 'payments-fintech', name: 'Payments / FinTech', slug: 'payments-fintech', status: 'planned', summary: 'Planned map for payments, banking platforms, cards, acquiring, wallets and fintech product talent.' },
  { id: 'embedded-iot-cpp', name: 'Embedded C++ / IoT', slug: 'embedded-iot-cpp', status: 'planned', summary: 'Planned map for embedded software, C/C++, IoT, edge systems and connected-device engineering.' },
]

export const companyGroups: CompanyGroup[] = [
  { id: 'banks-lenders', name: 'Banks / lenders', summary: 'Retail banks, specialist lenders, insurers and credit providers.' },
  { id: 'retail-fmcg', name: 'Retail / FMCG', summary: 'Large retailers, loyalty ecosystems, consumer goods and adjacent analytics teams.' },
  { id: 'telecoms', name: 'Telecoms', summary: 'Telecommunications groups and digital operators with large-scale customer and risk data.' },
  { id: 'consulting-systems-integrators', name: 'Consulting / systems integrators', summary: 'Consultancies and implementation partners that concentrate scarce delivery skills.' },
  { id: 'product-fintech-scaleups', name: 'Product / fintech scale-ups', summary: 'Product companies, fintechs and high-growth digital businesses.' },
]

export const platformConfig: PlatformConfig = {
  platformName: 'Mumoxa Talent Intelligence Maps',
  tagline: 'Cross-company, cross-skill market intelligence for scarce technology and analytics talent.',
  currentLiveMapId: 'credit-risk-analytics',
  marketAreas,
  companyGroups,
  dataPackContract,
}

export const liveMarketArea = marketAreas.find(area => area.id === platformConfig.currentLiveMapId) ?? marketAreas[0]
