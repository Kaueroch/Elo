import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../lib/api'
import { definirSessao, encerrarSessao, obterUsuario, salvarUsuario } from '../lib/auth'
import { AuthContext } from './authContext'

/**
 * Guarda a sessao (token + usuario) em memoria/localStorage, cria conta,
 * faz login e encerra a sessao. O evento crm:sessao-expirada vem do api.js
 * quando o back-end responde 401: ali a sessao ja foi apagada, so falta a UI.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => obterUsuario())

  useEffect(() => {
    const aoExpirar = () => setUsuario(null)
    window.addEventListener('crm:sessao-expirada', aoExpirar)
    return () => window.removeEventListener('crm:sessao-expirada', aoExpirar)
  }, [])

  const entrar = useCallback(async (email, senha) => {
    const sessao = await authApi.login(email, senha)
    definirSessao(sessao)
    const carimbado = { nome: sessao.nome, email: sessao.email }
    setUsuario(carimbado)
    return carimbado
  }, [])

  const registrar = useCallback(
    async ({ nome, email, senha }) => {
      await authApi.registro(nome, email, senha)
      return entrar(email, senha)
    },
    [entrar],
  )

  const sair = useCallback(() => {
    encerrarSessao()
    setUsuario(null)
  }, [])

  const atualizarUsuario = useCallback((dados) => {
    setUsuario((atual) => {
      const proximo = { ...atual, ...dados }
      salvarUsuario(proximo)
      return proximo
    })
  }, [])

  const valor = useMemo(
    () => ({ usuario, autenticado: Boolean(usuario), entrar, registrar, sair, atualizarUsuario }),
    [usuario, entrar, registrar, sair, atualizarUsuario],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
