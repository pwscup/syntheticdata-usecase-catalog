import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCases } from '../context/CaseContext'
import CaseForm from '../components/case-form/CaseForm'
import CasePreview from '../components/case-detail/CasePreview'
import type { Case } from '../types'

export default function CaseEditPage() {
  const { id } = useParams<{ id: string }>()
  const { cases } = useCases()
  const [previewData, setPreviewData] = useState<Case | null>(null)

  const targetCase = cases.find((c) => c.id === id)

  if (!targetCase) {
    return (
      <div className="mx-auto max-w-3xl">
        <p>事例が見つかりません</p>
      </div>
    )
  }

  if (previewData) {
    return <CasePreview caseData={previewData} onBack={() => setPreviewData(null)} mode="edit" />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">ケース編集</h1>
      <CaseForm defaultValues={targetCase} onSubmit={setPreviewData} submitLabel="プレビュー" />
    </div>
  )
}
