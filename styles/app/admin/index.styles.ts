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

  // Filter button + modal
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    ...typography.labelMd,
    color: colors.primary,
  },
  filterButtonTextActive: {
    color: colors.onPrimary,
  },
  filterBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    ...typography.labelSm,
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  filterReset: {
    ...typography.labelSm,
    color: colors.error,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    maxHeight: '80%',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.outlineVariant,
    marginBottom: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    ...typography.headlineSm,
    color: colors.textPrimary,
  },
  modalSectionTitle: {
    ...typography.labelMd,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  modalOptionActive: {
    backgroundColor: colors.primaryContainer,
  },
  modalOptionText: {
    ...typography.bodyMd,
    color: colors.textPrimary,
  },
  modalOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
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
    color: colors.onPrimary,
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
    backgroundColor: colors.badgeWarningBg,
  },
  statusActive: {
    backgroundColor: colors.badgeSuccessBg,
  },
  statusDisabled: {
    backgroundColor: colors.badgeErrorBg,
  },
  statusRefused: {
    backgroundColor: colors.badgePurpleBg,
  },
  statusText: {
    ...typography.labelSm,
    fontSize: 10,
    fontWeight: '600',
  },
  statusTextPending: {
    color: colors.badgeWarningText,
  },
  statusTextActive: {
    color: colors.badgeSuccessText,
  },
  statusTextDisabled: {
    color: colors.badgeErrorText,
  },
  statusTextRefused: {
    color: colors.badgePurpleText,
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
    backgroundColor: colors.badgeSuccessBg,
  },
  actionBtnDeactivate: {
    backgroundColor: colors.badgeErrorBg,
  },
  actionBtnRefuse: {
    backgroundColor: colors.badgePurpleBg,
  },
  actionBtnText: {
    ...typography.labelSm,
    fontSize: 10,
  },
  actionBtnTextActivate: {
    color: colors.badgeSuccessText,
  },
  actionBtnTextDeactivate: {
    color: colors.badgeErrorText,
  },
  actionBtnTextRefuse: {
    color: colors.badgePurpleText,
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
