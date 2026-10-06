import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { AuthLayout } from '../components/layout/AuthLayout'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'

export function LoginPage() {
  const { autenticado, entrar } = useAuth()
  const navegar = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function validar() {
    const encontrados = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      encontrados.email = 'Informe um e-mail valido.'
    }
    if (senha.length < 8) {
      encontrados.senha = 'A senha deve ter pelo menos 8 caracteres.'
    } else if (senha.length > 15) {
      encontrados.senha = 'A senha deve ter no maximo 15 caracteres.'
    }
    setErros(encontrados)
    return Object.keys(encontrados).length === 0
  }

  async function enviar(evento) {
    evento.preventDefault()
    if (!validar()) return

    setEnviando(true)
    setErroGeral('')
    try {
      const usuario = await entrar(email.trim(), senha)
      toast.sucesso(`Bem-vindo de volta, ${usuario.nome}!`, 'Login realizado')
      navegar('/dashboard', { replace: true })
    } catch (erro) {
      setErroGeral(erro.message)
      setEnviando(false)
    }
  }

  if (autenticado) return <Navigate to="/dashboard" replace />

  return (
    <AuthLayout tipo="login">
      <h1>Bem-vindo de volta</h1>
      <p className="auth__subtitulo">Entre para acompanhar sua carteira de clientes.</p>

      {erroGeral && (
        <p className="auth__erro" role="alert">
          <AlertCircle aria-hidden="true" />
          <span>{erroGeral}</span>
        </p>
      )}

      <form onSubmit={enviar} noValidate>
        <div className={`campo${erros.email ? ' campo--erro' : ''}`}>
          <label className="campo__rotulo" htmlFor="login-email">
            E-mail
          </label>
          <div className="input-group">
            <Mail aria-hidden="true" />
            <input
              id="login-email"
              className="input input--icon"
              type="email"
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value)
                setErros((atual) => ({ ...atual, email: undefined }))
              }}
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>
          <span className="campo__erro">{erros.email}</span>
        </div>

        <div className={`campo${erros.senha ? ' campo--erro' : ''}`} style={{ marginTop: 14 }}>
          <label className="campo__rotulo" htmlFor="login-senha">
            Senha
          </label>
          <div className="input-group">
            <Lock aria-hidden="true" />
            <input
              id="login-senha"
              className="input input--icon"
              type={verSenha ? 'text' : 'password'}
              value={senha}
              onChange={(evento) => {
                setSenha(evento.target.value)
                setErros((atual) => ({ ...atual, senha: undefined }))
              }}
              placeholder="Sua senha"
              autoComplete="current-password"
              style={{ paddingRight: 40 }}
            />
            <button
              type="button"
              className="btn btn--icon"
              style={{ position: 'absolute', right: 1, height: 34 }}
              onClick={() => setVerSenha((atual) => !atual)}
              aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {verSenha ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
          <span className="campo__erro">{erros.senha}</span>
        </div>

        <div className="auth__linha" style={{ margin: '18px 0 22px' }}>
          <label className="checkbox">
            <input type="checkbox" name="lembrar" />
            Lembrar de mim
          </label>
          <span className="auth__link">Esqueceu a senha?</span>
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={enviando}>
          {enviando && <span className="spinner" aria-hidden="true" />}
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="auth__rodape-form">
        Ainda nao tem conta? <Link className="auth__link" to="/registro">Criar conta</Link>
      </p>
    </AuthLayout>
  )
}