/** Domain ごとの色定義 */
export const DOMAIN_COLORS = {
  '金融': { bg: 'bg-emerald-500', border: 'border-l-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  '医療': { bg: 'bg-rose-500', border: 'border-l-rose-500', badge: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' },
  '公共': { bg: 'bg-indigo-500', border: 'border-l-indigo-500', badge: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  '通信': { bg: 'bg-cyan-500', border: 'border-l-cyan-500', badge: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200' },
  'モビリティ': { bg: 'bg-blue-500', border: 'border-l-blue-500', badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  'IT': { bg: 'bg-purple-500', border: 'border-l-purple-500', badge: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' },
  'エネルギー': { bg: 'bg-amber-500', border: 'border-l-amber-500', badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  '小売': { bg: 'bg-orange-500', border: 'border-l-orange-500', badge: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
  '製造': { bg: 'bg-teal-500', border: 'border-l-teal-500', badge: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' },
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
  '公的利用': 'bg-indigo-500',
}

/** 技術カテゴリごとの色定義 */
export const TECHNOLOGY_CATEGORY_COLORS: Record<string, string> = {
  synthetic_data: 'bg-lime-500',
  differential_privacy: 'bg-violet-500',
  anonymization: 'bg-amber-500',
  federated_learning: 'bg-sky-500',
  secure_computation: 'bg-rose-500',
}

/** レビュー状態ごとの色定義 */
export const REVIEW_STATUS_COLORS: Record<string, { bg: string; badge: string }> = {
  ai_generated: { bg: 'bg-yellow-500', badge: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-300' },
  human_reviewed: { bg: 'bg-green-500', badge: 'bg-green-50 text-green-700 ring-1 ring-green-300' },
  flagged: { bg: 'bg-red-500', badge: 'bg-red-50 text-red-700 ring-1 ring-red-300' },
  under_review: { bg: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-300' },
}
