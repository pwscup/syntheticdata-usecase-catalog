# 事例カタログ レビュー結果

レビュー実施日: 2026-03-15

レビュー対象: fpf-0001, fpf-0002, fpf-0003, fpf-0004, fpf-0005, fpf-0006, psd-0001, psd-0002, psd-0003, psd-0006, fl-0003, 624b58fd-f5bd-4a82-8044-d5f815e6aab7, 63559299-7438-47d7-a013-7cca59fcfd05

---

## fpf-0001: 金融サービスにおける脆弱顧客検知システムの有効性検証への合成データ活用

### 総合判定
概ね正確

### 総評
ICO出典ページの内容と概ね整合している。ただし、ICO出典では銀行名は匿名化されており「RetailBank」と記載され、合成データプロバイダも「SynthGen」と記載されている。case.jsonではorganizationに「ICO / Hazy / Nationwide Building Society」と記載しているが、ICO出典ページ本文ではHazyやNationwideの名前は直接登場しない（FPFリポジトリおよびGOV.UKリポジトリではICO x Hazy and Nationwide Building Societyとして掲載されている）。summaryの「英国の大手銀行」という表現は「RetailBank」の匿名表記を適切に反映しているが、organizationフィールドで具体名を明記している点との整合性に注意が必要。技術的記述（ベイジアンネットワーク、自己回帰モデル、差分プライバシーε=5、5万人・5,000万件）はICO出典と正確に一致する。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/privacy-enhancing-technologies/case-studies/synthetic-data-to-test-the-effectiveness-of-a-vulnerable-persons-detection-system-in-financial-services/ | 可 | 主要出典。技術詳細・データ規模・プライバシー手法の根拠 | 銀行名は「RetailBank」、合成データプロバイダは「SynthGen」と匿名化 |
| https://fpf.org/global/repository-for-privacy-enhancing-technologies-pets/ | 可 | FPFリポジトリでの掲載確認 | 「ICO x Hazy and Nationwide Building Society」として掲載 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | ICO / Hazy / Nationwide Building Society | 概ね正確 | FPFリポジトリ | ICO出典本文では匿名化されているが、FPF/GOV.UKリポジトリでは実名で掲載。出典間で表記が異なる点を注記すべき | noteに「ICO出典本文では匿名化表記」と追記 |
| summary | 英国の大手銀行が...ICOの監督のもと、Nationwide Building Societyと連携して実施 | 概ね正確 | ICO出典 | ICO出典では「RetailBank」表記。FPFリポジトリで実名が判明する構造 | 「ICOケーススタディでは匿名化表記だが、FPFリポジトリではNationwide Building Societyとして掲載」と注記 |
| summary | 約5万人の顧客・5,000万件の取引データ | 正確 | ICO出典 | "over 50,000 customers...approximately 50 million transactions"と一致 | - |
| privacy_enhancement_method | ベイジアンネットワーク、自己回帰モデル、差分プライバシー（ε=5） | 正確 | ICO出典 | Bayesian network models, autoregressive models, epsilon value of 5と一致 | - |
| safety_assurance_method | オンプレミス処理、合成ID置換、再識別禁止条項 | 正確 | ICO出典 | on-premises solution、synthetic IDs、契約条項への言及あり | - |
| utility_evaluation_method | 分布、相関、分類精度、重要度ランキング、自己相関パターン比較 | 正確 | ICO出典 | probability distributions, attribute co-dependencies, classification task, feature importance, autocorrelationと一致 | - |
| value_proposition | データ準備期間の大幅な短縮 | 正確 | ICO出典 | 出典に準備期間短縮への言及あり | - |
| technology_category | synthetic_data | 正確 | ICO出典 | 合成データ生成が主技術 | - |
| usecase_category | フィージビリティ検証 | 正確 | ICO出典 | システムの有効性テストが目的 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。出典では実施済みのケーススタディとして記載
- 技術解釈の飛躍: なし。技術詳細はICO出典と正確に一致
- 価値記述の言い過ぎ: なし

---

## fpf-0002: 金融弱者早期把握アプリのプロトタイプ開発への合成データ活用

### 総合判定
概ね正確

