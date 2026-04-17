import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { listCaseIds, buildIndexContent } from '../../../tooling/lib/case-index'

describe('listCaseIds', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'case-index-test-'))
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  it('case.json を持つディレクトリのみをリストアップする', () => {
    mkdirSync(join(tempDir, 'seed-0001'))
    writeFileSync(join(tempDir, 'seed-0001', 'case.json'), '{}')
    mkdirSync(join(tempDir, 'rpt-0001'))
    writeFileSync(join(tempDir, 'rpt-0001', 'case.json'), '{}')
    mkdirSync(join(tempDir, 'empty-dir'))
    writeFileSync(join(tempDir, 'not-a-dir.txt'), '')

    expect(listCaseIds(tempDir)).toEqual(['rpt-0001', 'seed-0001'])
  })

  it('ディレクトリがソートされて返される', () => {
    for (const id of ['seed-0003', 'seed-0001', 'fpf-0002', 'rpt-0010']) {
      mkdirSync(join(tempDir, id))
      writeFileSync(join(tempDir, id, 'case.json'), '{}')
    }

    expect(listCaseIds(tempDir)).toEqual(['fpf-0002', 'rpt-0010', 'seed-0001', 'seed-0003'])
  })

  it('空のディレクトリでは空配列を返す', () => {
    expect(listCaseIds(tempDir)).toEqual([])
  })

  it('存在しないディレクトリでは null を返す', () => {
    expect(listCaseIds(join(tempDir, 'nonexistent'))).toBeNull()
  })

  it('全事例が含まれることを検証（回帰テスト）', () => {
    const realCasesDir = resolve(__dirname, '../../../public/cases')
    if (!existsSync(realCasesDir)) return

    const ids = listCaseIds(realCasesDir)
    expect(ids).not.toBeNull()

    for (const id of ids!) {
      expect(existsSync(join(realCasesDir, id, 'case.json'))).toBe(true)
    }

    const allDirs = readdirSync(realCasesDir, { withFileTypes: true }).filter(
      (d) => d.isDirectory() && existsSync(join(realCasesDir, d.name, 'case.json'))
    )
    expect(ids!.length).toBe(allDirs.length)
  })
})

describe('buildIndexContent', () => {
  it('ids を JSON 文字列にし末尾改行を付ける', () => {
    const out = buildIndexContent(['a', 'b', 'c'])
    expect(out).toBe(JSON.stringify({ cases: ['a', 'b', 'c'] }, null, 2) + '\n')
    expect(out.endsWith('\n')).toBe(true)
  })

  it('空配列でも JSON を出力', () => {
    expect(buildIndexContent([])).toBe('{\n  "cases": []\n}\n')
  })
})
