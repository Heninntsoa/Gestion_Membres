import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { colors, radius, typography } from '@/constants/design';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

export function AppButton({
  title,
  loading,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      style={[
        styles.base,
        isOutline ? styles.outline : styles.primary,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.statusValidated : colors.white} />
      ) : (
        <Text style={[styles.text, isOutline ? styles.textOutline : styles.textPrimary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    color: colors.white,
  },
  textOutline: {
    color: colors.statusValidated,
  },
});
