import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FilterPanel from '../components/case-list/FilterPanel'
import type { FilterState } from '../hooks/useFilter'
import type { Case } from '../types'

const defaultFilters: FilterState = {
  query: '',
  region: [],
  domain: [],
  usecase_category: [],
  sortBy: 'updated_at_desc',
  page: 1,
}

const filterOptions: Record<string, string[]> = {
  region: ['国内', '国外'],
  domain: ['医療', '金融'],
  usecase_category: ['組織内データ共有', 'R&D'],
}

const mockCases: Case[] = [
  {
    id: 'test-1',
    title: 'テスト事例1',
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
  },
  {
    id: 'test-2',
    title: 'テスト事例2',
    region: '国外',
    domain: '金融',
    organization: 'テスト組織2',
    usecase_category: 'R&D',
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
  },
]

function renderPanel(filters: FilterState = defaultFilters) {
  return render(
    <MemoryRouter>
      <FilterPanel
        filters={filters}
        filterOptions={filterOptions}
        filteredCases={mockCases}
        onToggle={vi.fn()}
        onClear={vi.fn()}
      />
    </MemoryRouter>,
  )
}

describe('FilterPanel', () => {
  it('regionフィルタが表示される（デスクトップ）', () => {
    renderPanel()
    expect(screen.getByText('地域')).toBeInTheDocument()
    expect(screen.getByText('国内')).toBeInTheDocument()
    expect(screen.getByText('国外')).toBeInTheDocument()
  })

  it('フィルタクリアボタンが存在する（アクティブなフィルタがある場合）', () => {
    const activeFilters: FilterState = {
      ...defaultFilters,
      region: ['国内'],
    }
    renderPanel(activeFilters)
    expect(screen.getByTestId('clear-filters')).toBeInTheDocument()
    expect(screen.getByText('フィルタをクリア')).toBeInTheDocument()
  })

  it('フィルタが未選択時はクリアボタンが非表示', () => {
    renderPanel()
    expect(screen.queryByTestId('clear-filters')).not.toBeInTheDocument()
  })

  it('分野フィルタが表示される', () => {
    renderPanel()
    expect(screen.getByText('分野')).toBeInTheDocument()
    expect(screen.getByText('医療')).toBeInTheDocument()
    expect(screen.getByText('金融')).toBeInTheDocument()
  })

  it('ユースケース分類フィルタが表示される', () => {
    renderPanel()
    expect(screen.getByText('ユースケース分類')).toBeInTheDocument()
    expect(screen.getByText('組織内データ共有')).toBeInTheDocument()
    expect(screen.getByText('R&D')).toBeInTheDocument()
  })

  it('各選択肢に件数が表示される', () => {
    renderPanel()
    // Each option should have its count displayed
    const countElements = screen.getAllByText('1')
    expect(countElements.length).toBeGreaterThan(0)
  })
})
