import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CaseDetailPage from '../pages/CaseDetailPage'
import { useCases } from '../context/CaseContext'
import type { Case } from '../types'

const mockCase: Case = {
  id: 'case-001',
  title: 'テスト事例タイトル',
  region: '国内',
  domain: '医療',
  organization: 'テスト病院',
  usecase_category: ['組織内データ共有'],
  summary: 'テスト概要の内容です',
  value_proposition: 'テスト成果の内容です',
  synthetic_generation_method: 'GAN',
  safety_evaluation_method: '調査中',
  utility_evaluation_method: 'ベンチマーク評価',
  domain_sub: '研究',
  tags: ['ゲノミクス'],
  sources: [
    { source_type: 'web', title: '出典1', url: 'https://example.com', note: 'メモ' },
  ],
  figures: [],
  technology_category: ['synthetic_data'],
  review_status: 'ai_generated',
  status: 'seed',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

vi.mock('../context/CaseContext', async () => {
  const actual = await vi.importActual<typeof import('../context/CaseContext')>('../context/CaseContext')
  return {
    ...actual,
    useCases: vi.fn(),
  }
})

const mockedUseCases = vi.mocked(useCases)

function renderWithRoute(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/cases/${id}`]}>
      <Routes>
        <Route path="/cases/:id" element={<CaseDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CaseDetailPage', () => {
  beforeEach(() => {
    mockedUseCases.mockReturnValue({
      cases: [mockCase],
      loading: false,
      error: null,
    })
  })

  it('ヘッダーにtitleとorganizationが表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByText('テスト事例タイトル')).toBeInTheDocument()
    expect(screen.getByText('テスト病院')).toBeInTheDocument()
  })

  it('左カラムにsummaryが「課題と解決」として表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByText('課題と解決')).toBeInTheDocument()
    expect(screen.getByText('テスト概要の内容です')).toBeInTheDocument()
  })

  it('左カラムにvalue_propositionが「得られた価値」として表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByText('得られた価値')).toBeInTheDocument()
    expect(screen.getByText('テスト成果の内容です')).toBeInTheDocument()
  })

  it('region, domain, usecase_categoryのバッジが表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByText('国内')).toBeInTheDocument()
    expect(screen.getByText('医療')).toBeInTheDocument()
    expect(screen.getByText('組織内データ共有')).toBeInTheDocument()
  })

  it('技術詳細が折りたたみで表示される', async () => {
    renderWithRoute('case-001')
    expect(screen.getByText('技術詳細')).toBeInTheDocument()
    expect(screen.queryByTestId('tech-details')).not.toBeInTheDocument()
  })

  it('概要図プレースホルダーが右カラムに表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByTestId('figure-placeholder')).toBeInTheDocument()
    expect(screen.getByText('準備中')).toBeInTheDocument()
  })

  it('関連タグセクションが表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByText('関連タグ')).toBeInTheDocument()
  })

  it('domain_subがteal系ピルで表示される', () => {
    renderWithRoute('case-001')
    const subTag = screen.getByText('研究')
    expect(subTag).toBeInTheDocument()
    expect(subTag.closest('a')).toHaveAttribute('href', '/?q=%E7%A0%94%E7%A9%B6')
  })

  it('tagsがslate系ピルで表示されクリックで遷移する', () => {
    renderWithRoute('case-001')
    const tag = screen.getByText('ゲノミクス')
    expect(tag).toBeInTheDocument()
    expect(tag.closest('a')).toHaveAttribute('href', '/?q=%E3%82%B2%E3%83%8E%E3%83%9F%E3%82%AF%E3%82%B9')
  })

  it('出典がフッターに表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByText('出典1')).toBeInTheDocument()
  })

  it('存在しないidの場合に「事例が見つかりません」が表示される', () => {
    renderWithRoute('nonexistent')
    expect(screen.getByText('事例が見つかりません')).toBeInTheDocument()
  })

  it('「一覧に戻る」リンクが存在する', () => {
    renderWithRoute('case-001')
    const backLink = screen.getByText('← 一覧に戻る')
    expect(backLink).toBeInTheDocument()
    expect(backLink.closest('a')).toHaveAttribute('href', '/')
  })

  it('「編集」リンクが存在する', () => {
    renderWithRoute('case-001')
    const editLink = screen.getByText('編集')
    expect(editLink.closest('a')).toHaveAttribute('href', '/cases/case-001/edit')
  })

  it('review_statusバッジが表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByTestId('review-status-badge')).toBeInTheDocument()
    expect(screen.getByText('AI生成')).toBeInTheDocument()
  })

  it('AI生成の注意書きが表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByTestId('review-alert')).toBeInTheDocument()
    expect(screen.getByText(/この事例はAIにより生成されました/)).toBeInTheDocument()
  })

  it('human_reviewedの場合は注意書きが表示されない', () => {
    mockedUseCases.mockReturnValue({
      cases: [{ ...mockCase, review_status: 'human_reviewed' }],
      loading: false,
      error: null,
    })
    renderWithRoute('case-001')
    expect(screen.queryByTestId('review-alert')).not.toBeInTheDocument()
  })

  it('technology_categoryバッジが表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByText('合成データ')).toBeInTheDocument()
  })
})
