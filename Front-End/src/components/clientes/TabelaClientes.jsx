import { ArrowDownUp, CalendarDays, Pencil, Trash2, TrendingUp, UserPlus, Users, Wallet } from 'lucide-react'
import { corDoAvatar, formatarData, formatarMoeda, iniciais } from '../../lib/format'

const COLUNAS = [
  { chave: 'nome', rotulo: 'Nome', ordenavel: true },
  { chave: 'conhecidoDaOnde', rotulo: 'Conhecido de onde', ordenavel: true },
  { chave: 'valorCobrado', rotulo: 'Valor', ordenavel: true, numerico: true },
  { chave: 'data', rotulo: 'Data', ordenavel: true },
  { chave: 'trabalhoFeito', rotulo: 'Trabalho feito' },
]

export function MetricasClientes({ total, soma, ticketMedio, recente }) {
  return (
    <section className="stats" aria-label="Resumo">
      <article className="stat">
        <p className="stat__rotulo">
          <Users aria-hidden="true" />
          Clientes
        </p>
        <p className="stat__valor">{total}</p>
      </article>
      <article className="stat">
        <p className="stat__rotulo">
          <Wallet aria-hidden="true" />
          Total billed
        </p>
        <p className="stat__valor stat__valor--dinheiro">{formatarMoeda(soma)}</p>
      </article>
      <article className="stat">
        <p className="stat__rotulo">
          <TrendingUp aria-hidden="true" />
          Ticket medio
        </p>
        <p className="stat__valor stat__valor--dinheiro">{formatarMoeda(ticketMedio)}</p>
      </article>
      <article className="stat">
        <p className="stat__rotulo">
          <CalendarDays aria-hidden="true" />
          Mais recente
        </p>
        <p className="stat__valor stat__valor--texto" title={recente || '-'}>
          {recente || '-'}
        </p>
      </article>
    </section>
  )
}

export function TabelaClientes({ clientes, ordem, onOrdenar, onEditar, onExcluir, onNovo }) {
  return (
    <div className="table-wrapper">
      <table className="tabela">
        <thead>
          <tr>
            {COLUNAS.map((coluna) => (
              <th
                key={coluna.chave}
                scope="col"
                data-numeric={coluna.numerico ? 'true' : undefined}
                aria-sort={ordem.coluna === coluna.chave ? (ordem.crescente ? 'ascending' : 'descending') : 'none'}
              >
                {coluna.ordenavel ? (
                  <button type="button" onClick={() => onOrdenar(coluna.chave)}>
                    {coluna.rotulo}
                    <ArrowDownUp aria-hidden="true" />
                  </button>
                ) : (
                  <span style={{ display: 'inline-flex', padding: '12px 16px' }}>{coluna.rotulo}</span>
                )}
              </th>
            ))}
            <th scope="col" data-numeric="true">
              <span className="visualmente-oculto">Acoes</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, indice) => (
            <tr key={cliente.id}>
              <td>
                <div className="cliente-celula">
                  <span className="avatar-cliente" data-cor={corDoAvatar(indice)} aria-hidden="true">
                    {iniciais(cliente.nome)}
                  </span>
                  <span className="cliente-celula__nome">{cliente.nome}</span>
                </div>
              </td>
              <td>
                {cliente.conhecidoDaOnde ? (
                  <span className="badge" title={cliente.conhecidoDaOnde}>
                    {cliente.conhecidoDaOnde}
                  </span>
                ) : (
                  <span className="data">-</span>
                )}
              </td>
              <td data-numeric="true">
                <span className="valor">{formatarMoeda(cliente.valorCobrado)}</span>
              </td>
              <td>
                <span className="data">{formatarData(cliente.data)}</span>
              </td>
              <td>
                <span className="trabalho" title={cliente.trabalhoFeito}>
                  {cliente.trabalhoFeito || '-'}
                </span>
              </td>
              <td data-numeric="true">
                <div className="acoes">
                  <button
                    type="button"
                    className="btn btn--icon"
                    onClick={() => onEditar(cliente)}
                    aria-label={`Editar ${cliente.nome}`}
                    title="Editar"
                  >
                    <Pencil aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="btn btn--icon"
                    onClick={() => onExcluir(cliente)}
                    aria-label={`Excluir ${cliente.nome}`}
                    title="Excluir"
                  >
                    <Trash2 aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {clientes.length === 0 && (
        <div className="vazio">
          <span className="vazio__icone" aria-hidden="true">
            <Users />
          </span>
          <p className="vazio__titulo">Nenhum cliente ainda</p>
          <p className="vazio__texto">Cadastre o primeiro cliente para comecar a acompanhar seus atendimentos.</p>
          <button type="button" className="btn btn--primary" onClick={onNovo}>
            <UserPlus aria-hidden="true" />
            Cadastrar cliente
          </button>
        </div>
      )}
    </div>
  )
}