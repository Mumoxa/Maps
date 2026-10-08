-- Canonical company-intelligence schema (target for a future secure backend).
--
-- Status: NOT deployed. The site is static (Cloudflare Pages) and has no
-- database today. This file is the agreed contract for when an authenticated
-- backend exists. It is portable SQL tested against SQLite (node:sqlite) in
-- tests/intelligence-schema.test.ts; adjust types (e.g. TEXT -> UUID/JSONB,
-- add row-level security) when targeting Postgres or Cloudflare D1.
--
-- Public tables: organization .. coverage_record (non-confidential company facts).
-- Confidential tables: everything from recruitment_search down. These must
-- only ever be reachable through authenticated, access-controlled endpoints.

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------------
-- Provenance
-- ---------------------------------------------------------------------------

CREATE TABLE import_batch (
  id              TEXT PRIMARY KEY,
  file_name       TEXT NOT NULL,
  content_hash    TEXT NOT NULL,
  format          TEXT NOT NULL CHECK (format IN ('csv', 'json')),
  imported_at     TEXT NOT NULL,
  imported_by     TEXT NOT NULL,
  row_count       INTEGER NOT NULL DEFAULT 0,
  accepted        INTEGER NOT NULL DEFAULT 0,
  duplicates      INTEGER NOT NULL DEFAULT 0,
  conflicts       INTEGER NOT NULL DEFAULT 0,
  rejected        INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL CHECK (status IN ('committed', 'rolled-back')),
  confidential    INTEGER NOT NULL DEFAULT 1,
  UNIQUE (content_hash, status)
);

CREATE TABLE research_run (
  id              TEXT PRIMARY KEY,
  researched_on   TEXT NOT NULL,
  researcher      TEXT NOT NULL,
  scope           TEXT NOT NULL,
  method          TEXT,
  import_batch_id TEXT REFERENCES import_batch(id) ON DELETE CASCADE,
  confidential    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE evidence_record (
  id              TEXT PRIMARY KEY,
  research_run_id TEXT NOT NULL REFERENCES research_run(id) ON DELETE CASCADE,
  url             TEXT,
  source_name     TEXT NOT NULL,
  source_type     TEXT NOT NULL CHECK (source_type IN ('company-website','company-social','company-recruitment','company-presentation','trade-press','news','academic','third-party-directory','internal-dataset','recruiter-note')),
  published_on    TEXT,
  observed_on     TEXT NOT NULL,
  supports        TEXT NOT NULL CHECK (length(supports) > 0),
  reviewer        TEXT
);

-- ---------------------------------------------------------------------------
-- Organizations and taxonomy (public)
-- ---------------------------------------------------------------------------

CREATE TABLE organization (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  legal_name      TEXT,
  website         TEXT,
  domain          TEXT,
  identity_status TEXT NOT NULL CHECK (identity_status IN ('verified', 'probable', 'unresolved')),
  south_african   INTEGER NOT NULL DEFAULT 1,
  last_verified   TEXT
);

CREATE TABLE organization_alias (
  organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  alias           TEXT NOT NULL,
  kind            TEXT NOT NULL CHECK (kind IN ('alias', 'former-name', 'legal-name')),
  PRIMARY KEY (organization_id, alias, kind)
);

CREATE TABLE organization_lineage (
  organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  ref             TEXT NOT NULL UNIQUE,
  dataset         TEXT NOT NULL,
  record_id       TEXT NOT NULL,
  source_name     TEXT NOT NULL,
  PRIMARY KEY (organization_id, ref)
);

CREATE TABLE industry (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  parent_id       TEXT REFERENCES industry(id)
);

CREATE TABLE industry_value_chain (
  industry_id     TEXT NOT NULL REFERENCES industry(id),
  related_id      TEXT NOT NULL REFERENCES industry(id),
  PRIMARY KEY (industry_id, related_id)
);

CREATE TABLE operational_capability (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  parent_id       TEXT REFERENCES operational_capability(id),
  kind            TEXT NOT NULL CHECK (kind IN ('operational', 'commercial', 'financial', 'technology'))
);

CREATE TABLE capability_synonym (
  capability_id   TEXT NOT NULL REFERENCES operational_capability(id) ON DELETE CASCADE,
  synonym         TEXT NOT NULL,
  PRIMARY KEY (capability_id, synonym)
);

CREATE TABLE industry_typical_capability (
  industry_id     TEXT NOT NULL REFERENCES industry(id),
  capability_id   TEXT NOT NULL REFERENCES operational_capability(id),
  PRIMARY KEY (industry_id, capability_id)
);

CREATE TABLE organization_industry (
  organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  industry_id     TEXT NOT NULL REFERENCES industry(id),
  role            TEXT NOT NULL CHECK (role IN ('primary', 'secondary')),
  confidence      TEXT NOT NULL CHECK (confidence IN ('confirmed', 'probable', 'hypothesis', 'unknown')),
  origin          TEXT NOT NULL CHECK (origin IN ('source-reported', 'recruiter-supplied', 'system-inferred', 'recruiter-reviewed')),
  research_run_id TEXT NOT NULL REFERENCES research_run(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, industry_id, research_run_id)
);

CREATE TABLE organization_capability (
  organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  capability_id   TEXT NOT NULL REFERENCES operational_capability(id),
  status          TEXT NOT NULL CHECK (status IN ('observed', 'not-observed', 'unknown')),
  confidence      TEXT NOT NULL CHECK (confidence IN ('confirmed', 'probable', 'hypothesis', 'unknown')),
  origin          TEXT NOT NULL CHECK (origin IN ('source-reported', 'recruiter-supplied', 'system-inferred', 'recruiter-reviewed')),
  business_unit   TEXT,
  summary         TEXT NOT NULL DEFAULT '',
  research_run_id TEXT NOT NULL REFERENCES research_run(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, capability_id, research_run_id)
);

CREATE TABLE organization_relationship (
  from_id         TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  to_id           TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('subsidiary-of', 'division-of', 'acquired-by', 'joint-venture', 'partnership')),
  confidence      TEXT NOT NULL CHECK (confidence IN ('confirmed', 'probable', 'hypothesis', 'unknown')),
  summary         TEXT NOT NULL DEFAULT '',
  research_run_id TEXT NOT NULL REFERENCES research_run(id) ON DELETE CASCADE,
  CHECK (from_id <> to_id),
  PRIMARY KEY (from_id, to_id, type, research_run_id)
);

