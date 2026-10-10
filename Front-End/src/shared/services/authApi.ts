/**
 * authApi - Chamadas de autenticação e perfil (AuthController)
 *
 * Endpoints:
 *   - POST /api/auth/registro  → cria a conta ({ nome, email, senha })
 *   - POST /api/auth/login     → devolve { token, nome, email }
 *   - GET  /api/auth/perfil    → devolve { id, nome, email }
 *   - PUT  /api/auth/perfil    → atualiza nome, e-mail e/ou senha
 *     ({ nome?, email?, senhaAtual?, senhaNova? })
 *   - POST /api/auth/verificacao/solicitar → envia código de 6 dígitos (202)
 *   - POST /api/auth/verificacao/confirmar → confere o código, devolve { trocaToken }
 *   - POST /api/auth/redefinir/senha → nova senha com o token de troca
 *   - POST /api/auth/redefinir/email → novo e-mail com o token de troca
 *
 * Os 4 últimos ainda não existem no back-end (Fase 2): até lá devolvem erro
 * e as telas mostram a mensagem sem quebrar.
 */

import { apiRequest } from './api';
import type { ConfigMotivo } from '../types';

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
  email?: string;
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

  /** Pede o código de 6 dígitos no e-mail atual. Resposta 202 sem corpo. */
  async solicitarCodigo(motivo: ConfigMotivo): Promise<void> {
    await apiRequest<void>('/api/auth/verificacao/solicitar', {
      method: 'POST',
      body: JSON.stringify({ motivo: motivo === 'senha' ? 'SENHA' : 'EMAIL' }),
    });
  },

  /** Confere o código e devolve o token de troca (10 min, só em memória). */
  async confirmarCodigo(motivo: ConfigMotivo, codigo: string): Promise<string> {
    const data = await apiRequest<{ trocaToken: string }>('/api/auth/verificacao/confirmar', {
      method: 'POST',
      body: JSON.stringify({ motivo: motivo === 'senha' ? 'SENHA' : 'EMAIL', codigo }),
    });
    return data.trocaToken;
  },

  /** Salva a nova senha usando o token de troca (vai no corpo, não no JWT). */
  async redefinirSenha(trocaToken: string, senhaNova: string): Promise<void> {
    await apiRequest<void>('/api/auth/redefinir/senha', {
      method: 'POST',
      body: JSON.stringify({ trocaToken, senhaNova }),
    });
  },

  /** Salva o novo e-mail usando o token de troca; devolve o perfil atualizado. */
  async redefinirEmail(trocaToken: string, email: string): Promise<PerfilResponse> {
    return apiRequest<PerfilResponse>('/api/auth/redefinir/email', {
      method: 'POST',
      body: JSON.stringify({ trocaToken, email }),
    });
  },
};
