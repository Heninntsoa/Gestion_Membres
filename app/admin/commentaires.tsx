import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { adminService } from '@/lib/services/admin';
import type { Commentaire } from '@/types/commentaire';

import { styles } from '@/styles/app/admin/commentaires.styles';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminCommentairesScreen() {
  const { publicationId, publicationTitle } = useLocalSearchParams<{
    publicationId: string;
    publicationTitle?: string;
  }>();

  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pubId = Number(publicationId);

  const load = useCallback(async () => {
    if (!pubId) return;
    setErrorMsg(null);
    setLoading(true);
    try {
      const result = await adminService.getCommentaires(pubId);
      setCommentaires(result);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les commentaires.'));
    } finally {
      setLoading(false);
    }
  }, [pubId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (commentId: number, contenu: string) => {
    const short = contenu.length > 50 ? contenu.slice(0, 50) + '…' : contenu;
    Alert.alert('Supprimer le commentaire', `Supprimer « ${short} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          setLoadingDelete(commentId);
          try {
            await adminService.deleteCommentaire(commentId);
            setCommentaires((prev) => prev.filter((c) => c.id !== commentId));
          } catch (error) {
            setErrorMsg(getApiErrorMessage(error, 'Impossible de supprimer ce commentaire.'));
          } finally {
            setLoadingDelete(null);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Commentaire }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={14} color={colors.outline} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.author} numberOfLines={1}>
            {item.user?.name ?? 'Utilisateur'}
          </Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id, item.contenu)}
          disabled={loadingDelete === item.id}>
          {loadingDelete === item.id ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <>
              <MaterialIcons name="delete" size={14} color={colors.error} />
              <Text style={styles.deleteBtnText}>Supprimer</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.content}>{item.contenu}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modération</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Publication summary */}
      {!!publicationTitle && (
        <View style={styles.publicationSummary}>
          <Text style={styles.publicationTitle} numberOfLines={1}>
            {publicationTitle}
          </Text>
          <Text style={styles.publicationAuthor}>
            {commentaires.length} commentaire{commentaires.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Error */}
      {!!errorMsg && (
        <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }}>
          <Text style={{ color: colors.error, ...typography.bodySm }}>{errorMsg}</Text>
        </View>
      )}

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={commentaires}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListEmptyComponent={
            <View style={styles.listEmpty}>
              <MaterialIcons name="chat-bubble-outline" size={48} color={colors.outline} />
              <Text style={styles.listEmptyText}>Aucun commentaire.</Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}
