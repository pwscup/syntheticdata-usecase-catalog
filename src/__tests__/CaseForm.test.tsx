import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CaseForm from '../components/case-form/CaseForm'
import type { Case } from '../types'

const mockCase: Case = {
  id: 'case-edit-001',
  title: '編集テスト事例',
  region: '国内',
  domain: '医療',
  organization: 'テスト病院',
  usecase_category: ['組織内データ共有'],
  summary: 'テスト概要',
  value_proposition: 'テスト成果',
  privacy_enhancement_method: 'GAN',
  safety_assurance_method: 'k-匿名性',
  utility_evaluation_method: 'ベンチマーク',
  tags: ['医療', 'GAN'],
  sources: [
    { source_type: 'web', title: '出典1', url: 'https://example.com', note: 'メモ' },
  ],
  occurred_at: '2024-03',
  figures: [],
  status: 'user',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('CaseForm', () => {
  it('出典フィールドと分野・カテゴリが初期表示される', () => {
    render(<CaseForm onSubmit={() => {}} submitLabel="作成" />)

    expect(screen.getByText('出典（必須）')).toBeInTheDocument()
    expect(screen.getByLabelText('分野')).toBeInTheDocument()
    expect(screen.getByLabelText('発生時期')).toBeInTheDocument()
    expect(screen.getByText('カテゴリ（複数選択可）')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '作成' })).toBeInTheDocument()
  })

  it('発生時期フィールドにdefaultValuesがプリフィルされる', () => {
    render(<CaseForm defaultValues={mockCase} onSubmit={() => {}} submitLabel="更新" />)

    const occurredAtInput = screen.getByLabelText('発生時期') as HTMLInputElement
    expect(occurredAtInput).toHaveValue('2024-03')
  })

  it('折りたたみセクションが存在する', () => {
    render(<CaseForm onSubmit={() => {}} submitLabel="作成" />)

    expect(screen.getByText('基本情報')).toBeInTheDocument()
    expect(screen.getByText('技術情報')).toBeInTheDocument()
    expect(screen.getByText('タグ')).toBeInTheDocument()
  })

  it('折りたたみセクションを開くと中のフィールドが表示される', async () => {
    const user = userEvent.setup()
    render(<CaseForm onSubmit={() => {}} submitLabel="作成" />)

    // 基本情報セクションを開く
    await user.click(screen.getByText('基本情報'))

    expect(document.getElementById('title')).toBeInTheDocument()
    expect(screen.getByLabelText('地域')).toBeInTheDocument()
    expect(screen.getByLabelText('組織名')).toBeInTheDocument()
    expect(screen.getByLabelText('概要')).toBeInTheDocument()
  })

  it('URLのみ入力で submit できる（他は任意）', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CaseForm onSubmit={onSubmit} submitLabel="作成" />)

    // 出典URLのみ入力
    await user.type(screen.getByPlaceholderText('https://...'), 'https://example.com')

    await user.click(screen.getByRole('button', { name: '作成' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    const submitted = onSubmit.mock.calls[0][0] as Case
    expect(submitted.id).toBeTruthy()
    expect(submitted.status).toBe('user')
    expect(submitted.sources[0].url).toBe('https://example.com')
  })

  it('defaultValues がフォームにプリフィルされる', async () => {
    const user = userEvent.setup()
    render(<CaseForm defaultValues={mockCase} onSubmit={() => {}} submitLabel="更新" />)

    // 分野は初期表示
    expect(screen.getByLabelText('分野')).toHaveValue('医療')

    // 基本情報セクションを開く
    await user.click(screen.getByText('基本情報'))

    const titleInput = document.getElementById('title') as HTMLInputElement
    expect(titleInput).toHaveValue('編集テスト事例')
    expect(screen.getByLabelText('地域')).toHaveValue('国内')
    expect(screen.getByLabelText('組織名')).toHaveValue('テスト病院')
    expect(screen.getByLabelText('概要')).toHaveValue('テスト概要')

    expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument()
  })

  it('編集時はidとcreated_atが保持される', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CaseForm defaultValues={mockCase} onSubmit={onSubmit} submitLabel="更新" />)

    await user.click(screen.getByRole('button', { name: '更新' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    const submitted = onSubmit.mock.calls[0][0] as Case
    expect(submitted.id).toBe('case-edit-001')
    expect(submitted.created_at).toBe('2026-01-01T00:00:00Z')
    expect(submitted.status).toBe('user')
  })
})
