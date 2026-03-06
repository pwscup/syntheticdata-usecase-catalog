import { useState } from 'react'
import type { CaseFormData } from '../../schemas/case.schema'
import { generateCreatePrompt, generateEnrichPrompt } from '../../constants/prompts'
import { parseCaseFromAiOutput } from '../../lib/import-case'
import { useCopiedState } from '../../hooks/useCopiedState'

interface AiAssistPanelProps {
  mode: 'create' | 'edit'
  currentCaseJson?: string
  onImport: (data: CaseFormData) => void
}

export default function AiAssistPanel({ mode, currentCaseJson, onImport }: AiAssistPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)
  const { copied, markCopied } = useCopiedState()
  const [importText, setImportText] = useState('')
  const [importStatus, setImportStatus] = useState<
    { type: 'success' } | { type: 'error'; message: string } | null
  >(null)

  const prompt = mode === 'create'
    ? generateCreatePrompt()
    : generateEnrichPrompt(currentCaseJson ?? '{}')

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt)
    markCopied()
  }

  function handleImport() {
    const result = parseCaseFromAiOutput(importText)
    if (result.success) {
      onImport(result.data)
      setImportStatus({ type: 'success' })
    } else {
      setImportStatus({ type: 'error', message: result.error })
    }
  }

  return (
    <div className="rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold">AI で入力を補助する</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">推奨</span>
        </div>
        <span className="text-sm text-gray-500">
          {isOpen ? '▼ 閉じる' : '▶ 開く'}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {/* Usage guide */}
          <div className="rounded-lg bg-white border border-blue-100 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-800">使い方</p>
            <ol className="list-decimal ml-5 space-y-1.5 text-sm text-gray-600">
              <li>
                下の<strong>「プロンプトをコピー」</strong>ボタンでプロンプトをコピーします
              </li>
              <li>
                AI（Claude、ChatGPT 等）にプロンプトを貼り付け、
                <strong>参考文献のURLやテキスト</strong>を追記して送信します
              </li>
              <li>
                AIが出力したJSONを下の<strong>「AIの出力をインポート」</strong>欄に貼り付けてインポートすると、入力フォームが自動で埋まります
              </li>
              <li>
                内容を確認・修正して「プレビュー」に進んでください
              </li>
            </ol>
            <p className="text-xs text-gray-400">
              手動で各項目を入力することもできますが、AIを使うと効率的に事例を作成できます。
            </p>
          </div>

          {/* Prompt section */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">プロンプト</div>
            <p className="text-xs text-gray-500">
              {mode === 'create'
                ? 'プロンプトの冒頭に参考文献（URL・テキスト）の貼り付け欄があります。AIに送信する前に、そこへ情報を追記してください。'
                : '追加の参考文献を使って既存事例を補完・改善するためのプロンプトです。'}
            </p>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsPromptExpanded(!isPromptExpanded)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setIsPromptExpanded(!isPromptExpanded)
              }}
              className="cursor-pointer rounded border border-gray-200 bg-white p-3"
            >
              {isPromptExpanded ? (
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{prompt}</pre>
              ) : (
                <p className="text-sm text-gray-800 line-clamp-3 whitespace-pre-wrap">{prompt}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                プロンプトをコピー
              </button>
              {copied && (
                <span className="text-sm text-green-600">&#10003; コピーしました</span>
              )}
            </div>
          </div>

          {/* Import section */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 border-t border-gray-200 pt-3">
              AIの出力をインポート
            </div>
            <p className="text-xs text-gray-500">
              AIが出力したJSONをそのまま貼り付けてください。マークダウンのコードブロック（```json ... ```）ごと貼り付けてもOKです。
            </p>
            <textarea
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value)
                setImportStatus(null)
              }}
              placeholder="AIが出力したJSONをここに貼り付け..."
              rows={4}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleImport}
                disabled={!importText.trim()}
                className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                インポート
              </button>
              {importStatus?.type === 'success' && (
                <span className="text-sm text-green-600">&#10003; フォームに反映しました。下の各項目を確認してください。</span>
              )}
              {importStatus?.type === 'error' && (
                <span className="text-sm text-red-600">{importStatus.message}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
