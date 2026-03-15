import type { DataFlowData } from '../../types'

interface DataFlowDiagramProps {
  data: DataFlowData
  icons?: [string, string, string]
}

const COLUMN_CONFIG = [
  {
    key: 'collect',
    label: '収集',
    categories: ['source', 'constraint'],
    bgClass: 'bg-blue-50',
    arrowClass: 'bg-blue-700',
    defaultIcon: '📊',
  },
  {
    key: 'generate',
    label: 'PETs適用',
    categories: ['process'],
    bgClass: 'bg-indigo-50',
    arrowClass: 'bg-indigo-700',
    defaultIcon: '⚙️',
  },
  {
    key: 'utilize',
    label: '価値創出',
    categories: ['application', 'outcome'],
    bgClass: 'bg-emerald-50',
    arrowClass: 'bg-emerald-700',
    defaultIcon: '🎯',
  },
]

export default function DataFlowDiagram({ data, icons }: DataFlowDiagramProps) {
  const columns = COLUMN_CONFIG.map((col, i) => ({
    ...col,
    icon: icons?.[i] ?? col.defaultIcon,
    nodes: data.nodes.filter((n) => col.categories.includes(n.category)),
  }))

  return (
    <div
      className="grid items-stretch gap-0"
      style={{ gridTemplateColumns: '1fr auto 1fr auto 1fr' }}
    >
      {columns.map((col, i) => (
        <>
          {/* Column card */}
          <div key={col.key} className={`rounded-lg ${col.bgClass} p-4 flex flex-col`}>
            {/* Icon area — fixed height */}
            <div className="h-12 flex items-center justify-center">
              <span className="text-2xl">{col.icon}</span>
            </div>

            {/* Arrow label — fixed height */}
            <div className="h-10 flex items-center">
              <div className={`${col.arrowClass} text-white text-xs font-bold px-4 py-1.5 text-center w-full whitespace-nowrap`}
                style={{
                  clipPath: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%)',
                  paddingLeft: i === 0 ? '12px' : '20px',
                }}
              >
                {col.label}
              </div>
            </div>

            {/* Node items — fixed min height */}
            <ul className="space-y-2 flex-1 min-h-[120px] mt-2">
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
            <div key={`arrow-${col.key}`} className="flex items-center px-1 text-gray-400 text-lg font-bold">▶</div>
          )}
        </>
      ))}
    </div>
  )
}
