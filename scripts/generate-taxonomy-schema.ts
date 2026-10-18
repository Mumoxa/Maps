// Generates the JSON Schema for a South African company taxonomy profile.
//
//   npm run taxonomy:schema
//
// The schema is generated from the same taxonomy and vocabulary files the
// validator reads, so an enum can never drift away from the data it describes.
// Hand-editing sa-company-profile.schema.json is therefore pointless: edit the
// JSON data files and regenerate.

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getTaxonomyNodeIds, scaleBands, sectorTree, vocabularies } from '../src/data/taxonomy/load'

const OUT = resolve('markets/organizations/taxonomy/sa-company-profile.schema.json')

const CIPC_SUFFIX: Record<string, string> = {
  'pty-ltd': '07',
  'ltd-public': '06',
  'ltd-inc': '07',
  npc: '08',
  cc: '23',
  'co-operative': '24',
  'soc-ltd': '30',
  'foreign-branch': '10',
}

const NO_CIPC_NUMBER = ['sole-proprietorship', 'partnership', 'trust', 'npo-association', 'unregistered-informal', 'provincial-department']

function enumOf(values: string[], description: string) {
  return { type: 'string', enum: values, description }
}

function dateField(description: string) {
  return { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description }
}

function optionalString(description: string) {
  return { type: 'string', description }
}

const provenance = {
  type: 'object',
  additionalProperties: false,
  required: ['sourceUrl', 'checkedOn', 'confidence', 'sourceType'],
  properties: {
    sourceUrl: { type: 'string', description: 'Empty string means no source exists yet, which is not the same as no source being needed.' },
    checkedOn: dateField('ISO date the source was read.'),
    confidence: enumOf(vocabularies.confidence, 'Evidence confidence. Unknown is distinct from a verified absence.'),
    sourceType: enumOf(vocabularies.sourceType, 'What kind of source the evidence came from.'),
  },
}

const legalIdentity = {
  type: 'object',
  additionalProperties: false,
  required: [
    'legalName', 'tradingName', 'entityType', 'cipcRegistrationNumber', 'cipcStatus', 'cipcStatusAsOf',
    'vatNumber', 'incomeTaxNumber', 'jseShareCode', 'jseListingStatus', 'jseListingAsOf', 'isin', 'leiNumber',
  ],
  properties: {
    legalName: { type: 'string', minLength: 1, description: 'Registered legal name, not the brand.' },
    tradingName: optionalString('Brand or trading name where it differs from the legal name.'),
    entityType: enumOf(vocabularies.entityTypes.map((option) => option.id), 'Legal entity identifier type.'),
    cipcRegistrationNumber: {
      type: 'string',
      pattern: '^(\\d{4}/\\d{6}/\\d{2})?$',
      description: 'CIPC registration number in YYYY/NNNNNN/NN form, or empty where the entity type never receives one.',
    },
    cipcStatus: enumOf(vocabularies.cipcStatuses.map((option) => option.id), 'CIPC registration status. Annual returns in arrears is not insolvency.'),
    cipcStatusAsOf: dateField('Date the CIPC status was read.'),
    vatNumber: optionalString('SARS VAT vendor number.'),
    incomeTaxNumber: optionalString('SARS income tax reference number.'),
    jseShareCode: optionalString('JSE share code where listed.'),
    jseListingStatus: enumOf(vocabularies.jseListingStatuses.map((option) => option.id), 'Listing status is dated: delistings and demergers change it.'),
    jseListingAsOf: dateField('Date the listing status was read.'),
    isin: optionalString('ISIN where the entity has listed securities.'),
    leiNumber: optionalString('Legal Entity Identifier where issued.'),
  },
}

