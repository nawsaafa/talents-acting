'use client';

import { ReactNode } from 'react';
import { UpgradePrompt } from './UpgradePrompt';
import type { AccessLevel } from '@/lib/access/types';

interface AccessGateProps {
  hasAccess: boolean;
  accessLevel: AccessLevel;
  children: ReactNode;
  fallback?: ReactNode;
  showPrompt?: boolean;
  promptVariant?: 'inline' | 'card' | 'overlay';
  promptTitle?: string;
  promptMessage?: string;
  className?: string;
}

/**
 * AccessGate component
 *
 * Conditionally renders children based on access level.
 * If access is denied, shows an upgrade prompt or custom fallback.
 */
export function AccessGate({
  hasAccess,
  accessLevel: _accessLevel,
  children,
  fallback,
  showPrompt = true,
  promptVariant = 'card',
  promptTitle,
  promptMessage,
  className = '',
}: AccessGateProps) {
  // accessLevel is available for future use (e.g., showing different prompts per level)
  void _accessLevel;
  // If access is granted, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt
  if (showPrompt) {
    return (
      <UpgradePrompt
        variant={promptVariant}
        title={promptTitle}
        message={promptMessage}
        className={className}
      />
    );
  }

  // No fallback, no prompt - render nothing
  return null;
}

/**
 * PremiumContent component
 *
 * Wrapper that shows content only to premium subscribers.
 * Shows blurred/hidden content with upgrade prompt for non-subscribers.
 */
interface PremiumContentProps {
  hasAccess: boolean;
  children: ReactNode;
  blurredPreview?: ReactNode;
  className?: string;
}

export function PremiumContent({
  hasAccess,
  children,
  blurredPreview,
  className = '',
}: PremiumContentProps) {
  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {blurredPreview && <div className="blur-sm pointer-events-none">{blurredPreview}</div>}
      <UpgradePrompt variant="overlay" />
    </div>
  );
}

/**
 * ContactInfoGate component
 *
 * Specialized gate for contact information.
 * Shows locked state for non-subscribers.
 */
interface ContactInfoGateProps {
  hasAccess: boolean;
  email?: string | null;
  phone?: string | null;
  className?: string;
}

export function ContactInfoGate({ hasAccess, email, phone, className = '' }: ContactInfoGateProps) {
  if (!hasAccess) {
    return (
      <div
        className={`p-4 bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)] rounded-[var(--radius-md)] ${className}`}
      >
        <UpgradePrompt
          variant="inline"
          message="Upgrade to view contact information"
          showFeatures={false}
        />
      </div>
    );
  }

  const hasContactInfo = email || phone;

  if (!hasContactInfo) {
    return (
      <div className={`p-4 bg-[var(--color-neutral-50)] rounded-[var(--radius-md)] ${className}`}>
        <p className="text-sm text-[var(--color-neutral-500)]">No contact information provided</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {email && (
        <p className="text-sm">
          <span className="text-[var(--color-neutral-500)]">Email:</span>{' '}
          <a href={`mailto:${email}`} className="text-[var(--color-primary)] hover:underline">
            {email}
          </a>
        </p>
      )}
      {phone && (
        <p className="text-sm">
          <span className="text-[var(--color-neutral-500)]">Phone:</span>{' '}
          <a href={`tel:${phone}`} className="text-[var(--color-primary)] hover:underline">
            {phone}
          </a>
        </p>
      )}
    </div>
  );
}
