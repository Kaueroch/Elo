import { Tags, Palette, Bell, Download, CalendarDays, Briefcase, Settings, ChevronRight, Wrench, SlidersHorizontal, FileText, BarChart2, Zap, FolderOpen, Key, Shield, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '../auth/AuthContext'
import { useCrm } from '../crm/useCrm'
import { useToast } from '../shared/components/Toast'
import { origemNomeDoCliente } from '../shared/constants'
import type { Tab } from '../shared/types'

interface SettingsDropdownProps {
  setActiveTab: (tab: Tab) => void
}

export function SettingsDropdown({ setActiveTab }: SettingsDropdownProps) {
  const { user, logout } = useAuth()
  const { clientes } = useCrm()
  const { showToast } = useToast()

  const exportar = () => {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const linhas = clientes.map((c) =>
      [c.nome, c.data, origemNomeDoCliente(c.conhecidoDaOnde), String(c.valorCobrado ?? 0).replace('.', ','), c.trabalhoFeito]
        .map(esc)
        .join(';'),
    )
    const csv = '﻿' + [['nome', 'data', 'origem', 'valor_cobrado', 'trabalho_feito'].join(';'), ...linhas].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'meus-dados-elo.csv'
    a.click()
    URL.revokeObjectURL(a.href)
    showToast('Você exportou em CSV.')
  }

  const limparLocais = () => {
    if (!window.confirm('Apagar os dados locais de Agenda e Serviços salvos neste navegador?')) return
    localStorage.removeItem('crm:agenda')
    localStorage.removeItem('crm:servicos')
    showToast('Você apagou os dados locais.')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" aria-label="Configurações rápidas">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-64 min-w-[240px] z-[100]" forceMount>
        <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Ações rápidas</span>
          <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setActiveTab('origens')}
          className="flex items-center gap-3"
          inset
        >
          <Tags className="h-4 w-4 text-muted-foreground" />
          <span>Gerenciar Origens</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setActiveTab('configuracoes')}
          className="flex items-center gap-3"
          inset
        >
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span>Aparência e Tema</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setActiveTab('configuracoes')}
          className="flex items-center gap-3"
          inset
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span>Notificações</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={exportar} className="flex items-center gap-3" inset>
          <Download className="h-4 w-4 text-muted-foreground" />
          <span>Exportar meus dados (CSV)</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Recursos Beta</span>
          <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => setActiveTab('agenda')}
          className="flex items-center gap-3"
          inset
        >
          <CalendarDays className="h-4 w-4 text-sky-400" />
          <span className="flex items-center gap-2">
            Agenda
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-sky-400/10 text-sky-400 border border-sky-400/20">
              Beta
            </span>
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setActiveTab('servicos')}
          className="flex items-center gap-3"
          inset
        >
          <Briefcase className="h-4 w-4 text-violet-400" />
          <span className="flex items-center gap-2">
            Serviços
            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-violet-400/10 text-violet-400 border border-violet-400/20">
              Beta
            </span>
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setActiveTab('configuracoes')}
          className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
          inset
        >
          <Settings className="h-4 w-4" />
          <span>Todas as configurações</span>
          <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Ferramentas e Utilitários</span>
          <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
        </DropdownMenuLabel>

        <DropdownMenuItem className="flex items-center gap-3 text-muted-foreground" inset>
          <Wrench className="h-4 w-4" />
          <span>Importar dados (CSV/Excel)</span>
          <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-[9px] uppercase">Em breve</Badge>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 text-muted-foreground" inset>
          <FileText className="h-4 w-4" />
          <span>Gerar relatório personalizado</span>
          <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-[9px] uppercase">Em breve</Badge>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 text-muted-foreground" inset>
          <BarChart2 className="h-4 w-4" />
          <span>Dashboard avançado</span>
          <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-[9px] uppercase">Em breve</Badge>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 text-muted-foreground" inset>
          <Zap className="h-4 w-4" />
          <span>Ações em lote (clientes)</span>
          <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-[9px] uppercase">Em breve</Badge>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Preferências Rápidas</span>
          <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
        </DropdownMenuLabel>

        <DropdownMenuItem className="flex items-center gap-3" inset>
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span>Campos personalizados</span>
          <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3" inset>
          <Key className="h-4 w-4 text-muted-foreground" />
          <span>API & Tokens de acesso</span>
          <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3" inset>
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>Permissões e Roles</span>
          <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3" inset>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
          <span>Modelos de documento</span>
          <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Em desenvolvimento</span>
          <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
        </DropdownMenuLabel>

        <DropdownMenuItem className="flex items-center gap-3 text-muted-foreground" inset>
          <HelpCircle className="h-4 w-4" />
          <span>Central de ajuda / Docs</span>
          <Badge variant="outline" className="ml-auto h-4 px-1.5 text-[9px] uppercase">Planeado</Badge>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 text-muted-foreground" inset>
          <Badge className="h-4 w-4" />
          <span>Programa de indicação</span>
          <Badge variant="outline" className="ml-auto h-4 px-1.5 text-[9px] uppercase">Planeado</Badge>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 text-muted-foreground" inset>
          <Settings className="h-4 w-4" />
          <span>Automações / Workflows</span>
          <Badge variant="outline" className="ml-auto h-4 px-1.5 text-[9px] uppercase">Planeado</Badge>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={limparLocais} className="flex items-center gap-3" inset>
          <span className="flex-1">Apagar dados locais</span>
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive" onClick={logout} className="flex items-center gap-3" inset>
          <span className="flex-1">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}