'use server';

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { validateFile, MAX_PHOTOS, IMAGE_VARIANTS, videoUrlSchema } from './validation';

// Base upload directory
const UPLOAD_DIR = 'public/uploads/talents';

// Ensure upload directory exists for user
async function ensureUploadDir(userId: string): Promise<string> {
  const userDir = path.join(process.cwd(), UPLOAD_DIR, userId);
  if (!existsSync(userDir)) {
    await mkdir(userDir, { recursive: true });
  }
  return userDir;
}

// Generate unique filename
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const uuid = randomUUID();
  return `${uuid}${ext}`;
}

// Process image with Sharp and save variants
async function processAndSaveImage(
  buffer: Buffer,
  userDir: string,
  filename: string
): Promise<{ thumbnail: string; card: string; full: string }> {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');

  // Generate all variants
  const variants = {
    thumbnail: `${nameWithoutExt}-thumb.webp`,
    card: `${nameWithoutExt}-card.webp`,
    full: `${nameWithoutExt}-full.webp`,
  };

  // Process thumbnail (square crop)
  await sharp(buffer)
    .resize(IMAGE_VARIANTS.thumbnail.width, IMAGE_VARIANTS.thumbnail.height, {
      fit: 'cover',
      position: 'center',
    })
    .webp({ quality: 80 })
    .toFile(path.join(userDir, variants.thumbnail));

  // Process card size (portrait crop)
  await sharp(buffer)
    .resize(IMAGE_VARIANTS.card.width, IMAGE_VARIANTS.card.height, {
      fit: 'cover',
      position: 'top', // Focus on face/top of image
    })
    .webp({ quality: 85 })
    .toFile(path.join(userDir, variants.card));

  // Process full size (contain within bounds)
  await sharp(buffer)
    .resize(IMAGE_VARIANTS.full.width, IMAGE_VARIANTS.full.height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 90 })
    .toFile(path.join(userDir, variants.full));

  return variants;
}

// Upload action result type
interface UploadResult {
  success: boolean;
  error?: string;
  photoUrl?: string;
}

// Upload a photo
export async function uploadPhoto(formData: FormData): Promise<UploadResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = session.user.id;

    // Get talent profile
    const profile = await prisma.talentProfile.findUnique({
      where: { userId },
      select: { id: true, photos: true },
    });

    if (!profile) {
      return { success: false, error: 'Talent profile not found' };
    }

    // Check photo limit
    if (profile.photos.length >= MAX_PHOTOS) {
      return {
        success: false,
        error: `Maximum ${MAX_PHOTOS} photos allowed`,
      };
    }

    // Get file from form data
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate image with Sharp (checks magic bytes)
    try {
      await sharp(buffer).metadata();
    } catch {
      return { success: false, error: 'Invalid image file' };
    }

    // Setup upload directory
    const userDir = await ensureUploadDir(userId);
    const filename = generateFilename(file.name);

    // Process and save variants
    const variants = await processAndSaveImage(buffer, userDir, filename);

    // URL for the card variant (used in UI)
    const photoUrl = `/uploads/talents/${userId}/${variants.card}`;

    // Update profile with new photo
    await prisma.talentProfile.update({
      where: { id: profile.id },
      data: {
        photos: [...profile.photos, photoUrl],
      },
    });

    revalidatePath('/dashboard/profile/media');
    revalidatePath('/dashboard/profile');

    return { success: true, photoUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload photo' };
  }
}

// Delete a photo
interface DeleteResult {
  success: boolean;
  error?: string;
}

export async function deletePhoto(photoUrl: string): Promise<DeleteResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = session.user.id;

    // Get talent profile
    const profile = await prisma.talentProfile.findUnique({
      where: { userId },
      select: { id: true, photos: true, photo: true },
    });

    if (!profile) {
      return { success: false, error: 'Talent profile not found' };
    }

    // Check if photo exists in profile
    if (!profile.photos.includes(photoUrl)) {
      return { success: false, error: 'Photo not found in profile' };
    }

    // Extract filename from URL to delete files
    const urlParts = photoUrl.split('/');
    const cardFilename = urlParts[urlParts.length - 1];
    const baseName = cardFilename.replace('-card.webp', '');

    const userDir = path.join(process.cwd(), UPLOAD_DIR, userId);

    // Delete all variants
    const variants = [`${baseName}-thumb.webp`, `${baseName}-card.webp`, `${baseName}-full.webp`];

    for (const variant of variants) {
      const filePath = path.join(userDir, variant);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }

    // Remove from photos array
    const updatedPhotos = profile.photos.filter((p) => p !== photoUrl);

    // If deleted photo was the primary photo, clear it
    const updateData: { photos: string[]; photo?: string | null } = {
      photos: updatedPhotos,
    };

    if (profile.photo === photoUrl) {
      // Set new primary to first remaining photo or null
      updateData.photo = updatedPhotos.length > 0 ? updatedPhotos[0] : null;
    }

    await prisma.talentProfile.update({
      where: { id: profile.id },
      data: updateData,
    });

    revalidatePath('/dashboard/profile/media');
    revalidatePath('/dashboard/profile');

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete photo' };
  }
}

