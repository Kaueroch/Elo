import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { AuthLayout } from '../components/layout/AuthLayout'
import { useToast } from '../context/useToast'
import { AUTENTICACAO_IMPLEMENTADA, AVISO_REGISTRO } from '../lib/auth'

const ROTULOS_FORCA = ['', 'Fraca', 'Razoavel', 'Boa', 'Forte']

function forcaDaSenha(senha) {
  let pontos = 0
  if (senha.length >= 8) pontos++
  if (senha.length >= 12) pontos++
  if (/[A-Z]/.test(senha)) pontos++
  if (/[0-9]/.test(senha)) pontos++
  if (/[^A-Za-z0-9]/.test(senha)) pontos++
  return Math.min(pontos, 4)
}

export function RegistroPage() {
  const toast = useToast()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [aceite, setAceite] = useState(false)
  const [verSenha, setVerSenha] = useState(false)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function validar() {
    const encontrados = {}

    if (!nome.trim()) {
      encontrados.nome = 'Informe seu nome.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      encontrados.email = 'Informe um e-mail valido.'
    }
    if (senha.length < 6) {
      encontrados.senha = 'A senha deve ter pelo menos 6 caracteres.'
    }
    if (confirmarSenha && senha !== confirmarSenha) {
      encontrados.confirmarSenha = 'As senhas nao conferem.'
    }
    if (!aceite) {
      encontrados.aceite = 'E necessario aceitar os termos.'
    }

    setErros(encontrados)
    return Object.keys(encontrados).length === 0
  }

  function enviar(evento) {
    evento.preventDefault()
    if (!validar()) return

    setEnviando(true)
    if (AUTENTICACAO_IMPLEMENTADA) {
      // Quando existir /api/auth/registro, a chamada real entra aqui.
      setErroGeral('Endpoint de cadastro ainda nao implementado.')
      setEnviando(false)
      return
    }

    toast.erro(AVISO_REGISTRO, 'Cadastro indisponivel')
    setEnviando(false)
  }

  const nivel = forcaDaSenha(senha)
  const senhasConferem = Boolean(confirmarSenha) && senha === confirmarSenha

  return (
    <AuthLayout tipo="registro">
      <h1>Criar sua conta</h1>
      <p className="auth__subtitulo">Preencha os dados para comecar a organizar seus clientes.</p>

      {erroGeral && (
        <p className="auth__erro" role="alert">
          <AlertCircle aria-hidden="true" />
          <span>{erroGeral}</span>
        </p>
      )}

      <form onSubmit={enviar} noValidate>
        <div className={`campo${erros.nome ? ' campo--erro' : ''}`}>
          <label className="campo__rotulo" htmlFor="registro-nome">
            Nome
          </label>
          <div className="input-group">
            <User aria-hidden="true" />
            <input
              id="registro-nome"
              className="input input--icon"
              type="text"
              value={nome}
              onChange={(evento) => {
                setNome(evento.target.value)
                setErros((atual) => ({ ...atual, nome: undefined }))
              }}
              placeholder="Seu nome completo"
              autoComplete="name"
            />
          </div>
          <span className="campo__erro">{erros.nome}</span>
        </div>

        <div className={`campo${erros.email ? ' campo--erro' : ''}`} style={{ marginTop: 14 }}>
          <label className="campo__rotulo" htmlFor="registro-email">
            E-mail
          </label>
          <div className="input-group">
            <Mail aria-hidden="true" />
            <input
              id="registro-email"
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
          <label className="campo__rotulo" htmlFor="registro-senha">
            Senha
          </label>
          <div className="input-group">
            <Lock aria-hidden="true" />
            <input
              id="registro-senha"
              className="input input--icon"
              type={verSenha ? 'text' : 'password'}
              value={senha}
              onChange={(evento) => {
                setSenha(evento.target.value)
                setErros((atual) => ({ ...atual, senha: undefined }))
              }}
              placeholder="Minimo 6 caracteres"
              autoComplete="new-password"
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
          {senha && (
            <div className="forca" data-nivel={nivel}>
              <div className="forca__trilho" aria-hidden="true">
                <span className="forca__barra" />
                <span className="forca__barra" />
                <span className="forca__barra" />
                <span className="forca__barra" />
              </div>
              <span className="forca__rotulo">
                Senha {ROTULOS_FORCA[nivel].toLowerCase()}
                {nivel < 3 && ' - misture letras, numeros e simbolos'}
              </span>
            </div>
          )}
          <span className="campo__erro">{erros.senha}</span>
        </div>

        <div className={`campo${erros.confirmarSenha ? ' campo--erro' : ''}`} style={{ marginTop: 14 }}>
          <label className="campo__rotulo" htmlFor="registro-confirmar">
            Confirmar senha
          </label>
          <div className="input-group">
            <Lock aria-hidden="true" />
            <input
              id="registro-confirmar"
              className="input input--icon"
              type={verSenha ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={(evento) => {
                setConfirmarSenha(evento.target.value)
                setErros((atual) => ({ ...atual, confirmarSenha: undefined }))
              }}
              placeholder="Repita a senha"
              autoComplete="new-password"
            />
            {confirmarSenha &&
              (senhasConferem ? (
                <CheckCircle2
                  aria-hidden="true"
                  style={{ position: 'absolute', right: 10, width: 16, height: 16, color: 'var(--success)' }}
                />
              ) : null)}
          </div>
          {senhasConferem && <span className="campo__dica">Senhas conferem.</span>}
          <span className="campo__erro">{erros.confirmarSenha}</span>
        </div>

        <div className={`campo${erros.aceite ? ' campo--erro' : ''}`} style={{ marginTop: 16 }}>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={aceite}
              onChange={(evento) => {
                setAceite(evento.target.checked)
                setErros((atual) => ({ ...atual, aceite: undefined }))
              }}
            />
            Aceito os Termos de Uso e a Politica de Privacidade
          </label>
          <span className="campo__erro">{erros.aceite}</span>
        </div>

        <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: 20 }} disabled={enviando}>
          {enviando && <span className="spinner" aria-hidden="true" />}
          {enviando ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="auth__rodape-form">
        Ja tem conta? <Link className="auth__link" to="/login">Entrar</Link>
      </p>
    </AuthLayout>
  )
}