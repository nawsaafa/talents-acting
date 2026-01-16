'use client';

import { useState, useTransition } from 'react';
import { Plus, Loader2, Youtube, Video, AlertCircle } from 'lucide-react';
import { isValidVideoUrl, detectPlatform } from '@/lib/media/video-utils';
import { addVideoUrl } from '@/lib/media/upload';

interface VideoUrlInputProps {
  onAdded?: () => void;
  currentCount?: number;
  maxVideos?: number;
}

export function VideoUrlInput({ onAdded, currentCount = 0, maxVideos = 5 }: VideoUrlInputProps) {
  const [url, setUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isAtLimit = currentCount >= maxVideos;
  const platform = url ? detectPlatform(url) : null;
  const isValid = url ? isValidVideoUrl(url) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidVideoUrl(url)) {
      setError('Only YouTube and Vimeo URLs are supported');
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await addVideoUrl(url.trim());
      if (result.success) {
        setUrl('');
        onAdded?.();
      } else {
        setError(result.error || 'Failed to add video');
      }
    });
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value);
    setError(null);
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Add Video</h3>
        <span className="text-sm text-gray-500">
          {currentCount}/{maxVideos} videos
        </span>
      </div>

      {isAtLimit ? (
        <div className="flex items-center gap-2 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
          <AlertCircle className="h-4 w-4" />
          Maximum number of videos reached
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="Paste YouTube or Vimeo URL..."
                disabled={isPending}
                className={`w-full rounded-md border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:opacity-50 ${
                  error
                    ? 'border-red-300'
                    : isValid === true
                      ? 'border-green-300'
                      : 'border-gray-300'
                }`}
              />

              {/* Platform indicator */}
              {platform && platform !== 'unknown' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {platform === 'youtube' ? (
                    <Youtube className="h-4 w-4 text-red-600" />
                  ) : (
                    <Video className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending || !url.trim()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add
                </>
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}

          {/* Help text */}
          <p className="mt-2 text-xs text-gray-500">Supported: YouTube and Vimeo URLs</p>
        </form>
      )}
    </div>
  );
}
