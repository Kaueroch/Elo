import {
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useCrm } from '../crm/useCrm'
import type { Tab } from '../shared/types'

interface SiteHeaderProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  /** Sobrescreve o breadcrumb (ex.: passos do fluxo de troca). */
  title?: string
}

const tabLabels: Record<Tab, string> = {
  dashboard: 'Dashboard',
  clientes: 'Clientes',
  origens: 'Origens',
  agenda: 'Agenda',
  servicos: 'Serviços',
  configuracoes: 'Configurações',
}

export function SiteHeader({ activeTab, setActiveTab, title }: SiteHeaderProps) {
  const { user } = useAuth()
  const { totalGanho } = useCrm()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-md px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <SidebarSeparator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium">
                {title ?? tabLabels[activeTab]}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <span className="text-sm text-muted-foreground hidden sm:block">
          Total ganho:{' '}
          <span className="font-semibold text-lime-400/90">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGanho)}
          </span>
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl"
          onClick={() => setActiveTab('configuracoes')}
          aria-label="Configurações"
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          className="h-9 rounded-xl gap-2"
          onClick={() => setActiveTab('configuracoes')}
        >
          <Avatar className="h-7 w-7 border border-border">
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:block">
            {user?.name || 'Usuário'}
          </span>
        </Button>
      </div>
    </header>
  )
}
