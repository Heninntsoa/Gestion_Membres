import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View,  } from 'react-native';

import { colors } from '@/constants/design';

import { styles } from '@/styles/components/ui/text-field.styles';
interface TextFieldProps extends TextInputProps {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  error?: string;
  isPassword?: boolean;
}

export function TextField({
  label,
  icon,
  error,
  isPassword,
  style,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={colors.outline}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.outline}
          secureTextEntry={secure}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure((s) => !s)} hitSlop={8}>
            <MaterialIcons
              name={secure ? 'visibility' : 'visibility-off'}
              size={20}
              color={colors.outline}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

