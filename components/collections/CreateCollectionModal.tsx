'use client';

import { useState, useTransition } from 'react';
import { Modal, Button, Input, Textarea } from '@/components/ui';
import { createCollection } from '@/lib/collections/actions';

interface CreateCollectionModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateCollectionModal({ onClose, onCreated }: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Collection name is required');
      return;
    }

    startTransition(async () => {
      const result = await createCollection(name, description || undefined);

      if (result.success) {
        onCreated?.();
        onClose();
      } else {
        setError(result.error || 'Failed to create collection');
      }
    });
  };

  return (
    <Modal isOpen onClose={onClose} title="Create Collection" size="md">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Collection Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Project Alpha Cast"
              maxLength={100}
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this collection..."
              rows={3}
              maxLength={500}
              disabled={isPending}
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !name.trim()}>
            {isPending ? 'Creating...' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
