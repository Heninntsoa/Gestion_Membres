import { StyleSheet } from 'react-native';

import type { Palette } from '@/constants/design';
import { spacing, typography } from '@/constants/design';

export const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.md,
  },
  hint: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  successTitle: {
    ...typography.headlineLg,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  successText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