const scaleProfile = {
  type: 'object',
  additionalProperties: false,
  required: [
    'employeesFte', 'employeesAsOf', 'fteReported', 'annualTurnoverZar', 'turnoverFyEnd',
    'turnoverBasis', 'assetValueZar', 'informal', 'reportingBasis', 'provenance',
  ],
  properties: {
    employeesFte: { type: ['integer', 'null'], minimum: 0, description: 'Total full-time equivalent of paid employees, the statutory proxy. Null means not known.' },
    employeesAsOf: dateField('Date the headcount belongs to.'),
    fteReported: { type: 'boolean', description: 'False where no FTE figure was reported at all.' },
    annualTurnoverZar: { type: ['number', 'null'], minimum: 0, description: 'Total annual turnover in rand, the second statutory proxy.' },
    turnoverFyEnd: dateField('Financial year end the turnover figure belongs to.'),
    turnoverBasis: enumOf(vocabularies.scaleBasis, 'How the turnover figure was established.'),
    assetValueZar: { type: ['number', 'null'], minimum: 0, description: 'Gross asset value, the retired third proxy, kept because older records carry it.' },
    informal: { type: 'boolean', description: 'True where the enterprise operates in the informal economy.' },
    reportingBasis: enumOf(['standalone-entity', 'group-consolidated'], 'A group figure must never be read as one legal entity size.'),
    provenance,
  },
}

const scaleBandAssignment = {
  type: 'object',
  additionalProperties: false,
  required: ['band', 'bandLabel', 'bandByEmployees', 'bandByTurnover', 'bandConflict', 'statutoryClass', 'scheduleId', 'derivedOn'],
  description: 'Derived from the scale proxies on every validation run. Never hand-entered.',
  properties: {
    band: enumOf([...scaleBands.map((band) => band.id), 'unclassified'], 'Resolved scale band, the higher of the two proxy readings.'),
    bandLabel: { type: 'string', minLength: 1 },
    bandByEmployees: enumOf([...scaleBands.map((band) => band.id), 'unclassified'], 'Band indicated by FTE headcount alone.'),
    bandByTurnover: enumOf([...scaleBands.map((band) => band.id), 'unclassified'], 'Band indicated by turnover alone.'),
    bandConflict: { type: 'boolean', description: 'True when the two proxies disagree, so the disagreement stays visible.' },
    statutoryClass: { type: ['string', 'null'], enum: ['micro', 'small', 'medium', null], description: 'National Small Enterprise Act class, or null for the non-statutory corporate bands.' },
    scheduleId: { type: 'string', minLength: 1, description: 'Statutory schedule the band was derived from.' },
    derivedOn: dateField('Date the band was recomputed.'),
  },
}

const beeProfile = {
  type: 'object',
  additionalProperties: false,
  required: [
    'category', 'level', 'scorecardType', 'sectorCode', 'blackOwnershipPct', 'blackFemaleOwnershipPct',
    'verificationAgency', 'sanasAccredited', 'certificateNumber', 'validFrom', 'validTo', 'evidenceType', 'provenance',
  ],
  properties: {
    category: enumOf(vocabularies.bbbee.categories.map((option) => option.id), 'B-BBEE entity category, driven by turnover against the applicable sector code.'),
    level: enumOf(vocabularies.bbbee.levels, 'B-BBEE contribution level 1-8, or non-compliant / not-verified.'),
    scorecardType: enumOf(vocabularies.bbbee.scorecardTypes, 'Which scorecard or affidavit path was used.'),
    sectorCode: enumOf(vocabularies.bbbee.sectorCodes.map((option) => option.id), 'Sector codes override the general R10m and R50m thresholds.'),
    blackOwnershipPct: { type: ['number', 'null'], minimum: 0, maximum: 100 },
    blackFemaleOwnershipPct: { type: ['number', 'null'], minimum: 0, maximum: 100 },
    verificationAgency: optionalString('SANAS-accredited agency, empty for affidavit-only entities.'),
    sanasAccredited: { type: 'boolean', description: 'Whether the verification agency held SANAS accreditation at the time of issue.' },
    certificateNumber: optionalString('Certificate or affidavit reference.'),
    validFrom: dateField('Start of the 12-month validity period.'),
    validTo: dateField('End of the 12-month validity period.'),
    evidenceType: enumOf(vocabularies.bbbee.evidenceTypes, 'What actually supports the claimed level.'),
    provenance,
  },
}