### 総評
GOV.UKリポジトリの記載と概ね整合している。Accenture/Hazyの連携、「8倍の速度」での立ち上げ、プロトタイプ開発という記述は出典に裏付けられる。GOV.UKリポジトリでのステータスは「Product」とされているが、case.jsonの記述はプロトタイプ開発段階の内容であり、この点は出典の「Product」表記との間に若干のギャップがある。「英国政府の『Fostering Better Finance』プロジェクト」という記述の直接的裏付けがGOV.UKリポジトリの簡潔な記載からは確認しきれないが、矛盾する記述もない。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://www.gov.uk/guidance/repository-of-privacy-enhancing-technologies-pets-use-cases/finance-and-insurance | 可 | 主要出典。Accenture/Hazy事例の確認 | Status: Product。8倍高速化の記述あり |
| https://fpf.org/global/repository-for-privacy-enhancing-technologies-pets/ | 可 | FPFリポジトリでの掲載確認 | 本事例の個別記載は確認できず |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | Accenture / Hazy | 正確 | GOV.UK | 出典にAccentureとHazyの名前あり | - |
| summary | 英国政府の「Fostering Better Finance」プロジェクト | 根拠不足 | GOV.UK | GOV.UKリポジトリの簡潔な記載からはプロジェクト名の直接確認が困難 | 根拠を補足するか、「英国政府関連プロジェクト」程度に弱める |
| summary | 通常の8倍の速度でプロジェクトを立ち上げた | 正確 | GOV.UK | "launch the project 8 times faster than expected"と一致 | - |
| value_proposition | プロジェクト開始までの期間を8分の1に短縮 | 正確 | GOV.UK | 8倍高速化と整合 | - |
| privacy_enhancement_method | Hazy社の合成データ生成プラットフォーム | 正確 | GOV.UK | Hazyの合成データ技術への言及あり | - |
| safety_assurance_method | 合成データには実在の顧客情報が一切含まれない | 概ね正確 | GOV.UK | 出典では「セキュリティ・ガバナンス要件の簡素化」に言及。「一切含まれない」は合成データの一般的性質だが、出典での明示的表現ではない | - |
| utility_evaluation_method | プロトタイプアプリを実際に開発し精度維持を実証 | 概ね正確 | GOV.UK | プロトタイプ開発は出典に記載。「精度維持を実証」の具体的記述は出典では限定的 | 「プロトタイプの開発に成功」程度に留める |
| usecase_category | 組織間データ共有、フィージビリティ検証 | 概ね正確 | GOV.UK | フィージビリティ検証は妥当。組織間データ共有の側面は出典から直接確認しにくい | - |

### 特に重要な懸念
- 関係性の過剰推定: 軽微。「Fostering Better Finance」プロジェクト名の出典確認が不十分
- 実施段階の言い過ぎ: あり。GOV.UKでは「Product」ステータスだが、case.jsonの記述はプロトタイプ段階の内容。出典のステータスと記述内容のギャップを明確にすべき
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし

---

## fpf-0003: 保険分野における合成データを用いた予測分析の最適化

### 総合判定
概ね正確

### 総評
GOV.UKリポジトリおよび日本総研PDF（P.16）の記載と概ね整合する。Provinzial/Staticeの連携、3か月以上の短縮、97%の有用性達成は日本総研PDF（Statice社の事例紹介に基づく二次情報）で確認できる。4週間のリードタイム短縮も同PDFに記載あり。GOV.UKリポジトリでのステータスは「Product」。「next best offer」推薦エンジンへの言及もGOV.UKに記載あり。Statice社の具体的な技術手法（GAN+VAE）は日本総研PDFのベンダー表（P.19）で確認できるが、case.jsonでは技術手法の詳細には踏み込んでいない。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://www.gov.uk/guidance/repository-of-privacy-enhancing-technologies-pets-use-cases/finance-and-insurance | 可 | 主要出典。Statice/Provinzial事例確認 | Status: Product。3か月短縮、next best offerへの言及あり |
| https://fpf.org/global/repository-for-privacy-enhancing-technologies-pets/ | 可 | FPFリポジトリでの掲載確認 | 本事例の個別記載は確認できず |
| https://www.jri.co.jp/MediaLibrary/file/column/opinion/pdf/14266.pdf | 可 | 数値の裏付け | P.16にProvinzial事例詳細（3カ月短縮、97%、4週間短縮）の記載あり。出典はStatice社公式サイト |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | Provinzial / Statice | 正確 | GOV.UK, JRI PDF | 両出典で確認 | - |
| summary | 3か月以上短縮 | 正確 | GOV.UK, JRI PDF | "Saved over three months"、JRI PDFに「最大で3カ月短縮」 | - |
| value_proposition | 合成データの有用性は元データの97%を達成 | 正確 | JRI PDF | P.16に「有用性の評価で元データの97%を達成」と記載（出典はStatice社サイト） | - |
| value_proposition | データ入手リードタイム4週間短縮 | 正確 | JRI PDF | P.16に「データ入手までの時間を4週間短縮」と記載 | - |
| privacy_enhancement_method | Statice社の合成データプラットフォーム | 正確 | GOV.UK, JRI PDF | Statice社の技術利用は確認済み | - |
| safety_assurance_method | Staticeプラットフォームのプライバシー保護機能 | 概ね正確 | JRI PDF | JRI PDF P.19でStaticeの安全性指標に「差分プライバシー、識別、連結、属性推定」と記載。case.jsonでは具体的手法に言及なし | 安全性指標の具体名を追記検討 |
| utility_evaluation_method | 実データモデルとの精度比較 | 概ね正確 | GOV.UK | next best offer等の予測モデルへの言及あり。「97%」の評価方法の詳細は出典では限定的 | - |
| usecase_category | 組織内データ共有、R&D | 概ね正確 | JRI PDF | P.16で「組織内でのデータ共有」事例として分類。R&Dの側面も妥当 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。GOV.UKで「Product」ステータス
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし。数値は出典で裏付け済み

