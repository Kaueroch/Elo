import { useState } from 'react'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useCrm } from '../crm/useCrm'
import type { Tab } from '../shared/types'

interface SiteHeaderProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const tabLabels: Record<Tab, string> = {
  dashboard: 'Dashboard',
  clientes: 'Clientes',
  origens: 'Origens',
  configuracoes: 'Configurações',
}

export function SiteHeader({ activeTab, setActiveTab }: SiteHeaderProps) {
  const { user, logout } = useAuth()
  const { totalGanho } = useCrm()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
                {tabLabels[activeTab]}
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

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger
            render={
              <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8 border border-border cursor-pointer">
                  <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block">
                  {user?.name || 'Usuário'}
                </span>
              </button>
            }
          />
          <SheetContent side="right" className="gap-0 p-0">
            <SheetHeader className="border-b border-border p-6 pr-14">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <SheetTitle className="truncate">{user?.name || 'Usuário'}</SheetTitle>
                  <SheetDescription className="truncate">{user?.email || ''}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <SheetClose
              render={
                <button
                  onClick={() => setActiveTab('configuracoes')}
                  className="flex w-full items-center gap-4 border-b border-border p-4 text-left transition-colors hover:bg-muted/50"
                />
              }
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="flex-1 font-medium">Configurações</span>
            </SheetClose>

            <SheetFooter className="border-t border-border p-4">
              <Button
                onClick={logout}
                variant="destructive"
                className="h-12 w-full justify-start gap-3 rounded-xl bg-destructive px-3 text-white shadow-lg shadow-destructive/30 ring-1 ring-white/20 ring-inset transition-all hover:bg-destructive/90 hover:shadow-destructive/50 active:scale-[0.98]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <LogOut className="h-4 w-4" />
                </span>
                <span className="flex flex-col items-start gap-0.5 text-left">
                  <span className="text-sm font-semibold text-white">Sair da conta</span>
                  <span className="text-xs font-normal text-white/75">Você precisará entrar novamente</span>
                </span>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
