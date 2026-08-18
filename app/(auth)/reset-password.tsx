import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { TextField } from '@/components/ui/text-field';
import { colors, spacing } from '@/constants/design';
import { api, getApiErrorMessage } from '@/lib/api';

import { styles } from '@/styles/app/(auth)/login.styles';

export default function ResetPasswordScreen() {
  const { token: urlToken } = useLocalSearchParams<{ token?: string }>();

  const [token, setToken] = useState(urlToken ?? '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (!token.trim()) {
      setErrorMsg('Le code de réinitialisation est requis.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmation) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token: token.trim(),
        password,
      });
      setSuccess(true);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de réinitialiser le mot de passe.'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.screen, { alignItems: 'center', justifyContent: 'center', padding: spacing.lg }]} edges={['top', 'bottom']}>
        <MaterialIcons name="check-circle" size={64} color={colors.statusValidated} />
        <Text style={[styles.title, { marginTop: spacing.lg, textAlign: 'center' }]}>Mot de passe modifié !</Text>
        <Text style={[styles.subtitle, { textAlign: 'center', marginTop: spacing.sm }]}>
          Votre mot de passe a été réinitialisé avec succès.
          Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </Text>
        <AppButton
          title="Se connecter"
          onPress={() => router.replace('/(auth)/login')}
          style={{ marginTop: spacing.lg }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Réinitialiser le mot de passe</Text>
          <Text style={styles.headerTagline}>Entrez le code reçu par email</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Nouveau mot de passe</Text>
            <Text style={styles.subtitle}>
              Collez le code reçu par email et choisissez un nouveau mot de passe.
            </Text>

            <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
              <TextField
                label="Code de réinitialisation"
                icon="vpn-key"
                placeholder="Collez votre code ici"
                autoCapitalize="none"
                value={token}
                onChangeText={setToken}
              />

              <TextField
                label="Nouveau mot de passe"
                icon="lock-outline"
                placeholder="••••••••"
                isPassword
                value={password}
                onChangeText={setPassword}
              />

              <TextField
                label="Confirmer le mot de passe"
                icon="lock-outline"
                placeholder="••••••••"
                isPassword
                value={confirmation}
                onChangeText={setConfirmation}
              />

              {!!errorMsg && (
                <View style={styles.formError}>
                  <MaterialIcons name="error-outline" size={18} color={colors.error} />
                  <Text style={styles.formErrorText}>{errorMsg}</Text>
                </View>
              )}

              <AppButton
                title="Réinitialiser"
                loading={loading}
                onPress={handleSubmit}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Vous vous souvenez de votre mot de passe ? </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.switchLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
