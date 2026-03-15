# 差分プライバシー事例レビュー (dp-0001 〜 dp-0013)

レビュー実施日: 2026-03-15

---

## dp-0001: LINEヤフー：LINEスタンプ推薦での差分プライバシー活用

### 総合判定
概ね正確

### 総評
出典ページにはスタンプサジェスト機能における連合学習と差分プライバシーの適用が明記されており、case.jsonの主要な記述と整合する。ただし、case.jsonでは「スタンプ閲覧・送信履歴」が対象とされているが、出典では「スタンプサジェスト機能」（文字入力時に意味に近いスタンプを推薦する機能）として説明されており、対象データの表現にやや齟齬がある。出典ではLINEスタンプ プレミアムにおける実装として記載されており、運用中と読み取れるが、case.jsonのstatusは"seed"であり、実施段階の記述が明確でない。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://privacy.lycorp.co.jp/ja/acquisition/privacy_techs.html | 参照可 | 技術詳細の出典 | スタンプサジェスト機能における連合学習・差分プライバシーの説明あり |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | LINEスタンプ推薦での差分プライバシー活用 | 概ね正確 | 出典 | 出典では「スタンプサジェスト機能」と表現 | 「LINEスタンプサジェスト機能での差分プライバシー活用」の方が正確 |
| organization | LINEヤフー | 正確 | 出典 | - | - |
| technology_category | differential_privacy, federated_learning | 正確 | 出典 | 両技術とも明記あり | - |
| summary | スタンプ閲覧・送信履歴を対象に、端末上で学習し更新情報にノイズ付与 | 概ね正確 | 出典 | 「閲覧・送信履歴」は出典の表現と若干異なる。出典は文字入力に基づくスタンプ推薦の学習と説明 | 「スタンプサジェスト機能の学習データ」等に修正検討 |
| value_proposition | 利便性とプライバシー保護を両立 | 概ね正確 | 出典 | 出典の趣旨と合致するが、出典は「推定を困難にする」という表現 | - |
| usecase_category | 組織内データ共有 | 概ね正確 | 出典 | 端末とサーバ間の学習であり厳密な「データ共有」とは異なるが、大きな問題ではない | - |
| domain | IT | 正確 | 出典 | - | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし（ただしcase.json側に実施段階の明示的記述がない）
- 技術解釈の飛躍: なし。連合学習・差分プライバシーの組み合わせは出典で明記
- 価値記述の言い過ぎ: なし。「両立している」は出典の趣旨と整合

---

## dp-0002: Apple：iOS/macOSの利用傾向把握における差分プライバシー

### 総合判定
概ね正確（出典PDFの本文が読み取れなかったため一部判定不能）

### 総評
出典URLはAppleの公式Differential Privacy Overview PDFであり、URLは有効だがPDF内容のテキスト抽出ができなかった。case.jsonに記載されたQuickType候補、絵文字候補、Safariクラッシュドメイン、Healthアプリの編集データ種別などの対象データは、Appleが公開している既知の情報（2017年の"Learning with Privacy at Scale"論文等）と整合するが、本レビューでは出典PDFの本文確認ができていないため、個別項目の厳密な検証は不完全である。ローカル差分プライバシーの採用や識別子・IPアドレスの非保持についても同様に出典本文での確認が取れていない。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://www.apple.com/privacy/docs/Differential_Privacy_Overview.pdf | 参照可（PDF取得可、テキスト抽出不可） | 技術概要の出典 | PDFファイルとしてダウンロード可能だが、WebFetchでのテキスト抽出に失敗 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | iOS/macOSの利用傾向把握における差分プライバシー | 判定不能 | 出典PDF未抽出 | PDFテキスト抽出不可のため厳密検証できず | - |
| organization | Apple | 正確 | 出典URL | Apple公式ドメインの文書 | - |
| technology_category | differential_privacy | 判定不能 | 出典PDF未抽出 | タイトルに"Differential Privacy"とあり妥当と推定されるが本文未確認 | - |
| summary | QuickType、絵文字、Safariクラッシュドメイン、Healthアプリ等を対象にローカル差分プライバシー | 判定不能 | 出典PDF未抽出 | 本文での確認不可 | - |
| value_proposition | 個人単位の行動をサーバ側で直接把握しない設計 | 判定不能 | 出典PDF未抽出 | - | - |

