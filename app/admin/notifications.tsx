import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/constants/design';
import { getApiErrorMessage } from '@/lib/api';
import { adminService } from '@/lib/services/admin';
import type { AppNotification } from '@/types/notification';

import { styles } from '@/styles/app/admin/notifications.styles';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffJ = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffH < 24) return `il y a ${diffH}h`;
  if (diffJ < 7) return `il y a ${diffJ}j`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function getNotifIcon(type: string) {
  switch (type) {
    case 'inscription':
      return { icon: 'person-add' as const, color: '#059669' };
    case 'participation':
      return { icon: 'event' as const, color: '#2563EB' };
    case 'paiement':
      return { icon: 'payments' as const, color: '#D97706' };
    case 'publication':
      return { icon: 'article' as const, color: '#7C3AED' };
    case 'commentaire':
      return { icon: 'chat' as const, color: '#6B7280' };
    default:
      return { icon: 'notifications' as const, color: '#6B7280' };
  }
}

export default function AdminNotificationsScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const data = await adminService.getNotifications();
      setNotifications(data);
    } catch (error) {
      setErrorMsg(getApiErrorMessage(error, 'Impossible de charger les notifications.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const renderItem = ({ item }: { item: AppNotification }) => {
    const notifIcon = getNotifIcon(item.type);
    const isUnread = item.is_read === 0;

    return (
      <View style={[styles.card, isUnread && styles.cardUnread]}>
        <View style={[styles.iconWrapper, { backgroundColor: notifIcon.color + '15' }]}>
          <MaterialIcons name={notifIcon.icon} size={20} color={notifIcon.color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, isUnread && styles.cardTitleUnread]} numberOfLines={1}>
            {item.titre}
          </Text>
          <Text style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
        </View>
        {isUnread && <View style={styles.unreadDot} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Error */}
      {!!errorMsg && (
        <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }}>
          <Text style={{ color: colors.error, ...typography.bodySm }}>{errorMsg}</Text>
        </View>
      )}

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
          ListEmptyComponent={
            <View style={styles.listEmpty}>
              <MaterialIcons name="notifications-none" size={48} color={colors.outline} />
              <Text style={styles.listEmptyText}>Aucune notification.</Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}
