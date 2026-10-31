// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authStorage } from '../lib/auth-storage';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => authStorage.getToken());

  const {
    data: user = null,
    isLoading: isUserLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const activeToken = authStorage.getToken();
      if (!activeToken) return null;
      try {
        return await authService.getCurrentUser();
      } catch (err) {
        return null;
      }
    },
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const login = useCallback((provider) => {
    authService.redirectToLogin(provider);
  }, []);

  const handleAuthCallback = useCallback(
    async ({ code, token: directToken }) => {
      let activeAccessToken = directToken;

      if (code) {
        const verifier = authStorage.consumePkceVerifier();
        if (!verifier) {
          throw new Error('Sessão de autorização inválida ou expirada (código PKCE ausente).');
        }
        const tokenResponse = await authService.exchangeCodeForToken(code, verifier);
        activeAccessToken = tokenResponse.access_token;
        if (tokenResponse.refresh_token) {
          authStorage.setRefreshToken(tokenResponse.refresh_token);
        }
      }

      if (!activeAccessToken) {
        throw new Error('Nenhum código ou token de autorização fornecido.');
      }

      authStorage.setToken(activeAccessToken);
      setToken(activeAccessToken);
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      await refetch();
      const redirectUrl = authStorage.consumeRedirectUrl('/');
      return redirectUrl;
    },
    [queryClient, refetch]
  );

  const logout = useCallback(() => {
    authStorage.removeToken();
    setToken(null);
    queryClient.setQueryData(['auth', 'me'], null);
  }, [queryClient]);

  // Sincroniza se o cookie mudar em outra aba ou na navegação
  useEffect(() => {
    const checkCookieSync = () => {
      const currentToken = authStorage.getToken();
      if (currentToken !== token) {
        setToken(currentToken);
        if (currentToken) {
          queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        } else {
          queryClient.setQueryData(['auth', 'me'], null);
        }
      }
    };

    window.addEventListener('focus', checkCookieSync);
    return () => window.removeEventListener('focus', checkCookieSync);
  }, [token, queryClient]);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading: isUserLoading,
        login,
        logout,
        handleAuthCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>');
  }
  return context;
}
