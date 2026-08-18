import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { adminService, type AdminMembreListItem } from '@/lib/services/admin';

import { styles } from '@/styles/app/admin/detail.styles';

function getStatusInfo(isActive: number) {
  switch (isActive) {
    case 0:
      return { label: 'En attente de validation', style: styles.statusPending, textStyle: { color: '#92400E' } };
    case 1:
      return { label: 'Membre actif', style: styles.statusActive, textStyle: { color: '#065F46' } };
    case 2:
      return { label: 'Désactivé', style: styles.statusDisabled, textStyle: { color: '#991B1B' } };
    case 3:
      return { label: 'Refusé', style: styles.statusRefused, textStyle: { color: '#6B21A8' } };
    default:
      return { label: 'Inconnu', style: styles.statusPending, textStyle: { color: '#92400E' } };
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function AdminMemberDetailScreen() {
  const { id, matricule } = useLocalSearchParams<{ id: string; matricule?: string }>();
  const [member, setMember] = useState<AdminMembreListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Rechercher par matricule (plus précis) ou par email
      const search = matricule || '';
      const result = await adminService.getMembres({ page: 1, limit: 10, recherche: search });
      const found = result.data.find((m) => m.id === Number(id));
      if (found) {
        setMember(found);
      } else {
        // Fallback : charger sans filtre
        const allResult = await adminService.getMembres({ page: 1, limit: 50, recherche: '' });
        const foundFallback = allResult.data.find((m) => m.id === Number(id));
        if (foundFallback) {
          setMember(foundFallback);
        } else {
          setErrorMsg('Membre introuvable.');
        }
      }
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les informations du membre.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'activate' | 'deactivate' | 'refuse') => {
    if (!member) return;
    setLoadingAction(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (action === 'activate') {
        await adminService.activateMembre(member.id);
        setSuccessMsg('Le membre a été activé avec succès.');
      } else if (action === 'deactivate') {
        await adminService.deactivateMembre(member.id);
        setSuccessMsg('Le membre a été désactivé.');
      } else if (action === 'refuse') {
        await adminService.refuseMembre(member.id);
        setSuccessMsg('La demande du membre a été refusée.');
      }
      loadMember();
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Une erreur est survenue lors de l'action."));
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détail du membre</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!member) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détail du membre</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.center}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>{errorMsg ?? 'Membre introuvable.'}</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: spacing.md }}>
            <Text style={{ color: colors.primary }}>← Retour à la liste</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const status = getStatusInfo(member.is_active);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail du membre</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          {member.photo_identite ? (
            <Image source={{ uri: member.photo_identite }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={40} color={colors.outline} />
            </View>
          )}
          <Text style={styles.name}>{member.nom_complet}</Text>
          <Text style={styles.matricule}>Matricule : {member.matricule}</Text>
          <View style={[styles.statusBadge, status.style]}>
            <Text style={[styles.statusText, status.textStyle]}>{status.label}</Text>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <InfoRow icon="mail-outline" label="Email" value={member.email} />
          <InfoRow icon="phone" label="Téléphone" value={member.telephone} />
          <InfoRow icon="badge" label="CIN" value={member.cin} />
          <InfoRow icon="person" label="Sexe" value={member.sexe} />
          <InfoRow icon="cake" label="Naissance" value={formatDate(member.date_naissance)} />
          <InfoRow icon="location-on" label="Adresse" value={member.adresse} />
        </View>

        {/* Informations académiques */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations académiques</Text>

          <InfoRow icon="school" label="Mention" value={member.mention} />
          <InfoRow icon="menu-book" label="Parcours" value={member.parcours} />
          <InfoRow icon="stairs" label="Niveau" value={member.niveau} />
          <InfoRow icon="work-outline" label="Profession" value={member.profession} />
          <InfoRow icon="category" label="Catégorie" value={member.categorie} />
        </View>

        {/* Informations adhésion */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations adhésion</Text>

          <InfoRow icon="verified-user" label="Rôle" value={member.role} />
          <InfoRow icon="group" label="Type" value={member.type_membre} />
          <InfoRow icon="calendar-today" label="Adhésion" value={formatDate(member.date_adhesion)} />
          <InfoRow icon="schedule" label="Inscrit le" value={formatDate(member.created_at)} />
          {member.active_par_nom && (
            <InfoRow icon="admin-panel-settings" label="Activé par" value={member.active_par_nom} />
          )}
        </View>

        {/* Messages */}
        {!!errorMsg && (
          <View style={{ padding: spacing.sm, backgroundColor: '#FEE2E2', borderRadius: 8 }}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
        {!!successMsg && (
          <View style={{ padding: spacing.sm, backgroundColor: '#DFF5E1', borderRadius: 8 }}>
            <Text style={{ color: '#065F46', ...typography.bodySm }}>{successMsg}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Actions</Text>

          {loadingAction ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ paddingVertical: spacing.md }} />
          ) : (
            <>
              {member.is_active !== 1 && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnActivate]}
                  onPress={() => handleAction('activate')}>
                  <Text style={styles.actionBtnText}>✓ Activer le membre</Text>
                </TouchableOpacity>
              )}

              {member.is_active === 1 && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnDeactivate]}
                  onPress={() => handleAction('deactivate')}>
                  <Text style={styles.actionBtnText}>Désactiver le membre</Text>
                </TouchableOpacity>
              )}

              {member.is_active !== 3 && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnRefuse]}
                  onPress={() => handleAction('refuse')}>
                  <Text style={styles.actionBtnText}>Refuser la demande</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string | null }) {
  return (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} size={18} color={colors.textSecondary} style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  );
}
