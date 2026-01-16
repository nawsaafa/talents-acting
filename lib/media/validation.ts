import { z } from 'zod';

// Maximum file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Maximum number of photos per talent
export const MAX_PHOTOS = 10;

// Allowed image MIME types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

// Allowed image extensions
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

// Image dimensions for variants
export const IMAGE_VARIANTS = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 400, height: 600 },
  full: { width: 1200, height: 1800 },
} as const;

// File validation schema
export const fileValidationSchema = z.object({
  name: z.string().min(1, 'Filename is required'),
  size: z.number().max(MAX_FILE_SIZE, `File size must be less than 5MB`),
  type: z.enum(ALLOWED_IMAGE_TYPES, {
    message: 'Only JPEG, PNG, and WebP images are allowed',
  }),
});

// Validate file extension from filename
export function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

// Check if extension is allowed
export function isAllowedExtension(filename: string): boolean {
  const ext = getFileExtension(filename);
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
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

// Video URL validation schema
export const videoUrlSchema = z
  .string()
  .url('Please enter a valid URL')
  .refine(
    (url) => {
      const isYouTube = YOUTUBE_PATTERNS.some((pattern) => pattern.test(url));
      const isVimeo = VIMEO_PATTERNS.some((pattern) => pattern.test(url));
      return isYouTube || isVimeo;
    },
    { message: 'Only YouTube and Vimeo URLs are supported' }
  );

// Photo order update schema
export const photoOrderSchema = z.object({
  photos: z.array(z.string().url()).max(MAX_PHOTOS),
});

// Primary photo selection schema
export const primaryPhotoSchema = z.object({
  photoUrl: z.string().url('Invalid photo URL'),
});

// Photo deletion schema
export const deletePhotoSchema = z.object({
  photoUrl: z.string().url('Invalid photo URL'),
});

// Video URLs update schema
export const videoUrlsSchema = z.object({
  videoUrls: z.array(videoUrlSchema).max(5, 'Maximum 5 videos allowed'),
});

// Validate file before upload
export function validateFile(file: File): {
  success: boolean;
  error?: string;
} {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum of 5MB`,
    };
  }

  // Check MIME type
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return {
      success: false,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    };
  }

  // Check extension
  if (!isAllowedExtension(file.name)) {
    return {
      success: false,
      error: 'Invalid file extension. Allowed: jpg, jpeg, png, webp',
    };
  }

  return { success: true };
}

// Type exports
export type FileValidation = z.infer<typeof fileValidationSchema>;
export type VideoUrl = z.infer<typeof videoUrlSchema>;
export type PhotoOrder = z.infer<typeof photoOrderSchema>;
