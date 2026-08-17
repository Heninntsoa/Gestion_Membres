import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/design';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm + 4,
    gap: 8,
  },
  cardCompact: {
    width: 240,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  author: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  date: {
    ...typography.labelSm,
    color: colors.textSecondary,
  },
  content: {
    ...typography.bodySm,
    color: colors.textPrimary,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    marginTop: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  actionText: {
    ...typography.labelSm,
    color: colors.textSecondary,
  },
});