### 特に重要な懸念
- 関係性の過剰推定: 判定不能（出典未確認）
- 実施段階の言い過ぎ: 判定不能（出典未確認）
- 技術解釈の飛躍: 判定不能（出典未確認）
- 価値記述の言い過ぎ: 判定不能（出典未確認）

---

## dp-0003: Apple：Photosの代表写真選定における差分プライバシー

### 総合判定
概ね正確

### 総評
出典ページの内容とcase.jsonの記述は概ね整合している。出典では「iOS 16以降、世界中の数百万のデバイスでMemoriesのkey photo選定に使用」「iOS 17ではPlaces Mapでの写真・位置ランキングにも使用」と明記されており、運用中であることが確認できる。技術的には、出典ではローカル差分プライバシーとsecure aggregationの組み合わせが説明されており、case.jsonの「差分プライバシーを用いて群集レベルの傾向を学習」という記述と整合する。ただし、case.jsonのtags に「ローカル差分プライバシー」とあるが、出典ではローカルDPとcentral DPの組み合わせ（ローカルノイズ追加 + secure aggregation）であり、単純な「ローカル差分プライバシー」とは異なる。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://machinelearning.apple.com/research/scenes-differential-privacy | 参照可 | 技術詳細の出典 | iOS 16以降での本番運用が明記 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | Photosの代表写真選定における差分プライバシー | 正確 | 出典 | 出典のタイトル・内容と整合 | - |
| organization | Apple | 正確 | 出典 | - | - |
| technology_category | differential_privacy | 正確 | 出典 | 差分プライバシーが主技術 | - |
| summary | よく訪れる場所で撮影された写真の種類に関する情報を対象に群集レベルの傾向を学習 | 正確 | 出典 | 出典に「location-category pairs from photos taken at frequently visited places」と明記 | - |
| summary | 個人の写真や行動をデバイス外に出さない設計 | 正確 | 出典 | 出典に「without personally identifiable data leaving their device」と明記 | - |
| value_proposition | 個人の写真や行動を直接外部に出さずに群集レベルの傾向を学習し写真体験を改善 | 正確 | 出典 | 出典の趣旨と整合 | - |
| tags | ローカル差分プライバシー | 要修正 | 出典 | 出典ではローカルDPとsecure aggregationの組み合わせ。純粋なローカルDPだけではない | 「ローカルDP＋secure aggregation」等に修正検討 |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。出典でiOS 16以降の本番運用が明記
- 技術解釈の飛躍: あり（軽微）。tagsの「ローカル差分プライバシー」は、実際にはローカルDPとsecure aggregationの組み合わせ
- 価値記述の言い過ぎ: なし

---

## dp-0004: Google：Google Mapsの混雑情報表示における差分プライバシー

### 総合判定
根拠不足が多い

### 総評
出典URL（blog.google記事）からは、混雑情報機能の存在は確認できるが、差分プライバシーの使用が明記されていない。出典ページのコンテンツ抽出が不完全であったものの、取得できた範囲では差分プライバシーへの言及がない。「Location Historyを有効にしたユーザーの位置履歴データを対象」という記述や「差分プライバシーを適用」という記述の根拠が出典から確認できない。Google Maps Popular Timesが差分プライバシーを使用しているという明示的な公開情報は、提示された出典URLには含まれていない可能性が高い。case.jsonの記述は一般知識に基づく補完の可能性がある。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://blog.google/products-and-platforms/products/maps/maps101-popular-times-and-live-busyness-information/ | 参照可（コンテンツ抽出不完全） | 機能説明の出典 | 差分プライバシーへの明示的言及なし。プライバシー保護の一般的言及のみ |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | Google Mapsの混雑情報表示における差分プライバシー | 根拠不足 | 出典 | 出典に差分プライバシーの明記なし | 差分プライバシー適用の根拠となる出典の追加が必要 |
| technology_category | differential_privacy | 根拠不足 | 出典 | 出典で差分プライバシー使用が確認できない | 差分プライバシー使用の出典を追加するか、技術記述を修正 |
| summary | Location Historyを有効にしたユーザーの位置履歴データを対象に差分プライバシーを適用 | 根拠不足 | 出典 | Location Historyとの関連、差分プライバシーの適用とも出典で明記なし | 出典で確認できる範囲の記述に修正 |
| summary | 十分なデータがない場合は表示しない制御 | 根拠不足 | 出典 | 出典で確認できず | - |
| value_proposition | 個人を特定せずに有用な混雑情報を提供 | 根拠不足 | 出典 | 差分プライバシーによる個人非特定が前提の記述だが、差分プライバシー自体が根拠不足 | - |

