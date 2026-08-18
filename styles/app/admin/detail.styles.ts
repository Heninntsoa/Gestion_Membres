import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/design';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
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
    fontSize: 17,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // Profile card
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.headlineLg,
    fontSize: 22,
    color: colors.textPrimary,
  },
  matricule: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },

  // Status badge
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    marginTop: spacing.xs,
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
    ...typography.labelMd,
    fontSize: 13,
  },

  // Info section
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.labelMd,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoLabel: {
    ...typography.labelSm,
    color: colors.textSecondary,
    minWidth: 90,
  },
  infoValue: {
    ...typography.bodyMd,
    color: colors.textPrimary,
    flex: 1,
  },

  // Action buttons
  actionSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  actionBtn: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnActivate: {
    backgroundColor: '#059669',
  },
  actionBtnDeactivate: {
    backgroundColor: '#DC2626',
  },
  actionBtnRefuse: {
    backgroundColor: '#7C3AED',
  },
  actionBtnText: {
    ...typography.labelMd,
    fontSize: 15,
    color: colors.white,
  },

  // Error
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    textAlign: 'center',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
