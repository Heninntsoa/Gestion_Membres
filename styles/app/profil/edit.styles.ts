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
    gap: spacing.sm,
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
  photoSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: 6,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.statusValidated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  uploadingText: {
    ...typography.labelSm,
    color: colors.textSecondary,
  },
  label: {
    ...typography.labelMd,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  chipText: {
    ...typography.labelMd,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
  },
  successTitle: {
    ...typography.headlineLg,
    color: colors.textPrimary,
  },
});
