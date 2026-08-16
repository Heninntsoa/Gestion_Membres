import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const TOKEN_KEY = 'idem_token';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Injecte automatiquement le token JWT (Bearer) sur chaque requête, s'il existe.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Callback appelé quand le token est invalide/expiré (401) — branché par le store d'auth
// pour déclencher une déconnexion propre + redirection vers /login.
let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

/**
 * Extrait un message d'erreur lisible depuis une erreur axios,
 * en tenant compte du format de réponse du backend yalim-api
 * ({ message }, { success:false, message }, ou tableau d'erreurs Joi).
 */
export function getApiErrorMessage(error: unknown, fallback = 'Une erreur est survenue.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    if (data?.message) return data.message;
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.map((e: any) => e.message ?? e).join('\n');
    }
    if (!error.response) return "Impossible de contacter le serveur. Vérifiez votre connexion.";
  }
  return fallback;
}
