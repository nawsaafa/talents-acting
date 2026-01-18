'use client';

import { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import type { MessageInfo, ConversationParticipantInfo } from '@/lib/messaging/types';

interface MessageListProps {
  messages: MessageInfo[];
  currentUserId: string;
  participants: ConversationParticipantInfo[];
  autoScroll?: boolean;
}

export function MessageList({
  messages,
  currentUserId,
  participants,
  autoScroll = true,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, autoScroll]);

  // Get participant name by ID
  const getParticipantName = (userId: string): string => {
    const participant = participants.find((p) => p.userId === userId);
    return participant?.name || 'Unknown';
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-full">
        <p className="text-sm text-[var(--color-neutral-500)]">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: MessageInfo[] }[] = [];
  let currentDate = '';

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt).toDateString();
    if (messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({ date: messageDate, messages: [message] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message);
    }
  });

  return (
    <div className="flex flex-col px-4 py-4 overflow-y-auto">
      {groupedMessages.map((group) => (
        <div key={group.date}>
          {/* Date divider */}
          <div className="flex items-center justify-center my-4">
            <span className="px-3 py-1 text-xs text-[var(--color-neutral-500)] bg-[var(--color-neutral-100)] rounded-full">
              {formatDateHeader(group.date)}
            </span>
          </div>

          {/* Messages for this date */}
          {group.messages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUserId;
            const prevMessage = index > 0 ? group.messages[index - 1] : null;
            const showSenderName =
              !isOwnMessage && (!prevMessage || prevMessage.senderId !== message.senderId);

            return (
              <MessageItem
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                senderName={showSenderName ? getParticipantName(message.senderId) : undefined}
              />
            );
          })}
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}

function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}