### 特に重要な懸念
- 関係性の過剰推定: あり。差分プライバシーとGoogle Maps混雑情報の関係が出典で確認できない
- 実施段階の言い過ぎ: 判定不能（差分プライバシー適用自体の根拠不足）
- 技術解釈の飛躍: あり。出典で差分プライバシーが明記されていないにもかかわらず、差分プライバシー事例として記述
- 価値記述の言い過ぎ: 判定不能（前提の技術適用が根拠不足）

---

## dp-0005: Google：COVID-19 Community Mobility Reportsの差分プライバシー

### 総合判定
概ね正確

### 総評
Googleの公式ドキュメント（data_documentation.html）にて、差分プライバシーの使用（「differential privacy, which adds artificial noise to our datasets」）、Location Historyオプトインユーザーからのデータ収集、6つの場所カテゴリ（Retail & recreation, Groceries & pharmacies, Parks, Transit stations, Workplaces, Residential）が明記されている。case.jsonの記述は概ね出典と整合する。ただし、case.jsonのsummaryでは「小売、職場、公共交通、公園、住宅地」と列挙しているが、出典には「Groceries & pharmacies」もあり、列挙が不完全である。また、同レポートは2022年10月に更新終了しており、現在は過去データの公開のみである点がcase.jsonに反映されていない。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://blog.google/innovation-and-ai/technology/health/covid-19-community-mobility-reports/ | 参照可（コンテンツ抽出不完全） | 発表ブログ | 差分プライバシーの明示的記述は抽出できず |

補足: 公式ドキュメント https://www.google.com/covid19/mobility/data_documentation.html にて差分プライバシー、Location History、場所カテゴリを確認。

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | COVID-19 Community Mobility Reportsの差分プライバシー | 正確 | data_documentation | 差分プライバシー使用が明記 | - |
| technology_category | differential_privacy | 正確 | data_documentation | 明記あり | - |
| summary | Location Historyを有効にしたユーザーの位置履歴の集計を対象 | 正確 | data_documentation | 「users who have opted-in to Location History」と明記 | - |
| summary | 小売、職場、公共交通、公園、住宅地などカテゴリ別 | 概ね正確 | data_documentation | 6カテゴリ中「Groceries & pharmacies」が列挙から漏れている | 全6カテゴリを列挙するか「など」で補うか検討 |
| summary | 人工ノイズを加える差分プライバシー | 正確 | data_documentation | 「adds artificial noise」と明記 | - |
| value_proposition | 公衆衛生当局や地域社会が行動制限や政策の影響を把握する材料 | 正確 | 出典 | 「help public health officials make critical decisions」と整合 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: あり（軽微）。レポートは2022年10月に更新終了しているが、case.jsonではその旨の言及なし。過去の運用事例として記述すべき
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし

---

## dp-0006: Google：Gboardの次単語予測における差分プライバシー

### 総合判定
正確

