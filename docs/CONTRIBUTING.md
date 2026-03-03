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

テストは `src/__tests__/` にコンポーネントと同名で配置しています。

```bash
npm run test         # 全テスト実行
npm run test:watch   # 変更監視で自動実行
```

テスト環境:
- Vitest + jsdom
- `@testing-library/react` でレンダリング
- `@testing-library/user-event` でユーザー操作
- `useFilter` のロジックは純粋関数を直接テスト

## コントリビューション

1. `develop` ブランチから作業ブランチを切る
2. 変更を実装し、テストが通ることを確認する
   ```bash
   npx tsc -b --noEmit   # 型チェック
   npm run test           # テスト
   npm run build          # ビルド確認
   ```
3. PRを `develop` ブランチ向けに作成する

### デプロイ

`main` ブランチにpushすると GitHub Actions で自動的に GitHub Pages にデプロイされます。
`develop` → `main` のマージは動作確認後に行ってください。
