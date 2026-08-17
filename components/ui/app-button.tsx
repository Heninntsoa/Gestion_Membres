import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps,  } from 'react-native';

import { colors } from '@/constants/design';

import { styles } from '@/styles/components/ui/app-button.styles';
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

