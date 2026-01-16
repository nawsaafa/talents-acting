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
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={disabled || isLoading}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
          ${isActive ? 'bg-[var(--color-success)]' : 'bg-[var(--color-neutral-300)]'}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="switch"
        aria-checked={isActive}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${isActive ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      <span
        className={`text-sm ${isActive ? 'text-[var(--color-success)]' : 'text-[var(--color-neutral-500)]'}`}
      >
        {isLoading ? '...' : isActive ? 'Active' : 'Inactive'}
      </span>
      {error && <span className="text-xs text-[var(--color-error)]">{error}</span>}
    </div>
  );
}
