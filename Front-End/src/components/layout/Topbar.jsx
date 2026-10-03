import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react'

const CHAVE_TEMA = 'crm:tema'

export function Topbar({ titulo, children, colapsada, onAlternarColapso, onAbrirMobile }) {
  const tema = document.documentElement.getAttribute('data-theme') || 'dark'
  const escuro = tema === 'dark'

  function alternarTema() {
    const proximo = escuro ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', proximo)
    try {
      localStorage.setItem(CHAVE_TEMA, proximo)
    } catch {
      // modo privado sem storage: o tema vale so para a sessao
    }
  }

  return (
    <header className="topbar">
      <button
        type="button"
        className="btn btn--icon topbar__menu-mobile"
        onClick={onAbrirMobile}
        aria-label="Abrir menu"
      >
        <PanelLeftOpen aria-hidden="true" />
      </button>

      <button
        type="button"
        className="btn btn--icon topbar__menu-desktop"
        onClick={onAlternarColapso}
        aria-label={colapsada ? 'Expandir menu lateral' : 'Recolher menu lateral'}
      >
        {colapsada ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
      </button>

      <h1 className="topbar__titulo">{titulo}</h1>

      <div className="topbar__acoes">
        {children}
        <button
          type="button"
          className="btn btn--icon"
          onClick={alternarTema}
          aria-label={escuro ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          {escuro ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}