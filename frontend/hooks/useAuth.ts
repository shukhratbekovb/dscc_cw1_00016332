import { useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { authApi } from '@/lib/api';
import type { LoginRequest, RegisterRequest } from '@/lib/types';

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const logout = useAuthStore((state) => state.logout);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const response = await authApi.login(credentials);
        const { access, refresh, user: userData } = response.data;
        setTokens(access, refresh);
        setUser(userData);
        return { success: true };
      } catch (error: any) {
        const message = error.response?.data?.detail || 'Login failed';
        return { success: false, error: message };
      }
    },
    [setTokens, setUser]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        const response = await authApi.register(data);
        const { access, refresh, user: userData } = response.data;
        setTokens(access, refresh);
        setUser(userData);
        return { success: true };
      } catch (error: any) {
        const message = error.response?.data?.detail || 'Registration failed';
        return { success: false, error: message };
      }
    },
    [setTokens, setUser]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    isAuthenticated: !!accessToken && !!user,
    user,
    login,
    register,
    logout: handleLogout,
  };
}
