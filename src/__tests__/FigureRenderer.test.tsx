import { render, screen } from '@testing-library/react'
import FigureRenderer from '../components/figures/FigureRenderer'
import type { Figure, DataFlowData, RiskMatrixData, UtilityChartData } from '../types'

describe('FigureRenderer', () => {
  it('data_flow typeのFigureで3列レイアウトが描画される', () => {
    const data: DataFlowData = {
      nodes: [
        { id: 'n1', label: '元データ', category: 'source' },
        { id: 'n2', label: 'プライバシー制約', category: 'constraint' },
        { id: 'n3', label: 'GAN で生成', category: 'process' },
        { id: 'n4', label: '分析に活用', category: 'application' },
      ],
      edges: [],
    }
    const figure: Figure = {
      type: 'data_flow',
      title: 'データフロー図',
      data,
      note: 'テスト注記',
    }

    render(<FigureRenderer figure={figure} />)
    expect(screen.getByText('データフロー図')).toBeInTheDocument()
    // 3列ヘッダー
    expect(screen.getByText('データ収集')).toBeInTheDocument()
    expect(screen.getByText('合成データ生成')).toBeInTheDocument()
    expect(screen.getByText('データ活用')).toBeInTheDocument()
    // ノードラベル
    expect(screen.getByText('元データ')).toBeInTheDocument()
    expect(screen.getByText('プライバシー制約')).toBeInTheDocument()
    expect(screen.getByText('分析に活用')).toBeInTheDocument()
    expect(screen.getByText('テスト注記')).toBeInTheDocument()
  })

  it('risk_matrix typeのFigureでRiskMatrixが描画される', () => {
    const data: RiskMatrixData = {
      axes: {
        impact_levels: ['低', '高'],
        likelihood_levels: ['稀', '頻繁'],
      },
      cells: [
        { impact: '高', likelihood: '頻繁', note: '要対策' },
      ],
    }
    const figure: Figure = {
      type: 'risk_matrix',
      title: 'リスクマトリクス',
      data,
      note: '',
    }

    render(<FigureRenderer figure={figure} />)
    expect(screen.getByText('リスクマトリクス')).toBeInTheDocument()
    expect(screen.getByText('低')).toBeInTheDocument()
    expect(screen.getByText('高')).toBeInTheDocument()
    expect(screen.getByText('稀')).toBeInTheDocument()
    expect(screen.getByText('頻繁')).toBeInTheDocument()
    expect(screen.getByText('要対策')).toBeInTheDocument()
  })

  it('utility_chart typeのFigureでUtilityChartが描画される', () => {
    const data: UtilityChartData = {
      series: [
        {
          name: '精度',
          points: [
            { x: '100件', y: 0.85 },
            { x: '1000件', y: 0.92 },
          ],
        },
      ],
    }
    const figure: Figure = {
      type: 'utility_chart',
      title: '有用性チャート',
      data,
      note: 'チャート注記',
    }

    render(<FigureRenderer figure={figure} />)
    expect(screen.getByText('有用性チャート')).toBeInTheDocument()
    expect(screen.getByText('精度')).toBeInTheDocument()
    expect(screen.getByText('100件')).toBeInTheDocument()
    expect(screen.getByText('0.85')).toBeInTheDocument()
    expect(screen.getByText('1000件')).toBeInTheDocument()
    expect(screen.getByText('0.92')).toBeInTheDocument()
    expect(screen.getByText('チャート注記')).toBeInTheDocument()
  })

  it('noteが空の場合は注記が表示されない', () => {
    const data: DataFlowData = {
      nodes: [{ id: 'n1', label: 'ノード', category: 'source' }],
      edges: [],
    }
    const figure: Figure = {
      type: 'data_flow',
      title: 'タイトル',
      data,
      note: '',
    }

    const { container } = render(<FigureRenderer figure={figure} />)
    const ps = container.querySelectorAll('p.mt-2')
    expect(ps).toHaveLength(0)
  })
})
