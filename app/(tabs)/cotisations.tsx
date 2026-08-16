import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { cotisationsService } from '@/lib/services/cotisations';
import type { Cotisation } from '@/types/cotisation';

const statutStyle: Record<Cotisation['statut'], { bg: string; label: string }> = {
  ouverte: { bg: '#DFF5E1', label: 'Ouverte' },
  cloturee: { bg: '#FEF3C7', label: 'Clôturée' },
  archivee: { bg: '#F3F4F6', label: 'Archivée' },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CotisationsScreen() {
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const data = await cotisationsService.getDisponibles();
      setCotisations(data);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les cotisations.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cotisations</Text>
        <TouchableOpacity onPress={() => router.push('/paiements/historique')}>
          <Text style={styles.historiqueLink}>Historique</Text>
        </TouchableOpacity>
      </View>

      {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <FlatList
        data={cotisations}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>Aucune cotisation disponible.</Text> : null
        }
        renderItem={({ item }) => {
          const badge = statutStyle[item.statut];
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.titre}</Text>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={styles.badgeText}>{badge.label}</Text>
                </View>
              </View>
              {!!item.description && <Text style={styles.description}>{item.description}</Text>}
              <View style={styles.metaRow}>
                <MaterialIcons name="payments" size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>{Number(item.montant).toLocaleString('fr-FR')} Ar</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{item.type_nom}</Text>
              </View>
              {!!item.date_limite && (
                <View style={styles.metaRow}>
                  <MaterialIcons name="event" size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>Date limite : {formatDate(item.date_limite)}</Text>
                </View>
              )}
              {item.statut === 'ouverte' && (
                <TouchableOpacity
                  style={styles.payBtn}
                  onPress={() => router.push(`/paiements/${item.id}`)}>
                  <MaterialIcons name="credit-card" size={16} color={colors.white} />
                  <Text style={styles.payBtnText}>Payer ma cotisation</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

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
  },
  historiqueLink: {
    ...typography.labelMd,
    color: colors.statusValidated,
  },
  title: {
    ...typography.headlineLg,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm + 4,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.textPrimary,
  },
  description: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  metaDot: {
    color: colors.textSecondary,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.statusValidated,
    borderRadius: radius.md,
    paddingVertical: 10,
    marginTop: 6,
  },
  payBtnText: {
    ...typography.labelMd,
    color: colors.white,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
