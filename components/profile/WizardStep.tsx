'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { TalentProfile } from '@prisma/client';
import type { WizardStepId } from '@/lib/profile/wizard-validation';

// Context for sharing wizard state with step components
interface WizardContextValue {
  formData: Partial<TalentProfile>;
  updateField: (field: keyof TalentProfile, value: unknown) => void;
  updateArrayField: (field: keyof TalentProfile, value: string, action: 'add' | 'remove') => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizardContext() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a WizardStep');
  }
  return context;
}

interface WizardStepProps {
  children: ReactNode;
  stepId: WizardStepId;
  title: string;
  description?: string;
  formData: Partial<TalentProfile>;
  updateField: (field: keyof TalentProfile, value: unknown) => void;
  updateArrayField: (field: keyof TalentProfile, value: string, action: 'add' | 'remove') => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

export function WizardStep({
  children,
  stepId,
  title,
  description,
  formData,
  updateField,
  updateArrayField,
  errors,
  isSubmitting,
}: WizardStepProps) {
  return (
    <WizardContext.Provider
      value={{ formData, updateField, updateArrayField, errors, isSubmitting }}
    >
      <div
        role="tabpanel"
        id={`wizard-panel-${stepId}`}
        aria-labelledby={`wizard-tab-${stepId}`}
        className="animate-in fade-in duration-200"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </WizardContext.Provider>
  );
}

// Reusable form field components for steps

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, name, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextInputProps {
  name: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  disabled?: boolean;
  maxLength?: number;
}

export function TextInput({
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  maxLength,
}: TextInputProps) {
  return (
    <input
      type={type}
      id={name}
      name={name}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  );
}

interface NumberInputProps {
  name: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function NumberInput({
  name,
  value,
  onChange,
  placeholder,
  min,
  max,
  disabled = false,
}: NumberInputProps) {
  return (
    <input
      type="number"
      id={name}
      name={name}
      value={value ?? ''}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === '' ? null : parseInt(val, 10));
      }}
      placeholder={placeholder}
      min={min}
      max={max}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  );
}

interface SelectInputProps {
  name: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectInput({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
}: SelectInputProps) {
  return (
    <select
      id={name}
      name={name}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface CheckboxInputProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function CheckboxInput({
  name,
  checked,
  onChange,
  label,
  disabled = false,
}: CheckboxInputProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

interface TextareaInputProps {
  name: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
}

export function TextareaInput({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  disabled = false,
}: TextareaInputProps) {
  const currentLength = (value ?? '').length;

  return (
    <div className="relative">
      <textarea
        id={name}
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
      />
      {maxLength && (
        <span className="absolute bottom-2 right-2 text-xs text-gray-400">
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  );
}
