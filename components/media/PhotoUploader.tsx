"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, Loader2, AlertCircle, ImagePlus } from "lucide-react";
import { validateFile, MAX_FILE_SIZE, MAX_PHOTOS } from "@/lib/media/validation";
import { uploadPhoto } from "@/lib/media/upload";

interface PhotoUploaderProps {
  currentCount: number;
  onUploaded?: () => void;
}

export function PhotoUploader({ currentCount, onUploaded }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAtLimit = currentCount >= MAX_PHOTOS;
  const remainingSlots = MAX_PHOTOS - currentCount;

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAtLimit) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  async function processFile(file: File) {
    // Validate file
    const validation = validateFile(file);
    if (!validation.success) {
      setError(validation.error || "Invalid file");
      return false;
    }

    setProcessingFile(file.name);
    setUploadProgress(0);

    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    // Simulate progress (actual upload progress would need XHR)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const result = await uploadPhoto(formData);

      clearInterval(progressInterval);

      if (result.success) {
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(null);
          setProcessingFile(null);
          onUploaded?.();
        }, 500);
        return true;
      } else {
        setError(result.error || "Upload failed");
        setUploadProgress(null);
        setProcessingFile(null);
        return false;
      }
    } catch {
      clearInterval(progressInterval);
      setError("Upload failed. Please try again.");
      setUploadProgress(null);
      setProcessingFile(null);
      return false;
    }
  }

  async function handleFiles(files: FileList) {
    setError(null);

    const fileArray = Array.from(files);
    const filesToProcess = fileArray.slice(0, remainingSlots);

    if (fileArray.length > remainingSlots) {
      setError(
        `Only ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"} can be added`
      );
    }

    // Process files sequentially
    startTransition(async () => {
      for (const file of filesToProcess) {
        await processFile(file);
      }
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isAtLimit) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  }

  function handleClick() {
    if (!isAtLimit && !isPending) {
      fileInputRef.current?.click();
    }
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isAtLimit
            ? "cursor-not-allowed border-gray-200 bg-gray-50"
            : isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileInput}
          disabled={isAtLimit || isPending}
          className="hidden"
        />

        {/* Upload state */}
        {isPending && processingFile ? (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="mt-3 text-sm font-medium text-gray-900">
              Uploading {processingFile}...
            </p>
            {uploadProgress !== null && (
              <div className="mt-3 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        ) : isAtLimit ? (
          <div className="flex flex-col items-center text-center text-gray-400">
            <AlertCircle className="h-10 w-10" />
            <p className="mt-3 text-sm font-medium">Maximum photos reached</p>
            <p className="mt-1 text-xs">
              Delete a photo to upload a new one
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            {isDragging ? (
              <>
                <ImagePlus className="h-10 w-10 text-blue-500" />
                <p className="mt-3 text-sm font-medium text-blue-600">
                  Drop photos here
                </p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="mt-3 text-sm font-medium text-gray-900">
                  Drop photos here or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  JPEG, PNG, or WebP up to {MAX_FILE_SIZE / 1024 / 1024}MB
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {remainingSlots} of {MAX_PHOTOS} slots available
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
