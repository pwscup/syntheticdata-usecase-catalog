import { useCases } from '../context/CaseContext'
import { useFilter } from '../hooks/useFilter'
import CaseCard from '../components/case-list/CaseCard'
import SearchBar from '../components/case-list/SearchBar'
import FilterPanel from '../components/case-list/FilterPanel'
import SortSelect from '../components/case-list/SortSelect'
import SummaryPanel from '../components/case-list/SummaryPanel'
import ActiveFilterBadges from '../components/case-list/ActiveFilterBadges'
import Pagination from '../components/case-list/Pagination'

export default function CaseListPage() {
  const { cases, loading, error } = useCases()
  const {
    filters,
    setQuery,
    toggleFilter,
    clearFilters,
    setSortBy,
    setPage,
    filteredCases,
    paginatedCases,
    totalPages,
    filterOptions,
  } = useFilter(cases)

  if (loading) {
    return <p>読み込み中...</p>
  }

  if (error) {
    return <p className="text-red-600">エラー: {error}</p>
  }

  if (cases.length === 0) {
    return <p>ユースケースが見つかりません。</p>
  }

  const hasActiveFilters =
    filters.region.length > 0 ||
    filters.domain.length > 0 ||
    filters.usecase_category.length > 0 ||
    filters.technology_category.length > 0 ||
    filters.review_status.length > 0 ||
    filters.query !== ''

  return (
    <div>
      {/* Summary area - primary first view */}
      <SummaryPanel filteredCases={filteredCases} totalCases={cases.length} filters={filters} onToggleFilter={toggleFilter} />

      {/* Toolbar: count + search + sort in one row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {filteredCases.length === cases.length
            ? `${cases.length}件の事例`
            : `${cases.length}件中 ${filteredCases.length}件表示`}
        </span>
        <div className="flex-1 max-w-md">
          <SearchBar value={filters.query} onChange={setQuery} />
        </div>
        <SortSelect value={filters.sortBy} onChange={setSortBy} />
      </div>

      {/* Active filter badges */}
      <ActiveFilterBadges filters={filters} onToggleFilter={toggleFilter} onClearFilters={clearFilters} />

      <div className="flex gap-6">
        <FilterPanel
          filters={filters}
          filterOptions={filterOptions}
          filteredCases={filteredCases}
          onToggle={toggleFilter}
          onClear={clearFilters}
        />

        <div className="flex-1">
          {filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">条件に一致するユースケースがありません。</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  フィルタをクリアして全件表示
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedCases.map((c) => (
                  <CaseCard key={c.id} caseItem={c} />
                ))}
              </div>
              <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
