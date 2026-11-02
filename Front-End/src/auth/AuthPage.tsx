import { useState, useMemo, useEffect, type FormEvent } from 'react'
import { Wallet, Eye, EyeOff, AlertCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useAuth } from './AuthContext'

type Modo = 'login' | 'register'

interface AuthPageProps {
  initialTab?: Modo
}

const ROTA: Record<Modo, string> = { login: '/login', register: '/registro' }

const inputClass =
  'w-full px-5 py-3 rounded-xl bg-white/[0.07] text-white placeholder-zinc-500 text-sm border border-white/5 ' +
  'transition-[border-color,box-shadow] focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent'

const emailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export function AuthPage({ initialTab = 'login' }: AuthPageProps) {
  const { login, register } = useAuth()
  const reduceMotion = useReducedMotion()

  const [modo, setModo] = useState<Modo>(initialTab)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Voltar/avançar do navegador troca entre /login e /registro.
  useEffect(() => {
    setModo(initialTab)
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
  }, [initialTab])

  const trocarModo = (novo: Modo) => {
    setModo(novo)
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
    if (window.location.pathname !== ROTA[novo]) history.pushState(null, '', ROTA[novo])
  }

  const passwordStrength = useMemo(() => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    const labels = ['', 'Fraca', 'Média', 'Boa', 'Forte', 'Segura']
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-400', 'bg-emerald-500']
    return { label: labels[score], color: colors[score], width: `${(score / 5) * 100}%` }
  }, [password])

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : null

  const handleLogin = async () => {
    if (!email || !password) return setError('Preencha e-mail e senha.')
    if (!emailValido(email)) return setError('Digite um e-mail válido.')
    setIsSubmitting(true)
    try {
      const errorMessage = await login(email.trim(), password)
      if (errorMessage) setPopupMessage(errorMessage)
    } catch {
      setError('Erro de conexão.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async () => {
    if (!name.trim() || !email || !password || !confirmPassword) return setError('Preencha todos os campos.')
    if (!emailValido(email)) return setError('Digite um e-mail válido.')
    if (password.length < 8 || password.length > 15) return setError('A senha deve ter entre 8 e 15 caracteres.')
    if (password !== confirmPassword) return setError('As senhas não conferem.')
    setIsSubmitting(true)
    try {
      const errorMessage = await register(name.trim(), email.trim(), password)
      if (errorMessage) {
        setPopupMessage(errorMessage)
      } else {
        setName('')
        trocarModo('login')
        setSuccess('Conta criada! Agora é só entrar.')
      }
    } catch {
      setError('Erro de conexão.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    void (modo === 'login' ? handleLogin() : handleRegister())
  }

  const entrada = reduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050806] relative overflow-hidden px-4 py-10">
      {/* Brilho verde de fundo */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/[0.07] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-10%] w-[400px] h-[400px] bg-emerald-400/[0.04] blur-[120px] rounded-full pointer-events-none" />

      {/* Cartão de vidro */}
      <motion.div
        {...entrada}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-white/[0.06] to-[#050806] border border-white/[0.06] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/25 mb-6 shadow-lg shadow-emerald-500/10">
          <Wallet className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-semibold text-white text-center">Elo</h1>
        <p className="text-sm text-zinc-400 mt-1 mb-6 text-center">
          {modo === 'login' ? 'Entre na sua conta' : 'Crie sua conta grátis'}
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col w-full gap-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={modo}
              initial={reduceMotion ? false : { opacity: 0, x: modo === 'login' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: modo === 'login' ? 10 : -10 }}
              transition={{ duration: 0.18 }}
              className="w-full flex flex-col gap-3"
            >
              {modo === 'register' && (
                <>
                  <label htmlFor="auth-name" className="sr-only">Nome</label>
                  <input
                    id="auth-name"
                    placeholder="Seu nome"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </>
              )}

              <label htmlFor="auth-email" className="sr-only">E-mail</label>
              <input
                id="auth-email"
                type="email"
                placeholder="E-mail"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />

              <div className="relative">
                <label htmlFor="auth-password" className="sr-only">Senha</label>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={modo === 'login' ? 'Senha' : 'Senha (8 a 15 caracteres)'}
                  autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {modo === 'register' && password && (
                <div className="flex items-center gap-2 px-1">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400 min-w-[40px] text-right">{passwordStrength.label}</span>
                </div>
              )}

              {modo === 'register' && (
                <>
                  <label htmlFor="auth-confirm" className="sr-only">Confirmar senha</label>
                  <input
                    id="auth-confirm"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                  />
                  {confirmPassword && (
                    <p className={`text-[11px] flex items-center gap-1 px-1 ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                      {passwordsMatch ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {passwordsMatch ? 'Senhas conferem' : 'Senhas não conferem'}
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {(error || success) && (
            <div role="alert" className={`flex items-center gap-2 text-sm px-1 ${error ? 'text-red-400' : 'text-emerald-400'}`}>
              {error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
              {error || success}
            </div>
          )}

          <hr className="border-white/10" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 font-medium px-5 py-3 rounded-full shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 disabled:opacity-60 transition-colors text-sm cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
            ) : (
              <>
                {modo === 'login' ? 'Entrar' : 'Criar conta'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="w-full text-center text-xs text-zinc-400">
            {modo === 'login' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
            <button
              type="button"
              onClick={() => trocarModo(modo === 'login' ? 'register' : 'login')}
              className="underline underline-offset-2 text-white/80 hover:text-white cursor-pointer"
            >
              {modo === 'login' ? 'Crie a sua, é grátis!' : 'Entrar'}
            </button>
          </p>
        </form>
      </motion.div>

      <motion.p
        {...entrada}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 mt-10 max-w-sm text-center text-sm text-zinc-500"
      >
        Anote cada atendimento e veja <span className="text-zinc-200 font-medium">quanto entrou no mês</span>.
      </motion.p>

      <Dialog open={!!popupMessage} onOpenChange={(open) => !open && setPopupMessage('')}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              {modo === 'login' ? 'Você não conseguiu entrar' : 'Não deu para criar a conta'}
            </DialogTitle>
            <DialogDescription className="pt-1">{popupMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setPopupMessage('')}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
