import salesforcePeopleRaw from '../../markets/salesforce/people.json'
import type { TalentProfile } from './types'
import { adaptSalesforceProfiles, type SalesforcePerson } from './marketData/adapters'

export const salesforcePeople = salesforcePeopleRaw as SalesforcePerson[]

export function getSalesforceTalentProfiles(): TalentProfile[] {
  return adaptSalesforceProfiles(salesforcePeople)
}
