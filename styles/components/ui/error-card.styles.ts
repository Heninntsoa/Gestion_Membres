import { StyleSheet } from 'react-native';

import type { Palette } from '@/constants/design';
import { radius, spacing, typography } from '@/constants/design';

export const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.errorContainer,
      borderRadius: radius.md,
      padding: spacing.sm + 2,
      marginTop: spacing.sm,
    },
    message: {
      ...typography.bodySm,
      color: colors.error,
      flex: 1,
    },
  });