const sectorLicence = {
  type: 'object',
  additionalProperties: false,
  required: ['regulator', 'licenceType', 'licenceNumber', 'status', 'validTo', 'sourceUrl', 'checkedOn'],
  properties: {
    regulator: enumOf(vocabularies.registrationRegulators.map((option) => option.id), 'Registration authority.'),
    licenceType: { type: 'string', description: 'e.g. "CIDB contractor grade 5 CE", "NERSA generation licence", "Mining right".' },
    licenceNumber: optionalString('Licence, right, certificate or grade reference.'),
    status: { type: 'string', description: 'current, expired, applied-for, suspended, lapsed.' },
    validTo: dateField('Expiry date, or the read date for licences with no expiry.'),
    sourceUrl: { type: 'string' },
    checkedOn: dateField('Date the licence status was read.'),
  },
}

const regulatoryProfile = {
  type: 'object',
  additionalProperties: false,
  required: [
    'sarsTaxComplianceStatus', 'sarsTcsPin', 'sarsPinExpiry', 'coidaStatus', 'coidaLgsNumber',
    'coidaLgsExpiry', 'csdRegistered', 'pfmaOrMfmaApplicable', 'sectorLicences', 'provenance',
  ],
  properties: {
    sarsTaxComplianceStatus: enumOf(vocabularies.taxComplianceStatuses.map((option) => option.id), 'SARS Tax Compliance Status.'),
    sarsTcsPin: optionalString('Tax Compliance Status PIN, verifiable in real time by third parties.'),
    sarsPinExpiry: dateField('PIN expiry date.'),
    coidaStatus: enumOf(vocabularies.coidaStatuses.map((option) => option.id), 'COIDA Compensation Fund status.'),
    coidaLgsNumber: optionalString('Letter of Good Standing reference.'),
    coidaLgsExpiry: dateField('Letter of Good Standing expiry.'),
    csdRegistered: { type: 'boolean', description: 'Registered on the National Treasury Central Supplier Database, required for state procurement.' },
    pfmaOrMfmaApplicable: { type: 'boolean', description: 'True where PFMA (national) or MFMA (municipal) governance applies.' },
    sectorLicences: { type: 'array', items: sectorLicence, description: 'Sector-specific regulatory vectors: CIDB, NERSA, ICASA, FSCA, PSIRA, PPRA, MPRDA rights and similar.' },
    provenance,
  },
}

const geographicAnchor = {
  type: 'object',
  additionalProperties: false,
  required: [
    'province', 'metropolitanMunicipality', 'districtMunicipality', 'localMunicipality', 'city', 'suburb',
    'streetAddress', 'latitude', 'longitude', 'regionalEconomicHubs', 'operatingProvinces',
    'crossBorderCountries', 'sourceUrl', 'checkedOn',
  ],
  properties: {
    province: enumOf(vocabularies.provinces.map((option) => option.id), 'Head office province.'),
    metropolitanMunicipality: enumOf(['', ...vocabularies.metropolitanMunicipalities.map((option) => option.id)], 'Populated only for the eight metros. A metro is not inside a district municipality.'),
    districtMunicipality: enumOf(['', ...vocabularies.districtMunicipalities.map((option) => option.id)], 'Populated only outside the metros.'),
    localMunicipality: optionalString('Free text with provenance: boundaries change and must be read from the Municipal Demarcation Board.'),
    city: optionalString('City or town.'),
    suburb: optionalString('Suburb or industrial area.'),
    streetAddress: optionalString('Street address where a source states it.'),
    latitude: { type: ['number', 'null'], minimum: -90, maximum: 90 },
    longitude: { type: ['number', 'null'], minimum: -180, maximum: 180 },
    regionalEconomicHubs: { type: 'array', items: enumOf(vocabularies.regionalEconomicHubs.map((option) => option.id), 'Regional economic hub.'), description: 'Used to track regional economic density rather than raw address counts.' },
    operatingProvinces: { type: 'array', items: enumOf(vocabularies.provinces.map((option) => option.id), 'Province.') },
    crossBorderCountries: { type: 'array', items: { type: 'string' }, description: 'ISO country codes where the company also operates.' },
    sourceUrl: { type: 'string' },
    checkedOn: dateField('Date the location was read from a source.'),
  },
}

