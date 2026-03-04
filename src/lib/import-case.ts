import { caseFormSchema, type CaseFormData } from '../schemas/case.schema'

type ParseSuccess = { success: true; data: CaseFormData }
type ParseFailure = { success: false; error: string }

/**
 * AI出力テキストからJSONを抽出し、caseFormSchema でバリデーションして返す。
 */
export function parseCaseFromAiOutput(
  text: string,
): ParseSuccess | ParseFailure {
  // 1. JSONを抽出
  const json = extractJson(text)
  if (json === null) {
    return { success: false, error: 'AI出力からJSONを検出できませんでした。出力にJSON形式のデータが含まれているか確認してください。' }
  }

  // 2. JSONパース
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { success: false, error: 'JSONの解析に失敗しました。構文エラーがないか確認してください。' }
  }

  // 3. バリデーション
  const result = caseFormSchema.safeParse(parsed)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('\n')
    return {
      success: false,
      error: `バリデーションエラー:\n${issues}`,
    }
  }

  return { success: true, data: result.data }
}

/**
 * テキストからJSON文字列を抽出する。
 * ```json ... ``` で囲まれている場合はその中身を、
 * そうでなければ最初の { から最後の } までを返す。
 */
function extractJson(text: string): string | null {
  // ```json ... ``` ブロックの検出
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/)
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim()
  }

  // { ... } の検出
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1)
  }

  return null
}
