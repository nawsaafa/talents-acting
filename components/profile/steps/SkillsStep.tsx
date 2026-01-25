'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useWizardContext, FormField } from '../WizardStep';
import type { TalentProfile } from '@prisma/client';

// Import comprehensive skill options from seed-options
import {
  LANGUAGES,
  ACCENTS,
  ATHLETIC_SKILLS,
  MUSICAL_INSTRUMENTS,
  PERFORMANCE_SKILLS,
  DANCE_STYLES,
} from '@/lib/talents/seed-options';

// Convert readonly arrays to mutable string arrays for suggestions
const LANGUAGE_SUGGESTIONS = [...LANGUAGES];
const ACCENT_SUGGESTIONS = [...ACCENTS];
const ATHLETIC_SUGGESTIONS = [...ATHLETIC_SKILLS];
const INSTRUMENT_SUGGESTIONS = [...MUSICAL_INSTRUMENTS];
const PERFORMANCE_SUGGESTIONS = [...PERFORMANCE_SKILLS];
const DANCE_SUGGESTIONS = [...DANCE_STYLES];

interface TagInputProps {
  label: string;
  name: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

function TagInput({
  label,
  name,
  values,
  onAdd,
  onRemove,
  suggestions,
  placeholder = 'Type and press Enter',
  disabled = false,
  error,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !values.includes(s)
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim() && !values.includes(inputValue.trim())) {
        onAdd(inputValue.trim());
        setInputValue('');
      }
    }
  };

  const handleAddSuggestion = (suggestion: string) => {
    onAdd(suggestion);
    setInputValue('');
    setShowSuggestions(false);
  };

  return (
    <FormField label={label} name={name} error={error}>
      <div className="space-y-2">
        {/* Input with suggestions */}
        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => {
                if (inputValue.trim() && !values.includes(inputValue.trim())) {
                  onAdd(inputValue.trim());
                  setInputValue('');
                }
              }}
              disabled={disabled || !inputValue.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredSuggestions.slice(0, 8).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddSuggestion(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags display */}
        {values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {value}
                <button
                  type="button"
                  onClick={() => onRemove(value)}
                  disabled={disabled}
                  className="hover:text-blue-600 disabled:cursor-not-allowed"
                  aria-label={`Remove ${value}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </FormField>
  );
}

export function SkillsStep() {
  const { formData, updateArrayField, errors, isSubmitting } = useWizardContext();

  const handleAdd = (field: keyof TalentProfile, value: string) => {
    updateArrayField(field, value, 'add');
  };

  const handleRemove = (field: keyof TalentProfile, value: string) => {
    updateArrayField(field, value, 'remove');
  };

  return (
    <div className="space-y-8">
      {/* Languages */}
      <TagInput
        label="Languages"
        name="languages"
        values={(formData.languages as string[]) ?? []}
        onAdd={(v) => handleAdd('languages' as keyof TalentProfile, v)}
        onRemove={(v) => handleRemove('languages' as keyof TalentProfile, v)}
        suggestions={LANGUAGE_SUGGESTIONS}
        placeholder="Add a language"
        disabled={isSubmitting}
        error={errors.languages}
      />

      {/* Accents */}
      <TagInput
        label="Accents"
        name="accents"
        values={(formData.accents as string[]) ?? []}
        onAdd={(v) => handleAdd('accents' as keyof TalentProfile, v)}
        onRemove={(v) => handleRemove('accents' as keyof TalentProfile, v)}
        suggestions={ACCENT_SUGGESTIONS}
        placeholder="Add an accent"
        disabled={isSubmitting}
        error={errors.accents}
      />

      {/* Athletic Skills */}
      <TagInput
        label="Athletic Skills"
        name="athleticSkills"
        values={(formData.athleticSkills as string[]) ?? []}
        onAdd={(v) => handleAdd('athleticSkills' as keyof TalentProfile, v)}
        onRemove={(v) => handleRemove('athleticSkills' as keyof TalentProfile, v)}
        suggestions={ATHLETIC_SUGGESTIONS}
        placeholder="Add an athletic skill"
        disabled={isSubmitting}
        error={errors.athleticSkills}
      />

      {/* Musical Instruments */}
      <TagInput
        label="Musical Instruments"
        name="musicalInstruments"
        values={(formData.musicalInstruments as string[]) ?? []}
        onAdd={(v) => handleAdd('musicalInstruments' as keyof TalentProfile, v)}
        onRemove={(v) => handleRemove('musicalInstruments' as keyof TalentProfile, v)}
        suggestions={INSTRUMENT_SUGGESTIONS}
        placeholder="Add an instrument"
        disabled={isSubmitting}
        error={errors.musicalInstruments}
      />

      {/* Performance Skills */}
      <TagInput
        label="Performance Skills"
        name="performanceSkills"
        values={(formData.performanceSkills as string[]) ?? []}
        onAdd={(v) => handleAdd('performanceSkills' as keyof TalentProfile, v)}
        onRemove={(v) => handleRemove('performanceSkills' as keyof TalentProfile, v)}
        suggestions={PERFORMANCE_SUGGESTIONS}
        placeholder="Add a performance skill"
        disabled={isSubmitting}
        error={errors.performanceSkills}
      />

      {/* Dance Styles */}
      <TagInput
        label="Dance Styles"
        name="danceStyles"
        values={(formData.danceStyles as string[]) ?? []}
        onAdd={(v) => handleAdd('danceStyles' as keyof TalentProfile, v)}
        onRemove={(v) => handleRemove('danceStyles' as keyof TalentProfile, v)}
        suggestions={DANCE_SUGGESTIONS}
        placeholder="Add a dance style"
        disabled={isSubmitting}
        error={errors.danceStyles}
      />
    </div>
  );
}
