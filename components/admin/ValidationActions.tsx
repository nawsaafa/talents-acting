"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { approveProfile, rejectProfile } from "@/lib/admin/actions";
import type { ProfileType } from "@/lib/admin/validation";

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
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setIsApproving(true);
    setError(null);

    const result = await approveProfile({ profileId, profileType });

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Failed to approve");
    }

    setIsApproving(false);
  }

  async function handleReject() {
    if (rejectReason.length < 10) {
      setError("Rejection reason must be at least 10 characters");
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
      setRejectReason("");
      router.refresh();
    } else {
      setError(result.error || "Failed to reject");
    }

    setIsRejecting(false);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleApprove}
          isLoading={isApproving}
          disabled={isRejecting}
        >
          {showLabels ? "Approve" : ""}
          {!showLabels && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowRejectModal(true)}
          disabled={isApproving || isRejecting}
        >
          {showLabels ? "Reject" : ""}
          {!showLabels && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[var(--radius-lg)] shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
              Reject Profile
            </h3>
            <p className="text-[var(--color-neutral-600)] mb-4">
              Please provide a reason for rejecting this profile. This will be
              visible to the user.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason (min 10 characters)..."
              className="w-full px-3 py-2 border border-[var(--color-neutral-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
              rows={4}
            />
            <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
              {rejectReason.length}/500 characters
            </p>
            {error && (
              <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setError(null);
                }}
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                isLoading={isRejecting}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
