現時点で、確認事項はありません。
既存カタログとの照合はあえて行わず、**重複排除前の一次収集**として、幅広く拾います。各行末の出典リンクから元記事を開けます。

## まず押さえるべき「事例集・横断レポート」

* **FCA report: Using Synthetic Data in Financial Services** — 金融分野の合成データ活用を体系的に整理したレポートです。fraud detection、credit scoring の reject inference、open banking のシステム検証、APP fraud、AML など、複数の具体用途がまとまっており、追加探索の起点として非常に使いやすいです。 ([FCA][1])

* **GOV.UK: Repository of PETs Use Cases / Finance and Insurance** — 金融・保険分野のPET活用事例集で、synthetic data の事例も含まれます。単独の導入事例だけでなく、金融犯罪対策や脆弱顧客支援など、周辺の実務ユースケースをまとめて把握できます。 ([GOV.UK][2])

* **GOV.UK: Repository of PETs Use Cases / National Statistics, Education and Transport** — 統計・交通・行政領域での事例集です。Eurostat のモビリティ統計、Statistics Canada のハッカソン向けデータ提供など、公共目的での活用を一度に拾えます。 ([GOV.UK][3])

## 医療・ヘルスケア

* **NHS: Governance considerations for the use of synthetic data in health and care research** — 肺がん死亡リスク予測モデルの開発可能性を検証するため、実患者データから GAN で合成データを生成した事例です。性能だけでなく、残余識別リスクや匿名化判断も扱っており、医療分野の実務検討に直結します。 ([Health AI Regs Service][4])

* **NHS England: Exploring how to create mock patient data / What we did** — SynthVAE を使って模擬患者データを生成し、その評価方法や再利用可能な手順を整備した事例です。単なる研究紹介ではなく、生成・評価・文書化までを一連で見られます。 ([NHS England Digital][5])

* **Alberta Innovates: synthetic data as alternative to health data utilization** — アルバータ州の連携プロジェクトで、実患者データに基づくが個人と結び付かない合成医療データを研究・イノベーションに使う構想です。州法上の患者情報を含まない形で共有できる点を明確に打ち出しています。 ([Alberta Innovates][6])

* **MDClone: VHA Innovation** — 米 Veterans Health Administration が、医療従事者や研究者に迅速なデータアクセスを与え、IRB や長い審査を経ずにケアパス分析や業務改善を進めるために合成データ生成基盤を導入した事例です。運用改善寄りのユースケースとして有用です。 ([MDClone][7])

* **MDClone: Washington University in St. Louis** — 複雑な患者データを、患者プライバシーを守りながら研究者が分析できるようにした事例です。従来の de-identification では研究価値が落ちるという問題意識が明確で、合成データの位置づけが分かりやすいです。 ([MDClone][8])

* **Gretel: South Australia Health** — 州全体レベルで、実 EHR から合成データを生成し、患者プライバシーを保ちながら臨床研究や患者ケアの改善に活用する事例です。公的医療システムでの展開として参考になります。 ([info.gretel.ai][9])

* **Gretel: Illumina** — ゲノム研究に向けて、安全な合成データセットを作成し、研究者・医療機関・産業界の間で私的にデータ共有できるようにする事例です。医療データの中でも特にセンシティブな genomics の事例として重要です。 ([info.gretel.ai][10])

* **Gretel: Major Healthcare Institution** — 大規模医療機関で、患者予測やケア品質向上のための ML 学習データとして合成データを使う事例です。目的が「共有」だけでなく「安全な ML 学習」にある点が使いやすいです。 ([info.gretel.ai][11])

* **MOSTLY AI: The Humana synthetic data sandbox** — Humana が 150 万件の合成患者レコードを備えたデータ交換基盤を公開し、外部開発者やデータサイエンティストが本番に近い環境で検証できるようにした事例です。保険会社による「sandbox / data exchange」型の活用として価値があります。 ([MOSTLY AI][12])

## 金融・保険

* **Accenture x Hazy: Fostering Better Finance** — 銀行取引に基づく合成データで、脆弱顧客の早期発見を目的としたプロトタイプを構築した事例です。機微データを使わずに開発を先行できたため、立ち上げが 8 倍速くなったとされています。 ([GOV.UK][2])

* **Aindo x BeRebel** — イタリアの自動車保険会社 BeRebel が、GDPR 等に配慮しながら合成データで AI モデルを開発した事例です。精度は実データ学習比で 99%、time-to-data は 75%以上短縮とされており、保険領域の具体例として使いやすいです。 ([aindo.com][13])

