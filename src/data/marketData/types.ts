export interface MarketLocation {
  city: string
  province: string
  country: string
}

export interface MarketSource {
  url: string
  type: string
  evidence: string
  checkedOn: string | null
}

export interface MarketBatchRecord {
  id: string
  name: string
  title: string
  company: string
  location: MarketLocation
  seniority: string
  skills: string[]
  sectors: string[]
  specialisms: string[]
  summary: string
  linkedinUrl: string
  sources: MarketSource[]
  suppliedAsVerified: true
  supersedesId: string | null
  attributes: Record<string, unknown>
}

export interface MarketBatch {
  schemaVersion: 1
  batchId: string
  trackSlug: string
  sourceFile: string
  suppliedOn: string
  records: MarketBatchRecord[]
}

export interface MarketProvenance {
  kind: 'legacy' | 'batch'
  batchId: string | null
  sourceProfileId: string | null
}

export interface MarketProfile extends MarketBatchRecord {
  track: string
  trackSlug: string
  locationLabel: string
  provenance: MarketProvenance
}

export interface MarketDataIssue {
  severity: 'warning' | 'error'
  batchId: string | null
  rowIndex: number | null
  field: string
  reason: string
}