---

## fpf-0004: 研究用合成医療記録データの生成と公開

### 総合判定
概ね正確

### 総評
GOV.UKリポジトリの記載と概ね整合する。Replica Analytics、University of Alberta、Health Cities、Merck Canadaの連携、10万件の医療記録、学生・研究者向けの活用は出典で確認できる。GOV.UKでのステータスは「Product」であり、case.jsonの「製品レベル（Product）として運用段階に到達」という記述と一致する。ただし、「アルバータ州情報・プライバシーコミッショナーが助言役として参画」はGOV.UKの出典で「Alberta Innovates」「Office of the Information and Privacy Commissioner of Alberta」がadvisorsとして記載されており正確。「Alberta Innovates」がcase.jsonのorganizationに含まれていない点は軽微な欠落。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://www.gov.uk/guidance/repository-of-privacy-enhancing-technologies-pets-use-cases/health-and-social-care | 可 | 主要出典 | Status: Product。組織名・データ規模・目的の記載あり |
| https://fpf.org/global/repository-for-privacy-enhancing-technologies-pets/ | 可 | FPFリポジトリでの掲載確認 | 本事例の個別記載は確認できず |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | Replica Analytics / University of Alberta / Health Cities | 概ね正確 | GOV.UK | Merck Canadaも参画組織として記載あり。Alberta Innovatesもadvisorとして参画 | organizationにMerck Canadaを追加、またはsummaryで言及 |
| summary | 10万件の医療記録から合成医療データを生成 | 正確 | GOV.UK | "100,000 healthcare records"と一致 | - |
| summary | 製薬会社Merck Canada | 正確 | GOV.UK | 出典に記載あり | - |
| privacy_enhancement_method | Replica Analytics社の合成データ技術 | 正確 | GOV.UK | 出典にReplica Analyticsの技術利用を確認 | - |
| safety_assurance_method | 個人の特定は原理的に不可能 | 概ね正確 | GOV.UK | 出典では「allows students and researchers to undertake projects which would normally be limited due to privacy concerns」。「原理的に不可能」は技術的に正しいが、出典での表現とは異なる | 「合成データは実在の患者と一対一で対応しないため、個人特定リスクが大幅に低減」程度に |
| value_proposition | 製品レベルとして運用段階に到達した実績あり | 正確 | GOV.UK | Status: Productと一致 | - |
| utility_evaluation_method | 統計的特性を比較し検証 | 根拠不足 | - | 出典では具体的な有用性評価方法の詳細記載なし | 「出典では有用性評価の具体的方法は明記されていない」旨を注記 |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。GOV.UKで「Product」ステータス
- 技術解釈の飛躍: 軽微。「個人の特定は原理的に不可能」は合成データの一般論としては正しいが、出典はここまで強い表現をしていない
- 価値記述の言い過ぎ: なし

---

## fpf-0005: 統計機関におけるハッカソン・トレーニング用合成データの提供

### 総合判定
正確

### 総評
UN Statistics WikiおよびGOV.UKリポジトリの記載と高い精度で整合する。Statistics Canadaによる合成データ生成、FCS+CART/回帰手法、33-47変数のデータセット、2018年・2019年のハッカソン、PUMFs基準での開示リスク評価、参加者への同意書義務付けなど、すべて出典で裏付けられる。技術的記述も正確。GOV.UKでのステータスは「Pilot」であり、case.jsonの記述もパイロット段階の内容として妥当。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://unstats.un.org/wiki/display/UGTTOPPT/10.+Statistics+Canada%3A+Trialling+the+use+of+synthetic+data | 可 | 主要出典。技術詳細・ハッカソン情報 | FCS+CART、33-47変数、2018/2019ハッカソン等の詳細あり |
| https://www.gov.uk/guidance/repository-of-privacy-enhancing-technologies-pets-use-cases/national-statistics-education-and-transport | 可 | GOV.UKリポジトリでの確認 | Status: Pilot |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | Statistics Canada | 正確 | UN Wiki, GOV.UK | 両出典で確認 | - |
| summary | 33〜47変数のセンシティブなリンクデータ | 正確 | UN Wiki | 33変数と47変数の2データセットの記載と一致 | - |
| summary | 国勢調査と死亡登録・がん登録をリンク | 正確 | UN Wiki | "2006 Census + 2015 Mortality Registry"および"Cancer Registry"と一致 | - |
| privacy_enhancement_method | FCS＋CART/回帰モデル、大量代入法 | 正確 | UN Wiki | "Fully Conditional Specification approach with CART and regression methods"と一致 | - |
| safety_assurance_method | PUMFs基準で開示リスク評価、同意書署名義務 | 正確 | UN Wiki | 出典に両方の記載あり | - |
| utility_evaluation_method | 2回のハッカソンで実データとの分析結果を比較 | 正確 | UN Wiki | "Analytical value was comparable to the original datasets"と一致 | - |
| value_proposition | 2018年・2019年の2回のハッカソンで実証 | 正確 | UN Wiki | 出典に2018/2019の記載あり | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし

---

## fpf-0006: モバイルネットワークデータを用いた公式統計作成の大規模検証

### 総合判定
要修正

### 総評
UN Statistics WikiおよびGOV.UKリポジトリの記載と概ね整合するが、technology_categoryが「synthetic_data」のみとなっている点に問題がある。本事例の主要な技術的焦点はTEE（信頼実行環境）とセキュア計算であり、合成データは検証用テストデータとして生成されたものであって、PETsとしての本質はTEE/セキュア計算にある。GOV.UKリポジトリでも技術カテゴリは「Trusted Execution Environment, Synthetic Data」と並列記載されている。また、GOV.UKでのステータスは「Proof of Concept」であり、case.jsonのsummaryで「実現可能性を実証」としている点は適切。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://unstats.un.org/wiki/display/UGTTOPPT/3.+Eurostat%3A+Processing+of+longitudinal+mobile+network+operator+data | 可 | 主要出典。技術詳細・規模 | TEE、Intel SGX、Sharemind HI、k-anonymity、1億人規模の詳細あり |
| https://www.gov.uk/guidance/repository-of-privacy-enhancing-technologies-pets-use-cases/national-statistics-education-and-transport | 可 | GOV.UKリポジトリでの確認 | Status: Proof of Concept。技術: TEE, Synthetic Data |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | Eurostat / Cybernetica | 正確 | UN Wiki, GOV.UK | 両出典で確認 | - |
| technology_category | synthetic_data | 要修正 | GOV.UK | GOV.UKでは「Trusted Execution Environment, Synthetic Data」。TEEが主要技術であり、合成データは検証用 | ["synthetic_data", "tee"]または["synthetic_data", "secure_computation"]に変更 |
| summary | 最大1億人規模のモバイルユーザーを模した合成データ | 正確 | UN Wiki | "population of up to 100 million mobile users"と一致 | - |
| summary | セキュリティ技術（信頼実行環境）とプライバシー保護ソフトウェア | 正確 | UN Wiki | TEE + Sharemind HIへの言及と一致 | - |
| privacy_enhancement_method | 匿名化されたユーザーID・時刻・位置の形式で合成データ生成 | 正確 | UN Wiki | "<user_pseudonym, time, location>"形式と一致 | - |
| safety_assurance_method | 仮名ID 24時間自動変更、k-匿名性、セキュアエンクレーブ | 正確 | UN Wiki | pseudonyms rotated every 24 hours、k-anonymity、hardware isolationと一致 | - |
| utility_evaluation_method | スケーラビリティ検証（処理速度・メモリ） | 正確 | UN Wiki | "scalability is not a point of major concern"、I/O bandwidth評価の記載あり | - |
| value_proposition | 1億人規模の人口移動統計を作成できることを実証 | 概ね正確 | UN Wiki | PoC段階の実証であり、「作成できることを実証」は「スケーラビリティの観点から実現可能性を示した」がより正確 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。PoC段階として適切に記述
- 技術解釈の飛躍: あり。technology_categoryが「synthetic_data」のみだが、本事例の本質的PETsはTEE/セキュア計算。合成データはテストデータとしての役割
- 価値記述の言い過ぎ: 軽微。PoC段階であることは記述されているが、「実証した」の表現が若干強い

---

## psd-0001: 米国国勢調査局：SIPP Synthetic Betaによる家計・所得データの部分合成公開

### 総合判定
概ね正確

### 総評
SIPP Synthetic Beta（SSB）の概要PDFの内容と整合する。部分合成データ（partially synthetic）のアプローチ、SIPPデータと行政データ（税・給付）の統合、研究利用可能性の向上という記述は正確。ただしstatus: seedで多くの項目が「調査中」のため、現時点ではsummary以外の詳細評価は困難。PDFによると、SRMI（Sequential Regression Multivariate Imputation）手法で16の合成implicateを生成し、開示リスクテストも実施済み。SSBは複数バージョンが公開されており（v5.1時点で1990-2004年パネル）、運用段階のデータ製品である。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://www.census.gov/programs-surveys/sipp/guidance/sipp-synthetic-beta-data-product.html | 可（ただしJS主体で内容抽出が限定的） | SIPP Synthetic Betaの公式ページ | ページ構造上テキスト抽出困難だがページ自体は存在 |
| https://www.census.gov/content/dam/Census/programs-surveys/sipp/methodology/SSBdescribe_nontechnical.pdf | 可 | SSBの作成方法・方法論の詳細PDF | 部分合成の方法論、SRMI、開示リスクテストの詳細あり |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | U.S. Census Bureau | 正確 | SSB PDF | 著者はCensus BureauおよびCornell Universityの研究者 | - |
| summary | SIPP調査データを税・給付の行政データと統合したうえで公開用に部分合成化 | 正確 | SSB PDF | "Survey of Income and Program Participation data linked to administrative earnings and benefits"と一致 | - |
| summary | 機微な変数を合成値で置換 | 正確 | SSB PDF | 部分合成データの説明として正確。全変数を合成化する手法の記載あり | - |
| usecase_category | 公的利用 | 正確 | SSB PDF | 研究者向けの公開データ製品 | - |
| technology_category | synthetic_data | 正確 | SSB PDF | 部分合成データは合成データの一種 | - |
| value_proposition〜utility_evaluation_method | 調査中 | 判定不能 | - | seed段階のため未記入 | 今後の調査で補完 |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし（「調査中」で留めている）

