'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Star, Trash2, Loader2 } from 'lucide-react';
import { deletePhoto, setPrimaryPhoto } from '@/lib/media/upload';

interface PhotoCardProps {
  photoUrl: string;
  isPrimary: boolean;
  onDeleted?: () => void;
  onPrimarySet?: () => void;
}

export function PhotoCard({ photoUrl, isPrimary, onDeleted, onPrimarySet }: PhotoCardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deletePhoto(photoUrl);
      if (result.success) {
        setShowConfirm(false);
        onDeleted?.();
      } else {
        setError(result.error || 'Failed to delete');
      }
    });
  }

  async function handleSetPrimary() {
    if (isPrimary) return;
    setError(null);
    startTransition(async () => {
      const result = await setPrimaryPhoto(photoUrl);
      if (result.success) {
        onPrimarySet?.();
      } else {
        setError(result.error || 'Failed to set as primary');
      }
    });
  }

  return (
    <div className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
      {/* Photo */}
      <Image
        src={photoUrl}
        alt="Profile photo"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover"
      />

      {/* Primary badge */}
      {isPrimary && (
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
          <Star className="h-3 w-3 fill-current" />
          Primary
        </div>
      )}

      {/* Overlay with actions */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex w-full gap-2 p-3">
          {/* Set as primary button */}
          {!isPrimary && (
            <button
              onClick={handleSetPrimary}
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-white disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Star className="h-4 w-4" />
                  Set Primary
                </>
              )}
            </button>
          )}

          {/* Delete button */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="flex items-center justify-center rounded-md bg-red-500/90 p-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
          <p className="mb-4 text-center text-sm text-white">Delete this photo?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 px-2 py-1 text-xs text-white">
          {error}
        </div>
      )}
    </div>
  );
}
