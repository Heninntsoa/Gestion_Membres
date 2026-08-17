import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/design';

export const styles = StyleSheet.create({
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
  },
  headerTitle: {
    ...typography.headlineSm,
    fontSize: 17,
    color: colors.textPrimary,
  },
  markAllText: {
    ...typography.labelMd,
    color: colors.statusValidated,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm + 4,
  },
  itemUnread: {
    backgroundColor: '#F3FBF3',
    borderColor: colors.primaryContainer,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#DFF5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  itemMessage: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemDate: {
    ...typography.labelSm,
    color: colors.outline,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.statusValidated,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
