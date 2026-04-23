export const REGION_OPTIONS = ['国内', '国外'] as const

export const DOMAIN_OPTIONS = ['金融', '医療', '公共', '通信', 'モビリティ', 'IT', 'エネルギー', '小売', '製造'] as const

export const USECASE_CATEGORY_OPTIONS = [
  '組織内データ共有',
  '組織間データ共有',
  '外部分析者活用',
  'R&D',
  'データ販売',
  'フィージビリティ検証',
  '公的利用',
] as const

export const TECHNOLOGY_CATEGORY_OPTIONS = [
  'synthetic_data',
  'differential_privacy',
  'anonymization',
  'federated_learning',
  'secure_computation',
  'distributed_analytics',
] as const

export const TECHNOLOGY_CATEGORY_LABELS: Record<string, string> = {
  synthetic_data: '合成データ',
  differential_privacy: '差分プライバシー',
  anonymization: '匿名化',
  federated_learning: '連合学習',
  secure_computation: '秘密計算',
  distributed_analytics: '分散データ分析',
}

// data_flow 図のノードカテゴリ。並び順が「source → constraint → process → application → outcome」の流れを表す
export const DATA_FLOW_NODE_CATEGORIES = [
  'source',
  'constraint',
  'process',
  'application',
  'outcome',
] as const

export type DataFlowNodeCategory = typeof DATA_FLOW_NODE_CATEGORIES[number]

export const DATA_FLOW_NODE_CATEGORY_LABELS: Record<DataFlowNodeCategory, string> = {
  source: 'source（元データ）',
  constraint: 'constraint（課題・制約）',
  process: 'process（PETs手法）',
  application: 'application（活用先）',
  outcome: 'outcome（成果）',
}

// カテゴリ → ノードIDのプレフィックス（既存JSONの命名規則に準拠）
export const DATA_FLOW_NODE_ID_PREFIX: Record<DataFlowNodeCategory, string> = {
  source: 's',
  constraint: 's',
  process: 'p',
  application: 'a',
  outcome: 'a',
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
