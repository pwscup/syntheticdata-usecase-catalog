import { test, expect } from '@playwright/test'

// ------------------------------------------------------------------
// E2E: 事例一覧ページの基本表示
// ------------------------------------------------------------------
test.describe('事例一覧ページ', () => {
  test('一覧ページが表示され、事例カードが1件以上ある', async ({ page }) => {
    await page.goto('/')
    // 「読み込み中...」が消えるのを待つ
    await expect(page.locator('text=読み込み中')).toBeHidden({ timeout: 15_000 })
    // エラー表示がないこと
    await expect(page.locator('text=エラー')).toBeHidden()
    // カードが1件以上表示される (CaseCard は <a> でラップされ h2 にタイトル)
    const cards = page.locator('a h2')
    await expect(cards.first()).toBeVisible()
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('件数表示が「件の事例」を含む', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=読み込み中')).toBeHidden({ timeout: 15_000 })
    await expect(page.locator('text=件の事例')).toBeVisible()
  })

  test('コンソールエラーが発生しない', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await expect(page.locator('text=読み込み中')).toBeHidden({ timeout: 15_000 })
    expect(errors).toEqual([])
  })
})

// ------------------------------------------------------------------
// E2E: 全事例の詳細ページが壊れずに表示される
// ------------------------------------------------------------------
test.describe('全事例の詳細ページ', () => {
  let caseIds: string[] = []

  test.beforeAll(async ({ request }) => {
    const res = await request.get('/cases/index.json')
    expect(res.ok()).toBe(true)
    const data = await res.json()
    caseIds = data.cases ?? data
    expect(caseIds.length).toBeGreaterThan(0)
  })

  test('index.json の全事例IDの詳細ページが表示できる', async ({ page }) => {
    test.setTimeout(120_000)
    const failures: { id: string; reason: string }[] = []
    const errors: { id: string; message: string }[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push({ id: 'pending', message: msg.text() })
      }
    })

    for (const id of caseIds) {
      // コンソールエラーのトラッキング用にIDを設定
      errors.forEach((e) => {
        if (e.id === 'pending') e.id = id
      })

      await page.goto(`/#/cases/${id}`)
      // 読み込み完了を待つ
      await expect(page.locator('text=読み込み中')).toBeHidden({ timeout: 15_000 })

      // 「事例が見つかりません」が表示されていないこと
      const notFound = page.locator('text=事例が見つかりません')
      if (await notFound.isVisible().catch(() => false)) {
        failures.push({ id, reason: '事例が見つかりません' })
        continue
      }

      // タイトル (h1 or h2) が表示されていること
      const title = page.locator('h1, h2').first()
      if (!(await title.isVisible().catch(() => false))) {
        failures.push({ id, reason: 'タイトルが表示されない' })
        continue
      }

      // 「一覧に戻る」リンクが存在すること（詳細ページの証拠）
      const backLink = page.locator('text=一覧に戻る')
      if (!(await backLink.isVisible().catch(() => false))) {
        failures.push({ id, reason: '一覧に戻るリンクがない' })
      }
    }

    if (failures.length > 0) {
      console.log('--- 表示に失敗した事例 ---')
      failures.forEach((f) => console.log(`  ${f.id}: ${f.reason}`))
    }
    expect(failures).toEqual([])
  })

  test('全事例の詳細ページでコンソールエラーが発生しない', async ({ page }) => {
    test.setTimeout(120_000)
    const caseErrors: { id: string; message: string }[] = []

    for (const id of caseIds) {
      const pageErrors: string[] = []
      const handler = (msg: import('@playwright/test').ConsoleMessage) => {
        if (msg.type() === 'error') pageErrors.push(msg.text())
      }
      page.on('console', handler)

      await page.goto(`/#/cases/${id}`)
      await expect(page.locator('text=読み込み中')).toBeHidden({ timeout: 15_000 })

      page.off('console', handler)

      for (const msg of pageErrors) {
        caseErrors.push({ id, message: msg })
      }
    }

    if (caseErrors.length > 0) {
      console.log('--- コンソールエラーが発生した事例 ---')
      caseErrors.forEach((e) => console.log(`  ${e.id}: ${e.message}`))
    }
    expect(caseErrors).toEqual([])
  })
})

// ------------------------------------------------------------------
// E2E: ナビゲーション
// ------------------------------------------------------------------
test.describe('ナビゲーション', () => {
  test('一覧 → 詳細 → 一覧に戻る が動作する', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=読み込み中')).toBeHidden({ timeout: 15_000 })

    // 最初のカードをクリック
    const firstCard = page.locator('a h2').first()
    const cardTitle = await firstCard.textContent()
    await firstCard.click()

    // 詳細ページでタイトルが表示される
    await expect(page.locator('text=一覧に戻る')).toBeVisible()

    // 一覧に戻る
    await page.locator('text=一覧に戻る').first().click()
    await expect(page.locator('text=件の事例')).toBeVisible()
  })

  test('Aboutページが表示される', async ({ page }) => {
    await page.goto('/#/about')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('統計ページが表示される', async ({ page }) => {
    await page.goto('/#/stats')
    await expect(page.locator('text=読み込み中')).toBeHidden({ timeout: 15_000 })
    await expect(page.locator('text=エラー')).toBeHidden()
  })
})

// ------------------------------------------------------------------
// E2E: case.json の構造検証（ランタイム）
// ------------------------------------------------------------------
test.describe('case.json データ整合性', () => {
  test('全事例の case.json が必須フィールドを持つ', async ({ request }) => {
    const res = await request.get('/cases/index.json')
    const data = await res.json()
    const caseIds: string[] = data.cases ?? data

    const failures: { id: string; missing: string[] }[] = []
    const requiredFields = ['id', 'title', 'domain', 'organization', 'summary', 'sources', 'figures']

    for (const id of caseIds) {
      const caseRes = await request.get(`/cases/${id}/case.json`)
      expect(caseRes.ok()).toBe(true)

      const data = await caseRes.json()
      const missing = requiredFields.filter((f) => !(f in data) || data[f] === undefined || data[f] === null)
      if (missing.length > 0) {
        failures.push({ id, missing })
      }
    }

    if (failures.length > 0) {
      console.log('--- 必須フィールド不足の事例 ---')
      failures.forEach((f) => console.log(`  ${f.id}: ${f.missing.join(', ')}`))
    }
    expect(failures).toEqual([])
  })

  test('全事例の figures.data が nodes/edges 構造を持つ', async ({ request }) => {
    const res = await request.get('/cases/index.json')
    const data = await res.json()
    const caseIds: string[] = data.cases ?? data

    const failures: { id: string; reason: string }[] = []

    for (const id of caseIds) {
      const caseRes = await request.get(`/cases/${id}/case.json`)
      const data = await caseRes.json()

      if (!Array.isArray(data.figures)) continue

      for (const fig of data.figures) {
        if (fig.type === 'data_flow') {
          if (!fig.data || !Array.isArray(fig.data.nodes)) {
            failures.push({ id, reason: `data_flow figure missing data.nodes` })
          }
          if (!fig.data || !Array.isArray(fig.data.edges)) {
            failures.push({ id, reason: `data_flow figure missing data.edges` })
          }
        }
      }
    }

    if (failures.length > 0) {
      console.log('--- figures構造が不正な事例 ---')
      failures.forEach((f) => console.log(`  ${f.id}: ${f.reason}`))
    }
    expect(failures).toEqual([])
  })
})
