import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/activity-card';
import { ErrorCard } from '@/components/ui/error-card';
import { Logo } from '@/components/ui/logo';
import { PublicationCard } from '@/components/publication-card';
import { colors, spacing } from '@/constants/design';
import { activitesService, participationsService } from '@/lib/services/activites';
import { publicationsService } from '@/lib/services/publications';
import { notificationsService } from '@/lib/services/notifications';
import { getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import type { Activite } from '@/types/activite';
import type { Publication } from '@/types/publication';

import { styles } from '@/styles/app/(tabs)/index.styles';

export default function HomeScreen() {
  const { user, refreshMe } = useAuthStore();

  const [activites, setActivites] = useState<Activite[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [myIds, setMyIds] = useState<number[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const [act, pubs, ids, unread] = await Promise.all([
        activitesService.getAll(),
        publicationsService.getAll(1, 5),
        participationsService.getMyParticipationIds(),
        notificationsService.getUnreadCount(),
      ]);
      setActivites(act);
      setPublications(pubs.data);
      setMyIds(ids);
      setUnreadCount(unread);
      refreshMe();
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger le tableau de bord.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshMe]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const upcoming = activites
    .filter((a) => a.statut !== 'annulee' && a.statut !== 'terminee')
    .slice(0, 3);

  const validatedCount = myIds.length;
  const progressPct = activites.length > 0 ? Math.min(100, Math.round((validatedCount / activites.length) * 100)) : 0;

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
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Logo variant="full" height={50} style={{ borderRadius: 12 }} />
          <TouchableOpacity onPress={() => router.push('/notifications')} hitSlop={8}>
            <View>
              <MaterialIcons name="notifications-none" size={26} color={colors.textPrimary} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.greetingCard}>
          <Text style={styles.greeting}>Bonjour, {user?.nom_complet?.split(' ')[0] ?? ''} !</Text>
          <Text style={styles.subGreeting}>Prêt pour vos prochaines actions pour le climat ?</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <MaterialIcons name="eco" size={20} color={colors.statusValidated} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statLabel}>MES PARTICIPATIONS</Text>
            <Text style={styles.statValue}>{progressPct}% validées</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
          </View>
        </View>

        {!!errorMsg && <ErrorCard message={errorMsg} />}

        {/* Dernières actualités */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dernières actualités</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/publications')}>
            <Text style={styles.sectionLink}>Tout voir →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.emptyText}>Chargement...</Text>
        ) : publications.length === 0 ? (
          <Text style={styles.emptyText}>Aucune actualité pour le moment.</Text>
        ) : (
          <FlatList
            data={publications}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.md }}
            renderItem={({ item }) => (
              <PublicationCard
                publication={item}
                compact
                onCommentPress={() => router.push(`/publication/${item.id}`)}
              />
            )}
          />
        )}

        {/* Activités à venir */}
        <View style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          <Text style={styles.sectionTitle}>Activités à venir</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/activites')}>
            <Text style={styles.sectionLink}>Voir tout →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.emptyText}>Chargement...</Text>
        ) : upcoming.length === 0 ? (
          <Text style={styles.emptyText}>Aucune activité à venir.</Text>
        ) : (
          upcoming.map((activite) => (
            <ActivityCard
              key={activite.id}
              activite={activite}
              isRegistered={myIds.includes(activite.id)}
              loading={joiningId === activite.id}
              onPress={() => router.push(`/activite/${activite.id}`)}
              onParticipatePress={() => handleParticipate(activite.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

