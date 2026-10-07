import { useState, useEffect, type CSSProperties } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sparkles } from 'lucide-react'
import { AppSidebar } from './layout/AppSidebar'
import { SiteHeader } from './layout/SiteHeader'
import { AddClienteForm } from './clientes/components/AddClienteForm'
import { HomePage } from './dashboard/HomePage'
import { ClientesPage } from './clientes/ClientesPage'
import { OrigensPage } from './origens/OrigensPage'
import { ProfilePage } from './profile/ProfilePage'
import { AuthPage } from './auth/AuthPage'
import { LandingPage } from './landing/LandingPage'
import { CrmProvider } from './crm/CrmContext'
import { ClienteFormProvider } from './crm/ClienteFormContext'
import { ToastProvider } from './shared/components/Toast'
import { AuthProvider, useAuth } from './auth/AuthContext'
import type { Tab } from './shared/types'

const PUBLIC_ROUTES: Record<string, 'login' | 'registro'> = {
  '#/login': 'login',
  '#/registro': 'registro',
}

const TAB_HASHES: Record<Tab, string> = {
  dashboard: '#/dashboard',
  clientes: '#/clientes',
  origens: '#/origens',
  configuracoes: '#/configuracoes',
}

function getPublicRoute() {
  return PUBLIC_ROUTES[window.location.hash] ?? 'landing'
}

function getTabFromHash(): Tab {
  const entry = Object.entries(TAB_HASHES).find(([hash]) => hash === window.location.hash)
  return entry ? (entry[1] as Tab) : 'dashboard'
}

function PublicGate() {
  const { user } = useAuth()
  const [route, setRoute] = useState(getPublicRoute)

  useEffect(() => {
    const onChange = () => setRoute(getPublicRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const goToLanding = () => {
    setRoute('landing')
    history.pushState(null, '', window.location.pathname + window.location.search)
  }

  if (user) return <AuthenticatedApp />
  if (route === 'login') {
    return <AuthPage initialTab="login" onBack={goToLanding} />
  }
  if (route === 'registro') {
    return <AuthPage initialTab="register" onBack={goToLanding} />
  }
  return <LandingPage />
}

function AuthenticatedApp() {
  const { user } = useAuth()
  const [activeTab, setActiveTabState] = useState<Tab>(getTabFromHash)
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('crm:mostrar-boas-vindas') === 'true')

  // Mantem a aba e a URL em sincronia (#/clientes, #/origens, ...).
  useEffect(() => {
    const onChange = () => setActiveTabState(getTabFromHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab)
    if (window.location.hash !== TAB_HASHES[tab]) {
      window.location.hash = TAB_HASHES[tab]
    }
  }

  const closeWelcome = () => {
    localStorage.removeItem('crm:mostrar-boas-vindas')
    setShowWelcome(false)
  }

  return (
    <>
      <TooltipProvider>
      <SidebarProvider defaultOpen={true} style={{ '--sidebar-width': '13.5rem' } as CSSProperties}>
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <SidebarInset>
          <SiteHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 flex flex-col overflow-auto relative">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-lime-400/[0.05] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
            <div className="flex-1 relative z-10">
              {activeTab === 'dashboard' && <HomePage setActiveTab={setActiveTab} />}
              {activeTab === 'clientes' && <ClientesPage />}
              {activeTab === 'origens' && <OrigensPage />}
              {activeTab === 'configuracoes' && <ProfilePage setActiveTab={setActiveTab} />}
            </div>
          </div>
        </SidebarInset>
        <AddClienteForm />
      </SidebarProvider>
    </TooltipProvider>

      <Dialog open={showWelcome} onOpenChange={(open) => !open && closeWelcome()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Bem-vindo(a), {user?.name || 'usuário'}!
            </DialogTitle>
            <DialogDescription className="pt-1">
              Que bom ter você aqui. Aproveite o seu painel de clientes!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full sm:w-auto" onClick={closeWelcome}>
              Começar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CrmProvider>
        <ClienteFormProvider>
          <ToastProvider>
            <PublicGate />
          </ToastProvider>
        </ClienteFormProvider>
      </CrmProvider>
    </AuthProvider>
  )
}
