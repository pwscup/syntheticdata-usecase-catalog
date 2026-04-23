import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Case, DataFlowData } from '../../types'
import FigureRenderer from '../figures/FigureRenderer'
import { TECHNOLOGY_CATEGORY_LABELS, REVIEW_STATUS_LABELS } from '../../constants/categories'

function TechValue({ value }: { value: string }) {
  if (value === '調査中') {
    return <span className="text-gray-400">調査中</span>
  }
  return <span>{value}</span>
}

function getDataFlowKeywords(caseData: Case): { constraint?: string; outcome?: string } {
  const df = caseData.figures.find((f) => f.type === 'data_flow')
  if (!df) return {}
  const data = df.data as DataFlowData
  const constraint = data.nodes.find((n) => n.category === 'constraint')
  const outcome = data.nodes.find((n) => n.category === 'outcome')
  return { constraint: constraint?.label, outcome: outcome?.label }
}

export default function CaseDetailView({ caseData }: { caseData: Case }) {
  const [techOpen, setTechOpen] = useState(false)
  const [modalFigure, setModalFigure] = useState<number | null>(null)
  const keywords = getDataFlowKeywords(caseData)

  return (
    <>
      {/* ===== Header bar (dark navy) ===== */}
      <div className="bg-slate-800 text-white rounded-t-lg">
        {/* Top row: title + metadata badges */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 p-5 pb-3">
          {/* Left: title */}
          <h1 className="text-xl md:text-2xl font-bold flex-1 leading-snug">
            {caseData.title}
          </h1>
          {/* Right: metadata badges */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {caseData.review_status && (
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                  caseData.review_status === 'human_reviewed'
                    ? 'bg-green-500/30 border border-green-400/50 text-green-200'
                    : caseData.review_status === 'flagged'
                      ? 'bg-red-500/30 border border-red-400/50 text-red-200'
                      : caseData.review_status === 'under_review'
                        ? 'bg-blue-500/30 border border-blue-400/50 text-blue-200'
                        : 'bg-yellow-500/30 border border-yellow-400/50 text-yellow-200'
                }`}
                data-testid="review-status-badge"
              >
                {REVIEW_STATUS_LABELS[caseData.review_status] ?? caseData.review_status}
              </span>
            )}
            {caseData.technology_category?.map((tech) => (
              <span key={tech} className="rounded-full bg-slate-500/30 border border-slate-400/50 px-3 py-0.5 text-xs text-slate-200">
                {TECHNOLOGY_CATEGORY_LABELS[tech] ?? tech}
              </span>
            ))}
            <span className="rounded-full bg-blue-500/30 border border-blue-400/50 px-3 py-0.5 text-xs text-blue-200">
              {caseData.region}
            </span>
            {caseData.domain && (
              <span className="rounded-full bg-emerald-500/30 border border-emerald-400/50 px-3 py-0.5 text-xs text-emerald-200">
                {caseData.domain}
              </span>
            )}
            {caseData.usecase_category.map((cat) => (
              <span key={cat} className="rounded-full bg-purple-500/30 border border-purple-400/50 px-3 py-0.5 text-xs text-purple-200">
                {cat}
              </span>
            ))}
          </div>
        </div>
        {/* Bottom row: organization */}
        <div className="px-5 pb-4 text-sm text-slate-300">
          <span className="text-slate-400 mr-2">組織:</span>
          {caseData.organization}
        </div>
      </div>

      {/* ===== Review status alert ===== */}
      {caseData.review_status === 'ai_generated' && (
        <div className="bg-yellow-50 border border-t-0 border-yellow-200 px-5 py-2.5 flex items-start gap-2" data-testid="review-alert">
          <span className="text-yellow-600 text-sm mt-0.5">&#9888;</span>
          <p className="text-xs text-yellow-700">
            このページに表示された内容は、公開情報をもとにAIを用いて整理したものです。内容の正確性は保証しません。
          </p>
        </div>
      )}
      {caseData.review_status === 'flagged' && (
        <div className="bg-red-50 border border-t-0 border-red-200 px-5 py-2.5 flex items-start gap-2" data-testid="review-alert">
          <span className="text-red-600 text-sm mt-0.5">&#9888;</span>
          <p className="text-xs text-red-700">
            この事例には確認が必要な内容が含まれている可能性があります。
          </p>
        </div>
      )}

      {/* ===== Body: 2-column (directly connected to header) ===== */}
      <div className="border border-t-0 border-gray-200 rounded-b-lg bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">

          {/* --- Left column --- */}
          <div className="p-5 space-y-5">
            {/* 課題 */}
            <section>
              <h2 className="flex items-center gap-2 text-base font-bold mb-2" data-testid="section-heading-constraint">
                <span className="inline-block w-1 h-5 bg-slate-800 rounded-full" />
                {keywords.constraint ? `課題：${keywords.constraint}` : '課題'}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{caseData.summary}</p>
            </section>

            {/* 価値 */}
            <section>
              <h2 className="flex items-center gap-2 text-base font-bold mb-2" data-testid="section-heading-outcome">
                <span className="inline-block w-1 h-5 bg-slate-800 rounded-full" />
                {keywords.outcome ? `価値：${keywords.outcome}` : '価値'}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{caseData.value_proposition}</p>
            </section>

            {/* 技術詳細（折りたたみ） */}
            <section>
              <button
                type="button"
                onClick={() => setTechOpen(!techOpen)}
                className="flex items-center gap-2 text-base font-bold mb-2 w-full text-left"
                data-testid="tech-toggle"
              >
                <span className="inline-block w-1 h-5 bg-slate-800 rounded-full" />
                技術詳細
                <span className="text-xs text-gray-400 ml-auto">{techOpen ? '▲' : '▼'}</span>
              </button>
              {techOpen && (
                <dl className="text-sm space-y-1.5" data-testid="tech-details">
                  <div>
                    <dt className="text-gray-500 text-xs">プライバシー強化手法</dt>
                    <dd className="text-gray-800"><TechValue value={caseData.privacy_enhancement_method} /></dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-xs">安全性保証手法</dt>
                    <dd className="text-gray-800"><TechValue value={caseData.safety_assurance_method} /></dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-xs">有用性評価手法</dt>
                    <dd className="text-gray-800"><TechValue value={caseData.utility_evaluation_method} /></dd>
                  </div>
                </dl>
              )}
            </section>

            {/* 関連タグ */}
            {(caseData.domain_sub || caseData.tags.length > 0) && (
              <section>
                <h2 className="flex items-center gap-2 text-base font-bold mb-2">
                  <span className="inline-block w-1 h-5 bg-slate-800 rounded-full" />
                  関連タグ
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {caseData.domain_sub && (
                    <Link
                      to={`/?q=${encodeURIComponent(caseData.domain_sub)}`}
                      className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2.5 py-0.5 rounded-full hover:bg-teal-100 transition-colors"
                    >
                      {caseData.domain_sub}
                    </Link>
                  )}
                  {caseData.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/?q=${encodeURIComponent(tag)}`}
                      className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* --- Right column: diagram area --- */}
          <div className="p-5">
            {caseData.image && (
              <img src={"./cases/" + caseData.image} alt={caseData.title} className="w-full rounded-lg mb-4" />
            )}
            <h2 className="text-center text-base font-bold mb-3">概要図</h2>
            {caseData.figures.length > 0 ? (
              <div className="space-y-4">
                {caseData.figures.map((figure, i) => (
                  <div
                    key={i}
                    className="cursor-pointer hover:ring-2 hover:ring-blue-300 rounded transition-shadow"
                    onClick={() => setModalFigure(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModalFigure(i) }}
                    title="クリックで拡大"
                  >
                    <FigureRenderer figure={figure} caseData={caseData} />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm"
                style={{ minHeight: '240px' }}
                data-testid="figure-placeholder"
              >
                準備中
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Footer: sources ===== */}
      {caseData.sources.length > 0 && (
        <div className="mt-3 px-2 text-xs text-gray-500 space-y-1">
          <span className="font-medium text-gray-600">出典:</span>
          {caseData.sources.map((source, i) => (
            <div key={i} className="ml-2">
              <span className={source.source_type === 'pdf' ? 'text-red-500' : 'text-blue-500'}>
                [{source.source_type === 'pdf' ? 'PDF' : 'Web'}]
              </span>{' '}
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {source.title}
              </a>
              {source.note && <span className="text-gray-400 ml-1">- {source.note}</span>}
            </div>
          ))}
        </div>
      )}

      {/* ===== Figure modal ===== */}
      {modalFigure !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8"
          onClick={() => setModalFigure(null)}
          data-testid="figure-modal-overlay"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none z-10"
              onClick={() => setModalFigure(null)}
              data-testid="figure-modal-close"
            >
              ✕
            </button>
            <FigureRenderer figure={caseData.figures[modalFigure]} caseData={caseData} />
          </div>
        </div>
      )}
    </>
  )
}
