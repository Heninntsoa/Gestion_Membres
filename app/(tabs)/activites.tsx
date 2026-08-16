/* eslint-disable import/no-duplicates */
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/activity-card';
import { colors, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { activitesService, participationsService } from '@/lib/services/activites';
import type { Activite } from '@/types/activite';
import { TouchableOpacity } from 'react-native';

export default function ActivitesScreen() {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [myIds, setMyIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const [act, ids] = await Promise.all([
        activitesService.getAll(),
        participationsService.getMyParticipationIds(),
      ]);
      setActivites(act);
      setMyIds(ids);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les activités.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleParticipate = async (activiteId: number) => {
    setJoiningId(activiteId);
    try {
      await participationsService.participate(activiteId);
      setMyIds((prev) => [...prev, activiteId]);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Impossible de s'inscrire à cette activité."));
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Activités</Text>
        <TouchableOpacity onPress={() => router.push('/participations')}>
          <Text style={styles.participationsLink}>Mes participations</Text>
        </TouchableOpacity>
      </View>

      {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <FlatList
        data={activites}
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
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>Aucune activité disponible.</Text> : null
        }
        renderItem={({ item }) => (
          <ActivityCard
            activite={item}
            isRegistered={myIds.includes(item.id)}
            loading={joiningId === item.id}
            onPress={() => router.push(`/activite/${item.id}`)}
            onParticipatePress={() => handleParticipate(item.id)}
          />
        )}
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
  participationsLink: {
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
