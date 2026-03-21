#!/usr/bin/env python3
"""Generate case.json files from CDEI PETs Adoption Guide data."""

import json
import os
import uuid
from datetime import datetime

# Technology category mapping
TECH_MAP = {
    "Differential Privacy": "differential_privacy",
    "Federated Learning": "federated_learning",
    "Federated Analytics": "distributed_analytics",
    "Multi-party Computation": "secure_computation",
    "Secure Multi-party Computation": "secure_computation",
    "Homomorphic Encryption": "secure_computation",
    "Trusted Execution Environment": "secure_computation",
    "Trusted Execution Environments": "secure_computation",
    "Synthetic Data": "synthetic_data",
    "De-identification techniques": "anonymization",
}

# Domain mapping
DOMAIN_MAP = {
    "Health and Social Care": "医療",
    "Finance": "金融",
    "Financial services": "金融",
    "Digital": "IT",
    "National Statistics": "公共",
    "Crime & Justice": "公共",
    "Criminal justice": "公共",
    "Education": "公共",
    "Telecoms": "通信",
    "Transport": "モビリティ",
    "Tourism": "小売",
    "Insurance": "金融",
    "Other": "公共",
    "Social Media Research": "IT",
}

# Usecase category mapping based on development stage and context
USECASE_MAP = {
    "Product": "組織内データ共有",
    "Proof of concept": "フィージビリティ検証",
    "Proof of Concept": "フィージビリティ検証",
    "Pilot": "フィージビリティ検証",
    "In development": "R&D",
}

# Date parsing
def parse_date(date_str):
    """Convert 'July 2021' or 'June 2023' to 'YYYY-MM' format."""
    month_map = {
        "January": "01", "February": "02", "March": "03", "April": "04",
        "May": "05", "June": "06", "July": "07", "August": "08",
        "September": "09", "October": "10", "November": "11", "December": "12",
    }
    parts = date_str.strip().split()
    if len(parts) == 2:
        month = month_map.get(parts[0], "01")
        year = parts[1]
        return f"{year}-{month}"
    return None

def map_technologies(techs):
    """Map CDEI technology names to catalog categories (deduplicated)."""
    mapped = []
    for t in techs:
        cat = TECH_MAP.get(t)
        if cat and cat not in mapped:
            mapped.append(cat)
    return mapped if mapped else ["synthetic_data"]

def map_domain(sector):
    return DOMAIN_MAP.get(sector, "公共")

def map_usecase_category(stage):
    return [USECASE_MAP.get(stage, "R&D")]

