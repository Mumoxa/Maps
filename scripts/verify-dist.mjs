import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const distPath = resolve('dist')
const requiredFiles = ['index.html', '404.html', '_redirects']

for (const file of requiredFiles) {
  if (!existsSync(resolve(distPath, file))) {
    throw new Error(`Production build is missing ${file}`)
  }
}

const indexHtml = readFileSync(resolve(distPath, 'index.html'), 'utf8')
const fallbackHtml = readFileSync(resolve(distPath, '404.html'), 'utf8')
const redirects = readFileSync(resolve(distPath, '_redirects'), 'utf8').trim()

if (indexHtml !== fallbackHtml) {
  throw new Error('404.html must match index.html for SPA route fallback')
}

if (redirects !== '/* /index.html 200') {
  throw new Error('Cloudflare Pages SPA redirect is missing or invalid')
}

const assetPaths = [...indexHtml.matchAll(/(?:src|href)="(\/assets\/[^"?]+)(?:\?[^\"]*)?"/g)]
  .map((match) => match[1])

if (assetPaths.length === 0) {
  throw new Error('Production index does not reference any bundled assets')
}

for (const assetPath of assetPaths) {
  if (!existsSync(resolve(distPath, assetPath.slice(1)))) {
    throw new Error(`Production index references missing asset ${assetPath}`)
  }
}

console.info(`Verified production build with ${assetPaths.length} bundled assets`)
