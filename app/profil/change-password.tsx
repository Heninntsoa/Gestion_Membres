import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { TextField } from '@/components/ui/text-field';
import { colors, spacing } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { membreService } from '@/lib/services/membre';
import { useAuthStore } from '@/store/auth-store';

import { styles } from '@/styles/app/profil/change-password.styles';

export default function ChangePasswordScreen() {
  const { user } = useAuthStore();

  const [nouveauPassword, setNouveauPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (nouveauPassword.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (nouveauPassword !== confirmation) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setSaving(true);
    try {
      await membreService.changePassword(user.id, nouveauPassword);
      setSuccess(true);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de modifier le mot de passe.'));
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]} edges={['top', 'bottom']}>
        <MaterialIcons name="check-circle" size={64} color={colors.statusValidated} />
        <Text style={styles.successTitle}>Mot de passe modifié !</Text>
        <Text style={styles.successText}>
          Utilisez votre nouveau mot de passe lors de votre prochaine connexion.
        </Text>
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
        <Text style={styles.headerTitle}>Changer le mot de passe</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.hint}>
          Choisissez un nouveau mot de passe d&apos;au moins 6 caractères.
        </Text>

        <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
          <TextField
            label="Nouveau mot de passe"
            icon="lock-outline"
            placeholder="••••••••"
            isPassword
            value={nouveauPassword}
            onChangeText={setNouveauPassword}
          />
          <TextField
            label="Confirmer le mot de passe"
            icon="lock-outline"
            placeholder="••••••••"
            isPassword
            value={confirmation}
            onChangeText={setConfirmation}
          />
        </View>

        {!!errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        <AppButton
          title="Enregistrer"
          loading={saving}
          onPress={handleSubmit}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    </SafeAreaView>
  );
}

