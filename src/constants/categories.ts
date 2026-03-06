export const REGION_OPTIONS = ['国内', '国外'] as const

export const DOMAIN_OPTIONS = ['金融', '医療', '公共', '通信'] as const

export const USECASE_CATEGORY_OPTIONS = [
  '組織内データ共有',
  '組織間データ共有',
  '外部分析者活用',
  'R&D',
  'データ販売',
  'フィージビリティ検証',
] as const

export const TECHNOLOGY_CATEGORY_OPTIONS = [
  'synthetic_data',
  'differential_privacy',
  'anonymization',
  'federated_learning',
  'secure_computation',
] as const

export const TECHNOLOGY_CATEGORY_LABELS: Record<string, string> = {
  synthetic_data: '合成データ',
  differential_privacy: '差分プライバシー',
  anonymization: '匿名化',
  federated_learning: '連合学習',
  secure_computation: '秘密計算',
}

export const REVIEW_STATUS_OPTIONS = [
  'ai_generated',
  'human_reviewed',
  'flagged',
  'under_review',
] as const

export const REVIEW_STATUS_LABELS: Record<string, string> = {
  ai_generated: 'AI生成',
  human_reviewed: 'レビュー済',
  flagged: '要確認',
  under_review: 'レビュー中',
}
