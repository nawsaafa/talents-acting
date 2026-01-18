import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth/utils';
import { getUserSubscriptionByRole } from '@/lib/payment/queries';
import {
  getConversationWithMessages,
  isConversationParticipant,
  markConversationAsRead,
} from '@/lib/messaging/queries';
import { canViewConversation } from '@/lib/messaging/access';
import { MessageList } from '@/components/messaging/MessageList';
import { ComposeMessage } from '@/components/messaging/ComposeMessage';
import { canReplyToConversation, buildMessagingContext } from '@/lib/messaging/access';
import { Card } from '@/components/ui/Card';

interface ConversationPageProps {
  params: Promise<{ conversationId: string }>;
}

export async function generateMetadata({ params }: ConversationPageProps) {
  const { conversationId } = await params;
  return {
    title: 'Conversation | Talents Acting',
    description: `Conversation ${conversationId}`,
  };
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/auth/signin?callbackUrl=/messages/${conversationId}`);
  }

  // Check if user can view this conversation
  const isParticipant = await isConversationParticipant(conversationId, user.id);

  if (!canViewConversation(user.id, isParticipant ? [user.id] : [], user.role) && !isParticipant) {
    notFound();
  }

  // Get conversation with messages
  const conversation = await getConversationWithMessages(conversationId);

  if (!conversation) {
    notFound();
  }

  // Mark messages as read
  await markConversationAsRead(conversationId, user.id);

  // Find the other participant
  const otherParticipant = conversation.participants.find((p) => p.userId !== user.id);

  // Fetch subscription status from database
  const subscription = await getUserSubscriptionByRole(user.id, user.role);

  // Check if user can reply
  const messagingContext = buildMessagingContext({
    id: user.id,
    role: user.role,
    subscriptionStatus: subscription?.status,
  });

  const replyAccess = canReplyToConversation(messagingContext, isParticipant);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-4">
        <Link
          href="/messages"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Messages
        </Link>
      </div>

      <Card padding="none" shadow="sm" className="overflow-hidden">
        {/* Conversation header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--color-neutral-200)] bg-white">
          {/* Avatar */}
          {otherParticipant?.photo ? (
            <img
              src={otherParticipant.photo}
              alt={otherParticipant.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
              {otherParticipant?.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || '?'}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-[var(--color-neutral-900)] truncate">
              {otherParticipant?.name || 'Unknown User'}
            </h1>
            <span className="text-xs text-[var(--color-neutral-500)] capitalize">
              {otherParticipant?.role.toLowerCase() || 'user'}
            </span>
          </div>

          {/* Link to profile if talent */}
          {otherParticipant?.role === 'TALENT' && (
            <Link
              href={`/talents/${otherParticipant.userId}`}
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              View Profile
            </Link>
          )}
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto bg-[var(--color-neutral-50)]">
          <MessageList
            messages={conversation.messages}
            currentUserId={user.id}
            participants={conversation.participants}
          />
        </div>

        {/* Compose */}
        <ComposeMessage
          recipientId={otherParticipant?.userId || ''}
          conversationId={conversationId}
          disabled={!replyAccess.canSend}
          disabledReason={replyAccess.reason}
        />
      </Card>

      {/* Info text */}
      <div className="mt-4 text-center">
        <p className="text-xs text-[var(--color-neutral-400)]">
          Messages are private between you and {otherParticipant?.name || 'this user'}.
        </p>
      </div>
    </div>
  );
}
