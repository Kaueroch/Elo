import { useEffect, useState } from 'react'
import { Eye, EyeOff, Lock, Save, ShieldCheck, User } from 'lucide-react'
import { authApi } from '../lib/api'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'

/**
 * Perfil do usuario: nome (PUT /api/auth/perfil) e troca de senha
 * (o back-end exige a senha atual e valida a nova: 8 a 15 caracteres).
 * O e-mail e somente leitura: ele identifica a conta e nao muda por aqui.
 */
export function ConfiguracoesPage() {
  const { usuario, atualizarUsuario } = useAuth()
  const toast = useToast()

  const [nome, setNome] = useState(usuario?.nome || '')
  const [email, setEmail] = useState(usuario?.email || '')
  const [carregando, setCarregando] = useState(true)
  const [erroCarga, setErroCarga] = useState('')

  const [senhaAtual, setSenhaAtual] = useState('')
  const [senhaNova, setSenhaNova] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [errosDados, setErrosDados] = useState({})
  const [errosSenha, setErrosSenha] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [salvandoDados, setSalvandoDados] = useState(false)
  const [trocandoSenha, setTrocandoSenha] = useState(false)

  useEffect(() => {
    let vivo = true
    authApi
      .perfil()
      .then((dados) => {
        if (!vivo) return
        setNome(dados.nome || '')
        setEmail(dados.email || '')
        setErroCarga('')
      })
      .catch((erro) => {
        if (vivo) setErroCarga(erro.message)
      })
      .finally(() => {
        if (vivo) setCarregando(false)
      })
    return () => {
      vivo = false
    }
  }, [])

  async function salvarPerfil(evento) {
    evento.preventDefault()

    const encontrados = {}
    if (!nome.trim()) {
      encontrados.nome = 'Por favor preencha o nome corretamente.'
    } else if (nome.trim().length > 100) {
      encontrados.nome = 'O nome deve ter no maximo 100 caracteres.'
    }
    setErrosDados(encontrados)
    if (Object.keys(encontrados).length) return

    setSalvandoDados(true)
    setErroGeral('')
    try {
      const atualizado = await authApi.atualizarPerfil({ nome: nome.trim() })
      atualizarUsuario({ nome: atualizado.nome })
      toast.sucesso('Seu nome foi atualizado.', 'Perfil salvo')
    } catch (erro) {
      setErroGeral(erro.message)
    } finally {
      setSalvandoDados(false)
    }
  }

  async function trocarSenha(evento) {
    evento.preventDefault()

    const encontrados = {}
    if (!senhaAtual) {
      encontrados.senhaAtual = 'Informe a sua senha atual.'
    }
    if (senhaNova.length < 8) {
      encontrados.senhaNova = 'A senha deve ter pelo menos 8 caracteres.'
    } else if (senhaNova.length > 15) {
      encontrados.senhaNova = 'A senha deve ter no maximo 15 caracteres.'
    }
    if (senhaNova !== confirmarSenha) {
      encontrados.confirmarSenha = 'As senhas nao conferem.'
    }
    setErrosSenha(encontrados)
    if (Object.keys(encontrados).length) return

    setTrocandoSenha(true)
    setErroGeral('')
    try {
      await authApi.atualizarPerfil({ senhaAtual, senhaNova })
      setSenhaAtual('')
      setSenhaNova('')
      setConfirmarSenha('')
      toast.sucesso('Sua senha foi alterada.', 'Senha atualizada')
    } catch (erro) {
      if (erro.campos && Object.keys(erro.campos).length) setErrosSenha(erro.campos)
      setErroGeral(erro.message)
    } finally {
      setTrocandoSenha(false)
    }
  }

  return (
    <>
      <div className="pagina-header">
        <div>
          <h2 className="pagina-header__titulo">Configuracoes</h2>
          <p className="pagina-header__subtitulo">Seus dados de acesso e senha</p>
        </div>
      </div>

      {erroCarga && (
        <p className="dialog__aviso" role="alert">
          {erroCarga}
        </p>
      )}
      {erroGeral && (
        <p className="dialog__aviso" role="alert">
          {erroGeral}
        </p>
      )}

      <div className="config__grade">
        <section className="card">
          <h3 className="config__titulo">
            <User aria-hidden="true" />
            Dados da conta
          </h3>

          <form onSubmit={salvarPerfil} noValidate>
            <div className={`campo${errosDados.nome ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="perfil-nome">
                Nome
              </label>
              <input
                id="perfil-nome"
                className="input"
                type="text"
                value={nome}
                onChange={(evento) => {
                  setNome(evento.target.value)
                  setErrosDados((atual) => ({ ...atual, nome: undefined }))
                }}
                maxLength={100}
                disabled={carregando}
              />
              <span className="campo__erro">{errosDados.nome}</span>
            </div>

            <div className="campo" style={{ marginTop: 14 }}>
              <label className="campo__rotulo" htmlFor="perfil-email">
                E-mail
              </label>
              <input
                id="perfil-email"
                className="input"
                type="email"
                value={email}
                readOnly
                disabled
                title="O e-mail identifica a conta e nao pode ser alterado aqui."
              />
              <span className="campo__dica">O e-mail da conta nao pode ser alterado.</span>
            </div>

            <div className="dialog__acoes" style={{ justifyContent: 'flex-start' }}>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={salvandoDados || carregando}
              >
                {salvandoDados && <span className="spinner" aria-hidden="true" />}
                <Save aria-hidden="true" />
                Salvar dados
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <h3 className="config__titulo">
            <Lock aria-hidden="true" />
            Trocar senha
          </h3>

          <form onSubmit={trocarSenha} noValidate>
            <div className={`campo${errosSenha.senhaAtual ? ' campo--erro' : ''}`}>
              <label className="campo__rotulo" htmlFor="senha-atual">
                Senha atual
              </label>
              <div className="senha-campo">
                <input
                  id="senha-atual"
                  className="input"
                  type={verSenha ? 'text' : 'password'}
                  value={senhaAtual}
                  onChange={(evento) => {
                    setSenhaAtual(evento.target.value)
                    setErrosSenha((atual) => ({ ...atual, senhaAtual: undefined }))
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="senha-campo__olho"
                  onClick={() => setVerSenha((atual) => !atual)}
                  aria-label={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {verSenha ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </button>
              </div>
              <span className="campo__erro">{errosSenha.senhaAtual}</span>
            </div>

            <div
              className={`campo${errosSenha.senhaNova ? ' campo--erro' : ''}`}
              style={{ marginTop: 14 }}
            >
              <label className="campo__rotulo" htmlFor="senha-nova">
                Nova senha
              </label>
              <input
                id="senha-nova"
                className="input"
                type="password"
                value={senhaNova}
                onChange={(evento) => {
                  setSenhaNova(evento.target.value)
                  setErrosSenha((atual) => ({ ...atual, senhaNova: undefined }))
                }}
                placeholder="Minimo 8 caracteres"
                autoComplete="new-password"
              />
              <span className="campo__erro">{errosSenha.senhaNova}</span>
            </div>

            <div
              className={`campo${errosSenha.confirmarSenha ? ' campo--erro' : ''}`}
              style={{ marginTop: 14 }}
            >
              <label className="campo__rotulo" htmlFor="senha-confirmar">
                Confirmar nova senha
              </label>
              <input
                id="senha-confirmar"
                className="input"
                type="password"
                value={confirmarSenha}
                onChange={(evento) => {
                  setConfirmarSenha(evento.target.value)
                  setErrosSenha((atual) => ({ ...atual, confirmarSenha: undefined }))
                }}
                autoComplete="new-password"
              />
              <span className="campo__erro">{errosSenha.confirmarSenha}</span>
            </div>

            <div className="dialog__acoes" style={{ justifyContent: 'flex-start' }}>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={trocandoSenha || !senhaAtual || !senhaNova}
              >
                {trocandoSenha && <span className="spinner" aria-hidden="true" />}
                <ShieldCheck aria-hidden="true" />
                Alterar senha
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
