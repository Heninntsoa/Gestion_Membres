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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerTitle: {
    ...typography.headlineSm,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },

  // Publication summary
  publicationSummary: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  publicationTitle: {
    ...typography.labelMd,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  publicationAuthor: {
    ...typography.labelSm,
    color: colors.textSecondary,
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

  // Comment card
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
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  author: {
    ...typography.labelMd,
    color: colors.textPrimary,
    flex: 1,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    ...typography.labelSm,
    color: colors.textSecondary,
    fontSize: 11,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: '#FEE2E2',
  },
  deleteBtnText: {
    ...typography.labelSm,
    color: colors.error,
    fontSize: 11,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
