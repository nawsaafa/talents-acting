'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Pencil, Users } from 'lucide-react';
import { Button } from '@/components/ui';
import { CollectionTalentCard } from './CollectionTalentCard';
import { ShareCollectionModal } from './ShareCollectionModal';
import { removeTalentFromCollection } from '@/lib/collections/actions';
import { generateCSV, generateExportFilename } from '@/lib/collections/export';
import type { CollectionWithTalents } from '@/lib/collections/types';

interface CollectionDetailProps {
  collection: CollectionWithTalents;
  isOwner: boolean;
  onEdit?: () => void;
  onTalentRemoved?: () => void;
}

export function CollectionDetail({
  collection,
  isOwner,
  onEdit,
  onTalentRemoved,
}: CollectionDetailProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [removingTalentId, setRemovingTalentId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRemoveTalent = async (talentProfileId: string) => {
    setRemovingTalentId(talentProfileId);
    startTransition(async () => {
      const result = await removeTalentFromCollection(collection.id, talentProfileId);
      setRemovingTalentId(null);
      if (result.success) {
        onTalentRemoved?.();
      }
    });
  };

  const handleExport = () => {
    const csv = generateCSV(collection);
    const filename = generateExportFilename(collection.name);

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/collections"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Collections
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">{collection.name}</h1>
            {collection.description && (
              <p className="text-gray-600 mt-1">{collection.description}</p>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
              <Users className="w-4 h-4" />
              <span>
                {collection.talents.length} {collection.talents.length === 1 ? 'talent' : 'talents'}
              </span>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-2 shrink-0">
              {onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowShareModal(true)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={collection.talents.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Talents Grid */}
      {collection.talents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collection.talents.map((talent) => (
            <CollectionTalentCard
              key={talent.id}
              talent={talent}
              onRemove={isOwner ? handleRemoveTalent : undefined}
              isRemoving={removingTalentId === talent.talentProfileId || isPending}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No talents yet</h3>
          <p className="text-gray-600 mb-4">Add talents to this collection from their profiles</p>
          <Link href="/talents">
            <Button>Browse Talents</Button>
          </Link>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareCollectionModal
          collectionId={collection.id}
          collectionName={collection.name}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
