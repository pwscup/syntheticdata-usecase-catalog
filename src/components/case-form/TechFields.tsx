import { useFormContext } from 'react-hook-form'
import type { CaseFormData } from '../../schemas/case.schema'

export default function TechFields() {
  const { register } = useFormContext<CaseFormData>()

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="privacy_enhancement_method" className="block text-sm font-medium">プライバシー強化手法</label>
        <input id="privacy_enhancement_method" type="text" {...register('privacy_enhancement_method')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="safety_assurance_method" className="block text-sm font-medium">安全性保証手法</label>
        <input id="safety_assurance_method" type="text" {...register('safety_assurance_method')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label htmlFor="utility_evaluation_method" className="block text-sm font-medium">有用性評価手法</label>
        <input id="utility_evaluation_method" type="text" {...register('utility_evaluation_method')} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2" />
      </div>
    </div>
  )
}
