import { Link } from 'react-router-dom'
import type { Case } from '../../types'

interface CaseCardProps {
  caseItem: Case
}

const domainBorderColors: Record<string, string> = {
  '金融': 'border-l-emerald-500',
  '医療': 'border-l-rose-500',
  '公共': 'border-l-indigo-500',
  '通信': 'border-l-cyan-500',
}

const regionStyles: Record<string, string> = {
  '国内': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  '国外': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
}

const domainStyles: Record<string, string> = {
  '金融': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  '医療': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  '公共': 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  '通信': 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',
}

export default function CaseCard({ caseItem }: CaseCardProps) {
  const borderColor = domainBorderColors[caseItem.domain] ?? 'border-l-gray-400'
  const categoryText = Array.isArray(caseItem.usecase_category)
    ? caseItem.usecase_category.join(', ')
    : caseItem.usecase_category

  return (
    <Link
      to={`/cases/${caseItem.id}`}
      className={`block bg-white rounded-lg shadow-sm border border-gray-100 border-l-4 ${borderColor} p-4 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5`}
    >
      {/* Title */}
      <h2 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
        {caseItem.title}
      </h2>

      {/* Organization */}
      <p className="text-sm text-gray-600 mb-1">{caseItem.organization}</p>

      {/* Use case category */}
      {categoryText.length > 0 && (
        <p className="text-xs text-gray-500 mb-3">{categoryText}</p>
      )}

      {/* Updated at */}
      <p className="text-xs text-gray-400 mb-3">
        更新: {new Date(caseItem.updated_at).toLocaleDateString('ja-JP')}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {caseItem.region && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${regionStyles[caseItem.region] ?? 'bg-gray-100 text-gray-600'}`}>
            {caseItem.region}
          </span>
        )}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${domainStyles[caseItem.domain] ?? 'bg-gray-100 text-gray-600'}`}>
          {caseItem.domain}
        </span>
        {caseItem.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {tag}
          </span>
        ))}
        {caseItem.tags.length > 2 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            +{caseItem.tags.length - 2}
          </span>
        )}
      </div>
    </Link>
  )
}
