import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { makeStyles } from '@/styles/components/ui/error-card.styles';

interface ErrorCardProps {
  /** Error message to display. */
  message: string;
}

/**
 * Inline error card — a light-red card with an error icon and the message.
 * Used to replace plain red `<Text>` error messages across the app.
 */
export function ErrorCard({ message }: ErrorCardProps) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.card}>
      <MaterialIcons name="error-outline" size={18} color={colors.error} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
