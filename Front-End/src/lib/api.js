import { encerrarSessao, obterToken } from './auth'

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '')

/**
 * Erro de API com o corpo JSON devolvido pelo Spring ({ mensagem, campos }),
 * para a tela conseguir exibir a mensagem exata do backend.
 */
export class ApiError extends Error {
  constructor(mensagem, { status = 0, campos = {} } = {}) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
    this.campos = campos
  }
}

async function request(caminho, { method = 'GET', body } = {}) {
  const token = obterToken()
  const cabecalhos = {}
  if (body) cabecalhos['Content-Type'] = 'application/json'
  if (token) cabecalhos.Authorization = `Bearer ${token}`

  let resposta
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method,
      headers: Object.keys(cabecalhos).length ? cabecalhos : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Nao foi possivel falar com o servidor. O back-end esta rodando?', {
      status: 0,
    })
  }

  // Token vencido/invalido: a sessao morre e a UI manda o usuario para o login.
  if (resposta.status === 401 && token) {
    encerrarSessao()
    window.dispatchEvent(new CustomEvent('crm:sessao-expirada'))
  }

  if (resposta.status === 204) return null

  const tipo = resposta.headers.get('content-type') || ''
  const corpo = tipo.includes('application/json') ? await resposta.json().catch(() => null) : null

  if (!resposta.ok) {
    throw new ApiError(corpo?.mensagem || `Erro ${resposta.status} ao chamar a API.`, {
      status: resposta.status,
      campos: corpo?.campos || {},
    })
  }

  return corpo
}

export const clientesApi = {
  listar: () => request('/clientes'),
  criar: (cliente) => request('/clientes', { method: 'POST', body: cliente }),
  atualizar: (id, cliente) => request(`/clientes/${id}`, { method: 'PUT', body: cliente }),
  excluir: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
}

export const authApi = {
  login: (email, senha) => request('/auth/login', { method: 'POST', body: { email, senha } }),
  registro: (nome, email, senha) =>
    request('/auth/registro', { method: 'POST', body: { nome, email, senha } }),
  perfil: () => request('/auth/perfil'),
  atualizarPerfil: (dados) => request('/auth/perfil', { method: 'PUT', body: dados }),
}

export const origensApi = {
  listar: () => request('/origens'),
  criar: (nome) => request('/origens', { method: 'POST', body: { nome } }),
  excluir: (id) => request(`/origens/${id}`, { method: 'DELETE' }),
}

export const apiBaseUrl = BASE_URL
