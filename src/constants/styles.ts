/** Domain ごとの色定義 */
export const DOMAIN_COLORS = {
  '金融': { bg: 'bg-emerald-500', border: 'border-l-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  '医療': { bg: 'bg-rose-500', border: 'border-l-rose-500', badge: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' },
  '公共': { bg: 'bg-indigo-500', border: 'border-l-indigo-500', badge: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  '通信': { bg: 'bg-cyan-500', border: 'border-l-cyan-500', badge: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200' },
} as const

/** Region ごとの色定義 */
export const REGION_COLORS = {
  '国内': { bg: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  '国外': { bg: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
} as const

/** ユースケース分類ごとの色定義 */
export const CATEGORY_COLORS: Record<string, string> = {
  '組織内データ共有': 'bg-violet-500',
  '組織間データ共有': 'bg-purple-500',
  '外部分析者活用': 'bg-fuchsia-500',
  'R&D': 'bg-sky-500',
  'データ販売': 'bg-teal-500',
  'フィージビリティ検証': 'bg-orange-500',
}
