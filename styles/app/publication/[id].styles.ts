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
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  commentsTitle: {
    ...typography.labelMd,
    color: colors.textSecondary,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentBubble: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  commentAuthor: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  commentText: {
    ...typography.bodySm,
    color: colors.textPrimary,
    marginTop: 2,
  },
  commentMetaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  commentDate: {
    ...typography.labelSm,
    color: colors.outline,
  },
  deleteLink: {
    ...typography.labelSm,
    color: colors.error,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.statusValidated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});
