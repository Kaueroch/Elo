import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Cliente } from '../shared/types'

interface ClienteFormContextType {
  isOpen: boolean
  /** Cliente em edicao; null quando e um cadastro novo. */
  clienteEmEdicao: Cliente | null
  openClienteForm: (cliente?: Cliente) => void
  closeClienteForm: () => void
}

const ClienteFormContext = createContext<ClienteFormContextType | undefined>(undefined)

export function useClienteForm() {
  const context = useContext(ClienteFormContext)
  if (!context) {
    throw new Error('useClienteForm must be used within a ClienteFormProvider')
  }
  return context
}

export function ClienteFormProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [clienteEmEdicao, setClienteEmEdicao] = useState<Cliente | null>(null)

  const openClienteForm = useCallback((cliente?: Cliente) => {
    setClienteEmEdicao(cliente ?? null)
    setIsOpen(true)
  }, [])

  const closeClienteForm = useCallback(() => {
    setIsOpen(false)
    setClienteEmEdicao(null)
  }, [])

  const value = useMemo(() => ({
    isOpen,
    clienteEmEdicao,
    openClienteForm,
    closeClienteForm,
  }), [isOpen, clienteEmEdicao, openClienteForm, closeClienteForm])

  return (
    <ClienteFormContext.Provider value={value}>
      {children}
    </ClienteFormContext.Provider>
  )
}
