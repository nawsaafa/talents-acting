import { redirect } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/utils';
import { getConversationsForUser, getTotalUnreadCount } from '@/lib/messaging/queries';
import { ConversationList } from '@/components/messaging/ConversationList';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Messages | Talents Acting',
  description: 'Your message inbox',
};

export default async function MessagesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin?callbackUrl=/messages');
  }

  // Fetch conversations for the user
  const conversations = await getConversationsForUser(user.id);
  const totalUnread = await getTotalUnreadCount(user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[var(--color-primary-bg)] rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Messages</h1>
              <p className="text-sm text-[var(--color-neutral-500)]">
                {conversations.length === 0
                  ? 'No conversations yet'
                  : `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}${
                      totalUnread > 0 ? ` (${totalUnread} unread)` : ''
                    }`}
              </p>
            </div>
          </div>

          {totalUnread > 0 && (
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </div>
      </div>

      <Card padding="none" shadow="sm">
        <ConversationList
          conversations={conversations}
          emptyMessage={
            user.role === 'TALENT'
              ? 'No messages yet. Professionals and companies will contact you here.'
              : 'No messages yet. Contact talents from their profile pages to start a conversation.'
          }
        />
      </Card>

      {/* Help text based on role */}
      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-neutral-500)]">
          {user.role === 'TALENT'
            ? 'Professionals and companies with active subscriptions can contact you through this messaging system.'
            : user.role === 'PROFESSIONAL' || user.role === 'COMPANY'
              ? 'Browse talent profiles and click the "Contact" button to start a conversation.'
              : 'Sign in as a professional or company to contact talents.'}
        </p>
      </div>
    </div>
  );
}
