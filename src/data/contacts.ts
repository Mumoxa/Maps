import { contactsRaw } from './contact-parts'

export interface ContactPosition {
  title: string
  company: string
  sector: string
  companySize: string
  website: string
  companyLinkedin: string
  companyDomain: string
  companyDescription: string
  companySubIndustry: string
  companyCountry: string
  companyCity: string
  companyRevenue: string
  companyYearFounded: string
  companySpecialties: string
}

export interface ContactEmail {
  address: string
  status: string
  type: string
  masked: boolean
}

export interface ContactPhone {
  number: string
  type: string
}

export interface ContactSourceRecord {
  file: string
  sheet: string
  row: number
}

export interface ContactRelatedRole {
  roleTitle: string
  roleName: string
  roleGroup: string
  level: string
  newRoleGroup: string
  newRoleName: string
  status: string
  departmentCode: string
  location: string
}

export interface Contact {
  id: string
  name: string
  nameAliases: string[]
  positions: ContactPosition[]
  linkedinUrls: string[]
  emails: ContactEmail[]
  phones: ContactPhone[]
  locations: string[]
  seniorities: string[]
  departments: string[]
  technologies: string[]
  software: string[]
  tags: string[]
  triggers: string[]
  remarks: string[]
  outreachStatuses: string[]
  datesAdded: string[]
  sourceSheets: string[]
  sourceRecords: ContactSourceRecord[]
  relatedRoles: ContactRelatedRole[]
}

export const contacts = contactsRaw as Contact[]