* **Betterdata: Tier 1 Asian Bank** — データ利用承認に数か月を要していた大手アジア銀行が、オンプレで部門横断の即時合成データ生成を行い、実データ露出ゼロでスピードと安全性を両立させた事例です。社内データ民主化の事例として有用です。 ([betterdata.ai][14])

* **FCA report / APP fraud & AML line** — 単一企業事例ではありませんが、APP fraud 対策のためのクロスセクター合成データや、AML・異常検知の高度化を目的としたデータ共有の実務シナリオが整理されています。個別の顧客事例が薄い領域を補う材料になります。 ([FCA][1])

## 公共・統計・交通

* **ONS / Data Science Campus: linked 2011 Census and deaths dataset** — 2011年国勢調査と死亡登録を連結した約5,500万行・60列の機密データセットを、正式なプライバシーフレームワークの下で合成化した事例です。大規模・連結データの代表例として重要です。 ([datasciencecampus.ons.gov.uk][15])

* **ONS / Data Science Campus: Enabling Data Access through Privacy Preserving Synthetic Data** — 合成データ生成にどの統計量を使うかをデータ所有者が制御できるという考え方を示しつつ、Census 2021 本番前に処理パイプライン試験用の synthetic census を作った事例を紹介しています。テスト・事前検証用途として非常に実務的です。 ([datasciencecampus.ons.gov.uk][16])

* **Eurostat (via GOV.UK PETs repository)** — 携帯通信事業者データを用いた人口移動・モビリティ統計の作成において、TEE 内で解析しつつ、最大 1 億人規模の synthetic data でスケーラビリティ検証を行った事例です。公的統計と民間データの橋渡し事例として価値があります。 ([GOV.UK][3])

* **Statistics Canada (via GOV.UK PETs repository)** — 国勢調査データや死亡レジストリのような高リスクデータを直接出さず、ハッカソン参加者向けに高い分析価値を持つ合成データを提供した事例です。教育・人材育成・プロトタイピングの文脈で使えます。 ([GOV.UK][3])

* **Aindo: Improved Public Transport Services** — 自治体が、市民の移動実態や社会的つながりに関するセンシティブなデータを合成化し、部門横断で共有・統合して交通需要を把握し、公共交通最適化に役立てる想定事例です。自治体向けの説明材料に向きます。 ([aindo.com][17])

* **Swiss Post x MOSTLY AI** — Swiss Post がセンシティブデータを安全に活用しつつ、説明可能性やモデル性能向上、データサイロ解消につなげている事例です。公共性の高い組織におけるデータ活用事例として見やすいです。 ([MOSTLY AI][18])

## 企業内活用・QA・セキュリティ

* **Betterdata: U.S. Department of Homeland Security** — プライバシー・セキュリティ制約のため実データ共有ができない中で、サイバー防御訓練と異常検知向けの privacy-preserving data sandbox を作った事例です。セキュリティ演習・教育用途として分かりやすいです。 ([betterdata.ai][19])

* **Betterdata: Kajima Corporation** — スマートビル領域で、個別同意要件が重くデータ活用が非効率だった状況に対し、合成データ基盤を使って個別同意を不要化し、60%の運用コスト削減を実現した事例です。建設・不動産・IoT系に近いケースです。 ([betterdata.ai][20])

* **Betterdata: Fortune 500 Data Storage Provider** — 本番データを使いにくい QA 環境で、複雑な telemetry pipeline の 20 倍規模シミュレーションと QA 準備時間 40%削減を実現した事例です。ソフトウェア試験や本番相当データの代替として使いやすいです。 ([betterdata.ai][21])

* **Betterdata: Iconic European Luxury Brand** — 顧客データが疎でパーソナライズが難しい状況で、合成データで propensity modeling を補強し、VIP conversion を約 5% 改善した事例です。マーケティング用途ですが、顧客データを安全に拡張する事例として有効です。 ([betterdata.ai][22])

## 使い方の観点で見ると、特に価値が高い切り口

この一次収集から見ると、実務で繰り返し出てくるのは次の5類型です。

* **安全なデータ共有**：研究者・外部委託先・他部門への開示前に合成化する
* **AI/ML 学習データ**：実データを直接出さずにモデル開発や性能検証を進める
* **システムテスト / QA**：本番相当の粒度を保ちながら安全に試験する
* **公的統計 / 政策検討**：機微データを扱う行政・統計機関での分析基盤に使う
* **教育 / sandbox / hackathon**：学習やアイデア創出向けに安全な疑似環境を作る ([FCA][1])

