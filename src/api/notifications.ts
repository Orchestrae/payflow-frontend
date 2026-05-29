import apiClient from './client';
import type { Notification } from '@/types';

export const notificationsApi = {
  list(page = 1, limit = 20) {
    return apiClient.get<{ data: Notification[]; total: number }>('/v1/notifications', { params: { page, limit } });
  },
  unreadCount() {
    return apiClient.get<{ unread: number }>('/v1/notifications/unread-count');
  },
  markRead(id: number) {
    return apiClient.patch(`/v1/notifications/${id}/read`);
  },
  markAllRead() {
    return apiClient.patch('/v1/notifications/read-all');
  },
};
