import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

const ADMIN_ROLES = ['admin', 'special', 'communication', 'tresor', 'president'];

export default function AdminLayout() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrating = useAuthStore((s) => s.isHydrating);

  useEffect(() => {
    // Attendre la fin de l'hydratation avant de rediriger
    if (isHydrating) return;

    if (!user || !ADMIN_ROLES.includes(user.role)) {
      router.replace('/');
    }
  }, [user, isHydrating, router]);

  // Ne pas afficher le layout tant que l'hydratation n'est pas terminée
  if (isHydrating || !user || !ADMIN_ROLES.includes(user.role)) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="activites" />
      <Stack.Screen name="activite-form" />
      <Stack.Screen name="publications" />
      <Stack.Screen name="publication-form" />
      <Stack.Screen name="cotisations" />
      <Stack.Screen name="cotisation-form" />
      <Stack.Screen name="paiements" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="commentaires" />
      <Stack.Screen name="scan-qr" />
    </Stack>
  );
}
