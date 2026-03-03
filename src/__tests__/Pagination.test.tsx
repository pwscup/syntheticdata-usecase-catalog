import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../components/case-list/Pagination'

describe('Pagination', () => {
  it('totalPages <= 1の場合は非表示', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('totalPages > 1の場合にナビゲーションが表示される', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('前へ')).toBeInTheDocument()
    expect(screen.getByText('次へ')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('最初のページで「前へ」ボタンが無効', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('前へ')).toBeDisabled()
  })

  it('最後のページで「次へ」ボタンが無効', () => {
    render(<Pagination currentPage={3} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('次へ')).toBeDisabled()
  })

  it('ページ番号クリックでonPageChangeが呼ばれる', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />)
    await user.click(screen.getByText('2'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('「次へ」クリックでonPageChangeが呼ばれる', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />)
    await user.click(screen.getByText('次へ'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('現在ページにaria-currentが設定される', () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('2')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('1')).not.toHaveAttribute('aria-current')
  })
})
