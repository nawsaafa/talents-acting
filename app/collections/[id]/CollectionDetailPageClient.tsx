'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CollectionDetail } from '@/components/collections';
import { Modal, Button, Input, Textarea } from '@/components/ui';
import { updateCollection } from '@/lib/collections/actions';
import type { CollectionWithTalents } from '@/lib/collections/types';

interface CollectionDetailPageClientProps {
  collection: CollectionWithTalents;
  isOwner: boolean;
}

export function CollectionDetailPageClient({
  collection: initialCollection,
  isOwner,
}: CollectionDetailPageClientProps) {
  const router = useRouter();
  const [collection, setCollection] = useState(initialCollection);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const [editDescription, setEditDescription] = useState(collection.description || '');
  const [editError, setEditError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = () => {
    setEditName(collection.name);
    setEditDescription(collection.description || '');
    setEditError(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    setEditError(null);
    startTransition(async () => {
      const result = await updateCollection(collection.id, {
        name: editName,
        description: editDescription || undefined,
      });

      if (result.success && result.collection) {
        setCollection((prev) => ({
          ...prev,
          name: result.collection!.name,
          description: result.collection!.description,
        }));
        setShowEditModal(false);
      } else {
        setEditError(result.error || 'Failed to update collection');
      }
    });
  };

  const handleTalentRemoved = () => {
    router.refresh();
  };

  return (
    <>
      <CollectionDetail
        collection={collection}
        isOwner={isOwner}
        onEdit={isOwner ? handleEdit : undefined}
        onTalentRemoved={handleTalentRemoved}
      />

      {/* Edit Modal */}
      {showEditModal && (
        <Modal isOpen onClose={() => setShowEditModal(false)} title="Edit Collection" size="md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <Input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={100}
                  disabled={isPending}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description (optional)
                </label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                  disabled={isPending}
                />
              </div>

              {editError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{editError}</div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !editName.trim()}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
