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
    fontSize: 16,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  totalLabel: {
    ...typography.bodySm,
    color: '#DFF5E1',
  },
  totalValue: {
    ...typography.headlineLg,
    color: colors.white,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm + 4,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  itemMeta: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemMontant: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    ...typography.labelSm,
  },
  expandedBox: {
    marginTop: 6,
    gap: 2,
  },
  expandedLine: {
    ...typography.labelSm,
    color: colors.textSecondary,
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
