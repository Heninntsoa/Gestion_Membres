import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { api } from '@/lib/api';

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
