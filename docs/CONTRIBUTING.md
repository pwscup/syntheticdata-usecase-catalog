# 開発者ガイド

合成データ ユースケースカタログの開発に参加するためのガイドです。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | React 19 + TypeScript |
| ビルド | Vite |
| スタイリング | Tailwind CSS v4 |
| ルーティング | React Router v7 |
| フォーム | React Hook Form + Zod |
| テスト | Vitest + Testing Library |
| デプロイ | GitHub Pages（main push時に自動デプロイ） |

## セットアップ

```bash
git clone https://github.com/pwscup/syntheticdata-usecase-catalog.git
cd syntheticdata-usecase-catalog
npm install
npm run dev          # http://localhost:5173 で起動
```

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # tsc + vite build（本番ビルド）
npm run preview      # ビルド結果をローカルで確認
npm run test         # テスト実行（1回）
npm run test:watch   # テスト実行（監視モード）
npm run test:coverage # カバレッジ付きテスト
npm run lint         # ESLint
```

## プロジェクト構成

```
src/
├── pages/              # ページコンポーネント
│   ├── CaseListPage    #   トップページ（一覧 + フィルタ + ページネーション）
│   ├── CaseDetailPage  #   事例詳細
│   ├── CaseNewPage     #   事例新規作成
│   ├── CaseEditPage    #   事例編集
│   ├── AboutPage       #   アバウト
│   └── SettingsPage    #   設定
├── components/
│   ├── case-list/      #   一覧用コンポーネント群
│   │   ├── CaseCard        # 事例カード
│   │   ├── FilterPanel     # サイドバーフィルタ
│   │   ├── SearchBar       # 検索ボックス
│   │   ├── SortSelect      # ソート選択
│   │   ├── SummaryPanel    # 統計グラフ（読み取り専用）
│   │   ├── ActiveFilterBadges  # アクティブフィルタバッジ
│   │   └── Pagination     # ページネーション
│   ├── case-detail/    #   詳細用コンポーネント群
│   ├── case-form/      #   フォーム用コンポーネント群
│   ├── figures/        #   概要図レンダラー
│   │   ├── DataFlowDiagram    # データフロー図
│   │   ├── RiskMatrix         # リスクマトリクス
│   │   ├── UtilityChart       # ユーティリティチャート
│   │   └── FigureRenderer     # 図タイプの振り分け
│   ├── layout/         #   レイアウト（Header等）
│   └── ui/             #   汎用UIパーツ
├── hooks/
│   └── useFilter.ts    #   フィルタ・ソート・ページネーションロジック
├── context/            #   事例データの読み込み・提供
├── schemas/            #   Zodバリデーションスキーマ
├── constants/          #   選択肢定数（domain, region, category）
├── types/              #   TypeScript型定義
├── lib/                #   ユーティリティ関数
└── __tests__/          #   テストファイル
```

```
public/cases/           # 事例データ（JSONファイル）
├── index.json          #   事例ID一覧
└── <id>/case.json      #   各事例のデータ
```

## ディレクトリ責務

リポジトリ全体のディレクトリ責務を以下に定義する。新規ファイル追加時はこの表に従って配置する。

| ディレクトリ | 役割 |
|------------|------|
| `src/` | アプリケーション本体（ページ・コンポーネント・ロジック） |
| `public/cases/` | 事例データ（1ディレクトリ = 1事例）。`index.json` はビルド時に自動生成 |
| `tests/unit/` | ロジックの単体テスト（Vitest） |
| `tests/component/` | React コンポーネントテスト（Vitest + Testing Library） |
| `tests/integration/` | I/O・結合テスト（将来用） |
| `tests/e2e/` | Playwright による E2E テスト |
| `tests/setup/` | Vitest 用 setup ファイル（jest-dom 拡張等） |
| `tooling/vite-plugins/` | Vite dev/build パイプラインに組み込むプラグイン |
| `tooling/lib/` | Plugin と CLI スクリプトで共用する純粋ロジック |
| `scripts/ops/` | 継続運用スクリプト（CI・日常作業で恒常的に使う） |
| `scripts/oneoff/` | 一回限りのデータ移行・初期投入スクリプト（原則CI非依存、書き捨て前提） |
| `docs/` | 開発者向けドキュメント |
| `docs/data-migrations/` | one-off スクリプトの実行履歴・手順書 |

> 現在この構成への移行中。詳細は Issue #102 および関連する Phase Issue (#108, #109, #110, #111) を参照。

### テスト配置規約

新しいテストを追加するときは、以下に従って配置する。

| 種別 | 配置先 | 対象 |
|------|--------|------|
| Unit | `tests/unit/` | 純粋ロジック、ユーティリティ、データ変換 |
| Component | `tests/component/` | React コンポーネント（レンダリング・ユーザー操作） |
| Integration | `tests/integration/` | 複数レイヤーにまたがる結合テスト |
| E2E | `tests/e2e/` | Playwright による E2E（ユーザー動線） |
| Setup | `tests/setup/` | Vitest setup ファイル |

- `src/` 配下にはテストを置かない（アプリ本体と検証コードの境界を保つ）
- `tests/` 配下のサブディレクトリ構成は `src/` のそれを反映させてよい（例: `tests/component/case-list/CaseCard.test.tsx`）

### tooling の定義

`tooling/` は「アプリ機能」ではなく「ビルド・開発時のパイプライン処理」を担う層。

- `tooling/vite-plugins/`: dev/build 時に派生ファイル生成や監視を行う Vite プラグイン
- `tooling/lib/`: plugin と CLI の両方から使う純粋関数

補足: 純粋ロジックを `tooling/lib/` に切り出しておくと、I/O 副作用を含む plugin 本体とは別にテストしやすくなる。

### scripts の使い分け

| ディレクトリ | 用途 | package.json 公開 | CI依存 |
|------------|------|----------------|-------|
| `scripts/ops/` | 継続運用（日常・CI） | する | してよい |
| `scripts/oneoff/` | 一回限りの作業 | しない | しない |

運用ルール:
- `scripts/ops/` は `package.json` の `scripts` 経由で公開し、CI からも呼び出してよい
- `scripts/oneoff/` は `YYYY-MM-<用途>.py`（または `.ts`）のように日付付きで命名する
- `scripts/oneoff/` を実行したら `docs/data-migrations/YYYY-MM-<用途>.md` に手順・実績を残す
- 履歴が残っていれば `scripts/oneoff/` 内のスクリプト本体は将来削除してよい

## アーキテクチャのポイント

### データの流れ

事例データは静的JSONファイルとしてホスティングされています（バックエンドAPIなし）。

1. `public/cases/index.json` から事例ID一覧を取得
2. 各事例の `case.json` をフェッチ
3. `CaseContext` でアプリ全体にデータを提供
4. `useFilter` フックでフィルタリング・ソート・ページネーション

### フィルタの仕組み（`useFilter`）

- URL search params と双方向同期（`useSearchParams`）
- フィルタ状態: `query`, `region[]`, `domain[]`, `usecase_category[]`, `sortBy`, `page`
- フィルタ変更時は `page` が自動で1にリセットされる
- `ITEMS_PER_PAGE = 12` で事例をページ分割
- 純粋関数（`applyFilters`, `applySorting` 等）はテスト用にもエクスポート

### 選択肢の管理

`src/constants/categories.ts` に `REGION_OPTIONS`, `DOMAIN_OPTIONS`, `USECASE_CATEGORY_OPTIONS` を定義。
SummaryPanelの凡例固定化や、FilterPanelの選択肢表示に使われる。新しいドメインやカテゴリを追加する場合はここを更新する。

### 概要図の追加

新しい図タイプを追加するには：

1. `src/types/case.ts` に型定義を追加
2. `src/schemas/case.schema.ts` にZodスキーマを追加
3. `src/components/figures/` にレンダラーコンポーネントを作成
4. `FigureRenderer.tsx` で新タイプを振り分ける

## テスト

テストは `tests/` 配下に種別ごとに配置する。配置方針は「[テスト配置規約](#テスト配置規約)」を参照。

```bash
npm run test         # 全テスト実行
npm run test:watch   # 変更監視で自動実行
npm run test:e2e     # Playwright E2E
```

テスト環境:
- Vitest + jsdom
- `@testing-library/react` でレンダリング
- `@testing-library/user-event` でユーザー操作
- `useFilter` のロジックは純粋関数を直接テスト

> 現在 `src/__tests__/`, `plugins/__tests__/`, `src/test/` に残っているテストは Issue #109 (Phase 2) で `tests/` へ移設予定。

## コントリビューション

1. `develop` ブランチから作業ブランチを切る
2. 変更を実装し、テストが通ることを確認する
   ```bash
   npx tsc -b --noEmit   # 型チェック
   npm run test           # テスト
   npm run build          # ビルド確認
   ```
3. PRを `develop` ブランチ向けに作成する

## 事例レビュー

AI生成された事例（`review_status: "ai_generated"`）を人手レビュー済み（`human_reviewed`）に昇格させる手順は [REVIEW_WORKFLOW.md](./REVIEW_WORKFLOW.md) を参照。

### デプロイ

`main` ブランチにpushすると GitHub Actions で自動的に GitHub Pages にデプロイされます。
`develop` → `main` のマージは動作確認後に行ってください。
