import { useMemo } from 'react'
import type { Case } from '../../types'
import { buildSummary, type CountItem } from '../../lib/summary'
import { REGION_OPTIONS, DOMAIN_OPTIONS, USECASE_CATEGORY_OPTIONS, TECHNOLOGY_CATEGORY_OPTIONS, TECHNOLOGY_CATEGORY_LABELS } from '../../constants/categories'
import { DOMAIN_COLORS, REGION_COLORS, CATEGORY_COLORS, TECHNOLOGY_CATEGORY_COLORS } from '../../constants/styles'
import type { FilterState } from '../../hooks/useFilter'

interface SummaryPanelProps {
  filteredCases: Case[]
  totalCases: number
  filters: FilterState
  onToggleFilter: (key: 'region' | 'domain' | 'usecase_category' | 'technology_category' | 'review_status', value: string) => void
}

function mergeWithAllLabels(items: CountItem[], allLabels: readonly string[]): CountItem[] {
  const map = new Map(items.map((i) => [i.label, i]))
  return allLabels.map((label) => map.get(label) ?? { label, count: 0, percentage: 0 })
}

function StackedBar({
  items,
  colorMap,
  activeValues,
  onToggle,
  labelMap,
}: {
  items: CountItem[]
  colorMap: Record<string, string>
  activeValues: string[]
  onToggle: (value: string) => void
  labelMap?: Record<string, string>
}) {
  if (items.length === 0) return null

  return (
    <div>
      {/* Stacked bar */}
      <div className="flex h-7 rounded-full overflow-hidden bg-gray-100">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            title={`${labelMap?.[item.label] ?? item.label}: ${item.count}件 (${item.percentage}%)`}
            onClick={() => onToggle(item.label)}
            className={`h-full transition-all duration-150 hover:brightness-110 ${colorMap[item.label] ?? 'bg-gray-400'}`}
            style={{ width: `${item.percentage}%`, minWidth: item.percentage > 0 ? '4px' : '0' }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-1 gap-y-1 mt-2">
        {items.map((item) => {
          const isActive = activeValues.includes(item.label)
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onToggle(item.label)}
              className={`flex items-center gap-1 text-xs rounded-md px-1.5 py-0.5 transition-colors ${
                item.count === 0
                  ? 'opacity-40 cursor-default'
                  : isActive
                    ? 'bg-gray-200 ring-1 ring-gray-400 text-gray-900'
                    : 'hover:bg-gray-100 text-gray-600 cursor-pointer'
              }`}
              disabled={item.count === 0}
            >
              <span className={`inline-block w-2.5 h-2.5 rounded-sm shrink-0 ${colorMap[item.label] ?? 'bg-gray-400'}`} />
              {labelMap?.[item.label] ?? item.label}
              <span className="text-gray-400">{item.count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Derived flat color maps for StackedBar (bg only)
const regionColorMap = Object.fromEntries(
  Object.entries(REGION_COLORS).map(([k, v]) => [k, v.bg]),
)
const domainColorMap = Object.fromEntries(
  Object.entries(DOMAIN_COLORS).map(([k, v]) => [k, v.bg]),
)

export default function SummaryPanel({ filteredCases, totalCases, filters, onToggleFilter }: SummaryPanelProps) {
  const { summary, regionItems, domainItems, categoryItems, technologyItems } = useMemo(() => {
    const s = buildSummary(filteredCases)
    return {
      summary: s,
      regionItems: mergeWithAllLabels(s.byRegion, REGION_OPTIONS),
      domainItems: mergeWithAllLabels(s.byDomain, DOMAIN_OPTIONS),
      categoryItems: mergeWithAllLabels(s.byUsecaseCategory, USECASE_CATEGORY_OPTIONS),
      technologyItems: mergeWithAllLabels(s.byTechnologyCategory, TECHNOLOGY_CATEGORY_OPTIONS),
    }
  }, [filteredCases])

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
            {regionItems.map((r) => (
              <button
                key={r.label}
                type="button"
                title={`${r.label}: ${r.count}件 (${r.percentage}%)`}
                onClick={() => onToggleFilter('region', r.label)}
                className={`h-full transition-all duration-150 hover:brightness-110 ${regionColorMap[r.label] ?? 'bg-gray-400'}`}
                style={{ width: `${r.percentage}%`, minWidth: r.percentage > 0 ? '4px' : '0' }}
              />
            ))}
          </div>
          {/* Region labels */}
          <div className="flex gap-1">
            {regionItems.map((r) => {
              const isActive = filters.region.includes(r.label)
              return (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => onToggleFilter('region', r.label)}
                  className={`flex items-center gap-1 text-xs rounded-md px-1.5 py-0.5 transition-colors ${
                    r.count === 0
                      ? 'opacity-40 cursor-default'
                      : isActive
                        ? 'bg-gray-200 ring-1 ring-gray-400 text-gray-900'
                        : 'hover:bg-gray-100 text-gray-600 cursor-pointer'
                  }`}
                  disabled={r.count === 0}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-sm shrink-0 ${regionColorMap[r.label] ?? 'bg-gray-400'}`} />
                  {r.label}
                  <span className="font-semibold text-gray-800">{r.count}</span>
                  <span className="text-gray-400">({r.percentage}%)</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Technology category bar */}
      <div className="bg-white rounded-lg shadow px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">技術カテゴリ別</h3>
        <StackedBar
          items={technologyItems}
          colorMap={TECHNOLOGY_CATEGORY_COLORS}
          activeValues={filters.technology_category}
          onToggle={(v) => onToggleFilter('technology_category', v)}
          labelMap={TECHNOLOGY_CATEGORY_LABELS}
        />
      </div>

      {/* Distribution stacked bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">分野別</h3>
          <StackedBar
            items={domainItems}
            colorMap={domainColorMap}
            activeValues={filters.domain}
            onToggle={(v) => onToggleFilter('domain', v)}
          />
        </div>

        <div className="bg-white rounded-lg shadow px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">ユースケース分類別</h3>
          <StackedBar
            items={categoryItems}
            colorMap={CATEGORY_COLORS}
            activeValues={filters.usecase_category}
            onToggle={(v) => onToggleFilter('usecase_category', v)}
          />
        </div>
      </div>
    </div>
  )
}
