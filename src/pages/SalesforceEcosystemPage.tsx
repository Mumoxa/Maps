import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Building2, Cloud, Layers, ShieldCheck } from 'lucide-react'
import { StatCard } from '../components/ui/StatCard'
import { useData } from '../context/DataContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { deriveMarketSummary, getTalentProfiles } from '../data'

const customerClouds = [
  { name: 'Sales Cloud', count: 268 },
  { name: 'Service Cloud', count: 266 },
  { name: 'Marketing Cloud', count: 60 },
  { name: 'Financial Services Cloud', count: 25 },
  { name: 'Commerce Cloud', count: 22 },
  { name: 'Platform', count: 12 },
  { name: 'Health Cloud', count: 8 },
  { name: 'Experience Cloud', count: 6 },
  { name: 'Field Service', count: 3 },
  { name: 'Data Cloud', count: 2 },
  { name: 'Agentforce', count: 2 },
  { name: 'CPQ', count: 2 },
] as const

const topIndustries = [
  { name: 'Technology / Services', count: 25 },
  { name: 'Retail', count: 14 },
  { name: 'Hospitality', count: 12 },
  { name: 'Education', count: 12 },
  { name: 'Insurance', count: 10 },
  { name: 'IT Services', count: 10 },
  { name: 'Logistics', count: 9 },
  { name: 'MVNO', count: 9 },
  { name: 'Banking', count: 8 },
  { name: 'CPG', count: 8 },
  { name: 'Construction', count: 8 },
  { name: 'Asset Management', count: 7 },
] as const

const leadershipSignals = [
  'Linda Saunders — Country Manager & Sr Director Solution Engineering Africa — Salesforce — Cape Town — promoted Feb 2025, ex-Barloworld Equipment EPMO',
  'Neil Green — Regional Vice President, Africa — Johannesburg — Agentforce World Tour Johannesburg keynote signal',
  'Zuko Mdwaba — ex-Area VP SA 2020–Jan 2025 — cited in v2 map against Africa and South Africa customer footprint',
  'Salesforce SA legal entity noted as 2022 — Johannesburg — support numbers captured in source map',
  'Partner ecosystem note: 1,000+ certified individuals SA, +55% certification growth FY23, +46% certified headcount',
  'Agentforce World Tour Johannesburg — 3 Jun 2026 — AWS Marketplace SA, Agentforce + Data Cloud 360, The Courier Guy live agentic demo',
] as const

const cloudFootprintBadges = [
  'Sales Cloud ~210', 'Service Cloud ~232', 'Marketing Cloud 89', 'Financial Services Cloud 41',
  'Health Cloud 3', 'Commerce Cloud 18', 'Experience Cloud 34', 'Data Cloud 14',
  'Agentforce 6 pilot / 1 GA', 'Tableau 47', 'MuleSoft 62', 'CPQ 19', 'Field Service 22',
] as const

