'use client';

import { useState } from 'react';
import { X, Plus, Video, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { PhotoUpload } from '@/components/talents/PhotoUpload';
import { useWizardContext, FormField, TextInput, CheckboxInput } from '../WizardStep';
import type { TalentProfile } from '@prisma/client';

interface UrlListInputProps {
  label: string;
  name: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  icon: 'video' | 'image';
  maxItems?: number;
}

function UrlListInput({
  label,
  name,
  values,
  onAdd,
  onRemove,
  placeholder = 'Enter URL',
  disabled = false,
  error,
  icon,
  maxItems = 10,
}: UrlListInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAdd = () => {
    if (!inputValue.trim()) return;

    if (!isValidUrl(inputValue.trim())) {
      setInputError('Please enter a valid URL');
      return;
    }

    if (values.includes(inputValue.trim())) {
      setInputError('This URL is already added');
      return;
    }

    if (values.length >= maxItems) {
      setInputError(`Maximum ${maxItems} items allowed`);
      return;
    }

    setInputError(null);
    onAdd(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const Icon = icon === 'video' ? Video : ImageIcon;

  return (
    <FormField label={label} name={name} error={error}>
      <div className="space-y-3">
        {/* Input row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setInputError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || values.length >= maxItems}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled || !inputValue.trim() || values.length >= maxItems}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {inputError && <p className="text-sm text-red-600">{inputError}</p>}

        {/* URL list */}
        {values.length > 0 && (
          <ul className="space-y-2">
            {values.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
              >
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-sm text-blue-600 hover:text-blue-800 truncate"
                >
                  {url}
                </a>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  disabled={disabled}
                  className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                  aria-label={`Remove ${url}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-gray-500">
          {values.length}/{maxItems} added
        </p>
      </div>
    </FormField>
  );
}

export function MediaStep() {
  const { formData, updateField, updateArrayField, errors, isSubmitting } = useWizardContext();

  const handlePhotoChange = (url: string | null) => {
    updateField('photo' as keyof TalentProfile, url);
  };

  const handleArrayAdd = (field: keyof TalentProfile, value: string) => {
    updateArrayField(field, value, 'add');
  };

  const handleArrayRemove = (field: keyof TalentProfile, value: string) => {
    updateArrayField(field, value, 'remove');
  };

  return (
    <div className="space-y-8">
      {/* Primary Photo */}
      <div>
        <PhotoUpload
          currentPhoto={formData.photo}
          onPhotoChange={handlePhotoChange}
          disabled={isSubmitting}
        />
        {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
      </div>

      {/* Additional Photos */}
      <UrlListInput
        label="Additional Photos"
        name="photos"
        values={(formData.photos as string[]) ?? []}
        onAdd={(v) => handleArrayAdd('photos' as keyof TalentProfile, v)}
        onRemove={(v) => handleArrayRemove('photos' as keyof TalentProfile, v)}
        placeholder="https://example.com/photo.jpg"
        disabled={isSubmitting}
        error={errors.photos}
        icon="image"
        maxItems={10}
      />

      {/* Video URLs */}
      <UrlListInput
        label="Video Links"
        name="videoUrls"
        values={(formData.videoUrls as string[]) ?? []}
        onAdd={(v) => handleArrayAdd('videoUrls' as keyof TalentProfile, v)}
        onRemove={(v) => handleArrayRemove('videoUrls' as keyof TalentProfile, v)}
        placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
        disabled={isSubmitting}
        error={errors.videoUrls}
        icon="video"
        maxItems={10}
      />

      {/* Showreel */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Professional Showreel</h3>

        <div className="space-y-4">
          <CheckboxInput
            name="hasShowreel"
            checked={formData.hasShowreel ?? false}
            onChange={(v) => updateField('hasShowreel' as keyof TalentProfile, v)}
            label="I have a professional showreel"
            disabled={isSubmitting}
          />

          {formData.hasShowreel && (
            <FormField label="Showreel URL" name="showreel" error={errors.showreel}>
              <TextInput
                name="showreel"
                value={formData.showreel}
                onChange={(v) => updateField('showreel' as keyof TalentProfile, v)}
                type="url"
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                disabled={isSubmitting}
              />
            </FormField>
          )}
        </div>
      </div>

      {/* Presentation Video */}
      <FormField
        label="Presentation Video"
        name="presentationVideo"
        error={errors.presentationVideo}
      >
        <TextInput
          name="presentationVideo"
          value={formData.presentationVideo}
          onChange={(v) => updateField('presentationVideo' as keyof TalentProfile, v)}
          type="url"
          placeholder="A short video introducing yourself"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500">
          A brief video where you introduce yourself to casting directors
        </p>
      </FormField>
    </div>
  );
}
