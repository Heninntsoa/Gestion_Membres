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
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
  },
  statsLabel: {
    ...typography.labelSm,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  statsValue: {
    ...typography.headlineSm,
    fontSize: 18,
    color: colors.statusValidated,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  progressPct: {
    ...typography.labelMd,
    color: colors.textPrimary,
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
  nextCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  nextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  nextIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  nextBadgeText: {
    ...typography.labelSm,
    color: colors.white,
  },
  nextTitle: {
    ...typography.headlineSm,
    fontSize: 17,
    color: colors.white,
  },
  nextMeta: {
    ...typography.bodySm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  nextBtn: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  nextBtnText: {
    ...typography.labelMd,
    color: colors.primary,
  },
  sectionTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
  },
  itemImagePlaceholder: {
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  itemDate: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    ...typography.labelSm,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
