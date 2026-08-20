import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/constants/design';
import { ErrorCard } from '@/components/ui/error-card';
import { getApiErrorMessage } from '@/lib/api';
import { adminService, type AdminStats } from '@/lib/services/admin';

const MENU_ITEMS = [
  {
    key: 'membres',
    title: 'Membres',
    description: 'Gérer les inscriptions et les comptes',
    icon: 'people' as const,
    route: '/admin',
    color: '#059669',
  },
  {
    key: 'activites',
    title: 'Activités',
    description: 'Créer et gérer les activités',
    icon: 'event' as const,
    route: '/admin/activites',
    color: '#2563EB',
  },
  {
    key: 'publications',
    title: 'Publications',
    description: 'Publier et modérer le contenu',
    icon: 'article' as const,
    route: '/admin/publications',
    color: '#7C3AED',
  },
  {
    key: 'cotisations',
    title: 'Cotisations',
    description: 'Gérer les cotisations et montants',
    icon: 'payments' as const,
    route: '/admin/cotisations',
    color: '#D97706',
  },
  {
    key: 'paiements',
    title: 'Paiements',
    description: 'Valider ou refuser les paiements',
    icon: 'receipt-long' as const,
    route: '/admin/paiements',
    color: '#DC2626',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'Consulter les notifications',
    icon: 'notifications' as const,
    route: '/admin/notifications',
    color: '#6B7280',
  },
];

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les statistiques.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Administration</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Stats summary */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: '#DFF5E1' }]}>
              <Text style={[styles.statNumber, { color: '#065F46' }]}>{stats.actifs}</Text>
              <Text style={styles.statLabel}>Actifs</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.statNumber, { color: '#92400E' }]}>{stats.en_attente}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.statNumber, { color: '#991B1B' }]}>{stats.desactives}</Text>
              <Text style={styles.statLabel}>Désactivés</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
              <Text style={[styles.statNumber, { color: '#6B21A8' }]}>{stats.refuses}</Text>
              <Text style={styles.statLabel}>Refusés</Text>
            </View>
          </View>
        )}

        {!!errorMsg && <ErrorCard message={errorMsg} />}

        {/* Menu grid */}
        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.menuCard}
              activeOpacity={0.7}
              onPress={() => router.push(item.route as any)}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <MaterialIcons name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerTitle: {
    ...typography.headlineSm,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  statNumber: {
    ...typography.headlineSm,
    fontSize: 20,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.textSecondary,
    fontSize: 10,
  },

  // Menu
  menuGrid: {
    gap: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    ...typography.labelMd,
    color: colors.textPrimary,
    flex: 1,
  },
  menuDescription: {
    ...typography.bodySm,
    color: colors.textSecondary,
    flex: 2,
    fontSize: 12,
  },

});
