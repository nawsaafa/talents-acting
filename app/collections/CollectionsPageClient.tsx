'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CollectionList, ShareCollectionModal } from '@/components/collections';
import { deleteCollection, updateCollection } from '@/lib/collections/actions';
import { Modal, Button, Input, Textarea } from '@/components/ui';
import type { CollectionPreview } from '@/lib/collections/types';

interface CollectionsPageClientProps {
  initialCollections: CollectionPreview[];
}

export function CollectionsPageClient({ initialCollections }: CollectionsPageClientProps) {
  const router = useRouter();
  const [collections, setCollections] = useState(initialCollections);
  const [editingCollection, setEditingCollection] = useState<CollectionPreview | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<CollectionPreview | null>(null);
  const [sharingCollection, setSharingCollection] = useState<CollectionPreview | null>(null);
  const [isPending, startTransition] = useTransition();

  // Edit modal state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const handleEdit = (collection: CollectionPreview) => {
    setEditingCollection(collection);
    setEditName(collection.name);
    setEditDescription(collection.description || '');
    setEditError(null);
  };

  const handleSaveEdit = () => {
    if (!editingCollection || !editName.trim()) return;

    setEditError(null);
    startTransition(async () => {
      const result = await updateCollection(editingCollection.id, {
        name: editName,
        description: editDescription || undefined,
      });

      if (result.success && result.collection) {
        setCollections((prev) =>
          prev.map((c) => (c.id === editingCollection.id ? result.collection! : c))
        );
        setEditingCollection(null);
      } else {
        setEditError(result.error || 'Failed to update collection');
      }
    });
  };

  const handleDelete = (collection: CollectionPreview) => {
    setDeletingCollection(collection);
  };

  const handleConfirmDelete = () => {
    if (!deletingCollection) return;

    startTransition(async () => {
      const result = await deleteCollection(deletingCollection.id);

      if (result.success) {
        setCollections((prev) => prev.filter((c) => c.id !== deletingCollection.id));
        setDeletingCollection(null);
      }
    });
  };

  const handleShare = (collection: CollectionPreview) => {
    setSharingCollection(collection);
  };

  const handleCollectionCreated = () => {
    router.refresh();
  };

  return (
    <>
      <CollectionList
        collections={collections}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShare={handleShare}
        onCollectionCreated={handleCollectionCreated}
      />

      {/* Edit Modal */}
      {editingCollection && (
        <Modal isOpen onClose={() => setEditingCollection(null)} title="Edit Collection" size="md">
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
                onClick={() => setEditingCollection(null)}
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

      {/* Delete Confirmation Modal */}
      {deletingCollection && (
        <Modal
          isOpen
          onClose={() => setDeletingCollection(null)}
          title="Delete Collection"
          size="sm"
        >
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete &ldquo;{deletingCollection.name}&rdquo;? This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeletingCollection(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal>
      )}

      {/* Share Modal */}
      {sharingCollection && (
        <ShareCollectionModal
          collectionId={sharingCollection.id}
          collectionName={sharingCollection.name}
          onClose={() => setSharingCollection(null)}
        />
      )}
    </>
  );
}
