import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Building2, Cloud, Layers, ShieldCheck } from 'lucide-react'
import { StatCard } from '../components/ui/StatCard'

const employerTypes = [
  { name: 'Partner', count: 998 },
  { name: 'Customer', count: 31 },
  { name: 'Vendor', count: 18 },
]

const cloudDistribution = [
  { name: 'Agentforce', count: 221 },
  { name: 'Service Cloud', count: 191 },
  { name: 'Marketing Cloud', count: 185 },
  { name: 'Financial Services Cloud', count: 102 },
  { name: 'Data Cloud', count: 79 },
  { name: 'Sales Cloud', count: 69 },
  { name: 'MuleSoft', count: 66 },
  { name: 'CPQ', count: 59 },
  { name: 'Tableau', count: 56 },
]

const seniorityDistribution = [
  { seniority: 'Consultant / Specialist', count: 748 },
  { seniority: 'Senior', count: 121 },
  { seniority: 'Lead / Manager', count: 87 },
  { seniority: 'Principal / Architect', count: 51 },
  { seniority: 'Executive', count: 34 },
  { seniority: 'Professional', count: 6 },
]

const provinceDistribution = [
  { name: 'Gauteng', count: 661 },
  { name: 'Western Cape', count: 340 },
  { name: 'KwaZulu-Natal', count: 44 },
  { name: 'International', count: 2 },
]

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
]

function topBarWidth(count: number, max: number) {
  return `${Math.max(6, Math.round((count / Math.max(max, 1)) * 100))}%`
}

export function SalesforceEcosystemPage() {
  useEffect(() => {
    document.title = 'SA Salesforce Ecosystem Map'
  }, [])

  const maxCloudCount = cloudDistribution[0]?.count ?? 1
  const maxProvinceCount = provinceDistribution[0]?.count ?? 1

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>Salesforce Ecosystem</span>
        </div>

        <div className="hero">
          <h1>SA Salesforce Ecosystem Map</h1>
          <p>Vendor, partner, customer, cloud-specialism and talent intelligence for the South African Salesforce market.</p>
        </div>

        <div className="stats-bar">
          <StatCard value={1047} label="Profiles Mapped" color="var(--color-primary)" />
          <StatCard value={59} label="Companies" color="var(--color-success)" />
          <StatCard value={27} label="Cloud Groups" color="var(--color-accent)" />
          <StatCard value={7.29} label="Avg Priority Score" color="var(--color-purple)" />
        </div>

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
              <h2>Cloud Expertise Heat Map</h2>
            </div>
            <div className="bar-chart">
              {cloudDistribution.map(item => (
                <div className="bar-row" key={item.name}>
                  <div className="bar-label">{item.name}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: topBarWidth(item.count, maxCloudCount) }} />
                  </div>
                  <div className="bar-count">{item.count}</div>
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

        <div className="grid grid-2 mb-3">
          <section className="card">
            <div className="flex items-center gap-1 mb-2">
              <BarChart3 size={20} />
              <h2>Geographic Concentration</h2>
            </div>
            <div className="bar-chart">
              {provinceDistribution.map(item => (
                <div className="bar-row" key={item.name}>
                  <div className="bar-label">{item.name}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: topBarWidth(item.count, maxProvinceCount) }} />
                  </div>
                  <div className="bar-count">{item.count}</div>
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
              <div className="flex justify-between items-center"><span>LinkedIn evidence links retained</span><span className="badge badge-High">1047</span></div>
              <div className="flex justify-between items-center"><span>Duplicate-name records flagged</span><span className="badge badge-Medium">142</span></div>
              <div className="flex justify-between items-center"><span>Inferred email records excluded from public JSON</span><span className="badge badge-High">1047</span></div>
            </div>
            <p className="text-sm text-secondary mt-2">Scores are market-map prioritisation signals and still require human verification before client submission.</p>
          </section>
        </div>

        <section className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Building2 size={20} />
            <h2>Top Salesforce Ecosystem Companies</h2>
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
      </div>
    </div>
  )
}
