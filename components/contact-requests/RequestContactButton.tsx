'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Loader2, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ContactRequestForm } from './ContactRequestForm';
import { canCreateRequest, hasPendingRequestTo } from '@/lib/contact-requests/actions';

interface RequestContactButtonProps {
  talentProfileId: string;
  talentName: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function RequestContactButton({
  talentProfileId,
  talentName,
  variant = 'outline',
  size = 'md',
}: RequestContactButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canCreate, setCanCreate] = useState<{ canCreate: boolean; reason?: string } | null>(null);
  const [hasPending, setHasPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadEligibility = useCallback(async () => {
    setIsLoading(true);
    try {
      const [canCreateResult, hasPendingResult] = await Promise.all([
        canCreateRequest(),
        hasPendingRequestTo(talentProfileId),
      ]);
      setCanCreate(canCreateResult);
      setHasPending(hasPendingResult);
    } catch {
      setCanCreate({ canCreate: false, reason: 'Unable to check eligibility' });
    } finally {
      setIsLoading(false);
    }
  }, [talentProfileId]);

  useEffect(() => {
    loadEligibility();
  }, [loadEligibility]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setShowSuccess(true);
    setHasPending(true);
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Don't render if still loading initial state
  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Show success state temporarily
  if (showSuccess) {
    return (
      <Button variant="outline" size={size} disabled className="text-green-600 border-green-600">
        <Check className="w-4 h-4 mr-2" />
        Request Sent!
      </Button>
    );
  }

  // Already has pending request
  if (hasPending) {
    return (
      <Button variant="outline" size={size} disabled className="text-yellow-600 border-yellow-600">
        <Clock className="w-4 h-4 mr-2" />
        Request Pending
      </Button>
    );
  }

  // Cannot create requests (not eligible)
  if (!canCreate?.canCreate) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        title={canCreate?.reason || 'Not eligible to request contact'}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Request Contact
      </Button>
    );
  }

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setIsModalOpen(true)}>
        <UserPlus className="w-4 h-4 mr-2" />
        Request Contact
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="" size="lg">
        <ContactRequestForm
          talentProfileId={talentProfileId}
          talentName={talentName}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
