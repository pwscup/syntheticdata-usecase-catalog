import type { Case } from "../types/case"

interface CaseIndex {
  cases: string[]
}

export async function fetchSeedCases(basePath = "."): Promise<Case[]> {
  try {
    const indexRes = await fetch(`${basePath}/cases/index.json`)
    if (!indexRes.ok) return []
    const index: CaseIndex = await indexRes.json()

    const results = await Promise.all(
      index.cases.map(async (id) => {
        try {
          const res = await fetch(`${basePath}/cases/${id}/case.json`)
          if (!res.ok) return null
          const data: unknown = await res.json()
          // case.json が不正な構造（配列ラッパー等）の場合はスキップ
          if (typeof data !== 'object' || data === null || !('title' in data) || !('id' in data)) {
            console.warn(`[data-loader] Skipping invalid case: ${id}`)
            return null
          }
          return data as Case
        } catch {
          return null
        }
      })
    )

    return results.filter((c): c is Case => c !== null)
  } catch {
    return []
  }
}

export async function loadAllCases(basePath?: string): Promise<Case[]> {
  return fetchSeedCases(basePath)
}
