import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { colors, radius, spacing, typography } from '@/constants/design';
import { useAuthStore } from '@/store/auth-store';

export default function ProfilScreen() {
  const { user, refreshMe, logout } = useAuthStore();

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="eco" size={26} color={colors.primary} />
          <Text style={styles.headerTitle}>IDEM Planète</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            {user?.photo_identite ? (
              <Image source={{ uri: user.photo_identite }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <MaterialIcons name="person" size={36} color={colors.outline} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.nom_complet ?? '...'}</Text>

          <View
            style={[
              styles.badge,
              user?.is_active ? styles.badgeActive : styles.badgePending,
            ]}>
            <Text style={styles.badgeText}>
              {user?.is_active ? 'Membre actif' : "En attente d'activation"}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <MaterialIcons name="mail-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          {!!user?.telephone && (
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user.telephone}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <MaterialIcons name="badge" size={18} color={colors.textSecondary} />
            <Text style={styles.infoText}>Matricule : {user?.matricule}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="verified-user" size={18} color={colors.textSecondary} />
            <Text style={styles.infoText}>Rôle : {user?.role}</Text>
          </View>
        </View>

        <AppButton
          title="Modifier le profil"
          onPress={() => router.push('/profil/edit')}
        />
        <AppButton
          title="Changer le mot de passe"
          variant="outline"
          onPress={() => router.push('/profil/change-password')}
        />
        <AppButton
          title="Mes participations"
          variant="outline"
          onPress={() => router.push('/participations')}
        />
        <AppButton
          title="Historique des paiements"
          variant="outline"
          onPress={() => router.push('/paiements/historique')}
        />
        <AppButton title="Se déconnecter" variant="outline" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.headlineSm,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 8,
  },
  avatarWrapper: {
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.headlineLg,
    fontSize: 20,
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  infoText: {
    ...typography.bodyMd,
    color: colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  badgeActive: {
    backgroundColor: '#DFF5E1',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.textPrimary,
  },
});
