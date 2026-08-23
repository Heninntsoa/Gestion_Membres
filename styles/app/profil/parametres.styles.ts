import { StyleSheet } from 'react-native';

import type { Palette } from '@/constants/design';
import { radius, spacing, typography } from '@/constants/design';

export const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    headerTitle: {
      ...typography.headlineSm,
      color: colors.textPrimary,
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xxl,
      gap: spacing.xs,
    },
    sectionTitle: {
      ...typography.labelMd,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      fontSize: 11,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md - 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    rowNoChevron: {
      borderBottomWidth: 0,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowIcon: {
      width: 32,
      height: 32,
      borderRadius: radius.full,
      backgroundColor: colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowLabel: {
      flexShrink: 1,
      flex: 1,
      ...typography.bodyMd,
      color: colors.textPrimary,
    },
    rowSubtitle: {
      ...typography.bodySm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    versionText: {
      ...typography.labelMd,
      color: colors.textSecondary,
    },
    checkIcon: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
