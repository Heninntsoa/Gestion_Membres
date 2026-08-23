import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type ThemeMode } from '@/hooks/use-app-theme';
import {
  getNotificationsEnabled,
  setPushNotificationsEnabled,
} from '@/lib/services/push-notifications';

import { makeStyles } from '@/styles/app/profil/parametres.styles';

const APP_VERSION = '1.0.0';

type NavRow = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route: string;
};

type ThemeOption = {
  mode: ThemeMode;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
};

const HISTORY_ROWS: NavRow[] = [
  { icon: 'history', label: 'Historique des activités', route: '/participations' },
  { icon: 'receipt-long', label: 'Historique des paiements', route: '/paiements/historique' },
];

const ACCOUNT_ROWS: NavRow[] = [
  { icon: 'person-outline', label: 'Modifier le profil', route: '/profil/edit' },
  { icon: 'lock-outline', label: 'Changer le mot de passe', route: '/profil/change-password' },
];

const THEME_OPTIONS: ThemeOption[] = [
  { mode: 'light', icon: 'light-mode', label: 'Clair' },
  { mode: 'dark', icon: 'dark-mode', label: 'Sombre' },
  { mode: 'system', icon: 'brightness-auto', label: 'Système' },
];

export default function ParametresScreen() {
  const { colors, mode, setMode } = useAppTheme();
  const styles = makeStyles(colors);

  const [notifActive, setNotifActive] = useState(true);
  const [savingNotif, setSavingNotif] = useState(false);

  useEffect(() => {
    getNotificationsEnabled().then(setNotifActive);
  }, []);

  const handleToggleNotifications = async (value: boolean) => {
    const previous = notifActive;
    setNotifActive(value);
    setSavingNotif(true);
    try {
      await setPushNotificationsEnabled(value);
    } catch {
      setNotifActive(previous);
    } finally {
      setSavingNotif(false);
    }
  };

  const renderNavRow = (row: NavRow, isLast?: boolean) => (
    <TouchableOpacity
      key={row.route}
      style={[styles.row, isLast && styles.rowLast]}
      activeOpacity={0.6}
      onPress={() => router.push(row.route as never)}>
      <View style={styles.rowIcon}>
        <MaterialIcons name={row.icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.rowLabel}>{row.label}</Text>
      <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Apparence */}
        <Text style={styles.sectionTitle}>Apparence</Text>
        <View style={styles.card}>
          {THEME_OPTIONS.map((option, index) => {
            const selected = mode === option.mode;
            return (
              <TouchableOpacity
                key={option.mode}
                style={[styles.row, index === THEME_OPTIONS.length - 1 && styles.rowLast]}
                activeOpacity={0.6}
                onPress={() => void setMode(option.mode)}>
                <View style={styles.rowIcon}>
                  <MaterialIcons name={option.icon} size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{option.label}</Text>
                  {option.mode === 'system' && (
                    <Text style={styles.rowSubtitle}>Suit le thème de votre appareil</Text>
                  )}
                </View>
                <MaterialIcons
                  name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={20}
                  color={selected ? colors.primary : colors.outline}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowNoChevron]}>
            <View style={styles.rowIcon}>
              <MaterialIcons name="notifications-active" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Notifications push</Text>
              <Text style={styles.rowSubtitle}>
                Recevoir les alertes de l&apos;association sur cet appareil
              </Text>
            </View>
            {savingNotif ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Switch
                value={notifActive}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.outlineVariant, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.outlineVariant}
              />
            )}
          </View>
        </View>

        {/* Historiques */}
        <Text style={styles.sectionTitle}>Historiques</Text>
        <View style={styles.card}>{HISTORY_ROWS.map((row) => renderNavRow(row))}</View>

        {/* Compte */}
        <Text style={styles.sectionTitle}>Compte</Text>
        <View style={styles.card}>{ACCOUNT_ROWS.map((row) => renderNavRow(row))}</View>

        {/* À propos */}
        <Text style={styles.sectionTitle}>À propos</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowNoChevron]}>
            <View style={styles.rowIcon}>
              <MaterialIcons name="info-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.rowLabel}>Version de l&apos;application</Text>
            <Text style={styles.versionText}>{APP_VERSION}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
