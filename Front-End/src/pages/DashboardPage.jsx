import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, TrendingUp, WifiOff } from 'lucide-react'
import { clientesApi } from '../lib/api'
import { formatarMoeda } from '../lib/format'

/** Painel de ganhos: mostra apenas o valor total ja faturado. */
export function DashboardPage() {
  const [total, setTotal] = useState(null)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    try {
      const lista = await clientesApi.listar()
      const soma = lista.reduce(
        (acumulado, cliente) => acumulado + (Number(cliente.valorCobrado) || 0),
        0,
      )
      setTotal(soma)
      setErro('')
    } catch (erroCarregamento) {
      setErro(erroCarregamento.message)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar()
  }, [carregar])

  return (
    <>
      <div className="pagina-header">
        <div>
          <h2 className="pagina-header__titulo">Painel de ganhos</h2>
          <p className="pagina-header__subtitulo">O total faturado com os atendimentos registrados</p>
        </div>
        <div className="pagina-header__acoes">
          <button
            type="button"
            className="btn btn--outline"
            onClick={carregar}
            title="Recarregar total"
          >
            <RefreshCw aria-hidden="true" />
            Atualizar
          </button>
        </div>
      </div>

      <section className="card ganhos">
        {erro ? (
          <div className="vazio">
            <span className="vazio__icone" aria-hidden="true">
              <WifiOff />
            </span>
            <p className="vazio__titulo">Nao foi possivel carregar</p>
            <p className="vazio__texto">{erro}</p>
            <button type="button" className="btn btn--outline" onClick={carregar}>
              <RefreshCw aria-hidden="true" />
              Tentar de novo
            </button>
          </div>
        ) : total === null ? (
          <div className="vazio">
            <span className="spinner" style={{ margin: '0 auto' }} aria-hidden="true" />
            <p className="vazio__texto" style={{ marginTop: 12 }}>
              Somando os ganhos...
            </p>
          </div>
        ) : (
          <div className="ganhos__destaque">
            <span className="ganhos__rotulo">Ganho ate agora</span>
            <strong className="ganhos__valor">{formatarMoeda(total)}</strong>
            <span className="ganhos__dica">
              <TrendingUp aria-hidden="true" />
              Soma de todos os trabalhos ja registrados no CRM.
            </span>
          </div>
        )}
      </section>
    </>
  )
}
