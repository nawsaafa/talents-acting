import { redirect } from 'next/navigation';
import { Bell, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/utils';
import { getNotificationPreferences } from '@/lib/notifications/queries';
import { NotificationPreferences } from '@/components/notifications';
import { Button } from '@/components/ui';

export const metadata = {
  title: 'Notification Settings | Talents Acting',
  description: 'Manage your notification preferences',
};

export default async function NotificationSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin?callbackUrl=/settings/notifications');
  }

  // Fetch user's notification preferences
  const preferences = await getNotificationPreferences(user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/notifications">
          <Button variant="ghost" size="sm" className="mb-4 flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-4 h-4" />
            Back to Notifications
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-sm text-gray-500">Control how and when you receive notifications</p>
          </div>
        </div>
      </div>

      {/* Preferences Form */}
      <NotificationPreferences preferences={preferences} />

      {/* Help text */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">About Notifications</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            <strong>In-app notifications</strong> appear in the bell icon in the header
          </li>
          <li>
            <strong>Email notifications</strong> are sent to your registered email address
          </li>
          <li>
            Email notifications are rate-limited to at most one per hour per notification type
          </li>
        </ul>
      </div>
    </div>
  );
}
