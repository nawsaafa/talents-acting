'use client';

import Link from 'next/link';
import { Lock, CreditCard, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UpgradePromptProps {
  title?: string;
  message?: string;
  showFeatures?: boolean;
  variant?: 'inline' | 'card' | 'overlay';
  className?: string;
}

const defaultFeatures = [
  'View full talent profiles and contact information',
  'Access premium talent data including rates and availability',
  'Contact talents directly for casting opportunities',
  'Unlimited profile views and searches',
];

export function UpgradePrompt({
  title = 'Premium Access Required',
  message = 'Upgrade your subscription to access premium talent data.',
  showFeatures = true,
  variant = 'card',
  className = '',
}: UpgradePromptProps) {
  if (variant === 'inline') {
    return (
      <div
        className={`flex items-center gap-3 p-4 bg-[var(--color-warning-bg)] border border-[var(--color-warning)] rounded-[var(--radius-md)] ${className}`}
      >
        <Lock className="h-5 w-5 text-[var(--color-warning)]" />
        <div className="flex-1">
          <p className="text-sm text-[var(--color-neutral-700)]">{message}</p>
        </div>
        <Link href="/pricing">
          <Button size="sm" variant="primary">
            Upgrade
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-[var(--radius-lg)] ${className}`}
      >
        <div className="text-center p-6 max-w-md">
          <Lock className="h-12 w-12 mx-auto mb-4 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-2">{title}</h3>
          <p className="text-[var(--color-neutral-600)] mb-4">{message}</p>
          <Link href="/pricing">
            <Button variant="primary">
              <CreditCard className="h-4 w-4" />
              View Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div
      className={`bg-white border border-[var(--color-neutral-200)] rounded-[var(--radius-lg)] p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 bg-[var(--color-primary-bg)] rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-2">{title}</h3>
          <p className="text-[var(--color-neutral-600)] mb-4">{message}</p>

          {showFeatures && (
            <ul className="space-y-2 mb-6">
              {defaultFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--color-neutral-600)]">{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-3">
            <Link href="/pricing">
              <Button variant="primary">
                <CreditCard className="h-4 w-4" />
                View Plans
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
