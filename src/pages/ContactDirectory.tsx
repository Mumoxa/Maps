import { useEffect, useMemo, useState } from 'react'
import { Building2, ExternalLink, Linkedin, Mail, MapPin, Phone, Search, Users } from 'lucide-react'
import { contacts } from '../data/contacts'
import type { Contact } from '../data/contacts'

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1LsmxaLsry785sxjuZngk7Tan0cJc6bgA9zkBu7mFFU0/gviz/tq?tqx=out:json'

function cell(row: any[], n: number) { return row?.[n]?.v == null ? '' : String(row[n].v) }
function sheetContacts(payload: any): Contact[] {
  const rows = payload?.table?.rows || []; let company = ''; let website = ''; let companyLinkedin = ''; let industry = ''; let companySize = ''
  return rows.map((r: any, index: number) => {
    const v = r.c || []; company = cell(v, 0) || company; website = cell(v, 1) || website; companyLinkedin = cell(v, 2) || companyLinkedin; industry = cell(v, 3) || industry; companySize = cell(v, 4) || companySize
    const first = cell(v, 5); const last = cell(v, 6); if (!first && !last) return null
    return { id: `${first}-${last}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: `${first} ${last}`.trim(), company, website, companyLinkedin, industry, companySize, title: cell(v, 7), linkedin: cell(v, 8), email: cell(v, 9), emailStatus: cell(v, 10), directPhone: cell(v, 11), mobile: cell(v, 12), trigger: cell(v, 13), location: cell(v, 15), remarks: cell(v, 77), dateAdded: cell(v, 90) }
  }).filter(Boolean) as Contact[]
}

export function ContactDirectory() {
  const [query, setQuery] = useState('')
  const [directory, setDirectory] = useState(contacts)
  const [loadingSource, setLoadingSource] = useState(true)
  useEffect(() => { let alive = true
    fetch(SHEET_URL).then(r => r.text()).then(text => { const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s); const imported = match ? sheetContacts(JSON.parse(match[1])) : []; if (alive && imported.length) setDirectory(imported) }).catch(() => undefined).finally(() => { if (alive) setLoadingSource(false) })
    return () => { alive = false }
  }, [])
  const [industry, setIndustry] = useState('')
  const results = useMemo(() => directory.filter(c => {
    const text = `${c.name} ${c.company} ${c.industry} ${c.title} ${c.location} ${c.email}`.toLowerCase()
    return (!query || text.includes(query.toLowerCase())) && (!industry || c.industry === industry)
  }), [query, industry, directory])
  const industries = [...new Set(directory.map(c => c.industry))].sort()
  return <div className="page"><div className="container">
    <div className="contact-hero">
      <div><p className="eyebrow">Client relationships</p><h1>Contact directory</h1><p>Decision-makers and client-side data, AI and technology contacts. Candidate profiles remain available separately.</p></div>
      <div className="contact-stats"><strong>{directory.length}</strong><span>client contacts</span><strong>{new Set(directory.map(c=>c.company)).size}</strong><span>companies</span></div>
    </div>
    <div className="contact-toolbar"><div className="contact-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, title, company, industry or location" aria-label="Search contacts"/></div><select className="filter-select" value={industry} onChange={e=>setIndustry(e.target.value)}><option value="">All industries</option>{industries.map(i=><option key={i}>{i}</option>)}</select></div>
    <p className="contact-count">{loadingSource ? 'Refreshing supplied contact workbook…' : `Showing ${results.length} contact${results.length === 1 ? '' : 's'}`}</p>
    <div className="contacts-grid">{results.map(c => <article className="contact-card" key={c.id}>
      <div className="contact-card-top"><div className="avatar">{c.name.split(' ').filter(Boolean).slice(0,2).map(n=>n[0]).join('')}</div><div><h2>{c.name}</h2><p className="contact-title">{c.title}</p></div></div>
      <div className="contact-company"><Building2 size={15}/><span>{c.company}</span>{c.website && <a href={c.website} target="_blank" rel="noreferrer" aria-label={`Open ${c.company} website`}><ExternalLink size={14}/></a>}</div>
      <div className="contact-tags"><span>{c.industry}</span><span><Users size={13}/>{c.companySize}</span>{c.location && <span><MapPin size={13}/>{c.location}</span>}</div>
      <div className="contact-details">{c.email && <a href={`mailto:${c.email}`}><Mail size={15}/>{c.email}<em>{c.emailStatus}</em></a>}{(c.directPhone || c.mobile) && <a href={`tel:${c.directPhone || c.mobile}`}><Phone size={15}/>{c.directPhone || c.mobile}{c.directPhone && c.mobile && ` · ${c.mobile}`}</a>}{c.linkedin && <a href={c.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15}/>LinkedIn profile</a>}</div>
      {c.remarks && <div className="contact-note"><b>Relationship note</b>{c.remarks}</div>}
      <footer>Added {c.dateAdded}</footer>
    </article>)}</div>
  </div></div>
}
