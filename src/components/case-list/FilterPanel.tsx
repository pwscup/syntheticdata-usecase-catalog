import { useState, useCallback } from 'react'
import type { Case } from '../../types'
import type { FilterState } from '../../hooks/useFilter'

interface FilterPanelProps {
  filters: FilterState
  filterOptions: Record<string, string[]>
  filteredCases: Case[]
  onToggle: (key: keyof Omit<FilterState, 'query' | 'sortBy' | 'page'>, value: string) => void
  onClear: () => void
}

function countByFieldValue(cases: Case[], field: string, value: string): number {
  return cases.filter(c => c[field as keyof Case] === value).length
}

const filterSections: { key: keyof Omit<FilterState, 'query' | 'sortBy' | 'page'>; label: string }[] = [
  { key: 'region', label: '地域' },
  { key: 'domain', label: '分野' },
  { key: 'usecase_category', label: 'ユースケース分類' },
]

export default function FilterPanel({ filters, filterOptions, filteredCases, onToggle, onClear }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters =
    filters.region.length > 0 ||
    filters.domain.length > 0 ||
    filters.usecase_category.length > 0

  const handleMobileToggle = useCallback(
    (key: keyof Omit<FilterState, 'query' | 'sortBy' | 'page'>, value: string) => {
      onToggle(key, value)
      setIsOpen(false)
    },
    [onToggle],
  )

  const handleMobileClear = useCallback(() => {
    onClear()
    setIsOpen(false)
  }, [onClear])

  const renderContent = (
    toggleFn: (key: keyof Omit<FilterState, 'query' | 'sortBy' | 'page'>, value: string) => void,
    clearFn: () => void,
  ) => (
    <div className="space-y-4">
      {filterSections.map((section) => {
        const options = filterOptions[section.key] ?? []
        if (options.length === 0) return null
        const selected = filters[section.key] as string[]

        return (
          <div key={section.key}>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {section.label}
              <span className="ml-1 text-gray-400 font-normal">({filteredCases.length})</span>
            </h3>
            <div className="space-y-1">
              {options.map((option) => {
                const count = countByFieldValue(filteredCases, section.key, option)
                const isChecked = selected.includes(option)
                const isZero = count === 0 && !isChecked
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2 text-sm cursor-pointer${isZero ? ' opacity-40' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFn(section.key, option)}
                      className="rounded border-gray-300"
                    />
                    <span className="flex-1">{option}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}

      {hasActiveFilters && (
        <button
          onClick={clearFn}
          className="w-full px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
          data-testid="clear-filters"
        >
          フィルタをクリア
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          {isOpen ? 'フィルタを閉じる' : 'フィルタを開く'}
          {hasActiveFilters && ' (適用中)'}
        </button>
      </div>

      {/* Mobile panel */}
      {isOpen && (
        <div className="md:hidden mb-4 p-4 bg-white rounded-lg shadow">
          {renderContent(handleMobileToggle, handleMobileClear)}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 shrink-0 p-4 bg-white rounded-lg shadow">
        {renderContent(onToggle, onClear)}
      </div>
    </>
  )
}
