/* eslint-disable import/no-duplicates */
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/activity-card';
import { ErrorCard } from '@/components/ui/error-card';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getApiErrorMessage } from '@/lib/api';
import { activitesService, participationsService } from '@/lib/services/activites';
import type { Activite } from '@/types/activite';
import { TouchableOpacity } from 'react-native';

import { makeStyles } from '@/styles/app/(tabs)/activites.styles';

export default function ActivitesScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
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

      {!!errorMsg && <ErrorCard message={errorMsg} />}

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

