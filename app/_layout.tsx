import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { colors } from '@/constants/design';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { resolveNotificationRoute } from '@/lib/notification-routes';
import { registerForPushNotifications, setupNotificationHandlers } from '@/lib/services/push-notifications';
import { useAuthStore } from '@/store/auth-store';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Redirige vers /(auth)/login si l'utilisateur n'est pas connecté,
 * et vers /(tabs) s'il est connecté mais encore sur l'écran de login.
 * Enregistre aussi le push token et configure les handlers de notifications.
 */
function useAuthGate() {
  const { token, isHydrating, hydrate } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const notificationSetupDone = useRef(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Enregistrer le push token et configurer les notifications une fois connecté
  useEffect(() => {
    if (!token || notificationSetupDone.current) return;
    notificationSetupDone.current = true;
    let mounted = true;
    let cleanup: (() => void) | null = null;

    (async () => {
      // Enregistrer le token push auprès du backend
      registerForPushNotifications().catch(() => {});

      // Configurer les handlers de notifications
      const handlers = await setupNotificationHandlers(
        // Notification reçue en premier plan
        (_notification) => {
          // Optionnel : mettre à jour le badge, rafraîchir les données, etc.
        },
        // Utilisateur tape sur une notification
        (response: any) => {
          const data = response.notification.request.content.data;
          const route = resolveNotificationRoute(data?.lien, data?.reference_id);
          if (route) {
            router.push(route);
          }
        }
      );

      if (mounted) {
        cleanup = handlers.remove;
      } else {
        handlers.remove();
      }
    })();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [token, router]);

  useEffect(() => {
    if (isHydrating) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, isHydrating, segments, router]);

  return isHydrating;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isHydrating = useAuthGate();

  if (isHydrating) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ headerShown: true, presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}