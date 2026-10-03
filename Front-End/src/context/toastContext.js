import { createContext } from 'react'

/**
 * Contexto separado do provider para que o arquivo do componente exporte
 * apenas componentes (regra react-refresh/only-export-components).
 */
export const ToastContext = createContext(null)