export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">プライバシー強化技術 活用事例カタログ</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">概要</h2>
        <p className="text-gray-700">
          本カタログは、プライバシー強化技術（PETs: Privacy Enhancing Technologies）の活用事例を収集・整理し、検索・閲覧できるWebカタログです。
          合成データ、差分プライバシー、匿名化、連合学習、秘密計算など、国内外の多様な分野における活用方法と評価情報を提供します。
        </p>
      </section>

      <section className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
        <h2 className="text-base font-semibold text-slate-700 flex items-center gap-2">
          <span className="text-lg">{'\u2139\uFE0F'}</span>
          免責事項
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          本カタログに掲載されている情報は、調査時点で公開されていた資料に基づいて作成したものです。
          現時点の状況を正確に反映しているとは限りません。
          また、掲載内容は予告なく変更・削除される場合があります。
          事例の詳細については、各事例に記載の出典元をご確認ください。
          本カタログの情報に基づく判断や行動については、利用者ご自身の責任において行ってください。
        </p>
      </section>

      <section className="p-5 bg-red-50 border border-red-200 rounded-lg space-y-2">
        <h2 className="text-base font-semibold text-red-700 flex items-center gap-2">
          <span className="text-lg">{'\u26A0\uFE0F'}</span>
          機微情報の取り扱いについて
        </h2>
        <p className="text-red-800 text-sm leading-relaxed">
          本カタログの検索・フィルター機能において、個人情報、顧客識別情報、その他の機微情報を入力しないでください。
          入力された情報はブラウザの操作履歴やURL等に残る可能性があり、機微情報の安全な取り扱いを保証できません。
        </p>
      </section>

      <section className="p-5 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
        <h2 className="text-base font-semibold text-gray-700">ご要望・お問い合わせ</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          掲載情報の修正や新しい事例の追加など、ご要望やお気づきの点がございましたら、GitHubの
          <a
            href="https://github.com/pwscup/syntheticdata-usecase-catalog/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Issue
          </a>
          にてお知らせください。
        </p>
      </section>

      <section className="text-sm text-gray-500">
        <p>バージョン: v0.1.0</p>
      </section>
    </div>
  )
}
