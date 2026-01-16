'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';

interface PhotoUploadProps {
  currentPhoto?: string | null;
  onPhotoChange: (url: string | null) => void;
  disabled?: boolean;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function PhotoUpload({ currentPhoto, onPhotoChange, disabled = false }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Please select a JPEG, PNG, or WebP image');
        return;
      }

      // Validate file size
      if (file.size > MAX_SIZE) {
        setError('File size must be under 5MB');
        return;
      }

      // Show local preview immediately
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Upload to server
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed');
        }

        // Update with server URL
        setPreview(result.url);
        onPhotoChange(result.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        // Revert to previous photo on error
        setPreview(currentPhoto || null);
      } finally {
        setIsUploading(false);
        URL.revokeObjectURL(localPreview);
      }
    },
    [currentPhoto, onPhotoChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setPreview(null);
    onPhotoChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Profile Photo</label>

      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400 cursor-pointer'
        }`}
        onDrop={!disabled ? handleDrop : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onClick={!disabled && !isUploading ? handleClick : undefined}
      >
        {preview ? (
          <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto">
            <Image
              src={preview}
              alt="Profile preview"
              fill
              className="object-cover rounded-lg"
              sizes="200px"
            />
            {!disabled && !isUploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 px-4 text-center">
            {isUploading ? (
              <Loader2 className="w-12 h-12 mx-auto text-gray-400 animate-spin" />
            ) : (
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
            )}
            <p className="mt-2 text-sm text-gray-600">
              {isUploading ? 'Uploading...' : 'Click or drag to upload your headshot'}
            </p>
            <p className="mt-1 text-xs text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {preview && !isUploading && !disabled && (
        <Button type="button" variant="outline" size="sm" onClick={handleClick}>
          Change Photo
        </Button>
      )}
    </div>
  );
}
