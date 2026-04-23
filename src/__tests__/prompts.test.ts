import { describe, it, expect } from 'vitest'
import { generateCreatePrompt, generateEnrichPrompt } from '../constants/prompts'

describe('generateCreatePrompt', () => {
  const prompt = generateCreatePrompt()

  it('入力情報セクションが冒頭にある', () => {
    const inputIdx = prompt.indexOf('## 入力情報')
    const outputIdx = prompt.indexOf('## 出力仕様')
    expect(inputIdx).toBeGreaterThan(-1)
    expect(outputIdx).toBeGreaterThan(inputIdx)
  })

  it('usecase_category の選択肢一覧を含む', () => {
    expect(prompt).toContain('組織内データ共有')
    expect(prompt).toContain('組織間データ共有')
    expect(prompt).toContain('外部分析者活用')
    expect(prompt).toContain('R&D')
    expect(prompt).toContain('データ販売')
    expect(prompt).toContain('フィージビリティ検証')
  })

  it('domain の選択肢一覧を含む', () => {
    expect(prompt).toContain('金融')
    expect(prompt).toContain('医療')
    expect(prompt).toContain('公共')
    expect(prompt).toContain('通信')
  })

  it('region の選択肢一覧を含む', () => {
    expect(prompt).toContain('国内')
    expect(prompt).toContain('国外')
  })

  it('technology_category の選択肢一覧を含む', () => {
    expect(prompt).toContain('synthetic_data')
    expect(prompt).toContain('differential_privacy')
    expect(prompt).toContain('anonymization')
    expect(prompt).toContain('federated_learning')
    expect(prompt).toContain('secure_computation')
    expect(prompt).toContain('distributed_analytics')
    expect(prompt).toContain('合成データ')
    expect(prompt).toContain('差分プライバシー')
    expect(prompt).toContain('匿名化')
    expect(prompt).toContain('連合学習')
    expect(prompt).toContain('秘密計算')
    expect(prompt).toContain('分散データ分析')
  })

  it('occurred_at のガイドラインを含む', () => {
    expect(prompt).toContain('occurred_at')
    expect(prompt).toContain('YYYY')
  })

  it('公的利用 の判断基準を含む', () => {
    expect(prompt).toContain('公的利用')
  })

  it('title と summary のガイドラインを含む', () => {
    expect(prompt).toContain('title')
    expect(prompt).toContain('summary')
    expect(prompt).toContain('ガイドライン')
  })

  it('不明項目は「調査中」とする指示を含む', () => {
    expect(prompt).toContain('調査中')
  })

  it('data_flow のカテゴリ順序ルールを含む', () => {
    expect(prompt).toContain('source → constraint → process → application → outcome')
  })
})

describe('generateEnrichPrompt', () => {
  it('入力情報セクションが冒頭にある', () => {
    const prompt = generateEnrichPrompt('{}')
    const inputIdx = prompt.indexOf('## 入力情報')
    const existingIdx = prompt.indexOf('## 既存の事例JSON')
    expect(inputIdx).toBeGreaterThan(-1)
    expect(existingIdx).toBeGreaterThan(inputIdx)
  })

  it('引数の既存JSONがプロンプトに埋め込まれる', () => {
    const json = '{"title":"テスト事例","sources":[]}'
    const prompt = generateEnrichPrompt(json)
    expect(prompt).toContain(json)
  })

  it('すべての項目が改善対象であることを示す', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('調査中')
    expect(prompt).toContain('更新対象')
    expect(prompt).toContain('すべての項目が改善の対象')
  })

  it('改善の例を含む', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('改善の例')
    expect(prompt).toContain('抽象的な記述')
  })

  it('sources追加ルールを含む', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('sources の追加')
    expect(prompt).toContain('既存のsourceは削除しない')
  })

  it('technology_category の見直しルールを含む', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('technology_category')
  })

  it('occurred_at の補完ルールを含む', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('occurred_at')
  })

  it('data_flow のカテゴリ順序ルールを含む', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('source → constraint → process → application → outcome')
  })
})
