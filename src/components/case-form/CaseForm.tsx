import { useState, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { caseFormSchema, type CaseFormData } from '../../schemas/case.schema'
import type { Case } from '../../types'
import { DOMAIN_OPTIONS, TECHNOLOGY_CATEGORY_OPTIONS, TECHNOLOGY_CATEGORY_LABELS } from '../../constants/categories'
import BasicFields from './BasicFields'
import TechFields from './TechFields'
import SourceFields from './SourceFields'
import TagInput from './TagInput'
import CategoryCheckboxes from './CategoryCheckboxes'
import AiAssistPanel from './AiAssistPanel'
import ReviewStatusField from './ReviewStatusField'
import FiguresField, { normalizeFigures } from './FiguresField'

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
      technology_category: defaultValues?.technology_category ?? ['synthetic_data'],
      review_status: defaultValues?.review_status ?? 'ai_generated',
      summary: defaultValues?.summary ?? '',
      value_proposition: defaultValues?.value_proposition ?? '',
      privacy_enhancement_method: defaultValues?.privacy_enhancement_method ?? '調査中',
      safety_assurance_method: defaultValues?.safety_assurance_method ?? '調査中',
      utility_evaluation_method: defaultValues?.utility_evaluation_method ?? '調査中',
      occurred_at: defaultValues?.occurred_at ?? '',
      tags: defaultValues?.tags ?? [],
      sources: defaultValues?.sources ?? [{ source_type: 'web', title: '', url: '', note: '' }],
      figures: (defaultValues?.figures ?? []).map((f) => ({
        type: f.type,
        title: f.title ?? '',
        // data_flow のみフォームで編集。非 data_flow は undefined にし、submit時に原データを復元
        data: f.type === 'data_flow'
          ? {
              nodes: (f.data as { nodes?: Array<{ id?: string; label?: string; category?: string }> }).nodes?.map((n) => ({
                id: n.id ?? '',
                label: n.label ?? '',
                category: n.category ?? '',
              })) ?? [],
              edges: (f.data as { edges?: Array<{ from: string; to: string; label: string }> }).edges ?? [],
            }
          : undefined,
        note: f.note ?? '',
      })),
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
    const normalizedFigures = normalizeFigures(formData.figures, defaultValues?.figures)
    const fullCase: Case = {
      ...formData,
      id: isEdit ? defaultValues!.id! : crypto.randomUUID(),
      technology_category: formData.technology_category ?? ['synthetic_data'],
      review_status: formData.review_status ?? 'ai_generated',
      occurred_at: formData.occurred_at || null,
      figures: normalizedFigures as Case['figures'],
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

        {/* レビュー状況（編集時のみ表示） */}
        {isEdit && <ReviewStatusField originalStatus={defaultValues?.review_status} />}

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

        {/* 発生時期（任意） */}
        <div>
          <label htmlFor="occurred_at" className="block text-sm font-medium">発生時期</label>
          <input
            id="occurred_at"
            type="text"
            {...methods.register('occurred_at')}
            placeholder="例: 2023, 2023-06, 2023-06-15"
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
          <p className="mt-1 text-xs text-gray-500">YYYY, YYYY-MM, or YYYY-MM-DD format（空欄で詳細不明）</p>
        </div>

        {/* 技術カテゴリ */}
        <div>
          <span className="block text-sm font-medium mb-1">技術カテゴリ</span>
          <div className="flex flex-wrap gap-3">
            {TECHNOLOGY_CATEGORY_OPTIONS.map((tech) => {
              const current = methods.watch('technology_category') ?? []
              return (
                <label key={tech} className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={current.includes(tech)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...current, tech]
                        : current.filter((t: string) => t !== tech)
                      methods.setValue('technology_category', next, { shouldDirty: true })
                    }}
                    className="rounded border-gray-300"
                  />
                  {TECHNOLOGY_CATEGORY_LABELS[tech]}
                </label>
              )
            })}
          </div>
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

        {/* 折りたたみ: 図表 */}
        <CollapsibleSection title="図表" badge="任意">
          <FiguresField />
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
