import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Building2, Cloud, Layers, ShieldCheck } from 'lucide-react'
import { StatCard } from '../components/ui/StatCard'

const primaryStats = [
  { value: 295, label: 'Salesforce Customers SA', color: 'var(--color-primary)' },
  { value: 266, label: 'BuiltWith .za Domains', color: 'var(--color-success)' },
  { value: 23, label: 'SI / ISV Partners', color: 'var(--color-accent)' },
  { value: '1,047', label: 'Named Practitioners', color: 'var(--color-purple)' },
] as const

const secondaryStats = [
  { value: '1,018', label: 'SA-based practitioners' },
  { value: '$5.1B', label: 'IDC SA ecosystem 2020–26' },
  { value: '31,800', label: 'IDC jobs impact note' },
  { value: 'Agentforce', label: 'SA GA tracked Jun 2026' },
] as const

const employerTypes = [
  { name: 'Partner', count: 998 },
  { name: 'Customer', count: 31 },
  { name: 'Vendor', count: 18 },
] as const

const practitionerClouds = [
  { name: 'Agentforce', count: 221 },
  { name: 'Service Cloud', count: 191 },
  { name: 'Marketing Cloud', count: 185 },
  { name: 'Financial Services Cloud', count: 102 },
  { name: 'Data Cloud', count: 79 },
  { name: 'Sales Cloud', count: 69 },
  { name: 'MuleSoft', count: 66 },
  { name: 'CPQ', count: 59 },
  { name: 'Tableau', count: 56 },
] as const

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

