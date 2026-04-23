import { useFormContext, useFieldArray, useWatch } from 'react-hook-form'
import type { CaseFormData } from '../../schemas/case.schema'
import {
  DATA_FLOW_NODE_CATEGORIES,
  DATA_FLOW_NODE_CATEGORY_LABELS,
  DATA_FLOW_NODE_ID_PREFIX,
  type DataFlowNodeCategory,
} from '../../constants/categories'

export default function FiguresField() {
  const { control } = useFormContext<CaseFormData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'figures' })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-gray-500">
          図表は任意です。data_flow 図を追加するとフロー図が詳細ページに表示されます。
        </p>
      )}

      {fields.map((field, index) => (
        <FigureCard key={field.id} index={index} onRemove={() => remove(index)} />
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            type: 'data_flow',
            title: '',
            data: { nodes: [], edges: [] },
            note: '',
          })
        }
        className="rounded bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
      >
        + data_flow 図を追加
      </button>
    </div>
  )
}

function FigureCard({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { register, control } = useFormContext<CaseFormData>()
  const type = useWatch({ control, name: `figures.${index}.type` })

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          図表 {index + 1}
          <span className="ml-2 text-xs text-gray-500">（type: {type ?? 'data_flow'}）</span>
        </span>
        <button type="button" onClick={onRemove} className="text-sm text-red-600 hover:underline">
          削除
        </button>
      </div>

      <div>
        <label htmlFor={`figures.${index}.title`} className="block text-sm font-medium">タイトル</label>
        <input
          id={`figures.${index}.title`}
          type="text"
          {...register(`figures.${index}.title`)}
          placeholder="例: {事例名}のPETs活用フロー"
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {type === 'data_flow' ? (
        <DataFlowNodesField figureIndex={index} />
      ) : (
        <p className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
          この図タイプ（{type}）のフォーム編集には現時点で未対応です。値は保持されます。詳細な編集が必要な場合は JSON で直接編集してください。
        </p>
      )}

      <div>
        <label htmlFor={`figures.${index}.note`} className="block text-sm font-medium">補足メモ</label>
        <input
          id={`figures.${index}.note`}
          type="text"
          {...register(`figures.${index}.note`)}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>
    </div>
  )
}

function DataFlowNodesField({ figureIndex }: { figureIndex: number }) {
  const { control, register } = useFormContext<CaseFormData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `figures.${figureIndex}.data.nodes` as const,
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium">ノード</span>
        <span className="text-xs text-gray-500">
          順序: source → constraint → process → application → outcome
        </span>
      </div>

      {fields.map((field, i) => (
        <div key={field.id} className="rounded border border-gray-200 p-3 space-y-2 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">ノード {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-xs text-red-600 hover:underline">
              削除
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-2">
            <div>
              <label className="block text-xs text-gray-600">ラベル</label>
              <input
                type="text"
                {...register(`figures.${figureIndex}.data.nodes.${i}.label`)}
                placeholder="例: 医療データを匿名化処理"
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600">分類</label>
              <select
                {...register(`figures.${figureIndex}.data.nodes.${i}.category`)}
                className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="">未選択</option>
                {DATA_FLOW_NODE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {DATA_FLOW_NODE_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* id は非表示。submit 時にカテゴリから自動採番する */}
          <input type="hidden" {...register(`figures.${figureIndex}.data.nodes.${i}.id`)} />
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {DATA_FLOW_NODE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() =>
              append({
                id: '',
                label: '',
                category: cat,
              })
            }
            className="rounded bg-white border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
          >
            + {cat}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Form の緩い figures 値を Case 型に適合する形に正規化する。
 * - data_flow 図: ラベル空ノード除外、空ID をカテゴリに応じて自動採番（s1/p1/a1 形式）
 * - data_flow 図でタイトルも空・ノード0件 → figure 全体を除外
 * - 非 data_flow 図（risk_matrix / utility_chart）: defaultValues から透過保持
 */
export function normalizeFigures(
  formFigures: CaseFormData['figures'] | undefined,
  originalFigures: Array<{ type: string; title: string; data: unknown; note: string }> | undefined,
): Array<{ type: 'data_flow' | 'risk_matrix' | 'utility_chart'; title: string; data: unknown; note: string }> {
  if (!formFigures) return []

  const result: Array<{
    type: 'data_flow' | 'risk_matrix' | 'utility_chart'
    title: string
    data: unknown
    note: string
  }> = []

  formFigures.forEach((fig, index) => {
    const type = fig.type ?? 'data_flow'
    const note = fig.note ?? ''
    const title = fig.title ?? ''

    if (type === 'data_flow') {
      const rawData = fig.data as
        | { nodes?: Array<{ id?: string; label?: string; category?: string }>; edges?: unknown[] }
        | undefined
      const nodes = (rawData?.nodes ?? [])
        .filter((n) => (n.label ?? '').trim() !== '')
        .map((n) => {
          const cat = (n.category ?? '').trim()
          const id = (n.id ?? '').trim()
          return { id, label: (n.label ?? '').trim(), category: cat }
        })

      if (nodes.length === 0 && title.trim() === '') {
        return
      }

      // 空ID をカテゴリに応じて自動採番（既存ID と衝突しないように maxIndex+1）
      const usedIds = new Set(nodes.filter((n) => n.id !== '').map((n) => n.id))
      const prefixCounters: Record<string, number> = {}
      nodes.forEach((node) => {
        if (node.id !== '') {
          const match = node.id.match(/^([a-z]+)(\d+)$/)
          if (match) {
            const pfx = match[1]
            const n = parseInt(match[2], 10)
            prefixCounters[pfx] = Math.max(prefixCounters[pfx] ?? 0, n)
          }
        }
      })
      nodes.forEach((node) => {
        if (node.id !== '') return
        const cat = (DATA_FLOW_NODE_CATEGORIES as readonly string[]).includes(node.category)
          ? (node.category as DataFlowNodeCategory)
          : 'source'
        const prefix = DATA_FLOW_NODE_ID_PREFIX[cat]
        let next = (prefixCounters[prefix] ?? 0) + 1
        let candidate = `${prefix}${next}`
        while (usedIds.has(candidate)) {
          next += 1
          candidate = `${prefix}${next}`
        }
        node.id = candidate
        prefixCounters[prefix] = next
        usedIds.add(candidate)
      })

      const edges = Array.isArray(rawData?.edges) ? (rawData.edges as unknown[]) : []

      result.push({
        type: 'data_flow',
        title: title.trim(),
        data: { nodes, edges },
        note,
      })
    } else {
      // risk_matrix / utility_chart: defaultValues 由来の値をそのまま透過保持
      const original = originalFigures?.[index]
      result.push({
        type,
        title: title.trim(),
        data: original?.data ?? fig.data,
        note,
      })
    }
  })

  return result
}
