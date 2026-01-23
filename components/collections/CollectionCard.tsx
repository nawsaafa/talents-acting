'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FolderOpen, Users, MoreVertical, Pencil, Trash2, Share2 } from 'lucide-react';
import { Card } from '@/components/ui';
import { useState } from 'react';
import type { CollectionPreview } from '@/lib/collections/types';

interface CollectionCardProps {
  collection: CollectionPreview;
  onEdit?: (collection: CollectionPreview) => void;
  onDelete?: (collection: CollectionPreview) => void;
  onShare?: (collection: CollectionPreview) => void;
}

export function CollectionCard({ collection, onEdit, onDelete, onShare }: CollectionCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    action();
  };

  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="group relative hover:shadow-lg transition-shadow duration-200 h-full">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {collection.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>
                    {collection.talentCount} {collection.talentCount === 1 ? 'talent' : 'talents'}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu */}
            {(onEdit || onDelete || onShare) && (
              <div className="relative">
                <button
                  onClick={handleMenuClick}
                  className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Collection options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
                      {onEdit && (
                        <button
                          onClick={handleAction(() => onEdit(collection))}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                      {onShare && (
                        <button
                          onClick={handleAction(() => onShare(collection))}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={handleAction(() => onDelete(collection))}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {collection.description && (
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">{collection.description}</p>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t text-xs text-gray-400">
            Updated {formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true })}
          </div>
        </div>
      </Card>
    </Link>
  );
}
