import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AboutPage from '../pages/AboutPage'

describe('AboutPage', () => {
  it('アプリ名が表示される', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('プライバシー強化技術 活用事例カタログ')).toBeInTheDocument()
  })

  it('免責事項が表示される', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('免責事項')).toBeInTheDocument()
    expect(screen.getByText(/正確性、完全性、最新性について保証するものではありません/)).toBeInTheDocument()
  })

  it('機微情報の取り扱いについてが表示される', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('機微情報の取り扱いについて')).toBeInTheDocument()
    expect(screen.getByText(/機微情報を入力しないでください/)).toBeInTheDocument()
  })

  it('問い合わせ先が表示される', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('ご要望・お問い合わせ')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Issue' })).toHaveAttribute(
      'href',
      'https://github.com/pwscup/syntheticdata-usecase-catalog/issues',
    )
  })
})