CREATE TABLE organization_location (
  organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  province        TEXT NOT NULL,
  city            TEXT NOT NULL DEFAULT '',
  confidence      TEXT NOT NULL,
  research_run_id TEXT NOT NULL REFERENCES research_run(id) ON DELETE CASCADE,
  PRIMARY KEY (organization_id, province, city, research_run_id)
);

CREATE TABLE scale_metric (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  metric          TEXT NOT NULL CHECK (metric IN ('employees', 'revenue', 'sites', 'storage-pallets', 'storage-tonnes', 'pallets-per-day')),
  value           REAL,
  value_text      TEXT NOT NULL,
  as_of           TEXT,
  confidence      TEXT NOT NULL,
  note            TEXT NOT NULL DEFAULT '',
  research_run_id TEXT NOT NULL REFERENCES research_run(id) ON DELETE CASCADE
);

-- Every fact row cites one or more evidence records.
CREATE TABLE fact_evidence (
  fact_table      TEXT NOT NULL CHECK (fact_table IN ('organization_industry', 'organization_capability', 'organization_relationship', 'organization_location', 'scale_metric')),
  fact_key        TEXT NOT NULL,
  evidence_id     TEXT NOT NULL REFERENCES evidence_record(id) ON DELETE CASCADE,
  PRIMARY KEY (fact_table, fact_key, evidence_id)
);

CREATE TABLE coverage_record (
  organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  dataset         TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('researched-with-people', 'researched-zero-results', 'needs-research')),
  verified_people INTEGER,
  last_checked    TEXT,
  scope           TEXT NOT NULL,
  PRIMARY KEY (organization_id, dataset)
);

-- ---------------------------------------------------------------------------
-- People (public professional profiles). Never merged on name similarity.
-- ---------------------------------------------------------------------------

CREATE TABLE person (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  dataset         TEXT NOT NULL,
  title           TEXT NOT NULL DEFAULT '',
  province        TEXT NOT NULL DEFAULT '',
  profile_url     TEXT,
  last_verified   TEXT
);

CREATE TABLE person_link (
  person_id       TEXT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  same_as_id      TEXT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  reviewed_by     TEXT NOT NULL,
  reviewed_at     TEXT NOT NULL,
  evidence        TEXT NOT NULL CHECK (length(evidence) > 0),
  CHECK (person_id < same_as_id),
  PRIMARY KEY (person_id, same_as_id)
);

CREATE TABLE employment (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id       TEXT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  organization_id TEXT REFERENCES organization(id) ON DELETE SET NULL,
  employer_name   TEXT NOT NULL,
  title           TEXT NOT NULL DEFAULT '',
  is_current      INTEGER NOT NULL,
  match           TEXT NOT NULL CHECK (match IN ('exact', 'alias-table', 'unresolved', 'reviewed')),
  verified_on     TEXT
);

