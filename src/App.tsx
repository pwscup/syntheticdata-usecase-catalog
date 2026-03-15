import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import CaseListPage from './pages/CaseListPage'
import CaseDetailPage from './pages/CaseDetailPage'
import CaseNewPage from './pages/CaseNewPage'
import CaseEditPage from './pages/CaseEditPage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'
import StatsPage from './pages/StatsPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CaseListPage />} />
          <Route path="/cases/new" element={<CaseNewPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/cases/:id/edit" element={<CaseEditPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
