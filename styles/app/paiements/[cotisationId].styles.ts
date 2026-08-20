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
    padding: spacing.lg,
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
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    ...typography.headlineSm,
    color: colors.textPrimary,
  },
  summaryMontant: {
    ...typography.headlineLg,
    color: colors.statusValidated,
    marginTop: 4,
  },
  summaryMeta: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  label: {
    ...typography.labelMd,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  modesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  modeChipActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  modeChipText: {
    ...typography.labelMd,
    color: colors.textSecondary,
  },
  modeChipTextActive: {
    color: colors.white,
  },
  modeInfo: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginTop: spacing.sm,
    gap: 2,
  },
  modeInfoText: {
    ...typography.bodySm,
    color: colors.textPrimary,
  },
  uploadBox: {
    height: 140,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  uploadText: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  successTitle: {
    ...typography.headlineLg,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  successText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
