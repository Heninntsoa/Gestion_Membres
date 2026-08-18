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
  },

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
  },
  statChipActive: {
    backgroundColor: colors.primaryContainer,
  },
  statNumber: {
    ...typography.headlineSm,
    color: colors.textPrimary,
    fontSize: 18,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.textSecondary,
    fontSize: 10,
  },

  // Search
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMd,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
  },

  // Filter chips
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.labelSm,
    color: colors.textSecondary,
    fontSize: 11,
  },
  filterChipTextActive: {
    color: colors.white,
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

  // Member card
  memberCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
  },
  memberAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  memberEmail: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  memberMeta: {
    ...typography.labelSm,
    color: colors.textSecondary,
    fontSize: 11,
  },
  memberActions: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusActive: {
    backgroundColor: '#DFF5E1',
  },
  statusDisabled: {
    backgroundColor: '#FEE2E2',
  },
  statusRefused: {
    backgroundColor: '#F3E8FF',
  },
  statusText: {
    ...typography.labelSm,
    fontSize: 10,
    fontWeight: '600',
  },
  statusTextPending: {
    color: '#92400E',
  },
  statusTextActive: {
    color: '#065F46',
  },
  statusTextDisabled: {
    color: '#991B1B',
  },
  statusTextRefused: {
    color: '#6B21A8',
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  actionBtnActivate: {
    backgroundColor: '#DFF5E1',
  },
  actionBtnDeactivate: {
    backgroundColor: '#FEE2E2',
  },
  actionBtnRefuse: {
    backgroundColor: '#F3E8FF',
  },
  actionBtnText: {
    ...typography.labelSm,
    fontSize: 10,
  },
  actionBtnTextActivate: {
    color: '#065F46',
  },
  actionBtnTextDeactivate: {
    color: '#991B1B',
  },
  actionBtnTextRefuse: {
    color: '#6B21A8',
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
