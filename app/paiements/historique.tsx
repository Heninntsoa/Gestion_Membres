import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { paiementsService } from '@/lib/services/paiements';
import type { Paiement, StatutPaiement } from '@/types/paiement';

const statutConfig: Record<StatutPaiement, { bg: string; color: string; icon: keyof typeof MaterialIcons.glyphMap; label: string }> = {
  valide: { bg: '#DFF5E1', color: colors.statusValidated, icon: 'check-circle', label: 'Validé' },
  en_attente: { bg: '#FEF3C7', color: '#B45309', icon: 'schedule', label: 'En attente' },
  refuse: { bg: '#FEE2E2', color: colors.error, icon: 'cancel', label: 'Refusé' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function HistoriquePaiementsScreen() {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const data = await paiementsService.getMyPayments();
      setPaiements(
        [...data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Impossible de charger l'historique."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const total = paiements
    .filter((p) => p.statut === 'valide')
    .reduce((sum, p) => sum + Number(p.montant_paye), 0);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique des paiements</Text>
        <View style={{ width: 24 }} />
      </View>

      {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <FlatList
        data={paiements}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListHeaderComponent={
          paiements.length > 0 ? (
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total contributions validées</Text>
              <Text style={styles.totalValue}>{total.toLocaleString('fr-FR')} Ar</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="receipt-long" size={48} color={colors.outline} />
              <Text style={styles.emptyText}>Aucun paiement déclaré pour le moment.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const cfg = statutConfig[item.statut];
          const expanded = expandedId === item.id;
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => setExpandedId(expanded ? null : item.id)}
              activeOpacity={0.8}>
              <View style={[styles.itemIcon, { backgroundColor: cfg.bg }]}>
                <MaterialIcons name={cfg.icon} size={18} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.cotisation_nom ?? 'Cotisation'}</Text>
                <Text style={styles.itemMeta}>
                  {formatDate(item.created_at)} · {item.mode_nom ?? '—'}
                </Text>
                {expanded && (
                  <View style={styles.expandedBox}>
                    <Text style={styles.expandedLine}>
                      Référence : {item.reference_transfert}
                    </Text>
                    <Text style={styles.expandedLine}>
                      Montant attendu : {Number(item.montant_attendu).toLocaleString('fr-FR')} Ar
                    </Text>
                    {Number(item.difference) !== 0 && (
                      <Text
                        style={[
                          styles.expandedLine,
                          { color: Number(item.difference) < 0 ? colors.error : colors.statusValidated },
                        ]}>
                        Écart : {Number(item.difference) > 0 ? '+' : ''}
                        {Number(item.difference).toLocaleString('fr-FR')} Ar
                      </Text>
                    )}
                    {!!item.commentaire_admin && (
                      <Text style={[styles.expandedLine, { color: colors.error }]}>
                        Motif : {item.commentaire_admin}
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={styles.itemMontant}>
                  {Number(item.montant_paye).toLocaleString('fr-FR')} Ar
                </Text>
                <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
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
  headerTitle: {
    ...typography.headlineSm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  totalLabel: {
    ...typography.bodySm,
    color: '#DFF5E1',
  },
  totalValue: {
    ...typography.headlineLg,
    color: colors.white,
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm + 4,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  itemMeta: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemMontant: {
    ...typography.labelMd,
    color: colors.textPrimary,
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    ...typography.labelSm,
  },
  expandedBox: {
    marginTop: 6,
    gap: 2,
  },
  expandedLine: {
    ...typography.labelSm,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
