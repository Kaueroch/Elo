import { useState, type FormEvent } from 'react'
import {
  User,
  Tags,
  LogOut,
  Save,
  ShieldCheck,
  Palette,
  Bell,
  Wallet,
  Download,
  Trash2,
  Moon,
  Sun,
  Check,
  KeyRound,
  Mail,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../auth/AuthContext'
import { useCrm } from '../crm/useCrm'
import { useToast } from '../shared/components/Toast'
import { origemNomeDoCliente } from '../shared/constants'
import { authApi } from '../shared/services/authApi'
import type { ConfigMotivo, ConfigSection, Tab } from '../shared/types'

interface ProfilePageProps {
  setActiveTab?: (tab: Tab) => void
  section?: ConfigSection
  onTrocaSolicitada?: (motivo: ConfigMotivo) => void
}

// ---------------------------------------------------------------------------
// Tela: Perfil (nome troca direto; e-mail e senha pedem código)
// ---------------------------------------------------------------------------

function PerfilSection({ onTrocaSolicitada }: { onTrocaSolicitada?: (motivo: ConfigMotivo) => void }) {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [nome, setNome] = useState(user?.name ?? '')
  const [erroNome, setErroNome] = useState('')
  const [salvandoNome, setSalvandoNome] = useState(false)

  const [pedindoCodigo, setPedindoCodigo] = useState<ConfigMotivo | null>(null)
  const [erroCodigo, setErroCodigo] = useState('')

  const salvarNome = async (e: FormEvent) => {
    e.preventDefault()
    setErroNome('')
    if (!nome.trim()) {
      setErroNome('Por favor preencha o nome corretamente.')
      return
    }
    setSalvandoNome(true)
    try {
      const mensagemErro = await updateProfile({ nome: nome.trim() })
      if (mensagemErro) {
        setErroNome(mensagemErro)
        return
      }
      showToast('Você atualizou o nome.')
    } finally {
      setSalvandoNome(false)
    }
  }

  const pedirCodigo = async (motivo: ConfigMotivo) => {
    setErroCodigo('')
    setPedindoCodigo(motivo)
    try {
      await authApi.solicitarCodigo(motivo)
      onTrocaSolicitada?.(motivo)
    } catch (error) {
      setErroCodigo(error instanceof Error && error.message ? error.message : 'Erro de conexão com o servidor.')
    } finally {
      setPedindoCodigo(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 border-2 border-border">
          <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{user?.name || 'Usuário'}</h2>
          <p className="text-muted-foreground text-sm">{user?.email || ''}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={salvarNome} className="space-y-4">
            {erroNome && (
              <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                {erroNome}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="perfil-nome" className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                Nome
              </Label>
              <Input
                id="perfil-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={salvandoNome}>
                <Save className="mr-2 h-4 w-4" />
                Salvar nome
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              Acesso
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              E-mail e senha só trocam com um código enviado para você.
            </p>
          </div>

          {erroCodigo && (
            <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              {erroCodigo}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">E-mail</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => pedirCodigo('email')}
              disabled={pedindoCodigo !== null}
            >
              <Mail className="mr-2 h-4 w-4" />
              {pedindoCodigo === 'email' ? 'Enviando...' : 'Trocar e-mail'}
            </Button>
          </div>

          <div className="flex items-center gap-4 border-t border-border pt-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Senha</p>
              <p className="text-sm text-muted-foreground">••••••••</p>
            </div>
            <Button
              variant="outline"
              onClick={() => pedirCodigo('senha')}
              disabled={pedindoCodigo !== null}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              {pedindoCodigo === 'senha' ? 'Enviando...' : 'Trocar senha'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tela: Aparência (scaffold — TODO(dev): aplicar tema de verdade)
// ---------------------------------------------------------------------------

const ACCENTS = [
  { id: 'lime', label: 'Lima', className: 'bg-lime-400' },
  { id: 'emerald', label: 'Esmeralda', className: 'bg-emerald-400' },
  { id: 'sky', label: 'Céu', className: 'bg-sky-400' },
  { id: 'violet', label: 'Violeta', className: 'bg-violet-400' },
  { id: 'orange', label: 'Laranja', className: 'bg-orange-400' },
] as const

function AparenciaSection() {
  const [accent, setAccent] = useState<string>(
    () => localStorage.getItem('crm:accent') ?? 'lime',
  )
  const { showToast } = useToast()

  const escolher = (id: string) => {
    setAccent(id)
    localStorage.setItem('crm:accent', id)
    // TODO(dev): aplicar a cor de destaque no CSS (variável --accent) quando for implementar.
    showToast('Cor salva.')
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Aparência</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Você ajusta o visual do Elo neste navegador.
        </p>
      </div>
      <Card>
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              Tema
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Você usa o Elo no modo escuro.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-ring bg-muted/40 p-4 text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 border border-zinc-800">
                <Moon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-medium">Escuro</span>
                <span className="block text-xs text-muted-foreground">Ativo</span>
              </span>
              <Check className="ml-auto h-4 w-4 text-lime-400" />
            </button>
            <button
              type="button"
              disabled
              title="Em breve"
              className="flex items-center gap-3 rounded-xl border border-border p-4 text-left opacity-50 cursor-not-allowed"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-zinc-200">
                <Sun className="h-4 w-4 text-zinc-500" />
              </span>
              <span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  Claro
                  <Badge variant="secondary" className="h-4 px-1 text-[9px] uppercase">
                    Em breve
                  </Badge>
                </span>
                <span className="block text-xs text-muted-foreground">Indisponível</span>
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-sm">Cor de destaque</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Você escolhe a cor dos botões e indicadores.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => escolher(a.id)}
                title={a.label}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                  accent === a.id
                    ? 'border-ring bg-muted/60'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <span className={`h-4 w-4 rounded-full ${a.className}`} />
                {a.label}
                {accent === a.id && <Check className="h-3.5 w-3.5 text-lime-400" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tela: Notificações (scaffold em localStorage — TODO(dev): push/backend)
// ---------------------------------------------------------------------------

interface Prefs {
  lembretesAgenda: boolean
  resumoSemanal: boolean
  novidades: boolean
}

const NOTIF_KEY = 'crm:notifs'

function carregarPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(NOTIF_KEY)
    if (raw) return { lembretesAgenda: true, resumoSemanal: true, novidades: false, ...JSON.parse(raw) }
  } catch {
    // ignora
  }
  return { lembretesAgenda: true, resumoSemanal: true, novidades: false }
}

function Toggle({
  ativo,
  onMudar,
  label,
}: {
  ativo: boolean
  onMudar: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      aria-label={label}
      onClick={onMudar}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 ${
        ativo ? 'bg-lime-400 border-lime-400' : 'bg-muted border-border'
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all ${
          ativo ? 'left-[1.375rem] bg-zinc-950' : 'left-1 bg-muted-foreground'
        }`}
      />
    </button>
  )
}

function NotificacoesSection() {
  const [prefs, setPrefs] = useState<Prefs>(carregarPrefs)
  const { showToast } = useToast()

  const mudar = (chave: keyof Prefs) => {
    setPrefs((atual) => {
      const proximo = { ...atual, [chave]: !atual[chave] }
      localStorage.setItem(NOTIF_KEY, JSON.stringify(proximo))
      // TODO(dev): sincronizar com o backend / push quando existir.
      return proximo
    })
    showToast('Você salvou a preferência neste navegador.')
  }

  const itens: { chave: keyof Prefs; titulo: string; desc: string; breve?: boolean }[] = [
    {
      chave: 'lembretesAgenda',
      titulo: 'Lembretes da agenda',
      desc: 'Você recebe aviso antes dos compromissos marcados.',
    },
    {
      chave: 'resumoSemanal',
      titulo: 'Resumo semanal',
      desc: 'Você recebe clientes e faturamento da semana.',
      breve: true,
    },
    {
      chave: 'novidades',
      titulo: 'Novidades do Elo',
      desc: 'Você fica sabendo quando sai função nova.',
      breve: true,
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Notificações</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Você guarda suas escolhas neste navegador.
        </p>
      </div>
      <Card>
        <CardContent className="p-5 sm:p-6">
          <h4 className="font-semibold text-sm flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-muted-foreground" />
            Avisos
          </h4>
          <div className="divide-y divide-border">
            {itens.map((item) => (
              <div key={item.chave} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    {item.titulo}
                    {item.breve && (
                      <Badge variant="secondary" className="h-4 px-1 text-[9px] uppercase">
                        Em breve
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Toggle ativo={prefs[item.chave]} onMudar={() => mudar(item.chave)} label={item.titulo} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tela: Conta (origens, exportar, perigo)
// ---------------------------------------------------------------------------

function ContaSection({ setActiveTab }: { setActiveTab?: (tab: Tab) => void }) {
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
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Conta</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Você gerencia seus dados e sua sessão.
        </p>
      </div>
      <Card>
        <CardContent className="p-0">
          <button
            onClick={() => setActiveTab?.('origens')}
            className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors border-b border-border rounded-t-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Tags className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left">
              <span className="block font-medium">Gerenciar Origens</span>
              <span className="block text-sm text-muted-foreground">Você vê de onde vêm seus clientes</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab?.('agenda')}
            className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors border-b border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left">
              <span className="block font-medium">
                Meus dados
                <Badge variant="secondary" className="ml-2 h-4 px-1 text-[9px] uppercase">
                  {clientes.length} clientes
                </Badge>
              </span>
              <span className="block text-sm text-muted-foreground">{user?.email || ''}</span>
            </span>
          </button>
          <button
            onClick={exportar}
            className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left">
              <span className="block font-medium">Exportar meus dados</span>
              <span className="block text-sm text-muted-foreground">Você baixa clientes em CSV</span>
            </span>
          </button>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-3 pl-1">
          Zona de atenção
        </h3>
        <Card className="border-red-500/20">
          <CardContent className="p-0">
            <button
              onClick={limparLocais}
              className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors border-b border-border rounded-t-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <span className="flex-1 text-left">
                <span className="block font-medium">Apagar dados locais</span>
                <span className="block text-sm text-muted-foreground">
                  Você apaga Agenda e Serviços deste navegador
                </span>
              </span>
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors rounded-b-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span className="flex-1 text-left font-medium text-destructive">Sair</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Página (uma tela por rota, sem barra de abas)
// ---------------------------------------------------------------------------

export function ProfilePage({ setActiveTab, section = 'perfil', onTrocaSolicitada }: ProfilePageProps = {}) {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6">
      {section === 'perfil' && <PerfilSection onTrocaSolicitada={onTrocaSolicitada} />}
      {section === 'aparencia' && <AparenciaSection />}
      {section === 'notificacoes' && <NotificacoesSection />}
      {section === 'conta' && <ContaSection setActiveTab={setActiveTab} />}
    </div>
  )
}
