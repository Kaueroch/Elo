import { useCallback, useState } from 'react'

const CHAVE_COLAPSA = 'crm:sidebar:colapsada'

/** Estado da sidebar: recolhida no desktop e aberta como gaveta no mobile. */
export function useSidebar() {
  const [colapsada, setColapsada] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_COLAPSA) === 'true'
    } catch {
      return false
    }
  })
  const [aberta, setAberta] = useState(false)

  const alternarColapso = useCallback(() => {
    setColapsada((atual) => {
      const proximo = !atual
      try {
        localStorage.setItem(CHAVE_COLAPSA, String(proximo))
      } catch {
        // modo privado sem storage: o estado vale so para a sessao
      }
      return proximo
    })
  }, [])

  return {
    colapsada,
    aberta,
    alternarColapso,
    abrirMobile: () => setAberta(true),
    fecharMobile: () => setAberta(false),
  }
}