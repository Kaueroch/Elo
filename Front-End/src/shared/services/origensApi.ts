/**
 * origensApi - Chamadas das origens de indicação (OrigemController)
 *
 * Endpoints:
 *   - GET    /api/origens      → lista de origens (sugestões do formulário)
 *   - POST   /api/origens      → cria (201)
 *   - DELETE /api/origens/{id} → exclui (204)
 */

import { Origem } from '../types';
import { apiRequest } from './api';

export const origensApi = {
  async listar(): Promise<Origem[]> {
    const data = await apiRequest<Origem[]>('/api/origens');
    return Array.isArray(data) ? data : [];
  },

  async criar(nome: string): Promise<Origem> {
    return apiRequest<Origem>('/api/origens', {
      method: 'POST',
      body: JSON.stringify({ nome }),
    });
  },

  async excluir(id: number): Promise<void> {
    await apiRequest<void>(`/api/origens/${id}`, { method: 'DELETE' });
  },
};
