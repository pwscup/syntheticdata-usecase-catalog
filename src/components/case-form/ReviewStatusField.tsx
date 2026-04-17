import { useFormContext } from 'react-hook-form'
import type { CaseFormData } from '../../schemas/case.schema'
import { REVIEW_STATUS_OPTIONS, REVIEW_STATUS_LABELS } from '../../constants/categories'

const STATUS_DESCRIPTIONS: Record<string, string> = {
  ai_generated: 'AIが文献から自動生成した状態。人手による整合性確認は未実施。',
  under_review: '誰かがレビュー作業中。着手表明として一時的に使う。',
  human_reviewed: '人手で出典と照合し、記述が妥当と判断した状態。サイトでは緑色のバッジで表示される。',
  flagged: 'レビューの結果、記述に疑義がある・出典が追えない等で保留する状態。',
}

const REVIEW_CHECKLIST: { key: string; label: string }[] = [
  { key: 'src', label: '出典URL（sources）の実物を開いて本文を確認した' },
  { key: 'match', label: 'summary と value_proposition の記述は出典で裏付けられている' },
  { key: 'numbers', label: '数値・固有名詞・組織名は出典と一致している' },
  { key: 'hedged', label: '断定表現（「〜に価値がある」「〜を実現した」等）を避け、出典引用／解釈が区別できる表現になっている' },
  { key: 'title', label: 'title が `{組織名}：{事例内容}` 形式になっている' },
]

export default function ReviewStatusField({ originalStatus }: { originalStatus?: string }) {
  const { register, watch } = useFormContext<CaseFormData>()
  const current = watch('review_status') ?? 'ai_generated'
  const transitioningToReviewed =
    originalStatus === 'ai_generated' && current === 'human_reviewed'

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h2 className="text-sm font-bold">レビュー状況</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            事例の内容を出典と照合したかどうかを示すステータスです。
            {originalStatus && (
              <>
                {' '}現在: <span className="font-medium text-gray-700">{REVIEW_STATUS_LABELS[originalStatus] ?? originalStatus}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 mt-3" data-testid="review-status-options">
        {REVIEW_STATUS_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              value={opt}
              {...register('review_status')}
              className="mt-1"
            />
            <span>
              <span className="font-medium">{REVIEW_STATUS_LABELS[opt]}</span>
              <span className="text-xs text-gray-500 block">{STATUS_DESCRIPTIONS[opt]}</span>
            </span>
          </label>
        ))}
      </div>

      {transitioningToReviewed && (
        <div
          className="mt-4 rounded border border-green-300 bg-green-50 p-3 text-xs text-gray-700 space-y-2"
          data-testid="review-checklist"
        >
          <p className="font-bold text-green-800">レビュー済みに昇格する前に確認してください</p>
          <ul className="list-disc ml-5 space-y-1">
            {REVIEW_CHECKLIST.map((item) => (
              <li key={item.key}>{item.label}</li>
            ))}
          </ul>
          <p className="text-gray-500">
            詳細な手順は{' '}
            <a
              href="https://github.com/pwscup/syntheticdata-usecase-catalog/blob/develop/docs/REVIEW_WORKFLOW.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              REVIEW_WORKFLOW.md
            </a>
            {' '}を参照してください。
          </p>
        </div>
      )}
    </div>
  )
}
