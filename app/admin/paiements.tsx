import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing, typography } from '@/constants/design';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getApiErrorMessage } from '@/lib/api';
import { adminService, type AdminPaiementListItem, type FilterStatus } from '@/lib/services/admin';

import { makeStyles } from '@/styles/app/admin/paiements.styles';

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Tous', value: '' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Validé', value: 'valide' },
  { label: 'Refusé', value: 'refuse' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusBadge(statut: string, colors: ReturnType<typeof useAppTheme>['colors']) {
  switch (statut) {
    case 'en_attente':
      return { bg: colors.badgeWarningBg, color: colors.badgeWarningText, label: 'En attente' };
    case 'valide':
      return { bg: colors.badgeSuccessBg, color: colors.badgeSuccessText, label: 'Validé' };
    case 'refuse':
      return { bg: colors.badgeErrorBg, color: colors.badgeErrorText, label: 'Refusé' };
    default:
      return { bg: colors.badgeNeutralBg, color: colors.badgeNeutralText, label: statut };
  }
}

export default function AdminPaiementsScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [paiements, setPaiements] = useState<AdminPaiementListItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal refus
  const [refusModalVisible, setRefusModalVisible] = useState(false);
  const [refusComment, setRefusComment] = useState('');
  const [refusTargetId, setRefusTargetId] = useState<number | null>(null);

  const load = useCallback(
    async (page = 1) => {
      setErrorMsg(null);
      setLoading(true);
      try {
        const result = await adminService.getPaiements({
          page,
          limit: 10,
          recherche: search,
          statut: filterStatus,
        });
        setPaiements(result.data);
        setPagination(result.pagination);
      } catch (error) {
        setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les paiements.'));
      } finally {
        setLoading(false);
      }
    },
    [search, filterStatus]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const handleSearch = () => {
    load(1);
  };

  const handleValidate = async (paiementId: number) => {
    Alert.alert('Valider le paiement', 'Confirmer la validation ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Valider',
        onPress: async () => {
          setLoadingAction(paiementId);
          try {
            await adminService.validatePaiement(paiementId);
            load(pagination.page);
          } catch (error) {
            setErrorMsg(getApiErrorMessage(error, 'Impossible de valider ce paiement.'));
          } finally {
            setLoadingAction(null);
          }
        },
      },
    ]);
  };

  const openRefusModal = (paiementId: number) => {
    setRefusTargetId(paiementId);
    setRefusComment('');
    setRefusModalVisible(true);
  };

  const handleRefuse = async () => {
    if (!refusTargetId) return;
    setLoadingAction(refusTargetId);
    setRefusModalVisible(false);
    try {
      await adminService.refusePaiement(refusTargetId, refusComment);
      load(pagination.page);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de refuser ce paiement.'));
    } finally {
      setLoadingAction(null);
    }
  };

  const renderItem = ({ item }: { item: AdminPaiementListItem }) => {
    const badge = getStatusBadge(item.statut, colors);
    const isLoading = loadingAction === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.nom_complet ?? `Membre #${item.membre_id}`}
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {item.cotisation_nom ?? `Cotisation #${item.cotisation_id}`}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <MaterialIcons name="payments" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            Payé : {Number(item.montant_paye).toLocaleString('fr-FR')} Ar
          </Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>
            Attendu : {Number(item.montant_attendu).toLocaleString('fr-FR')} Ar
          </Text>
        </View>

        <View style={styles.metaRow}>
          <MaterialIcons name="event" size={16} color={colors.textSecondary} />
          <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
          {!!item.mode_nom && (
            <>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{item.mode_nom}</Text>
            </>
          )}
        </View>

        {!!item.reference_transfert && (
          <View style={styles.metaRow}>
            <MaterialIcons name="confirmation-number" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              Réf: {item.reference_transfert}
            </Text>
          </View>
        )}

        {/* Preuve */}
        {!!item.preuve_image && (
          <TouchableOpacity
            style={styles.proofLink}
            onPress={() => {
              Alert.alert('Preuve de paiement', 'Voir l\'image dans un navigateur', [
                { text: 'OK' },
              ]);
            }}>
            <MaterialIcons name="image" size={16} color={colors.primary} />
            <Text style={styles.proofLinkText}>Voir la preuve</Text>
          </TouchableOpacity>
        )}

        {/* Commentaire admin si refusé */}
        {!!item.commentaire_admin && (
          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>Motif du refus :</Text>
            <Text style={styles.commentText}>{item.commentaire_admin}</Text>
          </View>
        )}

        {/* Actions */}
        {item.statut === 'en_attente' && (
          <View style={styles.actionsRow}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnValidate]}
                  onPress={() => handleValidate(item.id)}>
                  <Text style={styles.actionBtnText}>✓ Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnRefuse]}
                  onPress={() => openRefusModal(item.id)}>
                  <Text style={styles.actionBtnText}>✗ Refuser</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
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
        <Text style={styles.headerTitle}>Paiements</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color={colors.outline} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un paiement..."
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

      {/* Status filter */}
      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.filterChip, filterStatus === opt.value && styles.filterChipActive]}
            onPress={() => setFilterStatus(opt.value)}>
            <Text
              style={[
                styles.filterChipText,
                filterStatus === opt.value && styles.filterChipTextActive,
              ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
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
          data={paiements}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.listEmpty}>
              <MaterialIcons name="receipt-long" size={48} color={colors.outline} />
              <Text style={styles.listEmptyText}>Aucun paiement trouvé.</Text>
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

      {/* Refus modal */}
      <Modal
        visible={refusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRefusModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Motif du refus</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={refusComment}
              onChangeText={setRefusComment}
              placeholder="Indiquez le motif du refus..."
              placeholderTextColor={colors.outline}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setRefusModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={handleRefuse}>
                <Text style={styles.modalBtnConfirmText}>Refuser</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
