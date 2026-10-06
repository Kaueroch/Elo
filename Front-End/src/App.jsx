import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { useAuth } from './context/useAuth'
import { ClientesPage } from './pages/ClientesPage'
import { ConfiguracoesPage } from './pages/ConfiguracoesPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { OrigensPage } from './pages/OrigensPage'
import { RegistroPage } from './pages/RegistroPage'

/** "/" e a vitrine para quem nao logou; quem ja tem sessao cai no painel. */
function Inicio() {
  const { autenticado } = useAuth()
  return autenticado ? <Navigate to="/dashboard" replace /> : <LandingPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      {/* O AppLayout so renderiza para usuario autenticado (ver AppLayout.jsx). */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/origens" element={<OrigensPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
