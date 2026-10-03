import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ClientesPage } from './pages/ClientesPage'
import { LoginPage } from './pages/LoginPage'
import { RegistroPage } from './pages/RegistroPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/clientes" replace />} />
        <Route path="/clientes" element={<ClientesPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route path="*" element={<Navigate to="/clientes" replace />} />
    </Routes>
  )
}