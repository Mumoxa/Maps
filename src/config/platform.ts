import type { MarketArea, SkillPocketDefinition, CompanyViewDefinition, ImportColumnMapping, ImportTemplate } from '../data/types'

export const PLATFORM_NAME = 'Mumoxa Talent Intelligence Maps'

export const PLATFORM_DESCRIPTION =
  'A scalable talent intelligence platform for scarce-skill market maps, company intelligence views, public-domain evidence and importable research data packs.'

export const ACTIVE_MARKET_AREA_ID = 'credit-risk-analytics'

export const marketAreas: MarketArea[] = [
  {
    id: 'credit-risk-analytics',
    slug: 'credit-risk-analytics',
    name: 'Credit Risk & Analytics',
    status: 'live',
    stage: 'current-data-pack',
    description:
      'The first live speciality map: South African credit risk, scorecards, IFRS 9, ECL, collections analytics and lending-risk talent.',
    currentProfileCount: 344,
    currentCompanyCount: 79,
    currentSegmentCount: 67,
    dataPackId: 'credit-risk-v1',
    sourceFiles: [
      'profiles.json',
      'companies.json',
      'segments.json',
      'org_chart.json',
      'priority_shortlist.json',
      'summary.json',
    ],
  },
  {
    id: 'ai-data-mlops',
    slug: 'ai-data-mlops',
    name: 'AI, Data Engineering & MLOps',
    status: 'planned',
    stage: 'awaiting-import',
    description:
      'Machine learning, GenAI, data engineering, lakehouse, analytics engineering, MLOps and production AI skills pockets.',
  },
  {
    id: 'cloud-devops-platform',
    slug: 'cloud-devops-platform',
    name: 'Cloud, DevOps & Platform Engineering',
    status: 'planned',
    stage: 'awaiting-import',
    description:
      'AWS, Azure, GCP, Kubernetes, SRE, DevOps, platform engineering and infrastructure automation talent pools.',
  },
  {
    id: 'cybersecurity-grc-soc',
    slug: 'cybersecurity-grc-soc',
    name: 'Cybersecurity, GRC & SOC',
    status: 'planned',
    stage: 'awaiting-import',
    description:
      'Security operations, threat detection, cloud security, IAM, governance, risk, compliance and cyber leadership talent.',
  },
  {
    id: 'sap-enterprise-systems',
    slug: 'sap-enterprise-systems',
    name: 'SAP & Enterprise Systems',
    status: 'planned',
    stage: 'awaiting-import',
    description:
      'SAP S/4HANA, CAR, FICO, MM, SD, SuccessFactors, enterprise architecture and major ERP transformation talent.',
  },
  {
    id: 'salesforce-crm-digital',
    slug: 'salesforce-crm-digital',
    name: 'Salesforce, CRM & Digital Platforms',
    status: 'planned',
    stage: 'awaiting-import',
    description:
      'Salesforce, Service Cloud, Field Service, Marketing Cloud, Adobe, Dynamics and customer-platform specialists.',
  },
  {
    id: 'payments-fintech',
    slug: 'payments-fintech',
    name: 'Payments, FinTech & Transaction Platforms',
    status: 'planned',
    stage: 'awaiting-import',
    description:
      'Payments engineers, fraud, switching, acquiring, issuing, digital wallets, banking platforms and transaction systems.',
  },
  {
    id: 'embedded-iot-cpp',
    slug: 'embedded-iot-cpp',
    name: 'Embedded, IoT & C++ Engineering',
    status: 'planned',
    stage: 'awaiting-import',
    description:
      'Embedded software, C++, firmware, IoT, hardware-adjacent engineering and industrial technology talent pools.',
  },
]

export const skillPocketDefinitions: SkillPocketDefinition[] = [
  {
    id: 'credit-risk-analytics',
    name: 'Credit Risk & Analytics',
    category: 'Risk / Analytics',
    description: 'Scorecards, IFRS 9, ECL, collections, forecasting, credit strategy and portfolio analytics.',
  },
  {
    id: 'data-bi-analytics',
    name: 'Data, BI & Analytics',
    category: 'Data',
    description: 'BI developers, analysts, data modelers, reporting teams and decision-support specialists.',
  },
  {
    id: 'ai-mlops',
    name: 'AI / ML / MLOps',
    category: 'AI',
    description: 'ML engineers, AI specialists, model deployment, GenAI, experimentation and production ML operations.',
  },
  {
    id: 'cloud-devops-platform',
    name: 'Cloud / DevOps / Platform',
    category: 'Infrastructure',
    description: 'Cloud engineers, SRE, Kubernetes, CI/CD, automation, platform services and reliability teams.',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Security',
    description: 'SOC, IAM, security engineering, governance, cyber risk, detection, response and security leadership.',
  },
  {
    id: 'erp-sap',
    name: 'ERP / SAP',
    category: 'Enterprise Systems',
    description: 'SAP modules, enterprise applications, ERP programmes, business analysis and systems architecture.',
  },
  {
    id: 'crm-salesforce',
    name: 'CRM / Salesforce / Digital Platforms',
    category: 'Customer Platforms',
    description: 'CRM, Salesforce, Adobe, Dynamics, digital engagement and customer lifecycle platform talent.',
  },
  {
    id: 'payments-fintech',
    name: 'Payments / FinTech',
    category: 'Transaction Platforms',
    description: 'Payments, switching, fraud, card systems, acquiring, issuing and fintech product technology skills.',
  },
  {
    id: 'product-digital',
    name: 'Product / Digital',
    category: 'Product',
    description: 'Product managers, digital product owners, UX, delivery leadership and customer-facing digital squads.',
  },
]

