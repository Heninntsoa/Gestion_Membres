import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

import { spacing, typography } from '@/constants/design';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getApiErrorMessage } from '@/lib/api';
import { adminService } from '@/lib/services/admin';
import type { Cotisation } from '@/types/cotisation';

import { makeStyles } from '@/styles/app/admin/cotisations.styles';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const makeStatutStyle = (colors: ReturnType<typeof useAppTheme>['colors']): Record<string, { bg: string; label: string; color: string }> => ({
  ouverte: { bg: colors.badgeSuccessBg, label: 'Ouverte', color: colors.badgeSuccessText },
  cloturee: { bg: colors.badgeWarningBg, label: 'Clôturée', color: colors.badgeWarningText },
  archivee: { bg: colors.badgeNeutralBg, label: 'Archivée', color: colors.badgeNeutralText },
});

export default function AdminCotisationsScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const statutStyle = makeStatutStyle(colors);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const data = await adminService.getCotisations();
      setCotisations(data);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les cotisations.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (cotisationId: number, titre: string) => {
    Alert.alert('Supprimer la cotisation', `Supprimer « ${titre} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          setLoadingDelete(cotisationId);
          try {
            await adminService.deleteCotisation(cotisationId);
            load();
          } catch (error) {
            setErrorMsg(getApiErrorMessage(error, 'Impossible de supprimer cette cotisation.'));
          } finally {
            setLoadingDelete(null);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Cotisation }) => {
    const badge = statutStyle[item.statut] ?? statutStyle.archivee;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.titre}
          </Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>

        {!!item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.metaRow}>
          <MaterialIcons name="payments" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {Number(item.montant).toLocaleString('fr-FR')} Ar
          </Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.periodicite}</Text>
        </View>

        <View style={styles.metaRow}>
          <MaterialIcons name="event" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {formatDate(item.date_debut)} → {formatDate(item.date_fin)}
          </Text>
        </View>

        {item.date_limite && (
          <View style={styles.metaRow}>
            <MaterialIcons name="timer" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>Date limite : {formatDate(item.date_limite)}</Text>
          </View>
        )}

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnEdit]}
            onPress={() =>
              router.push({
                pathname: '/admin/cotisation-form',
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
        <Text style={styles.headerTitle}>Cotisations</Text>
        <TouchableOpacity onPress={() => router.push('/admin/cotisation-form')} hitSlop={8}>
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
          data={cotisations}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListEmptyComponent={
            <View style={styles.listEmpty}>
              <MaterialIcons name="payments" size={48} color={colors.outline} />
              <Text style={styles.listEmptyText}>Aucune cotisation.</Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}