---

## psd-0002: 米国国勢調査局：OnTheMap/LODESによる就業地・居住地データの部分合成公開

### 総合判定
概ね正確

### 総評
OnTheMap Synthetic Data PDFの内容と概ね整合する。OnTheMapは「the first partially synthetic data released by the Census Bureau」（2006年初版公開）であり、居住地側のデータを合成的に生成するアプローチは出典と一致する。ベイジアンモデリング手法（Calibrated Bayesian approach, Multinomial-Dirichlet）を用いており、case.jsonのsummaryでの「居住地側の秘匿保護のために部分合成データ手法を使用」は正確。ただし出典をより正確に読むと、OnTheMapは居住地側だけでなく就業地と居住地の「組み合わせ」のデータ全体を合成的に生成しているため、「居住地側のみ部分合成」という表現はやや不正確。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://lehd.ces.census.gov/applications/help/onthemap.html | 可 | OnTheMapの概要ページ | LODESデータへのリンクあり。合成データの具体的記述は限定的 |
| https://lehd.ces.census.gov/doc/help/OTMSyntheticData%2005262009-jma.pdf | 可 | OnTheMap合成データの技術詳細PDF | Calibrated Bayesian approach、Multinomial-Dirichlet、2006年公開等の詳細あり |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | U.S. Census Bureau | 正確 | OTM PDF | Census Bureauによる公開 | - |
| summary | 居住地側の秘匿保護のために部分合成データ手法を使用 | 概ね正確 | OTM PDF | 出典では就業地・居住地の「組み合わせ」全体を合成。「居住地側のみ」は簡略化 | 「就業地と居住地の組み合わせデータを合成的に生成」に修正 |
| summary | 全件をfully syntheticにするのではなく、公開困難な部分だけを合成化 | 概ね正確 | OTM PDF | OnTheMapは確かにpartially syntheticだが、出典では全worker recordsが合成されている。「部分」はレコード単位ではなくデータセット全体の中での位置づけ | 表現を精密化 |
| figures | 居住地側のみ部分合成データ化 | 要修正 | OTM PDF | 上記と同じ。就業地・居住地ペアの合成 | 修正 |
| usecase_category | 公的利用 | 正確 | OTM PDF | 公開データ製品 | - |
| value_proposition〜utility_evaluation_method | 調査中 | 判定不能 | - | seed段階 | 今後の調査で補完 |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし
- 技術解釈の飛躍: あり。「居住地側のみ部分合成」は出典の内容を正確に反映していない。OnTheMapではworker recordsの全体が合成的に生成されている
- 価値記述の言い過ぎ: なし

---

## psd-0003: 米国国勢調査局：退役軍人データの高リスクレコード部分合成

### 総合判定
概ね正確

### 総評
Hawala & Funk (2007) のFCSM論文の内容と概ね整合する。American Community Survey（ACS）の退役軍人データに対して、高リスクレコード（uncommon records）の一部変数のみを合成対象にするアプローチは出典と一致する。ただし、case.jsonのtitleで「Veteransデータ」と記載されているが、出典ではACS（American Community Survey）の退役軍人部分であることが明確で、独立した「Veteransデータセット」ではない。また、case.jsonのsummaryで「全件合成ではなく、高リスク部分だけを選択的に置換する実務設計の事例」としているが、出典では「work on this project, which is still in progress」と記載されており、完成した実務設計ではなく研究段階のプロジェクトである。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://nces.ed.gov/FCSM/pdf/2007FCSM_Hawala-IX-B.pdf | 可 | 唯一の出典。技術詳細 | 2007年FCSM発表論文。U.S. Census Bureau所属の著者。研究段階（still in progress） |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | U.S. Census Bureau | 正確 | FCSM PDF | 著者はCensus Bureau所属 | - |
| title | 退役軍人データの高リスクレコード部分合成 | 概ね正確 | FCSM PDF | 正確にはACSの退役軍人部分。独立データセットではない | 「ACS退役軍人データの高リスクレコード部分合成」に |
| summary | 高リスクレコードの一部変数のみを合成対象にする部分合成設計 | 正確 | FCSM PDF | "designate for synthesis only a subset of the records, and a subset of variables for those records"と一致 | - |
| summary | 実務設計の事例 | 要修正 | FCSM PDF | 出典では"still in progress"。完成した実務設計ではなく研究段階 | 「研究段階の事例」に修正 |
| figures | 統計分析・政策立案に活用 | 根拠不足 | FCSM PDF | 出典ではVA（退役軍人省）向けの集計用途。「政策立案」は出典に明記なし | 「退役軍人省向けの集計・分析に活用」に |
| figures | 全件合成より精度を維持し秘匿化 | 概ね正確 | FCSM PDF | 出典では精度維持について"distributions of synthetic and original data are not homogenous"と課題も指摘 | 課題の存在も反映すべき |
| usecase_category | 公的利用 | 概ね正確 | FCSM PDF | 将来的にはVA向け公開データ製品を目指すが、研究段階 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: あり。出典では「still in progress」（研究進行中）だが、case.jsonでは「実務設計の事例」として完成形のように記述
- 技術解釈の飛躍: なし。部分合成の技術記述は正確
- 価値記述の言い過ぎ: 軽微。出典ではデータ品質に課題があることも指摘されているが、case.jsonでは反映されていない

