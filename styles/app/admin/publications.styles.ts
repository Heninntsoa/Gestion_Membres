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

  // List
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  listEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  listEmptyText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  author: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  date: {
    ...typography.labelSm,
    color: colors.textSecondary,
    fontSize: 11,
  },
  content: {
    ...typography.bodyMd,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    ...typography.labelSm,
    color: colors.textSecondary,
    fontSize: 11,
  },

  // Actions
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  actionBtnEdit: {
    backgroundColor: colors.badgeInfoBg,
  },
  actionBtnDelete: {
    backgroundColor: colors.badgeErrorBg,
  },

  // Pagination
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  paginationBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  paginationBtnDisabled: {
    opacity: 0.4,
  },
  paginationText: {
    ...typography.labelSm,
    color: colors.primary,
  },
  paginationInfo: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
