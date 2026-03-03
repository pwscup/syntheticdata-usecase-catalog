import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CaseListPage from '../pages/CaseListPage'
import { useCases } from '../context/CaseContext'
import type { Case } from '../types'

const mockCases: Case[] = [
  {
    id: 'case-001',
    title: 'テストケース1',
    region: '国内',
    domain: '医療',
    organization: 'テスト組織A',
    usecase_category: ['プライバシー保護'],
    summary: '概要1',
    value_proposition: '成果1',
    synthetic_generation_method: '方法1',
    safety_evaluation_method: '安全性1',
    utility_evaluation_method: '有用性1',
    tags: [],
    sources: [],
    figures: [],
    status: 'seed',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'case-002',
    title: 'テストケース2',
    region: '国外',
    domain: '金融',
    organization: 'テスト組織B',
    usecase_category: ['データ拡張'],
    summary: '概要2',
    value_proposition: '成果2',
    synthetic_generation_method: '方法2',
    safety_evaluation_method: '安全性2',
    utility_evaluation_method: '有用性2',
    tags: [],
    sources: [],
    figures: [],
    status: 'seed',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

// Mock CaseContext by providing a wrapper with test data
vi.mock('../context/CaseContext', async () => {
  const actual = await vi.importActual<typeof import('../context/CaseContext')>('../context/CaseContext')
  return {
    ...actual,
    useCases: vi.fn(),
  }
})

const mockedUseCases = vi.mocked(useCases)

describe('CaseListPage', () => {
  it('ローディング中に「読み込み中」が表示される', () => {
    mockedUseCases.mockReturnValue({
      cases: [],
      loading: true,
      error: null,
    })

    render(
      <MemoryRouter>
        <CaseListPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('データロード後にカードが表示される', () => {
    mockedUseCases.mockReturnValue({
      cases: mockCases,
      loading: false,
      error: null,
    })

    render(
      <MemoryRouter>
        <CaseListPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('テストケース1')).toBeInTheDocument()
    expect(screen.getByText('テストケース2')).toBeInTheDocument()
  })

  it('エラー時にエラーメッセージが表示される', () => {
    mockedUseCases.mockReturnValue({
      cases: [],
      loading: false,
      error: 'テストエラー',
    })

    render(
      <MemoryRouter>
        <CaseListPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('エラー: テストエラー')).toBeInTheDocument()
  })

  it('ツールバーに件数表示がある', () => {
    mockedUseCases.mockReturnValue({
      cases: mockCases,
      loading: false,
      error: null,
    })

    render(
      <MemoryRouter>
        <CaseListPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('2件の事例')).toBeInTheDocument()
  })
})
