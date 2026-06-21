import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '@/services/authService';
import { registerSessionExpiredCallback } from '@/services/authSession';
import { Usuario } from '@/types/Usuario';

type AuthContextData = {
  user: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (usuario: Usuario) => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerSessionExpiredCallback(() => setUser(null));

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

  async function updateUser(usuario: Usuario) {
    await authService.updateStoredUser(usuario);
    setUser(usuario);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signOut,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
