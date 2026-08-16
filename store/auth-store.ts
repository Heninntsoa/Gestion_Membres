import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { TOKEN_KEY, api, getApiErrorMessage, setOnUnauthorized } from '@/lib/api';
import type { LoginResponse, Membre, RegisterPayload } from '@/types/membre';

const USER_KEY = 'idem_user';

interface AuthState {
  user: Membre | null;
  token: string | null;
  /** true tant qu'on n'a pas fini de relire AsyncStorage au démarrage de l'app */
  isHydrating: boolean;
  isLoading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isHydrating: true,
  isLoading: false,
  error: null,

  hydrate: async () => {
    try {
      const [token, userRaw] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);
      set({
        token,
        user: userRaw ? (JSON.parse(userRaw) as Membre) : null,
      });
    } finally {
      set({ isHydrating: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
      set({ token: data.token, user: data.user, isLoading: false });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Email ou mot de passe incorrect.');
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register', payload);
      set({ isLoading: false });
    } catch (error) {
      const message = getApiErrorMessage(error, "Impossible de créer le compte.");
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    set({ token: null, user: null });
  },

  refreshMe: async () => {
    if (!get().token) return;
    try {
      const { data } = await api.get<Membre>('/auth/me');
      set({ user: data });
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
    } catch {
      // silencieux : si le token est invalide, l'interceptor 401 gère la déconnexion
    }
  },

  clearError: () => set({ error: null }),
}));

// Quand l'API renvoie 401 (token expiré/invalide), on déconnecte proprement l'utilisateur.
setOnUnauthorized(() => {
  useAuthStore.getState().logout();
});
