"use client";

import { useRouter } from "next/navigation";
import { Camera, Video } from "lucide-react";
import { PhotoUploader } from "./PhotoUploader";
import { PhotoGrid } from "./PhotoGrid";
import { VideoEmbed } from "./VideoEmbed";
import { VideoUrlInput } from "./VideoUrlInput";

interface MediaGalleryProps {
  photos: string[];
  videoUrls: string[];
  primaryPhoto: string | null;
}

export function MediaGallery({
  photos,
  videoUrls,
  primaryPhoto,
}: MediaGalleryProps) {
  const router = useRouter();

  function handleRefresh() {
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Photos Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Camera className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
          <span className="text-sm text-gray-500">({photos.length}/10)</span>
        </div>

        <div className="space-y-6">
          {/* Upload area */}
          <PhotoUploader
            currentCount={photos.length}
            onUploaded={handleRefresh}
          />

          {/* Photo grid */}
          <PhotoGrid
            photos={photos}
            primaryPhoto={primaryPhoto}
            onPhotosChanged={handleRefresh}
          />
        </div>
      </section>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Videos Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Video className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Videos</h2>
          <span className="text-sm text-gray-500">({videoUrls.length}/5)</span>
        </div>

        <div className="space-y-6">
          {/* Add video input */}
          <VideoUrlInput
            currentCount={videoUrls.length}
            maxVideos={5}
            onAdded={handleRefresh}
          />

          {/* Video list */}
          {videoUrls.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videoUrls.map((url) => (
                <VideoEmbed
                  key={url}
                  url={url}
                  onRemoved={handleRefresh}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-8 text-gray-500">
              <Video className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm">No videos added yet</p>
              <p className="text-xs">Add YouTube or Vimeo URLs above</p>
            </div>
          )}
        </div>
      </section>

      {/* Tips section */}
      <section className="rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-blue-900">Tips</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>
            <strong>Photos:</strong> Upload up to 10 photos. The primary photo
            will appear on your talent card.
          </li>
          <li>
            <strong>Drag to reorder:</strong> Use the grip handle to drag photos
            into your preferred order.
          </li>
          <li>
            <strong>Videos:</strong> Add links to your showreel or demo videos
            from YouTube or Vimeo.
          </li>
          <li>
            <strong>Best practices:</strong> Include a clear headshot, full body
            shot, and examples of your work.
          </li>
        </ul>
      </section>
    </div>
  );
}
