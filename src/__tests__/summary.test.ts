import { countByField, buildSummary } from '../lib/summary'
import type { Case } from '../types'

function makeCase(overrides: Partial<Case> = {}): Case {
  return {
    id: 'test-1',
    title: 'テスト',
    region: '国内',
    domain: '医療',
    organization: 'テスト組織',
    usecase_category: '組織内データ共有',
    summary: '',
    value_proposition: '',
    synthetic_generation_method: '',
    safety_evaluation_method: '',
    utility_evaluation_method: '',
    tags: [],
    sources: [],
    figures: [],
    status: 'seed',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('countByField', () => {
  it('空配列では空結果を返す', () => {
    expect(countByField([], 'region')).toEqual([])
  })

  it('地域別にカウントできる', () => {
    const cases = [
      makeCase({ region: '国内' }),
      makeCase({ region: '国外' }),
      makeCase({ region: '国外' }),
    ]
    const result = countByField(cases, 'region')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ label: '国外', count: 2, percentage: 66.7 })
    expect(result[1]).toEqual({ label: '国内', count: 1, percentage: 33.3 })
  })

  it('件数の多い順にソートされる', () => {
    const cases = [
      makeCase({ domain: '金融' }),
      makeCase({ domain: '医療' }),
      makeCase({ domain: '医療' }),
      makeCase({ domain: '医療' }),
    ]
    const result = countByField(cases, 'domain')
    expect(result[0].label).toBe('医療')
    expect(result[1].label).toBe('金融')
  })
})

describe('buildSummary', () => {
  it('全フィールドの集計を返す', () => {
    const cases = [
      makeCase({ region: '国内', domain: '医療', usecase_category: 'R&D' }),
      makeCase({ region: '国外', domain: '金融', usecase_category: 'データ販売' }),
    ]
    const summary = buildSummary(cases)
    expect(summary.total).toBe(2)
    expect(summary.byRegion).toHaveLength(2)
    expect(summary.byDomain).toHaveLength(2)
    expect(summary.byUsecaseCategory).toHaveLength(2)
  })

  it('空配列では total=0 を返す', () => {
    const summary = buildSummary([])
    expect(summary.total).toBe(0)
    expect(summary.byRegion).toEqual([])
  })
})