// Per-company practitioner counts were removed in the July 2026 provenance audit: the
// original figures (CloudSmiths 179, Accenture 137, ...) were inflated by machine-generated
// records. Cloud focus and partner tier come from the v2 market-map source and are retained.
const topCompanies = [
  { name: 'CloudSmiths', type: 'Partner', priority: 'P1', clouds: 'Agentforce, Service Cloud, Marketing Cloud, Financial Services Cloud, Data Cloud' },
  { name: 'Accenture South Africa', type: 'Partner', priority: 'P1', clouds: 'Service Cloud, Marketing Cloud, Agentforce, Sales Cloud, Financial Services Cloud' },
  { name: 'Deloitte Digital South Africa', type: 'Partner', priority: 'P1', clouds: 'Agentforce, Service Cloud, Data Cloud, Marketing Cloud, Financial Services Cloud' },
  { name: 'PwC South Africa', type: 'Partner', priority: 'P1', clouds: 'Marketing Cloud, Agentforce, Service Cloud, Financial Services Cloud, Data Cloud' },
  { name: 'NTT DATA / EXAH', type: 'Partner', priority: 'P1', clouds: 'Agentforce, Service Cloud, Marketing Cloud, Financial Services Cloud, MuleSoft' },
  { name: 'Capgemini South Africa', type: 'Partner', priority: 'P1', clouds: 'Service Cloud, Marketing Cloud, Agentforce, Sales Cloud, CPQ' },
  { name: 'IBM South Africa', type: 'Partner', priority: 'P1', clouds: 'Service Cloud, Agentforce, MuleSoft, Marketing Cloud, Sales Cloud' },
  { name: 'Xsmths', type: 'Partner', priority: 'P2', clouds: 'Agentforce, Service Cloud, MuleSoft, Data Cloud, Financial Services Cloud' },
  { name: 'BlueSky Digital Solutions', type: 'Partner', priority: 'P2', clouds: 'Service Cloud, Marketing Cloud, Agentforce, Financial Services Cloud, Sales Cloud' },
  { name: 'AdvanceForce', type: 'Partner', priority: 'P2', clouds: 'Agentforce, Service Cloud, Marketing Cloud, Sales Cloud, Financial Services Cloud' },
  { name: 'Smarten UP', type: 'Partner', priority: 'P2', clouds: 'Agentforce, Marketing Cloud, Service Cloud, Data Cloud, CPQ' },
  { name: 'Cloud23', type: 'Partner', priority: 'P2', clouds: 'Marketing Cloud, Agentforce, Service Cloud, Financial Services Cloud, MuleSoft' },
] as const

