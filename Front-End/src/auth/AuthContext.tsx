/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useState, useEffect, useMemo, ReactNode, useContext } from 'react';
import { isTokenValid } from '../shared/utils/token';
import { authApi, type AtualizaPerfilPayload } from '../shared/services/authApi';
import { SESSION_EXPIRED_EVENT, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../shared/services/api';

interface User {
  email: string;
  name: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  updateProfile: (payload: AtualizaPerfilPayload) => Promise<string | null>;
  logout: () => void;
}

const WELCOME_FLAG_KEY = 'crm:mostrar-boas-vindas';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function clearStoredSession() {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

// Limpa a flag de boas-vindas para que o proximo usuario do mesmo navegador
// nao veja a mensagem de quem usou o sistema antes.
function clearLocalData() {
  localStorage.removeItem(WELCOME_FLAG_KEY);
}

function readStoredUser(): User | null {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as User;
    const token = localStorage.getItem(TOKEN_STORAGE_KEY) || parsed.token;
    if (!isTokenValid(token)) {
      clearStoredSession();
      return null;
    }
    return parsed;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  // Persist current user session
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Route guard: revalida o token periodicamente para expulsar tokens
  // expirados/falsos mesmo com a aba aberta.
  useEffect(() => {
    const check = () => {
      setUser((prev) => {
        if (!prev) return prev;
        const token = localStorage.getItem(TOKEN_STORAGE_KEY) || prev.token;
        if (!isTokenValid(token)) {
          clearStoredSession();
          return null;
        }
        return prev;
      });
    };
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  // Um 401 da API (token invalidado/revogado) derruba a sessao na hora.
  useEffect(() => {
    const onExpired = () => {
      clearStoredSession();
      clearLocalData();
      setUser(null);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const data = await authApi.login(email.trim(), password);

      if (!data.token) return 'Não foi possível entrar.';

      // Salva o token do back-end
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

      // Marca que o popup de boas-vindas deve aparecer após o reload
      localStorage.setItem(WELCOME_FLAG_KEY, 'true');

      // Define o usuário (isso já atualiza o nome lá em cima no header)
      setUser({ email: data.email ?? email, name: data.nome ?? email, token: data.token });

      // Recarrega a pagina no painel para montar com a sessao nova
      window.location.href = '/dashboard';
      return null;
    } catch (error) {
      console.error('Erro no login:', error);
      return error instanceof Error && error.message ? error.message : 'Erro de conexão com o servidor.';
    }
  };

  const register = async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      await authApi.registro(name.trim(), email.trim(), password);
      return null;
    } catch (error) {
      console.error('Erro no registro:', error);
      return error instanceof Error && error.message ? error.message : 'Erro de conexão com o servidor.';
    }
  };

  // Atualiza nome e/ou senha da conta. Em caso de sucesso devolve null e o
  // novo nome ja aparece no header/localStorage.
  const updateProfile = async (payload: AtualizaPerfilPayload): Promise<string | null> => {
    try {
      const perfil = await authApi.atualizaPerfil(payload);
      setUser((prev) => {
        if (!prev) return prev;
        const atualizado: User = { ...prev, name: perfil.nome || prev.name };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(atualizado));
        return atualizado;
      });
      return null;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return error instanceof Error && error.message ? error.message : 'Erro de conexão com o servidor.';
    }
  };

  // Encerra a sessao: limpa o token e manda direto para a tela de login.
  const logout = () => {
    clearStoredSession();
    clearLocalData();
    setUser(null);
    window.location.href = '/login';
  };

  const value = useMemo(
    () => ({ user, login, register, updateProfile, logout }),
    [user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
