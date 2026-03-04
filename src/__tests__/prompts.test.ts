import { describe, it, expect } from 'vitest'
import { generateCreatePrompt, generateEnrichPrompt } from '../constants/prompts'

describe('generateCreatePrompt', () => {
  const prompt = generateCreatePrompt()

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

  it('title と summary のガイドラインを含む', () => {
    expect(prompt).toContain('title')
    expect(prompt).toContain('summary')
    expect(prompt).toContain('ガイドライン')
  })

  it('不明項目は「調査中」とする指示を含む', () => {
    expect(prompt).toContain('調査中')
  })
})

describe('generateEnrichPrompt', () => {
  it('引数の既存JSONがプロンプトに埋め込まれる', () => {
    const json = '{"title":"テスト事例","sources":[]}'
    const prompt = generateEnrichPrompt(json)
    expect(prompt).toContain(json)
  })

  it('「調査中」項目の補完ルールを含む', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('調査中')
    expect(prompt).toContain('更新対象')
  })

  it('既存内容の保持ルールを含む', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('既存内容の保持')
  })

  it('sources追加ルールを含む', () => {
    const prompt = generateEnrichPrompt('{}')
    expect(prompt).toContain('sources の追加')
    expect(prompt).toContain('既存のsourceは削除しない')
  })
})
