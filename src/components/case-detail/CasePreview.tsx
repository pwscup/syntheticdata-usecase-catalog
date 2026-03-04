import { useState } from 'react'
import type { Case } from '../../types'
import { exportCases } from '../../lib/export-import'
import { useCopiedState } from '../../hooks/useCopiedState'
import CaseDetailView from './CaseDetailView'

const GITHUB_REPO_URL = 'https://github.com/pwscup/syntheticdata-usecase-catalog'

export default function CasePreview({ caseData, onBack }: { caseData: Case; onBack: () => void }) {
  const [showGuide, setShowGuide] = useState(false)
  const { copied, markCopied } = useCopiedState(3000)

  const suggestedPath = `public/cases/${caseData.id}/case.json`

  const handleGitHub = async () => {
    const json = JSON.stringify(caseData, null, 2)
    await navigator.clipboard.writeText(json)
    markCopied()
    setShowGuide(true)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">プレビュー</h1>

      <CaseDetailView caseData={caseData} />

      {/* Action area */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <p className="text-sm text-gray-600">
          リポジトリに反映するには、JSONをダウンロードまたはGitHubで直接PRを作成してください。
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => exportCases([caseData])}
            className="rounded bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            JSONをダウンロード
          </button>
          <button
            type="button"
            onClick={handleGitHub}
            className="rounded bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900"
          >
            GitHubで作成
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
      {showGuide && (
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

          <ol className="list-decimal ml-5 space-y-2 text-gray-700">
            <li>
              以下のボタンで GitHub リポジトリを開きます
            </li>
            <li>
              ファイルパス <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs">{suggestedPath}</code>
              {' '}が自動入力されます
            </li>
            <li>
              エディタにクリップボードの内容をペースト（Ctrl+V / Cmd+V）してください
            </li>
            <li>
              「Commit changes...」をクリックし、「Create a new branch」を選択してPRを作成してください
            </li>
          </ol>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => window.open(`${GITHUB_REPO_URL}/new/main?filename=${suggestedPath}`, '_blank')}
              className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              GitHubを開く
            </button>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
