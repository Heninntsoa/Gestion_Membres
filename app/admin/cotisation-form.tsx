import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorCard } from '@/components/ui/error-card';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getApiErrorMessage } from '@/lib/api';
import { adminService } from '@/lib/services/admin';
import type { Cotisation } from '@/types/cotisation';

import { makeStyles } from '@/styles/app/admin/cotisation-form.styles';

const STATUT_OPTIONS = [
  { value: 'ouverte', label: 'Ouverte' },
  { value: 'cloturee', label: 'Clôturée' },
  { value: 'archivee', label: 'Archivée' },
];

const PERIODICITE_OPTIONS = [
  { value: 'mensuelle', label: 'Mensuelle' },
  { value: 'annuelle', label: 'Annuelle' },
  { value: 'unique', label: 'Unique' },
];

function formatDateForInput(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function AdminCotisationFormScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [montant, setMontant] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [statut, setStatut] = useState('ouverte');
  const [periodicite, setPeriodicite] = useState('mensuelle');
  const [typeNom, setTypeNom] = useState('');

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      loadCotisation();
    }
  }, [id]);

  const loadCotisation = async () => {
    try {
      const data = await adminService.getCotisations();
      const found = data.find((c) => c.id === Number(id));
      if (found) {
        setTitre(found.titre);
        setDescription(found.description ?? '');
        setMontant(found.montant);
        setDateDebut(formatDateForInput(found.date_debut));
        setDateFin(found.date_fin ? formatDateForInput(found.date_fin) : '');
        setDateLimite(found.date_limite ? formatDateForInput(found.date_limite) : '');
        setStatut(found.statut);
        setPeriodicite(found.periodicite);
        setTypeNom(found.type_nom);
      } else {
        setErrorMsg('Cotisation introuvable.');
      }
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger la cotisation.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!titre.trim()) {
      setErrorMsg('Le titre est obligatoire.');
      return;
    }
    if (!montant || Number(montant) <= 0) {
      setErrorMsg('Le montant doit être supérieur à 0.');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    const payload = {
      titre: titre.trim(),
      description: description.trim() || undefined,
      montant,
      date_debut: dateDebut || undefined,
      date_fin: dateFin || undefined,
      date_limite: dateLimite || undefined,
      statut,
      periodicite,
      type_nom: typeNom.trim() || undefined,
    };

    try {
      if (isEdit) {
        await adminService.updateCotisation(Number(id), payload);
      } else {
        await adminService.createCotisation(payload);
      }
      router.back();
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Une erreur est survenue.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? 'Modifier' : 'Nouvelle cotisation'}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Modifier la cotisation' : 'Nouvelle cotisation'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Titre */}
        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          value={titre}
          onChangeText={setTitre}
          placeholder="Titre de la cotisation"
          placeholderTextColor={colors.outline}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description..."
          placeholderTextColor={colors.outline}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Montant */}
        <Text style={styles.label}>Montant (Ar) *</Text>
        <TextInput
          style={styles.input}
          value={montant}
          onChangeText={setMontant}
          placeholder="Montant"
          placeholderTextColor={colors.outline}
          keyboardType="numeric"
        />

        {/* Date début */}
        <Text style={styles.label}>Date de début</Text>
        <TextInput
          style={styles.input}
          value={dateDebut}
          onChangeText={setDateDebut}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.outline}
          keyboardType="numbers-and-punctuation"
        />

        {/* Date fin */}
        <Text style={styles.label}>Date de fin</Text>
        <TextInput
          style={styles.input}
          value={dateFin}
          onChangeText={setDateFin}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.outline}
          keyboardType="numbers-and-punctuation"
        />

        {/* Date limite */}
        <Text style={styles.label}>Date limite</Text>
        <TextInput
          style={styles.input}
          value={dateLimite}
          onChangeText={setDateLimite}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.outline}
          keyboardType="numbers-and-punctuation"
        />

        {/* Périodicité */}
        <Text style={styles.label}>Périodicité</Text>
        <View style={styles.chipRow}>
          {PERIODICITE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, periodicite === opt.value && styles.chipActive]}
              onPress={() => setPeriodicite(opt.value)}>
              <Text style={[styles.chipText, periodicite === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Statut */}
        <Text style={styles.label}>Statut</Text>
        <View style={styles.chipRow}>
          {STATUT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, statut === opt.value && styles.chipActive]}
              onPress={() => setStatut(opt.value)}>
              <Text style={[styles.chipText, statut === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Type nom */}
        <Text style={styles.label}>Type (ex: Cotisation annuelle)</Text>
        <TextInput
          style={styles.input}
          value={typeNom}
          onChangeText={setTypeNom}
          placeholder="Type de cotisation"
          placeholderTextColor={colors.outline}
        />

        {/* Error */}
        {!!errorMsg && <ErrorCard message={errorMsg} />}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>
              {isEdit ? 'Enregistrer les modifications' : 'Créer la cotisation'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
