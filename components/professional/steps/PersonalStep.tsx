'use client';

import { useFormContext } from 'react-hook-form';
import { PersonalStepData, PROFESSION_OPTIONS } from '@/lib/professional/validation';

interface PersonalStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PersonalStep({ onNext, onBack }: PersonalStepProps) {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<{ personal: PersonalStepData }>();

  const handleNext = async () => {
    const isValid = await trigger('personal');
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Personal Information</h2>
        <p className="mt-1 text-sm text-zinc-600">Tell us about yourself and your profession.</p>
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            {...register('personal.firstName')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.personal?.firstName
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Your first name"
          />
          {errors.personal?.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.personal.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            {...register('personal.lastName')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.personal?.lastName
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Your last name"
          />
          {errors.personal?.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.personal.lastName.message}</p>
          )}
        </div>

        {/* Profession */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-zinc-700">
            Profession <span className="text-red-500">*</span>
          </label>
          <select
            id="profession"
            {...register('personal.profession')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.personal?.profession
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
          >
            <option value="">Select your profession</option>
            {PROFESSION_OPTIONS.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
          {errors.personal?.profession && (
            <p className="mt-1 text-sm text-red-600">{errors.personal.profession.message}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
