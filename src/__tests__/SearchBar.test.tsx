import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import SearchBar from '../components/case-list/SearchBar'

function renderSearchBar(props: { value?: string; onChange?: (v: string) => void } = {}) {
  const defaultOnChange = vi.fn()
  const onChange = props.onChange ?? defaultOnChange
  render(
    <MemoryRouter>
      <SearchBar value={props.value ?? ''} onChange={onChange} />
    </MemoryRouter>,
  )
  return { onChange }
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

  it('値がある時にクリアボタンが表示される', () => {
    renderSearchBar({ value: 'テスト' })
    expect(screen.getByLabelText('検索をクリア')).toBeInTheDocument()
  })

  it('値が空の時にクリアボタンが非表示', () => {
    renderSearchBar({ value: '' })
    expect(screen.queryByLabelText('検索をクリア')).not.toBeInTheDocument()
  })

  it('クリアボタンクリックでonChange("")が呼ばれる', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderSearchBar({ value: 'テスト', onChange })
    await user.click(screen.getByLabelText('検索をクリア'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
