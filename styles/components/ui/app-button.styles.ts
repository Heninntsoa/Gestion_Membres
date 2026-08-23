import { StyleSheet } from 'react-native';
import type { Palette } from '@/constants/design';
import { radius, typography } from '@/constants/design';

export const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    base: {
      borderRadius: radius.md,
      paddingVertical: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: colors.statusValidated,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.statusValidated,
    },
    disabled: {
      opacity: 0.6,
    },
    text: {
      ...typography.labelMd,
      fontSize: 16,
    },
    textPrimary: {
      color: colors.onPrimary,
    },
    textOutline: {
      color: colors.statusValidated,
    },
  });