### 総評
出典のGoogle Research Blogにおいて、Gboardの次単語予測、Federated Learningと差分プライバシーの組み合わせ、スペイン語話者向けGboardでの本番導入が明確に記述されている。case.jsonの記述は出典と高い精度で整合している。「差分プライバシーがモデル学習に直接使われる数少ない明示事例」というvalue_propositionの後半部分はやや主観的な評価だが、出典でも「the first production neural network trained directly on user data announced with a formal DP guarantee」と記載されており、事実に基づいた表現である。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://research.google/blog/federated-learning-with-formal-differential-privacy-guarantees/ | 参照可 | 技術詳細・導入報告の出典 | 本番導入、スペイン語Gboard、DP-FTRLアルゴリズムが明記 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | Gboardの次単語予測における差分プライバシー | 正確 | 出典 | 出典に明記 | - |
| technology_category | differential_privacy, federated_learning | 正確 | 出典 | 両技術の組み合わせが明記 | - |
| summary | Federated Learningと差分プライバシーを組み合わせて次単語予測モデルを訓練 | 正確 | 出典 | 明記あり | - |
| summary | スペイン語話者向けGboardの本番系モデルとして導入 | 正確 | 出典 | 「Spanish-language Gboard users」「production」と明記 | - |
| value_proposition | 実際の入力データを中央に集めずに予測変換の改善を進められる | 正確 | 出典 | Federated Learningの趣旨と整合 | - |
| value_proposition | 差分プライバシーがモデル学習に直接使われる数少ない明示事例 | 概ね正確 | 出典 | 出典で「first production neural network...with a formal DP guarantee」と記載。「数少ない」は出典の趣旨と整合するが、やや評価的 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。出典で本番導入が明記
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし

---

## dp-0007: Google：Ads Data Hubのプライバシー保護広告分析

### 総合判定
要修正

### 総評
出典ページではAds Data Hubのプライバシーチェック機構として、静的チェック、データアクセス予算、集計チェック（最低50ユーザー閾値）、差分チェック、ノイズ注入が説明されている。ノイズ注入は確認できるが、出典では「differential privacy」という用語自体は使用されていない。case.jsonのtechnology_categoryに"differential_privacy"とあるが、出典では差分プライバシーという技術名称ではなくノイズ注入や差分チェックとして説明されている。「3,000超のブランド等が利用」は出典で確認できず、根拠不足である。また「ROAS評価」も出典で言及がない。domainが「通信」となっているが、広告分析プラットフォームであり「IT」または「広告」の方が適切。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://developers.google.com/ads-data-hub/marketers/guides/privacy-checks | 参照可 | プライバシーチェック機能の説明 | ノイズ注入は記載あり。「differential privacy」の語は使用されていない |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | Ads Data Hubのプライバシー保護広告分析 | 概ね正確 | 出典 | 機能名は正確。ただし「差分プライバシー」を含めたタイトルではないため問題は小さい | - |
| technology_category | differential_privacy | 要修正 | 出典 | 出典では「differential privacy」の語を使用していない。ノイズ注入や差分チェックとして説明 | 「noise_injection」等に変更するか、差分プライバシーを明記した別出典を追加 |
| summary | 差分プライバシー由来のノイズ注入や差分チェック | 要修正 | 出典 | 「差分プライバシー由来」は出典に根拠なし。出典はノイズ注入を独立した手法として説明 | 「ノイズ注入や差分チェックなどのプライバシー保護機能」に修正 |
| summary | 3,000超のブランド等が利用 | 根拠不足 | 出典 | 出典にこの数値の記載なし | 根拠となる出典を追加するか削除 |
| value_proposition | ROAS評価を実施できる | 根拠不足 | 出典 | 出典にROASの言及なし | 出典で確認できる表現に修正 |
| domain | 通信 | 要修正 | 出典 | 広告分析プラットフォームであり「通信」は不適切 | 「IT」または「広告」に修正 |

### 特に重要な懸念
- 関係性の過剰推定: あり。ノイズ注入を「差分プライバシー由来」と結びつけているが、出典にその関連の明記なし
- 実施段階の言い過ぎ: なし。運用中の機能として記載されており出典と整合
- 技術解釈の飛躍: あり。出典でdifferential privacyの語が使われていないのに、technology_categoryとしてdifferential_privacyを付与
- 価値記述の言い過ぎ: あり（軽微）。ROAS評価は出典に根拠なし

