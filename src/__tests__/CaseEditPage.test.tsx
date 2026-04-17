import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CaseEditPage from '../pages/CaseEditPage'
import { useCases } from '../context/CaseContext'
import type { Case } from '../types'

const mockCase: Case = {
  id: 'case-001',
  title: 'テスト事例タイトル',
  region: '国内',
  domain: '医療',
  organization: 'テスト病院',
  usecase_category: ['組織内データ共有'],
  technology_category: ['synthetic_data'],
  review_status: 'ai_generated',
  summary: 'テスト概要の内容です',
  value_proposition: 'テスト成果の内容です',
  privacy_enhancement_method: 'GAN',
  safety_assurance_method: '調査中',
  utility_evaluation_method: 'ベンチマーク評価',
  tags: ['医療'],
  sources: [
    { source_type: 'web', title: '出典1', url: 'https://example.com', note: '' },
  ],
  figures: [],
  status: 'user',
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
    <MemoryRouter initialEntries={[`/cases/${id}/edit`]}>
      <Routes>
        <Route path="/cases/:id/edit" element={<CaseEditPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CaseEditPage', () => {
  beforeEach(() => {
    mockedUseCases.mockReturnValue({
      cases: [mockCase],
      loading: false,
      error: null,
    })
  })

  it('編集フォームが表示される', () => {
    renderWithRoute('case-001')

    expect(screen.getByText('ケース編集')).toBeInTheDocument()
    expect(screen.getByLabelText('分野')).toHaveValue('医療')
    expect(screen.getByRole('button', { name: 'プレビュー' })).toBeInTheDocument()
  })

  it('存在しないidの場合にエラー表示', () => {
    renderWithRoute('nonexistent')

    expect(screen.getByText('事例が見つかりません')).toBeInTheDocument()
  })

  it('編集フォームに「レビュー状況」セクションが表示される', () => {
    renderWithRoute('case-001')
    expect(screen.getByText('レビュー状況')).toBeInTheDocument()
    expect(screen.getByTestId('review-status-options')).toBeInTheDocument()
  })

  it('ai_generated → human_reviewed を選択するとチェックリストが表示される', async () => {
    const user = userEvent.setup()
    renderWithRoute('case-001')
    expect(screen.queryByTestId('review-checklist')).not.toBeInTheDocument()
    const humanReviewedRadio = screen.getByLabelText(/レビュー済/) as HTMLInputElement
    await user.click(humanReviewedRadio)
    expect(screen.getByTestId('review-checklist')).toBeInTheDocument()
  })

  it('review_status を変更してプレビューに進むとtransitionバナーが表示される', async () => {
    const user = userEvent.setup()
    renderWithRoute('case-001')
    const humanReviewedRadio = screen.getByLabelText(/レビュー済/) as HTMLInputElement
    await user.click(humanReviewedRadio)
    // submit the form
    const previewBtn = screen.getByRole('button', { name: 'プレビュー' })
    fireEvent.click(previewBtn)
    // findByTestId to allow async update
    expect(await screen.findByTestId('review-transition-banner')).toBeInTheDocument()
    expect(screen.getByTestId('review-transition-commit-message').textContent).toContain('review:')
    expect(screen.getByTestId('review-transition-commit-message').textContent).toContain('AI生成')
    expect(screen.getByTestId('review-transition-commit-message').textContent).toContain('レビュー済')
  })

  it('review_status を変更しなければtransitionバナーは表示されない', () => {
    renderWithRoute('case-001')
    const previewBtn = screen.getByRole('button', { name: 'プレビュー' })
    fireEvent.click(previewBtn)
    expect(screen.queryByTestId('review-transition-banner')).not.toBeInTheDocument()
  })
})
