import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { Logo } from '@/components/ui/logo';
import { RoleBadge, hasAdminAccess } from '@/components/ui/role-badge';
import { colors, spacing, typography } from '@/constants/design';
import { useAuthStore } from '@/store/auth-store';

import { styles } from '@/styles/app/(tabs)/profil.styles';

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
          <Logo variant="full" height={60} style={{ borderRadius: 12 }} />
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

          {user?.role && user.role !== 'membre' && (
            <View style={{ marginTop: spacing.sm }}>
              <RoleBadge role={user.role} />
            </View>
          )}
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
          title="Paramètres"
          onPress={() => router.push('/profil/parametres')}
        />

        {user?.role && hasAdminAccess(user.role) && (
          <View style={{ marginTop: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm }}>
              <MaterialIcons name="admin-panel-settings" size={18} color={colors.primary} />
              <Text style={{ ...typography.labelMd, color: colors.primary }}>
                Espace Administrateur
              </Text>
            </View>
            <AppButton
              title="Tableau de bord admin"
              variant="outline"
              onPress={() => router.push('/admin/dashboard')}
            />
          </View>
        )}

        <AppButton title="Se déconnecter" variant="outline" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

