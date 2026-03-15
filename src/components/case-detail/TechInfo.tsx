interface TechInfoProps {
  privacy_enhancement_method: string
  safety_assurance_method: string
  utility_evaluation_method: string
}

function TechValue({ value }: { value: string }) {
  if (value === '調査中') {
    return (
      <span className="inline-block rounded bg-gray-200 px-2 py-0.5 text-sm text-gray-600">
        調査中
      </span>
    )
  }
  return <span>{value}</span>
}

export default function TechInfo({
  privacy_enhancement_method,
  safety_assurance_method,
  utility_evaluation_method,
}: TechInfoProps) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">技術情報</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <dt className="font-medium text-gray-600">プライバシー強化手法</dt>
        <dd><TechValue value={privacy_enhancement_method} /></dd>
        <dt className="font-medium text-gray-600">安全性保証手法</dt>
        <dd><TechValue value={safety_assurance_method} /></dd>
        <dt className="font-medium text-gray-600">有用性評価手法</dt>
        <dd><TechValue value={utility_evaluation_method} /></dd>
      </dl>
    </section>
  )
}
