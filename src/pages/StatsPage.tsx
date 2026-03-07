import { useMemo } from 'react'
import { useCases } from '../context/CaseContext'
import { TECHNOLOGY_CATEGORY_LABELS, REVIEW_STATUS_LABELS } from '../constants/categories'
import { TECHNOLOGY_CATEGORY_COLORS, DOMAIN_COLORS, REGION_COLORS, REVIEW_STATUS_COLORS } from '../constants/styles'

interface BarItem {
  label: string
  count: number
  color: string
}

function HorizontalBarChart({ title, items, maxCount }: { title: string; items: BarItem[]; maxCount: number }) {
  return (
    <div className="bg-white rounded-lg shadow px-5 py-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-28 shrink-0 text-right truncate" title={item.label}>
              {item.label}
            </span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-300`}
                style={{ width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%', minWidth: item.count > 0 ? '8px' : '0' }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-700 w-8 text-right">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineChart({ title, data }: { title: string; data: { year: string; count: number }[] }) {
  if (data.length === 0) return null
  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const chartHeight = 160

  return (
    <div className="bg-white rounded-lg shadow px-5 py-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="flex items-end gap-1 h-[180px]">
        {data.map((d) => {
          const barHeight = (d.count / maxCount) * chartHeight
          return (
            <div key={d.year} className="flex-1 flex flex-col items-center justify-end gap-1">
              <span className="text-[10px] font-semibold text-gray-700">{d.count}</span>
              <div
                className="w-full max-w-10 bg-blue-500 rounded-t transition-all duration-300"
                style={{ height: `${barHeight}px` }}
              />
              <span className="text-[10px] text-gray-500 -rotate-45 origin-top-left whitespace-nowrap mt-1">
                {d.year}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TechTimelineChart({ title, data }: {
  title: string
  data: { year: string; counts: Record<string, number> }[]
}) {
  if (data.length === 0) return null
  const techs = Object.keys(TECHNOLOGY_CATEGORY_LABELS)
  const maxCount = Math.max(...data.flatMap((d) => Object.values(d.counts)), 1)
  const chartHeight = 140

  return (
    <div className="bg-white rounded-lg shadow px-5 py-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {/* SVG line chart */}
      <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
        <svg viewBox={`0 0 ${data.length * 60} ${chartHeight + 30}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={0}
              y1={chartHeight - ratio * chartHeight}
              x2={data.length * 60}
              y2={chartHeight - ratio * chartHeight}
              stroke="#e5e7eb"
              strokeWidth={0.5}
            />
          ))}
          {/* Lines per tech */}
          {techs.map((tech) => {
            const color = TECHNOLOGY_CATEGORY_COLORS[tech]?.replace('bg-', '') ?? 'gray-400'
            const strokeColor = colorToHex(color)
            const points = data.map((d, i) => {
              const x = i * 60 + 30
              const y = chartHeight - (d.counts[tech] ?? 0) / maxCount * chartHeight
              return `${x},${y}`
            }).join(' ')

            return (
              <g key={tech}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                {data.map((d, i) => {
                  const x = i * 60 + 30
                  const y = chartHeight - (d.counts[tech] ?? 0) / maxCount * chartHeight
                  const count = d.counts[tech] ?? 0
                  if (count === 0) return null
                  return (
                    <circle key={i} cx={x} cy={y} r={3} fill={strokeColor}>
                      <title>{`${TECHNOLOGY_CATEGORY_LABELS[tech]}: ${count}件 (${d.year})`}</title>
                    </circle>
                  )
                })}
              </g>
            )
          })}
          {/* X-axis labels */}
          {data.map((d, i) => (
            <text key={d.year} x={i * 60 + 30} y={chartHeight + 18} textAnchor="middle" fontSize={10} fill="#6b7280">
              {d.year}
            </text>
          ))}
        </svg>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2">
        {techs.map((tech) => (
          <div key={tech} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`inline-block w-3 h-3 rounded-sm ${TECHNOLOGY_CATEGORY_COLORS[tech] ?? 'bg-gray-400'}`} />
            {TECHNOLOGY_CATEGORY_LABELS[tech]}
          </div>
        ))}
      </div>
    </div>
  )
}

function colorToHex(twColor: string): string {
  const map: Record<string, string> = {
    'lime-500': '#84cc16',
    'violet-500': '#8b5cf6',
    'amber-500': '#f59e0b',
    'sky-500': '#0ea5e9',
    'rose-500': '#f43f5e',
    'emerald-500': '#10b981',
    'indigo-500': '#6366f1',
    'cyan-500': '#06b6d4',
    'blue-500': '#3b82f6',
    'yellow-500': '#eab308',
    'green-500': '#22c55e',
    'red-500': '#ef4444',
  }
  return map[twColor] ?? '#9ca3af'
}

function KpiCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-white rounded-lg shadow px-5 py-4 text-center">
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function StatsPage() {
  const { cases, loading, error } = useCases()

  const stats = useMemo(() => {
    if (cases.length === 0) return null

    // Technology category counts
    const techCounts = new Map<string, number>()
    for (const c of cases) {
      for (const tech of c.technology_category ?? []) {
        techCounts.set(tech, (techCounts.get(tech) ?? 0) + 1)
      }
    }
    const techItems: BarItem[] = Object.keys(TECHNOLOGY_CATEGORY_LABELS).map((key) => ({
      label: TECHNOLOGY_CATEGORY_LABELS[key],
      count: techCounts.get(key) ?? 0,
      color: TECHNOLOGY_CATEGORY_COLORS[key] ?? 'bg-gray-400',
    }))

    // Domain counts
    const domainCounts = new Map<string, number>()
    for (const c of cases) {
      domainCounts.set(c.domain, (domainCounts.get(c.domain) ?? 0) + 1)
    }
    const domainItems: BarItem[] = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({
        label,
        count,
        color: DOMAIN_COLORS[label as keyof typeof DOMAIN_COLORS]?.bg ?? 'bg-gray-400',
      }))

    // Region counts
    const regionCounts = new Map<string, number>()
    for (const c of cases) {
      if (c.region) regionCounts.set(c.region, (regionCounts.get(c.region) ?? 0) + 1)
    }
    const regionItems: BarItem[] = Array.from(regionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({
        label,
        count,
        color: REGION_COLORS[label as keyof typeof REGION_COLORS]?.bg ?? 'bg-gray-400',
      }))

    // Review status counts
    const reviewCounts = new Map<string, number>()
    for (const c of cases) {
      if (c.review_status) reviewCounts.set(c.review_status, (reviewCounts.get(c.review_status) ?? 0) + 1)
    }
    const reviewItems: BarItem[] = Object.keys(REVIEW_STATUS_LABELS).map((key) => ({
      label: REVIEW_STATUS_LABELS[key],
      count: reviewCounts.get(key) ?? 0,
      color: REVIEW_STATUS_COLORS[key]?.bg ?? 'bg-gray-400',
    }))

    // Usecase category counts
    const usecaseCounts = new Map<string, number>()
    for (const c of cases) {
      for (const cat of c.usecase_category) {
        usecaseCounts.set(cat, (usecaseCounts.get(cat) ?? 0) + 1)
      }
    }
    const usecaseItems: BarItem[] = Array.from(usecaseCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({
        label,
        count,
        color: 'bg-purple-500',
      }))

    // Timeline: cases by created_at year
    const yearCounts = new Map<string, number>()
    for (const c of cases) {
      const year = c.created_at.slice(0, 4)
      yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1)
    }
    const timelineData = Array.from(yearCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, count]) => ({ year, count }))

    // Tech timeline: cases by year and technology_category
    const techYearCounts = new Map<string, Record<string, number>>()
    for (const c of cases) {
      const year = c.created_at.slice(0, 4)
      if (!techYearCounts.has(year)) techYearCounts.set(year, {})
      const yearMap = techYearCounts.get(year)!
      for (const tech of c.technology_category ?? []) {
        yearMap[tech] = (yearMap[tech] ?? 0) + 1
      }
    }
    const techTimelineData = Array.from(techYearCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, counts]) => ({ year, counts }))

    // Organization count
    const orgs = new Set(cases.map((c) => c.organization))

    return {
      total: cases.length,
      orgCount: orgs.size,
      techItems,
      domainItems,
      regionItems,
      reviewItems,
      usecaseItems,
      timelineData,
      techTimelineData,
    }
  }, [cases])

  if (loading) return <p>読み込み中...</p>
  if (error) return <p className="text-red-600">エラー: {error}</p>
  if (!stats) return <p>データがありません。</p>

  const maxTech = Math.max(...stats.techItems.map((i) => i.count), 1)
  const maxDomain = Math.max(...stats.domainItems.map((i) => i.count), 1)
  const maxRegion = Math.max(...stats.regionItems.map((i) => i.count), 1)
  const maxReview = Math.max(...stats.reviewItems.map((i) => i.count), 1)
  const maxUsecase = Math.max(...stats.usecaseItems.map((i) => i.count), 1)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">統計情報</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="総事例数" value={stats.total} />
        <KpiCard label="組織数" value={stats.orgCount} />
        <KpiCard label="技術カテゴリ数" value={stats.techItems.filter((i) => i.count > 0).length} sub={`/ ${stats.techItems.length}`} />
        <KpiCard label="レビュー済" value={stats.reviewItems.find((i) => i.label === 'レビュー済')?.count ?? 0} sub={`/ ${stats.total}件`} />
      </div>

      {/* Tech timeline */}
      <TechTimelineChart title="技術カテゴリ別 事例数の推移" data={stats.techTimelineData} />

      {/* Timeline */}
      <TimelineChart title="年別 事例追加数" data={stats.timelineData} />

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HorizontalBarChart title="技術カテゴリ別" items={stats.techItems} maxCount={maxTech} />
        <HorizontalBarChart title="分野別" items={stats.domainItems} maxCount={maxDomain} />
        <HorizontalBarChart title="地域別" items={stats.regionItems} maxCount={maxRegion} />
        <HorizontalBarChart title="ユースケース分類別" items={stats.usecaseItems} maxCount={maxUsecase} />
        <HorizontalBarChart title="レビュー状態別" items={stats.reviewItems} maxCount={maxReview} />
      </div>
    </div>
  )
}
