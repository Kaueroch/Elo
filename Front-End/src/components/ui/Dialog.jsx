import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Dialog modal: fecha no Esc, no clique fora e no botao de fechar, prende o Tab
 * dentro do conteudo e devolve o foco ao elemento que abriu.
 */
export function Dialog({
  aberto,
  onFechar,
  titulo,
  subtitulo,
  children,
  rotuloFechar = 'Fechar',
  className = '',
}) {
  const conteudoRef = useRef(null)
  const focoAnterior = useRef(null)
  // onFechar muda de identidade a cada render do pai; o efeito nao deve
  // refazer a captura de foco por causa disso.
  const fecharRef = useRef(onFechar)

  useEffect(() => {
    fecharRef.current = onFechar
  })

  useEffect(() => {
    if (!aberto) return undefined

    focoAnterior.current = document.activeElement
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const primeiro = conteudoRef.current?.querySelector(FOCAVEIS)
    if (primeiro) {
      window.setTimeout(() => primeiro.focus(), 40)
    }

    function aoTeclar(evento) {
      if (evento.key === 'Escape') {
        evento.preventDefault()
        fecharRef.current()
        return
      }
      if (evento.key !== 'Tab') return

      const focaveis = Array.from(conteudoRef.current?.querySelectorAll(FOCAVEIS) || []).filter(
        (el) => el.offsetParent !== null,
      )
      if (!focaveis.length) return

      const primeiroEl = focaveis[0]
      const ultimoEl = focaveis[focaveis.length - 1]

      if (evento.shiftKey && document.activeElement === primeiroEl) {
        evento.preventDefault()
        ultimoEl.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimoEl) {
        evento.preventDefault()
        primeiroEl.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflowAnterior
      focoAnterior.current?.focus?.()
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <div
      className="dialog-overlay"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onFechar()
      }}
    >
      <div
        className={`dialog ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        ref={conteudoRef}
      >
        <div className="dialog__header">
          <div>
            <h2 className="dialog__titulo">{titulo}</h2>
            {subtitulo && <p className="dialog__subtitulo">{subtitulo}</p>}
          </div>
          <button type="button" className="btn btn--icon" onClick={onFechar} aria-label={rotuloFechar}>
            <X aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}