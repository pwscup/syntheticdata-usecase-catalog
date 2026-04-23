# 事例レビューワークフロー

`public/cases/<id>/case.json` の `review_status` を使って、AI生成から人手レビュー済みへの遷移を運用で管理する。

## review_status の値

| 値 | 意味 | 表示 |
|---|---|---|
| `ai_generated` | AIが文献から自動生成した初期状態。内容の正確性は未検証 | 黄色「AI生成」バッジ＋注意書き |
| `under_review` | 誰かがレビュー作業中（着手宣言に使う） | 青「レビュー中」バッジ |
| `human_reviewed` | 人手で出典と照合し、記述内容が妥当と判断した | 緑「レビュー済」バッジ |
| `flagged` | レビューの結果、記述に重大な疑義がある／出典が追えない等で一旦保留 | 赤「要確認」バッジ＋注意書き |

## 遷移フロー

```
ai_generated ──(着手)──▶ under_review ──(PASS)──▶ human_reviewed
     │                        │
     │                        └──(要修正で保留)──▶ flagged
     └──(軽微修正のみでPASS)──────────────────────▶ human_reviewed
```

## 手順

レビュー提出のルートは2つある。どちらでもOK。

### A. Webアプリから提出（推奨・GitHubアカウントのみで完結）

#### 1. 対象の事例を開く
サイトで AI生成バッジ（黄色）がついた事例の詳細ページを開く。

#### 2. 「編集」ボタンを押す
詳細ページ下部の「編集」ボタンを押して編集フォームに遷移する。編集フォームでは、レビュー状況の変更、チェックリスト、プレビュー、GitHub 提出までがひとつの画面で完結する。

#### 3. 出典確認＆必要な修正
編集フォーム内の「レビュー状況」セクションで `レビュー済` ラジオボタンを選ぶと、インラインで以下のチェックリストが表示される:

- 出典URL（sources）の実物を開いて本文を確認した
- summary と value_proposition の記述は出典で裏付けられている
- 数値・固有名詞・組織名は出典と一致している
- 断定表現を避け、出典引用／解釈が区別できる表現になっている
- title が `{組織名}：{事例内容}` 形式になっている

チェックリストの全てを確認すること。記述に問題があれば同じフォーム内で修正する。

#### 4. プレビュー
「プレビュー」ボタンで確認画面へ。緑色の「レビュー状況の変更」バナーが表示され、推奨コミットメッセージが提示される（例: `review: {title} を AI生成 → レビュー済 に更新`）。

#### 5. GitHubで提出
「GitHubで提出（推奨）」ボタン → GitHub の編集画面に遷移。クリップボードにコピーされたJSONをペーストし、表示された推奨コミットメッセージを使ってコミット → PR作成。

#### 6. レビュー・マージ
リポジトリ管理者が PR をレビューし、`develop` にマージする。次の `main` リリースでサイトに反映される。

### B. ローカル編集＋CLIで提出（開発者向け）

`public/cases/<id>/case.json` を直接編集する場合:

```bash
git worktree add gitworktree/feature-review-<id短縮> -b feature-review-<id短縮> origin/develop
cd gitworktree/feature-review-<id短縮>
```

Claude Code を使える場合は `/case-review <事例ID>` で `case-reviewer` エージェントを走らせると、5つの観点（ファクトチェッカー／ビジネス読者／PETs技術／技術広報／アカデミック）で整合性を確認できる。詳細は `.claude/skills/case-review/SKILL.md` を参照。

レビュー結果に応じた遷移:

| 総合判定 | 取るアクション | `review_status` |
|---|---|---|
| 正確 | そのまま遷移 | `human_reviewed` |
| 概ね正確 | 指摘箇所を修正 → 遷移 | `human_reviewed` |
| 要修正（軽微） | 修正 → 遷移 | `human_reviewed` |
| 要修正（重大）／根拠不足が多い | 修正が困難／追加調査が必要な場合 | `flagged` |
| 事例として不適切 | 事例削除を検討（別PRで議論） | そのまま or `flagged` |

`review_status` 更新と同時に `updated_at` も ISO8601 (UTC) に更新する。

```bash
git add public/cases/<id>/case.json
git commit -m "review: <title短縮> を AI生成 → レビュー済 に更新"
git push -u origin HEAD
gh pr create --base develop --title "review: <事例タイトル> をレビュー済に"
```

PR本文には以下を含める:
- 参照した出典URL
- 修正した内容（あれば）
- レビュー観点でのコメント（特筆事項）

## よくあるケース

### そもそも出典URLがデッドリンク

- WebFetch で取得できない場合は Wayback Machine を試す
- それでも取れず、代替ソースも見つからない場合は `flagged` にして issue を立てる

### 出典と記述に食い違いがある

- 出典で確認できる範囲に書き直す
- 断定表現は「〜とされている」「〜と考えられる」に弱める（`.claude/agents/case-reviewer.md` の Business Reviewer 観点参照）
- 書き直しで落としきれない場合は `flagged`

### 複数事例が混在している

- 切り分けて別 case.json を立てる（別PR）
- 元事例は代表事例1件に絞って `human_reviewed` にする
