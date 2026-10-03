import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, RefreshCw, Search, SearchX, Users, WifiOff } from 'lucide-react'
import { clientesApi } from '../lib/api'
import { normalizar } from '../lib/format'
import { ordenarClientes } from '../lib/ordenarClientes'
import { useToast } from '../context/useToast'
import { ClienteFormDialog } from '../components/clientes/ClienteFormDialog'
import { ConfirmarExclusaoDialog } from '../components/clientes/ConfirmarExclusaoDialog'
import { MetricasClientes, TabelaClientes } from '../components/clientes/TabelaClientes'

const ORDEM_INICIAL = { coluna: 'data', crescente: false }

export function ClientesPage() {
  const toast = useToast()
  // null = a lista ainda nao chegou da API; por isso o estado de carregamento
  // e derivado daqui em vez de um setter a parte.
  const [clientes, setClientes] = useState(null)
  const [erroCarga, setErroCarga] = useState('')
  const [recarregando, setRecarregando] = useState(false)
  const [busca, setBusca] = useState('')
  const [ordem, setOrdem] = useState(ORDEM_INICIAL)
  const [editando, setEditando] = useState(null)
  const [formAberto, setFormAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(null)

  const carregar = useCallback(async () => {
    try {
      setClientes(await clientesApi.listar())
      setErroCarga('')
    } catch (erro) {
      setErroCarga(erro.message)
    }
  }, [])

  // Busca inicial: o setState acontece depois do await, entao nao ha
  // render em cascata. O lint nao enxerga a fronteira assincrona.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar()
  }, [carregar])

  // Mantem o contador da topbar em dia sem prop drilling.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('crm:total-clientes', { detail: clientes?.length ?? null }))
  }, [clientes?.length])

  const lista = useMemo(() => clientes ?? [], [clientes])
  const carregando = clientes === null

  function atualizar() {
    setRecarregando(true)
    carregar().finally(() => setRecarregando(false))
  }

  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim())
    const base = termo
      ? lista.filter((cliente) =>
          normalizar(`${cliente.nome} ${cliente.conhecidoDaOnde} ${cliente.trabalhoFeito}`).includes(termo),
        )
      : lista
    return ordenarClientes(base, ordem.coluna, ordem.crescente)
  }, [lista, busca, ordem])

  const metricas = useMemo(() => {
    const soma = lista.reduce((total, cliente) => total + (Number(cliente.valorCobrado) || 0), 0)
    const maisRecente = lista.reduce((melhor, cliente) => {
      if (!melhor) return cliente
      return (cliente.data || '') > (melhor.data || '') ? cliente : melhor
    }, null)

    return {
      total: lista.length,
      soma,
      ticketMedio: lista.length ? soma / lista.length : 0,
      recente: maisRecente?.nome || '',
    }
  }, [lista])

  function aoOrdenar(coluna) {
    setOrdem((atual) =>
      atual.coluna === coluna ? { coluna, crescente: !atual.crescente } : { coluna, crescente: true },
    )
  }

  function abrirNovo() {
    setEditando(null)
    setFormAberto(true)
  }

  function abrirEdicao(cliente) {
    setEditando(cliente)
    setFormAberto(true)
  }

  function fecharForm() {
    setFormAberto(false)
    setEditando(null)
  }

  async function salvar(dados) {
    if (editando) {
      const atualizado = await clientesApi.atualizar(editando.id, dados)
      setClientes((atuais) => atuais.map((c) => (c.id === atualizado.id ? atualizado : c)))
      toast.sucesso('Dados do cliente atualizados.', 'Atualizado')
    } else {
      const criado = await clientesApi.criar(dados)
      setClientes((atuais) => [...atuais, criado])
      toast.sucesso('Cliente cadastrado com sucesso.', 'Cadastrado')
    }
    fecharForm()
  }

  async function confirmarExclusao() {
    const alvo = excluindo
    if (!alvo) return

    try {
      await clientesApi.excluir(alvo.id)
      setClientes((atuais) => atuais.filter((cliente) => cliente.id !== alvo.id))
      toast.sucesso('Cliente removido da lista.', 'Removido')
      setExcluindo(null)
    } catch (erro) {
      toast.erro(erro.message)
    }
  }

  const total = lista.length
  const visiveis = filtrados.length
  const contador =
    visiveis === total
      ? `${total} ${total === 1 ? 'cliente' : 'clientes'}`
      : `${visiveis} de ${total} ${total === 1 ? 'cliente' : 'clientes'}`

  return (
    <>
      <div className="pagina-header">
        <div>
          <h2 className="pagina-header__titulo">Clientes atendidos</h2>
          <p className="pagina-header__subtitulo">
            {total} {total === 1 ? 'cliente registrado' : 'clientes registrados'}
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
          <button type="button" className="btn btn--primary" onClick={abrirNovo}>
            <Plus aria-hidden="true" />
            Novo cliente
          </button>
        </div>
      </div>

      <MetricasClientes {...metricas} />

      <section className="card">
        <div className="toolbar">
          <div className="input-group toolbar__busca">
            <Search aria-hidden="true" />
            <label className="visualmente-oculto" htmlFor="busca">
              Buscar clientes
            </label>
            <input
              id="busca"
              className="input input--icon"
              type="search"
              placeholder="Buscar por nome, origem ou servico..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>
          <span className="toolbar__contagem">{contador}</span>
        </div>

        {erroCarga && (
          <div className="vazio">
            <span className="vazio__icone" aria-hidden="true">
              <WifiOff />
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
              Carregando clientes...
            </p>
          </div>
        )}

        {!carregando && !erroCarga && (
          <TabelaClientes
            clientes={filtrados}
            ordem={ordem}
            onOrdenar={aoOrdenar}
            onEditar={abrirEdicao}
            onExcluir={setExcluindo}
            onNovo={abrirNovo}
          />
        )}

        {!carregando && !erroCarga && total > 0 && visiveis === 0 && (
          <div className="vazio">
            <span className="vazio__icone" aria-hidden="true">
              <SearchX />
            </span>
            <p className="vazio__titulo">Nenhum resultado</p>
            <p className="vazio__texto">Nenhum cliente corresponde a busca. Tente outro termo.</p>
          </div>
        )}
      </section>

      <ClienteFormDialog
        aberto={formAberto}
        cliente={editando}
        onFechar={fecharForm}
        onSalvar={salvar}
      />

      <ConfirmarExclusaoDialog
        aberto={Boolean(excluindo)}
        cliente={excluindo}
        onFechar={() => setExcluindo(null)}
        onConfirmar={confirmarExclusao}
      />
    </>
  )
}