---

## dp-0008: U.S. Census Bureau：2020年国勢調査の差分プライバシー保護

### 総合判定
概ね正確（出典PDFのテキスト抽出不可のため一部判定不能）

### 総評
出典URLは2020年国勢調査のPrivacy-Protected Microdata File（PPMF）の技術文書PDFであり、URLは有効でPDFダウンロード可能だが、テキスト抽出ができなかった。2020年米国国勢調査での差分プライバシー適用、TopDown Algorithm、PPMFの生成・公開は広く知られた事実であるが、本レビューの原則に従い出典依存で評価すると、出典本文の確認が取れていないため厳密な検証は不完全である。case.jsonの記述内容自体は、一般に公開されている情報と矛盾しない。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://www2.census.gov/programs-surveys/decennial/2020/technical-documentation/complete-tech-docs/privacy-protected-microdata-file/2020census-privacy-protected-microdata-file.pdf | 参照可（PDF取得可、テキスト抽出不可） | PPMF技術文書 | PDFダウンロード可能だがWebFetchでテキスト抽出失敗 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | 2020年国勢調査の差分プライバシー保護 | 判定不能 | 出典PDF未抽出 | PDFタイトルは「Privacy-Protected Microdata File」であり趣旨は整合 | - |
| organization | U.S. Census Bureau | 正確 | 出典URL | census.govドメインの公式文書 | - |
| technology_category | differential_privacy | 判定不能 | 出典PDF未抽出 | - | - |
| summary | TopDown Algorithmにより差分プライバシーに基づくノイズ入り計測 | 判定不能 | 出典PDF未抽出 | - | - |
| summary | PPMFは保護処理済みのマイクロデータとして公開 | 判定不能 | 出典PDF未抽出 | タイトルと整合 | - |
| value_proposition | 公的統計における差分プライバシーの世界的な代表事例 | 概ね正確 | - | 一般的に認知されている評価だが、出典にこの表現があるかは未確認。やや評価的表現 | 「代表事例」を客観的表現に |

### 特に重要な懸念
- 関係性の過剰推定: 判定不能（出典本文未確認）
- 実施段階の言い過ぎ: 判定不能（出典本文未確認）
- 技術解釈の飛躍: 判定不能（出典本文未確認）
- 価値記述の言い過ぎ: あり（軽微）。「世界的な代表事例」は評価的表現

---

## dp-0009: U.S. Census Bureau：大学卒業後の就業・所得統計の差分プライバシー保護

### 総合判定
概ね正確（出典PDFのテキスト抽出不可のため一部判定不能）

### 総評
出典URLはPSEO（Post-Secondary Employment Outcomes）の技術文書PDFであり、URLは有効でPDFダウンロード可能だが、テキスト抽出ができなかった。PSEOは米国国勢調査局が公開している実験的統計プログラムであり、大学・専攻・学位別の卒業後就業・所得データを差分プライバシーで保護して公開するものとして知られている。case.jsonの記述は一般に公開されている情報と矛盾しないが、出典本文での厳密な検証は不完全である。「2019年以降継続更新」の記述も出典での確認が取れていない。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://lehd.ces.census.gov/doc/PSEOTechnicalDocumentation.pdf | 参照可（PDF取得可、テキスト抽出不可） | PSEO技術文書 | PDFダウンロード可能だがWebFetchでテキスト抽出失敗 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | 大学卒業後の就業・所得統計の差分プライバシー保護 | 判定不能 | 出典PDF未抽出 | - | - |
| organization | U.S. Census Bureau | 正確 | 出典URL | census.govドメインの公式文書 | - |
| technology_category | differential_privacy | 判定不能 | 出典PDF未抽出 | - | - |
| summary | 教育データと雇用データを結び付けた実験的集計表 | 判定不能 | 出典PDF未抽出 | 「実験的」という表現は適切（PSEOはexperimental statistics） | - |
| summary | 2019年以降継続更新 | 判定不能 | 出典PDF未抽出 | 出典で確認不可 | - |
| value_proposition | 学生は進学先や専攻選択の参考にでき、州政府や企業は人材供給の把握に使える | 判定不能 | 出典PDF未抽出 | 想定される利用価値の記述だが出典での確認不可 | - |

