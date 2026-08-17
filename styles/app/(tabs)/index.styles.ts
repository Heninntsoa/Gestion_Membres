import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/design';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
  },
  headerTitle: {
    ...typography.headlineSm,
    color: colors.primary,
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  greeting: {
    ...typography.headlineLg,
    color: colors.textPrimary,
  },
  subGreeting: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm + 4,
    marginBottom: spacing.lg,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: '#DFF5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  statValue: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.statusValidated,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.headlineSm,
    fontSize: 17,
    color: colors.textPrimary,
  },
  sectionLink: {
    ...typography.labelMd,
    color: colors.statusValidated,
  },
  emptyText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    marginBottom: spacing.sm,
  },
});
