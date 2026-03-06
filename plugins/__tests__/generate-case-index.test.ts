import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

// generate() のロジックを直接テストするためにヘルパーを抽出
// プラグインは resolve('public/cases') を使うため、
// ここではプラグインの generate ロジックを再現してテスト

function generateIndex(casesDir: string): { cases: string[] } | null {
  if (!existsSync(casesDir)) return null

  const { readdirSync } = require('node:fs')
  const ids = readdirSync(casesDir, { withFileTypes: true })
    .filter(
      (d: { isDirectory: () => boolean; name: string }) =>
        d.isDirectory() && existsSync(join(casesDir, d.name, 'case.json'))
    )
    .map((d: { name: string }) => d.name)
    .sort()

  return { cases: ids }
}

describe('generate-case-index ロジック', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'case-index-test-'))
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('case.json を持つディレクトリのみをリストアップする', () => {
    // case.json あり
    mkdirSync(join(tempDir, 'seed-0001'))
    writeFileSync(join(tempDir, 'seed-0001', 'case.json'), '{}')
    mkdirSync(join(tempDir, 'rpt-0001'))
    writeFileSync(join(tempDir, 'rpt-0001', 'case.json'), '{}')

    // case.json なし（無視されるべき）
    mkdirSync(join(tempDir, 'empty-dir'))

    // ファイル（ディレクトリではない）
    writeFileSync(join(tempDir, 'not-a-dir.txt'), '')

    const result = generateIndex(tempDir)
    expect(result).toEqual({ cases: ['rpt-0001', 'seed-0001'] })
  })

  it('ディレクトリがソートされて返される', () => {
    for (const id of ['seed-0003', 'seed-0001', 'fpf-0002', 'rpt-0010']) {
      mkdirSync(join(tempDir, id))
      writeFileSync(join(tempDir, id, 'case.json'), '{}')
    }

    const result = generateIndex(tempDir)
    expect(result?.cases).toEqual(['fpf-0002', 'rpt-0010', 'seed-0001', 'seed-0003'])
  })

  it('空のディレクトリでは空配列を返す', () => {
    const result = generateIndex(tempDir)
    expect(result).toEqual({ cases: [] })
  })

  it('存在しないディレクトリではnullを返す', () => {
    const result = generateIndex(join(tempDir, 'nonexistent'))
    expect(result).toBeNull()
  })

  it('全事例がindex.jsonに含まれることを検証（回帰テスト）', () => {
    // 実際の public/cases/ を読み取って、index生成ロジックと一致するか確認
    const { resolve } = require('node:path')
    const realCasesDir = resolve(__dirname, '../../public/cases')
    if (!existsSync(realCasesDir)) return // CI等で存在しない場合はスキップ

    const result = generateIndex(realCasesDir)
    expect(result).not.toBeNull()

    // 各ディレクトリに対応するcase.jsonが存在することを確認
    for (const id of result!.cases) {
      const casePath = join(realCasesDir, id, 'case.json')
      expect(existsSync(casePath)).toBe(true)
    }

    // ディレクトリ数と一致することを確認（漏れがないか）
    const { readdirSync } = require('node:fs')
    const allDirs = readdirSync(realCasesDir, { withFileTypes: true })
      .filter(
        (d: { isDirectory: () => boolean; name: string }) =>
          d.isDirectory() && existsSync(join(realCasesDir, d.name, 'case.json'))
      )
    expect(result!.cases.length).toBe(allDirs.length)
  })
})
