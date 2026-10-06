/**
 * Sessao do usuario guardada no localStorage: o token JWT volta no cabecalho
 * Authorization de toda chamada da API (ver lib/api.js) e os dados basicos
 * ficam aqui para a UI mostrar quem esta logado sem refazer requisicao.
 */
const CHAVE_TOKEN = 'crm:token'
const CHAVE_USUARIO = 'crm:usuario'

export function obterToken() {
  try {
    return localStorage.getItem(CHAVE_TOKEN)
  } catch {
    return null
  }
}

export function obterUsuario() {
  try {
    const bruto = localStorage.getItem(CHAVE_USUARIO)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}

export function definirSessao({ token, nome, email }) {
  try {
    localStorage.setItem(CHAVE_TOKEN, token)
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify({ nome, email }))
  } catch {
    // localStorage indisponivel (modo privado): a sessao vale so em memoria.
  }
}

export function encerrarSessao() {
  try {
    localStorage.removeItem(CHAVE_TOKEN)
    localStorage.removeItem(CHAVE_USUARIO)
  } catch {
    // sem storage tambem nao ha nada a limpar
  }
}

/** Atualiza so os dados de exibicao (nome) sem mexer no token. */
export function salvarUsuario(usuario) {
  try {
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario))
  } catch {
    // sem storage a atualizacao vale so em memoria
  }
}
