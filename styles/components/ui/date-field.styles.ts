import { StyleSheet } from 'react-native';

import type { Palette } from '@/constants/design';
import { radius, spacing, typography } from '@/constants/design';

export const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: {
      gap: 6,
    },
    label: {
      ...typography.labelMd,
      color: colors.textSecondary,
      paddingHorizontal: 4,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.md,
      paddingHorizontal: spacing.sm + 4,
      paddingVertical: 12,
      backgroundColor: colors.surface,
    },
    inputWrapperError: {
      borderColor: colors.error,
    },
    icon: {
      marginRight: 8,
    },
    valueText: {
      flex: 1,
      ...typography.bodyMd,
      color: colors.textPrimary,
    },
    placeholderText: {
      color: colors.outline,
    },
    error: {
      ...typography.labelSm,
      color: colors.error,
      paddingHorizontal: 4,
    },
    iosDoneBtn: {
      alignSelf: 'flex-end',
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
    },
    iosDoneText: {
      ...typography.labelMd,
      color: colors.statusValidated,
    },
  });
