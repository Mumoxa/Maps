import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Database, ShieldCheck } from 'lucide-react'
import salesforcePeopleRaw from '../../markets/salesforce/people.json'
import { StatCard } from '../components/ui/StatCard'

interface SalesforcePerson {
  employer: string
  employerType: string
  province: string
  country: string
  clouds: string[]
  linkedinUrl: string
}

interface CountItem {
  name: string
  count: number
}

const salesforcePeople = salesforcePeopleRaw as SalesforcePerson[]

function increment(counts: Map<string, number>, rawValue: string) {
  const value = rawValue.trim()
  if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
}

function rankedCounts(counts: Map<string, number>, limit = 10): CountItem[] {
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit)
}

function topBarWidth(count: number, max: number) {
  return `${Math.max(6, Math.round((count / Math.max(max, 1)) * 100))}%`
}

function MetricBars({ items }: { items: readonly CountItem[] }) {
  const max = items[0]?.count ?? 1

  return (
    <div className="bar-chart">
      {items.map((item) => (
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
  useEffect(() => {
    document.title = 'SA Salesforce Dataset Overview'
  }, [])

  const summary = useMemo(() => {
    const employers = new Map<string, number>()
    const employerTypes = new Map<string, number>()
    const provinces = new Map<string, number>()
    const clouds = new Map<string, number>()
    let recordsWithProfileLinks = 0
    let southAfricaRecords = 0

    for (const person of salesforcePeople) {
      increment(employers, person.employer)
      increment(employerTypes, person.employerType)
      increment(provinces, person.province)
      for (const cloud of person.clouds) increment(clouds, cloud)
      if (person.linkedinUrl.trim()) recordsWithProfileLinks += 1
      if (person.country.trim() === 'South Africa') southAfricaRecords += 1
    }

    return {
      records: salesforcePeople.length,
      employers: employers.size,
      recordsWithProfileLinks,
      southAfricaRecords,
      employerTypes: rankedCounts(employerTypes),
      provinces: rankedCounts(provinces),
      clouds: rankedCounts(clouds),
      topEmployers: rankedCounts(employers, 12),
    }
  }, [])

  return (
    <div className="page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>Salesforce dataset</span>
        </div>

        <div className="hero">
          <h1>SA Salesforce Dataset Overview</h1>
          <p>
            A descriptive view of the records currently imported into Maps. Counts below are derived from the
            committed dataset; they are not claims about the complete South African Salesforce market.
          </p>
        </div>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <ShieldCheck size={20} />
            <h2>Evidence boundary</h2>
          </div>
          <p className="text-sm text-secondary">
            A profile URL records where a claim came from; it does not prove that the role, employer, skill or
            location is current. This page therefore reports dataset contents only. It does not publish customer
            implementations, licence counts, partner attribution, market size, hiring availability or other market
            claims without a reviewable source for each claim.
          </p>
          <p className="text-sm mt-2">
            Before using a record for outreach or a client submission, open its source and verify the relevant facts
            directly. See <Link to="/talent-search?track=salesforce">Salesforce talent search</Link> to inspect records.
          </p>
        </section>

        <div className="stats-bar">
          <StatCard value={summary.records} label="Imported records" color="var(--color-primary)" />
          <StatCard value={summary.southAfricaRecords} label="Records labelled South Africa" color="var(--color-success)" />
          <StatCard value={summary.employers} label="Distinct employer labels" color="var(--color-accent)" />
          <StatCard value={summary.recordsWithProfileLinks} label="Records with profile URLs" color="var(--color-purple)" />
        </div>

        <div className="grid grid-2 mb-3">
          <section className="card">
            <div className="flex items-center gap-1 mb-2"><Database size={20} /><h2>Employer-type labels</h2></div>
            <MetricBars items={summary.employerTypes} />
          </section>
          <section className="card">
            <div className="flex items-center gap-1 mb-2"><BarChart3 size={20} /><h2>Province labels</h2></div>
            <MetricBars items={summary.provinces} />
          </section>
        </div>

        <div className="grid grid-2 mb-3">
          <section className="card">
            <div className="flex items-center gap-1 mb-2"><BarChart3 size={20} /><h2>Most frequent cloud labels</h2></div>
            <MetricBars items={summary.clouds} />
          </section>
          <section className="card">
            <div className="flex items-center gap-1 mb-2"><Database size={20} /><h2>Most frequent employer labels</h2></div>
            <MetricBars items={summary.topEmployers} />
          </section>
        </div>

        <section className="card">
          <h2>Adding more information</h2>
          <p className="text-sm text-secondary mt-1">
            New market intelligence must follow the repository's Salesforce source policy. Add a direct, reviewable
            source, record the publisher and publication or access date, separate the source statement from any
            interpretation, and mark time-sensitive facts for re-verification. Unsupported or source-inaccessible
            claims remain out of the public product.
          </p>
          <p className="text-sm mt-2"><code>markets/salesforce/SOURCE_POLICY.md</code> contains the required format and review checklist.</p>
        </section>
      </div>
    </div>
  )
}
