import { describe, it, expect } from 'vitest'
import { parseCaseFromAiOutput } from '../lib/import-case'

/** 最小限の有効なフォームデータJSON */
const validFormJson = JSON.stringify({
  title: '合成データによる金融リスク分析',
  region: '国内',
  domain: '金融',
  organization: 'テスト銀行',
  usecase_category: ['R&D'],
  summary: 'テストサマリー',
  value_proposition: '成果の説明',
  synthetic_generation_method: 'CTGAN',
  safety_evaluation_method: 'k-匿名性',
  utility_evaluation_method: '精度比較',
  tags: ['テスト'],
  sources: [
    {
      source_type: 'web',
      title: '参考記事',
      url: 'https://example.com/article',
      note: '',
    },
  ],
})

describe('parseCaseFromAiOutput', () => {
  it('正常なJSON入力でパースできる', () => {
    const result = parseCaseFromAiOutput(validFormJson)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('合成データによる金融リスク分析')
      expect(result.data.domain).toBe('金融')
    }
  })

  it('```json で囲まれたJSON入力でもパースできる', () => {
    const text = `以下が生成結果です。

\`\`\`json
${validFormJson}
\`\`\`

上記の事例を確認してください。`

    const result = parseCaseFromAiOutput(text)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('合成データによる金融リスク分析')
    }
  })

  it('``` で囲まれたJSON入力（json指定なし）でもパースできる', () => {
    const text = `\`\`\`
${validFormJson}
\`\`\``

    const result = parseCaseFromAiOutput(text)
    expect(result.success).toBe(true)
  })

  it('JSONが含まれないテキストではエラーを返す', () => {
    const result = parseCaseFromAiOutput('これはJSONではありません')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('JSONを検出できませんでした')
    }
  })

  it('不正なJSONでエラーを返す', () => {
    const result = parseCaseFromAiOutput('{ invalid json }')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('JSONの解析に失敗しました')
    }
  })

  it('バリデーションエラー: sourcesが空の場合', () => {
    const json = JSON.stringify({
      title: 'テスト',
      sources: [],
    })
    const result = parseCaseFromAiOutput(json)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('バリデーションエラー')
      expect(result.error).toContain('sources')
    }
  })

  it('バリデーションエラー: sourceのURLが空の場合', () => {
    const json = JSON.stringify({
      title: 'テスト',
      sources: [{ source_type: 'web', title: '', url: '', note: '' }],
    })
    const result = parseCaseFromAiOutput(json)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('バリデーションエラー')
    }
  })
})
