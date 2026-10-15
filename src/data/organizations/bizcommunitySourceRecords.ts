import sourceRecordsRaw from '../../../markets/organizations/bizcommunity-source-records.json'
import { canonicalCompanyName } from '../companyNormalization'
import type { BizcommunitySourceRecord } from './types'

export const bizcommunitySourceRecords = sourceRecordsRaw as BizcommunitySourceRecord[]

export function bizcommunitySourceRecordForCompany(companyName: string): BizcommunitySourceRecord | null {
  const key = canonicalCompanyName(companyName).toLowerCase()
  return bizcommunitySourceRecords.find(
    (record) => canonicalCompanyName(record.companyName).toLowerCase() === key,
  ) ?? null
}
