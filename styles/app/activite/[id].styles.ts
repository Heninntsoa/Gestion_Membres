import { StyleSheet } from 'react-native';

import type { Palette } from '@/constants/design';
import { radius, spacing, typography } from '@/constants/design';

export const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  imageWrapper: {
    height: 220,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
    gap: 6,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  typeBadgeText: {
    ...typography.labelSm,
    color: colors.white,
  },
  title: {
    ...typography.headlineLg,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    ...typography.bodyMd,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginTop: spacing.sm,
  },
  statusBannerText: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  qrCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  qrLabel: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  qrUsedText: {
    ...typography.labelMd,
    color: colors.statusValidated,
  },
});
