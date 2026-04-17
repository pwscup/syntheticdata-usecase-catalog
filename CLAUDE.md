# PETs活用事例カタログ

プライバシー強化技術（PETs）の実世界活用事例を収集・整理・検索できるWebカタログ。

## 技術スタック

React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7 + Zod

テスト: Vitest + Testing Library（単体）、Playwright（E2E）
デプロイ: GitHub Pages（mainプッシュで自動デプロイ）

## コマンド

```
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド (tsc + vite build)
npm run test         # 単体テスト (vitest run)
npm run test:e2e     # E2Eテスト (playwright)
npm run lint         # ESLint
npm run validate     # case.json バリデーション
```

## ディレクトリ構成

```
src/
├── pages/           # ページコンポーネント（List, Detail, New, Edit, Stats, About）
├── components/      # UIコンポーネント（case-list, case-detail, case-form, figures）
├── schemas/         # Zodバリデーションスキーマ (case.schema.ts)
├── types/           # TypeScript型定義 (case.ts)
├── constants/       # 定数（categories, styles, prompts）
├── context/         # CaseContext（データ提供）
├── hooks/           # useFilter（フィルタ・ソート）
├── lib/             # ユーティリティ（data-loader, import-case）
└── __tests__/       # 単体テスト

public/cases/        # 事例データ（1ディレクトリ = 1事例）
├── index.json       # 事例ID一覧（ビルド時に自動生成）
└── <id>/case.json   # 個別事例データ

scripts/             # validate-cases.ts 等のCLIスクリプト
e2e/                 # Playwright E2Eテスト
```

## ブランチ戦略

- `main`: 本番（GitHub Pages自動デプロイ）。直接コミットしない
- `develop`: 開発ベース。PRはここ向け
- `feature-<issue番号>-<キーワード>`: フィーチャーブランチ（git worktreeで作成）

## case.json の概要

6つの技術カテゴリ: synthetic_data, differential_privacy, anonymization, federated_learning, secure_computation, distributed_analytics

主要フィールド: title, region, domain, organization, technology_category, usecase_category, occurred_at, summary, value_proposition, privacy_enhancement_method, safety_assurance_method, utility_evaluation_method, tags, sources, figures

- スキーマ定義: `src/schemas/case.schema.ts`
- 型定義: `src/types/case.ts`
- カテゴリ定数: `src/constants/categories.ts`
- プロンプトテンプレート: `src/constants/prompts.ts`

## 事例の追加・レビューフロー

1. 文献から事例を作成: `/case-create <URL>` または UIのAIアシストパネル（初期 `review_status` は `ai_generated`）
2. 既存事例の補完: `/case-enrich <case-id> <URL>` または UIの編集画面
3. レビュー: `/case-review <id>`（case-reviewer エージェント）で公開情報との整合性チェック
4. バリデーション: `npm run validate` でスキーマ検証
5. レビュー結果を踏まえて `review_status` を `human_reviewed` or `flagged` に更新し、PRで `develop` にマージ（手順は `docs/REVIEW_WORKFLOW.md`）

## 注意事項

- case.json の sources は最低1件必須
- occurred_at は "YYYY" / "YYYY-MM" / "YYYY-MM-DD" / null（詳細不明）
- 文献から読み取れない項目は「調査中」と記入（空欄にしない）
- figures の data_flow ノードは source → constraint → process → application → outcome の流れ
