'use client';

import { useState, useEffect, useTransition } from 'react';
import { FolderPlus, Check, Plus } from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
import {
  getMyCollections,
  getMyCollectionsWithTalent,
  addTalentToCollection,
  createCollection,
} from '@/lib/collections/actions';
import type { CollectionPreview } from '@/lib/collections/types';

interface AddToCollectionModalProps {
  talentProfileId: string;
  onClose: () => void;
  onAdded?: () => void;
}

export function AddToCollectionModal({
  talentProfileId,
  onClose,
  onAdded,
}: AddToCollectionModalProps) {
  const [collections, setCollections] = useState<CollectionPreview[]>([]);
  const [existingCollectionIds, setExistingCollectionIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [addingTo, setAddingTo] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [collectionList, existing] = await Promise.all([
          getMyCollections(),
          getMyCollectionsWithTalent(talentProfileId),
        ]);
        setCollections(collectionList);
        setExistingCollectionIds(new Set(existing));
      } catch {
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [talentProfileId]);

  const handleAddToCollection = (collectionId: string) => {
    if (existingCollectionIds.has(collectionId)) return;

    setAddingTo(collectionId);
    setError(null);

    startTransition(async () => {
      const result = await addTalentToCollection(collectionId, talentProfileId);

      if (result.success) {
        setExistingCollectionIds((prev) => new Set([...prev, collectionId]));
        onAdded?.();
      } else {
        setError(result.error || 'Failed to add to collection');
      }
      setAddingTo(null);
    });
  };

  const handleCreateAndAdd = () => {
    if (!newName.trim()) {
      setError('Collection name is required');
      return;
    }

    setError(null);
    startTransition(async () => {
      const createResult = await createCollection(newName);

      if (createResult.success && createResult.collection) {
        const addResult = await addTalentToCollection(createResult.collection.id, talentProfileId);

        if (addResult.success) {
          setCollections((prev) => [createResult.collection!, ...prev]);
          setExistingCollectionIds((prev) => new Set([...prev, createResult.collection!.id]));
          setNewName('');
          setShowCreate(false);
          onAdded?.();
        } else {
          setError(addResult.error || 'Failed to add to collection');
        }
      } else {
        setError(createResult.error || 'Failed to create collection');
      }
    });
  };

  return (
    <Modal isOpen onClose={onClose} title="Add to Collection" size="md">
      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading collections...</div>
      ) : (
        <div>
          {/* Create New Section */}
          {showCreate ? (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New collection name"
                maxLength={100}
                disabled={isPending}
              />
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleCreateAndAdd}
                  disabled={isPending || !newName.trim()}
                >
                  {isPending ? 'Creating...' : 'Create & Add'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowCreate(false);
                    setNewName('');
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center gap-3 p-3 mb-4 text-left rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">Create new collection</span>
            </button>
          )}

          {/* Collections List */}
          {collections.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {collections.map((collection) => {
                const isInCollection = existingCollectionIds.has(collection.id);
                const isAdding = addingTo === collection.id;

                return (
                  <button
                    key={collection.id}
                    onClick={() => handleAddToCollection(collection.id)}
                    disabled={isInCollection || isPending}
                    className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
                      isInCollection
                        ? 'bg-green-50 cursor-default'
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isInCollection ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      {isInCollection ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <FolderPlus
                          className={`w-5 h-5 ${isAdding ? 'text-blue-600 animate-pulse' : 'text-gray-600'}`}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{collection.name}</div>
                      <div className="text-sm text-gray-500">
                        {collection.talentCount}{' '}
                        {collection.talentCount === 1 ? 'talent' : 'talents'}
                      </div>
                    </div>
                    {isInCollection && (
                      <span className="text-sm text-green-600 font-medium">Added</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No collections yet. Create one to get started!
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
          )}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