const verifiedCustomers = [
  { company: 'Standard Bank', industry: 'Banking', clouds: 'Marketing Cloud, Financial Services Cloud, Sales Cloud, Data Cloud, Agentforce', build: 'Hyperforce', useCase: 'Personalization at scale, Customer 360 and lead management across a large multi-market banking footprint', si: 'CloudSmiths; Acceleration.biz; PwC' },
  { company: 'MTN Group', industry: 'Telecommunications', clouds: 'Sales Cloud, Service Cloud, Marketing Cloud, Communications Cloud', build: 'MuleSoft + Hyperforce', useCase: 'B2B/B2C subscriber 360, churn reduction and agent console', si: 'Accenture; Deloitte' },
  { company: 'Takealot / Superbalist', industry: 'E-commerce', clouds: 'Service Cloud, Commerce Cloud, Marketing Cloud', build: 'Commerce Cloud', useCase: 'Customer service at scale, order management and personalization', si: 'CloudSmiths / EXAH' },
  { company: 'Barloworld Equipment', industry: 'Industrial Distribution', clouds: 'Sales Cloud, Service Cloud, Field Service', build: 'Salesforce Platform', useCase: 'Equipment service lifecycle and dealer management', si: 'PwC' },
  { company: 'Yoco Technologies', industry: 'Fintech', clouds: 'Service Cloud, Marketing Cloud, Sales Cloud, Slack', build: 'Service Cloud', useCase: 'Proactive SMB merchant support and customer journey visibility', si: 'CloudSmiths / in-house' },
  { company: 'Coca-Cola Peninsula Beverages', industry: 'CPG / Beverage', clouds: 'Sales Cloud, Service Cloud', build: 'FSC + Service', useCase: 'Customer Service Centre rebuild, 360-view agent console and case ticketing', si: 'AdvanceForce' },
  { company: 'Ninety One', industry: 'Asset Management', clouds: 'Financial Services Cloud, Sales Cloud, Experience Cloud', build: 'Financial Services Cloud', useCase: 'Institutional and retail client 360, fund distribution', si: 'CloudSmiths' },
  { company: 'Sanlam', industry: 'Insurance', clouds: 'Sales Cloud, Financial Services Cloud, Marketing Cloud', build: 'Hyperforce FSC', useCase: 'Advisor productivity, policy 360 and cross-sell', si: 'Deloitte; Accenture' },
  { company: 'Old Mutual', industry: 'Insurance / Banking', clouds: 'Financial Services Cloud, Service Cloud, Marketing Cloud', build: 'FSC', useCase: 'Client Connect MVNO and advisor workspace', si: 'Deloitte Digital; thryve' },
  { company: 'Absa Group', industry: 'Banking', clouds: 'Sales Cloud, Service Cloud, Marketing Cloud, Tableau', build: 'Customer 360', useCase: 'Customer value management and complaints 360', si: 'Accenture; PwC' },
  { company: 'Discovery Limited', industry: 'Health / Insurance', clouds: 'Health Cloud, Service Cloud, Marketing Cloud, Experience Cloud', build: 'Health Cloud', useCase: 'Vitality member engagement and broker portal', si: 'Deloitte; Accenture' },
  { company: 'FirstRand / FNB', industry: 'Banking', clouds: 'Sales Cloud, Marketing Cloud, Service Cloud', build: 'Salesforce Platform', useCase: 'FNB Connect MVNO CRM and retail cross-sell', si: 'Accenture; Capgemini' },
  { company: 'Capitec Bank', industry: 'Retail Banking', clouds: 'Sales Cloud, Service Cloud, Platform', build: 'Platform', useCase: 'Capitec Connect MVNO and in-app service', si: 'in-house hiring signal' },
  { company: 'Nedbank', industry: 'Banking', clouds: 'Financial Services Cloud, Marketing Cloud', build: 'FSC', useCase: 'Corporate banking relationship management', si: 'PwC; IBM' },
  { company: 'Investec', industry: 'Private Banking', clouds: 'Financial Services Cloud, Sales Cloud', build: 'FSC', useCase: 'Wealth advisor 360 and private-client onboarding', si: 'CloudSmiths' },
  { company: 'Momentum Metropolitan', industry: 'Insurance', clouds: 'Sales Cloud, Service Cloud', build: 'Sales Cloud', useCase: 'Advisor and tied-agent productivity', si: 'thryve; Deloitte' },
  { company: 'Vodacom', industry: 'Telecom', clouds: 'Service Cloud, Marketing Cloud, Commerce Cloud', build: 'Salesforce Platform', useCase: 'Consumer care and enterprise sales', si: 'Accenture; IBM' },
  { company: 'Telkom / BCX', industry: 'Telecom / IT', clouds: 'Sales Cloud, Service Cloud', build: 'Sales Cloud', useCase: 'B2B pipeline and service desk', si: 'NTT DATA' },
  { company: 'Cell C', industry: 'Telecom', clouds: 'Service Cloud', build: 'Service Cloud', useCase: 'MVNO wholesale partner CRM', si: 'BlueSky' },
  { company: 'MultiChoice', industry: 'Media', clouds: 'Service Cloud, Marketing Cloud, Experience Cloud', build: 'Service Cloud', useCase: 'DStv subscriber support and churn', si: 'EXAH / NTT DATA' },
  { company: 'TFG – The Foschini Group', industry: 'Retail', clouds: 'Marketing Cloud, Commerce Cloud, Service Cloud', build: 'Marketing Cloud', useCase: 'Omni-channel loyalty and TFG Connect MVNO', si: 'EXAH' },
  { company: 'Shoprite Group', industry: 'Retail', clouds: 'Marketing Cloud, Service Cloud', build: 'Marketing Cloud', useCase: 'Knect Mobile MVNO and Xtra Savings CRM', si: 'iCloudius; Accenture' },
  { company: 'Woolworths SA', industry: 'Retail', clouds: 'Marketing Cloud, Service Cloud, Commerce Cloud', build: 'Bash.com on Commerce', useCase: 'WRewards personalization and ecommerce', si: 'Xsmths; CloudSmiths' },
  { company: 'Pick n Pay', industry: 'Retail', clouds: 'Marketing Cloud, Service Cloud', build: 'Marketing Cloud', useCase: 'PnP Mobile MVNO CRM and Smart Shopper', si: 'Accenture' },
] as const

