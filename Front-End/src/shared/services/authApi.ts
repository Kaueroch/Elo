/**
 * authApi - Chamadas de autenticação e perfil (AuthController)
 *
 * Endpoints:
 *   - POST /api/auth/registro  → cria a conta ({ nome, email, senha })
 *   - POST /api/auth/login     → devolve { token, nome, email }
 *   - GET  /api/auth/perfil    → devolve { id, nome, email }
 *   - PUT  /api/auth/perfil    → atualiza nome e/ou senha ({ nome, senhaAtual, senhaNova })
 */

import { apiRequest } from './api';

export interface LoginResponse {
  token: string;
  nome: string;
  email: string;
}

export interface PerfilResponse {
  id: string;
  nome: string;
  email: string;
}

export interface AtualizaPerfilPayload {
  nome?: string;
  senhaAtual?: string;
  senhaNova?: string;
}

export const authApi = {
  async login(email: string, senha: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  },

  /** Devolve a mensagem de sucesso enviada pelo back-end. */
  async registro(nome: string, email: string, senha: string): Promise<string> {
    const data = await apiRequest<{ mensagem: string }>('/api/auth/registro', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    });
    return data?.mensagem ?? 'Conta criada com sucesso!';
  },

  async perfil(): Promise<PerfilResponse> {
    return apiRequest<PerfilResponse>('/api/auth/perfil');
  },

  async atualizaPerfil(payload: AtualizaPerfilPayload): Promise<PerfilResponse> {
    return apiRequest<PerfilResponse>('/api/auth/perfil', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
