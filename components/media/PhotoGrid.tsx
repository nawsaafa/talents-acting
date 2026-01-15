"use client";

import { useState, useTransition } from "react";
import { GripVertical, Loader2 } from "lucide-react";
import { PhotoCard } from "./PhotoCard";
import { reorderPhotos } from "@/lib/media/upload";

interface PhotoGridProps {
  photos: string[];
  primaryPhoto: string | null;
  onPhotosChanged?: () => void;
}

export function PhotoGrid({
  photos,
  primaryPhoto,
  onPhotosChanged,
}: PhotoGridProps) {
  const [isPending, startTransition] = useTransition();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [localPhotos, setLocalPhotos] = useState(photos);
  const [error, setError] = useState<string | null>(null);

  // Update local photos when prop changes
  if (photos.join(",") !== localPhotos.join(",")) {
    setLocalPhotos(photos);
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDragLeave() {
    setDragOverIndex(null);
  }

  async function handleDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDragOverIndex(null);
      return;
    }

    // Reorder locally for immediate feedback
    const newPhotos = [...localPhotos];
    const [draggedPhoto] = newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(targetIndex, 0, draggedPhoto);
    setLocalPhotos(newPhotos);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Persist to server
    setError(null);
    startTransition(async () => {
      const result = await reorderPhotos(newPhotos);
      if (result.success) {
        onPhotosChanged?.();
      } else {
        // Revert on error
        setLocalPhotos(photos);
        setError(result.error || "Failed to reorder");
      }
    });
  }

  if (localPhotos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 text-gray-500">
        <p className="text-sm">No photos uploaded yet</p>
        <p className="mt-1 text-xs">Upload photos above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Reorder indicator */}
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving new order...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {localPhotos.map((photoUrl, index) => (
          <div
            key={photoUrl}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative transition-all ${
              draggedIndex === index
                ? "opacity-50 scale-95"
                : dragOverIndex === index
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : ""
            }`}
          >
            {/* Drag handle */}
            <div className="absolute -top-2 -left-2 z-10 cursor-grab rounded-full bg-white p-1 shadow-md active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>

            {/* Photo card */}
            <PhotoCard
              photoUrl={photoUrl}
              isPrimary={photoUrl === primaryPhoto}
              onDeleted={onPhotosChanged}
              onPrimarySet={onPhotosChanged}
            />

            {/* Position indicator */}
            <div className="absolute -bottom-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-500">
        Drag photos to reorder. The first photo will be shown on your profile card if no primary is set.
      </p>
    </div>
  );
}
