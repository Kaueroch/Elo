import { useState, type FormEvent } from 'react'
import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../shared/components/Toast'
import { authApi } from '../shared/services/authApi'
import type { ConfigMotivo } from '../shared/types'

interface RedefinirPageProps {
  motivo: ConfigMotivo
  trocaToken: string | null
  onDone: () => void
  onPedirNovoCodigo: () => void
}

export function RedefinirPage({ motivo, trocaToken, onDone, onPedirNovoCodigo }: RedefinirPageProps) {
  const { syncPerfil } = useAuth()
  const { showToast } = useToast()

  const [senhaNova, setSenhaNova] = useState('')
  const [senhaConfirma, setSenhaConfirma] = useState('')
  const [emailNovo, setEmailNovo] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  if (!trocaToken) {
    return (
      <div className="p-6 lg:p-8 max-w-md mx-auto w-full space-y-6">
        <Card>
          <CardContent className="p-5 sm:p-6 space-y-4 text-center">
            <h2 className="text-xl font-semibold tracking-tight">Sessão de troca vencida</h2>
            <p className="text-sm text-muted-foreground">
              Recarregar a página apaga o código conferido. Peça um novo para continuar.
            </p>
            <Button onClick={onPedirNovoCodigo} className="w-full">
              Pedir novo código
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const salvarSenha = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (senhaNova.length < 8 || senhaNova.length > 15) {
      setErro('A nova senha deve ter entre 8 e 15 caracteres.')
      return
    }
    if (senhaNova !== senhaConfirma) {
      setErro('As senhas não conferem.')
      return
    }
    setSalvando(true)
    try {
      await authApi.redefinirSenha(trocaToken, senhaNova)
      showToast('Você trocou a senha.')
      onDone()
    } catch (error) {
      setErro(error instanceof Error && error.message ? error.message : 'Erro de conexão com o servidor.')
    } finally {
      setSalvando(false)
    }
  }

  const salvarEmail = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!emailNovo.trim()) {
      setErro('Por favor preencha o novo e-mail.')
      return
    }
    setSalvando(true)
    try {
      const perfil = await authApi.redefinirEmail(trocaToken, emailNovo.trim())
      syncPerfil({ nome: perfil.nome, email: perfil.email })
      showToast('Você trocou o e-mail.')
      onDone()
    } catch (error) {
      setErro(error instanceof Error && error.message ? error.message : 'Erro de conexão com o servidor.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-md mx-auto w-full space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          {motivo === 'senha' ? (
            <KeyRound className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Mail className="w-5 h-5 text-muted-foreground" />
          )}
          {motivo === 'senha' ? 'Criar nova senha' : 'Trocar e-mail'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {motivo === 'senha'
            ? 'Você define a senha que vai usar no próximo login.'
            : 'Você passa a receber os avisos no novo endereço.'}
        </p>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6">
          {motivo === 'senha' ? (
            <form onSubmit={salvarSenha} className="space-y-4">
              {erro && (
                <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  {erro}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="nova-senha">Nova senha</Label>
                <Input
                  id="nova-senha"
                  type="password"
                  value={senhaNova}
                  onChange={(e) => setSenhaNova(e.target.value)}
                  placeholder="Mínimo 8 e máximo 15 caracteres"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirma-senha">Confirmar nova senha</Label>
                <Input
                  id="confirma-senha"
                  type="password"
                  value={senhaConfirma}
                  onChange={(e) => setSenhaConfirma(e.target.value)}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" disabled={salvando} className="w-full">
                {salvando ? 'Salvando...' : 'Salvar nova senha'}
              </Button>
            </form>
          ) : (
            <form onSubmit={salvarEmail} className="space-y-4">
              {erro && (
                <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  {erro}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="novo-email">Novo e-mail</Label>
                <Input
                  id="novo-email"
                  type="email"
                  value={emailNovo}
                  onChange={(e) => setEmailNovo(e.target.value)}
                  placeholder="voce@novo-email.com"
                  autoComplete="email"
                />
              </div>
              <Button type="submit" disabled={salvando} className="w-full">
                {salvando ? 'Salvando...' : 'Salvar novo e-mail'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={onPedirNovoCodigo} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Voltar e pedir outro código
      </Button>
    </div>
  )
}
