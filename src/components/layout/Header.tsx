import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold hover:opacity-90">
          合成データ ユースケースカタログ
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className="hover:underline">一覧</Link>
          <Link to="/stats" className="hover:underline">統計</Link>
          <Link to="/cases/new" className="hover:underline">新規作成</Link>
          <Link to="/settings" className="hover:underline">設定</Link>
          <Link to="/about" className="hover:underline">About</Link>
        </nav>
      </div>
    </header>
  )
}