### 特に重要な懸念
- 関係性の過剰推定: 判定不能（出典本文未確認）
- 実施段階の言い過ぎ: 判定不能（出典本文未確認）
- 技術解釈の飛躍: 判定不能（出典本文未確認）
- 価値記述の言い過ぎ: 判定不能（出典本文未確認）

---

## dp-0010: Wikimedia Foundation：差分プライバシー付きページビュー統計公開

### 総合判定
根拠不足が多い

### 総評
出典URL（meta.wikimedia.org）へのアクセスが403エラーで拒否され、出典内容の確認ができなかった。case.jsonの記述（Tumult Labsの支援、約5年分の履歴、国・プロジェクト・ページ単位のページビュー統計の差分プライバシー保護公開）について、出典による検証が一切行えない。出典が参照不能であるため、全項目が根拠不足と判定する。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://meta.wikimedia.org/wiki/Differential_privacy/Completed/Country-project-page | 参照不可（403 Forbidden） | プロジェクト説明の出典 | アクセス拒否。内容確認不可 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | 差分プライバシー付きページビュー統計公開 | 根拠不足 | アクセス不可 | 出典確認不可 | - |
| organization | Wikimedia Foundation | 根拠不足 | アクセス不可 | URLのドメインからは妥当だが本文確認不可 | - |
| technology_category | differential_privacy | 根拠不足 | アクセス不可 | URLパスに「Differential_privacy」を含むが本文未確認 | - |
| summary | 約5年分の履歴を含むページビュー統計を差分プライバシーで保護 | 根拠不足 | アクセス不可 | 出典確認不可 | - |
| summary | Tumult Labsの支援を受けた公開プロジェクト | 根拠不足 | アクセス不可 | 出典確認不可 | - |
| value_proposition | 研究・分析・運営改善に使える高粒度データを閲覧者プライバシーに配慮しながら公開 | 根拠不足 | アクセス不可 | 出典確認不可 | - |
| usecase_category | 公的利用 | 根拠不足 | アクセス不可 | Wikimedia Foundationは非営利団体であり「公的利用」が適切かは要検討 | - |

### 特に重要な懸念
- 関係性の過剰推定: 判定不能（出典アクセス不可）
- 実施段階の言い過ぎ: 判定不能（出典アクセス不可）
- 技術解釈の飛躍: 判定不能（出典アクセス不可）
- 価値記述の言い過ぎ: 判定不能（出典アクセス不可）

---

## dp-0011: Microsoft：Viva Insightsの働き方分析における差分プライバシー

### 総合判定
概ね正確

### 総評
出典のMicrosoftブログ記事にて、Workplace Analytics（現Viva Insights）のPeople Manager向けインサイトに差分プライバシーが適用されていることが確認できる。チーム単位のコラボレーションデータの集計保護、個人情報を共有せずにチームの働き方を把握するという記述は出典と整合する。ただし、case.jsonのタイトルでは「Viva Insights」としているが、出典記事では「Workplace Analytics」の名称で説明されている（Viva Insightsへのリブランドは後のこと）。また、出典記事ではWindows、Office、LinkedInでの差分プライバシー活用も紹介されており、Workplace Analyticsはその一つとして説明されている。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://blogs.microsoft.com/ai-for-business/differential-privacy/ | 参照可 | 差分プライバシーの適用事例紹介 | Workplace Analytics（現Viva Insights）への差分プライバシー適用が記載 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | Viva Insightsの働き方分析における差分プライバシー | 概ね正確 | 出典 | 出典では「Workplace Analytics」名義。Viva Insightsは後のリブランド名 | 「Workplace Analytics（現Viva Insights）」とする方が出典に忠実 |
| organization | Microsoft | 正確 | 出典 | - | - |
| technology_category | differential_privacy | 正確 | 出典 | 明記あり | - |
| summary | チーム単位のコラボレーションデータを対象にPeople Manager向けに集計インサイトを差分プライバシーで提供 | 正確 | 出典 | 「Insights for People Managers within Workplace Analytics」と明記 | - |
| value_proposition | 個人単位の行動可視化に寄りすぎずに傾向把握を可能に | 概ね正確 | 出典 | 出典の趣旨と整合 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。出典でproduction useとして記載
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし

