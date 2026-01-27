'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleUserStatus } from '@/lib/admin/actions';

interface UserStatusToggleProps {
  userId: string;
  isActive: boolean;
  disabled?: boolean;
}

export function UserStatusToggle({ userId, isActive, disabled = false }: UserStatusToggleProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setIsLoading(true);
    setError(null);

    const result = await toggleUserStatus({
      userId,
      isActive: !isActive,
    });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || 'Failed to update status');
    }

    setIsLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={disabled || isLoading}
        className={`
          relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full
          transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:ring-offset-2 focus:ring-offset-[var(--color-black)]
          ${
            isActive
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30'
              : 'bg-[var(--color-surface-light)]/50 border border-[var(--color-surface-light)]/30'
          }
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
        `}
        role="switch"
        aria-checked={isActive}
      >
        <span
          className={`
            pointer-events-none inline-flex h-5 w-5 items-center justify-center transform rounded-full
            shadow-md ring-0 transition-all duration-300 ease-out mt-1
            ${isActive ? 'translate-x-8 bg-white' : 'translate-x-1 bg-[var(--color-text-muted)]'}
          `}
        >
          {isLoading && (
            <svg
              className="w-3 h-3 animate-spin text-[var(--color-surface)]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
        </span>
      </button>
      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          isActive ? 'text-emerald-400' : 'text-[var(--color-text-muted)]'
        }`}
      >
        {isLoading ? 'Updating...' : isActive ? 'Active' : 'Inactive'}
      </span>
      {error && (
        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
          {error}
        </span>
      )}
    </div>
  );
}
