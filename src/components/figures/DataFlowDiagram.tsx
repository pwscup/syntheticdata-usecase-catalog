import type { DataFlowData } from '../../types'

interface DataFlowDiagramProps {
  data: DataFlowData
}

const COLUMN_CONFIG = [
  {
    key: 'collect',
    label: 'データ収集',
    categories: ['source', 'constraint'],
    bgClass: 'bg-blue-50',
    arrowClass: 'bg-blue-700',
    icon: '📊',
  },
  {
    key: 'generate',
    label: '合成データ生成',
    categories: ['process'],
    bgClass: 'bg-indigo-50',
    arrowClass: 'bg-indigo-700',
    icon: '⚙️',
  },
  {
    key: 'utilize',
    label: 'データ活用',
    categories: ['application', 'outcome'],
    bgClass: 'bg-emerald-50',
    arrowClass: 'bg-emerald-700',
    icon: '🎯',
  },
]

export default function DataFlowDiagram({ data }: DataFlowDiagramProps) {
  const columns = COLUMN_CONFIG.map((col) => ({
    ...col,
    nodes: data.nodes.filter((n) => col.categories.includes(n.category)),
  }))

  return (
    <div className="grid grid-cols-3 gap-0 items-stretch">
      {columns.map((col, i) => (
        <div key={col.key} className="flex items-stretch">
          {/* Column card */}
          <div className={`flex-1 rounded-lg ${col.bgClass} p-4 flex flex-col`}>
            {/* Icon + header */}
            <div className="text-center mb-3">
              <span className="text-2xl">{col.icon}</span>
            </div>

            {/* Arrow label */}
            <div className="relative mb-4">
              <div className={`${col.arrowClass} text-white text-xs font-bold px-4 py-1.5 text-center`}
                style={{
                  clipPath: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)',
                  paddingLeft: i === 0 ? '12px' : '20px',
                }}
              >
                {col.label}
              </div>
            </div>

            {/* Node items */}
            <ul className="space-y-2 flex-1">
              {col.nodes.map((node) => (
                <li key={node.id} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${col.arrowClass}`} />
                  <span className="text-gray-800">{node.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow connector between columns */}
          {i < columns.length - 1 && (
            <div className="flex items-center px-1 text-gray-400 text-lg font-bold">▶</div>
          )}
        </div>
      ))}
    </div>
  )
}
