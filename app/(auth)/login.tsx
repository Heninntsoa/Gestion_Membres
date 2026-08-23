import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { Logo } from '@/components/ui/logo';
import { DateField } from '@/components/ui/date-field';
import { TextField } from '@/components/ui/text-field';
import { spacing } from '@/constants/design';
import { useAppTheme } from '@/hooks/use-app-theme';
import { filterDigitsOnly, filterLettersOnly, filterPhone, validators } from '@/lib/validators';
import { useAuthStore } from '@/store/auth-store';
import type { RegisterPayload, Sexe, TypeMembre } from '@/types/membre';

import { makeStyles } from '@/styles/app/(auth)/login.styles';
type LoginForm = {
  email: string;
  password: string;
};

type SignupForm = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  cin: string;
  date_naissance: string;
  adresse: string;
  password: string;
};

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [sexe, setSexe] = useState<Sexe>('Masculin');
  const [typeMembre, setTypeMembre] = useState<TypeMembre>('nouveau');

  const { login, register: registerMembre, isLoading, error, clearError } = useAuthStore();

  const loginForm = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });
  const signupForm = useForm<SignupForm>({
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      cin: '',
      date_naissance: '',
      adresse: '',
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
    const nomComplet = `${values.nom.trim()} ${values.prenom.trim()}`.trim();
    const payload: RegisterPayload = {
      nom_complet: nomComplet,
      email: values.email.trim(),
      telephone: values.telephone.trim(),
      cin: values.cin.trim(),
      date_naissance: values.date_naissance.trim(),
      sexe,
      type_membre: typeMembre,
      password: values.password,
      adresse: values.adresse.trim() || undefined,
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
        {/* Identité de marque, centrée au-dessus du formulaire */}
        <View style={styles.header}>
          <Logo variant="full" height={80} style={{ borderRadius: 16 }} />
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

                  {!!error && (
                    <View style={styles.formError}>
                      <MaterialIcons name="error-outline" size={18} color={colors.error} />
                      <Text style={styles.formErrorText}>{error}</Text>
                    </View>
                  )}

                  <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end', marginTop: -spacing.sm }}>
                    <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '500' }}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>

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
                  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <Controller
                        control={signupForm.control}
                        name="nom"
                        rules={{
                          required: 'Nom requis',
                          ...validators.lettersOnly('Le nom ne peut contenir que des lettres.'),
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            label="Nom"
                            icon="person-outline"
                            placeholder="Dupont"
                            value={field.value}
                            onChangeText={(text) => field.onChange(filterLettersOnly(text))}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Controller
                        control={signupForm.control}
                        name="prenom"
                        rules={{
                          required: 'Prénom requis',
                          ...validators.lettersOnly('Le prénom ne peut contenir que des lettres.'),
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            label="Prénom"
                            icon="person-outline"
                            placeholder="Jean"
                            value={field.value}
                            onChangeText={(text) => field.onChange(filterLettersOnly(text))}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </View>
                  </View>
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
                    rules={{
                      required: 'Téléphone requis',
                      ...validators.phone(),
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="Téléphone"
                        icon="phone"
                        placeholder="034 12 345 67"
                        keyboardType="phone-pad"
                        value={field.value}
                        onChangeText={(text) => field.onChange(filterPhone(text))}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={signupForm.control}
                    name="cin"
                    rules={{
                      required: 'CIN requis',
                      ...validators.digitsOnly('Le CIN ne contient que des chiffres.'),
                      minLength: { value: 10, message: 'Le CIN doit contenir au moins 10 chiffres.' },
                      maxLength: { value: 15, message: 'Le CIN ne doit pas dépasser 15 chiffres.' },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        label="CIN"
                        icon="badge"
                        placeholder="102025023001"
                        keyboardType="number-pad"
                        maxLength={15}
                        value={field.value}
                        onChangeText={(text) => field.onChange(filterDigitsOnly(text))}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={signupForm.control}
                    name="adresse"
                    render={({ field }) => (
                      <TextField
                        label="Adresse"
                        icon="location-on"
                        placeholder="Analakely, Antananarivo"
                        value={field.value}
                        onChangeText={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={signupForm.control}
                    name="date_naissance"
                    rules={{ required: 'Date de naissance requise' }}
                    render={({ field, fieldState }) => (
                      <DateField
                        label="Date de naissance"
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        maximumDate={new Date()}
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

                  {!!error && (
                    <View style={styles.formError}>
                      <MaterialIcons name="error-outline" size={18} color={colors.error} />
                      <Text style={styles.formErrorText}>{error}</Text>
                    </View>
                  )}

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