---

## psd-0006: 日本統計学会：部分合成・疑似データを用いた統計的マッチング手法

### 総合判定
要修正

### 総評
出典PDF（JMRA講演資料）は立正大学・高部勲教授による合成データ概説の講演資料であり、case.jsonのtitleにある「日本統計学会」は出典に記載がない。出典は「日本マーケティング・リサーチ協会」（JMRA）での講演（2024年2月14日）である。organizationが「日本マーケティング・リサーチ協会」となっているのはJMRAが講演を主催したことに基づくが、JMRAは講演の場を提供しただけであり、研究主体ではない。研究主体は立正大学データサイエンス学部の高部勲教授。また、case.jsonのsummaryで「統計的マッチングやパネルデータ作成」に言及しているが、出典では統計的マッチングはオンサイト利用におけるデータ共有の課題の文脈で触れられており、具体的な合成データ事例というよりは概説・研究手法の整理である。事例としての切り出しが適切かどうか疑問が残る。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://www.jmra-net.or.jp/Portals/0/committee/statistics/nenji2024_material_2.pdf | 可 | 唯一の出典。講演資料 | 立正大学・高部勲教授のJMRA講演（2024/2/14）。合成データ概説 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| title | 日本統計学会：部分合成・疑似データを用いた統計的マッチング手法 | 要修正 | JMRA PDF | 「日本統計学会」は出典に記載なし。講演は「日本マーケティング・リサーチ協会」で開催 | 「JMRA講演：合成データの概要と公的統計への応用」等に修正 |
| organization | 日本マーケティング・リサーチ協会 | 要修正 | JMRA PDF | JMRAは講演主催者。研究主体は立正大学・高部勲教授 | 「立正大学データサイエンス学部」に修正、JMRAは講演主催として注記 |
| summary | 統計的マッチングやパネルデータ作成による情報量増加が整理されている | 概ね正確 | JMRA PDF | スライド33-35で統計的マッチングとデータ共有の課題に言及あり | - |
| summary | 共通変数を接着剤として異なるデータソースを疑似的に結合する手法の研究事例 | 概ね正確 | JMRA PDF | 概説資料であり「研究事例」というよりは「手法の概説」 | 「手法の概説」に修正 |
| usecase_category | R&D | 概ね正確 | JMRA PDF | 研究概説であり、具体的な実装事例ではない | - |
| tags | 部分合成データ、統計的マッチング、疑似結合 | 概ね正確 | JMRA PDF | 出典の内容を反映しているが、主題は合成データ全般の概説 | - |

### 特に重要な懸念
- 関係性の過剰推定: あり。JMRAを研究主体のように位置づけているが、実際は講演会場の提供者
- 実施段階の言い過ぎ: なし（「調査中」で留めている）
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし
- 事例切り出しの妥当性: 疑問あり。これは合成データの概説講演資料であり、特定の事例・プロジェクトではない。事例カタログのエントリとしては不適切な可能性がある

---

## fl-0003: NICT・神戸大学・エルテス・テラアクソン：3銀行による継続学習型の不正送金検知

### 総合判定
概ね正確

