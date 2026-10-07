import { useState, type FormEvent } from 'react'
import { User, Tags, LogOut, Save, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../shared/components/Toast'
import type { Tab } from '../shared/types'

interface ProfilePageProps {
  setActiveTab?: (tab: Tab) => void
}

export function ProfilePage({ setActiveTab }: ProfilePageProps = {}) {
  const { user, logout, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [nome, setNome] = useState(user?.name ?? '')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [senhaNova, setSenhaNova] = useState('')
  const [erro, setErro] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Por favor preencha o nome corretamente.')
      return
    }
    if (senhaNova && !senhaAtual) {
      setErro('Informe a senha atual para trocar a senha.')
      return
    }
    if (senhaNova && (senhaNova.length < 8 || senhaNova.length > 15)) {
      setErro('A nova senha deve ter entre 8 e 15 caracteres.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload: { nome: string; senhaAtual?: string; senhaNova?: string } = { nome: nome.trim() }
      if (senhaNova) {
        payload.senhaAtual = senhaAtual
        payload.senhaNova = senhaNova
      }

      const mensagemErro = await updateProfile(payload)
      if (mensagemErro) {
        setErro(mensagemErro)
        return
      }

      setSenhaAtual('')
      setSenhaNova('')
      showToast('Perfil atualizado com sucesso.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-8">
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

      <div>
        <h3 className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-3 pl-1">Perfil</h3>
        <Card>
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSave} className="space-y-4">
              {erro && (
                <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  {erro}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="perfil-senha-atual" className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    Senha atual
                  </Label>
                  <Input
                    id="perfil-senha-atual"
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Deixe em branco para manter"
                    autoComplete="current-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perfil-senha-nova">Nova senha</Label>
                  <Input
                    id="perfil-senha-nova"
                    type="password"
                    value={senhaNova}
                    onChange={(e) => setSenhaNova(e.target.value)}
                    placeholder="Mínimo 8 e máximo 15 caracteres"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-3 pl-1">Conta</h3>
        <Card>
          <CardContent className="p-0">
            <button
              onClick={() => setActiveTab?.('origens')}
              className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors border-b border-border"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Tags className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left font-medium">Gerenciar Origens</span>
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors"
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