次段では、これをそのままカタログ投入しやすいように、**「記事タイトル / 組織名 / 分野 / 活用目的 / データ種別 / 出典リンク / 50字要約」** の表形式へ正規化するのが効率的です。

[1]: https://www.fca.org.uk/publication/corporate/report-using-synthetic-data-in-financial-services.pdf "Report: Using Synthetic Data in Financial Services"
[2]: https://www.gov.uk/guidance/repository-of-privacy-enhancing-technologies-pets-use-cases/finance-and-insurance "  Repository of Privacy Enhancing Technologies (PETs) Use Cases - Finance and Insurance - Guidance - GOV.UK
"
[3]: https://www.gov.uk/guidance/repository-of-privacy-enhancing-technologies-pets-use-cases/national-statistics-education-and-transport "  Repository of Privacy Enhancing Technologies (PETs) Use Cases - National Statistics, Education and Transport - Guidance - GOV.UK
"
[4]: https://www.digitalregulations.innovation.nhs.uk/case-studies/governance-considerations-for-the-use-of-synthetic-data-in-health-and-care-research/ "Governance Considerations for the Use of Synthetic Data in Health and Care Research - AI and Digital Regulations Service for health and social care"
[5]: https://digital.nhs.uk/services/ai-knowledge-repository/case-studies/exploring-how-to-create-mock-patient-data-synthetic-data-from-real-patient-data/what-we-did "What we did - NHS England Digital"
[6]: https://albertainnovates.ca/news/alberta-project-explores-use-of-synthetic-data-as-alternative-to-health-data-utilization/ "Alberta project explores use of synthetic data as alternative to health data utilization - Alberta Innovates"
[7]: https://mdclone.com/customer-story/using-high-quality-synthetic-data-to-support-rapid-innovation-vha-innovation/ "Using High-Quality Synthetic Data to Support Rapid Innovation: VHA Innovation | MDClone"
[8]: https://mdclone.com/customer-story/three-pilot-projects-ensure-synthetic-data-accuracy-and-maintained-patient-privacy-washington-university/ "Three Pilot Projects Ensure Synthetic Data Accuracy and Maintained Patient Privacy: Washington University | MDClone"
[9]: https://info.gretel.ai/case-study-sa-health "Gretel Customer Case Study: South Australia Health"
[10]: https://info.gretel.ai/case-study-illumina?utm_campaign=illumina+case+study&utm_medium=website&utm_source=resource+page "Gretel Customer Case Study: Illumina"
[11]: https://info.gretel.ai/case-study-major-healthcare-institution "Gretel Customer Case Study: Major Healthcare Institution"
[12]: https://mostly.ai/blog/synthetic-healthcare-data-sandbox "The Humana synthetic data sandbox for winning data-centric products - MOSTLY AI"
[13]: https://www.aindo.com/news/berebelcasestudy/ "New case study about synthetic data in insurance - Aindo AI"
[14]: https://www.betterdata.ai/case-study/tier-1-asian-bank "Betterdata: Programmatic Synthetic Data"
[15]: https://datasciencecampus.ons.gov.uk/synthesising-the-linked-2011-census-and-deaths-dataset-while-preserving-its-confidentiality/ "Synthesising the linked 2011 Census and deaths dataset while preserving its confidentiality | Data Science Campus"
[16]: https://datasciencecampus.ons.gov.uk/enabling-data-access-through-privacy-preserving-synthetic-data/ "Enabling Data Access through Privacy Preserving Synthetic Data | Data Science Campus"
[17]: https://www.aindo.com/other-industries/ "Other industries - Aindo AI"
[18]: https://mostly.ai/video/swiss-post-x-mostly-ai-synthetic-data-innovation-on-aws "Swiss Post x MOSTLY AI: Synthetic Data Innovation on AWS - MOSTLY AI"
[19]: https://www.betterdata.ai/case-study/u-s-department-of-homeland-security "Betterdata: Programmatic Synthetic Data"
[20]: https://www.betterdata.ai/case-study/kajima-corporation "Betterdata: Programmatic Synthetic Data"
[21]: https://www.betterdata.ai/case-study/fortune-500-data-storage-provider "Betterdata: Programmatic Synthetic Data"
[22]: https://www.betterdata.ai/case-study/iconic-european-luxury-brand "Betterdata: Programmatic Synthetic Data"