### 総評
NICTプレスリリース（2025年7月22日）の内容と高い精度で整合する。組織名（NICT、神戸大学、エルテス、テラアクソン、千葉銀行、中国銀行、三井住友信託銀行）、技術名（DeepProtect、eFL-Boost）、成果（再現率の平均18ポイント改善、約89%以上の再現率）、行内実証開始はすべて出典で裏付けられる。ただし、technology_categoryに「secure_computation」が含まれているが、出典ではDeepProtectの暗号技術は連合学習のパラメータ保護のためであり、独立した「秘密計算」技術としての位置づけではない。準同型暗号の使用はeFL-Boostで言及されている。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://www.nict.go.jp/press/2025/07/22-1.html | 可 | 唯一の出典。NICTプレスリリース | 2025/7/22発表。組織名・技術・成果の詳細あり |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | NICT・神戸大学・エルテス・テラアクソン | 正確 | NICT | 出典に4組織の記載あり | - |
| summary | 千葉銀行、中国銀行、三井住友信託銀行と連携 | 正確 | NICT | 「協力金融機関」として3行の記載あり | - |
| summary | 再現率が平均18ポイント程度改善 | 正確 | NICT | 「平均18ポイント程度の改善」と一致 | - |
| summary | 協力銀行1行で行内実証を開始 | 正確 | NICT | テラアクソンが「行内実証実験を開始」と記載 | - |
| technology_category | federated_learning, secure_computation | 概ね正確 | NICT | 連合学習は明確。暗号技術（準同型暗号含む）は連合学習の保護手段として使用。独立した秘密計算とみなすかは解釈次第 | 注記で「暗号技術は連合学習のパラメータ保護として使用」と明確化 |
| value_proposition | 継続学習により変化する犯罪手口に対応し、再現率が個別学習比で平均18ポイント改善 | 正確 | NICT | 出典の記載と一致 | - |
| utility_evaluation_method | 個別学習モデルとの再現率比較、継続学習シナリオでの性能評価 | 正確 | NICT | 出典に記載あり | - |
| usecase_category | 組織間データ共有 | 正確 | NICT | 3銀行間での連合学習は組織間データ共有に該当 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。実証段階＋行内実証開始という記述は出典と一致
- 技術解釈の飛躍: 軽微。「secure_computation」のカテゴリ付与は、連合学習における暗号技術の使用を独立した秘密計算技術と位置づけるかどうかの解釈問題
- 価値記述の言い過ぎ: なし

---

## 624b58fd-f5bd-4a82-8044-d5f815e6aab7: 大学PBL講義における合成データ提供

### 総合判定
概ね正確

### 総評
SMBC PDFおよびJRI Webページの内容と概ね整合する。三井住友銀行・日本総合研究所・一橋大学の3者連携、PBL演習での合成データ提供、PETs（合成データ生成技術）の活用は出典で裏付けられる。ただし、organizationが「三井住友銀行」のみとなっているが、出典ではSMBCと日本総合研究所（日本総研）の共同発表であり、日本総研は合成データ生成技術の専門知識を提供する役割として明記されている。また、2025年度開始予定の取り組みであり、case.json作成時点（2026年3月）では開始後だが、出典自体は2024年12月26日のプレスリリースで将来計画の発表。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://www.smbc.co.jp/news/pdf/j20241226_01.pdf | 可 | 主要出典。SMBCプレスリリース | 2024/12/26。3者連携、PBL演習、合成データ生成技術の詳細あり |
| https://www.jri.co.jp/page.jsp?id=109678 | 可 | JRI側の発表 | SMBC PDF と同内容。日本総研の役割が明確 |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | 三井住友銀行 | 要修正 | SMBC PDF, JRI | 日本総合研究所も主要な役割（合成データ生成技術の提供）。一橋大学も連携先 | 「三井住友銀行 / 日本総合研究所 / 一橋大学」に修正 |
| summary | 三井住友銀行と日本総研は、合成データ生成技術（PETs）を活用して個人特定不可能な疑似データを作成 | 正確 | SMBC PDF | 「プライバシー保護のための先端技術（PETs）のひとつである合成データ生成技術を活用し、個人の特定ができない形にしてから提供」と一致 | - |
| summary | 一橋大学ソーシャル・データサイエンス学部のPBL演習に提供 | 正確 | SMBC PDF | 2025年度から3年次必修科目として開講と記載 | - |
| value_proposition | 次世代のデータサイエンティスト育成に貢献 | 概ね正確 | SMBC PDF | 「次世代のデータサイエンティストを育成することを目的」と概ね一致 | - |
| value_proposition | 受講生がPETsの重要性を体験的に学ぶ機会を創出 | 正確 | SMBC PDF | 「プライバシー保護の重要性についても学ぶことを期待」と一致 | - |
| usecase_category | 組織間データ共有 | 正確 | SMBC PDF | 銀行から大学への合成データ提供は組織間データ共有 | - |
| technology_category | synthetic_data | 正確 | SMBC PDF | 合成データ生成技術の使用は明確 | - |
| domain_sub | 学術 | 正確 | SMBC PDF | 大学教育への活用 | - |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: 軽微。出典は2024年12月のプレスリリースで2025年度開始予定の発表。case.json作成時点（2026年3月）では開始されている可能性が高いが、実施後の成果報告ではない
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: 軽微。「実践的に学ぶことを可能にした」は出典時点では将来の計画。「可能にすることを目指す」がより正確

---

## 63559299-7438-47d7-a013-7cca59fcfd05: デジタルマーケティング分析高度化を目的とした統計合成データ活用

### 総合判定
概ね正確

