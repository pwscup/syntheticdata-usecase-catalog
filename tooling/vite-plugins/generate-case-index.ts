import { existsSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import type { Plugin } from 'vite'
import { listCaseIds, buildIndexContent } from '../lib/case-index'

export default function generateCaseIndex(): Plugin {
  const casesDir = resolve('public/cases')

  function generate() {
    const ids = listCaseIds(casesDir)
    if (ids === null) return

    const indexPath = join(casesDir, 'index.json')
    const newContent = buildIndexContent(ids)

    const current = existsSync(indexPath) ? readFileSync(indexPath, 'utf-8') : ''
    if (current !== newContent) {
      writeFileSync(indexPath, newContent)
      console.log(`[generate-case-index] Updated index.json (${ids.length} cases)`)
    }
  }

  return {
    name: 'generate-case-index',
    buildStart() {
      generate()
    },
    configureServer(server) {
      server.watcher.on('addDir', (path) => {
        if (path.startsWith(casesDir)) generate()
      })
      server.watcher.on('unlinkDir', (path) => {
        if (path.startsWith(casesDir)) generate()
      })
      server.watcher.on('add', (path) => {
        if (path.endsWith('case.json') && path.startsWith(casesDir)) generate()
      })
      server.watcher.on('unlink', (path) => {
        if (path.endsWith('case.json') && path.startsWith(casesDir)) generate()
      })
    },
  }
}
