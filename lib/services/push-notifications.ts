import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { api } from '@/lib/api';

/** Clé locale (AsyncStorage) : préférence notifications push de l'appareil */
export const NOTIF_PREF_KEY = 'idem_notif_active';
/** Clé locale : dernier token Expo Push enregistré sur cet appareil */
const PUSH_TOKEN_KEY = 'idem_expo_push_token';

/**
 * Préférence locale de notifications push (true par défaut).
 * Stockée uniquement dans l'app — aucune donnée en base.
 */
export async function getNotificationsEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(NOTIF_PREF_KEY);
  return value !== '0';
}

/**
 * Active / désactive les notifications push côté appareil :
 * - OFF  → désinscrit le token push auprès du backend (plus aucun envoi)
 * - ON   → réenregistre le token
 */
export async function setPushNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIF_PREF_KEY, enabled ? '1' : '0');

  if (!enabled) {
    const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (token) {
      try {
        await api.post('/notifications/unregister-push-token', { expoPushToken: token });
      } catch {
        // token déjà absent côté backend : ignorer
      }
      await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
    }
  } else {
    await registerForPushNotifications();
  }
}

/**
 * Détecter si on tourne dans Expo Go (les push notifications ne sont pas supportées depuis SDK 53)
 */
function isExpoGo(): boolean {
  return Constants.executionEnvironment === 'storeClient';
}

/**
 * Demander la permission de notifications push
 */
export async function requestPushPermissions(): Promise<boolean> {
  const Notifications = await import('expo-notifications');

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  // Android : créer le channel de notifications
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('idem-notifications', {
      name: 'Notifications IDEM Planète',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2E7D32',
    });
  }

  return true;
}

/**
 * Obtenir le token Expo Push et l'enregistrer auprès du backend
 * Note : les push notifications ne fonctionnent pas dans Expo Go (SDK 53+)
 * Il faut utiliser un development build pour les push notifications.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    // Préférence locale : notifications désactivées → ne pas (ré)enregistrer
    if (!(await getNotificationsEnabled())) {
      return null;
    }

    // Expo Go ne supporte plus les push notifications (remote) depuis SDK 53
    if (isExpoGo()) {
      console.warn(
        'Push notifications désactivées dans Expo Go. Utilisez un development build pour activer les push notifications.'
      );
      return null;
    }

    const Notifications = await import('expo-notifications');

    const hasPermission = await requestPushPermissions();
    if (!hasPermission) return null;

    const projectId =
      process.env.EXPO_PUBLIC_PROJECT_ID ||
      Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.warn(
        "Aucun projectId trouvé. Configurez EXPO_PUBLIC_PROJECT_ID ou extra.eas.projectId dans app.json."
      );
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });

    const expoPushToken = tokenData.data;

    // Enregistrer le token auprès du backend
    await api.post('/notifications/register-push-token', { expoPushToken });

    // Conserver le token localement pour pouvoir le désinscrire plus tard
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, expoPushToken);

    return expoPushToken;
  } catch (error) {
    console.error('Erreur enregistrement push token:', error);
    return null;
  }
}

/**
 * Configurer le handler de notifications reçues
 * Retourne une fonction remove() pour nettoyer les listeners.
 */
export async function setupNotificationHandlers(
  onNotificationReceived?: (notification: any) => void,
  onNotificationTapped?: (response: any) => void
) {
  // Expo Go ne supporte plus les push notifications (remote) depuis SDK 53
  if (isExpoGo()) {
    return { remove: () => {} };
  }

  const Notifications = await import('expo-notifications');

  // Quand une notification est reçue (app au premier plan)
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Listener : notification reçue en premier plan
  const receivedSub = Notifications.addNotificationReceivedListener(
    (notification) => {
      onNotificationReceived?.(notification);
    }
  );

  // Listener : utilisateur tape sur une notification
  const responseSub = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      onNotificationTapped?.(response);
    }
  );

  return {
    remove: () => {
      receivedSub.remove();
      responseSub.remove();
    },
  };
}
