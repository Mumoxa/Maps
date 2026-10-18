// Explicit, cross-platform discovery: Node 20's default --test discovery can
// report zero tests when the repository's test files use .test.ts.
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const files = readdirSync(resolve('tests'))
  .filter((name) => name.endsWith('.test.ts'))
  .sort()
  .map((name) => resolve('tests', name))

if (files.length === 0) {
  process.stderr.write('No TypeScript tests found under tests/; failing instead of showing a false green.\n')
  process.exit(1)
}

const result = spawnSync(process.execPath, ['--import', 'tsx', '--test', ...files], { stdio: 'inherit' })
if (result.error) {
  process.stderr.write(String(result.error) + '\n')
}
process.exit(result.status ?? 1)