# All CDEI cases
CASES = [
    {
        "title": "Differentially-Private Health Tokens for COVID-19 Risk Estimation",
        "organization": "Alan Turing Institute",
        "description": "Research proposing 'health tokens' using differential privacy to design COVID-19 immunity passports. These certificates randomize individual test results while enabling aggregate risk calculations, mitigating discrimination concerns.",
        "sector": "Health and Social Care",
        "technologies": ["Differential Privacy"],
        "development_stage": "Proof of concept",
        "date": "July 2021",
        "links": [
            {"title": "Alan Turing Institute", "url": "https://www.turing.ac.uk/research/publications/differentially-private-health-tokens-estimating-covid-19-risk"}
        ],
        "summary_ja": "Alan Turing Instituteが提案した、差分プライバシーを用いたCOVID-19免疫パスポート「ヘルストークン」の研究。個人の検査結果をランダム化しつつ、集団レベルのリスク推計を可能にすることで、差別リスクを軽減しながらパンデミック対策に貢献する仕組み。",
        "value_proposition_ja": "差分プライバシーにより個人の検査結果を保護しながら、集団レベルのリスク推計を実現。COVID-19パスポートの社会実装における差別リスク軽減に貢献する。",
        "privacy_method": "差分プライバシーによる個人検査結果のランダム化",
    },
    {
        "title": "Federated Learning for Siri Voice Recognition",
        "organization": "Apple",
        "description": "Apple uses federated learning to train Siri's voice recognition locally on iPhones. Local model weights aggregate centrally, with differential privacy noise injected to prevent reidentification risks.",
        "sector": "Digital",
        "technologies": ["Federated Analytics", "Differential Privacy"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "MIT Tech Review", "url": "https://www.technologyreview.com/2019/12/11/131629/apple-ai-personalizes-siri-federated-learning/"},
            {"title": "Apple: Learning with privacy at scale", "url": "https://machinelearning.apple.com/research/learning-with-privacy-at-scale"}
        ],
        "summary_ja": "AppleはiPhone上でローカルに連合学習を行い、Siriの音声認識モデルを訓練している。ローカルモデルの重みを中央サーバーに集約する際、差分プライバシーノイズを注入して再識別リスクを防止。ユーザーの音声データをデバイス外に送信することなくモデル精度を向上させている。",
        "value_proposition_ja": "連合学習と差分プライバシーの組み合わせにより、ユーザーの音声データをデバイス外に出さずに音声認識モデルを改善。プライバシー保護とAI性能向上を両立した製品レベルの実装例。",
        "privacy_method": "連合学習によるデバイス上学習＋差分プライバシーノイズ注入",
    },
    {
        "title": "Apple/Google COVID-19 Contact Tracing API",
        "organization": "Apple/Google",
        "description": "Privacy-preserving architecture enabling digital contact tracing via Bluetooth proximity. Phones exchange random identifiers; health authorities access upload data from positive tests to alert exposed users.",
        "sector": "Health and Social Care",
        "technologies": ["Federated Analytics", "De-identification techniques"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Google", "url": "https://www.google.com/covid19/exposurenotifications/#exposure-notifications-and-privacy"},
            {"title": "Apple", "url": "https://covid19.apple.com/contacttracing"}
        ],
        "summary_ja": "Apple/GoogleがBluetooth近接通信を利用して開発したプライバシー保護型COVID-19接触追跡API。端末間でランダム識別子を交換し、陽性者のデータのみを保健当局にアップロードして、接触者に通知する分散型アーキテクチャ。",
        "value_proposition_ja": "分散型アーキテクチャにより個人の位置情報を中央サーバーに集約せず、Bluetooth近接情報のみで接触追跡を実現。世界中の公衆衛生機関が採用可能なプラットフォームとして展開された。",
        "privacy_method": "ランダム識別子の定期変更による匿名化＋分散型データ処理",
    },
    {
        "title": "Financial Crime Detection Platform",
        "organization": "AUSTRAC",
        "description": "Platform identifying suspicious financial links across Australian institutions. Homomorphic encryption and multi-party computation protect innocent customer privacy while flagging suspicious account connections across 28 financial institutions.",
        "sector": "Finance",
        "technologies": ["Homomorphic Encryption", "Multi-party Computation"],
        "development_stage": "In development",
        "date": "July 2021",
        "links": [
            {"title": "LinkedIn", "url": "https://www.linkedin.com/pulse/australia-unveils-world-first-privacy-preserving-fintel-nathan-lynch/"},
            {"title": "FFIS", "url": "https://www.future-fis.com/uploads/3/7/9/4/3794525/ffis_innovation_and_discussion_paper_-_case_studies_of_the_use_of_privacy_preserving_analysis.pdf"}
        ],
        "summary_ja": "オーストラリアの金融情報機関AUSTRACが開発中の金融犯罪検出プラットフォーム。準同型暗号と秘密計算を用いて、28の金融機関にまたがる不審な口座接続を検出しつつ、一般顧客のプライバシーを保護する。",
        "value_proposition_ja": "準同型暗号と秘密計算により、複数金融機関間の不審取引を検出しながら一般顧客のプライバシーを保護。世界初のプライバシー保護型金融犯罪検出プラットフォームとして注目されている。",
        "privacy_method": "準同型暗号＋秘密計算による暗号化データ上の照合",
    },
    {
        "title": "Gender Pay Gap Analysis Using MPC",
        "organization": "Boston Women's Workforce Council (BWWC) / Boston University",
        "description": "Multi-party computation system enabling 123 organizations to anonymously report gender pay gap data on 136,437 employees. Confidentiality encouraged participation increase from 69 to 123 companies.",
        "sector": "Other",
        "technologies": ["Multi-party Computation"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "BWWC", "url": "https://thebwwc.org/mpc"},
            {"title": "IEEE Conference Paper", "url": "https://ieeexplore.ieee.org/abstract/document/7839796"}
        ],
        "summary_ja": "ボストン女性労働力協議会とボストン大学が秘密計算を活用し、123組織・136,437名の従業員データからジェンダー賃金格差を分析。個別企業のデータを秘匿したまま集計結果のみを公表する仕組みにより、参加企業が69社から123社に増加した。",
        "value_proposition_ja": "秘密計算によりデータの機密性を保証することで企業の参加障壁を下げ、ジェンダー賃金格差の大規模分析を実現。参加企業数の大幅増加が示すように、プライバシー保護がデータ共有促進に直結した好例。",
        "privacy_method": "秘密計算による匿名集計（個別企業データは秘匿）",
    },
    {
        "title": "Confidential Sugar Beet Production Rights Trading",
        "organization": "Danisco / Association of Sugar Beet Growers",
        "description": "Multi-party computation enables confidential bidding for trading Danish sugar beet production rights. System redistributes production quotas based on supply/demand while keeping individual farmer bids confidential.",
        "sector": "Other",
        "technologies": ["Multi-party Computation"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Report", "url": "https://eprint.iacr.org/2008/068.pdf"}
        ],
        "summary_ja": "デンマークの砂糖大根生産権取引において、秘密計算を用いた機密入札システムを導入。個々の農家の入札額を秘匿したまま、需給に基づく生産割当の再配分を実現する世界初の商用秘密計算アプリケーションの一つ。",
        "value_proposition_ja": "秘密計算により農家の入札戦略を完全に秘匿しつつ、公正な市場価格に基づく生産権の再配分を実現。商用MPC実装の先駆的事例として学術的にも注目されている。",
        "privacy_method": "秘密計算による秘匿入札（入札額は計算過程で一切公開されない）",
    },
    {
        "title": "Dutch Elderly Care System Data Analysis",
        "organization": "Data Sharing Coalition",
        "description": "Public-private coalition using multi-party computation to analyze elderly care provisions and needs. Platform combines sensitive health data from multiple parties while only revealing aggregated insights.",
        "sector": "Health and Social Care",
        "technologies": ["Multi-party Computation"],
        "development_stage": "Product",
        "date": "June 2023",
        "links": [
            {"title": "Data Sharing Coalition use case poster", "url": "https://datasharingcoalition.eu/app/uploads/2023/03/230306-linksight-article-visual.pdf"},
            {"title": "Data Sharing Coalition article", "url": "https://datasharingcoalition.eu/use-cases/advancing-data-collaboration-for-monitoring-the-dutch-elderly-care-through-mpc-technology/"}
        ],
        "summary_ja": "オランダのData Sharing Coalitionが秘密計算を用いて、高齢者介護の提供状況とニーズを分析。官民の複数機関が保有する機微な健康データを、集約結果のみを開示する形で組み合わせ、高齢者介護の実態把握と改善に活用。",
        "value_proposition_ja": "秘密計算により官民複数機関の機微な健康データを安全に結合し、高齢者介護の実態を把握。データの集約なしに分析結果のみを共有する仕組みにより、従来不可能だった組織横断的な介護分析を実現。",
        "privacy_method": "秘密計算による複数機関データの安全な結合（集約結果のみ開示）",
    },
    {
        "title": "Privacy-Preserving Genome-Wide Association Studies",
        "organization": "Duality Technologies",
        "description": "Framework leveraging homomorphic encryption for secure genome-wide association studies on 25,000+ individuals with age-related macular degeneration data. System is ~30x faster than existing multi-party computation alternatives.",
        "sector": "Health and Social Care",
        "technologies": ["Homomorphic Encryption"],
        "development_stage": "Proof of concept",
        "date": "July 2021",
        "links": [
            {"title": "Original paper", "url": "https://www.pnas.org/content/117/21/11608"},
            {"title": "PR Newswire", "url": "https://www.prnewswire.com/il/news-releases/duality-technologies-researchers-accelerate-privacy-enhanced-collaboration-on-genomic-data--with-significant-implications-for-covid-19-research-301059258.html"}
        ],
        "summary_ja": "Duality Technologiesが準同型暗号を用いて、25,000人以上の加齢黄斑変性データに対するゲノムワイド関連解析（GWAS）を安全に実施するフレームワークを開発。既存のMPCベースの手法と比較して約30倍高速に処理可能。",
        "value_proposition_ja": "準同型暗号により、ゲノムデータを復号することなくGWASを実施。既存手法比30倍の高速化により、大規模ゲノム研究におけるプライバシー保護型解析の実用性を大幅に向上。",
        "privacy_method": "準同型暗号によるゲノムデータの暗号化状態での解析",
    },
    {
        "title": "Privacy-Preserving Fraud Investigation Queries",
        "organization": "Duality Technologies",
        "description": "System enabling external parties to query sensitive data without disclosing parameters to data owners. Homomorphic encryption preserves entity and investigation privacy even during complex SQL-like queries.",
        "sector": "Finance",
        "technologies": ["Homomorphic Encryption"],
        "development_stage": "Proof of concept",
        "date": "July 2021",
        "links": [
            {"title": "RUSI-FFIS report (Chapter 7)", "url": "https://www.gcffc.org/wp-content/uploads/2020/06/FFIS-Innovation-and-discussion-paper-Case-studies-of-the-use-of-privacy-preserving-analysis.pdf"}
        ],
        "summary_ja": "Duality Technologiesが開発した、準同型暗号を用いたプライバシー保護型不正調査クエリシステム。外部の捜査機関がデータ保有者に検索パラメータを開示することなく、機密データに対してSQLライクなクエリを実行可能。",
        "value_proposition_ja": "準同型暗号により、調査対象の情報も検索パラメータもデータ保有者に開示せずに不正調査を実施。捜査の機密性とデータ保護を両立する革新的なアプローチ。",
        "privacy_method": "準同型暗号によるクエリパラメータ・結果の秘匿化",
    },
    {
        "title": "Privacy-Preserving Customer Matching",
        "organization": "Enveil",
        "description": "Enables financial institutions to identify matching customer information in external datasets without disclosure. Homomorphic encryption maintains confidentiality while investigating suspicious activity.",
        "sector": "Finance",
        "technologies": ["Homomorphic Encryption"],
        "development_stage": "Proof of concept",
        "date": "July 2021",
        "links": [
            {"title": "RUSI-FFIS report (Chapter 7)", "url": "https://www.gcffc.org/wp-content/uploads/2020/06/FFIS-Innovation-and-discussion-paper-Case-studies-of-the-use-of-privacy-preserving-analysis.pdf"}
        ],
        "summary_ja": "Enveilが開発した、準同型暗号を用いた金融機関向けプライバシー保護型顧客マッチングシステム。外部データセットとの顧客情報照合を、データを開示することなく実施し、不審な活動の調査における機密性を維持。",
        "value_proposition_ja": "準同型暗号により、金融機関が外部データセットとの顧客マッチングを暗号化状態で実施。不正検知の精度向上とデータ保護を両立するコンプライアンス対応ソリューション。",
        "privacy_method": "準同型暗号による暗号化状態でのデータマッチング",
    },
    {
        "title": "Human Trafficking Database Access System",
        "organization": "Enveil / DeliverFund",
        "description": "Partnership using homomorphic encryption for secure access to trafficking databases. Users cross-match and search data without revealing search contents or compromising database security.",
        "sector": "Crime & Justice",
        "technologies": ["Homomorphic Encryption"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Enveil and DeliverFund", "url": "https://www.globenewswire.com/en/news-release/2021/06/15/2247363/0/en/Enveil-and-DeliverFund-Leverage-Privacy-Enhancing-Technologies-to-Combat-Human-Trafficking.html"}
        ],
        "summary_ja": "EnveilとDeliverFundが準同型暗号を活用して、人身売買データベースへの安全なアクセスを実現。捜査機関が検索内容を開示することなくデータの照合・検索を行え、データベースのセキュリティも維持される。",
        "value_proposition_ja": "準同型暗号により、人身売買対策の捜査情報を保護しつつデータベース検索を可能に。捜査の秘密性とデータ保護を両立し、犯罪対策におけるPETs活用の先進事例。",
        "privacy_method": "準同型暗号による検索クエリ・結果の秘匿化",
    },
    {
        "title": "Telecoms Sector Metrics Analysis",
        "organization": "Estonian Association of Information Technology and Telecommunications (ITL)",
        "description": "Multi-party computation platform enabling 17 companies to confidentially share financial metrics with competitors. Sharemind platform distributed data across computing parties for secure analysis.",
        "sector": "Other",
        "technologies": ["Multi-party Computation"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Royal Society report on PETs", "url": "https://royalsociety.org/-/media/policy/projects/privacy-enhancing-technologies/privacy-enhancing-technologies-report.pdf"},
            {"title": "Academic paper", "url": "https://academic.oup.com/comjnl/article/61/12/1749/5095655"}
        ],
        "summary_ja": "エストニアのITL（情報通信協会）がSharemind秘密計算プラットフォームを活用し、通信業界17社の財務指標を機密を保ちながら共有・分析。競合企業間でも個別データを開示せずに業界全体の指標分析を実現。",
        "value_proposition_ja": "秘密計算により競合企業間で財務データを秘匿したまま業界統計を算出。企業の機密情報保護と業界全体のベンチマーク分析を両立する商用実装例。",
        "privacy_method": "Sharemind秘密計算プラットフォームによるデータ分散処理",
    },
    {
        "title": "Student Employment and Graduation Study",
        "organization": "Estonian Center of Applied Research (CentAR)",
        "description": "Largest statistical study using encryption for privacy, linking 10 million tax records with 60,000 education records. Sharemind MPC kept data encrypted at source without decryption during analysis.",
        "sector": "Education",
        "technologies": ["Multi-party Computation"],
        "development_stage": "Pilot",
        "date": "June 2023",
        "links": [
            {"title": "Journal article", "url": "https://eprint.iacr.org/2015/1159.pdf"},
            {"title": "Cybernetica case study", "url": "https://edps.europa.eu/sites/edp/files/publication/17-06-09_triin-siil_sharemind_en.pdf"}
        ],
        "summary_ja": "エストニアのCentARがSharemind秘密計算を用いて、1,000万件の税務記録と6万件の教育記録を暗号化状態のまま結合・分析。学生の就業状況と卒業の関連を、元データを一切復号せずに統計的に明らかにした大規模研究。",
        "value_proposition_ja": "秘密計算によりプライバシーを保護した暗号化状態のまま、大規模な税務・教育データを結合分析。暗号化データに対する統計分析の実用性を示した世界最大級の事例。",
        "privacy_method": "Sharemind MPCによるデータの暗号化状態での結合・分析（復号なし）",
    },
    {
        "title": "Mobile Network Operator Data for Population Mobility Statistics",
        "organization": "Eurostat",
        "description": "Eurostat analyzed Mobile Network Operator data in trusted execution environment to create official statistics on human population movement without revealing individual data or enabling identification.",
        "sector": "National Statistics",
        "technologies": ["Trusted Execution Environment", "Synthetic Data"],
        "development_stage": "Proof of Concept",
        "date": "June 2023",
        "links": [
            {"title": "UN PETs Case Study repository", "url": "https://unstats.un.org/wiki/display/UGTTOPPT/3.+Eurostat%3A+Processing+of+longitudinal+mobile+network+operator+data"},
            {"title": "European Commission", "url": "https://cros-legacy.ec.europa.eu/content/eurostat-cybernetica-project_en"},
            {"title": "Cybernetica blog", "url": "https://cyber.ee/resources/news/cybernetica-and-eurostat-have-developed-a-new-privacy-preserving-approach-for-computing-statistics-from-sensitive-data/"}
        ],
        "summary_ja": "EurostatがTEE（信頼実行環境）内でモバイルネットワーク事業者のデータを分析し、個人を特定できない形で人口移動統計を作成。合成データも併用し、公式統計の精度とプライバシー保護を両立するアプローチを実証。",
        "value_proposition_ja": "TEEと合成データの組み合わせにより、モバイル通信データから個人を特定せずに人口移動統計を生成。公式統計機関によるPETs活用の先進事例。",
        "privacy_method": "TEE内でのデータ処理＋合成データ生成",
    },
    {
        "title": "Election and Democracy Research Data Access",
        "organization": "Facebook (Meta)",
        "description": "Initiative providing 60 researchers access to publicly shared Facebook links data. Differential privacy protects individuals while enabling analysis of social media's role in elections.",
        "sector": "Digital",
        "technologies": ["Differential Privacy"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Facebook blog", "url": "https://research.fb.com/blog/2020/02/new-privacy-protected-facebook-data-for-independent-research-on-social-medias-impact-on-democracy/"},
            {"title": "Technical report", "url": "https://arxiv.org/pdf/2002.04049.pdf"}
        ],
        "summary_ja": "Facebook（Meta）が差分プライバシーを適用して、60名の研究者にFacebook上の公開リンク共有データへのアクセスを提供。個人のプライバシーを保護しながら、ソーシャルメディアが選挙・民主主義に与える影響の学術研究を支援。",
        "value_proposition_ja": "差分プライバシーにより個人ユーザーを保護しつつ、大規模ソーシャルメディアデータの学術研究利用を実現。プラットフォームの透明性と研究促進に貢献。",
        "privacy_method": "差分プライバシーによるデータセットへのノイズ注入",
    },
    {
        "title": "Space Radiation and Cancer Risk Study",
        "organization": "Frontier Development Lab / Intel",
        "description": "Federated learning enables researchers to access protected astronaut health data from NASA, Mayo Clinic, and NASA's Gene Lab without data transfer. Models trained in situ, reducing costs.",
        "sector": "Health and Social Care",
        "technologies": ["Federated Learning"],
        "development_stage": "Pilot",
        "date": "June 2023",
        "links": [
            {"title": "MarketScreener article", "url": "https://www.marketscreener.com/quote/stock/INTEL-CORPORATION-4829/news/Intel-FDL-Intel-AI-Mentors-Seek-to-Improve-Astronaut-Health-36716002/"},
            {"title": "YouTube video by Intel Software", "url": "https://www.youtube.com/watch?v=ZRdg5fH93EI"}
        ],
        "summary_ja": "Frontier Development LabとIntelが連合学習を活用し、NASA、メイヨー・クリニック、NASAジーンラボが保有する宇宙飛行士の健康データに、データ転送なしでアクセス。宇宙放射線と癌リスクの関連を、各機関のデータを移動させずにモデル訓練。",
        "value_proposition_ja": "連合学習により、高度に保護された宇宙飛行士の健康データを移動させずに研究を実施。データ転送の法的・技術的障壁を回避しながら、宇宙医学研究を推進。",
        "privacy_method": "連合学習による分散データ上でのモデル訓練（データ転送なし）",
    },
    {
        "title": "COVID-19 Community Mobility Reports",
        "organization": "Google",
        "description": "Public resource showing population mobility changes during COVID-19 using opt-in location data. Differential privacy protects location details and visit counts while enabling aggregate analysis.",
        "sector": "Health and Social Care",
        "technologies": ["Differential Privacy"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Google blog", "url": "https://www.blog.google/technology/health/covid-19-community-mobility-reports"},
            {"title": "Technical paper", "url": "https://arxiv.org/pdf/2004.04145.pdf"}
        ],
        "summary_ja": "GoogleがCOVID-19パンデミック中にオプトインの位置情報データから差分プライバシーを適用して人口移動レポートを公開。個人の位置詳細や訪問回数を保護しつつ、集団レベルの移動変化を可視化して公衆衛生対策を支援。",
        "value_proposition_ja": "差分プライバシーにより個人の行動を保護しながら、COVID-19パンデミック下の人口移動パターンを公開。公衆衛生上の意思決定を支援する大規模なプライバシー保護型データ公開の実例。",
        "privacy_method": "差分プライバシーによる位置情報の集計データへのノイズ注入",
    },
    {
        "title": "GBoard Federated Learning for Next-Word Prediction",
        "organization": "Google",
        "description": "Keyboard app using federated learning where devices download models, train locally with user data, then send weights via secure aggregation to central server for model updates.",
        "sector": "Digital",
        "technologies": ["Multi-party Computation", "Federated Analytics"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Google blog", "url": "https://ai.googleblog.com/2017/04/federated-learning-collaborative.html"},
            {"title": "Technical paper", "url": "https://arxiv.org/pdf/1811.03604.pdf"}
        ],
        "summary_ja": "GoogleのキーボードアプリGBoardで連合学習を活用した次単語予測。端末上でローカルにモデルを訓練し、セキュアアグリゲーションを介して重みを中央サーバーに送信。ユーザーの入力データを端末外に出さずにモデルを改善。",
        "value_proposition_ja": "連合学習とセキュアアグリゲーションの組み合わせにより、数十億台の端末上のユーザー入力データを収集せずに予測変換モデルを継続的に改善。プライバシー保護型機械学習の大規模商用実装の先駆け。",
        "privacy_method": "連合学習＋セキュアアグリゲーションによるモデル更新の秘匿化",
    },
    {
        "title": "Privacy-Preserving Advertising Conversion Rate Computation",
        "organization": "Google",
        "description": "System computes advertisement-to-purchase conversion rates by computing intersection size between shown/purchase lists using privacy-preserving set intersection protocols.",
        "sector": "Digital",
        "technologies": ["Homomorphic Encryption"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Google paper", "url": "https://eprint.iacr.org/2017/738.pdf"}
        ],
        "summary_ja": "Googleが準同型暗号ベースのプライバシー保護型集合積集合（PSI）プロトコルを用いて、広告表示リストと購入リストの交差サイズを算出し、広告のコンバージョン率を計算。双方のデータを開示せずに広告効果を測定。",
        "value_proposition_ja": "準同型暗号によるPSIプロトコルで、広告主と小売業者がそれぞれの顧客データを開示せずにコンバージョン率を算出。デジタル広告における第三者Cookie代替の先進事例。",
        "privacy_method": "準同型暗号ベースのPrivate Set Intersection（PSI）プロトコル",
    },
    {
        "title": "Vulnerable Customer Identification Using Synthetic Data",
        "organization": "Hazy / Accenture",
        "description": "Accenture built prototype applications for early vulnerable customer identification using synthetic data from Hazy. Project launched 8x faster than expected by reducing security barriers.",
        "sector": "Finance",
        "technologies": ["Synthetic Data"],
        "development_stage": "Product",
        "date": "June 2023",
        "links": [
            {"title": "Hazy case study", "url": "https://hazy.com/resources/accenture-unlocks-customer-project-with-synthetic-data"}
        ],
        "summary_ja": "Accentureが金融機関の脆弱な顧客（高齢者・障害者等）を早期に識別するプロトタイプを、Hazyの合成データを用いて構築。合成データ利用によりセキュリティ審査の障壁が下がり、当初予想の8倍の速さでプロジェクトを開始。",
        "value_proposition_ja": "合成データによりセキュリティ上の障壁を大幅に低減し、開発スピードを8倍に加速。金融機関の脆弱顧客保護というコンプライアンス要件に対応しつつ、迅速なプロトタイピングを実現。",
        "privacy_method": "合成データ生成による実データの代替",
    },
    {
        "title": "Privacy-Preserving Drone Software (Privaros)",
        "organization": "Indian Institute of Science",
        "description": "Hardware trusted execution environment enhancements for drone software ensuring commercial drones comply with host airspace privacy policies. Marginal latency/power increases while robustly enforcing privacy.",
        "sector": "Transport",
        "technologies": ["Trusted Execution Environment"],
        "development_stage": "Proof of concept",
        "date": "July 2021",
        "links": [
            {"title": "Times of India", "url": "https://timesofindia.indiatimes.com/india/as-drones-get-ready-to-deliver-iisc-finds-way-to-aid-privacy/articleshow/80738756.cms"}
        ],
        "summary_ja": "インド科学研究所が開発したPrivarosは、TEE（信頼実行環境）を活用して商用ドローンが飛行空域のプライバシーポリシーに準拠することを保証するソフトウェア。レイテンシや消費電力の増加を最小限に抑えつつ、プライバシー保護を強制。",
        "value_proposition_ja": "TEEによりドローンのプライバシーポリシー準拠をハードウェアレベルで強制。ドローン物流・監視の普及に伴うプライバシー懸念に対する技術的解決策。",
        "privacy_method": "TEE（信頼実行環境）によるプライバシーポリシーの強制実行",
    },
    {
        "title": "Cross-Border Tourism Analytics Using Mobile Data",
        "organization": "Indonesia Ministry of Tourism",
        "description": "Uses Sharemind trusted execution environment to analyze encrypted mobile network operator positioning data for cross-border tourism statistics without revealing individual mobility information.",
        "sector": "Tourism",
        "technologies": ["Trusted Execution Environment"],
        "development_stage": "Product",
        "date": "June 2023",
        "links": [
            {"title": "UN PETs Case Study repository", "url": "https://unstats.un.org/wiki/display/UGTTOPPT/4.+Indonesia+Ministry+of+Tourism%3A+Confidentially+sharing+datasets+between+two+mobile+network+operators+via+a+trusted+execution+environment"},
            {"title": "Cybernetica blog", "url": "https://cyber.ee/resources/news/cybernetica-and-positium-help-to-analyse-sensitive-data-in-indonesia/"}
        ],
        "summary_ja": "インドネシア観光省がSharemind TEEを用いて、暗号化されたモバイル通信事業者の位置データから越境観光統計を作成。個人の移動情報を開示せずに、複数通信事業者のデータを安全に分析。",
        "value_proposition_ja": "TEEにより複数モバイル通信事業者の位置データを個人を特定せずに分析し、正確な越境観光統計を生成。途上国の観光政策策定にPETsを活用した先進事例。",
        "privacy_method": "Sharemind TEE内での暗号化データ分析",
    },
    {
        "title": "Cross-Border Machine Learning Model Training",
        "organization": "Inpher Inc.",
        "description": "Bank subsidiary builds sales prediction model using encrypted data from international subsidiaries. No disclosure during cross-border movement; analyst only sees outputs while inputs remain encrypted.",
        "sector": "Finance",
        "technologies": ["Homomorphic Encryption", "Multi-party Computation"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "RUSI-FFIS report (Chapter 7)", "url": "https://www.gcffc.org/wp-content/uploads/2020/06/FFIS-Innovation-and-discussion-paper-Case-studies-of-the-use-of-privacy-preserving-analysis.pdf"}
        ],
        "summary_ja": "Inpher社が準同型暗号と秘密計算を用いて、国際的な銀行子会社間でのデータ越境移転なしに販売予測モデルを構築。アナリストは出力結果のみを閲覧し、入力データは暗号化状態を維持したまま処理。",
        "value_proposition_ja": "準同型暗号と秘密計算により、データの越境移転規制を回避しつつ国際的なデータ分析を実現。GDPRなどのデータ保護規制下での金融機関のグローバル分析を可能にする。",
        "privacy_method": "準同型暗号＋秘密計算による暗号化状態でのモデル訓練",
    },
    {
        "title": "Secure Genomic Data Computation (E360 Genomics)",
        "organization": "IQVIA",
        "description": "Genomics England leverages IQVIA's E360 Genomics using tokenization, multi-party computation, and cell-size rules for secure genomic variant analysis.",
        "sector": "Health and Social Care",
        "technologies": ["Multi-party Computation", "De-identification techniques"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Bio-IT World", "url": "https://www.bio-itworld.com/news/2019/04/24/de-identifying-genomic-data-with-hashing-technology"},
            {"title": "IQVIA", "url": "https://www.iqvia.com/solutions/innovative-models/genomics"}
        ],
        "summary_ja": "IQVIAのE360 Genomicsプラットフォームを活用し、Genomics Englandがトークン化・秘密計算・セルサイズルールを組み合わせてゲノムバリアント解析を安全に実施。複数のPETsを組み合わせたゲノムデータの保護。",
        "value_proposition_ja": "トークン化・秘密計算・匿名化手法の組み合わせにより、高度に機微なゲノムデータの安全な分析を実現。複数PETsの組み合わせによる多層防御アプローチの実例。",
        "privacy_method": "トークン化＋秘密計算＋セルサイズルール（k-匿名性）の組み合わせ",
    },
    {
        "title": "Privacy-First Passwordless Authentication (Keyless)",
        "organization": "Keyless",
        "description": "Cybersecurity platform using multiparty computation enabling distributed cloud servers to authenticate users without centralizing passwords, biometrics, or personal data.",
        "sector": "Digital",
        "technologies": ["Multi-party Computation"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "The Fintech Times", "url": "https://thefintechtimes.com/vodafone-and-aws-trail-keyless-software-as-a-service-biometrics-to-improve-payment-experience/"}
        ],
        "summary_ja": "Keylessが秘密計算を活用した、パスワード・生体情報を一箇所に集約しないパスワードレス認証プラットフォームを開発。分散クラウドサーバー上で認証を行い、単一障害点なくユーザー認証を実現。",
        "value_proposition_ja": "秘密計算によりパスワードや生体情報を中央集約せずに認証を実現。データ漏洩リスクの根本的な排除と利便性の高いパスワードレス認証を両立。",
        "privacy_method": "秘密計算による分散認証（秘密情報の中央集約なし）",
    },
    {
        "title": "Microsoft Confidential Consortium Blockchain Framework",
        "organization": "Microsoft",
        "description": "System using trusted execution environments that facilitates confidentiality within blockchain networks. Processes encrypted transactions using TEEs with publicly verifiable quotes. Demonstrates 50,000+ transactions per second.",
        "sector": "Digital",
        "technologies": ["Trusted Execution Environment"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "GitHub repository", "url": "https://github.com/Microsoft/CCF"},
            {"title": "Technical report", "url": "https://github.com/microsoft/CCF/blob/main/CCF-TECHNICAL-REPORT.pdf"}
        ],
        "summary_ja": "MicrosoftがTEE（信頼実行環境）を用いたブロックチェーン向け機密性フレームワーク「Confidential Consortium Framework（CCF）」を開発。暗号化されたトランザクションをTEE内で処理し、公開検証可能性を維持しながら秒間50,000以上のトランザクションを実現。",
        "value_proposition_ja": "TEEによりブロックチェーンのトランザクション機密性と公開検証可能性を両立。高スループットを維持しながらエンタープライズ向けの機密ブロックチェーン基盤を提供。",
        "privacy_method": "TEE内でのトランザクション処理＋公開検証可能な証明",
    },
    {
        "title": "Microsoft Viva Insights",
        "organization": "Microsoft",
        "description": "Employee Experience Platform using de-identification and differential privacy by default. Provides personalized insights on organizational metrics while protecting individual privacy through privacy safeguards.",
        "sector": "Digital",
        "technologies": ["Differential Privacy", "De-identification techniques"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Microsoft Tech Community", "url": "https://techcommunity.microsoft.com/t5/microsoft-viva-blog/microsoft-viva-insights-helps-people-nurture-wellbeing-and-be/ba-p/2107010"}
        ],
        "summary_ja": "Microsoftの従業員体験プラットフォーム「Viva Insights」は、デフォルトで匿名化と差分プライバシーを適用。組織の働き方指標をパーソナライズして提供しつつ、個人の業務行動データのプライバシーを保護。",
        "value_proposition_ja": "差分プライバシーと匿名化をデフォルト組み込みで、従業員の働き方データ分析を安全に実施。プライバシー・バイ・デザインの商用製品としての実装例。",
        "privacy_method": "差分プライバシー＋匿名化のデフォルト適用",
    },
    {
        "title": "Microsoft Edge Password Monitor",
        "organization": "Microsoft",
        "description": "Edge browser feature using homomorphic encryption for password management. Enables Microsoft to query encrypted password data without decryption, alerting users to compromised credentials.",
        "sector": "Digital",
        "technologies": ["Homomorphic Encryption"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Yahoo news", "url": "https://in.news.yahoo.com/microsofts-password-monitor-feature-coming-071406870.html"}
        ],
        "summary_ja": "Microsoft Edgeのパスワードモニター機能は、準同型暗号を用いてユーザーのパスワードを復号せずに漏洩データベースとの照合を実施。パスワードが侵害された場合にユーザーに通知するプライバシー保護型セキュリティ機能。",
        "value_proposition_ja": "準同型暗号によりMicrosoftがユーザーのパスワードを知ることなく漏洩チェックを実施。プライバシーを保護しつつセキュリティを強化する消費者向け製品の実装例。",
        "privacy_method": "準同型暗号による暗号化状態でのパスワード照合",
    },
    {
        "title": "TNO BigMedilytics Heart Failure Risk Identification",
        "organization": "Netherlands Organisation for Applied Scientific Research (TNO)",
        "description": "System combining lifestyle data from Erasmus MC hospital with healthcare usage data from Zilverin Kruis insurance using MPC and homomorphic encryption. Enables secure inner join and regression model training across datasets.",
        "sector": "Health and Social Care",
        "technologies": ["Homomorphic Encryption", "Multi-party Computation", "De-identification techniques"],
        "development_stage": "Proof of concept",
        "date": "July 2021",
        "links": [
            {"title": "Youtube", "url": "https://www.youtube.com/watch?v=hvBb80eXuZg&feature=youtu.be"},
            {"title": "Medium blog", "url": "https://medium.com/applied-mpc/identifying-heart-failure-patients-at-high-risk-using-mpc-ab8900e75295"}
        ],
        "summary_ja": "オランダTNOがMPC（秘密計算）と準同型暗号を用いて、Erasmus MC病院の生活習慣データとZilverin Kruis保険のヘルスケア利用データを安全に結合。心不全リスクの高い患者を特定する回帰モデルを、データを開示せずに構築。",
        "value_proposition_ja": "秘密計算と準同型暗号により、病院と保険会社のデータを安全に結合して心不全リスク予測モデルを構築。医療・保険分野の組織間データ連携におけるPETs活用の実証例。",
        "privacy_method": "MPC＋準同型暗号によるデータの安全な結合＋匿名化",
    },
    {
        "title": "NHS Digital Patient Data Linking System",
        "organization": "NHS Digital / Privitar",
        "description": "System for linking patient data across NHS domains using pseudonymisation via tokenisation. Employs partially homomorphic encryption to enable data linking without revealing underlying raw identifiers.",
        "sector": "Health and Social Care",
        "technologies": ["Homomorphic Encryption", "De-identification techniques"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [],
        "summary_ja": "NHS DigitalとPrivitarが、トークン化による仮名化と部分準同型暗号を用いてNHSの各ドメイン間の患者データを連結。生の識別子を開示せずにデータリンケージを実現し、NHSの医療記録統合を支援。",
        "value_proposition_ja": "仮名化と準同型暗号の組み合わせにより、NHSの大規模な患者データ連結をプライバシー保護の下で実現。国家レベルの医療データ基盤におけるPETs実装の代表例。",
        "privacy_method": "トークン化による仮名化＋部分準同型暗号によるデータリンケージ",
    },
    {
        "title": "NVIDIA and King's College London Brain Tumor Segmentation",
        "organization": "NVIDIA / King's College London",
        "description": "Federated learning approach for training neural networks on brain MRI scans for tumor segmentation. Uses differential privacy with tradeoffs between privacy and model performance across 13 distributed data shards.",
        "sector": "Health and Social Care",
        "technologies": ["Federated Analytics", "Differential Privacy"],
        "development_stage": "Pilot",
        "date": "July 2021",
        "links": [
            {"title": "VentureBeat", "url": "https://venturebeat.com/2019/10/13/nvidia-uses-federated-learning-to-create-medical-imaging-ai/"}
        ],
        "summary_ja": "NVIDIAとKing's College Londonが連合学習と差分プライバシーを用いて、13の分散データシャードにまたがる脳MRIスキャンから腫瘍セグメンテーション用ニューラルネットワークを訓練。プライバシーとモデル性能のトレードオフを検証。",
        "value_proposition_ja": "連合学習により医療画像データを移動させずに脳腫瘍セグメンテーションAIを訓練。差分プライバシーとの組み合わせにより、医療AI開発におけるプライバシー保護と性能のバランスを実証。",
        "privacy_method": "連合学習＋差分プライバシーによる分散データ上の学習",
    },
    {
        "title": "OpenMined and Twitter Algorithmic Transparency",
        "organization": "OpenMined / Twitter",
        "description": "Pilot enabling researchers to run code across social media algorithms using federated learning and remote execution without direct data access. Demonstrates privacy-enabled access to algorithmic code for research transparency.",
        "sector": "Digital",
        "technologies": ["Differential Privacy", "Federated Learning", "Federated Analytics"],
        "development_stage": "Proof of Concept",
        "date": "June 2023",
        "links": [
            {"title": "Twitter blog", "url": "https://blog.twitter.com/engineering/en_us/topics/insights/2022/investing-in-privacy-enhancing-tech-to-advance-transparency-in-ML"},
            {"title": "UN PETs Case Study Repository", "url": "https://unstats.un.org/wiki/display/UGTTOPPT/14.+Twitter+and+OpenMined%3A+Enabling+Third-party+Audits+and+Research+Reproducibility+over+Unreleased+Digital+Assets"}
        ],
        "summary_ja": "OpenMinedとTwitter（X）のパイロットプロジェクト。連合学習とリモート実行により、研究者がソーシャルメディアのアルゴリズムに直接データアクセスせずにコードを実行。アルゴリズム透明性をプライバシー保護の下で実現。",
        "value_proposition_ja": "連合学習とリモート実行により、プラットフォームのアルゴリズムを外部研究者が監査可能に。データアクセスなしでの第三者監査という新たなパラダイムを実証。",
        "privacy_method": "連合学習＋差分プライバシーによるリモートコード実行",
    },
    {
        "title": "OpenSAFELY Secure Health Analytics Platform",
        "organization": "OpenSAFELY",
        "description": "Secure analytics platform enabling researchers to conduct analysis across millions of patients' electronic health records. Leverages federated analysis where code executes in datacenter with data remaining in situ.",
        "sector": "Health and Social Care",
        "technologies": ["Federated Analytics", "De-identification techniques"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "OpenSAFELY website", "url": "https://opensafely.org/"},
            {"title": "Nature paper", "url": "https://www.nature.com/articles/s41586-020-2521-4"}
        ],
        "summary_ja": "OpenSAFELYは、数百万件の電子カルテに対して分散分析を行うセキュアな分析プラットフォーム。研究者のコードをデータセンター内で実行し、データを移動させずに分析。COVID-19研究で広く活用された。",
        "value_proposition_ja": "分散分析と匿名化により、数百万件規模の電子カルテを安全に研究利用。データ移動なしでの大規模医療データ分析プラットフォームとして、COVID-19パンデミック対応に貢献。",
        "privacy_method": "分散分析（コード移動型）＋匿名化",
    },
    {
        "title": "Owkin COVID-19 Severity Prediction",
        "organization": "Owkin",
        "description": "Federated learning system training AI model to predict COVID-19 severity from CT lung scans. Achieves performance surpassing all published score benchmarks while supporting hospital resource management.",
        "sector": "Health and Social Care",
        "technologies": ["Multi-party Computation"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [
            {"title": "Imaging Technology News", "url": "https://www.itnonline.com/content/integrating-deep-learning-ct-scan-model-helps-predict-severity-covid-19-patients"},
            {"title": "Nature Communications", "url": "https://www.nature.com/articles/s41467-020-20657-4"}
        ],
        "summary_ja": "Owkinが連合学習（秘密計算活用）により、複数の病院のCT肺スキャンデータからCOVID-19重症度を予測するAIモデルを訓練。公開ベンチマークを上回る性能を達成し、病院のリソース管理を支援。",
        "value_proposition_ja": "連合学習により複数病院のCTスキャンデータを共有せずにAIモデルを訓練し、COVID-19重症度予測で最高水準の性能を実現。医療AIにおけるプライバシー保護型学習の有効性を実証。",
        "privacy_method": "連合学習（秘密計算ベース）による分散モデル訓練",
    },
    {
        "title": "Privitar Financial Statistics Pilot",
        "organization": "Privitar",
        "description": "Pilot project enabling financial institutions to learn population statistics from disparate private and public datasets using partial homomorphic encryption without collecting identifiable information.",
        "sector": "Finance",
        "technologies": ["Homomorphic Encryption"],
        "development_stage": "Pilot",
        "date": "July 2021",
        "links": [
            {"title": "RUSI-FFIS report", "url": "https://www.gcffc.org/wp-content/uploads/2020/06/FFIS-Innovation-and-discussion-paper-Case-studies-of-the-use-of-privacy-preserving-analysis.pdf"}
        ],
        "summary_ja": "Privitarが部分準同型暗号を用いて、複数の金融機関がプライベート・パブリックデータセットから識別可能情報を収集せずに人口統計を学習するパイロットプロジェクトを実施。",
        "value_proposition_ja": "部分準同型暗号により、識別可能情報を収集せずに分散データソースから統計情報を導出。金融分野でのプライバシー保護型データ分析の実用性を検証。",
        "privacy_method": "部分準同型暗号による暗号化データからの統計学習",
    },
    {
        "title": "RegulAItion Insurance Risk Analysis",
        "organization": "RegulAItion",
        "description": "Platform enabling insurance companies to analyze workforce and claims data correlation without sharing data. Improves risk models by 1-4% while keeping data in situ under each holder's control.",
        "sector": "Other",
        "technologies": ["Federated Analytics", "Differential Privacy", "De-identification techniques"],
        "development_stage": "Proof of concept",
        "date": "July 2021",
        "links": [],
        "summary_ja": "RegulAItionが分散分析・差分プライバシー・匿名化を組み合わせて、保険会社が労働力データと保険請求データの相関をデータ共有なしに分析するプラットフォームを開発。リスクモデルの精度を1-4%改善しつつ、データは各保有者の管理下に維持。",
        "value_proposition_ja": "複数のPETsの組み合わせにより、保険会社間でデータを共有せずにリスクモデルの精度を向上。データ主権を維持したまま競合企業間のデータ活用を実現。",
        "privacy_method": "分散分析＋差分プライバシー＋匿名化の組み合わせ",
    },
    {
        "title": "RegulAItion Contract Review Algorithm Development",
        "organization": "RegulAItion",
        "description": "Collaborative platform enabling public and private sector participants to develop contract review algorithms without sharing or pooling data. Completed algorithm deployment in 12 weeks across distributed datasets.",
        "sector": "Crime & Justice",
        "technologies": ["Federated Analytics", "Differential Privacy", "De-identification techniques"],
        "development_stage": "Product",
        "date": "July 2021",
        "links": [],
        "summary_ja": "RegulAItionが分散分析・差分プライバシー・匿名化を活用し、官民の参加者がデータを共有・集約せずに契約レビューアルゴリズムを共同開発。12週間で分散データセットにまたがるアルゴリズムの展開を完了。",
        "value_proposition_ja": "分散分析により官民のデータを移動させずにAIアルゴリズムを共同開発。12週間での迅速な展開を実現し、プライバシー保護型協調学習の実用性を実証。",
        "privacy_method": "分散分析＋差分プライバシー＋匿名化の組み合わせ",
    },
    {
        "title": "Replica Analytics Alberta Synthetic Health Records",
        "organization": "Replica Analytics",
        "description": "Collaboration generating synthetic healthcare records from 100,000 patient records in Alberta. Enables researchers and students to conduct health data science projects without privacy concerns.",
        "sector": "Health and Social Care",
        "technologies": ["Synthetic Data"],
        "development_stage": "Product",
        "date": "June 2023",
        "links": [
            {"title": "University of Alberta blog", "url": "https://www.ualberta.ca/folio/2021/09/even-better-than-the-real-thing-simulated-anonymized-data-could-be-key-to-health-care-innovations.html"},
            {"title": "Replica Analytics blog", "url": "https://replica-analytics.com/blog/joins-albertas-data-project/"}
        ],
        "summary_ja": "Replica Analyticsがアルバータ州の100,000件の患者記録から合成医療データを生成。研究者や学生がプライバシーの懸念なしにヘルスデータサイエンスのプロジェクトを実施できる環境を提供。",
        "value_proposition_ja": "合成データにより実データのプライバシーリスクを排除しつつ、研究・教育用の高品質な医療データを提供。医療データサイエンス人材育成の障壁を大幅に低減。",
        "privacy_method": "合成データ生成による実患者データの代替",
    },
    {
        "title": "Secretarium DANIE Banking Data Platform",
        "organization": "Secretarium / DANIE",
        "description": "Banking consortium platform using encryption and trusted execution environments for data analysis. Supports data quality improvement, anti-money laundering and fraud detection without human access to underlying data.",
        "sector": "Finance",
        "technologies": ["Multi-party Computation", "Trusted Execution Environment"],
        "development_stage": "Product",
        "date": "June 2023",
        "links": [
            {"title": "DANIE webpage", "url": "https://danie.tech/"}
        ],
        "summary_ja": "SecretariumとDANIEが暗号化とTEEを活用した銀行コンソーシアム向けデータ分析プラットフォームを構築。人間がデータに直接アクセスすることなく、データ品質改善・マネーロンダリング防止・不正検知を実施。",
        "value_proposition_ja": "暗号化とTEEの組み合わせにより、銀行コンソーシアムが基盤データに人間がアクセスせずに不正検知・AML分析を実施。金融犯罪対策におけるプライバシー保護型データ共有の実装例。",
        "privacy_method": "秘密計算＋TEEによるデータへの人間のアクセス排除",
    },
    {
        "title": "Signal Contact Discovery Service",
        "organization": "Signal",
        "description": "Privacy-focused messaging app using trusted execution environments (Intel SGX) for contact discovery. TEE allows contact matching without Signal accessing user contact information.",
        "sector": "Digital",
        "technologies": ["Trusted Execution Environment"],
        "development_stage": "Pilot",
        "date": "July 2021",
        "links": [
            {"title": "Signal blog", "url": "https://signal.org/blog/private-contact-discovery/"},
            {"title": "GitHub source code", "url": "https://github.com/signalapp/ContactDiscoveryService/"}
        ],
        "summary_ja": "Signalがインテル SGX（TEE）を用いた連絡先検索サービスを実装。ユーザーの連絡先情報をSignalのサーバーが閲覧できない状態で、登録済みユーザーとのマッチングを実現。",
        "value_proposition_ja": "TEEにより、メッセージングプラットフォーム運営者自身がユーザーの連絡先データにアクセスできない連絡先検索を実現。プライバシー最優先のサービス設計における先駆的実装。",
        "privacy_method": "Intel SGX（TEE）内での連絡先マッチング処理",
    },
    {
        "title": "Statice Provinzial Insurance Predictive Analytics",
        "organization": "Statice / Provinzial",
        "description": "Insurance company using synthetic data to train machine learning models for predictive analytics and 'next best offer' recommendation engine. Saved three months of privacy risk evaluation time.",
        "sector": "Insurance",
        "technologies": ["Synthetic Data"],
        "development_stage": "Product",
        "date": "June 2023",
        "links": [
            {"title": "Statice case study", "url": "https://www.statice.ai/case-study/provinzial-predictive-analytics-synthetic-insurance-data#get-case-study"}
        ],
        "summary_ja": "ドイツの保険会社Provinzialが、Staticeの合成データを用いて予測分析や「ネクストベストオファー」推薦エンジンのためのMLモデルを訓練。合成データの活用により、プライバシーリスク評価にかかる時間を3ヶ月短縮。",
        "value_proposition_ja": "合成データによりプライバシーリスク評価の工程を3ヶ月短縮し、予測分析モデルの開発を大幅に加速。保険業界におけるデータ活用とコンプライアンスの両立を実現。",
        "privacy_method": "合成データ生成による実データの代替",
    },
    {
        "title": "Statistics Canada Synthetic Data Hackathons",
        "organization": "Statistics Canada",
        "description": "National Statistics Office piloting synthetic data for hackathon participation. Reduces disclosure risk while maintaining analytical value for census and mortality registry datasets.",
        "sector": "National Statistics",
        "technologies": ["Synthetic Data"],
        "development_stage": "Pilot",
        "date": "June 2023",
        "links": [
            {"title": "UN PETs Case Study repository", "url": "https://unstats.un.org/wiki/display/UGTTOPPT/10.+Statistics+Canada%3A+Trialling+the+use+of+synthetic+data"}
        ],
        "summary_ja": "カナダ統計局が合成データをハッカソン参加用に試験的に提供。国勢調査・死亡登録データセットの分析価値を維持しつつ、開示リスクを低減。外部参加者にデータサイエンスの機会を提供。",
        "value_proposition_ja": "合成データにより統計データの開示リスクを低減しつつ、ハッカソンでの外部活用を実現。統計機関によるオープンイノベーション促進のためのPETs活用事例。",
        "privacy_method": "合成データ生成による統計データの安全な外部提供",
    },
    {
        "title": "Statistics Korea Statistical Data Hub Platform",
        "organization": "Statistics Korea",
        "description": "National Statistics Office developing cloud-based platform for linking fragmented government data across departments. Pilots multiple PETs including homomorphic encryption for sensitive small business data.",
        "sector": "National Statistics",
        "technologies": ["Homomorphic Encryption", "Multi-party Computation", "Differential Privacy"],
        "development_stage": "Pilot",
        "date": "June 2023",
        "links": [
            {"title": "UN PETs Case Study repository", "url": "https://unstats.un.org/wiki/display/UGTTOPPT/11.+Statistics+Korea%3A+Developing+a+privacy-preserving+Statistical+Data+Hub+Platform"},
            {"title": "Kostat", "url": "https://kostat.go.kr/menu.es?mid=b10302010300"}
        ],
        "summary_ja": "韓国統計庁がクラウドベースの統計データハブプラットフォームを開発。省庁間に分散した政府データを準同型暗号・秘密計算・差分プライバシーを組み合わせて安全に連結。特に中小企業の機密データ保護にHEを活用。",
        "value_proposition_ja": "複数のPETs（HE・MPC・DP）を組み合わせて政府データの安全な連結を実現。省庁横断的なデータ活用と機密性保護を両立する国家統計基盤の構築事例。",
        "privacy_method": "準同型暗号＋秘密計算＋差分プライバシーの組み合わせ",
    },
    {
        "title": "Tsinghua University and Microsoft FedNER",
        "organization": "Tsinghua University / Microsoft",
        "description": "Medical Named Entity Recognition (NER) federated system to train ML model across medical platforms. Model decomposed into private local and global shared components without data format standardization.",
        "sector": "Health and Social Care",
        "technologies": ["Federated Analytics"],
        "development_stage": "Pilot",
        "date": "July 2021",
        "links": [
            {"title": "Research paper", "url": "https://arxiv.org/pdf/2003.09288.pdf"}
        ],
        "summary_ja": "清華大学とMicrosoftが開発したFedNERは、連合学習により複数の医療プラットフォームにまたがる非構造化医療テキストから固有表現認識（NER）モデルを訓練。プライベートローカルモデルとグローバル共有モデルに分解し、データフォーマットの標準化なしに参加可能。",
        "value_proposition_ja": "連合学習によりデータフォーマットの異なる複数医療機関のデータを標準化なしに活用。参加障壁を下げつつ医療NLPモデルの精度向上を実現。",
        "privacy_method": "連合学習による分散NERモデル訓練（データ移動なし）",
    },
    {
        "title": "United Nations PET Lab International Trade Verification",
        "organization": "United Nations PET Lab",
        "description": "Pilot programme exploring how to improve understanding of international trade using PETs. Verifies import/export quantities between countries using MPC and differential privacy via OpenMined's peer-to-peer network.",
        "sector": "National Statistics",
        "technologies": ["Differential Privacy", "Multi-party Computation"],
        "development_stage": "Proof of Concept",
        "date": "June 2023",
        "links": [
            {"title": "UN PETs Case Study repository", "url": "https://unstats.un.org/wiki/display/UGTTOPPT/16.+United+Nations+PET+Lab%3A+International+Trade"},
            {"title": "Information Age article", "url": "https://www.information-age.com/un-launches-privacy-lab-pilot-to-unlock-cross-border-data-sharing-benefits-19414/"}
        ],
        "summary_ja": "国連PETラボが秘密計算と差分プライバシーを活用して、国際貿易統計の検証パイロットを実施。OpenMinedのピアツーピアネットワークを通じて、各国の輸出入量を相互に検証しつつ個別データを保護。",
        "value_proposition_ja": "秘密計算と差分プライバシーにより、各国の貿易データを開示せずに輸出入統計の整合性を検証。国際的な統計品質向上におけるPETs活用の先駆的パイロット。",
        "privacy_method": "秘密計算＋差分プライバシーによる分散型データ検証",
    },
    {
        "title": "US Census Bureau 2020 Census Differential Privacy",
        "organization": "US Census Bureau",
        "description": "The Bureau leveraged differential privacy to minimise identification risk when publishing 2020 Census statistics. Noise-injection maintains state-level accuracy while protecting smaller geographies.",
        "sector": "Other",
        "technologies": ["Differential Privacy"],
        "development_stage": "In development",
        "date": "July 2021",
        "links": [
            {"title": "Royal Society report on PETs", "url": "https://royalsociety.org/-/media/policy/projects/privacy-enhancing-technologies/privacy-enhancing-technologies-report.pdf"},
            {"title": "Report on issues encountered implementing DP", "url": "https://arxiv.org/pdf/1809.02201.pdf"},
            {"title": "Explainer by the NCSL", "url": "https://www.ncsl.org/research/redistricting/differential-privacy-for-census-data-explained.aspx"}
        ],
        "summary_ja": "米国国勢調査局が2020年国勢調査の統計公表にあたり差分プライバシーを適用。州レベルの人口は正確な値を維持しつつ、それ以下の地理的レベル（選挙区〜国勢調査ブロック）にノイズを注入して個人の識別リスクを最小化。プライバシー予算の設定やネイティブアメリカン部族への影響が議論の焦点に。",
        "value_proposition_ja": "世界最大規模の差分プライバシー実装として、3億人以上の国勢調査データの公表にDPを適用。プライバシー予算設定の実務的課題やマイノリティへの影響など、実装上の重要な教訓を提供。",
        "privacy_method": "差分プライバシーによる統計データへのノイズ注入",
    },
]

