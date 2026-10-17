import { useEffect, useState } from 'react'
import { Home, Users, Tags, Settings, LogOut, Wallet, ChevronDown, User, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import type { Tab, ConfigSection } from '../shared/types'
import { useAuth } from '../auth/AuthContext'

interface AppSidebarProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  configSection: ConfigSection
  onConfigSection: (section: ConfigSection) => void
}

const mainItems = [
  { tab: 'dashboard' as Tab, label: 'Painel', icon: Home, badge: null as string | null },
  { tab: 'clientes' as Tab, label: 'Clientes', icon: Users, badge: null },
  { tab: 'origens' as Tab, label: 'Origens', icon: Tags, badge: null },
]

const configItems: { id: ConfigSection; label: string; icon: typeof User }[] = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'conta', label: 'Conta', icon: ShieldCheck },
]

const emBreveItems = [
  { label: 'Contas a pagar', desc: 'Vencimentos e dias restantes', icon: Wallet },
]

export function AppSidebar({ activeTab, setActiveTab, configSection, onConfigSection }: AppSidebarProps) {
  const { logout } = useAuth()
  const [configOpen, setConfigOpen] = useState(activeTab === 'configuracoes')

  useEffect(() => {
    if (activeTab === 'configuracoes') setConfigOpen(true)
  }, [activeTab])

  const toggleConfig = () => {
    if (activeTab !== 'configuracoes') {
      onConfigSection(configSection)
      setConfigOpen(true)
    } else {
      setConfigOpen((aberto) => !aberto)
    }
  }

  const goToSection = (section: ConfigSection) => {
    onConfigSection(section)
    setConfigOpen(true)
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-bold">
            E
          </div>
          <span className="text-base font-bold tracking-tight truncate group-data-[collapsible=icon]:hidden">
            Elo
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.tab}>
                  <SidebarMenuButton
                    isActive={activeTab === item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span className="flex-1">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'configuracoes'}
                  onClick={toggleConfig}
                  tooltip="Configurações"
                  aria-expanded={configOpen}
                >
                  <Settings />
                  <span className="flex-1">Configurações</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none group-data-[collapsible=icon]:hidden ${configOpen ? 'rotate-180' : ''}`}
                  />
                </SidebarMenuButton>
                <div
                  className={`grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out motion-reduce:transition-none group-data-[collapsible=icon]:hidden ${configOpen ? 'grid-rows-[1fr] opacity-100 visible' : 'grid-rows-[0fr] opacity-0 invisible'}`}
                >
                  <div className="overflow-hidden min-h-0">
                  <SidebarMenuSub>
                    {configItems.map((item) => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton
                          isActive={activeTab === 'configuracoes' && configSection === item.id}
                          onClick={() => goToSection(item.id)}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Em breve</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {emBreveItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    disabled
                    aria-disabled
                    tooltip={`${item.label} — ${item.desc}`}
                    className="cursor-not-allowed opacity-55"
                  >
                    <item.icon className="opacity-70" />
                    <span className="flex-1">{item.label}</span>
                    <Badge
                      variant="outline"
                      className="h-4 px-1 text-[9px] font-medium tracking-wide text-muted-foreground border-border bg-transparent group-data-[collapsible=icon]:hidden"
                    >
                      Em breve
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <p className="px-3 pb-1 pt-3 text-xs leading-relaxed text-muted-foreground">
              Estamos preparando contas a pagar com alertas. Elas aparecem aqui primeiro.
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              tooltip="Sair"
              className="font-medium text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
