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

import { colors, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { adminService } from '@/lib/services/admin';

import { styles } from '@/styles/app/admin/publication-form.styles';

export default function AdminPublicationFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const [contenu, setContenu] = useState('');
  const [image, setImage] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) {
      loadPublication();
    }
  }, [id]);

  const loadPublication = async () => {
    try {
      const pub = await adminService.getPublicationById(Number(id));
      setContenu(pub.content);
      setExistingImage(pub.image);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger la publication.'));
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    if (!contenu.trim()) {
      setErrorMsg('Le contenu est obligatoire.');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      if (isEdit) {
        await adminService.updatePublication(Number(id), { contenu: contenu.trim(), image });
      } else {
        await adminService.createPublication({ contenu: contenu.trim(), image });
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
          <Text style={styles.headerTitle}>{isEdit ? 'Modifier' : 'Nouvelle publication'}</Text>
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
        <Text style={styles.headerTitle}>{isEdit ? 'Modifier la publication' : 'Nouvelle publication'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Contenu */}
        <Text style={styles.label}>Contenu *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={contenu}
          onChangeText={setContenu}
          placeholder="Écrivez votre publication..."
          placeholderTextColor={colors.outline}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />

        {/* Image picker */}
        <Text style={styles.label}>Image (optionnel)</Text>
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

        {/* Error */}
        {!!errorMsg && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>
              {isEdit ? 'Enregistrer' : 'Publier'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
