import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/design';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    ...typography.labelMd,
    color: colors.textSecondary,
    paddingHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 4,
    backgroundColor: colors.surface,
  },
  inputWrapperFocused: {
    borderColor: colors.statusValidated,
    borderWidth: 1.5,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  error: {
    ...typography.labelSm,
    color: colors.error,
    paddingHorizontal: 4,
  },
});
