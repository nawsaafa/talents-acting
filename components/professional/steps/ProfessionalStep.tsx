'use client';

import { useFormContext } from 'react-hook-form';
import { ProfessionalStepData } from '@/lib/professional/validation';

interface ProfessionalStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProfessionalStep({ onNext, onBack }: ProfessionalStepProps) {
  const {
    register,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<{ professional: ProfessionalStepData }>();

  const reasonForAccess = watch('professional.reasonForAccess') || '';
  const characterCount = reasonForAccess.length;

  const handleNext = async () => {
    const isValid = await trigger('professional');
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Professional Details</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Tell us about your company and why you need access to the talent database.
        </p>
      </div>

      <div className="space-y-4">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-zinc-700">
            Company Name <span className="text-zinc-400">(Optional)</span>
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            {...register('professional.company')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.professional?.company
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Your company or agency"
          />
          {errors.professional?.company && (
            <p className="mt-1 text-sm text-red-600">{errors.professional.company.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
            Phone Number <span className="text-zinc-400">(Optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register('professional.phone')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.professional?.phone
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="+212 XXX XXX XXX"
          />
          {errors.professional?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.professional.phone.message}</p>
          )}
        </div>

        {/* Reason for Access */}
        <div>
          <label htmlFor="reasonForAccess" className="block text-sm font-medium text-zinc-700">
            Reason for Access <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reasonForAccess"
            rows={4}
            {...register('professional.reasonForAccess')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.professional?.reasonForAccess
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Please explain why you need access to the talent database. Include details about your current projects or casting needs."
          />
          <div className="mt-1 flex justify-between">
            {errors.professional?.reasonForAccess ? (
              <p className="text-sm text-red-600">{errors.professional.reasonForAccess.message}</p>
            ) : (
              <p className="text-xs text-zinc-500">Minimum 20 characters required</p>
            )}
            <span className={`text-xs ${characterCount < 20 ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {characterCount}/1000
            </span>
          </div>
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
