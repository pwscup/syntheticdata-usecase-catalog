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
  byTechnologyCategory: CountItem[]
  byReviewStatus: CountItem[]
}

/** Count cases grouped by a specific field.
 *  For array fields (usecase_category, technology_category), percentage is
 *  based on the sum of all assignments so that stacked bars add up to 100%.
 */
export function countByField(
  cases: Case[],
  field: 'region' | 'domain' | 'usecase_category' | 'technology_category' | 'review_status',
): CountItem[] {
  const counts = new Map<string, number>()

  for (const c of cases) {
    const value = c[field]
    if (Array.isArray(value)) {
      for (const v of value) {
        counts.set(v, (counts.get(v) ?? 0) + 1)
      }
    } else if (value) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }

  // For array fields, use sum of counts so stacked bar totals 100%
  const sumCounts = Array.from(counts.values()).reduce((a, b) => a + b, 0)
  const denominator = sumCounts > 0 ? sumCounts : 1

  return Array.from(counts.entries())
    .map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / denominator) * 1000) / 10,
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
    byTechnologyCategory: countByField(cases, 'technology_category'),
    byReviewStatus: countByField(cases, 'review_status'),
  }
}