const implementationPartners = [
  { partner: 'CloudSmiths', tier: 'Summit', hc: '200', certs: '180', focus: 'Financial Services, Retail, Telecom, Nonprofit' },
  { partner: 'Accenture', tier: 'Summit', hc: '120+', certs: '250', focus: 'Enterprise transformation, banking, telecom, retail' },
  { partner: 'Deloitte Digital', tier: 'Summit', hc: '90+', certs: '180', focus: 'Financial services, insurance, healthcare, analytics' },
  { partner: 'PwC South Africa', tier: 'Summit', hc: '80+', certs: '150', focus: 'Financial services, nonprofit, risk and transformation' },
  { partner: 'NTT DATA / EXAH', tier: 'Summit', hc: '65+', certs: '140', focus: 'MuleSoft, telecom, retail, enterprise service' },
  { partner: 'Capgemini / C Ahead', tier: 'Gold', hc: '100+', certs: '100', focus: 'Global delivery, enterprise integration' },
  { partner: 'BlueSky Digital Solutions', tier: 'Gold', hc: '35+', certs: '55', focus: 'Commercial, telecom, insurance' },
  { partner: 'iCloudius', tier: 'Gold', hc: '25+', certs: '40', focus: 'SMB, retail and commercial implementations' },
  { partner: 'Smarten UP', tier: 'Gold', hc: '30+', certs: '45', focus: 'Insurance, hospitality, travel and financial services' },
  { partner: 'Cloud23', tier: 'Gold', hc: '25+', certs: '50', focus: 'Commerce Cloud, Marketing Cloud, retail and tourism' },
  { partner: 'Weku', tier: 'Select', hc: '20+', certs: '30', focus: 'Insurance, retail and commercial implementations' },
  { partner: 'AdvanceForce', tier: 'Gold', hc: '30+', certs: '60', focus: 'CPG, RegTech, Field Service and B2B' },
  { partner: 'thryve', tier: 'Silver', hc: '25+', certs: '35', focus: 'Financial Services Cloud, insurance and service' },
  { partner: 'Xsmths', tier: 'Commerce specialist', hc: '35+', certs: '45', focus: 'Commerce Cloud, Marketing Cloud, retail and CPG' },
  { partner: 'mPHATEK', tier: 'Select', hc: '15+', certs: '25', focus: 'Sales, Service, MuleSoft, ICT and public sector' },
  { partner: 'Acceleration.biz', tier: 'Data / MC', hc: '20+', certs: '30', focus: 'Marketing Cloud, Data Cloud, Datorama and banking' },
  { partner: 'IBM South Africa', tier: 'Global SI', hc: '40+', certs: '80', focus: 'Sales, Service, MuleSoft, banking and telecom' },
  { partner: 'Cognizant South Africa', tier: 'Global SI', hc: '20+', certs: '35', focus: 'Financial services, retail, Sales, Service and Marketing Cloud' },
  { partner: 'TCS South Africa', tier: 'Global SI', hc: '30+', certs: '60', focus: 'Banking, telecom, Sales, Service and MuleSoft' },
  { partner: 'Wipro South Africa', tier: 'Global SI', hc: '25+', certs: '40', focus: 'Financial services, Sales, Service and Tableau' },
  { partner: 'KPMG South Africa', tier: 'Global SI', hc: '20+', certs: '35', focus: 'Public sector, financial services, Sales and Service' },
  { partner: 'Infosys South Africa', tier: 'Global SI', hc: '30+', certs: '50', focus: 'All Clouds, telecom and banking' },
  { partner: 'Tech Mahindra SA', tier: 'Global SI', hc: '25+', certs: '40', focus: 'Communications Cloud and telecom' },
] as const

