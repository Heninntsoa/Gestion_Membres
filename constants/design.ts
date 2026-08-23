/**
 * Design tokens — "Lumière Naturelle"
 * Extraits de maquette/lumière naturelle/DESIGN.md
 * Utilisés dans tout le projet pour garder une cohérence visuelle
 * avec les maquettes fournies (login, tableau de bord, cotisations, etc).
 */

export const lightColors = {
  primary: '#084012',
  primaryContainer: '#1f5c28',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#cbffc2',
  inversePrimary: '#88d982',

  secondary: '#735c00',
  secondaryContainer: '#fed65b',
  onSecondary: '#ffffff',

  // Contenu secondaire posé sur un fond `primary`
  onPrimarySoftBg: 'rgba(255,255,255,0.2)',
  onPrimaryMutedText: 'rgba(255,255,255,0.85)',

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

  // Pastilles / badges de statut (fond + texte)
  badgeSuccessBg: '#DFF5E1',
  badgeSuccessText: '#065F46',
  badgeWarningBg: '#FEF3C7',
  badgeWarningText: '#92400E',
  badgeErrorBg: '#FEE2E2',
  badgeErrorText: '#991B1B',
  badgeNeutralBg: '#F3F4F6',
  badgeNeutralText: '#6B7280',
  badgeInfoBg: '#DBEAFE',
  badgeInfoText: '#1E40AF',
  badgePurpleBg: '#F3E8FF',
  badgePurpleText: '#6B21A8',

  white: '#ffffff',
};

export const darkColors = {
  primary: '#88d982',
  primaryContainer: '#1b4f22',
  onPrimary: '#06330d',
  onPrimaryContainer: '#cbffc2',
  inversePrimary: '#084012',

  secondary: '#fed65b',
  secondaryContainer: '#4a3d00',
  onSecondary: '#3a3000',

  // Contenu secondaire posé sur un fond `primary`
  onPrimarySoftBg: 'rgba(6,51,13,0.12)',
  onPrimaryMutedText: 'rgba(6,51,13,0.8)',

  background: '#101410',
  surface: '#181c18',
  surfaceContainer: '#232823',
  surfaceContainerLow: '#1e231e',
  surfaceContainerHigh: '#282e28',
  surfaceVariant: '#3a4038',

  outline: '#9aa392',
  outlineVariant: '#3c423a',

  textPrimary: '#e6e9e6',
  textSecondary: '#9ca89c',
  onBackground: '#e0e4df',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',

  statusPending: '#F59E0B',
  statusValidated: '#88d982',
  statusRefused: '#f87171',

  // Pastilles / badges de statut (fond + texte)
  badgeSuccessBg: '#12351c',
  badgeSuccessText: '#88d982',
  badgeWarningBg: '#3a2d05',
  badgeWarningText: '#fbbf24',
  badgeErrorBg: '#3d1414',
  badgeErrorText: '#fca5a5',
  badgeNeutralBg: '#272c27',
  badgeNeutralText: '#9ca89c',
  badgeInfoBg: '#12293f',
  badgeInfoText: '#7cb8ff',
  badgePurpleBg: '#2a1740',
  badgePurpleText: '#c4a5ff',

  white: '#ffffff',
} as const;

export type Palette = typeof lightColors;

/** Alias rétro-compatible (palette claire par défaut). */
export const colors = lightColors;

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