export const companyViewDefinition: CompanyViewDefinition = {
  title: 'Company intelligence view',
  description:
    'Each company is treated as a talent ecosystem. Skill pockets can contain profiles from multiple speciality maps, research confidence, evidence quality and future research gaps.',
  defaultSkillPockets: skillPocketDefinitions.map((pocket) => pocket.id),
}

export const importColumnMappings: ImportColumnMapping[] = [
  { canonical: 'id', aliases: ['Profile ID', 'ID', 'profile_id', 'Candidate ID'], required: true, target: 'profile' },
  { canonical: 'name', aliases: ['Full Name', 'Name', 'Candidate Name'], required: true, target: 'profile' },
  { canonical: 'linkedin_url', aliases: ['LinkedIn URL', 'LinkedIn', 'Profile URL'], required: true, target: 'profile' },
  { canonical: 'company', aliases: ['Current Company', 'Employer', 'Company'], required: true, target: 'profile' },
  { canonical: 'title', aliases: ['Current Title', 'Title', 'Role Title', 'Job Title'], required: true, target: 'profile' },
  { canonical: 'location', aliases: ['Country / Location', 'Location', 'City'], required: false, target: 'profile' },
  { canonical: 'market_area', aliases: ['Market Area', 'Speciality Map', 'Skill Area'], required: false, target: 'profile' },
  { canonical: 'skill_pocket', aliases: ['Skill Pocket', 'Specialism', 'Credit Risk Specialism'], required: false, target: 'profile' },
  { canonical: 'segment', aliases: ['Company Segment', 'Segment', 'Industry Segment'], required: false, target: 'both' },
  { canonical: 'seniority', aliases: ['Seniority Level', 'Seniority'], required: false, target: 'profile' },
  { canonical: 'function', aliases: ['Function', 'Discipline'], required: false, target: 'profile' },
  { canonical: 'evidence', aliases: ['Evidence of Relevance', 'Evidence of Credit Risk Relevance', 'Evidence'], required: false, target: 'evidence' },
  { canonical: 'source_url', aliases: ['Evidence Source URL', 'Source URL', 'Source'], required: false, target: 'evidence' },
  { canonical: 'verification_basis', aliases: ['Verification Basis', 'Basis'], required: false, target: 'evidence' },
  { canonical: 'fit_score', aliases: ['Fit Score 1–10', 'Fit Score', 'Score'], required: false, target: 'profile' },
  { canonical: 'confidence', aliases: ['Confidence Level', 'Confidence'], required: false, target: 'evidence' },
  { canonical: 'notes', aliases: ['Notes', 'Comments'], required: false, target: 'profile' },
]

export const importTemplates: ImportTemplate[] = [
  {
    id: 'profile-market-map',
    name: 'Profile market map import',
    description: 'Primary Excel/XLSX import for person-level public-domain research rows.',
    acceptedSheets: ['Profiles', 'Profile Market Map', 'Sheet1'],
    requiredCanonicalColumns: ['id', 'name', 'linkedin_url', 'company', 'title'],
  },
  {
    id: 'company-skill-pocket-import',
    name: 'Company skill-pocket import',
    description: 'Company-first import for one company with multiple skill pockets and profile counts.',
    acceptedSheets: ['Company Skill Pockets', 'Companies', 'Org View'],
    requiredCanonicalColumns: ['company', 'skill_pocket'],
  },
]

export const dataArchitectureNotes = [
  'Credit Risk & Analytics remains the first live speciality map, not the whole product.',
  'Every future map should arrive as a data pack with profiles, companies, segments, org chart, shortlist and summary outputs.',
  'The company view must aggregate skill pockets across multiple maps so one company can reveal several scarce-skill communities.',
  'Imported XLS/XLSX rows should be normalized into canonical profile, company, evidence and company-skill-pocket records before rendering.',
]
