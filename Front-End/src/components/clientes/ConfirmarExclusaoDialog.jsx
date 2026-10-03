import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { Dialog } from '../ui/Dialog'

export function ConfirmarExclusaoDialog({ aberto, cliente, onFechar, onConfirmar }) {
  const [excluindo, setExcluindo] = useState(false)

  async function confirmar() {
    setExcluindo(true)
    try {
      await onConfirmar()
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <Dialog
      aberto={aberto}
      onFechar={excluindo ? () => {} : onFechar}
      titulo="Excluir cliente?"
      className="dialog--confirm"
    >
      <span className="dialog__icone-confirm" aria-hidden="true">
        <Trash2 />
      </span>
      <p>
        O registro de <strong>{cliente?.nome}</strong> sera removido permanentemente. Esta acao nao pode ser
        desfeita.
      </p>

      <div className="dialog__acoes">
        <button type="button" className="btn btn--outline" onClick={onFechar} disabled={excluindo}>
          Cancelar
        </button>
        <button type="button" className="btn btn--destructive" onClick={confirmar} disabled={excluindo}>
          {excluindo && <span className="spinner" aria-hidden="true" />}
          {excluindo ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </Dialog>
  )
}