// Set primary photo
export async function setPrimaryPhoto(photoUrl: string): Promise<DeleteResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = session.user.id;

    // Get talent profile
    const profile = await prisma.talentProfile.findUnique({
      where: { userId },
      select: { id: true, photos: true },
    });

    if (!profile) {
      return { success: false, error: 'Talent profile not found' };
    }

    // Check if photo exists in profile
    if (!profile.photos.includes(photoUrl)) {
      return { success: false, error: 'Photo not found in profile' };
    }

    // Update primary photo
    await prisma.talentProfile.update({
      where: { id: profile.id },
      data: { photo: photoUrl },
    });

    revalidatePath('/dashboard/profile/media');
    revalidatePath('/dashboard/profile');
    revalidatePath('/talents');

    return { success: true };
  } catch (error) {
    console.error('Set primary error:', error);
    return { success: false, error: 'Failed to set primary photo' };
  }
}

// Reorder photos
interface ReorderResult {
  success: boolean;
  error?: string;
}

export async function reorderPhotos(photoUrls: string[]): Promise<ReorderResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = session.user.id;

    // Get talent profile
    const profile = await prisma.talentProfile.findUnique({
      where: { userId },
      select: { id: true, photos: true },
    });

    if (!profile) {
      return { success: false, error: 'Talent profile not found' };
    }

    // Validate that all URLs exist in current photos
    const currentSet = new Set(profile.photos);
    const newSet = new Set(photoUrls);

    if (currentSet.size !== newSet.size || !profile.photos.every((p) => newSet.has(p))) {
      return { success: false, error: 'Invalid photo list' };
    }

    // Update photo order
    await prisma.talentProfile.update({
      where: { id: profile.id },
      data: { photos: photoUrls },
    });

    revalidatePath('/dashboard/profile/media');

    return { success: true };
  } catch (error) {
    console.error('Reorder error:', error);
    return { success: false, error: 'Failed to reorder photos' };
  }
}

// Add video URL
interface VideoResult {
  success: boolean;
  error?: string;
}

export async function addVideoUrl(url: string): Promise<VideoResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Validate URL
    const validation = videoUrlSchema.safeParse(url);
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    const userId = session.user.id;

    // Get talent profile
    const profile = await prisma.talentProfile.findUnique({
      where: { userId },
      select: { id: true, videoUrls: true },
    });

    if (!profile) {
      return { success: false, error: 'Talent profile not found' };
    }

    // Check limit
    if (profile.videoUrls.length >= 5) {
      return { success: false, error: 'Maximum 5 videos allowed' };
    }

    // Check for duplicate
    if (profile.videoUrls.includes(url)) {
      return { success: false, error: 'Video already added' };
    }

    // Add video URL
    await prisma.talentProfile.update({
      where: { id: profile.id },
      data: {
        videoUrls: [...profile.videoUrls, url],
      },
    });

    revalidatePath('/dashboard/profile/media');

    return { success: true };
  } catch (error) {
    console.error('Add video error:', error);
    return { success: false, error: 'Failed to add video' };
  }
}

// Remove video URL
export async function removeVideoUrl(url: string): Promise<VideoResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = session.user.id;

    // Get talent profile
    const profile = await prisma.talentProfile.findUnique({
      where: { userId },
      select: { id: true, videoUrls: true },
    });

    if (!profile) {
      return { success: false, error: 'Talent profile not found' };
    }

    // Check if URL exists
    if (!profile.videoUrls.includes(url)) {
      return { success: false, error: 'Video not found' };
    }

    // Remove video URL
    await prisma.talentProfile.update({
      where: { id: profile.id },
      data: {
        videoUrls: profile.videoUrls.filter((v) => v !== url),
      },
    });

    revalidatePath('/dashboard/profile/media');

    return { success: true };
  } catch (error) {
    console.error('Remove video error:', error);
    return { success: false, error: 'Failed to remove video' };
  }
}
