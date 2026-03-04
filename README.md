# 合成データ ユースケースカタログ

合成データ（Synthetic Data）の活用事例を収集・整理し、検索・閲覧できるWebカタログです。

## 事例データの追加・編集

事例は `public/cases/` 配下に1事例1ディレクトリで管理されています。

```
public/cases/
├── seed-0001/
│   └── case.json       ← 事例データ本体
├── seed-0002/
│   └── case.json
└── ...
```

> **Note**: `index.json`（事例ID一覧）はビルド時にViteプラグインが自動生成します。手動での管理は不要です。

### 新しい事例を追加する手順

1. `public/cases/` に新しいディレクトリを作る（例: `seed-0013/`）
2. `case.json` を作成する（後述のテンプレートを参照）
3. ブラウザで表示を確認する（`npm run dev`）

> GitHub上で直接追加する場合は、`public/cases/<id>/case.json` としてファイルを作成し、PRを出してください。mainにマージされると自動でデプロイされます。

### 事例を削除する手順

1. `public/cases/<id>/` ディレクトリごと削除する
2. PRを出してmainにマージする（デプロイ時に自動で一覧から除外されます）

> GitHub上で直接削除する場合は、該当ディレクトリ内のファイルを削除してください。ディレクトリが空になれば自動的に一覧から除外されます。

### case.json のテンプレート

```jsonc
{
  "id": "seed-0013",                          // ディレクトリ名と一致させる
  "title": "事例のタイトル",                    // 一覧カードに表示される
  "region": "国内",                            // "国内" or "国外"
  "domain": "医療",                            // "金融" / "医療" / "公共" / "通信"
  "domain_sub": "製薬",                        // 省略可。分野のサブカテゴリ
  "organization": "組織名",
  "usecase_category": ["組織内データ共有"],      // 配列。複数指定可
  "summary": "この事例の概要を1〜3文で記述",
  "value_proposition": "成果・効果の説明",
  "synthetic_generation_method": "GAN / VAE / 調査中 など",
  "safety_evaluation_method": "k-匿名性 / 差分プライバシー / 調査中 など",
  "utility_evaluation_method": "精度比較 / F値 / 調査中 など",
  "tags": ["タグ1", "タグ2"],                  // 検索対象になる。カードにも表示される
  "sources": [
    {
      "source_type": "web",                   // "web" or "pdf"
      "title": "出典のタイトル",
      "url": "https://example.com/source",    // 必須
      "note": "補足メモ（任意）"
    }
  ],
  "figures": [],                               // 概要図。後述
  "status": "seed",                            // "seed" / "draft" / "published"
  "created_at": "2026-03-01T00:00:00+09:00",
  "updated_at": "2026-03-01T00:00:00+09:00"
}
```

### フィールドの選択肢一覧

| フィールド | 選択肢 |
|-----------|--------|
| `region` | `国内`, `国外` |
| `domain` | `金融`, `医療`, `公共`, `通信` |
| `usecase_category` | `組織内データ共有`, `組織間データ共有`, `外部分析者活用`, `R&D`, `データ販売`, `フィージビリティ検証` |
| `status` | `seed`（初期調査）, `draft`（執筆中）, `published`（公開）, `archived`（非表示） |
| `source_type` | `web`, `pdf` |

> 新しい `domain` や `usecase_category` を追加する場合は `src/constants/categories.ts` の更新も必要です。開発者に相談してください。

### 概要図（figures）の書き方

事例には概要図を添付できます。現在3種類の図をサポートしています。

#### 1. データフロー図（data_flow）

事例の流れを「収集 → 合成 → 活用」の3列で表示します。最もよく使う図です。

```jsonc
{
  "type": "data_flow",
  "title": "図のタイトル",
  "data": {
    "nodes": [
      // 左列「収集」に表示されるノード
      { "id": "s1", "label": "元データの説明",           "category": "source" },
      { "id": "s2", "label": "課題・制約の説明",          "category": "constraint" },
      // 中央列「合成」に表示されるノード
      { "id": "p1", "label": "合成データの生成方法",       "category": "process" },
      // 右列「活用」に表示されるノード
      { "id": "a1", "label": "合成データの使い道",         "category": "application" },
      { "id": "a2", "label": "得られた成果",              "category": "outcome" }
    ],
    "edges": []   // 現在はedgesは使われていません（将来拡張用）
  },
  "note": "補足があれば記入"
}
```

**ノードの `category` と表示列の対応：**

| category | 表示列 | 意味 |
|----------|--------|------|
| `source` | 左（収集） | 元になるデータ |
| `constraint` | 左（収集） | データの課題・制約 |
| `process` | 中央（合成） | 合成データ生成の手法 |
| `application` | 右（活用） | データの活用先 |
| `outcome` | 右（活用） | 得られた成果・効果 |

各列に複数ノードを配置できます。ノード数に制限はありませんが、1列あたり2〜3個が読みやすくなります。

#### 2. リスクマトリクス（risk_matrix）

```jsonc
{
  "type": "risk_matrix",
  "title": "リスク評価マトリクス",
  "data": {
    "axes": {
      "impact_levels": ["低", "中", "高"],
      "likelihood_levels": ["低", "中", "高"]
    },
    "cells": [
      { "impact": "高", "likelihood": "中", "note": "説明テキスト" }
    ]
  },
  "note": ""
}
```

#### 3. ユーティリティチャート（utility_chart）

```jsonc
{
  "type": "utility_chart",
  "title": "有用性評価チャート",
  "data": {
    "series": [
      {
        "name": "系列名",
        "points": [
          { "x": "ラベル", "y": 95.2 }
        ]
      }
    ]
  },
  "note": ""
}
```

### 事例を編集する

既存の事例を更新するには：

1. `public/cases/<id>/case.json` を直接編集する
2. `updated_at` を現在日時に更新する
3. ブラウザで表示を確認する

または、アプリの事例編集画面（`/cases/<id>/edit`）からフォームで編集することもできます。

### 確認方法

```bash
npm run dev      # 開発サーバーを起動
# ブラウザで http://localhost:5173 を開く
```

事例データはZodスキーマでバリデーションされます。必須フィールドが欠けているとコンソールにエラーが表示されます。

### AIを使った事例作成

文献（PDF・Webページ）からAI（Claude等）を使って `case.json` を生成できます。以下のプロンプトテンプレートを用意しています。

- **[文献から新規事例を作成する](docs/prompts/create-case.md)** — 文献URLやPDFを渡して case.json のドラフトを生成
- **[既存事例を追加文献で補完・改善する](docs/prompts/enrich-case.md)** — 追加文献の情報で事例の内容をより正確・詳細に改善

---

開発者向けの技術情報は [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) を参照してください。
