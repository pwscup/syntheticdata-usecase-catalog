import { Link } from 'react-router-dom'
import type { Case } from '../../types'
import { DOMAIN_COLORS, REGION_COLORS } from '../../constants/styles'

interface CaseCardProps {
  caseItem: Case
}

export default function CaseCard({ caseItem }: CaseCardProps) {
  const domainStyle = DOMAIN_COLORS[caseItem.domain as keyof typeof DOMAIN_COLORS]
  const borderColor = domainStyle?.border ?? 'border-l-gray-400'
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
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${REGION_COLORS[caseItem.region]?.badge ?? 'bg-gray-100 text-gray-600'}`}>
            {caseItem.region}
          </span>
        )}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${domainStyle?.badge ?? 'bg-gray-100 text-gray-600'}`}>
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
