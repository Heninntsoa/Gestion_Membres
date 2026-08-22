import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/design';
import { ErrorCard } from '@/components/ui/error-card';
import { getApiErrorMessage } from '@/lib/api';
import { resolveNotificationRoute } from '@/lib/notification-routes';
import { notificationsService } from '@/lib/services/notifications';
import type { AppNotification } from '@/types/notification';

import { styles } from '@/styles/app/notifications/index.styles';
const typeIcon: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  activites: 'event',
  publication: 'article',
  adhésion: 'how-to-reg',
  paiement: 'payments',
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    try {
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les notifications.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handlePress = async (notif: AppNotification) => {
    if (!notif.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: 1 } : n))
      );
      notificationsService.markAsRead(notif.id).catch(() => {});
    }
    const route = resolveNotificationRoute(notif.lien, notif.reference_id);
    if (route) router.push(route);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    try {
      await notificationsService.markAllAsRead();
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de tout marquer comme lu.'));
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Tout lire</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>

      {!!errorMsg && <ErrorCard message={errorMsg} />}

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="notifications-none" size={48} color={colors.outline} />
              <Text style={styles.emptyText}>Aucune notification pour le moment.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, !item.is_read && styles.itemUnread]}
            onPress={() => handlePress(item)}>
            <View style={styles.itemIcon}>
              <MaterialIcons
                name={typeIcon[item.type] ?? 'notifications'}
                size={18}
                color={colors.statusValidated}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.titre}</Text>
              <Text style={styles.itemMessage} numberOfLines={2}>
                {item.message}
              </Text>
              <Text style={styles.itemDate}>{timeAgo(item.created_at)}</Text>
            </View>
            {!item.is_read && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

