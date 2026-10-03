import { NavLink } from 'react-router-dom'
import { LogOut, Settings, Users, X } from 'lucide-react'

const GRUPOS = [
  {
    rotulo: 'Carteira',
    itens: [{ para: '/clientes', rotulo: 'Clientes', Icone: Users }],
  },
  {
    rotulo: 'Sistema',
    itens: [{ para: '/configuracoes', rotulo: 'Configuracoes', Icone: Settings, desabilitado: true }],
  },
]

export function Sidebar({ colapsada, aberta, onFecharMobile }) {
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
              {grupo.itens.map(({ para, rotulo, Icone, desabilitado }) => (
                <NavLink
                  key={para}
                  to={para}
                  title={colapsada ? rotulo : undefined}
                  aria-disabled={desabilitado || undefined}
                  onClick={(evento) => {
                    if (desabilitado) {
                      evento.preventDefault()
                      return
                    }
                    onFecharMobile()
                  }}
                  className={({ isActive }) =>
                    `sidebar__item${isActive && !desabilitado ? ' sidebar__item--ativo' : ''}`
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
          <NavLink
            to="/login"
            onClick={onFecharMobile}
            className="sidebar__item"
            title={colapsada ? 'Sair' : undefined}
          >
            <LogOut aria-hidden="true" />
            <span>Sair</span>
          </NavLink>
          <div className="sidebar__perfil">
            <span className="avatar" aria-hidden="true">
              KZ
            </span>
            <span className="sidebar__perfil-dados sidebar__rodape-detalhe">
              <span className="sidebar__perfil-nome">Kauezao</span>
              <span className="sidebar__perfil-papel">Administrador</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}