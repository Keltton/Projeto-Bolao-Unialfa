import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '@/services/authService';
import { Usuario } from '@/types/Usuario';

type AuthContextData = {
  user: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o app, restaura sessão salva
  useEffect(() => {
    authService.getStoredSession()
      .then((session) => setUser(session?.usuario ?? null))
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(email: string, senha: string) {
    const { usuario } = await authService.login(email.trim(), senha);
    setUser(usuario);
  }

  async function signOut() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}