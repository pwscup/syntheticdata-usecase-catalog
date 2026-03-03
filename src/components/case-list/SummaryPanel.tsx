import { useMemo } from 'react'
import type { Case } from '../../types'
import type { FilterState } from '../../hooks/useFilter'
import { buildSummary, type CountItem } from '../../lib/summary'

type FilterKey = keyof Omit<FilterState, 'query' | 'sortBy'>

interface SummaryPanelProps {
  filteredCases: Case[]
  totalCases: number
  filters: FilterState
  onToggleFilter: (key: FilterKey, value: string) => void
}

function StackedBar({
  items,
  colorMap,
  filterKey,
  activeValues,
  onToggle,
}: {
  items: CountItem[]
  colorMap: Record<string, string>
  filterKey: FilterKey
  activeValues: string[]
  onToggle: (key: FilterKey, value: string) => void
}) {
  if (items.length === 0) return null

  return (
    <div>
      {/* Stacked bar */}
      <div className="flex h-7 rounded-full overflow-hidden bg-gray-100">
        {items.map((item) => {
          const isActive = activeValues.includes(item.label)
          return (
            <button
              key={item.label}
              type="button"
              title={`${item.label}: ${item.count}件 (${item.percentage}%) — クリックで絞り込み`}
              className={`h-full cursor-pointer transition-all duration-150 ${colorMap[item.label] ?? 'bg-gray-400'} ${isActive ? 'ring-2 ring-offset-1 ring-gray-800 brightness-110' : 'hover:brightness-125 hover:scale-y-110'}`}
              style={{ width: `${item.percentage}%`, minWidth: item.percentage > 0 ? '4px' : '0' }}
              onClick={() => onToggle(filterKey, item.label)}
            />
          )
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-1 gap-y-1 mt-2">
        {items.map((item) => {
          const isActive = activeValues.includes(item.label)
          return (
            <button
              key={item.label}
              type="button"
              className={`flex items-center gap-1 text-xs cursor-pointer rounded-md px-1.5 py-0.5 transition-all duration-150 ${isActive ? 'font-semibold text-gray-900 bg-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:underline'}`}
              onClick={() => onToggle(filterKey, item.label)}
            >
              <span className={`inline-block w-2.5 h-2.5 rounded-sm shrink-0 ${colorMap[item.label] ?? 'bg-gray-400'}`} />
              {item.label}
              <span className="text-gray-400">{item.count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const regionColors: Record<string, string> = {
  '国内': 'bg-blue-500',
  '国外': 'bg-amber-500',
}

const domainColors: Record<string, string> = {
  '金融': 'bg-emerald-500',
  '医療': 'bg-rose-500',
  '公共': 'bg-indigo-500',
  '通信': 'bg-cyan-500',
}

const categoryColors: Record<string, string> = {
  '組織内データ共有': 'bg-violet-500',
  '組織間データ共有': 'bg-purple-500',
  '外部分析者活用': 'bg-fuchsia-500',
  'R&D': 'bg-sky-500',
  'データ販売': 'bg-teal-500',
  'フィージビリティ検証': 'bg-orange-500',
}

export default function SummaryPanel({ filteredCases, totalCases, filters, onToggleFilter }: SummaryPanelProps) {
  const summary = useMemo(() => buildSummary(filteredCases), [filteredCases])

  const isFiltered = filteredCases.length !== totalCases

  return (
    <div className="mb-6 space-y-3">
      {/* KPI + Region — single compact card */}
      <div className="bg-white rounded-lg shadow px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        {/* Total */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-gray-900">{summary.total}</span>
          <span className="text-sm text-gray-500">件{isFiltered ? ` / 全${totalCases}件` : ''}</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-200" />

        {/* Region bar + labels */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mini stacked bar for region */}
          <div className="flex h-5 flex-1 max-w-48 rounded-full overflow-hidden bg-gray-100">
            {summary.byRegion.map((r) => {
              const isActive = filters.region.includes(r.label)
              return (
                <button
                  key={r.label}
                  type="button"
                  title={`${r.label}: ${r.count}件 (${r.percentage}%) — クリックで絞り込み`}
                  className={`h-full cursor-pointer transition-all duration-150 ${regionColors[r.label] ?? 'bg-gray-400'} ${isActive ? 'ring-2 ring-offset-1 ring-gray-800 brightness-110' : 'hover:brightness-125'}`}
                  style={{ width: `${r.percentage}%`, minWidth: r.percentage > 0 ? '4px' : '0' }}
                  onClick={() => onToggleFilter('region', r.label)}
                />
              )
            })}
          </div>
          {/* Region labels */}
          <div className="flex gap-1">
            {summary.byRegion.map((r) => {
              const isActive = filters.region.includes(r.label)
              return (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => onToggleFilter('region', r.label)}
                  className={`flex items-center gap-1 text-xs cursor-pointer rounded-md px-1.5 py-0.5 transition-all duration-150 ${isActive ? 'font-semibold text-gray-900 bg-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:underline'}`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-sm shrink-0 ${regionColors[r.label] ?? 'bg-gray-400'}`} />
                  {r.label}
                  <span className="font-semibold text-gray-800">{r.count}</span>
                  <span className="text-gray-400">({r.percentage}%)</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Distribution stacked bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">分野別</h3>
          <StackedBar
            items={summary.byDomain}
            colorMap={domainColors}
            filterKey="domain"
            activeValues={filters.domain}
            onToggle={onToggleFilter}
          />
        </div>

        <div className="bg-white rounded-lg shadow px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">ユースケース分類別</h3>
          <StackedBar
            items={summary.byUsecaseCategory}
            colorMap={categoryColors}
            filterKey="usecase_category"
            activeValues={filters.usecase_category}
            onToggle={onToggleFilter}
          />
        </div>
      </div>
    </div>
  )
}
