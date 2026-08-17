import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { TextField } from '@/components/ui/text-field';
import { spacing } from '@/constants/design';
import { useAuthStore } from '@/store/auth-store';
import type { RegisterPayload, Sexe, TypeMembre } from '@/types/membre';

import { styles } from '@/styles/app/(auth)/login.styles';
type LoginForm = {
  email: string;
  password: string;
};

type SignupForm = {
  nom_complet: string;
  email: string;
  telephone: string;
  cin: string;
  date_naissance: string;
  password: string;
};

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [sexe, setSexe] = useState<Sexe>('Masculin');
  const [typeMembre, setTypeMembre] = useState<TypeMembre>('nouveau');

  const { login, register: registerMembre, isLoading, error, clearError } = useAuthStore();

  const loginForm = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });
  const signupForm = useForm<SignupForm>({
    defaultValues: {
      nom_complet: '',
      email: '',
      telephone: '',
      cin: '',
      date_naissance: '',
      password: '',
    },
  });

  const onLogin = async (values: LoginForm) => {
    clearError();
    try {
      await login(values.email.trim(), values.password);
      router.replace('/(tabs)');
    } catch {
      // l'erreur est déjà affichée via le store (error)
    }
  };

  const onSignup = async (values: SignupForm) => {
    clearError();
    const payload: RegisterPayload = {
      nom_complet: values.nom_complet.trim(),
      email: values.email.trim(),
      telephone: values.telephone.trim(),
      cin: values.cin.trim(),
      date_naissance: values.date_naissance.trim(),
      sexe,
      type_membre: typeMembre,
      password: values.password,
    };
    try {
      await registerMembre(payload);
      setMode('login');
      loginForm.setValue('email', payload.email);
    } catch {
      // erreur déjà affichée via le store
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Top bar identité */}
        <View style={styles.header}>
          <Image source={require('@/assets/images/logo.jpeg')} style={styles.logo} />
          <Text style={styles.headerTitle}>IDEM Planète</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {mode === 'login' ? (
              <>
                <Text style={styles.title}>Bon retour parmi nous</Text>
                <Text style={styles.subtitle}>
                  Connectez-vous pour accéder à votre espace IDEM.
                </Text>

                <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
                  <Controller
                    control={loginForm.control}
                    name="email"
                    rules={{ required: 'Email requis' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Email"
                        icon="mail-outline"
                        placeholder="jean.dupont@exemple.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={loginForm.control}
                    name="password"
                    rules={{ required: 'Mot de passe requis' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Mot de passe"
                        icon="lock-outline"
                        placeholder="••••••••"
                        isPassword
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  {!!error && <Text style={styles.formError}>{error}</Text>}

                  <AppButton
                    title="Se connecter"
                    loading={isLoading}
                    onPress={loginForm.handleSubmit(onLogin)}
                  />
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>Vous n&apos;avez pas encore de compte ? </Text>
                  <TouchableOpacity
                    onPress={() => {
                      clearError();
                      setMode('signup');
                    }}>
                    <Text style={styles.switchLink}>S&apos;inscrire</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>Rejoindre l&apos;association</Text>
                <Text style={styles.subtitle}>
                  Engagez-vous pour la planète en quelques clics.
                </Text>

                <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
                  <Controller
                    control={signupForm.control}
                    name="nom_complet"
                    rules={{ required: 'Nom complet requis' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Nom complet"
                        icon="person-outline"
                        placeholder="Jean Dupont"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={signupForm.control}
                    name="email"
                    rules={{ required: 'Email requis' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Email"
                        icon="mail-outline"
                        placeholder="jean.dupont@exemple.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={signupForm.control}
                    name="telephone"
                    rules={{ required: 'Téléphone requis' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Téléphone"
                        icon="phone"
                        placeholder="034 12 345 67"
                        keyboardType="phone-pad"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={signupForm.control}
                    name="cin"
                    rules={{ required: 'CIN requis' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="CIN"
                        icon="badge"
                        placeholder="102025023001"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={signupForm.control}
                    name="date_naissance"
                    rules={{ required: 'Date de naissance requise' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Date de naissance"
                        icon="cake"
                        placeholder="AAAA-MM-JJ"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  <View style={styles.chipRow}>
                    {(['Masculin', 'Féminin'] as Sexe[]).map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.chip, sexe === s && styles.chipActive]}
                        onPress={() => setSexe(s)}>
                        <Text style={[styles.chipText, sexe === s && styles.chipTextActive]}>
                          {s}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.chipRow}>
                    {(['nouveau', 'ancien'] as TypeMembre[]).map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.chip, typeMembre === t && styles.chipActive]}
                        onPress={() => setTypeMembre(t)}>
                        <Text style={[styles.chipText, typeMembre === t && styles.chipTextActive]}>
                          {t === 'nouveau' ? 'Nouveau membre' : 'Ancien membre'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Controller
                    control={signupForm.control}
                    name="password"
                    rules={{
                      required: 'Mot de passe requis',
                      minLength: { value: 6, message: '6 caractères minimum' },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Mot de passe"
                        icon="lock-outline"
                        placeholder="••••••••"
                        isPassword
                        value={field.value}
                        onChangeText={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  {!!error && <Text style={styles.formError}>{error}</Text>}

                  <AppButton
                    title="Créer mon compte"
                    loading={isLoading}
                    onPress={signupForm.handleSubmit(onSignup)}
                  />
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>Vous avez déjà un compte ? </Text>
                  <TouchableOpacity
                    onPress={() => {
                      clearError();
                      setMode('login');
                    }}>
                    <Text style={styles.switchLink}>Se connecter</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

