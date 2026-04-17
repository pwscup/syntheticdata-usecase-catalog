import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Case, ReviewStatus } from '../../types'
import { exportCases } from '../../lib/export-import'
import { useCopiedState } from '../../hooks/useCopiedState'
import { REVIEW_STATUS_LABELS } from '../../constants/categories'
import CaseDetailView from './CaseDetailView'

const GITHUB_REPO_URL = 'https://github.com/pwscup/syntheticdata-usecase-catalog'

function reviewTransitionCommitMessage(caseData: Case, transition: { from: ReviewStatus; to: ReviewStatus }): string {
  const titleShort = caseData.title.length > 40 ? caseData.title.slice(0, 40) + '…' : caseData.title
  const fromLabel = REVIEW_STATUS_LABELS[transition.from] ?? transition.from
  const toLabel = REVIEW_STATUS_LABELS[transition.to] ?? transition.to
  return `review: ${titleShort} を ${fromLabel} → ${toLabel} に更新`
}

export default function CasePreview({
  caseData,
  onBack,
  mode = 'new',
  originalReviewStatus,
}: {
  caseData: Case
  onBack: () => void
  mode?: 'new' | 'edit'
  originalReviewStatus?: ReviewStatus
}) {
  const navigate = useNavigate()
  const [showGitHubGuide, setShowGitHubGuide] = useState(false)
  const [showDownloadGuide, setShowDownloadGuide] = useState(false)
  const { copied, markCopied } = useCopiedState(3000)

  const reviewTransition =
    originalReviewStatus && originalReviewStatus !== caseData.review_status
      ? { from: originalReviewStatus, to: caseData.review_status }
      : null

  const suggestedPath = `public/cases/${caseData.id}/case.json`
  const githubUrl =
    mode === 'edit'
      ? `${GITHUB_REPO_URL}/edit/main/${suggestedPath}`
      : `${GITHUB_REPO_URL}/new/main?filename=${suggestedPath}`

  const suggestedCommitMessage = reviewTransition
    ? reviewTransitionCommitMessage(caseData, reviewTransition)
    : null

  const handleGitHub = async () => {
    const json = JSON.stringify(caseData, null, 2)
    await navigator.clipboard.writeText(json)
    markCopied()
    setShowGitHubGuide(true)
    setShowDownloadGuide(false)
  }

  const handleDownload = () => {
    exportCases([caseData])
    setShowDownloadGuide(true)
    setShowGitHubGuide(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">プレビュー</h1>

      <CaseDetailView caseData={caseData} />

      {/* Review status transition banner */}
      {reviewTransition && (
        <div
          className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm"
          data-testid="review-transition-banner"
        >
          <p className="font-bold text-emerald-900">
            レビュー状況の変更: {REVIEW_STATUS_LABELS[reviewTransition.from]} → {REVIEW_STATUS_LABELS[reviewTransition.to]}
          </p>
          <p className="text-gray-700 mt-1">
            この提出には <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-xs">review_status</code> の変更が含まれます。
            GitHub でコミットする際は、コミットメッセージを下記の形式にすることを推奨します:
          </p>
          <pre
            className="mt-2 bg-white border border-gray-200 rounded p-2 text-xs overflow-x-auto"
            data-testid="review-transition-commit-message"
          >
            {suggestedCommitMessage}
          </pre>
        </div>
      )}

      {/* Action area */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">
            カタログに事例を登録するには、以下のいずれかの方法で提出してください。
          </p>
          <p className="text-xs text-gray-500">
            「GitHubで提出」を使うと、ブラウザ上の操作だけで完了できます（推奨）。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGitHub}
            className="rounded bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 ring-2 ring-gray-800 ring-offset-2"
          >
            GitHubで提出（推奨）
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            JSONをダウンロード
          </button>
          <button
            type="button"
            onClick={onBack}
            className="rounded border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            戻って修正
          </button>
        </div>
      </div>

      {/* GitHub guide panel */}
      {showGitHubGuide && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-6 text-sm space-y-4">
          {copied && (
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              JSONをクリップボードにコピーしました
            </div>
          )}

          <p className="font-bold text-gray-800">GitHub でPRを作成する手順</p>

          <ol className="list-decimal ml-5 space-y-3 text-gray-700">
            <li>
              下の<strong>「GitHubを開く」</strong>ボタンをクリックして、GitHubリポジトリを新しいタブで開きます
            </li>
            {mode === 'edit' ? (
              <li>
                既存ファイル <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">{suggestedPath}</code>
                {' '}の編集画面が開きます
              </li>
            ) : (
              <li>
                ファイルパス <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">{suggestedPath}</code>
                {' '}が自動入力されています
              </li>
            )}
            <li>
              エディタの入力欄の内容を全選択して削除し、クリップボードの内容をペーストしてください（<kbd className="bg-white border border-gray-300 rounded px-1 py-0.5 text-xs">Ctrl+V</kbd> / <kbd className="bg-white border border-gray-300 rounded px-1 py-0.5 text-xs">Cmd+V</kbd>）
            </li>
            <li>
              右上の<strong>「Commit changes...」</strong>ボタンをクリックします
            </li>
            <li>
              ダイアログが表示されたら、Commit messageはそのままでOKです。<strong>「Propose changes」</strong>ボタンをクリックしてください
            </li>
            <li>
              PRの作成画面が表示されます。メッセージはそのままで<strong>「Create pull request」</strong>ボタンをクリックすれば完了です
            </li>
          </ol>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => window.open(githubUrl, '_blank')}
              className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              GitHubを開く
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              完了（トップページへ）
            </button>
          </div>
        </div>
      )}

      {/* Download guide panel */}
      {showDownloadGuide && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm space-y-4">
          <p className="font-bold text-gray-800">ダウンロード後の手順</p>

          <ol className="list-decimal ml-5 space-y-2 text-gray-700">
            <li>
              ダウンロードされたJSONファイルの中身から、該当する事例のJSONを取り出してください
            </li>
            <li>
              GitHubリポジトリの <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">{suggestedPath}</code> にファイルを配置し、PRを作成してください
            </li>
            <li>
              または、管理者にJSONファイルを送付してください
            </li>
          </ol>

          <p className="text-xs text-gray-500">
            GitHubの操作に慣れていない場合は、上の「GitHubで提出（推奨）」を使うと、より簡単に提出できます。
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            完了（トップページへ）
          </button>
        </div>
      )}
    </div>
  )
}
