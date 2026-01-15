// Video platform types
export type VideoPlatform = "youtube" | "vimeo" | "unknown";

// Video info extracted from URL
export interface VideoInfo {
  platform: VideoPlatform;
  videoId: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  originalUrl: string;
}

// YouTube URL patterns
const YOUTUBE_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
];

// Vimeo URL patterns
const VIMEO_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
  /(?:https?:\/\/)?player\.vimeo\.com\/video\/(\d+)/,
];

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Extract Vimeo video ID from URL
 */
export function extractVimeoId(url: string): string | null {
  for (const pattern of VIMEO_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Detect video platform from URL
 */
export function detectPlatform(url: string): VideoPlatform {
  if (extractYouTubeId(url)) return "youtube";
  if (extractVimeoId(url)) return "vimeo";
  return "unknown";
}

/**
 * Generate embed URL for a video
 */
export function getEmbedUrl(url: string): string | null {
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  return null;
}

/**
 * Generate thumbnail URL for a video
 */
export function getThumbnailUrl(url: string): string | null {
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    // YouTube provides several thumbnail qualities
    // mqdefault = 320x180, hqdefault = 480x360
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    // Vimeo thumbnails require API call, return placeholder
    // In production, use Vimeo oEmbed API to get actual thumbnail
    return null;
  }

  return null;
}

/**
 * Parse video URL and extract all info
 */
export function parseVideoUrl(url: string): VideoInfo {
  const platform = detectPlatform(url);

  if (platform === "youtube") {
    const videoId = extractYouTubeId(url);
    return {
      platform,
      videoId,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
      thumbnailUrl: videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : null,
      originalUrl: url,
    };
  }

  if (platform === "vimeo") {
    const videoId = extractVimeoId(url);
    return {
      platform,
      videoId,
      embedUrl: videoId ? `https://player.vimeo.com/video/${videoId}` : null,
      thumbnailUrl: null, // Vimeo requires API call for thumbnails
      originalUrl: url,
    };
  }

  return {
    platform: "unknown",
    videoId: null,
    embedUrl: null,
    thumbnailUrl: null,
    originalUrl: url,
  };
}

/**
 * Validate if URL is a supported video platform
 */
export function isValidVideoUrl(url: string): boolean {
  return detectPlatform(url) !== "unknown";
}

/**
 * Format video URL for display (clean version)
 */
export function formatVideoUrlForDisplay(url: string): string {
  const info = parseVideoUrl(url);

  if (info.platform === "youtube" && info.videoId) {
    return `youtube.com/watch?v=${info.videoId}`;
  }

  if (info.platform === "vimeo" && info.videoId) {
    return `vimeo.com/${info.videoId}`;
  }

  // Return original URL truncated if too long
  if (url.length > 50) {
    return url.substring(0, 47) + "...";
  }
  return url;
}
