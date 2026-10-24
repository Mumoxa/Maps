import type { Organization } from './types'

/** Shared business-detail vocabulary for factual and recruitment company search. */
export function directorySearchTerms(organization: Organization): string[] {
  return [
    organization.notes,
    ...(organization.directoryEntries ?? []).flatMap((entry) => [
      entry.directory,
      entry.recordKey,
      ...Object.keys(entry.fields),
      ...Object.values(entry.fields),
      entry.notes,
    ]),
  ]
}