const taxonomyPlacement = {
  type: 'object',
  additionalProperties: false,
  required: ['primaryNode', 'secondaryNodes', 'valueChainStage', 'sourcingPocket'],
  properties: {
    primaryNode: { $ref: '#/$defs/taxonomyNodeId', description: 'Deepest node the company can be confidently placed in.' },
    secondaryNodes: { type: 'array', items: { $ref: '#/$defs/taxonomyNodeId' }, description: 'Multi-homing: a retailer that also runs logistics belongs in both.' },
    valueChainStage: optionalString('Value-chain position, used for adjacency rather than equivalence.'),
    sourcingPocket: optionalString('Existing Maps sourcing pocket id, preserved through the crosswalk.'),
  },
}

const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://maps.mumoxa.co.za/schemas/sa-company-profile.schema.json',
  title: 'South African Company Taxonomy Profile',
  description:
    'One South African registered company placed into the national corporate taxonomy: what it does (four-tier sector tree), how big it is (National Small Enterprise Act proxies plus corporate banking bands), whether it is compliant and real (CIPC, SARS, COIDA, B-BBEE), and where it sits economically (province, municipality, regional hub). Generated by scripts/generate-taxonomy-schema.ts from the taxonomy data files; do not edit by hand.',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'legal', 'scale', 'scaleBand', 'bbbee', 'regulatory', 'geography', 'taxonomy', 'status', 'lastVerified', 'illustrativeRecord', 'notes'],
  properties: {
    id: { type: 'string', pattern: '^[a-z]{2,4}-[a-z0-9-]+$', description: 'Stable record id, e.g. za-eng-0001.' },
    legal: { $ref: '#/$defs/legalIdentity' },
    scale: { $ref: '#/$defs/scaleProfile' },
    scaleBand: { $ref: '#/$defs/scaleBandAssignment' },
    bbbee: { $ref: '#/$defs/beeProfile' },
    regulatory: { $ref: '#/$defs/regulatoryProfile' },
    geography: { $ref: '#/$defs/geographicAnchor' },
    taxonomy: { $ref: '#/$defs/taxonomyPlacement' },
    status: enumOf(['verified', 'needs-verification'], 'Verification status of the record as a whole.'),
    lastVerified: dateField('Date the record was last checked against sources.'),
    illustrativeRecord: { type: 'boolean', description: 'True for records that demonstrate the schema rather than assert a real company.' },
    notes: optionalString('Anything a reviewer must know that the structured fields cannot carry.'),
  },
  $defs: {
    provenance,
    legalIdentity,
    scaleProfile,
    scaleBandAssignment,
    beeProfile,
    sectorLicence,
    regulatoryProfile,
    geographicAnchor,
    taxonomyPlacement,
    taxonomyNodeId: {
      type: 'string',
      enum: getTaxonomyNodeIds(),
      description: `Any of the ${sectorTree.length} nodes in the four-tier taxonomy, from macro-sector (level 1) to operational niche (level 4).`,
    },
  },
  allOf: [
    {
      description: 'A metro and a district municipality are mutually exclusive: the eight metros are not inside any district municipality.',
      oneOf: [
        {
          properties: {
            geography: {
              properties: {
                metropolitanMunicipality: { not: { const: '' } },
                districtMunicipality: { const: '' },
              },
              required: ['metropolitanMunicipality', 'districtMunicipality'],
            },
          },
        },
        {
          properties: {
            geography: {
              properties: {
                metropolitanMunicipality: { const: '' },
                districtMunicipality: { not: { const: '' } },
              },
              required: ['metropolitanMunicipality', 'districtMunicipality'],
            },
          },
        },
      ],
    },
    {
      description: 'Entity types that never receive a CIPC number must leave the field empty.',
      if: { properties: { legal: { properties: { entityType: { enum: NO_CIPC_NUMBER } }, required: ['entityType'] } } },
      then: { properties: { legal: { properties: { cipcRegistrationNumber: { const: '' } }, required: ['cipcRegistrationNumber'] } } },
    },
    ...Object.entries(CIPC_SUFFIX).map(([entityType, suffix]) => ({
      description: `A ${entityType} registration number carries the /${suffix} entity-type suffix.`,
      if: { properties: { legal: { properties: { entityType: { const: entityType }, cipcRegistrationNumber: { not: { const: '' } } }, required: ['entityType', 'cipcRegistrationNumber'] } } },
      then: { properties: { legal: { properties: { cipcRegistrationNumber: { pattern: `^\\d{4}/\\d{6}/${suffix}$` } }, required: ['cipcRegistrationNumber'] } } },
    })),
    {
      description: 'An EME on a sworn affidavit can only be Level 1, 2 or 4; every other level needs a scorecard.',
      if: {
        properties: {
          bbbee: { properties: { category: { const: 'eme' }, evidenceType: { const: 'sworn-affidavit' } }, required: ['category', 'evidenceType'] },
        },
      },
      then: { properties: { bbbee: { properties: { level: { enum: ['1', '2', '4'] } }, required: ['level'] } } },
    },
    {
      description: 'A Generic enterprise is above the QSE ceiling, so an affidavit alone cannot support the level.',
      if: { properties: { bbbee: { properties: { category: { const: 'generic' } }, required: ['category'] } } },
      then: { properties: { bbbee: { properties: { scorecardType: { enum: ['generic', 'sector-code'] } }, required: ['scorecardType'] } } },
    },
    {
      description: 'A valid SARS Tax Compliance Status must carry the PIN that proves it.',
      if: { properties: { regulatory: { properties: { sarsTaxComplianceStatus: { const: 'tcs-valid' } }, required: ['sarsTaxComplianceStatus'] } } },
      then: { properties: { regulatory: { properties: { sarsTcsPin: { minLength: 1 } }, required: ['sarsTcsPin'] } } },
    },
    {
      description: 'A valid COIDA Letter of Good Standing must carry its certificate reference.',
      if: { properties: { regulatory: { properties: { coidaStatus: { const: 'lgs-valid' } }, required: ['coidaStatus'] } } },
      then: { properties: { regulatory: { properties: { coidaLgsNumber: { minLength: 1 } }, required: ['coidaLgsNumber'] } } },
    },
    {
      description: 'Tier 1 and large are not statutory SMME classes, so statutoryClass must be null on those records.',
      if: { properties: { scaleBand: { properties: { band: { enum: ['large', 'tier-1'] } }, required: ['band'] } } },
      then: { properties: { scaleBand: { properties: { statutoryClass: { const: null } }, required: ['statutoryClass'] } } },
    },
  ],
}

writeFileSync(OUT, `${JSON.stringify(schema, null, 2)}\n`, 'utf8')

const nodeCount = getTaxonomyNodeIds().length
console.log(`Wrote ${OUT}`)
console.log(`  ${nodeCount} taxonomy node ids, ${scaleBands.length} scale bands, ${Object.keys(schema.$defs).length} definitions, ${schema.allOf.length} conditional rules`)
