export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\//g, '-')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-')
}

export function generateSlug(name: string, id: string, existingSlugs: Set<string>): string {
  let slug = slugify(name)
  if (!existingSlugs.has(slug)) {
    existingSlugs.add(slug)
    return slug
  }
  slug = `${slugify(name)}-${id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  if (!existingSlugs.has(slug)) {
    existingSlugs.add(slug)
    return slug
  }
  let counter = 2
  while (existingSlugs.has(slug)) {
    slug = `${slugify(name)}-${counter}`
    counter++
  }
  existingSlugs.add(slug)
  return slug
}

export function buildSlugSets(data: { profiles: { id: string; name: string }[]; companies: { id: string; name: string }[]; segments: { id: string; name: string }[] }): {
  profileSlugs: Map<string, string>
  companySlugs: Map<string, string>
  segmentSlugs: Map<string, string>
  allSlugs: Set<string>
} {
  const allSlugs = new Set<string>()
  const profileSlugs = new Map<string, string>()
  const companySlugs = new Map<string, string>()
  const segmentSlugs = new Map<string, string>()

  for (const p of data.profiles) {
    const slug = generateSlug(p.name, p.id, allSlugs)
    profileSlugs.set(slug, p.id)
  }
  for (const c of data.companies) {
    const slug = generateSlug(c.name, c.id, allSlugs)
    companySlugs.set(slug, c.id)
  }
  for (const s of data.segments) {
    const slug = generateSlug(s.name, s.id, allSlugs)
    segmentSlugs.set(slug, s.id)
  }

  return { profileSlugs, companySlugs, segmentSlugs, allSlugs }
}
