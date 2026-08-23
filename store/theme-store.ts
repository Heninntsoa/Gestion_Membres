import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_KEY = 'idem_theme_mode';

interface ThemeState {
  /** Préférence utilisateur : clair, sombre ou suivi du système */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  hydrate: () => Promise<void>;
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',

  setMode: async (mode) => {
    set({ mode });
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch {
      // silencieux : la préférence restera en mémoire pour cette session
    }
  },

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (isThemeMode(stored)) {
        set({ mode: stored });
      }
    } catch {
      // silencieux : on garde 'system'
    }
  },
}));