---

## dp-0012: LinkedIn：広告・アナリティクスの差分プライバシー保護集計

### 総合判定
要修正

### 総評
case.jsonの出典URLはMicrosoftの差分プライバシーブログ記事であり、LinkedInの広告クエリへの差分プライバシー適用は同記事内で言及されている。しかし、case.jsonにはPriPeARLフレームワークや「production deploymentのanalytics/reporting基盤」「閲覧・検索・クリックなどのprivate actions」といった詳細記述があるが、出典URLの記事にはPriPeARLの言及がない。LinkedInのエンジニアリングブログ（別URL）にPriPeARLの詳細な記述が存在するが、それはcase.jsonのsourcesに含まれていない。出典に記載のない情報を別ソースから補完してcase.jsonに記載している状態であり、sourcesの追加が必要。また、usecase_categoryが「組織内データ共有」だが、広告主への分析結果提供は「組織間データ共有」の要素もある。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://blogs.microsoft.com/ai-for-business/differential-privacy/ | 参照可 | 差分プライバシーの適用事例紹介 | LinkedInの広告クエリへの差分プライバシー適用に言及あり。PriPeARLの言及なし |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | 広告・アナリティクスの差分プライバシー保護集計 | 概ね正確 | 出典 | 出典ではLinkedInの広告クエリへの差分プライバシー適用が言及 | - |
| organization | LinkedIn | 正確 | 出典 | 出典にLinkedInの言及あり | - |
| technology_category | differential_privacy | 正確 | 出典 | 明記あり | - |
| summary | advertiser queriesに対して差分プライバシー付き回答を返す | 正確 | 出典 | 出典に「advertiser queries on LinkedIn」と明記 | - |
| summary | PriPeARLを公開し、閲覧・検索・クリックなどのprivate actionsを保護 | 根拠不足 | 出典 | 出典URLにPriPeARLの言及なし。LinkedInエンジニアリングブログに記載あり | sourcesにLinkedInエンジニアリングブログを追加 |
| summary | プロフィール閲覧、InMail分析 | 根拠不足 | 出典 | 出典URLに詳細な言及なし | sourcesの追加が必要 |
| usecase_category | 組織内データ共有 | 要修正 | 出典 | 広告主への分析提供は組織間の要素もある | 「組織間データ共有」の追加を検討 |
| sources | Microsoftブログのみ | 要修正 | - | PriPeARL等の記述の根拠となるLinkedInエンジニアリングブログが未掲載 | https://engineering.linkedin.com/blog/2019/04/privacy-preserving-analytics-and-reporting-at-linkedin を追加 |

### 特に重要な懸念
- 関係性の過剰推定: あり。出典URLに記載のないPriPeARLやInMail分析等の情報が含まれている
- 実施段階の言い過ぎ: なし。LinkedInエンジニアリングブログではproduction deploymentと明記（ただし出典URLには未掲載）
- 技術解釈の飛躍: なし。技術記述自体は正確だが出典が不足
- 価値記述の言い過ぎ: なし

---

## dp-0013: AWS：Clean Rooms Differential Privacyによる企業間データ連携

### 総合判定
要修正

### 総評
出典URLのタイトルに「(preview)」が明記されているにもかかわらず、case.jsonではサービスが提供中であるかのように記述されている。AWS公式ドキュメントではprivacy budget管理機能の存在が確認できるが、case.jsonに記載された「query sensitivity」の概念管理は出典で確認できなかった。「中央差分プライバシー型」という記述も出典では確認できない（AWSドキュメントではクエリ結果にノイズを追加する仕組みとして説明）。また、出典ブログ記事のコンテンツ抽出が不完全であったため、ユースケースの詳細確認が限定的である。実施段階の記述に「preview」の反映が必要。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|----------|----------|------|
| https://aws.amazon.com/blogs/aws/aws-clean-rooms-differential-privacy-enhances-privacy-protection-of-your-users-data-preview/ | 参照可（コンテンツ抽出不完全） | サービス発表ブログ | タイトルに「(preview)」明記 |

