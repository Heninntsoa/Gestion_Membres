import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PublicationCard } from '@/components/publication-card';
import { colors, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { publicationsService } from '@/lib/services/publications';
import { useAuthStore } from '@/store/auth-store';
import type { Publication } from '@/types/publication';

export default function PublicationsScreen() {
  const { user } = useAuthStore();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const res = await publicationsService.getAll(1, 20);
      setPublications(res.data);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les publications.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleLike = async (publication: Publication) => {
    if (!user) return;
    // Mise à jour optimiste
    setPublications((prev) =>
      prev.map((p) =>
        p.id === publication.id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    try {
      await publicationsService.toggleLike(publication.id, user.id);
    } catch {
      // rollback si échec
      setPublications((prev) =>
        prev.map((p) =>
          p.id === publication.id
            ? { ...p, liked: publication.liked, likes: publication.likes }
            : p
        )
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Publications</Text>
      </View>

      {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <FlatList
        data={publications}
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
          !loading ? <Text style={styles.emptyText}>Aucune publication pour le moment.</Text> : null
        }
        renderItem={({ item }) => (
          <PublicationCard
            publication={item}
            onToggleLike={() => handleToggleLike(item)}
            onCommentPress={() => router.push(`/publication/${item.id}`)}
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
