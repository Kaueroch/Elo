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
import { VerificarCodigoPage } from './profile/VerificarCodigoPage'
import { RedefinirPage } from './profile/RedefinirPage'
import { AuthPage } from './auth/AuthPage'
import { NotFoundPage } from './notfound/NotFoundPage'
import { CrmProvider } from './crm/CrmContext'
import { ClienteFormProvider } from './crm/ClienteFormContext'
import { ToastProvider } from './shared/components/Toast'
import { AuthProvider, useAuth } from './auth/AuthContext'
import type { Tab, ConfigSection, ConfigMotivo } from './shared/types'

const PUBLIC_ROUTES: Record<string, 'login' | 'registro'> = {
  '/login': 'login',
  '/registro': 'registro',
}

const TAB_PATHS: Record<Tab, string> = {
  dashboard: '/dashboard',
  clientes: '/clientes',
  origens: '/origens',
  configuracoes: '/configuracoes/perfil',
}

/** Uma tela por seção das configurações (sem barra de abas). */
const CONFIG_SECTION_PATHS: Record<ConfigSection, string> = {
  perfil: '/configuracoes/perfil',
  conta: '/configuracoes/conta',
}

type ConfigFlow = { screen: 'verificar' | 'redefinir'; motivo: ConfigMotivo } | null

function motivoDaUrl(): ConfigMotivo {
  return new URLSearchParams(window.location.search).get('motivo') === 'email' ? 'email' : 'senha'
}

/** Seção e passo do fluxo a partir da URL (padrão: perfil). */
function parseConfigUrl(): { section: ConfigSection; flow: ConfigFlow } {
  const path = currentPath()
  const motivo = motivoDaUrl()
  if (path === '/configuracoes/verificar') return { section: 'perfil', flow: { screen: 'verificar', motivo } }
  if (path === '/configuracoes/redefinir') return { section: 'perfil', flow: { screen: 'redefinir', motivo } }
  const entry = (Object.entries(CONFIG_SECTION_PATHS) as [ConfigSection, string][]).find(([, rota]) => rota === path)
  if (entry) return { section: entry[0], flow: null }
  return { section: 'perfil', flow: null }
}

/** URL canônica do estado atual das configurações (para corrigir barra/F5). */
function configUrl(section: ConfigSection, flow: ConfigFlow): string {
  if (flow) return `/configuracoes/${flow.screen}?motivo=${flow.motivo}`
  return CONFIG_SECTION_PATHS[section]
}

/** Caminho atual da URL sem barra no final ("/clientes/" vira "/clientes"). */
function currentPath(): string {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '' ? '/' : path
}

function isTabPath(path: string): boolean {
  if ((Object.values(TAB_PATHS) as string[]).includes(path)) return true
  return path === '/configuracoes' || path.startsWith('/configuracoes/')
}

function getPublicRoute() {
  return PUBLIC_ROUTES[currentPath()] ?? 'login'
}

/**
 * Aba indicada pela URL. Tudo sob /configuracoes/* cai na aba de
 * configurações (a seção exata sai de parseConfigUrl).
 */
function getTabFromPath(): Tab {
  const path = currentPath()
  if (path === '/configuracoes' || path.startsWith('/configuracoes/')) return 'configuracoes'
  const entry = Object.entries(TAB_PATHS).find(([, rota]) => rota === path)
  return entry ? (entry[0] as Tab) : 'dashboard'
}

function PublicGate() {
  const { user, isLoading } = useAuth()
  const [route, setRoute] = useState(getPublicRoute)

  useEffect(() => {
    const onChange = () => setRoute(getPublicRoute())
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  // Sem login, qualquer caminho que nao seja /login ou /registro vira /login.
  useEffect(() => {
    if (!user && !PUBLIC_ROUTES[currentPath()]) {
      history.replaceState(null, '', '/login')
    }
  }, [route, user])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
      </div>
    )
  }
  if (user) return <AuthenticatedApp />
  if (route === 'registro') {
    return <AuthPage initialTab="register" />
  }
  return <AuthPage initialTab="login" />
}

