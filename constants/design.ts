/**
 * Design tokens — "Lumière Naturelle"
 * Extraits de maquette/lumière naturelle/DESIGN.md
 * Utilisés dans tout le projet pour garder une cohérence visuelle
 * avec les maquettes fournies (login, tableau de bord, cotisations, etc).
 */

export const colors = {
  primary: '#084012',
  primaryContainer: '#1f5c28',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#cbffc2',
  inversePrimary: '#88d982',

  secondary: '#735c00',
  secondaryContainer: '#fed65b',
  onSecondary: '#ffffff',

  background: '#f8faf7',
  surface: '#FFFFFF',
  surfaceContainer: '#eceeeb',
  surfaceContainerLow: '#f2f4f1',
  surfaceContainerHigh: '#e7e9e6',
  surfaceVariant: '#e1e3e0',

  outline: '#707a6c',
  outlineVariant: '#bfcaba',

  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  onBackground: '#191c1b',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',

  statusPending: '#F59E0B',
  statusValidated: '#1f5c28',
  statusRefused: '#DC2626',

  white: '#ffffff',
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  displayLg: { fontSize: 40, fontWeight: '800' as const, lineHeight: 48 },
  headlineLg: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  headlineMd: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  headlineSm: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLg: { fontSize: 18, fontWeight: '400' as const, lineHeight: 28 },
  bodyMd: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySm: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  labelMd: { fontSize: 14, fontWeight: '600' as const, lineHeight: 18 },
  labelSm: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
} as const;