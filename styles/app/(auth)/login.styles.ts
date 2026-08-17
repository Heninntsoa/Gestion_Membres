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
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.surface,
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
  },
  title: {
    ...typography.headlineLg,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formError: {
    ...typography.bodySm,
    color: colors.error,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  switchText: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  switchLink: {
    ...typography.labelMd,
    color: colors.primary,
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
});
