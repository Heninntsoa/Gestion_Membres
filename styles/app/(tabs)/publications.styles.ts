import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/design';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.headlineLg,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
