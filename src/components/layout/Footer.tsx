import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-center py-4 text-sm border-t border-gray-200">
      <p className="text-gray-400 text-xs mb-1">
        掲載情報は正確性を保証するものではありません。
        <Link to="/about" className="text-blue-500 hover:text-blue-600 underline underline-offset-2 ml-0.5">
          免責事項
        </Link>
      </p>
      <p className="text-gray-400 text-xs">
        &copy; 2026 合成データ ユースケースカタログ
      </p>
    </footer>
  )
}