function AuthenticatedApp() {
  const { user } = useAuth()
  const [activeTab, setActiveTabState] = useState<Tab>(getTabFromPath)
  const [configSection, setConfigSection] = useState<ConfigSection>(() => parseConfigUrl().section)
  const [flow, setFlow] = useState<ConfigFlow>(() => parseConfigUrl().flow)
  // Token de troca vive só em memória: F5 apaga e o fluxo volta ao verificar.
  const [trocaToken, setTrocaToken] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('crm:mostrar-boas-vindas') === 'true')

  // Mantem aba, seção e fluxo em sincronia com a URL (voltar do navegador, F5).
  useEffect(() => {
    const onChange = () => {
      const tab = getTabFromPath()
      setActiveTabState(tab)
      if (tab === 'configuracoes') {
        const parsed = parseConfigUrl()
        setConfigSection(parsed.section)
        setFlow(parsed.flow)
        const canonica = configUrl(parsed.section, parsed.flow)
        if (window.location.pathname + window.location.search !== canonica) {
          history.replaceState(null, '', canonica)
        }
      }
    }
    onChange()
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  // Sem token de troca (F5), redefinir volta para o verificar.
  useEffect(() => {
    if (activeTab === 'configuracoes' && flow?.screen === 'redefinir' && !trocaToken) {
      const verificar: ConfigFlow = { screen: 'verificar', motivo: flow.motivo }
      setFlow(verificar)
      history.replaceState(null, '', configUrl(configSection, verificar))
    }
  }, [activeTab, flow, trocaToken, configSection])

  const goConfigSection = (section: ConfigSection) => {
    setActiveTabState('configuracoes')
    setConfigSection(section)
    setFlow(null)
    setTrocaToken(null)
    const rota = CONFIG_SECTION_PATHS[section]
    if (window.location.pathname + window.location.search !== rota) {
      history.pushState(null, '', rota)
    }
  }

  const setActiveTab = (tab: Tab) => {
    if (tab === 'configuracoes') {
      goConfigSection('perfil')
      return
    }
    setActiveTabState(tab)
    const rota = TAB_PATHS[tab]
    if (currentPath() !== rota) {
      history.pushState(null, '', rota)
    }
  }

  /** Código pedido na tela de perfil: entra no passo verificar. */
  const handleTrocaSolicitada = (motivo: ConfigMotivo) => {
    const proximo: ConfigFlow = { screen: 'verificar', motivo }
    setActiveTabState('configuracoes')
    setFlow(proximo)
    history.pushState(null, '', configUrl(configSection, proximo))
  }

  /** Código conferido: guarda o token e entra no passo redefinir. */
  const handleVerified = (token: string) => {
    if (!flow) return
    const proximo: ConfigFlow = { screen: 'redefinir', motivo: flow.motivo }
    setTrocaToken(token)
    setFlow(proximo)
    history.pushState(null, '', configUrl(configSection, proximo))
  }

  /** Troca concluída: limpa o fluxo e volta ao perfil. */
  const handleTrocaDone = () => {
    setTrocaToken(null)
    goConfigSection('perfil')
  }

  const headerTitle =
    activeTab === 'configuracoes' && flow?.screen === 'verificar'
      ? 'Verificar código'
      : activeTab === 'configuracoes' && flow?.screen === 'redefinir'
        ? flow.motivo === 'senha' ? 'Criar nova senha' : 'Trocar e-mail'
        : undefined

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
          configSection={configSection}
          onConfigSection={goConfigSection}
        />
        <SidebarInset>
          <SiteHeader activeTab={activeTab} setActiveTab={setActiveTab} title={headerTitle} />
          <div className="flex-1 flex flex-col overflow-auto relative">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/[0.05] blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
            <div className="flex-1 relative z-10">
              {!isTabPath(currentPath()) ? (
                <NotFoundPage
                  onHome={() => {
                    setActiveTab('dashboard')
                  }}
                />
              ) : (
                <>
                  {activeTab === 'dashboard' && <HomePage setActiveTab={setActiveTab} />}
                  {activeTab === 'clientes' && <ClientesPage />}
                  {activeTab === 'origens' && <OrigensPage />}
                  {activeTab === 'configuracoes' && flow?.screen === 'verificar' && (
                    <VerificarCodigoPage
                      motivo={flow.motivo}
                      email={user?.email ?? ''}
                      onBack={() => goConfigSection('perfil')}
                      onVerified={handleVerified}
                    />
                  )}
                  {activeTab === 'configuracoes' && flow?.screen === 'redefinir' && trocaToken && (
                    <RedefinirPage
                      motivo={flow.motivo}
                      trocaToken={trocaToken}
                      onDone={handleTrocaDone}
                      onPedirNovoCodigo={() => handleTrocaSolicitada(flow.motivo)}
                    />
                  )}
                  {activeTab === 'configuracoes' && !flow && (
                    <ProfilePage setActiveTab={setActiveTab} section={configSection} onTrocaSolicitada={handleTrocaSolicitada} />
                  )}
                </>
              )}
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
              <Sparkles className="w-5 h-5 text-emerald-400" />
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
