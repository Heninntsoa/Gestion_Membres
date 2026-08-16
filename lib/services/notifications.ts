import { api } from '@/lib/api';
import type { AppNotification } from '@/types/notification';

export const notificationsService = {
  getAll: async (): Promise<AppNotification[]> => {
    const { data } = await api.get<{ success: boolean; data: AppNotification[] }>('/notifications');
    return data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get<{ success: boolean; total: number }>('/notifications/unread-count');
    return data.total;
  },

  markAsRead: async (id: number) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.patch('/notifications/read-all');
    return data;
  },

  remove: async (id: number) => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },
};
