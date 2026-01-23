'use client';

import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui';
import { AddToCollectionModal } from './AddToCollectionModal';

interface AddToCollectionButtonProps {
  talentProfileId: string;
  variant?: 'button' | 'icon';
  size?: 'sm' | 'md';
}

export function AddToCollectionButton({
  talentProfileId,
  variant = 'button',
  size = 'md',
}: AddToCollectionButtonProps) {
  const [showModal, setShowModal] = useState(false);

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
          }}
          className="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
          aria-label="Add to collection"
        >
          <FolderPlus className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
        </button>

        {showModal && (
          <AddToCollectionModal
            talentProfileId={talentProfileId}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size={size}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <FolderPlus className="w-4 h-4 mr-2" />
        Add to Collection
      </Button>

      {showModal && (
        <AddToCollectionModal
          talentProfileId={talentProfileId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