### 総評
博報堂DYホールディングスのプレスリリース（2025年4月）の内容と概ね整合する。博報堂DYホールディングスとAcompanyの連携、統計合成データの有用性・安全性評価、差分プライバシーによる安全性担保は出典で裏付けられる。実施段階は「実証実験」であり、case.jsonでも実証段階として適切に記述されている。外部協力として光和総合法律事務所（渡邊涼介弁護士）、群馬大学（千田浩司准教授）が参画している点はcase.jsonに反映されていないが、主要な実施主体は正確。

### source確認結果
| URL | 参照可否 | 主な用途 | 備考 |
|-----|---------|---------|------|
| https://www.hakuhodody-holdings.co.jp/news/corporate/2025/04/5365.html | 可 | 唯一の出典。プレスリリース | 2025年4月。実証実験の概要・成果・今後の展望あり |

### 項目別レビュー
| 項目 | case.jsonの記載 | 判定 | 根拠URL | 指摘内容 | 修正案 |
|------|---------------|------|---------|---------|-------|
| organization | 株式会社博報堂DYホールディングス、株式会社Acompany | 正確 | 博報堂DY | 出典と一致 | - |
| summary | 生活者データを基に統計合成データを生成し、実データと比較して有用性と安全性を評価 | 正確 | 博報堂DY | 出典の記載と一致 | - |
| summary | 有用性は実データ比で遜色ない精度を確認しつつ、差分プライバシーにより数学的な安全性を担保 | 正確 | 博報堂DY | 「遜色ない精度を保有する」「数学的な安全性の担保を実現」と一致 | - |
| value_proposition | 今後はデジタルマーケティング分野で...目指している | 概ね正確 | 博報堂DY | 出典では今後の展望として記載。「目指している」は適切な弱い表現 | - |
| privacy_enhancement_method | 統計的手法 | 概ね正確 | 博報堂DY | 出典では「実データを統計データに集約した上で擬人化したパーソナルデータを生成」。より具体的な記述が可能 | 「実データを統計データに集約し、統計合成データを生成」に |
| safety_assurance_method | 差分プライバシー | 正確 | 博報堂DY | 「差分プライバシーにより数学的な安全性の担保を実現」と一致 | - |
| utility_evaluation_method | 実データとの精度比較 | 正確 | 博報堂DY | 出典の記載と一致 | - |
| usecase_category | R&D、フィージビリティ検証 | 正確 | 博報堂DY | 実証実験段階であり、R&D・フィージビリティ検証に該当 | - |
| technology_category | 記載なし | 要修正 | - | technology_categoryフィールドが存在しない | "synthetic_data"を追加 |
| review_status | 記載なし | - | - | review_statusフィールドが存在しない | "ai_generated"を追加 |

### 特に重要な懸念
- 関係性の過剰推定: なし
- 実施段階の言い過ぎ: なし。実証実験段階として適切
- 技術解釈の飛躍: なし
- 価値記述の言い過ぎ: なし。「目指している」という弱い表現が適切に使用されている

---

## サマリ

| 事例ID | 総合判定 | 主な指摘 |
|--------|---------|---------|
| fpf-0001 | 概ね正確 | ICO出典では組織名が匿名化されている点の注記が必要。技術詳細は正確 |
| fpf-0002 | 概ね正確 | 「Fostering Better Finance」プロジェクト名の出典裏付けが弱い。GOV.UKステータスProduct vs プロトタイプ記述のギャップ |
| fpf-0003 | 概ね正確 | 数値（3か月、97%、4週間）は日本総研PDFで裏付け済み。Staticeの安全性指標の具体名追記を推奨 |
| fpf-0004 | 概ね正確 | organizationにMerck Canadaが欠落。「原理的に不可能」の表現がやや強い |
| fpf-0005 | 正確 | 出典との整合性が高く、技術詳細も正確 |
| fpf-0006 | 要修正 | technology_categoryにTEE/セキュア計算を追加すべき。本事例のPETsの本質はTEEであり合成データはテストデータ |
| psd-0001 | 概ね正確 | seed段階で多くが「調査中」。summaryは出典と整合 |
| psd-0002 | 概ね正確 | 「居住地側のみ部分合成」は不正確。就業地・居住地ペア全体が合成される |
| psd-0003 | 概ね正確 | 出典では「still in progress」（研究段階）だが、case.jsonでは「実務設計の事例」と記述。実施段階の言い過ぎ |
| psd-0006 | 要修正 | titleの「日本統計学会」は出典になし（JMRAが正しい）。organizationも研究主体でなく講演主催者。事例としての切り出しが不適切な可能性 |
| fl-0003 | 概ね正確 | technology_categoryのsecure_computationは連合学習の暗号保護手段であり独立技術かは解釈次第 |
| 624b58fd | 概ね正確 | organizationに日本総合研究所・一橋大学が欠落。出典は将来計画の発表 |
| 63559299 | 概ね正確 | technology_categoryフィールドが欠落。実証実験段階として適切に記述 |
