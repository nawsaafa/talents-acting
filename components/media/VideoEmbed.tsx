"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, ExternalLink, Play } from "lucide-react";
import { parseVideoUrl, formatVideoUrlForDisplay } from "@/lib/media/video-utils";
import { removeVideoUrl } from "@/lib/media/upload";
import Image from "next/image";

interface VideoEmbedProps {
  url: string;
  onRemoved?: () => void;
  showRemove?: boolean;
}

export function VideoEmbed({ url, onRemoved, showRemove = true }: VideoEmbedProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoInfo = parseVideoUrl(url);

  async function handleRemove() {
    setError(null);
    startTransition(async () => {
      const result = await removeVideoUrl(url);
      if (result.success) {
        setShowConfirm(false);
        onRemoved?.();
      } else {
        setError(result.error || "Failed to remove video");
      }
    });
  }

  // Platform-specific styling
  const platformColor =
    videoInfo.platform === "youtube" ? "bg-red-600" : "bg-blue-500";
  const platformLabel =
    videoInfo.platform === "youtube" ? "YouTube" : "Vimeo";

  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-100">
      {/* Video container */}
      <div className="relative aspect-video">
        {isPlaying && videoInfo.embedUrl ? (
          // Embedded video player
          <iframe
            src={`${videoInfo.embedUrl}?autoplay=1`}
            title="Video player"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Thumbnail with play button
          <>
            {videoInfo.thumbnailUrl ? (
              <Image
                src={videoInfo.thumbnailUrl}
                alt="Video thumbnail"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <Play className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {/* Play button overlay */}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110">
                <Play className="h-8 w-8 text-gray-900" />
              </div>
            </button>

            {/* Platform badge */}
            <div
              className={`absolute top-2 left-2 rounded px-2 py-1 text-xs font-medium text-white ${platformColor}`}
            >
              {platformLabel}
            </div>
          </>
        )}
      </div>

      {/* Video info and actions */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline truncate"
          >
            {formatVideoUrlForDisplay(url)}
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        </div>

        {showRemove && (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            className="flex-shrink-0 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Delete confirmation overlay */}
      {showConfirm && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4">
          <p className="mb-4 text-center text-sm text-white">
            Remove this video?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isPending}
              className="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRemove}
              disabled={isPending}
              className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Remove
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
