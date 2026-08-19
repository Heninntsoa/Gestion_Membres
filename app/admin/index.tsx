import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RoleBadge } from '@/components/ui/role-badge';
import { colors, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { adminService, type AdminMembreListItem, type FilterStatus } from '@/lib/services/admin';
import type { Role } from '@/types/membre';

import { styles } from '@/styles/app/admin/index.styles';

const STATUS_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: 'Tous', value: '' },
  { label: 'En attente', value: '0' },
  { label: 'Actifs', value: '1' },
  { label: 'Désactivés', value: '2' },
  { label: 'Refusés', value: '3' },
];

const ROLE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Tous les rôles', value: '' },
  { label: 'Membre', value: 'membre' },
  { label: 'Admin', value: 'admin' },
  { label: 'Communication', value: 'communication' },
  { label: 'Trésor', value: 'tresor' },
  { label: 'Président', value: 'president' },
];

function getStatusInfo(isActive: number) {
  switch (isActive) {
    case 0:
      return { label: 'En attente', style: styles.statusPending, textStyle: styles.statusTextPending };
    case 1:
      return { label: 'Actif', style: styles.statusActive, textStyle: styles.statusTextActive };
    case 2:
      return { label: 'Désactivé', style: styles.statusDisabled, textStyle: styles.statusTextDisabled };
    case 3:
      return { label: 'Refusé', style: styles.statusRefused, textStyle: styles.statusTextRefused };
    default:
      return { label: 'Inconnu', style: styles.statusPending, textStyle: styles.statusTextPending };
  }
}

export default function AdminMembersScreen() {
  const [members, setMembers] = useState<AdminMembreListItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('');
  const [filterRole, setFilterRole] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async (page = 1) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const result = await adminService.getMembres({
        page,
        limit: 10,
        recherche: search,
        is_active: filterStatus,
        role: filterRole,
      });
      setMembers(result.data);
      setPagination(result.pagination);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les membres.'));
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterRole]);

  useEffect(() => {
    load(1);
  }, [load]);

  const handleSearch = () => {
    load(1);
  };

  const handleActivate = async (membreId: number) => {
    setLoadingAction(membreId);
    try {
      await adminService.activateMembre(membreId);
      load(pagination.page);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Impossible d'activer ce membre."));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeactivate = async (membreId: number) => {
    setLoadingAction(membreId);
    try {
      await adminService.deactivateMembre(membreId);
      load(pagination.page);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de désactiver ce membre.'));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRefuse = async (membreId: number) => {
    setLoadingAction(membreId);
    try {
      await adminService.refuseMembre(membreId);
      load(pagination.page);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de refuser ce membre.'));
    } finally {
      setLoadingAction(null);
    }
  };

  const renderMember = ({ item }: { item: AdminMembreListItem }) => {
    const status = getStatusInfo(item.is_active);
    const isLoading = loadingAction === item.id;

    return (
      <TouchableOpacity
        style={styles.memberCard}
        onPress={() => router.push({ pathname: '/admin/[id]', params: { id: String(item.id), matricule: item.matricule } })}
        activeOpacity={0.7}>
        {item.photo_identite ? (
          <Image source={{ uri: item.photo_identite }} style={styles.memberAvatar} />
        ) : (
          <View style={styles.memberAvatarPlaceholder}>
            <MaterialIcons name="person" size={22} color={colors.outline} />
          </View>
        )}

        <View style={styles.memberInfo}>
          <Text style={styles.memberName} numberOfLines={1}>{item.nom_complet}</Text>
          <Text style={styles.memberEmail} numberOfLines={1}>{item.email}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Text style={styles.memberMeta}>{item.matricule}</Text>
            <RoleBadge role={item.role as Role} size="sm" />
          </View>
        </View>

        <View style={styles.memberActions}>
          <View style={[styles.statusBadge, status.style]}>
            <Text style={[styles.statusText, status.textStyle]}>{status.label}</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 4 }} />
          ) : (
            <View style={styles.actionRow}>
              {item.is_active === 0 && (
                <>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnActivate]}
                    onPress={() => handleActivate(item.id)}>
                    <Text style={[styles.actionBtnText, styles.actionBtnTextActivate]}>✓ Activer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnRefuse]}
                    onPress={() => handleRefuse(item.id)}>
                    <Text style={[styles.actionBtnText, styles.actionBtnTextRefuse]}>✗ Refuser</Text>
                  </TouchableOpacity>
                </>
              )}
              {item.is_active === 1 && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnDeactivate]}
                  onPress={() => handleDeactivate(item.id)}>
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDeactivate]}>Désactiver</Text>
                </TouchableOpacity>
              )}
              {(item.is_active === 2 || item.is_active === 3) && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnActivate]}
                  onPress={() => handleActivate(item.id)}>
                  <Text style={[styles.actionBtnText, styles.actionBtnTextActivate]}>✓ Réactiver</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion des membres</Text>
        <TouchableOpacity onPress={() => router.push('/admin/dashboard')} hitSlop={8}>
          <MaterialIcons name="dashboard" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color={colors.outline} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un membre..."
            placeholderTextColor={colors.outline}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); }} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={colors.outline} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Status filter chips */}
      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.filterChip, filterStatus === opt.value && styles.filterChipActive]}
            onPress={() => setFilterStatus(opt.value)}>
            <Text style={[styles.filterChipText, filterStatus === opt.value && styles.filterChipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Role filter chips */}
      <View style={styles.filterRow}>
        {ROLE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.filterChip, filterRole === opt.value && styles.filterChipActive]}
            onPress={() => setFilterRole(opt.value)}>
            <Text style={[styles.filterChipText, filterRole === opt.value && styles.filterChipTextActive]}>
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
          data={members}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.listEmpty}>
              <MaterialIcons name="people-outline" size={48} color={colors.outline} />
              <Text style={styles.listEmptyText}>Aucun membre trouvé.</Text>
            </View>
          }
          renderItem={renderMember}
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
                  style={[styles.paginationBtn, pagination.page >= pagination.pages && styles.paginationBtnDisabled]}
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
