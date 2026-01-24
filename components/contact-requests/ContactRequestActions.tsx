'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

interface ContactRequestActionsProps {
  requestId: string;
  onRespond: (requestId: string, approve: boolean, reason?: string) => void;
  isResponding?: boolean;
}

export function ContactRequestActions({
  requestId,
  onRespond,
  isResponding = false,
}: ContactRequestActionsProps) {
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleApprove = () => {
    onRespond(requestId, true);
  };

  const handleDecline = () => {
    if (!showDeclineForm) {
      setShowDeclineForm(true);
      return;
    }
    onRespond(requestId, false, declineReason.trim() || undefined);
  };

  const handleCancelDecline = () => {
    setShowDeclineForm(false);
    setDeclineReason('');
  };

  if (showDeclineForm) {
    return (
      <div className="p-4 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
        <Textarea
          label="Reason for declining (optional)"
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
          placeholder="Let the requester know why you're declining..."
          rows={3}
          maxLength={500}
          disabled={isResponding}
          helperText="This will be shared with the requester"
        />
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleCancelDecline}
            disabled={isResponding}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            variant="danger"
            onClick={handleDecline}
            disabled={isResponding}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {isResponding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Declining...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Confirm Decline
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
      <p className="text-sm text-[var(--color-neutral-600)] mb-4">
        Approving will share your contact information with the requester.
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleDecline}
          disabled={isResponding}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Decline
        </Button>
        <Button
          onClick={handleApprove}
          disabled={isResponding}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isResponding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Approve
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
