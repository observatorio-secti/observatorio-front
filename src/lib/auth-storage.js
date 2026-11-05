// src/lib/auth-storage.js

const TOKEN_KEY = 'obs_access_token';
const REFRESH_TOKEN_KEY = 'obs_refresh_token';
const PKCE_VERIFIER_KEY = 'obs_pkce_verifier';
const REDIRECT_URL_KEY = 'obs_auth_redirect';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name, value, days = 7) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function removeCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
}

export const authStorage = {
  getToken: () => {
    try {
      return getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      setCookie(TOKEN_KEY, token, 7);
    } catch (err) {
      console.error('Falha ao salvar access token:', err);
    }
  },

  getRefreshToken: () => {
    try {
      return getCookie(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  },

  setRefreshToken: (token) => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
      setCookie(REFRESH_TOKEN_KEY, token, 30);
    } catch (err) {
      console.error('Falha ao salvar refresh token:', err);
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      removeCookie(TOKEN_KEY);
      removeCookie(REFRESH_TOKEN_KEY);
    } catch (err) {
      console.error('Falha ao remover tokens:', err);
    }
  },

  savePkceVerifier: (verifier, state) => {
    try {
      sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
      localStorage.setItem(PKCE_VERIFIER_KEY, verifier);
      if (state) {
        sessionStorage.setItem(`${PKCE_VERIFIER_KEY}_state`, state);
        localStorage.setItem(`${PKCE_VERIFIER_KEY}_state`, state);
      }
    } catch (err) {
      console.error('Falha ao salvar verificador PKCE:', err);
    }
  },

  getPkceVerifier: () => {
    try {
      return (
        sessionStorage.getItem(PKCE_VERIFIER_KEY) ||
        localStorage.getItem(PKCE_VERIFIER_KEY) ||
        null
      );
    } catch {
      return null;
    }
  },

  consumePkceVerifier: () => {
    try {
      const verifier =
        sessionStorage.getItem(PKCE_VERIFIER_KEY) ||
        localStorage.getItem(PKCE_VERIFIER_KEY) ||
        null;
      sessionStorage.removeItem(PKCE_VERIFIER_KEY);
      sessionStorage.removeItem(`${PKCE_VERIFIER_KEY}_state`);
      localStorage.removeItem(PKCE_VERIFIER_KEY);
      localStorage.removeItem(`${PKCE_VERIFIER_KEY}_state`);
      return verifier;
    } catch {
      return null;
    }
  },

  saveRedirectUrl: (url) => {
    try {
      if (url && !url.includes('/auth/callback')) {
        sessionStorage.setItem(REDIRECT_URL_KEY, url);
      }
    } catch (err) {
      console.error('Falha ao salvar redirect URL:', err);
    }
  },

  consumeRedirectUrl: (defaultUrl = '/') => {
    try {
      const url = sessionStorage.getItem(REDIRECT_URL_KEY);
      sessionStorage.removeItem(REDIRECT_URL_KEY);
      if (!url || url.includes('/auth/callback')) {
        return defaultUrl;
      }
      return url;
    } catch {
      return defaultUrl;
    }
  },
};
