import type { Case } from '../types'
import { applyFilters, applySorting, collectFilterOptions, parseFiltersFromParams, filtersToParams, ITEMS_PER_PAGE, type FilterState } from '../hooks/useFilter'

function makeCase(overrides: Partial<Case> = {}): Case {
  return {
    id: 'case-001',
    title: 'デフォルトタイトル',
    region: '国内',
    domain: '医療',
    organization: 'テスト組織',
    usecase_category: ['組織内データ共有'],
    summary: 'デフォルト概要',
    value_proposition: '成果',
    synthetic_generation_method: 'GAN',
    safety_evaluation_method: 'k-匿名性',
    utility_evaluation_method: '精度比較',
    tags: ['タグ1'],
    sources: [{ source_type: 'web', title: 'ソースA', url: 'https://example.com', note: '' }],
    figures: [],
    status: 'seed',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  } as Case
}

function defaultFilters(overrides: Partial<FilterState> = {}): FilterState {
  return {
    query: '',
    region: [],
    domain: [],
    usecase_category: [],
    sortBy: 'updated_at_desc',
    page: 1,
    ...overrides,
  }
}

const testCases: Case[] = [
  makeCase({
    id: 'case-001',
    title: '医療データ匿名化',
    region: '国内',
    domain: '医療',
    organization: '大学病院A',
    usecase_category: ['組織内データ共有'],
    summary: '患者データを匿名化して研究に活用',
    tags: ['匿名化', 'ヘルスケア'],
    sources: [{ source_type: 'web', title: '論文A', url: 'https://example.com/a', note: '' }],
    synthetic_generation_method: 'GAN',
    safety_evaluation_method: 'k-匿名性',
    utility_evaluation_method: '精度比較',
    updated_at: '2026-03-01T00:00:00Z',
  }),
  makeCase({
    id: 'case-002',
    title: '金融不正検知',
    region: '国外',
    domain: '金融',
    organization: 'FinTech社',
    usecase_category: ['R&D'],
    summary: '不正取引パターンの合成データ生成',
    tags: ['不正検知', 'Finance'],
    sources: [{ source_type: 'pdf', title: 'レポートB', url: 'https://example.com/b', note: '' }],
    synthetic_generation_method: 'VAE',
    safety_evaluation_method: '差分プライバシー',
    utility_evaluation_method: 'F値',
    updated_at: '2026-01-15T00:00:00Z',
  }),
  makeCase({
    id: 'case-003',
    title: '自動運転シミュレーション',
    region: '国外',
    domain: '通信',
    organization: 'AutoDrive Inc.',
    usecase_category: ['外部分析者活用'],
    summary: '走行データの合成によるモデル訓練',
    tags: ['自動運転', 'シミュレーション'],
    sources: [{ source_type: 'web', title: '論文A', url: 'https://example.com/a2', note: '' }],
    synthetic_generation_method: '調査中',
    safety_evaluation_method: '調査中',
    utility_evaluation_method: '精度比較',
    updated_at: '2026-02-10T00:00:00Z',
  }),
]

