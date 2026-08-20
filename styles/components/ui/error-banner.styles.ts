import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/design';

export type BannerType = 'error' | 'success' | 'info' | 'warning';

export const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  /* ── Background per type ── */
  error: { backgroundColor: colors.errorContainer },
  success: { backgroundColor: '#DFF5E1' },
  info: { backgroundColor: '#E0F2FE' },
  warning: { backgroundColor: '#FEF3C7' },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    gap: 4,
  },

  /* ── Text color per type ── */
  message: {
    ...typography.bodySm,
  },
  message_error: { color: colors.error },
  message_success: { color: colors.statusValidated },
  message_info: { color: colors.primary },
  message_warning: { color: '#92400E' },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  actionText: {
    ...typography.labelMd,
  },

  closeButton: {
    padding: spacing.xs,
  },
});
