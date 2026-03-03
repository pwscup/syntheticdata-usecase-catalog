import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import SearchBar from '../components/case-list/SearchBar'

function renderSearchBar(props: { value?: string; onChange?: (v: string) => void } = {}) {
  const defaultOnChange = vi.fn()
  return render(
    <MemoryRouter>
      <SearchBar value={props.value ?? ''} onChange={props.onChange ?? defaultOnChange} />
    </MemoryRouter>,
  )
}

describe('SearchBar', () => {
  it('入力フィールドが表示される', () => {
    renderSearchBar()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('入力値が変わる', async () => {
    const user = userEvent.setup()
    renderSearchBar({ value: '' })
    const input = screen.getByRole('textbox')
    await user.type(input, 'テスト')
    expect(input).toHaveValue('テスト')
  })

  it('プレースホルダーが表示される', () => {
    renderSearchBar()
    expect(screen.getByPlaceholderText('キーワードで事例名・企業名を検索')).toBeInTheDocument()
  })
})
