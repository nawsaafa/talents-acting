'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveProfile, rejectProfile } from '@/lib/admin/actions';
import type { ProfileType } from '@/lib/admin/validation';

interface ValidationActionsProps {
  profileId: string;
  profileType: ProfileType;
  showLabels?: boolean;
}

export function ValidationActions({
  profileId,
  profileType,
  showLabels = true,
}: ValidationActionsProps) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setIsApproving(true);
    setError(null);

    const result = await approveProfile({ profileId, profileType });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || 'Failed to approve');
    }

    setIsApproving(false);
  }

  async function handleReject() {
    if (rejectReason.length < 10) {
      setError('Rejection reason must be at least 10 characters');
      return;
    }

    setIsRejecting(true);
    setError(null);

    const result = await rejectProfile({
      profileId,
      profileType,
      reason: rejectReason,
    });

    if (result.success) {
      setShowRejectModal(false);
      setRejectReason('');
      router.refresh();
    } else {
      setError(result.error || 'Failed to reject');
    }

    setIsRejecting(false);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleApprove}
          disabled={isApproving || isRejecting}
          className={`
            inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl
            bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
            hover:from-emerald-400 hover:to-emerald-500
            shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
          `}
        >
          {isApproving ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {showLabels && 'Approve'}
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={isApproving || isRejecting}
          className={`
            inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl
            bg-gradient-to-r from-red-500 to-red-600 text-white
            hover:from-red-400 hover:to-red-500
            shadow-lg shadow-red-500/25 hover:shadow-red-500/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {showLabels && 'Reject'}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
          {error}
        </p>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowRejectModal(false);
              setRejectReason('');
              setError(null);
            }}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/30 shadow-2xl animate-scale-in">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500" />

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-semibold text-[var(--color-text-primary)]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Reject Profile
                </h3>
              </div>

              <p className="text-[var(--color-text-muted)] mb-4">
                Please provide a reason for rejecting this profile. This will be visible to the
                user.
              </p>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason (min 10 characters)..."
                className="w-full px-4 py-3 bg-[var(--color-black)]/50 border border-[var(--color-surface-light)]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)]/50 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] resize-none transition-all duration-300"
                rows={4}
              />

              <div className="flex items-center justify-between mt-2 mb-4">
                <p className="text-sm text-[var(--color-text-muted)]">
                  <span
                    className={
                      rejectReason.length >= 10 ? 'text-emerald-400' : 'text-[var(--color-gold)]'
                    }
                  >
                    {rejectReason.length}
                  </span>
                  /500 characters
                </p>
                {rejectReason.length >= 10 && (
                  <span className="text-xs text-emerald-400">Ready to submit</span>
                )}
              </div>

              {error && (
                <p className="mb-4 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setError(null);
                  }}
                  disabled={isRejecting}
                  className="px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-surface-light)]/20 hover:bg-[var(--color-surface-light)]/40 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isRejecting || rejectReason.length < 10}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl
                    bg-gradient-to-r from-red-500 to-red-600 text-white
                    hover:from-red-400 hover:to-red-500
                    shadow-lg shadow-red-500/25 hover:shadow-red-500/40
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-300
                  `}
                >
                  {isRejecting ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
