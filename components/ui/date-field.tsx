import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { makeStyles } from '@/styles/components/ui/date-field.styles';

interface DateFieldProps {
  label: string;
  value: string; // format YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  placeholder?: string;
}

function toDate(value: string): Date {
  const parsed = value ? new Date(value) : null;
  if (parsed && !isNaN(parsed.getTime())) return parsed;
  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() - 18);
  return fallback;
}

function formatDisplay(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function toIsoDateOnly(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DateField({
  label,
  value,
  onChange,
  error,
  maximumDate,
  minimumDate,
  placeholder = 'Sélectionner une date',
}: DateFieldProps) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: { type: string }, selectedDate?: Date) => {
    // Sur Android, le picker se ferme tout seul après le choix (ou l'annulation).
    if (Platform.OS === 'android') setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      onChange(toIsoDateOnly(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.inputWrapper, !!error && styles.inputWrapperError]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}>
        <MaterialIcons name="cake" size={20} color={colors.outline} style={styles.icon} />
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value ? formatDisplay(value) : placeholder}
        </Text>
        <MaterialIcons name="calendar-today" size={18} color={colors.outline} />
      </TouchableOpacity>
      {!!error && <Text style={styles.error}>{error}</Text>}

      {showPicker && (
        <DateTimePicker
          value={toDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}

      {showPicker && Platform.OS === 'ios' && (
        <TouchableOpacity style={styles.iosDoneBtn} onPress={() => setShowPicker(false)}>
          <Text style={styles.iosDoneText}>Valider</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
