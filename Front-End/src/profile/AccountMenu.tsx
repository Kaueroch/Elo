import { useState, type FormEvent, type ReactNode } from 'react'
import { KeyRound, LogOut, Mail, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../shared/components/Toast'

type DialogAberto = null | 'perfil' | 'senha' | 'email'

function iniciais(nome: string | undefined): string {
  if (!nome) return 'U'
  return nome.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

function ErroBox({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null
  return (
    <div className="px-4 py-3 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20">
      {mensagem}
    </div>
  )
}

/** Mostra so a foto e o nome da pessoa. */
function PerfilDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-center">Perfil</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-2">
          <Avatar className="h-20 w-20 border border-border">
            <AvatarFallback className="bg-muted text-2xl text-muted-foreground">
              {iniciais(user?.name)}
            </AvatarFallback>
          </Avatar>
          <p className="text-lg font-semibold">{user?.name || 'Usuário'}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AlterarSenhaDialog({ onClose }: { onClose: () => void }) {
  const { updateProfile } = useAuth()
  const { showToast } = useToast()
  const [senhaAtual, setSenhaAtual] = useState('')
  const [senhaNova, setSenhaNova] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const salvar = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    if (!senhaAtual) {
      setErro('Informe a senha atual.')
      return
    }
    if (senhaNova.length < 8 || senhaNova.length > 15) {
      setErro('A nova senha deve ter entre 8 e 15 caracteres.')
      return
    }
    if (senhaNova !== confirma) {
      setErro('A confirmação não confere com a nova senha.')
      return
    }
    setIsSubmitting(true)
    try {
      const mensagemErro = await updateProfile({ senhaAtual, senhaNova })
      if (mensagemErro) {
        setErro(mensagemErro)
        return
      }
      showToast('Você trocou a senha.')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>Use de 8 a 15 caracteres.</DialogDescription>
        </DialogHeader>
        <form onSubmit={salvar} className="flex flex-col gap-4">
          <ErroBox mensagem={erro} />
          <div className="space-y-2">
            <Label htmlFor="conta-senha-atual">Senha atual</Label>
            <Input
              id="conta-senha-atual"
              type="password"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              placeholder="Sua senha atual"
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conta-senha-nova">Nova senha</Label>
            <Input
              id="conta-senha-nova"
              type="password"
              value={senhaNova}
              onChange={e => setSenhaNova(e.target.value)}
              placeholder="De 8 a 15 caracteres"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conta-senha-confirma">Confirmar nova senha</Label>
            <Input
              id="conta-senha-confirma"
              type="password"
              value={confirma}
              onChange={e => setConfirma(e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AlterarEmailDialog({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState(user?.email ?? '')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [erro, setErro] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const salvar = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    const novo = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novo)) {
      setErro('Informe um e-mail válido.')
      return
    }
    if (novo === user?.email) {
      setErro('Esse já é o seu e-mail atual.')
      return
    }
    if (!senhaAtual) {
      setErro('Informe a senha atual para confirmar.')
      return
    }
    setIsSubmitting(true)
    try {
      const mensagemErro = await updateProfile({ email: novo, senhaAtual })
      if (mensagemErro) {
        setErro(mensagemErro)
        return
      }
      showToast('Você trocou o e-mail.')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Alterar e-mail</DialogTitle>
          <DialogDescription>É com esse e-mail que você entra no sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={salvar} className="flex flex-col gap-4">
          <ErroBox mensagem={erro} />
          <div className="space-y-2">
            <Label htmlFor="conta-email">Novo e-mail</Label>
            <Input
              id="conta-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conta-email-senha">Senha atual</Label>
            <Input
              id="conta-email-senha"
              type="password"
              value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              placeholder="Confirme com a sua senha"
              autoComplete="current-password"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface AccountMenuProps {
  trigger: ReactNode;
  align?: 'start' | 'end' | 'center';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Menu da conta: Perfil (foto + nome), Alterar senha, Alterar e-mail e Sair.
 * O gatilho e passado por quem usa (avatar do header ou item da sidebar).
 */
export function AccountMenu({ trigger, align = 'end', side = 'bottom' }: AccountMenuProps) {
  const { user, logout } = useAuth()
  const [dialog, setDialog] = useState<DialogAberto>(null)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent align={align} side={side} className="w-56">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                {iniciais(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name || 'Usuário'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || ''}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialog('perfil')}>
            <User />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialog('senha')}>
            <KeyRound />
            Alterar senha
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialog('email')}>
            <Mail />
            Alterar e-mail
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={logout}>
            <LogOut />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {dialog === 'perfil' && <PerfilDialog onClose={() => setDialog(null)} />}
      {dialog === 'senha' && <AlterarSenhaDialog onClose={() => setDialog(null)} />}
      {dialog === 'email' && <AlterarEmailDialog onClose={() => setDialog(null)} />}
    </>
  )
}
