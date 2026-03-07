import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/layout/Header'

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  it('アプリ名が表示される', () => {
    renderHeader()
    expect(screen.getByText('プライバシー強化技術 活用事例カタログ')).toBeInTheDocument()
  })

  it('一覧リンクが存在する', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: '一覧' })).toHaveAttribute('href', '/')
  })

  it('新規作成リンクが存在する', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: '新規作成' })).toHaveAttribute('href', '/cases/new')
  })

  it('設定リンクが存在する', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: '設定' })).toHaveAttribute('href', '/settings')
  })

  it('Aboutリンクが存在する', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
  })
})
