// Regenerates the Markdown outline of the sector tree.
//
//   npm run taxonomy:outline

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { sectorTree } from '../src/data/taxonomy/load'
import { renderSectorOutline } from '../src/data/taxonomy/outline'

const OUT = resolve('markets/organizations/taxonomy/sector-tree-outline.md')
writeFileSync(OUT, renderSectorOutline(sectorTree), 'utf8')
console.log(`Wrote ${OUT} (${sectorTree.length} nodes)`)
