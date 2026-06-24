export interface Profile {
  id: string;
  name: string;
  linkedin_url: string;
  location: string;
  company: string;
  title: string;
  seniority: string;
  function: string;
  segment: string;
  specialism: string;
  category: string;
  evidence: string;
  source_url: string;
  fit_score: number;
  confidence: 'High' | 'Medium' | 'Low';
  notes: string;
}

export interface Company {
  id: string;
  name: string;
  segment: string;
  relevance: string;
  risk_teams: string;
  website: string;
  priority: 'P1' | 'P2' | 'P3';
  profile_count: number;
}

export interface Segment {
  id: string;
  name: string;
  profile_count: number;
  companies: string[];
}

export interface ShortlistEntry {
  Rank: string;
  'Full Name': string;
  'LinkedIn URL': string;
  'Current Company': string;
  Title: string;
  'Why Strong Fit': string;
  'Credit Risk Specialism': string;
  Seniority: string;
  'Recruitment Priority': string;
}

export interface Summary {
  total_profiles: number;
  total_companies: number;
  total_segments: number;
  avg_fit_score: number;
  confidence_split: { confidence: string; count: number }[];
  seniority_distribution: { seniority: string; count: number }[];
  segment_distribution: { name: string; count: number }[];
}

export interface OrgChartEntry {
  segment: string;
  segment_id: string;
  profile_count: number;
  companies: OrgChartCompany[];
}

export interface OrgChartCompany {
  id: string;
  name: string;
  segment: string;
  relevance: string;
  risk_teams: string;
  website: string;
  priority: string;
  profile_count: number;
  profiles: Profile[];
}

export interface DataBundle {
  profiles: Profile[];
  companies: Company[];
  segments: Segment[];
  orgChart: OrgChartEntry[];
  shortlist: ShortlistEntry[];
  summary: Summary;
}

export interface TalentProfile {
  id: string;
  track: string;
  trackSlug: string;
  name: string;
  company: string;
  title: string;
  location: string;
  seniority: string;
  skills: string[];
  sectors: string[];
  summary: string;
  linkedinUrl: string;
  sourceType: 'bundled' | 'manual';
  sourceProfileId?: string;
}

export type TreeNodeType = 'segment' | 'company' | 'profile';

export interface TreeNode {
  id: string;
  type: TreeNodeType;
  label: string;
  data: Profile | Company | Segment | null;
  children: TreeNode[];
  collapsed?: boolean;
}

export interface FilterOptions {
  segment?: string;
  company?: string;
  confidence?: 'High' | 'Medium' | 'Low';
  seniority?: string;
  priority?: 'P1' | 'P2' | 'P3';
  hasNotes?: boolean;
  needsVerification?: boolean;
  query?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface CompanyAliasMap {
  [alias: string]: string;
}

export interface SegmentNormalizationMap {
  [companySegment: string]: string;
}

export interface ValidationWarning {
  type: 'duplicate_profile_name' | 'company_not_found' | 'segment_mismatch'
      | 'needs_verification' | 'empty_notes' | 'org_chart_gap' | 'slug_collision';
  severity: 'info' | 'warning' | 'error';
  message: string;
  entityId?: string;
  entityName?: string;
}