NOW = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
CDEI_SOURCE = {
    "source_type": "web",
    "title": "CDEI PETs Adoption Guide - Repository of Use Cases",
    "url": "https://cdeiuk.github.io/pets-adoption-guide/repository/",
    "note": "Centre for Data Ethics and Innovation (CDEI) PETs Adoption Guide"
}

def create_case(c):
    case_id = str(uuid.uuid4())
    tech_cats = map_technologies(c["technologies"])
    domain = map_domain(c["sector"])
    usecase_cat = map_usecase_category(c["development_stage"])
    occurred_at = parse_date(c["date"])

    # Build tags
    tags = [c["development_stage"], "CDEI PETs Adoption Guide"]
    for t in c["technologies"]:
        tags.append(t)

    # Build sources: CDEI page + external links
    sources = [CDEI_SOURCE.copy()]
    for link in c["links"]:
        sources.append({
            "source_type": "web",
            "title": link["title"],
            "url": link["url"],
            "note": ""
        })

    # Handle NHS Digital case with no external links
    if not c["links"]:
        # Already have CDEI source
        pass

    return {
        "id": case_id,
        "title": c["title"],
        "region": "国外",
        "domain": domain,
        "organization": c["organization"],
        "usecase_category": usecase_cat,
        "technology_category": tech_cats,
        "review_status": "ai_generated",
        "summary": c["summary_ja"],
        "value_proposition": c["value_proposition_ja"],
        "privacy_enhancement_method": c.get("privacy_method", "調査中"),
        "safety_assurance_method": "調査中",
        "utility_evaluation_method": "調査中",
        "tags": tags,
        "sources": sources,
        "figures": [],
        "occurred_at": occurred_at,
        "status": "seed",
        "created_at": NOW,
        "updated_at": NOW,
    }


def main():
    base_dir = "public/cases"
    generated_ids = []

    for c in CASES:
        case_data = create_case(c)
        case_dir = os.path.join(base_dir, case_data["id"])
        os.makedirs(case_dir, exist_ok=True)
        with open(os.path.join(case_dir, "case.json"), "w", encoding="utf-8") as f:
            json.dump(case_data, f, ensure_ascii=False, indent=2)
        generated_ids.append(case_data["id"])
        print(f"Created: {case_data['id']} - {case_data['title']}")

    # Update index.json
    index_path = os.path.join(base_dir, "index.json")
    with open(index_path, "r", encoding="utf-8") as f:
        index = json.load(f)

    existing_ids = index["cases"]
    index["cases"] = existing_ids + generated_ids

    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"\nTotal generated: {len(generated_ids)} cases")
    print(f"Total in index: {len(index['cases'])} cases")


if __name__ == "__main__":
    main()
