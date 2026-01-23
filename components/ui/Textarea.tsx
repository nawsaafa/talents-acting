'use client';

import { TextareaHTMLAttributes, forwardRef, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[var(--color-error)] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          className={`
            w-full px-3 py-2
            border rounded-[var(--radius-md)]
            text-[var(--color-neutral-900)]
            placeholder:text-[var(--color-neutral-400)]
            transition-colors duration-[var(--transition-fast)]
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
            resize-vertical min-h-[80px]
            ${
              hasError
                ? 'border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]'
                : 'border-[var(--color-neutral-300)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]'
            }
            ${className}
          `.trim()}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
