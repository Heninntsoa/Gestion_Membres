import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { colors, spacing } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { activitesService, participationsService } from '@/lib/services/activites';
import type { Activite } from '@/types/activite';
import type { MaParticipation } from '@/types/participation';

import { styles } from '@/styles/app/activite/[id].styles';
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatHeure(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

const typeLabel: Record<Activite['type_activite'], string> = {
  gratuit: 'Gratuit',
  payant: 'Payant',
  prise_en_charge: 'Prise en charge',
};

export default function ActiviteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const activiteId = Number(id);

  const [activite, setActivite] = useState<Activite | null>(null);
  const [maParticipation, setMaParticipation] = useState<MaParticipation | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const [act, mesParticipations] = await Promise.all([
        activitesService.getById(activiteId),
        participationsService.getMyParticipations(100),
      ]);
      setActivite(act);
      setMaParticipation(
        mesParticipations.find((p) => p.activitie_id === activiteId) ?? null
      );
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Impossible de charger l'activité."));
    } finally {
      setLoading(false);
    }
  }, [activiteId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleParticipate = async () => {
    setActionLoading(true);
    setErrorMsg(null);
    try {
      await participationsService.participate(activiteId);
      await load();
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Impossible de s'inscrire à cette activité."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    setErrorMsg(null);
    try {
      await participationsService.cancel(activiteId);
      await load();
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, "Impossible d'annuler l'inscription."));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!activite) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <Text style={styles.errorText}>{errorMsg ?? 'Activité introuvable.'}</Text>
        <AppButton title="Retour" variant="outline" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const isAnnulee = activite.statut === 'annulee';
  const isTerminee = activite.statut === 'terminee';
  const isRegistered = !!maParticipation;
  const qrUrl = maParticipation?.qr_token
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(maParticipation.qr_token)}`
    : null;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.imageWrapper}>
          {activite.image ? (
            <Image source={{ uri: activite.image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <MaterialIcons name="eco" size={48} color={colors.outline} />
            </View>
          )}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{typeLabel[activite.type_activite]}</Text>
          </View>

          <Text style={styles.title}>{activite.titre}</Text>

          <View style={styles.metaRow}>
            <MaterialIcons name="event" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {formatDate(activite.date_debut)} · {formatHeure(activite.date_debut)}
              {activite.date_fin ? ` - ${formatHeure(activite.date_fin)}` : ''}
            </Text>
          </View>
          {!!activite.lieu && (
            <View style={styles.metaRow}>
              <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{activite.lieu}</Text>
            </View>
          )}
          {activite.type_activite === 'payant' && !!activite.montant && (
            <View style={styles.metaRow}>
              <MaterialIcons name="payments" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {Number(activite.montant).toLocaleString('fr-FR')} Ar
              </Text>
            </View>
          )}
          {!!activite.createur && (
            <View style={styles.metaRow}>
              <MaterialIcons name="person" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>Organisé par {activite.createur}</Text>
            </View>
          )}

          {!!activite.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>À propos</Text>
              <Text style={styles.description}>{activite.description}</Text>
            </View>
          )}

          {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          {isAnnulee ? (
            <View style={[styles.statusBanner, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.statusBannerText, { color: colors.error }]}>
                Cette activité a été annulée.
              </Text>
            </View>
          ) : isTerminee ? (
            <View style={[styles.statusBanner, { backgroundColor: colors.surfaceContainer }]}>
              <Text style={styles.statusBannerText}>Cette activité est terminée.</Text>
            </View>
          ) : isRegistered ? (
            <View style={styles.section}>
              <View style={[styles.statusBanner, { backgroundColor: '#DFF5E1' }]}>
                <MaterialIcons name="check-circle" size={18} color={colors.statusValidated} />
                <Text style={[styles.statusBannerText, { color: colors.statusValidated }]}>
                  {'  '}Vous êtes inscrit à cette activité
                </Text>
              </View>

              {!!qrUrl && (
                <View style={styles.qrCard}>
                  <Text style={styles.qrLabel}>
                    Présentez ce QR code sur place pour le pointage de présence
                  </Text>
                  <Image source={{ uri: qrUrl }} style={styles.qrImage} />
                  {maParticipation?.qr_used === 1 && (
                    <Text style={styles.qrUsedText}>✓ Déjà scanné</Text>
                  )}
                </View>
              )}

              <AppButton
                title="Annuler mon inscription"
                variant="outline"
                loading={actionLoading}
                onPress={handleCancel}
                style={{ marginTop: spacing.sm }}
              />
            </View>
          ) : (
            <AppButton
              title={activite.type_activite === 'payant' ? 'Participer' : "S'inscrire"}
              loading={actionLoading}
              onPress={handleParticipate}
              style={{ marginTop: spacing.md }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

