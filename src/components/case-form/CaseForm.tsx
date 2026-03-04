import { useState, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { caseFormSchema, type CaseFormData } from '../../schemas/case.schema'
import type { Case } from '../../types'
import { DOMAIN_OPTIONS } from '../../constants/categories'
import BasicFields from './BasicFields'
import TechFields from './TechFields'
import SourceFields from './SourceFields'
import TagInput from './TagInput'
import CategoryCheckboxes from './CategoryCheckboxes'
import AiAssistPanel from './AiAssistPanel'

function CollapsibleSection({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
      >
        <span className="text-sm">{open ? '▼' : '▶'}</span>
        <span className="font-bold">{title}</span>
        {badge && <span className="text-xs text-gray-400">（{badge}）</span>}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

interface CaseFormProps {
  defaultValues?: Partial<Case>
  onSubmit: (data: Case) => void
  submitLabel: string
}

export default function CaseForm({ defaultValues, onSubmit, submitLabel }: CaseFormProps) {
  const isEdit = !!defaultValues?.id

  const methods = useForm({
    resolver: zodResolver(caseFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      region: defaultValues?.region,
      domain: defaultValues?.domain ?? '',
      domain_sub: defaultValues?.domain_sub ?? '',
      organization: defaultValues?.organization ?? '',
      usecase_category: defaultValues?.usecase_category ?? [],
      summary: defaultValues?.summary ?? '',
      value_proposition: defaultValues?.value_proposition ?? '',
      synthetic_generation_method: defaultValues?.synthetic_generation_method ?? '調査中',
      safety_evaluation_method: defaultValues?.safety_evaluation_method ?? '調査中',
      utility_evaluation_method: defaultValues?.utility_evaluation_method ?? '調査中',
      tags: defaultValues?.tags ?? [],
      sources: defaultValues?.sources ?? [{ source_type: 'web', title: '', url: '', note: '' }],
    },
  })

  const handleAiImport = useCallback(
    (data: CaseFormData) => {
      methods.reset(data)
    },
    [methods],
  )

  const currentCaseJson = isEdit
    ? JSON.stringify(defaultValues, null, 2)
    : undefined

  function handleSubmit(formData: CaseFormData) {
    const now = new Date().toISOString()
    const fullCase: Case = {
      ...formData,
      id: isEdit ? defaultValues!.id! : crypto.randomUUID(),
      figures: defaultValues?.figures ?? [],
      status: isEdit ? defaultValues!.status! : 'user',
      created_at: isEdit ? defaultValues!.created_at! : now,
      updated_at: now,
    }
    onSubmit(fullCase)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => handleSubmit(data as CaseFormData))} className="space-y-6">
        {/* AIアシスト */}
        <AiAssistPanel
          mode={isEdit ? 'edit' : 'create'}
          currentCaseJson={currentCaseJson}
          onImport={handleAiImport}
        />

        {/* 出典（必須） */}
        <SourceFields />

        {/* 分野（任意） */}
        <div>
          <label htmlFor="domain" className="block text-sm font-medium">分野</label>
          <select id="domain" {...methods.register('domain')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2">
            <option value="">選択してください</option>
            {DOMAIN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* サブ分野（任意） */}
        <div>
          <label htmlFor="domain_sub" className="block text-sm font-medium">サブ分野</label>
          <input
            id="domain_sub"
            type="text"
            {...methods.register('domain_sub')}
            placeholder="例: 保険、COVID-19"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        {/* カテゴリ */}
        <CategoryCheckboxes />

        {/* 折りたたみ: 基本情報 */}
        <CollapsibleSection title="基本情報" badge="任意">
          <BasicFields />
        </CollapsibleSection>

        {/* 折りたたみ: 技術情報 */}
        <CollapsibleSection title="技術情報" badge="任意">
          <TechFields />
        </CollapsibleSection>

        {/* 折りたたみ: タグ */}
        <CollapsibleSection title="タグ" badge="任意">
          <TagInput />
        </CollapsibleSection>

        <div>
          <button type="submit" className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            {submitLabel}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
