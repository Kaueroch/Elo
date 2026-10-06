import { NavLink } from 'react-router-dom'
import { LayoutDashboard, LogOut, Settings, Tag, Users, X } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { iniciais } from '../../lib/format'

const GRUPOS = [
  {
    rotulo: 'Carteira',
    itens: [
      { para: '/dashboard', rotulo: 'Painel', Icone: LayoutDashboard },
      { para: '/clientes', rotulo: 'Clientes', Icone: Users },
      { para: '/origens', rotulo: 'Origens', Icone: Tag },
    ],
  },
  {
    rotulo: 'Sistema',
    itens: [{ para: '/configuracoes', rotulo: 'Configuracoes', Icone: Settings }],
  },
]

export function Sidebar({ colapsada, aberta, onFecharMobile }) {
  const { usuario, sair } = useAuth()
  const nome = usuario?.nome || 'Usuario'
  const papel = usuario?.email || ''

  return (
    <>
      {aberta && <button type="button" className="sidebar__overlay" onClick={onFecharMobile} aria-label="Fechar menu" />}

      <aside className={`sidebar${colapsada ? ' sidebar--colapsada' : ''}${aberta ? ' sidebar--aberta' : ''}`}>
        <div className="sidebar__header">
          <span className="sidebar__marca" aria-hidden="true">
            CK
          </span>
          <span className="sidebar__titulo">CRM Kauezao</span>
          <button
            type="button"
            className="sidebar__fechar-mobile"
            onClick={onFecharMobile}
            aria-label="Fechar menu"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar__conteudo" aria-label="Navegacao principal">
          {GRUPOS.map((grupo) => (
            <div className="sidebar__grupo" key={grupo.rotulo}>
              <p className="sidebar__grupo-rotulo">{grupo.rotulo}</p>
              {grupo.itens.map(({ para, rotulo, Icone }) => (
                <NavLink
                  key={para}
                  to={para}
                  title={colapsada ? rotulo : undefined}
                  onClick={onFecharMobile}
                  className={({ isActive }) =>
                    `sidebar__item${isActive ? ' sidebar__item--ativo' : ''}`
                  }
                >
                  <Icone aria-hidden="true" />
                  <span>{rotulo}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__rodape">
          <button
            type="button"
            className="sidebar__item sidebar__sair"
            onClick={sair}
            title={colapsada ? 'Sair' : undefined}
          >
            <LogOut aria-hidden="true" />
            <span>Sair</span>
          </button>
          <div className="sidebar__perfil">
            <span className="avatar" aria-hidden="true">
              {iniciais(nome)}
            </span>
            <span className="sidebar__perfil-dados sidebar__rodape-detalhe">
              <span className="sidebar__perfil-nome">{nome}</span>
              <span className="sidebar__perfil-papel">{papel}</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