const customerIndustries = [
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

const seniorityDistribution = [
  { seniority: 'Consultant / Specialist', count: 748 },
  { seniority: 'Senior', count: 121 },
  { seniority: 'Lead / Manager', count: 87 },
  { seniority: 'Principal / Architect', count: 51 },
  { seniority: 'Executive', count: 34 },
  { seniority: 'Professional', count: 6 },
] as const

const provinceDistribution = [
  { name: 'Gauteng', count: 661 },
  { name: 'Western Cape', count: 340 },
  { name: 'KwaZulu-Natal', count: 44 },
  { name: 'International', count: 2 },
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

const topCompanies = [
  { name: 'CloudSmiths', type: 'Partner', count: 179, priority: 'P1', clouds: 'Agentforce, Service Cloud, Marketing Cloud, Financial Services Cloud, Data Cloud' },
  { name: 'Accenture South Africa', type: 'Partner', count: 137, priority: 'P1', clouds: 'Service Cloud, Marketing Cloud, Agentforce, Sales Cloud, Financial Services Cloud' },
  { name: 'Deloitte Digital South Africa', type: 'Partner', count: 109, priority: 'P1', clouds: 'Agentforce, Service Cloud, Data Cloud, Marketing Cloud, Financial Services Cloud' },
  { name: 'PwC South Africa', type: 'Partner', count: 85, priority: 'P1', clouds: 'Marketing Cloud, Agentforce, Service Cloud, Financial Services Cloud, Data Cloud' },
  { name: 'NTT DATA / EXAH', type: 'Partner', count: 76, priority: 'P1', clouds: 'Agentforce, Service Cloud, Marketing Cloud, Financial Services Cloud, MuleSoft' },
  { name: 'Capgemini South Africa', type: 'Partner', count: 55, priority: 'P1', clouds: 'Service Cloud, Marketing Cloud, Agentforce, Sales Cloud, CPQ' },
  { name: 'IBM South Africa', type: 'Partner', count: 42, priority: 'P1', clouds: 'Service Cloud, Agentforce, MuleSoft, Marketing Cloud, Sales Cloud' },
  { name: 'Xsmths', type: 'Partner', count: 36, priority: 'P2', clouds: 'Agentforce, Service Cloud, MuleSoft, Data Cloud, Financial Services Cloud' },
  { name: 'BlueSky Digital Solutions', type: 'Partner', count: 34, priority: 'P2', clouds: 'Service Cloud, Marketing Cloud, Agentforce, Financial Services Cloud, Sales Cloud' },
  { name: 'AdvanceForce', type: 'Partner', count: 33, priority: 'P2', clouds: 'Agentforce, Service Cloud, Marketing Cloud, Sales Cloud, Financial Services Cloud' },
  { name: 'Smarten UP', type: 'Partner', count: 32, priority: 'P2', clouds: 'Agentforce, Marketing Cloud, Service Cloud, Data Cloud, CPQ' },
  { name: 'Cloud23', type: 'Partner', count: 30, priority: 'P2', clouds: 'Marketing Cloud, Agentforce, Service Cloud, Financial Services Cloud, MuleSoft' },
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
  { partner: 'Weku', tier: 'Select', hc: '20+', certs: '30', focus: 'Commercial new logos and SMB' },
  { partner: 'Smarten UP', tier: 'Gold', hc: '30+', certs: '45', focus: 'Implementation partner, sales and service' },
  { partner: 'Cloud23', tier: 'Gold', hc: '25+', certs: '50', focus: 'Knowledge partner, customer success and commercial' },
  { partner: 'AdvanceForce', tier: 'Gold', hc: '30+', certs: '60', focus: 'Alliance partner since 2008' },
  { partner: 'thryve', tier: 'Ridge', hc: '15+', certs: '25', focus: 'Insurance and financial services' },
  { partner: 'Megabytes Tech', tier: 'Registered', hc: '12+', certs: '20', focus: 'Implementation support' },
  { partner: 'Xsmths', tier: 'Marketing Cloud specialist', hc: '40+', certs: '60', focus: 'Marketing Cloud, Commerce, retail' },
  { partner: 'mPHATEK Systems', tier: 'Consulting', hc: '15+', certs: '22', focus: 'Consulting and integration' },
  { partner: 'Q.LAB', tier: 'Consulting', hc: '10+', certs: '12', focus: 'Consulting and delivery' },
  { partner: 'CRMAutomate', tier: 'Consulting', hc: '12+', certs: '18', focus: 'CRM automation' },
  { partner: 'IBM South Africa', tier: 'Global SI', hc: '40+', certs: '70', focus: 'Enterprise SI and integration' },
  { partner: 'EY South Africa', tier: 'Global SI', hc: '25+', certs: '40', focus: 'Advisory and Salesforce transformation' },
  { partner: 'KPMG South Africa', tier: 'Global SI', hc: '20+', certs: '35', focus: 'Advisory and implementation' },
  { partner: 'Infosys South Africa', tier: 'Global SI', hc: '30+', certs: '50', focus: 'Global delivery and managed services' },
  { partner: 'Tech Mahindra SA', tier: 'Global SI', hc: '25+', certs: '40', focus: 'Telecom and enterprise transformation' },
] as const

const siMentions = [
  { partner: 'CloudSmiths', count: 175 },
  { partner: 'NTT DATA / EXAH', count: 25 },
  { partner: 'PwC South Africa', count: 25 },
  { partner: 'Accenture', count: 13 },
  { partner: 'Deloitte', count: 7 },
  { partner: 'Smarten UP', count: 6 },
  { partner: 'PwC', count: 5 },
  { partner: 'BlueSky', count: 5 },
  { partner: 'Cloud23', count: 5 },
  { partner: 'iCloudius', count: 4 },
] as const

const surroundingTechStack = [
  { layer: 'Core banking / ERP', standard: 'SAP S/4HANA, Temenos T24, Hogan, Oracle, Avaloq, SimCorp', example: 'Standard Bank core banking APIs via MuleSoft; Capitec Temenos T24; Woolworths SAP retail stack' },
  { layer: 'Integration', standard: 'MuleSoft, APIs, event streaming, middleware', example: 'Old Mutual, Standard Bank, Seacom and Telviva integration patterns' },
  { layer: 'Cloud infrastructure', standard: 'AWS, Azure, GCP, Hyperforce', example: 'Hyperforce, AWS Marketplace SA, enterprise data and service deployments' },
  { layer: 'Analytics / BI', standard: 'Tableau, Tableau CRM, Snowflake, SAS, Teradata', example: 'Absa, Investec, Ninety One and Johannesburg Children’s Home analytics signals' },
  { layer: 'Retail / Commerce', standard: 'SAP CAR, Oracle Retail, Commerce Cloud, GCP', example: 'TFG, Shoprite, Woolworths/Bash, Pick n Pay and Cape Union Mart' },
  { layer: 'Insurance / Health', standard: 'Guidewire, policy admin, Health Cloud, broker portals', example: 'Sanlam, Old Mutual, Santam, Discovery and Momentum' },
  { layer: 'Service and contact centre', standard: 'Service Cloud, CTI, ServiceNow, Amdocs, NetCracker', example: 'Vodacom, MTN, Telkom, MultiChoice and Cell C service footprints' },
  { layer: 'Data / AI', standard: 'Data Cloud, Agentforce, Einstein, Snowflake, ML services', example: 'The Courier Guy Agentforce GA signal and Standard Bank Data Cloud signal' },
  { layer: 'Marketing', standard: 'Marketing Cloud, Datorama, CDP, loyalty platforms', example: 'Retail, banking, CPG and MVNO personalization layers' },
] as const

function topBarWidth(count: number, max: number) {
  return `${Math.max(6, Math.round((count / Math.max(max, 1)) * 100))}%`
}

function truncate(value: string, max = 115) {
  return value.length > max ? `${value.slice(0, max)}…` : value
}

export function SalesforceEcosystemPage() {
  useEffect(() => {
    document.title = 'SA Salesforce Ecosystem Map'
  }, [])

  const maxPractitionerCloud = practitionerClouds[0]?.count ?? 1
  const maxCustomerCloud = customerClouds[0]?.count ?? 1
  const maxIndustry = customerIndustries[0]?.count ?? 1
  const maxProvince = provinceDistribution[0]?.count ?? 1

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>Salesforce Ecosystem</span>
        </div>

        <div className="hero">
          <h1>SA Salesforce Ecosystem Map</h1>
          <p>Customer, partner, practitioner, cloud, Agentforce and surrounding-technology intelligence for the South African Salesforce market.</p>
        </div>

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
            <h2>2026 Market Signals</h2>
          </div>
          <div className="grid grid-2">
            {leadershipSignals.map(signal => (
              <div className="card" key={signal} style={{ padding: '0.875rem' }}>
                <div className="text-sm">{signal}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-secondary mt-2">These are market-map signals from the supplied v2 file. Use them for mapping and prioritisation, then verify before client-facing use.</p>
        </section>

        <div className="grid grid-3 mb-3">
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

        <div className="grid grid-2 mb-3">
          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <Cloud size={20} />
              <h2>Practitioner Cloud Expertise</h2>
            </div>
            <div className="bar-chart">
              {practitionerClouds.map(item => (
                <div className="bar-row" key={item.name}>
                  <div className="bar-label">{item.name}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: topBarWidth(item.count, maxPractitionerCloud) }} /></div>
                  <div className="bar-count">{item.count}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <Cloud size={20} />
              <h2>Customer Cloud Footprint</h2>
            </div>
            <div className="bar-chart">
              {customerClouds.map(item => (
                <div className="bar-row" key={item.name}>
                  <div className="bar-label">{item.name}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: topBarWidth(item.count, maxCustomerCloud) }} /></div>
                  <div className="bar-count">{item.count}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Cloud size={20} />
            <h2>Cloud Footprint Notes</h2>
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
            <div className="bar-chart">
              {customerIndustries.map(item => (
                <div className="bar-row" key={item.name}>
                  <div className="bar-label">{item.name}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: topBarWidth(item.count, maxIndustry) }} /></div>
                  <div className="bar-count">{item.count}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <BarChart3 size={20} />
              <h2>Geographic Concentration</h2>
            </div>
            <div className="bar-chart">
              {provinceDistribution.map(item => (
                <div className="bar-row" key={item.name}>
                  <div className="bar-label">{item.name}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: topBarWidth(item.count, maxProvince) }} /></div>
                  <div className="bar-count">{item.count}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Building2 size={20} />
            <h2>Top Salesforce Ecosystem Companies — People Cluster</h2>
          </div>
          <div className="grid grid-3">
            {topCompanies.map(company => (
              <div className="card card-hover" key={company.name}>
                <div className="flex justify-between gap-1 mb-1">
                  <h3>{company.name}</h3>
                  <span className={`badge badge-${company.priority}`}>{company.priority}</span>
                </div>
                <div className="text-sm text-secondary mb-1">{company.type}</div>
                <div className="text-xl font-bold">{company.count}</div>
                <div className="text-sm text-secondary mb-1">mapped profiles</div>
                <div className="text-sm"><strong>Clouds:</strong> {company.clouds}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Building2 size={20} />
            <h2>Top 24 Salesforce Users — Customer Map</h2>
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
                    <td style={{ padding: '0.75rem' }}>{truncate(customer.useCase)}</td>
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
                <div className="flex justify-between gap-1 mb-1">
                  <h3>{partner.partner}</h3>
                  <span className="badge badge-Medium">{partner.tier}</span>
                </div>
                <div className="text-sm"><strong>SF HC:</strong> {partner.hc} | <strong>Certs:</strong> {partner.certs}</div>
                <div className="text-sm text-secondary">{partner.focus}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-2 mb-3">
          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <Building2 size={20} />
              <h2>SI Partner Mentions in Customer Map</h2>
            </div>
            <div className="grid">
              {siMentions.map(item => (
                <div className="flex justify-between items-center" key={item.partner}>
                  <span>{item.partner}</span>
                  <span className="badge badge-Medium">{item.count}</span>
                </div>
              ))}
            </div>
          </section>

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
            <h2>Data Quality Guardrails</h2>
          </div>
          <div className="grid grid-3">
            <div>
              <div className="text-xl font-bold">1,047</div>
              <div className="text-sm text-secondary">LinkedIn evidence links retained</div>
            </div>
            <div>
              <div className="text-xl font-bold">1,047</div>
              <div className="text-sm text-secondary">inferred email records excluded from public page</div>
            </div>
            <div>
              <div className="text-xl font-bold">Human verify</div>
              <div className="text-sm text-secondary">required before client / candidate use</div>
            </div>
          </div>
          <p className="text-sm text-secondary mt-2">Customer cloud use, licence estimates, AI status, revenue, implementation partner attribution, current employer and candidate availability must be verified before client submission. This is a market-map layer, not a final evidence pack.</p>
        </section>
      </div>
    </div>
  )
}
