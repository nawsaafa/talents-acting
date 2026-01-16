'use client';

import { useCallback, useRef } from 'react';
import { X } from 'lucide-react';

interface RangeFilterProps {
  label: string;
  minValue?: number;
  maxValue?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
}

export function RangeFilter({
  label,
  minValue,
  maxValue,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  unit,
  min,
  max,
  step = 1,
  onChange,
}: RangeFilterProps) {
  // Refs for debouncing - only accessed in event handlers
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  // Convert props to display values
  const displayMin = minValue !== undefined ? String(minValue) : '';
  const displayMax = maxValue !== undefined ? String(maxValue) : '';

  const debouncedUpdate = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const minVal = minInputRef.current?.value || '';
      const maxVal = maxInputRef.current?.value || '';
      const parsedMin = minVal ? parseFloat(minVal) : undefined;
      const parsedMax = maxVal ? parseFloat(maxVal) : undefined;
      onChange(parsedMin, parsedMax);
    }, 300);
  }, [onChange]);

  const handleChange = useCallback(() => {
    debouncedUpdate();
  }, [debouncedUpdate]);

  const handleClear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (minInputRef.current) {
      minInputRef.current.value = '';
    }
    if (maxInputRef.current) {
      maxInputRef.current.value = '';
    }
    onChange(undefined, undefined);
  }, [onChange]);

  const hasValue = displayMin !== '' || displayMax !== '';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-700">{label}</label>
        {hasValue && (
          <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={minInputRef}
            type="number"
            key={`min-${displayMin}`}
            defaultValue={displayMin}
            onChange={handleChange}
            placeholder={minPlaceholder}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {unit && displayMin && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {unit}
            </span>
          )}
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative flex-1">
          <input
            ref={maxInputRef}
            type="number"
            key={`max-${displayMax}`}
            defaultValue={displayMax}
            onChange={handleChange}
            placeholder={maxPlaceholder}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {unit && displayMax && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
