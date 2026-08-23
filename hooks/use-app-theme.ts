import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type Palette } from '@/constants/design';
import { useThemeStore, type ThemeMode } from '@/store/theme-store';

export type { ThemeMode };

/**
 * Hook central du thème de l'app.
 * - `mode` : préférence choisie dans les paramètres (clair / sombre / système)
 * - `colors` : palette résolue à utiliser partout dans les écrans
 */
export function useAppTheme(): {
  mode: ThemeMode;
  isDark: boolean;
  colors: Palette;
  setMode: (mode: ThemeMode) => Promise<void>;
} {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const systemScheme = useColorScheme();

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const colors: Palette = isDark ? darkColors : lightColors;

  return { mode, isDark, colors, setMode };
}
