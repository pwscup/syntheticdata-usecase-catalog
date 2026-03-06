/**
 * public/cases/ 配下の全 case.json をバリデーションするスクリプト。
 * CI で実行し、不正なデータがデプロイされるのを防ぐ。
 *
 * Usage: npx tsx scripts/validate-cases.ts
 */
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'

const casesDir = resolve('public/cases')

// case.json に最低限必要なフィールド
const REQUIRED_FIELDS = ['id', 'title', 'summary', 'sources'] as const

interface ValidationError {
  caseId: string
  errors: string[]
}

function validateCase(caseId: string, filePath: string): string[] {
  const errors: string[] = []

  // JSONパース
  let data: unknown
  try {
    const raw = readFileSync(filePath, 'utf-8')
    data = JSON.parse(raw)
  } catch (e) {
    errors.push(`JSON parse error: ${e instanceof Error ? e.message : String(e)}`)
    return errors
  }

  // オブジェクトであること
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    errors.push('case.json must be a JSON object (not array or primitive)')
    return errors
  }

  const obj = data as Record<string, unknown>

  // ラッパー構造の検出（よくある間違い）
  if ('cases' in obj && Array.isArray(obj.cases)) {
    errors.push('case.json has a "cases" array wrapper — should be a flat case object, not {cases:[...]}')
    return errors
  }
  if ('schema_version' in obj) {
    errors.push('case.json has "schema_version" — this looks like a catalog wrapper, not an individual case')
  }

  // 必須フィールドの存在チェック
  for (const field of REQUIRED_FIELDS) {
    if (!(field in obj)) {
      errors.push(`Missing required field: "${field}"`)
    }
  }

  // id の一致チェック
  if ('id' in obj && obj.id !== caseId) {
    errors.push(`"id" field ("${obj.id}") does not match directory name ("${caseId}")`)
  }

  // sources が配列であること
  if ('sources' in obj) {
    if (!Array.isArray(obj.sources)) {
      errors.push('"sources" must be an array')
    } else if (obj.sources.length === 0) {
      errors.push('"sources" is empty — at least one source is expected')
    }
  }

  // title が空でないこと
  if ('title' in obj && (typeof obj.title !== 'string' || obj.title.trim() === '')) {
    errors.push('"title" must be a non-empty string')
  }

  return errors
}

function validateIndexJson(caseDirs: string[]): string[] {
  const errors: string[] = []
  const indexPath = join(casesDir, 'index.json')

  if (!existsSync(indexPath)) {
    // index.json はビルド時に自動生成されるため、存在しなくてもエラーではない
    // ただし存在する場合は整合性をチェック
    return errors
  }

  let index: { cases: string[] }
  try {
    index = JSON.parse(readFileSync(indexPath, 'utf-8'))
  } catch {
    errors.push('index.json: JSON parse error')
    return errors
  }

  if (!Array.isArray(index.cases)) {
    errors.push('index.json: "cases" field is not an array')
    return errors
  }

  // index.json に含まれるが実際にはディレクトリがない事例
  const missingDirs = index.cases.filter((id) => !caseDirs.includes(id))
  if (missingDirs.length > 0) {
    errors.push(`index.json contains entries without matching directories: ${missingDirs.join(', ')}`)
  }

  // ディレクトリは存在するが index.json に含まれていない事例
  const missingInIndex = caseDirs.filter((id) => !index.cases.includes(id))
  if (missingInIndex.length > 0) {
    errors.push(`Directories not listed in index.json: ${missingInIndex.join(', ')}`)
  }

  return errors
}

function main() {
  if (!existsSync(casesDir)) {
    console.error(`Error: ${casesDir} does not exist`)
    process.exit(1)
  }

  const dirs = readdirSync(casesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())

  const failures: ValidationError[] = []
  let total = 0
  const caseDirNames: string[] = []

  for (const dir of dirs) {
    const filePath = join(casesDir, dir.name, 'case.json')
    if (!existsSync(filePath)) continue

    total++
    caseDirNames.push(dir.name)
    const errors = validateCase(dir.name, filePath)
    if (errors.length > 0) {
      failures.push({ caseId: dir.name, errors })
    }
  }

  // index.json の整合性チェック
  const indexErrors = validateIndexJson(caseDirNames)
  if (indexErrors.length > 0) {
    failures.push({ caseId: 'index.json', errors: indexErrors })
  }

  // 結果出力
  console.log(`\nValidated ${total} case(s)\n`)

  if (failures.length === 0) {
    console.log('All cases are valid.')
    process.exit(0)
  }

  console.error(`Found ${failures.length} invalid case(s):\n`)
  for (const f of failures) {
    console.error(`  ${f.caseId}:`)
    for (const e of f.errors) {
      console.error(`    - ${e}`)
    }
    console.error('')
  }

  process.exit(1)
}

main()
