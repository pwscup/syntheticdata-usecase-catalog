import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export function listCaseIds(casesDir: string): string[] | null {
  if (!existsSync(casesDir)) return null

  return readdirSync(casesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(casesDir, d.name, 'case.json')))
    .map((d) => d.name)
    .sort()
}

export function buildIndexContent(ids: string[]): string {
  return JSON.stringify({ cases: ids }, null, 2) + '\n'
}
