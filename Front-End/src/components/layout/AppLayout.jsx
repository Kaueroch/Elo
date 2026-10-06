import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { Sidebar } from './Sidebar'
import { useSidebar } from './useSidebar'
import { Topbar } from './Topbar'

const TITULOS = {
  '/dashboard': 'Painel',
  '/clientes': 'Clientes',
  '/origens': 'Origens',
  '/configuracoes': 'Configuracoes',
  '/login': 'Entrar',
  '/registro': 'Criar conta',
}

/** Casca do app: sidebar fixa, topbar e o conteudo da rota. */
export function AppLayout() {
  const { autenticado } = useAuth()
  const { colapsada, aberta, alternarColapso, abrirMobile, fecharMobile } = useSidebar()
  const { pathname } = useLocation()
  const [total, setTotal] = useState(null)

  // O total billed fica na topbar, como no painel do Prisma.
  useEffect(() => {
    const onTotal = (evento) => setTotal(evento.detail ?? null)
    window.addEventListener('crm:total-clientes', onTotal)
    return () => window.removeEventListener('crm:total-clientes', onTotal)
  }, [])

  // Rota protegida: sem sessao nao existe painel para mostrar.
  if (!autenticado) return <Navigate to="/login" replace />

  return (
    <div className="app">
      <Sidebar colapsada={colapsada} aberta={aberta} onFecharMobile={fecharMobile} />

      <div className={`main${colapsada ? ' main--colapsada' : ''}`}>
        <Topbar
          titulo={TITULOS[pathname] || 'CRM Kauezao'}
          colapsada={colapsada}
          onAlternarColapso={alternarColapso}
          onAbrirMobile={abrirMobile}
        >
          {total !== null && (
            <span className="topbar__saldo">
              Clientes: <strong>{total}</strong>
            </span>
          )}
        </Topbar>

        <main className="conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
