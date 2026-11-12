// People, resolved onto the canonical company universe.
//
// "Mapped professionals" is a count the atlas, the directory and a company
// dossier all state. Until now the number had no list behind it at branch level:
// a reader could see that 399 companies in Construction hold mapped people, but
// could not open the people themselves. This module resolves each sourced
// person's employer onto the same canonical organization id every other surface
// uses, so the contact directory can be scoped to a company or to a national
// taxonomy branch and still agree with the atlas.
//
// The contact dataset is personal, private data. It is imported here (and only
// here), which keeps it out of the atlas bundle: the only page that imports this
// module is the lazily-loaded contact directory.

import { contacts } from '../contacts'
import type { Contact } from '../contacts'
import { resolveEmployerOrganizationId } from './load'
import type { OrganizationIndex } from './load'
import { companiesAtNode, isUnclassifiedBranch } from './atlas'
import type { IndustryAtlas } from './atlas'

export interface ProfessionalScope {
  /** A national taxonomy branch, or the unclassified branch id. */
  nodeId?: string | null
  /** One canonical company. */
  organizationId?: string | null
}

/** Contact id -> every canonical organization its sourced positions name. */
const organizationIdsByContact = new WeakMap<OrganizationIndex, Map<string, string[]>>()

/**
 * Resolve every contact's employers onto canonical organization ids once.
 *
 * A person can hold several current positions, so the value is a list, and a
 * person is in a company's scope when any of their positions names it. The map
 * is cached against the index it was built from, so navigating between a branch
 * and a company never rebuilds it.
 */
export function contactOrganizationIds(index: OrganizationIndex): Map<string, string[]> {
  const cached = organizationIdsByContact.get(index)
  if (cached) return cached

  const resolved = new Map<string, string[]>()
  for (const contact of contacts) {
    const ids: string[] = []
    const seen = new Set<string>()
    for (const position of contact.positions) {
      if (!position.company) continue
      const id = resolveEmployerOrganizationId(index, position.company)
      if (!id || seen.has(id)) continue
      seen.add(id)
      ids.push(id)
    }
    if (ids.length > 0) resolved.set(contact.id, ids)
  }
  organizationIdsByContact.set(index, resolved)
  return resolved
}

/** Canonical organization ids inside one scope, for O(1) membership tests. */
export function organizationIdsInScope(
  index: OrganizationIndex,
  atlas: IndustryAtlas,
  scope: ProfessionalScope,
): Set<string> | null {
  if (scope.organizationId) return new Set([scope.organizationId])
  if (!scope.nodeId) return null
  if (isUnclassifiedBranch(scope.nodeId)) return new Set(atlas.unclassifiedOrganizationIds)
  return new Set(companiesAtNode(atlas, index, scope.nodeId))
}

/**
 * The people mapped inside a scope.
 *
 * A null scope means the whole directory, never an empty result: an absent
 * parameter must not silently hide people.
 */
export function contactsInScope(
  index: OrganizationIndex,
  atlas: IndustryAtlas,
  scope: ProfessionalScope,
): Contact[] {
  const scopeIds = organizationIdsInScope(index, atlas, scope)
  if (!scopeIds) return contacts
  const byContact = contactOrganizationIds(index)
  return contacts.filter((contact) => {
    const ids = byContact.get(contact.id)
    return ids ? ids.some((id) => scopeIds.has(id)) : false
  })
}

/** How many people the scope holds. Derived from the same predicate as the list. */
export function professionalCountInScope(
  index: OrganizationIndex,
  atlas: IndustryAtlas,
  scope: ProfessionalScope,
): number {
  return contactsInScope(index, atlas, scope).length
}

/** True when a scope was actually requested, so a page can state it. */
export function hasProfessionalScope(scope: ProfessionalScope): boolean {
  return Boolean(scope.organizationId || scope.nodeId)
}
