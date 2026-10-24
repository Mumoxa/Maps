#!/usr/bin/env python3
"""Transfer the reviewed public Recruitment Agent snapshot; dry-run by default.

Original private files stay in .local/. This importer never opens the network,
executes archived instructions, or treats a supplied claim as fresh verification.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlparse

from import_mbawc import append_note, blank_organization, company_key, unique

ROOT = Path(__file__).resolve().parents[1]
BATCH = 'recruitment-agent-2026-10-24'
ARCHIVE = f'markets/organizations/import-sources/{BATCH}.json'
AUDIT = f'markets/organizations/import-audits/{BATCH}.json'
ARCHIVE_URL = f'https://github.com/Mumoxa/Maps/blob/main/{ARCHIVE}'


def read_json(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))


def read_jsonl(path):
    return [json.loads(line) for line in (ROOT / path).read_text(encoding='utf-8').splitlines() if line.strip()]


def serialize_jsonl(path, rows):
    # Keep untouched ledger records byte-for-byte instead of reformatting the
    # older compact records when appending a small research batch.
    original = {}
    for line in (ROOT / path).read_text(encoding='utf-8').splitlines():
        if line.strip():
            row = json.loads(line)
            original[row['id']] = (row, line)
    lines = []
    for row in rows:
        previous = original.get(row['id'])
        if previous and previous[0] == row:
            lines.append(previous[1])
        else:
            compact = not previous or previous[1].startswith('{"id":"')
            lines.append(json.dumps(row, ensure_ascii=False, separators=(',', ':') if compact else None))
    return '\n'.join(lines) + '\n'


def profile_key(value):
    parsed = urlparse(value or '')
    host = (parsed.hostname or '').lower()
    if parsed.scheme != 'https' or not (host == 'linkedin.com' or host.endswith('.linkedin.com')):
        return None
    if not re.fullmatch(r'/in/[^/]+/?', parsed.path):
        return None
    return parsed.path.rstrip('/').casefold()


def merge_duplicate(person, duplicate, evidence):
    if duplicate.get('merged_into') == person['id']:
        return
    person['record_merge_history'] = unique([*person.get('record_merge_history', []),
        {'id': duplicate['id'], 'evidence': evidence, 'record': copy.deepcopy(duplicate)}])
    for field, value in duplicate.items():
        if field in ('id', 'status', 'record_merge_history'):
            continue
        if isinstance(value, list):
            person[field] = unique([*(person.get(field) or []), *value])
        elif not person.get(field) and value:
            person[field] = copy.deepcopy(value)
    duplicate['status'] = 'REJECTED'
    duplicate['merged_into'] = person['id']
    duplicate['notes'] = append_note(duplicate.get('notes', ''),
        f'Recruitment Agent identity reconciliation: merged into {person["id"]}. {evidence}')


def build_outputs():
    archive = read_json(ARCHIVE)
    checked = archive['importedOn']
    source_hash = hashlib.sha256((ROOT / ARCHIVE).read_bytes()).hexdigest()
    prior = read_json(AUDIT) if (ROOT / AUDIT).exists() else None
    if prior and prior['sourceSha256'] != source_hash:
        raise ValueError('Published snapshot changed; supply a new reviewed batch instead')
    orgs = read_json('markets/organizations/organizations.json')
    by_org = {org['id']: org for org in orgs}
    taxonomy = {node['id'] for node in read_json('markets/organizations/taxonomy/sector-tree.json')}
    companies_audit = []
    for row in archive['companies']:
        if row['taxonomyNode'] not in taxonomy:
            raise ValueError(f'Unknown taxonomy node: {row["taxonomyNode"]}')
        org = by_org.get(row['organizationId'])
        if org is None:
            names = {company_key(row['name']), *(company_key(a) for a in row['aliases'])}
            collisions = [o['id'] for o in orgs if names & {company_key(o['name']), *(company_key(a) for a in o['aliases'])}]
            if collisions:
                raise ValueError(f'Review company identity before adding {row["name"]}: {collisions}')
            org = blank_organization(row['name'], row['organizationId'])
            orgs.append(org)
            by_org[org['id']] = org
        org['aliases'] = unique([*org['aliases'], *[n for n in [row['name'], *row['aliases']] if n != org['name']]])
        evidence = f'Archived Recruitment Agent research reports {row["activities"]}; location: {row["location"]}. External sources not rechecked during transfer.'
        source = {'url': ARCHIVE_URL, 'type': 'recruiter-supplied', 'evidence': evidence,
                  'checkedOn': checked, 'confidence': 'probable'}
        org['sources'] = unique([*org['sources'], source])
        org['datasets'] = unique([*org['datasets'], 'accounting-finance'])
        # A transfer is not a new verification event. Stronger existing facts and
        # classifications survive; new placements are explicitly source-reported.
        if not org.get('taxonomy') and not org['industries']:
            org['taxonomy'] = {'primaryNode': row['taxonomyNode'], 'secondaryNodes': [],
                'confidence': 'probable', 'evidence': evidence, 'sourceUrl': ARCHIVE_URL, 'checkedOn': checked}
        if not org['website']:
            org['website'] = next((u for u in row['sourceUrls'] if 'linkedin.com' not in (urlparse(u).hostname or '')), '')
        org['notes'] = append_note(org.get('notes', ''),
            f'Recruitment Agent 2026-10-23: {row["industry"]}; {row["activities"]}. Source-reported company context, not evidence of any employee skill. References: {"; ".join(row["sourceUrls"])}')
        companies_audit.append({'sourceRow': row['sourceRow'], 'sourceName': row['name'], 'organizationId': org['id']})

    people = read_jsonl('markets/accountants/people.jsonl')
    by_id = {p['id']: p for p in people}
    by_profile = {}
    for person in people:
        if person['status'] == 'REJECTED':
            continue
        for url in [person.get('linkedin_url'), *person.get('source_urls', [])]:
            key = profile_key(url)
            if key:
                by_profile.setdefault(key, set()).add(person['id'])
    next_id = max(int(p['id'].split('-')[1]) for p in people) + 1
    prior_people = {p['sourceRow']: p for p in prior['people']} if prior else {}
    people_audit = []
    for row in archive['people']:
        identity = profile_key(row['linkedinUrl'])
        if identity is None:
            raise ValueError(f'Invalid person-profile URL: row {row["sourceRow"]}')
        allowed = {i for i in [row['primaryId'], *row['mergeIds']] if i}
        previous = prior_people.get(row['sourceRow'])
        if previous:
            allowed.add(previous['personId'])
        unexpected = by_profile.get(identity, set()) - allowed
        if unexpected:
            raise ValueError(f'Unreviewed existing person identity at row {row["sourceRow"]}: {unexpected}')
        person = by_id.get(previous['personId'] if previous else row['primaryId'])
        added = person is None
        if added:
            person = {'id': f'acc-{next_id:04d}', 'full_name': row['name'], 'first_name': row['name'].split()[0],
                'surname': row['name'].split(' ', 1)[1], 'date_first_found': archive['sourceResearchThrough'],
                'date_last_verified': archive['sourceResearchThrough'], 'status': 'RESEARCH_HOLD', 'confidence': 'PROBABLE',
                'role_scope_status': 'IN_SCOPE', 'professional_designations': [], 'professional_bodies': [],
                'professionally_qualified': 'unknown', 'designation_status': 'UNCONFIRMED',
                'qualification_confidence': 'RESEARCH_HOLD', 'academic_qualifications': [],
                'articles_completion_status': 'NOT_ESTABLISHED', 'booleans': {}, 'notes': '',
                'source_urls': [], 'career_history': [], 'skills_confirmed': [],
                'accounting_systems_confirmed': [], 'erp_systems_confirmed': [], 'analytics_tools_confirmed': [],
                'estimated_years_experience': 'unknown'}
            next_id += 1
            people.append(person)
            by_id[person['id']] = person
        # Pin merges to the shared profile URL. A name/title match alone is insufficient.
        for duplicate_id in row['mergeIds']:
            duplicate = by_id[duplicate_id]
            keys = {profile_key(u) for u in [duplicate.get('linkedin_url'), *duplicate.get('source_urls', [])]}
            if identity not in keys:
                raise ValueError(f'Merge identity changed: {duplicate_id}')
            merge_duplicate(person, duplicate, 'Same canonical LinkedIn /in/ identity in source URLs and supplied research.')
        if not any(s.get('batch') == BATCH for s in person.get('source_records', [])):
            if not added:
                person['pre_recruitment_agent_record'] = copy.deepcopy(person)
            person['source_records'] = [*person.get('source_records', []),
                {'batch': BATCH, 'file': 'production-01-candidates.csv', 'sheet': 'Production candidates', 'row': row['sourceRow'],
                 'public_fields': row, 'evidence_state': archive['evidenceState']}]
        for source_record in person.get('source_records', []):
            if source_record.get('batch') == BATCH:
                source_record.setdefault('sheet', 'Production candidates')
        baseline = person.get('pre_recruitment_agent_record') or {}
        previous_employer = baseline.get('current_employer') or ''
        person['current_employer'] = previous_employer if company_key(previous_employer) == company_key(row['employer']) else row['employer']
        person['current_title'] = row['title']
        person['current_role_family'] = 'Financial Management'
        person['current_function'] = 'Finance'
        person['seniority'] = 'Head / Director' if 'Head of' in row['title'] else 'Manager'
        person['current_industry'] = row['industry']
        if baseline.get('location_confidence') == 'CONFIRMED':
            for field in ('city', 'province', 'country', 'location_confidence'):
                person[field] = baseline.get(field)
        else:
            person['city'], person['province'] = [s.strip() for s in row['location'].split(',', 1)]
            person['country'] = 'South Africa'
            person['location_confidence'] = 'PROBABLE'
        person['linkedin_url'] = f'https://www.linkedin.com{identity}'
        person['primary_source'] = person.get('primary_source') or person['linkedin_url']
        person['source_urls'] = unique([u for u in [*person['source_urls'], *row['sourceUrls'], ARCHIVE_URL] if u])
        person['qualification_evidence'] = append_note(person.get('qualification_evidence', ''),
            f'Recruitment Agent source-reported qualification: {row["qualificationClaim"]}. Claim not independently reverified during transfer; active SAICA membership not confirmed.')
        if row['caReported']:
            person['professional_designations'] = unique([*person.get('professional_designations', []), 'CA(SA)'])
            person['professional_bodies'] = unique([*person.get('professional_bodies', []), 'SAICA'])
            person['professionally_qualified'] = 'true'
            person['booleans']['ca_sa'] = 'true'
            if person.get('designation_status') not in ('CONFIRMED', 'HIGH_CONFIDENCE'):
                person['designation_status'] = 'PROBABLE'
                person['qualification_confidence'] = 'PROBABLE'
        else:
            # Do not overwrite stronger pre-existing designation evidence with an unknown claim.
            if not person.get('professional_designations'):
                person['professionally_qualified'] = 'unknown'
                person['designation_status'] = 'UNCONFIRMED'
                person['booleans']['ca_sa'] = 'unknown'
        person['notes'] = append_note(person.get('notes', ''),
            f'{archive["cohort"]}. {row["careerEvidence"]} Source-reported role and career claims; no fresh external verification, live membership, remuneration or availability established by this transfer.')
        attrs = person['attributes'] = person.get('attributes') or {}
        attrs['source_cohorts'] = unique([*attrs.get('source_cohorts', []), archive['cohort']])
        attrs.setdefault('source_batch', BATCH)
        attrs['source_reported'] = True
        item = {'sourceRow': row['sourceRow'], 'name': row['name'], 'personId': person['id'],
            'organizationId': row['organizationId'], 'disposition': 'added' if added else 'enriched', 'mergedIds': row['mergeIds']}
        people_audit.append(previous or item)
        by_profile.setdefault(identity, set()).add(person['id'])

    companies = read_jsonl('markets/accountants/companies.jsonl')
    next_company = max(int(c['id'].split('-')[1]) for c in companies) + 1
    for row in archive['companies']:
        names = {company_key(n) for n in [row['name'], *row['aliases'], by_org[row['organizationId']]['name']]}
        matches = [c for c in companies if c.get('organization_id') == row['organizationId'] or
            names & {company_key(n) for n in [c['company_name'], *c.get('company_aliases', [])]}]
        if len(matches) > 1:
            raise ValueError(f'Ambiguous research company: {row["name"]}')
        company = matches[0] if matches else None
        if company is None:
            company = {'id': f'cmp-{next_company:04d}', 'company_name': row['name'], 'company_aliases': [],
                'website': by_org[row['organizationId']]['website'], 'industry': row['industry'],
                'sub_industry': None, 'headquarters': '', 'south_africa_locations': [],
                'company_size_if_public': None, 'listed_or_private': 'unknown', 'parent_company': None,
                'finance_team_research_status': 'NEEDS_RESEARCH', 'finance_people_verified_count': 0,
                'finance_team_research_notes': '', 'source_urls': [], 'date_verified': ''}
            next_company += 1
            companies.append(company)
        company['organization_id'] = row['organizationId']
        company['company_aliases'] = unique([*company.get('company_aliases', []), row['name'], *row['aliases']])
        company['source_urls'] = unique([*company.get('source_urls', []), *row['sourceUrls'], ARCHIVE_URL])
        company['source_reported_finance_person_ids'] = unique([*company.get('source_reported_finance_person_ids', []),
            *[p['personId'] for p in people_audit if p['organizationId'] == row['organizationId']]])
        company['finance_team_research_notes'] = append_note(company.get('finance_team_research_notes', ''),
            f'Recruitment Agent source-reported context: {row["activities"]}. Research completeness: {row["researchCompleteness"]}; references retained without fresh verification. No globally applied recruitment exclusions.')

    sources = read_jsonl('markets/accountants/sources.jsonl')
    next_source = max(int(s['id'].split('-')[1]) for s in sources) + 1
    existing = {(s.get('source_batch'), s.get('person_id')) for s in sources}
    for person in people_audit:
        if (BATCH, person['personId']) in existing:
            continue
        sources.append({'id': f'src-{next_source:04d}', 'url': ARCHIVE_URL, 'source_type': 'Other',
            'source_batch': BATCH, 'source_row': person['sourceRow'], 'person_id': person['personId'],
            'company_id': None, 'evidence_type': 'Recruitment Agent archived public research',
            'evidence_summary': archive['evidenceState'], 'qualification_supported': None,
            'employment_supported': None, 'accessed_date': checked, 'reliability': 'MODERATE', 'status': 'REVIEWING'})
        next_source += 1
    audit = {'batch': BATCH, 'sourceArchive': ARCHIVE, 'sourceSha256': source_hash,
        'importedOn': checked, 'evidenceState': archive['evidenceState'],
        'sourceCandidateRows': archive['sourceCandidateRows'], 'sourceClaimedCandidateCount': archive['sourceClaimedCandidateCount'],
        'repairs': archive['repairs'], 'companies': companies_audit, 'people': people_audit}
    outputs = {'markets/organizations/organizations.json': json.dumps(orgs, ensure_ascii=False, indent=2) + '\n',
               AUDIT: json.dumps(audit, ensure_ascii=False, indent=2) + '\n'}
    for path, payload in [('markets/accountants/people.jsonl', people), ('markets/accountants/companies.jsonl', companies),
                          ('markets/accountants/sources.jsonl', sources)]:
        outputs[path] = serialize_jsonl(path, payload)
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--commit', action='store_true', help='Write reviewed outputs instead of dry-run')
    args = parser.parse_args()
    outputs = build_outputs()
    changed = [path for path, value in outputs.items() if not (ROOT / path).exists() or (ROOT / path).read_text(encoding='utf-8') != value]
    if args.commit:
        for path in changed:
            (ROOT / path).parent.mkdir(parents=True, exist_ok=True)
            (ROOT / path).write_text(outputs[path], encoding='utf-8', newline='\n')
    print(('Updated' if args.commit else 'Would update') + ': ' + ', '.join(changed) if changed else 'No changes')


if __name__ == '__main__':
    main()