const surroundingTechStack = [
  { layer: 'Core banking / ERP', standard: 'SAP S/4HANA, Temenos T24, Hogan, Oracle, Avaloq, SimCorp', example: 'Standard Bank – core banking APIs via MuleSoft; Capitec – Temenos T24; Woolworths – SAP CAR' },
  { layer: 'Integration / iPaaS', standard: 'MuleSoft, Boomi, Jitterbit, Informatica, AWS EventBridge, Azure Logic Apps', example: 'Standard Bank, Old Mutual and Seacom examples are MuleSoft-heavy in the supplied map.' },
  { layer: 'Data / AI / CDP', standard: 'Data Cloud 360, Snowflake, Teradata, SAS, Databricks, Tableau CRM, Einstein / Agentforce', example: 'Courier Guy is the supplied Agentforce + Data Cloud 360 example.' },
  { layer: 'Cloud hosting / residency', standard: 'AWS Africa, Azure South Africa North, GCP Johannesburg, Hyperforce SA', example: 'Hyperforce and POPIA/residency are repeated enterprise buying signals.' },
  { layer: 'Marketing / CDP', standard: 'Marketing Cloud Personalization, Audience Studio, Adobe Experience, Bloomreach, Comarch Loyalty', example: 'Standard Bank, Woolworths and Shoprite appear as marketing/CDP examples.' },
  { layer: 'CPQ / Billing', standard: 'Revenue Cloud, nCino FSC pattern, Zuora', example: 'ArcelorMittal SA and SA Home Loans appear as CPQ/FSC-pattern examples.' },
  { layer: 'Industry clouds', standard: 'FSC, Health Cloud, Automotive Cloud, Communications Cloud, Nonprofit Cloud', example: 'Big 5 banks, Discovery, Mercedes-Benz SA, MTN and JCH are example clusters.' },
  { layer: 'Contact centre / CTI', standard: 'Service Cloud Voice, Five9, Genesys, Telviva CTI, WhatsApp Business API', example: 'Telviva, Coca-Cola PB and Clickatell are named surrounding-stack examples.' },
  { layer: 'Identity / Security', standard: 'Salesforce Shield, Okta, Azure AD, Ping', example: 'POPIA, FSCA and Shield encryption are governance signals.' },
] as const

const manualPractitionerCorrections = [
  {
    name: 'Katlego Magnificent Seapi',
    location: 'Pretoria, Gauteng, South Africa',
    linkedIn: 'https://www.linkedin.com/in/seapi-katlego-96a955165/',
    status: 'Needs Salesforce role/employer verification',
    note: 'User-supplied correction. Retained through the July 2026 provenance audit; still requires role and employer verification.',
  },
] as const

function topBarWidth(count: number, max: number) {
  return `${Math.max(6, Math.round((count / Math.max(max, 1)) * 100))}%`
}

function truncate(value: string, max = 120) {
  return value.length > max ? `${value.slice(0, max)}…` : value
}

function sortedItems(values: ReadonlyMap<string, number>) {
  return [...values.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
}

function MetricBars({ items, max }: { items: readonly { name: string; count: number }[]; max: number }) {
  return (
    <div className="bar-chart">
      {items.map(item => (
        <div className="bar-row" key={item.name}>
          <div className="bar-label">{item.name}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: topBarWidth(item.count, max) }} />
          </div>
          <div className="bar-count">{item.count}</div>
        </div>
      ))}
    </div>
  )
}

