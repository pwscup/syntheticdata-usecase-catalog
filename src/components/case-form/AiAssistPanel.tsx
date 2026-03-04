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
        <span className="font-bold">AI で入力を補助する</span>
        <span className="text-sm text-gray-500">
          {isOpen ? '▼ 閉じる' : '▶ 開く'}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-gray-600">
            文献（PDF・Webページ）のURLと一緒に以下のプロンプトをAI（Claude等）に送信すると、入力内容を自動生成できます。
          </p>

          {/* Prompt preview */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">プロンプト</div>
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
                <span className="text-sm text-green-600">&#10003; インポートしました</span>
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
