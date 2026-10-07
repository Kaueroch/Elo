import { createContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { Cliente, ClientePayload, Origem } from '../shared/types';
import { clientesApi } from '../shared/services/clientesApi';
import { origensApi } from '../shared/services/origensApi';

interface CrmContextType {
  clientes: Cliente[];
  origens: Origem[];
  loading: boolean;
  error: string | null;
  recarregar: () => Promise<void>;
  addCliente: (payload: ClientePayload) => Promise<Cliente>;
  updateCliente: (id: number, payload: ClientePayload) => Promise<Cliente>;
  deleteCliente: (id: number) => Promise<void>;
  addOrigem: (nome: string) => Promise<Origem>;
  deleteOrigem: (id: number) => Promise<void>;
  totalGanho: number;
  totalClientes: number;
}

export const CrmContext = createContext<CrmContextType | undefined>(undefined);

interface CrmProviderProps {
  children: ReactNode;
}

export function CrmProvider({ children }: CrmProviderProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [origens, setOrigens] = useState<Origem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega clientes e origens do back-end; nada fica preso no navegador.
  const recarregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listaClientes, listaOrigens] = await Promise.all([
        clientesApi.listar(),
        origensApi.listar(),
      ]);
      setClientes(listaClientes);
      setOrigens(listaOrigens);
    } catch (err) {
      console.error('Erro ao carregar dados do CRM:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar os dados do CRM.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const handleAddCliente = async (payload: ClientePayload): Promise<Cliente> => {
    try {
      const criado = await clientesApi.criar(payload);
      setClientes((prev) => [criado, ...prev]);
      return criado;
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
      throw err;
    }
  };

  // So altera a lista local depois que o banco confirmar a alteracao,
  // para a tela nao mentir sobre o estado.
  const handleUpdateCliente = async (id: number, payload: ClientePayload): Promise<Cliente> => {
    try {
      const atualizado = await clientesApi.atualizar(id, payload);
      setClientes((prev) => prev.map((c) => (c.id === id ? atualizado : c)));
      return atualizado;
    } catch (err) {
      console.error(`Erro ao atualizar cliente (id: ${id}):`, err);
      throw err;
    }
  };

  const handleDeleteCliente = async (id: number): Promise<void> => {
    try {
      await clientesApi.excluir(id);
    } catch (err) {
      console.error(`Erro ao excluir cliente (id: ${id}):`, err);
      throw err;
    }
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddOrigem = async (nome: string): Promise<Origem> => {
    try {
      const criada = await origensApi.criar(nome);
      setOrigens((prev) => [...prev, criada]);
      return criada;
    } catch (err) {
      console.error('Erro ao criar origem:', err);
      throw err;
    }
  };

  const handleDeleteOrigem = async (id: number): Promise<void> => {
    try {
      await origensApi.excluir(id);
    } catch (err) {
      console.error(`Erro ao excluir origem (id: ${id}):`, err);
      throw err;
    }
    setOrigens((prev) => prev.filter((o) => o.id !== id));
  };

  const totalGanho = useMemo(
    () => clientes.reduce((sum, c) => sum + Number(c.valorCobrado || 0), 0),
    [clientes],
  );

  const value = useMemo(() => ({
    clientes,
    origens,
    loading,
    error,
    recarregar,
    addCliente: handleAddCliente,
    updateCliente: handleUpdateCliente,
    deleteCliente: handleDeleteCliente,
    addOrigem: handleAddOrigem,
    deleteOrigem: handleDeleteOrigem,
    totalGanho,
    totalClientes: clientes.length,
  }), [clientes, origens, loading, error, recarregar, totalGanho]);

  return (
    <CrmContext.Provider value={value}>
      {children}
    </CrmContext.Provider>
  );
}
