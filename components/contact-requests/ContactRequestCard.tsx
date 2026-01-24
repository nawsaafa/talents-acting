'use client';

import { formatDistanceToNow, format } from 'date-fns';
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Building2,
  Film,
  Tv,
  Megaphone,
  Theater,
  Mic2,
  Camera,
  HelpCircle,
} from 'lucide-react';
import type { ContactRequestInfo } from '@/lib/contact-requests/types';
import { ContactRequestActions } from './ContactRequestActions';

interface ContactRequestCardProps {
  request: ContactRequestInfo;
  viewType: 'requester' | 'talent' | 'admin';
  onRespond?: (requestId: string, approve: boolean, reason?: string) => void;
  isResponding?: boolean;
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  },
  DECLINED: {
    label: 'Declined',
    icon: XCircle,
    className: 'bg-[var(--color-error-light)] text-[var(--color-error)]',
  },
  EXPIRED: {
    label: 'Expired',
    icon: Clock,
    className: 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-600)]',
  },
};

const PROJECT_TYPE_ICONS = {
  FILM: Film,
  TV_SERIES: Tv,
  COMMERCIAL: Megaphone,
  THEATER: Theater,
  VOICE_OVER: Mic2,
  MODELING: Camera,
  OTHER: HelpCircle,
};

const PROJECT_TYPE_LABELS = {
  FILM: 'Film',
  TV_SERIES: 'TV Series',
  COMMERCIAL: 'Commercial',
  THEATER: 'Theater',
  VOICE_OVER: 'Voice Over',
  MODELING: 'Modeling',
  OTHER: 'Other',
};

export function ContactRequestCard({
  request,
  viewType,
  onRespond,
  isResponding = false,
}: ContactRequestCardProps) {
  const statusConfig = STATUS_CONFIG[request.status];
  const StatusIcon = statusConfig.icon;
  const ProjectIcon = PROJECT_TYPE_ICONS[request.projectType] || HelpCircle;

  const timeAgo = formatDistanceToNow(new Date(request.createdAt), { addSuffix: true });
  const formattedDate = format(new Date(request.createdAt), 'MMM d, yyyy');

  // Determine display name based on view type
  const displayName = viewType === 'talent' ? request.requesterName : request.talentName;
  const displayPhoto = viewType === 'talent' ? null : request.talentPhoto;
  const displaySubtitle =
    viewType === 'talent' ? request.requesterCompany || request.requesterProfession : null;

  // Get initials for avatar fallback
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white border border-[var(--color-neutral-200)] rounded-[var(--radius-lg)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-neutral-100)]">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
                {viewType === 'talent' ? (
                  request.requesterCompany ? (
                    <Building2 className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )
                ) : (
                  initials
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-[var(--color-neutral-900)] truncate">
                {displayName}
              </h3>
              <span
                className={`
                  inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full
                  ${statusConfig.className}
                `.trim()}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
            </div>
            {displaySubtitle && (
              <p className="text-sm text-[var(--color-neutral-600)] truncate">{displaySubtitle}</p>
            )}
            <p className="text-xs text-[var(--color-neutral-500)] mt-1">
              {timeAgo} ({formattedDate})
            </p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="px-4 py-3 bg-[var(--color-neutral-50)] border-b border-[var(--color-neutral-100)]">
        <div className="flex items-center gap-2">
          <ProjectIcon className="w-4 h-4 text-[var(--color-neutral-500)]" />
          <span className="text-sm font-medium text-[var(--color-neutral-700)]">
            {PROJECT_TYPE_LABELS[request.projectType]}
          </span>
          {request.projectName && (
            <>
              <span className="text-[var(--color-neutral-400)]">:</span>
              <span className="text-sm text-[var(--color-neutral-600)]">{request.projectName}</span>
            </>
          )}
        </div>
      </div>

      {/* Purpose */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wide mb-2">
          Purpose
        </h4>
        <p className="text-sm text-[var(--color-neutral-700)] whitespace-pre-wrap">
          {request.purpose}
        </p>
      </div>

      {/* Personal Message */}
      {request.message && (
        <div className="px-4 pb-4">
          <h4 className="text-xs font-semibold text-[var(--color-neutral-500)] uppercase tracking-wide mb-2">
            Personal Message
          </h4>
          <div className="p-3 bg-[var(--color-neutral-50)] rounded-[var(--radius-md)] border-l-4 border-[var(--color-primary)]">
            <p className="text-sm text-[var(--color-neutral-600)] italic">
              &quot;{request.message}&quot;
            </p>
          </div>
        </div>
      )}

      {/* Decline Reason (if declined) */}
      {request.status === 'DECLINED' && request.declineReason && (
        <div className="px-4 pb-4">
          <h4 className="text-xs font-semibold text-[var(--color-error)] uppercase tracking-wide mb-2">
            Decline Reason
          </h4>
          <p className="text-sm text-[var(--color-neutral-600)]">{request.declineReason}</p>
        </div>
      )}

      {/* Response Date */}
      {request.respondedAt && (
        <div className="px-4 pb-4">
          <p className="text-xs text-[var(--color-neutral-500)]">
            Responded: {format(new Date(request.respondedAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      )}

      {/* Actions (for talent view on pending requests) */}
      {viewType === 'talent' && request.status === 'PENDING' && onRespond && (
        <ContactRequestActions
          requestId={request.id}
          onRespond={onRespond}
          isResponding={isResponding}
        />
      )}
    </div>
  );
}
