import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, LayoutDashboard, Tag, Wallet } from 'lucide-react'

const RECURSOS = [
  {
    Icone: Wallet,
    titulo: 'Cada cliente no seu lugar',
    texto: 'Nome, origem, valor cobrado, data e trabalho feito em um caderno so, sem planilha solta.',
  },
  {
    Icone: LayoutDashboard,
    titulo: 'Ganhos sempre visiveis',
    texto: 'O total ja faturado fica a um clique de distancia, atualizado a cada atendimento registrado.',
  },
  {
    Icone: Tag,
    titulo: 'Origens como categorias',
    texto: 'Descubra de onde vao seus clientes: cadastre origens e use como sugestao no formulario.',
  },
]

const PASSOS = ['Crie sua conta em segundos', 'Registre cada atendimento', 'Acompanhe o total faturado']

/** Vitrine publica: a pagina que "vende" o CRM para quem ainda nao tem conta. */
export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__topo">
        <Link to="/" className="landing__marca">
          <span aria-hidden="true">CK</span>
          CRM Kauezao
        </Link>
        <nav className="landing__nav" aria-label="Navegacao da vitrine">
          <Link className="btn btn--ghost" to="/login">
            Entrar
          </Link>
          <Link className="btn btn--primary" to="/registro">
            Criar conta
          </Link>
        </nav>
      </header>

      <section className="landing__hero">
        <span className="landing__selo">Gestao de clientes atendidos</span>
        <h1 className="landing__titulo">
          Sua carteira de clientes,
          <br />
          <span className="landing__destaque">finalmente organizada.</span>
        </h1>
        <p className="landing__texto">
          Chega de planilha esquecida e print perdido no WhatsApp. O CRM Kauezao guarda cada
          atendimento: quem e, de onde veio, quanto voce cobrou, quando aconteceu e o que foi
          entregue.
        </p>
        <div className="landing__acoes">
          <Link className="btn btn--primary btn--lg" to="/registro">
            Comecar agora
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="btn btn--outline btn--lg" to="/login">
            Ja tenho conta
          </Link>
        </div>
      </section>

      <section className="landing__recursos" aria-label="Recursos">
        {RECURSOS.map(({ Icone, titulo, texto }) => (
          <article className="landing__card" key={titulo}>
            <span className="landing__card-icone" aria-hidden="true">
              <Icone />
            </span>
            <h2>{titulo}</h2>
            <p>{texto}</p>
          </article>
        ))}
      </section>

      <section className="landing__como" aria-label="Como funciona">
        <h2>Pronto para usar em tres passos</h2>
        <ol className="landing__passos">
          {PASSOS.map((passo, indice) => (
            <li key={passo}>
              <span className="landing__passo-numero" aria-hidden="true">
                {indice + 1}
              </span>
              <span>{passo}</span>
            </li>
          ))}
        </ol>
        <ul className="landing__checklist">
          {['Sem mensalidade', 'Seus dados em um banco so', 'Acesso de qualquer lugar'].map(
            (item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" />
                {item}
              </li>
            ),
          )}
        </ul>
      </section>

      <section className="landing__chamada">
        <h2>Organize sua carteira hoje mesmo.</h2>
        <Link className="btn btn--primary btn--lg" to="/registro">
          Criar minha conta
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <footer className="landing__rodape">
        <span>CRM Kauezao</span>
        <span>Gestao de clientes atendidos</span>
      </footer>
    </div>
  )
}
