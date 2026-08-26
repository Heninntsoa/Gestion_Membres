import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing, type Palette } from '@/constants/design';
import { ErrorCard } from '@/components/ui/error-card';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getApiErrorMessage } from '@/lib/api';
import { cotisationsService } from '@/lib/services/cotisations';
import type { Cotisation } from '@/types/cotisation';

import { makeStyles } from '@/styles/app/(tabs)/cotisations.styles';
const makeStatutStyle = (
  colors: Palette
): Record<Cotisation['statut'], { bg: string; label: string }> => ({
  ouverte: { bg: colors.badgeSuccessBg, label: 'Ouverte' },
  cloturee: { bg: colors.badgeWarningBg, label: 'Clôturée' },
  archivee: { bg: colors.badgeNeutralBg, label: 'Archivée' },
});

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function CotisationsScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const statutStyle = makeStatutStyle(colors);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const data = await cotisationsService.getToutes();
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

      {!!errorMsg && <ErrorCard message={errorMsg} />}

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
          !loading ? <Text style={styles.emptyText}>Aucune cotisation.</Text> : null
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

