import { useFormContext } from 'react-hook-form'
import type { CaseFormData } from '../../schemas/case.schema'

export default function BasicFields() {
  const { register } = useFormContext<CaseFormData>()

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">タイトル</label>
        <input id="title" type="text" {...register('title')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium">地域</label>
        <select id="region" {...register('region')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2">
          <option value="">選択しない</option>
          <option value="国内">国内</option>
          <option value="国外">国外</option>
        </select>
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium">組織名</label>
        <input id="organization" type="text" {...register('organization')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium">概要</label>
        <textarea id="summary" rows={4} {...register('summary')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="value_proposition" className="block text-sm font-medium">PETs適用により得られた価値</label>
        <textarea id="value_proposition" rows={3} {...register('value_proposition')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>
    </div>
  )
}
