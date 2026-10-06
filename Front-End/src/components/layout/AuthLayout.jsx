import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const SELOS = {
  login: {
    titulo: 'Seus clientes organizados, sem planilhas soltas.',
    texto:
      'O CRM Kauezao guarda cada atendimento em um so lugar: nome, origem, valor, data e o trabalho entregue.',
    itens: [
      'Carteira completa com busca e ordenacao',
      'Total billed e ticket medio sempre em dia',
      'Historico de servicos por cliente',
    ],
  },
  registro: {
    titulo: 'Comece a organizar sua carteira de clientes hoje.',
    texto: 'Crie seu acesso e acompanhe cada atendimento sem depender de planilha esquecida na pasta errada.',
    itens: ['Cadastro rapido, sem burocracia', 'Valores e datas sempre conferidos', 'Busca instantanea por servico'],
  },
}

/** Casca das telas de autenticacao: hero a esquerda, formulario a direita. */
export function AuthLayout({ tipo, children }) {
  const conteudo = SELOS[tipo]

  return (
    <div className="auth">
      <aside className="auth__hero">
        <Link to="/" className="auth__marca">
          <span aria-hidden="true">CK</span>
          <span>CRM Kauezao</span>
        </Link>

        <div className="auth__conteudo">
          <h2 className="auth__titulo">{conteudo.titulo}</h2>
          <p className="auth__texto">{conteudo.texto}</p>
          <ul className="auth__lista">
            {conteudo.itens.map((item) => (
              <li key={item}>
                <span className="auth__check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="auth__rodape">Gestao de clientes atendidos</p>
      </aside>

      <div className="auth__painel">
        <div className="auth__form">
          <Link to="/" className="auth__voltar">
            <ArrowLeft aria-hidden="true" />
            Voltar para o inicio
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}