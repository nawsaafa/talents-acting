'use client';

import { MessageSquare } from 'lucide-react';
import { ConversationItem } from './ConversationItem';
import type { ConversationPreview } from '@/lib/messaging/types';

interface ConversationListProps {
  conversations: ConversationPreview[];
  activeConversationId?: string;
  emptyMessage?: string;
}

export function ConversationList({
  conversations,
  activeConversationId,
  emptyMessage = 'No conversations yet',
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-[var(--color-neutral-400)]" />
        </div>
        <h3 className="text-lg font-medium text-[var(--color-neutral-700)] mb-2">No Messages</h3>
        <p className="text-sm text-[var(--color-neutral-500)] max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--color-neutral-200)]">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
        />
      ))}
    </div>
  );
}
