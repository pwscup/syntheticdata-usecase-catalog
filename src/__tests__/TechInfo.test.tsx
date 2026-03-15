import { render, screen } from '@testing-library/react'
import TechInfo from '../components/case-detail/TechInfo'

describe('TechInfo', () => {
  it('技術情報が表示される', () => {
    render(
      <TechInfo
        privacy_enhancement_method="GAN"
        safety_assurance_method="差分プライバシー"
        utility_evaluation_method="ベンチマーク"
      />,
    )
    expect(screen.getByText('技術情報')).toBeInTheDocument()
    expect(screen.getByText('GAN')).toBeInTheDocument()
    expect(screen.getByText('差分プライバシー')).toBeInTheDocument()
    expect(screen.getByText('ベンチマーク')).toBeInTheDocument()
  })

  it('「調査中」の場合にバッジで表示される', () => {
    render(
      <TechInfo
        privacy_enhancement_method="調査中"
        safety_assurance_method="調査中"
        utility_evaluation_method="調査中"
      />,
    )
    const badges = screen.getAllByText('調査中')
    expect(badges).toHaveLength(3)
    badges.forEach((badge) => {
      expect(badge.tagName).toBe('SPAN')
      expect(badge.className).toContain('bg-gray-200')
    })
  })

  it('通常値と「調査中」が混在する場合に正しく表示される', () => {
    render(
      <TechInfo
        privacy_enhancement_method="VAE"
        safety_assurance_method="調査中"
        utility_evaluation_method="統計評価"
      />,
    )
    expect(screen.getByText('VAE')).toBeInTheDocument()
    expect(screen.getByText('統計評価')).toBeInTheDocument()
    const badge = screen.getByText('調査中')
    expect(badge.className).toContain('bg-gray-200')
  })
})
