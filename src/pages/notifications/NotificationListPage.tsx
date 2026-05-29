import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Bell, CheckCheck, Mail, MailOpen, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { notificationsApi } from '@/api/notifications';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Notification } from '@/types';

const typeBadgeStyles: Record<string, { className: string; icon: React.ReactNode }> = {
  info: {
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <Info className="h-3 w-3" />,
  },
  warning: {
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  success: {
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  error: {
    className: 'bg-red-50 text-red-700 border-red-200',
    icon: <XCircle className="h-3 w-3" />,
  },
};

function formatTimestamp(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export default function NotificationListPage() {
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading: listLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list().then((r) => r.data),
  });

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.unreadCount().then((r) => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('Failed to mark all as read');
    },
  });

  const notifications = notificationsData?.data ?? [];
  const unreadCount = unreadData?.unread ?? 0;

  if (listLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Notifications</h1>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 text-xs font-semibold rounded-full bg-[#22BC66] text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={<CheckCheck className="h-4 w-4" />}
            loading={markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell className="h-12 w-12" />}
            title="No notifications"
            description="You're all caught up. New notifications will appear here."
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const typeStyle = typeBadgeStyles[notification.type] || typeBadgeStyles.info;

            return (
              <Card
                key={notification.id}
                className={`transition-colors cursor-pointer ${
                  !notification.is_read ? 'bg-blue-50/30 border-blue-100' : ''
                }`}
                onClick={() => {
                  if (!notification.is_read) {
                    markRead.mutate(notification.id);
                  }
                }}
              >
                <div className="px-6 py-4 flex items-start gap-4">
                  {/* Read/Unread indicator */}
                  <div className="pt-1 shrink-0">
                    {notification.is_read ? (
                      <MailOpen className="h-5 w-5 text-slate-300" />
                    ) : (
                      <Mail className="h-5 w-5 text-[#22BC66]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-semibold truncate ${
                        notification.is_read ? 'text-slate-600' : 'text-slate-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border shrink-0 ${typeStyle.className}`}>
                        {typeStyle.icon}
                        {notification.type}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      notification.is_read ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {notification.message}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap pt-0.5">
                    {formatTimestamp(notification.created_at)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
