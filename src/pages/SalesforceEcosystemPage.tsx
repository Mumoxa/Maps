import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Building2, Cloud, Database, Layers, Search, ShieldCheck, Users } from 'lucide-react'
import profilesRaw from '../../markets/salesforce/profiles.json'
import companiesRaw from '../../markets/salesforce/companies.json'
import summaryRaw from '../../markets/salesforce/summary.json'
import cloudExpertiseRaw from '../../markets/salesforce/cloud_expertise.json'
import shortlistRaw from '../../markets/salesforce/priority_shortlist.json'
import { StatCard } from '../components/ui/StatCard'

interface SalesforceProfile {
  id: string
  name: string
  title: string
  company: string
  employer_type: string
  city: string
  province: string
  country: string
  location: string
  linkedin_url: string
  certification_summary: string
  clouds_specialty: string
  trailhead_rank_est: string
  years_salesforce_experience: number | null
  primary_cloud: string
  secondary_skills_summary: string
  seniority: string
  role_family: string
  cloud_group: string
  fit_score: number
  confidence: 'High' | 'Medium' | 'Low'
  notes: string
  data_quality_flags: string[]
}

interface SalesforceCompany {
  id: string
  name: string
  employer_type: string
  segment: string
  relevance: string
  priority: 'P1' | 'P2' | 'P3'
  profile_count: number
  provinces: string[]
  top_clouds: string[]
  top_role_families: string[]
  profile_ids: string[]
}

interface SalesforceSummary {
  market_name: string
  total_profiles: number
  total_companies: number
  total_segments: number
  total_cloud_groups: number
  avg_fit_score: number
  employer_type_distribution: { name: string; count: number }[]
  province_distribution: { name: string; count: number }[]
  seniority_distribution: { seniority: string; count: number }[]
  role_family_distribution: { role_family: string; count: number }[]
  cloud_distribution: { name: string; count: number }[]
  trailhead_rank_distribution: { rank: string; count: number }[]
  data_quality: {
    duplicate_name_records: number
    inferred_email_records_removed_from_public_dataset: number
    linkedin_url_present: number
    source_note: string
  }
}

interface CloudExpertise {
  cloud: string
  profile_count: number
  top_companies: { company: string; count: number }[]
  top_roles: { role_family: string; count: number }[]
  profile_ids: string[]
}

interface ShortlistEntry {
  Rank: string
  'Full Name': string
  'LinkedIn URL': string
  'Current Company': string
  Title: string
  'Why Strong Fit': string
  'Salesforce Specialism': string
  Seniority: string
  'Recruitment Priority': string
}

const profiles = profilesRaw as SalesforceProfile[]
const companies = companiesRaw as SalesforceCompany[]
const summary = summaryRaw as SalesforceSummary
const cloudExpertise = cloudExpertiseRaw as CloudExpertise[]
const shortlist = shortlistRaw as ShortlistEntry[]

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

function topBarWidth(count: number, max: number) {
  return `${Math.max(6, Math.round((count / Math.max(max, 1)) * 100))}%`
}

