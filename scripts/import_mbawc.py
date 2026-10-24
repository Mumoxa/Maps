#!/usr/bin/env python3
"""Import the archived MBAWC workbook; dry-run by default, --commit to write.

Uses the reviewed mapping next to the archive. Document prose is retained as
evidence, never executed as instructions. No network access is performed.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

import build_contact_directory as contact_tools

ROOT = Path(__file__).resolve().parents[1]
BATCH = 'mbawc-2026-10-22'
SOURCE_FILE = 'MBAWC_Members (2).xlsx'
CHECKED = '2026-10-23'
DIRECTORY = 'https://mbawc.org.za/members'
ARCHIVE_PATH = f'markets/organizations/import-sources/{BATCH}.json'
WORKBOOK_PATH = f'markets/organizations/import-sources/{BATCH}.xlsx'
WORKBOOK_URL = f'https://github.com/Mumoxa/Maps/blob/main/{WORKBOOK_PATH}'
AUDIT_PATH = f'markets/organizations/import-audits/{BATCH}.json'


def load_json(path):
    return json.loads((ROOT / path).read_text())


def load_jsonl(path):
    return [json.loads(line) for line in (ROOT / path).read_text().splitlines() if line.strip()]


def unique(values):
    result, seen = [], set()
    for value in values:
        key = json.dumps(value, ensure_ascii=False, sort_keys=True)
        if key not in seen:
            result.append(value)
            seen.add(key)
    return result


def text(value):
    return '' if value is None else str(value).strip()


def company_key(value):
    # Conservative legal suffix comparison only, never fuzzy name matching.
    value = re.sub(r'\s+', ' ', text(value)).casefold()
    return re.sub(r'(?:\s*\((?:pty|rf)\))?\s*(?:ltd|limited|cc)\.?$', '', value).strip()


def url(value):
    value = text(value)
    if not value:
        return ''
    if not re.match(r'^https?://', value, re.I):
        value = 'https://' + value
    parsed = urlparse(value)
    if not parsed.hostname or '.' not in parsed.hostname or parsed.username:
        return ''
    return value


def sheet_rows(archive, name):
    sheet = next(s for s in archive['sheets'] if s['name'] == name)
    headers = sheet['rows'][0]['values']
    return [(r['row'], dict(zip(headers, r['values']))) for r in sheet['rows'][1:]
            if any(v is not None for v in r['values'])]


def blank_organization(name, identity):
    return {'id': identity, 'name': name, 'legalName': '', 'aliases': [], 'website': '',
            'status': 'needs-verification', 'industries': [], 'capabilities': [],
            'locations': [], 'scale': [], 'parentId': None, 'sources': [],
            'datasets': [], 'lastVerified': '', 'notes': ''}


def append_note(existing, note):
    return existing if note in (existing or '') else '\n'.join(filter(None, [existing, note]))


def import_companies(archive, config, organizations):
    by_id = {o['id']: o for o in organizations}
    for merge in config.get('organizationMerges', []):
        duplicate = by_id.get(merge['fromId'])
        target = by_id.get(merge['toId'])
        if duplicate and target:
            if company_key(duplicate['name']) != company_key(target['name']):
                raise ValueError('Reviewed source-company merge no longer matches expected identity')
            for field in ['aliases', 'industries', 'capabilities', 'locations', 'scale', 'sources', 'datasets', 'directoryEntries']:
                target[field] = unique([*target.get(field, []), *duplicate.get(field, [])])
            organizations.remove(duplicate)
            del by_id[duplicate['id']]
    by_name = {}
    for o in organizations:
        for name in [o['name'], o.get('legalName', ''), *o['aliases']]:
            if name:
                by_name.setdefault(company_key(name), set()).add(o['id'])
    taxonomy = {n['id']: n for n in load_json('markets/organizations/taxonomy/sector-tree.json')}
    locations = {text(row['#']): row for _, row in sheet_rows(archive, 'Locations')}
    members = []
    private_fields = {'Contact Person', 'Telephone', 'Cellphone', 'Fax', 'Email'}
    for row_number, row in sheet_rows(archive, 'MBAWC Members'):
        key, name, legal = text(row['#']), text(row['Company Name (Trading As)']), text(row['Registered As'])
        resolution = config['organizationResolutions'].get(key)
        identity = resolution['organizationId'] if resolution else f'org-mbawc-{key.zfill(3)}'
        org = by_id.get(identity)
        if org is None:
            org = blank_organization(name, identity)
            organizations.append(org)
            by_id[identity] = org
        if not org['legalName'] and legal and not (by_name.get(company_key(legal), set()) - {identity}):
            org['legalName'] = legal
        for alias in [name, legal]:
            if alias and alias != org['name'] and not (by_name.get(company_key(alias), set()) - {identity}):
                org['aliases'] = unique([*org['aliases'], alias])
        if not org['website']:
            org['website'] = url(row['Website'])
        source_url = url(row['Certificate URL']) or DIRECTORY
        fields = {k: text(v) for k, v in row.items() if k not in private_fields and k != '#' and v is not None}
        location = locations[key]
        for field in ['Location (Operating Area)', 'Province (from postal code)', 'Postal Code Used']:
            if location.get(field):
                fields[f'Workbook {field} (inferred)'] = text(location[field])
        note = ('Directory values are source-reported in the supplied workbook as of 2026-10-22; '
                'live membership and registration were not independently rechecked. The Locations sheet '
                'infers provinces from postal codes and national reach from company/category heuristics; '
                'these are not verified operating footprints, employee locations or company scale. '
                'Personal contact details are retained in Contacts and omitted from these company facts.')
        entry = {'directory': 'MBAWC', 'recordKey': key, 'sourceUrl': source_url,
                 'checkedOn': CHECKED, 'fields': fields, 'notes': note}
        org['directoryEntries'] = [e for e in org.get('directoryEntries', [])
                                   if not (e['directory'] == 'MBAWC' and e['recordKey'] == key)] + [entry]
        categories = [c.strip() for c in text(row['Categories']).split(';') if c.strip()]
        nodes = unique(config['categoryTaxonomy'][c] for c in categories)
        if any(node not in taxonomy for node in nodes):
            raise ValueError(f'Unknown taxonomy node for workbook row {row_number}')
        if nodes and not org.get('taxonomy') and not org['industries']:
            org['taxonomy'] = {'primaryNode': nodes[0], 'secondaryNodes': nodes[1:],
                               'confidence': 'probable', 'evidence': 'Workbook MBAWC categories: ' + '; '.join(categories),
                               'sourceUrl': source_url, 'checkedOn': CHECKED}
        # Only the explicit member sheet city/province goes into sourced locations.
        # Postal-derived province and national heuristics remain separately labelled.
        if row['City'] or row['Province']:
            org['locations'] = unique([*org['locations'], {'city': text(row['City']),
                                        'province': text(row['Province']), 'sourceUrl': source_url, 'checkedOn': CHECKED}])
        org['sources'] = unique([*org['sources'], {'url': source_url, 'type': 'industry-directory',
                                'evidence': f'Workbook MBAWC Members row {row_number}, member {key}: sourced identity, directory fields and listed categories; not an independent live check.',
                                'checkedOn': CHECKED, 'confidence': 'probable'},
                               {'url': WORKBOOK_URL, 'type': 'internal-dataset', 'evidence': f'{SOURCE_FILE}, MBAWC Members row {row_number}; complete cell archive retained.',
                                'checkedOn': CHECKED, 'confidence': 'probable'}])
        org['datasets'] = unique([*org['datasets'], 'mbawc-members', 'contacts'])
        org['notes'] = org['notes'].replace('Personal contact details are retained in the private Contacts directory.',
                                          'Personal contact details are retained in Contacts and omitted from these company facts.')
        org['notes'] = append_note(org['notes'], 'MBAWC source cohort, 2026-10-22. ' + note)
        members.append({'sourceRow': row_number, 'sourceKey': key, 'organizationId': identity,
                        'identityEvidence': resolution['evidence'] if resolution else 'New source-specific identity; no corroborated curated duplicate.',
                        'classificationGap': '' if nodes else 'No categories supplied; business activity not established'})
    return members, by_id


def contact_identity(contact, name, company, emails, phones):
    if contact_tools.normalise(contact['name']) != contact_tools.normalise(name):
        return False
    same_company = any(company_key(p['company']) == company_key(company) for p in contact['positions'])
    shared_email = {e['address'].lower() for e in contact['emails']} & {e['address'].lower() for e in emails}
    shared_phone = {re.sub(r'\D', '', p['number']) for p in contact['phones']} & {re.sub(r'\D', '', p['number']) for p in phones}
    return same_company or bool(shared_email or shared_phone)


def import_contacts(archive, members, organizations, contacts):
    by_source = {(s['file'], s['sheet'], s['row']): c for c in contacts for s in c['sourceRecords']}
    by_name = {}
    for c in contacts:
        by_name.setdefault(contact_tools.normalise(c['name']), []).append(c)
    ids = {c['id'] for c in contacts}
    merged = []
    for member, (row_number, row) in zip(members, sheet_rows(archive, 'MBAWC Members')):
        name = text(row['Contact Person'])
        source_key = (SOURCE_FILE, 'MBAWC Members', row_number)
        existing = by_source.get(source_key)
        if existing:
            member['contactId'] = existing['id']
            continue
        company = organizations[member['organizationId']]['name']
        record = contact_tools.base_record(name, SOURCE_FILE, 'MBAWC Members', row_number)
        record['positions'].append(contact_tools.make_position(company=company, sector=text(row['Categories']),
                                  website=text(row['Website']), company_country=text(row['Country']), company_city=text(row['City'])))
        # Directory email/telephone may be a shared company channel; no claim that
        # the named contact personally owns it is made.
        record['emails'] = contact_tools.email_entries(row['Email'], 'Source-reported directory channel; personal ownership unverified', 'company directory')
        for field, kind in [('Telephone', 'company telephone'), ('Cellphone', 'directory cellphone'), ('Fax', 'company fax')]:
            record['phones'].extend(contact_tools.phone_entries(row[field], kind))
        record['locations'] = unique([text(v) for v in [row['Street Address'], row['City'], row['Province']] if v])
        record['tags'] = ['MBAWC', 'MBAWC 2026-10-22', 'Directory contact; finance role not established']
        record['remarks'] = ['MBAWC member directory contact; no CA(SA) qualification or finance role is implied.',
                             'Source member row (all original fields): ' + json.dumps(row, ensure_ascii=False, sort_keys=True)]
        record['datesAdded'] = [CHECKED]
        candidates = [c for c in by_name.get(contact_tools.normalise(name), [])
                      if contact_identity(c, name, company, record['emails'], record['phones'])]
        if len(candidates) > 1:
            raise ValueError(f'Ambiguous contact identity at member row {row_number}')
        if candidates:
            target = candidates[0]
            identity = target['id']
            updated = contact_tools.merge_group([target, record])
            updated['id'] = identity
            target.clear()
            target.update(updated)
            merged.append({'sourceRow': row_number, 'contactId': identity, 'evidence': 'Matching normalized name plus the same employer or shared contact channel.'})
        else:
            target = contact_tools.merge_group([record])
            slug = re.sub(r'[^a-z0-9]+', '-', contact_tools.normalise(name)).strip('-') or 'directory-contact'
            identity = slug if slug not in ids else f'{slug}-mbawc-{row_number}'
            target['id'] = identity
            contacts.append(target)
            by_name.setdefault(contact_tools.normalise(name), []).append(target)
            ids.add(identity)
        by_source[source_key] = target
        member['contactId'] = identity
    return merged


def merge_person(target, duplicate, evidence):
    if duplicate.get('merged_into') == target['id']:
        return
    target['record_merge_history'] = unique([*target.get('record_merge_history', []),
                                            {'id': duplicate['id'], 'evidence': evidence, 'record': copy.deepcopy(duplicate)}])
    for field, value in duplicate.items():
        if field in ('id', 'status', 'record_merge_history'):
            continue
        if isinstance(value, list):
            target[field] = unique([*(target.get(field) or []), *value])
        elif not target.get(field) and value:
            target[field] = copy.deepcopy(value)
    duplicate['status'] = 'REJECTED'
    duplicate['merged_into'] = target['id']
    duplicate['notes'] = append_note(duplicate.get('notes', ''), f'MBAWC identity reconciliation: merged into {target["id"]}; original record retained for audit. {evidence}')


def import_people(archive, config, people):
    by_id = {p['id']: p for p in people}
    by_source = {(s['file'], s['sheet'], s['row']): p for p in people if p.get('status') != 'REJECTED'
                 for s in p.get('source_records', [])}
    next_id = max(int(p['id'].split('-')[1]) for p in people) + 1
    rows = dict(sheet_rows(archive, 'Financial Leadership'))
    result = []
    for mapping in config['people']:
        row_number = mapping['sourceRow']
        row = rows[row_number]
        evidence = '; '.join(mapping['identityEvidence']) if isinstance(mapping['identityEvidence'], list) else mapping['identityEvidence']
        source_key = (SOURCE_FILE, 'Financial Leadership', row_number)
        person = by_source.get(source_key) or by_id.get(mapping['primaryId'])
        new = person is None
        if new:
            person = {'id': f'acc-{next_id:04d}', 'date_first_found': CHECKED, 'date_last_verified': CHECKED,
                      'status': 'RESEARCH_HOLD', 'confidence': 'PROBABLE', 'first_name': text(row['First Name(s)']),
                      'surname': text(row['Surname']), 'full_name': mapping['sourceName'], 'alternate_names': [],
                      'professionally_qualified': 'unknown', 'professional_designations': [], 'professional_bodies': [],
                      'designation_status': 'UNCONFIRMED', 'qualification_confidence': 'RESEARCH_HOLD',
                      'qualification_evidence': '', 'academic_qualifications': [], 'current_company_affiliations': [],
                      'articles_completion_status': 'NOT_ESTABLISHED', 'articles_body': None, 'articles_employer': None,
                      'articles_period': None, 'articles_location': None, 'practical_experience_framework': None,
                      'qualification_route': None, 'skills_confirmed': [], 'accounting_systems_confirmed': [],
                      'erp_systems_confirmed': [], 'analytics_tools_confirmed': [], 'career_history': [],
                      'estimated_years_experience': 'unknown', 'linkedin_url': None, 'source_urls': [],
                      'primary_source': WORKBOOK_URL, 'notes': '', 'booleans': {}}
            next_id += 1
            people.append(person)
            by_id[person['id']] = person
        for duplicate_id in mapping['mergeIds']:
            merge_person(person, by_id[duplicate_id], evidence)
        # The original source fields and conflicting pre-existing claims are
        # retained; scalar updates never erase the source snapshot.
        if not any(s.get('file') == SOURCE_FILE and s.get('row') == row_number for s in person.get('source_records', [])):
            person['pre_mbawc_record'] = copy.deepcopy(person)
        person['source_records'] = unique([*person.get('source_records', []),
                                          {'file': SOURCE_FILE, 'sheet': 'Financial Leadership', 'row': row_number,
                                           'fields': row, 'evidence_state': 'workbook-reported; not independently reverified'}])
        person['alternate_names'] = unique([*person.get('alternate_names', []), *mapping['alternateNames'], mapping['sourceName']])
        if not mapping['preserveExistingCurrentRole']:
            person['current_employer'] = mapping['currentEmployer']
            person['current_title'] = mapping['currentTitle']
        person['current_role_family'] = person.get('current_role_family') or ('Board / Governance' if not mapping['currentEmployer'] else 'Finance')
        person['current_function'] = person.get('current_function') or person['current_role_family']
        person['role_scope_status'] = person.get('role_scope_status') or ('NON_FINANCE' if not mapping['currentEmployer'] else 'IN_SCOPE')
        person['seniority'] = person.get('seniority') or ('Executive' if re.search(r'chief|cfo|chairman', mapping['currentTitle'], re.I) else 'Head / Director' if re.search(r'director|head|secretary', mapping['currentTitle'], re.I) else 'Manager')
        person['academic_qualifications'] = unique([*person.get('academic_qualifications', []), *mapping['academicQualifications']])
        if mapping['designationConfirmed']:
            person['professional_designations'] = unique([*person.get('professional_designations', []), 'CA(SA)', *mapping.get('additionalDesignations', [])])
            person['professional_bodies'] = unique([*person.get('professional_bodies', []), 'SAICA'])
            person['professionally_qualified'] = 'true'
            if person.get('designation_status') not in ('CONFIRMED', 'HIGH_CONFIDENCE'):
                person['designation_status'] = 'PROBABLE'
            person['booleans']['ca_sa'] = 'true'
        else:
            # Conflicting/unconfirmed qualifications cannot pass the CA filter.
            person['professional_designations'] = [d for d in person.get('professional_designations', []) if d != 'CA(SA)']
            person['professional_bodies'] = [b for b in person.get('professional_bodies', []) if b != 'SAICA']
            person['professionally_qualified'] = 'unknown'
            person['designation_status'] = 'CONFLICTING' if mapping.get('designationConflict') else 'UNCONFIRMED'
            person['qualification_confidence'] = 'RESEARCH_HOLD'
            person['booleans']['ca_sa'] = 'unknown'
            person['status'] = 'RESEARCH_HOLD'
        qualification = ('MBAWC workbook reports ' + text(row['CA(SA) Verified?']) + '. '
                         + text(row['Source / Notes']) + ' Source-reported; live qualification/membership not independently checked.')
        person['qualification_evidence'] = append_note(person.get('qualification_evidence', ''), qualification)
        if not mapping['preserveExistingCurrentRole']:
            location = mapping.get('personLocation') or {}
            baseline = person.get('pre_mbawc_record', {})
            # Location map contains person-specific notes only, not company WC HQ.
            if location.get('country'):
                if baseline.get('location_confidence') == 'CONFIRMED':
                    # A workbook claim cannot downgrade individually sourced
                    # geography. The complete new location claim remains in source_records.
                    for field in ('country', 'province', 'city', 'location_confidence'):
                        person[field] = baseline.get(field)
                else:
                    person.update({k: location.get(k) for k in ('country', 'province', 'city')})
                    person['location_confidence'] = 'PROBABLE'
            else:
                for field in ('country', 'province', 'city'):
                    person[field] = baseline.get(field) or ('' if field == 'country' else None)
                person['location_confidence'] = baseline.get('location_confidence') or 'UNCONFIRMED'
        person['current_industry'] = person.get('current_industry') or ''
        articles = mapping.get('articles') or {}
        if articles.get('employer') and not person.get('articles_employer'):
            person['articles_employer'] = articles['employer']
            person['articles_period'] = articles.get('period')
            person['qualification_route'] = append_note(person.get('qualification_route', ''),
                f'Workbook reports articles at {articles["employer"]}; completion and professional training body not independently verified.')
        for affiliation in mapping['affiliations']:
            company = affiliation['company']
            item = {'company': company, 'relationship': affiliation['relationship'],
                    'evidence_url': WORKBOOK_URL, 'employment': affiliation.get('employment', False),
                    'current': True}
            person['current_company_affiliations'] = unique([*person.get('current_company_affiliations', []), item])
        person['career_history'] = unique([*person.get('career_history', []), *mapping['careerHistory']])
        person['source_urls'] = unique([s for s in [*person.get('source_urls', []), *mapping['sourceUrls'], WORKBOOK_URL] if s])
        workbook_link = url(row['LinkedIn Profile'])
        if workbook_link and not person.get('linkedin_url'):
            person['linkedin_url'] = contact_tools.normalise_url(workbook_link)
        person['notes'] = append_note(person.get('notes', ''), 'MBAWC 2026-10-22. ' + text(row['Source / Notes'])
                                      + ' ' + ' '.join(mapping['confidenceCaveats'])
                                      + ' Workbook member-company location is not evidence of personal residence.')
        attrs = person.setdefault('attributes', {})
        attrs['source_cohorts'] = unique([*attrs.get('source_cohorts', []), config['cohort']])
        attrs['source_batch'] = BATCH
        attrs['source_reported'] = True
        result.append({'sourceRow': row_number, 'personId': person['id'], 'mergedIds': mapping['mergeIds'],
                       'identityEvidence': evidence, 'caStatus': 'reported' if mapping['designationConfirmed'] else 'unconfirmed',
                       'caveats': mapping['confidenceCaveats']})
    return result


def link_people_companies(config, people_audit, people, organizations):
    by_id = {o['id']: o for o in organizations}
    by_name = {}
    for org in organizations:
        for name in [org['name'], org.get('legalName', ''), *org['aliases']]:
            if name:
                by_name.setdefault(company_key(name), org)
    links = []
    by_person = {p['id']: p for p in people}
    for mapping, record in zip(config['people'], people_audit):
        person = by_person[record['personId']]
        names = unique([person.get('current_employer', ''), *[a['company'] for a in mapping['affiliations']]])
        record['companyLinks'] = []
        for name in names:
            if not name:
                continue
            configured = config.get('companyLinkResolutions', {}).get(name)
            org = by_id.get(configured) if configured else by_name.get(company_key(name))
            if org is None:
                identity = 'org-mbawc-related-' + hashlib.sha256(company_key(name).encode()).hexdigest()[:12]
                org = blank_organization(name, identity)
                org['notes'] = 'Company/group name reported in the supplied MBAWC finance notes; exact legal identity and business activity require review. No ownership, employment, size or operating capabilities inferred.'
                organizations.append(org)
                by_id[identity] = org
            if company_key(name) != company_key(org['name']):
                org['aliases'] = unique([*org['aliases'], name])
            by_name[company_key(name)] = org
            org['datasets'] = unique([*org['datasets'], 'accounting-finance', 'mbawc-financial-leadership'])
            org['sources'] = unique([*org['sources'], {'url': WORKBOOK_URL, 'type': 'internal-dataset',
                                    'evidence': f'Workbook Financial Leadership row {mapping["sourceRow"]} names this company/group; reported role/affiliation is distinct from verified employment or corporate ownership.',
                                    'checkedOn': CHECKED, 'confidence': 'probable'}])
            record['companyLinks'].append(org['id'])
            links.append(org['id'])
    return unique(links)


def import_reference_contacts(config, members, organizations, contacts):
    by_member = {m['sourceKey']: m for m in members}
    ids = {c['id'] for c in contacts}
    result = []
    for ref in config['noteOnlyPeople']:
        name = ref['name']
        existing = [c for c in contacts if any(s['file'] == SOURCE_FILE and s['sheet'] == 'README' and s['row'] == 26
                                             for s in c['sourceRecords']) and contact_tools.normalise(c['name']) == contact_tools.normalise(name)]
        if existing:
            result.append({'name': name, 'contactId': existing[0]['id'], 'disposition': ref['disposition']})
            continue
        member = by_member.get(ref.get('memberSourceKey'))
        company = organizations[member['organizationId']]['name'] if member else ref['company']
        record = contact_tools.base_record(name, SOURCE_FILE, 'README', 26)
        record['positions'] = [contact_tools.make_position(company=company)]
        record['tags'] = ['MBAWC', 'MBAWC 2026-10-22', 'Reference only; identity and qualification need verification']
        record['remarks'] = [ref['claim'], ref['disposition'], 'Source: ' + ref['source']]
        record['datesAdded'] = [CHECKED]
        matches = [c for c in contacts if contact_identity(c, name, company, [], [])]
        if len(matches) > 1:
            raise ValueError('Ambiguous reference contact: ' + name)
        if matches:
            target = matches[0]
            identity = target['id']
            updated = contact_tools.merge_group([target, record])
            updated['id'] = identity
            target.clear()
            target.update(updated)
        else:
            target = contact_tools.merge_group([record])
            slug = re.sub(r'[^a-z0-9]+', '-', contact_tools.normalise(name)).strip('-')
            identity = slug if slug not in ids else slug + '-mbawc-reference'
            target['id'] = identity
            contacts.append(target)
            ids.add(identity)
        result.append({'name': name, 'contactId': target['id'], 'disposition': ref['disposition']})
    return result


def research_companies(members, archive, organizations, people_audit, people, companies):
    by_key = {}
    for c in companies:
        for name in [c['company_name'], *c.get('company_aliases', [])]:
            by_key.setdefault(company_key(name), []).append(c)
    next_id = max(int(c['id'].split('-')[1]) for c in companies) + 1
    by_source_row = {p['sourceRow']: p for p in people_audit}
    finance_by_company = {}
    for number, row in sheet_rows(archive, 'Financial Leadership'):
        finance_by_company.setdefault(text(row['Company Name']), []).append(by_source_row[number])
    for member, (_, row) in zip(members, sheet_rows(archive, 'MBAWC Members')):
        org = organizations[member['organizationId']]
        hits = unique(c for name in [org['name'], org['legalName'], *org['aliases']] if name
                      for c in by_key.get(company_key(name), []))
        if len(hits) > 1:
            # Distinct existing research entities are retained; source links use
            # the earliest exact canonical-name match rather than merging them.
            hits = [c for c in hits if company_key(c['company_name']) == company_key(org['name'])] or hits[:1]
        company = hits[0] if hits else None
        if company is None:
            company = {'id': f'cmp-{next_id:04d}', 'company_name': org['name'], 'company_aliases': [],
                       'website': org['website'], 'industry': '', 'sub_industry': None,
                       'headquarters': '', 'south_africa_locations': [], 'company_size_if_public': None,
                       'listed_or_private': 'unknown', 'parent_company': None,
                       'finance_team_research_status': 'NEEDS_RESEARCH', 'finance_people_verified_count': 0,
                       'finance_team_research_notes': '', 'source_urls': [], 'date_verified': CHECKED}
            next_id += 1
            companies.append(company)
            by_key.setdefault(company_key(org['name']), []).append(company)
        company['organization_id'] = org['id']
        company['company_aliases'] = unique([*company.get('company_aliases', []), text(row['Company Name (Trading As)']), text(row['Registered As'])])
        company['source_urls'] = unique([*company.get('source_urls', []), WORKBOOK_URL])
        finance = finance_by_company.get(text(row['Company Name (Trading As)']), [])
        member['financePersonIds'] = [p['personId'] for p in finance]
        company['source_reported_finance_person_ids'] = unique([*company.get('source_reported_finance_person_ids', []), *member['financePersonIds']])
        company['finance_team_research_notes'] = append_note(company.get('finance_team_research_notes', ''),
            f'MBAWC workbook row {member["sourceRow"]}; {len(finance)} named finance/board records supplied. Absence is not evidence of no finance team. Workbook claims await independent review.')
        member['researchCompanyId'] = company['id']


def build_outputs(archive, config):
    organizations = load_json('markets/organizations/organizations.json')
    members, organizations_by_id = import_companies(archive, config, organizations)
    contacts = [c for p in sorted((ROOT / 'src/data/contact-parts').glob('contacts-*.json')) for c in json.loads(p.read_text())]
    contact_merges = import_contacts(archive, members, organizations_by_id, contacts)
    people = load_jsonl('markets/accountants/people.jsonl')
    people_audit = import_people(archive, config, people)
    linked_companies = link_people_companies(config, people_audit, people, organizations)
    reference_people = import_reference_contacts(config, members, organizations_by_id, contacts)
    companies = load_jsonl('markets/accountants/companies.jsonl')
    research_companies(members, archive, organizations_by_id, people_audit, people, companies)
    source_records = [s for c in contacts for s in c['sourceRecords']]
    audit = contact_tools.validate(source_records, contacts)
    old_audit = load_json('contacts.audit.json')
    audit['sourcePersonRows'] = dict(Counter(s['file'] for s in source_records))
    audit['ignoredSheets'] = old_audit.get('ignoredSheets', [])
    outputs = {'markets/organizations/organizations.json': organizations,
               'contacts.audit.json': audit}
    parts = []
    for offset in range(0, len(contacts), 400):
        name = f'contacts-{offset // 400 + 1:03d}.json'
        parts.append(name)
        outputs[f'src/data/contact-parts/{name}'] = contacts[offset:offset + 400]
    outputs[AUDIT_PATH] = {'batch': BATCH, 'sourceWorkbook': WORKBOOK_PATH, 'sourceArchive': ARCHIVE_PATH,
                          'sourceSha256': archive['sha256'], 'sourceReportedDate': archive['sourceReportedDate'],
                          'importedOn': CHECKED, 'evidenceState': 'workbook-reported; qualification, live membership, locations and roles not independently reverified',
                          'members': members, 'people': people_audit,
                          'companyMerges': config.get('organizationMerges', []),
                          'linkedFinanceCompanies': linked_companies,
                          'referencePeople': reference_people,
                          'contactMerges': contact_merges,
                          'noteOnlyPeople': config['noteOnlyPeople']}
    # Stable audit on an already-applied source; do not lose original merge facts.
    if (ROOT / AUDIT_PATH).exists():
        previous = load_json(AUDIT_PATH)
        outputs[AUDIT_PATH]['contactMerges'] = unique([*previous.get('contactMerges', []), *contact_merges])
    text_outputs = {}
    for path, payload in outputs.items():
        compact = path.startswith('src/data/contact-parts/')
        text_outputs[path] = json.dumps(payload, ensure_ascii=False, indent=None if compact else 2,
                                        separators=(',', ':') if compact else None) + ('' if compact else '\n')
    text_outputs['src/data/contact-parts/index.ts'] = '\n'.join(
        [*[f"import part{i:03d} from './{name}'" for i, name in enumerate(parts, 1)], '',
         'export const contactsRaw = [' + ', '.join(f'...part{i:03d}' for i in range(1, len(parts) + 1)) + ']', ''])
    for path, records in [('markets/accountants/people.jsonl', people), ('markets/accountants/companies.jsonl', companies)]:
        # Preserve every unchanged line's original formatting; avoid whole-store churn.
        before_lines = (ROOT / path).read_text().splitlines()
        before = {json.loads(line)['id']: line for line in before_lines if line.strip()}
        lines = []
        for record in records:
            old = before.get(record['id'])
            lines.append(old if old and json.loads(old) == record else json.dumps(record, ensure_ascii=False))
        text_outputs[path] = '\n'.join(lines) + '\n'
    sources_path = 'markets/accountants/sources.jsonl'
    sources = load_jsonl(sources_path)
    next_source = max(int(s['id'].split('-')[1]) for s in sources) + 1
    source_keys = {(s.get('source_batch'), s.get('evidence_type'), s.get('source_row')) for s in sources}
    for kind, records in [('MBAWC member directory', members), ('MBAWC financial leadership', people_audit)]:
        for record in records:
            key = (BATCH, kind, record['sourceRow'])
            if key in source_keys:
                continue
            sources.append({'id': f'src-{next_source:04d}', 'url': WORKBOOK_URL,
                            'source_type': 'Other', 'source_batch': BATCH, 'source_row': record['sourceRow'],
                            'person_id': record.get('personId'), 'company_id': record.get('researchCompanyId'),
                            'evidence_type': kind, 'evidence_summary': 'User-supplied workbook row; full original fields retained. Source-reported claims require independent verification.',
                            'qualification_supported': None, 'employment_supported': None,
                            'accessed_date': CHECKED, 'reliability': 'MODERATE', 'status': 'REVIEWING'})
            next_source += 1
    before_sources = (ROOT / sources_path).read_text()
    existing_count = len(load_jsonl(sources_path))
    text_outputs[sources_path] = before_sources.rstrip('\n') + '\n' + ''.join(json.dumps(s, ensure_ascii=False) + '\n' for s in sources[existing_count:])
    return text_outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive', nargs='?', default=ARCHIVE_PATH)
    parser.add_argument('--commit', action='store_true')
    args = parser.parse_args()
    archive = json.loads(Path(args.archive).read_text())
    config = load_json(f'markets/organizations/import-sources/{BATCH}-mapping.json')
    if archive['sha256'] != config['sourceSha256'] or hashlib.sha256((ROOT / WORKBOOK_PATH).read_bytes()).hexdigest() != archive['sha256']:
        raise ValueError('Workbook hash differs from the reviewed identity/category mapping')
    if hashlib.sha256(Path(args.archive).read_bytes()).hexdigest() != config['archiveSha256']:
        raise ValueError('Cell archive differs from the reviewed mapping')
    outputs = build_outputs(archive, config)
    changed = [path for path, value in outputs.items() if not (ROOT / path).exists() or (ROOT / path).read_text() != value]
    if args.commit:
        for path in changed:
            destination = ROOT / path
            destination.parent.mkdir(parents=True, exist_ok=True)
            temporary = destination.with_suffix(destination.suffix + '.tmp')
            temporary.write_text(outputs[path])
            temporary.replace(destination)
    print(json.dumps({'mode': 'committed' if args.commit else 'dry-run', 'changedFiles': changed,
                      'memberRows': len(sheet_rows(archive, 'MBAWC Members')),
                      'financeRows': len(config['people'])}, indent=2))


if __name__ == '__main__':
    main()
