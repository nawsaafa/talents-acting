import { redirect } from 'next/navigation';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/utils';
import { getNotificationsForUser, getUnreadNotificationCount } from '@/lib/notifications/queries';
import { NotificationList } from '@/components/notifications';
import { Card, Button } from '@/components/ui';

export const metadata = {
  title: 'Notifications | Talents Acting',
  description: 'Your notification history',
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin?callbackUrl=/notifications');
  }

  // Fetch notifications for the user
  const { notifications, total, hasMore } = await getNotificationsForUser(user.id, {
    limit: 20,
  });
  const { count: unreadCount } = await getUnreadNotificationCount(user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-500">
                {total === 0
                  ? 'No notifications yet'
                  : `${total} notification${total !== 1 ? 's' : ''}${
                      unreadCount > 0 ? ` (${unreadCount} unread)` : ''
                    }`}
              </p>
            </div>
          </div>

          <Link href="/settings/notifications">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <Card padding="lg" shadow="sm">
        <NotificationList notifications={notifications} total={total} hasMore={hasMore} />
      </Card>

      {/* Help text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Manage your notification preferences in{' '}
          <Link href="/settings/notifications" className="text-blue-600 hover:underline">
            Settings
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