補足: AWS公式ドキュメント https://docs.aws.amazon.com/clean-rooms/latest/userguide/differential-privacy.html でprivacy budget等の機能を確認。

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|----------------|------|---------|----------|--------|
| title | Clean Rooms Differential Privacyによる企業間データ連携 | 概ね正確 | 出典 | サービス名は正確 | - |
| organization | Amazon Web Services | 正確 | 出典 | - | - |
| technology_category | differential_privacy | 正確 | 出典・AWS docs | 明記あり | - |
| summary | privacy budgetやquery sensitivityなどの概念を管理機能として提供 | 要修正 | AWS docs | privacy budgetは確認できるが、query sensitivityは出典で確認できず | query sensitivityの根拠を追加するか記述を修正 |
| summary | 中央差分プライバシー型のSaaS機能 | 要修正 | AWS docs | AWSドキュメントでは「central differential privacy」の明記なし。クエリ結果にノイズを追加する方式として説明 | 「中央差分プライバシー型」の表現を見直し、出典に基づく記述に |
| summary（実施段階） | 提供している（現在形） | 要修正 | 出典 | 出典タイトルに「(preview)」明記。プレビュー段階であることを反映すべき | 「プレビューとして提供」等に修正 |
| value_proposition | 企業間データ連携やクリーンルーム分析で個票を直接共有せずに共同分析をしやすくなる | 概ね正確 | 出典・AWS docs | 出典の趣旨と整合 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: あり。出典では「preview」と明記されているが、case.jsonでは提供中のように記述
- 技術解釈の飛躍: あり。「中央差分プライバシー型」は出典に根拠なし。query sensitivityの管理機能提供も出典で未確認
- 価値記述の言い過ぎ: なし

---

## サマリ

| 事例ID | 総合判定 | 主な指摘 |
|--------|----------|----------|
| dp-0001 | 概ね正確 | 対象データの表現が出典と若干齟齬（「スタンプ閲覧・送信履歴」vs「スタンプサジェスト機能」） |
| dp-0002 | 概ね正確（一部判定不能） | 出典PDFのテキスト抽出不可。個別項目の厳密検証が不完全 |
| dp-0003 | 概ね正確 | tagsの「ローカル差分プライバシー」は実際にはローカルDP＋secure aggregationの組み合わせ |
| dp-0004 | 根拠不足が多い | 出典に差分プライバシーの明記なし。差分プライバシー事例としての根拠が不足 |
| dp-0005 | 概ね正確 | 場所カテゴリの列挙が不完全。レポートは2022年10月に更新終了済みだが未反映 |
| dp-0006 | 正確 | 出典と高い精度で整合。特段の問題なし |
| dp-0007 | 要修正 | 出典で「differential privacy」の語が未使用。3,000+ブランド・ROASの根拠なし。domainが「通信」は不適切 |
| dp-0008 | 概ね正確（一部判定不能） | 出典PDFのテキスト抽出不可。「世界的な代表事例」はやや評価的 |
| dp-0009 | 概ね正確（一部判定不能） | 出典PDFのテキスト抽出不可。記述内容は一般情報と矛盾しない |
| dp-0010 | 根拠不足が多い | 出典URL（meta.wikimedia.org）が403エラーでアクセス不可。全項目検証不能 |
| dp-0011 | 概ね正確 | 出典では「Workplace Analytics」名義。「Viva Insights」はリブランド後の名称 |
| dp-0012 | 要修正 | PriPeARL等の記述の根拠となるLinkedInエンジニアリングブログがsourcesに未掲載。出典外の情報を含む |
| dp-0013 | 要修正 | 出典で「preview」明記だがcase.jsonに未反映。「中央差分プライバシー型」「query sensitivity」の根拠不足 |
