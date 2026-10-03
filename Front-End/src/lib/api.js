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
  let resposta
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Nao foi possivel falar com o servidor. O back-end esta rodando?', {
      status: 0,
    })
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

export const apiBaseUrl = BASE_URL