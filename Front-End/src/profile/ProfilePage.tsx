import { useState, type FormEvent } from 'react'
import {
  User,
  Tags,
  LogOut,
  Save,
  ShieldCheck,
  Download,
  Trash2,
  KeyRound,
  Mail,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
            onClick={exportar}
            className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors rounded-b-2xl"
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
              onClick={logout}
              className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors rounded-2xl"
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
      {section === 'conta' && <ContaSection setActiveTab={setActiveTab} />}
    </div>
  )
}
