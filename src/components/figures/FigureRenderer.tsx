import type { Figure, Case, DataFlowData, RiskMatrixData, UtilityChartData } from '../../types'
import DataFlowDiagram from './DataFlowDiagram'
import RiskMatrix from './RiskMatrix'
import UtilityChart from './UtilityChart'

const DOMAIN_ICON: Record<string, string> = {
  '金融': '💰',
  '医療': '🏥',
  '通信': '📡',
  '公共': '🏛️',
}

const CATEGORY_ICON: Record<string, string> = {
  '組織間データ共有': '🤝',
  '組織内データ共有': '🏢',
  '外部分析者活用': '👥',
  'R&D': '🔬',
  'データ販売': '📈',
  'フィージビリティ検証': '✅',
}

function getIcons(caseData?: Case): [string, string, string] | undefined {
  if (!caseData) return undefined
  const left = DOMAIN_ICON[caseData.domain] ?? '📊'
  const center = '⚙️'
  const right = CATEGORY_ICON[caseData.usecase_category[0]] ?? '🎯'
  return [left, center, right]
}

interface FigureRendererProps {
  figure: Figure
  caseData?: Case
}

export default function FigureRenderer({ figure, caseData }: FigureRendererProps) {
  return (
    <div className="rounded border border-gray-200 p-4">
      <h3 className="mb-2 font-semibold">{figure.title}</h3>
      {figure.type === 'data_flow' && (
        <DataFlowDiagram data={figure.data as DataFlowData} icons={getIcons(caseData)} />
      )}
      {figure.type === 'risk_matrix' && (
        <RiskMatrix data={figure.data as RiskMatrixData} />
      )}
      {figure.type === 'utility_chart' && (
        <UtilityChart data={figure.data as UtilityChartData} />
      )}
      {figure.note && (
        <p className="mt-2 text-sm text-gray-500">{figure.note}</p>
      )}
    </div>
  )
}
