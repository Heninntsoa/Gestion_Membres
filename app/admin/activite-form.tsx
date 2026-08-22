import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/constants/design';
import { ErrorCard } from '@/components/ui/error-card';
import { getApiErrorMessage } from '@/lib/api';
import { adminService, type AdminActiviteFormPayload } from '@/lib/services/admin';

import { styles } from '@/styles/app/admin/activite-form.styles';

const TYPE_OPTIONS = [
  { value: 'gratuit', label: 'Gratuit' },
  { value: 'payant', label: 'Payant' },
  { value: 'prise_en_charge', label: 'Prise en charge' },
];

const STATUT_OPTIONS = [
  { value: 'planifiee', label: 'Planifiée' },
  { value: 'terminee', label: 'Terminée' },
  { value: 'annulee', label: 'Annulée' },
];

function formatDateForInput(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function AdminActiviteFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [lieu, setLieu] = useState('');
  const [typeActivite, setTypeActivite] = useState('gratuit');
  const [montant, setMontant] = useState('');
  const [statut, setStatut] = useState('planifiee');
  const [isPublic, setIsPublic] = useState(1);
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      loadActivite();
    }
  }, [id]);

  const loadActivite = async () => {
    try {
      const result = await adminService.getActivites({ page: 1, limit: 50, recherche: '' });
      const found = result.data.find((a) => a.id === Number(id));
      if (found) {
        setTitre(found.titre);
        setDescription(found.description ?? '');
        setDateDebut(formatDateForInput(found.date_debut));
        setDateFin(found.date_fin ? formatDateForInput(found.date_fin) : '');
        setLieu(found.lieu ?? '');
        setTypeActivite(found.type_activite);
        setMontant(found.montant ?? '');
        setStatut(found.statut ?? 'planifiee');
        setIsPublic(found.is_public ?? 1);
        setExistingImage(found.image);
      } else {
        setErrorMsg('Activité introuvable.');
      }
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger l\'activité.'));
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        name: asset.fileName ?? 'image.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
    }
  };

  const handleSubmit = async () => {
    if (!titre.trim()) {
      setErrorMsg('Le titre est obligatoire.');
      return;
    }
    if (!dateDebut) {
      setErrorMsg('La date de début est obligatoire.');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    const payload: AdminActiviteFormPayload = {
      titre: titre.trim(),
      description: description.trim(),
      date_debut: dateDebut,
      date_fin: dateFin || undefined,
      lieu: lieu.trim() || undefined,
      type_activite: typeActivite,
      montant: typeActivite === 'payant' ? montant : undefined,
      statut,
      is_public: isPublic,
      image,
    };

    try {
      if (isEdit) {
        await adminService.updateActivite(Number(id), payload);
      } else {
        await adminService.createActivite(payload);
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
          <Text style={styles.headerTitle}>{isEdit ? 'Modifier l\'activité' : 'Nouvelle activité'}</Text>
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
        <Text style={styles.headerTitle}>{isEdit ? 'Modifier l\'activité' : 'Nouvelle activité'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Image picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          ) : existingImage ? (
            <Image source={{ uri: existingImage }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="add-a-photo" size={32} color={colors.outline} />
              <Text style={styles.imagePlaceholderText}>Ajouter une image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Titre */}
        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          value={titre}
          onChangeText={setTitre}
          placeholder="Titre de l'activité"
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
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Date début */}
        <Text style={styles.label}>Date de début *</Text>
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

        {/* Lieu */}
        <Text style={styles.label}>Lieu</Text>
        <TextInput
          style={styles.input}
          value={lieu}
          onChangeText={setLieu}
          placeholder="Lieu de l'activité"
          placeholderTextColor={colors.outline}
        />

        {/* Type d'activité */}
        <Text style={styles.label}>Type d&apos;activité</Text>
        <View style={styles.chipRow}>
          {TYPE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, typeActivite === opt.value && styles.chipActive]}
              onPress={() => setTypeActivite(opt.value)}>
              <Text
                style={[styles.chipText, typeActivite === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Montant (si payant) */}
        {typeActivite === 'payant' && (
          <>
            <Text style={styles.label}>Montant (Ar)</Text>
            <TextInput
              style={styles.input}
              value={montant}
              onChangeText={setMontant}
              placeholder="Montant"
              placeholderTextColor={colors.outline}
              keyboardType="numeric"
            />
          </>
        )}

        {/* Statut */}
        <Text style={styles.label}>Statut</Text>
        <View style={styles.chipRow}>
          {STATUT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, statut === opt.value && styles.chipActive]}
              onPress={() => setStatut(opt.value)}>
              <Text
                style={[styles.chipText, statut === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
              {isEdit ? 'Enregistrer les modifications' : 'Créer l\'activité'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
