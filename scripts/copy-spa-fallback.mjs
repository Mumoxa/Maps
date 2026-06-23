import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const source = resolve('dist/index.html')
const target = resolve('dist/404.html')

if (!existsSync(source)) {
  throw new Error('Cannot create SPA fallback because dist/index.html does not exist. Run vite build first.')
}

mkdirSync(dirname(target), { recursive: true })
copyFileSync(source, target)
console.log('Created dist/404.html SPA fallback')
