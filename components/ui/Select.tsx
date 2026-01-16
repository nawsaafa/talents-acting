'use client';

import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            className={`
              w-full px-3 py-2 pr-10
              border rounded-[var(--radius-md)]
              text-[var(--color-neutral-900)]
              bg-white
              appearance-none
              transition-colors duration-[var(--transition-fast)]
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
              ${
                hasError
                  ? 'border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]'
                  : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]'
              }
              ${className}
            `.trim()}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-neutral-400)]"
            size={20}
          />
        </div>
        {hasError && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-error)]">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p id={helperId} className="mt-1.5 text-sm text-[var(--color-neutral-500)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
