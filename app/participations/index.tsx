import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/design';
import { ErrorCard } from '@/components/ui/error-card';
import { getApiErrorMessage } from '@/lib/api';
import { participationsService } from '@/lib/services/activites';
import type { MaParticipation, StatutParticipation } from '@/types/participation';

import { styles } from '@/styles/app/participations/index.styles';
const statutConfig: Record<StatutParticipation, { bg: string; color: string; label: string }> = {
  valide: { bg: '#DFF5E1', color: colors.statusValidated, label: 'Validé' },
  present: { bg: '#DFF5E1', color: colors.statusValidated, label: 'Présent' },
  inscrit: { bg: '#FEF3C7', color: '#B45309', label: 'Inscrit' },
  en_attente: { bg: '#FEF3C7', color: '#B45309', label: 'En attente' },
  absent: { bg: '#FEE2E2', color: colors.error, label: 'Absent' },
  annule: { bg: '#F3F4F6', color: colors.textSecondary, label: 'Annulé' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function formatHeure(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function MesParticipationsScreen() {
  const [participations, setParticipations] = useState<MaParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const data = await participationsService.getMyParticipations(100);
      setParticipations(
        [...data].sort(
          (a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime()
        )
      );
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger vos participations.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const now = Date.now();
  const validatedCount = participations.filter(
    (p) => p.statut === 'valide' || p.statut === 'present'
  ).length;
  const objectifPct = participations.length > 0
    ? Math.min(100, Math.round((validatedCount / participations.length) * 100))
    : 0;

  const prochaine = participations
    .filter((p) => new Date(p.date_debut).getTime() > now && p.statut !== 'annule')
    .sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime())[0];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes participations</Text>
        <View style={{ width: 24 }} />
      </View>

      {!!errorMsg && <ErrorCard message={errorMsg} />}

      <FlatList
        data={participations}
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
          <View style={{ gap: spacing.md, marginBottom: spacing.md }}>
            <View style={styles.statsCard}>
              <Text style={styles.statsLabel}>STATISTIQUES</Text>
              <Text style={styles.statsValue}>
                {validatedCount} action{validatedCount > 1 ? 's' : ''} validée{validatedCount > 1 ? 's' : ''}
              </Text>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Objectif</Text>
                <Text style={styles.progressPct}>{objectifPct}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${objectifPct}%` }]} />
              </View>
            </View>

            {!!prochaine && (
              <TouchableOpacity
                style={styles.nextCard}
                onPress={() => router.push(`/activite/${prochaine.activitie_id}`)}>
                <View style={styles.nextHeader}>
                  <View style={styles.nextIcon}>
                    <MaterialIcons name="event" size={18} color={colors.white} />
                  </View>
                  <View style={styles.nextBadge}>
                    <Text style={styles.nextBadgeText}>À venir</Text>
                  </View>
                </View>
                <Text style={styles.nextTitle}>{prochaine.titre}</Text>
                <Text style={styles.nextMeta}>
                  {formatDate(prochaine.date_debut)} · {formatHeure(prochaine.date_debut)}
                </Text>
                <View style={styles.nextBtn}>
                  <Text style={styles.nextBtnText}>Voir les détails</Text>
                </View>
              </TouchableOpacity>
            )}

            <Text style={styles.sectionTitle}>Historique des demandes</Text>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="event-busy" size={48} color={colors.outline} />
              <Text style={styles.emptyText}>Vous n&apos;avez encore participé à aucune activité.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const cfg = statutConfig[item.statut];
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push(`/activite/${item.activitie_id}`)}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              ) : (
                <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
                  <MaterialIcons name="eco" size={20} color={colors.outline} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.titre}
                </Text>
                <Text style={styles.itemDate}>{formatDate(item.date_debut)}</Text>
                <View style={[styles.badge, { backgroundColor: cfg.bg, alignSelf: 'flex-start' }]}>
                  <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

