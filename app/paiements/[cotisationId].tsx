import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { TextField } from '@/components/ui/text-field';
import { colors, radius, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { cotisationsService } from '@/lib/services/cotisations';
import { modesPaiementsService, paiementsService } from '@/lib/services/paiements';
import type { Cotisation } from '@/types/cotisation';
import type { ModePaiement } from '@/types/paiement';

export default function DeclarerPaiementScreen() {
  const { cotisationId } = useLocalSearchParams<{ cotisationId: string }>();
  const id = Number(cotisationId);

  const [cotisation, setCotisation] = useState<Cotisation | null>(null);
  const [modes, setModes] = useState<ModePaiement[]>([]);
  const [selectedMode, setSelectedMode] = useState<ModePaiement | null>(null);
  const [montantPaye, setMontantPaye] = useState('');
  const [reference, setReference] = useState('');
  const [preuve, setPreuve] = useState<{ uri: string; name: string; type: string } | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const [cot, modesList] = await Promise.all([
        cotisationsService.getById(id),
        modesPaiementsService.getAll(),
      ]);
      setCotisation(cot);
      setMontantPaye(cot.montant);
      setModes(modesList);
      if (modesList.length > 0) setSelectedMode(modesList[0]);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les informations.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrorMsg('Autorisation requise pour accéder à vos photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const name = asset.uri.split('/').pop() ?? 'preuve.jpg';
      setPreuve({ uri: asset.uri, name, type: 'image/jpeg' });
    }
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!selectedMode) {
      setErrorMsg('Sélectionnez un mode de paiement.');
      return;
    }
    if (!montantPaye.trim()) {
      setErrorMsg('Indiquez le montant payé.');
      return;
    }
    if (!reference.trim()) {
      setErrorMsg('Indiquez la référence du transfert.');
      return;
    }

    setSubmitting(true);
    try {
      await paiementsService.declarer({
        cotisation_id: id,
        mode_paiement_id: selectedMode.id,
        montant_paye: montantPaye.trim(),
        reference_transfert: reference.trim(),
        preuve,
      });
      setSuccess(true);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de déclarer ce paiement.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (success) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]} edges={['top', 'bottom']}>
        <MaterialIcons name="check-circle" size={64} color={colors.statusValidated} />
        <Text style={styles.successTitle}>Paiement déclaré !</Text>
        <Text style={styles.successText}>
          Votre déclaration a été envoyée. Un administrateur va la vérifier et la valider prochainement.
        </Text>
        <AppButton title="Retour aux cotisations" onPress={() => router.replace('/(tabs)/cotisations')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Déclarer un paiement</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!!cotisation && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{cotisation.titre}</Text>
            <Text style={styles.summaryMontant}>
              {Number(cotisation.montant).toLocaleString('fr-FR')} Ar
            </Text>
            {!!cotisation.date_limite && (
              <Text style={styles.summaryMeta}>
                Date limite :{' '}
                {new Date(cotisation.date_limite).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            )}
          </View>
        )}

        <Text style={styles.label}>Mode de paiement</Text>
        <View style={styles.modesRow}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeChip, selectedMode?.id === mode.id && styles.modeChipActive]}
              onPress={() => setSelectedMode(mode)}>
              <Text
                style={[
                  styles.modeChipText,
                  selectedMode?.id === mode.id && styles.modeChipTextActive,
                ]}>
                {mode.nom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!!selectedMode && (
          <View style={styles.modeInfo}>
            <Text style={styles.modeInfoText}>
              Numéro : <Text style={{ fontWeight: '600' }}>{selectedMode.numero_compte}</Text>
            </Text>
            <Text style={styles.modeInfoText}>Titulaire : {selectedMode.titulaire}</Text>
          </View>
        )}

        <View style={{ marginTop: spacing.md, gap: spacing.md }}>
          <TextField
            label="Montant payé (Ar)"
            icon="payments"
            keyboardType="numeric"
            value={montantPaye}
            onChangeText={setMontantPaye}
          />
          <TextField
            label="Référence du transfert"
            icon="receipt-long"
            placeholder="Ex: TX2026081400123"
            value={reference}
            onChangeText={setReference}
          />

          <View>
            <Text style={styles.label}>Justificatif (optionnel)</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              {preuve ? (
                <Image source={{ uri: preuve.uri }} style={styles.previewImage} />
              ) : (
                <>
                  <MaterialIcons name="add-a-photo" size={28} color={colors.outline} />
                  <Text style={styles.uploadText}>Ajouter une capture de transfert</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        <AppButton
          title="Envoyer la déclaration"
          loading={submitting}
          onPress={handleSubmit}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    ...typography.headlineSm,
    fontSize: 17,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    ...typography.headlineSm,
    color: colors.textPrimary,
  },
  summaryMontant: {
    ...typography.headlineLg,
    color: colors.statusValidated,
    marginTop: 4,
  },
  summaryMeta: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  label: {
    ...typography.labelMd,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  modesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  modeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  modeChipActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  modeChipText: {
    ...typography.labelMd,
    color: colors.textSecondary,
  },
  modeChipTextActive: {
    color: colors.white,
  },
  modeInfo: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginTop: spacing.sm,
    gap: 2,
  },
  modeInfoText: {
    ...typography.bodySm,
    color: colors.textPrimary,
  },
  uploadBox: {
    height: 140,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  uploadText: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  successTitle: {
    ...typography.headlineLg,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  successText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
