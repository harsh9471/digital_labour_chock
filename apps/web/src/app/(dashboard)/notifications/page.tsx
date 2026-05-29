'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationsApi, Notification } from '@/lib/notifications-api';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Trash2, Loader2, Filter } from 'lucide-react';

const TYPE_ICON: Record<string, string> = {
  JOB_APPLICATION: '💼',
  APPLICATION_UPDATE: '📋',
  ATTENDANCE_CHECKIN: '📍',
  PAYROLL_PROCESSED: '💰',
  KYC_UPDATE: '🪪',
  COMPLIANCE_ALERT: '⚠️',
  PAYMENT_RECEIVED: '✅',
  JOB_POSTED: '📢',
  WORKER_HIRED: '🤝',
  COMPLAINT_UPDATE: '🚨',
  SYSTEM_ALERT: '🔔',
  GENERAL: '📬',
};

const TYPE_COLORS: Record<string, string> = {
  JOB_APPLICATION: 'bg-blue-100 text-blue-800',
  APPLICATION_UPDATE: 'bg-indigo-100 text-indigo-800',
  PAYROLL_PROCESSED: 'bg-green-100 text-green-800',
  KYC_UPDATE: 'bg-purple-100 text-purple-800',
  COMPLIANCE_ALERT: 'bg-orange-100 text-orange-800',
  SYSTEM_ALERT: 'bg-red-100 text-red-800',
  GENERAL: 'bg-gray-100 text-gray-700',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationsApi.getMyNotifications(page, 20, unreadOnly);
      const d = (res.data as unknown as { data: { notifications: Notification[]; pagination: { total: number }; unreadCount: number } }).data;
      setNotifications(prev => page === 1 ? d.notifications : [...prev, ...d.notifications]);
      setTotal(d.pagination.total);
      setUnreadCount(d.unreadCount);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [page, unreadOnly]);

  useEffect(() => {
    setPage(1);
    setNotifications([]);
  }, [unreadOnly]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // handled
    }
  };

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markRead([id]);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // handled
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setTotal(prev => prev - 1);
    } catch {
      // handled
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'} · {total} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`gap-2 ${unreadOnly ? 'border-blue-600 text-blue-600' : ''}`}
          >
            <Filter className="h-4 w-4" />
            {unreadOnly ? 'Show All' : 'Unread Only'}
          </Button>
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead} className="gap-2">
              <CheckCheck className="h-4 w-4" /> Mark All Read
            </Button>
          )}
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Bell className="h-14 w-14 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No notifications</p>
          <p className="text-sm mt-1">{unreadOnly ? 'No unread notifications' : 'Nothing to show here'}</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl divide-y">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-4 p-4 hover:bg-gray-50/80 transition-colors group ${!n.isRead ? 'bg-blue-50/30' : ''}`}
            >
              <div className="text-3xl shrink-0 mt-1">
                {TYPE_ICON[n.type] ?? '📬'}
              </div>
              <div className="flex-1 min-w-0" onClick={() => !n.isRead && markRead(n.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-gray-900 ${!n.isRead ? 'font-semibold' : 'font-medium'}`}>
                      {n.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">{n.body}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                    <span className={`hidden sm:inline-flex px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[n.type] ?? 'bg-gray-100 text-gray-700'}`}>
                      {n.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                  <span className="text-xs text-gray-300">·</span>
                  <p className="text-xs text-gray-400 capitalize">{n.channel.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={() => deleteNotification(n.id)}
                className="shrink-0 p-1.5 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {!loading && notifications.length < total && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
          >
            Load More
          </Button>
        </div>
      )}

      {loading && page > 1 && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
}
