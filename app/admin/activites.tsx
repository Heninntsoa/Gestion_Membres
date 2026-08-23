import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing, typography } from '@/constants/design';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getApiErrorMessage } from '@/lib/api';
import { adminService, type AdminActiviteListItem } from '@/lib/services/admin';

import { makeStyles } from '@/styles/app/admin/activites.styles';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  gratuit: { label: 'Gratuit', color: '#059669' },
  payant: { label: 'Payant', color: '#D97706' },
  prise_en_charge: { label: 'Prise en charge', color: '#2563EB' },
};

export default function AdminActivitesScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [activites, setActivites] = useState<AdminActiviteListItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(
    async (page = 1) => {
      setErrorMsg(null);
      setLoading(true);
      try {
        const result = await adminService.getActivites({
          page,
          limit: 10,
          recherche: search,
        });
        setActivites(result.data);
        setPagination(result.pagination);
      } catch (error) {
        setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les activités.'));
      } finally {
        setLoading(false);
      }
    },
    [search]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const handleSearch = () => {
    load(1);
  };

  const handleDelete = async (activiteId: number, titre: string) => {
    Alert.alert(
      'Supprimer l\'activité',
      `Voulez-vous vraiment supprimer « ${titre} » ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setLoadingDelete(activiteId);
            try {
              await adminService.deleteActivite(activiteId);
              load(pagination.page);
            } catch (error) {
              setErrorMsg(getApiErrorMessage(error, 'Impossible de supprimer cette activité.'));
            } finally {
              setLoadingDelete(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: AdminActiviteListItem }) => {
    const typeInfo = TYPE_LABELS[item.type_activite] ?? { label: item.type_activite, color: '#6B7280' };

    return (
      <View style={styles.card}>
        <View style={styles.cardImageWrapper}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <MaterialIcons name="eco" size={24} color={colors.outline} />
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.titre}
          </Text>
          {!!item.lieu && (
            <View style={styles.metaRow}>
              <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {item.lieu}
              </Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <MaterialIcons name="event" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{formatDate(item.date_debut)}</Text>
            {item.date_fin && (
              <Text style={styles.metaText}> → {formatDate(item.date_fin)}</Text>
            )}
          </View>
          <View style={styles.typeBadgeContainer}>
            <View style={[styles.typeBadge, { backgroundColor: typeInfo.color + '15' }]}>
              <Text style={[styles.typeBadgeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
            </View>
            {item.montant && (
              <Text style={styles.montantText}>{Number(item.montant).toLocaleString('fr-FR')} Ar</Text>
            )}
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnEdit]}
            onPress={() =>
              router.push({
                pathname: '/admin/activite-form',
                params: { id: String(item.id) },
              })
            }>
            <MaterialIcons name="edit" size={16} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnDelete]}
            onPress={() => handleDelete(item.id, item.titre)}
            disabled={loadingDelete === item.id}>
            {loadingDelete === item.id ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <MaterialIcons name="delete" size={16} color={colors.error} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activités</Text>
        <TouchableOpacity
          onPress={() => router.push('/admin/activite-form')}
          hitSlop={8}>
          <MaterialIcons name="add-circle" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color={colors.outline} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une activité..."
            placeholderTextColor={colors.outline}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={colors.outline} />
            </TouchableOpacity>
          )}
        </View>
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
          data={activites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.listEmpty}>
              <MaterialIcons name="event-busy" size={48} color={colors.outline} />
              <Text style={styles.listEmptyText}>Aucune activité trouvée.</Text>
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
