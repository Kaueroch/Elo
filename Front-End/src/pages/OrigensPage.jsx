import { useCallback, useEffect, useState } from 'react'
import { Plus, RefreshCw, Tag, Trash2 } from 'lucide-react'
import { origensApi } from '../lib/api'
import { useToast } from '../context/useToast'
import { Dialog } from '../components/ui/Dialog'

/** Confirmacao de exclusao da origem, reaproveitando o dialogo generico. */
function ConfirmarExclusaoOrigem({ origem, onFechar, onConfirmar, excluindo }) {
  if (!origem) return null

  return (
    <Dialog
      aberto
      onFechar={onFechar}
      titulo="Excluir origem"
      subtitulo={`A origem "${origem.nome}" sera removida da lista de sugestoes.`}
    >
      <p className="dialog__texto">
        Clientes ja cadastrados com essa origem nao sao afetados; apenas some das sugestoes do
        formulario.
      </p>
      <div className="dialog__acoes">
        <button type="button" className="btn btn--outline" onClick={onFechar} disabled={excluindo}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn--destructive"
          onClick={onConfirmar}
          disabled={excluindo}
        >
          {excluindo && <span className="spinner" aria-hidden="true" />}
          {excluindo ? 'Excluindo...' : 'Excluir origem'}
        </button>
      </div>
    </Dialog>
  )
}

/** Categorias usadas como sugestao no campo "conhecido de onde". */
export function OrigensPage() {
  const toast = useToast()
  const [origens, setOrigens] = useState(null)
  const [erroCarga, setErroCarga] = useState('')
  const [recarregando, setRecarregando] = useState(false)
  const [nome, setNome] = useState('')
  const [erroCampo, setErroCampo] = useState('')
  const [erroGeral, setErroGeral] = useState('')
  const [adicionando, setAdicionando] = useState(false)
  const [excluindo, setExcluindo] = useState(null)
  const [exclusaoPendente, setExclusaoPendente] = useState(false)

  const carregar = useCallback(async () => {
    try {
      setOrigens(await origensApi.listar())
      setErroCarga('')
    } catch (erro) {
      setErroCarga(erro.message)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar()
  }, [carregar])

  function atualizar() {
    setRecarregando(true)
    carregar().finally(() => setRecarregando(false))
  }

  async function adicionar(evento) {
    evento.preventDefault()

    const limpo = nome.trim()
    if (!limpo) {
      setErroCampo('Por favor preencha o nome da origem corretamente')
      return
    }
    if (limpo.length > 100) {
      setErroCampo('O nome da origem deve ter no maximo 100 caracteres')
      return
    }

    setAdicionando(true)
    setErroGeral('')
    try {
      const criada = await origensApi.criar(limpo)
      setOrigens((atuais) => [...(atuais ?? []), criada])
      setNome('')
      toast.sucesso('Origem adicionada as sugestoes.', 'Cadastrada')
    } catch (erro) {
      setErroGeral(erro.message)
    } finally {
      setAdicionando(false)
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return
    setExclusaoPendente(true)
    try {
      await origensApi.excluir(excluindo.id)
      setOrigens((atuais) => (atuais ?? []).filter((origem) => origem.id !== excluindo.id))
      toast.sucesso('Origem removida da lista.', 'Removida')
      setExcluindo(null)
    } catch (erro) {
      toast.erro(erro.message)
    } finally {
      setExclusaoPendente(false)
    }
  }

  const lista = origens ?? []
  const carregando = origens === null

  return (
    <>
      <div className="pagina-header">
        <div>
          <h2 className="pagina-header__titulo">Origens</h2>
          <p className="pagina-header__subtitulo">
            Categorias usadas no campo &quot;conhecido de onde&quot;
          </p>
        </div>
        <div className="pagina-header__acoes">
          <button
            type="button"
            className="btn btn--outline"
            onClick={atualizar}
            disabled={recarregando}
            title="Recarregar lista"
          >
            <RefreshCw aria-hidden="true" />
            Atualizar
          </button>
        </div>
      </div>

      <section className="card">
        <form className="origens__form" onSubmit={adicionar} noValidate>
          <div className={`campo${erroCampo ? ' campo--erro' : ''}`} style={{ flex: 1 }}>
            <label className="campo__rotulo" htmlFor="origem-nome">
              Nova origem
            </label>
            <input
              id="origem-nome"
              className="input"
              type="text"
              value={nome}
              onChange={(evento) => {
                setNome(evento.target.value)
                setErroCampo('')
              }}
              placeholder="Ex.: Instagram, indicacao, site..."
              maxLength={100}
            />
            <span className="campo__erro">{erroCampo}</span>
          </div>
          <button type="submit" className="btn btn--primary origens__btn" disabled={adicionando}>
            {adicionando && <span className="spinner" aria-hidden="true" />}
            <Plus aria-hidden="true" />
            Adicionar
          </button>
        </form>

        {erroGeral && (
          <p className="dialog__aviso" role="alert">
            {erroGeral}
          </p>
        )}

        {erroCarga && (
          <div className="vazio">
            <span className="vazio__icone" aria-hidden="true">
              <Tag />
            </span>
            <p className="vazio__titulo">Nao foi possivel carregar</p>
            <p className="vazio__texto">{erroCarga}</p>
            <button type="button" className="btn btn--outline" onClick={atualizar}>
              <RefreshCw aria-hidden="true" />
              Tentar de novo
            </button>
          </div>
        )}

        {!erroCarga && carregando && (
          <div className="vazio">
            <span className="spinner" style={{ margin: '0 auto' }} aria-hidden="true" />
            <p className="vazio__texto" style={{ marginTop: 12 }}>
              Carregando origens...
            </p>
          </div>
        )}

        {!erroCarga && !carregando && lista.length === 0 && (
          <div className="vazio">
            <span className="vazio__icone" aria-hidden="true">
              <Tag />
            </span>
            <p className="vazio__titulo">Nenhuma origem cadastrada</p>
            <p className="vazio__texto">
              Cadastre as origens dos seus clientes para usa-las como sugestao no formulario.
            </p>
          </div>
        )}

        {!erroCarga && !carregando && lista.length > 0 && (
          <ul className="origens__lista">
            {lista.map((origem) => (
              <li className="origens__item" key={origem.id}>
                <span className="origens__icone" aria-hidden="true">
                  <Tag />
                </span>
                <span className="origens__nome">{origem.nome}</span>
                <button
                  type="button"
                  className="btn btn--icon origens__excluir"
                  onClick={() => setExcluindo(origem)}
                  aria-label={`Excluir origem ${origem.nome}`}
                  title="Excluir origem"
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmarExclusaoOrigem
        origem={excluindo}
        onFechar={() => setExcluindo(null)}
        onConfirmar={confirmarExclusao}
        excluindo={exclusaoPendente}
      />
    </>
  )
}