CREATE TABLE person_qualification (
  person_id       TEXT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  qualification   TEXT NOT NULL,
  source_url      TEXT,
  PRIMARY KEY (person_id, qualification)
);

CREATE TABLE person_skill (
  person_id       TEXT NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  skill           TEXT NOT NULL,
  source_url      TEXT,
  PRIMARY KEY (person_id, skill)
);

-- ---------------------------------------------------------------------------
-- Confidential recruitment workspace
-- ---------------------------------------------------------------------------

CREATE TABLE recruitment_search (
  id              TEXT PRIMARY KEY,
  owner           TEXT NOT NULL,
  name            TEXT NOT NULL,
  client          TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL CHECK (status IN ('open', 'on-hold', 'closed')),
  role_context_id TEXT,
  role_family     TEXT NOT NULL DEFAULT '',
  seniority       TEXT NOT NULL DEFAULT '',
  bank_search_id  TEXT,
  notes           TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

CREATE TABLE search_requirement (
  search_id       TEXT NOT NULL REFERENCES recruitment_search(id) ON DELETE CASCADE,
  kind            TEXT NOT NULL CHECK (kind IN ('mandatory-capability', 'preferred-capability', 'preferred-industry', 'adjacent-industry', 'deprioritised-industry', 'excluded-industry', 'excluded-organization', 'qualification', 'geography')),
  value           TEXT NOT NULL,
  PRIMARY KEY (search_id, kind, value)
);

CREATE TABLE search_target_company (
  id              TEXT PRIMARY KEY,
  search_id       TEXT NOT NULL REFERENCES recruitment_search(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES organization(id),
  status          TEXT NOT NULL CHECK (status IN ('proposed', 'approved', 'researching', 'mapped', 'excluded')),
  tier_when_added TEXT,
  added_from      TEXT NOT NULL CHECK (added_from IN ('explorer', 'pool', 'manual')),
  added_at        TEXT NOT NULL,
  notes           TEXT NOT NULL DEFAULT '',
  UNIQUE (search_id, organization_id)
);

CREATE TABLE tier_override (
  context_key     TEXT NOT NULL,
  organization_id TEXT NOT NULL REFERENCES organization(id),
  tier            TEXT NOT NULL,
  reason          TEXT NOT NULL CHECK (length(trim(reason)) > 0),
  by_user         TEXT NOT NULL,
  at              TEXT NOT NULL,
  PRIMARY KEY (context_key, organization_id)
);

CREATE TABLE company_association (
  id              TEXT PRIMARY KEY,
  from_id         TEXT NOT NULL REFERENCES organization(id),
  to_id           TEXT NOT NULL REFERENCES organization(id),
  reason          TEXT NOT NULL CHECK (length(trim(reason)) > 0),
  author          TEXT NOT NULL,
  created_at      TEXT NOT NULL,
  CHECK (from_id <> to_id)
);

CREATE TABLE search_person (
  id              TEXT PRIMARY KEY,
  search_id       TEXT NOT NULL REFERENCES recruitment_search(id) ON DELETE CASCADE,
  person_id       TEXT NOT NULL REFERENCES person(id),
  organization_id TEXT REFERENCES organization(id),
  status          TEXT NOT NULL CHECK (status IN ('identified', 'approached', 'interested', 'not-interested', 'shortlisted', 'rejected')),
  assessment      TEXT NOT NULL DEFAULT '',
  added_at        TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  UNIQUE (search_id, person_id)
);

CREATE TABLE saved_target_pool (
  id              TEXT PRIMARY KEY,
  owner           TEXT NOT NULL,
  name            TEXT NOT NULL,
  mode            TEXT NOT NULL CHECK (mode IN ('snapshot', 'dynamic')),
  query_json      TEXT NOT NULL,
  search_id       TEXT REFERENCES recruitment_search(id) ON DELETE SET NULL,
  created_at      TEXT NOT NULL
);

CREATE TABLE saved_target_pool_member (
  pool_id         TEXT NOT NULL REFERENCES saved_target_pool(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES organization(id),
  tier            TEXT,
  PRIMARY KEY (pool_id, organization_id)
);

CREATE INDEX idx_org_industry_industry ON organization_industry(industry_id);
CREATE INDEX idx_org_capability_capability ON organization_capability(capability_id, status);
CREATE INDEX idx_employment_org ON employment(organization_id, is_current);
CREATE INDEX idx_target_org ON search_target_company(organization_id);
