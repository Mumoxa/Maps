import type { TalentProfile } from './types'

// Add future manual profiles here as needed.
// The search page reads these entries directly, so new people become searchable immediately.
export const manualTalentProfiles: TalentProfile[] = [
  {
    id: 'salesforce-manual-katlego-magnificent-seapi',
    track: 'Salesforce',
    trackSlug: 'salesforce',
    name: 'Katlego Magnificent Seapi',
    company: 'Needs verification',
    title: 'Salesforce Practitioner (verification pending)',
    location: 'Pretoria, Gauteng, South Africa',
    seniority: 'Professional',
    skills: ['Salesforce', 'CRM', 'Customer Platforms', 'Verification Pending'],
    sectors: ['Salesforce', 'CRM / Digital'],
    summary: 'User-supplied correction for the Salesforce market map. Role, employer, and Salesforce evidence need verification before client or candidate use.',
    linkedinUrl: 'https://www.linkedin.com/in/seapi-katlego-96a955165/',
    sourceType: 'manual',
  },
]
