import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/design';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
  },
  headerTitle: {
    ...typography.headlineSm,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 8,
  },
  avatarWrapper: {
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.headlineLg,
    fontSize: 20,
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  infoText: {
    ...typography.bodyMd,
    color: colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  badgeActive: {
    backgroundColor: '#DFF5E1',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.textPrimary,
  },
});
