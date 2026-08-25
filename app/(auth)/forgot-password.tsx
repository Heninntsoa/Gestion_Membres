import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { Logo } from '@/components/ui/logo';
import { TextField } from '@/components/ui/text-field';
import { spacing } from '@/constants/design';
import { useAppTheme } from '@/hooks/use-app-theme';
import { api, getApiErrorMessage } from '@/lib/api';

import { makeStyles } from '@/styles/app/(auth)/login.styles';

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email.trim()) return;
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setCooldown(60);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de renvoyer le code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Email requis.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setSuccess(true);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de traiter votre demande.'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.screen, { alignItems: 'center', justifyContent: 'center', padding: spacing.lg }]} edges={['top', 'bottom']}>
        <MaterialIcons name="mark-email-read" size={64} color={colors.statusValidated} />
        <Text style={[styles.title, { marginTop: spacing.lg, textAlign: 'center' }]}>Email envoyé !</Text>
        <Text style={[styles.subtitle, { textAlign: 'center', marginTop: spacing.sm }]}>
          Si un compte existe avec cette adresse email, vous recevrez un code de réinitialisation.
          Vérifiez votre boîte de réception et vos spams.
        </Text>

        <View style={{ gap: spacing.md, marginTop: spacing.lg, width: '100%' }}>
          <AppButton
            title="Saisir le code"
            onPress={() => router.push({ pathname: '/(auth)/reset-password', params: { fromForgot: '1' } })}
          />
          <TouchableOpacity
            onPress={handleResend}
            disabled={cooldown > 0}
            style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
            <Text style={{ color: cooldown > 0 ? colors.textSecondary : colors.primary, fontSize: 13, fontWeight: '500' }}>
              {cooldown > 0 ? `Renvoyer le code dans ${cooldown}s` : 'Renvoyer le code'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={{ marginTop: spacing.md }}>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Retour à la connexion</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Logo variant="full" height={80} style={{ borderRadius: 16 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </Text>

            <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
              <TextField
                label="Email"
                icon="mail-outline"
                placeholder="jean.dupont@exemple.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              {!!errorMsg && (
                <View style={styles.formError}>
                  <MaterialIcons name="error-outline" size={18} color={colors.error} />
                  <Text style={styles.formErrorText}>{errorMsg}</Text>
                </View>
              )}

              <AppButton
                title="Envoyer le lien"
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
