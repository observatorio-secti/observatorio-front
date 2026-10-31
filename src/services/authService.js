// src/services/authService.js

import axios from 'axios';
import { authStorage } from '../lib/auth-storage';

function resolveIdpBaseUrl() {
  const envUrl = import.meta.env.VITE_IDP_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
  }
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:8000/';
  }
  return 'https://observatoriocti.secti.ba.gov.br/idp/';
}

export const baseURLIdp = resolveIdpBaseUrl();

const httpIdp = axios.create({
  timeout: 10000,
});

function base64UrlEncode(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function generatePKCE() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = base64UrlEncode(array);

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = base64UrlEncode(digest);

  return { codeVerifier, codeChallenge };
}

export const authService = {
  getCallbackUrl() {
    const origin = window.location.origin;
    return `${origin}/auth/callback`;
  },

  /**
   * Inicia o fluxo de autorização OIDC / PKCE redirecionando o usuário para o Observatório IdP.
   */
  async redirectToLogin(provider) {
    authStorage.saveRedirectUrl(window.location.pathname + window.location.search);
    const { codeVerifier, codeChallenge } = await generatePKCE();
    const state = Math.random().toString(36).substring(2, 15);
    authStorage.savePkceVerifier(codeVerifier, state);

    const redirectUri = this.getCallbackUrl();

    if (provider) {
      const pkcePayload = {
        client_id: 'observatorio',
        redirect_uri: redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        orig_state: state,
      };
      const b64 = btoa(JSON.stringify(pkcePayload))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      window.location.href = `${baseURLIdp}auth/${provider}/login?state=pkce_${b64}`;
      return;
    }

    const params = new URLSearchParams({
      client_id: 'observatorio',
      redirect_uri: redirectUri,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    });

    window.location.href = `${baseURLIdp}authorize?${params.toString()}`;
  },

  /**
   * Troca authorization code pelo par de tokens no IdP.
   */
  async exchangeCodeForToken(code, codeVerifier) {
    const redirectUri = this.getCallbackUrl();
    const { data } = await httpIdp.post(
      `${baseURLIdp}token`,
      {
        grant_type: 'authorization_code',
        client_id: 'observatorio',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  /**
   * Renova o token de acesso no IdP.
   */
  async refreshToken() {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const { data } = await httpIdp.post(
      `${baseURLIdp}token`,
      {
        grant_type: 'refresh_token',
        client_id: 'observatorio',
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  },

  /**
   * Busca dados do perfil autenticado no IdP.
   */
  async getCurrentUser(explicitToken) {
    const token = explicitToken || authStorage.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const { data } = await httpIdp.get(`${baseURLIdp}me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      id: data.id,
      name: data.name || (data.email ? data.email.split('@')[0] : 'Usuário'),
      email: data.email,
      role: data.role || 'DEFAULT',
      avatarUrl: data.avatar_url || null,
    };
  },
};
