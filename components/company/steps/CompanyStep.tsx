'use client';

import { useFormContext } from 'react-hook-form';
import { CompanyStepData, INDUSTRY_OPTIONS } from '@/lib/company/validation';

interface CompanyStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function CompanyStep({ onNext, onBack }: CompanyStepProps) {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<{ company: CompanyStepData }>();

  const handleNext = async () => {
    const isValid = await trigger('company');
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Company Information</h2>
        <p className="mt-1 text-sm text-zinc-600">Tell us about your company or organization.</p>
      </div>

      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-zinc-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            {...register('company.companyName')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company?.companyName
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Your Company Name"
          />
          {errors.company?.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.company.companyName.message}</p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-zinc-700">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            id="industry"
            {...register('company.industry')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company?.industry
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
          >
            <option value="">Select your industry</option>
            {INDUSTRY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.company?.industry && (
            <p className="mt-1 text-sm text-red-600">{errors.company.industry.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
            Company Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('company.description')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company?.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Brief description of your company and what you do..."
          />
          {errors.company?.description && (
            <p className="mt-1 text-sm text-red-600">{errors.company.description.message}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-zinc-700">
            Website
          </label>
          <input
            id="website"
            type="url"
            {...register('company.website')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company?.website
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="https://www.yourcompany.com"
          />
          {errors.company?.website && (
            <p className="mt-1 text-sm text-red-600">{errors.company.website.message}</p>
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
