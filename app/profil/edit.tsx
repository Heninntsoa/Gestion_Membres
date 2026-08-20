import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { ErrorCard } from '@/components/ui/error-card';
import { TextField } from '@/components/ui/text-field';
import { colors, spacing } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { membreService } from '@/lib/services/membre';
import { filterLettersOnly, filterPhone } from '@/lib/validators';
import { useAuthStore } from '@/store/auth-store';
import type { Sexe } from '@/types/membre';

import { styles } from '@/styles/app/profil/edit.styles';

export default function EditProfilScreen() {
  const { user, refreshMe } = useAuthStore();

  const [nomComplet, setNomComplet] = useState(user?.nom_complet ?? '');
  const [telephone, setTelephone] = useState(user?.telephone ?? '');
  const [mention, setMention] = useState(user?.mention ?? '');
  const [parcours, setParcours] = useState(user?.parcours ?? '');
  const [niveau, setNiveau] = useState(user?.niveau ?? '');
  const [profession, setProfession] = useState(user?.profession ?? '');
  const [sexe, setSexe] = useState<Sexe>(user?.sexe ?? 'Masculin');

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrorMsg('Autorisation requise pour accéder à vos photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPhotoUri(asset.uri);

      setUploadingPhoto(true);
      setErrorMsg(null);
      try {
        const name = asset.uri.split('/').pop() ?? 'photo.jpg';
        await membreService.updateProfilePhoto(user.id, { uri: asset.uri, name, type: 'image/jpeg' });
        await refreshMe();
      } catch (error) {
        setErrorMsg(getApiErrorMessage(error, "Impossible de mettre à jour la photo."));
        setPhotoUri(null);
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleSave = async () => {
    setErrorMsg(null);
    if (!nomComplet.trim()) {
      setErrorMsg('Le nom complet est requis.');
      return;
    }
    if (!/^[\p{L}\s'-]+$/u.test(nomComplet.trim())) {
      setErrorMsg('Le nom complet ne peut contenir que des lettres.');
      return;
    }
    if (!telephone.trim()) {
      setErrorMsg('Le téléphone est requis.');
      return;
    }
    if (!/^\+?[0-9]{7,15}$/.test(telephone.trim())) {
      setErrorMsg('Le numéro de téléphone est invalide (chiffres uniquement).');
      return;
    }

    setSaving(true);
    try {
      await membreService.updateInfo({
        id: user.id,
        nom_complet: nomComplet.trim(),
        email: user.email,
        telephone: telephone.trim(),
        mention: mention.trim() || null,
        parcours: parcours.trim() || null,
        niveau: niveau.trim() || null,
        date_naissance: user.date_naissance,
        sexe,
        cin: user.cin,
        type_membre: user.type_membre,
        role: user.role,
        is_active: user.is_active,
        date_adhesion: user.date_adhesion,
        categorie: user.categorie,
        profession: profession.trim() || null,
        photo_identite: user.photo_identite,
        password: 'unchanged',
      });
      await refreshMe();
      setSuccess(true);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de mettre à jour le profil.'));
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]} edges={['top', 'bottom']}>
        <MaterialIcons name="check-circle" size={64} color={colors.statusValidated} />
        <Text style={styles.successTitle}>Profil mis à jour !</Text>
        <AppButton title="Retour au profil" onPress={() => router.replace('/(tabs)/profil')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={pickPhoto} disabled={uploadingPhoto}>
            {photoUri || user.photo_identite ? (
              <Image source={{ uri: photoUri ?? user.photo_identite ?? undefined }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <MaterialIcons name="person" size={40} color={colors.outline} />
              </View>
            )}
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={14} color={colors.white} />
            </View>
          </TouchableOpacity>
          {uploadingPhoto && <Text style={styles.uploadingText}>Envoi de la photo...</Text>}
        </View>

        <View style={{ gap: spacing.md }}>
          <TextField
            label="Nom complet"
            icon="person-outline"
            value={nomComplet}
            onChangeText={(text) => setNomComplet(filterLettersOnly(text))}
          />
          <TextField
            label="Téléphone"
            icon="phone"
            keyboardType="phone-pad"
            value={telephone}
            onChangeText={(text) => setTelephone(filterPhone(text))}
          />

          <View>
            <Text style={styles.label}>Sexe</Text>
            <View style={styles.chipRow}>
              {(['Masculin', 'Féminin'] as Sexe[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, sexe === s && styles.chipActive]}
                  onPress={() => setSexe(s)}>
                  <Text style={[styles.chipText, sexe === s && styles.chipTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextField label="Mention" icon="school" value={mention} onChangeText={setMention} />
          <TextField label="Parcours" icon="menu-book" value={parcours} onChangeText={setParcours} />
          <TextField label="Niveau" icon="stairs" value={niveau} onChangeText={setNiveau} />
          <TextField label="Profession" icon="work-outline" value={profession} onChangeText={setProfession} />
        </View>

        {!!errorMsg && <ErrorCard message={errorMsg} />}

        <AppButton
          title="Enregistrer"
          loading={saving}
          onPress={handleSave}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

