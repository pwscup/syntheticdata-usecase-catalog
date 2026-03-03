import type { Case } from '../types'

/** Count of items with percentage */
export interface CountItem {
  label: string
  count: number
  percentage: number // 0-100, rounded to 1 decimal
}

/** Summary statistics for a set of cases */
export interface CaseSummary {
  total: number
  byRegion: CountItem[]
  byDomain: CountItem[]
  byUsecaseCategory: CountItem[]
}

/** Count cases grouped by a specific field */
export function countByField(
  cases: Case[],
  field: 'region' | 'domain' | 'usecase_category',
): CountItem[] {
  const total = cases.length
  const counts = new Map<string, number>()

  for (const c of cases) {
    const value = c[field]
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({
      label,
      count,
      percentage: total === 0 ? 0 : Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)
}

/** Build complete summary from a set of cases */
export function buildSummary(cases: Case[]): CaseSummary {
  return {
    total: cases.length,
    byRegion: countByField(cases, 'region'),
    byDomain: countByField(cases, 'domain'),
    byUsecaseCategory: countByField(cases, 'usecase_category'),
  }
}
