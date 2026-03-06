import { fetchSeedCases, loadAllCases } from "../lib/data-loader"
import type { Case } from "../types/case"

function makeCase(overrides: Partial<Case> = {}): Case {
  return {
    id: "case-1",
    title: "テストケース",
    region: "国内",
    domain: "医療",
    organization: "テスト組織",
    usecase_category: ["テストカテゴリ"],
    summary: "概要",
    value_proposition: "成果",
    synthetic_generation_method: "方法A",
    safety_evaluation_method: "安全性評価",
    utility_evaluation_method: "有用性評価",
    tags: ["tag1"],
    sources: [],
    figures: [],
    status: "seed",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    ...overrides,
  }
}

describe("fetchSeedCases", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("index.json + 各case.jsonをfetchしてCase[]を返す", async () => {
    const case1 = makeCase({ id: "seed-1" })
    const case2 = makeCase({ id: "seed-2", title: "ケース2" })

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/cases/index.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ cases: ["seed-1", "seed-2"] }),
        })
      }
      if (url.endsWith("/cases/seed-1/case.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(case1),
        })
      }
      if (url.endsWith("/cases/seed-2/case.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(case2),
        })
      }
      return Promise.resolve({ ok: false })
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await fetchSeedCases("/data")
    expect(mockFetch).toHaveBeenCalledWith("/data/cases/index.json")
    expect(mockFetch).toHaveBeenCalledWith("/data/cases/seed-1/case.json")
    expect(mockFetch).toHaveBeenCalledWith("/data/cases/seed-2/case.json")
    expect(result).toEqual([case1, case2])
  })

  it("fetch失敗時に空配列を返す", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")))

    const result = await fetchSeedCases()
    expect(result).toEqual([])
  })

  it("個別case.jsonの取得失敗時はスキップする", async () => {
    const case1 = makeCase({ id: "seed-1" })

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/cases/index.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ cases: ["seed-1", "seed-bad"] }),
        })
      }
      if (url.endsWith("/cases/seed-1/case.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(case1),
        })
      }
      return Promise.resolve({ ok: false })
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await fetchSeedCases()
    expect(result).toEqual([case1])
  })

  it("不正な構造のcase.json（配列ラッパー等）はスキップする", async () => {
    const case1 = makeCase({ id: "seed-1" })
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/cases/index.json")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ cases: ["seed-1", "seed-wrapped", "seed-null"] }),
        })
      }
      if (url.endsWith("/cases/seed-1/case.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(case1),
        })
      }
      if (url.endsWith("/cases/seed-wrapped/case.json")) {
        // 配列ラッパー（よくある間違い）
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([case1]),
        })
      }
      if (url.endsWith("/cases/seed-null/case.json")) {
        // null
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(null),
        })
      }
      return Promise.resolve({ ok: false })
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await fetchSeedCases()
    expect(result).toEqual([case1])
    expect(warnSpy).toHaveBeenCalledWith(
      "[data-loader] Skipping invalid case: seed-wrapped"
    )
    expect(warnSpy).toHaveBeenCalledWith(
      "[data-loader] Skipping invalid case: seed-null"
    )
    warnSpy.mockRestore()
  })

  it("index.jsonが空の場合、空配列を返す", async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/cases/index.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ cases: [] }),
        })
      }
      return Promise.resolve({ ok: false })
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await fetchSeedCases()
    expect(result).toEqual([])
  })

  it("index.jsonが404の場合、空配列を返す", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 })
    )

    const result = await fetchSeedCases()
    expect(result).toEqual([])
  })
})

describe("loadAllCases", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("fetchSeedCasesの結果をそのまま返す", async () => {
    const case1 = makeCase({ id: "seed-1" })

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith("/cases/index.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ cases: ["seed-1"] }),
        })
      }
      if (url.endsWith("/cases/seed-1/case.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(case1),
        })
      }
      return Promise.resolve({ ok: false })
    })
    vi.stubGlobal("fetch", mockFetch)

    const result = await loadAllCases("/data")
    expect(result).toEqual([case1])
  })
})
