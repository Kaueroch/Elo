import { useState, useMemo, useEffect, useRef, type FormEvent } from 'react'
import { Wallet, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, XCircle, Sparkles, ArrowRight, ArrowLeft, TrendingUp, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from './AuthContext'

interface AuthPageProps {
  initialTab?: 'login' | 'register'
  onBack?: () => void
}

export function AuthPage({ initialTab = 'login', onBack }: AuthPageProps) {
  const { login, register } = useAuth()

  const [tab, setTab] = useState<'login' | 'register'>(initialTab)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setTab(initialTab)
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
  }, [initialTab])

  const particles = useMemo(() =>
    Array.from({ length: 14 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 16 + 14,
      delay: Math.random() * 8,
      xDrift: (Math.random() - 0.5) * 60,
      yDrift: (Math.random() - 0.5) * 60,
    })), []
  )

  const typewriterDone = useRef(false)
  const fullSubtitle = "Seu Elo completo. Organize clientes, origens de indicação e faturamento em um só lugar."

  useEffect(() => {
    if (typewriterDone.current) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayedText(fullSubtitle.slice(0, i))
      if (i >= fullSubtitle.length) {
        clearInterval(interval)
        typewriterDone.current = true
      }
    }, 22)
    return () => clearInterval(interval)
  }, [])

  const switchToLogin = () => {
    setTab('login')
    setError('')
    setSuccess('')
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Preencha todos os campos.')
      return
    }
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

  const passwordStrength = useMemo(() => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    const labels = ['', 'Fraca', 'Média', 'Boa', 'Forte', 'Segura']
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-400', 'bg-lime-400']
    return { score, label: labels[score], color: colors[score], width: `${(score / 5) * 100}%` }
  }, [password])

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : null
  const nameFilled = name.trim().length > 0
  const emailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const fields = [
    { id: 'reg-name', icon: User, placeholder: 'Seu nome completo', value: name, setter: setName, type: 'text', valid: nameFilled, label: 'Nome' },
    { id: 'reg-email', icon: Mail, placeholder: 'seu@email.com', value: email, setter: setEmail, type: 'email', valid: emailValid, label: 'E-mail' },
    { id: 'reg-password', icon: Lock, placeholder: 'De 8 a 15 caracteres', value: password, setter: setPassword, type: showPassword ? 'text' : 'password', valid: password.length >= 8 && password.length <= 15, label: 'Senha' },
    { id: 'reg-confirm', icon: Lock, placeholder: 'Repita a senha', value: confirmPassword, setter: setConfirmPassword, type: showPassword ? 'text' : 'password', valid: passwordsMatch === true, label: 'Confirmar Senha' },
  ]

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos.')
      return
    }
    if (password.length < 8 || password.length > 15) {
      setError('A senha deve ter entre 8 e 15 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    setIsSubmitting(true)
    try {
      const errorMessage = await register(name.trim(), email.trim(), password)
      if (errorMessage) {
        setPopupMessage(errorMessage)
      } else {
        setSuccess('Conta criada com sucesso! Faça login.')
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setTimeout(() => switchToLogin(), 1500)
      }
    } catch {
      setError('Erro de conexão.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loginFields = [
    { id: 'login-email', icon: Mail, placeholder: 'seu@email.com', value: email, setter: setEmail, type: 'email', valid: email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) },
    { id: 'login-password', icon: Lock, placeholder: 'Sua senha', value: password, setter: setPassword, type: showPassword ? 'text' : 'password', valid: password.length >= 8 },
  ]

  const heroFeatures = [
    { icon: TrendingUp, label: 'Gestão de clientes' },
    { icon: BarChart3, label: 'Ganhos por origem' },
    { icon: Sparkles, label: 'Registro rápido' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex bg-[#07070d]"
    >
      {/* Hero */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center p-12">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #18181b, #09090b, #000000)',
            backgroundSize: '200% 200%',
          }}
          animate={{ backgroundPosition: ['0% 0%', '50% 50%', '0% 0%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ x: [0, p.xDrift, 0], y: [0, p.yDrift, 0], opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}

        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-lime-400/[0.05] blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-white/5 blur-[130px] rounded-full"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[15%] w-[200px] h-[200px] bg-white/[0.04] blur-[80px] rounded-full"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[25%] left-[10%] w-[250px] h-[250px] bg-white/[0.04] blur-[90px] rounded-full"
        />

        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={onBack}
            title={onBack ? 'Voltar para a página inicial' : undefined}
            className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Wallet className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onClick={onBack}
            title={onBack ? 'Voltar para a página inicial' : undefined}
            className="text-5xl font-bold text-white tracking-tight mb-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
            Elo
          </motion.h1>

          <div className="h-14 flex items-center justify-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-xl text-zinc-400 leading-relaxed"
            >
              {displayedText}
              {displayedText.length < fullSubtitle.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-[2px] h-5 bg-zinc-400 ml-0.5 align-middle"
                />
              )}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 grid grid-cols-3 gap-6 text-center"
          >
            {heroFeatures.map((f, i) => (
              <motion.div
                key={f.label}
                whileHover={{ y: -3, scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <f.icon className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
                <div className="text-zinc-500 text-sm">{f.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-hidden">
        {particles.slice(0, 6).map((p, i) => (
          <motion.div
            key={`fp-${i}`}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{ x: [0, -p.xDrift, 0], y: [0, -p.yDrift, 0], opacity: [0.02, 0.06, 0.02] }}
            transition={{ duration: p.duration + 4, repeat: Infinity, ease: 'easeInOut', delay: p.delay + 2 }}
          />
        ))}

        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] right-[-15%] w-[500px] h-[500px] bg-lime-400/[0.05] blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-sm relative z-10"
        >
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-6 flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Página inicial
            </button>
          )}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            onClick={onBack}
            title={onBack ? 'Voltar para a página inicial' : undefined}
            className="flex items-center justify-center gap-3 mb-8 lg:hidden cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Elo</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border-border/60 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <CardContent className="pt-6 pb-6">
                <Tabs value={tab} onValueChange={setTab}>
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <TabsList className="w-full mb-1 relative">
                      <TabsTrigger
                        value="login"
                        className="flex-1 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                      >
                        Entrar
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="flex-1 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                      >
                        Cadastrar
                      </TabsTrigger>
                    </TabsList>
                    <motion.div
                      className="h-[2px] bg-white/20 rounded-full"
                      style={{ width: '50%' }}
                      animate={{ x: tab === 'login' ? '0%' : '100%' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  </motion.div>

                  <div className="mt-5">
                    <AnimatePresence mode="wait">
                      {(error || success) && (
                        <motion.div
                          key="alert"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium mb-4 overflow-hidden ${
                            error
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-lime-400/10 text-lime-400/90 border border-lime-400/20'
                          }`}
                        >
                          {error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
                          <span>{error || success}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {tab === 'login' && (
                        <motion.div
                          key="login"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ duration: 0.2 }}
                        >
                          <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            {loginFields.map((field, i) => (
                              <motion.div
                                key={field.id}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="space-y-2"
                              >
                                <Label htmlFor={field.id}>{field.id === 'login-email' ? 'E-mail' : 'Senha'}</Label>
                                <div className="relative">
                                  <field.icon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                  <Input
                                    id={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={field.value}
                                    onChange={e => field.setter(e.target.value)}
                                    className={`pl-9 pr-9 transition-[border-color,box-shadow] duration-300 ${
                                      field.value && (field.valid ? 'border-lime-400/40' : 'border-red-500/40')
                                    }`}
                                  />
                                  <AnimatePresence>
                                    {field.value && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                      >
                                        {field.valid ? (
                                          <CheckCircle className="w-4 h-4 text-lime-400" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  {field.id === 'login-password' && (
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15 }}
                            >
                              <motion.div
                                animate={{
                                  boxShadow: [
                                    '0 0 0px 0px rgba(255,255,255,0)',
                                    '0 0 16px -2px rgba(255,255,255,0.04)',
                                    '0 0 0px 0px rgba(255,255,255,0)',
                                  ],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="rounded-md"
                              >
                                <Button type="submit" disabled={isSubmitting} className="w-full h-9 gap-2 transition-[filter] duration-300 hover:brightness-110">
                                  {isSubmitting ? (
                                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                  ) : (
                                    <>Entrar <ArrowRight className="w-4 h-4" /></>
                                  )}
                                </Button>
                              </motion.div>
                            </motion.div>
                          </form>
                        </motion.div>
                      )}
                      {tab === 'register' && (
                        <motion.div
                          key="register"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.2 }}
                        >
                          <form onSubmit={handleRegister} className="flex flex-col gap-3">
                            {fields.map((field, i) => (
                              <motion.div
                                key={field.id}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i * 0.04 }}
                                className="space-y-1.5"
                              >
                                <Label htmlFor={field.id}>{field.label}</Label>
                                <div className="relative">
                                  <field.icon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                  <Input
                                    id={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={field.value}
                                    onChange={e => field.setter(e.target.value)}
                                    className={`pl-9 pr-9 transition-[border-color,box-shadow] duration-300 ${
                                      field.value && (field.valid ? 'border-lime-400/40' : 'border-red-500/40')
                                    }`}
                                  />
                                  <AnimatePresence>
                                    {field.value && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                      >
                                        {field.valid ? (
                                          <CheckCircle className="w-4 h-4 text-lime-400" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  {field.id === 'reg-password' && field.value && (
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  )}
                                </div>
                                {field.id === 'reg-password' && password && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: passwordStrength.width }}
                                          className={`h-full rounded-full ${passwordStrength.color}`}
                                          transition={{ duration: 0.3 }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-medium text-muted-foreground min-w-[40px] text-right">
                                        {passwordStrength.label}
                                      </span>
                                    </div>
                                  </motion.div>
                                )}
                                {field.id === 'reg-confirm' && confirmPassword && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="overflow-hidden"
                                  >
                                    <p className={`text-[11px] flex items-center gap-1 mt-0.5 ${passwordsMatch ? 'text-lime-400' : 'text-red-500'}`}>
                                      {passwordsMatch ? (
                                        <><CheckCircle className="w-3 h-3" /> Senhas conferem</>
                                      ) : (
                                        <><XCircle className="w-3 h-3" /> Senhas não conferem</>
                                      )}
                                    </p>
                                  </motion.div>
                                )}
                              </motion.div>
                            ))}

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <motion.div
                                animate={{
                                  boxShadow: [
                                    '0 0 0px 0px rgba(255,255,255,0)',
                                    '0 0 16px -2px rgba(255,255,255,0.04)',
                                    '0 0 0px 0px rgba(255,255,255,0)',
                                  ],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="rounded-md"
                              >
                                <Button type="submit" disabled={isSubmitting} className="w-full h-9 gap-2 transition-[filter] duration-300 hover:brightness-110">
                                  {isSubmitting ? (
                                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      <Sparkles className="w-4 h-4" />
                                      Criar Conta
                                      <ArrowRight className="w-4 h-4" />
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                            </motion.div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Tabs>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-xs text-muted-foreground mt-6"
                >
                  Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <Dialog open={!!popupMessage} onOpenChange={(open) => !open && setPopupMessage('')}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              Não foi possível continuar
            </DialogTitle>
            <DialogDescription className="pt-1">
              {popupMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setPopupMessage('')}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
