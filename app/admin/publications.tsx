import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { adminService } from '@/lib/services/admin';
import type { Publication } from '@/types/publication';

import { styles } from '@/styles/app/admin/publications.styles';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminPublicationsScreen() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async (page = 1) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const result = await adminService.getPublications({ page, limit: 10 });
      setPublications(result.data);
      setPagination(result.pagination);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les publications.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const handleDelete = async (pubId: number, content: string) => {
    const short = content.length > 40 ? content.slice(0, 40) + '…' : content;
    Alert.alert('Supprimer la publication', `Supprimer « ${short} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          setLoadingDelete(pubId);
          try {
            await adminService.deletePublication(pubId);
            load(pagination.page);
          } catch (error) {
            setErrorMsg(getApiErrorMessage(error, 'Impossible de supprimer cette publication.'));
          } finally {
            setLoadingDelete(null);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Publication }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={16} color={colors.outline} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.author} numberOfLines={1}>
            {item.user?.name ?? 'IDEM Planète'}
          </Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnEdit]}
            onPress={() =>
              router.push({
                pathname: '/admin/publication-form',
                params: { id: String(item.id) },
              })
            }>
            <MaterialIcons name="edit" size={16} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnDelete]}
            onPress={() => handleDelete(item.id, item.content)}
            disabled={loadingDelete === item.id}>
            {loadingDelete === item.id ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <MaterialIcons name="delete" size={16} color={colors.error} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={3}>
        {item.content}
      </Text>

      {!!item.image && <Image source={{ uri: item.image }} style={styles.image} />}

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <MaterialIcons
            name={item.liked ? 'favorite' : 'favorite-border'}
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.footerText}>{item.likes}</Text>
        </View>
        <View style={styles.footerItem}>
          <MaterialIcons name="chat-bubble-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.footerText}>{item.commentsCount} commentaires</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publications</Text>
        <TouchableOpacity onPress={() => router.push('/admin/publication-form')} hitSlop={8}>
          <MaterialIcons name="add-circle" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

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
          data={publications}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListEmptyComponent={
            <View style={styles.listEmpty}>
              <MaterialIcons name="article" size={48} color={colors.outline} />
              <Text style={styles.listEmptyText}>Aucune publication.</Text>
            </View>
          }
          renderItem={renderItem}
          ListFooterComponent={
            pagination.pages > 1 ? (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.paginationBtn, pagination.page <= 1 && styles.paginationBtnDisabled]}
                  disabled={pagination.page <= 1}
                  onPress={() => load(pagination.page - 1)}>
                  <Text style={styles.paginationText}>← Préc</Text>
                </TouchableOpacity>
                <Text style={styles.paginationInfo}>
                  {pagination.page} / {pagination.pages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.paginationBtn,
                    pagination.page >= pagination.pages && styles.paginationBtnDisabled,
                  ]}
                  disabled={pagination.page >= pagination.pages}
                  onPress={() => load(pagination.page + 1)}>
                  <Text style={styles.paginationText}>Suiv →</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
