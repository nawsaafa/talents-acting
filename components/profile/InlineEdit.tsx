'use client';

import { useState, useRef, useEffect, useTransition, useCallback } from 'react';
import { Check, X, Pencil, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineEditProps {
  value: string | null | undefined;
  onSave: (value: string) => Promise<{ success: boolean; error?: string }>;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  maxLength?: number;
  validate?: (value: string) => string | null;
  emptyText?: string;
  disabled?: boolean;
}

export function InlineEdit({
  value,
  onSave,
  placeholder = 'Click to edit',
  className,
  inputClassName,
  multiline = false,
  maxLength,
  validate,
  emptyText = 'Not set',
  disabled = false,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Only use local state while editing; when not editing, derive from prop
  const [localEditValue, setLocalEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // The edit value is local state when editing, otherwise derived from prop
  const editValue = isEditing ? localEditValue : (value ?? '');

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = useCallback(() => {
    if (disabled) return;
    setLocalEditValue(value ?? '');
    setIsEditing(true);
    setError(null);
  }, [disabled, value]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setError(null);
  }, []);

  const handleSave = useCallback(async () => {
    // Run validation if provided
    if (validate) {
      const validationError = validate(localEditValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError(null);

    startTransition(async () => {
      try {
        const result = await onSave(localEditValue);
        if (result.success) {
          setIsEditing(false);
        } else {
          setError(result.error || 'Failed to save');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save');
      }
    });
  }, [localEditValue, onSave, validate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Enter' && e.metaKey && multiline) {
        e.preventDefault();
        handleSave();
      }
    },
    [handleCancel, handleSave, multiline]
  );

  // Display mode
  if (!isEditing) {
    const displayValue = value?.trim() || emptyText;
    const isEmpty = !value?.trim();

    return (
      <button
        type="button"
        onClick={handleEdit}
        disabled={disabled}
        className={cn(
          'group inline-flex items-center gap-2 text-left rounded px-2 py-1 -mx-2 transition-colors',
          !disabled && 'hover:bg-gray-100',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <span className={cn(isEmpty && 'text-gray-400 italic', !isEmpty && 'text-gray-900')}>
          {displayValue}
        </span>
        {!disabled && (
          <Pencil
            className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  // Edit mode
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-start gap-2">
        <InputComponent
          ref={inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setLocalEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={isPending}
          rows={multiline ? 3 : undefined}
          className={cn(
            'flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            error && 'border-red-300 focus:ring-red-500',
            isPending && 'bg-gray-100',
            multiline && 'resize-none',
            inputClassName
          )}
        />

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
            title="Save (Enter)"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Cancel (Escape)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Character count */}
      {maxLength && (
        <p className="text-xs text-gray-400 text-right">
          {editValue.length}/{maxLength}
        </p>
      )}

      {/* Keyboard hint for multiline */}
      {multiline && (
        <p className="text-xs text-gray-400">Press Cmd+Enter to save, Escape to cancel</p>
      )}
    </div>
  );
}

// Specialized inline edit for numbers
interface InlineEditNumberProps {
  value: number | null | undefined;
  onSave: (value: number | null) => Promise<{ success: boolean; error?: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  suffix?: string;
  className?: string;
  disabled?: boolean;
}

export function InlineEditNumber({
  value,
  onSave,
  placeholder = 'Enter a number',
  min,
  max,
  suffix = '',
  className,
  disabled = false,
}: InlineEditNumberProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Only use local state while editing
  const [localEditValue, setLocalEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // The edit value is local state when editing, otherwise derived from prop
  const editValue = isEditing ? localEditValue : (value?.toString() ?? '');

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = useCallback(() => {
    if (disabled) return;
    setLocalEditValue(value?.toString() ?? '');
    setIsEditing(true);
    setError(null);
  }, [disabled, value]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setError(null);
  }, []);

  const handleSave = useCallback(async () => {
    const numValue = localEditValue.trim() === '' ? null : parseFloat(localEditValue);

    if (numValue !== null) {
      if (isNaN(numValue)) {
        setError('Please enter a valid number');
        return;
      }
      if (min !== undefined && numValue < min) {
        setError(`Value must be at least ${min}`);
        return;
      }
      if (max !== undefined && numValue > max) {
        setError(`Value must be at most ${max}`);
        return;
      }
    }

    setError(null);

    startTransition(async () => {
      try {
        const result = await onSave(numValue);
        if (result.success) {
          setIsEditing(false);
        } else {
          setError(result.error || 'Failed to save');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save');
      }
    });
  }, [localEditValue, max, min, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    },
    [handleCancel, handleSave]
  );

  if (!isEditing) {
    const displayValue = value !== null && value !== undefined ? `${value}${suffix}` : 'Not set';

    return (
      <button
        type="button"
        onClick={handleEdit}
        disabled={disabled}
        className={cn(
          'group inline-flex items-center gap-2 text-left rounded px-2 py-1 -mx-2 transition-colors',
          !disabled && 'hover:bg-gray-100',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <span
          className={cn(
            value === null || value === undefined ? 'text-gray-400 italic' : 'text-gray-900'
          )}
        >
          {displayValue}
        </span>
        {!disabled && (
          <Pencil
            className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="number"
          value={editValue}
          onChange={(e) => setLocalEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={isPending}
          className={cn(
            'w-32 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            error && 'border-red-300 focus:ring-red-500',
            isPending && 'bg-gray-100'
          )}
        />
        {suffix && <span className="text-gray-500">{suffix}</span>}

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
          title="Save"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
