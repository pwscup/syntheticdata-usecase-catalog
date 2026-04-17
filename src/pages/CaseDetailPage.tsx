import { useParams, Link } from 'react-router-dom'
import { useCases } from '../context/CaseContext'
import CaseDetailView from '../components/case-detail/CaseDetailView'

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { cases, loading } = useCases()

  if (loading) {
    return <p>読み込み中...</p>
  }

  const caseData = cases.find((c) => c.id === id)

  if (!caseData) {
    return (
      <div>
        <p>事例が見つかりません</p>
        <Link to="/" className="text-blue-700 underline">一覧に戻る</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="text-blue-700 underline text-sm mb-4 inline-block">← 一覧に戻る</Link>

      <CaseDetailView caseData={caseData} />

      {/* Edit link */}
      <div className="mt-4 mb-6 flex flex-wrap gap-2">
        <Link
          to={`/cases/${caseData.id}/edit`}
          className="inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          編集
        </Link>
        {caseData.review_status === 'ai_generated' && (
          <Link
            to={`/cases/${caseData.id}/edit`}
            className="inline-block rounded border border-emerald-600 bg-white px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
            data-testid="review-cta"
            title="編集画面でレビュー状況を 'レビュー済' に変更し、GitHubで提出できます"
          >
            レビュー済みとして編集・提出
          </Link>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-6">
        ※ 本事例の情報は、調査時点で公開されていた資料に基づいて作成したものであり、現時点の状況を正確に反映しているとは限りません。免責事項については<Link to="/about" className="text-blue-400 hover:text-blue-500 underline underline-offset-2 mx-0.5">Aboutページ</Link>をご参照ください。事例の詳細については、出典元をご確認ください。
      </p>
    </div>
  )
}