describe('useFilter - applyFilters', () => {
  it('フリーワード検索: titleで絞り込める', () => {
    const result = applyFilters(testCases, defaultFilters({ query: '医療' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-001')
  })

  it('フリーワード検索: summaryで絞り込める', () => {
    const result = applyFilters(testCases, defaultFilters({ query: '不正取引' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-002')
  })

  it('フリーワード検索: organizationで絞り込める', () => {
    const result = applyFilters(testCases, defaultFilters({ query: 'FinTech' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-002')
  })

  it('フリーワード検索: tagsで絞り込める', () => {
    const result = applyFilters(testCases, defaultFilters({ query: '自動運転' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-003')
  })

  it('フリーワード検索: domain_subで絞り込める', () => {
    const casesWithSub = [
      makeCase({ id: 'case-sub', title: 'テスト', domain_sub: '保険', tags: [] }),
      makeCase({ id: 'case-nosub', title: 'その他', tags: [] }),
    ]
    const result = applyFilters(casesWithSub, defaultFilters({ query: '保険' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-sub')
  })

  it('フリーワード検索: 大文字小文字を区別しない', () => {
    const result = applyFilters(testCases, defaultFilters({ query: 'finance' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-002')
  })

  it('regionフィルタ: 「国内」で絞り込める', () => {
    const result = applyFilters(testCases, defaultFilters({ region: ['国内'] }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-001')
  })

  it('domainフィルタ: 特定のdomainで絞り込める', () => {
    const result = applyFilters(testCases, defaultFilters({ domain: ['金融'] }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-002')
  })

  it('複数フィルタのAND結合', () => {
    const result = applyFilters(testCases, defaultFilters({ region: ['国外'], domain: ['金融'] }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-002')

    const noResult = applyFilters(testCases, defaultFilters({ region: ['国内'], domain: ['金融'] }))
    expect(noResult).toHaveLength(0)
  })

  it('usecase_categoryフィルタで絞り込める', () => {
    const result = applyFilters(testCases, defaultFilters({ usecase_category: ['R&D'] }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('case-002')
  })

  it('フィルタクリア（空フィルタで全件返る）', () => {
    const result = applyFilters(testCases, defaultFilters())
    expect(result).toHaveLength(3)
  })
})

describe('useFilter - applySorting', () => {
  it('ソート: title辞書順', () => {
    const sorted = applySorting(testCases, 'title')
    expect(sorted[0].id).toBe('case-001') // 医療
    expect(sorted[1].id).toBe('case-002') // 金融
    expect(sorted[2].id).toBe('case-003') // 自動運転
  })

  it('ソート: updated_at降順（新しい順）', () => {
    const sorted = applySorting(testCases, 'updated_at_desc')
    expect(sorted[0].id).toBe('case-001') // 2026-03-01
    expect(sorted[1].id).toBe('case-003') // 2026-02-10
    expect(sorted[2].id).toBe('case-002') // 2026-01-15
  })

  it('ソート: updated_at昇順（古い順）', () => {
    const sorted = applySorting(testCases, 'updated_at_asc')
    expect(sorted[0].id).toBe('case-002') // 2026-01-15
    expect(sorted[1].id).toBe('case-003') // 2026-02-10
    expect(sorted[2].id).toBe('case-001') // 2026-03-01
  })
})

describe('useFilter - collectFilterOptions', () => {
  it('filterOptions が正しくユニーク値を収集する', () => {
    const options = collectFilterOptions(testCases)

    expect(options.region).toEqual(expect.arrayContaining(['国内', '国外']))
    expect(options.region).toHaveLength(2)

    expect(options.domain).toEqual(expect.arrayContaining(['医療', '金融', '通信']))
    expect(options.domain).toHaveLength(3)

    expect(options.usecase_category).toEqual(expect.arrayContaining(['組織内データ共有', 'R&D', '外部分析者活用']))
    expect(options.usecase_category).toHaveLength(3)
  })

  it('filterOptions の値がソートされている', () => {
    const options = collectFilterOptions(testCases)
    for (const key of Object.keys(options)) {
      const sorted = [...options[key]].sort()
      expect(options[key]).toEqual(sorted)
    }
  })
})

describe('useFilter - parseFiltersFromParams / filtersToParams', () => {
  it('デフォルトのsortByがupdated_at_descである', () => {
    const params = new URLSearchParams()
    const filters = parseFiltersFromParams(params)
    expect(filters.sortBy).toBe('updated_at_desc')
    expect(filters.page).toBe(1)
  })

  it('pageパラメータをパースできる', () => {
    const params = new URLSearchParams('page=3')
    const filters = parseFiltersFromParams(params)
    expect(filters.page).toBe(3)
  })

  it('page=1の時はURLパラメータに含まれない', () => {
    const params = filtersToParams(defaultFilters({ page: 1 }))
    expect(params.get('page')).toBeNull()
  })

  it('page>1の時はURLパラメータに含まれる', () => {
    const params = filtersToParams(defaultFilters({ page: 3 }))
    expect(params.get('page')).toBe('3')
  })

  it('sortByがupdated_at_descの時はURLパラメータに含まれない', () => {
    const params = filtersToParams(defaultFilters({ sortBy: 'updated_at_desc' }))
    expect(params.get('sortBy')).toBeNull()
  })

  it('sortByがtitleの時はURLパラメータに含まれる', () => {
    const params = filtersToParams(defaultFilters({ sortBy: 'title' }))
    expect(params.get('sortBy')).toBe('title')
  })
})

describe('useFilter - ITEMS_PER_PAGE', () => {
  it('ITEMS_PER_PAGEが12である', () => {
    expect(ITEMS_PER_PAGE).toBe(12)
  })
})
