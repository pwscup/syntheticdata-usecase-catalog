import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Case } from '../types'

export const ITEMS_PER_PAGE = 12

export interface FilterState {
  query: string
  region: string[]
  domain: string[]
  usecase_category: string[]
  technology_category: string[]
  review_status: string[]
  sortBy: 'title' | 'updated_at_desc' | 'updated_at_asc' | 'domain'
  page: number
}

export interface UseFilterResult {
  filters: FilterState
  setQuery: (q: string) => void
  toggleFilter: (key: keyof Omit<FilterState, 'query' | 'sortBy' | 'page'>, value: string) => void
  clearFilters: () => void
  setSortBy: (sort: FilterState['sortBy']) => void
  setPage: (page: number) => void
  filteredCases: Case[]
  paginatedCases: Case[]
  totalPages: number
  filterOptions: Record<string, string[]>
}

const ARRAY_FILTER_KEYS = [
  'region',
  'domain',
  'usecase_category',
  'technology_category',
  'review_status',
] as const

function parseFiltersFromParams(params: URLSearchParams): FilterState {
  const filters: FilterState = {
    query: params.get('q') ?? '',
    region: [],
    domain: [],
    usecase_category: [],
    technology_category: [],
    review_status: [],
    sortBy: 'updated_at_desc',
    page: parseInt(params.get('page') ?? '1', 10),
  }

  for (const key of ARRAY_FILTER_KEYS) {
    const val = params.get(key)
    if (val) {
      filters[key] = val.split(',')
    }
  }

  const sortBy = params.get('sortBy')
  if (sortBy === 'title' || sortBy === 'updated_at_desc' || sortBy === 'updated_at_asc' || sortBy === 'domain') {
    filters.sortBy = sortBy
  }

  return filters
}

function filtersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.query) {
    params.set('q', filters.query)
  }

  for (const key of ARRAY_FILTER_KEYS) {
    if (filters[key].length > 0) {
      params.set(key, filters[key].join(','))
    }
  }

  if (filters.sortBy !== 'updated_at_desc') {
    params.set('sortBy', filters.sortBy)
  }

  if (filters.page > 1) {
    params.set('page', String(filters.page))
  }

  return params
}

function collectFilterOptions(cases: Case[]): Record<string, string[]> {
  const options: Record<string, Set<string>> = {
    region: new Set<string>(),
    domain: new Set<string>(),
    usecase_category: new Set<string>(),
    technology_category: new Set<string>(),
    review_status: new Set<string>(),
  }

  for (const c of cases) {
    if (c.region) options.region.add(c.region)
    options.domain.add(c.domain)
    for (const cat of c.usecase_category) {
      options.usecase_category.add(cat)
    }
    if (c.technology_category) {
      for (const tech of c.technology_category) {
        options.technology_category.add(tech)
      }
    }
    if (c.review_status) options.review_status.add(c.review_status)
  }

  const result: Record<string, string[]> = {}
  for (const [key, set] of Object.entries(options)) {
    result[key] = Array.from(set).sort()
  }
  return result
}

function matchesQuery(c: Case, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    c.title.toLowerCase().includes(q) ||
    c.summary.toLowerCase().includes(q) ||
    c.organization.toLowerCase().includes(q) ||
    (c.domain_sub?.toLowerCase().includes(q) ?? false) ||
    c.tags.some((tag) => tag.toLowerCase().includes(q))
  )
}

function matchesArrayFilter(value: string, filterValues: string[]): boolean {
  if (filterValues.length === 0) return true
  return filterValues.includes(value)
}

function applyFilters(cases: Case[], filters: FilterState): Case[] {
  return cases.filter((c) => {
    if (!matchesQuery(c, filters.query)) return false
    if (!matchesArrayFilter(c.region ?? '', filters.region)) return false
    if (!matchesArrayFilter(c.domain, filters.domain)) return false
    if (filters.usecase_category.length > 0 && !c.usecase_category.some(cat => filters.usecase_category.includes(cat))) return false
    if (filters.technology_category.length > 0 && !(c.technology_category ?? []).some(tech => filters.technology_category.includes(tech))) return false
    if (!matchesArrayFilter(c.review_status ?? '', filters.review_status)) return false
    return true
  })
}

function applySorting(cases: Case[], sortBy: FilterState['sortBy']): Case[] {
  const sorted = [...cases]
  switch (sortBy) {
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ja'))
      break
    case 'updated_at_desc':
      sorted.sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      break
    case 'updated_at_asc':
      sorted.sort((a, b) => a.updated_at.localeCompare(b.updated_at))
      break
    case 'domain':
      sorted.sort((a, b) => a.domain.localeCompare(b.domain, 'ja'))
      break
  }
  return sorted
}

export function useFilter(cases: Case[]): UseFilterResult {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams])

  const filterOptions = useMemo(() => collectFilterOptions(cases), [cases])

  const filteredCases = useMemo(() => {
    const filtered = applyFilters(cases, filters)
    return applySorting(filtered, filters.sortBy)
  }, [cases, filters])

  const updateParams = useCallback(
    (newFilters: FilterState) => {
      setSearchParams(filtersToParams(newFilters), { replace: true })
    },
    [setSearchParams],
  )

  const setQuery = useCallback(
    (q: string) => {
      const newFilters = { ...filters, query: q, page: 1 }
      updateParams(newFilters)
    },
    [filters, updateParams],
  )

  const toggleFilter = useCallback(
    (key: keyof Omit<FilterState, 'query' | 'sortBy' | 'page'>, value: string) => {
      const current = filters[key] as string[]
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      const newFilters = { ...filters, [key]: next, page: 1 }
      updateParams(newFilters)
    },
    [filters, updateParams],
  )

  const clearFilters = useCallback(() => {
    const newFilters: FilterState = {
      query: '',
      region: [],
      domain: [],
      usecase_category: [],
      technology_category: [],
      review_status: [],
      sortBy: 'updated_at_desc',
      page: 1,
    }
    updateParams(newFilters)
  }, [updateParams])

  const setSortBy = useCallback(
    (sort: FilterState['sortBy']) => {
      const newFilters = { ...filters, sortBy: sort, page: 1 }
      updateParams(newFilters)
    },
    [filters, updateParams],
  )

  const setPage = useCallback(
    (page: number) => {
      const newFilters = { ...filters, page }
      updateParams(newFilters)
    },
    [filters, updateParams],
  )

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / ITEMS_PER_PAGE))

  const paginatedCases = useMemo(() => {
    const start = (filters.page - 1) * ITEMS_PER_PAGE
    return filteredCases.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredCases, filters.page])

  return {
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
  }
}

// Pure functions exported for testing without router dependency
export { parseFiltersFromParams, filtersToParams, collectFilterOptions, applyFilters, applySorting }
