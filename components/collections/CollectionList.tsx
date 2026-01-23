'use client';

import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui';
import { CollectionCard } from './CollectionCard';
import { CreateCollectionModal } from './CreateCollectionModal';
import type { CollectionPreview } from '@/lib/collections/types';

interface CollectionListProps {
  collections: CollectionPreview[];
  onEdit?: (collection: CollectionPreview) => void;
  onDelete?: (collection: CollectionPreview) => void;
  onShare?: (collection: CollectionPreview) => void;
  onCollectionCreated?: () => void;
}

export function CollectionList({
  collections,
  onEdit,
  onDelete,
  onShare,
  onCollectionCreated,
}: CollectionListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreated = () => {
    setShowCreateModal(false);
    onCollectionCreated?.();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Collections</h1>
          <p className="text-gray-600 mt-1">Organize talents into project-based collections</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <FolderPlus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={onEdit}
              onDelete={onDelete}
              onShare={onShare}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first collection to start organizing talents
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Collection
          </Button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