export function SalesforceEcosystemPage() {
  const { data, loading } = useData()

  useEffect(() => {
    document.title = 'SA Salesforce Ecosystem Map'
  }, [])

  const salesforceProfiles = useMemo(
    () => data
      ? getTalentProfiles(data).filter(({ trackSlug }) => trackSlug === 'salesforce')
      : [],
    [data],
  )
  const summary = useMemo(() => deriveMarketSummary(salesforceProfiles), [salesforceProfiles])
  const employerTypes = useMemo(() => {
    const counts = new Map<string, number>()
    for (const profile of salesforceProfiles) {
      const value = profile.attributes.employerType
      if (typeof value === 'string' && value) {
        counts.set(value, (counts.get(value) ?? 0) + 1)
      }
    }
    return sortedItems(counts)
  }, [salesforceProfiles])
  const provinceDistribution = useMemo(() => sortedItems(summary.byProvince), [summary])
  const seniorityDistribution = useMemo(
    () => sortedItems(summary.bySeniority).map(({ name, count }) => ({ seniority: name, count })),
    [summary],
  )
  const primaryStats = [
    { value: 295, label: 'Salesforce Customers SA — v2 market source', color: 'var(--color-primary)' },
    { value: 266, label: 'BuiltWith .za Domains — v2 market source', color: 'var(--color-success)' },
    { value: 23, label: 'SI / ISV Partners — v2 market source', color: 'var(--color-accent)' },
    { value: summary.totalProfiles, label: 'Searchable Practitioners', color: 'var(--color-purple)' },
  ] as const
  const secondaryStats = [
    { value: summary.byProvenance.get('legacy') ?? 0, label: 'Source-retained practitioners' },
    { value: '$5.1B', label: 'IDC SA ecosystem 2020–26 — source note' },
    { value: '31,800', label: 'IDC jobs impact — source note' },
    { value: 'Agentforce', label: 'SA GA signal — June 2026 source map' },
  ] as const
  const maxProvinceCount = provinceDistribution[0]?.count ?? 1
  const maxCustomerCloudCount = customerClouds[0]?.count ?? 1
  const maxIndustryCount = topIndustries[0]?.count ?? 1

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>Salesforce Ecosystem</span>
        </div>

        <div className="hero">
          <h1>SA Salesforce Ecosystem Map</h1>
          <p>South African Salesforce market layer covering customers, implementation partners, cloud footprint, surrounding technology, Agentforce signals and data-quality boundaries.</p>
        </div>

        <section className="card mb-3" style={{ borderLeft: '4px solid var(--color-danger, #dc2626)' }}>
          <div className="flex items-center gap-1 mb-1">
            <ShieldCheck size={20} />
            <h2>Provenance Audit — July 2026</h2>
          </div>
          <p className="text-sm">
            959 of the 1,047 imported practitioner records were removed after a provenance audit found they were
            machine-generated rather than sourced from real people. The generated rows carried sequential LinkedIn
            slugs, names recombined from a closed pool, and job titles repeated in round counts.
            <strong> {summary.totalProfiles} source records remain in the searchable registry</strong>. One manual
            correction is preserved below as excluded source history because its role and employer evidence is incomplete.
          </p>
          <p className="text-sm text-secondary mt-1">
            Practitioner-derived statistics on this page are calculated from the shared registry. Customer, partner and
            market-intelligence figures are separate editorial data from the v2 market-map source and are labelled as such.
          </p>
        </section>

        <div className="stats-bar">
          {primaryStats.map(stat => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} color={stat.color} />
          ))}
        </div>

        <div className="grid grid-4 mb-3">
          {secondaryStats.map(stat => (
            <div className="card" key={stat.label}>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-sm text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <ShieldCheck size={20} />
            <h2>Market Leadership & 2026 Signals</h2>
          </div>
          <div className="grid grid-2">
            {leadershipSignals.map(signal => (
              <div className="card" key={signal} style={{ padding: '0.875rem' }}>
                <div className="text-sm">{signal}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-secondary mt-2">Agentforce, AWS Marketplace SA, Data Cloud 360 and The Courier Guy live demo are treated as 2026 market signals that still need source-level validation before client submission.</p>
        </section>

        <div className="grid grid-4 mb-3">
          {employerTypes.map(segment => (
            <div className="card" key={segment.name}>
              <div className="flex items-center gap-1 mb-1">
                <Layers size={18} />
                <h3>{segment.name}</h3>
              </div>
              <div className="text-xl font-bold">{segment.count}</div>
              <div className="text-sm text-secondary">profiles mapped</div>
            </div>
          ))}
        </div>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <BarChart3 size={20} />
            <h2>Customer Cloud Footprint</h2>
          </div>
          <MetricBars items={customerClouds} max={maxCustomerCloudCount} />
          <p className="text-sm text-secondary mt-2">
            Customer-side technographic counts come from the v2 market-map source, not from the practitioner table.
            The practitioner cloud-expertise heat map was withdrawn in the July 2026 provenance audit because it was
            derived from records that failed verification.
          </p>
        </section>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Cloud size={20} />
            <h2>Cloud Map — SA Footprint Notes</h2>
          </div>
          <div>
            {cloudFootprintBadges.map(item => <span className="badge badge-Medium" key={item}>{item}</span>)}
          </div>
        </section>

        <div className="grid grid-2 mb-3">
          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <BarChart3 size={20} />
              <h2>Customer Industries</h2>
            </div>
            <MetricBars items={topIndustries} max={maxIndustryCount} />
          </section>

          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <BarChart3 size={20} />
              <h2>Geographic Concentration</h2>
            </div>
            <MetricBars items={provinceDistribution} max={maxProvinceCount} />
          </section>
        </div>

        <section className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Building2 size={20} />
            <h2>Salesforce Ecosystem Companies — Cloud Focus</h2>
          </div>
          <div className="grid grid-3">
            {topCompanies.map(company => (
              <div className="card card-hover" key={company.name}>
                <div className="flex justify-between gap-1 mb-1">
                  <h3>{company.name}</h3>
                  <span className={`badge badge-${company.priority}`}>{company.priority}</span>
                </div>
                <div className="text-sm text-secondary mb-1">{company.type}</div>
                <div className="text-sm"><strong>Clouds:</strong> {company.clouds}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <ShieldCheck size={20} />
            <h2>Excluded Source History</h2>
          </div>
          <p className="text-sm text-secondary mb-2">
            This historical correction is not included in public search or practitioner totals. A future verified
            correction must be supplied through a traceable batch.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>LinkedIn</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {manualPractitionerCorrections.map(person => (
                  <tr key={person.linkedIn} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>{person.name}</td>
                    <td style={{ padding: '0.75rem' }}>{person.location}</td>
                    <td style={{ padding: '0.75rem' }}><a href={person.linkedIn} target="_blank" rel="noreferrer">LinkedIn profile</a></td>
                    <td style={{ padding: '0.75rem' }}>{person.status}</td>
                    <td style={{ padding: '0.75rem' }}>{person.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Building2 size={20} />
            <h2>Top 24 Verified Salesforce Users</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Company</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Industry</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Clouds</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Build</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Use Case</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>SI</th>
                </tr>
              </thead>
              <tbody>
                {verifiedCustomers.map(customer => (
                  <tr key={customer.company} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>{customer.company}</td>
                    <td style={{ padding: '0.75rem' }}>{customer.industry}</td>
                    <td style={{ padding: '0.75rem' }}>{customer.clouds}</td>
                    <td style={{ padding: '0.75rem' }}>{customer.build}</td>
                    <td style={{ padding: '0.75rem' }}>{truncate(customer.useCase, 140)}</td>
                    <td style={{ padding: '0.75rem' }}>{customer.si}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Building2 size={20} />
            <h2>Implementation Partners — SA 23</h2>
          </div>
          <div className="grid grid-3">
            {implementationPartners.map(partner => (
              <div className="card" key={partner.partner} style={{ padding: '0.875rem' }}>
                <h3>{partner.partner}</h3>
                <div className="text-sm text-secondary">{partner.tier}</div>
                <div className="text-sm"><strong>HC:</strong> {partner.hc} | <strong>Certs:</strong> {partner.certs}</div>
                <p className="text-sm text-secondary">{partner.focus}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-2 mb-3">
          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <BarChart3 size={20} />
              <h2>Seniority Distribution</h2>
            </div>
            <div className="grid">
              {seniorityDistribution.map(item => (
                <div className="flex justify-between items-center" key={item.seniority}>
                  <span>{item.seniority}</span>
                  <span className="badge badge-Medium">{item.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <ShieldCheck size={20} />
              <h2>Data Quality Guardrails</h2>
            </div>
            <div className="grid">
              <div className="flex justify-between items-center">
                <span>Searchable Salesforce profiles with source evidence</span>
                <span className="badge badge-Medium">{summary.sourceCoverage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Unverifiable records removed in provenance audit</span>
                <span className="badge badge-P1">959</span>
              </div>
              <div className="flex justify-between items-center">
                <span>New additions supplied as verified before import</span>
                <span className="badge badge-Medium">Required</span>
              </div>
            </div>
          </section>
        </div>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Cloud size={20} />
            <h2>Surrounding Technology Stack</h2>
          </div>
          <div className="grid grid-3">
            {surroundingTechStack.map(row => (
              <div className="card" key={row.layer} style={{ padding: '0.875rem' }}>
                <h3>{row.layer}</h3>
                <p className="text-sm"><strong>SA standard:</strong> {row.standard}</p>
                <p className="text-sm text-secondary">{row.example}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="flex items-center gap-1 mb-2">
            <ShieldCheck size={20} />
            <h2>Verification Boundary</h2>
          </div>
          <p className="text-sm text-secondary">
            Market-map signals are not proof of current employment, active Salesforce use, licence count,
            implementation partner involvement or candidate availability. Only profiles supplied with source evidence
            enter public search; excluded source history is not counted. Keep profile evidence and direct verification
            as the final source of truth.
          </p>
        </section>
      </div>
    </div>
  )
}
