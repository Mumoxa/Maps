// Licensed recruitment metadata is never staged under a tracked project path.
import { resolve, sep } from 'node:path'

export function privateDataDir(input: string): string {
  const target = resolve(input)
  const project = resolve('.')
  const local = resolve('.local')
  const underLocal = target === local || target.startsWith(local + sep)
  const outsideProject = target !== project && !target.startsWith(project + sep)
  if (!underLocal && !outsideProject) {
    throw new Error('Raw hiring observations must be stored in ignored .local/ or outside the Git repository.')
  }
  return target
}
