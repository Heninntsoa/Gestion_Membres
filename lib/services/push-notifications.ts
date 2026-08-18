import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { api } from '@/lib/api';

/**
 * Demander la permission de notifications push
 */
export async function requestPushPermissions(): Promise<boolean> {
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
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    const hasPermission = await requestPushPermissions();
    if (!hasPermission) return null;

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });

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
 */
export function setupNotificationHandlers(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
) {
  // Quand une notification est reçue (app au premier plan)
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
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