export function SalesforceEcosystemPage() {
  const [query, setQuery] = useState('')
  const [employerType, setEmployerType] = useState('')
  const [province, setProvince] = useState('')
  const [cloud, setCloud] = useState('')
  const [roleFamily, setRoleFamily] = useState('')

  useEffect(() => {
    document.title = 'SA Salesforce Ecosystem Map'
  }, [])

  const filterOptions = useMemo(() => ({
    employerTypes: uniqueSorted(profiles.map(profile => profile.employer_type)),
    provinces: uniqueSorted(profiles.map(profile => profile.province)),
    clouds: uniqueSorted(profiles.map(profile => profile.cloud_group)),
    roleFamilies: uniqueSorted(profiles.map(profile => profile.role_family)),
  }), [])

  const filteredProfiles = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return profiles.filter(profile => {
      const text = [
        profile.name,
        profile.title,
        profile.company,
        profile.location,
        profile.primary_cloud,
        profile.cloud_group,
        profile.role_family,
        profile.seniority,
        profile.certification_summary,
        profile.secondary_skills_summary,
        profile.notes,
      ].join(' ').toLowerCase()

      return (!needle || text.includes(needle))
        && (!employerType || profile.employer_type === employerType)
        && (!province || profile.province === province)
        && (!cloud || profile.cloud_group === cloud)
        && (!roleFamily || profile.role_family === roleFamily)
    }).sort((a, b) => b.fit_score - a.fit_score || (b.years_salesforce_experience ?? 0) - (a.years_salesforce_experience ?? 0))
  }, [query, employerType, province, cloud, roleFamily])

  const topCompanies = useMemo(() => companies.slice(0, 12), [])
  const topClouds = useMemo(() => summary.cloud_distribution.slice(0, 10), [])
  const maxCloudCount = topClouds[0]?.count ?? 1
  const visibleProfiles = filteredProfiles.slice(0, 200)

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
          <StatCard value={summary.total_profiles} label="Profiles" color="var(--color-primary)" />
          <StatCard value={summary.total_companies} label="Companies" color="var(--color-success)" />
          <StatCard value={summary.total_cloud_groups} label="Cloud Groups" color="var(--color-accent)" />
          <StatCard value={summary.avg_fit_score} label="Avg Priority Score" color="var(--color-purple)" />
        </div>

        <div className="grid grid-3 mb-3">
          {summary.employer_type_distribution.map(segment => (
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
              {topClouds.map(item => (
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
              {summary.seniority_distribution.map(item => (
                <div className="flex justify-between items-center" key={item.seniority}>
                  <span>{item.seniority}</span>
                  <span className="badge badge-Medium">{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <Building2 size={20} />
            <h2>Top Salesforce Ecosystem Companies</h2>
          </div>
          <div className="grid grid-3">
            {topCompanies.map(company => (
              <div className="card card-hover" key={company.id}>
                <div className="flex justify-between gap-1 mb-1">
                  <h3>{company.name}</h3>
                  <span className={`badge badge-${company.priority}`}>{company.priority}</span>
                </div>
                <div className="text-sm text-secondary mb-1">{company.employer_type}</div>
                <div className="text-xl font-bold">{company.profile_count}</div>
                <div className="text-sm text-secondary mb-1">mapped profiles</div>
                <div className="text-sm"><strong>Clouds:</strong> {company.top_clouds.join(', ') || 'Not classified'}</div>
                <div className="text-sm"><strong>Roles:</strong> {company.top_role_families.slice(0, 3).join(', ') || 'Not classified'}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-2 mb-3">
          <div className="card">
            <div className="flex items-center gap-1 mb-2">
              <Users size={20} />
              <h2>Priority Shortlist — Top 20</h2>
            </div>
            <div className="grid">
              {shortlist.slice(0, 20).map(entry => (
                <div className="card" key={`${entry.Rank}-${entry['Full Name']}`} style={{ padding: '0.875rem' }}>
                  <div className="flex justify-between gap-1">
                    <a href={entry['LinkedIn URL']} target="_blank" rel="noreferrer" className="font-bold">
                      {entry.Rank}. {entry['Full Name']}
                    </a>
                    <span className={`badge badge-${entry['Recruitment Priority']}`}>{entry['Recruitment Priority']}</span>
                  </div>
                  <div className="text-sm text-secondary">{entry.Title} — {entry['Current Company']}</div>
                  <div className="text-sm">{entry['Salesforce Specialism']}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-1 mb-2">
              <Database size={20} />
              <h2>Cloud Specialist Clusters</h2>
            </div>
            <div className="grid">
              {cloudExpertise.slice(0, 10).map(cluster => (
                <div className="card" key={cluster.cloud} style={{ padding: '0.875rem' }}>
                  <div className="flex justify-between gap-1">
                    <strong>{cluster.cloud}</strong>
                    <span className="badge badge-High">{cluster.profile_count}</span>
                  </div>
                  <div className="text-sm text-secondary">
                    {cluster.top_companies.slice(0, 3).map(company => `${company.company} (${company.count})`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card mb-3">
          <div className="flex items-center gap-1 mb-2">
            <ShieldCheck size={20} />
            <h2>Data Quality & Privacy Guardrails</h2>
          </div>
          <div className="grid grid-3">
            <div>
              <div className="text-xl font-bold">{summary.data_quality.linkedin_url_present}</div>
              <div className="text-sm text-secondary">LinkedIn evidence links retained</div>
            </div>
            <div>
              <div className="text-xl font-bold">{summary.data_quality.duplicate_name_records}</div>
              <div className="text-sm text-secondary">duplicate-name records flagged, not deleted</div>
            </div>
            <div>
              <div className="text-xl font-bold">{summary.data_quality.inferred_email_records_removed_from_public_dataset}</div>
              <div className="text-sm text-secondary">inferred email records removed from public JSON</div>
            </div>
          </div>
          <p className="text-sm text-secondary mt-2">{summary.data_quality.source_note}</p>
        </section>

        <section className="card">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Search size={20} />
              <h2>Search the Full Salesforce Profile Map</h2>
            </div>
            <div className="text-sm text-secondary">
              Showing {visibleProfiles.length} of {filteredProfiles.length} matching profiles
            </div>
          </div>

          <div className="grid grid-4 mb-2">
            <div className="search-bar">
              <Search className="search-icon" size={14} />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search name, company, skill..."
                aria-label="Search Salesforce profiles"
              />
            </div>

            <select className="btn" value={employerType} onChange={event => setEmployerType(event.target.value)} aria-label="Filter by employer type">
              <option value="">All employer types</option>
              {filterOptions.employerTypes.map(item => <option key={item} value={item}>{item}</option>)}
            </select>

            <select className="btn" value={province} onChange={event => setProvince(event.target.value)} aria-label="Filter by province">
              <option value="">All provinces</option>
              {filterOptions.provinces.map(item => <option key={item} value={item}>{item}</option>)}
            </select>

            <select className="btn" value={cloud} onChange={event => setCloud(event.target.value)} aria-label="Filter by cloud">
              <option value="">All clouds</option>
              {filterOptions.clouds.map(item => <option key={item} value={item}>{item}</option>)}
            </select>

            <select className="btn" value={roleFamily} onChange={event => setRoleFamily(event.target.value)} aria-label="Filter by role family">
              <option value="">All role families</option>
              {filterOptions.roleFamilies.map(item => <option key={item} value={item}>{item}</option>)}
            </select>

            <button
              className="btn btn-ghost"
              onClick={() => {
                setQuery('')
                setEmployerType('')
                setProvince('')
                setCloud('')
                setRoleFamily('')
              }}
            >
              Clear filters
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Company</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Cloud</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Role Family</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {visibleProfiles.map(profile => (
                  <tr key={profile.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <a href={profile.linkedin_url} target="_blank" rel="noreferrer">{profile.name}</a>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{profile.title}</td>
                    <td style={{ padding: '0.75rem' }}>{profile.company}</td>
                    <td style={{ padding: '0.75rem' }}>{profile.cloud_group}</td>
                    <td style={{ padding: '0.75rem' }}>{profile.role_family}</td>
                    <td style={{ padding: '0.75rem' }}>{profile.location}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-High">{profile.fit_score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProfiles.length > visibleProfiles.length && (
            <p className="text-sm text-secondary mt-2">
              The full matching dataset is loaded; the table renders the first 200 rows to keep the page responsive. Narrow the filters to inspect the rest.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
