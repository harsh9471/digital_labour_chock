import api from './api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  channel: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  imageUrl?: string;
  actionUrl?: string;
  readAt?: string;
  createdAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  channel: string;
  titleTemplate: string;
  bodyTemplate: string;
  isActive: boolean;
  variables: string[];
  createdAt: string;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: { total: number; page: number; limit: number; pages: number };
  unreadCount: number;
}

const BASE = '/notifications';

export const notificationsApi = {
  getMyNotifications: (page = 1, limit = 20, unread = false) =>
    api.get<PaginatedNotifications>(BASE, { params: { page, limit, unread } }),

  getUnreadCount: () =>
    api.get<{ unreadCount: number }>(`${BASE}/unread-count`),

  markRead: (ids?: string[]) =>
    api.patch(`${BASE}/mark-read`, { ids }),

  markAllRead: () =>
    api.patch(`${BASE}/mark-all-read`),

  deleteNotification: (id: string) =>
    api.delete(`${BASE}/${id}`),

  // Admin
  send: (data: { userId: string; title: string; body: string; type?: string }) =>
    api.post(`${BASE}/send`, data),

  bulkSend: (data: { userIds: string[]; title: string; body: string; type?: string }) =>
    api.post(`${BASE}/bulk`, data),

  getStats: () =>
    api.get(`${BASE}/admin/stats`),

  getLogs: (page = 1, limit = 20) =>
    api.get(`${BASE}/admin/logs`, { params: { page, limit } }),

  // Templates
  getTemplates: () =>
    api.get<NotificationTemplate[]>(`${BASE}/templates`),

  createTemplate: (data: Partial<NotificationTemplate>) =>
    api.post(`${BASE}/templates`, data),

  updateTemplate: (id: string, data: Partial<NotificationTemplate>) =>
    api.patch(`${BASE}/templates/${id}`, data),

  deleteTemplate: (id: string) =>
    api.delete(`${BASE}/templates/${id}`),
};
