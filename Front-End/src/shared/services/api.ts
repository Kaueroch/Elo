/**
 * api - Base de todas as chamadas HTTP para o back-end do CRM (Spring Boot)
 *
 * Autenticação: Bearer token JWT salvo no localStorage (chave: crm:token).
 * Erros seguem o formato do back-end:
 *   { "timestamp": ..., "status": 400, "mensagem": "...", "campos": { campo: "..." } }
 */

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

/** Chave do localStorage onde o token JWT do usuário logado é salvo */
export const TOKEN_STORAGE_KEY = 'crm:token';

/** Chave do localStorage onde os dados do usuário logado são salvos */
export const USER_STORAGE_KEY = 'crm:usuario';

/** Evento disparado quando a API responde 401 (sessão expirada/token inválido) */
export const SESSION_EXPIRED_EVENT = 'crm:session-expired';

/** Erro de API com o campo que falhou (usado para apontar o input exato) */
export class ApiError extends Error {
  status: number;
  campos: Record<string, string>;

  constructor(mensagem: string, status: number, campos: Record<string, string> = {}) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
    this.campos = campos;
  }
}

/** Busca o token JWT salvo no localStorage */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/** Monta os headers de autenticação para as requisições HTTP */
export function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Lê a mensagem de erro de uma resposta, priorizando o campo "mensagem". */
async function extraiMensagem(response: Response): Promise<{ mensagem: string; campos: Record<string, string> }> {
  try {
    const data = (await response.clone().json()) as { mensagem?: string; campos?: Record<string, string> };
    if (data?.mensagem) {
      return { mensagem: data.mensagem, campos: data.campos ?? {} };
    }
  } catch {
    // Resposta sem JSON (proxy/nginx), cai para o texto puro abaixo.
  }

  try {
    const text = await response.text();
    if (text.trim()) return { mensagem: text, campos: {} };
  } catch {
    // Ignora falha ao ler o corpo.
  }

  return { mensagem: `Não foi possível concluir a operação (erro ${response.status}).`, campos: {} };
}

/**
 * Faz uma chamada autenticada e devolve o JSON já tipado.
 * Em caso de erro lança ApiError; um 401 encerra a sessão do usuário.
 */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...(init.headers ?? {}) },
    });
  } catch {
    throw new ApiError('Erro de conexão com o servidor.', 0);
  }

  if (response.status === 401 && !path.startsWith('/api/auth/login') && !path.startsWith('/api/auth/registro')) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    throw new ApiError('Sessão expirada. Faça login novamente.', 401);
  }

  if (!response.ok) {
    const { mensagem, campos } = await extraiMensagem(response);
    throw new ApiError(mensagem, response.status, campos);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
