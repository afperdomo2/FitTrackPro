'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@fittrackpro/shared';
import { getToken, setToken, removeToken, decodeToken } from '@/lib/auth';
import type { LoginRequest, RegisterRequest, LoginResponse } from '../types';
import { useLogin, useRegister, useLogout } from '../api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      const claims = decodeToken(stored);
      if (claims && claims.exp * 1000 > Date.now()) {
        setTokenState(stored);
        setMustChangePassword(claims.must_change_password);
        setUser({
          id: claims.user_id,
          email: claims.email,
          name: claims.email,
          role: claims.role,
        });
      } else {
        removeToken();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      const result = await loginMutation.mutateAsync(data);
      setToken(result.token);
      setTokenState(result.token);
      setMustChangePassword(result.must_change_password);
      setUser(result.user);
      return result;
    },
    [loginMutation],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const result = await registerMutation.mutateAsync(data);
      setToken(result.token);
      setTokenState(result.token);
      setUser(result.user);
      return result;
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
    setTokenState(null);
  }, [logoutMutation]);

  const updateToken = useCallback((newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
    const claims = decodeToken(newToken);
    if (claims) {
      setMustChangePassword(claims.must_change_password);
      setUser({ id: claims.user_id, email: claims.email, name: claims.email, role: claims.role });
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      mustChangePassword,
      login,
      register,
      logout,
      updateToken,
    }),
    [user, token, isLoading, mustChangePassword, login, register, logout, updateToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
