/**
 * clientesApi - Chamadas de CRUD de clientes (ClienteController)
 *
 * Endpoints:
 *   - GET    /api/clientes      → lista de clientes
 *   - GET    /api/clientes/{id} → um cliente
 *   - POST   /api/clientes      → cria (201)
 *   - PUT    /api/clientes/{id} → atualiza
 *   - DELETE /api/clientes/{id} → exclui (204)
 */

import { Cliente, ClientePayload } from '../types';
import { apiRequest } from './api';

export const clientesApi = {
  async listar(): Promise<Cliente[]> {
    const data = await apiRequest<Cliente[]>('/api/clientes');
    return Array.isArray(data) ? data : [];
  },

  async buscar(id: number): Promise<Cliente> {
    return apiRequest<Cliente>(`/api/clientes/${id}`);
  },

  async criar(payload: ClientePayload): Promise<Cliente> {
    return apiRequest<Cliente>('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async atualizar(id: number, payload: ClientePayload): Promise<Cliente> {
    return apiRequest<Cliente>(`/api/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async excluir(id: number): Promise<void> {
    await apiRequest<void>(`/api/clientes/${id}`, { method: 'DELETE' });
  },
};
