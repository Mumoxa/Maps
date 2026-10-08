import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfidenceTag } from '../components/intelligence/IntelBits'
import { CONFIDENCE_RANK } from '../data/intelligence/graph'
import { expandIndustries } from '../data/intelligence/taxonomy'
import { useIntelligenceGraph } from '../data/intelligence/useIntelligence'
import { slugify } from '../data/slug'

// ----- Industries -----

export function IndustriesPage() {
  const { id } = useParams()
  const graph = useIntelligenceGraph()
  const tax = graph.taxonomy
  const industry = id ? tax.industryById.get(id) : null

  useEffect(() => {
    document.title = `SA Talent Map | ${industry ? industry.name : id ? 'Industry not found' : 'Industries'}`
  }, [industry, id])

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of tax.industries) {
      const ids = expandIndustries(tax, [row.id])
      const orgs = new Set<string>()
      for (const industryId of ids) for (const orgId of graph.orgsByIndustry.get(industryId) ?? []) orgs.add(orgId)
      map.set(row.id, orgs.size)
    }
    return map
  }, [graph, tax])

  if (id && !industry) {
    return (
      <div className="page">
        <div className="container">
          <EmptyState title="Industry not found" description="This industry id is not in the taxonomy." action={{ label: 'All industries', to: '/industries' }} />
        </div>
      </div>
    )
  }

  if (!industry) {
    const sectors = tax.industries.filter((row) => !row.parentId)
    return (
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Industries' }]} />
          <div className="page-head">
            <div>
              <h1>Industries</h1>
              <p>The controlled industry taxonomy. A company can belong to several industries; counts include subindustries and are not exhaustive.</p>
            </div>
          </div>
          <div className="intel-tree">
            {sectors.map((sector) => (
              <section key={sector.id} className="intel-tree-group" aria-labelledby={`sector-${sector.id}`}>
                <h2 id={`sector-${sector.id}`} className="intel-tree-title">
                  <Link to={`/industries/${sector.id}`}>{sector.name}</Link> <span className="intel-muted">{counts.get(sector.id) ?? 0}</span>
                </h2>
                <ul>
                  {(tax.industryChildren.get(sector.id) ?? []).map((childId) => (
                    <li key={childId}>
                      <Link to={`/industries/${childId}`}>{tax.industryById.get(childId)?.name}</Link> <span className="intel-muted">{counts.get(childId) ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const scope = expandIndustries(tax, [industry.id])
  const memberIds = new Set<string>()
  for (const industryId of scope) for (const orgId of graph.orgsByIndustry.get(industryId) ?? []) memberIds.add(orgId)
  const members = [...memberIds].map((orgId) => graph.organizationById.get(orgId)).filter((org) => org !== undefined).sort((a, b) => a.name.localeCompare(b.name))
  const parent = industry.parentId ? tax.industryById.get(industry.parentId) : null

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Industries', to: '/industries' }, { label: industry.name }]} />
        <div className="page-head">
          <div>
            <h1>{industry.name}</h1>
            <p>
              {parent ? (
                <>
                  Part of <Link to={`/industries/${parent.id}`}>{parent.name}</Link>.{' '}
                </>
              ) : null}
              {industry.synonyms.length ? `Also called ${industry.synonyms.join(', ')}.` : ''}
            </p>
          </div>
          <div className="page-head-aside">
            <span className="page-head-meta">
              <b>{members.length}</b> organizations recorded
            </span>
          </div>
        </div>
        {(tax.valueChain.get(industry.id)?.size ?? 0) > 0 && (
          <p>
            Value chain neighbours:{' '}
            {[...(tax.valueChain.get(industry.id) ?? [])].map((other, index) => (
              <span key={other}>
                {index > 0 && ', '}
                <Link to={`/industries/${other}`}>{tax.industryById.get(other)?.name}</Link>
              </span>
            ))}
          </p>
        )}
        {industry.typicalCapabilities.length > 0 && (
          <p className="intel-muted">
            Typical capabilities (hypotheses only, never counted as observed for a company): {industry.typicalCapabilities.map((cap) => tax.capabilityById.get(cap)?.name ?? cap).join(', ')}
          </p>
        )}
        <ul className="intel-org-list">
          {members.map((org) => {
            const membership = (graph.industriesByOrg.get(org.id) ?? []).find((row) => scope.has(row.industryId))
            return (
              <li key={org.id}>
                <Link to={`/organizations/${org.id}`}>{org.name}</Link> {membership && <ConfidenceTag value={membership.confidence} />}
                {membership && membership.industryId !== industry.id && <span className="intel-muted"> · {tax.industryById.get(membership.industryId)?.name}</span>}
              </li>
            )
          })}
        </ul>
        <Link className="btn btn-secondary btn-sm" to={`/company-associations?scope=all&ind=${industry.id}&view=table`}>
          Open in explorer
        </Link>
      </div>
    </div>
  )
}

// ----- Capabilities -----

export function CapabilitiesPage() {
  const { id } = useParams()
  const graph = useIntelligenceGraph()
  const tax = graph.taxonomy
  const capability = id ? tax.capabilityById.get(id) : null

  useEffect(() => {
    document.title = `SA Talent Map | ${capability ? capability.name : id ? 'Capability not found' : 'Capabilities'}`
  }, [capability, id])

  const observedCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const [, caps] of graph.capabilitiesByOrg) {
      const hit = new Set<string>()
      for (const row of caps.values()) {
        if (row.status !== 'observed' || CONFIDENCE_RANK[row.confidence] < 2) continue
        for (const ancestor of tax.capabilityLineage.get(row.capabilityId) ?? []) hit.add(ancestor)
      }
      for (const capId of hit) counts.set(capId, (counts.get(capId) ?? 0) + 1)
    }
    return counts
  }, [graph, tax])

  if (id && !capability) {
    return (
      <div className="page">
        <div className="container">
          <EmptyState title="Capability not found" description="This capability id is not in the taxonomy." action={{ label: 'All capabilities', to: '/capabilities' }} />
        </div>
      </div>
    )
  }

  if (!capability) {
    const roots = tax.capabilities.filter((row) => !row.parentId)
    return (
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Capabilities' }]} />
          <div className="page-head">
            <div>
              <h1>Operational capabilities</h1>
              <p>Reusable activities a company is observed to carry out. Counts are companies with probable or confirmed evidence, including more specific capabilities.</p>
            </div>
          </div>
          <div className="intel-tree">
            {(['operational', 'commercial', 'financial', 'technology'] as const).map((kind) => (
              <section key={kind} className="intel-tree-group" aria-labelledby={`kind-${kind}`}>
                <h2 id={`kind-${kind}`} className="intel-tree-title">
                  {kind[0].toUpperCase() + kind.slice(1)}
                </h2>
                <ul>
                  {roots
                    .filter((row) => row.kind === kind)
                    .map((row) => (
                      <li key={row.id}>
                        <Link to={`/capabilities/${row.id}`}>{row.name}</Link> <span className="intel-muted">{observedCounts.get(row.id) ?? 0}</span>
                        {[...(tax.capabilityDescendants.get(row.id) ?? [])].filter((child) => child !== row.id).length > 0 && (
                          <ul>
                            {[...(tax.capabilityDescendants.get(row.id) ?? [])]
                              .filter((child) => child !== row.id)
                              .map((child) => (
                                <li key={child}>
                                  <Link to={`/capabilities/${child}`}>{tax.capabilityById.get(child)?.name}</Link> <span className="intel-muted">{observedCounts.get(child) ?? 0}</span>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const descendants = tax.capabilityDescendants.get(capability.id) ?? new Set([capability.id])
  const observed: { orgId: string; via: string; confidence: string }[] = []
  const notObserved: string[] = []
  const unknown: string[] = []
  for (const [orgId, caps] of graph.capabilitiesByOrg) {
    let found = false
    for (const capId of descendants) {
      const row = caps.get(capId)
      if (row && row.status === 'observed' && CONFIDENCE_RANK[row.confidence] >= 1) {
        observed.push({ orgId, via: capId, confidence: row.confidence })
        found = true
        break
      }
    }
    if (found) continue
    const direct = caps.get(capability.id)
    if (direct?.status === 'not-observed') notObserved.push(orgId)
    else if (direct && direct.status === 'unknown' && !direct.inferredFromIndustry) unknown.push(orgId)
  }
  observed.sort((a, b) => (graph.organizationById.get(a.orgId)?.name ?? '').localeCompare(graph.organizationById.get(b.orgId)?.name ?? ''))
  const typicalFor = tax.industries.filter((row) => row.typicalCapabilities.includes(capability.id))

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Capabilities', to: '/capabilities' }, { label: capability.name }]} />
        <div className="page-head">
          <div>
            <h1>{capability.name}</h1>
            <p>
              {capability.kind} capability{capability.synonyms.length ? `. Also: ${capability.synonyms.join(', ')}` : ''}.
            </p>
          </div>
        </div>
        <h2>Observed at ({observed.length})</h2>
        <ul className="intel-org-list">
          {observed.map((row) => (
            <li key={row.orgId}>
              <Link to={`/organizations/${row.orgId}`}>{graph.organizationById.get(row.orgId)?.name}</Link> <ConfidenceTag value={row.confidence as 'confirmed'} />
              {row.via !== capability.id && <span className="intel-muted"> · via {tax.capabilityById.get(row.via)?.name}</span>}
            </li>
          ))}
        </ul>
        {notObserved.length > 0 && (
          <>
            <h2>Sources say not carried out ({notObserved.length})</h2>
            <ul className="intel-org-list">{notObserved.map((orgId) => <li key={orgId}><Link to={`/organizations/${orgId}`}>{graph.organizationById.get(orgId)?.name}</Link></li>)}</ul>
          </>
        )}
        {unknown.length > 0 && (
          <>
            <h2>Checked, still unknown ({unknown.length})</h2>
            <ul className="intel-org-list">{unknown.map((orgId) => <li key={orgId}><Link to={`/organizations/${orgId}`}>{graph.organizationById.get(orgId)?.name}</Link></li>)}</ul>
          </>
        )}
        {typicalFor.length > 0 && (
          <p className="intel-muted">
            Typical for: {typicalFor.map((row) => row.name).join(', ')}. Companies in these industries without evidence are shown as hypotheses only.
          </p>
        )}
        <Link className="btn btn-secondary btn-sm" to={`/company-associations?scope=all&cap=${capability.id}&view=table`}>
          Open in explorer
        </Link>
      </div>
    </div>
  )
}

// ----- Qualifications -----

export function QualificationsPage() {
  const { slug } = useParams()
  const graph = useIntelligenceGraph()

  const byQualification = useMemo(() => {
    const map = new Map<string, { label: string; personIds: string[] }>()
    for (const person of graph.persons) {
      for (const qualification of person.qualifications) {
        const key = slugify(qualification)
        if (!key) continue
        const entry = map.get(key) ?? { label: qualification, personIds: [] }
        entry.personIds.push(person.id)
        map.set(key, entry)
      }
    }
    return map
  }, [graph])
  const entry = slug ? byQualification.get(slug) : null

  useEffect(() => {
    document.title = `SA Talent Map | ${entry ? entry.label : slug ? 'Qualification not found' : 'Qualifications'}`
  }, [entry, slug])

  if (slug && !entry) {
    return (
      <div className="page">
        <div className="container">
          <EmptyState title="Qualification not found" description="No mapped person lists this qualification." action={{ label: 'All qualifications', to: '/qualifications' }} />
        </div>
      </div>
    )
  }

  if (!entry) {
    const list = [...byQualification.entries()].sort((a, b) => b[1].personIds.length - a[1].personIds.length || a[1].label.localeCompare(b[1].label))
    return (
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Qualifications' }]} />
          <div className="page-head">
            <div>
              <h1>Qualifications</h1>
              <p>Qualifications listed on public professional profiles. These describe people, never companies.</p>
            </div>
          </div>
          <ul className="intel-org-list">
            {list.map(([key, value]) => (
              <li key={key}>
                <Link to={`/qualifications/${key}`}>{value.label}</Link> <span className="intel-muted">{value.personIds.length}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const employers = new Map<string, number>()
  for (const personId of entry.personIds) {
    for (const row of graph.employmentsByPerson.get(personId) ?? []) if (row.current && row.organizationId) employers.set(row.organizationId, (employers.get(row.organizationId) ?? 0) + 1)
  }
  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Qualifications', to: '/qualifications' }, { label: entry.label }]} />
        <div className="page-head">
          <div>
            <h1>{entry.label}</h1>
            <p>{entry.personIds.length} people list this qualification on a public profile.</p>
          </div>
        </div>
        <div className="intel-columns">
          <section aria-labelledby="q-people">
            <h2 id="q-people">People</h2>
            <ul className="intel-people">
              {entry.personIds.map((personId) => {
                const person = graph.personById.get(personId)
                if (!person) return null
                return (
                  <li key={personId}>
                    <Link to={person.href}>{person.name}</Link> <span className="intel-muted">{person.title}</span>
                  </li>
                )
              })}
            </ul>
          </section>
          <section aria-labelledby="q-employers">
            <h2 id="q-employers">Current employers</h2>
            <ul className="intel-org-list">
              {[...employers.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([orgId, count]) => (
                  <li key={orgId}>
                    <Link to={`/organizations/${orgId}`}>{graph.organizationById.get(orgId)?.name}</Link> <span className="intel-muted">{count}</span>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
