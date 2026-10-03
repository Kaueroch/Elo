import { useCallback, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { ToastContext } from './toastContext'

const ICONES = {
  sucesso: CheckCircle2,
  erro: AlertCircle,
  info: Info,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const remover = useCallback((id) => {
    setToasts((atuais) => atuais.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const mostrar = useCallback(
    (mensagem, tipo = 'info', titulo) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      setToasts((atuais) => [...atuais, { id, mensagem, tipo, titulo }])

      // Depois de 4s o toast sai com animacao e so e removido do DOM em 200ms.
      const timer = setTimeout(() => {
        setToasts((atuais) =>
          atuais.map((toast) => (toast.id === id ? { ...toast, saindo: true } : toast)),
        )
        const remoção = setTimeout(() => remover(id), 200)
        timers.current.set(id, remoção)
      }, 4000)

      timers.current.set(id, timer)

      return id
    },
    [remover],
  )

  const api = useMemo(
    () => ({
      sucesso: (mensagem, titulo) => mostrar(mensagem, 'sucesso', titulo),
      erro: (mensagem, titulo) => mostrar(mensagem, 'erro', titulo ?? 'Nao foi possivel concluir'),
      info: (mensagem, titulo) => mostrar(mensagem, 'info', titulo),
    }),
    [mostrar],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" role="region" aria-live="polite" aria-label="Notificacoes">
        {toasts.map((toast) => {
          const Icone = ICONES[toast.tipo] || ICONES.info
          return (
            <div
              key={toast.id}
              className={`toast toast--${toast.tipo}${toast.saindo ? ' toast--saindo' : ''}`}
              role={toast.tipo === 'erro' ? 'alert' : 'status'}
            >
              <Icone aria-hidden="true" />
              <p className="toast__texto">
                {toast.titulo && <strong className="toast__titulo">{toast.titulo}</strong>}
                {toast.mensagem}
              </p>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}