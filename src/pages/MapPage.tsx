import { useMemo, useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { buildCompleteOrgChart, buildTree, buildSlugSets, getDuplicateProfileNames } from '../data'
import { OrgChartCanvas } from '../components/map/OrgChartCanvas'
import { MapSearch } from '../components/map/MapSearch'
import { MapLegend } from '../components/map/MapLegend'
import { MapFilter } from '../components/map/MapFilter'
import { Drawer } from '../components/ui/Drawer'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { SkeletonPage } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import type { Profile } from '../data'

export function MapPage() {
  const { data, loading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => { document.title = 'Interactive Industry Map'; }, [])
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '')
  const [segmentFilter, setSegmentFilter] = useState(searchParams.get('segment') || '')
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  const orgChart = useMemo(() => {
    if (!data) return []
    return buildCompleteOrgChart(data)
  }, [data])

  const tree = useMemo(() => buildTree(orgChart), [orgChart])

  const duplicateNames = useMemo(() => {
    if (!data) return new Set<string>()
    return getDuplicateProfileNames(data.profiles)
  }, [data])

  const mapCounts = useMemo(() => {
    let companies = 0
    let profiles = 0
    for (const entry of orgChart) {
      companies += entry.companies.length
      for (const comp of entry.companies) profiles += comp.profiles.length
    }
    return { companies, profiles }
  }, [orgChart])

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const segmentOptions = useMemo(() => {
    if (!data) return []
    return data.segments.map(s => ({ value: s.name, label: s.name }))
  }, [data])

  const handleProfileClick = useCallback((profile: Profile) => {
    setSelectedProfile(profile)
  }, [])

  const handleSearchChange = useCallback((val: string) => {
    setSearchVal(val)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set('search', val)
      else next.delete('search')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const handleSegmentFilter = useCallback((val: string) => {
    setSegmentFilter(val)
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set('segment', val)
      else next.delete('segment')
      return next
    }, { replace: true })
  }, [setSearchParams])

  const profileSlug = useMemo(() => {
    if (!selectedProfile || !slugSets) return ''
    return slugSets.profileIdToSlug.get(selectedProfile.id) || ''
  }, [selectedProfile, slugSets])

  if (loading) return <SkeletonPage variant="map" />
  if (!data) return null

  return (
    <ErrorBoundary>
      <div className="map-page">
        <h1 className="sr-only">Interactive industry map</h1>
        <div className="map-container">
          <OrgChartCanvas
            tree={tree}
            searchQuery={searchVal}
            filterSegment={segmentFilter}
            duplicateNames={duplicateNames}
            onProfileClick={handleProfileClick}
          />
          <MapFilter
            segmentOptions={segmentOptions}
            activeSegment={segmentFilter}
            onChange={handleSegmentFilter}
          />
          <MapSearch value={searchVal} onChange={handleSearchChange} />
          <MapLegend
            segmentCount={data.segments.length}
            companyCount={mapCounts.companies}
            profileCount={mapCounts.profiles}
          />
        </div>
      </div>

      <Drawer
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
        title={selectedProfile?.name || 'Profile'}
        subtitle={selectedProfile ? `${selectedProfile.title} · ${selectedProfile.company}` : undefined}
      >
        {selectedProfile && (
          <div className="detail-facts">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge text={`${selectedProfile.confidence} confidence`} variant="confidence" confidence={selectedProfile.confidence} />
              <span className="chip">Fit {selectedProfile.fit_score}/10</span>
              <span className="chip">{selectedProfile.seniority}</span>
            </div>

            <div className="detail-facts">
              <div className="detail-fact">
                <span className="detail-label">Company</span>
                <span>
                  {selectedProfile.company === 'Needs verification' ? (
                    <Badge text="Needs verification" variant="verification" />
                  ) : (
                    selectedProfile.company
                  )}
                </span>
              </div>
              <div className="detail-fact">
                <span className="detail-label">Location</span>
                <span>{selectedProfile.location}</span>
              </div>
              <div className="detail-fact">
                <span className="detail-label">Segment</span>
                <span>{selectedProfile.segment}</span>
              </div>
              <div className="detail-fact">
                <span className="detail-label">Specialism</span>
                <span>{selectedProfile.specialism}</span>
              </div>
            </div>

            {selectedProfile.evidence && (
              <div className="detail-fact">
                <span className="detail-label">Evidence</span>
                <span className="text-sm">{selectedProfile.evidence}</span>
              </div>
            )}

            <div className="detail-inline-links">
              {selectedProfile.linkedin_url && selectedProfile.linkedin_url !== '#' && (
                <a href={selectedProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                  LinkedIn
                </a>
              )}
              {profileSlug && (
                <Button size="sm" to={`/profiles/${profileSlug}`}>
                  Open full profile
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </ErrorBoundary>
  )
}
